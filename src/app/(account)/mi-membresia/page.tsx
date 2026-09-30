"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

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
  const { profile, loading } = useAuthContext();
  const hasPulso = profile?.is_member === true;
  const accountSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="space-y-8 font-[family-name:var(--font-montserrat)]">
      <header className="rounded-2xl bg-[linear-gradient(135deg,#16345F_0%,#005080_100%)] px-6 py-9 text-center text-[#FFF2E9] md:px-10">
        <Image src="/assets/vectores/gota-cristal-facetada.svg" alt="" width={48} height={48} className="mx-auto mb-3 brightness-0 invert" />
        <h1 className="text-4xl font-medium md:text-5xl" style={{ fontFamily: "var(--font-cormorant), serif" }}>Tu Sendero</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#FFF2E9]/90">
          Los espacios de acompañamiento, memoria y transformación que habitás en este ciclo.
        </p>
      </header>

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
          const isActive = experience.name === "El Pulso" && hasPulso;
          return (
            <article key={experience.name} className="dl-card flex h-full flex-col p-6 shadow-sm">
              {isActive && (
                <span className="mb-4 w-fit rounded-full bg-[linear-gradient(135deg,#16345F_0%,#005080_100%)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#FFF2E9]">
                  Acceso activo
                </span>
              )}
              <h2 className="text-3xl font-medium text-[#051341]" style={{ fontFamily: "var(--font-cormorant), serif" }}>{experience.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#16345F]">{experience.description}</p>
              {isActive && accountSince && (
                <p className="mt-4 flex items-center gap-2 text-xs text-[#16345F]">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" /> Cuenta desde {accountSince}
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
    </div>
  );
}
