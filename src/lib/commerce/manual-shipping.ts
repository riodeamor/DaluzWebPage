import { z } from "zod";
import { coverageSchema } from "./shipping";
const id = z.string().uuid();
const optionalText = z.string().trim().min(1).max(240).nullable();
const grams = z.number().int().positive().max(100000000);
export const manualSchemas = {
  points: z.object({ name: z.string().trim().min(1).max(120), province: z.string().trim().min(1).max(120), city: z.string().trim().min(1).max(120), address: optionalText, postal_code: z.string().trim().regex(/^(?:\d{4}|[A-Z]\d{4}[A-Z]{3})$/i).nullable(), is_active: z.boolean() }).strict(),
  regions: z.object({ name: z.string().trim().min(1).max(120), coverage: z.array(coverageSchema).max(100), is_active: z.boolean() }).strict(),
  services: z.object({ name: z.string().trim().min(1).max(120), region_id: id.nullable(), dispatch_point_id: id.nullable(), carrier_id: id.nullable(), modality: z.enum(["domicile", "branch"]), branch_name: optionalText, branch_address: optionalText, branch_postal_code: z.string().trim().regex(/^(?:\d{4}|[A-Z]\d{4}[A-Z]{3})$/i).nullable(), oca_coverage_reference: optionalText.optional(), eligible_for_free_shipping: z.boolean(), is_active: z.boolean() }).strict(),
  rates: z.object({ service_id: id.nullable(), weight_from_g: z.number().int().nonnegative().max(99999999).nullable(), weight_to_g: grams.nullable(), rate_ars: z.number().finite().nonnegative().multipleOf(0.01).max(999999999).nullable(), confirmed_reference: optionalText, confirmed_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(), is_active: z.boolean() }).strict(),
  weights: z.object({ product_id: id, variant_id: id.nullable(), weight_g: grams.nullable(), is_active: z.boolean() }).strict(),
  policy: z.object({ enabled: z.boolean(), free_shipping_enabled: z.boolean(), free_shipping_threshold_ars: z.number().finite().nonnegative().multipleOf(0.01).max(999999999), default_dispatch_point_id: id.nullable(), packaging_weight_g: grams.nullable() }).strict(),
};
export type ManualKind = keyof typeof manualSchemas;
export const manualTables: Record<ManualKind, string> = { points: "shipping_dispatch_points", regions: "shipping_regions", services: "shipping_services", rates: "shipping_manual_rates", weights: "shipping_item_weights", policy: "shipping_policy" };
export function parseManual(kind: ManualKind, value: unknown) {
  const result = manualSchemas[kind].safeParse(value);
  if (!result.success) return result;
  const data = result.data;
  let message = "";
  if ("is_active" in data && data.is_active) {
    if (kind === "points" && "address" in data && (!data.address || !data.postal_code)) message = "Para activar: dirección y CP confirmados.";
    if (kind === "regions" && "coverage" in data && !data.coverage.length) message = "Definí la cobertura.";
    if (kind === "weights" && "weight_g" in data && !data.weight_g) message = "Confirmá el peso en gramos.";
    if (kind === "services" && "region_id" in data && (!data.region_id || !data.dispatch_point_id || !data.carrier_id || (data.modality === "branch" && (!data.branch_name || !data.branch_address || !data.branch_postal_code)))) message = "Completá región, origen, transportista y sucursal si corresponde.";
    if (kind === "rates" && "rate_ars" in data && (data.rate_ars === null || data.weight_from_g === null || data.weight_to_g === null || data.weight_from_g >= data.weight_to_g || !data.service_id || !data.confirmed_reference || !data.confirmed_on)) message = "Confirmá servicio, rango [desde, hasta), precio, referencia y fecha.";
  }
  if (kind === "rates" && "weight_from_g" in data && data.weight_from_g !== null && data.weight_to_g !== null && data.weight_from_g >= data.weight_to_g) message = "El rango de peso debe tener desde menor que hasta.";
  if (message) return { success: false as const, error: new z.ZodError([{ code: "custom", path: [], message }]) };
  return result;
}
