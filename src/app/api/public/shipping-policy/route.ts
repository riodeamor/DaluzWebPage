export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/auth/helpers";

// Public projection only: no region, customer or administrative data is returned.
export async function GET() {
  const supabase = getServiceClient();
  const { data: policy, error } = await supabase.from("shipping_policy")
    .select("enabled,free_shipping_enabled,free_shipping_threshold_ars").eq("id", true).maybeSingle();
  const missingTable = error && ["42P01", "PGRST205"].includes(error.code);
  if (error && !missingTable) return NextResponse.json({ error: "Política no disponible" }, { status: 503 });
  if (policy) {
    if (!policy.enabled || !policy.free_shipping_enabled) return NextResponse.json({ freeShippingThreshold: null }, { headers: { "Cache-Control": "no-store" } });
    const available = await supabase.rpc("manual_shipping_free_available");
    if (available.error) return NextResponse.json({ error: "Beneficio no disponible" }, { status: 503 });
    if (available.data !== true) return NextResponse.json({ freeShippingThreshold: null }, { headers: { "Cache-Control": "no-store" } });
    const amount = Number(policy.free_shipping_threshold_ars);
    if (policy.free_shipping_threshold_ars === null || !Number.isFinite(amount) || amount < 0)
      return NextResponse.json({ error: "Umbral inválido" }, { status: 503 });
    return NextResponse.json({ freeShippingThreshold: amount }, { headers: { "Cache-Control": "no-store" } });
  }
  // Preserve the published threshold only when the new policy does not exist yet.
  const legacy = await supabase.from("system_config").select("config_value")
    .eq("config_key", "free_shipping_threshold").eq("is_public", true).maybeSingle();
  if (legacy.error) return NextResponse.json({ error: "Umbral no disponible" }, { status: 503 });
  const value = legacy.data?.config_value;
  const amount = (typeof value === "number" || (typeof value === "string" && value.trim())) ? Number(value) : NaN;
  return NextResponse.json({ freeShippingThreshold: Number.isFinite(amount) && amount >= 0 ? amount : null },
    { headers: { "Cache-Control": "no-store" } });
}
