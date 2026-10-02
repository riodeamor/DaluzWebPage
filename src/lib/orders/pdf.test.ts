import { it, expect } from "vitest";
import { orderPdf } from "./pdf";
it("PDF multipágina con acentos, texto escapado y offsets válidos", () => {
  const bytes = orderPdf([
    "Orden (Génesis) \\ comprobante sin validez fiscal",
    ...Array.from({ length: 100 }, (_, i) => "Ítem " + i),
  ]);
  const text = bytes.toString("latin1");
  expect(text.startsWith("%PDF-1.4")).toBe(true);
  expect(text).toContain("/Count 3");
  const xref = Number(text.match(/startxref\n(\d+)/)?.[1]);
  expect(text.slice(xref, xref + 4)).toBe("xref");
  const offsets = [...text.matchAll(/(\d{10}) 00000 n/g)].map((m) =>
    Number(m[1]),
  );
  offsets.forEach((offset, i) =>
    expect(text.slice(offset)).toMatch(new RegExp("^" + (i + 1) + " 0 obj")),
  );
  expect(text).toContain("Génesis");
  expect(text).toContain("\\(Génesis\\)");
});
