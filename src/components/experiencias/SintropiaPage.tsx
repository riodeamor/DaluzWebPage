import Link from "next/link";

const INGRESO_URL = "https://wa.me/5493512344580?text=Hola%2C%20quiero%20ingresar%20a%20SINTROP%C3%8DA";

const centers = [
  { title: "Raíz y Plexo", subtitle: "Suelo y Mando", text: "Para salir de la parálisis y la reactividad emocional. Si no tenés suelo biológico firme, no tenés capacidad de decidir." },
  { title: "Sacro y Corazón", subtitle: "Goce y Apertura", text: "Para que el Goce deje de ser un lujo postergado y pase a ser tu estado biológico de base. Limpiamos las aguas internas para que la vitalidad circule y el pecho se abra sin miedo." },
  { title: "Ajna", subtitle: "Claridad de Visión", text: "Para bajar de la nube de pensamientos circulares y ver con nitidez qué está pasando en tu vida. Menos ruido, más realidad." },
];

const stages = [
  { days: "Días 1 a 7", organ: "INTESTINO", axis: "El Suelo", text: "Limpiar la base: Si el intestino está inflamado, el cerebro vive en pánico. Descongestionamos el terreno para que la información fluya sin toxicidad." },
  { days: "Días 8 a 14", organ: "HÍGADO", axis: "El Motor", text: "Despejar el laboratorio: Transmutar la impotencia en voluntad firme. Depuración del filtro de la bronca para pasar de la reacción a la acción lúcida." },
  { days: "Días 15 a 21", organ: "RIÑONES", axis: "Las Aguas", text: "Filtrar el miedo: Salir del modo supervivencia. Drenamos el estancamiento renal para recuperar la adaptabilidad, la fluidez y el deseo." },
  { days: "Días 22 a 28", organ: "SANGRE", axis: "La Verdad", text: "Saturar el sistema: El momento donde tu nueva decisión se vuelve tejido. Oxigenamos la sangre para que tu nueva verdad celular llegue a cada rincón." },
  { days: "Días 29 a 33", organ: "SISTEMA NERVIOSO", axis: "El Dulce", text: "Bajar el voltaje: Entrenamos al envase para que el Goce sea su estado natural. Aprender a pausar, descansar y registrar el bienestar sin culpa." },
];

const vault = [
  { title: "Ebook Interactivo «SINTROPÍA»", text: "Tu guía de ruta paso a paso con diagnósticos biográficos, preguntas de acecho y ejercicios de escritura catártica." },
  { title: "Protocolo SODA", text: "Estrategia somática de 4 pasos (Suspendo – Observo – Decido – Actúo) para desactivar picos de estrés y ansiedad en tiempo real." },
  { title: "Videos Técnicos de Regulación", text: "Guías visuales breves de Respiración Canudo y Humming (vibración faríngea) para resetear el tono vagal en minutos." },
  { title: "Audios de Acecho", text: "Meditaciones de intervención rápida («Suelo Sagrado» y «Sentir el Pulso») para calmar el barullo mental en tu día a día." },
  { title: "El Puente Botánico", text: "Pautas de fitoterapia viva y microdosis amargas para acompañar químicamente cada etapa de drenaje." },
];

export default function SintropiaPage() {
  return (
    <div className="experience-page experience-page--ecosystem">
      <header className="experience-hero">
        <div className="experience-hero__inner">
          <p className="experience-eyebrow">Intervención de 33 días · Da Luz Consciente</p>
          <h1>SINTROPÍA: <span>El Arte de Habitarte</span></h1>
          <p className="experience-hero__lead">Recalibración Somática en 33 Días.</p>
          <p className="experience-hero__anchor">“Tu mente te miente porque tu biología tiene miedo.”</p>
          <p className="experience-hero__description">No podés ser soberana de un territorio que no sabés ocupar. Una intervención técnica de 33 días para limpiar tus filtros de eliminación, apagar la señal de alarma del sistema nervioso y recuperar el comando de tu cuerpo.</p>
          <div className="experience-actions"><a className="experience-cta" href={INGRESO_URL} target="_blank" rel="noopener noreferrer">Reclamar mi soberanía</a></div>
        </div>
      </header>

      <section className="experience-band" id="manifiesto" aria-labelledby="sintropia-manifiesto">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">El Manifiesto</span><h2 id="sintropia-manifiesto">Del Caos al Orden Real</h2></div>
          <div className="experience-panel experience-intro">
            <p>La mayoría de las veces buscamos respuestas en la meditación o en recetas mágicas porque nos da pánico mirar nuestra realidad. Pero el problema no es tu &ldquo;falta de voluntad&rdquo; ni tu &ldquo;falta de paz&rdquo;: es tu saturación biológica.</p>
            <p>Cuando tus filtros (hígado, intestinos, riñones) están congestionados, tu sistema nervioso vive en un estado de emergencia química constante. SINTROPÍA no es para que &ldquo;flotes&rdquo;; es para que recablees tu respuesta al estrés.</p>
            <p>Pasamos de la Entropía (fuga de energía, inflamación y ruido mental) a la Sintropía (la capacidad biológica innata del cuerpo para auto-organizarse, repararse y sostener el orden).</p>
          </div>
          <p className="experience-manifesto-quote">“Este proceso no viene a salvarte; te entrega la tecnología para que vos decidas renacer.”</p>
          <p className="experience-golden-rule"><strong>Regla de Oro:</strong> Si empieza con PUEDO... es por ahí. Si empieza con TENGO QUE... no es por ahí.</p>
        </div>
      </section>

      <section className="experience-band experience-band--light" id="centros" aria-labelledby="sintropia-centros">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">La Tecnología de los Centros</span><h2 id="sintropia-centros">Sin vueltas</h2><p>Abordamos tu energía como quien calibra un instrumento de alta precisión. No espiritualizamos; operamos sobre la fisiología:</p></div>
          <div className="experience-grid experience-grid--three">{centers.map((center) => <article className="experience-card" key={center.title}><span className="experience-card__label">{center.subtitle}</span><h3>{center.title}</h3><span className="experience-card__line" /><p>{center.text}</p></article>)}</div>
        </div>
      </section>

      <section className="experience-band experience-band--light" id="etapas" aria-labelledby="sintropia-etapas">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">La Ruta de los 33 Días</span><h2 id="sintropia-etapas">Las 5 Etapas de Depuración</h2></div>
          <div className="experience-grid experience-grid--three">{stages.map((stage, index) => <article className="experience-card" key={stage.days}><span className="experience-card__label">Etapa {index + 1} · {stage.days}</span><h3>{stage.organ} <span className="experience-card__title-detail">({stage.axis})</span></h3><span className="experience-card__line" /><p>{stage.text}</p></article>)}</div>
        </div>
      </section>

      <section className="experience-band" id="boveda" aria-labelledby="sintropia-boveda">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">Lo que recibís al ingresar</span><h2 id="sintropia-boveda">La Bóveda Alquímica</h2></div>
          <div className="experience-panel experience-intro"><ul>{vault.map((item) => <li key={item.title}><strong>{item.title}:</strong> {item.text}</li>)}</ul></div>
        </div>
      </section>

      <section className="experience-band" id="bio-filtro" aria-labelledby="sintropia-filtro">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">Tu punto de partida</span><h2 id="sintropia-filtro">El Bio-Filtro: ¿Es para vos?</h2></div>
          <div className="experience-grid">
            <article className="experience-panel"><h3>Este viaje es para vos si</h3><ul><li>Vivís con cansancio crónico, digestión pesada o la mente acelerada en bucle.</li><li>Estás harta de parches temporales y buscás herramientas somáticas y biológicas concretas.</li><li>Querés que la calma y el goce sean un hecho fisiológico y no una frase hecha de redes.</li></ul></article>
            <article className="experience-panel experience-panel--dark"><h3>No es para vos si</h3><ul><li>Buscás una píldora mágica que resuelva tu vida sin tu presencia ni compromiso diario.</li><li>Preferís permanecer en la queja antes que asumir la responsabilidad de tu propia energía.</li></ul></article>
          </div>
        </div>
      </section>

      <section className="experience-band experience-band--light" id="continuidad" aria-labelledby="sintropia-continuidad">
        <div className="experience-wrap experience-closing">
          <div className="experience-section-heading"><span className="experience-section-kicker">Evolución continua</span><h2 id="sintropia-continuidad">El Puente hacia GÉNESIS</h2><p>SINTROPÍA es el reseteo: la desinflamación y el orden indispensables para que puedas volver a escucharte.</p><p>Al completar tus 33 días, si sentís que estás lista para una transformación estructural profunda de tu biografía, tenés un 11% de descuento extra para postularte e ingresar al portal de GÉNESIS: La Tecnología del Ser (8 Meses).</p></div>
          <p className="experience-closing__statement">Reclamá tu territorio biológico. Dejá de operar desde la emergencia y volvé a habitar tu diseño original.</p>
          <div className="experience-actions"><a className="experience-cta" href={INGRESO_URL} target="_blank" rel="noopener noreferrer">Quiero ingresar a SINTROPÍA</a><Link className="experience-cta experience-cta--light" href="/programa-transformacion">Explorar GÉNESIS</Link></div>
        </div>
      </section>
    </div>
  );
}
