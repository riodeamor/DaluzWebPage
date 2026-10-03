import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf, FlaskConical, Sprout, Atom } from 'lucide-react';
import TemplateBordo, { BordoSection, BordoTable } from '@/components/layout/TemplateBordo';
import styles from './CienciaVerde.module.css';

export const metadata: Metadata = {
  title: { absolute: 'Ciencia Verde y Activos Biotecnológicos | Da Luz Alkimya Botánica' },
  description: 'Dermo-Cosmética Activa de base botánica: sinergia de maceraciones puras, biofermentación y moléculas idénticas a la naturaleza sin rellenos sintéticos.',
};

const methods = [
  {
    Icon: Leaf, numeral: 'I', title: 'El Corazón Botánico & Extracción Pura', badge: 'Procesamiento Mínimo · Medicina en Movimiento',
    introduction: 'Materias primas tratadas a ritmo vegetal para preservar sus componentes y acompañar la vitalidad de la planta:',
    items: [
      ['Aceites Vegetales Vírgenes', 'Primera prensada en frío de Jojoba, Argán, Rosa Mosqueta, Palta y Girasol, junto a Manteca de Karité pura. Aportan ácidos grasos y componentes emolientes para acompañar la barrera cutánea.'],
      ['Destilación por Arrastre de Vapor', 'La destilación permite obtener Aceite Esencial, una fracción aromática concentrada, e Hidrolato Puro, la fase acuosa con componentes volátiles disueltos. Cada uno requiere sus propias pautas de conservación y uso.'],
      ['Maceraciones Lunares', 'El reposo de la hierba en vehículos nobles sin calor agresivo: Oleatos en aceite virgen, Tinturas Madre en vehículo hidroalcohólico y Extractos Hidroglicerinados en glicerina vegetal.'],
    ],
  },
  {
    Icon: FlaskConical, numeral: 'II', title: 'Biotecnología Verde & Biofermentación', badge: 'Cultivo Biológico · Pureza y Precisión',
    introduction: 'Microorganismos alimentados con sustratos vegetales en procesos controlados para producir ingredientes destinados al cuidado de la piel:',
    items: [
      ['Ácido Hialurónico Vegetal (APM y BPM)', 'Obtenido por fermentación bacteriana. El Alto Peso Molecular ayuda a retener agua en superficie; las fracciones de Bajo Peso Molecular aportan humectación, con un comportamiento que depende de su tamaño y de la fórmula completa.'],
      ['Gluconolactona (PHA)', 'Ingrediente vinculado a procesos de transformación de glucosa. Ofrece exfoliación suave y humectación; su tolerancia depende de la concentración y del producto. Respetá siempre las indicaciones de fotoprotección.'],
    ],
  },
  {
    Icon: Sprout, numeral: 'III', title: 'Derivados de Seguridad Vegetal', badge: 'Transformados Verdes · Textura y Afinidad',
    introduction: 'Ingredientes derivados de materias primas vegetales que cumplen funciones estructurales de limpieza, emoliencia y estabilidad:',
    items: [
      ['SCI & Betaína de Coco', 'Tensioactivos derivados de materias primas del coco. Aportan limpieza y espuma cremosa en sistemas formulados para cuidar la tolerancia de la piel.'],
      ['Triglicérido Caprílico (MCT)', 'Éster ligero utilizado como emoliente y vehículo. Aporta tacto sedoso y ayuda a disolver componentes liposolubles; la respuesta de los poros depende de la fórmula y de cada piel.'],
      ['Alcohol Cetearílico', 'Alcohol graso que aporta emoliencia, textura y estabilidad. Su función es distinta de la del alcohol etílico.'],
    ],
  },
  {
    Icon: Atom, numeral: 'IV', title: 'Pureza Clínica: Nature-Identical', badge: 'Sintéticos Éticos · Moléculas Idénticas a la Naturaleza',
    introduction: 'Moléculas purificadas o sintetizadas con identidad química equivalente a compuestos presentes en la naturaleza. La selección prioriza calidad, función y trazabilidad:',
    items: [
      ['Niacinamida al 99% (Vitamina B3)', 'El porcentaje expresa la pureza de la materia prima, no la concentración del cosmético. En fórmulas adecuadas, ayuda a fortalecer la barrera, regular el brillo y unificar la apariencia del tono.'],
      ['Alantoína Purificada', 'Ingrediente de cuidado asociado a la Consuelda, también disponible por síntesis. Aporta suavidad y acompaña fórmulas calmantes. La purificación no garantiza ausencia de alergias.'],
      ['Ácido Mandélico Puro', 'Alfa hidroxiácido de tamaño molecular relativamente grande, utilizado en renovación superficial. Su efecto depende de la concentración, el pH y la tolerancia; no garantiza una aplicación sin ardor.'],
    ],
  },
];

const transparency = [
  ['Parabenos y Donantes de Formaldehído', 'Los excluimos por nuestro criterio de formulación. Esta elección no significa que todo conservante de estas familias sea inseguro en cualquier condición.', 'Sistemas Conservantes Seleccionados', 'Geogard 221, Euxyl K 903 y Cosphagard, según la fórmula. La conservación requiere concentraciones adecuadas y controles microbiológicos; una certificación no garantiza tolerancia universal.'],
  ['Siliconas y Derivados del Petróleo', 'Elegimos otras texturas y vehículos para expresar nuestra identidad botánica. La oclusión puede tener una función protectora; no equivale por sí sola a asfixiar la piel.', 'Aceites Vegetales Vírgenes y Ésteres Ligeros', 'Lípidos emolientes seleccionados para acompañar la barrera y aportar nutrición, suavidad y sensorialidad.'],
  ['Sulfatos como SLS / SLES', 'Priorizamos sistemas de limpieza con el perfil sensorial y de tolerancia buscado. La agresividad depende de la concentración y de la fórmula completa.', 'Tensioactivos Derivados del Coco', 'SCI y Betaína en sistemas de limpieza suave, ajustados al uso previsto y al pH del producto.'],
  ['Fragancias Sintéticas Artificiales', 'Nuestro perfil aromático se construye con materias primas botánicas. Tanto fragancias sintéticas como naturales pueden provocar sensibilización.', 'Aceites Esenciales Puros e Hidrolatos', 'Aportan identidad aromática y una experiencia sensorial botánica. Se seleccionan con atención a sus alérgenos, concentración y precauciones de uso.'],
];

export default function CienciaVerdePage() {
  return (
    <TemplateBordo
      heroTone="ivory"
      ctaTone="gold"
      kicker="SOBERANÍA DE INFORMACIÓN & DERMO-COSMÉTICA ACTIVA"
      title="El riesgo de un ingrediente no reside en su cuna, sino en su Biocompatibilidad."
      highlightedWord="Biocompatibilidad"
      introduction={<p>En Da Luz buscamos superar el falso dilema entre botánica y laboratorio. La seguridad de una molécula no depende solo de si nació en una planta al sol o en un matraz: también importan su pureza, la concentración, la vía de uso, la estabilidad y la afinidad de la fórmula con tu piel. La biodegradabilidad suma al cuidado del entorno.</p>}
      quote="Nuestra base es botánica y viva; nuestra potencia es dermo-cosmética. Creemos que la soberanía de la información es el primer paso indispensable hacia un cuidado consciente de la piel."
      cta={{ href: '/origen/materia-prima', label: 'IR A LA BITÁCORA DE MATERIAS PRIMAS →', title: 'La Ciencia Verde es Soberanía Biológica Encarnada', description: <p>Ahora que conocés el porqué de cada gota y la filosofía detrás de cada molécula, estás lista para explorar nuestras plantas, activos y aceites.</p> }}
    >
      <nav className={styles.navigation} aria-label="Navegación de Ciencia Verde"><Link href="/alkimya/activos-origen">← Activos y Origen</Link><Link href="/origen/saber-seguro">Consultar Saber Seguro →</Link></nav>
      <div className={styles.manifesto}><p>Venimos de un mercado que a veces contrapone la precisión técnica con el cuidado botánico. Rompemos esa falsa dicotomía: una fórmula necesita estabilidad microbiológica, un pH adecuado y activos seleccionados con propósito. Tu piel merece conocer qué recibe, qué aporta cada ingrediente y cómo usarlo con respeto.</p></div>

      <BordoSection title="La Fusión de Dos Mundos: Precisión Celular y Ética de la Tierra">
        <p>Para nosotras, formular no es mezclar hierbas al azar ni elegir una base solo por su costo. Es trabajar con precisión y una mirada de Química Verde:</p>
        <div className={styles.comparison}>
          <article className={styles.science}><span className={styles.eyebrow}>Activo Biotecnológico</span><h3>La Inteligencia Biológica (La Ciencia)</h3><p>Ingredientes cultivados, aislados o producidos mediante procesos controlados, como la biofermentación con microorganismos, para obtener materias primas con características definidas.</p><p><strong>Valor real:</strong> permiten trabajar con pureza y tamaños moleculares específicos, evaluar estabilidad y buscar resultados reproducibles. La penetración y la eficacia dependen de cada molécula y de su formulación.</p></article>
          <article className={styles.conscience}><span className={styles.eyebrow}>Consciente</span><h3>La Ética del Origen (La Consciencia)</h3><p>Nuestro compromiso es elegir materias primas veganas, sin derivados animales, y priorizar procesos de menor impacto y trazabilidad del origen.</p><p><strong>Valor real:</strong> incorporar activos con intención para potenciar y acompañar el corazón botánico, cuidando la función de cada ingrediente y su relación con el entorno.</p></article>
        </div>
      </BordoSection>

      <BordoSection title="Trazabilidad de la Materia: Del Cultivo al Frasco">
        <p className={styles.eyebrow}>CÓMO NACE LA MEDICINA EN NUESTRO TALLER</p>
        <div className={styles.methods}>{methods.map(({ Icon, numeral, title, badge, introduction, items }) => <article className={styles.method} key={numeral}>
          <div className={styles.methodTop}><Icon size={28} aria-hidden="true" /><span>GRUPO {numeral}</span></div>
          <h3>{title}</h3><p className={styles.badge}>{badge}</p><p>{introduction}</p>
          <dl>{items.map(([name, text]) => <div key={name}><dt>{name}</dt><dd>{text}</dd></div>)}</dl>
        </article>)}</div>
      </BordoSection>

      <BordoSection title="Los Tres Guardianes de tu Barrera">
        <div className={styles.guardians}><h3>El Trío Biocompatible: Cuidar la Renovación</h3><p>Los ácidos renovadores y los fitoquímicos necesitan una fórmula equilibrada. Incorporamos tres aliados con funciones complementarias para acompañar hidratación, suavidad y cuidado de la barrera:</p>
          <dl className={styles.guardianGrid}>
            <div><dt>ALANTOÍNA — El Aliado Reparador</dt><dd>Aporta suavidad y acompaña fórmulas calmantes, ayudando a cuidar la piel áspera o seca. No garantiza ausencia de irritación ni reemplaza el tratamiento de lesiones.</dd></div>
            <div><dt>XILITOL VEGETAL — Humectación & Cuidado</dt><dd>Polialcohol obtenido de materias primas vegetales. Aporta humectación; su papel en fórmulas de higiene depende de la concentración y del uso previsto.</dd></div>
            <div><dt>INULINA PREBIÓTICA — El Cuidado del Microbioma</dt><dd>Ingrediente de origen vegetal, asociado a la raíz de Achicoria, utilizado en fórmulas con enfoque prebiótico para acompañar el ecosistema de la piel.</dd></div>
          </dl>
        </div>
      </BordoSection>

      <aside className={styles.inci} aria-labelledby="inci-title">
        <span className={styles.inciBadge}>HERRAMIENTA DE SOBERANÍA · LA PRUEBA DEL INCI</span>
        <h2 id="inci-title">El Criterio Da Luz: La Regla de los Primeros 5 Ingredientes</h2>
        <p>Autogestión es dar vuelta el frasco y leer la lista INCI (International Nomenclature of Cosmetic Ingredients), además de escuchar la publicidad de la caja.</p>
        <p>Los primeros puestos ayudan a comprender la base de una fórmula. En sistemas de etiquetado como el de la FDA, los ingredientes por encima del 1% se declaran en orden decreciente; los presentes al 1% o menos pueden aparecer en otro orden, y existen reglas específicas para colorantes.</p>
        <p><strong>Lo que la lista puede decirte:</strong> qué ingredientes aparecen en la fórmula y cuáles integran su base. <strong>Lo que no permite deducir:</strong> porcentajes exactos, eficacia o seguridad solo por estar entre los primeros cinco puestos. Un activo en baja concentración puede cumplir una función relevante.</p>
        <p><strong>El estándar Da Luz:</strong> priorizar hidrolatos, maceraciones, lípidos vegetales y activos con una función clara. Mirá la lista completa, la etiqueta y el modo de uso; la transparencia se construye con información concreta.</p>
      </aside>

      <BordoSection title="Lo que Evitamos vs. Lo que Elegimos">
        <p>La verdadera transparencia no esconde ingredientes detrás de letras chicas. Estas son nuestras decisiones de formulación y el propósito de cada alternativa:</p>
        <BordoTable label="Manifiesto de transparencia dermo-botánica"><table><caption className={styles.caption}>Criterios de selección de materias primas Da Luz</caption><thead><tr><th scope="col">Lo que EVITAMOS</th><th scope="col">Lo que ELEGIMOS</th></tr></thead><tbody>{transparency.map(([avoid, reason, choose, benefit]) => <tr key={avoid}><td><strong>{avoid}</strong><p>{reason}</p></td><td><strong>{choose}</strong><p>{benefit}</p></td></tr>)}</tbody></table></BordoTable>
      </BordoSection>

      <BordoSection title="Respeto Celular: Fórmulas que Cuidan tu Manto Ácido">
        <div className={styles.buffer}><span className={styles.ph}>5.0 – 5.4</span><div><h3>Dermofarmacia & Sistemas Buffer</h3><p>La superficie de la piel suele ser ligeramente ácida, con variaciones individuales y según la zona. Un producto debe tener un pH compatible con su uso y con la estabilidad de sus activos.</p><p>El rango objetivo declarado por Da Luz para sus fórmulas acuosas y emulsiones es pH 5.0–5.4, utilizando reguladores como lactatos y citratos según la fórmula. Los sistemas buffer ayudan a mantener el pH dentro de un rango previsto.</p><p>Un pH adecuado acompaña la formulación, pero no garantiza ausencia de ardor, alergias ni contaminación. También importan la concentración de los activos, la conservación y tu tolerancia individual.</p></div></div>
        <p className={styles.safety}>Realizá una prueba de parche según la etiqueta. Ante ardor o enrojecimiento persistente, suspendé y consultá. Encontrá más pautas en <Link href="/origen/saber-seguro">Saber Seguro</Link>.</p>
      </BordoSection>
      <div className={styles.references}><span>Para seguir aprendiendo</span><a href="https://www.fda.gov/cosmetics/cosmetics-labeling-regulations/summary-cosmetics-labeling-requirements">FDA · Orden de ingredientes en el etiquetado</a><a href="https://www.fda.gov/cosmetics/ingredients/parabens-cosmetics">FDA · Conservantes y parabenos</a></div>
    </TemplateBordo>
  );
}
