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
  { title: 'Eneagrama y Epigenética', description: 'Mapeo de patrones psicoemocionales y cómo el entorno y la percepción reprograman la biología celular.' },
  { title: 'Reiki Usui (Niveles 1, 2, 3 y Maestría)', description: 'Canalización bioenergética para armonizar centros sutiles y restaurar el flujo vital.' },
  { title: 'Reiki Karuna (Niveles 1 y 2)', description: 'Trabajo somático sobre memorias celulares profundas y linaje ancestral.' },
  { title: 'Flores de Bach', description: 'Terapia vibracional líquida para la modulación neuroquímica del estrés, miedos y sobreexigencia.' },
  { title: 'Fitoterapia (Medicina Herbal)', description: 'Uso clínico de activos botánicos para depurar filtros orgánicos y equilibrar la piel.' },
  { title: 'Gemoterapia', description: 'Aplicación de redes piezoeléctricas y minerales para anclaje, calma y reordenamiento sutil.' },
  { title: 'Química Cosmética', description: 'Enlaces moleculares, estabilidad galénica y fórmulas puras libres de disruptores endocrinos.' },
  { title: 'Formulación Cosmética Avanzada', description: 'Absorción transdérmica de activos biotecnológicos vegetales y alta cosmética.' },
  { title: 'Aromaterapia', description: 'Moléculas aromáticas puras con impacto directo en el sistema límbico y nervioso autónomo.' },
  { title: 'Chamanismo Universal', description: 'Prácticas arquetípicas de enraizamiento, conexión con los 5 elementos y reintegración.' },
  { title: 'Salud Hormonal', description: 'Sincronización cíclica femenina (fases menstruales y climaterio) mediante nutrición y botánica.' },
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
              <h1>La Alquimista y Creadora detrás de Da Luz</h1>
              <span className="raices-editorial-arrow" aria-hidden="true">↓</span>
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
            <h2 id="certeza-cuerpo">De la Razón Pura a la Certeza en el Cuerpo</h2>
            <div className="raices-editorial-copy">
              <p>El origen de este camino no nació de una epifanía mística, sino de somatizaciones físicas y dolores que mi cuerpo ya no pudo sostener. Siendo capricorniana con ascendente en Virgo, siempre necesité encontrarle una lógica y un fundamento a todo; la facultad de Psicología en la UNC me abría preguntas, pero la pura intelectualización no me alcanzaba para aliviar lo que sentía en la carne.</p>
              <p>A mis 19 años, atravesada por prejuicios hacia lo holístico pero con una necesidad real de ordenar mi propia biología, mi terapeuta de ese momento, Sol Millán, me sugirió hacer la diplomatura en Eneagrama. Aquello fue un quiebre absoluto. Aunque había conceptos que a esa edad y con mi estructura racional tardé años en decantar —repasando apuntes y encontrando joyas recién con la experiencia—, ahí se me grabó una certeza que rige mi vida:</p>
            </div>
            <blockquote className="raices-editorial-quote">“Mi realidad la construyo yo a través de mis elecciones, mis percepciones, mis límites y mis acciones: puedo elegir desde dónde pararme.”</blockquote>
            <div className="raices-editorial-copy">
              <p>A partir de ahí decidí sacarme la piel vieja. Me permití ser curiosa, explorar sin vergüenza y probar en el propio cuerpo cada herramienta que se me presentara siempre que me pulsara. A los meses me formé en Reiki Usui hasta la Maestría; el impacto de esa energía sutil —tan inexplicable para mi mente adolescente pero tan tangible para mi cuerpo— empezó a mover mi mundo: me dio la fuerza para alejarme de entornos que me intoxicaban, marcar límites firmes y elegir con honestidad lo que deseaba.</p>
              <p>Con la llegada de la pandemia y el tiempo que abrió la virtualidad, me zambullí en formaciones profundas de 6 a 8 meses con Pedro Marano en Flores de Bach y Gemoterapia, abriéndome las puertas de la gestión emocional con elixires y cristales de la Tierra cooperando con el organismo. La vida, de parecerme desabrida, había pasado a parecerme una locura hermosa. Esos meses de teoría, prácticas meditativas y conexión con la frecuencia de las piedras y las flores me acompañaron a desarmar la vergüenza, la timidez y mis propios prejuicios; me impulsaron a expresarme con más verdad, primero conmigo misma, para desde ahí poder comunicarme de forma certera con los demás.</p>
              <p>Empecé a explorar estas herramientas en mis conocidos, amigos y familiares; sus devoluciones inmediatas me confirmaron una premisa fundamental:</p>
            </div>
            <blockquote className="raices-editorial-quote">“El cuerpo no miente, no negocia y tiene una tecnología regenerativa extraordinaria cuando se le brindan los estímulos correctos.”</blockquote>
          </section>

          <section className="raices-editorial-section raices-editorial-act-card" aria-labelledby="quiebre-mandato">
            <h2 id="quiebre-mandato">El Quiebre del Mandato, la Alquimia y la Decisión de Emprender</h2>
            <div className="raices-editorial-copy">
              <p>A la par de estas exploraciones, mi transición al vegetarianismo encendió una alarma sobre el acecho de los hábitos cotidianos: me di cuenta de cuántas conductas automáticas sostenemos creyendo que nos cuidan, cuando en realidad entorpecen nuestra fisiología.</p>
              <p>Comencé a probar cosmética artesanal y natural en Córdoba buscando alejarme de los disruptores endocrinos. Por un lado, me topé con la incomodidad de una oferta que muchas veces no me garantizaba qué usaba realmente, saturada de etiquetas de “vegano” o “eco-amigable” que ocultaban parabenos y plásticos. Pero por el otro, en el contacto con los productos de diversas emprendedoras locales, descubrí algo revelador: el goce de cuidar mi cuerpo físico y mi rostro.</p>
            </div>
            <blockquote className="raices-editorial-quote">“Cuidar mi cuerpo dejó de ser un mandato cultural para encajar y se convirtió en el ritual sagrado de habitar mi propio templo.”</blockquote>
            <div className="raices-editorial-copy">
              <p>Sentir la nobleza de una textura viva en mis manos le dio una vuelta de tuerca a la ecuación: no era estética vacía, era un momento sagrado de contacto conmigo, de masaje, presencia y liberación de tensiones.</p>
              <p>Ese chispazo despertó mi necesidad de comprender qué pasaba en el tejido y en la célula. Hice un primer taller de botiquín herbal y mi primera fórmula —una crema— fue un desastre absoluto. Lejos de quedarme en la frustración —porque frustrarse es humano, pero estancarse es una elección—, mi exigencia me empujó a investigar de manera autogestiva, a tomar talleres técnicos de formulación galénica y a certificarme formalmente en Fitoterapia Clínica. Entender la farmacopea de las plantas medicinales y su afinidad biológica con el organismo terminó de integrar todas mis piezas.</p>
              <p>En medio de ese proceso tomé una decisión radical: dejar la facultad para formarme de lleno en las diferentes aristas de nuestra tecnología y lanzarme a emprender. Si la Guadi de ese entonces hubiese sabido todo lo que implicaba, jamás se hubiese animado; pero el impulso de mi Luna en Aries fue más fuerte. Así nació Zentidoconsciente, la marca que precedió a este presente, ofreciendo mis primeros productos en tiendas, abriendo sesiones y acompañando a seres preciosos en sus procesos.</p>
            </div>
          </section>

          <section className="raices-editorial-section" aria-labelledby="nacimiento-da-luz">
            <h2 id="nacimiento-da-luz">El Punto Ciego, el Límite y el Nacimiento de Da Luz</h2>
            <div className="raices-editorial-copy">
              <p>Sin embargo, en ese primer impulso algo vital había quedado en un punto ciego. Había una resistencia a escuchar una voz interna que venía a ordenar y expandir los horizontes.</p>
              <p>Siempre quise crear lo que a mí me hacía falta ver como consumidora-clienta: transparencia radical para saber exactamente qué lleva cada producto y qué incluye cada propuesta, junto a una integración real entre la materia física y los saberes energéticos. La belleza física de la piel no se puede escindir de nuestra tecnología emocional, mental y sensitiva; nada hubiera sido lo mismo en mi proceso si no le hubiese puesto intención, presencia y goce al ritual de cuidado.</p>
              <p>Tuve que hacer una pausa en el momento en que más ganas tenía de avanzar. Durante un año entero la vida me la dio contra la pared avisándome que frenara: había estado operando desde el “hacer” rígido, impaciente y sobreexigido, sin darle tiempo a lo más importante: escuchar el sentir de mi marca por encima de lo que mi ego creía que debía hacer.</p>
              <p>Fueron tantos los desafíos que pensé en dejar todo, quedarme solo con un par de sesiones o directamente irme a viajar y vivir de cualquier aventura. Pero en el fondo me di cuenta de la verdad: a mis propuestas les faltaba una vuelta de tuerca desde el encuadre. Había límites que ya no deseaba permitir en la consulta, dinámicas que no iban más, y herramientas espectaculares con las que me había formado que aún no me animaba a desplegar.</p>
              <p>En esos meses de pausa, comenzaron a llegar mensajes consultando por sesiones, por productos y compartiendo devoluciones sobre los procesos y alquimias ya transitados. Y ahí recordé que los desafíos no siempre son señales de que el camino no es por ahí; qué errado es creer que solo lo que fluye sin fricción es lo que “vale la pena”.</p>
            </div>
            <blockquote className="raices-editorial-quote raices-editorial-quote-final">“Y la verdad, no quiero nada que valga la pena; quiero que valga el goce.”</blockquote>
            <div className="raices-editorial-copy">
              <p>Elegí hacer cada paso desde el goce y la presencia, sin correr, sintiendo realmente y dirigiendo mis proyectos hacia donde deseo que vayan, poniendo los límites necesarios a quienes haga falta incluida a mí. El miedo a la “intensidad” de mi visión dejó de estar o, por lo menos, dejó de estorbar.</p>
              <p>Desarmé el síndrome del impostor viéndome con honestidad: dónde estaba parada y, con una mano en el corazón, dónde elijo estar. Me hice cargo de áreas que jamás pensé explorar, puse los límites necesarios y tracé un sendero firme donde la intuición y el corazón tienen los pies bien puestos en la Tierra.</p>
              <p>Así nació Da Luz Consciente y su universo botánico Alkimya Da Luz: creadas para acompañarte a habitar tu cuerpo desde tu propio Poder, encender tus sentidos y devolverte el inmenso goce de vivir en coherencia.</p>
            </div>
          </section>
        </div>

        <section className="raices-accordions" aria-label="Formaciones y saberes">
          <RaicesAccordion title="FORMACIONES" items={formaciones} />
          <RaicesAccordion title="SABERES Y TALLERES" items={saberes} />
        </section>

        <nav className="raices-editorial-ctas" aria-label="Próximos pasos">
          <Link href="/servicios/procesos/sesiones-integrales">SESIONES</Link>
          <Link href="/productos">TIENDA</Link>
        </nav>
      </article>
    </main>
  )
}
