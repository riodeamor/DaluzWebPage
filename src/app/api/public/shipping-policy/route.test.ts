import { beforeEach, describe, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({ service: vi.fn(), from: vi.fn(), rpc: vi.fn(), policy: null as unknown, legacy: null as unknown }));
vi.mock("@/lib/auth/helpers", () => ({ getServiceClient: m.service }));
import { GET } from "./route";
beforeEach(() => {
  vi.clearAllMocks(); m.policy = { data: { enabled: true, free_shipping_enabled:true, free_shipping_threshold_ars: 90000 }, error: null };
  m.legacy = { data: { config_value: "50001" }, error: null };
  m.from.mockImplementation((table: string) => {
    const chain = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), maybeSingle: vi.fn(async () => table === "shipping_policy" ? m.policy : m.legacy) };
    return chain;
  }); m.rpc.mockResolvedValue({data:true,error:null}); m.service.mockReturnValue({ from: m.from, rpc:m.rpc });
});
describe("umbral público del anuncio", () => {
  it("publica 90000 de la política activa sin leer la configuración antigua", async () => {
    const response = await GET(); expect(await response.json()).toEqual({ freeShippingThreshold: 90000 });
    expect(m.from).toHaveBeenCalledTimes(1); expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it("muestra el cambio editable sin cachear un importe anterior", async () => {
    await GET(); m.policy = { data: { enabled: true, free_shipping_enabled:true, free_shipping_threshold_ars: "100000.00" }, error: null };
    expect(await (await GET()).json()).toEqual({ freeShippingThreshold: 100000 });
  });
  it.each([{ data: null, error: { code: "42P01" } }, { data: null, error: { code: "PGRST205" } }])("conserva el umbral publicado cuando la política nueva no existe", async result => {
    m.policy = result; expect(await (await GET()).json()).toEqual({ freeShippingThreshold: 50001 });
  });
  it("modelo desactivado también oculta el beneficio sin volver al importe antiguo",async()=>{m.policy={data:{enabled:false,free_shipping_enabled:true,free_shipping_threshold_ars:90000},error:null};expect(await (await GET()).json()).toEqual({freeShippingThreshold:null});expect(m.from).toHaveBeenCalledTimes(1);});
  it("beneficio desactivado no vuelve al umbral antiguo",async()=>{m.policy={data:{enabled:true,free_shipping_enabled:false,free_shipping_threshold_ars:90000},error:null};expect(await (await GET()).json()).toEqual({freeShippingThreshold:null});expect(m.from).toHaveBeenCalledTimes(1);expect(m.rpc).not.toHaveBeenCalled();});
  it("sin servicio elegible completo oculta el anuncio",async()=>{m.rpc.mockResolvedValue({data:false,error:null});expect(await (await GET()).json()).toEqual({freeShippingThreshold:null});});
  it("ante un error de lectura no anuncia silenciosamente el umbral antiguo", async () => {
    m.policy = { data: null, error: { code: "42501" } }; expect((await GET()).status).toBe(503); expect(m.from).toHaveBeenCalledTimes(1);
  });
  it("sin umbral público válido devuelve null, nunca cero por ausencia", async () => {
    m.policy = { data: { enabled: false }, error: null }; m.legacy = { data: { config_value: "" }, error: null };
    expect(await (await GET()).json()).toEqual({ freeShippingThreshold: null });
  });
});
