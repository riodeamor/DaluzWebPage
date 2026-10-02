import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getServiceClient } from "@/lib/auth/helpers";
import { OrdersRepository } from "@/lib/repositories/orders.repository";
import { SystemRepository } from "@/lib/repositories/system.repository";
import { CheckoutService } from "@/lib/services/checkout.service";
import { checkoutPayloadSchema } from "@/lib/validations/checkout.schema";
import {
  parseBankTransferConfig,
  BANK_TRANSFER_CONFIG_KEYS,
} from "@/lib/payments/bank-transfer-config";
import { quoteCart } from "@/lib/commerce/quote";
import { QuoteError } from "@/lib/commerce/pricing";
import { createHash, randomUUID } from "node:crypto";
import {
  CheckoutCatalogError,
} from "@/lib/payments/checkout-catalog";
import { EmailNotificationService } from "@/lib/email/notifications";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  let createdOrderId: string | null = null;
  let db: ReturnType<typeof getServiceClient> | null = null;
  try {
    // Authentication
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.replace("Bearer ", "");

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {},
          remove(name: string, options: any) {},
        },
      },
    );

    let user = null;

    if (bearerToken) {
      const { data: { user: tokenUser } } = await supabase.auth.getUser(bearerToken);
      user = tokenUser;
    }

    if (!user) {
      const { data: { user: cookieUser } } = await supabase.auth.getUser();
      user = cookieUser;
    }

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required. Please log in and try again." },
        { status: 401 },
      );
    }

    // Validate request body with Zod
    const body = await req.json();
    const parsed = checkoutPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 },
      );
    }

    const { items: requestedItems, customerInfo, paymentMethod, couponCode, checkoutRequestId, expectedTotal } = parsed.data;
    customerInfo.postalCode = customerInfo.postalCode || customerInfo.zipCode;

    logger.info("Checkout request received", {
      source: "checkout",
      itemsCount: requestedItems.length,
    });

    // === Instantiate service chain (service client bypasses RLS) ===
    const serviceClient = getServiceClient();
    db = serviceClient;
    const requestId = checkoutRequestId || randomUUID();
    const fingerprint = createHash("sha256").update(JSON.stringify({ requestedItems, customerInfo, paymentMethod, couponCode, expectedTotal })).digest("hex");
    const { data: existing, error: existingError } = await serviceClient.from("orders").select("id,checkout_fingerprint,checkout_ready,status,payment_method,mercadopago_preference_id").eq("user_id", user.id).eq("checkout_request_id", requestId).maybeSingle();
    if (existingError) throw existingError;
    if (existing) {
      if (existing.checkout_fingerprint !== fingerprint) return NextResponse.json({ error: "Este intento corresponde a otro carrito." }, { status: 409 });
      if (existing.status === "failed" || existing.status === "cancelled") return NextResponse.json({ error: "El intento anterior no está disponible. Volvé a iniciar la compra.", needsNewRequest: true }, { status: 409 });
      if (!existing.checkout_ready && !existing.mercadopago_preference_id) return NextResponse.json({ error: "La compra sigue procesándose. Intentá nuevamente en unos segundos." }, { status: 409 });
      if (existing.payment_method === "bank_transfer") return NextResponse.json({ method: "bank_transfer", redirectUrl: `/checkout/transferencia/${existing.id}` });
      return NextResponse.json({ method: "mercadopago", id: existing.mercadopago_preference_id });
    }
    const { items, coupon, quote } = await quoteCart(serviceClient, { items: requestedItems, postalCode: customerInfo.postalCode, couponCode, paymentMethod });
    if (quote.total === null || quote.shipping === null) throw new QuoteError("Ingresá el código postal para calcular el envío.");
    if (quote.total <= 0) throw new QuoteError("El total de la compra debe ser mayor a cero.");
    if (expectedTotal !== undefined && expectedTotal !== quote.total) throw new QuoteError("El total cambió. Revisá el cálculo actualizado antes de continuar.");
    const totals = { subtotal: quote.subtotal, discount: quote.discount, shipping: quote.shipping, total: quote.total };
    const ordersRepo = new OrdersRepository(serviceClient);
    const checkoutService = new CheckoutService(ordersRepo);
    const metadata = { coupon_id: coupon?.id ?? null, coupon_code: coupon?.code ?? null, coupon_discount_amount: quote.couponDiscount, transfer_discount_amount: quote.transferDiscount, shipping_zone_key: quote.region, shipping_carrier_name: quote.carrierName, checkout_request_id: requestId, checkout_fingerprint: fingerprint };
    const reserveCoupon = async (orderId: string) => {
      if (!coupon) return;
      const { error } = await serviceClient.rpc("reserve_order_coupon", { p_order_id: orderId, p_coupon_id: coupon.id, p_updated_at: coupon.updated_at });
      if (error) throw new QuoteError("El cupón cambió o agotó sus usos. Volvé a aplicarlo.");
    };
    const ready = async (orderId: string) => {
      const { error } = await serviceClient.from("orders").update({ checkout_ready: true }).eq("id", orderId);
      if (error) throw error;
    };

    if (paymentMethod === "bank_transfer") {
      const systemRepo = new SystemRepository(serviceClient);

      // Sin datos bancarios cargados no se puede cobrar por transferencia.
      const configRows = await systemRepo.getConfigs([...BANK_TRANSFER_CONFIG_KEYS]);
      const bank = parseBankTransferConfig(configRows);
      if (!bank) {
        return NextResponse.json(
          { error: "La transferencia bancaria no esta disponible en este momento." },
          { status: 503 },
        );
      }

      const order = await checkoutService.createOrder(
        user.id,
        customerInfo,
        items,
        "bank_transfer",
        totals,
        metadata,
      );
      createdOrderId = order.id;
      await checkoutService.createOrderItems(order.id, items);
      await reserveCoupon(order.id);
      await ready(order.id);

      // Un fallo de mail no puede romper la compra: la pantalla de
      // instrucciones es la fuente de verdad, el mail es respaldo.
      try {
        const fullOrder = await ordersRepo.findByIdWithItems(order.id);
        if (fullOrder) {
          await EmailNotificationService.sendBankTransferInstructions(
            fullOrder as never,
            bank,
          );
        }
      } catch (mailError) {
        logger.error(
          "Failed to send bank transfer instructions",
          mailError instanceof Error ? mailError : undefined,
          { source: "checkout" },
        );
      }

      return NextResponse.json({
        method: "bank_transfer",
        redirectUrl: `/checkout/transferencia/${order.id}`,
      });
    }

    // === Business Logic via Service ===
    const order = await checkoutService.createOrder(user.id, customerInfo, items, "mercadopago", totals, metadata);
    createdOrderId = order.id;
    await checkoutService.createOrderItems(order.id, items);
    await reserveCoupon(order.id);

    let preferenceCreated = false;
    try {
      const result = await checkoutService.createMercadoPagoPreference(order, items, customerInfo);
      preferenceCreated = true;
      await ready(order.id);
      return NextResponse.json({
        method: "mercadopago",
        id: result.preferenceId,
        init_point: result.initPoint,
      });
    } catch (mpError: unknown) {
      const error = mpError as Error & { status?: number; response?: unknown };
      logger.error("MercadoPago preference creation error", error, { source: "checkout" });

      const errorMessage = error?.message || "Error creating MercadoPago preference";

      // Rollback: mark order as failed
      if (!preferenceCreated) await checkoutService.markOrderFailed(order.id, errorMessage);

      const errorStatus = error?.status || 500;
      return NextResponse.json(
        {
          needsNewRequest: !preferenceCreated,
          error: "Failed to create payment preference",
          details: errorMessage,
        },
        { status: errorStatus >= 400 && errorStatus < 600 ? errorStatus : 500 },
      );
    }
  } catch (error) {
    if (createdOrderId && db) {
      const { error: cleanupError } = await db.from("orders").update({ status: "failed" }).eq("id", createdOrderId).eq("status", "pending");
      if (cleanupError) logger.error("Checkout cleanup failed", undefined, { source: "checkout" });
    }
    if (error instanceof QuoteError) return NextResponse.json({ error: error.message, needsNewRequest: Boolean(createdOrderId) }, { status: 409 });
    if (error instanceof CheckoutCatalogError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    logger.error("Checkout API error", error instanceof Error ? error : undefined, { source: "checkout" });
    return NextResponse.json(
      {
        error: "Failed to process checkout",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// GET method to retrieve existing order/preference
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json(
        { success: true, message: "Endpoint de checkout activo. Podes enviar ?order_id=... para ver detalles de una orden." },
      );
    }

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {},
          remove(name: string, options: any) {},
        },
      },
    );

    // User-scoped repo respects RLS
    const ordersRepo = new OrdersRepository(supabase);
    const checkoutService = new CheckoutService(ordersRepo);

    const orderData = await checkoutService.getOrder(orderId);

    if (!orderData) {
      return NextResponse.json(
        { error: "Orden no encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, ...orderData });
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
