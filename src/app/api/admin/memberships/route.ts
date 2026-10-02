export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/auth/helpers";
import { z } from "zod";
const schema = z
  .object({
    id: z.string().uuid().optional(),
    user_id: z.string().uuid(),
    plan_id: z.string().uuid(),
    status: z.enum(["active", "cancelled", "expired", "paused", "pending"]),
    start_date: z.string().datetime(),
    end_date: z.string().datetime().nullable(),
  })
  .refine((v) => !v.end_date || v.end_date > v.start_date);
export async function GET() {
  const a = await requireAdmin();
  if (!a.ok) return a.response;
  const db = getServiceClient();
  const [memberships, plans] = await Promise.all([
    db
      .from("memberships")
      .select("*,membership_plans(name,program_key)")
      .order("start_date", { ascending: false }),
    db
      .from("membership_plans")
      .select("id,name,program_key")
      .eq("is_active", true),
  ]);
  if (memberships.error || plans.error)
    return NextResponse.json(
      { error: "No pudimos cargar las contrataciones" },
      { status: 503 },
    );
  return NextResponse.json(
    { items: memberships.data, plans: plans.data },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
async function save(r: Request) {
  const a = await requireAdmin();
  if (!a.ok) return a.response;
  const parsed = schema.safeParse(await r.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Contratación inválida" },
      { status: 400 },
    );
  const { id, ...fields } = parsed.data;
  const db = getServiceClient();
  const query = id
    ? db.from("memberships").update(fields).eq("id", id)
    : db.from("memberships").insert(fields);
  const { data, error } = await query.select().single();
  if (error)
    return NextResponse.json(
      { error: "No pudimos guardar la contratación" },
      { status: 400 },
    );
  return NextResponse.json({ item: data });
}
export const POST = save;
export const PUT = save;

export async function PATCH(r: Request) {
  const a = await requireAdmin();
  if (!a.ok) return a.response;
  const p = z
    .object({
      id: z.string().uuid(),
      program_key: z.enum(["el-pulso", "genesis", "sintropia"]).nullable(),
    })
    .safeParse(await r.json().catch(() => null));
  if (!p.success)
    return NextResponse.json({ error: "Programa inválido" }, { status: 400 });
  const { data, error } = await getServiceClient()
    .from("membership_plans")
    .update({ program_key: p.data.program_key })
    .eq("id", p.data.id)
    .select()
    .single();
  return error
    ? NextResponse.json(
        { error: "Programa ya asociado o plan inexistente" },
        { status: 400 },
      )
    : NextResponse.json({ plan: data });
}
