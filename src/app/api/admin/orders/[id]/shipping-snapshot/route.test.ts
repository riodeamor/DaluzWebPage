import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";
const m = vi.hoisted(() => ({ auth: vi.fn(), service: vi.fn(), single: vi.fn() }));
vi.mock("@/lib/auth/helpers", () => ({ requireAdmin: m.auth, getServiceClient: m.service }));
import { GET } from "./route";
const call = () => GET(new Request("http://localhost/api/admin/orders/example/shipping-snapshot"), { params: { id: "example" } });
beforeEach(() => { vi.clearAllMocks(); m.single.mockReset(); m.auth.mockResolvedValue({ ok: true }); const chain = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), maybeSingle: m.single }; m.service.mockReturnValue({ from: () => chain }); m.single.mockResolvedValueOnce({ data: { id: "example" }, error: null }).mockResolvedValue({ data: null, error: null }); });
describe("lectura administrativa del origen conservado", () => {
  it("rechaza antes de acceder al backend", async () => { m.auth.mockResolvedValue({ ok: false, response: NextResponse.json({}, { status: 403 }) }); expect((await call()).status).toBe(403); expect(m.service).not.toHaveBeenCalled(); });
  it("pedidos históricos siguen sin snapshot; no recalcula ni crea uno", async () => { const response = await call(); expect(await response.json()).toEqual({ snapshot: null }); expect(response.headers.get("cache-control")).toBe("private, no-store"); });
  it("devuelve la copia privada guardada, sin consultar configuración actual", async () => { const saved = { configuration: { origin: { name: "Origen anterior" } } }; m.single.mockReset().mockResolvedValueOnce({ data: { id: "example" }, error: null }).mockResolvedValueOnce({ data: { snapshot: saved }, error: null }); expect(await (await call()).json()).toEqual({ snapshot: saved }); expect(m.service).toHaveBeenCalledTimes(1); });
  it("un fallo leyendo la copia privada no se presenta como pedido histórico sin datos",async()=>{m.single.mockReset().mockResolvedValueOnce({data:{id:"example"},error:null}).mockResolvedValueOnce({data:null,error:{code:"42501"}});expect((await call()).status).toBe(503);});
});
