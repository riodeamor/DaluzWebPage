export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/helpers";
import { unlockedTreasures } from "@/lib/treasures/access";
import { TREASURES } from "@/lib/treasures/catalog";
export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  try {
    const [memberships, orders, rights] = await Promise.all([
      auth.supabase
        .from("memberships")
        .select(
          "id,status,start_date,end_date,membership_plans(id,name,slug,description,program_key)",
        )
        .eq("user_id", auth.user.id)
        .order("start_date", { ascending: false }),
      auth.supabase
        .from("orders")
        .select("id,order_number,payment_status,created_at,total_amount")
        .eq("user_id", auth.user.id)
        .in("payment_status", ["paid", "partially_refunded", "refunded"])
        .order("created_at", { ascending: false }),
      unlockedTreasures(auth.supabase, auth.user.id),
    ]);
    if (memberships.error || orders.error) throw Error();
    return NextResponse.json(
      {
        memberships: memberships.data,
        orders: orders.data,
        treasures: TREASURES.filter((t) => rights.includes(t.id)),
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "No pudimos cargar Tu Sendero" },
      { status: 503 },
    );
  }
}
