import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ client: vi.fn(), allowed: vi.fn() }));
vi.mock("next/cache", () => ({
  unstable_cache: (callback: () => unknown) => callback,
}));
vi.mock("@supabase/supabase-js", () => ({ createClient: mocks.client }));
import { getSeoConfig } from "./server";

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.example.com");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "synthetic-test-key");
  mocks.client.mockReturnValue({
    from: () => ({ select: () => ({ eq: () => ({ in: mocks.allowed }) }) }),
  });
});
afterEach(() => vi.unstubAllEnvs());

describe("lectura pública SEO", () => {
  it("usa solo la credencial pública y descarta valores obsoletos sin perder los válidos", async () => {
    mocks.allowed.mockResolvedValue({
      data: [
        {
          config_key: "seo_default_title",
          config_value: '"Da Luz administrado"',
        },
        { config_key: "seo_canonical_url", config_value: "https://" },
        {
          config_key: "seo_google_site_verification",
          config_value: "valid_123",
        },
        { config_key: "seo_og_type", config_value: "product" },
      ],
      error: null,
    });
    expect(await getSeoConfig()).toEqual({
      seo_default_title: "Da Luz administrado",
      seo_google_site_verification: "valid_123",
    });
    expect(mocks.client).toHaveBeenCalledWith(
      "https://test.example.com",
      "synthetic-test-key",
      { auth: { persistSession: false } },
    );
  });

  it("sin configuración de conexión permite los metadatos predeterminados", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    expect(await getSeoConfig()).toEqual({});
    expect(mocks.client).not.toHaveBeenCalled();
  });

  it("propaga errores para que el layout conserve sus metadatos predeterminados", async () => {
    mocks.allowed.mockResolvedValue({
      data: null,
      error: { code: "database-error" },
    });
    await expect(getSeoConfig()).rejects.toThrow("configuración pública SEO");
  });
});
