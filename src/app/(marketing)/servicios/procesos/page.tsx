import { Metadata } from 'next';
import Link from 'next/link';
import {
  ProcesosBackground,
  ProcesosOrganicBox,
  ProcesosOvalPlaceholder,
} from '@/components/svg/ProcesosPageComponents';
import './procesos-pages.css';

const PROCESOS_WRAPPER = 'procesos-pages';

export const metadata: Metadata = {
  title: 'Procesos DA LUZ: La Alquimia de tu Soberanía | DA LUZ CONSCIENTE',
  description:
    'En Da Luz, el cuerpo refleja el funcionamiento del Alma. Herramientas de autogestión, Ciclos Alquímicos y Sesiones de Regulación para tu transformación profunda.',
  openGraph: {
    title: 'Procesos DA LUZ - La Alquimia de tu Soberanía',
    description:
      'Botiquín Alquímico, Cofre DA LUZ, Ciclos Alquímicos y Sesiones de Regulación. Abordamos la causa raíz para reequilibrar tus cuerpos.',
    type: 'website',
  },
};

export default function ProcesosPage() {
  return (
    <div className={PROCESOS_WRAPPER}>
      <div className="procesos-page-container">
        <ProcesosBackground variant="general" />

        {/* Cabecera */}
        <section className="procesos-header-band" aria-labelledby="procesos-title">
          <div className="procesos-header-band-inner">
            <h1 id="procesos-title" className="procesos-band-title">
              PROCESOS DA LUZ: LA ALQUIMIA DE TU SOBERANÍA
            </h1>
          </div>
        </section>

        {/* Intro quote */}
        <section className="procesos-intro-quote" aria-label="Introducción">
          <p className="procesos-intro-quote-text">
            &ldquo;El cuerpo no miente ni negocia: es una tecnología viva que somatiza lo que el sistema nervioso y el subconsciente no logran metabolizar. No creemos en soluciones mágicas ni en terapias que generan dependencia; abordamos la causa raíz combinando fitoterapia clínica, modulación vibracional y liberación somática para devolverte el mando de tu propia biología.&rdquo;
          </p>
        </section>

        {/* Herramientas de Autogestión */}
        <section className="procesos-section procesos-herramientas" aria-labelledby="herramientas-title">
          <div className="procesos-herramientas-grid">
            <div className="procesos-herramienta-card">
              <div className="procesos-herramienta-image">
                <ProcesosOvalPlaceholder
                  src="/svg/procesos/image1%20Procesos.png"
                  alt="Botiquín Alquímico - tinturas, microdosis y elixires"
                />
              </div>
              <div className="procesos-herramienta-content">
                <h3 className="procesos-herramienta-name">EL BOTIQUÍN BOTÁNICO</h3>
                <p className="procesos-herramienta-desc">
                  Nuestra farmacia viva para la autogestión y el reseteo orgánico. Accedé al catálogo detallado de las hierbas medicinales, tinturas madre, microdosis y elixires florales con los que formulamos y asistimos cada proceso. Conocé la signatura botánica de cada planta, sus principios activos y cómo actúan sobre la depuración de tus filtros emuntorios (hígado, intestino, riñones) y la regulación del sistema nervioso.
                </p>
                <Link href="/productos" className="procesos-btn-blue">
                  CONOCER NUESTRAS PLANTAS Y ELIXIRES
                </Link>
              </div>
            </div>
            <div className="procesos-herramienta-card">
              <div className="procesos-herramienta-image">
                <ProcesosOvalPlaceholder
                  src="/svg/procesos/image2%20Procesos.png"
                  alt="Cofre DA LUZ - tecnologías vibracionales"
                />
              </div>
              <div className="procesos-herramienta-content">
                <h3 className="procesos-herramienta-name">COFRE DE TECNOLOGÍAS VIBRACIONALES</h3>
                <p className="procesos-herramienta-desc">
                  Las herramientas clínicas y energéticas con las que intervenimos sobre el campo electromagnético y la memoria celular. Explorá la base técnica de nuestras terapias: sonoterapia con cuencos tibetanos (432 Hz / ondas Alfa y Theta), radiestesia evolutiva con péndulo, desarticulación de censores subconscientes, Reiki Usui y liberación de la fascia corporal. Saberes de precisión para ordenar lo sutil antes de que se cristalice en síntoma físico.
                </p>
                <Link href="/servicios/procesos/sesiones-integrales" className="procesos-btn-blue">
                  EXPLORAR HERRAMIENTAS Y TERAPIAS
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="procesos-page-footer">
          <p className="procesos-page-cta-text">
            ¿Por dónde ingresar a tu proceso?
          </p>
          <div className="procesos-page-buttons">
            <Link href="/servicios/procesos/ciclos-alquimicos" className="procesos-btn-cream procesos-btn-orientation">
              EXPLORAR CICLOS ALQUÍMICOS
            </Link>
            <Link href="/servicios/procesos/sesiones-integrales" className="procesos-btn-blue">
              ELEGIR UNA SESIÓN INTEGRAL
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
