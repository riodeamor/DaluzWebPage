import type { Metadata } from "next";
import TemplateAzul from "@/components/layout/TemplateAzul";
import {
  ProcesosBadges,
  ProcesosTable,
  ProcesosQuote,
} from "@/components/marketing/ProcesosContent";
export const metadata: Metadata = {
  title: {
    absolute:
      "Metamorfosis: Mentoría 1:1 de Depuración Biológica y Fitoterapia | Da Luz",
  },
  description:
    "Desactivá el síntoma en su raíz física y subconsciente. 5 meses de depuración de tus 5 filtros biológicos, fitoterapia clínica y seguimiento diario por voz.",
  keywords: [
    "depuración de órganos emuntorios",
    "fitoterapia clínica personalizada",
    "biodescodificación síntomas crónicos",
    "reseteo digestivo hepático",
    "mentoría biológica individual",
  ],
  alternates: {
    canonical:
      "https://www.daluzconsciente.com/servicios/procesos/metamorfosis",
  },
  openGraph: {
    title:
      "Metamorfosis: Mentoría 1:1 de Depuración Biológica y Fitoterapia | Da Luz",
    description:
      "Desactivá el síntoma en su raíz física y subconsciente. 5 meses de depuración de tus 5 filtros biológicos, fitoterapia clínica y seguimiento diario por voz.",
    url: "https://www.daluzconsciente.com/servicios/procesos/metamorfosis",
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
    title:
      "Metamorfosis: Mentoría 1:1 de Depuración Biológica y Fitoterapia | Da Luz",
    description:
      "Desactivá el síntoma en su raíz física y subconsciente. 5 meses de depuración de tus 5 filtros biológicos, fitoterapia clínica y seguimiento diario por voz.",
    images: ["/og-image.jpg"],
  },
};
export default function MetamorfosisPage() {
  return (
    <TemplateAzul
      kicker={
        "ACOMPAÑAMIENTO PRIVADO 1:1 · CUPOS ESTRICTAMENTE LIMITADOS A 4 CONSULTANTES POR COHORTE"
      }
      title={
        "METAMORFOSIS: Depuración Orgánica, Fitoterapia Clínica y Reprogramación Biopsicoemocional (5 Meses)"
      }
      quote={
        '"Siento creer que el futuro es volver al origen. Sin semilla no hay fruto."'
      }
      subtitle={
        "Una intervención quirúrgica individual de 5 meses diseñada para resetear tus 5 filtros emuntorios (hígado/vesícula, intestinos, riñones, sangre/linfa y sistema nervioso) mediante fitoterapia amarga de precisión, descompresión de la fascia corporal y desprogramación de lealtades inconscientes al clan."
      }
      buttonText={"📋 POSTULARME A METAMORFOSIS (CUESTIONARIO DE ADMISIÓN)"}
      buttonLink={
        "https://wa.me/5493512344580?text=Hola%20Gala%2C%20quiero%20postularme%20a%20Metamorfosis%20y%20recibir%20el%20cuestionario%20de%20admisi%C3%B3n."
      }
    >
      <ProcesosBadges
        items={[
          "✦ 100% Personalizado 1:1 (Modalidad Presencial en Córdoba u Online a todo el mundo)",
          "✦ Botiquín Alquímico a Medida (Tinturas Madre del Territorio + Fórmulas Florales)",
          "✦ Acompañamiento Diario por Voz de Lunes a Viernes (Canal Privado VIP con Gala)",
          "✦ Admisión Exclusiva con Anamnesis Fisiológica Previa",
        ]}
      />
      <section aria-labelledby="metamorfosis-seccion-1">
        <h2 id="metamorfosis-seccion-1">
          {"¿Tu Cuerpo Quedó Atrapado en un Bucle Inflamatorio?"}
        </h2>
        <h3>
          {
            "La Mente Entiende el Conflicto, pero los Órganos Siguen Sosteniendo la Carga."
          }
        </h3>
        <p>
          {
            "En este momento sociocultural, la prisa, la hiperconectividad y el mandato de rendimiento nos llenan de ansiedad, alejándonos del único tiempo real: el presente. Vivimos atascadas en piloto automático, repitiendo secuencias, vínculos y actitudes automáticas que nos limitan y enferman."
          }
        </p>
        <p>
          {
            "Desconectarnos para no sentir dolor o taponar nuestras emociones no hace que estas desaparezcan; el cuerpo guarda la memoria de todo lo que la mente calla. Podés haber leído decenas de libros de desarrollo personal, hecho años de terapia convencional e identificado de memoria tus heridas de infancia. Sin embargo, cuando llega la tarde:"
          }
        </p>
        <ul>
          <li>
            {
              "Tu vientre se distiende como si tuvieras un embarazo de meses (inflamación abdominal / disbiosis)."
            }
          </li>
          <li>
            {
              "Te despertás sobresaltada entre la 1:00 AM y las 3:00 AM (la hora del reloj biológico en que el Hígado colapsa de toxinas y rabia no drenada)."
            }
          </li>
          <li>
            {
              "El Síndrome Premenstrual te arrasa con migrañas punzantes en las sienes, retención de líquidos o dolor pélvico incapacitante."
            }
          </li>
          <li>
            {
              "Sentís una fatiga densa en los huesos que no se repara durmiendo diez horas."
            }
          </li>
        </ul>
        <h3>{"¿Por qué no se resuelve pensando en positivo?"}</h3>
        <p>
          {
            "Porque los tratamientos fracasan al intentar cambiar la conducta o el pensamiento sin modificar la estructura biológica. Toda emoción retenida (la bronca reprimida por decir que sí a todo, la culpa por desear más, el miedo al desamparo) se cristaliza químicamente como estancamiento biliar, acidez tisular, permeabilidad intestinal y rigidez en la fascia."
          }
        </p>
        <p>
          {
            "No podés instalar un software de soberanía personal si el hardware de tus órganos está intoxicado. Metamorfosis no es una charla motivacional: es una intervención clínica sobre el terreno vivo."
          }
        </p>
      </section>
      <section aria-labelledby="metamorfosis-seccion-2">
        <h2 id="metamorfosis-seccion-2">
          {"La Arquitectura de tu Transformación"}
        </h2>
        <ProcesosTable
          caption={"Los 4 pilares de soberanía"}
          columns={[
            "Pilar Maestro",
            "Territorio de Acción Celular",
            "Transformación Soberana",
          ]}
          rows={[
            [
              "🧠 1. Desprogramación del Piloto Automático",
              "Mente & Neurobiología",
              "Cortar el circuito de automatismos y desmantelar los bucles e incoherencias interiores que te quitan la paz.",
            ],
            [
              "🧬 2. Reprogramación Neurobiológica",
              "Subconsciente & Clan",
              "Aprovechar la neuroplasticidad para disolver lealtades del clan familiar y heridas de la niñez, instalando nuevos cableados.",
            ],
            [
              "🌿 3. Soberanía de Salud Integral",
              "Fisiología & Fitoterapia",
              "Volver a la medicina de la Tierra (fitoterapia ancestral y clínica) para autogestionar tu equilibrio de manera preventiva.",
            ],
            [
              "🕊️ 4. Creación del Futuro desde la Presencia",
              "Materia & Realidad",
              "Comprender que el futuro no está predestinado: se construye hoy con decisiones tomadas desde la presencia absoluta.",
            ],
          ]}
        />
      </section>
      <section aria-labelledby="metamorfosis-seccion-3">
        <h2 id="metamorfosis-seccion-3">{"Depuración Orgánica sin Castigo"}</h2>
        <p>
          {
            "El proceso se sostiene sobre un Protocolo de Depuración Orgánica Integral con Hierbas Medicinales de Precisión."
          }
        </p>
        <p>
          {
            "Entendemos el síntoma no como un enemigo a acallar, sino como una puerta de acceso al subconsciente. Al interactuar con la medicina vegetal, no solo eliminamos toxinas físicas de tus filtros biológicos; aflojamos el terreno interior para que las emociones estancadas emerjan, se reconozcan y sean alquimizadas."
          }
        </p>
        <h3>{"✨ El Pilar Maestro: La Transgozación"}</h3>
        <ProcesosQuote
          text={
            "«El proceso sucede desde el goce. Sin disfrute, las resistencias y censores mentales nos ganan; desde el amor, la compasión y el placer, la transformación es sostenible y definitiva.»"
          }
        />
      </section>
      <section aria-labelledby="metamorfosis-seccion-4">
        <h2 id="metamorfosis-seccion-4">
          {"El Algoritmo Biológico Paso a Paso"}
        </h2>
        <h3>
          {
            "Transitaremos simétricamente los 5 elementos, los 5 filtros orgánicos y tus 4 cuerpos (físico, mental, emocional y energético):"
          }
        </h3>
        <ProcesosTable
          caption={"El sendero de los 5 meses"}
          columns={[
            "Mes / Ciclo",
            "Elemento & Órganos Objetivo",
            "Fitoquímica & Territorio de Indagación",
            "Transformación Soberana",
          ]}
          rows={[
            [
              "MES 1",
              "💨 AIRE\n(Intestino Delgado & Corazón)",
              'Apertura del Emuntorio Principal: Mucílagos reparadores y plantas de arrastre. Bajar la energía de la cabeza a la tierra, desinflamar el tubo digestivo y calmar el "hormiguero mental".',
              "Claridad & Siembra: Niebla mental despejada, restauración del eje intestino-microbiota e intención anclada en la materia.",
            ],
            [
              "MES 2",
              "💧 AGUA\n(Intestino Grueso & Pulmones)",
              "Depuración de las Aguas Emocionales: Drenaje de toxinas retenidas, liberación de apegos, lealtades del clan y heridas de la infancia. Alivio de la tristeza en el tejido pulmonar.",
              "Raíz Ancestral: Limpieza de la herencia pesada, liviandad en la evacuación y reencuentro con la niña interior.",
            ],
            [
              "MES 3",
              "🔥 FUEGO\n(Hígado & Riñones)",
              "El Fuego Hepático-Biliar: Principios amargos del territorio (Diente de León, Carqueja, Alcaucil) bajo cimática. Drenaje biliar profundo, transmutación de la ira reprimida y fin del insomnio a las 3 AM.",
              "Poder Personal: Quema de resistencias, desintoxicación celular, superación de la culpa y activación del motor del deseo.",
            ],
            [
              "MES 4",
              "🌱 TIERRA\n(Útero, Sangre & Huesos)",
              "El Laboratorio Celular: Depuración linfática profunda, oxigenación y balance del ciclo hormonal/menopáusico. Sanación de la desvalorización y reconstrucción de límites sagrados.",
              "Sustento & Estructura: Construcción de un hogar interno seguro, modulación estrogénica y derecho a recibir plenamente habilitado.",
            ],
            [
              "MES 5",
              "🌌 ÉTER\n(Sistema Nervioso & Estómago)",
              "Consolidación & Eje Nervioso: Adaptógenos botánicos y tónicos nervinos. Sellado de la barrera cutánea e intestinal. Fijación de la nueva homeostasis metabólica (Savoring).",
              "Adulta Soberana: Retorno al cotidiano habitando la Espiral de la Vida sin síntomas, graduada con su propio mapa de autogestión.",
            ],
          ]}
        />
      </section>
      <section aria-labelledby="metamorfosis-seccion-5">
        <h2 id="metamorfosis-seccion-5">
          {"El Ecosistema Completo de Acompañamiento"}
        </h2>
        <ul>
          <li>
            {
              "🕯️ 1 Encuentro Clínico Profundo al Mes (Duración: 90 a 120 minutos en vivo · Presencial en Córdoba o Zoom): Anamnesis del ciclo, rastreo radiestésico con Péndulo Evolutivo, biodecodificación del síntoma y entrega del protocolo fitoterapéutico."
            }
          </li>
          <li>
            {
              '💬 Acompañamiento VIP Diario por Voz (Lunes a Viernes vía WhatsApp/Telegram): No estás sola entre sesiones. Canal privado directo con Gala para monitorear crisis depurativas ("emergencias de barro"), modular dosificación de gotas y descargar desbordes emocionales en tiempo real.'
            }
          </li>
          <li>
            {
              "🌿 Tu Botiquín Alquímico Físico Elaborado a Medida: Despacho mensual a domicilio de tus extractos hidroalcohólicos (Tinturas Madre de alta concentración del monte), Microdosis de la Línea Jade y preparado exclusivo de Flores de Bach."
            }
          </li>
          <li>
            {
              "🎧 5 Viajes Sonoros e Inducciones en MP3 (Frecuencia 432 Hz): Meditaciones e inducciones somáticas grabadas con la voz de Gala para reprogramación subconsciente y anclaje celular en casa."
            }
          </li>
          <li>{"📚 Biblioteca de Autogestión & Altar de Papel:"}</li>
          <li>
            {
              "2 Archivos Marco: Manual de Depuración Orgánica + Menú de Mapas de Autoconocimiento (Astro / Eneagrama / Numerología)."
            }
          </li>
          <li>
            {
              "5 PDFs de Ingesta & Cuidados: Guía detallada de uso, botánica y vínculo con la planta medicinal de cada mes."
            }
          </li>
          <li>
            {
              "5 PDFs de Ejercicios & Acecho: 3 prácticas somáticas y de escritura guiada por cada ciclo."
            }
          </li>
          <li>
            {
              "1 Bitácora de Hábitos Diarios: Tu botiquín cotidiano de anclaje (decretos matutinos, anclas somáticas y técnica de savoring)."
            }
          </li>
          <li>
            {
              "🧬 Protocolo de Desprogramación Transgeneracional: Ejercicios de corte de lealtades invisibles al clan y reprogramación neuroasociativa del síntoma."
            }
          </li>
        </ul>
      </section>
      <section aria-labelledby="metamorfosis-seccion-6">
        <h2 id="metamorfosis-seccion-6">
          {"A Quién Espanta y a Quién Seduce"}
        </h2>
        <h3>
          {
            "Para garantizar la integridad y seguridad clínica del proceso, Metamorfosis NO es para vos si:"
          }
        </h3>
        <ul>
          <li>
            {
              '❌ Buscás una "pastilla mágica" o pretendés que una terapeuta te solucione la vida sin modificar tus hábitos.'
            }
          </li>
          <li>
            {
              "❌ Estás transitando un embarazo o período de lactancia exclusiva (la fitoterapia depurativa profunda está contraindicada)."
            }
          </li>
          <li>
            {
              "❌ Estás bajo medicación psiquiátrica no estabilizada o anticoagulantes orales que interactúen con principios fitoquímicos."
            }
          </li>
          <li>
            {
              "❌ No estás dispuesta a comprometerte con la ingesta rigurosa de tus preparados y el registro consciente de tu cuerpo."
            }
          </li>
        </ul>
        <h3>{"Metamorfosis ES para vos si:"}</h3>
        <ul>
          <li>
            {
              "✔ Asumís el 100% de la responsabilidad sobre tu biología y estás lista para desarmar el papel de víctima."
            }
          </li>
          <li>
            {
              "✔ Comprendés que el cuerpo necesita tiempo biológico real (5 meses) para regenerar tejidos y recablear circuitos neuronales."
            }
          </li>
          <li>
            {
              "✔ Valorás la cercanía, la precisión técnica y un acompañamiento privado de máxima excelencia."
            }
          </li>
        </ul>
      </section>
      <section aria-labelledby="metamorfosis-seccion-7">
        <h2 id="metamorfosis-seccion-7">{"Nota de tu guía"}</h2>
        <ProcesosQuote
          text={
            "«Mi rol es de facilitadora y acompañante. No estoy aquí para decirte qué hacer ni imponerte verdades, sino para brindarte las tecnologías que transformaron mi vida y me permiten autogestionar mi bienestar. Mi único propósito es devolverte la soberanía absoluta de tu cuerpo y el poder de habitarte desde la plenitud y el goce.»"
          }
          attribution={"Gala"}
        />
      </section>
      <section aria-labelledby="metamorfosis-seccion-8">
        <h2 id="metamorfosis-seccion-8">
          {"Modalidades de acceso & postulación"}
        </h2>
        <ul>
          <li>
            {
              "Modalidad Presencial (Consultorio en Córdoba) u Online Internacional (Zoom en vivo con envíos a domicilio)."
            }
          </li>
          <li>
            {
              "Pago Único Bonificado o Financiación en 5 Cuotas Mensuales fijadas al momento del ingreso."
            }
          </li>
          <li>
            {"Cupos estrictamente reducidos a 4 consultantes por cohorte."}
          </li>
        </ul>
      </section>
    </TemplateAzul>
  );
}
