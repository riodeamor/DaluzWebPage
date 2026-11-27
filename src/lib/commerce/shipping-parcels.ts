type Dimensions = readonly [lengthCm: number, widthCm: number, heightCm: number];

export type ShippableLine = {
  quantity: number;
  weightG: number | null;
  dimensions: Dimensions | null;
  unitValueCents?: number;
};

export type ShippingBox = {
  id: string;
  emptyWeightG: number;
  inside: Dimensions;
  outside: Dimensions;
};

export type ShippingParcel = {
  boxId: string;
  dimensions: Dimensions;
  weightG: number;
  declaredValueCents?: number;
};

const positive = (value: number) => Number.isFinite(value) && value > 0;
const volume = ([length, width, height]: Dimensions) => length * width * height;

export type ParcelRate = {
  id: string;
  amountArs: number;
} & (
  { fromG: number; toG: number; exactParcel?: never } |
  { exactParcel: Pick<ShippingParcel, "dimensions" | "weightG"> }
);

export function priceShippingParcels(
  parcels: readonly ShippingParcel[],
  rates: readonly ParcelRate[],
  volumetricDivisor: number | null,
  declaredValueCents?: readonly number[],
) {
  if (!parcels.length || (volumetricDivisor !== null && !positive(volumetricDivisor))) return null;
  if (declaredValueCents && declaredValueCents.length !== parcels.length) return null;
  const quotedParcels = [];
  let totalCents = 0;

  for (const [index, parcel] of parcels.entries()) {
    if (!positive(parcel.weightG) || !parcel.dimensions.every(positive)) return null;
    const billableWeightG = volumetricDivisor === null ? null
      : Math.ceil(Math.max(parcel.weightG, volume(parcel.dimensions) * 1000 / volumetricDivisor));
    const matches = rates.filter(rate => rate.exactParcel
      ? parcel.weightG === rate.exactParcel.weightG &&
        parcel.dimensions.every((side, i) => side === rate.exactParcel.dimensions[i])
      : billableWeightG !== null && billableWeightG >= rate.fromG && billableWeightG < rate.toG);
    if (matches.length !== 1) return null;

    const [rate] = matches;
    const declaredCents = declaredValueCents?.[index] ?? 0;
    if (!Number.isSafeInteger(declaredCents) || declaredCents < 0) return null;
    const protectionCents = Math.round(declaredCents / 100);
    const cents = Math.round(rate.amountArs * 100) + protectionCents;
    if (!Number.isSafeInteger(cents) || rate.amountArs < 0) return null;
    totalCents += cents;
    if (!Number.isSafeInteger(totalCents)) return null;
    quotedParcels.push({ ...parcel, billableWeightG, rateId: rate.id, amountArs: cents / 100,
      ...(declaredValueCents ? { declaredValueArs: declaredCents / 100, protectionArs: protectionCents / 100 } : {}) });
  }

  return { amountArs: totalCents / 100, parcels: quotedParcels };
}

function findOrientation([length, width, height]: Dimensions, space: Dimensions) {
  const orientations: Dimensions[] = [
    [length, width, height], [width, length, height],
    [length, height, width], [height, length, width],
    [width, height, length], [height, width, length],
  ];
  return orientations.find(size => size.every((side, index) => side <= space[index]));
}

// Free spaces never overlap. Some arrangements need a different packing order;
// this returns a feasible arrangement, without promising the fewest boxes.
export function planShippingParcels(
  lines: readonly ShippableLine[],
  boxes: readonly ShippingBox[],
): ShippingParcel[] | null {
  const units: { dimensions: Dimensions; weightG: number; valueCents?: number }[] = [];
  for (const { quantity, dimensions, weightG, unitValueCents } of lines) {
    if (!Number.isSafeInteger(quantity) || quantity < 1 || units.length + quantity > 500 ||
        !dimensions?.every(positive) || weightG === null || !positive(weightG)) return null;
    if (unitValueCents !== undefined && (!Number.isSafeInteger(unitValueCents) || unitValueCents < 0)) return null;
    for (let index = 0; index < quantity; index++) units.push({ dimensions, weightG, valueCents: unitValueCents });
  }
  if (!units.length) return null;

  units.sort((a, b) => volume(b.dimensions) - volume(a.dimensions));
  const availableBoxes = boxes.filter(box => positive(box.emptyWeightG) &&
    box.inside.every((side, index) => positive(side) && side <= box.outside[index]) &&
    box.outside.every(positive)).sort((a, b) => volume(a.outside) - volume(b.outside));
  const parcels: { parcel: ShippingParcel; spaces: Dimensions[] }[] = [];

  for (const unit of units) {
    let destination = parcels.find(({ spaces }) =>
      spaces.some(space => findOrientation(unit.dimensions, space)));
    if (!destination) {
      const box = availableBoxes.find(box => findOrientation(unit.dimensions, box.inside));
      if (!box) return null;
      destination = {
        parcel: { boxId: box.id, dimensions: box.outside, weightG: box.emptyWeightG },
        spaces: [box.inside],
      };
      parcels.push(destination);
    }

    for (const [index, space] of destination.spaces.entries()) {
      const size = findOrientation(unit.dimensions, space);
      if (!size) continue;
      const [length, width, height] = size;
      const remaining: Dimensions[] = [
        [space[0] - length, space[1], space[2]],
        [length, space[1] - width, space[2]],
        [length, width, space[2] - height],
      ];
      destination.spaces.splice(index, 1, ...remaining.filter(dimensions => dimensions.every(positive)));
      destination.parcel.weightG += unit.weightG;
      if (unit.valueCents !== undefined) {
        destination.parcel.declaredValueCents = (destination.parcel.declaredValueCents ?? 0) + unit.valueCents;
        if (!Number.isSafeInteger(destination.parcel.declaredValueCents)) return null;
      }
      break;
    }
  }

  // Carriers receive the final packed weight rounded up to whole grams.
  return parcels.map(({ parcel }) => ({ ...parcel, weightG: Math.ceil(parcel.weightG) }));
}
