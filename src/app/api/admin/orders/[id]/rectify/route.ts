import { NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/auth/helpers";
import { z } from "zod";
const rectificationSchema = z.object({
  request_id: z.string().uuid(),
  version: z.number().int().min(0),
  reason: z.string().trim().min(5).max(1000),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        variant_id: z.string().uuid().nullable().optional(),
        quantity: z.number().int().min(1).max(10000),
        unit_price: z.number().finite().nonnegative().multipleOf(0.01),
      }),
    )
    .min(1)
    .max(100),
  adjustments: z
    .object({
      shipping_amount: z.number().nonnegative().multipleOf(0.01).optional(),
      coupon_discount_amount: z
        .number()
        .nonnegative()
        .multipleOf(0.01)
        .optional(),
      transfer_discount_amount: z
        .number()
        .nonnegative()
        .multipleOf(0.01)
        .optional(),
    })
    .strict()
    .default({}),
});
export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const parsed = rectificationSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success || !z.string().uuid().safeParse(params.id).success)
    return NextResponse.json(
      { error: "Rectificación inválida" },
      { status: 400 },
    );
  const b = parsed.data;
  const { data, error } = await getServiceClient().rpc("rectify_order", {
    p_order_id: params.id,
    p_actor: auth.user.id,
    p_request: b.request_id,
    p_version: b.version,
    p_reason: b.reason,
    p_items: b.items,
    p_adjustments: b.adjustments,
  });
  if (error)
    return NextResponse.json(
      { error: error.message },
      { status: error.code === "40001" ? 409 : 400 },
    );
  return NextResponse.json(
    { result: data },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
