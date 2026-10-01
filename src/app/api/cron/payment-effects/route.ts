import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/auth/helpers";
import { OrdersRepository } from "@/lib/repositories/orders.repository";
import { PaymentEffectsRepository } from "@/lib/repositories/payment-effects.repository";
import { PaymentEffectsService } from "@/lib/services/payment-effects.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const client = getServiceClient();
    const effects = new PaymentEffectsRepository(client);
    const worker = new PaymentEffectsService(effects, new OrdersRepository(client));
    const result = await worker.drain();
    const manualReview = await effects.reviewCount();
    return NextResponse.json({ ...result, manualReview }, { status: result.failed || manualReview ? 503 : 200 });
  } catch (error) {
    console.error("Payment recovery worker failed", error);
    return NextResponse.json({ error: "Payment recovery unavailable" }, { status: 503 });
  }
}
