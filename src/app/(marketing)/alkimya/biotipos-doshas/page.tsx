'use client';

import Link from 'next/link';
import BiotiposTablasCarousel from '@/components/biotipos/BiotiposTablasCarousel';
import AlkimyaWaveHeader from '@/components/alkimya/AlkimyaWaveHeader';

const BIOTIPOS_COLUMNS = ["Cómo se siente", "Tu necesidad", "Alkimyas Aliadas"];
const BIOTIPOS_TABLAS = [
  { title: "Piel Seca — Nutrición Envolvente", columns: BIOTIPOS_COLUMNS, rows: [{ "Cómo se siente": "Fina, tirante o áspera, con tendencia a la descamación reactiva. Un tejido con déficit lipídico que tiende a marcar líneas de expresión tempranas.", "Tu necesidad": "Restauración profunda del manto lipídico. Requiere lípidos biocompatibles, ceramidas vegetales y nutrición botánica densa que selle la hidratación celular.", "Alkimyas Aliadas": "Línea Ilumina." }] },
  { title: "Piel Madura — Regeneración & Sostén Estructural (Vata)", columns: BIOTIPOS_COLUMNS, rows: [{ "Cómo se siente": "Pérdida de turgencia, adelgazamiento dérmico y menor producción de sebo natural. Marcación de líneas y necesidad de sostén.", "Tu necesidad": "Reestructuración celular. Alta nutrición, fito-colágeno y antioxidantes botánicos que reparen la matriz del tejido y devuelvan densidad y volumen.", "Alkimyas Aliadas": "Línea Ilumina y Línea Soy." }] },
  { title: "Piel Mixta — Equilibrio Dual", columns: BIOTIPOS_COLUMNS, rows: [{ "Cómo se siente": "Polarizada. Mix Frío (Vata-Kapha): Zona T con brillo sebáceo y mejillas deshidratadas. Mix Calor (Pitta-Kapha): Zona T congestionada y mejillas reactivas con rojez.", "Tu necesidad": "Calibración por zonas. Seborregulación en el eje central sin deshidratar los laterales, combinando astringencia botánica con nutrición ligera.", "Alkimyas Aliadas": "Línea Serena en Zona T; Línea Pureza o Ilumina en mejillas." }] },
  { title: "Piel Grasa — Claridad & Seborregulación (Kapha)", columns: BIOTIPOS_COLUMNS, rows: [{ "Cómo se siente": "Densa, con brillo oleoso constante, poros dilatados y propensión a comedones o sobrecarga folicular.", "Tu necesidad": "Descongestión no abrasiva y purificación del poro. Activos astringentes (arcillas, hidrolatos puros) y texturas fluidas que equilibren el sebo sin dañar el microbioma.", "Alkimyas Aliadas": "Línea Serena." }] },
  { title: "Piel Sensible — Calma & Reparación de Barrera", columns: BIOTIPOS_COLUMNS, rows: [{ "Cómo se siente": "Reactiva, con enrojecimiento difuso, ardor o intolerancia térmica. Un tejido con hiperreactividad nerviosa que refleja calor interno.", "Tu necesidad": "Desinflamación profunda y blindaje del estrato córneo. Moléculas botánicas calmantes que enfríen la temperatura del tejido y reduzcan la irritabilidad sensorial.", "Alkimyas Aliadas": "Línea Pureza. (Refuerzo: Línea Ilumina si tiende a seca; Línea Serena si tiende a grasa)." }] },
  { title: "Piel Normal — El Pulso de la Salud (Tridóshica)", columns: BIOTIPOS_COLUMNS, rows: [{ "Cómo se siente": "Turgente, elástica, con textura lisa, tono homogéneo y luminosidad natural. El estado biológico donde los tres doshas conviven en armonía.", "Tu necesidad": "Mantenimiento y protección antioxidante preventiva para resguardar la barrera frente al desgaste ambiental y el fotoenvejecimiento.", "Alkimyas Aliadas": "Línea Pureza." }] },
];

const BIOTIPOS_CAPILARES_COLUMNS = BIOTIPOS_COLUMNS;
const BIOTIPOS_CAPILARES_TABLAS = [
  { title: "Cabello Seco — Reparación Lipídica de la Hebra", columns: BIOTIPOS_CAPILARES_COLUMNS, rows: [{ "Cómo se siente": "Áspero al tacto, opaco, quebradizo y con estática/frizz. Frecuente en cabellos con rulos, ondas o expuestos a estrés ambiental.", "Tu necesidad": "Sellado de cutícula y reposición de ácidos grasos esenciales. Fórmulas botánicas con peso saludable que devuelvan docilidad y flexibilidad a la fibra.", "Alkimyas Aliadas": "Shampoo Ilumina y Sérum Capilar Ilumina." }] },
  { title: "Cabello Normal — Sostén del Equilibrio Biológico", columns: BIOTIPOS_CAPILARES_COLUMNS, rows: [{ "Cómo se siente": "Suave, con brillo natural, fibra flexible y un cuero cabelludo equilibrado (sin exceso de grasa ni sequedad).", "Tu necesidad": "Limpieza consciente y no invasiva que preserve los lípidos naturales y proteja la microbiota capilar en el tiempo.", "Alkimyas Aliadas": "Shampoo Líquido Pureza." }] },
  { title: "Cabello Graso — Purificación & Detox Folicular (Kapha)", columns: BIOTIPOS_CAPILARES_COLUMNS, rows: [{ "Cómo se siente": "Pesado en la raíz, pérdida rápida de volumen pocas horas después del lavado y cuero cabelludo con tendencia a la oclusión sebácea.", "Tu necesidad": "Regulación botánica de la glándula sebácea sin efecto rebote. Activos purificantes que oxigenen el folículo y aporten ligereza a la raíz.", "Alkimyas Aliadas": "Shampoo Serena." }] },
  { title: "Cuero Cabelludo Sensible — Calma & Desinflamación de Raíz (Pitta)", columns: BIOTIPOS_CAPILARES_COLUMNS, rows: [{ "Cómo se siente": "Prurito (picazón), descamación irritativa (caspa seca/grasa), ardor o caída reactiva asociada a sobrecarga nerviosa.", "Tu necesidad": "Modulación del microbioma capilar, regulación del pH y estimulación circulatoria suave para desinflamar el folículo piloso y fortalecer el anclaje.", "Alkimyas Aliadas": "Tónico Capilar Raíz y Shampoo Raíz." }] },
];

export default function BiotiposDoshasPage() {
  return (
    <div className="biotipos-page">
      <div className="biotipos-mesh-bg-global"></div>
      {/* Section 1 */}
      <section className="relative overflow-hidden flex flex-col section-biotipos-1">

        {/* Content Area - Flexible area for adding text and other elements */}
        <div className="relative z-10 flex-1 section-biotipos-1-content">
          <AlkimyaWaveHeader title="biotipos" />

{/* Main Text with SVG Background */}
          <div className="biotipos-text-element biotipos-section1-main-text">
            <div className="biotipos-section1-main-text-bg"></div>
            <div className="biotipos-section1-main-text-content">
              <p className="biotipos-section1-main-text-paragraph" style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1.2rem)' }}>
                La soberanía sobre tu bienestar comienza por reconocer tu bio-individualidad. La industria masiva te enseñó a tratar a tu piel como un problema a corregir, encasillándote en categorías rígidas; en Da Luz honramos tu diseño como un terreno biológico vivo, inteligente y en constante movimiento. Comprender tu biotipo no es etiquetarte: es decodificar el lenguaje sutil de tu piel y tu cabello para elegir las alquimias botánicas que cooperarán de forma exacta con tu fisiología.
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
                    Para comprender tu biotipo, es esencial reconocer a la piel como tu frontera sensorial más activa. Embriológicamente, tu piel y tu cerebro nacen del mismo tejido original (el ectodermo): son dos extremos de un mismo sistema. Por eso, lo que tu mente calla o tu sistema nervioso no logra digerir, tu piel lo somatiza en tiempo real: desde ese brote repentino en semanas de sobreexigencia, hasta la rojez o el ardor cuando estás al límite. Tu barrera no es un envoltorio pasivo; es un mapa vivo que siente, procesa y comunica tu estado interno antes de que la razón logre nombrarlo.
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
                    Como primera línea de defensa, regula la pérdida transdérmica de agua (TEWL) y equilibra un microbioma de millones de bacterias protectoras. ¿Cómo se siente esto en tu cotidiano? Cuando este escudo se debilita por estrés o químicos agresivos, la humedad se evapora: aparece la tirantez después de lavarte, la piel que “se chupa” las cremas y sigue seca, o la reactividad al frío y al viento. Cuidar tu biotipo no es maquillar el síntoma; es sellar ese escudo biológico para que tu barrera retenga su agua celular y habite el entorno con elasticidad, frescura y vitalidad soberana.
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
          <div className="biotipos-text-element biotipos-section9-main-text biotipos-section9-main-text--wide">
            <div className="biotipos-section9-main-text-bg"></div>
            <div className="biotipos-section9-main-text-content">
              <p className="biotipos-section9-main-text-paragraph">Al igual que el rostro, el cabello y el cuero cabelludo son un sismógrafo directo de tu equilibrio interno. Lejos de ser un filamento inerte, cada hebra nace de un terreno vascularizado donde convergen la microcirculación, las terminaciones nerviosas y la fascia craneal.</p>
              <p className="biotipos-section9-main-text-paragraph">Tu biotipo capilar se define por la danza entre la secreción sebácea de la raíz y la arquitectura lipídica de la fibra: el pulso Vata se traduce en sequedad y fragilidad; el pulso Pitta somatiza a través del exceso térmico y la inflamación folicular; y el pulso Kapha se manifiesta en sobrecarga oleosa y congestión del poro.</p>
              <p className="biotipos-section9-main-text-paragraph">Comprender tu Dosha capilar es la llave para abandonar el maquillaje temporal de las siliconas y habilitar un cuidado botánico de raíz: oxigenar el folículo, preservar los lípidos naturales y devolverle a tu melena su volumen y vitalidad soberana.</p>
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
                  encontrá tu ceremonia diaria
                </Link>
              </h2>

              {/* Main Text */}
              <div className="biotipos-section15-main-text">
                <p className="biotipos-section15-main-text-paragraph">
                  ¿Aún tenés dudas sobre tu biotipo? Te asesoramos para que encuentres tu combinación botánica exacta.
                </p>
              </div>

              {/* Buttons Container */}
              <div className="biotipos-section15-buttons-container">
                <a
                  href="/alkimya/tu-ceremonia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="biotipos-section15-button biotipos-section15-button-instagram"
                >
                  EXPLORAR CEREMONIAS
                </a>
                <a
                  href="https://wa.me/5493512344580"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="biotipos-section15-button biotipos-section15-button-whatsapp"
                >
                  CONSULTAR POR WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>




    </div>
  )
}
