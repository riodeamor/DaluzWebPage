import { validateFrontInfo } from "./front-info";

const NUMERIC_FIELDS = [
  "price",
  "compare_at_price",
  "cost_price",
  "weight",
  "inventory_quantity",
  "low_stock_threshold",
  "shelf_life_months",
  "discount_transfer_percent",
  "discount_cash_percent",
] as const;

const NULLABLE_TEXT_FIELDS = [
  "short_description",
  "description",
  "sku",
  "barcode",
  "featured_image",
  "video_url",
  "audio_url",
  "pdf_url",
  "usage_instructions",
  "precautions",
  "package_characteristics",
  "meta_title",
  "meta_description",
  "category_id",
  "texture",
  "aroma",
  "color",
  "access_id",
  "promotional_tag",
  "published_at",
] as const;

const NON_WRITABLE_FIELDS = [
  "id",
  "created_at",
  "updated_at",
  "categories",
  "product_variants",
  "name_search",
];

const toNumberOrNull = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : null;
};

const normalizeDimensions = (value: unknown): unknown => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "object") return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    try {
      return JSON.parse(trimmed);
    } catch {
      return { raw: trimmed };
    }
  }
  return null;
};

export function sanitizeProductPayload(
  body: Record<string, any>,
): Record<string, any> {
  const output: Record<string, any> = {};

  if ("info_frontal" in body) validateFrontInfo(body.info_frontal);

  for (const [key, value] of Object.entries(body)) {
    if (NON_WRITABLE_FIELDS.includes(key)) continue;
    output[key] = value;
  }

  for (const field of NUMERIC_FIELDS) {
    if (field in output) output[field] = toNumberOrNull(output[field]);
  }

  for (const field of NULLABLE_TEXT_FIELDS) {
    if (field in output) {
      const val = output[field];
      if (
        val === "" ||
        val === "none" ||
        val === "null" ||
        val === "undefined" ||
        (typeof val === "string" && val.trim() === "")
      ) {
        output[field] = null;
      }
    }
  }

  if ("dimensions" in output) {
    output.dimensions = normalizeDimensions(output.dimensions);
  }

  if (output.price === null) output.price = 0;
  if (typeof output.info_frontal === "string" && output.info_frontal.trim() === "") {
    output.info_frontal = null;
  }
  if (output.inventory_quantity === null) output.inventory_quantity = 0;

  for (const field of ["audio_url", "pdf_url"]) {
    if (output[field] && (typeof output[field] !== "string" || !/^https:\/\//i.test(output[field]) || (() => { try { const u = new URL(output[field]); return !!u.username || !!u.password; } catch { return true; } })())) throw new Error("La URL externa debe ser HTTPS válida");
  }
  if ("catalog_term_ids" in output && (!Array.isArray(output.catalog_term_ids) || output.catalog_term_ids.some((id: unknown) => typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)))) throw new Error("Taxonomía inválida");
  if ("treasure_access_ids" in output && (!Array.isArray(output.treasure_access_ids) || output.treasure_access_ids.some((id:unknown)=>typeof id !== "string" || !/^(tesoro-gral|linea-(ecos|umbral|alma-terra|jade|prisma)|kit-(antena|templo|alquimia|aura))$/.test(id)))) throw new Error("Tesoro inválido");
  if ("is_kit" in output && typeof output.is_kit !== "boolean") throw new Error("Indicador de kit inválido");
  return output;
}
