import { Metadata } from 'next';
import Link from 'next/link';
import styles from './SesionesHub.module.css';
import { ProcesosBackground } from '@/components/svg/ProcesosPageComponents';
import '../procesos-pages.css';
import './sesiones.css';

const PROCESOS_WRAPPER = 'procesos-pages';

const canonical = 'https://www.daluzconsciente.com/servicios/procesos/sesiones-integrales';
const title = 'Sesiones Integrales 1:1 en Córdoba & Online | Da Luz Consciente';
const description = 'Espacios individuales de diagnóstico somático, regulación del sistema nervioso y alquimia vibracional. Mapeá tu terreno biológico y recuperá tu soberanía.';
const whatsapp = `https://wa.me/5493512344580?text=${encodeURIComponent('Hola Gala, quiero consultar mi caso y conocer qué Sesión Integral es afín a mi momento.')}`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: ['sesiones holísticas córdoba', 'regulación sistema nervioso', 'terapia somática individual', 'reiki y cuencos presencial', 'diagnóstico bioenergético'],
  alternates: { canonical },
  openGraph: { title, description, url: canonical, type: 'website', locale: 'es_AR' },
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


        <section className={styles.addition} aria-labelledby="dialogo-title">
          <h2 id="dialogo-title">Recuperá el Diálogo con tu Propio Templo</h2>
          <p><strong>Espacios individuales de escucha clínica, biofísica somática y medicina vibracional diseñados para desarmar la coraza del estrés, diagnosticar el terreno biológico y restaurar tu coherencia vital sin generar dependencia.</strong></p>
          <p><strong>Nos enseñaron a tratar el síntoma como un enemigo a silenciar con parches rápidos o discursos edulcorados de autoayuda. En Da Luz Consciente operamos bajo una certeza biológica: tu cuerpo no está roto; está respondiendo con absoluta precisión a los niveles de tensión, memorias y sobreexigencia a los que fue sometido. Aquí no venimos a decirte qué hacer ni a infantilizarte: sostenemos una estructura quirúrgica para que tu sistema nervioso recuerde que ya está a salvo.</strong></p>
        </section>
        <h2 className={styles.doorsHeading}>Tres Puertas de Entrada</h2>

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
              <p><strong>Estado:</strong> Te sentís desorientada con tus síntomas (piel, digestión, fatiga) o querés ingresar a la botica y programas sin comprar a ciegas.</p>
              <p><strong>Dinámica:</strong> Diagnóstico 360°, cruce astrológico y diseño de tu Botiquín Soberano.</p>
              <p><strong>Formato:</strong> 45 a 60 min · Online (Zoom) o Presencial.</p>
              </div>
              <div className="sesiones-card-details">
              <p><strong>Para qué sirve:</strong> Comprar alquimias o iniciar protocolos a ciegas es poner parches superficiales sobre un terreno que pide ser comprendido. En la Sesión Umbral escaneamos la salud de tu barrera cutánea, el eje digestivo y el tono neurovegetativo basal para estructurar un Botiquín Soberano con precisión milimétrica y definir la hoja de ruta que tu cuerpo realmente necesita.</p>
              <p><strong>Ideal para:</strong> Quienes no saben por dónde empezar en el universo Da Luz, quieren saber qué alquimias botánicas necesita su piel u organismo hoy, o buscan comprender la causa raíz de una señal recurrente antes de comprometerse con un proceso extenso.</p>
              <p><strong>Tu experiencia:</strong> Triage Biológico: Análisis de la carga inflamatoria, la permeabilidad y la calidad del descanso. Lectura Frecuencial: Identificación del elemento dominante y las polaridades activas en tu presente.</p>
              <p><strong>Te llevás:</strong> Tu Hoja de Ruta Personalizada y una Prescripción Galénica: Selección exacta de fitoactivos, tinturas y microprácticas somáticas a medida.</p>
              </div>
            </div>
            <div className="sesiones-card-cta">
              <Link href="/servicios/procesos/sesiones-integrales/sesion-umbral" className="procesos-btn-blue">EXPLORAR SESIÓN UMBRAL →</Link>
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
              <p><strong>Estado:</strong> Agotamiento crónico, rumiación mental incesante, bruxismo o corazas musculares.</p>
              <p><strong>Dinámica:</strong> Rendición pasiva en camilla. Reiki, cuencos tibetanos, aromaterapia y gemas. Cero exigencia mental, cero tareas obligatorias.</p>
              <p><strong>Formato:</strong> 75 min · Exclusivamente Presencial (Consultorio en Córdoba).</p>
              </div>
              <div className="sesiones-card-details">
              <p><strong>Para qué sirve:</strong> El organismo no regenera en hiperalerta. Pausa Vital es una experiencia de descanso celular profundo donde no venís a analizar mentalmente, ni a hablar de heridas, ni a rendir cuentas: venís a que el sonido puro de cuencos en frecuencias Alfa/Theta, el Reiki Usui y la botica aromática le recuerden a tus células que ya estás a salvo.</p>
              <p><strong>Tu experiencia:</strong> Sahumado de Apertura: Limpieza áurica con resinas botánicas puras y registro del peso corporal. Inmersión Sonora &amp; Gemoterapia: Aplicación de cuencos sobre meridianos y cuarzos maestros en puntos de pulso. Anclaje Neuroasociativo: Entrega de un elixir ritual personalizado para evocar la calma en tu día a día.</p>
              <p><strong>Te llevás:</strong> Tu Elixir Aromático Ritual para anclar este estado de calma en casa. Sin tareas para el hogar, sin esfuerzo cognitivo.</p>
              </div>
            </div>
            <div className="sesiones-card-cta">
              <Link href="/servicios/procesos/sesiones-integrales/pausa-vital" className="procesos-btn-blue">RESERVAR PAUSA VITAL →</Link>
            </div>
          </article>

          {/* Columna 3: ALQUIMIA CHAMÁNICA & ACCIÓN */}
          <article className="sesiones-card">
            <h2 className="sesiones-card-title">ALQUIMIA CHAMÁNICA &amp; ACCIÓN</h2><p className={styles.cardSubtitle}><strong>Desbloqueo Fisiológico &amp; Reprogramación</strong></p>
            <div className="sesiones-card-body">
              <div className="sesiones-card-summary">
              <p><strong>Alquimia Chamánica &amp; Acción:</strong> Diagnóstico Subconsciente &amp; Reprogramación.</p>
              <p>Intervención activa sobre la memoria celular y la fascia (75 a 90 min — Virtual o Presencial).</p>
              <p><strong>Tecnologías:</strong> Péndulo Evolutivo (Radiestesia), Inmersión con Tambor Chamánico (7.5 Hz), Liberación Somática y Fitoterapia Viva.</p>
              <p><strong>Estado:</strong> Parálisis por análisis, nudos emocionales ciegos, patrones repetitivos o fuga vital.</p>
              <p><strong>Dinámica:</strong> Intervención activa y quirúrgica con Péndulo Evolutivo, tambor chamánico (7.5 Hz), descarga somática y prescripción de Medicina Viva.</p>
              <p><strong>Formato:</strong> 75 a 90 min · Presencial u Online a todo el mundo.</p>
              </div>
              <div className="sesiones-card-details">
              <p><strong>Para qué sirve:</strong> Podés pasar años entendiendo un bloqueo en la cabeza, pero si tu diafragma permanece contraído y el campo retiene lealtades arcaicas, la materia no se mueve. Esta sesión es una cirugía vibracional: rastreamos la raíz invisible del estancamiento, entramos en trance ligero con tambor para recuperar fuerza vital y bajamos al cuerpo un plan de acción concreto para que retomes el timón.</p>
              <p><strong>Ideal para:</strong> Quienes se sienten trabadas en patrones repetitivos, sostienen lealtades familiares inconscientes o acumulan bronca y ansiedad que no logran metabolizar en el cotidiano.</p>
              <p><strong>Tu experiencia:</strong> Diagnóstico Radiónico: Rastreo con péndulo evolutivo de lealtades, parásitos mentales e interferencias. Viaje de Tambor Chamánico (7.5 Hz): Inducción sonora a ondas Theta para disolver corazas en el tejido conectivo. Fórmula Magistral Viva: Formulación en vivo de tu gotero floral/botánico y prescripción de anclaje físico.</p>
              <p><strong>Te llevás:</strong> Tu Medicina Viva formulada a medida (gotero de Flores de Bach o microdosis botánica) + plan de acción somático de 7 a 14 días y track MP3 de integración para modalidad online.</p>
              </div>
            </div>
            <div className="sesiones-card-cta">
              <Link href="/servicios/procesos/sesiones-integrales/alquimia-chamanica" className="procesos-btn-blue">ENTRAR A ALQUIMIA CHAMÁNICA →</Link>
            </div>
          </article>
        </section>

        <div className={styles.appendix}>
          <section aria-labelledby="comparacion-title">
            <h2 id="comparacion-title">Encontrá el espacio afín a tu momento</h2>
            <p><strong>Deslizá la tabla horizontalmente para comparar las tres sesiones.</strong></p>
            <div className={styles.tableScroll} role="region" aria-label="Comparativa de Sesiones Integrales" tabIndex={0}>
              <table><caption className={styles.caption}>Roles, modalidades y entregables de cada sesión</caption><thead><tr><th scope="col">Parámetro</th><th scope="col">Sesión Umbral</th><th scope="col">Pausa Vital</th><th scope="col">Alquimia Chamánica</th></tr></thead>
              <tbody><tr><th scope="row">Rol en el Ecosistema</th><td>Diagnóstico &amp; Brújula Inicial</td><td>Rendición Somática Pasiva</td><td>Intervención Activa &amp; Cirugía</td></tr>
<tr><th scope="row">Nivel de Acción</th><td>Verbal, Metacognitivo y Botánico</td><td>Reposo Total en Camilla</td><td>Corporal, Energético y Subconsciente</td></tr>
<tr><th scope="row">Tu Tarea en Sesión</th><td>Responder y Recibir tu Mapa</td><td>Apagar la mente y Recibir</td><td>Explorar la raíz y Mover el cuerpo</td></tr>
<tr><th scope="row">Modalidad</th><td>Presencial / Virtual</td><td>100% Presencial</td><td>Presencial / Virtual</td></tr>
<tr><th scope="row">Entregable</th><td>Receta de Botica + Ejercicio</td><td>Elixir Ritual + Playlist Sutil</td><td>Medicina Viva + Plan de 7-21 días</td></tr></tbody></table>
            </div>
          </section>
          <section aria-labelledby="faq-title"><h2 id="faq-title">Preguntas frecuentes</h2>
            <details><summary>¿Puedo tomar una sesión individual si nunca hice terapia holística?</summary><p>Totalmente. Cada abordaje parte de tu estado actual sin requerir conocimientos previos.</p></details>
            <details><summary>¿Qué diferencia hay entre estas sesiones y los programas largos como Sintropía o Génesis?</summary><p>Las sesiones integrales atienden una necesidad puntual o actúan como diagnóstico. Los programas largos (33 días a 8 meses) son recorridos de recambio biológico y metabólico estructural.</p></details>
          </section>
          <section className={styles.closing} aria-labelledby="contact-title"><h2 id="contact-title">¿Dudas sobre por dónde comenzar?</h2><p><strong>Escribinos directamente para que nuestro equipo escanee tu consulta y te indique la opción afín a tu momento.</strong></p><Link href={whatsapp} className={styles.button}>CONSULTAR MI CASO VÍA WHATSAPP →</Link></section>
        </div>

      </div>
    </div>
  );
}
