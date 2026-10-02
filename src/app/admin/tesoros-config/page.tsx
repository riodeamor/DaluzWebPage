"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
