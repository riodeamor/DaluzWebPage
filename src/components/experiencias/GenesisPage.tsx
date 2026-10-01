const INSCRIPCION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeSoAkZu-gNpExCbs4JKg-0zaqO8JRU_kL3off0NHHPHSVylQ/viewform?usp=publish-editor";

const intervention = [
  { title: "Coherencia Biológica", text: "Despejamos los filtros físicos principales (intestino, hígado, riñones) mediante Alkimya Herbal viva, respetando el orden natural de la materia." },
  { title: "El Puente para la Mente", text: "Cápsulas teóricas y respaldo neurobiológico para que el intelecto comprenda, suelte el control y autorice la exploración de lo sutil." },
  { title: "Hackeo de la Resistencia", text: "Miramos al ego de frente para desarmar lealtades invisibles y convertirlo en un aliado al servicio de tu bienestar." },
];

const pillars = [
  { title: "Alkimya Herbal (Química)", text: "Protocolos fitoterapéuticos de precisión. El software vegetal que actualiza tu hardware orgánico." },
  { title: "Anatomía Sutil (Tejido)", text: "Liberación de la Fascia Viva mediante movimiento orgánico para que la energía sea un hecho biológico comprobable." },
  { title: "Conciencia & Acecho (Mente)", text: "Desprogramación del subconsciente para disolver pactos heredados. Tu palabra ordena tu materia." },
  { title: "Resonancia Sensorial (El cuerpo como antena)", text: "Voz, expresión y automasaje para activar centros dormidos de percepción." },
  { title: "Vaciado & Descenso (Silencio)", text: "Frecuencias sonoras y respiración consciente para disminuir el voltaje nervioso y habilitar la autorreparación celular." },
];

const timing = [
  { title: "Recableado Neuronal (66 a 254 días)", text: "El lapso que exige el sistema nervioso para desarmar la respuesta al trauma y automatizar un patrón nuevo." },
  { title: "Recambio Celular (120 días)", text: "La sangre se renueva cada 4 meses; transitamos dos ciclos completos (8 meses) para saturar tu fisiología con nueva información." },
  { title: "Plasticidad Fascial", text: "El tejido conectivo es maleable pero requiere tiempo. Ocho meses es el compás exacto para ablandar el envase de forma orgánica." },
];

const months = [
  { title: "El Vacío", axis: "Umbral / Punto Cero", quote: "Si tu mente no para, tu cuerpo no repara.", description: "Vaciado neuronal y salida del piloto automático.", plants: "Tónicas Amargas", practice: "Observación" },
  { title: "Cimientos y Raíces", axis: "Muladhara", quote: "Reconozco mi hogar: sanar el nido para habitar el mundo.", description: "Pertenencia vs. Estructura. Honrar lo nutricio de la herencia.", plants: "Plantas Intestinales", practice: "Enraizamiento" },
  { title: "Transmutación Activa", axis: "Manipura", quote: "De la reacción automática a la acción consciente.", description: "Fuerza propia sin necesidad de validación externa.", plants: "Drenadores Hepáticos", practice: "Soberanía" },
  { title: "Aguas Profundas", axis: "Swadhisthana", quote: "Transmutar la culpa en goce creativo.", description: "Habitar el deseo vital y la sensualidad sin pedir permiso.", plants: "Plantas Renales", practice: "Fluidez" },
  { title: "El Pulso de Apertura", axis: "Anahata", quote: "Yo soy en presencia con el otro.", description: "Entrega con discernimiento. Abrir el pecho para recibir sin deuda.", plants: "Soporte Circulatorio", practice: "Reciprocidad" },
  { title: "La Sagrada Voz", axis: "Vishuddha", quote: "Tu palabra ordena tu materia.", description: "Verdad Nítida vs. Mentira Funcional. Nombrar para crear realidad.", plants: "Balsámicas & Respiratorias", practice: "Claridad" },
  { title: "Claridad y Ecuanimidad", axis: "Ajna", quote: "Ya no busco afuera; ahora percibo adentro.", description: "Intuición certera vs. Duda paralizante.", plants: "Nervinas Suaves", practice: "Visión" },
  { title: "Conciencia de Integración", axis: "Sahasrara", quote: "El retorno a casa.", description: "Unidad donde biología y espíritu se reconocen como uno solo.", plants: "Elixires Maestros", practice: "Integridad" },
];

const vault = [
  "Cápsulas de Sincronía Bio-Arquetípica.",
  "Bitácoras de Acecho (escritura técnica).",
  "Laboratorio de Alkimya Somática (movimiento, respiración y sonido).",
  "Campo de Resonancia Grupal.",
  "Matriz de Anamnesis (lectura de tus propios biomarcadores).",
];

const routes = [
  { name: "Ruta A — Observadora", subtitle: "Ritmo Flexible", details: ["Acceso por 90 días a cada Eje adquirido.", "Soporte técnico vía WhatsApp.", "15% OFF en Sesiones 1:1 y 11% OFF en Botica."] },
  { name: "Ruta B — Alquimista", subtitle: "Compromiso Integral", details: ["Acceso vitalicio a la biblioteca y actualizaciones.", "Seguimiento de dudas con Gala vía WhatsApp.", "Asesoría personalizada + 20% OFF en Kit Botánico inicial.", "20% OFF en Sesiones y 15% OFF en Botica."] },
  { name: "Ruta C — Maestría", subtitle: "Acompañamiento Diamante — Cupos Limitados", details: ["Encuentro 1:1 de intervención directa con Gala cada 33 días.", "Hoja de ruta personalizada post-sesión.", "Elixir Maestro formulado a medida con envío sin cargo.", "20% OFF fijo en todos los productos durante los 8 meses."] },
];

export default function GenesisPage() {
  return (
    <div className="experience-page">
      <header className="experience-hero">
        <div className="experience-hero__inner">
          <p className="experience-eyebrow">Formación de 8 meses · Da Luz Consciente</p>
          <h1>GÉNESIS <span>| La Tecnología del Ser</span></h1>
          <p className="experience-hero__lead">Tu cuerpo como laboratorio sensitivo. Un viaje de 8 meses hacia la soberanía de tu propia biología.</p>
          <div className="experience-actions"><a className="experience-cta" href={INSCRIPCION_URL} target="_blank" rel="noopener noreferrer">Completar ficha de postulación</a></div>
        </div>
      </header>

      <section className="experience-band" id="manifiesto">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">El punto de partida</span><h2>Manifiesto</h2></div>
          <div className="experience-panel experience-intro">
            <p>Te mintieron: la paz no es un lugar al que se llega flotando; es una estructura que se construye en la fascia. No estamos acá para meditar sobre nubes, sino para limpiar los filtros biológicos, desinflamar el terreno y reclamar la soberanía del sistema nervioso. GÉNESIS es el acto de rebeldía más lúcido que existe: dejar de responder al miedo y a los mandatos de tu clan para empezar a responder al pulso de tu propio diseño. Tu envase es vasto y tu biología es sabia. Solo le estamos quitando el ruido.</p>
          </div>
        </div>
      </section>

      <section className="experience-band experience-band--light" id="intervencion">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">I · La Intervención</span><h2>Tu Cuerpo como Laboratorio Sensitivo</h2><p>GÉNESIS no es un curso para acumular teoría; es una intervención profunda en tu biografía para desaprender quién creés que sos. Acá la sabiduría no vuela: se encarna. Usamos la biología como mapa y el cuerpo como territorio. Si el tejido está rígido, la información no circula. Por eso ablandamos el envase para que la lucidez te atraviese. Al finalizar el ciclo, te llevás un Cofre de Herramientas propio: un arsenal de formulación botánica, registro somático y criterio autónomo para habitar tus días con autoridad.</p></div>
          <div className="experience-grid experience-grid--three">
            {intervention.map((item, index) => <article className={`experience-card ${index === 1 ? "experience-card--light" : ""}`} key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="experience-band" id="filosofia">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">II · La Filosofía</span><h2>De la Víctima a la Arquitecta</h2></div>
          <div className="experience-grid">
            <article className="experience-panel"><h3>De la Conciencia de Estado a la Conciencia de Estadio</h3><p>No buscamos el alivio pasajero de un día (Estado). Buscamos una transformación estructural y permanente en tu arquitectura biográfica (Estadio). El propósito es que dejes de ser rehén de tus químicos automáticos (cortisol, reactividad, mandatos) para convertirte en la Arquitecta de tu propia Biología.</p></article>
            <article className="experience-panel experience-panel--dark"><h3>La Alquimia del Goce sobre el Dolor</h3><ul><li><strong>El dolor como información:</strong> Con una fascia flexible, el dolor entra, informa y se retira; no se estanca ni se vuelve identidad.</li><li><strong>El error como abono:</strong> El tropiezo es sagrado cuando se vuelve aprendizaje fértil. Sin contracción previa no existe expansión real.</li><li><strong>El goce como estructura:</strong> La certeza celular de que tu envase es lo bastante amplio para alojarlo todo: la luz, la sombra, la certeza y la vulnerabilidad.</li></ul></article>
          </div>
        </div>
      </section>

      <section className="experience-band experience-band--light" id="pilares">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">III · La Metodología</span><h2>Los 5 Pilares de GÉNESIS</h2></div>
          <div className="experience-steps">{pillars.map((item, index) => <article className="experience-step" key={item.title}><span className="experience-step__number">{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
        </div>
      </section>

      <section className="experience-band" id="factor-888">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">IV · El Factor 888</span><h2>El Ritmo de la Materia</h2></div>
          <div className="experience-grid experience-grid--three">{timing.map((item, index) => <article className={`experience-card ${index === 1 ? "experience-card--light" : ""}`} key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
        </div>
      </section>

      <section className="experience-band experience-band--light" id="estaciones">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">V · El Mapa</span><h2>Las 8 Estaciones</h2><p>Ocho meses, ocho ejes de transformación.</p></div>
          <div className="experience-grid experience-grid--four">{months.map((month, index) => <article className={`experience-card ${index % 2 ? "experience-card--light" : ""}`} key={month.title}><span className="experience-card__label">Mes {index + 1} · {month.axis}</span><h3>{month.title}</h3><span className="experience-card__line"/><p className="experience-card__quote">“{month.quote}”</p><p>{month.description}</p><span className="experience-card__line"/><p><strong>Alkimya Herbal:</strong> {month.plants}</p><p><strong>Clave:</strong> {month.practice}</p></article>)}</div>
        </div>
      </section>

      <section className="experience-band" id="boveda">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">VI · Lo que incluye</span><h2>La Bóveda Alquímica</h2></div>
          <div className="experience-panel experience-intro"><ul>{vault.map(item => <li key={item}>{item}</li>)}</ul></div>
        </div>
      </section>

      <section className="experience-band experience-band--light" id="rutas">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">VII · Acompañamiento</span><h2>Elegí tu Ruta</h2></div>
          <div className="experience-grid experience-grid--three">{routes.map((route, index) => <article className={`experience-card ${index === 1 ? "experience-card--light" : ""}`} key={route.name}><span className="experience-card__label">{route.subtitle}</span><h3>{route.name}</h3><ul>{route.details.map(detail => <li key={detail}>{detail}</li>)}</ul></article>)}</div>
        </div>
      </section>

      <section className="experience-band" id="postulacion">
        <div className="experience-wrap">
          <div className="experience-section-heading"><span className="experience-section-kicker">VIII · El Bio-Filtro</span><h2>Tu Postulación</h2></div>
          <div className="experience-grid">
            <article className="experience-panel"><h3>Es para vos si</h3><ul><li>Buscás una transformación biológica real y sostenible.</li><li>Asumís que tu cuerpo es tu laboratorio.</li><li>Sentís que tu vitalidad está bloqueada por sobreexigencia y querés recuperar tu soberanía.</li></ul></article>
            <article className="experience-panel experience-panel--dark experience-panel--outline"><h3>No es para vos si</h3><ul><li>Esperás recetas instantáneas sin poner el cuerpo.</li><li>Preferís delegar tu salud en terceros.</li></ul></article>
          </div>
          <div className="experience-actions"><a className="experience-cta experience-cta--light" href={INSCRIPCION_URL} target="_blank" rel="noopener noreferrer">Completar ficha de postulación</a></div>
        </div>
      </section>
    </div>
  );
}
