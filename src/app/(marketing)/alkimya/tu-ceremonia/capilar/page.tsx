import { Metadata } from 'next'
import Link from 'next/link'
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
    "titulo": "Reparación profunda: el prelavado",
    "proposito": "Al mojarse, la cutícula del cabello se abre, la hebra absorbe agua de golpe y se vuelve sumamente vulnerable al quiebre mecánico del lavado. Aplicar nutrición botánica pura sobre el pelo seco crea un escudo lipídico que frena ese daño, sella la porosidad y permite que los aminoácidos penetren en la fibra sin ser arrastrados por el agua.",
    "intencion": "Fortalecé tu eje interior. Regalate presencia y pausa antes de la acción.",
    "consejos": "1 vez por semana, antes de mojarte el pelo, distribuí una porción de Acondicionador Pureza de medios a puntas sobre la fibra seca. Masajeá mechón por mechón sintiendo el peso y la textura del cabello. Dejalo actuar 20 minutos regalándote una pausa consciente, y enjuagá directamente al entrar a la ducha antes de tu shampoo."
  },
  {
    "num": 2,
    "titulo": "Limpieza y desintoxicación: el reseteo",
    "proposito": "El cuero cabelludo es piel viva con folículos, glándulas y terminaciones nerviosas. El exceso de polución, el estrés y los residuos de siliconas comerciales asfixian la raíz y debilitan el crecimiento. Una limpieza basada en activos botánicos desobstruye el folículo y equilibra el sebo sin barrer los aceites protectores naturales ni irritar la piel.",
    "intencion": "Limpiá el exceso de ruido mental. Despejá el canal de la creatividad desde la raíz.",
    "consejos": "Con el pelo bien empapado, aplicá tu Shampoo (elegido según tu biotipo) directamente sobre la raíz. Masajeá con las yemas de los dedos en círculos suaves y firmes, activando la circulación y soltando la tensión acumulada en la cabeza. Dejá que la espuma descienda sola hacia los largos sin frotar las puntas, y enjuagá con agua templada."
  },
  {
    "num": 3,
    "titulo": "Acondicionamiento: el sellado",
    "proposito": "Luego de la limpieza, la fibra necesita recuperar su manto emoliente para alinear y cerrar las cutículas. Si la cutícula queda abierta, la hebra pierde humedad interna, se enreda y pierde brillo. Los lípidos y extractos vegetales sellan la superficie del cabello, devolviéndole elasticidad y suavidad real sin dejar capas sintéticas que lo apelmacen.",
    "intencion": "Envolvé cada hebra con suavidad. Honrá la historia y estructura de tu cabello.",
    "consejos": "Retirá suavemente el exceso de agua con las manos y aplicá el Acondicionador Pureza de medios a puntas. Deslizá los dedos como si fueran un peine para desenredar sin tirones, respetando la caída natural de tu cabello. Dejalo actuar de 2 a 3 minutos mientras respirás su aroma herbal, y enjuagá con agua fresca para potenciar el brillo natural."
  },
  {
    "num": 4,
    "titulo": "Nutrición y equilibrio: el toque final",
    "proposito": "Las puntas son la zona más antigua y expuesta de tu cabello; reciben la fricción diaria del roce, la ropa y el viento. Unas pocas gotas de un elixir botánico puro sellan la hidratación interna, reparan las fisuras de la fibra y reflejan la luz de forma limpia, sin siliconas que disfracen el daño acumulando suciedad.",
    "intencion": "Sostén la armonía y la vitalidad de tu melena hasta el próximo ciclo de lavado.",
    "consejos": "Con el pelo húmedo o seco, colocá solo 2 o 3 gotas del Sérum Capilar Ilumina en la palma de tus manos. Frotalas suavemente para activar los activos con tu calor e inhalá su fragancia un instante. Distribuilo acariciando las puntas y zonas con frizz para sellar el ritual, dejando el cabello flexible, liviano y protegido."
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
              CEREMONIA CAPILAR
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

        {/* Paso a Paso */}
        <section className="px-4 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8 lg:px-12 lg:pb-8">
          <div className="mx-auto max-w-4xl space-y-12 md:space-y-16 lg:space-y-20">
            {PASOS.map((paso, stepIndex) => {
              const isEvenStep = stepIndex % 2 === 0
              const photoShapeClass = stepIndex % 2 === 0 ? 'ceremonia-capilar-foto-circle' : 'ceremonia-capilar-foto-leaf'
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
                  className="ceremonia-capilar-step-container ceremonia-capilar-mobile-card lg:bg-transparent lg:shadow-none lg:p-0"
                >
                  {/* Titulo Principal */}
                  <div
                    className="ceremonia-capilar-step-title"
                    data-zigzag={zigzag.title}
                  >
                    <div className="ceremonia-capilar-step-title-bg" aria-hidden="true" />
                    <h4 className="ceremonia-capilar-step-title-text">
                      <span className="ceremonia-capilar-step-number">PASO {paso.num}</span><span>{paso.titulo}</span>
                    </h4>
                  </div>

                  {/* Por qué tu pelo lo necesita */}
                  <div
                    className="ceremonia-capilar-block-group"
                    data-zigzag={zigzag.proposito}
                    data-order="1"
                  >
                    <div className="ceremonia-capilar-block-title">
                      <span className="ceremonia-capilar-block-title-text">
                        Por qué tu pelo lo necesita
                      </span>
                    </div>
                    <p className="ceremonia-capilar-block-text-content">
                      {paso.proposito}
                    </p>
                  </div>

                  {/* Intención de la Ceremonia */}
                  <div
                    className="ceremonia-capilar-block-group"
                    data-zigzag={zigzag.intencion}
                    data-order="2"
                  >
                    <div className="ceremonia-capilar-block-title">
                      <span className="ceremonia-capilar-block-title-text">
                        Intención de la Ceremonia
                      </span>
                    </div>
                    <p className="ceremonia-capilar-block-text-content">
                      {paso.intencion}
                    </p>
                  </div>

                  {/* Uso Consciente */}
                  <div
                    className="ceremonia-capilar-block-group"
                    data-zigzag={zigzag.consejos}
                    data-order="3"
                  >
                    <div className="ceremonia-capilar-block-title">
                      <span className="ceremonia-capilar-block-title-text">
                        Uso Consciente
                      </span>
                    </div>
                    <p className="ceremonia-capilar-block-text-content">
                      {paso.consejos}
                    </p>
                  </div>

                  {/* Foto del Paso Capilar */}
                  <div 
                    className={`ceremonia-capilar-photo-block ${photoShapeClass}`}
                    data-zigzag={zigzag.photo}
                  >
                    <img 
                      src={`/images/ceremonias/cap_step_${paso.num}.png`} 
                      alt={`Foto Capilar paso ${paso.num}`} 
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
