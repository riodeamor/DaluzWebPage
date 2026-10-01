import Link from "next/link";

const WHATSAPP_URL = "https://wa.me/5493512344580?text=Hola%2C%20quiero%20orientaci%C3%B3n%20sobre%20las%20experiencias%20Da%20Luz";

const compass = [
  { question: "¿Sentís saturación mental y necesitás apagar la alarma del estrés?", answer: "Tu puerta es SINTROPÍA (33 Días)", href: "/sintropia" },
  { question: "¿Buscás una mutación estructural de raíz y recambio celular completo?", answer: "Tu camino es GÉNESIS (8 Meses)", href: "/programa-transformacion" },
  { question: "¿Querés un acompañamiento rítmico, comunidad y descuentos en botica?", answer: "Tu espacio es EL PULSO (Membresía Mensual)", href: "/membresia" },
];

const doors = [
  { label: "33 Días", title: "SINTROPÍA | Recalibración Biográfica", description: "Intervención intensiva para descongestionar tus 3 filtros biológicos y pasar del ruido mental al orden funcional.", action: "Conocer Sintropía →", href: "/sintropia" },
  { label: "8 Meses", title: "GÉNESIS | La Tecnología del Ser", description: "Nuestro viaje insignia de reestructuración profunda al ritmo del recambio celular (Factor 888) para graduarte como la arquitecta de tu biología.", action: "Explorar Génesis →", href: "/programa-transformacion" },
  { label: "Membresía Mensual", title: "EL PULSO | Membresía Mensual", description: "Tu mantenimiento rítmico de soberanía: sintonización de tu eje biológico mes a mes, contenidos vivos y beneficios exclusivos en botica.", action: "Ingresar al Pulso →", href: "/membresia" },
];

export default function ExperienciasPage() {
  return (
    <div className="experience-page experience-page--ecosystem">
      <header className="experience-hero">
        <div className="experience-hero__inner">
          <p className="experience-eyebrow">Da Luz Consciente · Caminos de transformación</p>
          <h1>EXPERIENCIAS DA LUZ</h1>
          <p className="experience-hero__lead">Caminos vivos para habitar la soberanía de tu cuerpo y tu energía.</p>
        </div>
      </header>

      <section className="experience-band" aria-labelledby="experiencias-manifiesto">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">El punto de partida</span><h2 id="experiencias-manifiesto">Intervenciones sobre la materia viva</h2></div>
          <div className="experience-panel experience-intro"><p>En Da Luz no ofrecemos cursos teóricos para llenar la mente de conceptos. Diseñamos intervenciones sobre la materia viva: desinflamar el terreno, regular el sistema nervioso y desarmar los patrones de estrés que traban tu vitalidad. Elegí la puerta de entrada según la profundidad que tu biología pide hoy.</p></div>
        </div>
      </section>

      <section className="experience-band experience-band--light" aria-labelledby="experiencias-brujula">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">La Brújula</span><h2 id="experiencias-brujula">¿Cuál es tu momento hoy?</h2></div>
          <div className="experience-grid">
            {compass.map((item) => (
              <article className="experience-panel experience-compass" key={item.answer}>
                <h3>{item.question}</h3>
                <Link href={item.href} className="experience-compass__answer">{item.answer} <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="experience-band experience-band--light" aria-labelledby="experiencias-caminos">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">Elegí tu puerta</span><h2 id="experiencias-caminos">Tres caminos, tu propio ritmo</h2></div>
          <div className="experience-grid experience-grid--three">
            {doors.map((door) => (
              <article className="experience-card experience-door" key={door.href}>
                <span className="experience-card__label">{door.label}</span>
                <h3>{door.title}</h3>
                <span className="experience-card__line" />
                <p>{door.description}</p>
                <Link className="experience-cta experience-cta--light experience-door__action" href={door.href}>{door.action}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="experience-band" aria-labelledby="experiencias-asesoramiento">
        <div className="experience-wrap experience-closing">
          <div className="experience-section-heading"><span className="experience-section-kicker">Acompañamiento</span><h2 id="experiencias-asesoramiento">Encontrá tu punto de partida</h2><p>¿Dudas sobre cuál es tu punto de partida? Escribinos y te orientamos de forma personalizada.</p></div>
          <div className="experience-actions"><a className="experience-cta experience-cta--light" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></div>
        </div>
      </section>
    </div>
  );
}
