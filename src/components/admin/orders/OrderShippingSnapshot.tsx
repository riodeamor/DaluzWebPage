"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { formatCurrency } from "@/lib/admin-display";
const schema = z.object({
  configuration: z.object({
    origin: z.object({ name: z.string(), address: z.string(), city: z.string(), province: z.string(), postal_code: z.string() }),
    service: z.object({ name: z.string(), modality: z.enum(["domicile", "branch"]), branch_name: z.string().nullable(), branch_address: z.string().nullable(), branch_postal_code: z.string().nullable() }),
    rate: z.object({ rate_ars: z.number(), weight_from_g: z.number(), weight_to_g: z.number(), confirmed_reference: z.string(), confirmed_on: z.string() }),
    policy: z.object({ free_shipping_enabled: z.boolean(), free_shipping_threshold_ars: z.number() }),
    total_weight_g: z.number(), product_weight_g: z.number(), packaging_weight_g: z.number(),
  }), charged_shipping_ars: z.number(), discounted_products_ars: z.number(),
});
export default function OrderShippingSnapshot({ orderId }: { orderId: string }) {
  const [snapshot, setSnapshot] = useState<z.infer<typeof schema> | null>(null), [message, setMessage] = useState("Cargando origen y tarifa conservados…");
  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/api/admin/orders/${encodeURIComponent(orderId)}/shipping-snapshot`, { cache: "no-store", signal: controller.signal }).then(async response => {
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      if (data.snapshot === null) { setSnapshot(null); setMessage("Pedido histórico: sin datos del nuevo modelo. No se recalcula su envío."); return; }
      const result = schema.safeParse(data.snapshot); if (!result.success) throw new Error("No se pudieron verificar los datos conservados de envío.");
      setSnapshot(result.data); setMessage("");
    }).catch(e => { if (!controller.signal.aborted) setMessage(e.message); });
    return () => controller.abort();
  }, [orderId]);
  const config = snapshot?.configuration;
  return <section className="space-y-2 rounded border p-3"><h4 className="font-semibold">Origen y tarifa usados en este pedido</h4>
    {message && <p role="status">{message}</p>}
    {config && snapshot && <>
      <p>{config.origin.name} · {config.origin.address} · {config.origin.city}, {config.origin.province} · CP {config.origin.postal_code}</p>
      <p>{config.service.name} · {config.service.modality === "branch" ? `Sucursal: ${config.service.branch_name} · ${config.service.branch_address} · CP ${config.service.branch_postal_code}` : "Domicilio"}</p>
      <p>Peso: {config.total_weight_g} g = productos {config.product_weight_g} g + embalaje {config.packaging_weight_g} g.</p>
      <p>Tarifa manual base: {formatCurrency(config.rate.rate_ars)} · rango {config.rate.weight_from_g} g incluido a {config.rate.weight_to_g} g excluido.</p>
      <p>Referencia: {config.rate.confirmed_reference} · confirmada el {config.rate.confirmed_on}.</p>
      <p>Productos después de descuentos: {formatCurrency(snapshot.discounted_products_ars)}. Envío cobrado: {formatCurrency(snapshot.charged_shipping_ars)}.</p>
      <p>Beneficio configurado: {config.policy.free_shipping_enabled ? `activo desde ${formatCurrency(config.policy.free_shipping_threshold_ars)}` : "desactivado"}. Se aplicó sólo si el servicio era elegible y alcanzaba el umbral.</p>
    </>}
    <p className="text-sm">Son los datos conservados al confirmar, no los valores actuales del Admin. Cambiar origen o importes de este pedido requiere revisión; no se recalculan automáticamente.</p>
  </section>;
}
