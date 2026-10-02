import { beforeEach, describe, it, expect, vi } from "vitest";
const mocks = vi.hoisted(() => ({ admin: true, from: vi.fn(), write: vi.fn(), rows: [{ id: "00000000-0000-0000-0000-000000000001" }] }));
vi.mock("@/lib/auth/helpers", () => ({ requireAdmin: async () => mocks.admin ? { ok: true, supabase: { from: mocks.from } } : { ok: false, response: new Response("Acceso denegado", { status: 403 }) } }));
import { commerceCrud } from "./admin-crud";
import { couponSchema, announcementSchema } from "./schemas";
const coupons = commerceCrud("coupons", couponSchema), notices = commerceCrud("announcements", announcementSchema);
const id = "00000000-0000-0000-0000-000000000001";
const req = (body: unknown) => new Request("http://localhost/api/admin/cupones", { method: "POST", body: JSON.stringify(body) });
beforeEach(() => {
  vi.clearAllMocks(); mocks.admin = true;
  mocks.from.mockImplementation(() => {
    const query = { select: () => query, eq: () => query, order: () => query,
      insert: (values: unknown) => { mocks.write(values); return query; },
      update: (values: unknown) => { mocks.write(values); return query; },
      delete: () => { mocks.write("delete"); return query; },
      single: async () => ({ data: mocks.rows[0], error: null }),
      maybeSingle: async () => ({ data: mocks.rows[0], error: null }),
      then: (resolve: (value: unknown) => unknown) => resolve({ data: mocks.rows, error: null }),
    }; return query;
  });
});
describe("CRUD protegido", () => {
  it.each(["GET", "POST", "PUT", "DELETE"] as const)("%s requiere Admin antes de consultar/escribir", async method => {
    mocks.admin = false;
    expect((await coupons[method](req({}))).status).toBe(403);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("normaliza código, default combinable y descarta campos privilegiados", async () => {
    expect((await coupons.POST(req({ code: " promo ", type: "percent", value: 10, archived: true, id, usage_count: 999 }))).status).toBe(201);
    expect(mocks.write).toHaveBeenCalledWith({ code: "PROMO", type: "percent", value: 10, minimum_purchase: 0, expires_at: null, usage_limit: null, is_active: true, combinable_con_transferencia: true });
  });
  it.each([{ type: "percent", value: 101 }, { type: "fixed", value: -10 }, { type: "percent", value: 10, usage_limit: 0 }, { type: "percent", value: 10.001 }])("rechaza descuento/cupo inválido %j", async fields => {
    expect((await coupons.POST(req({ code: "PROMO", ...fields }))).status).toBe(400);
    expect(mocks.write).not.toHaveBeenCalled();
  });
  it("permite desactivar la combinación y pausar", async () => {
    expect((await coupons.PUT(req({ id, code: "PROMO", type: "fixed", value: 10, combinable_con_transferencia: false, is_active: false }))).status).toBe(200);
    expect(mocks.write).toHaveBeenCalledWith(expect.objectContaining({ combinable_con_transferencia: false, is_active: false }));
  });
  it("baja cupón sin borrar el historial", async () => {
    expect((await coupons.DELETE(new Request(`http://localhost/api/admin/cupones?id=${id}`))).status).toBe(200);
    expect(mocks.write).toHaveBeenCalledWith({ archived: true, is_active: false });
  });
  it.each(["javascript:alert(1)", "//evil.test", "/\\evil.test", "http://evil.test"])("rechaza enlace inseguro %s", async link => {
    expect((await notices.POST(req({ message: "Promoción", link }))).status).toBe(400);
    expect(mocks.write).not.toHaveBeenCalled();
  });
  it("crea y pausa avisos con enlace y orden", async () => {
    expect((await notices.POST(req({ message: "Promoción", link: "/productos", sort_order: 2 }))).status).toBe(201);
    expect((await notices.PUT(req({ id, message: "Promoción", link: "/productos", sort_order: 2, is_active: false }))).status).toBe(200);
    expect(mocks.write).toHaveBeenLastCalledWith({ message: "Promoción", link: "/productos", sort_order: 2, is_active: false });
  });
});
