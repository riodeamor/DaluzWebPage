import { describe, expect, it } from "vitest";
import type { Metadata } from "next";
import { applySeoConfig } from "./metadata";
import { seoConfigSchema } from "./config";

const defaults: Metadata = {
  metadataBase: new URL("https://daluzconsciente.com"),
  title: { default: "Da Luz", template: "%s | DA LUZ CONSCIENTE" },
  description: "Descripción original",
  icons: { icon: "/favicon.ico" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_ES",
    images: ["/og-image.jpg"],
    description: "Descripción social original",
  },
  twitter: {
    card: "summary_large_image",
    description: "Descripción de tarjeta original",
    images: ["/og-image.jpg"],
  },
  verification: { other: { existing: "conservar" } },
};

describe("metadatos administrables", () => {
  it("conserva todos los valores actuales cuando no hay configuración", () => {
    expect(applySeoConfig(defaults, {})).toEqual(defaults);
  });

  it("conecta títulos, URL, imagen y verificaciones sin perder icons o robots", () => {
    const result = applySeoConfig(
      defaults,
      seoConfigSchema.parse({
        seo_default_title: "Título administrado",
        seo_default_description: "Descripción administrada",
        seo_canonical_url: "https://www.daluzconsciente.com",
        seo_default_keywords: "plantas, ritual",
        seo_og_title: "Título social",
        seo_og_image_url: "/compartir.jpg",
        seo_google_site_verification: "verify_123",
        seo_bing_webmaster_id: "bing_123",
        seo_twitter_card_type: "summary",
      }),
    );
    expect(result.metadataBase?.origin).toBe("https://www.daluzconsciente.com");
    expect(result.title).toEqual({
      default: "Título administrado",
      template: "%s | DA LUZ CONSCIENTE",
    });
    expect(result.keywords).toEqual(["plantas", "ritual"]);
    expect(result.openGraph).toMatchObject({
      title: "Título social",
      description: "Descripción administrada",
      locale: "es_ES",
      images: [{ url: "/compartir.jpg" }],
    });
    expect(result.twitter).toMatchObject({
      title: "Título social",
      card: "summary",
      images: ["/compartir.jpg"],
    });
    expect(result.verification).toEqual({
      google: "verify_123",
      other: { existing: "conservar", "msvalidate.01": "bing_123" },
    });
    expect(result.icons).toEqual(defaults.icons);
    expect(result.robots).toEqual(defaults.robots);
  });

  it("un cambio parcial no reemplaza descripciones ni imágenes predeterminadas", () => {
    const result = applySeoConfig(defaults, {
      seo_default_title: "Nuevo título",
    });
    expect(result.description).toBe(defaults.description);
    expect(result.openGraph).toMatchObject({
      description: "Descripción social original",
      images: ["/og-image.jpg"],
    });
    expect(result.twitter).toMatchObject({
      description: "Descripción de tarjeta original",
      images: ["/og-image.jpg"],
    });
  });

  it.each(["https://", "javascript:alert(1)", "https://mal formada.com"])(
    "rechaza una URL base inválida: %s",
    (value) => {
      expect(
        seoConfigSchema.safeParse({ seo_canonical_url: value }).success,
      ).toBe(false);
    },
  );

  it("rechaza imágenes con protocolo inseguro o rutas ambiguas", () => {
    for (const value of [
      "javascript:alert(1)",
      "//otro-sitio.com/x.png",
      "/\\otro-sitio/x.png",
      "https://",
    ]) {
      expect(
        seoConfigSchema.safeParse({ seo_og_image_url: value }).success,
      ).toBe(false);
    }
  });
});
