import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/perfil", "/mis-pedidos", "/carrito", "/checkout", "/tesoro-", "/mis-tesoros", "/mi-membresia"] },
    sitemap: "https://daluzconsciente.com/sitemap.xml",
  };
}
