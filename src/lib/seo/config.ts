import { z } from "zod";

const text = z.string().max(5000);
function isWebUrl(value: string) {
  try {
    const parsed = new URL(value);
    return (
      ["http:", "https:"].includes(parsed.protocol) &&
      Boolean(parsed.hostname) &&
      !/\s/.test(value)
    );
  } catch {
    return false;
  }
}
const url = z
  .string()
  .max(2048)
  .refine(
    (value) => !value || isWebUrl(value),
    "Ingresá una URL completa (https://…).",
  );
export const seoConfigSchema = z
  .object({
    seo_default_title: text.optional(),
    seo_default_description: text.optional(),
    seo_default_keywords: z
      .union([z.string(), z.array(z.string())])
      .transform((value) =>
        (Array.isArray(value) ? value : value.split(","))
          .map((word) => word.trim())
          .filter(Boolean),
      )
      .optional(),
    seo_canonical_url: url.optional(),
    seo_og_title: text.optional(),
    seo_og_description: text.optional(),
    seo_og_image_url: z
      .string()
      .max(2048)
      .refine(
        (value) =>
          !value ||
          isWebUrl(value) ||
          (/^\/(?!\/)/.test(value) && !/[\\\s]/.test(value)),
        "Ingresá una URL web o una ruta de imagen del sitio.",
      )
      .optional(),
    seo_og_type: z.enum(["website", "article"]).optional(),
    seo_twitter_card_type: z
      .enum(["summary", "summary_large_image"])
      .optional(),
    seo_google_analytics_id: text.optional(),
    seo_google_tag_manager_id: text.optional(),
    seo_facebook_pixel_id: text.optional(),
    seo_bing_webmaster_id: text.optional(),
    seo_google_site_verification: z
      .string()
      .trim()
      .max(255)
      .regex(
        /^[A-Za-z0-9_-]*$/,
        "Pegá solo el código de verificación, sin la etiqueta HTML.",
      )
      .optional(),
  })
  .strip();

export type SeoConfig = z.infer<typeof seoConfigSchema>;
export const SEO_CONFIG_KEYS = Object.keys(seoConfigSchema.shape);
