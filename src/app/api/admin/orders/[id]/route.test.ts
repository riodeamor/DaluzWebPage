import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
const m = vi.hoisted(() => ({ auth: vi.fn(), service: vi.fn(), update: vi.fn(), eq: vi.fn(), single: vi.fn(), delivery: vi.fn(), shipping: vi.fn() }));
vi.mock("@/lib/auth/helpers", () => ({ requireAdmin: m.auth, getServiceClient: m.service }));
vi.mock("@/lib/email/notifications", () => ({ EmailNotificationService: { sendDeliveryConfirmation: m.delivery, sendShippingNotification: m.shipping } }));
import { PATCH } from "./route";
const call = (body: unknown) => PATCH(new NextRequest("http://localhost/api/admin/orders/o1", { method: "PATCH", body: JSON.stringify(body) }), { params: { id: "o1" } });
beforeEach(() => {
  vi.clearAllMocks(); m.single.mockReset();
  const chain = { select: vi.fn().mockReturnThis(), eq: m.eq, single: m.single, update: m.update };
  m.eq.mockReturnValue(chain); m.update.mockReturnValue(chain); m.service.mockReturnValue({ from: () => chain });
  m.auth.mockResolvedValue({ ok: true, supabase: { from: () => chain } });
  m.single.mockResolvedValueOnce({ data: { status: "shipped", payment_status: "paid", delivered_at: null }, error: null })
    .mockResolvedValueOnce({ data: { id: "o1", status: "delivered", payment_status: "paid" }, error: null })
    .mockResolvedValueOnce({ data: null, error: null });
});
describe("entrega separada del pago", () => {
  it("actualiza entrega y fecha sin escribir pago ni ejecutar stock/pago RPC", async () => {
    expect((await call({ status: "delivered" })).status).toBe(200);
    const update = m.update.mock.calls[0][0]; expect(update.status).toBe("delivered"); expect(update.delivered_at).toEqual(expect.any(String)); expect(update).not.toHaveProperty("payment_status");
    expect(m.eq).toHaveBeenCalledWith("payment_status", "paid"); expect(m.eq).toHaveBeenCalledWith("status", "shipped");
  });
  it.each(["pending", "awaiting_transfer", "proof_submitted", "failed", "refunded", "partially_refunded"])("pago %s no habilita nueva entrega ni correo", async payment_status => {
    m.single.mockReset().mockResolvedValueOnce({ data: { status: "processing", payment_status }, error: null });
    const response = await call({ status: "delivered" }); expect(response.status).toBe(409); expect(m.update).not.toHaveBeenCalled(); expect(m.delivery).not.toHaveBeenCalled(); expect(m.shipping).not.toHaveBeenCalled();
  });
  it("un pedido aún no pagado tampoco habilita enviado", async () => {
    m.single.mockReset().mockResolvedValueOnce({ data: { status: "processing", payment_status: "awaiting_transfer" }, error: null }); expect((await call({ status: "shipped" })).status).toBe(409); expect(m.update).not.toHaveBeenCalled();
  });
  it("no mezcla entrega y cambios de pago en una misma petición",async()=>{expect((await call({status:"delivered",payment_status:"failed"})).status).toBe(400);expect(m.update).not.toHaveBeenCalled();});
  it("si el pago o estado cambió entre lectura y actualización pide revisión",async()=>{
    m.single.mockReset().mockResolvedValueOnce({data:{status:"shipped",payment_status:"paid"},error:null}).mockResolvedValueOnce({data:null,error:{code:"PGRST116"}});
    expect((await call({status:"delivered"})).status).toBe(409);expect(m.delivery).not.toHaveBeenCalled();
  });
  it("conserva históricos entregados no pagados y permite editar sólo su seguimiento",async()=>{
    m.single.mockReset().mockResolvedValueOnce({data:{status:"delivered",payment_status:"pending",delivered_at:"2026-01-01"},error:null}).mockResolvedValueOnce({data:{id:"o1",status:"delivered",payment_status:"pending"},error:null});
    expect((await call({tracking_number:"Referencia sintética"})).status).toBe(200);expect(m.update.mock.calls[0][0]).not.toHaveProperty("status");expect(m.update.mock.calls[0][0]).not.toHaveProperty("payment_status");expect(m.delivery).not.toHaveBeenCalled();
  });
  it("falla cerrado si no puede leer el estado actual",async()=>{m.single.mockReset().mockResolvedValueOnce({data:null,error:{code:"42501"}});expect((await call({status:"delivered"})).status).toBe(503);expect(m.update).not.toHaveBeenCalled();});
  it("requiere admin antes de cualquier consulta",async()=>{m.auth.mockResolvedValue({ok:false,response:NextResponse.json({}, {status:403})});expect((await call({status:"delivered"})).status).toBe(403);expect(m.single).not.toHaveBeenCalled();expect(m.service).not.toHaveBeenCalled();});
  it.each([{ status: "completed" }, { status: "paid" }, { payment_status: "paid" }, { status: "invalid" }])("rechaza estados inválidos y aprobación directa %j", async body => {
    expect((await call(body)).status).toBe(400); expect(m.update).not.toHaveBeenCalled();
  });
});
