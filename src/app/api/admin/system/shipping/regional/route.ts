import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/helpers";
const regionalSchema = z.object({
  region_key: z.enum(["cordoba", "centro", "nacional", "patagonia", "respaldo"]),
  regional_rate: z.number().finite().nonnegative().multipleOf(0.01).max(999999999),
  carrier_id: z.string().uuid().nullable(),
});
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const { data, error } = await auth.supabase.from("shipping_zones").select("id,name,description,region_key,regional_rate,carrier_id,is_active").not("region_key", "is", null).order("sort_order");
  if (error) return NextResponse.json({ error: "Zonas regionales no disponibles. Verificá la migración." }, { status: 503 });
  return NextResponse.json({ zones: data });
}
export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const parsed = regionalSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Tarifa o transportista inválidos." }, { status: 400 });
  const { region_key, ...values } = parsed.data;
  const { data, error } = await auth.supabase.from("shipping_zones").update({ ...values, is_active: true }).eq("region_key", region_key).select("id").maybeSingle();
  if (error || !data) return NextResponse.json({ error: "No pudimos guardar la tarifa." }, { status: 409 });
  revalidateTag("config");
  return NextResponse.json({ success: true });
}
