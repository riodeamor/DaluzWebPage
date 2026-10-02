"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
type Item = {
  product_id: string;
  variant_id?: string | null;
  quantity: number;
  unit_price: number;
};
export default function OrderRectifier({ id }: { id: string }) {
  const [items, setItems] = useState<Item[]>([]),
    [version, setVersion] = useState(0),
    [reason, setReason] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [key, setKey] = useState("");
  const [adjustments, setAdjustments] = useState<Record<string, number>>({}),
    [history, setHistory] = useState<
      Array<{ version: number; reason: string }>
    >([]);
  const [balance, setBalance] = useState(0);
  const load = async () => {
    const r = await fetch("/api/admin/orders/" + id, { cache: "no-store" });
    const d = await r.json();
    if (!r.ok) throw Error(d.error);
    setItems(
      (d.order.order_items || []).map((i: Item) => ({
        product_id: i.product_id,
        variant_id: i.variant_id,
        quantity: i.quantity,
        unit_price: i.unit_price,
      })),
    );
    setVersion(d.order.revision_version || 0);
    setBalance(d.order.adjustment_balance || 0);
    setKey(crypto.randomUUID());
    setAdjustments({});
    setHistory(d.revisions || []);
  };
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [id]);
  const change = (index: number, patch: Partial<Item>) => {
    setItems(items.map((i, n) => (n === index ? { ...i, ...patch } : i)));
    setKey(crypto.randomUUID());
  };
  return (
    <section>
      <h3>Rectificar ítems</h3>
      <p>
        El pago original se conserva. La diferencia se registra para gestión
        manual.
      </p>
      <p>Saldo a cobrar (+) o devolver (-): {balance}</p>
      <p role="alert">{error}</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          try {
            const r = await fetch("/api/admin/orders/" + id + "/rectify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                request_id: key,
                version,
                reason,
                items,
                adjustments,
              }),
            });
            const d = await r.json();
            if (!r.ok) throw Error(d.error);
            await load();
            setReason("");
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {items.map((item, index) => (
          <fieldset key={index}>
            <label>
              ID de producto
              <Input
                required
                value={item.product_id}
                onChange={(e) => change(index, { product_id: e.target.value })}
              />
            </label>
            <label>
              ID variante (opcional)
              <Input
                value={item.variant_id || ""}
                onChange={(e) =>
                  change(index, { variant_id: e.target.value || null })
                }
              />
            </label>
            <label>
              Cantidad
              <Input
                type="number"
                min="1"
                required
                value={item.quantity}
                onChange={(e) =>
                  change(index, { quantity: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Precio registrado
              <Input
                type="number"
                min="0"
                step="0.01"
                required
                value={item.unit_price}
                onChange={(e) =>
                  change(index, { unit_price: Number(e.target.value) })
                }
              />
            </label>
            <Button
              type="button"
              disabled={busy}
              onClick={() => {
                setItems(items.filter((_, n) => n !== index));
                setKey(crypto.randomUUID());
              }}
            >
              Quitar
            </Button>
          </fieldset>
        ))}
        <Button
          type="button"
          disabled={busy}
          onClick={() => {
            setItems([
              ...items,
              { product_id: "", quantity: 1, unit_price: 0 },
            ]);
            setKey(crypto.randomUUID());
          }}
        >
          Agregar ítem
        </Button>
        <details>
          <summary>Corrección explícita de descuentos o envío</summary>
          {[
            ["shipping_amount", "Envío"],
            ["coupon_discount_amount", "Cupón"],
            ["transfer_discount_amount", "Transferencia"],
          ].map(([key, label]) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={key in adjustments}
                onChange={(e) => {
                  const next = { ...adjustments };
                  if (e.target.checked) next[key] = 0;
                  else delete next[key];
                  setAdjustments(next);
                  setKey(crypto.randomUUID());
                }}
              />
              {label}
              {key in adjustments && (
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={adjustments[key]}
                  onChange={(e) => {
                    setAdjustments({
                      ...adjustments,
                      [key]: Number(e.target.value),
                    });
                    setKey(crypto.randomUUID());
                  }}
                />
              )}
            </label>
          ))}
        </details>
        <label>
          Motivo
          <Input
            minLength={5}
            required
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setKey(crypto.randomUUID());
            }}
          />
        </label>
        <Button disabled={busy || items.length === 0}>
          Guardar rectificación
        </Button>
      </form>
      <h4>Historial de rectificaciones</h4>
      {history.map((r) => (
        <p key={r.version}>
          Versión {r.version}: {r.reason}
        </p>
      ))}
    </section>
  );
}
