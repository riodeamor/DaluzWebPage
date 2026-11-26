"use client";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Quote } from "@/lib/commerce/pricing";
export default function CommerceControls({ quote, error, pending, includePostal = false }: { quote: Quote | null; error: string; pending: boolean; includePostal?: boolean }) {
  const { postalCode, setPostalCode, couponCode, setCouponCode } = useCart();
  const [draft, setDraft] = useState(couponCode);
  const money = (value: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);
  const couponControls = <div className="space-y-2">
    <Label className="block" htmlFor={includePostal ? "cart-coupon" : "checkout-coupon"}>Cupón de descuento</Label>
    <Input id={includePostal ? "cart-coupon" : "checkout-coupon"} placeholder="Ingresá tu cupón" maxLength={40} value={draft} onChange={e => setDraft(e.target.value)} />
    <Button type="button" disabled={pending || !draft.trim()} onClick={() => { setCouponCode(draft.trim().toUpperCase()); window.dispatchEvent(new Event("daluz-quote-refresh")); }}>Aplicar</Button>
    {couponCode && <Button type="button" variant="outline" onClick={() => { setCouponCode(""); setDraft(""); }}>Quitar cupón</Button>}
  </div>;
  return <div className="commerce-controls space-y-3 text-sm">
    {includePostal && <div className="space-y-2"><Label className="block" htmlFor="cart-postal">Código postal para calcular envío</Label><Input id="cart-postal" placeholder="Ej. 5000" autoComplete="postal-code" maxLength={12} value={postalCode} onChange={e => setPostalCode(e.target.value)} /></div>}
    {includePostal ? <details className="commerce-controls__coupon" open={couponCode ? true : undefined}>
      <summary>¿Tenés un cupón de descuento?</summary>
      <div className="pt-3">{couponControls}</div>
    </details> : couponControls}
    <div aria-live="polite">
      {pending && <p>Calculando…</p>}{error && <p role="alert">{error}</p>}
      {quote?.coupon && <p>Cupón {quote.coupon.code} aplicado: −{money(quote.couponDiscount)}{!quote.coupon.combinable_con_transferencia && ". Este cupón no permite descuento adicional por transferencia."}</p>}
      {quote && quote.transferDiscount > 0 && <p>Descuento por transferencia: −{money(quote.transferDiscount)}</p>}
      {quote?.freeShippingThreshold !== null && quote?.freeShippingThreshold !== undefined && <p>Envío gratis desde {money(quote.freeShippingThreshold)} en productos después de todos los descuentos, para destinos con cobertura y tarifa configuradas.</p>}
      {quote?.shippingWeightG != null && <p>Peso para tarifar: {quote.shippingWeightG} g, incluido embalaje. Tarifa manual configurada; no es una cotización en tiempo real.</p>}
      {quote?.shippingOptions?.find(option => option.id === quote.serviceId)?.modality === "branch" && <p>Sucursal: {quote.shippingOptions.find(option => option.id === quote.serviceId)?.branch_address} · CP {quote.shippingOptions.find(option => option.id === quote.serviceId)?.branch_postal_code}</p>}
      {quote && quote.shipping !== null && <p>Envío · {quote.zoneName}{quote.carrierName ? ` · ${quote.carrierName}` : ""}: {money(quote.shipping)}</p>}
      {quote && quote.shipping === null && <p role="status">{quote.shippingMessage || "Este destino requiere coordinar el envío."} Completá provincia, localidad y código postal en el checkout para verificar la cobertura.</p>}
    </div>
  </div>;
}
