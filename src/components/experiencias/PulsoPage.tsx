const PULSO_CONTACT_URL =
  "https://wa.me/5493512344580?text=Hola%2C%20quiero%20unirme%20a%20El%20Pulso%20de%20Da%20Luz";

const motor = [
  { title: "La Frecuencia", text: "Audio de calibración (11 minutos) para centrar el sistema nervioso." },
  { title: "Práctica & Teoría", text: "Video breve con pautas somáticas para liberar la fascia y regular la energía." },
  { title: "Bitácora de Registro", text: "Guía en PDF con claves biológicas, ejercicios cotidianos y planilla de seguimiento físico-emocional." },
  { title: "Alquimia del Mes", text: "Un producto insignia de la botica seleccionado con 22% OFF exclusivo para socias activas." },
];

const levels = [
  {
    title: "Sintonía",
    months: "Meses 1 a 5",
    benefits: [
      "1 Envío Gratis + Regalo Alquímico en 1ra compra mensual.",
      "Masterclass de Bienvenida + Lunario Mensual.",
      "22% OFF en Alquimia del Mes, 11% OFF en Botica (excepto Kits), 15% OFF en Sesiones y en GÉNESIS.",
      "Ventana de sostén de 33 días post-pago y acceso a contenidos por 66 días.",
    ],
  },
  {
    title: "Maestría",
    months: "Meses 6 a 10",
    benefits: [
      "1 Envío Gratis + Regalo Alquímico.",
      "1 Masterclass Temática de regalo a elección.",
      "22% OFF en Alquimia del Mes, 15% OFF en Botica, 20% OFF en Sesiones, 22% OFF en GÉNESIS (o postulación a Beca del 45%).",
      "Acceso permanente a los contenidos ya vividos.",
    ],
  },
  {
    title: "Arquitecta Vitalicia",
    months: "Mes 11 en adelante",
    benefits: [
      "1 Envío Gratis + Regalo Alquímico + Bitácora Física a domicilio.",
      "Acceso ilimitado al archivo histórico completo.",
      "22% OFF en Alquimia del Mes, 20% OFF en Botica + 5% OFF en Kits, 20% OFF en Sesiones, 30% OFF en GÉNESIS (o beca del 60%).",
      "Biblioteca acumulada de por vida.",
    ],
  },
];

export default function PulsoPage() {
  return (
    <div className="experience-page">
      <header className="experience-hero">
        <div className="experience-hero__inner">
          <p className="experience-eyebrow">Membresía mensual · Da Luz Consciente</p>
          <h1>EL PULSO <span>| Membresía Mensual Da Luz Consciente</span></h1>
          <p className="experience-hero__lead">Tu mantenimiento de soberanía: el goteo constante de coherencia.</p>
          <div className="experience-actions"><a className="experience-cta" href={PULSO_CONTACT_URL} target="_blank" rel="noopener noreferrer">Unirme al Pulso</a></div>
        </div>
      </header>

      <section className="experience-band" id="proposito">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">Cabecera & Propósito</span><h2>La frecuencia que se sostiene</h2></div>
          <div className="experience-panel experience-intro">
            <p>La salud no es un destino al que se llega de una vez y para siempre; es una frecuencia cotidiana que se cuida y se sintoniza. Una vez que despertás a tu sabiduría biológica, el desafío real es no volver a caer en la inercia del ruido cotidiano. EL PULSO es el espacio creado para sostener tu eje mes a mes: con el cuerpo asistido, la mente despejada y la comunidad en sintonía.</p>
          </div>
        </div>
      </section>

      <section className="experience-band experience-band--light" id="motor">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">Cada mes</span><h2>El Motor Mensual de Sintonía</h2></div>
          <div className="experience-grid experience-grid--four">
            {motor.map((item, index) => <article className={`experience-card ${index % 2 ? "experience-card--light" : ""}`} key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="experience-band" id="regla-de-oro">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">Permanencia libre</span><h2>La Regla de Oro Acumulativa</h2></div>
          <div className="experience-panel experience-intro">
            <p>En Da Luz premiamos tu perseverancia, no la velocidad. Tu nivel se define por la cantidad total de meses abonados acumulados, sin importar si en el camino pausaste la suscripción. Tu historial nunca se pierde; se construye.</p>
          </div>
        </div>
      </section>

      <section className="experience-band experience-band--light" id="niveles">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">Tu recorrido</span><h2>Los 3 Niveles de la Membresía</h2></div>
          <div className="experience-grid experience-grid--three">
            {levels.map((level, index) => <article className={`experience-card ${index === 1 ? "experience-card--light" : ""}`} key={level.title}><span className="experience-card__label">Nivel {index + 1} · {level.months}</span><h3>{level.title}</h3><ul>{level.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}</ul></article>)}
          </div>
          <div className="experience-panel experience-intro" style={{ marginTop: "clamp(2rem, 4vw, 3rem)" }}>
            <h3>Beneficio Legado · Mes 12</h3>
            <p>Reconocimiento permanente del 15% OFF de por vida en toda la botica, incluso si pausás la suscripción.</p>
          </div>
        </div>
      </section>

      <section className="experience-band" id="unirme">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">Sostené tu eje</span><h2>Iniciá tu mantenimiento de soberanía</h2><p>El ritmo es tuyo. Tu recorrido se construye mes a mes.</p></div>
          <div className="experience-actions"><a className="experience-cta experience-cta--light" href={PULSO_CONTACT_URL} target="_blank" rel="noopener noreferrer">Unirme al Pulso</a></div>
        </div>
      </section>
    </div>
  );
}
