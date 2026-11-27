import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TesoroData } from "@/components/tesoros/TesoroLayout";
import { protectTreasure } from "./access";

const { auth, rpc, selectMedia, selectRights, serviceClient } = vi.hoisted(() => ({
  auth: vi.fn(), rpc: vi.fn(), selectMedia: vi.fn(),
  selectRights: vi.fn(), serviceClient: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => { throw new Error(url); },
}));
vi.mock("@/utils/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser: auth },
    rpc,
    from: (table: string) => table === "treasure_grants"
      ? { select: () => ({ eq: () => ({ is: selectRights }) }) }
      : { select: () => ({ eq: () => ({ single: selectMedia }) }) },
  }),
}));
vi.mock("@/lib/auth/helpers", () => ({ getServiceClient: serviceClient }));

const treasure = { audios: [] } as unknown as TesoroData;

describe("vista previa de Tesoros", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    auth.mockResolvedValue({ data: { user: { id: "viewer" } } });
    serviceClient.mockReturnValue({
      from: () => ({ select: () => ({ eq: () => ({ single: selectMedia }) }) }),
    });
  });

  it("abre el contenido para un administrador aunque falte el catálogo de archivos", async () => {
    rpc.mockResolvedValue({ data: true, error: null });
    selectMedia.mockResolvedValue({ data: null, error: { code: "PGRST205" } });
    await expect(protectTreasure("linea-ecos", treasure, undefined, true))
      .resolves.toEqual({ treasure, pdfUrl: null });
    expect(selectRights).not.toHaveBeenCalled();
  });

  it("rechaza la vista previa a un cliente y ante errores del control de rol", async () => {
    for (const result of [{ data: false, error: null }, { data: null, error: {} }]) {
      rpc.mockResolvedValue(result);
      await expect(protectTreasure("linea-ecos", treasure, undefined, true))
        .rejects.toThrow("/perfil?aviso=tesoro-no-disponible");
    }
    expect(serviceClient).not.toHaveBeenCalled();
  });

  it("pide iniciar sesión y conserva el destino de la vista previa", async () => {
    auth.mockResolvedValue({ data: { user: null } });
    await expect(protectTreasure("linea-ecos", treasure, undefined, true))
      .rejects.toThrow("/login?redirect=%2Ftesoro-ecos%3Fpreview%3Dadmin");
    expect(rpc).not.toHaveBeenCalled();
  });

  it("sigue exigiendo un permiso de compra en la vista normal", async () => {
    selectRights.mockResolvedValue({ data: [], error: null });
    await expect(protectTreasure("linea-ecos", treasure))
      .rejects.toThrow("/perfil?aviso=tesoro-no-disponible");
    expect(rpc).not.toHaveBeenCalled();
  });
});
