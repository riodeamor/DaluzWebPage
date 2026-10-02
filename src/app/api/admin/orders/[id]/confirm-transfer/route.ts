import { NextRequest, NextResponse } from "next/server";
import { getServiceClient, requireAdmin } from "@/lib/auth/helpers";
import { OrdersRepository, PaymentConflictError } from "@/lib/repositories/orders.repository";
import { PaymentEffectsRepository } from "@/lib/repositories/payment-effects.repository";
import { PaymentEffectsService } from "@/lib/services/payment-effects.service";
import { OrderPaymentService } from "@/lib/services/order-payment.service";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  // requireAdmin devuelve { ok: false, response } cuando rechaza, no null.
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const service = getServiceClient();
  const ordersRepo = new OrdersRepository(service);

  const order = await ordersRepo.findById(params.id);
  if (!order) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  if (order.payment_method !== "bank_transfer") {
    return NextResponse.json(
      { error: "Este pedido no es por transferencia" },
      { status: 400 },
    );
  }

  if (!["awaiting_transfer", "paid"].includes(order.payment_status)) {
    return NextResponse.json(
      { error: "Este pedido no esta esperando transferencia" },
      { status: 409 },
    );
  }

  const paymentService = new OrderPaymentService(
    ordersRepo,
    new PaymentEffectsService(new PaymentEffectsRepository(service), ordersRepo),
  );
  try {
    await paymentService.confirmOrderPayment(params.id, {}, order);
  } catch (error) {
    if (error instanceof PaymentConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    throw error;
  }

  return NextResponse.json({ success: true });
}
