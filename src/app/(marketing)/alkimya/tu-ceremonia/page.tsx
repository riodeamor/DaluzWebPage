import { Metadata } from 'next'
import Link from 'next/link'
import '@/styles/tu-ceremonia.css'
import AlkimyaWaveHeader from '@/components/alkimya/AlkimyaWaveHeader'

export const metadata: Metadata = {
  title: 'Tu Ceremonia | ALKIMYA | DA LUZ CONSCIENTE',
  description: 'Transformá tu rutina en un ritual consciente. Conocé tu ceremonia diaria con DA LUZ Alkimya.',
}

export default function TuCeremoniaPage() {
  return (
    <div className="tu-ceremonia-page">
      {/* Mobile/Tablet mesh background (shared with biotipos-doshas, hidden on desktop) */}
      <div className="biotipos-mesh-bg-global tu-ceremonia-mesh-bg"></div>

      {/* Page Content */}
      <div className="tu-ceremonia-content">
        <AlkimyaWaveHeader title="Tu Ceremonia Diaria">
          <p className="alkimya-wave-header__subtitle">Transformá tu rutina en un ritual de presencia y consagración corporal.</p>
        </AlkimyaWaveHeader>

        <section className="tu-ceremonia-intro w-full py-10 md:py-14">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="mb-5 font-serif text-xl font-medium leading-snug text-[#72111A] md:text-2xl">
              El tacto consciente es el lenguaje más directo entre tu biología y tu presencia.
            </p>
            <p className="mb-4 font-serif text-base leading-relaxed text-[#4A0D10] md:text-lg">
              En Da Luz no concebimos el cuidado como una rutina estética superficial; proponemos una <strong>ceremonia cotidiana de regreso al templo</strong>: una secuencia viva donde los activos botánicos puros, la fascia y el sistema nervioso entran en sintonía fina.
            </p>
            <p className="mb-5 font-serif text-base leading-relaxed text-[#4A0D10] md:text-lg">
              Cada paso —sea en tu rostro, tu cabello o tu cuerpo— es un <strong>acto de consagración y soberanía</strong>. Esta guía es un <strong>mapa abierto para estructurar tu cuidado diario</strong>: tanto si estás descubriendo tus primeras fórmulas como si querés llevar tu cuidado cotidiano a una práctica con sentido.
            </p>
            <p className="font-serif text-base italic leading-relaxed text-[#72111A] md:text-lg">
              Hacé una pausa, respirá y habitá la secuencia: cuando le das tiempo y verdad al contacto con tu materia, <strong>la química celular responde y tu terreno se regenera desde el goce.</strong>
            </p>
          </div>
        </section>

        {/* Buttons */}
        <div className="tu-ceremonia-buttons">
          <Link href="/alkimya/tu-ceremonia/facial" className="tu-ceremonia-button tu-ceremonia-button-1">
            CEREMONIA FACIAL
          </Link>
          <Link href="/alkimya/tu-ceremonia/capilar" className="tu-ceremonia-button tu-ceremonia-button-2">
            CEREMONIA CAPILAR
          </Link>
          <Link href="/alkimya/tu-ceremonia/corporal" className="tu-ceremonia-button tu-ceremonia-button-3">
            CEREMONIA CORPORAL
          </Link>
        </div>
      </div>
    </div>
  )
}

