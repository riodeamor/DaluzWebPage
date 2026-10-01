"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TiendaSettings {
  heroImage?: { asset?: { url?: string }; alt?: string };
  heroTitle?: string;
  heroSubtitle?: string;
}

const DEFAULT_IMAGE = "/images/hero-botanical-background.jpg";

interface TiendaHeroProps {
  className?: string;
}

export default function TiendaHero({ className }: TiendaHeroProps) {
  const [settings, setSettings] = useState<TiendaSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/sanity/tienda-settings", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            setSettings(data.settings);
          }
        }
      } catch (error) {
        console.error("Error fetching tienda settings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // Use Sanity values or defaults
  const heroImageUrl = settings.heroImage?.asset?.url || DEFAULT_IMAGE;

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
        style={{ backgroundImage: `url("${heroImageUrl}")` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#0A1D4A]/45" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-2xl">
        <span
          className="mx-auto mb-3 block h-16 w-16 bg-[#FFF2E9] md:h-20 md:w-20"
          style={{
            mask: "url('/svg/header/Tienda%20Da%20luz.svg') center / contain no-repeat",
            WebkitMask: "url('/svg/header/Tienda%20Da%20luz.svg') center / contain no-repeat",
          }}
          role="img"
          aria-label="Isotipo Alkimya Da Luz"
        />
        <h1
          id="tienda-title"
          className="font-title text-2xl font-normal uppercase tracking-[0.15em] text-[#FFF2E9] md:text-4xl"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          TIENDA
        </h1>
        <p className="mt-1 mb-4 font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-[#FFF2E9]/80 md:text-xs" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
          Alkimya Da Luz
        </p>
        <p className="mx-auto max-w-xl font-sans text-[13px] leading-relaxed text-[#FFF2E9]/90 md:text-[15px]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
          <span className="block">Fórmulas vivas de cosmética consciente, maceraciones botánicas y rituales de cuidado diario.</span>
          <span className="mt-2 block">Cada Alkimya es un puente hacia la soberanía de tu cuerpo y la conexión con tu Ser.</span>
        </p>
      </div>
    </section>
  );
}
