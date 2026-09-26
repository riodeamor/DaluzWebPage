'use client';

import { NextPage } from 'next';
import AlkimyaWaveHeader from '@/components/alkimya/AlkimyaWaveHeader';

/* Anillo decorativo de 4 flechas del ciclo de reciclaje (solo desktop/tablet) */
const ArrowRing = () => (
  <svg
    className="mf-arrow-ring"
    viewBox="0 0 1000 500"
    aria-hidden="true"
  >
    <g fill="none" stroke="#FFF2E9" strokeWidth={2.5} opacity={0.85} strokeLinecap="round">
      <path d="M962.9 288.2 A470 220 0 0 1 581.6 466.7" />
      <path d="M418.4 466.7 A470 220 0 0 1 37.1 288.2" />
      <path d="M37.1 211.8 A470 220 0 0 1 418.4 33.3" />
      <path d="M581.6 33.3 A470 220 0 0 1 962.9 211.8" />
    </g>
    <g fill="#FFF2E9" opacity={0.85}>
      <g transform="translate(581.6 466.7) rotate(175.3)">
        <path d="M0 0 L-24 -13 L-24 13 Z" />
      </g>
      <g transform="translate(37.1 288.2) rotate(249.4)">
        <path d="M0 0 L-24 -13 L-24 13 Z" />
      </g>
      <g transform="translate(418.4 33.3) rotate(355.3)">
        <path d="M0 0 L-24 -13 L-24 13 Z" />
      </g>
      <g transform="translate(962.9 211.8) rotate(69.4)">
        <path d="M0 0 L-24 -13 L-24 13 Z" />
      </g>
    </g>
  </svg>
);

/* Banda crema con borde inferior ondulado (fondo de los títulos de sección) */
const BandWave = () => (
  <svg
    className="mf-band-wave"
    viewBox="0 0 1440 200"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M0,0 H1440 V52 C1400,55 1370,58 1330,60 C1250,66 1200,82 1120,95 C1010,112 950,150 850,150 C760,150 700,128 620,132 C520,138 460,116 360,120 C270,123 220,178 150,178 C90,178 50,160 0,150 Z"
      fill="#FFF2E9"
    />
  </svg>
);

const AlkimyaPage: NextPage = () => {
  return (
    <div className="mf-page">
      {/* Fondo mesh rojo — idéntico al de biotipos y doshas */}
      <div className="biotipos-mesh-bg-global" aria-hidden="true" />

      {/* ============================================================
          SECCIÓN 1 — MANIFIESTO ALKIMYCO
          ============================================================ */}
      <section className="mf-section mf-manifiesto">
        <AlkimyaWaveHeader title="Manifiesto Alkimyco" />

        <div className="mf-manifiesto-body">
          <p className="mf-lead"><strong>Neurocosmética que transforma:</strong></p>
          <p className="mf-text">Cada fórmula de Alkimya Da Luz es una <strong>experiencia de transformación encarnada</strong>. Creamos tratamientos diseñados no solo para <strong>restaurar la salud de tu barrera cutánea</strong>, sino para impactar profundamente en la <strong>regulación de tu sistema nervioso y la claridad de tu mente</strong>.</p>
          <p className="mf-text"><em>Como la naturaleza misma, tu biología habla; Da Luz es el puente somático para escucharla.</em> Nuestra cosmética viva integra biotecnología limpia y botánica de alta pureza para acompañarte a <strong>habitar tu cuerpo con presencia, soberanía y verdadero goce</strong>.</p>
        </div>
      </section>

      {/* ============================================================
          SECCIÓN 2 — PILARES DE ALKIMYA DA LUZ
          ============================================================ */}
      <section className="mf-section mf-pilares">
        <div className="mf-band-wrap">
          <div className="mf-band">
            <BandWave />
            <h2 className="mf-band-title">Pilares de Alkimya Da Luz</h2>
          </div>
        </div>

        <div className="mf-pilares-grid">
          <article className="mf-pilar">
            <h3 className="mf-pilar-title"><span className="mf-pilar-num">1.</span> Ecología, Conciencia &amp; Biotecnología Limpia</h3>
            <div className="mf-pilar-body mf-cloud"><p className="mf-text"><strong>Cuidar nuestro templo</strong> requiere un compromiso total con el ecosistema que nos sostiene. Formulamos productos <strong>100% libres de crueldad animal</strong> y envasados en vidrio ámbar reutilizable, seleccionando activos biotecnológicos de origen vegetal (química verde) que garantizan una biocompatibilidad celular excepcional y una total afinidad con tu biología y con la naturaleza.</p></div>
          </article>
          <article className="mf-pilar">
            <h3 className="mf-pilar-title"><span className="mf-pilar-num">2.</span> Botánica Viva &amp; Rigor Fitoterapéutico</h3>
            <div className="mf-pilar-body mf-cloud"><p className="mf-text"><em>La naturaleza es nuestro laboratorio más sabio.</em> Seleccionamos cada extracto, aceite y destilado vegetal bajo un <strong>estricto rigor clínico y respeto ancestral</strong>, asegurando que cada ingrediente cumpla una función bioquímica sobre tu biotipo cutáneo para devolverle a tus tejidos su <strong>orden biológico natural</strong>.</p></div>
          </article>
          <article className="mf-pilar">
            <h3 className="mf-pilar-title"><span className="mf-pilar-num">3.</span> Transparencia Radical &amp; Soberanía</h3>
            <div className="mf-pilar-body mf-cloud"><p className="mf-text"><strong>Conocer qué entra en contacto con tu piel</strong> es un acto innegociable de soberanía personal. Te ofrecemos el desglose INCI completo de cada fórmula, explicándote el propósito biológico de cada componente para que puedas conectar con nuestras alquimias desde el conocimiento y la libertad.</p></div>
          </article>
          <article className="mf-pilar">
            <h3 className="mf-pilar-title"><span className="mf-pilar-num">4.</span> Neurocosmética &amp; Alquimia Frecuencial</h3>
            <div className="mf-pilar-body mf-cloud"><p className="mf-text">Nuestras fórmulas aprovechan el diálogo bidireccional entre tu piel y tu cerebro (el eje neurocutáneo). A través del impacto límbico y emocional de los aromas puros, nuestras alquimias ayudan a <strong>silenciar el estrés y devolverle la calma a tus células</strong>. Cada lote es frecuenciado cinética y cimáticamente mediante la vibración acústica de cuencos tibetanos, diapasones y armonización sutil.</p></div>
          </article>
        </div>
      </section>

      {/* ============================================================
          SECCIÓN 3 — NUESTRO COMPROMISO SUSTENTABLE
          ============================================================ */}
      <section className="mf-section mf-sustentable">
        <h2 className="mf-sustentable-title">Compromiso Sustentable</h2>

        <div className="mf-ciclo">
          <ArrowRing />
          <div className="mf-ciclo-content">
            <p className="mf-ciclo-lead"><strong>¡REUTILIZALOS!</strong></p>
            <p className="mf-text">Nuestros envases de vidrio están pensados para circular. Reutilizar es el primer paso para <strong>hacerte cargo de tus consumos con soberanía y conciencia ecológica</strong>.</p>
            <div className="mf-ciclo-links">
              <a className="mf-recycle-btn" href="#" target="_blank" rel="noopener noreferrer">PUNTO DE RECICLAJE 1</a>
              <a className="mf-recycle-btn" href="#" target="_blank" rel="noopener noreferrer">PUNTO DE RECICLAJE 2</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AlkimyaPage;

