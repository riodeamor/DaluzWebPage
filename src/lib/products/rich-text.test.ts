import { describe, expect, it } from "vitest";
import { normalizeProductRichText, productRichTextPlainText, sanitizeProductRichText } from "./rich-text";

describe("product rich text compatibility", () => {
  it("turns legacy emphasis into visible formatting", () => {
    expect(normalizeProductRichText("Cuidado **botánico** y *suave*"))
      .toBe("<p>Cuidado <strong>botánico</strong> y <em>suave</em></p>");
    expect(normalizeProductRichText("<p>Es <b>puro</b></p>"))
      .toBe("<p>Es <b>puro</b></p>");
  });

  it("removes executable markup and attributes before public display", () => {
    const result = sanitizeProductRichText('<p onclick="alert(1)">Piel <strong>viva</strong><img src=x onerror="alert(2)"></p><script>alert(3)</script>');
    expect(result).toContain("<strong>viva</strong>");
    expect(result).not.toMatch(/onclick|onerror|<img|<script|alert/);
  });

  it("escapes literal HTML in plain descriptions", () => {
    expect(sanitizeProductRichText("Rostro < limpio **siempre**"))
      .toContain("&lt; limpio <strong>siempre</strong>");
  });

  it("uses clean text for sharing and product searches", () => {
    expect(productRichTextPlainText("<p>Línea <strong>Ecos</strong> &amp; calma</p>"))
      .toBe("Línea Ecos & calma");
  });
});
