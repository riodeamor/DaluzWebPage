import { NextResponse } from "next/server";
import { getServiceClient, requireAdmin } from "@/lib/auth/helpers";
export const dynamic = "force-dynamic";
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(); if (!auth.ok) return auth.response;
  const service = getServiceClient();
  const { data, error } = await service.from("orders").select("id").eq("id", params.id).maybeSingle();
  if (error) return NextResponse.json({ error: "No se pudieron leer los datos de envío conservados." }, { status: 503 });
  if (!data) return NextResponse.json({ error: "Pedido no encontrado." }, { status: 404 });
  const stored = await service.from("shipping_order_snapshots").select("snapshot").eq("order_id", params.id).maybeSingle();
  if (stored.error) return NextResponse.json({ error: "No se pudo leer la copia privada de envío." }, { status: 503 });
  return NextResponse.json({ snapshot: stored.data?.snapshot ?? null }, { headers: { "Cache-Control": "private, no-store" } });
}
