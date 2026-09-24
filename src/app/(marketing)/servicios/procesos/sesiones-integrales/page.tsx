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
            <h1 className="sesiones-page-title">SESIONES INTEGRALES</h1>
          </div>
        </section>

        {/* 2. Introducción */}
        <section className="sesiones-intro">
          <p className="sesiones-intro-block sesiones-intro-left">
            Encuentros 1:1 para mapear, regular y transformar tu terreno biológico, emocional y somático.
          </p>
          <p className="sesiones-intro-block sesiones-intro-right">
            ¿Qué sesión integral necesita hoy tu proceso?
            <br />
            Tu cuerpo es un mapa; elegí la ruta para tu equilibrio.
          </p>
        </section>

        {/* 3. Grilla de sesiones */}
        <section className="sesiones-grid">
          {/* Columna 1: SESIÓN UMBRAL */}
          <article className="sesiones-card">
            <h2 className="sesiones-card-title">SESIÓN UMBRAL</h2>
            <div className="sesiones-card-body">
              <div className="sesiones-card-summary">
              <p><strong>Abordaje:</strong> Mapeo de Terreno, Diagnóstico Somático &amp; Asesoría Botánica a Medida.</p>
              <p><strong>Modalidad:</strong> Online (Zoom) o Presencial | <strong>Duración:</strong> 60 minutos.</p>
              <p><strong>Tecnologías:</strong> Escaneo Biológico y Circadiano, Radiestesia de Terreno, Fitoterapia Aplicada y Mapeo Emocional.</p>
              </div>
              <div className="sesiones-card-details">
              <p><strong>Para qué sirve:</strong> Es tu brújula de entrada. No se puede sanar a ciegas ni tapar desregulaciones comprando productos o terapias al azar. En esta sesión escaneamos tu terreno biológico, tus hábitos y tu nivel de sobrecarga para ordenar tu botiquín diario y trazar tu ruta de tratamiento exacta.</p>
              <p><strong>Ideal para:</strong> Quienes no saben por dónde empezar en el universo Da Luz, quieren saber qué alquimias botánicas necesita su piel/organismo hoy, o buscan diagnosticar la causa raíz de un síntoma recurrente antes de comprometerse con un proceso extenso.</p>
              <p><strong>Tu experiencia:</strong> Una consulta 1:1 profunda donde cruzamos el estado de tu barrera cutánea, tu digestión, tu calidad de descanso y tu clima emocional para despejar la niebla mental y encontrar el foco prioritario.</p>
              <p><strong>Te llevás:</strong> Tu Hoja de Ruta Personalizada con tu prescripción de Botica Viva (fórmulas exactas de día y noche) + recomendación clínica de tu siguiente paso terapéutico + 1 micropráctica somática de regulación.</p>
              </div>
            </div>
            <div className="sesiones-card-cta">
              <Link href="#" className="procesos-btn-blue">
                VER DETALLES DE SESIÓN UMBRAL Y RESERVAR
              </Link>
            </div>
          </article>

          {/* Columna 2: PAUSA VITAL */}
          <article className="sesiones-card">
            <h2 className="sesiones-card-title">PAUSA VITAL</h2>
            <div className="sesiones-card-body">
              <div className="sesiones-card-summary">
              <p><strong>Abordaje:</strong> Reseteo Somático &amp; Regulación Parasimpática en Camilla.</p>
              <p><strong>Modalidad:</strong> Exclusivamente Presencial | <strong>Duración:</strong> 75 minutos.</p>
              <p><strong>Tecnologías:</strong> Sonoterapia (Cuencos Tibetanos), Reiki Usui, Aromaterapia Límbica y Gemoterapia.</p>
              </div>
              <div className="sesiones-card-details">
              <p><strong>Para qué sirve:</strong> Desactivar el circuito crónico de supervivencia (cortisol alto, alerta mental y fatiga) sin pedirle a tu cabeza que analice nada. Es recepción y descanso puro para tu sistema nervioso autónomo.</p>
              <p><strong>Ideal para:</strong> Bruxismo, insomnio, contracturas persistentes en espalda y cuello, o agotamiento por hipercontrol y sobreexigencia.</p>
              <p><strong>Tu experiencia:</strong> 75 minutos de inmersión estática en camilla combinando frecuencias sonoras (ondas Alfa y Theta) y moléculas botánicas que le indican a tu biología que estás a salvo.</p>
              <p><strong>Te llevás:</strong> Tu Elixir Aromático Ritual en mano para anclar este estado de calma en tu casa. Sin tareas para el hogar, sin esfuerzo cognitivo.</p>
              </div>
            </div>
            <div className="sesiones-card-cta">
              <Link href="#" className="procesos-btn-blue">
                VER DETALLES DE PAUSA VITAL Y RESERVAR
              </Link>
            </div>
          </article>

          {/* Columna 3: ALQUIMIA CHAMÁNICA & ACCIÓN */}
          <article className="sesiones-card">
            <h2 className="sesiones-card-title">ALQUIMIA CHAMÁNICA &amp; ACCIÓN</h2>
            <div className="sesiones-card-body">
              <div className="sesiones-card-summary">
              <p><strong>Abordaje:</strong> Diagnóstico Subconsciente, Desbloqueo Fascial y Reprogramación en la Materia.</p>
              <p><strong>Modalidad:</strong> Presencial u Online (Zoom) | <strong>Duración:</strong> 75 a 90 minutos.</p>
              <p><strong>Tecnologías:</strong> Péndulo Evolutivo (Radiestesia), Inmersión con Tambor Chamánico (7.5 Hz), Liberación Somática y Fitoterapia Viva.</p>
              </div>
              <div className="sesiones-card-details">
              <p><strong>Para qué sirve:</strong> Romper la parálisis por análisis. Podés tener tu problema perfectamente entendido a nivel racional, pero si tu cuerpo sigue contraído y tu mente repite el mismo bucle, pensar más no va a resolverlo. Venimos a intervenir la raíz donde la energía y la biología se estancaron.</p>
              <p><strong>Ideal para:</strong> Quienes se sienten trabadas en patrones repetitivos, sostienen lealtades familiares inconscientes, o acumulan bronca/ansiedad que no logran metabolizar en el cotidiano.</p>
              <p><strong>Tu experiencia:</strong> Escaneo radiestésico para identificar el origen del bloqueo (individual, sistémico o ambiental), viaje sonoro rítmico para apagar el censor mental, y dinámicas activas de descarga corporal.</p>
              <p><strong>Te llevás:</strong> Tu Medicina Viva formulada a medida (Gotero de Flores de Bach o Microdosis Botánica) + Plan de acción somático de 7 a 14 días (y Track MP3 de integración para modalidad online).</p>
              </div>
            </div>
            <div className="sesiones-card-cta">
              <Link href="#" className="procesos-btn-blue">
                VER DETALLES DE ALQUIMIA CHAMÁNICA Y RESERVAR
              </Link>
            </div>
          </article>
        </section>

      </div>
    </div>
  );
}
