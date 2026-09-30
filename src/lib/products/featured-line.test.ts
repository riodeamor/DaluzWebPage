import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchLineProducts } from "./featured-line";

afterEach(() => vi.unstubAllGlobals());
describe.each(["ecos", "jade-ritual", "umbral-sens", "alma-terra", "prisma"])("línea %s", slug => {
  it("consulta el ID activo y nunca mezcla productos de otras líneas", async () => {
    const categoryId = `category-${slug}`;
    const own = { id: "own", category_id: categoryId };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ products: [own, { id: "other", category_id: "another-line" }] }) });
    vi.stubGlobal("fetch", fetchMock);
    const signal = new AbortController().signal;
    expect(await fetchLineProducts(categoryId, 4, signal)).toEqual([own]);
    const [url, options] = fetchMock.mock.calls[0];
    expect(new URL(url, "http://localhost").searchParams.get("category_id")).toBe(categoryId);
    expect(options).toEqual({ signal, cache: "no-store" });
  });
});
it("no reemplaza una línea ausente o fallida con el catálogo general", async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: false });
  vi.stubGlobal("fetch", fetchMock);
  const signal = new AbortController().signal;
  expect(await fetchLineProducts("", 4, signal)).toEqual([]);
  expect(fetchMock).not.toHaveBeenCalled();
  await expect(fetchLineProducts("ecos", 4, signal)).rejects.toThrow();
  expect(fetchMock).toHaveBeenCalledTimes(1);
});
