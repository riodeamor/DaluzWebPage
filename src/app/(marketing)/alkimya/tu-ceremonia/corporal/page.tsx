import { Metadata } from 'next'
import Link from 'next/link'
import CeremonyStepsCarousel from '@/components/alkimya/CeremonyStepsCarousel'
import PortalTesorosNotice from '@/components/alkimya/PortalTesorosNotice'
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
    "titulo": "Limpieza y renovación: la exfoliación",
    "proposito": "A diferencia del rostro, la piel del cuerpo pasa el día comprimida bajo telas sintéticas, sudor y fricción constante. Esto no solo genera asperezas o foliculitis (pelitos encarnados), sino una **capa de queratina seca en todo el cuerpo que asfixia el tejido**, apaga la luminosidad y vuelve lenta la regeneración celular. Exfoliar con activos botánicos libera los poros, **estimula el drenaje linfático y el retorno venoso**, y despierta la vitalidad de la piel. Así, todo el cuerpo vuelve a oxigenarse de forma integral y queda listo para que los nutrientes de tu crema **penetren de verdad y no queden patinando en la superficie**.",
    "intencion": "Al compás del agua, fluí, soltá y renovate. Dejá ir el peso y las cargas del día.",
    "consejos": "Bajo la ducha tibia, **1 o 2 veces por semana**, aplicá el **Gel Exfoliante Ecos** sobre la piel húmeda. Realizá un **masaje con círculos ascendentes desde los pies hacia el corazón**, deteniéndote en brazos, espalda, articulaciones y zonas de tensión. Sentí cómo el estímulo mecánico reactiva la circulación y el calor en todo el cuerpo; enjuagá con agua templada."
  },
  {
    "num": 2,
    "titulo": "Alivio específico: el descanso",
    "proposito": "Las horas de pie o sentada, la tensión postural y la carga del día generan **congestión en el sistema circulatorio y rigidez en la fascia muscular**, especialmente en piernas, cuello y hombros. Una fórmula descongestiva con extractos botánicos de efecto frío **estimula la microcirculación de retorno**, alivia la retención de líquidos y envía una señal directa de descompresión al sistema neuromuscular, disolviendo la pesadez al instante.",
    "intencion": "Aterrizá en tu cuerpo. Devolvé la calma a las zonas que sostienen tu rutina diaria.",
    "consejos": "Al salir del agua o al finalizar tu jornada, aplicá el **Gel Susurro** directamente sobre piernas cansadas, cuello, hombros o cintura. Realizá **presiones firmes y ascendentes con ambas manos**, inhalando su frescura aromática mientras sentís cómo la temperatura corporal se equilibra y el cuerpo suelta la carga acumulada."
  },
  {
    "num": 3,
    "titulo": "Hidratación y calma: la nutrición",
    "proposito": "El agua caliente de la ducha y el cloro barren los lípidos protectores naturales, dejando la piel expuesta a la tirantez, la descamación y la pérdida acelerada de agua. Si no se repone esa barrera, el tejido pierde firmeza y elasticidad. Aplicar lípidos botánicos biocompatibles sobre la piel aún receptiva **restaura el manto hidrolipídico**, sella el agua celular adentro y devuelve a toda la envoltura corporal una **textura aterciopelada, elástica y protegida** frente al roce diario.",
    "intencion": "Abrázate al salir del agua. Devolvé nutrición, suavidad y protección a tu envoltura física.",
    "consejos": "Con la **piel todavía tibia y sutilmente húmeda post-ducha**, extendé una cantidad generosa de la **Crema Corporal Pureza**. Masajeá con **caricias largas, envolventes y ascendentes**, habitando el contacto pleno de tus manos con tu templo físico. Sentí cómo tu envoltura queda protegida, suave y en calma para acompañar tu día o entregarse al descanso nocturno."
  }
] as const

export default function CeremoniaCorporalPage() {
  return (
    <div className="ceremonia-corporal-page">
      <div className="ceremonia-corporal-bg" aria-hidden="true" />
      <main className="ceremonia-corporal-content">
        {/* Hero - pt-0 so MainTitleBg touches header */}
        <section className="px-4 pt-0 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8 lg:px-12 lg:pb-10">
          <h1 className="ceremonia-corporal-hero-title">
            <div className="ceremonia-corporal-hero-title-bg" aria-hidden="true" />
            <span className="ceremonia-corporal-hero-title-text">
              Ceremonia Corporal
            </span>
          </h1>
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
        <section className="ceremony-steps-section ceremony-steps-section--before-notice">
          <CeremonyStepsCarousel
            steps={PASOS}
            imagePrefix="/images/ceremonias/corp_step_"
            imageAltPrefix="Ceremonia corporal, paso"
            reasonLabel="Por qué tu cuerpo lo necesita:"
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
