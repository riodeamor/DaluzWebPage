import { Metadata } from 'next'
import Link from 'next/link'
import CeremonyStepsCarousel from '@/components/alkimya/CeremonyStepsCarousel'
import CeremoniaCarousel, {
  type CeremoniaBanner,
} from '@/components/marketing/CeremoniaCarousel'
import '@/styles/ceremonia-facial.css'

const BANNERS: CeremoniaBanner[] = [
  {
    src: '/images/ceremonias/carrusel/ceremonia-acne.webp',
    alt: 'Ceremonia facial para piel con tendencia al acné: limpieza profunda y calma',
  },
  {
    src: '/images/ceremonias/carrusel/ceremonia-pitta.webp',
    alt: 'Ceremonia facial para piel sensible / Pitta: alivio y protección',
  },
  {
    src: '/images/ceremonias/carrusel/ceremonia-mixta.webp',
    alt: 'Ceremonia facial para piel mixta / Pitta-Kapha: hidratación y balance',
  },
  {
    src: '/images/ceremonias/carrusel/ceremonia-madura.webp',
    alt: 'Ceremonia facial para piel madura / Vata: nutrición y regeneración',
  },
  {
    src: '/images/ceremonias/carrusel/ceremonia-grasa.webp',
    alt: 'Ceremonia facial para piel grasa / Kapha: claridad y ligereza',
  },
  {
    src: '/images/ceremonias/carrusel/ceremonia-seca.webp',
    alt: 'Ceremonia facial para piel seca / Vata: suavidad y nutrición',
  },
]

export const metadata: Metadata = {
  title: 'Ceremonia Facial | ALKIMYA | DA LUZ CONSCIENTE',
  description:
    'Descubrí tu ceremonia facial diaria. Transformá tu rutina de cuidado facial en un ritual consciente con DA LUZ Alkimya.',
}

type Paso = {
  num: number;
  titulo: string;
  proposito: string;
  intencion: string;
  consejos: string;
  extra?: readonly { titulo: string; texto: string }[];
};

const PASOS: readonly Paso[] = [
  {
    "num": 1,
    "titulo": "Limpieza Facial: El Vaciado",
    "proposito": "Remueve con eficacia residuos urbanos, exceso de sebo y maquillaje, optimizando la permeabilidad cutánea para los tratamientos posteriores.",
    "intencion": "A través del fluir del agua, liberá tu piel de lo estancado y conectá con la claridad para recibir el nuevo ciclo.",
    "consejos": "Iniciá con tu Agua Micelar para desmaquillar con suavidad y continuá con tu limpiador facial en Gel como segundo paso de la doble limpieza."
  },
  {
    "num": 2,
    "titulo": "Exfoliación: La Renovación (Complementaria)",
    "proposito": "Acelera la regeneración celular y pule la textura de la piel, maximizando la absorción de los principios activos.",
    "intencion": "Soltá las capas del pasado y prepará tu superficie para una receptividad absoluta.",
    "consejos": "Integrá el Gel Exfoliante Renace de 1 a 3 veces por semana, respetando los tiempos de tu biotipo."
  },
  {
    "num": 3,
    "titulo": "Tonificación: La Frecuencia",
    "proposito": "Restaura el equilibrio del pH tras la limpieza y fortalece la función de la barrera hidrolipídica.",
    "intencion": "Tonificá tu foco y tu campo energético con cada vaporización.",
    "consejos": "Brumizá tu Tónico Hidratante directamente sobre el rostro o mediante toques de tecleo, mañana y noche."
  },
  {
    "num": 4,
    "titulo": "Nutrición: El Sérum",
    "proposito": "Infunde biomoléculas activas de alta concentración (Vitaminas, Ácido Hialurónico) que penetran en profundidad para tratar las necesidades específicas de la dermis.",
    "intencion": "Nutrí tu Ser con lo esencial. Conectá conscientemente con la frecuencia de la Alkimya elegida.",
    "consejos": "Distribuí tu Sérum específico mediante sutiles presiones y masajes ascendentes hasta su total integración."
  },
  {
    "num": 5,
    "titulo": "Humectación y Protección: El Sello",
    "proposito": "Crea un manto oclusivo que previene la deshidratación transepidérmica y devuelve un confort inmediato.",
    "intencion": "Sellá el cuidado hacia tu templo físico. Permití que tu piel descanse abrigada y protegida.",
    "consejos": "Aplicá la Emulsión o Crema específica para tu biotipo inmediatamente después del sérum."
  }
];

export default function CeremoniaFacialPage() {
  return (
    <div className="ceremonia-facial-page">
      <div className="ceremonia-facial-bg" aria-hidden="true" />
      <main className="ceremonia-facial-content">
        {/* Hero - pt-0 so MainTitleBg touches header */}
        <section className="px-4 pt-0 pb-8 sm:px-6 sm:pb-12 md:px-8 md:pb-16 lg:px-12 lg:pb-20">
          <h1 className="ceremonia-facial-hero-title">
            <div className="ceremonia-facial-hero-title-bg" aria-hidden="true" />
            <span className="ceremonia-facial-hero-title-text">
              Ceremonia Facial
            </span>
          </h1>
          <h2 className="font-subtitle text-center text-xl italic sm:text-2xl md:text-3xl ceremonia-facial-hero-subtitle">
            El Rostro: Activación del Escudo Protector
          </h2>
        </section>

        {/* Carrusel de biotipos */}
        <section className="px-4 pb-8 sm:px-6 sm:pb-12 md:px-8 md:pb-16 lg:px-12 lg:pb-20">
          <CeremoniaCarousel
            banners={BANNERS}
            label="Ceremonias faciales según tu biotipo"
          />
        </section>
        {/* Paso a paso compacto e interactivo */}
        <section className="ceremony-steps-section">
          <CeremonyStepsCarousel
            steps={PASOS}
            imagePrefix="/images/ceremonias/step_"
            imageAltPrefix="Ceremonia facial, paso"
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


