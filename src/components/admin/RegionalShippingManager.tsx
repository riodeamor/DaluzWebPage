"use client";
import { useEffect, useState } from "react";
import { REGIONS } from "@/lib/commerce/pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
type Zone = { id: string; region_key: string; regional_rate: number | null; carrier_id: string | null };
export default function RegionalShippingManager() {
  const [zones, setZones] = useState<Zone[]>([]), [carriers, setCarriers] = useState<{ id: string; name: string; is_active: boolean }[]>([]);
  const [message, setMessage] = useState(""), [busy, setBusy] = useState(false);
  useEffect(() => {
    Promise.all([fetch("/api/admin/system/shipping/regional"), fetch("/api/admin/system/shipping/carriers")]).then(async ([zr, cr]) => {
      const z = await zr.json(), c = await cr.json();
      if (!zr.ok || !cr.ok) throw new Error(z.error || c.error);
      setZones(z.zones); setCarriers(c.carriers);
    }).catch(e => setMessage(e.message));
  }, []);
  const update = (key: string, values: Partial<Zone>) => setZones(prev => prev.map(z => z.region_key === key ? { ...z, ...values } : z));
  const save = async (zone: Zone) => {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/system/shipping/regional", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ region_key: zone.region_key, regional_rate: zone.regional_rate, carrier_id: zone.carrier_id }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setMessage("Tarifa guardada.");
    } catch (e) { setMessage(e instanceof Error ? e.message : "No pudimos guardar."); }
    finally { setBusy(false); }
  };
  return <Card><CardHeader><CardTitle>Envíos dinámicos por código postal</CardTitle></CardHeader><CardContent>
    <p>Los rangos se asignan automáticamente. Editá la tarifa en pesos de cada zona. El umbral de envío gratis se configura en ecommerce y se aplica al subtotal de productos después del cupón.</p>
    {message && <p role="status">{message}</p>}
    {REGIONS.map(region => {
      const zone = zones.find(z => z.region_key === region.key);
      if (!zone) return null;
      return <form key={region.key} onSubmit={e => { e.preventDefault(); void save(zone); }}>
        <p>{region.name} · {region.ranges}</p>
        <Label htmlFor={`rate-${region.key}`}>Tarifa (ARS)</Label>
        <Input id={`rate-${region.key}`} type="number" required min="0" max="999999999" step="0.01" value={zone.regional_rate ?? ""} onChange={e => update(region.key, { regional_rate: e.target.value ? Number(e.target.value) : null })} />
        <Label htmlFor={`carrier-${region.key}`}>Transportista</Label>
        <select id={`carrier-${region.key}`} value={zone.carrier_id ?? ""} onChange={e => update(region.key, { carrier_id: e.target.value || null })}>
          <option value="">Sin transportista asignado</option>{carriers.filter(c => c.is_active).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <Button type="submit" disabled={busy}>Guardar tarifa</Button>
      </form>;
    })}
  </CardContent></Card>;
}
