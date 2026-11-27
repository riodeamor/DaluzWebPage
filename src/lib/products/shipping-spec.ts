import { z } from "zod";

export const shippingSpec = z.object({
  content_g: z.number().finite().positive().max(999999.99),
  container_g: z.number().finite().nonnegative().max(999999.99),
  length_cm: z.number().finite().positive().max(100000),
  width_cm: z.number().finite().positive().max(100000),
  height_cm: z.number().finite().positive().max(100000),
}).strict().refine(
  ({ content_g, container_g }) => content_g + container_g <= 999999.99,
  "El peso total excede el máximo permitido.",
);

export const variantShippingSpecs = z.record(z.string().uuid(), shippingSpec);

export function readShippingSpec(dimensions: unknown, variantId: string | null) {
  if (!dimensions || typeof dimensions !== "object") return null;
  const data = dimensions as Record<string, unknown>;
  const candidates = data.variant_shipping;
  const weights = data.shipping_weights;
  const parsed = shippingSpec.safeParse(variantId
    ? candidates && typeof candidates === "object" && Object.prototype.hasOwnProperty.call(candidates, variantId)
      ? (candidates as Record<string, unknown>)[variantId]
      : undefined
    : { content_g: (weights as Record<string, unknown> | undefined)?.content_g,
        container_g: (weights as Record<string, unknown> | undefined)?.container_g,
        length_cm: data.length_cm, width_cm: data.width_cm, height_cm: data.height_cm });
  if (!parsed.success) return null;
  const { content_g, container_g, length_cm, width_cm, height_cm } = parsed.data;
  return {
    weightG: (Math.round(content_g * 100) + Math.round(container_g * 100)) / 100,
    dimensions: [length_cm, width_cm, height_cm] as const,
  };
}
