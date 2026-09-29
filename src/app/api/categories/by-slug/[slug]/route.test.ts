import { NextRequest } from "next/server";
import { beforeEach, expect, it, vi } from "vitest";
import { GET } from "./route";

const mocks = vi.hoisted(() => ({ client: vi.fn() }));
vi.mock("@/utils/supabase/server", () => ({ createClient: mocks.client }));
beforeEach(() => vi.resetAllMocks());

it.each(["linea-kits-y-experiencia", "kits-y-ceremonias", "categoria-nueva"])("resolves %s from the active database record", async slug => {
  const category = { id: "2196c12a-3e6a-42b1-b137-770837530f46", slug: slug === "linea-kits-y-experiencia" ? "kits-y-ceremonias" : slug };
  const query = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: category, error: null }) };
  mocks.client.mockResolvedValue({ from: () => query });
  const response = await GET(new NextRequest(`http://localhost/api/categories/by-slug/${slug}`), { params: { slug } });
  expect(response.status).toBe(200);
  expect((await response.json()).category).toEqual(category);
  expect(query.eq).toHaveBeenCalledWith("is_active", true);
  expect(query.eq).toHaveBeenCalledWith(slug === "linea-kits-y-experiencia" ? "id" : "slug", slug === "linea-kits-y-experiencia" ? category.id : slug);
});

it("returns 404 for missing or inactive categories", async () => {
  const query = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }) };
  mocks.client.mockResolvedValue({ from: () => query });
  expect((await GET(new NextRequest("http://localhost/api/categories/by-slug/missing"), { params: { slug: "missing" } })).status).toBe(404);
});
