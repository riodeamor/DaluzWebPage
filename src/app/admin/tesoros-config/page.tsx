"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TREASURES } from "@/lib/treasures/catalog";
export default function MediaAdmin() {
  const [items, setItems] = useState<any[]>([]),
    [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/admin/treasure-settings")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.error);
        setItems(d.items);
      })
      .catch((e) => setError(e.message));
  }, []);
  return (
    <main>
      <h1>Archivos de Tesoros</h1>
      <section aria-labelledby="treasure-preview-title" className="my-6">
        <h2 id="treasure-preview-title">Vista previa de Tesoros</h2>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {TREASURES.map((treasure) => (
            <li key={treasure.id}>
              <Link className="underline" href={treasure.route + "?preview=admin"} prefetch={false}>
                Ver {treasure.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <p role="alert">{error}</p>
      {items.map((i, n) => (
        <form
          key={i.access_id}
          onSubmit={async (e) => {
            e.preventDefault();
            const r = await fetch("/api/admin/treasure-settings", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                access_id: i.access_id,
                audio_url: i.audio_url || null,
                pdf_url: i.pdf_url || null,
              }),
            });
            setError(r.ok ? "Guardado" : (await r.json()).error);
          }}
        >
          <h2>{i.title}</h2>
          {["audio_url", "pdf_url"].map((key) => (
            <label key={key}>
              {key === "audio_url"
                ? "Audio externo HTTPS"
                : "PDF externo HTTPS"}
              <Input
                type="url"
                value={i[key] || ""}
                onChange={(e) =>
                  setItems(
                    items.map((item, x) =>
                      x === n ? { ...item, [key]: e.target.value } : item,
                    ),
                  )
                }
              />
            </label>
          ))}
          <Button>Guardar</Button>
        </form>
      ))}
    </main>
  );
}
