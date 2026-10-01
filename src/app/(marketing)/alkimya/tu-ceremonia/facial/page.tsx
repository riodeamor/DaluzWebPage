import { Metadata } from 'next'
import Link from 'next/link'
import CeremonyStepsCarousel from '@/components/alkimya/CeremonyStepsCarousel'
import PortalTesorosNotice from '@/components/alkimya/PortalTesorosNotice'
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
    "titulo": "Limpieza facial: el vaciado",
    "proposito": "La piel es tu órgano de contacto más extenso y permeable: durante el día acumula polución, restos de protector solar, maquillaje y sebo oxidado. Si solo te enjuagás con agua o esperás al momento de la ducha, **el agua no disuelve las grasas**: los contaminantes quedan atrapados dentro del poro, generando puntos negros, opacidad e inflamación silenciosa. Por su parte, los sulfatos artificiales barren los lípidos de barrera, forzando a la piel a un **efecto rebote de grasa o sensibilidad extrema**. La **doble limpieza botánica** disuelve primero lo oleoso y luego retira las impurezas solubles en agua, permitiendo que los poros respiren en equilibrio y sin tirantez.",
    "intencion": "A través del fluir del agua, liberá tu piel de lo estancado y conectá con la claridad para recibir el nuevo ciclo.",
    "consejos": "Iniciá aplicando tu **Limpiador Ilumina** masajeando suavemente sobre el rostro seco para fundir impurezas y protector solar sin tironear. Continuá aplicando tu **Limpiador Facial en Gel** sobre la piel humedecida: realizá círculos lentos y ascendentes, tomándote un minuto para soltar la pesadez del día. Enjuagá con agua templada y secá con suaves toques de toalla limpia."
  },
  {
    "num": 2,
    "titulo": "Exfoliación: la renovación (Complementaria)",
    "proposito": "La epidermis se renueva naturalmente cada mes, pero el cansancio, el estrés y el clima enlentecen ese ciclo. Las células envejecidas forman una capa superficial opaca que engrosa el tejido y **actúa como un muro que impide que tus sueros penetren**. Una exfoliación botánica suave y sin microplásticos **libera los poros, empareja la textura y despierta la circulación profunda** sin provocar microlesiones en la piel.",
    "intencion": "Soltá las capas del pasado y prepará tu superficie para una receptividad absoluta.",
    "consejos": "De **1 a 2 veces por semana** (respetando los tiempos de tu biotipo), colocá una pequeña cantidad del **Gel Exfoliante Renace** sobre la piel limpia y húmeda. Deslizá las yemas de tus dedos con **movimientos circulares suaves** en frente, nariz y mentón, sin presionar. Notá cómo la piel se afina y vuelve a respirar liviana; enjuagá con abundante agua fresca."
  },
  {
    "num": 3,
    "titulo": "Tonificación: la frecuencia",
    "proposito": "El agua de red suele tener un pH alcalino que altera la barrera protectora de la piel. Además, un tejido deshidratado se contrae y pierde permeabilidad. El tónico botánico es un extracto celular vivo que **devuelve el pH a su nivel ácido fisiológico exacto (alrededor de 5.5)** y satura el tejido de agua pura, funcionando como una **esponja fértil que multiplica la absorción** de los nutrientes que vienen después.",
    "intencion": "Tonificá tu foco y tu campo energético con cada vaporización.",
    "consejos": "Cerrá los ojos y **brumizá tu Tónico Hidratante** a unos 20 cm del rostro y cuello, inhalando su rocío herbal para calmar el ritmo interno. Con la piel todavía húmeda y receptiva, **realizá un suave tecleo con la punta de los dedos** para despertar la microcirculación y preparar el tejido para el sérum."
  },
  {
    "num": 4,
    "titulo": "Nutrición: el sérum",
    "proposito": "A diferencia de una crema espesa que trabaja en la superficie, el sérum es un concentrado botánico de **moléculas pequeñas diseñado para penetrar las capas profundas de la piel**. Ya sea para calmar rojeces, unificar el tono o acompañar la firmeza celular, este paso le entrega a tus células vivas **dosis puras de antioxidantes y activos bioasimilables** en el momento de mayor receptividad dérmica.",
    "intencion": "Nutrí tu Ser con lo esencial. Conectá conscientemente con la frecuencia de la Alkimya elegida.",
    "consejos": "Colocá de **3 a 4 gotas de tu Sérum específico** (Claridad, Serena o Soy) en la palma de tu mano o directamente sobre el rostro. Distribuilo con **suaves presiones con toda la palma**, desde el centro hacia afuera y en el cuello en sentido ascendente. Sostené cada presión con una respiración lenta, permitiendo que la fórmula se funda con la temperatura de tu piel."
  },
  {
    "num": 5,
    "titulo": "Humectación y protección: el sello",
    "proposito": "Toda el agua y los activos botánicos que acabás de incorporar se evaporarían en pocos minutos por **pérdida transepidérmica de agua** si no existiera una barrera que los retenga. La crema o emulsión aporta lípidos vegetales biocompatibles que crean un **manto protector flexible**: sella los nutrientes en el interior, frena la deshidratación y defiende tu tejido de las agresiones ambientales.",
    "intencion": "Sellá el cuidado hacia tu templo físico. Permití que tu piel descanse abrigada y protegida.",
    "consejos": "Tomá una porción de tu **Crema o Emulsión facial** y entibiala entre los dedos. Aplicá con **movimientos ascendentes y envolventes** sobre rostro, cuello y escote, abrazando el contorno con un toque firme y suave. Sentí cómo tu piel queda nutrida, elástica y protegida para habitar el día o entregarse al descanso nocturno."
  }
];

export default function CeremoniaFacialPage() {
  return (
    <div className="ceremonia-facial-page">
      <div className="ceremonia-facial-bg" aria-hidden="true" />
      <main className="ceremonia-facial-content">
        {/* Hero - pt-0 so MainTitleBg touches header */}
        <section className="px-4 pt-0 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8 lg:px-12 lg:pb-10">
          <h1 className="ceremonia-facial-hero-title">
            <div className="ceremonia-facial-hero-title-bg" aria-hidden="true" />
            <span className="ceremonia-facial-hero-title-text">
              Ceremonia Facial
            </span>
          </h1>
        </section>

        {/* Carrusel de biotipos */}
        <section className="px-4 pb-8 sm:px-6 sm:pb-12 md:px-8 md:pb-16 lg:px-12 lg:pb-20">
          <CeremoniaCarousel
            banners={BANNERS}
            label="Ceremonias faciales según tu biotipo"
          />
        </section>
        {/* Paso a paso compacto e interactivo */}
        <section className="ceremony-steps-section ceremony-steps-section--before-notice">
          <CeremonyStepsCarousel
            steps={PASOS}
            imagePrefix="/images/ceremonias/step_"
            imageAltPrefix="Ceremonia facial, paso"
            reasonLabel="Por qué tu piel lo necesita:"
          />
        </section>


        <section className="px-4 sm:px-6 md:px-8 lg:px-12">
          <PortalTesorosNotice />
        </section>
        {/* Elegí tu Ceremonia */}
        <section className="px-4 pb-16 sm:px-6 sm:pb-20 md:px-8 md:pb-24 lg:px-12 lg:pb-32">
          <div className="flex justify-center">
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
