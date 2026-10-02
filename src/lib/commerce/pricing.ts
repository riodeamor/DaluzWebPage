export class QuoteError extends Error {}
export type Region = "cordoba" | "centro" | "nacional" | "patagonia" | "respaldo";
export const REGIONS: { key: Region; name: string; ranges: string }[] = [
  { key: "cordoba", name: "Córdoba Capital y Sierras", ranges: "5000–5999" },
  { key: "centro", name: "Centro / CABA / GBA / Santa Fe", ranges: "1000–2999" },
  { key: "nacional", name: "Nacional / Interior", ranges: "3000–4999 y 6000–7999" },
  { key: "patagonia", name: "Patagonia / Tierra del Fuego", ranges: "8000–9499" },
  { key: "respaldo", name: "Zona de respaldo", ranges: "Fuera de los rangos regionales" },
];

export function postalRegion(input: string): Region {
  // Admite CP de cuatro dígitos y CPA argentino; no extrae dígitos de texto arbitrario.
  const normalized = input.trim().toUpperCase();
  const match = /^(?:\d{4}|[A-Z]\d{4}[A-Z]{3})$/.test(normalized) ? normalized.match(/(\d{4})/) : null;
  if (!match) throw new QuoteError("Ingresá un código postal válido (4 dígitos o CPA).");
  const cp = Number(match[1]);
  if (cp >= 5000 && cp <= 5999) return "cordoba";
  if (cp >= 1000 && cp <= 2999) return "centro";
  if ((cp >= 3000 && cp <= 4999) || (cp >= 6000 && cp <= 7999)) return "nacional";
  if (cp >= 8000 && cp <= 9499) return "patagonia";
  return "respaldo";
}

export interface Coupon {
  id: string; code: string; type: "percent" | "fixed"; value: number;
  minimum_purchase: number; expires_at: string | null; usage_limit: number | null;
  is_active: boolean; archived: boolean; combinable_con_transferencia: boolean;
  updated_at: string;
}
export interface Quote {
  subtotal: number; couponDiscount: number; netProducts: number;
  transferDiscount: number; discount: number; shipping: number | null; total: number | null;
  freeShippingThreshold: number | null; region: Region | null;
  zoneName: string | null; carrierName: string | null;
  coupon: { code: string; combinable_con_transferencia: boolean } | null;
}
const cents = (value: number) => Math.round(value * 100);
export function calculateQuote(
  items: { productId: string; price: number; quantity: number }[],
  coupon: Coupon | null, transfer: boolean, percentages: Record<string, number>,
  shippingRate: number | null, threshold: number | null, now = Date.now(),
): Quote {
  const lines = items.map(item => ({ ...item, cents: cents(item.price) * item.quantity }));
  const subtotal = lines.reduce((sum, line) => sum + line.cents, 0);
  let couponDiscount = 0;
  if (coupon) {
    if (!coupon.is_active || coupon.archived) throw new QuoteError("El cupón no está activo.");
    if (coupon.expires_at && new Date(coupon.expires_at).getTime() <= now) throw new QuoteError("El cupón está vencido.");
    if (subtotal < cents(coupon.minimum_purchase)) throw new QuoteError("No alcanzás la compra mínima del cupón.");
    if (!Number.isFinite(coupon.value) || coupon.value <= 0 || (coupon.type === "percent" && coupon.value > 100)) throw new QuoteError("El cupón no tiene un descuento válido.");
    couponDiscount = Math.min(subtotal, coupon.type === "percent" ? Math.round(subtotal * coupon.value / 100) : cents(coupon.value));
  }
  // Distribución proporcional en centavos con resto acumulado: conserva exactamente
  // el descuento y los porcentajes por producto sin tocar precios del catálogo.
  let allocated = 0, cumulative = 0, transferDiscount = 0;
  for (const line of lines) {
    cumulative += line.cents;
    const next = subtotal ? Math.round(couponDiscount * cumulative / subtotal) : 0;
    const net = line.cents - (next - allocated);
    allocated = next;
    const percent = percentages[line.productId];
    if (transfer && (!coupon || coupon.combinable_con_transferencia) && Number.isFinite(percent) && percent > 0 && percent <= 100) {
      transferDiscount += net * percent / 100;
    }
  }
  transferDiscount = Math.round(transferDiscount);
  const netProducts = subtotal - couponDiscount;
  const shipping = shippingRate === null ? null : threshold !== null && netProducts > cents(threshold) ? 0 : cents(shippingRate);
  return {
    subtotal: subtotal / 100, couponDiscount: couponDiscount / 100, netProducts: netProducts / 100,
    transferDiscount: transferDiscount / 100, discount: (couponDiscount + transferDiscount) / 100,
    shipping: shipping === null ? null : shipping / 100,
    total: shipping === null ? null : (netProducts - transferDiscount + shipping) / 100,
    freeShippingThreshold: threshold, region: null, zoneName: null, carrierName: null,
    coupon: coupon ? { code: coupon.code, combinable_con_transferencia: coupon.combinable_con_transferencia } : null,
  };
}
