import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/helpers";
import { orderPdf } from "@/lib/orders/pdf";
import { z } from "zod";
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  if (!z.string().uuid().safeParse(params.id).success)
    return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
  const { data: o, error } = await auth.supabase
    .from("orders")
    .select("*,order_items(*)")
    .eq("id", params.id)
    .eq("user_id", auth.user.id)
    .single();
  if (error || !o)
    return NextResponse.json(
      { error: "Pedido no disponible" },
      { status: 404 },
    );
  if (!["paid", "partially_refunded", "refunded"].includes(o.payment_status))
    return NextResponse.json(
      { error: "El pedido debe tener pago aprobado" },
      { status: 409 },
    );
  const { data: revisions, error: revisionError } = await auth.supabase
    .from("order_revisions")
    .select("version,reason,created_at,before_snapshot,after_snapshot")
    .eq("order_id", o.id)
    .order("version");
  if (revisionError)
    return NextResponse.json(
      { error: "No pudimos cargar el historial" },
      { status: 503 },
    );
  const money = (n: unknown) => String(o.currency || "ARS") + " " + Number(n || 0).toFixed(2);
  const lines = [
    "DA LUZ CONSCIENTE - RESUMEN DE ORDEN",
    "Comprobante sin validez fiscal. No es una factura AFIP.",
    "Orden: " + o.order_number,
    "Fecha: " + o.created_at,
    "Cliente: " +
      [o.shipping_first_name, o.shipping_last_name].filter(Boolean).join(" "),
    "Email: " + o.email,
    "Pago: " + o.payment_method + " / " + o.payment_status,
    "",
    ...(o.order_items || []).map(
      (i: any) =>
        i.product_name +
        (i.variant_title ? " / " + i.variant_title : "") +
        " | " +
        i.quantity +
        " x " +
        money(i.unit_price) +
        " = " +
        money(i.total_price),
    ),
    "",
    "Subtotal: " + money(o.subtotal),
    "Cupón " + (o.coupon_code || "") + ": -" + money(o.coupon_discount_amount),
    "Transferencia: -" + money(o.transfer_discount_amount),
    "Otros descuentos registrados: -" +
      money(
        Math.max(
          0,
          Number(o.discount_amount || 0) -
            Number(o.coupon_discount_amount || 0) -
            Number(o.transfer_discount_amount || 0),
        ),
      ),
    "Envío: " + money(o.shipping_amount),
    "Impuestos registrados: " + money(o.tax_amount),
    "Total: " + money(o.total_amount),
    "Pago original: " + money(o.original_paid_amount ?? o.total_amount),
    "Diferencia a cobrar (+) / devolver (-): " + money(o.adjustment_balance),
    "",
    "Rectificaciones:",
  ];
  for (const r of revisions || []) {
    lines.push(
      "Versión " + r.version + " - " + r.created_at + " - " + r.reason,
      "Total anterior: " +
        money(r.before_snapshot?.order?.total_amount) +
        " / nuevo: " +
        money(r.after_snapshot?.order?.total_amount),
    );
    for (const i of r.before_snapshot?.items || [])
      lines.push(
        "Anterior: " +
          i.product_name +
          " | " +
          i.quantity +
          " x " +
          money(i.unit_price),
      );
    for (const i of r.after_snapshot?.items || [])
      lines.push(
        "Nuevo: " +
          i.product_name +
          " | " +
          i.quantity +
          " x " +
          money(i.unit_price),
      );
  }
  return new Response(new Uint8Array(orderPdf(lines)), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="orden-' + o.id + '.pdf"',
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
