import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/helpers";
import { revalidatePath, revalidateTag } from "next/cache";
import { SEO_CONFIG_KEYS, seoConfigSchema } from "@/lib/seo/config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { data, error } = await auth.supabase
      .from("system_config")
      .select("config_key, config_value")
      .in("config_key", SEO_CONFIG_KEYS);
    if (error)
      return NextResponse.json(
        { error: "No se pudo cargar la configuración SEO." },
        { status: 500 },
      );
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
    return NextResponse.json(
      { config },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "No se pudo cargar la configuración SEO." },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "El contenido enviado no es válido." },
        { status: 400 },
      );
    }
    const parsed = seoConfigSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    const rows = Object.entries(parsed.data).map(([key, value]) => ({
      config_key: key,
      config_value: JSON.stringify(value),
      category: "seo",
      value_type: Array.isArray(value) ? "array" : "string",
      is_public: ![
        "seo_google_analytics_id",
        "seo_google_tag_manager_id",
        "seo_facebook_pixel_id",
      ].includes(key),
      is_sensitive: false,
      last_modified_by: auth.user.id,
      updated_at: new Date().toISOString(),
    }));
    if (!rows.length)
      return NextResponse.json(
        { error: "No hay cambios SEO para guardar." },
        { status: 400 },
      );
    const { error } = await auth.supabase
      .from("system_config")
      .upsert(rows, { onConflict: "config_key" });
    if (error) {
      console.error("Error guardando SEO:", error.code);
      return NextResponse.json(
        {
          error:
            "No se pudo guardar la configuración SEO. Tus cambios siguen disponibles para reintentar.",
        },
        { status: 500 },
      );
    }
    revalidateTag("seo-config");
    revalidateTag("config");
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, config: parsed.data });
  } catch {
    return NextResponse.json(
      {
        error:
          "No se pudo guardar la configuración SEO. Tus cambios siguen disponibles para reintentar.",
      },
      { status: 500 },
    );
  }
}
