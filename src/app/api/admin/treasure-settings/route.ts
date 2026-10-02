export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/auth/helpers";
import { z } from "zod";
const url = z
  .string()
  .url()
  .refine((v) => {
    const u = new URL(v);
    return u.protocol === "https:" && !u.username && !u.password;
  })
  .nullable();
export async function GET() {
  const a = await requireAdmin();
  if (!a.ok) return a.response;
  const { data, error } = await getServiceClient()
    .from("treasure_catalog")
    .select("*")
    .order("access_id");
  return error
    ? NextResponse.json({ error: "No pudimos cargar Tesoros" }, { status: 503 })
    : NextResponse.json(
        { items: data },
        { headers: { "Cache-Control": "private, no-store" } },
      );
}
export async function PUT(r: Request) {
  const a = await requireAdmin();
  if (!a.ok) return a.response;
  const p = z
    .object({ access_id: z.string(), audio_url: url, pdf_url: url })
    .safeParse(await r.json().catch(() => null));
  if (!p.success)
    return NextResponse.json(
      { error: "URLs HTTPS inválidas" },
      { status: 400 },
    );
  const { access_id, ...fields } = p.data;
  const { data, error } = await getServiceClient()
    .from("treasure_catalog")
    .update(fields)
    .eq("access_id", access_id)
    .select()
    .single();
  return error
    ? NextResponse.json({ error: "No pudimos guardar" }, { status: 400 })
    : NextResponse.json({ item: data });
}
