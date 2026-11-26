import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/helpers";
import { manualTables, parseManual, type ManualKind } from "@/lib/commerce/manual-shipping";
import { z } from "zod";
const identity = z.object({ kind: z.enum(["points", "regions", "services", "rates", "weights", "policy"]), id: z.union([z.string().uuid(), z.literal(true)]).optional(), version: z.number().int().positive().optional(), values: z.unknown() });
export async function GET() {
  const auth = await requireAdmin(); if (!auth.ok) return auth.response;
  const entries = await Promise.all(Object.entries(manualTables).map(async ([kind, table]) => [kind, await auth.supabase.from(table).select("*")] as const));
  if (entries.some(([, result]) => result.error)) return NextResponse.json({ error: "La ampliación manual todavía no está disponible." }, { status: 503 });
  const carriers = await auth.supabase.from("shipping_carriers").select("id,name,is_active");
  if (carriers.error) return NextResponse.json({ error: "Transportistas no disponibles." }, { status: 503 });
  const products = await auth.supabase.from("products").select("id,name,product_variants(id,title)").order("name");
  if (products.error) return NextResponse.json({ error: "Productos no disponibles." }, { status: 503 });
  return NextResponse.json({ ...Object.fromEntries(entries.map(([kind, result]) => [kind, result.data])), carriers: carriers.data, products: products.data }, { headers: { "Cache-Control": "private, no-store" } });
}
async function write(request: Request, editing: boolean) {
  const auth = await requireAdmin(); if (!auth.ok) return auth.response;
  const parsed = identity.safeParse(await request.json().catch(() => null));
  if (!parsed.success || (editing && (!parsed.data.id || !parsed.data.version)) || (!editing && parsed.data.kind === "policy")) return NextResponse.json({ error: "Identidad o versión inválida." }, { status: 400 });
  const { kind, id, version, values } = parsed.data;
  if ((kind === "policy") !== (id === true) && editing) return NextResponse.json({ error: "Identidad inválida." }, { status: 400 });
  const value = parseManual(kind as ManualKind, values);
  if (!value.success) return NextResponse.json({ error: value.error.issues[0]?.message }, { status: 400 });
  const table = auth.supabase.from(manualTables[kind]);
  const query = editing ? table.update(value.data).eq("id", id).eq("version", version) : table.insert(value.data);
  const { data, error } = await query.select("*").maybeSingle();
  if (error) return NextResponse.json({ error: error.code === "P0001" ? error.message : "No se pudo guardar. Revisá los datos y dependencias." }, { status: ["P0001", "23514", "23505", "23503"].includes(error.code) ? 400 : 503 });
  if (!data) return NextResponse.json({ error: "Otra edición cambió este registro. Recargá antes de guardar." }, { status: 409 });
  revalidateTag("config"); return NextResponse.json({ record: data }, { status: editing ? 200 : 201 });
}
export const POST = (request: Request) => write(request, false);
export const PUT = (request: Request) => write(request, true);
