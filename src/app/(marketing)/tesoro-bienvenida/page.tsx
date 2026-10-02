import {protectTreasure} from "@/lib/treasures/access";
import type { Metadata } from "next";
import TesoroLayout from "@/components/tesoros/TesoroLayout";
import { tesoroBienvenida } from "@/content/tesoros/bienvenida";
import "@/styles/tesoro-layout.css";

export const metadata: Metadata = {
  title: "Tesoro de Bienvenida | Da Luz Consciente",
  description: "Portal de bienvenida al universo de Tesoros Da Luz.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export default async function TesoroBienvenidaPage({searchParams}:{searchParams:{token?:string}}) {
  const secured = await protectTreasure("tesoro-gral", tesoroBienvenida, searchParams.token);
  return <><TesoroLayout treasure={secured.treasure} />{secured.pdfUrl && <a href={secured.pdfUrl} target="_blank" rel="noopener noreferrer">Descargar guía PDF</a>}</>;
}
