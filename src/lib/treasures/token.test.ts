import { it, expect, vi, afterEach } from "vitest";
import { signTreasure, verifyTreasure } from "./token";
import { safeReturn, TREASURES } from "./catalog";
afterEach(() => vi.unstubAllEnvs());
it("enlace ligado a comprador y Tesoro, expira en quince minutos", () => {
  vi.stubEnv("TREASURE_LINK_SECRET", "s".repeat(32));
  const now = 1000000;
  const token = signTreasure("buyer", "linea-ecos", now);
  expect(verifyTreasure(token, "buyer", "linea-ecos", now)).toBe(true);
  expect(verifyTreasure(token, "other", "linea-ecos", now)).toBe(false);
  expect(verifyTreasure(token, "buyer", "linea-umbral", now)).toBe(false);
  expect(verifyTreasure(token, "buyer", "linea-ecos", now + 900000)).toBe(
    false,
  );
  expect(verifyTreasure(token + "x", "buyer", "linea-ecos", now)).toBe(false);
});
it("retorno local sin redirección externa y diez destinos únicos", () => {
  for (const value of [
    "https://evil.example",
    "//evil.example",
    "/\\evil",
    "/x\n",
  ])
    expect(safeReturn(value)).toBe("/perfil");
  expect(safeReturn("/tesoro-ecos?token=abc")).toBe("/tesoro-ecos?token=abc");
  expect(new Set(TREASURES.map((t) => t.route)).size).toBe(10);
});
