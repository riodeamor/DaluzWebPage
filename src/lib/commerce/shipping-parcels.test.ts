import { describe, expect, it } from "vitest";
import { planShippingParcels, priceShippingParcels, type ShippingBox } from "./shipping-parcels";

const box: ShippingBox = {
  id: "box",
  inside: [19, 19, 19],
  outside: [20, 20, 20],
  emptyWeightG: 120,
};

describe("planShippingParcels", () => {
  it("packs multiple units into one box where they fit", () => {
    expect(planShippingParcels([
      { quantity: 2, dimensions: [9, 19, 19], weightG: 350.2 },
    ], [box])).toEqual([{ boxId: "box", dimensions: box.outside, weightG: 821 }]);
  });

  it("uses separate parcels when the units do not fit together", () => {
    expect(planShippingParcels([
      { quantity: 2, dimensions: [11, 19, 19], weightG: 350 },
    ], [box])).toEqual(Array.from({ length: 2 }, () =>
      ({ boxId: "box", dimensions: box.outside, weightG: 470 })));
  });

  it("rotates an item to fit a rectangular box", () => {
    const narrowBox: ShippingBox = { ...box, inside: [19, 10, 9] };
    expect(planShippingParcels([
      { quantity: 1, dimensions: [9, 19, 10], weightG: 200 },
    ], [narrowBox])).toHaveLength(1);
  });

  it("rejects missing measurements and checks the internal dimensions", () => {
    expect(planShippingParcels([{ quantity: 1, dimensions: null, weightG: 100 }], [box])).toBeNull();
    expect(planShippingParcels([{ quantity: 1, dimensions: [20, 2, 2], weightG: 100 }], [box])).toBeNull();
  });
});

describe("priceShippingParcels", () => {
  const parcel = { boxId: box.id, dimensions: box.outside, weightG: 500 };
  const rates = [
    { id: "light", fromG: 0, toG: 1600, amountArs: 140 },
    { id: "medium", fromG: 1600, toG: 3000, amountArs: 220.15 },
  ];

  it("adds the protection charge to each parcel's declared value", () => {
    const quote = priceShippingParcels([parcel, parcel], rates, 5000, [100000, 200050]);
    expect(quote?.parcels.map(entry => entry.protectionArs)).toEqual([10, 20.01]);
    expect(quote?.amountArs).toBe(470.31);
    expect(priceShippingParcels([parcel, parcel], rates, 5000, [100000])).toBeNull();
  });

  it("never extends an exact carrier quote to an unverified parcel", () => {
    const exact = [{ id: "official-point-quote", exactParcel: parcel, amountArs: 10762.70 }];
    expect(priceShippingParcels([parcel], exact, null)?.amountArs).toBe(10762.70);
    expect(priceShippingParcels([parcel], rates, null)).toBeNull();
    expect(priceShippingParcels([{ ...parcel, weightG: parcel.weightG + 1 }], exact, 5000)).toBeNull();
    expect(priceShippingParcels([{ ...parcel, dimensions: [21, 20, 20] }], exact, 5000)).toBeNull();
  });

  it("charges each parcel and applies the larger of real and volumetric weight", () => {
    const result = priceShippingParcels([parcel, { ...parcel, weightG: 2100 }], rates, 5000);
    expect(result?.amountArs).toBe(440.3);
    expect(result?.parcels.map(entry => entry.billableWeightG)).toEqual([1600, 2100]);
  });

  it("requires a configured divisor and exactly one valid weight band per parcel", () => {
    expect(priceShippingParcels([parcel], rates, 0)).toBeNull();
    expect(priceShippingParcels([parcel], rates.slice(0, 1), 5000)).toBeNull();
    expect(priceShippingParcels([parcel], [...rates, rates[1]], 5000)).toBeNull();
  });
});
