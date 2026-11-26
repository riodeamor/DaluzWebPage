import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";
const m = vi.hoisted(() => ({ auth: vi.fn(), from: vi.fn(), insert: vi.fn(), update: vi.fn(), eq: vi.fn(), result: { data: { id: "00000000-0000-0000-0000-000000000001", version: 2 }, error: null } as { data: unknown; error: { code: string; message?: string } | null } }));
vi.mock("@/lib/auth/helpers", () => ({ requireAdmin: m.auth }));
vi.mock("next/cache", () => ({ revalidateTag: vi.fn() }));
import { POST, PUT } from "./route";
const id = "00000000-0000-0000-0000-000000000001";
const point = { name: "Río Ceballos", province: "Córdoba", city: "Río Ceballos", address: null, postal_code: null, is_active: false };
const request = (body: unknown) => new Request("http://localhost/api/admin/system/shipping/manual", { method: "POST", body: JSON.stringify(body) });
beforeEach(() => {
  vi.clearAllMocks(); const chain = { insert: m.insert, update: m.update, eq: m.eq, select: vi.fn().mockReturnThis(), maybeSingle: vi.fn(async () => m.result) };
  m.insert.mockReturnValue(chain); m.update.mockReturnValue(chain); m.eq.mockReturnValue(chain); m.from.mockReturnValue(chain);
  m.auth.mockResolvedValue({ ok: true, supabase: { from: m.from } }); m.result = { data: { id, version: 2 }, error: null };
});
describe("gestión manual administrativa", () => {
  it("autentica antes de consultar/escribir", async () => {
    m.auth.mockResolvedValue({ ok: false, response: NextResponse.json({}, { status: 403 }) });
    expect((await POST(request({ kind: "points", values: point }))).status).toBe(403); expect(m.from).not.toHaveBeenCalled();
  });
  it("crea origen incompleto sólo como borrador sin predeterminado ni tarifas", async () => {
    expect((await POST(request({ kind: "points", values: point }))).status).toBe(201);
    expect(m.from).toHaveBeenCalledWith("shipping_dispatch_points"); expect(m.insert).toHaveBeenCalledWith(point); expect(m.from).toHaveBeenCalledTimes(1);
  });
  it("rechaza activación sin dirección y CP", async () => {
    expect((await POST(request({ kind: "points", values: { ...point, is_active: true } }))).status).toBe(400); expect(m.insert).not.toHaveBeenCalled();
  });
  it("edita por id y versión; conflicto no sobrescribe silenciosamente", async () => {
    m.result = { data: null, error: null }; expect((await PUT(request({ kind: "points", id, version: 1, values: point }))).status).toBe(409);
    expect(m.eq).toHaveBeenCalledWith("id", id); expect(m.eq).toHaveBeenCalledWith("version", 1);
  });
  it("propaga el conflicto de rangos validado por SQL", async () => {
    m.result = { data: null, error: { code: "P0001", message: "Los rangos de peso se superponen" } };
    const result = await POST(request({ kind: "rates", values: { service_id: id, weight_from_g: 0, weight_to_g: 1000, rate_ars: 12, confirmed_reference: "Sintético", confirmed_on: "2026-10-13", is_active: true } }));
    expect(result.status).toBe(400); expect((await result.json()).error).toContain("superponen");
  });
  it("no permite elegir tablas, snapshot de pedido ni modificar campos antiguos de peso", async () => {
    expect((await POST(request({ kind: "orders", values: {} }))).status).toBe(400);
    expect((await POST(request({ kind: "weights", values: { product_id: id, variant_id: null, weight_g: 500, weight: 0.5, is_active: true } }))).status).toBe(400);
    expect(m.from).not.toHaveBeenCalled();
  });
});
