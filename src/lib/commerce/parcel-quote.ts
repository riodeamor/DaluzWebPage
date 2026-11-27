import { readShippingSpec } from "@/lib/products/shipping-spec";
import { planShippingParcels, priceShippingParcels, type ParcelRate, type ShippingBox } from "./shipping-parcels";

type CartLine = { productId: string; variantId?: string | null; quantity: number; price?: number };
type CatalogEntry = { id: string; dimensions: unknown };
type Service = { id: string; volumetricDivisor: number | null; rates: readonly ParcelRate[]; addDeclaredValueProtection?: boolean };

export function quoteCartParcels(
  items: readonly CartLine[],
  catalog: readonly CatalogEntry[],
  boxes: readonly ShippingBox[],
  services: readonly Service[],
) {
  const byId = new Map(catalog.map(({ id, dimensions }) => [id, dimensions]));
  const lines = items.map(item => ({
    quantity: item.quantity,
    unitValueCents: item.price === undefined ? undefined : Math.round(item.price * 100),
    ...(readShippingSpec(byId.get(item.productId), item.variantId ?? null) ??
      { weightG: null, dimensions: null }),
  }));
  const plans = [boxes, ...boxes.map(box => [box])]
    .map(available => planShippingParcels(lines, available))
    .filter(plan => plan !== null);

  return services.flatMap(service => {
    const includeProtection = service.addDeclaredValueProtection === true;
    if (includeProtection && items.some(item => item.price === undefined)) return [];
    const [quote] = plans
      .map(plan => priceShippingParcels(plan, service.rates, service.volumetricDivisor,
        includeProtection ? plan.map(parcel => parcel.declaredValueCents ?? NaN) : undefined))
      .filter(option => option !== null)
      .sort((a, b) => a.amountArs - b.amountArs || a.parcels.length - b.parcels.length);
    return quote ? [{ serviceId: service.id, ...quote }] : [];
  });
}
