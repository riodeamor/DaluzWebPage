"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function MembershipsAdmin() {
  const [items, setItems] = useState<any[]>([]),
    [plans, setPlans] = useState<any[]>([]),
    [form, setForm] = useState<any>({
      user_id: "",
      plan_id: "",
      status: "active",
      start_date: new Date().toISOString(),
      end_date: null,
    }),
    [error, setError] = useState("");
  const load = async () => {
    const r = await fetch("/api/admin/memberships");
    const d = await r.json();
    if (!r.ok) throw Error(d.error);
    setItems(d.items);
    setPlans(d.plans);
  };
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);
  return (
    <main>
      <h1>Contrataciones de Tu Sendero</h1>
      <p role="alert">{error}</p>
      <section>
        <h2>Asociar planes existentes</h2>
        {plans.map((p) => (
          <label key={p.id}>
            {p.name}
            <select
              value={p.program_key || ""}
              onChange={async (e) => {
                const r = await fetch("/api/admin/memberships", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    id: p.id,
                    program_key: e.target.value || null,
                  }),
                });
                if (!r.ok) setError((await r.json()).error);
                else await load();
              }}
            >
              <option value="">Sin asociación</option>
              <option value="el-pulso">El Pulso</option>
              <option value="genesis">Génesis</option>
              <option value="sintropia">Sintropía</option>
            </select>
          </label>
        ))}
      </section>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const r = await fetch("/api/admin/memberships", {
              method: form.id ? "PUT" : "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(form),
            });
            if (!r.ok) throw Error((await r.json()).error);
            await load();
          } catch (e) {
            setError((e as Error).message);
          }
        }}
      >
        <label>
          ID de usuaria
          <Input
            required
            value={form.user_id}
            onChange={(e) => setForm({ ...form, user_id: e.target.value })}
          />
        </label>
        <label>
          Programa
          <select
            required
            value={form.plan_id}
            onChange={(e) => setForm({ ...form, plan_id: e.target.value })}
          >
            <option value="">Seleccionar</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Estado
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {["active", "paused", "pending", "cancelled", "expired"].map(
              (s) => (
                <option key={s}>{s}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Inicio
          <Input
            required
            type="datetime-local"
            value={form.start_date?.slice(0, 16)}
            onChange={(e) =>
              setForm({
                ...form,
                start_date: new Date(e.target.value).toISOString(),
              })
            }
          />
        </label>
        <label>
          Fin
          <Input
            type="datetime-local"
            value={form.end_date?.slice(0, 16) || ""}
            onChange={(e) =>
              setForm({
                ...form,
                end_date: e.target.value
                  ? new Date(e.target.value).toISOString()
                  : null,
              })
            }
          />
        </label>
        <Button>Guardar</Button>
      </form>
      {items.map((i) => (
        <p key={i.id}>
          {i.membership_plans?.name} · {i.user_id} · {i.status}
          <Button
            onClick={() =>
              setForm({
                id: i.id,
                user_id: i.user_id,
                plan_id: i.plan_id,
                status: i.status,
                start_date: i.start_date,
                end_date: i.end_date,
              })
            }
          >
            Editar
          </Button>
        </p>
      ))}
    </main>
  );
}
