import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/helpers";
import { shippingRegionSchema, shippingPolicySchema } from "@/lib/commerce/shipping";
const fields = "id,name,rate_ars,carrier_id,is_active,coverage,version";
function writeError(error: { code?: string; message?: string }) {
  const message = error.code === "P0001" ? error.message : error.code === "23505" ? "Ya existe una región con ese nombre." : "No pudimos guardar la configuración de envío.";
  return NextResponse.json({ error: message }, { status: ["P0001", "23505", "23514"].includes(error.code ?? "") ? 400 : 503 });
}
export async function GET() {
  const auth = await requireAdmin(); if (!auth.ok) return auth.response;
  const [regions, policy] = await Promise.all([
    auth.supabase.from("shipping_regions").select(fields).order("name"),
    auth.supabase.from("shipping_policy").select("enabled,free_shipping_threshold_ars,version").eq("id", true).single(),
  ]);
  if (regions.error || policy.error) return NextResponse.json({ error: "El modelo configurable todavía no está disponible." }, { status: 503 });
  return NextResponse.json({ regions: regions.data, policy: policy.data }, { headers: { "Cache-Control": "private, no-store" } });
}
export async function POST(request: Request) {
  const auth = await requireAdmin(); if (!auth.ok) return auth.response;
  const parsed = shippingRegionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const { data, error } = await auth.supabase.from("shipping_regions").insert(parsed.data).select(fields).single();
  if (error) return writeError(error);
  revalidateTag("config"); return NextResponse.json({ region: data }, { status: 201 });
}
export async function PUT(request: Request) {
  const auth = await requireAdmin(); if (!auth.ok) return auth.response;
  const body = await request.json().catch(() => null);
  if (body?.kind === "policy") {
    const values = { ...body }; delete values.kind;
    const parsed = shippingPolicySchema.safeParse(values);
    if (!parsed.success) return NextResponse.json({ error: "Umbral o versión inválidos." }, { status: 400 });
    const { version, ...update } = parsed.data;
    const { data, error } = await auth.supabase.from("shipping_policy").update(update).eq("id", true).eq("version", version).select("enabled,free_shipping_threshold_ars,version").maybeSingle();
    if (error) return writeError(error);
    if (!data) return NextResponse.json({ error: "Otra edición cambió las reglas. Recargá antes de guardar." }, { status: 409 });
    revalidateTag("config"); return NextResponse.json({ policy: data });
  }
  const identity = z.object({ id: z.string().uuid(), version: z.number().int().positive(), kind: z.literal("region") }).safeParse(body);
  if (!identity.success) return NextResponse.json({ error: "Región o versión inválida. Recargá el Admin." }, { status: 400 });
  const { id, version } = identity.data;
  const values = { ...body }; delete values.id; delete values.version; delete values.kind;
  const parsed = shippingRegionSchema.safeParse(values);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const { data, error } = await auth.supabase.from("shipping_regions").update(parsed.data).eq("id", id).eq("version", version).select(fields).maybeSingle();
  if (error) return writeError(error);
  if (!data) return NextResponse.json({ error: "Otra edición cambió esta región. Recargá antes de guardar." }, { status: 409 });
  revalidateTag("config"); return NextResponse.json({ region: data });
}
