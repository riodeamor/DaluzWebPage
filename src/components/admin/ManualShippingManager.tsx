"use client";
import { useEffect, useState } from "react";
import { manualSchemas, parseManual, type ManualKind } from "@/lib/commerce/manual-shipping";
import type { Coverage } from "@/lib/commerce/shipping";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
type Row = Record<string, unknown> & { id: string | boolean; version: number; name?: string };
type Data = Record<string, Row[]>;
type Field = { key: string; label: string; type?: "number" | "checkbox" | "date" | "select" | "coverage"; options?: string; choices?: [string, string][] };
const active: Field = { key: "is_active", label: "Activo (sólo con datos confirmados)", type: "checkbox" };
const fields: Record<ManualKind, Field[]> = {
  points: [{ key: "name", label: "Nombre" }, { key: "province", label: "Provincia" }, { key: "city", label: "Localidad" }, { key: "address", label: "Dirección confirmada" }, { key: "postal_code", label: "Código postal / CPA" }, active],
  regions: [{ key: "name", label: "Nombre" }, { key: "coverage", label: "Cobertura", type: "coverage" }, active],
  services: [{ key: "name", label: "Nombre" }, { key: "region_id", label: "Región", type: "select", options: "regions" }, { key: "dispatch_point_id", label: "Punto de despacho", type: "select", options: "points" }, { key: "carrier_id", label: "Transportista", type: "select", options: "carriers" }, { key: "modality", label: "Modalidad", type: "select", choices: [["domicile", "Domicilio"], ["branch", "Sucursal"]] }, { key: "branch_name", label: "Nombre de sucursal" }, { key: "branch_address", label: "Dirección de sucursal" }, { key: "branch_postal_code", label: "CP de sucursal" }, { key: "oca_coverage_reference", label: "OCA: referencia de cobertura cuando Andreani y Correo Argentino no llegan" }, { key: "eligible_for_free_shipping", label: "Servicio elegible para envío gratis", type: "checkbox" }, active],
  rates: [{ key: "service_id", label: "Servicio", type: "select", options: "services" }, { key: "weight_from_g", label: "Peso desde (g, incluido)", type: "number" }, { key: "weight_to_g", label: "Peso hasta (g, excluido)", type: "number" }, { key: "rate_ars", label: "Tarifa manual confirmada (ARS)", type: "number" }, { key: "confirmed_reference", label: "Referencia del precio confirmado" }, { key: "confirmed_on", label: "Fecha de confirmación", type: "date" }, active],
  weights: [{ key: "product_id", label: "Producto", type: "select", options: "products" }, { key: "variant_id", label: "Variante (si corresponde)", type: "select", options: "variants" }, { key: "weight_g", label: "Peso nuevo confirmado por unidad (g)", type: "number" }, active],
  policy: [{ key: "default_dispatch_point_id", label: "Origen predeterminado para pedidos nuevos", type: "select", options: "points" }, { key: "packaging_weight_g", label: "Embalaje adicional por pedido (g, confirmado)", type: "number" }, { key: "enabled", label: "Habilitar modelo manual", type: "checkbox" }, { key: "free_shipping_enabled", label: "Activar beneficio de envío gratis", type: "checkbox" }, { key: "free_shipping_threshold_ars", label: "Envío gratis desde (ARS, inclusive)", type: "number" }],
};
const names: Record<ManualKind, string> = { points: "Puntos de despacho", regions: "Regiones", services: "Servicios", rates: "Tarifas manuales por peso", weights: "Pesos nuevos en gramos", policy: "Política y embalaje" };
function blank(kind: ManualKind): Record<string, unknown> {
  return Object.fromEntries(fields[kind].map(f => [f.key, f.type === "checkbox" ? false : f.type === "coverage" ? [] : f.key === "modality" ? "domicile" : f.key === "free_shipping_threshold_ars" ? 90000 : null]));
}
function Form({ kind, row, data, saved, cancel }: { kind: ManualKind; row?: Row; data: Data; saved: () => Promise<void>; cancel?: () => void }) {
  const [draft, setDraft] = useState<Record<string, unknown>>(() => row ? Object.fromEntries(fields[kind].map(f => [f.key, row[f.key] ?? null])) : blank(kind));
  const [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const change = (key: string, value: unknown) => setDraft(previous => ({ ...previous, [key]: value,
    ...(kind === "rates" && ["rate_ars", "weight_from_g", "weight_to_g", "service_id"].includes(key)
      ? { is_active: false, confirmed_reference: null, confirmed_on: null } : {}) }));
  const save = async () => {
    const values = { ...draft };
    for (const field of fields[kind]) if (field.type === "number" && values[field.key] !== null && values[field.key] !== "") values[field.key] = Number(values[field.key]);
    const parsed = parseManual(kind, values);
    if (!parsed.success) { setMessage(parsed.error.issues[0]?.message || "Revisá los datos."); return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/system/shipping/manual", { method: row ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, id: row?.id, version: row?.version, values: parsed.data }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      await saved(); cancel?.(); setMessage("Guardado.");
    } catch (e) { setMessage(e instanceof Error ? e.message : "No se guardó. Tu borrador se conserva."); } finally { setBusy(false); }
  };
  return <form onSubmit={e => { e.preventDefault(); void save(); }} className="space-y-3 rounded border p-4">
    <h3 className="font-medium">{row?.name || (row ? names[kind] : "Nuevo registro")}</h3>
    <fieldset disabled={busy} className="space-y-3">{fields[kind].map(field => {
      const options: Row[] = field.options === "variants" ? ((data.products?.find(p => p.id === draft.product_id)?.product_variants || []) as Row[]).map(v => ({ ...v, name: String(v.title) })) : data[field.options || ""] || [];
      if (field.type === "coverage") {
        const rules = (draft.coverage || []) as Coverage[];
        return <div key={field.key}><p>Provincia y localidad/rango postal se combinan. La localidad tiene prioridad sobre la provincia. Los límites postales son inclusivos.</p>{rules.map((rule, i) => <div className="grid gap-2 sm:grid-cols-2" key={i}>
          {(["province", "city", "postal_from", "postal_to"] as const).map(key => <label key={key}>{({ province: "Provincia", city: "Localidad", postal_from: "CP desde", postal_to: "CP hasta" })[key]}<Input aria-label={`${key} cobertura ${i + 1}`} value={rule[key] ?? ""} type={key.startsWith("postal") ? "number" : "text"} onChange={e => change("coverage", rules.map((r, index) => index === i ? { ...r, [key]: e.target.value === "" ? null : key.startsWith("postal") ? Number(e.target.value) : e.target.value } : r))} /></label>)}
          <Button type="button" variant="outline" onClick={() => change("coverage", rules.filter((_, index) => index !== i))}>Quitar cobertura {i + 1}</Button>
        </div>)}<Button type="button" disabled={rules.length >= 100} onClick={() => change("coverage", [...rules, { province: null, city: null, postal_from: null, postal_to: null }])}>Agregar cobertura</Button></div>;
      }
      if (field.type === "checkbox") return <label key={field.key} className="flex gap-2"><input type="checkbox" checked={draft[field.key] === true} onChange={e => change(field.key, e.target.checked)} />{field.label}</label>;
      if (field.type === "select") return <label className="block" key={field.key}>{field.label}<select aria-label={field.label} className="block w-full rounded border p-2" value={String(draft[field.key] ?? "")} onChange={e => { change(field.key, e.target.value || null); if (field.key === "product_id") change("variant_id", null); }}>
        <option value="">Pendiente de definir</option>{field.choices ? field.choices.map(([value, label]) => <option key={value} value={value}>{label}</option>) : options.map(o => <option key={String(o.id)} value={String(o.id)}>{o.name || o.id}{o.is_active === false ? " (inactivo)" : ""}</option>)}
      </select></label>;
      return <label className="block" key={field.key}>{field.label}<Input aria-label={field.label} type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"} min={field.type === "number" ? 0 : undefined} step={field.type === "number" ? field.key.endsWith("ars") ? "0.01" : "1" : undefined} value={String(draft[field.key] ?? "")} onChange={e => change(field.key, e.target.value || null)} /></label>;
    })}<Button type="submit">{row ? "Guardar" : "Crear borrador"}</Button>{cancel && <Button type="button" variant="outline" onClick={cancel}>Cancelar</Button>}</fieldset>
    {message && <p role="status">{message}</p>}
  </form>;
}
export default function ManualShippingManager() {
  const [data, setData] = useState<Data>({}), [kind, setKind] = useState<ManualKind>("points"), [creating, setCreating] = useState(false), [error, setError] = useState("");
  const load = async () => { const response = await fetch("/api/admin/system/shipping/manual", { cache: "no-store" }); const result = await response.json(); if (!response.ok) throw new Error(result.error); setData(result); };
  useEffect(() => { void load().catch(e => setError(e.message)); }, []);
  return <section className="space-y-4"><h2 className="text-lg font-semibold">Envíos manuales configurables</h2>
    <p>Precios confirmados por vos como particular; no son cotizaciones en tiempo real. Argentina/Mendoza y sus tarifas antiguas se conservan.</p>
    <p>Peso para tarifar = suma de pesos nuevos por unidad × cantidad + embalaje adicional confirmado por pedido. Sin pesos, embalaje, origen o tarifa válidos: coordinar envío. Este modelo inicial admite un paquete y embalaje fijo confirmado; pedidos que necesiten otra regla no deben habilitarse hasta definirla.</p>
    <p>Preparación: punto completo activo → región en borrador con cobertura → servicio completo en borrador → tarifa confirmada activa → región activa → servicio activo → política. Ningún precio ni origen se elige automáticamente. Cambios posteriores sólo afectan cotizaciones nuevas; pedidos guardados conservan su snapshot y requieren revisión para cambios.</p>
    {error && <p role="alert">{error}</p>}<nav className="flex flex-wrap gap-2">{(Object.keys(manualSchemas) as ManualKind[]).map(k => <Button type="button" variant={kind === k ? "default" : "outline"} key={k} onClick={() => { setKind(k); setCreating(false); }}>{names[k]}</Button>)}</nav>
    {data.policy && kind !== "policy" && <Button type="button" onClick={() => setCreating(true)}>Nuevo borrador</Button>}
    {creating && <Form key={`new-${kind}`} kind={kind} data={data} saved={load} cancel={() => setCreating(false)} />}
    {(data[kind] || []).map(row => <Form key={`${kind}-${row.id}-${row.version}`} kind={kind} row={row} data={data} saved={load} />)}
  </section>;
}
