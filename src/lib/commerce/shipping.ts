import { z } from "zod";

export const geographicKey = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/\s+/g, " ");
const place = z.string().trim().min(1).max(120).regex(/^[^\x00-\x1f\x7f]+$/).transform(geographicKey).nullable();
export const coverageSchema = z.object({
  province: place.default(null), city: place.default(null),
  postal_from: z.number().int().min(0).max(9999).nullable().default(null),
  postal_to: z.number().int().min(0).max(9999).nullable().default(null),
}).strict().refine(c => (c.postal_from === null) === (c.postal_to === null), "Ingresá ambos límites postales.")
  .refine(c => c.postal_from === null || c.postal_from <= c.postal_to!, "El límite inicial supera al final.")
  .refine(c => !c.city || !!c.province, "La localidad requiere provincia.")
  .refine(c => !!c.province || c.postal_from !== null, "Definí una provincia o un rango postal.");
export type Coverage = z.infer<typeof coverageSchema>;
export function coveragesOverlap(a: Coverage, b: Coverage) {
  if (a.province && b.province && a.province !== b.province) return false;
  if (a.city && b.city && a.city !== b.city) return false;
  if (a.postal_from !== null && b.postal_from !== null && (a.postal_to! < b.postal_from || b.postal_to! < a.postal_from)) return false;
  return true; // No inferimos provincia a partir del CP para descartar un conflicto.
}
export const shippingRegionSchema = z.object({
  name: z.string().trim().min(1).max(120),
  rate_ars: z.number().finite().nonnegative().multipleOf(0.01).max(999999999).nullable(),
  carrier_id: z.string().uuid().nullable(), is_active: z.boolean(),
  coverage: z.array(coverageSchema).max(100),
}).strict().superRefine((r, ctx) => {
  if (r.is_active && (!r.coverage.length || r.rate_ars === null || !r.carrier_id)) ctx.addIssue({ code: "custom", message: "Para activar: cobertura, tarifa y transportista." });
  for (let i = 0; i < r.coverage.length; i++) for (let j = i + 1; j < r.coverage.length; j++) if (coveragesOverlap(r.coverage[i], r.coverage[j])) ctx.addIssue({ code: "custom", message: "Hay coberturas superpuestas dentro de esta región." });
});
export const shippingPolicySchema = z.object({
  enabled: z.boolean(), free_shipping_threshold_ars: z.number().finite().nonnegative().multipleOf(0.01).max(999999999),
  version: z.number().int().positive(),
}).strict();
export function postalNumber(input: string | undefined): number | null {
  if (!input?.trim()) return null;
  const normalized = input.trim().toUpperCase();
  if (!/^(?:\d{4}|[A-Z]\d{4}[A-Z]{3})$/.test(normalized)) throw new Error("Ingresá un código postal válido (4 dígitos o CPA).");
  return Number(normalized.match(/\d{4}/)![0]);
}
