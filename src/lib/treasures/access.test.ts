import { vi, it, expect, beforeEach } from "vitest";
const state = vi.hoisted(() => ({
  user: "buyer" as string | null,
  grants: ["linea-ecos"] as string[],
}));
vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw Error("REDIRECT " + url);
  },
}));
vi.mock("@/utils/supabase/server", () => ({
  createClient: async () => ({
    auth: {
      getUser: async () => ({
        data: { user: state.user ? { id: state.user } : null },
      }),
    },
    from: (table: string) => {
      const query: any = {
        select: () => query,
        eq: () => query,
        is: async () => ({
          data: state.grants.map((access_id) => ({ access_id })),
          error: null,
        }),
        single: async () => ({
          data: { audio_url: "https://media.example/audio.mp3", pdf_url: null },
          error: null,
        }),
      };
      return query;
    },
  }),
}));
import { protectTreasure } from "./access";
import type { TesoroData } from "@/components/tesoros/TesoroLayout";
const treasure = { audios: [{ title: "Medicina" }] } as TesoroData;
beforeEach(() =>
  Object.assign(state, { user: "buyer", grants: ["linea-ecos"] }),
);
it("anónimo y QR compartido requieren cuenta compradora", async () => {
  state.user = null;
  await expect(protectTreasure("linea-ecos", treasure)).rejects.toThrow(
    "/login?redirect=%2Ftesoro-ecos",
  );
  state.user = "other";
  state.grants = [];
  await expect(protectTreasure("linea-ecos", treasure)).rejects.toThrow(
    "tesoro-no-disponible",
  );
});
it("permiso revocado bloquea; permiso vigente entrega URL externa", async () => {
  const secured = await protectTreasure("linea-ecos", treasure);
  expect(secured.treasure.audios[0].src).toBe(
    "https://media.example/audio.mp3",
  );
  state.grants = [];
  await expect(protectTreasure("linea-ecos", treasure)).rejects.toThrow(
    "REDIRECT",
  );
});
