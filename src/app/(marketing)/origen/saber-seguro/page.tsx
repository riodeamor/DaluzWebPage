import type { Metadata } from 'next';
import Link from 'next/link';
import { Droplets, Sparkles, Hand } from 'lucide-react';
import TemplateBordo, { BordoSection, BordoCard, BordoGrid, BordoCallout } from '@/components/layout/TemplateBordo';
import styles from './SaberSeguro.module.css';

export const metadata: Metadata = {
  title: { absolute: 'Saber Seguro: Guía de Uso Responsable | Da Luz Alkimya Botánica' },
  description: 'Conocer para cuidar: pautas de higiene del envase, fotosensibilidad, maternidad, efecto purga y compatibilidades para una convivencia armónica con la cosmética viva.',
};

const hygiene = [
  {
    Icon: Droplets,
    title: 'Cero Agua: El Agua Corrompe lo Vivo',
    text: 'Evitá por completo que ingrese agua dentro de tus frascos, potes o goteros. No uses los sérums ni abras las cremas bajo el chorro directo de la ducha. El agua externa puede alterar el pH, diluir la fórmula e introducir microorganismos que comprometen su conservación.',
  },
  {
    Icon: Sparkles,
    title: 'Roscas Limpias: Roscas y Tapas Impecables',
    text: 'Limpiá periódicamente la rosca y el borde del envase con un paño limpio y seco. Los restos de aceites vegetales o bálsamos que quedan atrapados en la rosca se oxidan en contacto prolongado con el oxígeno del aire, alterando el aroma de la fórmula aunque el interior del frasco esté intacto.',
  },
  {
    Icon: Hand,
    title: 'Toque Limpio: Manos o Espátula de Madera/Vidrio',
    text: 'Utilizá siempre manos higienizadas y secas o espátulas limpias para extraer emulsiones de los potes. Evitá introducir dedos húmedos. Elegí utensilios limpios, secos y compatibles con las indicaciones del envase.',
  },
];

const reactions = [
  {
    title: 'El Efecto Purga: Renovación Dérmica',
    content: <><p>Al incorporar un sérum exfoliante, algunas personas pueden notar cambios en los brotes. Un brote nuevo no permite distinguir por sí solo entre adaptación, irritación o alergia, ni confirmar una supuesta eliminación de toxinas.</p><p><strong>Escuchá tu piel:</strong> si aparece ardor, picazón, hinchazón o enrojecimiento persistente, suspendé el producto y consultá. No continúes una fórmula que empeora tu piel esperando que complete una «purga».</p></>,
  },
  {
    title: 'Gel Susurro: Presencia de Cayena',
    content: <><p>Contiene extracto de Pimienta de Cayena (capsaicina, que puede producir sensación de calor).</p><p><strong>Advertencia:</strong> lavá tus manos inmediatamente después de la aplicación. Evitá tocarte los ojos, nariz o mucosas, y no apliques sobre piel lesionada. Si el ardor es intenso o persiste, suspendé el uso.</p></>,
  },
  {
    title: 'Pasta Dental Ecos: Concentración de Mentol',
    content: <><p>Formulada con mentol cristal y aceites aromáticos. No está recomendada para niños menores de 6 años por la intensidad del crioactivo. No ingerir.</p><p>Para la higiene oral infantil, seguí las indicaciones de su odontólogo y verificá la edad de uso en la etiqueta.</p></>,
  },
  {
    title: 'Pigmentos Botánicos Prisma: Labiales & Sombras Minerales',
    content: <p>Formulados con óxidos de hierro y micas de origen mineral. Si tus labios están deshidratados o agrietados, hidratá previamente con un bálsamo que toleres antes de aplicar labiales mate para evitar descamación visible. Evitá aplicar sobre lesiones o piel irritada.</p>,
  },
];

export default function SaberSeguroPage() {
  return (
    <TemplateBordo
      heroTone="ivory"
      ctaTone="gold"
      kicker="AUTOGESTIÓN, ÉTICA & RESPETO POR LA MATERIA"
      title="Conocer para Cuidar: La Seguridad como un Acto de Soberanía."
      introduction={<p>La cosmética viva y la medicina de la tierra contienen fitoquímicos y metabolitos activos que pueden interactuar con tu biología. Saber usar una alquimia nace del respeto por los ritmos de tu propio cuerpo. Aquí compartimos las pautas indispensables para convivir con nuestras fórmulas con tranquilidad y atención.</p>}
      quote="La medicina está en el detalle. Cuando aprendés a escuchar a tu tejido y a respetar las leyes de la botánica, el cuidado diario deja de ser una rutina automática y se transforma en un santuario seguro."
      cta={{
        href: '/experiencias',
        label: 'AGENDAR SESIÓN UMBRAL: DIAGNÓSTICO & MAPEO →',
        title: '¿Tenés dudas sobre qué Alkimya sintoniza con tu momento actual?',
        description: <p>Si querés explorar tu rutina de cuidado y recibir orientación personalizada, cruzá el umbral. Ante síntomas, embarazo o tratamientos médicos, acompañá este espacio con la consulta a tu profesional de salud.</p>,
      }}
    >
      <nav className={styles.navigation} aria-label="Navegación de Saber Seguro">
        <Link href="/alkimya/activos-origen">← Activos y Origen</Link>
        <a href="#reactividad">Qué hacer ante una reacción</a>
      </nav>

      <BordoSection title="El Templo Físico de tus Fórmulas: Preservar la Vida sin Tóxicos">
        <p>Nuestras alquimias están libres de conservantes industriales como parabenos o liberadores de formaldehído. Para cuidar su conservación hasta la última gota, el cuidado del envase es el primer paso del ritual:</p>
        <div className={styles.hygieneGrid}>
          {hygiene.map(({ Icon, title, text }) => <BordoCard key={title} title={title}><Icon className={styles.icon} size={28} aria-hidden="true" /><p>{text}</p></BordoCard>)}
        </div>
        <p className={styles.note}>Respetá el vencimiento, el período de uso tras la apertura y las condiciones de almacenamiento indicadas en la etiqueta. Conservá los envases cerrados, lejos del calor y del sol. Si cambia el olor, el color o la textura, dejá de usar la fórmula.</p>
      </BordoSection>

      <BordoSection title="Cuidar el Portal de la Vida: Lo que Abrazamos y lo que Pausamos">
        <div className={styles.maternity}>
          <span className={styles.badge}>Maternidad Consciente</span>
          <p>Durante el embarazo y la lactancia, la elección de plantas medicinales, aceites esenciales y tinturas requiere especial atención. La seguridad depende de la fórmula, la concentración y la vía de uso; consultá con tu obstetra o profesional de salud antes de incorporarlos.</p>
          <h3>Plantas y fórmulas que pausamos</h3>
          <p>Como pauta de precaución de esta línea, evitá fórmulas con Romero, Enebro o Salvia en esta etapa hasta contar con una evaluación profesional de su composición y uso.</p>
          <ul>
            <li>Consultá antes de usar Óleo Vital o de reemplazarlo por Óleo Raíz.</li>
            <li>Pausá las pócimas aromáticas Agni y Vayu.</li>
            <li>No utilices la tintura madre Luna Calma durante el embarazo o la lactancia sin indicación profesional.</li>
          </ul>
          <h3>Un cuidado suave: Crema Pureza</h3>
          <p>La propuesta de Crema Pureza es una fórmula ultrasuave para piel delicada: nutritiva, calmante y libre de aceites esenciales estimulantes. Antes de incorporarla, realizá una prueba de parche en una pequeña zona de piel sana, siguiendo las indicaciones del envase. Para bebés e infancia, verificá la edad de uso y consultá al pediatra antes de la prueba y la aplicación. Si aparece ardor o enrojecimiento persistente, suspendé el uso y consultá.</p>
        </div>
      </BordoSection>

      <BordoSection title="La Luz que Ilumina vs. La Luz que Mancha">
        <p>La naturaleza se mueve por ciclos de luz y oscuridad. Algunos ingredientes requieren precauciones especiales frente a la radiación solar:</p>
        <BordoGrid>
          <BordoCard title="Los Cítricos & Fototoxicidad">
            <p><strong>Activos involucrados:</strong> ciertos aceites esenciales cítricos, como Bergamota, Limón o Naranja amarga, pueden contener furocumarinas según su método de extracción.</p>
            <p>Si usás una Brumágica o pócima con aceites cítricos sobre zonas expuestas, revisá las indicaciones de la fórmula y evitá la exposición UV cuando corresponda. Un intervalo fijo de 8 horas no garantiza seguridad para todas las concentraciones y extractos.</p>
            <p><strong>Modo de uso consciente:</strong> reservá las fórmulas fotosensibilizantes para el ritual nocturno y respetá su etiqueta. El uso nocturno no elimina por sí solo el riesgo de la exposición posterior.</p>
          </BordoCard>
          <BordoCard title="Renovación Celular & Protector Solar">
            <p><strong>Sérums Umbral:</strong> Ácido Mandélico, Ácido Láctico y exfoliantes de la línea Soy, Serena y Claridad.</p>
            <p>Los alfa hidroxiácidos pueden aumentar la sensibilidad al sol. Usá protector solar, ropa protectora y limitá la exposición durante su uso y hasta una semana después de suspenderlos, siguiendo las instrucciones de la fórmula.</p>
            <p>La protección diaria también importa en invierno y en días nublados.</p>
          </BordoCard>
        </BordoGrid>
      </BordoSection>

      <BordoSection title="Decodificar las Reacciones de tu Piel sin Entrar en Pánico">
        <p>No toda reacción tiene la misma causa. El ardor, los brotes o el enrojecimiento pueden indicar irritación o alergia; evitá interpretarlos automáticamente como adaptación o drenaje.</p>
        <div className={styles.reactions}>
          {reactions.map(({ title, content }) => <details key={title} className={styles.reaction}><summary>{title}<span aria-hidden="true" className={styles.plus}>+</span></summary><div>{content}</div></details>)}
        </div>
        <div id="reactividad" className={styles.anchor}>
          <BordoCallout title="Ante una reacción: pausá, retirá y consultá">
            <p>Suspendé el producto, retiralo suavemente con agua y evitá sumar exfoliantes o fórmulas nuevas. Si los síntomas persisten o empeoran, consultá a un profesional de salud.</p>
            <p>Si aparece dificultad para respirar o hinchazón de labios, lengua o cara, buscá atención de urgencia.</p>
          </BordoCallout>
        </div>
      </BordoSection>

      <BordoSection title="Minerales Vivos: El Lenguaje de las Arcillas">
        <p>Las arcillas son estructuras minerales con capacidad de adsorción. Su efecto sobre la piel depende del tipo de arcilla y de la fórmula; no equivale a una desintoxicación del organismo.</p>
        <BordoCallout title="La Regla de los Utensilios">
          <p>Prepará las mascarillas con utensilios limpios de vidrio, cerámica o madera en buen estado, siguiendo las indicaciones del producto. No atribuyas al contacto con metal una pérdida automática de eficacia por «despolarización».</p>
        </BordoCallout>
        <BordoGrid>
          <BordoCard title="Arcilla Roja — Escuchá tu Piel"><p>El calor y el enrojecimiento no deben asumirse como una señal de eficacia: pueden indicar irritación. Si sentís ardor o incomodidad, retirala. Evitá dejar que se seque por completo o se cuartee sobre el rostro y respetá el tiempo indicado en la etiqueta.</p></BordoCard>
          <BordoCard title="Arcilla Verde & Bentonita Volcánica"><p>Pueden resultar más absorbentes y producir tirantez. Si la aplicación es incómoda, retirá con agua tibia. No prolongues el tiempo de uso para intensificar el efecto.</p></BordoCard>
          <BordoCard title="Caolín — Arcilla Blanca"><p>Suele utilizarse en fórmulas suaves. La tolerancia depende del producto completo y de tu piel: probá primero en una zona pequeña y evitá aplicar sobre piel lesionada o irritada.</p></BordoCard>
        </BordoGrid>
      </BordoSection>

      <BordoSection title="Interacciones Farmacológicas: Cuando la Planta Dialoga con la Alopatía">
        <p>En Da Luz honramos la medicina integrativa. Si estás bajo tratamiento médico, las tinturas madre y fitoterápicos de la Línea Jade deben coordinarse con responsabilidad:</p>
        <BordoCallout title="Tintura FOCO: Ginkgo Biloba">
          <p>El Ginkgo puede aumentar el riesgo de sangrado cuando se combina con anticoagulantes. No incorpores FOCO en esa situación sin consultar al profesional que lleva tu tratamiento. Antes de una cirugía, informá al equipo sobre todas las tinturas y suplementos que usás; ese equipo debe indicar cuándo suspenderlos.</p>
        </BordoCallout>
        <BordoCallout title="Tintura LUNA CALMA">
          <p>Si tenés antecedentes o tratamientos oncológicos hormono-dependientes, no la utilices sin revisión de sus ingredientes por tu equipo médico.</p>
        </BordoCallout>
        <h3>El Valor de la Sesión de Anamnesis</h3>
        <p>Tu biología es única y no existen recetas universales. Si tomás medicación crónica, atravesás un cuadro de salud complejo o tenés dudas sobre qué planta necesita tu terreno, no te automediques. La sesión de orientación puede acompañar tu cuidado, sin reemplazar la evaluación médica ni modificar tratamientos prescritos.</p>
      </BordoSection>

      <BordoSection title="Decodificar la Letra Chica: Por Qué Aparecen Nombres Complejos">
        <p>En el dorso de nuestros frascos verás nombres como Limonene, Linalool, Citral, Geraniol o Eugenol. Estos nombres identifican moléculas aromáticas que pueden estar presentes de forma natural en aceites esenciales; el nombre INCI por sí solo no permite conocer su origen.</p>
        <ul>
          <li><strong>Limonene:</strong> presente en cítricos y también en otros aceites esenciales.</li>
          <li><strong>Linalool:</strong> presente en lavanda, geranio y petitgrain.</li>
          <li><strong>Citral & Geraniol:</strong> componentes aromáticos de diversas plantas.</li>
          <li><strong>Eugenol:</strong> presente en especias como el clavo.</li>
        </ul>
        <p><strong>¿Por qué leerlos?</strong> Una sustancia natural también puede provocar alergia. Si tenés una alergia conocida, revisá la lista completa y consultá antes de usar la fórmula. La transparencia es una herramienta para cuidar tu salud.</p>
        <div className={styles.sources}>
          <p>Referencias para un cuidado informado</p>
          <a href="https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-industry-labeling-cosmetics-containing-alpha-hydroxy-acids">FDA · Alfa hidroxiácidos y exposición solar</a>
          <a href="https://www.nccih.nih.gov/health/ginkgo">NCCIH · Ginkgo e interacciones</a>
          <a href="https://www.aad.org/public/everyday-care/skin-care-secrets/prevent-skin-problems/test-skin-care-products">AAD · Tolerancia y reacciones a cosméticos</a>
        </div>
      </BordoSection>
    </TemplateBordo>
  );
}
