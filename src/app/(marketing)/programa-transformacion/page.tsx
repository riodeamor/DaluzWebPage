import { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BlurText from "@/components/ui/BlurText";
import {
  CalendarDays,
  Clock,
  Users,
  Sparkles,
  Flame,
  Leaf,
  Moon,
  Sun,
  Heart,
  Star,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Programa de Transformación | DA LUZ CONSCIENTE",
  description:
    "Un viaje alquímico de 7 meses con contenido exclusivo, rituales y productos para tu despertar consciente.",
};

const modulos = [
  {
    month: 1,
    title: "Despertar Interior",
    theme: "bg-[#051341]",
    Icon: Sparkles,
    description:
      "Encuentro con tu Ser esencial. Prácticas iniciáticas para sostener la presencia.",
  },
  {
    month: 2,
    title: "Conexión Elemental",
    theme: "bg-[#16345F]",
    Icon: Leaf,
    description:
      "Tierra, agua, fuego y aire como aliados en tu proceso de transformación.",
  },
  {
    month: 3,
    title: "Transformación",
    theme: "bg-[#005080]",
    Icon: Flame,
    description:
      "Atravesar el umbral. Trabajo con sombra, fuego interior y liberación.",
  },
  {
    month: 4,
    title: "Rituales Sagrados",
    theme: "bg-[#0085B1]",
    Icon: Moon,
    description:
      "Ceremonia y ritmo lunar. Diseño de tu propio altar y prácticas devocionales.",
  },
  {
    month: 5,
    title: "Visión Elevada",
    theme: "bg-[#1A3F71]",
    Icon: Sun,
    description:
      "Claridad de propósito. Herramientas para ver con el corazón abierto.",
  },
  {
    month: 6,
    title: "Integración",
    theme: "bg-[#16345F]",
    Icon: Heart,
    description:
      "Hilvanar lo vivido. Tejer cuerpo, alma y vida cotidiana en una sola coherencia.",
  },
  {
    month: 7,
    title: "Manifestación",
    theme: "bg-[#005080]",
    Icon: Star,
    description:
      "Florecer afuera lo cultivado adentro. Tu vida como obra alquímica.",
  },
];

const WHATSAPP_URL =
  "https://wa.me/543512344580?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20Programa%20de%20Transformaci%C3%B3n";
const INSCRIPCION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeSoAkZu-gNpExCbs4JKg-0zaqO8JRU_kL3off0NHHPHSVylQ/viewform?usp=publish-editor";

export default function ProgramaTransformacionPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-white">
      {/* HERO */}
      <section
        id="hero"
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/hero-botanical-background.jpg')",
              filter: "grayscale(1) brightness(0.58) contrast(1.1)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#051341]/80 via-[#005080]/65 to-[#16345F]/80" />
          <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto py-24">
          <Badge className="mb-8 bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-1.5 text-xs tracking-widest uppercase">
            Programa Completo
          </Badge>

          <div className="space-y-8 mb-12">
            <BlurText
              text="Programa de Transformación"
              as="h1"
              className="institutional-section-heading text-4xl md:text-5xl leading-tight drop-shadow-2xl"
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontWeight: 500,
              }}
              delay={120}
              direction="top"
              animateBy="words"
              stepDuration={0.4}
            />

            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto" />

            <BlurText
              text="Un viaje alquímico de 7 meses para alma y cuerpo"
              as="div"
              className="text-xl md:text-2xl lg:text-3xl opacity-95 max-w-4xl mx-auto leading-relaxed tracking-wide"
              style={{
                fontFamily: "Malisha, var(--font-malisha), cursive",
                fontWeight: "300",
                letterSpacing: "0.05em",
              }}
              delay={100}
              direction="bottom"
              animateBy="words"
              stepDuration={0.3}
            />
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="glass-card flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium">
              <CalendarDays className="w-5 h-5" />
              7 Meses de Contenido
            </div>
            <div className="glass-card flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium">
              <Clock className="w-5 h-5" />
              Acceso de por Vida
            </div>
            <div className="glass-card flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium">
              <Users className="w-5 h-5" />
              Comunidad Exclusiva
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href={INSCRIPCION_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                className="group relative px-10 py-4 text-lg font-semibold glass-card text-white hover:bg-white hover:text-gray-900 transition-all duration-500 transform hover:scale-105"
                style={{ borderRadius: "50px" }}
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Inscribirme al Programa
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </a>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                className="group px-8 py-4 text-lg font-medium text-white border-2 border-white/40 hover:bg-white hover:text-gray-900 glass-card transition-all duration-500"
                style={{ borderRadius: "50px" }}
              >
                <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Hablar por WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* MANIFIESTO INTRO */}
      <section
        id="manifiesto"
        className="relative px-6 py-16 md:py-24 overflow-hidden"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2
                className="institutional-section-heading text-3xl md:text-5xl text-[#051341] leading-tight mb-6"
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  fontWeight: 500,
                }}
              >
                Un Portal de 7 Lunas
              </h2>
              <p
                className="text-xl md:text-2xl text-[#16345F] mb-6"
                style={{
                  fontFamily: "Malisha, var(--font-malisha), cursive",
                }}
              >
                Para encontrarte con tu Ser esencial
              </p>
              <div className="space-y-5 text-base md:text-lg text-[#051341] leading-relaxed font-text">
                <p>
                  Este programa es una invitación a recorrer un viaje
                  alquímico estructurado en siete módulos. Cada mes una nueva
                  capa: prácticas, rituales, productos seleccionados y
                  contenidos para acompañar tu transformación.
                </p>
                <p>
                  Caminamos desde el despertar inicial hasta la manifestación
                  consciente de tu vida como obra creadora. Un proceso
                  pensado para habitarse con presencia, sin prisa.
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div
                className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 overflow-hidden"
                style={{
                  borderRadius: "0px 100px",
                  border: "2px solid #005080",
                }}
              >
                <Image
                  src="/images/hero-botanical-background.jpg"
                  alt="Programa de Transformación Da Luz Consciente"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover grayscale"
                  style={{ borderRadius: "0px 100px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULOS */}
      <section
        id="modulos"
        className="relative px-6 py-16 md:py-24 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #FFF 0%, #EAF4F8 50%, #FFF 100%)",
        }}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div
              className="w-32 h-0.5 mx-auto mb-5"
              style={{
                background:
                  "linear-gradient(to right, transparent, #005080, transparent)",
              }}
            />
            <h2
              className="institutional-section-heading text-3xl md:text-5xl text-[#051341] mb-4"
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontWeight: 500,
              }}
            >
              Módulos del Programa
            </h2>
            <p
              className="text-lg md:text-xl text-[#16345F] max-w-3xl mx-auto"
              style={{ fontFamily: "Malisha, var(--font-malisha), cursive" }}
            >
              Siete pasos para tu despertar consciente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {modulos.map((mod) => {
              const ModIcon = mod.Icon;
              return (
                <div
                  key={mod.month}
                  className="group relative overflow-hidden border border-[#005080]/15 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-lg"
                  style={{ borderRadius: "0px 35px" }}
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${mod.theme}`}
                  />
                  <div className="flex items-center justify-between mb-5">
                    <Badge
                      variant="outline"
                      className="border-[#005080]/40 text-[#005080] text-xs tracking-widest uppercase"
                    >
                      Mes {mod.month}
                    </Badge>
                    <div className="w-12 h-12 rounded-full bg-[#005080]/10 flex items-center justify-center transition-transform duration-500 group-hover:rotate-12">
                      <ModIcon className="w-6 h-6 text-[#005080]" />
                    </div>
                  </div>
                  <h3
                    className="institutional-section-heading text-2xl text-[#051341] mb-3"
                    style={{
                      fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                      fontWeight: 500,
                    }}
                  >
                    {mod.title}
                  </h3>
                  <p className="text-sm text-[#16345F] leading-relaxed font-text">
                    {mod.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        id="cta-final"
        className="relative px-6 py-20 md:py-28 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #FFF 0%, #EAF4F8 50%, #FFF 100%)",
        }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2
            className="institutional-section-heading text-3xl md:text-5xl text-[#051341] mb-6 leading-tight"
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              fontWeight: 500,
            }}
          >
            El Viaje Comienza con un Paso
          </h2>
          <p
            className="text-xl md:text-2xl text-[#16345F] mb-10"
            style={{ fontFamily: "Malisha, var(--font-malisha), cursive" }}
          >
            Sumate al programa o escribinos para conocer más
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href={INSCRIPCION_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                className="group bg-gradient-to-br from-[#16345F] to-[#005080] px-10 py-4 text-lg font-semibold text-white transition-all duration-300 hover:from-[#005080] hover:to-[#16345F]"
                style={{ borderRadius: "0px 15px" }}
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Inscribirme al Programa
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="group px-8 py-4 text-lg font-medium border-2 border-[#005080] text-[#005080] hover:bg-[#005080] hover:text-white transition-all duration-300"
                style={{ borderRadius: "0px 15px" }}
              >
                <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Más Información
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
