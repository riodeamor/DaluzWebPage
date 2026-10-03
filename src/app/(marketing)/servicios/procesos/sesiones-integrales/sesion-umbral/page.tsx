import type { Metadata } from "next";
import TemplateAzul from "@/components/layout/TemplateAzul";
import SesionAction from "@/components/marketing/SesionAction";

export const metadata: Metadata = {
  title: {
    absolute:
      "Sesión Umbral: Asesoría Botánica y Diagnóstico Somático | Da Luz",
  },
  description:
    "Escaneá tu terreno biológico, piel y estado emocional en 60 minutos. Diseñamos tu Botiquín Soberano y tu hoja de ruta personalizada. Online y Presencial.",
  keywords: [
    "diagnóstico holístico piel",
    "asesoría fitoterapia personalizada",
    "botica natural córdoba",
    "medicina floral a medida",
    "rutina somática diaria",
  ],
  alternates: {
    canonical:
      "https://www.daluzconsciente.com/servicios/procesos/sesiones-integrales/sesion-umbral",
  },
  openGraph: {
    title: "Sesión Umbral: Asesoría Botánica y Diagnóstico Somático | Da Luz",
    description:
      "Escaneá tu terreno biológico, piel y estado emocional en 60 minutos. Diseñamos tu Botiquín Soberano y tu hoja de ruta personalizada. Online y Presencial.",
    url: "https://www.daluzconsciente.com/servicios/procesos/sesiones-integrales/sesion-umbral",
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
    title: "Sesión Umbral: Asesoría Botánica y Diagnóstico Somático | Da Luz",
    description:
      "Escaneá tu terreno biológico, piel y estado emocional en 60 minutos. Diseñamos tu Botiquín Soberano y tu hoja de ruta personalizada. Online y Presencial.",
    images: ["/og-image.jpg"],
  },
};
export default function SesionUmbralPage() {
  return (
    <TemplateAzul
      kicker={
        "DIAGNÓSTICO DE ENTRADA & RUTINA DE ALTA BOTICA · 45 A 60 MINUTOS"
      }
      title={
        "No Podés Sanar lo que Desconocés: Mapeá tu Terreno antes de Elegir tu Medicina"
      }
      subtitle={
        '"Una sesión quirúrgica de 45 a 60 minutos para decodificar qué te están diciendo tu piel, tu digestión y tu sistema nervioso, trazando tu Botiquín Soberano y tu hoja de ruta exacta."'
      }
      buttonText={"AGENDAR MI SESIÓN UMBRAL"}
      buttonLink={
        "https://wa.me/5493512344580?text=Hola%20Gala%2C%20quiero%20agendar%20mi%20Sesi%C3%B3n%20Umbral."
      }
    >
      <SesionAction
        href={
          "https://wa.me/5493512344580?text=Hola%20Gala%2C%20quiero%20agendar%20mi%20Sesi%C3%B3n%20Umbral."
        }
        label={"AGENDAR MI SESIÓN UMBRAL"}
        note={"Modalidad: Online vía Zoom o Presencial en Córdoba"}
      />
      <section aria-labelledby="sesion-umbral-diagnostico">
        <h2 id="sesion-umbral-diagnostico">
          {"El Error de Comprar Productos y Terapias a Ciegas"}
        </h2>
        <p>
          {
            'Gastás dinero acumulando cosméticos, suplementos o cursos espirituales con la esperanza de que "algo funcione". Pero cuando la piel se irrita, la digestión se enlentece o la energía se desploma, no hay un fallo en los productos: hay una desconexión en el terreno.'
          }
        </p>
        <p>
          {
            "Tu piel es el espejo exterior de tu sistema nervioso y de tus órganos de filtración (hígado, intestino, riñones). Si no entendés el clima biológico en el que estás operando, cualquier intervención es un tiro al aire. En la Sesión Umbral no te vendemos productos: hacemos un peritaje consciente de tus ritmos, tu reactividad dérmica y tu tríada astrológica para entregarte una prescripción milimétrica."
          }
        </p>
      </section>
      <section aria-labelledby="sesion-umbral-mapeo">
        <h2 id="sesion-umbral-mapeo">{"El Algoritmo del Mapeo en 3 Fases"}</h2>
        <ol>
          <li>
            {
              "Minuto 00-20 | Radiografía del Terreno Actual: Auditoría de tu descanso, digestión, ciclo hormonal y estado de la barrera cutánea. Cruce con tu mapa natal base (Sol, Luna y Ascendente) para entender tu constitución elemental."
            }
          </li>
          <li>
            {
              "Minuto 20-45 | Prescripción de Alta Botica (Tu Botiquín Soberano): Diseño de tu protocolo ritual diurno y nocturno con Alkimyas vivas (elixires botánicos, goteros florales, emulsiones biocompatibles) eliminando lo superfluo y activando lo esencial."
            }
          </li>
          <li>
            {
              "Minuto 45-60 | Trazado de tu Ruta de Evolución: Definición del paso siguiente: ¿tu sistema pide una pausa somática pasiva, una intervención quirúrgica con Alquimia Chamánica, o un proceso inmersivo como Metamorfosis / Oasis?"
            }
          </li>
        </ol>
      </section>
      <section aria-labelledby="sesion-umbral-incluye">
        <h2 id="sesion-umbral-incluye">{"Qué Incluye la Sesión"}</h2>
        <ul>
          <li>
            {
              "✔ 45 a 60 minutos de consulta 1:1 con Gala (Virtual vía Zoom o Presencial en Córdoba)."
            }
          </li>
          <li>
            {
              "✔ Receta de Botica Personalizada: Especificación de activos botánicos, posología y modo de aplicación diario."
            }
          </li>
          <li>
            {
              "✔ 1 Ejercicio Somático Rápido de Regulación: Una micro-práctica corporal adaptada a tu constitución."
            }
          </li>
          <li>
            {
              "✔ Bono de Compensación: El valor de esta sesión se bonifica parcialmente si decidís ingresar a un proceso largo de acompañamiento dentro de los 15 días posteriores."
            }
          </li>
        </ul>
      </section>
      <section aria-labelledby="sesion-umbral-faq">
        <h2 id="sesion-umbral-faq">{"Preguntas Frecuentes"}</h2>
        <details>
          <summary>
            {
              "¿Tengo que comprar los productos de Da Luz obligatoriamente después?"
            }
          </summary>
          <p>
            {
              "No. La prescripción te enseña principios botánicos y hábitos que podés sostener con autonomía. Si decidís utilizar las Alkimyas de la casa, sabrás con exactitud milimétrica cuál te corresponde."
            }
          </p>
        </details>
        <details>
          <summary>{"¿Necesito mi hora exacta de nacimiento?"}</summary>
          <p>
            {
              "Es ideal contar con la hora exacta para calcular tu Ascendente y Casas, pero si no la tenés, trabajamos sobre tu Sol, Luna y lectura somática directa."
            }
          </p>
        </details>
      </section>
    </TemplateAzul>
  );
}
