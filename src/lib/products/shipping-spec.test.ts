import { expect, it } from "vitest";
import { readShippingSpec, variantShippingSpecs } from "./shipping-spec";

const spec = { content_g: 125, container_g: 150, length_cm: 6, width_cm: 6, height_cm: 10 };
const variantId = "07b52321-802a-41db-ad0c-f014211eab23";

it("uses the confirmed dimensions and combined weight of the selected variant", () => {
  const variants = { [variantId]: spec };
  expect(variantShippingSpecs.safeParse(variants).success).toBe(true);
  expect(readShippingSpec({ variant_shipping: variants }, variantId)).toEqual({
    weightG: 275, dimensions: [6, 6, 10],
  });
});

it("keeps an unconfigured variant unquotable even when the parent has measurements", () => {
  const product = { ...spec, shipping_weights: { content_g: 125, container_g: 0 } };
  expect(readShippingSpec(product, null)?.weightG).toBe(125);
  expect(readShippingSpec(product, variantId)).toBeNull();
  expect(variantShippingSpecs.safeParse({ [variantId]: { ...spec, height_cm: 0 } }).success).toBe(false);
});
