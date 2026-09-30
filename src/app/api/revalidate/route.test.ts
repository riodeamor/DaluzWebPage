import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({ parse: vi.fn(), tag: vi.fn(), path: vi.fn(), from: vi.fn() }));
vi.mock("next-sanity/webhook", () => ({ parseBody: mocks.parse }));
vi.mock("next/cache", () => ({ revalidateTag: mocks.tag, revalidatePath: mocks.path }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ from: mocks.from }) }));
beforeEach(() => {
  vi.resetModules(); vi.clearAllMocks();
  vi.stubEnv("SANITY_WEBHOOK_SECRET", "test-secret");
  const chain = { insert: vi.fn().mockResolvedValue({}), update: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), order: vi.fn().mockReturnThis(), limit: vi.fn().mockResolvedValue({}) };
  mocks.from.mockReturnValue(chain);
});
afterEach(() => vi.unstubAllEnvs());
const request = () => new NextRequest("http://localhost/api/revalidate", { method: "POST", body: "{}" });
describe("publicación de tienda en Sanity", () => {
  it("invalida datos y rutas de tienda con una publicación firmada", async () => {
    mocks.parse.mockResolvedValue({ isValidSignature: true, body: { _type: "tiendaSettings", _id: "tienda" } });
    const { POST } = await import("./route");
    expect((await POST(request())).status).toBe(200);
    expect(mocks.tag).toHaveBeenCalledWith("tienda-settings");
    expect(mocks.path).toHaveBeenCalledWith("/api/sanity/tienda-settings");
    expect(mocks.path).toHaveBeenCalledWith("/tienda");
  });
  it("rechaza firmas inválidas sin invalidar ni escribir logs", async () => {
    mocks.parse.mockResolvedValue({ isValidSignature: false, body: {} });
    const { POST } = await import("./route");
    expect((await POST(request())).status).toBe(401);
    expect(mocks.tag).not.toHaveBeenCalled();
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("falla de forma explícita si falta el secreto", async () => {
    vi.stubEnv("SANITY_WEBHOOK_SECRET", "");
    const { POST } = await import("./route");
    expect((await POST(request())).status).toBe(503);
    expect(mocks.parse).not.toHaveBeenCalled();
  });
});
