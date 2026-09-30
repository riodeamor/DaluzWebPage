/** Fetch one real category, never substitute the general catalogue. */
export async function fetchLineProducts<T extends { category_id: string }>(
  categoryId: string,
  limit: number,
  signal: AbortSignal,
): Promise<T[]> {
  if (!categoryId.trim()) return [];
  const params = new URLSearchParams({ category_id: categoryId, limit: String(limit), in_stock: "true" });
  const response = await fetch(`/api/products?${params}`, { signal, cache: "no-store" });
  if (!response.ok) throw new Error("No se pudieron cargar los productos de la línea");
  const { products } = await response.json();
  if (!Array.isArray(products)) return [];
  return products.filter((product: T) => product.category_id === categoryId);
}
