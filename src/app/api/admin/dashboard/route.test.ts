import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
const m = vi.hoisted(() => ({ auth: vi.fn(), from: vi.fn(), orders: [] as Record<string, unknown>[] }));
vi.mock("@/lib/auth/helpers", () => ({ requireAdmin: m.auth }));
import { GET } from "./route";
beforeEach(() => {
  vi.useFakeTimers(); vi.setSystemTime(new Date("2026-10-13T15:00:00Z")); vi.clearAllMocks();
  m.from.mockImplementation((table: string) => { const result = { data: table === "orders" ? m.orders : [], error: null }; const query = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue(result), order: vi.fn().mockResolvedValue(result), then: (resolve: (value: unknown) => unknown) => Promise.resolve(result).then(resolve) }; return query; });
  m.auth.mockResolvedValue({ ok: true, user: {}, supabase: { from: m.from } });
});
afterEach(() => vi.useRealTimers());
describe("indicadores separados de entrega y pago", () => {
  it("cuenta entregas sin convertirlas en ingresos ni sumar comprobantes o reembolsos", async () => {
    const order = (status: string, payment_status: string, total_amount: number) => ({ status, payment_status, total_amount, created_at: "2026-10-13T12:00:00Z", order_items: [{ product_name: "Publicado", quantity: 1, total_price: total_amount }] });
    m.orders = [order("delivered", "pending", 100), order("delivered", "paid", 200), order("processing", "proof_submitted", 300), order("shipped", "paid", 400), order("refunded", "refunded", 500)];
    const original = structuredClone(m.orders);
    const result = await (await GET(new NextRequest("http://localhost/api/admin/dashboard"))).json();
    expect(result.kpis.orders.delivered).toBe(2); expect(result.kpis.orders.completed).toBeUndefined();
    expect(result.kpis.revenue.current).toBe(600); expect(result.charts.ordersStatus.delivered).toBe(2);
    expect(result.charts.topProducts[0].revenue).toBe(600); expect(result.charts.revenueTrend.at(-1).revenue).toBe(600);
    expect(m.orders).toEqual(original);
  });
  it("rechaza acceso no administrador antes de leer el catálogo", async () => {
    m.auth.mockResolvedValue({ ok: false, response: NextResponse.json({}, { status: 403 }) });
    expect((await GET(new NextRequest("http://localhost/api/admin/dashboard"))).status).toBe(403); expect(m.from).not.toHaveBeenCalled();
  });
  it("incluye todo el último día del mes anterior y excluye el mes siguiente", async () => {
    m.orders = [
      { status: "delivered", payment_status: "paid", total_amount: 50, created_at: "2026-09-30T23:30:00", order_items: [] },
      { status: "shipped", payment_status: "paid", total_amount: 70, created_at: "2026-10-01T00:30:00", order_items: [] },
      { status: "paid", payment_status: "paid", total_amount: 90, created_at: "2026-11-01T00:30:00", order_items: [] },
    ];
    const result = await (await GET(new NextRequest("http://localhost/api/admin/dashboard"))).json();
    expect(result.kpis.revenue.previous).toBe(50); expect(result.kpis.revenue.current).toBe(70);
  });
});
