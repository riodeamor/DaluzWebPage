import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/auth/helpers";
export const dynamic = "force-dynamic";
export async function GET() {
  const { data, error } = await getServiceClient().from("announcements")
    .select("id,message,link,sort_order").eq("is_active", true).order("sort_order").order("id");
  if (error) return NextResponse.json({ error: "Avisos no disponibles." }, { status: 503 });
  return NextResponse.json({ announcements: data }, { headers: { "Cache-Control": "no-store" } });
}
