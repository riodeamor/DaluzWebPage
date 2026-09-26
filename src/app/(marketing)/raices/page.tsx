import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import RaicesAccordion from '@/components/raices/RaicesAccordion'
import '@/styles/raices-filosofia.css'

export const metadata: Metadata = {
  title: 'Raíces | La Alquimista | DA LUZ CONSCIENTE',
  description: 'La alquimista y creadora detrás de Da Luz Consciente: un recorrido de biología, presencia, límites y goce.',
}

const formaciones = [
  { title: 'Eneagrama y Epigenética', description: 'Mapeo de la estructura del carácter y desprogramación de patrones inconscientes. Integración de cómo la percepción, el estrés y el entorno modulan activamente la expresión genética y la biología celular.' },
  { title: 'Reiki Usui (Niveles 1, 2, 3 y Maestría)', description: 'Canalización y ordenamiento del flujo vital (Ki/Prana). Alineación de centros sutiles, sellado del campo electromagnético y disolución de bloqueos en los planos físico, emocional y mental.' },
  { title: 'Reiki Karuna (Niveles 1 y 2)', description: 'Frecuencia de sanación compasiva de alta vibración. Intervención energética profunda para transmutar improntas kármicas inconscientes, memorias de dolor enquistadas y pactos limitantes a nivel álmico.' },
  { title: 'Flores de Bach', description: 'Terapia floral vibracional para alquimizar estados emocionales densos, regulando el terreno psicoemocional, la sobreexigencia, el miedo y la reactividad del sistema nervioso.' },
  { title: 'Fitoterapia (Medicina Herbal)', description: 'Farmacopea botánica aplicada: uso clínico de activos vegetales y extractos estandarizados para modular órganos emuntorios (hígado, riñones, intestinos) y desinflamar el terreno biológico. Abordaje integrativo que restaura la capacidad depurativa del organismo y equilibra la fisiología cutánea e inmunológica desde la causa raíz.' },
  { title: 'Gemoterapia', description: 'Terapia mineral bioeléctrica basada en la geometría y las propiedades piezoeléctricas de las redes cristalinas de cuarzo y minerales nobles. Intervención sobre el campo sutil para calibrar la frecuencia electromagnética corporal, favorecer el enraizamiento telúrico y sostener estados de profunda calma y coherencia interna.' },
  { title: 'Química Cosmética', description: 'Ciencia de estabilidad galénica, fisicoquímica de emulsiones y balance de pH fisiológico mediante sistemas buffer (citrato/lactato) para la preservación del manto ácido y la microbiota cutánea. Formulación rigurosa y limpia, 100% libre de disruptores endocrinos (ftalatos, parabenos, filtros químicos sintéticos, bisfenoles) y de cargas inertes bioacumulables.' },
  { title: 'Formulación Cosmética Avanzada', description: 'Ingeniería transdérmica de activos de alto rendimiento: vehículos biointeligentes (liposomas, nanoesferas), biomimética lipídica y balance de ácidos grasos poliinsaturados para la regeneración de la barrera cutánea. Diseño galénico con biotecnología vegetal, péptidos de señal y activos fraccionados por peso molecular para una penetración celular profunda y biodisponible.' },
  { title: 'Aromaterapia', description: 'Bioquímica de quimiotipos y moléculas aromáticas vivas, estructuradas según su volatilidad y polaridad (notas altas, medias y bajas) en fórmulas puras sin fijadores sintéticos. Acción neurofisiológica directa sobre el sistema límbico y el nervio vago para modular el sistema neurovegetativo, liberar anclajes emocionales y armonizar el biocampo.' },
  { title: 'Chamanismo Universal', description: 'Puente entre la física cuántica (campos mórficos, efecto observador) y las cosmovisiones ancestrales: trabajo ceremonial con los cinco elementos y la sabiduría de la tierra para el rescate del poder personal. Prácticas arquetípicas y de enraizamiento telúrico que permiten habitar la ciclicidad, trascender el control lineal del ego y caminar la vida desde el goce y la soberanía.' },
  { title: 'Salud Hormonal', description: 'Abordaje sistémico de la arquitectura endocrina: modulación del eje HPA (estrés/adrenales/cortisol), sensibilidad a la insulina, eje tiroideo y detoxificación hepática de metabolitos hormonales (Fase I y II). Integración de fitomedicina adaptógena y nutrición celular para resolver desbalances de raíz, restaurar el equilibrio metabólico y sostener los ritmos biológicos naturales.' },
]

const saberes = [
  { title: 'Cuencos Sonoros', description: 'Modulación acústica en 432 Hz que induce ondas Alfa y Theta para apagar el estrés simpático.' },
  { title: 'Péndulo Evolutivo', description: 'Rastreo radiestésico del campo sutil para decodificar bloqueos antes de que se somaticen.' },
  { title: 'Canto Medicina', description: 'Desbloqueo del canal laríngeo y diafragmático mediante la frecuencia de la voz propia.' },
  { title: 'Astrología Evolutiva', description: 'Navegación psíquica para comprender ciclos vitales y desafíos arquetípicos del mapa natal.' },
  { title: 'Danza Primal, Matriz y Butoh', description: 'Descarga somática de la fascia mediante el movimiento libre y orgánico.' },
  { title: 'Ciclicidad Lunar-Menstrual', description: 'Sincronización de hábitos y descanso según las cuatro estaciones biológicas internas.' },
  { title: 'Ayurveda', description: 'Diagnóstico por doshas (Vata, Pitta, Kapha) para individualizar hábitos y fitoterapia a medida.' },
  { title: 'Numerología', description: 'Comprensión de las frecuencias y ciclos temporales de los procesos de vida.' },
  { title: 'Nutrición Antiinflamatoria', description: 'Cuidado del microbioma intestinal y alivio de la carga metabólica celular.' },
  { title: 'Psicología (UNC)', description: 'Bases clínicas y aparato psíquico que sostienen el encuadre de los procesos terapéuticos.' },
]

export default function RaicesPage() {
  return (
    <main className="raices-editorial-page">
      <article className="raices-editorial-shell">
        <header className="raices-editorial-hero">
          <div className="raices-editorial-hero-copy">
            <div className="raices-editorial-brackets">
              <svg className="raices-editorial-title-wave raices-editorial-title-wave-top" viewBox="0 0 520 28" aria-hidden="true"><path d="M2 16C70 2 125 27 194 13C267-2 321 27 389 13C444 2 479 7 518 16" /></svg>
              <h1>La Alquimista y Creadora detrás de Da Luz</h1>
              <span className="raices-editorial-arrow" aria-hidden="true">↓</span>
              <svg className="raices-editorial-title-wave raices-editorial-title-wave-bottom" viewBox="0 0 520 28" aria-hidden="true"><path d="M2 16C70 2 125 27 194 13C267-2 321 27 389 13C444 2 479 7 518 16" /></svg>
            </div>
            <p className="raices-editorial-opening">
              ¡Hola! Soy la alquimista, terapeuta y creadora detrás de Da Luz. Mi vocación es brindar herramientas y propuestas que impulsen la presencia, el goce y la consciencia. Mi propósito es acompañarte a habitar el cuerpo desde tu propio Poder, en conexión íntima con tus deseos y sensaciones, poniendo a favor nuestra tecnología humana: tan amplia, compleja y disponible cuando aprendemos a escucharla.
            </p>
            <svg className="raices-editorial-wave" viewBox="0 0 520 28" aria-hidden="true">
              <path d="M2 16C70 2 125 27 194 13C267-2 321 27 389 13C444 2 479 7 518 16" />
            </svg>
          </div>
          <div className="raices-editorial-portrait">
            <Image src="/images/sobre-daluz/sobre-daluz-main.jpg" alt="Guadalupe - Creadora de Da Luz" fill priority sizes="(min-width: 1024px) 384px, (min-width: 768px) 320px, 256px" />
          </div>
        </header>

        <div className="raices-editorial-reading">
          <section className="raices-editorial-section" aria-labelledby="certeza-cuerpo">
            <p className="raices-editorial-milestone">I · RAÍZ &amp; SOMATIZACIÓN</p>
            <h2 id="certeza-cuerpo">De la Razón Pura a la Certeza en el Cuerpo</h2>
            <div className="raices-editorial-copy">
              <p>El origen de este camino no nació de una epifanía mística, sino de somatizaciones físicas y dolores que mi cuerpo ya no pudo sostener. Siendo capricorniana con ascendente en Virgo, siempre necesité encontrarle una lógica y un fundamento a todo; la facultad de Psicología en la UNC me abría preguntas, pero la pura intelectualización no me alcanzaba para aliviar lo que sentía en la carne.</p>
              <p>A mis 19 años, todavía con ciertos prejuicios hacia lo holístico pero ya con una pata metida en ese universo, sentía una necesidad urgente de comprender mi propio ser, mi personalidad y lo que realmente me pasaba, con un pulso muy fuerte de cambiar mi vida sin saber bien por dónde ir. En medio de esa confusión, mi terapeuta de ese momento, Sol Millán, me sugirió hacer la diplomatura en Eneagrama que brindaba junto a Roberto Pérez. Aquello fue un quiebre absoluto.</p>
              <p>Aunque había conceptos que a esa edad y con mi estructura racional tardé años en decantar —repasando apuntes y encontrando joyas recién con la experiencia—, gracias a esos dos grandes maestros mi vida empezó a sonar, oler y verse diferente: conquisté más aceptación, más verdad para conmigo misma, autocrítica constructiva y una reconciliación profunda con los límites, hacia el afuera y hacia mí misma. Ahí se me grabó una certeza que hoy rige mi vida:</p>
            </div>
            <blockquote className="raices-editorial-quote">“Mi realidad la construyo yo a través de mis elecciones, mis percepciones, mis límites y mis acciones: puedo elegir desde dónde pararme.”</blockquote>
            <div className="raices-editorial-copy">
              <p>A partir de ahí decidí sacarme la piel vieja. Me permití ser curiosa, explorar sin vergüenza y probar en el propio cuerpo cada herramienta que se me presentara, siempre que me pulsara. A los meses me formé en Reiki Usui hasta la Maestría; el impacto de esa energía sutil —tan inexplicable para mi mente adolescente pero tan tangible para mi cuerpo— empezó a mover mi mundo: me dio la fuerza para alejarme de entornos que me intoxicaban, marcar límites firmes y acercarme a sentir con honestidad lo que deseaba, conectándome de raíz con la fuerza viva de la existencia.</p>
            </div>
            <p className="raices-editorial-milestone raices-editorial-milestone-inline">II · ELIXIRES &amp; FRECUENCIA</p>
            <h2 className="raices-editorial-interlude-title">Desarmar la Vergüenza y Validar el Terreno</h2>
            <div className="raices-editorial-copy">
              <p>Con la llegada de la pandemia y el tiempo que abrió la virtualidad, me zambullí en formaciones profundas de 6 a 8 meses con Pedro Marano en Flores de Bach y Gemoterapia. Esas herramientas vinieron a cristalizar, de manera muy sutil pero evidente, procesos que venía explorando sobre mi ser y sobre las emociones que me limitaban a mostrarme: me enseñaron a vincularme sin ansiedad, sin vergüenza, con honestidad y con la seguridad de quién soy, sin sentir que tenía que pedir permiso para ser, para decir, para cantar, para bailar o para hacerme visible.</p>
              <p>Fueron estos elixires y cristales los que despertaron el primer pulso de expandir estos saberes más allá de mí misma. Mientras vivía mi propio proceso, mis amigas y familiares más cercanas se convirtieron en mis hermosas «musas», explorando conmigo mis preparados botánicos, mis primeras sesiones y las frecuencias de los cuencos. Las transformaciones de mi entorno me confirmaron que esto no era una sugestión mía: había un cambio real, una consciencia más atenta y una catalización evidente en sus procesos.</p>
              <p>Poder cooperar con el equilibrio de mis seres queridos a través de técnicas y preparados ancestrales —al tiempo que disolvía estructuras rígidas que me mantenían atada a patrones de autoexigencia, culpa y latigazos internos— transformó por completo mi mirada: la vida pasó de parecerme desabrida y pesada, a revelarse como una locura hermosa. Mi propia historia personal, mi cuerpo y las devoluciones de mis consultantes me sellaron una premisa fundamental:</p>
            </div>
            <blockquote className="raices-editorial-quote">“El cuerpo no miente, no negocia y tiene una tecnología regenerativa extraordinaria cuando se le brindan los estímulos correctos.”</blockquote>
          </section>

          <section className="raices-editorial-section raices-editorial-act-card" aria-labelledby="quiebre-mandato">
            <p className="raices-editorial-milestone">III · EL QUIEBRE &amp; LA MATERIA</p>
            <h2 id="quiebre-mandato">De la Belleza Vacía a la Farmacopea Viva</h2>
            <div className="raices-editorial-copy">
              <p>A la par de estas exploraciones, mi transición al vegetarianismo encendió una alarma sobre el acecho de los hábitos cotidianos: me di cuenta de cuántas conductas automáticas sostenemos creyendo que nos cuidan, cuando en realidad entorpecen nuestra fisiología.</p>
              <p>Comencé a probar cosmética artesanal y natural en Córdoba buscando alejarme de los disruptores endocrinos. Por un lado, me topé con la incomodidad de una oferta que no garantizaba transparencia real, saturada de etiquetas de «vegano» o «eco-amigable» que ocultaban parabenos y plásticos. Pero por el otro, en el contacto con los preparados de diversas emprendedoras locales, descubrí y exploré por primera vez el goce de cuidar mi cuerpo físico.</p>
            </div>
            <blockquote className="raices-editorial-quote">“Cuidar mi cuerpo dejó de ser un mandato cultural para encajar y se convirtió en el ritual sagrado de habitar mi propio templo.”</blockquote>
            <div className="raices-editorial-copy">
              <p>Sentir las texturas vivas en mis manos, los aromas botánicos y el placer del tacto le dio una vuelta de tuerca a la ecuación: no era estética vacía ni un mandato para encajar, era un momento sagrado de contacto conmigo, de masaje, presencia y liberación de tensiones.</p>
              <p>Ese chispazo despertó mi necesidad de comprender qué pasaba en el tejido y en la célula. Hice un primer taller de botiquín herbal y mi primera crema fue un desastre absoluto. Lejos de quedarme en la frustración —porque frustrarse es humano, pero estancarse es una elección—, mi autoexigencia me empujó a investigar de manera autogestiva, a tomar talleres técnicos de formulación galénica y a certificarme formalmente en Fitoterapia Clínica. Aprender la farmacopea de las plantas medicinales y comprobar en el tejido su afinidad biológica terminó de soldar las piezas que estaban dispersas.</p>
              <p>En medio de ese proceso tomé una decisión radical: dejar la facultad de Psicología para formarme de lleno en nuestra tecnología humana y lanzarme a emprender. Si la Guadi de ese entonces hubiese sabido todo lo que implicaba, jamás se hubiese animado; pero el impulso de mi Luna en Aries fue más fuerte. Así nació Zentidoconsciente, la marca que precedió a este presente, ofreciendo mis primeros productos en tiendas, abriendo sesiones y acompañando a seres preciosos en sus procesos.</p>
            </div>
          </section>

          <section className="raices-editorial-section" aria-labelledby="nacimiento-da-luz">
            <p className="raices-editorial-milestone">IV · LA PAUSA &amp; EL LÍMITE</p>
            <h2 id="nacimiento-da-luz">El Freno Biológico y el Fin del Piloto Automático</h2>
            <div className="raices-editorial-copy">
              <p>Había algo en ese primer impulso que me hacía sentir incómoda e insatisfecha —más allá de mi propia perfeccionista interna—. Era un pulso que venía desde más adentro, un punto ciego que me resistía a mirar.</p>
              <p>Yo sabía que quería integrar mis saberes holísticos con los productos de cosmética viva, porque la belleza de la piel no se puede escindir de nuestra tecnología emocional, mental y sensitiva; nada hubiera sido lo mismo en mi camino sin la intención, la presencia y el goce del ritual diario. Pero también prefería hacer oídos sordos: era más fácil no mover el avispero frente a la cantidad de tareas que ya cargaba en mi rutina.</p>
              <p>Seguí adelante en un intento multifunción de parchar los puntos débiles de mis propuestas, hasta que durante un año entero la vida me la dio contra la pared avisándome que frenara. Había estado operando desde el «hacer» rígido, impaciente y sobreexigido, sin darle tiempo a lo más importante: escuchar el sentir de mi marca por encima de lo que mi ego creía que debía hacer.</p>
              <p>Tuve que hacer una pausa en el momento en que más ganas tenía de avanzar. Fueron tantos los desafíos que pensé en dejar todo, quedarme solo con un par de sesiones o directamente irme a viajar y vivir cualquier aventura. Pero en el fondo me di cuenta de la verdad: a mis propuestas les faltaba una vuelta de tuerca desde el encuadre. Había límites que ya no deseaba permitir en la consulta, dinámicas que no iban más, y herramientas espectaculares con las que me había formado que aún no me animaba a desplegar.</p>
              <p>En esos meses de silencio hacia el afuera, comenzaron a llegar mensajes consultando por sesiones, por fórmulas y compartiendo devoluciones hermosas sobre procesos ya transitados. Fueron un mimo para mi corazón y un recordatorio para mi ego: los desafíos no siempre son señales de que el camino no es por ahí; qué errado es creer que solo lo que fluye sin fricción es lo que vale la pena.</p>
            </div>
            <p className="raices-editorial-milestone raices-editorial-milestone-inline">V · LA SOBERANÍA DEL GOCE</p>
            <h2 className="raices-editorial-interlude-title">Habitar la Coherencia con los Pies en la Tierra</h2>
            <p className="raices-editorial-copy">Y en medio de esa pausa me dije:</p>
            <blockquote className="raices-editorial-quote raices-editorial-quote-final">“No quiero nada que valga la pena; quiero que valga el goce.”</blockquote>
            <div className="raices-editorial-copy">
              <p>Elegí hacer un silencio hacia el afuera para moverlo todo por dentro. Me rehabitué a dar cada paso desde el goce y la presencia, escuchando mi deseo de cooperar con los seres de esta tierra sin correr, o aprendiendo a frenarme a tiempo cuando la prisa me ganaba. Le di, por primera vez, un voto de confianza ciego a esa voz interna que exigía una reestructuración profunda.</p>
              <p>Desarmé el síndrome del impostor mirándome con honestidad: reconociendo dónde estaba parada y, con una mano en el corazón, dónde elegía estar y cómo deseaba asistir, crear y encuadrar mis creaciones. El miedo a la «intensidad» de mi visión dejó de estorbar, convirtiéndose en el combustible de una transformación inmensa donde los aprendizajes fueron aún más grandes que los desafíos. Delegué tareas, me hice cargo de áreas que jamás pensé explorar, puse los límites necesarios y tracé un sendero firme donde la intuición y el corazón tienen los pies bien puestos en la Tierra.</p>
              <p>Así nació Da Luz Consciente y su universo botánico Alkimya Da Luz: creadas para acompañarte a habitar tu cuerpo desde tu propio Poder, encender tus sentidos y devolverte el inmenso goce de vivir en coherencia.</p>
            </div>
          </section>
        </div>

        <section className="raices-accordions" aria-label="Formaciones y saberes">
          <RaicesAccordion title="FORMACIONES & TALLERES" items={formaciones} />
          <RaicesAccordion title="SABERES Y TALLERES" items={saberes} />
        </section>

        <nav className="raices-editorial-ctas" aria-label="Próximos pasos">
          <Link href="/servicios/procesos/sesiones-integrales">SESIONES INTEGRALES</Link>
          <Link href="/productos">TIENDA ALKIMYA</Link>
        </nav>
      </article>
    </main>
  )
}
