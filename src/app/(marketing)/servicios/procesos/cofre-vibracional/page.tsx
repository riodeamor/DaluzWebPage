import type { Metadata } from "next";
import TemplateAzul from "@/components/layout/TemplateAzul";
import {
  ProcesosBadges,
  ProcesosTable,
} from "@/components/marketing/ProcesosContent";
export const metadata: Metadata = {
  title: {
    absolute:
      "Cofre de Tecnologías Vibracionales y Somáticas | Da Luz Consciente",
  },
  description:
    "Herramientas clínicas y sutiles: sonoterapia a 432 Hz, tambor chamánico (7.5 Hz), radiestesia evolutiva, Reiki Usui, fascia y astrología arquetípica.",
  keywords: [
    "sonoterapia cuencos tibetanos córdoba",
    "tambor chamánico ondas theta",
    "radiestesia péndulo evolutivo",
    "terapia somática corazas fasciales",
    "armonización bioenergética reiki",
    "medicina vibracional 432 hz",
    "reprogramación subconsciente protocolo cancelado",
    "biofísica somática alexander lowen",
    "desprogramación lealtades clan",
    "tesoros da luz audio ritual",
  ],
  alternates: {
    canonical:
      "https://www.daluzconsciente.com/servicios/procesos/cofre-vibracional",
  },
  openGraph: {
    title: "Cofre de Tecnologías Vibracionales y Somáticas | Da Luz Consciente",
    description:
      "Herramientas clínicas y sutiles: sonoterapia a 432 Hz, tambor chamánico (7.5 Hz), radiestesia evolutiva, Reiki Usui, fascia y astrología arquetípica.",
    url: "https://www.daluzconsciente.com/servicios/procesos/cofre-vibracional",
    type: "website",
    locale: "es_AR",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Da Luz Consciente",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cofre de Tecnologías Vibracionales y Somáticas | Da Luz Consciente",
    description:
      "Herramientas clínicas y sutiles: sonoterapia a 432 Hz, tambor chamánico (7.5 Hz), radiestesia evolutiva, Reiki Usui, fascia y astrología arquetípica.",
    images: ["/og-image.jpg"],
  },
};
export default function CofreVibracionalPage() {
  return (
    <TemplateAzul
      kicker={"BIOFÍSICA SOMÁTICA, SONIDO CEREMONIAL & REPROGRAMACIÓN CELULAR"}
      title={
        "Cofre de Tecnologías Vibracionales: Ordenar lo Sutil antes de que se Haga Síntoma"
      }
      quote={
        '"El cuerpo físico es la última frontera donde aterriza la energía: si ordenás el campo electromagnético, la biología recupera su eje sin violencia."'
      }
      subtitle={
        "Un compendio de saberes ancestrales y tecnologías de alta precisión clínica para desactivar la hipervigilancia del sistema nervioso, desarmar nudos fasciales y desarticular las lealtades invisibles que frenan tu vitalidad."
      }
      buttonText={"🔮 EXPLORAR NUESTRAS SESIONES Y PROCESOS"}
      buttonLink={"/servicios/procesos/sesiones-integrales"}
    >
      <ProcesosBadges
        items={[
          "✦ Frecuencias Acústicas de Precisión (432 Hz & 7.5 Hz en Ondas Theta)",
          "✦ Liberación Fascial Somática & Desactivación del Nervio Vago",
          "✦ Diagnóstico Radiónico con Péndulo Evolutivo (Cero Filtros del Ego)",
          "✦ Cartografía del Ser: Astrología Arquetípica & Eneagrama",
        ]}
      />
      <section aria-labelledby="cofre-vibracional-seccion-1">
        <h2 id="cofre-vibracional-seccion-1">
          {
            "El Sonido como Cirugía Sutil: Ondas que Reordenan el Agua Intracelular"
          }
        </h2>
        <p>
          {
            "El sonido no es entretenimiento auditivo: es una fuerza física que viaja a través del tejido corporal (compuesto en más de un 70% por agua y minerales piezoeléctricos en la fascia). En nuestras sesiones e intervenciones utilizamos dos herramientas maestras:"
          }
        </p>
        <h3>{"1. Tambor Chamánico Ceremonial (Frecuencia 7.5 Hz):"}</h3>
        <p>
          {
            "Su pulso rítmico binaural induce de forma inmediata la desaceleración de las ondas cerebrales desde el estado Beta (hiperalerta y control) hacia el estado Theta. Esta frecuencia apaga el censor analítico de la corteza prefrontal, permitiendo acceder al material subconsciente no resuelto sin generar dolor ni resistencia."
          }
        </p>
        <h3>{"2. Cuencos Tibetanos y de Cuarzo Cristal (432 Hz):"}</h3>
        <p>
          {
            "Generan un baño de armónicos puros que disuelven la estática bioeléctrica acumulada por estrés crónico y contaminación electromagnética. Estimulan la secreción de endorfinas, serotonina y melatonina, induciendo la regeneración celular."
          }
        </p>
        <h3>{"🎁 El Tesoro Da Luz (Audio Ritual de Regalo):"}</h3>
        <p>
          {
            "Al igual que cada fórmula Alkimya tiene su Tesoro, cada proceso individual incluye un Audio Sonoro Ritual grabado en vivo con nuestros instrumentos ceremoniales para que puedas reactivar en casa el mismo estado de paz celular cada vez que lo necesites."
          }
        </p>
      </section>
      <section aria-labelledby="cofre-vibracional-seccion-2">
        <h2 id="cofre-vibracional-seccion-2">
          {"Canalización Bioenergética y Sellado del Biocampo"}
        </h2>
        <ul>
          <li>
            {
              'Reiki Usui & Imposición de Manos: La fuerza vital universal (Prana o Ki) aplicada con rigor sobre los principales vórtices de energía y plexos nerviosos. No busca "arreglarte", sino brindarle a tu sistema un canal de coherencia para que tu propia inteligencia biológica descongestione los bloqueos térmicos y eléctricos.'
            }
          </li>
          <li>
            {
              "Gemoterapia & Geometría Mineral: Utilización anatómica de cristales maestros (cuarzos hialinos, turmalinas negras, selenitas y fluoritas). La red cristalina perfecta de un mineral actúa como un atractor de frecuencia que absorbe la densidad estancada en los meridianos y sella las fugas del campo áurico."
            }
          </li>
        </ul>
      </section>
      <section aria-labelledby="cofre-vibracional-seccion-3">
        <h2 id="cofre-vibracional-seccion-3">
          {"Cuando la Tensión Emocional se Hace Músculo Petríficado"}
        </h2>
        <p>
          {
            "La mente puede olvidar, pero la fascia corporal jamás olvida. Cuando una emoción es reprimida sistemáticamente, el sistema nervioso simpático tensa grupos musculares para no sentir. Basándonos en la bioenergética de Alexander Lowen y la teoría polivagal:"
          }
        </p>
        <ul>
          <li>
            {
              "Desmantelamiento de Corazas: Intervenimos sobre los 5 anillos de tensión muscular crónica:"
            }
          </li>
        </ul>
        <p>
          {
            "1. Ocular y Mandibular (bruxismo y control) · 2. Garganta (lo que no se pudo decir) · 3. Torácico (duelo y tristeza retenida) · 4. Diafragmático (la contención del llanto o la rabia) · 5. Pélvico (bloqueo del deseo y la vitalidad raíz)."
          }
        </p>
        <ul>
          <li>
            {
              "Breathwork Somático de Regulación Vagal: Protocolos de respiración nasal con exhalación prolongada que le demuestran fisiológicamente al tronco encefálico que el peligro terminó, devolviendo el tono al nervio vago ventral."
            }
          </li>
        </ul>
      </section>
      <section aria-labelledby="cofre-vibracional-seccion-4">
        <h2 id="cofre-vibracional-seccion-4">
          {"Diagnóstico Subconsciente y el Protocolo de Cancelación Radical"}
        </h2>
        <ul>
          <li>
            {
              "El Péndulo Evolutivo y las Varas Radiónicas: Instrumentos de respuesta neuromuscular de alta sensibilidad. Permiten realizar un escaneo directo de los cuerpos sutiles para identificar dónde radica el origen exacto del bloqueo: ¿es un desequilibrio orgánico, una herida biográfica o una lealtad al clan transgeneracional?"
            }
          </li>
          <li>
            {
              'Protocolo de Cancelación Radical: El subconsciente procesa más de 60.000 pensamientos automáticos al día. Cuando identificamos una creencia limitante o mandato de sufrimiento, aplicamos en sesión el anclaje neuroasociativo: "CANCELADO" x3, acompañado de la visualización de la Cruz Blanca mental, cortando el circuito sináptico obsoleto para sembrar la nueva respuesta en 21 días.'
            }
          </li>
        </ul>
      </section>
      <section aria-labelledby="cofre-vibracional-seccion-5">
        <h2 id="cofre-vibracional-seccion-5">
          {"El Mapa de Navegación de tu Personalidad"}
        </h2>
        <h3>
          {
            "En Da Luz no adivinamos el futuro: leemos la estructura de tu psique para no forzar procesos contra natura:"
          }
        </h3>
        <h3>{"1. Astrología Evolutiva (La Brújula Elemental):"}</h3>
        <p>
          {
            "Analizamos tu tríada natal (Sol, Luna y Ascendente) para entender tu temperamento biológico y seleccionar las plantas y frecuencias que dialoguen armónicamente con tu clima cósmico."
          }
        </p>
        <h3>{"2. Eneagrama (El Desmontaje de la Máscara del Ego):"}</h3>
        <p>
          {
            "Identificamos las heridas de infancia y los mecanismos de defensa de tu eneatipo. Esto nos permite elegir las esencias florales y los ejercicios somáticos que aflojen tus mecanismos de control."
          }
        </p>
        <h3>{"3. Biodecodificación & Desmantelamiento de Lealtades:"}</h3>
        <p>
          {
            'Búsqueda del "nudo ciego" en el árbol genealógico para devolverle a tus ancestros las cargas que no te corresponden sostener.'
          }
        </p>
      </section>
      <section aria-labelledby="cofre-vibracional-seccion-6">
        <h2 id="cofre-vibracional-seccion-6">
          {"Tabla de beneficios integrativos en los 4 cuerpos"}
        </h2>
        <ProcesosTable
          caption={"Beneficios integrativos en los 4 cuerpos"}
          columns={[
            "Nivel del Ser",
            "¿Qué sucede en la experiencia?",
            "Resultado Biológico & Frecuencial",
          ]}
          rows={[
            [
              "Cuerpo Físico",
              "Masaje celular con cuencos, descompresión fascial y aromaterapia pura.",
              "Alivio de contracturas y bruxismo, descanso reparador, reducción del cortisol y ligereza orgánica.",
            ],
            [
              "Cuerpo Emocional",
              "Expresión catártica guiada, Flores de Bach y frecuencia de tambor.",
              "Calma interior, drenaje de tristezas reprimidas, cese de la reactividad y templanza somática.",
            ],
            [
              "Cuerpo Mental",
              'Bypass a la mente analítica con ondas Theta (7.5 Hz) y protocolo "CANCELADO".',
              "Foco nítido, disolución del diálogo interno autodestructivo y claridad para tomar decisiones firmes.",
            ],
            [
              "Campo Energético",
              "Limpieza áurica, armonización de chakras con Reiki y radiestesia evolutiva.",
              "Sensación de espacio interno, sellado de fugas áuricas y reconexión viva con el propósito propio.",
            ],
          ]}
        />
      </section>
      <section aria-labelledby="cofre-vibracional-seccion-7">
        <h2 id="cofre-vibracional-seccion-7">
          {"Cuando el Cofre y el Botiquín se Funden"}
        </h2>
        <h3>
          {
            "En nuestros abordajes 1:1, el Cofre de Tecnologías Vibracionales y el Botiquín Botánico no actúan por separado:"
          }
        </h3>
        <p>
          {
            "La medicina vegetal prepara el terreno físico; las frecuencias sonoras abren la receptividad celular; y las herramientas del Cofre reorganizan la información subconsciente."
          }
        </p>
        <p>
          {
            "El resultado no es un tratamiento: es un salto cuántico y biológico hacia tu Soberanía Personal."
          }
        </p>
      </section>
    </TemplateAzul>
  );
}
