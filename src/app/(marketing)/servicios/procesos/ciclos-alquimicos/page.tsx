import { Metadata } from 'next';
import Link from 'next/link';
import {
  ProcesosBackground,
  ProcesosOvalBox,
} from '@/components/svg/ProcesosPageComponents';
import '../procesos-pages.css';
import './ciclos.css';

const PROCESOS_WRAPPER = 'procesos-pages';

export const metadata: Metadata = {
  title: 'Ciclos Alquímicos | DA LUZ CONSCIENTE',
  description:
    'Rutas de transformación consciente: Oasis, Metamorfosis y Génesis. Depuración natural y acompañamiento holístico para recuperar tu bioequilibrio.',
  openGraph: {
    title: 'Ciclos Alquímicos - DA LUZ CONSCIENTE',
    description:
      'Oasis, Metamorfosis y Génesis. Programas de sanación y purificación para tu viaje alquímico.',
    type: 'website',
  },
};

export default function CiclosAlquimicosPage() {
  return (
    <div className={`${PROCESOS_WRAPPER} ciclos-page`}>
      <div className="procesos-page-container">
        <ProcesosBackground variant="general" />

        {/* Cabecera - full width como Sesiones */}
        <section
          className="ciclos-header-band"
          aria-labelledby="ciclos-section-title"
        >
          <div className="ciclos-header-band-inner">
            <h1 id="ciclos-section-title" className="ciclos-section-header">
              CICLOS ALQUÍMICOS
            </h1>
          </div>
        </section>

        <main className="ciclos-main" id="ciclos-content">
          {/* Bloque 1: Introducción */}
          <section
            className="ciclos-intro"
            aria-labelledby="ciclos-intro-heading"
          >
            <h2 id="ciclos-intro-heading" className="sr-only">
              Introducción a los Ciclos Alquímicos
            </h2>
            <p className="ciclos-intro-item ciclos-intro-left-1">
              Nuestros Ciclos Alquímicos son caminos de transformación consciente diseñados para reconectar tu biología con tu esencia.
            </p>
            <p className="ciclos-intro-item ciclos-intro-right">
              A través de la depuración natural y el acompañamiento holístico, recuperarás tu bioequilibrio y potenciarás tu bienestar.
            </p>
            <p className="ciclos-intro-item ciclos-intro-left-2">
              Iniciá el Viaje Alquímico: Donde la Biología y la Consciencia se unen.
            </p>

          </section>
          {/* Bloque 2: OASIS */}
          <article
            className="ciclos-cycle-block"
            aria-labelledby="ciclos-oasis-title"
          >
            <div className="ciclos-cycle-header">
              <h2 id="ciclos-oasis-title" className="ciclos-cycle-title">
                OASIS
              </h2>
              <p className="ciclos-cycle-subtitle">
              Navegando Mis Aguas: Calibración &amp; Depuración Emocional
            </p>
            </div>
            <div className="ciclos-cycle-ovals">
              <ProcesosOvalBox className="ciclos-oval-left">
                <strong>Enfoque:</strong> Depuración Emocional, Alquimia Vibracional &amp; Reconfiguración Subconsciente.
                <br /><br />
                <strong>Duración &amp; Formato:</strong> Proceso individual continuo (Encuentros 1:1 quincenales o mensuales).
                <br /><br />
                <strong>Tecnologías:</strong> Péndulo Evolutivo, Terapia Floral de Precisión, Aromaterapia Límbica y Regulación Somática.
                <br /><br />
                <strong>Para qué sirve:</strong> Un espacio de calibración y contención profunda para cuando el cuerpo empieza a hablar a través del cansancio crónico, la reactividad ansiosa o la sensación constante de incoherencia interna. No venimos a forzar cambios agresivos, sino a desarmar automatismos y devolverle el equilibrio a tu sistema nervioso.
              </ProcesosOvalBox>
              <ProcesosOvalBox className="ciclos-oval-right">
                <strong>Ideal para:</strong> Quienes cargan con sobreexigencia mental, postergan su propio sentir por sostener a otros, o necesitan un acompañamiento íntimo y a medida para ordenar sus aguas emocionales.
                <br /><br />
                <strong>La Metodología (4 Niveles):</strong> Integramos en cada encuentro el rastreo subconsciente (péndulo), la indagación biopsicoemocional de la raíz, la reeducación celular (Flores de Bach + Elixir aromático) y la descarga fascial en el cuerpo.
                <br /><br />
                <strong>Incluye:</strong> Sesiones 1:1 personalizadas + Medicina botánica viva formulada mes a mes + Hoja de ruta sobre tus Ejes Arquetípicos + Soporte continuo entre sesiones.
              </ProcesosOvalBox>
            </div>
            <div className="ciclos-cycle-cta">
              <Link href="#" className="procesos-btn-cream ciclos-detail-link">
                VER DETALLES COMPLETOS DE OASIS
              </Link>
            </div>
          </article>

          {/* Bloque 4: METAMORFOSIS */}
          <article
            className="ciclos-cycle-block"
            aria-labelledby="ciclos-metamorfosis-title"
          >
            <div className="ciclos-cycle-header">
              <h2 id="ciclos-metamorfosis-title" className="ciclos-cycle-title">
                METAMORFOSIS
              </h2>
              <p className="ciclos-cycle-subtitle">
                El Futuro es Volver al Origen: Depuración de Filtros Orgánicos &amp; Transmutación
              </p>
            </div>
            <div className="ciclos-cycle-ovals">
              <ProcesosOvalBox className="ciclos-oval-left">
                <strong>Enfoque:</strong> Acompañamiento Biopsicoemocional, Depuración de Filtros Orgánicos y Desprogramación Celular.
                <br /><br />
                <strong>Duración:</strong> 5 Meses (El Sendero de los 5 Elementos y Emuntorios Biológicos).
                <br /><br />
                <strong>Tecnologías:</strong> Fitoterapia Clínica de Precisión, Biodecodificación, Radiestesia Evolutiva y Liberación Fascial.
                <br /><br />
                <strong>Para qué sirve:</strong> Desconectar el piloto automático y desintoxicar la memoria que el cuerpo retiene en sus órganos. El síntoma no es un error biológico a tapar: es una puerta de entrada al subconsciente. Al limpiar tus filtros físicos con medicina vegetal, el terreno se afloja y las emociones estancadas emergen para ser transmutadas.
              </ProcesosOvalBox>
              <ProcesosOvalBox className="ciclos-oval-right">
                <strong>Ideal para:</strong> Quienes experimentan inflamación crónica (digestiva, cutánea o menstrual), fatiga que no cede, patrones repetitivos en sus vínculos o la sensación de vivir atrapadas en una coraza de autoexigencia.
                <br /><br />
                <strong>La Hoja de Ruta (5 Estaciones):</strong> Intestino &amp; Mente (Mes 1), Colon &amp; Linaje Ancestral (Mes 2), Hígado &amp; Poder Personal (Mes 3), Útero, Huesos &amp; Límites (Mes 4), hasta culminar en el Sistema Nervioso y la integración de tu Adulta Soberana (Mes 5).
                <br /><br />
                <strong>Incluye:</strong> 1 Sesión individual mensual de 90 min (1:1) + Kit mensual de Fitoterapia Viva (tinturas madre, elixires y pócimas) + Bitácora Da Luz de trabajo somático + Acompañamiento y soporte continuo.
              </ProcesosOvalBox>
            </div>
            <div className="ciclos-cycle-cta">
              <Link href="#" className="procesos-btn-cream ciclos-detail-link">
                VER DETALLES COMPLETOS DE METAMORFOSIS
              </Link>
            </div>
          </article>

          {/* Bloque 5: GENESIS */}
          <article
            className="ciclos-cycle-block ciclos-cycle-block-last"
            aria-labelledby="ciclos-genesis-title"
          >
            <div className="ciclos-cycle-header">
              <h2 id="ciclos-genesis-title" className="ciclos-cycle-title">
                GÉNESIS
              </h2>
              <p className="ciclos-cycle-subtitle">
                La Tecnología del Ser: Soberanía Celular &amp; Reestructuración Somática
              </p>
            </div>
            <div className="ciclos-cycle-ovals">
              <ProcesosOvalBox className="ciclos-oval-left">
                <strong>Enfoque:</strong> Formación y Reestructuración Somática, Biológica y Transgeneracional.
                <br /><br />
                <strong>Duración:</strong> 7 a 8 Meses (El tiempo biológico necesario para reeducar la fascia, los hábitos y la memoria celular).
                <br /><br />
                <strong>Tecnologías:</strong> Los 5 Pilares Da Luz: Fitoterapia Clínica, Anatomía de la Fascia, Psicomagia Subconsciente, Resonancia Sensorial y Vaciado Nervioso.
                <br /><br />
                <strong>Para qué sirve:</strong> Es una intervención profunda en tu biografía para desarmar el piloto automático y reeducar tu organismo. No busca alivios pasajeros, sino una transformación estructural en tu terreno: limpiar filtros físicos, liberar la memoria del estrés retenida en el tejido conectivo y desmantelar los mandatos automáticos que sostienen el malestar.
              </ProcesosOvalBox>
              <ProcesosOvalBox className="ciclos-oval-right">
                <strong>Ideal para:</strong> Cualquier persona que habite un cuerpo biológico y comprenda que la salud requiere depurar sus órganos y ordenar su química interna. Para quienes buscan reconocer y honrar a sus ancestros, pero con la soberanía suficiente para cortar las lealtades invisibles y los patrones de dolor o escasez que ya no eligen perpetuar.
                <br /><br />
                <strong>El Recorrido (Matriz de Estaciones):</strong> El Vacío, Raíces e Intestino, Hígado y Fuego, Centro Creativo &amp; Pelvis, El Puente del Corazón, La Voz Laríngea, hasta anclar en la glándula pineal y la integración de tu autogestión.
                <br /><br />
                <strong>Formatos de participación:</strong> Modalidad Autogestión: acceso completo, clases grabadas, bitácoras clínicas y audios de integración somática. Modalidad Mentoría 1:1: programa completo + sesiones mensuales individuales de 90 min con Guadalupe + canal de soporte prioritario. Ambas disponibles en versión 100% Digital o sumando el Botiquín Alquímico Físico con fórmulas botánicas vivas.
              </ProcesosOvalBox>
            </div>
            <div className="ciclos-cycle-cta">
              <Link href="#" className="procesos-btn-cream ciclos-detail-link">
                VER DETALLES Y FORMATOS DE GÉNESIS
              </Link>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
