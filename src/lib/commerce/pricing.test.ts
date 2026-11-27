import { describe, it, expect } from "vitest";
import { calculateQuote, type Coupon } from "./pricing";
import { postalNumber } from "./shipping";
const coupon: Coupon = { id: "c1", code: "PRUEBA", type: "percent", value: 20, minimum_purchase: 0, expires_at: null, usage_limit: null, is_active: true, archived: false, combinable_con_transferencia: true, updated_at: "2026-10-01T00:00:00Z" };
const items = [{ productId: "p1", price: 10000, quantity: 1 }];
describe("códigos postales sin regiones fijas", () => {
  it.each([
    ["0999", "respaldo"], ["1000", "centro"], ["2999", "centro"],
    ["3000", "nacional"], ["4999", "nacional"], ["5000", "cordoba"], ["5999", "cordoba"],
    ["6000", "nacional"], ["7999", "nacional"], ["8000", "patagonia"], ["9499", "patagonia"],
    ["9500", "respaldo"], ["9999", "respaldo"], [" x5000abc ", "cordoba"],
  ])("%s se interpreta como CP, sin inferir provincia", (cp) => expect(postalNumber(cp)).toBe(Number(cp.match(/\d{4}/)![0])));
  it.each(["999", "10000", "xyz5000", "C5000", "5000ABC", "5000<script>"])("rechaza CP inválido %s", cp => expect(() => postalNumber(cp)).toThrow());
  it("CP vacío queda por completar", () => expect(postalNumber("")).toBeNull());
});
describe("cascada y envío", () => {
  it("cupón antes de transferencia, sin descontar envío", () => {
    expect(calculateQuote(items, coupon, true, { p1: 10 }, 1000, 9000)).toMatchObject({ subtotal: 10000, couponDiscount: 2000, netProducts: 8000, transferDiscount: 800, discount: 2800, shipping: 1000, total: 8200 });
  });
  it("cupón no combinable conserva transferencia como medio, sin segundo descuento", () => expect(calculateQuote(items, { ...coupon, combinable_con_transferencia: false }, true, { p1: 10 }, 1000, null)).toMatchObject({ transferDiscount: 0, total: 9000 }));
  it("mínimo del cupón se evalúa antes del descuento", () => expect(calculateQuote(items, { ...coupon, minimum_purchase: 10000 }, false, {}, 1000, null).couponDiscount).toBe(2000));
  it("el umbral incluye todos los descuentos y acepta igualdad", () => {
    expect(calculateQuote(items, coupon, true, { p1: 90 }, 1000, 7900).shipping).toBe(1000);
    expect(calculateQuote(items, coupon, true, { p1: 10 }, 1000, 7200).shipping).toBe(0);
    expect(calculateQuote(items, coupon, false, {}, 1000, 8000).shipping).toBe(0);
    expect(calculateQuote(items, coupon, true, { p1: 10 }, 1000, 8000).shipping).toBe(1000);
    expect(calculateQuote(items, coupon, true, { p1: 10 }, 1000, 8000.01).shipping).toBe(1000);
  });
  it.each([[89999.99,1000],[90000,0],[90000.01,0]])("productos netos %s: envío %s", (net,shipping) => {
    expect(calculateQuote([{productId:"p1",price:net,quantity:1}],null,false,{},1000,90000).shipping).toBe(shipping);
  });
  it("descuento de transferencia puede quitar el beneficio, y el costo de envío no lo concede", () => {
    expect(calculateQuote([{productId:"p1",price:100000,quantity:1}],null,true,{p1:10.01},1000,90000)).toMatchObject({discountedProducts:89990,shipping:1000,total:90990});
    expect(calculateQuote([{productId:"p1",price:125000,quantity:1}],coupon,true,{p1:10},1000,90000)).toMatchObject({couponDiscount:25000,transferDiscount:10000,discountedProducts:90000,shipping:0});
  });
  it("sin tarifa no inventa gratuidad aunque supere 90000", () => expect(calculateQuote([{productId:"p1",price:100000,quantity:1}],null,false,{},null,90000)).toMatchObject({shipping:null,total:null}));
  it("distribuye cupón fijo proporcionalmente y respeta porcentaje por producto", () => {
    const mixed = [...items, { productId: "p2", price: 5000, quantity: 1 }];
    expect(calculateQuote(mixed, { ...coupon, type: "fixed", value: 3000 }, true, { p1: 10, p2: 20 }, 1000, null)).toMatchObject({ couponDiscount: 3000, transferDiscount: 1600, total: 11400 });
  });
  it("no descuenta más del saldo de productos", () => expect(calculateQuote(items, { ...coupon, type: "fixed", value: 20000 }, true, { p1: 10 }, 1000, null)).toMatchObject({ couponDiscount: 10000, transferDiscount: 0, total: 1000 }));
  it("no inventa envío antes del CP", () => expect(calculateQuote(items, null, false, {}, null, 0)).toMatchObject({ total: null, shipping: null }));
  it("conserva centavos al distribuir el cupón", () => expect(calculateQuote([{ productId: "p1", price: 0.01, quantity: 1 }, { productId: "p2", price: 0.02, quantity: 1 }], { ...coupon, type: "fixed", value: 0.01 }, true, { p1: 100, p2: 100 }, 0, null)).toMatchObject({ subtotal: 0.03, couponDiscount: 0.01, transferDiscount: 0.02, total: 0 }));
  it.each([{ is_active: false }, { archived: true }, { minimum_purchase: 10001 }, { expires_at: "2020-01-01T00:00:00Z" }])("rechaza campaña inválida %j", override => expect(() => calculateQuote(items, { ...coupon, ...override }, true, {}, 1000, null)).toThrow());
});
