"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type Entry = { id?: string; code: string; type: string; value: number; minimum_purchase: number; expires_at: string | null; usage_limit: number | null; combinable_con_transferencia: boolean; message: string; link: string | null; sort_order: number; is_active: boolean };
const empty: Entry = { code: "", type: "percent", value: 10, minimum_purchase: 0, expires_at: null, usage_limit: null, combinable_con_transferencia: true, message: "", link: null, sort_order: 0, is_active: true };
export default function CommerceManager({ kind }: { kind: "cupones" | "announcements" }) {
  const [items, setItems] = useState<Entry[]>([]), [form, setForm] = useState<Entry>({ ...empty });
  const [error, setError] = useState(""), [busy, setBusy] = useState(false), [loaded, setLoaded] = useState(false);
  const endpoint = `/api/admin/${kind}`, coupon = kind === "cupones";
  const load = async () => {
    const response = await fetch(endpoint, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "No pudimos cargar los registros.");
    setItems(data.items); setLoaded(true);
  };
  useEffect(() => { load().catch(e => setError(e.message)); }, [endpoint]); // eslint-disable-line react-hooks/exhaustive-deps
  const save = async (entry: Entry) => {
    setBusy(true); setError("");
    try {
      const response = await fetch(endpoint, { method: entry.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(entry) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      await load(); setForm({ ...empty });
    } catch (e) { setError(e instanceof Error ? e.message : "No pudimos guardar."); }
    finally { setBusy(false); }
  };
  const remove = async (entry: Entry) => {
    if (!window.confirm(`¿Dar de baja ${coupon ? entry.code : "este aviso"}?`)) return;
    setBusy(true); setError("");
    try {
      const response = await fetch(`${endpoint}?id=${entry.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      await load(); if (form.id === entry.id) setForm({ ...empty });
    } catch (e) { setError(e instanceof Error ? e.message : "No pudimos eliminar."); }
    finally { setBusy(false); }
  };
  const field = (label: string, key: "code" | "value" | "minimum_purchase" | "usage_limit" | "message" | "link" | "sort_order", type = "text", nullable = false) => (
    <div key={key}>
      <Label htmlFor={`commerce-${key}`}>{label}</Label>
      <Input id={`commerce-${key}`} type={type} value={form[key] ?? ""} min={type === "number" ? (key === "usage_limit" || key === "value" ? 1 : 0) : undefined} step={type === "number" && key !== "usage_limit" && key !== "sort_order" ? "0.01" : undefined}
        required={!nullable} onChange={e => setForm({ ...form, [key]: nullable && !e.target.value ? null : type === "number" ? Number(e.target.value) : e.target.value })} />
    </div>
  );
  return <>
    <h1>{coupon ? "Cupones de descuento" : "Avisos de la barrita superior"}</h1>
    {error && <p role="alert">{error}</p>}
    <Card><CardHeader><CardTitle>{form.id ? "Editar" : "Crear"} {coupon ? "cupón" : "aviso"}</CardTitle></CardHeader><CardContent>
      <form onSubmit={e => { e.preventDefault(); void save(form); }}>
        {coupon ? <>
          {field("Código", "code")}
          <Label htmlFor="coupon-type">Tipo</Label>
          <select id="coupon-type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="percent">Porcentaje (%)</option><option value="fixed">Monto fijo (ARS)</option></select>
          {field("Valor del descuento", "value", "number")}
          {field("Compra mínima de productos (ARS)", "minimum_purchase", "number")}
          <Label htmlFor="coupon-expiration">Vencimiento (hora local; vacío = sin vencimiento)</Label>
          <Input id="coupon-expiration" type="datetime-local" value={form.expires_at ? (() => { const d = new Date(form.expires_at!); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); })() : ""}
            onChange={e => setForm({ ...form, expires_at: e.target.value ? new Date(e.target.value).toISOString() : null })} />
          {field("Límite de usos (vacío = ilimitado)", "usage_limit", "number", true)}
          <Label htmlFor="coupon-combinable">Combinable con transferencia</Label>
          <Switch id="coupon-combinable" checked={form.combinable_con_transferencia} onCheckedChange={value => setForm({ ...form, combinable_con_transferencia: value })} />
          <p>Si se desactiva, este cupón aplica sin descuento adicional por transferencia.</p>
        </> : <>
          {field("Mensaje", "message")}<p>Usá {"{{free_shipping_threshold}}"} para mostrar el umbral de envío gratis actualizado.</p>{field("Enlace opcional", "link", "text", true)}{field("Orden de rotación", "sort_order", "number")}
        </>}
        <Label htmlFor="commerce-active">Activo</Label><Switch id="commerce-active" checked={form.is_active} onCheckedChange={value => setForm({ ...form, is_active: value })} />
        <Button type="submit" disabled={busy}>Guardar</Button>
        {form.id && <Button type="button" variant="outline" disabled={busy} onClick={() => setForm({ ...empty })}>Cancelar edición</Button>}
      </form>
    </CardContent></Card>
    {!loaded && !error && <p role="status">Cargando…</p>}
    {loaded && !items.length && <p>No hay {coupon ? "cupones" : "avisos"}.</p>}
    {items.map(entry => <Card key={entry.id}><CardContent>
      <p>{coupon ? `${entry.code} · ${entry.type === "percent" ? `${entry.value}%` : `$${entry.value}`} · mínimo $${entry.minimum_purchase}` : `${entry.sort_order} · ${entry.message}`}</p>
      {coupon && <p>{entry.combinable_con_transferencia ? "Combinable con transferencia" : "Sin descuento adicional por transferencia"}{entry.usage_limit ? ` · límite ${entry.usage_limit} usos` : " · usos ilimitados"}</p>}
      <Label htmlFor={`active-${entry.id}`}>{entry.is_active ? "Activo" : "Pausado"}</Label><Switch id={`active-${entry.id}`} disabled={busy} checked={entry.is_active} onCheckedChange={value => void save({ ...entry, is_active: value })} />
      <Button variant="outline" disabled={busy} onClick={() => setForm(entry)}>Editar</Button><Button variant="destructive" disabled={busy} onClick={() => void remove(entry)}>Dar de baja</Button>
    </CardContent></Card>)}
  </>;
}
