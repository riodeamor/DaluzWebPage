'use client';

import Link from 'next/link';
import AlkimyaWaveHeader from '@/components/alkimya/AlkimyaWaveHeader';

export default function ActivosOrigenPage() {
  return (
    <div className="activos-origen-page">

      {/* Section 1 */}
      <section className="activos-origen-section">
        {/* H1 - Activos y Origen with AYOTitle.svg */}
        <AlkimyaWaveHeader title="La Arquitectura de Nuestras Fórmulas" />

        {/* H2 - La Arquitectura de nuestras Fórmulas with AYOband.svg */}

        {/* Content */}
        <div className="activos-origen-content-wrap">
          <blockquote className="ayo-blockquote">
            <strong>Habitar la propia medicina es un acto de soberanía.</strong>
          </blockquote>
          <p className="ayo-paragraph">
            Diseñamos soluciones dermocosméticas donde la sabiduría botánica se encuentra con la biotecnología verde. Nuestras fórmulas son <strong>Alquimias Activas</strong> concebidas para respetar la inteligencia biológica de tu piel y su microbiota, nutriendo el diálogo constante entre tu naturaleza y tu bienestar.
          </p>
          <p className="ayo-paragraph">
            En Da Luz no entregamos un simple cosmético; entregamos una <strong>herramienta de autogestión</strong>. Creemos profundamente que cuando comprendés qué aplicás y por qué lo hacés, la eficacia celular de la Alquimia se potencia.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="activos-origen-section">
        {/* H2 - Transparencia Total with AYOband.svg */}
        <div className="ayo-band-section">
          <h2 className="ayo-band-title">Transparencia Radical: Co-creá tu Bienestar</h2>
        </div>

        {/* Card with existing content */}
        <div className="ayo-transparency-card">
          <p className="ayo-card-text">
            Toda Alkimya se sostiene sobre un pilar innegociable: <strong>la transparencia radical</strong>. Nuestro compromiso es que tengas conciencia plena del origen, la pureza y el propósito de cada activo que entra en contacto con tu cuerpo.
          </p>
          <p className="ayo-card-text">
            Queremos que seas <strong>co-creadora informada de tu propio cuidado</strong>; por eso, abrimos de par en par el corazón de nuestras formulaciones:
          </p>
        </div>

        {/* Bullet points */}
        <ul className="ayo-bullet-list">
          <li>
            <strong>Ciencia Verde y Eficacia:</strong> Empleamos activos biotecnológicos de alta pureza y biocompatibilidad (como Niacinamida, Ácido Hialurónico fraccionado y renovadores celulares suaves) para garantizar resultados visibles, formulando 100% libres de parabenos, siliconas, petrolatos y disruptores endocrinos.
          </li>
          <li>
            <strong>Respeto por la Microbiota:</strong> Cada producto incorpora prebióticos de vanguardia como Xilitol e Inulina para nutrir las bacterias protectoras, sellar el manto ácido y prevenir la pérdida transdérmica de agua (TEWL).
          </li>
          <li>
            <strong>Potencia Botánica de Raíz:</strong> Trabajamos exclusivamente con aceites vegetales de primera prensada en frío e hidrolatos puros destilados al vapor, preservando intacto el pulso fitoquímico y la vitalidad de la planta.
          </li>
        </ul>
      </section>

      {/* Section 3 - Cards */}
      <section className="activos-origen-section ayo-section-cards">
        <h2 className="ayo-section-title">Conocimiento y Soberanía</h2>
        <h3 className="ayo-section-subtitle"><em>Te invitamos a explorar la anatomía de nuestras fórmulas a través de tres portales de estudio:</em></h3>

        <div className="ayo-cards-grid">
          <div className="ayo-card">
            <h4 className="ayo-card-heading">1. Ciencia Verde</h4>
            <p className="ayo-card-desc">
              Descubrí nuestra clasificación técnica: desde el Corazón Botánico hasta la Pureza Clínica. Entendé el origen y el sustento de esos nombres científicos que a veces intimidan, pero que representan el estándar más alto de eficacia celular.
            </p>
            <Link href="#" className="ayo-card-button">
              EXPLORAR CIENCIA VERDE
            </Link>
          </div>

          <div className="ayo-card">
            <h4 className="ayo-card-heading">2. Saber Seguro: Guía de Uso Responsable</h4>
            <p className="ayo-card-desc">
              Para una práctica certera y consciente, consultá nuestras recomendaciones galénicas sobre fotosensibilidad de activos, adaptabilidad según tu terreno, compatibilidades y tiempos de asimilación de las plantas.
            </p>
            <Link href="#" className="ayo-card-button">
              VER GUÍA DE SEGURIDAD
            </Link>
          </div>

          <div className="ayo-card">
            <h4 className="ayo-card-heading">3. Bitácora de Materia Prima</h4>
            <p className="ayo-card-desc">
              El mapa detallado de nuestro Botiquín Alquímico. Un espacio abierto para conocer las propiedades terapéuticas, el origen botánico y la afinidad fisiológica de cada extracto, manteca y activo según las necesidades de tu piel.
            </p>
            <Link href="#" className="ayo-card-button">
              ABRIR BITÁCORA
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ayo-footer">
        <p><em>Gracias por elegir una cosmética viva y soberana, por honrar tu microbiota y por confiar en la inteligencia biológica de tu propio templo.</em></p>
      </footer>
    </div>
  );
}

