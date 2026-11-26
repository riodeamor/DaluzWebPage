import { describe, expect, it } from "vitest";
import { parseManual } from "./manual-shipping";
const uuid = "00000000-0000-0000-0000-000000000001";
describe("configuración manual en gramos", () => {
  it.each(["Río Ceballos", "Unquillo", "Córdoba Capital"])("admite %s sólo como borrador sin dirección/CP", name => {
    const point = { name, province: "Córdoba", city: name, address: null, postal_code: null, is_active: false };
    expect(parseManual("points", point).success).toBe(true); expect(parseManual("points", { ...point, is_active: true }).success).toBe(false);
  });
  it("conserva el CP como texto sin perder ceros", () => {
    const result = parseManual("points", { name: "Ejemplo", province: "Córdoba", city: "Córdoba", address: "Dirección sintética", postal_code: "0123", is_active: true });
    expect(result.success && "postal_code" in result.data && result.data.postal_code).toBe("0123");
  });
  it("tarifa ausente no es cero; cero explícito exige confirmación", () => {
    const rate = { service_id: uuid, weight_from_g: 0, weight_to_g: 1000, rate_ars: null, confirmed_reference: "Confirmación sintética", confirmed_on: "2026-10-13", is_active: true };
    expect(parseManual("rates", rate).success).toBe(false); expect(parseManual("rates", { ...rate, rate_ars: 0 }).success).toBe(true);
    expect(parseManual("rates", { ...rate, rate_ars: 1, confirmed_reference: null }).success).toBe(false);
  });
  it("rechaza cortes invertidos e iguales incluso en borradores", () => {
    const rate = { service_id: null, weight_from_g: 1000, weight_to_g: 1000, rate_ars: null, confirmed_reference: null, confirmed_on: null, is_active: false };
    expect(parseManual("rates", rate).success).toBe(false); expect(parseManual("rates", { ...rate, weight_to_g: 999 }).success).toBe(false);
  });
  it.each([null, 0, -1, 1.5])("un peso activo requiere gramos enteros positivos: %j", weight_g => {
    expect(parseManual("weights", { product_id: uuid, variant_id: null, weight_g, is_active: true }).success).toBe(false);
  });
  it("no convierte el peso antiguo ni permite campos extra", () => {
    expect(parseManual("weights", { product_id: uuid, variant_id: null, weight_g: 500, weight: 0.5, is_active: true }).success).toBe(false);
  });
  it("sucursal incompleta no se activa", () => {
    const service = { name: "Sucursal", region_id: uuid, dispatch_point_id: uuid, carrier_id: uuid, modality: "branch", branch_name: null, branch_address: null, branch_postal_code: null, eligible_for_free_shipping: false, is_active: true };
    expect(parseManual("services", service).success).toBe(false);
  });
});
