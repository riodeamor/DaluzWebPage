import type { SupabaseClient } from "@supabase/supabase-js";
import { ProductsRepository } from "@/lib/repositories/products.repository";
import { resolveCheckoutItems } from "@/lib/payments/checkout-catalog";
import { calculateQuote, QuoteError, type Coupon, type Quote } from "./pricing";
import { postalNumber } from "./shipping";
import type { z } from "zod";
import type { quoteSchema } from "./schemas";

export async function quoteCart(db: SupabaseClient, input: z.infer<typeof quoteSchema>) {
  const products = await new ProductsRepository(db).findManyByIds(input.items.map(i => i.productId));
  const items = resolveCheckoutItems(input.items, products);
  let coupon: Coupon | null = null;
  if (input.couponCode) {
    const { data, error } = await db.from("coupons").select("*").eq("code", input.couponCode).single();
    if (error || !data) throw new QuoteError("Cupón no encontrado.");
    coupon = data as Coupon;
    const { data: available, error: availabilityError } = await db.rpc("coupon_available", { p_coupon_id: coupon.id });
    if (availabilityError) throw availabilityError;
    if (!available) throw new QuoteError("El cupón no está disponible o agotó sus usos.");
  }
  let postal: number | null;
  try { postal = postalNumber(input.postalCode); } catch (e) { throw new QuoteError(e instanceof Error ? e.message : "Código postal inválido."); }
  const { data: shipping, error: shippingError } = await db.rpc("resolve_manual_shipping", {
    p_country: input.country || "Argentina", p_province: input.province || null, p_city: input.city || null, p_postal: postal,
    p_items: items.map(i => ({ productId: i.productId, variantId: i.variantId ?? null, quantity: i.quantity })),
    p_service_id: input.shippingServiceId ?? null,
  });
  if (shippingError || !shipping) throw new QuoteError("No pudimos verificar las reglas de envío. Contactanos para coordinarlo.");
  const threshold = shipping.threshold === null ? null : Number(shipping.threshold);
  const rate = shipping.rate_ars === null ? null : Number(shipping.rate_ars);
  if ((threshold !== null && (!Number.isFinite(threshold) || threshold < 0)) || (rate !== null && (!Number.isFinite(rate) || rate < 0))) throw new QuoteError("La configuración de envío no es válida. Contactanos para coordinarlo.");
  const percentages = Object.fromEntries(products.map(p => [p.id, p.discount_transfer_percent ?? 0]));
  const quote = calculateQuote(items, coupon, input.paymentMethod === "bank_transfer", percentages, rate, threshold);
  const shippingOptions = ((shipping.options ?? []) as NonNullable<Quote["shippingOptions"]>).map(option => ({
    ...option,
    quoted_shipping_ars: calculateQuote(items, coupon, input.paymentMethod === "bank_transfer", percentages,
      option.manual_rate_ars, option.free_shipping_threshold ?? null).shipping ?? option.manual_rate_ars,
  }));
  return { items, coupon, shippingConfiguration: shipping.snapshot ?? null, quote: { ...quote,
    shippingQuoteToken: shipping.quote_token ?? null, serviceId: input.shippingServiceId ?? null,
    shippingOptions, shippingWeightG: shipping.weight_g ?? null,
    region: shipping.region_id ?? null, zoneName: shipping.region_name ?? null, carrierName: shipping.carrier_name ?? null,
    shippingMessage: rate === null ? (shipping.message || "Coordinar envío") : undefined } };
}
