import type { Metadata } from "next";
import TemplateAzul from "@/components/layout/TemplateAzul";
import SesionAction from "@/components/marketing/SesionAction";
import { ProcesosTable } from "@/components/marketing/ProcesosContent";
export const metadata: Metadata = {
  title: {
    absolute:
      "Alquimia Chamánica y Acción: Desbloqueo y Reprogramación | Da Luz",
  },
  description:
    "Desactivá bloqueos subconscientes y parálisis por análisis en 90 minutos. Radiestesia evolutiva, tambor chamánico, liberación somática y medicina viva.",
  keywords: [
    "sesión péndulo hebreo y evolutivo",
    "tambor chamánico terapia córdoba",
    "liberación emocional somática",
    "constelaciones y lealtades familiares",
    "reprogramación subconsciente",
  ],
  alternates: {
    canonical:
      "https://www.daluzconsciente.com/servicios/procesos/sesiones-integrales/alquimia-chamanica",
  },
  openGraph: {
    title: "Alquimia Chamánica y Acción: Desbloqueo y Reprogramación | Da Luz",
    description:
      "Desactivá bloqueos subconscientes y parálisis por análisis en 90 minutos. Radiestesia evolutiva, tambor chamánico, liberación somática y medicina viva.",
    url: "https://www.daluzconsciente.com/servicios/procesos/sesiones-integrales/alquimia-chamanica",
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
    title: "Alquimia Chamánica y Acción: Desbloqueo y Reprogramación | Da Luz",
    description:
      "Desactivá bloqueos subconscientes y parálisis por análisis en 90 minutos. Radiestesia evolutiva, tambor chamánico, liberación somática y medicina viva.",
    images: ["/og-image.jpg"],
  },
};
export default function AlquimiaChamanicaPage() {
  return (
    <TemplateAzul
      kicker={
        "INTERVENCIÓN ACTIVA 1:1 · 75 A 90 MINUTOS · PRESENCIAL EN CÓRDOBA & ONLINE VÍA ZOOM"
      }
      title={
        "Saber qué te pasa no alcanza: Desarmá el nudo en tu biología y reorganizá tu vida en la materia"
      }
      subtitle={
        '"Un espacio quirúrgico de 75 a 90 minutos para rastrear la raíz oculta de tu estancamiento, desalojar la carga atrapada en tu cuerpo con tecnología chamánica y formular tu Medicina Viva a medida."'
      }
      buttonText={"🔮 DESBLOQUEAR MI ENERGÍA — AGENDAR ALQUIMIA CHAMÁNICA"}
      buttonLink={
        "https://wa.me/5493512344580?text=Hola%20Gala%2C%20quiero%20agendar%20Alquimia%20Cham%C3%A1nica%20%26%20Acci%C3%B3n."
      }
    >
      <SesionAction
        href={
          "https://wa.me/5493512344580?text=Hola%20Gala%2C%20quiero%20agendar%20Alquimia%20Cham%C3%A1nica%20%26%20Acci%C3%B3n."
        }
        label={"🔮 RESERVAR ALQUIMIA CHAMÁNICA & ACCIÓN"}
      />
      <section aria-labelledby="alquimia-chamanica-diagnostico">
        <h2 id="alquimia-chamanica-diagnostico">
          {"Cuando la Mente Analítica se Convierte en tu Propia Prisión"}
        </h2>
        <p>
          {
            "Podés haber hecho años de terapia convencional y entender perfectamente el origen de tu problema. Sin embargo, si al momento de avanzar tu diafragma se cierra, tu garganta se anuda o una inercia pesada te tira a la cama, pensar más no va a transformarlo."
          }
        </p>
        <p>
          {
            "El estancamiento crónico no es pereza ni falta de fuerza de voluntad: es una respuesta de congelamiento (freeze) grabada en tu sistema nervioso autónomo, en tu memoria fascial y en tu biocampo por mandatos no resueltos, lealtades al clan o traumas antiguos. En Alquimia Chamánica & Acción no venimos a debatir con tu intelecto. Venimos a intervenir donde reside la carga para desmantelar la interferencia y devolverte el mando."
          }
        </p>
      </section>
      <section aria-labelledby="alquimia-chamanica-herramientas">
        <h2 id="alquimia-chamanica-herramientas">
          {"Herramientas Ancestrales y Somáticas Aplicadas con Rigor"}
        </h2>
        <p>{"(Se activan en vivo según la lectura directa de tu campo):"}</p>
        <ul>
          <li>
            {
              "🔮 Péndulo Evolutivo & Diagnóstico Radiónico: Identificación matemática del nudo (¿es bloqueo individual, lealtad transgeneracional o fuga ambiental?) sin filtros del ego."
            }
          </li>
          <li>
            {
              "🥁 Inmersión con Tambor Chamánico (7.5 Hz): Estímulo rítmico que induce ondas Theta cerebrales para sortear la censura de la corteza prefrontal y rescatar fragmentos de vitalidad."
            }
          </li>
          <li>
            {
              "🌿 Biognosis & Medicina Vegetal: Sintonización con la signatura de plantas del monte y botica viva."
            }
          </li>
          <li>
            {
              "💎 Cristaloterapia Somática: Geometría mineral sobre meridianos para drenar estática y sellar fugas."
            }
          </li>
          <li>
            {
              "🗣️ Desarticulación del Censor: Neutralización de órdenes boicoteadoras y mandatos de sacrificio."
            }
          </li>
          <li>
            {
              "💃 Descarga Somática Activa: Desbloqueo mandibular, shaking o canto diafragmático para desalojar el trauma."
            }
          </li>
          <li>
            {
              "🔥 Sahumado de Resinas Sagradas (Presencial): Purificación de densidad áurica con copal, ruda y salvia."
            }
          </li>
        </ul>
      </section>
      <section aria-labelledby="alquimia-chamanica-tiempos">
        <h2 id="alquimia-chamanica-tiempos">{"La Sesión en 3 Tiempos"}</h2>
        <ol>
          <li>
            {
              'Minuto 00-20 | Escaneo & Decodificación: Apertura de direcciones sagradas y rastreo radiestésico del nudo primario. (Si llegás con mente nublada o "en blanco", el tambor y el péndulo abren el canal sin forzarte a hablar).'
            }
          </li>
          <li>
            {
              "Minuto 20-60 | La Intervención Alquímica Activa: Ejecución de la vía maestra: corte de lazos ancestrales, viaje de tambor o catarsis somática guiada."
            }
          </li>
          <li>
            {
              "Minuto 60-90 | Formulación de Medicina Viva y Anclaje en la Materia: Elaboración en vivo de tu pócima personalizada y asignación de tu protocolo somático de 7 a 21 días."
            }
          </li>
        </ol>
      </section>
      <section aria-labelledby="alquimia-chamanica-incluye">
        <h2 id="alquimia-chamanica-incluye">{"Qué Incluye la Experiencia"}</h2>
        <ul>
          <li>{"✔ 75 a 90 minutos de sesión individual y personalizada."}</li>
          <li>
            {
              "✔ 1 Medicina VIVA Formulada a Medida: Frasco de 30 ml elaborado en vivo según tu diagnóstico (Gotero de Flores de Bach personalizadas, Microdosis Botánica Línea Jade o Elixir Ritual Alma Terra)."
            }
          </li>
          <li>
            {
              "✔ Prescripción de Gema Aliada: Mineral afín con protocolo exacto de limpieza y anclaje."
            }
          </li>
          <li>
            {
              "✔ Manual PDF de Higiene Energética & Sahumado: Guía paso a paso para proteger tu hogar."
            }
          </li>
          <li>
            {
              "✔ Track Inmersivo de Tambor Chamánico en MP3 (Modalidad Virtual): Para sostener la integración en casa."
            }
          </li>
          <li>
            {
              "✔ Plan de Acción Somático de 7 a 21 Días: Práctica personalizada extraída de nuestro Vademécum Maestro."
            }
          </li>
        </ul>
      </section>
      <section aria-labelledby="alquimia-chamanica-modalidades">
        <h2 id="alquimia-chamanica-modalidades">{"Modalidades y Pago"}</h2>
        <ProcesosTable
          caption={"Modalidades de Alquimia Chamánica & Acción"}
          columns={["Modalidad", "Qué Incluye", "Forma de Pago"]}
          rows={[
            [
              "📍 Presencial (Córdoba)",
              "Sesión en consultorio + Pócima Viva en mano + Gema + PDF de Sahumado.",
              "Transferencia o Efectivo",
            ],
            [
              "🌐 Online (Zoom en vivo)",
              "Sesión en vivo + Envío de Fórmula a domicilio + Track MP3 + PDFs.",
              "Mercado Pago o PayPal internacional",
            ],
          ]}
        />
      </section>
      <section aria-labelledby="alquimia-chamanica-faq">
        <h2 id="alquimia-chamanica-faq">{"Preguntas Frecuentes"}</h2>
        <details>
          <summary>
            {
              "¿Qué pasa si no sé exactamente qué me pasa y llego con la mente nublada?"
            }
          </summary>
          <p>
            {
              "Es sumamente común. El 85% de las respuestas son subconscientes. No necesitás traer un discurso preparado: el péndulo y el ritmo sostenido del tambor (7.5 Hz) disuelven la niebla mental sin que tengas que forzarte."
            }
          </p>
        </details>
        <details>
          <summary>
            {
              "¿Tiene contraindicaciones con psicofármacos o tratamientos médicos?"
            }
          </summary>
          <p>
            {
              "Nuestras fórmulas florales y vibracionales no interfieren químicamente con tratamientos alopáticos. En caso de extractos fitoterapéuticos concentrados, se audita previamente tu historial clínico."
            }
          </p>
        </details>
      </section>
    </TemplateAzul>
  );
}
