"use client";

import { cn } from "@/lib/utils";

interface TiendaHeroProps {
  className?: string;
}

export default function TiendaHero({ className }: TiendaHeroProps) {
  return (
    <section
      className={cn(
        "relative flex h-[350px] items-center justify-center overflow-hidden bg-[#FAF7F2] px-4 text-center md:h-[300px] lg:h-[400px]",
        className,
      )}
      aria-labelledby="tienda-title"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-botanical-background.jpg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#0A1D4A]/45" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-2xl">
        <span
          className="mx-auto mb-3 block h-10 w-10 bg-[#FFF2E9] md:h-12 md:w-12"
          style={{
            mask: "url('/svg/header/Tienda%20Da%20luz.svg') center / contain no-repeat",
            WebkitMask: "url('/svg/header/Tienda%20Da%20luz.svg') center / contain no-repeat",
          }}
          role="img"
          aria-label="Isotipo Alkimya Da Luz"
        />
        <h1
          id="tienda-title"
          className="font-title text-3xl font-normal uppercase tracking-[0.15em] text-[#FFF2E9] md:text-5xl"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          TIENDA
        </h1>
        <p className="mt-1 mb-4 font-sans text-xs font-medium uppercase tracking-[0.25em] text-[#FFF2E9]/80 md:text-sm" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
          Alkimya Da Luz
        </p>
        <p className="mx-auto max-w-xl font-sans text-xs leading-relaxed text-[#FFF2E9]/90 md:text-sm" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
          Fórmulas vivas de cosmética consciente, maceraciones botánicas y rituales de cuidado diario. Cada alquimya es un puente hacia la soberanía de tu cuerpo.
        </p>
      </div>
    </section>
  );
}
