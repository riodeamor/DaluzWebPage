import type { CheckoutProduct } from "@/lib/payments/checkout-catalog";
import type { CartItem } from "@/lib/services/checkout.service";
import { quoteCartParcels } from "./parcel-quote";
import type { ShippingBox } from "./shipping-parcels";

const boxes: ShippingBox[] = [
  { id: "small", inside: [8, 8, 8], outside: [10, 10, 10], emptyWeightG: 150 },
  { id: "medium", inside: [15, 12, 9], outside: [17, 14, 11], emptyWeightG: 180 },
  { id: "large", inside: [18, 18, 18], outside: [20, 20, 20], emptyWeightG: 220 },
];

const samples = [
  { dimensions: boxes[0].outside, weightG: 275, domicile: 13890.41 },
  { dimensions: boxes[1].outside, weightG: 305, domicile: 13890.41 },
  { dimensions: boxes[2].outside, weightG: 495, domicile: 14884.62 },
];

const pilotServiceId = "779a7491-f292-4ab7-bdba-496f354e706e";
const normalize = (value?: string | null) => (value ?? "").trim().toLowerCase();

export function parcelPilotEnabled() {
  return process.env.VERCEL_ENV === "preview" &&
    process.env.DALUZ_PARCEL_PILOT === "1" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL === "https://pdxgpfnxsewulpieqdrf.supabase.co";
}

export function quoteParcelPilot(
  items: CartItem[],
  products: CheckoutProduct[],
  destination: { postal: number | null; country?: string | null; province?: string | null; city?: string | null },
) {
  // Pickup is intentionally withheld until a specific branch is configured.
  if (destination.postal !== 5500 ||
      !["argentina", "ar"].includes(normalize(destination.country || "Argentina")) ||
      normalize(destination.province) !== "mendoza" ||
      !["mendoza", "mendoza capital", "ciudad de mendoza", "capital"].includes(normalize(destination.city))) return [];

  return quoteCartParcels(items, products.map(product => ({ id: product.id, dimensions: product.dimensions })), boxes, [{
    id: pilotServiceId,
    volumetricDivisor: null,
    addDeclaredValueProtection: true,
    rates: samples.map(({ dimensions, weightG, domicile }, i) => ({
      id: "andreani-cordoba-mendoza-" + boxes[i].id,
      exactParcel: { dimensions, weightG },
      amountArs: domicile,
    })),
  }]).map(quote => ({
    id: quote.serviceId,
    name: "Andreani a domicilio · ensayo",
    carrier_name: "Andreani",
    modality: "domicile" as const,
    branch_name: null,
    branch_address: null,
    branch_postal_code: null,
    manual_rate_ars: quote.amountArs,
    parcel_count: quote.parcels.length,
    parcels: quote.parcels,
  }));
}
