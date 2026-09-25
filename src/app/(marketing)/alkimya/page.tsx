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
        <AlkimyaWaveHeader title="manifiesto alkimyco" />

        <div className="mf-manifiesto-body">
          <p className="mf-lead"><em>Neurocosmética que transforma: la sinergia precisa entre saberes botánicos ancestrales y biotecnología vegetal moderna.</em></p>
          <p className="mf-text">Creada para quienes buscan ir más allá de la cosmética convencional y eligen una experiencia de transformación encarnada. Inspirada en la sabiduría de las medicinas botánicas que transformaron la relación con mi propio cuerpo, formulo alquimias vivas con un propósito claro: acompañarte a restaurar la salud de tu barrera cutánea en profunda sintonía con la regulación de tu sistema nervioso y la claridad de tu mente.</p>
          <p className="mf-text">Como la naturaleza misma, tu biología habla; Da Luz es el puente somático para escucharla. A través de cada aroma botánico, cada gota viva, cada tacto consciente y cada frecuencia sonora, te invito a habitar tu cuerpo con presencia, soberanía y verdadero goce en tu cotidiano.</p>
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
            <div className="mf-pilar-body mf-cloud"><p className="mf-text">Cuidar de nuestro templo no debe comprometer la salud de la Tierra ni la de los seres que la habitan. Nuestras fórmulas son 100% libres de crueldad animal y envasadas en vidrio ámbar reutilizable. Elegimos un equilibrio responsable: el alma de nuestras alquimias es pura botánica viva, potenciada por una fracción precisa de activos biotecnológicos de origen vegetal (química verde). Lejos de la sobreexplotación de especies silvestres, estos activos ofrecen una biocompatibilidad celular excepcional, garantizando fórmulas estables, seguras y en total afinidad con tu biología y con la naturaleza.</p></div>
          </article>
          <article className="mf-pilar">
            <h3 className="mf-pilar-title"><span className="mf-pilar-num">2.</span> Botánica Viva &amp; Rigor Fitoterapéutico</h3>
            <div className="mf-pilar-body mf-cloud"><p className="mf-text">La naturaleza es nuestro laboratorio más sabio. Seleccionamos extractos botánicos puros, aceites esenciales de grado terapéutico, hidrolatos destilados al vapor y tinturas madre bajo estricto rigor clínico y respeto ancestral. Cada activo vegetal es elegido por su función bioquímica sobre tu biotipo cutáneo, su impacto sobre el sistema nervioso y su capacidad de devolverle a tus tejidos su orden biológico natural.</p></div>
          </article>
          <article className="mf-pilar">
            <h3 className="mf-pilar-title"><span className="mf-pilar-num">3.</span> Transparencia Radical &amp; Soberanía</h3>
            <div className="mf-pilar-body mf-cloud"><p className="mf-text">Saber exactamente qué ponés sobre tu piel es un acto innegociable de soberanía personal. Garantizamos transparencia absoluta publicando el desglose INCI completo de cada fórmula y abriendo las puertas de nuestro laboratorio en la sección de Activos y Origen. Te brindamos información clara, fundamentada y accesible para que elijas conectar con nuestras alquimias desde el conocimiento y la libertad.</p></div>
          </article>
          <article className="mf-pilar">
            <h3 className="mf-pilar-title"><span className="mf-pilar-num">4.</span> Neurocosmética &amp; Alquimia Frecuencial</h3>
            <div className="mf-pilar-body mf-cloud"><p className="mf-text">Honramos el diálogo bidireccional entre tu piel y tu cerebro (el eje neurocutáneo). Fusionamos la precisión biológica de los activos botánicos con el impacto límbico y emocional de los aromas puros. Esta sinergia trasciende lo superficial: es un estímulo sensorial diseñado para silenciar el estrés y devolverle la calma a tus células. Para sellar este pulso, cada lote es frecuenciado cinética y cimáticamente mediante la vibración acústica de cuencos tibetanos, diapasones y armonización sutil.</p></div>
          </article>
        </div>
      </section>

      {/* ============================================================
          SECCIÓN 3 — NUESTRO COMPROMISO SUSTENTABLE
          ============================================================ */}
      <section className="mf-section mf-sustentable">
        <h2 className="mf-sustentable-title">compromiso sustentable</h2>

        <div className="mf-ciclo">
          <ArrowRing />
          <div className="mf-ciclo-content">
            <p className="mf-ciclo-lead">¡REUTILIZALOS!</p>
            <p className="mf-text">Podés dejar tus envases de vidrio ámbar (y los residuos limpios que generes) en un punto cercano de reciclaje. Te compartimos accesos directos para encontrar la mejor ubicación y hacerte cargo de tus consumos con soberanía y conciencia ecológica.</p>
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

