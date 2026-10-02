import type { SupabaseClient } from "@supabase/supabase-js";
import { ProductsRepository } from "@/lib/repositories/products.repository";
import { resolveCheckoutItems } from "@/lib/payments/checkout-catalog";
import { calculateQuote, postalRegion, QuoteError, type Coupon } from "./pricing";
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
  const { data: config, error: configError } = await db.from("system_config").select("config_value").eq("config_key", "free_shipping_threshold").maybeSingle();
  if (configError) throw configError;
  const threshold = config ? Number(config.config_value) : null;
  if (threshold !== null && (!Number.isFinite(threshold) || threshold < 0)) throw new QuoteError("El umbral de envío no está configurado correctamente.");
  const region = input.postalCode ? postalRegion(input.postalCode) : null;
  const productsQuote = calculateQuote(items, coupon, false, {}, null, threshold);
  const qualifiesFree = threshold !== null && productsQuote.netProducts > threshold;
  let rate: number | null = null, zoneName: string | null = null, carrierName: string | null = null;
  if (region) {
    const { data: zone, error } = await db.from("shipping_zones").select("id,name,is_active,regional_rate,carrier_id").eq("region_key", region).single();
    if (error || !zone?.is_active || (zone.regional_rate === null && !qualifiesFree)) throw new QuoteError("La tarifa de esta zona no está disponible. Contactanos para coordinar el envío.");
    rate = zone.regional_rate === null ? 0 : Number(zone.regional_rate);
    if (!Number.isFinite(rate) || rate < 0) throw new QuoteError("La tarifa de envío no es válida.");
    zoneName = zone.name;
    if (zone.carrier_id) {
      const { data: carrier, error: carrierError } = await db.from("shipping_carriers").select("name,is_active").eq("id", zone.carrier_id).single();
      if (carrierError || !carrier?.is_active) throw new QuoteError("El transportista de esta zona no está disponible.");
      carrierName = carrier.name;
    }
  }
  const percentages = Object.fromEntries(products.map(p => [p.id, p.discount_transfer_percent ?? 0]));
  const quote = calculateQuote(items, coupon, input.paymentMethod === "bank_transfer", percentages, rate, threshold);
  return { items, coupon, quote: { ...quote, region, zoneName, carrierName } };
}
