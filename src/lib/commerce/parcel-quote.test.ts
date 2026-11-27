import { expect, it } from "vitest";
import { quoteCartParcels } from "./parcel-quote";
import type { ShippingBox } from "./shipping-parcels";

const variantId = "07b52321-802a-41db-ad0c-f014211eab23";
const catalog = [{ id: "product", dimensions: { variant_shipping: {
  [variantId]: { length_cm: 10, width_cm: 18, height_cm: 18, content_g: 125, container_g: 150 },
} } }];
const boxes: ShippingBox[] = [{
  id: "test-box", inside: [19, 19, 19], outside: [20, 20, 20], emptyWeightG: 220,
}];
const services = [{
  id: "synthetic-service", volumetricDivisor: 5000,
  rates: [{ id: "synthetic-rate", fromG: 0, toG: 2000, amountArs: 100 }],
}];

it("quotes each box separately using the selected variant and 220 g of packaging per box", () => {
  for (const quantity of [1, 2]) {
    const [quote] = quoteCartParcels([{ productId: "product", variantId, quantity }], catalog, boxes, services);
    expect(quote.amountArs).toBe(100 * quantity);
    expect(quote.parcels.map(parcel => parcel.weightG)).toEqual(Array(quantity).fill(495));
  }
});

it("omits services without a valid rate and carts without a shipping specification", () => {
  expect(quoteCartParcels([{ productId: "product", variantId, quantity: 1 }], catalog, boxes, [
    { ...services[0], rates: [] },
  ])).toEqual([]);
  expect(quoteCartParcels([{ productId: "product", quantity: 1 }], catalog, boxes, services)).toEqual([]);
});

it("calculates protection on the declared merchandise packed in each parcel", () => {
  const protectedService = { ...services[0], addDeclaredValueProtection: true };
  const [quote] = quoteCartParcels(
    [{ productId: "product", variantId, quantity: 2, price: 2500 }],
    catalog, boxes, [protectedService],
  );
  expect(quote.amountArs).toBe(250);
  expect(quote.parcels.map(parcel => parcel.protectionArs)).toEqual([25, 25]);
  expect(quoteCartParcels(
    [{ productId: "product", variantId, quantity: 1 }], catalog, boxes, [protectedService],
  )).toEqual([]);
});

it("compares the small box and the larger box independently for each carrier", () => {
  const smallBox: ShippingBox = {
    id: "small", inside: [10, 10, 10], outside: [11, 11, 11], emptyWeightG: 70,
  };
  const smallCatalog = [{ id: "small-product", dimensions: {
    length_cm: 10, width_cm: 10, height_cm: 10,
    shipping_weights: { content_g: 125, container_g: 0 },
  } }];
  const flat = { ...services[0], id: "flat" };
  const weightBased = { ...services[0], id: "weight-based", rates: [
    { id: "light", fromG: 0, toG: 500, amountArs: 20 },
    { id: "heavy", fromG: 500, toG: 2000, amountArs: 100 },
  ] };
  const [flatQuote, weightQuote] = quoteCartParcels(
    [{ productId: "small-product", quantity: 2 }],
    smallCatalog, [smallBox, { ...boxes[0], inside: [19, 19, 20] }], [flat, weightBased],
  );
  expect(flatQuote.parcels.map(parcel => parcel.boxId)).toEqual(["test-box"]);
  expect(weightQuote.parcels.map(parcel => parcel.boxId)).toEqual(["small", "small"]);
  expect(weightQuote.amountArs).toBe(40);
});

it.each([
  { side: 8, boxId: "10-cm", weightG: 275 },
  { side: 9, boxId: "17-cm", weightG: 305 },
  { side: 12, boxId: "20-cm", weightG: 345 },
])("uses the appropriate pilot box for a $side cm product", ({ side, boxId, weightG }) => {
  // Interior clearance is provisional and only used in this test.
  const pilotBoxes: ShippingBox[] = [
    { id: "10-cm", inside: [8, 8, 8], outside: [10, 10, 10], emptyWeightG: 150 },
    { id: "17-cm", inside: [15, 12, 9], outside: [17, 14, 11], emptyWeightG: 180 },
    { id: "20-cm", inside: [18, 18, 18], outside: [20, 20, 20], emptyWeightG: 220 },
  ];
  const pilotCatalog = [{ id: "product", dimensions: {
    length_cm: side, width_cm: side, height_cm: side,
    shipping_weights: { content_g: 100, container_g: 25 },
  } }];
  const [quote] = quoteCartParcels([{ productId: "product", quantity: 1 }], pilotCatalog, pilotBoxes, services);
  expect(quote?.parcels).toMatchObject([{ boxId, weightG }]);
});
