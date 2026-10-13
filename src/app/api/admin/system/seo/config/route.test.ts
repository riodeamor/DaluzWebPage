import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  upsert: vi.fn(),
  from: vi.fn(),
  tag: vi.fn(),
  path: vi.fn(),
}));
vi.mock("@/lib/auth/helpers", () => ({ requireAdmin: mocks.auth }));
vi.mock("next/cache", () => ({
  revalidateTag: mocks.tag,
  revalidatePath: mocks.path,
}));
import { GET, PUT } from "./route";

const request = (body: unknown) =>
  new NextRequest("http://localhost/api/admin/system/seo/config", {
    method: "PUT",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

beforeEach(() => {
  vi.clearAllMocks();
  mocks.from.mockReturnValue({ upsert: mocks.upsert });
  mocks.auth.mockResolvedValue({
    ok: true,
    user: { id: "admin-test" },
    supabase: { from: mocks.from },
  });
  mocks.upsert.mockResolvedValue({ error: null });
});

describe("guardado SEO del Admin", () => {
  it("normaliza palabras clave y guarda las claves permitidas juntas", async () => {
    const response = await PUT(
      request({
        seo_default_keywords: " piel, plantas, , ritual ",
        seo_google_site_verification: "verify_123-abc",
        bank_transfer_cbu: "ignored",
      }),
    );
    expect(response.status).toBe(200);
    expect((await response.json()).config.seo_default_keywords).toEqual([
      "piel",
      "plantas",
      "ritual",
    ]);
    expect(mocks.upsert).toHaveBeenCalledTimes(1);
    const rows = mocks.upsert.mock.calls[0][0];
    expect(rows).toHaveLength(2);
    expect(
      rows.every((row: any) => row.is_public && row.category === "seo"),
    ).toBe(true);
    expect(mocks.path).toHaveBeenCalledWith("/", "layout");
    expect(mocks.tag).toHaveBeenCalledWith("seo-config");
  });

  it("no informa éxito ni invalida caché si falla la base", async () => {
    mocks.upsert.mockResolvedValue({ error: { code: "database-error" } });
    expect((await PUT(request({ seo_default_title: "Da Luz" }))).status).toBe(
      500,
    );
    expect(mocks.tag).not.toHaveBeenCalled();
  });

  it.each([
    { seo_google_site_verification: '<meta name="google-site-verification">' },
    { seo_canonical_url: "javascript:alert(1)" },
    { seo_og_type: "product" },
    { unknown_key: "value" },
  ])("rechaza valores inválidos: %j", async (body) => {
    expect((await PUT(request(body))).status).toBe(400);
    expect(mocks.upsert).not.toHaveBeenCalled();
  });

  it("exige permisos de administración antes de escribir", async () => {
    mocks.auth.mockResolvedValue({
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    });
    expect((await PUT(request({ seo_default_title: "Da Luz" }))).status).toBe(
      403,
    );
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("rechaza JSON incompleto sin escribir", async () => {
    const response = await PUT(
      new NextRequest("http://localhost/api/admin/system/seo/config", {
        method: "PUT",
        body: "{",
      }),
    );
    expect(response.status).toBe(400);
    expect(mocks.upsert).not.toHaveBeenCalled();
  });

  it("devuelve error cuando la conexión falla y conserva la caché", async () => {
    mocks.upsert.mockRejectedValue(new Error("connection failed"));
    expect((await PUT(request({ seo_default_title: "Da Luz" }))).status).toBe(
      500,
    );
    expect(mocks.tag).not.toHaveBeenCalled();
  });

  it("lee solo las claves SEO permitidas y normaliza valores almacenados", async () => {
    const allowed = vi.fn().mockResolvedValue({
      data: [
        { config_key: "seo_default_title", config_value: '"Da Luz"' },
        { config_key: "seo_default_keywords", config_value: ["plantas"] },
      ],
      error: null,
    });
    mocks.from.mockReturnValue({ select: () => ({ in: allowed }) });
    const response = await GET();
    expect(await response.json()).toEqual({
      config: {
        seo_default_title: "Da Luz",
        seo_default_keywords: ["plantas"],
      },
    });
    expect(allowed.mock.calls[0][1]).not.toContain("bank_transfer_cbu");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it("no consulta SEO sin permisos de administración", async () => {
    mocks.auth.mockResolvedValue({
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    });
    expect((await GET()).status).toBe(403);
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("conserva privados los identificadores de analíticas y publica solo los metadatos", async () => {
    expect(
      (
        await PUT(
          request({
            seo_default_title: "Da Luz",
            seo_google_analytics_id: "G-SYNTHETIC",
          }),
        )
      ).status,
    ).toBe(200);
    const rows = mocks.upsert.mock.calls[0][0];
    expect(
      rows.find(
        (row: { config_key: string }) => row.config_key === "seo_default_title",
      ).is_public,
    ).toBe(true);
    expect(
      rows.find(
        (row: { config_key: string }) =>
          row.config_key === "seo_google_analytics_id",
      ).is_public,
    ).toBe(false);
  });
});
