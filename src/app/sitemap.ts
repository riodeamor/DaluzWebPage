import type { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://daluzconsciente.com";
  const supabase = await createClient();
  const { data, error } = await supabase.from("products")
    .select("slug, updated_at").eq("status", "active");
  if (error) throw new Error("No se pudo consultar el catalogo para sitemap");
  return [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/tienda`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: "daily", priority: 0.8 },
    ...(data ?? []).filter(product => product.slug).map(product => ({
      url: `${baseUrl}/productos/${encodeURIComponent(product.slug)}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      ...(product.updated_at && !Number.isNaN(Date.parse(product.updated_at))
        ? { lastModified: new Date(product.updated_at) } : {}),
    })),
  ];
}
