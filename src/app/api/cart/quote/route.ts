import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/auth/helpers";
import { quoteSchema } from "@/lib/commerce/schemas";
import { quoteCart } from "@/lib/commerce/quote";
import { QuoteError } from "@/lib/commerce/pricing";
import { CheckoutCatalogError } from "@/lib/payments/checkout-catalog";
export async function POST(request: Request) {
  try {
    const parsed = quoteSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Datos de carrito inválidos." }, { status: 400 });
    const { quote } = await quoteCart(getServiceClient(), parsed.data);
    return NextResponse.json({ quote }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof QuoteError || error instanceof CheckoutCatalogError) return NextResponse.json({ error: error.message }, { status: 409 });
    console.error("Cart quote failed", error);
    return NextResponse.json({ error: "No pudimos calcular la compra. Intentá nuevamente." }, { status: 503 });
  }
}
