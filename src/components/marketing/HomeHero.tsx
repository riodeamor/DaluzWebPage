"use client";
import {useState,useEffect} from "react"; import Link from "next/link"; import {Button} from "@/components/ui/button"; import BlurText from "@/components/ui/BlurText"; import {Sparkles} from "lucide-react"; import {AnimatedBackground} from "@/components/svg/SVGComponents"; import {safeDestination,type HeroSlide} from "@/lib/catalog/headers";
const fallback:HeroSlide={_key:"default",isActive:true,desktop:"/images/hero-botanical-background.jpg",titulo:"DA LUZ CONSCIENTE",subtitulo:"Un portal hacia la alquimia viva: donde la medicina de la tierra se encuentra con la consciencia del ser.",textoBoton:"DESCUBRÍ NUESTRAS ALKIMYAS →",linkDestino:"/productos"};
export default function HomeHero({slides}:{slides:HeroSlide[]|null}){const active=slides===null?[fallback]:slides.filter(s=>s.isActive&&s.desktop);const [index,setIndex]=useState(0),[mobile,setMobile]=useState(false);useEffect(()=>{const media=matchMedia("(max-width: 767px)");const update=()=>setMobile(media.matches);update();media.addEventListener("change",update);return()=>media.removeEventListener("change",update)},[]);useEffect(()=>{if(active.length<2)return;const timer=setInterval(()=>setIndex(i=>(i+1)%active.length),6000);return()=>clearInterval(timer)},[active.length]);const slide=active[index%active.length];if(!slide)return null;return (      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("${mobile ? slide.mobile || slide.desktop : slide.desktop}")`,
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
                    text={slide.titulo || ""}
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
                  text={slide.subtitulo || ""}
                  as="div"
                  className="text-lg md:text-xl lg:text-2xl opacity-95 max-w-3xl mx-auto leading-tight tracking-wide group-hover:text-[#FFF2E9] transition-colors duration-500"
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontWeight: "500",
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
              <Link href={safeDestination(slide.linkDestino)}>
                <Button
                  className="group relative px-10 py-4 text-sm font-medium text-[#FFF2E9] hover:text-[#FFF2E9] transition-all duration-500 transform hover:scale-105 uppercase tracking-widest border-none"
                  style={{ borderRadius: "0px 15px", fontFamily: "var(--font-montserrat), Montserrat, sans-serif", background: "linear-gradient(135deg, #16345F 0%, #005080 100%)", boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)" }}
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  {slide.textoBoton || ""}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    );}
