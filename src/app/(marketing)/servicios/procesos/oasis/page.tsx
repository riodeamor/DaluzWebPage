import type { Metadata } from "next";
import TemplateAzul from "@/components/layout/TemplateAzul";
import {
  ProcesosBadges,
  ProcesosTable,
} from "@/components/marketing/ProcesosContent";
export const metadata: Metadata = {
  title: {
    absolute:
      "Oasis: Navegando Mis Aguas | Acompañamiento 1:1 de Alquimia Emocional | Da Luz",
  },
  description:
    "Desactivá el estrés crónico, la rumiación mental y la complacencia vincular. Proceso cíclico 1:1 de flores de Bach, neurobiología olfativa y regulación somática.",
  keywords: [
    "regulación del sistema nervioso córdoba",
    "terapia floral personalizada flores de bach",
    "sanar la complacencia y límites",
    "rumiación mental e insomnio por ansiedad",
    "terapia somática nervio vago",
  ],
  alternates: {
    canonical: "https://www.daluzconsciente.com/servicios/procesos/oasis",
  },
  openGraph: {
    title:
      "Oasis: Navegando Mis Aguas | Acompañamiento 1:1 de Alquimia Emocional | Da Luz",
    description:
      "Desactivá el estrés crónico, la rumiación mental y la complacencia vincular. Proceso cíclico 1:1 de flores de Bach, neurobiología olfativa y regulación somática.",
    url: "https://www.daluzconsciente.com/servicios/procesos/oasis",
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
      "Oasis: Navegando Mis Aguas | Acompañamiento 1:1 de Alquimia Emocional | Da Luz",
    description:
      "Desactivá el estrés crónico, la rumiación mental y la complacencia vincular. Proceso cíclico 1:1 de flores de Bach, neurobiología olfativa y regulación somática.",
    images: ["/og-image.jpg"],
  },
};
export default function OasisPage() {
  return (
    <TemplateAzul
      kicker={
        "ACOMPAÑAMIENTO 1:1 · 3 A 6 MESES (CICLOS ARQUETÍPICOS) · PRESENCIAL EN CÓRDOBA & VIRTUAL"
      }
      title={"OASIS: Navegando Mis Aguas"}
      quote={
        '"Un puente entre el cuerpo físico, el subconsciente y la frecuencia de tu Ser."'
      }
      subtitle={
        "Proceso Cíclico de Depuración Emocional, Alquimia Vibracional y Reconfiguración Subconsciente a través de los 6 Ejes Astrológicos. Un espacio de alta contención individual para apagar la alarma del estrés, disolver la rumiación mental y reeducar tu respuesta celular a través de la terapia floral, la neurobiología olfativa y el trabajo somático."
      }
      buttonText={"🌊 POSTULARME A MI OASIS PERSONAL"}
      buttonLink={
        "https://wa.me/5493512344580?text=Hola%20Gala%2C%20quiero%20postularme%20a%20mi%20Oasis%20personal%20y%20recibir%20el%20cuestionario%20de%20admisi%C3%B3n."
      }
    >
      <ProcesosBadges
        items={[
          "✦ 1 Sesión Profunda al Mes (Presencial 2 hs en consultorio / Virtual 90 min vía Zoom)",
          "✦ Elixir Aromático Ritual + Gotero Floral Personalizado despachado a tu casa cada mes",
          "✦ Armonización Somática Integrada (Reiki, Cuencos Tibetanos y Frecuencias Acústicas)",
          "✦ Compromiso Flexible: Ciclo Raíz (3 Meses) o Rueda Arquetípica Completa (6 Meses)",
        ]}
      />
      <section aria-labelledby="oasis-seccion-1">
        <h2 id="oasis-seccion-1">
          {
            'El Costo Invisible de Decir que "Sí" por Fuera Mientras tu Cuerpo Grita que "No"'
          }
        </h2>
        <p>
          {
            'Vivimos en una cultura de la inmediatez y la hiperdisponibilidad que premia la autoexigencia y castiga la pausa. Sin darte cuenta, tu sistema nervioso simpático quedó trabado en el interruptor de "modo supervivencia":'
          }
        </p>
        <ul>
          <li>
            {
              "Vivís con una prisa sorda en el pecho, anticipando catástrofes que jamás suceden."
            }
          </li>
          <li>
            {
              'Te cuesta decir que "NO": aceptás compromisos por miedo a defraudar, acumulando una irritabilidad silenciosa que luego somatizás.'
            }
          </li>
          <li>
            {
              "De noche tu mente se convierte en un tribunal: repasás conversaciones, te juzgás y rumiás sin tregua."
            }
          </li>
          <li>
            {
              "Tu mandíbula amanece apretada (bruxismo) y tus hombros viven cerca de las orejas como un escudo permanente."
            }
          </li>
        </ul>
        <h3>{"Tu cuerpo no está roto ni tu mente es tu enemiga."}</h3>
        <p>
          {
            'Cuando las emociones no se procesan en el momento, el subconsciente las retiene en la fascia y en el biocampo. No podés resolver la angustia exigiéndote "pensar en positivo": necesitás devolverle a tu biología la experiencia física de la seguridad somática. Oasis es el remanso individual donde desarmamos la coraza para que tus aguas vuelvan a fluir limpias.'
          }
        </p>
      </section>
      <section aria-labelledby="oasis-seccion-2">
        <h2 id="oasis-seccion-2">
          {"Abordaje Simétrico en 4 Niveles de Integración"}
        </h2>
        <h3>{"Cada mes abordamos tu momento desde 4 puertas de entrada:"}</h3>
        <details>
          <summary>
            {"🧠 Lo Mental / Subconsciente (Péndulo Evolutivo)"}
          </summary>
          <p>
            {
              'Leemos "la punta del iceberg" e indagamos en el subconsciente para desmantelar creencias limitantes e incoherencias internas sin pasar por el juicio del ego.'
            }
          </p>
        </details>
        <details>
          <summary>
            {"💬 Lo Conversacional (Indagación Biopsicoemocional)"}
          </summary>
          <p>
            {
              "Escuchamos la raíz del síntoma y exploramos el espacio entre lo que pensás, sentís y hacés con honestidad radical."
            }
          </p>
        </details>
        <details>
          <summary>
            {
              "💧 Lo Emocional / Frecuencial (Flores de Bach + Elixir Aromático Ritual)"
            }
          </summary>
          <ul>
            <li>
              {
                "Flores de Bach: Reeducan la respuesta emocional de tus células ante los disparadores cotidianos, disolviendo la rumiación nocturna y la ansiedad."
              }
            </li>
            <li>
              {
                "Elixir Aromático (Línea Alma Terra): Estímulo olfativo directo al sistema límbico que reduce el cortisol e induce calma en segundos por anclaje neuroasociativo."
              }
            </li>
          </ul>
        </details>
        <details>
          <summary>
            {"🧘‍♀️ Lo Somático / Cuerpo (Movimiento, Reiki & Sonido)"}
          </summary>
          <p>
            {
              "Descargamos tensiones físicas retenidas en la fascia, liberamos corazas musculares y reeducamos el tono vagal del sistema nervioso."
            }
          </p>
        </details>
      </section>
      <section aria-labelledby="oasis-seccion-3">
        <h2 id="oasis-seccion-3">{"La Biología Acompañando a la Emoción"}</h2>
        <p>
          {
            "La fitoterapia y la atención a la salud hormonal atraviesan transversalmente todo el proceso."
          }
        </p>
        <p>
          {
            "Desde nuestro primer encuentro, a través de tu Anamnesis de Ingreso, evaluamos integralmente tus necesidades biológicas. Si además de explorar tu tecnología emocional deseás acompañar tus síntomas físicos desde la medicina natural, abriremos el botiquín de tinturas madres, hierbas medicinales y sugerencias de estudios clínicos para revisar ejes hormonales."
          }
        </p>
        <p>
          {
            "Si durante el proceso tu cuerpo somatiza como respuesta al procesamiento emocional o mental, aprendemos a reorientar la atención hacia lo PRIORITARIO, ajustando tu protocolo sin perder la continuidad del camino."
          }
        </p>
      </section>
      <section aria-labelledby="oasis-seccion-4">
        <h2 id="oasis-seccion-4">
          {"El Recorrido por los 6 Espejos de tu Psique"}
        </h2>
        <h3>
          {
            "(En tu Sesión 1 determinaremos juntas cuál es tu punto de partida ideal según la incoherencia que estés transitando hoy):"
          }
        </h3>
        <ProcesosTable
          caption={"Los 6 ejes arquetípicos"}
          columns={[
            "Mes / Eje Zodiacal",
            "Territorio de Indagación & Desafío",
            "💡 La Vivencia Real Cotidiana (El Patrón a Sanar)",
            "Medicina Viva & Pauta Somática",
          ]}
          rows={[
            [
              "MES 1\n💨 Aries - Libra",
              'Yo, el Otro y los Límites Sanos: Reclamar tu deseo individual, sanar la complacencia, trascender la impaciencia y decir "NO" sin culpa.',
              'Vivir apurada y con impaciencia constante. Decir que "sí" a compromisos sociales, laborales o de pareja que no querés hacer, guardando una bronca e irritabilidad silenciosa por miedo a que el otro se enoje, te juzgue o te rechace.',
              'Flores: Centaury, Cerato, Impatiens.\nElixir: Romero y Bergamota.\nSomática: Liberación mandibular y empuje sagrado ("Hasta acá llego yo").',
            ],
            [
              "MES 2\n💧 Tauro - Escorpio",
              "Valor, Materia y Miedo a Soltar: Desmantelar patrones de escasez, reconectar con el goce del cuerpo y drenar aguas emocionales intensas sin ahogarte en ellas.",
              "Desconectarte de tu cuerpo y negar el autocuidado somático (no pausar, no tocarte). Quedarte rumiando en emociones densas, o intentar tapar el vacío y la angustia con compras, comida o hiperactividad para no sentir la sombra.",
              "Flores: Chicory, Rock Rose, Willow.\nElixir: Incienso y Naranja Dulce.\nSomática: Ablandamiento de la armadura abdominal y ritual de transmutación al fuego.",
            ],
            [
              "MES 3\n🔥 Géminis - Sagitario",
              "La Mente, Creencias y la Verdad: Calmar el parloteo ansioso, reeducar la conversación interna y pasar del ruido mental a la intuición clara.",
              "Cabeza a mil por la noche anticipando escenarios catastróficos. No poder parar de pensar; endiosar el intelecto y el consumo de información para tapar el vacío y evitar un diálogo silencioso con tu propio Ser.",
              "Flores: White Chestnut, Wild Oat.\nElixir: Menta y Lavanda pura.\nSomática: Pranayama Nadhi Shodhana (respiración alternada) para balance hemisférico.",
            ],
            [
              "MES 4\n🌱 Cáncer - Capricornio",
              "El Nido, Emociones y Estructura: Sanar memorias de infancia, desarmar el perfeccionismo defensivo y asentarte en la Adulta Soberana responsable de su propio sostén.",
              "Cargar sobre tus espaldas los problemas de tu clan familiar o exigirte un perfeccionismo agotador por miedo a no ser suficiente. Creer que tus heridas del pasado te condenan, descuidando tu descanso básico.",
              "Flores: Red Chestnut, Oak, Pine.\nElixir: Vetiver y Cedro noble.\nSomática: Anclaje óseo en pared y el Abrazo Soberano de autocontención.",
            ],
            [
              "MES 5\n🌌 Leo - Acuario",
              "Expresión del Corazón y Pertenecer: Reconquistar tu brillo personal, liberarte de la necesidad de aprobación y habitar tu autenticidad sin miedo al rechazo.",
              'Esconder tus dones, talentos o ideas por vergüenza a "sobresalir", o adaptarte rígidamente a lo que los demás esperan de vos para sentir que pertenecés, postergando la verdadera voz de tu corazón.',
              "Flores: Larch, Water Violet, Mimulus.\nElixir: Ylang Ylang y Mandarina.\nSomática: Apertura del centro cardíaco y emisión de voz diafragmática para la garganta.",
            ],
            [
              "MES 6\n✨ Virgo - Piscis",
              "El Cuerpo, la Medicina y la Entrega: Armonizar el orden y el cuidado biológico con la fluidez y la paz espiritual, soltando el hipercontrol.",
              "Vivir volada y disociada del plano físico, o por el contrario, anclarte de forma rígida a expectativas perfeccionistas que nunca se cumplen, atrapándote en un bucle de frustración, control de rutinas y pérdida del goce.",
              "Flores: Rock Water, Crab Apple, Mustard.\nElixir: Sándalo ético y Geranio.\nSomática: Danza Tandava en movimientos infinitos (en 8) para disolver rigideces.",
            ],
          ]}
        />
      </section>
      <section aria-labelledby="oasis-seccion-5">
        <h2 id="oasis-seccion-5">{"Elegí tu Formato de Trabajo"}</h2>
        <ul>
          <li>{"🏡 MODALIDAD PRESENCIAL (En Consultorio Córdoba):"}</li>
          <li>
            {
              "Encuentro mensual de 2 horas de duración en consultorio sahumado y protegido."
            }
          </li>
          <li>
            {
              "Mapeo con Péndulo + Indagación Biopsicoemocional + Entrega de Flores de Bach y Elixir en mano."
            }
          </li>
          <li>
            {
              "Armonización Somática en camilla: Sahumo de resinas, Reiki táctil, Gemoterapia anatómica y Sonoterapia en vivo con Cuencos de Cristal y Bronce y Tambor Chamánico."
            }
          </li>
          <li>{"💻 MODALIDAD VIRTUAL (Vía Zoom Internacional):"}</li>
          <li>{"Encuentro mensual de 90 minutos de duración en vivo."}</li>
          <li>{"Mapeo Subconsciente con Péndulo a distancia + Indagación."}</li>
          <li>{"Reiki a distancia y armonización de chakras."}</li>
          <li>
            {
              "Despacho a domicilio de tu Fórmula Floral personalizada + Elixir Aromático Ritual."
            }
          </li>
          <li>
            {
              "Audio MP3 exclusivo de Sintonía Frecuencial e Inducción Somática para casa."
            }
          </li>
        </ul>
      </section>
      <section aria-labelledby="oasis-seccion-6">
        <h2 id="oasis-seccion-6">{"La Evolución de tu Recorrido"}</h2>
        <ul>
          <li>
            {
              "Cierre y Celebración: Este viaje constituye un fin sagrado y completo en sí mismo. Te graduás habitando tu propia soberanía y con herramientas de autogestión cotidianas."
            }
          </li>
          <li>
            {
              "⚠️ Pausa de Integración de 33 Días (Requisito para dar el gran salto): Si deseás continuar hacia la depuración biológica profunda de METAMORFOSIS, nos tomaremos un período obligatorio de al menos 33 días. Tu cuerpo físico y tu psique necesitan integrar por completo lo transformado antes de abrir un nuevo portal depurativo."
            }
          </li>
          <li>
            {
              "Mantenimiento Cíclico: Consultas trimestrales de ajuste y armonización para sostener tu eje de forma autónoma."
            }
          </li>
        </ul>
      </section>
      <section aria-labelledby="oasis-seccion-7">
        <h2 id="oasis-seccion-7">{"Modalidades de Compromiso"}</h2>
        <ul>
          <li>
            {
              "OPCIÓN A | EL CICLO RAÍZ (3 Meses): Rescate somático urgente, orden mental y límites sagrados (Ejes 1, 2 y 3)."
            }
          </li>
          <li>
            {
              "OPCIÓN B | LA RUEDA ARQUETÍPICA COMPLETA (6 Meses): Viaje integral de refundación personal, maternaje interno y soberanía (Los 6 Ejes)."
            }
          </li>
          <li>
            {
              "Beneficios especiales: 10% OFF en abono trimestral | 15% OFF en abono semestral + Kit Alquímico de la Valentía de Regalo 🎁."
            }
          </li>
        </ul>
        <h3>{"🎁 El Kit Alquímico de la Valentía incluye:"}</h3>
        <p>
          {
            '1. Roll-On Alquímico de Bolsillo "Ancla de Presencia": Aceite vehicular con aceites esenciales puros y gemas maceradas para autorregulación somática en momentos de crisis.'
          }
        </p>
        <h3>
          {
            '2. Bitácora Física de Savoring & Acecho "Altar de Papel": Cuaderno impreso exclusivo para el registro cotidiano de tus 6 meses.'
          }
        </h3>
        <h3>
          {
            '3. Viaje Sonoro Exclusivo en MP3: Audio de inducción somática y frecuencia vibracional "Anclaje en la Adulta Soberana" + 2 audios extra.'
          }
        </h3>
      </section>
    </TemplateAzul>
  );
}
