import { Metadata } from 'next'
import Link from 'next/link'
import '@/styles/tu-ceremonia.css'

export const metadata: Metadata = {
  title: 'Tu Ceremonia | ALKIMYA | DA LUZ CONSCIENTE',
  description: 'Transformá tu rutina en un ritual consciente. Conocé tu ceremonia diaria con DA LUZ Alkimya.',
}

export default function TuCeremoniaPage() {
  return (
    <div className="tu-ceremonia-page">
      {/* Mobile/Tablet mesh background (shared with biotipos-doshas, hidden on desktop) */}
      <div className="biotipos-mesh-bg-global tu-ceremonia-mesh-bg"></div>

      {/* SVG Background (desktop only) */}
      <div className="tu-ceremonia-bg-container">
        <img
          src="/svg/ceremonias/TuCeremoniaPagebg2.svg"
          alt="Tu Ceremonia Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            minHeight: '100%',
            minWidth: '100%',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        />
      </div>

      {/* Page Content */}
      <div className="tu-ceremonia-content">
        {/* Title + Subtitle wrapped in a single card on mobile/tablet */}
        {/* Le quitamos el margen de abajo para que no empuje */}
        <div className="tu-ceremonia-title-card" style={{ marginBottom: '0px' }}>
          <h1 className="tu-ceremonia-main-title">
            CONOCÉ TU CEREMONIA DIARIA
          </h1>

          {/* Subtítulo blanco */}
          <h2 className="tu-ceremonia-secondary-title" style={{ color: '#FFFFFF' }}>
            ¡Transformá tu Rutina en un Ritual Consciente!
          </h2>
        </div>

        {/* Text Card 1 */}
        {/* Margen negativo para subir el cuadro y acercarlo al subtítulo */}
        <div className="tu-ceremonia-text-card tu-ceremonia-text-card-1" style={{ marginTop: '-20px' }}>
          <div className="tu-ceremonia-text-card-bg"></div>
          <div className="tu-ceremonia-text-card-content">
            {/* Texto en bordó oscuro directo */}
            <p className="tu-ceremonia-text-card-text" style={{ color: '#4A0D10' }}>
              Tu cuidado personal es el reflejo directo de tu bienestar interno. En DA LUZ Alkimya no solo formulamos cosmética consciente, sino que proponemos una Ceremonia para entrelazar la intención pura, tu templo físico y tu consciencia superior.
            </p>
          </div>
        </div>

        {/* Text Card 2 */}
        <div className="tu-ceremonia-text-card tu-ceremonia-text-card-2">
          <div className="tu-ceremonia-text-card-bg"></div>
          <div className="tu-ceremonia-text-card-content">
            {/* Texto en bordó oscuro directo */}
            <p className="tu-ceremonia-text-card-text" style={{ color: '#4A0D10' }}>
              Cada ritual es un acto de consagración hacia vos misma. 
              <br /><br />
              Antes de comenzar el paso a paso, hacé una pausa: la constancia en tu rutina no solo embellece tu materia, sino que ancla tu frecuencia más elevada en el día a día.
            </p>
          </div>
        </div>

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