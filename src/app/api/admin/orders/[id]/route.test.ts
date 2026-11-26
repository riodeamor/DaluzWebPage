import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const m = vi.hoisted(() => ({ auth: vi.fn(), service: vi.fn(), update: vi.fn(), single: vi.fn(), delivery: vi.fn(), shipping: vi.fn() }));
vi.mock("@/lib/auth/helpers", () => ({ requireAdmin: m.auth, getServiceClient: m.service }));
vi.mock("@/lib/email/notifications", () => ({ EmailNotificationService: { sendDeliveryConfirmation: m.delivery, sendShippingNotification: m.shipping } }));
import { PATCH } from "./route";
const call = (body: unknown) => PATCH(new NextRequest("http://localhost/api/admin/orders/o1", { method: "PATCH", body: JSON.stringify(body) }), { params: { id: "o1" } });
beforeEach(() => {
  vi.clearAllMocks(); const chain = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: m.single, update: m.update };
  m.update.mockReturnValue(chain); m.service.mockReturnValue({ from: () => chain });
  m.auth.mockResolvedValue({ ok: true, supabase: { from: () => chain } });
  m.single.mockResolvedValueOnce({ data: { status: "shipped", delivered_at: null }, error: null })
    .mockResolvedValueOnce({ data: { id: "o1", status: "delivered", payment_status: "pending" }, error: null })
    .mockResolvedValueOnce({ data: null, error: null });
});
describe("marcar entrega", () => {
  it("actualiza entrega y fecha sin tocar pago ni RPC de stock", async () => {
    expect((await call({ status: "delivered" })).status).toBe(200);
    const update = m.update.mock.calls[0][0]; expect(update.status).toBe("delivered"); expect(update.delivered_at).toEqual(expect.any(String));
    expect(update).not.toHaveProperty("payment_status");
  });
  it.each([{ status: "completed" }, { status: "paid" }, { payment_status: "paid" }, { status: "invalid" }])("rechaza estados inválidos o aprobación directa de pago %j", async body => {
    expect((await call(body)).status).toBe(400); expect(m.update).not.toHaveBeenCalled();
  });
});
