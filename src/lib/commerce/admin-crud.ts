import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/helpers";
export function commerceCrud(table: "coupons" | "announcements" | "catalog_terms", schema: z.ZodTypeAny) {
  const fail = () => NextResponse.json({ error: "No pudimos guardar los datos. Revisá el código único y la configuración." }, { status: 500 });
  const invalid = () => NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  return {
    GET: async () => {
      const auth = await requireAdmin();
      if (!auth.ok) return auth.response;
      const query = auth.supabase.from(table).select("*");
      const { data, error } = table === "coupons" ? await query.eq("archived", false).order("created_at", { ascending: false }) : await query.order("sort_order").order("id");
      if (error) return fail();
      return NextResponse.json({ items: data }, { headers: { "Cache-Control": "no-store" } });
    },
    POST: async (request: Request) => {
      const auth = await requireAdmin();
      if (!auth.ok) return auth.response;
      const body = await request.json().catch(() => null);
      const parsed = schema.safeParse(body);
      if (!parsed.success) return invalid();
      const { data, error } = await auth.supabase.from(table).insert(parsed.data).select().single();
      if (error) return error.code === "23505" ? NextResponse.json({ error: "Ese código ya existe." }, { status: 409 }) : fail();
      return NextResponse.json({ item: data }, { status: 201 });
    },
    PUT: async (request: Request) => {
      const auth = await requireAdmin();
      if (!auth.ok) return auth.response;
      const body = await request.json().catch(() => null);
      const parsed = schema.safeParse(body), id = z.string().uuid().safeParse(body?.id);
      if (!parsed.success || !id.success) return invalid();
      let query = auth.supabase.from(table).update(parsed.data).eq("id", id.data);
      if (table === "coupons") query = query.eq("archived", false);
      const { data, error } = await query.select().maybeSingle();
      if (error) return error.code === "23505" ? NextResponse.json({ error: "Ese código ya existe." }, { status: 409 }) : fail();
      if (!data) return NextResponse.json({ error: "Registro no encontrado." }, { status: 404 });
      return NextResponse.json({ item: data });
    },
    DELETE: async (request: Request) => {
      const auth = await requireAdmin();
      if (!auth.ok) return auth.response;
      const id = z.string().uuid().safeParse(new URL(request.url).searchParams.get("id"));
      if (!id.success) return invalid();
      const { data, error } = table === "coupons"
        ? await auth.supabase.from(table).update({ archived: true, is_active: false }).eq("id", id.data).select("id").maybeSingle()
        : await auth.supabase.from(table).delete().eq("id", id.data).select("id").maybeSingle();
      if (error) return fail();
      if (!data) return NextResponse.json({ error: "Registro no encontrado." }, { status: 404 });
      return NextResponse.json({ success: true });
    },
  };
}
