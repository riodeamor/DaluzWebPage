import { Metadata } from 'next'
import Link from 'next/link'
import CeremonyStepsCarousel from '@/components/alkimya/CeremonyStepsCarousel'
import Image from 'next/image'
import '@/styles/ceremonia-corporal.css'

export const metadata: Metadata = {
  title: 'Ceremonia Corporal | ALKIMYA | DA LUZ CONSCIENTE',
  description:
    'Descubri­ tu ceremonia corporal. El cuerpo: sosten y descarga de la tension. Transforma tu rutina en un ritual consciente con DA LUZ Alkimya.',
}

const PASOS = [
  {
    "num": 1,
    "titulo": "Limpieza y Renovación: La Exfoliación",
    "proposito": "Elimina células muertas, alisa la textura corporal y optimiza la permeabilidad para los tratamientos de nutrición.",
    "intencion": "Al compás del agua, fluí, soltá y renovate. Dejá ir el peso y las cargas del día.",
    "consejos": "Utilizá el Gel Exfoliante ECOS 1 a 2 veces por semana, realizando movimientos circulares ascendentes."
  },
  {
    "num": 2,
    "titulo": "Alivio Específico: El Descanso",
    "proposito": "Brinda frescura inmediata y bienestar, mitigando la inflamación y la tensión muscular acumulada.",
    "intencion": "Aterrizá en tu cuerpo. Devolvé la calma a las zonas que sostienen tu rutina diaria.",
    "consejos": "Masajeá el Gel Susurro sobre áreas de tensión o piernas cansadas, con presión firme hasta su total absorción."
  },
  {
    "num": 3,
    "titulo": "Hidratación y Calma: La Nutrición",
    "proposito": "Restaura la película hidrolipídica, sella la humedad profunda y calma tiranteces o irritaciones.",
    "intencion": "Abrázate al salir del agua. Devolvé nutrición, suavidad y protección a tu envoltura física.",
    "consejos": "Extendé la Crema Corporal Pureza de forma diaria post-ducha, masajeando con movimientos ascendentes sobre la piel ligeramente húmeda."
  }
] as const

export default function CeremoniaCorporalPage() {
  return (
    <div className="ceremonia-corporal-page">
      <div className="ceremonia-corporal-bg" aria-hidden="true" />
      <main className="ceremonia-corporal-content">
        {/* Hero - pt-0 so MainTitleBg touches header */}
        <section className="px-4 pt-0 pb-8 sm:px-6 sm:pb-12 md:px-8 md:pb-16 lg:px-12 lg:pb-20">
          <h1 className="ceremonia-corporal-hero-title">
            <div className="ceremonia-corporal-hero-title-bg" aria-hidden="true" />
            <span className="ceremonia-corporal-hero-title-text">
              Ceremonia Corporal
            </span>
          </h1>
          <h2 className="font-subtitle text-center text-xl italic sm:text-2xl md:text-3xl ceremonia-corporal-hero-subtitle">
            El Cuerpo: Sostén y Descarga de la Tensión
          </h2>
        </section>

        {/* Kit corporal */}
        <section className="px-4 pb-8 sm:px-6 sm:pb-12 md:px-8 md:pb-16 lg:px-12 lg:pb-20">
          <Link
            href="/productos"
            className="relative -mx-4 block overflow-hidden rounded-none shadow-2xl sm:mx-auto sm:max-w-[1600px] sm:rounded-xl"
          >
            <Image
              src="/images/ceremonias/carrusel/corporal-kit.webp"
              alt="Kit corporal: exfoliación, hidratación y alivio muscular"
              width={2000}
              height={563}
              sizes="(max-width: 1500px) 100vw, 1500px"
              className="h-auto w-full"
            />
          </Link>
        </section>
        {/* Paso a paso compacto e interactivo */}
        <section className="ceremony-steps-section">
          <CeremonyStepsCarousel
            steps={PASOS}
            imageForStep={(num) => `/images/ceremonias/corp_step_${num}.png`}
            imageAltPrefix="Ceremonia corporal, paso"
          />
        </section>


        {/* Elegí tu Ceremonia */}
        <section className="px-4 pb-16 sm:px-6 sm:pb-20 md:px-8 md:pb-24 lg:px-12 lg:pb-32">
          <div className="mt-8 flex justify-center">
            <Link
              href="/productos"
              className="font-title inline-flex justify-center rounded-r-[15px] border-2 border-[var(--color-brand-primary)] bg-[var(--color-bg-light)] px-8 py-4 text-sm font-medium uppercase tracking-[1px] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2 sm:text-base"
            >
              ELEGÍ TU CEREMONIA!
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}


