import { Metadata } from 'next'
import Link from 'next/link'
import '@/styles/raices-filosofia.css'

export const metadata: Metadata = {
  title: 'Raíces | La Alquimista | DA LUZ CONSCIENTE',
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

export default function RaicesPage() {
  return (
    <div className={WRAPPER}>
      <div className="raices-page-container">
        {/* Background */}
        <div className="raices-page-bg raices-bg-general" aria-hidden />

        {/* De la Sombra - Mobile/Tablet (original band) */}
        <section className="raices-section-band filo-mobile-only" aria-labelledby="sombra-title-mobile">
          <div className="raices-section-band-inner">
            <h1 id="sombra-title-mobile" className="raices-section-band-title">
              La Alquimista y Creadora detrás de Da Luz
            </h1>
          </div>
        </section>
        {/* De la Sombra - Desktop (TitleCard bg, centered) */}
        <div className="filo-desktop-only filo-section-title-desktop">
          <div className="filo-section-title-wrap">
            <div className="filo-section-title-bg" aria-hidden>
              <img src="/svg/filosofia/filo/TitleCard.svg" alt="" className="filo-section-title-card" />
            </div>
            <h1 id="sombra-title" className="filo-section-title-text">
              La Alquimista y Creadora detrás de Da Luz
            </h1>
          </div>
        </div>
        <div className="raices-content">
          <article className="raices-card raices-section-card">
            <p>
              ¡Hola! Soy la alquimista, terapeuta y creadora detrás de Da Luz. Mi vocación es brindar herramientas y propuestas que impulsen la presencia, el goce y la consciencia. Mi propósito es acompañarte a habitar el cuerpo desde tu Poder, en conexión con tus deseos y sensaciones, utilizando nuestra tecnología humana —tan amplia como compleja— a tu favor. Quiero cooperar para que aprendas a poner tus propias acciones, elecciones y sentires a favor de vos misma, y te asombres del poder real que tenemos cada uno como humanos, por más pequeños que a veces nos percibamos.
            </p>
            <p>
              <strong>De la Sombra a la Soberanía: El Viaje.</strong> El origen de Da Luz nace de una transformación radical. Como muchas, habité la disociación y el dolor, manifestados en somatizaciones físicas que mi cuerpo ya no podía ignorar. Ese quiebre fue el combustible de mi curiosidad: necesitaba comprender mi propia biología y energía para cooperar con mi sanación. Siendo Capricornio con ascendente en Virgo, siempre necesité encontrarle una lógica a todo; por eso, abrirme a explorar herramientas holísticas marcó un antes y un después. Me permití Ser: curiosa, probar, investigar y explorar sin vergüenza ni miedo al qué dirán.
            </p>
            <p>
              Experimentar en mi propio cuerpo me trajo cambios que fueron desde lo sutil —reconocer mi fisiología, mis verdaderos deseos y mis límites— hasta lo más profundo: reprogramar creencias obsoletas y desarmar el deber ser que me mantenía en el silencio y la represión. Esa exploración radical me llevó a pararme en un lugar de poder personal que creía no tener, cultivando una compasión inmensa hacia mí misma a la hora de elegir y cuidarme.
            </p>
          </article>
        </div>

        {/* El Cuerpo - Mobile/Tablet (original band) */}
        <section className="raices-section-band filo-mobile-only" aria-labelledby="cuerpo-title-mobile">
          <div className="raices-section-band-inner">
            <h2 id="cuerpo-title-mobile" className="raices-section-band-title">
              El Despertar y las Musas Alquímicas
            </h2>
          </div>
        </section>
        {/* El Cuerpo - Desktop (title without bg band) */}
        <div className="filo-desktop-only filo-section-title-desktop filo-section-title-nobg">
          <h2 id="cuerpo-title" className="filo-section-title-plain">
            El Despertar y las Musas Alquímicas
          </h2>
        </div>
        <div className="raices-content">
          <article className="raices-card raices-section-card">
            <p>
              En plena pandemia, empecé a investigar marcas de cosmética natural en Córdoba. Quería cuidar mi piel en serio, alejándome de los disruptores endocrinos. En esa exploración descubrí que mi rutina de cuidado facial se estaba convirtiendo en un momento sagrado para mí: un espacio de conexión, goce, masaje y liberación de tensiones.
            </p>
            <p>
              Gracias a mis primeras formaciones —Eneagrama, Epigenética, Astrología Evolutiva, Reiki Usui, Gemoterapia y Flores de Bach— todo comenzó a cobrar sentido. Cuando mis exploradores cooperadores se convirtieron en mis musas, mi fascinación creció. Un taller de botiquín herbal me llevó a descubrir mi gran pasión: mi primera alquimia fue una crema y el resultado fue un desastre, pero me empujó a investigar, formarme en formulación y arrancar Fitoterapia.
            </p>
            <p>
              Entender cómo la información de las hierbas medicinales juega a favor de nuestro organismo literalmente me voló la cabeza. Al permitirme poner en práctica estas herramientas en otros cuerpos, mi fascinación creció y se volvió una vocación de acompañamiento.
            </p>
            <p>
              <strong>La Crisis, el Límite y la Reconstrucción.</strong> Así nació Zentidoconsciente, la marca que precedió a Da Luz. Los desafíos me llevaron a definir dónde quería estar, poner límites y compartir las herramientas que antes no me animaba a mostrar. <strong>El Goce como Brújula.</strong> Decidí que mis proyectos no tenían que valer la pena: tenían que valer el goce. Así le di vida a mi deseo primal: crear un puente tangible entre el ritual interno y el cuidado externo, dando paso a Da Luz Consciente y Alkimya Da Luz.
            </p>
            <p>
              Durante un año había operado desde el hacer rígido, sin tiempo para escuchar mis deseos y la visión de mi marca. El síndrome del impostor llegó, pero decidí no darle lugar: vi con honestidad dónde estaba parada y definí dónde quería estar. Hoy sé que mis propuestas nacen del más absoluto corazón, pero tienen los pies en la Tierra.
            </p>
          </article>

          {/* Quote - Mobile/Tablet: original oval */}
          <div className="raices-oval-quote filo-mobile-only">
            La tecnología humana se expande cuando elegimos habitar el cuerpo con presencia, límites y goce.
          </div>
          {/* Quote - Desktop: CircularCardBorder.svg background */}
          <div className="filo-desktop-only filo-circular-quote-wrap">
            <div className="filo-circular-quote-bg" aria-hidden>
              <img src="/svg/filosofia/filo/CircularCardBorder.svg" alt="" className="filo-circular-quote-svg" />
            </div>
            <p className="filo-circular-quote-text">
              La tecnología humana se expande cuando elegimos habitar el cuerpo con presencia, límites y goce.
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
              <li><strong>Experiencias:</strong> Un espacio de crecimiento, herramientas somáticas y Tesoros Da Luz.</li>
              <li><strong>Procesos Integrales:</strong> Acompañamiento personalizado para acuerpar tu transformación.</li>
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
