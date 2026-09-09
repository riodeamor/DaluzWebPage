'use client';


import Link from "next/link";
import Image from "next/image";
import { client, queries } from "@/lib/sanity/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BlurText from "@/components/ui/BlurText";
import {
  ArrowRight,
  Sparkles,
  Leaf,
  Heart,
  Star,
  Zap,
  Calendar,
  BookOpen,
} from "lucide-react";
import {
  AnimatedBackground,
  SobreNosotrosBackground,
  AlkimyaNeurocosmeticaBackground,
  NuestraFilosofiaBackground,
  BlogBackground,
  GaleriaBackground,
  ContactoBackground,
  ValorYConfianzaBackground,
  ServiciosHolisticosBackground,
  SesionesIcon,
  ProcesosIntegrativosIcon,
  MembresiaIcon,
  AncestralidadNaturalezaIcon,
  VisionIntegralIcon,
  CeremoniaPresenciaIcon,
  PlacerCreatividadIcon,
} from "@/components/svg/SVGComponents";
import InteractiveGallery from "@/components/InteractiveGallery";
import LineasCarousel from "@/components/marketing/LineasCarousel";
import ContactForm from "@/components/ContactForm";

async function getFeaturedPosts() {
  try {
    const posts = await client.fetch(
      queries.allPosts,
      {},
      {
        next: {
          revalidate: 60,
          tags: ["blog-posts", "homepage-posts"],
        },
      },
    );
    
    const recentPosts = posts?.slice(0, 4) || [];
    return recentPosts;
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredPosts = await getFeaturedPosts();

  return (
    <div className="min-h-screen overflow-hidden bg-[#FFF2E9]">
      {/* ✨ ENHANCED HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/hero-botanical-background.jpg')",
              filter: "brightness(0.6) saturate(1.1) contrast(1.1)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-[#051341]/30 to-black/50" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
          </div>
        </div>


<AnimatedBackground />

        <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto">
          <div className="space-y-8 mb-16">
            <div className="relative group cursor-pointer">
              <div className="relative transition-all duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-2">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-400/30 via-cyan-400/30 to-blue-600/30 animate-pulse"></div>
                </div>

                <div className="relative z-10">
                  <BlurText
                    text="DA LUZ CONSCIENTE"
                    as="h1"
                    className="text-5xl md:text-7xl lg:text-[8rem] font-normal leading-none tracking-wider drop-shadow-2xl group-hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] transition-all duration-700 group-hover:text-[#FFF2E9]"
                    style={{
                      fontFamily: "VELISTA, var(--font-velista), serif",
                      fontWeight: "normal",
                      fontStyle: "normal",
                    }}
                    delay={150}
                    direction="top"
                    animateBy="words"
                    stepDuration={0.4}
                  />

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-8" />
              <div className="relative transition-all duration-500 ease-out group-hover:scale-105">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 blur-xl bg-gradient-to-r from-white/20 via-blue-200/20 to-white/20"></div>
                </div>

                <BlurText
                  text="ALKIMYAS PARA ALMA Y CUERPO"
                  as="div"
                  className="text-1xl md:text-2xl lg:text-3xl opacity-95 max-w-4xl mx-auto leading-relaxed tracking-[0.12em] group-hover:text-[#FFF2E9] transition-colors duration-500 uppercase"
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontWeight: "600",
                    fontStyle: "normal",
                  }}
                  delay={100}
                  direction="bottom"
                  animateBy="words"
                  stepDuration={0.3}
                />
              </div>
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-8" />
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/productos">
                <Button
                  className="group relative px-10 py-4 text-lg font-semibold bg-[#16345F] text-[#FFF2E9] hover:bg-[#005080] transition-all duration-500 transform hover:scale-105 uppercase tracking-[0.18em] border-none"
                  style={{ borderRadius: "0px 15px", fontFamily: "var(--font-synthese), sans-serif" }}
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Descubre Nuestras Alkimyas
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>

              <Link href="/filosofia-proposito">
                <Button
                  variant="outline"
                  className="group px-8 py-4 text-lg font-medium text-white border-none uppercase tracking-[0.18em] transition-all duration-300"
                  style={{ 
                    borderRadius: "0px 15px", 
                    fontFamily: "var(--font-synthese), sans-serif",
                    backgroundColor: "#16345F" 
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#005080"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#16345F"}
                >
                  <Heart className="w-5 h-5 mr-2 text-white group-hover:scale-110 transition-transform duration-300" />
                  Conoce Nuestra Historia
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ✨ MANIFIESTO DA LUZ SECTION */}
      <section
        className="relative px-6 overflow-hidden flex flex-col py-12 md:py-16 lg:py-0 section-manifiesto"
        style={{ minHeight: "550px", marginBottom: 0 }}
      >
        <div className="absolute inset-0 xl:hidden" style={{ background: "linear-gradient(135deg, #FFF2E9 0%, #FFF2E9 25%, #FFF2E9 50%, rgba(5, 19, 65, 0.05) 75%, #FFF2E9 100%)" }} />
        <div className="hidden xl:block absolute inset-0" style={{ aspectRatio: "1922.91 / 1080.08" }}>
          <SobreNosotrosBackground bgColor="#FFF2E9" waveColor="#051341" className="opacity-100" />
        </div>

        <div className="text-center relative z-10 flex-shrink-0" style={{ paddingTop: "clamp(1.25rem, 3%, 2.5rem)", paddingBottom: "clamp(0.5rem, 1.5%, 1rem)" }}>
          <div className="lg:mb-8 xl:mb-0"></div>
          <div className="hidden xl:block w-32 h-0.5 mx-auto mb-5" style={{ background: "linear-gradient(to right, transparent, #FFF2E9, transparent)" }} />
          <div className="xl:hidden w-32 h-0.5 mx-auto mb-5" style={{ background: "linear-gradient(to right, transparent, #051341, transparent)" }} />
          <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-6xl 2xl:text-6xl leading-tight text-[#051341] xl:text-[#FFF2E9] uppercase tracking-[0.12em]">
            MANIFIESTO DA LUZ
          </h2>
          <p className="font-subtitle text-base sm:text-lg md:text-xl lg:text-lg xl:text-2xl 2xl:text-2xl mt-[0.3rem] text-[#051341] xl:text-[#FFF2E9]">
            Viví en Presencia, Creá con Placer.
          </p>
          <div className="hidden xl:block w-32 h-0.5 mx-auto mt-4" style={{ background: "linear-gradient(to right, transparent, #FFF2E9, transparent)" }} />
          <div className="xl:hidden w-32 h-0.5 mx-auto mt-4" style={{ background: "linear-gradient(to right, transparent, #051341, transparent)" }} />
        </div>

        <div className="flex-1 flex items-center justify-center relative z-10 py-4 lg:py-8 xl:py-0" style={{ paddingTop: "clamp(0.5rem, 1vh, 1rem)", paddingBottom: "clamp(0.5rem, 1vh, 1rem)" }}>
          <div className="container mx-auto max-w-7xl w-full lg:-mt-12 xl:-mt-36">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-8 xl:gap-16 items-center">
              <div className="flex justify-center lg:justify-end order-1 lg:order-2 w-full">
                <div className="relative">
                  <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-72 lg:h-72 xl:w-96 xl:h-96 overflow-hidden" style={{ borderRadius: "0px 100px", border: "2px solid #051341" }}>
                    <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
                      <Image src="/images/sobre-daluz/sobre-daluz-main.jpg" alt="DA LUZ CONSCIENTE" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" style={{ borderRadius: "0px 100px" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-2 lg:order-1 w-full">
                <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-6 xl:p-8 text-left">
                  <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-4 xl:space-y-6 text-sm sm:text-base md:text-base lg:text-base xl:text-lg leading-relaxed">
                    <p className="font-text text-gray-800">
                      Deseamos que experimentes la profunda conexión con tu Ser esencial. La vida es tu mayor acto de creación: te invitamos a un viaje donde tu cuerpo es el templo y el Placer es el verdadero pase hacia tu Poder Creador
                    </p>
                  </div>
                  <div className="pt-3 sm:pt-4 md:pt-5 lg:pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Link href="/productos">
                      <Button className="bg-[#16345F] hover:bg-[#005080] text-[#FFF2E9] uppercase tracking-[0.18em] px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-7 lg:py-3.5 xl:px-8 xl:py-4 transition-all duration-300 w-full sm:w-auto" style={{ borderRadius: "0px 15px", fontFamily: "var(--font-synthese), sans-serif" }}>
                        VER PRODUCTOS
                      </Button>
                    </Link>
                    <Link href="/servicios/procesos">
                      <Button className="bg-[#16345F] hover:bg-[#005080] text-[#FFF2E9] uppercase tracking-[0.18em] px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-7 lg:py-3.5 xl:px-8 xl:py-4 transition-all duration-300 w-full sm:w-auto" style={{ borderRadius: "0px 15px", fontFamily: "var(--font-synthese), sans-serif" }}>
                        PROCESOS
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✨ ALKIMYA DA LUZ: NEUROCOSMÉTICA SECTION */}
      <section className="relative px-6 overflow-hidden flex flex-col py-12 md:py-16 lg:py-0 section-neurocosmetica" style={{ minHeight: "550px", marginTop: "-4px" }}>
        <div className="absolute inset-0 xl:hidden" style={{ background: "linear-gradient(135deg, #FFF2E9 0%, #FFF2E9 25%, #FFF2E9 50%, rgba(5, 19, 65, 0.05) 75%, #FFF2E9 100%)" }} />
        <div className="hidden xl:block absolute inset-0" style={{ aspectRatio: "1920.19 / 1080.18" }}>
          <AlkimyaNeurocosmeticaBackground bgColor="#FFF2E9" waveColor="#051341" className="opacity-100" />
        </div>

        <div className="text-center relative z-10 flex-shrink-0" style={{ paddingTop: "clamp(0.25rem, 1%, 1rem)", paddingBottom: "clamp(0.5rem, 1.5%, 1rem)" }}>
          <div className="lg:mb-4 xl:mb-0"></div>
          <div className="hidden xl:block w-32 h-0.5 mx-auto mb-5" style={{ background: "linear-gradient(to right, transparent, #FFF2E9, transparent)" }} />
          <div className="xl:hidden w-32 h-0.5 mx-auto mb-5" style={{ background: "linear-gradient(to right, transparent, #051341, transparent)" }} />
          <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-6xl 2xl:text-6xl leading-tight text-[#051341] xl:text-[#FFF2E9] uppercase tracking-[0.12em]">
            ALKIMYA DA LUZ
          </h2>
          <p className="font-subtitle text-base sm:text-lg md:text-xl lg:text-lg xl:text-2xl 2xl:text-2xl mt-[0.3rem] text-[#051341] xl:text-[#FFF2E9]">
            Neurocosmética que Transforma
          </p>
          <div className="hidden xl:block w-32 h-0.5 mx-auto mt-4" style={{ background: "linear-gradient(to right, transparent, #FFF2E9, transparent)" }} />
          <div className="xl:hidden w-32 h-0.5 mx-auto mt-4" style={{ background: "linear-gradient(to right, transparent, #051341, transparent)" }} />
        </div>

        <div className="flex-1 flex items-center justify-center relative z-10 py-4 lg:py-8 xl:py-0" style={{ paddingTop: "clamp(1.5rem, 3vh, 3rem)", paddingBottom: "clamp(0.5rem, 1vh, 1rem)" }}>
          <div className="container mx-auto max-w-4xl w-full lg:mt-0 xl:-mt-12">
            <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-5 xl:space-y-8 text-center">
              <div className="space-y-3 sm:space-y-4">
                <p className="font-text text-base sm:text-lg md:text-lg lg:text-base xl:text-xl leading-relaxed text-gray-800">
                  Una fusión entre saberes ancestrales y biotecnología consciente, creada para quienes buscan ir más allá de la cosmética convencional.
                </p>
                <p className="font-text text-base sm:text-lg md:text-lg lg:text-base xl:text-xl leading-relaxed text-gray-800">
                  Nuestra alquimia es una invitación a potenciar y honrar la comunicación entre tu piel y tu mente, usando tus Sentidos como un canal a tu favor.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4">
                <h3 className="font-title text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl leading-tight text-[#051341]">
                  TU BIOTIPO Y DOSHA
                </h3>
                <p className="font-text text-base sm:text-lg md:text-lg lg:text-base xl:text-xl leading-relaxed text-gray-800">
                  Tu Alkimya Comienza con la Consciencia.
                </p>
                <p className="font-text text-base sm:text-lg md:text-lg lg:text-base xl:text-xl leading-relaxed text-gray-800">
                  ¿Sabés qué necesita realmente tu piel para alcanzar su bioequilibrio?
                </p>
              </div>

              <div className="pt-4 sm:pt-5 md:pt-6">
                <Link href="/alkimya/biotipos-doshas">
                  <Button className="bg-[#16345F] hover:bg-[#005080] text-[#FFF2E9] uppercase tracking-[0.18em] px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-7 lg:py-3.5 xl:px-8 xl:py-4 transition-all duration-300" style={{ borderRadius: "0px 15px", fontFamily: "var(--font-synthese), sans-serif" }}>
                    CONOCE TU BIOTIPO Y DOSHA
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARRUSEL DE LÍNEAS */}
      <LineasCarousel />
{/* VALOR Y CONFIANZA DA LUZ */}
      <section className="section-enhanced relative px-6 overflow-hidden flex flex-col py-12 md:py-16 lg:py-0 section-valor-confianza" style={{ minHeight: "400px", backgroundColor: "#FFF2E9", position: "relative", zIndex: 1, marginTop: "-4px" }}>
        <div className="absolute inset-0 xl:hidden" style={{ background: "linear-gradient(135deg, #FFF2E9 0%, #FFF2E9 25%, #FFF2E9 50%, rgba(5, 19, 65, 0.05) 75%, #FFF2E9 100%)", zIndex: 0 }} />
        <div className="hidden xl:block absolute inset-0" style={{ aspectRatio: "1920.07 / 1080.12", minHeight: "100%", zIndex: 0 }}>
          <ValorYConfianzaBackground bgColor="#FFF2E9" waveColor="#051341" className="opacity-100" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-20 flex flex-col justify-center h-full py-12 pt-8 sm:pt-10 md:pt-12 lg:pt-6">
          <div className="text-center mb-4 sm:mb-5 md:mb-6 lg:mb-8">
            <div className="w-32 h-0.5 mx-auto mb-4 sm:mb-5" style={{ background: "linear-gradient(to right, transparent, #051341, transparent)" }} />
            <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-6xl mb-4 sm:mb-5 md:mb-6 leading-tight text-[#051341] uppercase tracking-[0.12em]">
              VALOR Y CONFIANZA DA LUZ
            </h2>
            <div className="w-32 h-0.5 mx-auto mt-3 sm:mt-4" style={{ background: "linear-gradient(to right, transparent, #051341, transparent)" }} />
          </div>

          <div className="max-w-4xl mx-auto text-center px-4 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <p className="font-text text-base sm:text-lg md:text-lg lg:text-xl xl:text-xl text-gray-800 leading-relaxed">
              Compromiso con la pureza y la eficacia biológica. También, un compromiso con tu Soberanía: te entregamos información y rituales para que seas la guía de tu propio proceso.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8">
            {[
              { title: "TRANSPARENCIA TOTAL", text: "Accede a toda la información sobre la materia prima que usamos para nutrir tu piel.", link: "/alkimya/activos-origen" },
              { title: "CEREMONIA DIARIA", text: "Conoce los pasos y rituales para transformar tu rutina en un verdadero acto de amor y presencia.", link: "/alkimya/tu-ceremonia" },
              { title: "TESOROS DA LUZ", text: "¡Descubrí los regalos alkímicos a los que accederás con cada una de tus compras!", link: "/alkimya/tesoros-daluz" },
              { title: "MANIFIESTO Y VISIÓN", text: "Conoce la filosofía en la que nos basamos para entregarte productos expansivos y amorosos.", link: "/alkimya" }
            ].map((item, idx) => (
              <div key={idx} className="card-enhanced border-0 p-5 sm:p-6 md:p-7 lg:p-8 xl:p-10 text-center flex flex-col justify-between h-full" style={{ borderTop: "3px solid #16345F" }}>
                <div>
                  <h3 className="font-subtitle text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-2xl text-[#051341] mb-3 sm:mb-4 not-italic font-semibold">{item.title}</h3>
                  <p className="font-text text-gray-800 text-sm sm:text-base md:text-base lg:text-lg xl:text-lg mb-4 sm:mb-5 md:mb-6 leading-relaxed">{item.text}</p>
                </div>
                <Link href={item.link} className="w-full">
                  <Button 
                    className="group/btn w-full transition-all duration-300 uppercase tracking-[0.18em] text-white" 
                    style={{ 
                      borderRadius: "0px 15px", 
                      fontFamily: "var(--font-synthese), sans-serif",
                      backgroundColor: "#16345F",
                      border: "none"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#005080"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#16345F"}
                  >
                    Ver más <ArrowRight className="w-5 h-5 ml-2 text-white group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* ✨ SERVICIOS HOLÍSTICOS SECTION */}
      <section className="section-enhanced relative px-6 overflow-hidden flex flex-col py-12 md:py-16 lg:py-0 section-servicios" style={{ minHeight: "400px", backgroundColor: "#FFF2E9", position: "relative", zIndex: 10, marginTop: "-4px" }}>
        <div className="absolute inset-0 xl:hidden" style={{ background: "linear-gradient(135deg, #FFF2E9 0%, #FFF2E9 25%, #FFF2E9 50%, rgba(5, 19, 65, 0.05) 75%, #FFF2E9 100%)", zIndex: 0 }} />
        <div className="hidden xl:block absolute inset-0" style={{ aspectRatio: "1920.23 / 1080.23", minHeight: "100%", zIndex: 0 }}>
          <ServiciosHolisticosBackground bgColor="#FFF2E9" waveColor="#051341" className="opacity-100" />
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-20 flex flex-col justify-center h-full py-12 pt-16 sm:pt-20 md:pt-24 lg:pt-12 servicios-holisticos-container">
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <div className="xl:hidden w-32 h-0.5 mx-auto mb-4 sm:mb-5" style={{ background: "linear-gradient(to right, transparent, #051341, transparent)" }} />
            <div className="hidden xl:block w-32 h-0.5 mx-auto mb-4 sm:mb-5" style={{ background: "linear-gradient(to right, transparent, #FFF2E9, transparent)" }} />
            <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-6xl mb-3 sm:mb-4 leading-tight text-[#051341] xl:text-[#FFF2E9] uppercase tracking-[0.12em]">
              SERVICIOS HOLÍSTICOS
            </h2>
            <div className="xl:hidden w-32 h-0.5 mx-auto mt-3 sm:mt-4" style={{ background: "linear-gradient(to right, transparent, #051341, transparent)" }} />
            <div className="hidden xl:block w-32 h-0.5 mx-auto mt-3 sm:mt-4" style={{ background: "linear-gradient(to right, transparent, #FFF2E9, transparent)" }} />
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7 pt-6 sm:pt-8 md:pt-10 lg:pt-12">
            
            {/* PROCESOS INTEGRATIVOS */}
            <div className="group card-enhanced p-5 sm:p-6 md:p-7 lg:p-8 text-center flex flex-col" style={{ borderTop: "3px solid #16345F" }}>
              <div className="relative z-10 space-y-4 sm:space-y-5 md:space-y-6 flex-1 flex flex-col">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 text-[#16345F] transition-all duration-300 mx-auto">
                  <ProcesosIntegrativosIcon size={48} className="sm:w-14 sm:h-14 md:w-16 md:h-16" />
                </div>
                <h3 className="font-subtitle text-lg sm:text-xl md:text-xl lg:text-xl text-[#051341] group-hover:text-[#16345F] transition-colors duration-300 not-italic font-semibold">
                  Procesos Cíclicos
                </h3>
                <div className="font-text text-gray-800 text-sm sm:text-sm md:text-[0.95rem] text-left leading-relaxed transition-colors duration-300 space-y-2 sm:space-y-3 flex-1">
                  <p>Programas cíclicos para que te re-conectes con tu naturaleza.</p>
                  <p>Aprendé a escuchar tu cuerpo y a crear mayor consciencia sobre tus acciones.</p>
                  <p>Explorá ejercicios reflexivos, corporales y energéticos para reprogramarte y sentir tu poder creador.</p>
                </div>
                <div className="flex justify-center mt-6 w-full">
                  <Link href="/servicios/procesos/ciclos-alquimicos" className="w-full">
                    <Button
                      variant="outline"
                      className="group/btn w-full text-[#FFF2E9] uppercase tracking-[0.18em] transition-all duration-300 whitespace-normal break-words h-auto py-2 px-4 flex items-center justify-center gap-2"
                      style={{ borderRadius: "0px 15px", fontFamily: "var(--font-synthese), sans-serif", border: "none", backgroundColor: "#16345F" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#005080"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#16345F"}
                    >
                      <span className="text-center text-sm leading-tight flex-1">EXPLORAR LOS PROCESOS DE TRANSFORMACIÓN</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* SESIONES HOLÍSTICAS */}
            <div className="group card-enhanced p-5 sm:p-6 md:p-7 lg:p-8 text-center flex flex-col" style={{ borderTop: "3px solid #16345F" }}>
              <div className="relative z-10 space-y-4 sm:space-y-5 md:space-y-6 flex-1 flex flex-col">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 text-[#16345F] transition-all duration-300 mx-auto">
                  <SesionesIcon size={48} className="sm:w-14 sm:h-14 md:w-16 md:h-16" />
                </div>
                <h3 className="font-subtitle text-lg sm:text-xl md:text-xl lg:text-xl text-[#051341] group-hover:text-[#16345F] transition-colors duration-300 not-italic font-semibold">
                  Sesiones Integrales
                </h3>
                <div className="font-text text-gray-800 text-sm sm:text-sm md:text-[0.95rem] text-left leading-relaxed transition-colors duration-300 space-y-2 sm:space-y-3 flex-1">
                  <p>3 propuestas para potenciar tu claridad y armonía.</p>
                  <p>Conectá con el aquí y ahora. Utilizamos herramientas ancestrales como Reiki Usui y Karuna, Cuencos Sonoros, Aromaterapia, Flores de Bach y más.</p>
                </div>
                <div className="flex justify-center mt-6 w-full">
                  <Link href="/servicios/procesos/sesiones-integrales" className="w-full">
                    <Button
                      variant="outline"
                      className="group/btn w-full text-[#FFF2E9] uppercase tracking-[0.18em] transition-all duration-300 whitespace-normal break-words h-auto py-2 px-4 flex items-center justify-center gap-2"
                      style={{ borderRadius: "0px 15px", fontFamily: "var(--font-synthese), sans-serif", border: "none", backgroundColor: "#16345F" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#005080"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#16345F"}
                    >
                      <span className="text-center text-sm leading-tight flex-1">¡CONOCE NUESTRAS PROPUESTAS!</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* MEMBRESÍA */}
            <div className="group card-enhanced p-5 sm:p-6 md:p-7 lg:p-8 text-center flex flex-col" style={{ borderTop: "3px solid #16345F" }}>
              <div className="relative z-10 space-y-4 sm:space-y-5 md:space-y-6 flex-1 flex flex-col">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 text-[#16345F] transition-all duration-300 mx-auto">
                  <MembresiaIcon size={48} className="sm:w-14 sm:h-14 md:w-16 md:h-16" />
                </div>
                <h3 className="font-subtitle text-lg sm:text-xl md:text-xl lg:text-xl text-[#051341] group-hover:text-[#16345F] transition-colors duration-300 not-italic font-semibold">
                  Experiencias: Programas y Membresías
                </h3>
                <div className="font-text text-gray-800 text-sm sm:text-sm md:text-[0.95rem] text-left leading-relaxed transition-colors duration-300 space-y-2 sm:space-y-3 flex-1">
                  <p>Un espacio para introducirte en el mundo de Da Luz, con videos, meditaciones, ejercicios y biblioteca virtual.</p>
                </div>
                <div className="flex justify-center mt-6 w-full">
                  <Link href="/programa-transformacion" className="w-full">
                    <Button
                      variant="outline"
                      className="group/btn w-full text-[#FFF2E9] uppercase tracking-[0.18em] transition-all duration-300 whitespace-normal break-words h-auto py-2 px-4 flex items-center justify-center gap-2"
                      style={{ borderRadius: "0px 15px", fontFamily: "var(--font-synthese), sans-serif", border: "none", backgroundColor: "#16345F" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#005080"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#16345F"}
                    >
                      <span className="text-center text-sm leading-tight flex-1">SÉ PARTE DEL RITUAL</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ✨ ENHANCED PHILOSOPHY SECTION */}
      <section
        className="section-enhanced relative py-6 md:py-8 lg:py-16 px-6 overflow-hidden"
        style={{ marginTop: "-3rem" }}
      >
        <div
          className="absolute inset-0 xl:hidden"
          style={{
            background: "linear-gradient(135deg, #051341 0%, rgba(5, 19, 65, 0.9) 25%, #051341 50%, rgba(5, 19, 65, 0.95) 75%, #051341 100%)",
          }}
        />
        <div className="hidden xl:block absolute inset-0">
          <NuestraFilosofiaBackground
            bgColor="#051341"
            className="opacity-100"
          />
        </div>

        <div className="text-center pb-5 mt-[-2rem] mb-[6rem] relative z-20">
          <div
            className="w-32 h-0.5 mx-auto mb-4 sm:mb-5"
            style={{ background: "linear-gradient(to right, transparent, #FFF2E9, transparent)" }}
          />
          <h2
            className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-6xl mb-4 sm:mb-5 md:mb-6 leading-tight uppercase tracking-[0.12em]"
            style={{ color: "#FFF2E9" }}
          >
            HONRAMOS NUESTRAS RAÍCES
          </h2>
          <div
            className="w-32 h-0.5 mx-auto mt-4 sm:mt-5 mb-4 sm:mb-5"
            style={{ background: "linear-gradient(to right, transparent, #FFF2E9, transparent)" }}
          />
          <p className="font-text text-base sm:text-lg md:text-lg lg:text-xl xl:text-xl max-w-3xl mx-auto leading-relaxed px-4" style={{ color: "#FFF2E9" }}>
            Descubrí la visión integral que impulsa a Da Luz y la historia
            detrás de nuestra filosofía: Viví en Presencia, Creá con Placer,
            Honrá tus Raíces.
          </p>
        </div>

        <div className="container mx-auto max-w-7xl relative z-20">
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-[-2rem]">
            {[
              {
                title: "Naturaleza y Ancestralidad",
                description: (
                  <>
                    <p>Vivimos y creamos en armonía con la Madre Tierra, respetando toda forma de vida.</p>
                    <p>Conectamos con la sabiduría de las hierbas medicinales y las técnicas ancestrales para potenciar tu bienestar en resonancia con el ritmo natural de tu Ser.</p>
                    <p>Te invitamos a Reconocer tus raíces, y a semillar con intención para nutrir tus frutos.</p>
                  </>
                ),
                icon: <AncestralidadNaturalezaIcon size={50} className="" />,
              },
              {
                title: "Visión Integral y Autogestión",
                description: (
                  <>
                    <p>Abrazamos una Visión Integral del bienestar que abarca tu ser físico, emocional, mental y energético.</p>
                    <p>Todas nuestras propuestas son creadas con conciencia de las diversas bio-individualidades.</p>
                    <p>Conectá con la autogestión de tu Ser integral eligiendo conscientemente a qué destinar energía y atención, priorizando tus verdaderas necesidades y deseos.</p>
                  </>
                ),
                icon: <VisionIntegralIcon size={50} className="" />,
              },
              {
                title: "Ceremonia y Presencia",
                description: (
                  <>
                    <p>Creemos que vivir cada día como una nueva ceremonia nos recuerda lo valioso y sagrado que es Ser y habitar la Tierra.</p>
                    <p>Da Luz es un llamado a la presencia; para que re-conozcas tus cuerpos y experimentes tus sentidos y sentires de manera consciente.</p>
                    <p>Regalate tiempo de calidad para crear tu hogar, mirarte y conectar con tu propia Alquimia Viva.</p>
                  </>
                ),
                icon: <CeremoniaPresenciaIcon size={50} className="" />,
              },
              {
                title: "Placer y Creación Consciente",
                description: (
                  <>
                    <p>Crear desde el Placer es nuestro mantra.</p>
                    <p>Creemos que la forma más expansiva de vincularte con tus cuerpos y procesos es dándote tiempo para explorar con tus propios recursos —tu voz, tu cuerpo, tus sentidos— desde el goce.</p>
                    <p>Nuestro propósito es que re-conectes con tu Sacralidad: el verdadero pase hacia tu poder Creador.</p>
                  </>
                ),
                icon: <PlacerCreatividadIcon size={50} className="" />,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group glass-card p-8 rounded-2xl border border-white/20 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2"
                style={{ backgroundColor: "rgba(255, 242, 233, 0.05)" }}
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-white/20 transition-colors duration-300 text-[#FFF2E9]">
                    {item.icon}
                  </div>
                  <h3 className="font-subtitle text-lg sm:text-xl md:text-xl text-[#FFF2E9] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <div className="font-text text-[#FFF2E9] text-xs sm:text-sm md:text-sm leading-relaxed transition-colors duration-300 space-y-2">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

           {/* 📖 BLOG DA LUZ SECTION */}
      <section className="section-enhanced relative py-12 md:py-16 lg:py-24 px-6 overflow-hidden" style={{ backgroundColor: "#FFF2E9" }}>
        <div className="text-center pb-5 mb-[3rem] relative z-20 px-4">
          <div className="w-24 sm:w-32 h-0.5 mx-auto mb-3" style={{ background: "linear-gradient(to right, transparent, #051341, transparent)" }} />
          <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 leading-tight uppercase tracking-[0.12em]" style={{ color: "#051341" }}>
            BLOG DA LUZ
          </h2>
          <div
            className="w-32 h-0.5 mx-auto mt-3 sm:mt-4 mb-4 sm:mb-5 md:mb-6"
            style={{ background: "linear-gradient(to right, transparent, #051341, transparent)" }}
          />
          <p className="font-text text-base sm:text-lg md:text-lg lg:text-xl xl:text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed px-4">
            Un espacio donde fusionamos teorías, reflexión e introspección con herramientas para la autogestión y la presencia.
          </p>
        </div>

        <div className="container mx-auto max-w-7xl relative z-20 pb-12">
          {featuredPosts.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* LEFT SIDE (Fondo claro - mantiene texto oscuro) */}
              <div className="space-y-6 lg:mr-[5rem]">
                <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4">
                  {featuredPosts[0] && (
                    <Link href={`/blog/${featuredPosts[0].slug.current}`} className="group col-span-2 row-span-1">
                      <div className="glass-card h-full p-6 rounded-2xl border transition-all duration-500 transform hover:-translate-y-2 bg-white/60" style={{ borderColor: "rgba(5, 19, 65, 0.1)" }}>
                        <div className="grid grid-cols-2 gap-4 h-full">
                          <div className="bg-[#051341]/5 rounded-lg flex items-center justify-center overflow-hidden relative">
                            {featuredPosts[0].mainImage?.asset?.url ? (
                              <Image src={featuredPosts[0].mainImage.asset.url} alt={featuredPosts[0].title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover rounded-lg" />
                            ) : (
                              <Sparkles className="w-12 h-12 text-[#051341]/30" />
                            )}
                          </div>
                          <div className="flex flex-col justify-between">
                            <div>
                              <Badge className="bg-[#16345F] text-[#FFF2E9] mb-2 hover:bg-[#005080]" variant="default">Post</Badge>
                              <h3 className="font-subtitle text-lg text-[#051341] group-hover:text-[#16345F] transition-colors duration-300 line-clamp-3 mb-2 not-italic font-semibold">
                                {featuredPosts[0].title}
                              </h3>
                              <p className="font-text text-gray-700 text-sm leading-relaxed line-clamp-2">
                                {featuredPosts[0].excerpt || "Descubre más sobre este fascinante tema..."}
                              </p>
                            </div>
                            <div className="flex items-center text-gray-500 text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(featuredPosts[0].publishedAt).toLocaleDateString("es-ES", { month: "short", day: "numeric" })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}

                  {featuredPosts[2] && (
                    <Link href={`/blog/${featuredPosts[2].slug.current}`} className="group col-span-1 row-span-1">
                      <div className="glass-card h-full p-4 rounded-2xl border transition-all duration-500 transform hover:-translate-y-2 bg-white/60" style={{ borderColor: "rgba(5, 19, 65, 0.1)" }}>
                        <div className="bg-[#051341]/5 rounded-lg h-20 mb-3 flex items-center justify-center overflow-hidden relative">
                          {featuredPosts[2].mainImage?.asset?.url ? (
                            <Image src={featuredPosts[2].mainImage.asset.url} alt={featuredPosts[2].title} fill sizes="(max-width: 768px) 50vw, 16vw" className="object-cover rounded-lg" />
                          ) : (
                            <Leaf className="w-6 h-6 text-[#051341]/30" />
                          )}
                        </div>
                        <h4 className="font-subtitle text-sm text-[#051341] group-hover:text-[#16345F] transition-colors duration-300 line-clamp-2 mb-2 not-italic font-semibold">
                          {featuredPosts[2].title}
                        </h4>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(featuredPosts[2].publishedAt).toLocaleDateString("es-ES", { month: "short", day: "numeric" })}
                        </div>
                      </div>
                    </Link>
                  )}

                  {featuredPosts[3] && (
                    <Link href={`/blog/${featuredPosts[3].slug.current}`} className="group col-span-1 row-span-1">
                      <div className="glass-card h-full p-4 rounded-2xl border transition-all duration-500 transform hover:-translate-y-2 bg-white/60" style={{ borderColor: "rgba(5, 19, 65, 0.1)" }}>
                        <div className="bg-[#051341]/5 rounded-lg h-20 mb-3 flex items-center justify-center overflow-hidden relative">
                          {featuredPosts[3].mainImage?.asset?.url ? (
                            <Image src={featuredPosts[3].mainImage.asset.url} alt={featuredPosts[3].title} fill sizes="(max-width: 768px) 50vw, 16vw" className="object-cover rounded-lg" />
                          ) : (
                            <Leaf className="w-6 h-6 text-[#051341]/30" />
                          )}
                        </div>
                        <h4 className="font-subtitle text-sm text-[#051341] group-hover:text-[#16345F] transition-colors duration-300 line-clamp-2 mb-2 not-italic font-semibold">
                          {featuredPosts[3].title}
                        </h4>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(featuredPosts[3].publishedAt).toLocaleDateString("es-ES", { month: "short", day: "numeric" })}
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE (Fondo azul - Textos en BLANCO FORZADO) */}
              <div className="space-y-6 lg:ml-[5rem]">
                <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4">
                  {featuredPosts[0] && (
                    <Link href={`/blog/${featuredPosts[0].slug.current}`} className="group col-span-1 row-span-1">
                      <div className="glass-card h-full p-4 rounded-2xl border transition-all duration-500 transform hover:-translate-y-2 bg-[#16345F]/40 backdrop-blur-md" style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}>
                        <div className="bg-[#051341]/40 rounded-lg h-20 mb-3 flex items-center justify-center overflow-hidden relative">
                          {featuredPosts[0].mainImage?.asset?.url ? (
                            <Image src={featuredPosts[0].mainImage.asset.url} alt={featuredPosts[0].title} fill sizes="(max-width: 768px) 50vw, 16vw" className="object-cover rounded-lg" />
                          ) : (
                            <Leaf className="w-6 h-6 text-white/50" />
                          )}
                        </div>
                        <h4 className="font-subtitle text-sm text-white group-hover:text-blue-200 transition-colors duration-300 line-clamp-2 mb-2 not-italic font-semibold">
                          {featuredPosts[0].title}
                        </h4>
                        <div className="flex items-center text-white/80 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(featuredPosts[0].publishedAt).toLocaleDateString("es-ES", { month: "short", day: "numeric" })}
                        </div>
                      </div>
                    </Link>
                  )}

                  {featuredPosts[1] && (
                    <Link href={`/blog/${featuredPosts[1].slug.current}`} className="group col-span-1 row-span-1">
                      <div className="glass-card h-full p-4 rounded-2xl border transition-all duration-500 transform hover:-translate-y-2 bg-[#16345F]/40 backdrop-blur-md" style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}>
                        <div className="bg-[#051341]/40 rounded-lg h-20 mb-3 flex items-center justify-center overflow-hidden relative">
                          {featuredPosts[1].mainImage?.asset?.url ? (
                            <Image src={featuredPosts[1].mainImage.asset.url} alt={featuredPosts[1].title} fill sizes="(max-width: 768px) 50vw, 16vw" className="object-cover rounded-lg" />
                          ) : (
                            <Leaf className="w-6 h-6 text-white/50" />
                          )}
                        </div>
                        <h4 className="font-subtitle text-sm text-white group-hover:text-blue-200 transition-colors duration-300 line-clamp-2 mb-2 not-italic font-semibold">
                          {featuredPosts[1].title}
                        </h4>
                        <div className="flex items-center text-white/80 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(featuredPosts[1].publishedAt).toLocaleDateString("es-ES", { month: "short", day: "numeric" })}
                        </div>
                      </div>
                    </Link>
                  )}

                  {featuredPosts[1] && (
                    <Link href={`/blog/${featuredPosts[1].slug.current}`} className="group col-span-2 row-span-1">
                      <div className="glass-card h-full p-6 rounded-2xl border transition-all duration-500 transform hover:-translate-y-2 bg-[#16345F]/40 backdrop-blur-md" style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}>
                        <div className="grid grid-cols-2 gap-4 h-full">
                          <div className="flex flex-col justify-between">
                            <div>
                              <Badge className="bg-[#005080] text-white mb-2" variant="default">Post</Badge>
                              <h3 className="font-subtitle text-lg text-white group-hover:text-blue-200 transition-colors duration-300 line-clamp-3 mb-2 not-italic font-semibold">
                                {featuredPosts[1].title}
                              </h3>
                              <p className="font-text text-white/90 text-sm leading-relaxed line-clamp-2">
                                {featuredPosts[1].excerpt || "Explora este contenido fascinante..."}
                              </p>
                            </div>
                            <div className="flex items-center text-white/80 text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(featuredPosts[1].publishedAt).toLocaleDateString("es-ES", { month: "short", day: "numeric" })}
                            </div>
                          </div>
                          <div className="bg-[#051341]/40 rounded-lg flex items-center justify-center overflow-hidden relative">
                            {featuredPosts[1].mainImage?.asset?.url ? (
                              <Image src={featuredPosts[1].mainImage.asset.url} alt={featuredPosts[1].title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover rounded-lg" />
                            ) : (
                              <Sparkles className="w-12 h-12 text-white/50" />
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12"><p className="font-text text-white">Próximamente más artículos...</p></div>
          )}

          <div className="flex flex-col items-center gap-4 mt-8 sm:mt-10 md:mt-12">
            <Link
              href="/blog"
              className="group inline-flex items-center justify-center gap-3 px-6 py-3 sm:px-8 sm:py-4 text-[#FFF2E9] uppercase tracking-[0.18em] transition-all duration-300"
              style={{ 
                borderRadius: "0 15px", 
                fontFamily: "var(--font-synthese), sans-serif",
                backgroundColor: "#16345F"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#005080"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#16345F"}
            >
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
              <span className="text-sm sm:text-base font-semibold text-white">Ir al blog</span>
            </Link>
          </div>
        </div>
      </section>
      

     {/* ✨ ENHANCED GALERÍA SECTION */}
      <section className="section-enhanced relative py-12 md:py-16 lg:py-24 px-6 overflow-hidden" style={{ backgroundColor: "#FFF2E9" }}>
        <div
          className="absolute inset-0 xl:hidden"
          style={{ background: "linear-gradient(135deg, #FFF2E9 0%, #FFF2E9 25%, #FFF2E9 50%, rgba(5, 19, 65, 0.05) 75%, #FFF2E9 100%)" }}
        />
        <div className="hidden xl:block absolute inset-0">
          <GaleriaBackground bgColor="#FFF2E9" waveColor="#16345F" className="opacity-95" />
        </div>

        <div className="text-center pb-5 mt-[-2rem] mb-[3rem] relative z-20 px-4">
          <div className="w-24 sm:w-32 h-0.5 mx-auto mb-3" style={{ background: "linear-gradient(to right, transparent, #051341, transparent)" }} />
          <h2
            className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 leading-tight uppercase tracking-[0.12em] text-white"
          >
            GALERÍA
          </h2>
          <div className="w-24 sm:w-32 h-0.5 mx-auto mt-3 mb-3" style={{ background: "linear-gradient(to right, transparent, #051341, transparent)" }} />
        </div>

        <div className="container mx-auto max-w-7xl relative z-20 -mt-8 sm:-mt-10 md:-mt-12 lg:-mt-16">
          <InteractiveGallery />
          <div className="text-center mt-16">
            <div className="space-y-4">
              <h3 className="font-subtitle text-2xl text-[#051341] not-italic font-semibold">FRAGMENTOS DE UN RITUAL VIVO</h3>
              <p className="font-text max-w-2xl mx-auto text-gray-800">
                Cada imagen cuenta una historia de transformación, belleza consciente y conexión con la naturaleza.
              </p>
              <a href="https://instagram.com/daluzconsciente" target="_blank" rel="noopener noreferrer">
                <Button 
                  className="group px-8 py-4 text-lg text-white uppercase tracking-[0.18em]" 
                  style={{ 
                    borderRadius: "0px 15px", 
                    fontFamily: "var(--font-synthese), sans-serif",
                    backgroundColor: "#16345F",
                    border: "none"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#005080"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#16345F"}
                >
                  <Heart className="w-5 h-5 mr-2 text-white group-hover:scale-110 transition-transform duration-300" />
                  SEGUINOS EN INSTAGRAM
                  <ArrowRight className="w-5 h-5 ml-2 text-white group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ✨ ENHANCED CONTACTO SECTION */}
      <section
        className="section-enhanced relative py-6 md:py-8 lg:py-16 px-6 overflow-hidden"
        style={{ marginTop: "-3rem", backgroundColor: "#FFF2E9" }}
      >
        <div className="absolute inset-0 xl:hidden" style={{ background: "linear-gradient(135deg, #FFF2E9 0%, #FFF2E9 25%, #FFF2E9 50%, rgba(5, 19, 65, 0.05) 75%, #FFF2E9 100%)" }} />
        <div className="hidden xl:block absolute inset-0">
          <ContactoBackground bgColor="#FFF2E9" waveColor="#051341" className="opacity-95" />
        </div>

        <div className="container mx-auto max-w-7xl text-left pb-[3rem] sm:pb-[5rem] mt-[0rem] mb-[0rem] relative z-20 px-4">
          <div className="w-24 sm:w-32 h-0.5 mx-4 sm:mx-10 mb-2" style={{ background: "linear-gradient(to right, transparent, #051341, transparent)" }} />
          <h2
            className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-6xl leading-tight uppercase tracking-[0.12em]"
            style={{ color: "#051341" }}
          >
            CONTACTO
          </h2>
          <div className="w-24 sm:w-32 h-0.5 mx-4 sm:mx-10 mt-2" style={{ background: "linear-gradient(to right, transparent, #051341, transparent)" }} />
        </div>

        <div className="container mx-auto max-w-7xl relative z-20 px-4">
         <p
            className="text-xl sm:text-2xl lg:text-3xl max-w-3xl mx-auto leading-relaxed text-center text-[#051341]"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "normal",
              fontWeight: "500",
            }}
          >
            Iniciá tu transformación: enviame tu consulta y descubrí cómo podemos acompañarte en tu viaje de autoconocimiento y bienestar integral.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 pt-[3rem] lg:pt-[4rem] xl:pt-[5rem] gap-8 lg:gap-8 xl:gap-16 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <ContactForm />
            </div>

            <div className="flex items-center justify-center lg:justify-end order-1 lg:order-2 mb-8 lg:mb-0">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-md xl:max-w-lg h-[300px] sm:h-[400px] lg:h-[400px] xl:h-[500px] lg:mr-[-2rem] xl:mr-[-5rem]">
                <div
                  className="w-full h-full shadow-2xl relative overflow-hidden"
                  style={{
                    borderRadius: "0px 100px",
                    background: "linear-gradient(135deg, rgba(5, 19, 65, 0.1) 0%, rgba(255, 242, 233, 0.1) 100%)",
                    border: "2px solid #051341",
                  }}
                >
                  <Image
                    src="/images/contact-background.jpg"
                    alt="Contacto DA LUZ CONSCIENTE"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-cover"
                    style={{
                      borderRadius: "0px 100px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
