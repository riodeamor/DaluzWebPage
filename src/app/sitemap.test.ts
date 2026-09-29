import { beforeEach, describe, expect, it, vi } from "vitest";
import sitemap from "./sitemap";
const mocks = vi.hoisted(() => ({ eq: vi.fn() }));
vi.mock("@/utils/supabase/server", () => ({ createClient: async () => ({
  from: () => ({ select: () => ({ eq: mocks.eq }) }),
}) }));
beforeEach(() => vi.resetAllMocks());
describe("store sitemap", () => {
  it("includes the store and only valid active product URLs", async () => {
    mocks.eq.mockResolvedValue({ data: [{ slug: "serum", updated_at: "2026-09-29" }, { slug: "", updated_at: null }], error: null });
    const entries = await sitemap();
    expect(mocks.eq).toHaveBeenCalledWith("status", "active");
    expect(entries).toContainEqual(expect.objectContaining({ url: "https://daluzconsciente.com/tienda", priority: 0.9 }));
    expect(entries).toContainEqual(expect.objectContaining({ url: "https://daluzconsciente.com/productos/serum" }));
    expect(entries).toHaveLength(4);
  });
  it("does not mask a database failure as an empty catalog", async () => {
    mocks.eq.mockResolvedValue({ data: null, error: { message: "Database unavailable" } });
    await expect(sitemap()).rejects.toThrow("sitemap");
  });
});
