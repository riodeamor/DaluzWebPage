import { Metadata } from 'next'
import Link from 'next/link'
import CeremonyStepsCarousel from '@/components/alkimya/CeremonyStepsCarousel'
import CeremoniaCarousel, {
  type CeremoniaBanner,
} from '@/components/marketing/CeremoniaCarousel'
import '@/styles/ceremonia-capilar.css'

const BANNERS: CeremoniaBanner[] = [
  {
    src: '/images/ceremonias/carrusel/capilar-raiz.webp',
    alt: 'Ceremonia capilar de fortalecimiento de raíz: refuerza, calma y trata la raíz',
  },
  {
    src: '/images/ceremonias/carrusel/capilar-normal.webp',
    alt: 'Ceremonia capilar para cabello normal / equilibrio: mantenimiento y brillo',
  },
  {
    src: '/images/ceremonias/carrusel/capilar-graso.webp',
    alt: 'Ceremonia capilar para cabello graso y mixto: purificación, frescura y ligereza',
  },
  {
    src: '/images/ceremonias/carrusel/capilar-rizado.webp',
    alt: 'Ceremonia capilar para cabello rizado seco y dañado: definición, nutrición y brillo',
  },
]

export const metadata: Metadata = {
  title: 'Ceremonia Capilar | ALKIMYA | DA LUZ CONSCIENTE',
  description:
    'Descubri tu ceremonia capilar. Fortalecé la raíz y transformá tu rutina de cuidado del cabello en un ritual consciente con DA LUZ Alkimya.',
}

const PASOS = [
  {
    "num": 1,
    "titulo": "Reparación Profunda: El Pre-Lavado",
    "proposito": "Infunde nutrientes esenciales, reestructura la hebra y previene el quiebre mecánico. Tip estratégico: Utilizá el Acondicionador como mascarilla intensiva.",
    "intencion": "Fortalecé tu eje interior. Regalate presencia y pausa antes de la acción.",
    "consejos": "Distribuí el Acondicionador Pureza sobre el pelo seco, enfocándote de medios a puntas, 1 vez por semana. Dejá actuar 20 minutos antes de lavar."
  },
  {
    "num": 2,
    "titulo": "Limpieza y Desintoxicación: El Reseteo",
    "proposito": "Remueve la polución y acumulación de productos, abriendo las cutículas para optimizar el tratamiento.",
    "intencion": "Limpiá el exceso de ruido mental. Despejá el canal de la creatividad desde la raíz.",
    "consejos": "Seleccioná el Shampoo ideal para tu biotipo. Masajeá el cuero cabelludo en círculos suaves, acompañando el momento con respiraciones profundas."
  },
  {
    "num": 3,
    "titulo": "Acondicionamiento: El Sellado",
    "proposito": "Sella las cutículas, facilita el desenredado y aporta una capa protectora contra agresiones externas.",
    "intencion": "Envolvé cada hebra con suavidad. Honrá la historia y estructura de tu cabello.",
    "consejos": "Aplicá el Acondicionador Pureza de medios a puntas, dejalo actuar 1 a 2 minutos y enjuagá con agua tibia."
  },
  {
    "num": 4,
    "titulo": "Nutrición y Equilibrio: El Toque Final",
    "proposito": "Aporta activos botánicos de precisión y equilibra el microbioma del cuero cabelludo.",
    "intencion": "Sostén la armonía y la vitalidad de tu melena hasta el próximo ciclo de lavado.",
    "consejos": "Colocá de 2 a 3 gotas de tu Sérum Capilar Ilumina en las yemas de los dedos y distribuilo delicadamente para sellar las puntas."
  }
] as const

export default function CeremoniaCapilarPage() {
  return (
    <div className="ceremonia-capilar-page">
      <div className="ceremonia-capilar-bg" aria-hidden="true" />
      <main className="ceremonia-capilar-content">
        {/* Hero - pt-0 so MainTitleBg touches header */}
        <section className="px-4 pt-0 pb-8 sm:px-6 sm:pb-12 md:px-8 md:pb-16 lg:px-12 lg:pb-20">
          <h1 className="ceremonia-capilar-hero-title">
            <div className="ceremonia-capilar-hero-title-bg" aria-hidden="true" />
            <span className="ceremonia-capilar-hero-title-text">
              Ceremonia Capilar
            </span>
          </h1>
          <h2 className="font-subtitle text-center text-xl italic sm:text-2xl md:text-3xl ceremonia-capilar-hero-subtitle">
            El Cabello: Fortaleciendo la Raíz
          </h2>
        </section>

        {/* Carrusel de biotipos */}
        <section className="px-4 pb-8 sm:px-6 sm:pb-12 md:px-8 md:pb-16 lg:px-12 lg:pb-20">
          <CeremoniaCarousel
            banners={BANNERS}
            label="Ceremonias capilares según tu biotipo"
          />
        </section>
        {/* Paso a paso compacto e interactivo */}
        <section className="ceremony-steps-section">
          <CeremonyStepsCarousel
            steps={PASOS}
            imagePrefix="/images/ceremonias/cap_step_"
            imageAltPrefix="Ceremonia capilar, paso"
          />
        </section>


        {/* Elegí tu Ceremonia */}
        <section className="px-4 pb-16 sm:px-6 sm:pb-20 md:px-8 md:pb-24 lg:px-12 lg:pb-32">
          <div className="mt-8 flex justify-center">
            <Link
              href="/productos"
              className="ceremonia-back-button font-title inline-flex justify-center rounded-r-[15px] border-2 border-[var(--color-brand-primary)] bg-[var(--color-bg-light)] px-8 py-4 text-sm font-medium uppercase tracking-[1px] text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2 sm:text-base"
            >
              ELEGÍ TU CEREMONIA!
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
