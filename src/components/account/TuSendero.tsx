"use client";

import {useEffect,useState} from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays } from "lucide-react";

const experiences = [
  {
    name: "El Pulso",
    description: "Sintonización mensual de tu eje biológico, contenidos vivos y beneficios en red.",
    href: "/membresia",
  },
  {
    name: "Génesis",
    description: "Un viaje hacia la soberanía biológica y la transformación consciente.",
    href: "/programa-transformacion",
  },
  {
    name: "Sintropía",
    description: "Un espacio de recalibración para pasar del ruido al orden funcional.",
    href: "/programa-transformacion",
  },
] as const;

export default function TuSenderoPage() {
  const [data,setData]=useState<{memberships:any[];orders:any[];treasures:Array<{id:string;route:string;title:string}>}>({memberships:[],orders:[],treasures:[]});
  const [loading,setLoading]=useState(true),[error,setError]=useState("");
  useEffect(()=>{const controller=new AbortController();fetch("/api/profile/sendero",{signal:controller.signal,cache:"no-store"}).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error);setData(d)}).catch(e=>{if(!controller.signal.aborted)setError(e.message)}).finally(()=>{if(!controller.signal.aborted)setLoading(false)});return()=>controller.abort()},[]);
  const hasPulso = data.memberships.some(m=>m.status==="active"&&(!m.end_date||new Date(m.end_date)>new Date()));

  return (
    <div className="space-y-8 font-[family-name:var(--font-montserrat)]">
      <header className="sendero-hero rounded-2xl bg-[linear-gradient(135deg,#16345F_0%,#005080_100%)] px-6 py-9 text-center text-[#FFF2E9] md:px-10">
        <Image src="/assets/vectores/gota-cristal-facetada.svg" alt="" width={48} height={48} className="mx-auto mb-3 brightness-0 invert" />
        <h1 className="text-4xl font-medium md:text-5xl" style={{ fontFamily: "var(--font-cormorant), serif" }}>Tu Sendero</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#FFF2E9]/90">
          Los espacios de acompañamiento, memoria y transformación que habitás en este ciclo.
        </p>
      </header>

      {error && <p role="alert">{error}</p>}
      {!loading && !hasPulso && (
        <div className="rounded-2xl border border-[#0A1D4A]/10 bg-white px-6 py-7 text-center">
          <h2 className="text-3xl text-[#051341]" style={{ fontFamily: "var(--font-cormorant), serif" }}>Tu sendero está abierto</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[#16345F]">
            Explorá experiencias para acompañar el momento que estás viviendo. Cada espacio tiene su propio ritmo.
          </p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-3">
        {experiences.map((experience) => {
          const program = experience.name === "El Pulso" ? "el-pulso" : experience.name === "Génesis" ? "genesis" : "sintropia";
          const membership = data.memberships.find(m=>m.membership_plans?.program_key===program);
          const isActive = membership?.status === "active" && (!membership.end_date || new Date(membership.end_date)>new Date());
          return (
            <article key={experience.name} className="dl-card flex h-full flex-col p-6 shadow-sm">
              {membership && (
                <span className="mb-4 w-fit rounded-full bg-[linear-gradient(135deg,#16345F_0%,#005080_100%)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#FFF2E9]">
                  {({active:"Activo",paused:"Pausado",pending:"Pendiente",cancelled:"Cancelado",expired:"Finalizado"} as Record<string,string>)[membership.status === "active" && !isActive ? "expired" : membership.status]}
                </span>
              )}
              <h2 className="text-3xl font-medium text-[#051341]" style={{ fontFamily: "var(--font-cormorant), serif" }}>{experience.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#16345F]">{experience.description}</p>
              {membership && (
                <p className="mt-4 flex items-center gap-2 text-xs text-[#16345F]">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" /> Desde {new Date(membership.start_date).toLocaleDateString("es-AR")} {membership.end_date && " · Hasta " + new Date(membership.end_date).toLocaleDateString("es-AR")}
                </p>
              )}
              <Link href={experience.href} className="dl-button-primary mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                {isActive ? "Entrar al espacio" : "Conocer la experiencia"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>
      <section><h2>Tus Tesoros desbloqueados</h2>{data.treasures.map(t=><p key={t.id}><Link href={t.route}>{t.title}</Link></p>)}</section>
      <section><h2>Pedidos aprobados</h2>{data.orders.map(o=><p key={o.id}>{o.order_number} <a href={"/api/orders/"+o.id+"/invoice"}>DESCARGAR FACTURA</a></p>)}</section>
    </div>
  );
}
