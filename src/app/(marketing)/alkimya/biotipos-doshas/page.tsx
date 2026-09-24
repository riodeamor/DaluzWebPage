'use client';

import Link from 'next/link';
import BiotiposTablasCarousel from '@/components/biotipos/BiotiposTablasCarousel';

const BIOTIPOS_COLUMNS = [
  "Biotipo Cutáneo",
  "Correspondencia a Dosha/s",
  "Características Clave",
  "Necesidades Esenciales",
  "ALKIMYA RECOMENDADA",
];

const BIOTIPOS_TABLAS = [
  {
    title: "Piel Normal",
    columns: BIOTIPOS_COLUMNS,
    rows: [
      {
        "Biotipo Cutáneo": "Normal (Eudérmica)",
        "Correspondencia a Dosha/s": "Tridoshic (Equilibrada)",
        "Características Clave": "Piel lisa, suave, color uniforme y brillo moderado. Representa el equilibrio perfecto.",
        "Necesidades Esenciales": "Mantenimiento y prevención. Foco en antioxidantes y humectantes ligeros.",
        "ALKIMYA RECOMENDADA": "SERENA",
      },
    ],
  },
  {
    title: "Piel Seca",
    columns: BIOTIPOS_COLUMNS,
    rows: [
      {
        "Biotipo Cutáneo": "Seca (Alípica)",
        "Correspondencia a Dosha/s": "Vata (Éter y Aire)",
        "Características Clave": "Piel fina, tirante, con tendencia a la descamación y arrugas. Déficit en secreción sebácea.",
        "Necesidades Esenciales": "Nutrición intensa (aceites pesados), lípidos, ceramidas y alta humectación.",
        "ALKIMYA RECOMENDADA": "NUTRE",
      },
    ],
  },
  {
    title: "Piel Grasa",
    columns: BIOTIPOS_COLUMNS,
    rows: [
      {
        "Biotipo Cutáneo": "Grasa y/o Acnéica",
        "Correspondencia a Dosha/s": "Kapha (Tierra y Agua)",
        "Características Clave": "Piel gruesa, brillante, con poros dilatados, tendencia a comedones y/o acné. Exceso de secreción sebácea.",
        "Necesidades Esenciales": "Regulación de sebo, activos astringentes (arcillas) y texturas ligeras.",
        "ALKIMYA RECOMENDADA": "ILUMINA",
      },
    ],
  },
  {
    title: "Piel Mixta",
    columns: BIOTIPOS_COLUMNS,
    rows: [
      {
        "Biotipo Cutáneo": "Mixta",
        "Correspondencia a Dosha/s": "Vata/Kapha o Pitta/Kapha",
        "Características Clave": "Sebo excesivo en la Zona T y áreas normales/secas en las mejillas.",
        "Necesidades Esenciales": "Balancear. Regulación en Zona T y nutrición ligera en el resto del rostro.",
        "ALKIMYA RECOMENDADA": "ILUMINA (Zona T) / SERENA (Resto)",
      },
    ],
  },
  {
    title: "Piel Sensible",
    columns: BIOTIPOS_COLUMNS,
    rows: [
      {
        "Biotipo Cutáneo": "Sensible",
        "Correspondencia a Dosha/s": "Pitta (Fuego y Agua)",
        "Características Clave": "Piel que reacciona fácilmente a estímulos externos, con tendencia a rojeces, picazón e inflamación.",
        "Necesidades Esenciales": "Calma, reparación de la barrera cutánea, activos desinflamatorios (Árnica, Manzanilla).",
        "ALKIMYA RECOMENDADA": "CALMA",
      },
    ],
  },
  {
    title: "Piel Madura",
    columns: BIOTIPOS_COLUMNS,
    rows: [
      {
        "Biotipo Cutáneo": "Madura",
        "Correspondencia a Dosha/s": "Vata (Envejecimiento)",
        "Características Clave": "Piel con pérdida de firmeza, elasticidad, volumen y líneas de expresión profundas.",
        "Necesidades Esenciales": "Reafirmación, alta nutrición, colágeno vegetal y activos anti-edad.",
        "ALKIMYA RECOMENDADA": "NUTRE / SERENA",
      },
    ],
  },
];

const BIOTIPOS_CAPILARES_COLUMNS = [
  "Como se siente",
  "Tu necesidad",
  "Alkimyas Aliadas",
];

const BIOTIPOS_CAPILARES_TABLAS = [
  {
    title: "Cabello Seco (VATA)",
    columns: BIOTIPOS_CAPILARES_COLUMNS,
    rows: [
      {
        "Como se siente": "Pelo poroso, con frizz, quebrado o con puntas abiertas.",
        "Tu necesidad": "Un abrazo de nutrición e hidratación intensa. Necesitás aceites y mantecas que sellen la cutícula y aporten el peso saludable que tus hebras piden.",
        "Alkimyas Aliadas": "Shampoo Ilumina y Serum Capilar Ilumina.",
      },
    ],
  },
  {
    title: "Cabello Graso (Kapha)",
    columns: BIOTIPOS_CAPILARES_COLUMNS,
    rows: [
      {
        "Como se siente": "Pelo grueso y pesado con cuero cabelludo oleoso y tendencia a la congestión. Se siente una pérdida de volumen y movimiento natural.",
        "Tu necesidad": "Regulación sebácea y detox. Necesitás activos botánicos que purifiquen y texturas ligeras.",
        "Alkimyas Aliadas": "Shampoo Serena.",
      },
    ],
  },
  {
    title: "Cuero Cabelludo Sensible (Pitta)",
    columns: BIOTIPOS_CAPILARES_COLUMNS,
    rows: [
      {
        "Como se siente": "Cuero cabelludo con picazón, descamación (caspa) o enrojecimiento. También se manifiesta en pérdida excesiva o crecimiento lento debido al estrés o inflamación.",
        "Tu necesidad": "Calma de raíz y estimulación folicular. Necesitás regular el pH, desinflamar el tejido y nutrir profundamente la base para que el pelo crezca con fuerza.",
        "Alkimyas Aliadas": "Tónico Capilar Raíz y Shampoo Raíz.",
      },
    ],
  },
];


export default function BiotiposDoshasPage() {
  return (
    <>
      <div className="biotipos-mesh-bg-global"></div>
      {/* Section 1 */}
      <section className="relative overflow-hidden flex flex-col section-biotipos-1">

        {/* Content Area - Flexible area for adding text and other elements */}
        <div className="relative z-10 flex-1 section-biotipos-1-content">
          {/* Main Title */}
          <div className="biotipos-section1-main-title-wrapper">
            <div className="biotipos-section1-main-title-bg"></div>
            <h1 className="biotipos-text-element biotipos-section1-main-title">
              ¡DESCUBRÍ TU BIOTIPO!
            </h1>
          </div>

          {/* Subtitle */}
          <p className="biotipos-text-element biotipos-section1-subtitle" style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1.3rem)' }}>
            El Reconocimiento de que Cada Ser es Único: Bio-individualidad y Sabiduría Ancestra
          </p>

          {/* Main Text with SVG Background */}
          <div className="biotipos-text-element biotipos-section1-main-text">
            <div className="biotipos-section1-main-text-bg"></div>
            <div className="biotipos-section1-main-text-content">
              <p className="biotipos-section1-main-text-paragraph" style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1.2rem)' }}>
                El concepto de bio-individualidad es un pilar central para Da Luz, integrando lo ancestral (Ayurveda) y la autogestión.
                <br /><br />
                Comprender tu biotipo es el primer paso para elegir las Alquimias de Da Luz que mejor te acompañarán. No buscamos clasificar, buscamos honrar tu esencia única.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <a
            href="#section-pieles"
            className="biotipos-text-element biotipos-section1-button biotipos-section1-button-1"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('section-pieles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            Pieles
          </a>

          <a
            href="#section-cabellos"
            className="biotipos-text-element biotipos-section1-button biotipos-section1-button-2"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('section-cabellos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            Cabellos
          </a>
        </div>
      </section>

      {/* Section 2 */}
      <section className="relative px-6 overflow-hidden flex flex-col section-biotipos-2">

        <div className="relative z-10 flex-1 section-biotipos-2-content">
          {/* Section Title - Full Width at Top */}
          <h2 className="biotipos-text-element biotipos-section2-title">
            <div className="biotipos-section2-title-bg"></div>
            <span className="biotipos-section2-title-text">La Piel: Nuestra Frontera Activa</span>
          </h2>

          {/* Main Container: Left (Text) and Right (Quiz) */}
          <div className="biotipos-section2-main-container">
            {/* Left Column - Text Content */}
            <div className="biotipos-section2-left-column">
              {/* Text Box - Merged */}
              <div className="biotipos-text-element biotipos-section2-text-left">
                <div className="biotipos-section2-text-left-bg"></div>
                <div className="biotipos-section2-text-left-content">
                  <p className="biotipos-section2-text-paragraph">
                    Sus funciones vitales actúan como nuestra primera línea de defensa: Controlar la pérdida de agua, proteger contra el entorno y actuar como barrera frente a químicos y agentes externos.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - symmetric editorial card */}
            <div className="biotipos-section2-right-column">
              <div className="biotipos-text-element biotipos-section2-text-left">
                <div className="biotipos-section2-text-left-bg"></div>
                <div className="biotipos-section2-text-left-content">
                  <p className="biotipos-section2-text-paragraph">
                    Sus funciones vitales actúan como nuestra primera línea de defensa: Controlar la pérdida de agua, proteger contra el entorno y actuar como barrera frente a químicos y agentes externos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carrusel de Biotipos Cutáneos (reemplaza Sections 3-8) */}
      <section id="section-pieles" className="section-biotipos-tablas">
        <div className="biotipos-section3-main-title-wrapper">
          <div className="biotipos-section3-main-title-bg"></div>
          <h2 className="biotipos-section3-main-title">
            Reconocé tu Biotipo Cutáneo
          </h2>
        </div>
        <BiotiposTablasCarousel tablas={BIOTIPOS_TABLAS} />
      </section>

      {/* Section 9 */}
      <section id="section-cabellos" className="relative overflow-hidden flex flex-col section-biotipos-9">

        <div className="relative z-10 flex-1 section-biotipos-9-content">
          {/* Main Title */}
          <h2 className="biotipos-text-element biotipos-section9-main-title">
            <div className="biotipos-section9-main-title-bg"></div>
            <span className="biotipos-section9-main-title-text">Los Biotipos Capilares: Tu Bio-equilibrio en el Cabello</span>
          </h2>

          {/* Main Text */}
          <div className="biotipos-text-element biotipos-section9-main-text">
            <div className="biotipos-section9-main-text-bg"></div>
            <div className="biotipos-section9-main-text-content">
              <p className="biotipos-section9-main-text-paragraph">
                Al igual que el rostro, el cabello y el cuero cabelludo son un reflejo directo de nuestro equilibrio interno (Doshas). El cuero cabelludo no es más que la piel de la cabeza, con las mismas funciones protectoras y la misma composición de barrera hidrolipídica.
              </p>
            </div>
          </div>

          {/* Text Grid Container */}
          <div className="biotipos-section9-text-grid">
            {/* Left Side Text */}
            <div className="biotipos-text-element biotipos-section9-left-text">
              <div className="biotipos-section9-left-text-bg"></div>
              <div className="biotipos-section9-left-text-content">
                <p className="biotipos-section9-side-text-paragraph">
                  Tu biotipo capilar se define por el patrón de secreciones sebáceas en la raíz (Kapha, Vata, Pitta) y la estructura de la fibra (Vata, Pitta). Esto determina su tendencia a la oleosidad, la sequedad, la caída o la irritación.
                </p>
              </div>
            </div>

            {/* Right Side Text */}
            <div className="biotipos-text-element biotipos-section9-right-text">
              <div className="biotipos-section9-right-text-bg"></div>
              <div className="biotipos-section9-right-text-content">
                <p className="biotipos-section9-side-text-paragraph">
                  Comprender tu Dosha capilar es clave para elegir un tratamiento que no solo repare la fibra, sino que armonice la raíz y asegure la vitalidad a largo plazo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carrusel de Biotipos Capilares (reemplaza Sections 10-14) */}
      <section className="section-biotipos-tablas">
        <BiotiposTablasCarousel tablas={BIOTIPOS_CAPILARES_TABLAS} />
      </section>

      {/* Section 15 */}
      <section className="relative overflow-hidden flex flex-col section-biotipos-15">

        <div className="relative z-10 flex-1 section-biotipos-15-content">
          {/* Main Text Container with SVG Background */}
          <div className="biotipos-section15-main-container">
            <div className="biotipos-section15-main-container-bg"></div>
            <div className="biotipos-section15-main-container-content">
              {/* Main Title */}
              <h2 className="biotipos-section15-main-title">
                <Link href="/alkimya/tu-ceremonia" className="biotipos-section15-main-title-link">
                  CLICK A CEREMONIA PARA TU RUTINA IDEAL
                </Link>
              </h2>

              {/* Main Text */}
              <div className="biotipos-section15-main-text">
                <p className="biotipos-section15-main-text-paragraph">
                  ¿Aún tienes dudas? ¡Te ayudamos a elegir!
                  <br /><br />
                  Si después de identificar tu biotipo todavía tienes dudas sobre cuál es el mejor producto para ti, contáctanos. ¡Estamos para guiarte en tu camino de bienestar!
                </p>
              </div>

              {/* Buttons Container */}
              <div className="biotipos-section15-buttons-container">
                <a
                  href="https://www.instagram.com/daluzconsciente/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="biotipos-section15-button biotipos-section15-button-instagram"
                >
                  Contactá por Instagram
                </a>
                <a
                  href="https://wa.me/5493512344580"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="biotipos-section15-button biotipos-section15-button-whatsapp"
                >
                  Consultá por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>




    </>
  )
}

