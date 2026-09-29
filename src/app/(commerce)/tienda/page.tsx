import type { Metadata } from "next";
import ProductListing from "../productos/page";

const title = "Tienda Alkimya Da Luz | Da Luz Consciente";
const description = "Cosmética viva creada para dialogar con la biología de tu piel. Fórmulas botánicas puras, elixires sensoriales y rituales para habitar el presente.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/tienda" },
  openGraph: {
    title, description, type: "website", locale: "es_AR", url: "/tienda",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Da Luz Consciente" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.jpg"] },
};

export default function StorePage() {
  return <ProductListing />;
}
