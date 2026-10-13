import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { SEO_CONFIG_KEYS, seoConfigSchema } from "./config";

export const getSeoConfig = unstable_cache(
  async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return {};
    const client = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await client
      .from("system_config")
      .select("config_key, config_value")
      .eq("is_public", true)
      .in("config_key", SEO_CONFIG_KEYS);
    if (error)
      throw new Error("No se pudo cargar la configuración pública SEO.");
    const config: Record<string, unknown> = {};
    for (const row of data || []) {
      try {
        config[row.config_key] =
          typeof row.config_value === "string"
            ? JSON.parse(row.config_value)
            : row.config_value;
      } catch {
        config[row.config_key] = row.config_value;
      }
    }
    // One obsolete value must not suppress valid metadata or verification codes.
    const valid: Record<string, unknown> = {};
    for (const key of SEO_CONFIG_KEYS) {
      const field =
        seoConfigSchema.shape[key as keyof typeof seoConfigSchema.shape];
      const parsed = field.safeParse(config[key]);
      if (parsed.success && parsed.data !== undefined) valid[key] = parsed.data;
    }
    return seoConfigSchema.parse(valid);
  },
  ["seo-config"],
  { revalidate: 300, tags: ["seo-config", "config"] },
);
