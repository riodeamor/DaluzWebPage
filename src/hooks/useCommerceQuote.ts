"use client";
import { useEffect, useState } from "react";
import type { Quote } from "@/lib/commerce/pricing";
import type { CartItem } from "@/contexts/CartContext";
export function useCommerceQuote(items: CartItem[], postalCode: string, couponCode: string, paymentMethod: "mercadopago" | "bank_transfer" = "mercadopago") {
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const refresh = () => setRevision(value => value + 1);
    window.addEventListener("daluz-quote-refresh", refresh);
    window.addEventListener("focus", refresh);
    return () => { window.removeEventListener("daluz-quote-refresh", refresh); window.removeEventListener("focus", refresh); };
  }, []);
  const key = JSON.stringify({ items: items.map(({ productId, variantId, name, price, quantity }) => ({ productId, variantId, name, price, quantity })), postalCode: postalCode || undefined, couponCode: couponCode || undefined, paymentMethod, revision });
  const [result, setResult] = useState<{ key: string; quote: Quote | null; error: string }>({ key: "", quote: null, error: "" });
  useEffect(() => {
    if (!items.length) return;
    const abort = new AbortController();
    const timer = setTimeout(() => {
      fetch("/api/cart/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: key, signal: abort.signal })
        .then(async response => {
          const data = await response.json();
          if (!response.ok) throw new Error(data.error);
          if (!abort.signal.aborted) setResult({ key, quote: data.quote, error: "" });
        }).catch(e => { if (!abort.signal.aborted) setResult({ key, quote: null, error: e.message || "No pudimos calcular la compra." }); });
    }, 250);
    return () => { clearTimeout(timer); abort.abort(); };
  }, [key, items.length]);
  return { quote: result.key === key ? result.quote : null, error: result.key === key ? result.error : "", pending: items.length > 0 && result.key !== key };
}
