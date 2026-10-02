import {protectTreasure} from "@/lib/treasures/access";
import type { Metadata } from "next";
import TesoroLayout from "@/components/tesoros/TesoroLayout";
import { tesoros } from "@/content/tesoros/catalogo";
import "@/styles/tesoro-layout.css";

export const metadata: Metadata = {
  title: "Tesoro Umbral Sens | Da Luz Consciente",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export default async function TesoroUmbralPage({searchParams}:{searchParams:{token?:string}}) {
  const secured = await protectTreasure("linea-umbral", tesoros.umbral, searchParams.token);
  return <><TesoroLayout treasure={secured.treasure} />{secured.pdfUrl && <a href={secured.pdfUrl} target="_blank" rel="noopener noreferrer">Descargar guía PDF</a>}</>;
}
