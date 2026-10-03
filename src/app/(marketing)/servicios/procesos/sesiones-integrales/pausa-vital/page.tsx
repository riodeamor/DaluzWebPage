import type { Metadata } from "next";
import TemplateAzul from "@/components/layout/TemplateAzul";
import SesionAction from "@/components/marketing/SesionAction";
import { ProcesosTable } from "@/components/marketing/ProcesosContent";
export const metadata: Metadata = {
  title: {
    absolute:
      "Pausa Vital: Sesión Somática de Reiki y Sonoterapia en Córdoba | Da Luz",
  },
  description:
    "Desactivá el estrés biológico y la coraza muscular en 75 minutos de camilla. Reiki, cuencos tibetanos, aromaterapia ritual y gemas. Exclusivo presencial.",
  keywords: [
    "sesión reiki presencial córdoba",
    "armonización chakras y cuencos",
    "terapia somática estrés",
    "alivio bruxismo y tensión muscular",
    "relajación sistema nervioso",
  ],
  alternates: {
    canonical:
      "https://www.daluzconsciente.com/servicios/procesos/sesiones-integrales/pausa-vital",
  },
  openGraph: {
    title:
      "Pausa Vital: Sesión Somática de Reiki y Sonoterapia en Córdoba | Da Luz",
    description:
      "Desactivá el estrés biológico y la coraza muscular en 75 minutos de camilla. Reiki, cuencos tibetanos, aromaterapia ritual y gemas. Exclusivo presencial.",
    url: "https://www.daluzconsciente.com/servicios/procesos/sesiones-integrales/pausa-vital",
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
      "Pausa Vital: Sesión Somática de Reiki y Sonoterapia en Córdoba | Da Luz",
    description:
      "Desactivá el estrés biológico y la coraza muscular en 75 minutos de camilla. Reiki, cuencos tibetanos, aromaterapia ritual y gemas. Exclusivo presencial.",
    images: ["/og-image.jpg"],
  },
};
export default function PausaVitalPage() {
  return (
    <TemplateAzul
      kicker={
        "INTERVENCIÓN SOMÁTICA PASIVA · 75 MINUTOS · EXCLUSIVAMENTE PRESENCIAL EN CÓRDOBA"
      }
      title={
        "Apagá el Ruido del Mundo: Desarmá la Coraza Corporal y Devolvele la Calma a tu Biología"
      }
      subtitle={
        "\"75 minutos de inmersión en camilla donde 4 tecnologías vibracionales coordinadas desactivan el modo 'lucha o huida' de tu sistema nervioso, sin análisis, sin exigencias y sin tareas.\""
      }
      buttonText={"RESERVAR MI PAUSA VITAL"}
      buttonLink={
        "https://wa.me/5493512344580?text=Hola%20Gala%2C%20quiero%20agendar%20mi%20Pausa%20Vital."
      }
    >
      <SesionAction
        href={
          "https://wa.me/5493512344580?text=Hola%20Gala%2C%20quiero%20agendar%20mi%20Pausa%20Vital."
        }
        label={"RESERVAR MI PAUSA VITAL"}
        note={"Cupos estrictamente reducidos por semana"}
      />
      <section aria-labelledby="pausa-vital-diagnostico">
        <h2 id="pausa-vital-diagnostico">
          {"El Costo Fisiológico de No Poder Frenar"}
        </h2>
        <p>
          {
            "Vivimos rumiando el pasado, controlando el presente y anticipando crisis futuras. Pero tu biología no distingue entre un peligro físico inminente y una preocupación mental: ante la prisa constante, tu eje neuroendocrino bombea cortisol y adrenalina sin descanso."
          }
        </p>
        <p>{"El resultado es un secuestro somático evidente:"}</p>
        <ul>
          <li>
            {
              "💥 Músculos petrificados (Coraza de Reich): La fascia retiene el miedo y la autoexigencia."
            }
          </li>
          <li>
            {
              "🫁 Respiración clavicular corta: Tu caja torácica cerrada le reconfirma a tu cerebro que hay peligro."
            }
          </li>
          <li>
            {
              "⚠️ Síntomas silenciosos: Bruxismo al despertar, nudos en garganta y pecho, o pesadez en hombros."
            }
          </li>
        </ul>
        <p>
          {
            "Pausa Vital no es un spa estético: es un acto de soberanía biológica. Un santuario libre de conversaciones agotadoras donde venís a recibir sostén absoluto."
          }
        </p>
      </section>
      <section aria-labelledby="pausa-vital-tecnologias">
        <h2 id="pausa-vital-tecnologias">
          {"¿Cómo Actuamos sobre tu Fisiología en 75 Minutos?"}
        </h2>
        <ul>
          <li>
            {
              "🌟 Reiki & Armonización de Vórtices (Chakras): Canalización sutil para destrabar estancamientos bioeléctricos, devolviendo fluidez simétrica a tu campo electromagnético."
            }
          </li>
          <li>
            {
              "🔔 Sonoterapia con Cuencos Tibetanos y Campanas: Las ondas acústicas viajan a través del agua intracelular (más del 70% de tu cuerpo), desacelerando tus ondas cerebrales de Beta (alerta) a Alpha/Theta (autorreparación celular)."
            }
          </li>
          <li>
            {
              "🌿 Aromaterapia Ritual de Alta Botica (Línea Alma Terra): Moléculas vegetales puras inhaladas que impactan directamente en tu sistema límbico, ordenando al nervio vago activar la rama parasimpática: el ritmo cardíaco desciende en segundos."
            }
          </li>
          <li>
            {
              "💎 Gemoterapia & Geometría Mineral: Disposición anatómica de cuarzos, selenitas y turmalinas sobre puntos de pulso clave para drenar la estática electromagnética y sellar tu campo áurico."
            }
          </li>
        </ul>
      </section>
      <section aria-labelledby="pausa-vital-protocolo">
        <h2 id="pausa-vital-protocolo">{"El Protocolo en 5 Fases"}</h2>
        <ol>
          <li>
            {
              "Apertura: Calibración del campo áurico y diagnóstico de temperatura energética."
            }
          </li>
          <li>
            {
              "Purificación (Joka): Barrido de toxinas etéricas y estática ambiental."
            }
          </li>
          <li>
            {
              "Desbloqueo: Intervención sonora y manual focalizada en contracturas y corazas."
            }
          </li>
          <li>
            {
              "Armonización: Distribución armónica de la fuerza vital por los meridianos principales."
            }
          </li>
          <li>
            {
              "Plenitud & Grounding: Sellado electromagnético y enraizamiento a la Tierra para volver al cotidiano."
            }
          </li>
        </ol>
      </section>
      <section aria-labelledby="pausa-vital-incluye">
        <h2 id="pausa-vital-incluye">{"Qué Incluye tu Experiencia"}</h2>
        <ul>
          <li>
            {
              "✔ 75 minutos reales de sesión presencial individual en ambiente climatizado y sahumado."
            }
          </li>
          <li>
            {
              "✔ Recepción en silencio consciente y diagnóstico somático breve."
            }
          </li>
          <li>
            {
              "✔ Abordaje cuádruple en camilla (Reiki + Cuencos + Cristales + Aromaterapia)."
            }
          </li>
          <li>
            {
              "✔ Tu Medicina Física de Regalo: Te llevás en mano tu Elixir Aromático Ritual (Línea Alma Terra) con su tarjeta de anclaje para reactivar esta memoria de paz en tu casa con solo inhalarlo."
            }
          </li>
          <li>
            {
              '✔ Soporte Digital a las 24 hs: Mensaje privado con tu "Kit Suave de Mantenimiento" (Playlist de Mantras y anclaje respiratorio).'
            }
          </li>
          <li>{"✔ Tareas para el hogar: CERO. Prohibido autoexigirse."}</li>
        </ul>
      </section>
      <section aria-labelledby="pausa-vital-planes">
        <h2 id="pausa-vital-planes">{"Planes y Modalidades de Inversión"}</h2>
        <ProcesosTable
          caption={"Opciones de Pausa Vital"}
          columns={[
            "Plan",
            "Propósito",
            "Qué Incluye",
            "Modalidad de Inversión",
          ]}
          rows={[
            [
              "Sesión Individual (1 Sesión)",
              "Alivio puntual o reseteo de emergencia tras una semana crítica.",
              "75 min en camilla + Elixir Ritual en mano.",
              "1 pago al reservar turno",
            ],
            [
              "Pack Alineación (2 Sesiones)",
              "Aflojar el primer estrato de coraza muscular y estabilizar el sueño.",
              "2 Sesiones (Fases 1 y 2) + Elixir Ritual.",
              "Precio promocional en 1 pago",
            ],
            [
              "Pack Desbloqueo (3 Sesiones)",
              "Desactivar patrones de tensión arraigados y drenar densidad.",
              "3 Sesiones (Fases 1, 2 y 3) + Elixir Ritual.",
              "Precio promocional en 1 pago",
            ],
            [
              "Proceso Completo (5 Sesiones)",
              "Recorrido íntegro del ciclo (Apertura → Plenitud) con recableado somático.",
              "5 Sesiones + Elixir Ritual + Soporte digital.",
              "Opción en 2 Cuotas (50% al reservar / 50% en sesión 4)",
            ],
          ]}
        />
      </section>
      <section aria-labelledby="pausa-vital-faq">
        <h2 id="pausa-vital-faq">{"Preguntas Frecuentes"}</h2>
        <details>
          <summary>{"¿Duele o incluye manipulaciones invasivas?"}</summary>
          <p>
            {
              "En absoluto. Es un trabajo estático en camilla, de contacto sutil y vibracional sin dolor."
            }
          </p>
        </details>
        <details>
          <summary>{"¿Qué pasa si me duermo en la sesión?"}</summary>
          <p>
            {
              "Dormirse es el mayor indicador de éxito: significa que tu sistema nervioso confió en el espacio y apagó la hipervigilancia para entrar en regeneración celular profunda."
            }
          </p>
        </details>
        <details>
          <summary>{"¿Dónde se realiza?"}</summary>
          <p>
            {
              "En nuestro consultorio privado en Córdoba, en un entorno seguro, higienizado y protegido energéticamente."
            }
          </p>
        </details>
      </section>
    </TemplateAzul>
  );
}
