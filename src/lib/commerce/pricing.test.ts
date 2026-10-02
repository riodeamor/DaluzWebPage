import { describe, it, expect } from "vitest";
import { calculateQuote, postalRegion, type Coupon } from "./pricing";
const coupon: Coupon = { id: "c1", code: "PRUEBA", type: "percent", value: 20, minimum_purchase: 0, expires_at: null, usage_limit: null, is_active: true, archived: false, combinable_con_transferencia: true, updated_at: "2026-10-01T00:00:00Z" };
const items = [{ productId: "p1", price: 10000, quantity: 1 }];
describe("zonas regionales", () => {
  it.each([
    ["0999", "respaldo"], ["1000", "centro"], ["2999", "centro"],
    ["3000", "nacional"], ["4999", "nacional"], ["5000", "cordoba"], ["5999", "cordoba"],
    ["6000", "nacional"], ["7999", "nacional"], ["8000", "patagonia"], ["9499", "patagonia"],
    ["9500", "respaldo"], ["9999", "respaldo"], [" x5000abc ", "cordoba"],
  ])("%s pertenece a %s", (cp, zone) => expect(postalRegion(cp)).toBe(zone));
  it.each(["", "999", "10000", "xyz5000", "C5000", "5000ABC", "5000<script>"])("rechaza CP inválido %s", cp => expect(() => postalRegion(cp)).toThrow());
});
describe("cascada y envío", () => {
  it("cupón antes de transferencia, sin descontar envío", () => {
    expect(calculateQuote(items, coupon, true, { p1: 10 }, 1000, 9000)).toMatchObject({ subtotal: 10000, couponDiscount: 2000, netProducts: 8000, transferDiscount: 800, discount: 2800, shipping: 1000, total: 8200 });
  });
  it("cupón no combinable conserva transferencia como medio, sin segundo descuento", () => expect(calculateQuote(items, { ...coupon, combinable_con_transferencia: false }, true, { p1: 10 }, 1000, null)).toMatchObject({ transferDiscount: 0, total: 9000 }));
  it("mínimo del cupón se evalúa antes del descuento", () => expect(calculateQuote(items, { ...coupon, minimum_purchase: 10000 }, false, {}, 1000, null).couponDiscount).toBe(2000));
  it("el umbral depende del neto post-cupón, no del bruto ni del pago", () => {
    expect(calculateQuote(items, coupon, true, { p1: 90 }, 1000, 7900).shipping).toBe(0);
    expect(calculateQuote(items, coupon, true, { p1: 10 }, 1000, 8000).shipping).toBe(1000);
    expect(calculateQuote(items, coupon, true, { p1: 10 }, 1000, 8000.01).shipping).toBe(1000);
  });
  it("distribuye cupón fijo proporcionalmente y respeta porcentaje por producto", () => {
    const mixed = [...items, { productId: "p2", price: 5000, quantity: 1 }];
    expect(calculateQuote(mixed, { ...coupon, type: "fixed", value: 3000 }, true, { p1: 10, p2: 20 }, 1000, null)).toMatchObject({ couponDiscount: 3000, transferDiscount: 1600, total: 11400 });
  });
  it("no descuenta más del saldo de productos", () => expect(calculateQuote(items, { ...coupon, type: "fixed", value: 20000 }, true, { p1: 10 }, 1000, null)).toMatchObject({ couponDiscount: 10000, transferDiscount: 0, total: 1000 }));
  it("no inventa envío antes del CP", () => expect(calculateQuote(items, null, false, {}, null, 0)).toMatchObject({ total: null, shipping: null }));
  it("conserva centavos al distribuir el cupón", () => expect(calculateQuote([{ productId: "p1", price: 0.01, quantity: 1 }, { productId: "p2", price: 0.02, quantity: 1 }], { ...coupon, type: "fixed", value: 0.01 }, true, { p1: 100, p2: 100 }, 0, null)).toMatchObject({ subtotal: 0.03, couponDiscount: 0.01, transferDiscount: 0.02, total: 0 }));
  it.each([{ is_active: false }, { archived: true }, { minimum_purchase: 10001 }, { expires_at: "2020-01-01T00:00:00Z" }])("rechaza campaña inválida %j", override => expect(() => calculateQuote(items, { ...coupon, ...override }, true, {}, 1000, null)).toThrow());
});
