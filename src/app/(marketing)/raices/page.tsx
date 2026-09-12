import { Metadata } from 'next'
import Link from 'next/link'
import '@/styles/raices-filosofia.css'

export const metadata: Metadata = {
  title: 'Filosofía y Propósito | La Alquimista | DA LUZ CONSCIENTE',
  description: 'La alquimista y creadora detrás de Da Luz Consciente. De la sombra a la alkimia viva, formación holística y propósito.',
}

const WRAPPER = 'raices-filosofia-pages'

const FORMACIONES = [
  'Eneagrama y Epigenetica',
  'Reiki Usui (Niveles 1, 2, 3 y Master)',
  'Reiki Karuna (Niveles 1 y 2)',
  'Flores de Bach',
  'Fitoterapia (Medicina Herbal)',
  'Gemoterapia',
  'Química Cosmética',
  'Formulación Cosmética Avanzada',
  'Aromaterapia',
  'Chamanismo Universal',
  'Salud Hormonal',
]

const SABERES = [
  'Cuencos Sonoros',
  'Péndulo Evolutivo',
  'Canto Medicina',
  'Astrología',
  'Danza Primal, Danza Matriz, Danza Butoh',
  'Ciclicidad Lunar-Menstrual',
  'Ayurveda',
  'Numerología',
  'Nutrición Antiinflamatoria',
  'Psicología UNC',
]

export default function FilosofiaPropositoPage() {
  return (
    <div className={WRAPPER}>
      <div className="raices-page-container">
        {/* Background */}
        <div className="raices-page-bg raices-bg-general" aria-hidden />

        {/* Mobile/Tablet Hero - visible < 1024px */}
        <section className="raices-header-band raices-hero-mobile" aria-labelledby="filosofia-title">
          <div className="raices-header-band-inner">
            <h1 id="filosofia-title" className="raices-band-title">
              La Alquimista y Creadora Detrás de Da Luz
            </h1>
          </div>
        </section>
        <div className="raices-content raices-hero-mobile">
          <p className="raices-intro">
            ¡Hola! Soy la alquimista, terapeuta y formadora detrás de Da Luz Consciente. Mi vocación es servir a esta Nueva Humanidad, brindando herramientas que impulsen la presencia, la consciencia de unidad y el coraje para habitar nuestro cuerpo y crear en la Tierra.
          </p>
        </div>

        {/* Desktop Hero - visible >= 1024px only */}
        <section className="raices-hero-desktop" aria-labelledby="filosofia-hero-title">
          <div className="raices-hero-desktop-grid">
            <div className="raices-hero-desktop-left">
              <div className="raices-hero-title-wrap">
                <h1 id="filosofia-hero-title" className="raices-hero-title">
                  La Alquimista y Creadora Detrás de Da Luz
                </h1>
              </div>
              <div className="raices-hero-arrow" aria-hidden>
                <img src="/svg/filosofia/filo/arrowDown.svg" alt="" className="raices-hero-arrow-svg" />
              </div>
              <div className="raices-hero-paragraph-wrap">
                <p className="raices-hero-paragraph">
                  ¡Hola! Soy la alquimista, terapeuta y formadora detrás de Da Luz Consciente. Mi vocación es servir a esta Nueva Humanidad, brindando herramientas que impulsen la presencia, la consciencia de unidad y el coraje para habitar nuestro cuerpo y crear en la Tierra.
                </p>
                <div className="raices-hero-underline" aria-hidden>
                  <img src="/svg/filosofia/filo/UnderLine.svg" alt="" className="raices-hero-underline-svg" />
                </div>
              </div>
            </div>
            <div className="raices-hero-desktop-right">
              <div className="raices-hero-image-placeholder">
                <div className="raices-hero-image-circle">
                  <span className="raices-hero-placeholder-text">Imagen</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filosofía Central / Manifiesto */}
        <div className="raices-content" style={{ marginTop: '2rem' }}>
          <article className="raices-card raices-section-card">
            <p style={{ fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.6, marginBottom: '1rem' }}>
              La vida se transforma cuando cada acción se convierte en un acto sagrado de atención y amor incondicional.
            </p>
            <p>
              Da Luz Consciente es una invitación a nutrir integralmente tu cuerpo, tus emociones, tu mente y tu espíritu. No somos una solución instantánea; somos el puente para quienes se comprometen a escuchar su propio pulso, a habitar la pausa y a comprender la salud como un proceso de autogestión y soberanía.
            </p>
            <p>
              Deseamos que el acto de cuidarte se convierta en un ritual diario, donde la Presencia, la gratitud y el goce acompañen cada uno de tus pasos. Nuestro propósito es acompañarte a construir un equilibrio genuino, sumergiéndote en un viaje alquímico hacia tu interior, donde tu cuerpo es honrado como un templo.
            </p>
            <p style={{ textAlign: 'center', fontStyle: 'italic', fontWeight: 600, marginTop: '1.5rem', color: 'var(--color-brand-primary, #72111A)' }}>
              Acá, la pausa es un acto sagrado.
            </p>
          </article>
        </div>

        {/* De la Sombra - Mobile/Tablet (original band) */}
        <section className="raices-section-band filo-mobile-only" aria-labelledby="sombra-title-mobile">
          <div className="raices-section-band-inner">
            <h2 id="sombra-title-mobile" className="raices-section-band-title">
              De la Sombra a la Alkimia Viva: El Viaje
            </h2>
          </div>
        </section>
        {/* De la Sombra - Desktop (TitleCard bg, centered) */}
        <div className="filo-desktop-only filo-section-title-desktop">
          <div className="filo-section-title-wrap">
            <div className="filo-section-title-bg" aria-hidden>
              <img src="/svg/filosofia/filo/TitleCard.svg" alt="" className="filo-section-title-card" />
            </div>
            <h2 id="sombra-title" className="filo-section-title-text">
              De la Sombra a la Alkimia Viva: El Viaje
            </h2>
          </div>
        </div>
        <div className="raices-content">
          <article className="raices-card raices-section-card">
            <p>
              El origen de Da Luz nace de una transformación radical. Como muchas, habité la disociación y el dolor, manifestados en somatizaciones físicas que mi cuerpo ya no podía ignorar. Ese quiebre fue el combustible de mi curiosidad: necesitaba comprender mi propia biología y energía para cooperar con mi sanación.
            </p>
            <p>
              Mi pulso siempre fue claro: sanar para luego compartir. Inicié mis estudios en Psicología en la UNC, pero mi fascinación me llevó a expandir las fronteras hacia saberes integrales y holísticos. Exploré cada herramienta en mi propio cuerpo, asombrada al ver cómo la transmutación interna rediseñaba por completo mi realidad exterior.
            </p>
          </article>
        </div>

        {/* El Cuerpo - Mobile/Tablet (original band) */}
        <section className="raices-section-band filo-mobile-only" aria-labelledby="cuerpo-title-mobile">
          <div className="raices-section-band-inner">
            <h2 id="cuerpo-title-mobile" className="raices-section-band-title">
              El Cuerpo como Laboratorio
            </h2>
          </div>
        </section>
        {/* El Cuerpo - Desktop (title without bg band) */}
        <div className="filo-desktop-only filo-section-title-desktop filo-section-title-nobg">
          <h2 id="cuerpo-title" className="filo-section-title-plain">
            El Cuerpo como Laboratorio
          </h2>
        </div>
        <div className="raices-content">
          <article className="raices-card raices-section-card">
            <p>
              Me enamoré de la autogestión y comencé a estudiar todo lo que nos nutre y afecta: la alimentación, la química cosmética y el poder oculto de las plantas. Tras sanar dolores crónicos a través de la fitoterapia, empecé a formular mis propios productos.
            </p>
            <p>
              En el laboratorio descubrí que la cosmética no era solo estética, sino un canal poderoso para reconectar con el placer, la sensibilidad y el autocuidado consciente. Al experimentar esta armonía, el deseo de compartirlo fue ineludible. Dejé atrás el miedo a la &quot;intensidad&quot; de mi visión y di vida a mi deseo primal: crear un puente tangible entre el ritual interno y el cuidado externo.
            </p>
            <p>
              Así nació Da Luz Consciente y su línea Alkimya Da Luz, diseñadas para iluminar nuestras sensaciones y devolvernos el goce de habitar la Vida.
            </p>
          </article>

          {/* Quote - Mobile/Tablet: original oval */}
          <div className="raices-oval-quote filo-mobile-only">
            ¡Y así nació Da Luz Consciente + Alkimya Da Luz! Para que le demos luz a nuestras sensaciones conectándonos con la magia y el goce de la Vida.
          </div>
          {/* Quote - Desktop: CircularCardBorder.svg background */}
          <div className="filo-desktop-only filo-circular-quote-wrap">
            <div className="filo-circular-quote-bg" aria-hidden>
              <img src="/svg/filosofia/filo/CircularCardBorder.svg" alt="" className="filo-circular-quote-svg" />
            </div>
            <p className="filo-circular-quote-text">
              ¡Y así nació Da Luz Consciente + Alkimya Da Luz! Para que le demos luz a nuestras sensaciones conectándonos con la magia y el goce de la Vida.
            </p>
          </div>
        </div>

        {/* Mi Caja de Herramientas - Title band (full width) */}
        <section className="raices-section-band" aria-labelledby="herramientas-title">
          <div className="raices-section-band-inner">
            <h2 id="herramientas-title" className="raices-section-band-title">
              Mi Caja de Herramientas: Formación y Saberes
            </h2>
          </div>
        </section>
        <div className="raices-content">
          {/* Intro text outside card */}
          <p className="raices-intro" style={{ marginBottom: '1rem' }}>
            Mi recorrido hacia el bioequilibrio integrando todos nuestros cuerpos será eterno, esa es mi certeza. Soy una aficionada a explorar las tecnologías de nuestros cuerpos, de habitarme para conocerme, así como también de adquirir herramientas y conocimientos teóricos para ir probando, corroborando y aprendiendo a gestionar mis propios recursos.
          </p>
          <p className="raices-intro" style={{ marginBottom: '1.5rem' }}>
            He explorado diversas disciplinas que son la base de los acompañamientos que brindo:
          </p>

          {/* 2 cards: Formaciones | Saberes */}
          <div className="raices-herramientas-grid">
            <div className="raices-herramientas-col">
              <h3 className="raices-herramientas-col-title-bordered">FORMACIONES</h3>
              <article className="raices-card">
                <ul className="raices-list">
                  {FORMACIONES.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
            <div className="raices-herramientas-col">
              <h3 className="raices-herramientas-col-title-bordered">SABERES Y TALLERES</h3>
              <article className="raices-card">
                <ul className="raices-list">
                  {SABERES.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </div>

        {/* El Propósito Final - Title band (full width) */}
        <section className="raices-section-band" aria-labelledby="proposito-title">
          <div className="raices-section-band-inner">
            <h2 id="proposito-title" className="raices-section-band-title">
              El Propósito Final: La Autogestión Consciente
            </h2>
          </div>
        </section>
        <div className="raices-content">
          <article className="raices-card raices-section-card">
            <p>
              Mi deseo es que expandas tu soberanía personal. En Da Luz integramos la alquimia botánica con la tecnología del autoconocimiento para que recuperes tu centro.
            </p>
            <p>
              <strong>Esta es tu comunidad si buscás:</strong>
            </p>
            <ul className="raices-list">
              <li><strong>Tu Ceremonia:</strong> Diagnósticos de Biotipo y rutinas de presencia.</li>
              <li><strong>Transparencia:</strong> Materia prima consciente, activa y con trazabilidad total.</li>
              <li><strong>Membresía:</strong> Un espacio de crecimiento, herramientas somáticas y Tesoros Da Luz.</li>
              <li><strong>Procesos Holísticos:</strong> Acompañamiento personalizado para acuerpar tu transformación.</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              Te invito a dar el primer paso para crear tu realidad desde la vitalidad y el coraje.
            </p>
          </article>
        </div>

        {/* CTAs outside card */}
        <section className="raices-cta-standalone">
          <div className="raices-cta-buttons">
            <Link href="/servicios/procesos/sesiones-integrales" className="raices-cta-button">
              SESIONES
            </Link>
            <Link href="/productos" className="raices-cta-button">
              TIENDA
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}