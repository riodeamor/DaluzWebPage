import { Metadata } from 'next';
import Link from 'next/link';
import { ProcesosBackground } from '@/components/svg/ProcesosPageComponents';
import '../procesos-pages.css';
import './sesiones.css';

const PROCESOS_WRAPPER = 'procesos-pages';

export const metadata: Metadata = {
  title: 'Sesiones Integrales | DA LUZ CONSCIENTE',
  description:
    'Encuentros de alta potencia: Pausa Vital, Reprogramación Consciente y Visión y Presencia. Reiki, Chamanismo, Cuencos Sonoros y más.',
  openGraph: {
    title: 'Sesiones Integrales - DA LUZ CONSCIENTE',
    description:
      'Pausa Vital, Reprogramación Consciente y Visión y Presencia. Claridad y armonía para tu energía.',
    type: 'website',
  },
};

export default function SesionesIntegralesPage() {
  return (
    <div className={PROCESOS_WRAPPER}>
      <div className="procesos-page-container">
        <ProcesosBackground variant="general" />

        {/* 1. Cabecera */}
        <section className="sesiones-header-band">
          <div className="sesiones-header-band-inner">
            <h1 className="sesiones-page-title">Sesiones Integrales: El Arte de la Bio-Individualidad</h1>
          </div>
        </section>

        {/* 2. Introducción */}
        <section className="sesiones-intro">
          <p className="sesiones-intro-block sesiones-intro-left">
            Espacios individuales de mapeo de terreno, descompresión del sistema simpático y cirugía vibracional. Ideales para obtener un GPS claro de tu estado biológico actual, resetear el estrés retenido en la fascia y formular tu botiquín personalizado.
          </p>
          <p className="sesiones-intro-block sesiones-intro-right">
            Tres portales diseñados para escuchar las señales del cuerpo, vaciarte de la sobrecarga electromagnética y retomar el comando de tu propia vida.
          </p>
        </section>

        {/* 3. Grilla de sesiones */}
        <section className="sesiones-grid">
          {/* Columna 1: SESIÓN UMBRAL */}
          <article className="sesiones-card">
            <h2 className="sesiones-card-title">SESIÓN UMBRAL</h2>
            <div className="sesiones-card-body">
              <div className="sesiones-card-summary">
              <p><strong>Sesión Umbral:</strong> Mapeo de Terreno &amp; Asesoría Botánica.</p>
              <p><strong>La puerta de entrada:</strong> Tu GPS biológico y frecuencial (60 min — Virtual o Presencial).</p>
              <p><strong>Tecnologías:</strong> Escaneo Biológico y Circadiano, Radiestesia de Terreno, Fitoterapia Aplicada y Mapeo Emocional.</p>
              </div>
              <div className="sesiones-card-details">
              <p><strong>Para qué sirve:</strong> Comprar alquimias o iniciar protocolos a ciegas es poner parches superficiales sobre un terreno que pide ser comprendido. En la Sesión Umbral escaneamos la salud de tu barrera cutánea, el eje digestivo y el tono neurovegetativo basal para estructurar un Botiquín Soberano con precisión milimétrica y definir la hoja de ruta que tu cuerpo realmente necesita.</p>
              <p><strong>Ideal para:</strong> Quienes no saben por dónde empezar en el universo Da Luz, quieren saber qué alquimias botánicas necesita su piel u organismo hoy, o buscan comprender la causa raíz de una señal recurrente antes de comprometerse con un proceso extenso.</p>
              <p><strong>Tu experiencia:</strong> Triage Biológico: Análisis de la carga inflamatoria, la permeabilidad y la calidad del descanso. Lectura Frecuencial: Identificación del elemento dominante y las polaridades activas en tu presente.</p>
              <p><strong>Te llevás:</strong> Tu Hoja de Ruta Personalizada y una Prescripción Galénica: Selección exacta de fitoactivos, tinturas y microprácticas somáticas a medida.</p>
              </div>
            </div>
            <div className="sesiones-card-cta">
              <Link href="#" className="procesos-btn-blue">
                RESERVAR SESIÓN UMBRAL
              </Link>
            </div>
          </article>

          {/* Columna 2: PAUSA VITAL */}
          <article className="sesiones-card">
            <h2 className="sesiones-card-title">PAUSA VITAL</h2>
            <div className="sesiones-card-body">
              <div className="sesiones-card-summary">
              <p><strong>Pausa Vital:</strong> Reseteo Somático &amp; Regulación Vibracional.</p>
              <p>Rendición sensorial y desactivación del sistema simpático (75 min — Exclusivamente en Camilla).</p>
              <p><strong>Tecnologías:</strong> Sonoterapia (Cuencos Tibetanos), Reiki Usui, Aromaterapia Límbica y Gemoterapia.</p>
              </div>
              <div className="sesiones-card-details">
              <p><strong>Para qué sirve:</strong> El organismo no regenera en hiperalerta. Pausa Vital es una experiencia de descanso celular profundo donde no venís a analizar mentalmente, ni a hablar de heridas, ni a rendir cuentas: venís a que el sonido puro de cuencos en frecuencias Alfa/Theta, el Reiki Usui y la botica aromática le recuerden a tus células que ya estás a salvo.</p>
              <p><strong>Tu experiencia:</strong> Sahumado de Apertura: Limpieza áurica con resinas botánicas puras y registro del peso corporal. Inmersión Sonora &amp; Gemoterapia: Aplicación de cuencos sobre meridianos y cuarzos maestros en puntos de pulso. Anclaje Neuroasociativo: Entrega de un elixir ritual personalizado para evocar la calma en tu día a día.</p>
              <p><strong>Te llevás:</strong> Tu Elixir Aromático Ritual para anclar este estado de calma en casa. Sin tareas para el hogar, sin esfuerzo cognitivo.</p>
              </div>
            </div>
            <div className="sesiones-card-cta">
              <Link href="#" className="procesos-btn-blue">
                RESERVAR MI PAUSA VITAL
              </Link>
            </div>
          </article>

          {/* Columna 3: ALQUIMIA CHAMÁNICA & ACCIÓN */}
          <article className="sesiones-card">
            <h2 className="sesiones-card-title">ALQUIMIA CHAMÁNICA &amp; ACCIÓN</h2>
            <div className="sesiones-card-body">
              <div className="sesiones-card-summary">
              <p><strong>Alquimia Chamánica &amp; Acción:</strong> Diagnóstico Subconsciente &amp; Reprogramación.</p>
              <p>Intervención activa sobre la memoria celular y la fascia (75 a 90 min — Virtual o Presencial).</p>
              <p><strong>Tecnologías:</strong> Péndulo Evolutivo (Radiestesia), Inmersión con Tambor Chamánico (7.5 Hz), Liberación Somática y Fitoterapia Viva.</p>
              </div>
              <div className="sesiones-card-details">
              <p><strong>Para qué sirve:</strong> Podés pasar años entendiendo un bloqueo en la cabeza, pero si tu diafragma permanece contraído y el campo retiene lealtades arcaicas, la materia no se mueve. Esta sesión es una cirugía vibracional: rastreamos la raíz invisible del estancamiento, entramos en trance ligero con tambor para recuperar fuerza vital y bajamos al cuerpo un plan de acción concreto para que retomes el timón.</p>
              <p><strong>Ideal para:</strong> Quienes se sienten trabadas en patrones repetitivos, sostienen lealtades familiares inconscientes o acumulan bronca y ansiedad que no logran metabolizar en el cotidiano.</p>
              <p><strong>Tu experiencia:</strong> Diagnóstico Radiónico: Rastreo con péndulo evolutivo de lealtades, parásitos mentales e interferencias. Viaje de Tambor Chamánico (7.5 Hz): Inducción sonora a ondas Theta para disolver corazas en el tejido conectivo. Fórmula Magistral Viva: Formulación en vivo de tu gotero floral/botánico y prescripción de anclaje físico.</p>
              <p><strong>Te llevás:</strong> Tu Medicina Viva formulada a medida (gotero de Flores de Bach o microdosis botánica) + plan de acción somático de 7 a 14 días y track MP3 de integración para modalidad online.</p>
              </div>
            </div>
            <div className="sesiones-card-cta">
              <Link href="#" className="procesos-btn-blue">
                RESERVAR ALQUIMIA CHAMÁNICA
              </Link>
            </div>
          </article>
        </section>

      </div>
    </div>
  );
}
