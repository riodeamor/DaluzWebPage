import { Metadata } from 'next'
import Link from 'next/link'
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

        {/* Paso a Paso */}
        <section className="px-4 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8 lg:px-12 lg:pb-8">
          <div className="mx-auto max-w-4xl space-y-12 md:space-y-16 lg:space-y-20">
            {PASOS.map((paso, stepIndex) => {
              const isEvenStep = stepIndex % 2 === 0
              const photoShapeClass = stepIndex % 2 === 0 ? 'ceremonia-corporal-foto-circle' : 'ceremonia-corporal-foto-leaf'
              const zigzag = {
                title: isEvenStep ? 'left' : 'right',
                proposito: isEvenStep ? 'right' : 'left',
                intencion: isEvenStep ? 'left' : 'right',
                consejos: isEvenStep ? 'right' : 'left',
                photo: isEvenStep ? 'right' : 'left',
              }
              return (
                <article
                  key={paso.num}
                  className="ceremonia-corporal-step-container ceremonia-corporal-mobile-card lg:bg-transparent lg:shadow-none lg:p-0"
                >
                  {/* Titulo Principal */}
                  <div
                    className="ceremonia-corporal-step-title"
                    data-zigzag={zigzag.title}
                  >
                    <div className="ceremonia-corporal-step-title-bg" aria-hidden="true" />
                    <h4 className="ceremonia-corporal-step-title-text">
                      {paso.num}. {paso.titulo}
                    </h4>
                  </div>

                  {/* Propósito y Beneficio */}
                  <div
                    className="ceremonia-corporal-block-group"
                    data-zigzag={zigzag.proposito}
                    data-order="1"
                  >
                    <div className="ceremonia-corporal-block-title">
                      <span className="ceremonia-corporal-block-title-text">
                        Propósito y Beneficio
                      </span>
                    </div>
                    <p className="ceremonia-corporal-block-text-content">
                      {paso.proposito}
                    </p>
                  </div>

                  {/* Intención de la Ceremonia */}
                  <div
                    className="ceremonia-corporal-block-group"
                    data-zigzag={zigzag.intencion}
                    data-order="2"
                  >
                    <div className="ceremonia-corporal-block-title">
                      <span className="ceremonia-corporal-block-title-text">
                        Intención de la Ceremonia
                      </span>
                    </div>
                    <p className="ceremonia-corporal-block-text-content">
                      {paso.intencion}
                    </p>
                  </div>

                  {/* Consejos de Aplicación */}
                  <div
                    className="ceremonia-corporal-block-group"
                    data-zigzag={zigzag.consejos}
                    data-order="3"
                  >
                    <div className="ceremonia-corporal-block-title">
                      <span className="ceremonia-corporal-block-title-text">
                        Consejos de Aplicación
                      </span>
                    </div>
                    <p className="ceremonia-corporal-block-text-content">
                      {paso.consejos}
                    </p>
                  </div>

                  {/* Foto del Paso Corporal */}
                  <div
                    className={`ceremonia-corporal-photo-block ${photoShapeClass}`}
                    data-zigzag={zigzag.photo}
                  >
                    <img
                      src={`/images/ceremonias/corp_step_${paso.num}.png`}
                      alt={`Foto Corporal paso ${paso.num}`}
                    />
                    {/* Wavy Line Decoration */}
                    <div className="ceremonia-wavy-decoration" aria-hidden="true">
                      <svg width="25" height="120" viewBox="0 0 25 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 12 0 C 30 20 0 40 12 60 C 30 80 0 100 12 120" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
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
