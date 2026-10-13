"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

function displayValue(value: unknown): string {
  return typeof value === "string" ? value : (JSON.stringify(value) ?? "");
}

export default function ConfigValueEditor({
  configKey,
  value,
  valueType,
  label,
  onSave,
}: {
  configKey: string;
  value: unknown;
  valueType: string;
  label: string;
  onSave: (key: string, value: unknown) => Promise<void>;
}) {
  const [draft, setDraft] = useState(displayValue(value));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);
  useEffect(() => {
    setDraft(displayValue(value));
    setError("");
  }, [value, configKey]);

  async function save(nextValue?: boolean) {
    if (pending.current) return;
    setError("");
    let parsed: unknown = nextValue ?? draft;
    try {
      if (nextValue === undefined && valueType === "number") {
        if (!draft.trim() || !Number.isFinite(Number(draft)))
          throw new Error("Ingresá un número válido.");
        parsed = Number(draft);
      } else if (
        nextValue === undefined &&
        ["array", "json"].includes(valueType)
      ) {
        parsed = JSON.parse(draft);
        if (valueType === "array" && !Array.isArray(parsed))
          throw new Error("Ingresá una lista válida.");
      }
      pending.current = true;
      setSaving(true);
      await onSave(configKey, parsed);
    } catch (cause) {
      setError(
        cause instanceof SyntaxError
          ? "El formato del valor no es válido."
          : cause instanceof Error
            ? cause.message
            : "No se pudo guardar.",
      );
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }

  if (valueType === "boolean")
    return (
      <div>
        <Switch
          aria-label={label}
          checked={value === true}
          disabled={saving}
          onCheckedChange={(checked) => void save(checked)}
        />
        <span className="ml-2 text-sm">
          {saving ? "Guardando…" : value === true ? "Activado" : "Desactivado"}
        </span>
        {error && <p role="alert">{error}</p>}
      </div>
    );
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          aria-label={label}
          type={valueType === "number" ? "number" : "text"}
          value={draft}
          disabled={saving}
          onChange={(event) => setDraft(event.target.value)}
          className="w-full md:w-[400px]"
        />
        <Button
          type="button"
          disabled={saving || draft === displayValue(value)}
          onClick={() => void save()}
        >
          {saving ? "Guardando…" : "Guardar"}
        </Button>
      </div>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
