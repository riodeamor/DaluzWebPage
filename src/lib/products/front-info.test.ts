import { describe, it, expect } from "vitest";
import { validateFrontInfo, ProductFrontInfoError } from "./front-info";
import { sanitizeProductPayload } from "./sanitize";

describe("front catalog info", () => {
  it.each([undefined, null, "", "Jojoba & Neroli", "a".repeat(65)])("accepts optional text %j", (value) => {
    expect(validateFrontInfo(value)).toBe(value);
  });
  it.each(["a".repeat(66), 123, true, {}, []])("rejects invalid input %j", (value) => {
    expect(() => validateFrontInfo(value)).toThrow(ProductFrontInfoError);
  });
  it("preserves the existing payment benefits and prices", () => {
    const body = { name: "Serum", price: 13000, discount_transfer_percent: 10,
      discount_cash_percent: 5, installments_3_enabled: true, installments_6_enabled: false };
    expect(sanitizeProductPayload({ ...body, info_frontal: "Jojoba & Neroli" }))
      .toEqual({ ...body, info_frontal: "Jojoba & Neroli" });
  });
  it("allows clearing the field without changing partial updates", () => {
    expect(sanitizeProductPayload({ info_frontal: "  " })).toEqual({ info_frontal: null });
    expect(sanitizeProductPayload({ name: "Serum" })).not.toHaveProperty("info_frontal");
  });
});
