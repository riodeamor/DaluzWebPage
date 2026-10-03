import type { Metadata } from "next";
import TemplateAzul from "@/components/layout/TemplateAzul";
import {
  ProcesosBadges,
  ProcesosTable,
} from "@/components/marketing/ProcesosContent";
export const metadata: Metadata = {
  title: {
    absolute:
      "El Botiquín Botánico: Fitoterapia Clínica y Farmacia Viva | Da Luz",
  },
  description:
    "Nuestra farmacia viva de precisión: tinturas madre intencionadas bajo cimática, microdosis por hormesis, fórmulas duales In & Out y elixires florales a medida.",
  keywords: [
    "botiquín fitoterapia clínica córdoba",
    "tinturas madre medicinales puras",
    "microdosis medicinal hormesis",
    "medicina floral personalizada",
    "depuración emuntorios plantas",
    "memoria del agua masaru emoto cimática",
    "cosmética dual in and out",
    "extractos hidroglicerinados sin alcohol niños",
    "fitoterapia para órganos emuntorios",
    "anamnesis botánica personalizada",
  ],
  alternates: {
    canonical:
      "https://www.daluzconsciente.com/servicios/procesos/botiquin-botanico",
  },
  openGraph: {
    title: "El Botiquín Botánico: Fitoterapia Clínica y Farmacia Viva | Da Luz",
    description:
      "Nuestra farmacia viva de precisión: tinturas madre intencionadas bajo cimática, microdosis por hormesis, fórmulas duales In & Out y elixires florales a medida.",
    url: "https://www.daluzconsciente.com/servicios/procesos/botiquin-botanico",
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
    title: "El Botiquín Botánico: Fitoterapia Clínica y Farmacia Viva | Da Luz",
    description:
      "Nuestra farmacia viva de precisión: tinturas madre intencionadas bajo cimática, microdosis por hormesis, fórmulas duales In & Out y elixires florales a medida.",
    images: ["/og-image.jpg"],
  },
};
export default function BotiquinBotanicoPage() {
  return (
    <TemplateAzul
      kicker={"FARMACIA VIVA, FITOTERAPIA CLÍNICA & MEDICINA DE PRECISIÓN"}
      title={
        "El Botiquín Botánico: La Inteligencia de la Tierra al Servicio de tu Biología"
      }
      quote={
        '"La planta no cura por magia: cura porque sus fitoquímicos comparten el mismo código evolutivo que tus receptores celulares."'
      }
      subtitle={
        "Una farmacia viva para la autogestión, la depuración de los 5 filtros emuntorios y la calibración del sistema nervioso. Formulaciones de alta pureza intencionadas bajo frecuencias sonoras, diseñadas para actuar con precisión milimétrica sobre la causa del desequilibrio físico y emocional."
      }
      buttonText={"🌿 AGENDAR SESIÓN DE ANAMNESIS BOTÁNICA"}
      buttonLink={"/servicios/procesos/sesiones-integrales/sesion-umbral"}
    >
      <ProcesosBadges
        items={[
          "✦ Fitoextracción Noble (Glicero-Hidroalcohólica & 0% Alcohol)",
          "✦ Intención Acústica bajo Frecuencias de Cuencos y Tambor (Memoria del Agua)",
          "✦ Prescripción Individualizada Mediante Sesión de Anamnesis",
          "✦ Plantas Autóctonas del Monte & Principios Adaptógenos Globales",
        ]}
      />
      <section aria-labelledby="botiquin-botanico-seccion-1">
        <h2 id="botiquin-botanico-seccion-1">
          {
            "Memoria del Agua, Hado & Cimática: La Vibración que Sella la Química"
          }
        </h2>
        <p>
          {
            "En Da Luz entendemos que un preparado botánico no es un simple frasco de principios activos inertes; es un conductor biológico de información."
          }
        </p>
        <p>
          {
            "Basándonos en las investigaciones sobre la estructura molecular del agua y el fenómeno del Hado (Masaru Emoto), sabemos que los solventes acuosos y vegetales reordenan sus agrupaciones moleculares (clusters) según los campos electromagnéticos y las frecuencias a las que son expuestos."
          }
        </p>
        <ul>
          <li>
            {
              "El Proceso en Laboratorio: Antes de ser sellada, cada sinergia de nuestro taller reposa en un entorno de geometría sagrada y es expuesta al pulso rítmico del Tambor Ceremonial o las ondas cristalinas de los Cuencos Tibetanos a 432 Hz."
            }
          </li>
          <li>
            {
              "El Resultado Biológico: El vehículo líquido guarda y estabiliza esa geometría coherente. Al ingresar a tu organismo, tus células no solo reciben los metabolitos secundarios de la planta (alcaloides, flavonoides, taninos), sino un patrón vibracional ordenado que facilita la absorción y disminuye las resistencias del sistema nervioso."
            }
          </li>
        </ul>
      </section>
      <section aria-labelledby="botiquin-botanico-seccion-2">
        <h2 id="botiquin-botanico-seccion-2">
          {"¿Cómo Llega la Medicina a tu Ser? (Tintura Madre vs. Microdosis)"}
        </h2>
        <p>
          {
            "No todas las personas ni todos los desequilibrios requieren la misma vía de asimilación. Antes de elegir tu fórmula, determinamos el vehículo exacto para tu momento:"
          }
        </p>
        <h3>{"1. Tintura Madre (La Fuerza Humoral de la Materia)"}</h3>
        <ul>
          <li>{"Mecanismo: Vía sanguínea directa (absorción humoral)."}</li>
          <li>
            {
              "Ciencia: Concentración masiva de principios fitoquímicos extraídos de la planta entera."
            }
          </li>
          <li>
            {
              'Profundidad: Es la medicina del cuerpo físico denso. Actúa como una respuesta de choque ("fuego contra fuego") para apagar síntomas agudos y limpiar sobrecargas estancadas.'
            }
          </li>
          <li>
            {
              "Ejemplo de uso: Una tintura RESPIRA ante una congestión bronquial súbita, o EQUILIBRA ante una crisis de indigestión o pesadez hepática."
            }
          </li>
        </ul>
        <h3>{"2. Microdosis (La Inteligencia Neuro-Glandular & Hormesis)"}</h3>
        <ul>
          <li>
            {
              "Mecanismo: Vía neuronal refleja a través de los quimiorreceptores de la lengua hacia el Hipotálamo."
            }
          </li>
          <li>
            {
              "Ciencia: Basada en el principio fisiológico de la Hormesis (estímulos sutiles de alta frecuencia que desencadenan respuestas biológicas adaptativas sin sobrecargar órganos de filtración)."
            }
          </li>
          <li>
            {
              "Profundidad: Es la medicina para la cronicidad, la hipersensibilidad y el recableado de hábitos. No satura receptores; envía un mensaje de orden celular continuo."
            }
          </li>
          <li>
            {
              "Ejemplo de uso: Una microdosis ÁNIMA para disolver una fatiga crónica de meses, o PACÍFICA para estabilizar la ansiedad cotidiana sin sedación."
            }
          </li>
        </ul>
        <h3>
          {
            "⚖️ La Regla Maestra: Mientras la Tintura Madre actúa por cantidad de materia química, la Microdosis actúa por calidad y frecuencia de información."
          }
        </h3>
      </section>
      <section aria-labelledby="botiquin-botanico-seccion-3">
        <h2 id="botiquin-botanico-seccion-3">
          {"Mapa de integración de nuestros portales"}
        </h2>
        <ProcesosTable
          caption={"Mapa de integración de nuestros portales"}
          columns={[
            "Característica",
            "Tintura Madre",
            "Microdosis",
            "Flores de Bach",
            "Elixires Aromáticos",
          ]}
          rows={[
            [
              "Componente Clave",
              "Fitoquímicos concentrados.",
              "Fitoquímicos en micro-dilución.",
              "Huella energética floral.",
              "Moléculas terpénicas volátiles.",
            ],
            [
              "Vía de Entrada",
              "Torrente sanguíneo (Humoral).",
              "Terminaciones nerviosas linguales.",
              "Biocampo & canales sutiles.",
              "Olfativa (Sistema Límbico) & Piel.",
            ],
            [
              "Objetivo Primario",
              "Respuesta física directa y drenaje.",
              "Estímulo hipotalámico adaptativo.",
              "Desbloqueo y armonía emocional.",
              "Desactivación del estrés en 3 seg.",
            ],
            [
              "Sustento Teórico",
              "Farmacología y botánica médica.",
              "Neurobiología y Hormesis.",
              "Medicina Vibracional del Dr. Bach.",
              "Psicoaromaterapia y Neurociencias.",
            ],
          ]}
        />
      </section>
      <section aria-labelledby="botiquin-botanico-seccion-4">
        <h2 id="botiquin-botanico-seccion-4">
          {"Catálogo de Sinergias Botánicas de Alta Concentración"}
        </h2>
        <h3>
          {
            "(Fórmulas artesanales elaboradas en matrices glicero-hidroalcohólicas de máxima extracción):"
          }
        </h3>
        <h3>{"1. CIRCULA (Tónico Vascular & Drenaje de Líquidos):"}</h3>
        <ul>
          <li>
            {
              "Composición: Rompepiedra (35%), Centella Asiática (30%), Cola de Caballo (20%) y Ortiga (15%)."
            }
          </li>
          <li>
            {
              "Acción: Drena la retención hídrica, reactiva el retorno venoso, disuelve sedimentos minerales y alivia la pesadez en miembros inferiores."
            }
          </li>
        </ul>
        <h3>{"2. OXIGENA (El Filtro Maestro de Fluidos):"}</h3>
        <ul>
          <li>
            {
              "Composición: Ortiga (40%), Romero (30%), Moringa (15%) y Bardana (15%)."
            }
          </li>
          <li>
            {
              "Acción: Shock depurativo de sangre y linfa. Aporta silicio y hierro biodisponible, barriendo la piel opaca y el cansancio metabólico."
            }
          </li>
        </ul>
        <h3>{"3. RELAJA (Desinflamante Tisular & Articular):"}</h3>
        <ul>
          <li>
            {
              "Composición: Cúrcuma (30%), Jarilla autóctona (25%), Uña de Gato (20%), Cola de Caballo (10%), Ortiga (10%) y Llantén (5%)."
            }
          </li>
          <li>
            {
              "Acción: Potente reductor de citoquinas inflamatorias. Afloja rigideces musculares crónicas y desgastes articulares."
            }
          </li>
        </ul>
        <h3>{"4. EQUILIBRA (Armonizador Hepático-Biliar):"}</h3>
        <ul>
          <li>
            {
              "Composición: Carqueja (30%), Peperina (20%), Manzanilla (20%), Melisa (15%), Cedrón (10%) y Lavanda (5%)."
            }
          </li>
          <li>
            {
              "Acción: Drenador hepático de principios amargos. Alivia la somatización del estrés en el epigastrio, la hinchazón y las digestiones lentas."
            }
          </li>
        </ul>
        <h3>{"5. DULCE DESCANSO (Inductor del Sueño Profundo):"}</h3>
        <ul>
          <li>
            {
              "Composición: Valeriana (40%), Tilo (30%), Pasionaria (15%), Lavanda (10%) y Cedrón (5%)."
            }
          </li>
          <li>
            {
              "Acción: Sedante suave del sistema nervioso central. Facilita la fase REM y evita los microdespertares nocturnos sin embotamiento matinal."
            }
          </li>
        </ul>
        <h3>{"6. PACÍFICA (Rescate de Calma & Tónico Vagal):"}</h3>
        <ul>
          <li>
            {
              "Composición: Melisa (40%), Manzanilla (30%), Pasionaria (20%) y Lavanda (10%)."
            }
          </li>
          <li>
            {
              "Acción: Frena la taquicardia por ansiedad y los espasmos gastrointestinales de origen nervioso."
            }
          </li>
        </ul>
        <h3>{"7. FOCO (Activador Neuro-Cognitivo):"}</h3>
        <ul>
          <li>
            {
              "Composición: Centella Asiática (35%), Romero (25%), Salvia (15%), Menta (15%) y Cedrón (10%)."
            }
          </li>
          <li>
            {
              "Acción: Estimula la microcirculación cerebral y la oxigenación celular. Disuelve la bruma mental sin generar taquicardia."
            }
          </li>
        </ul>
        <h3>{"8. ÁNIMA (El Adaptógeno Vital):"}</h3>
        <ul>
          <li>
            {
              "Composición: Melisa (30%), Reishi puro (25%), Ashwagandha (20%), Cedrón (15%) y Pasionaria (10%)."
            }
          </li>
          <li>
            {
              "Acción: Regula el eje HPA (hipotálamo-hipófisis-adrenal), modulando el cortisol y disolviendo la apatía o el agotamiento extremo."
            }
          </li>
        </ul>
        <h3>{"9. RESPIRA (Apertura Bronquial & Bálsamo Pulmonar):"}</h3>
        <ul>
          <li>
            {
              "Composición: Corteza de Chañar (35%), Eucalipto (25%), Tomillo (15%), Llantén (15%), Manzanilla (5%) y Lavanda (5%)."
            }
          </li>
          <li>
            {
              "Acción: Expectorante y antiséptico natural. Desprende flemas atascadas, alivia la tos seca y expande la caja torácica."
            }
          </li>
        </ul>
        <h3>{"10. LUNA CALMA (Regulador del Eje Femenino & Uterino):"}</h3>
        <ul>
          <li>
            {
              "Composición: Milenrama (35%), Salvia (25%), Melisa (15%), Jengibre (10%), Manzanilla (10%) y Caléndula (5%)."
            }
          </li>
          <li>
            {
              "Acción: Espasmolítico pélvico. Suaviza el SPM, modula sangrados irregulares y aporta calor vital al útero."
            }
          </li>
        </ul>
        <h3>{"11. ILUMINA (Nutricosmética Celular Interna):"}</h3>
        <ul>
          <li>
            {
              "Composición: Centella Asiática (30%), Rosa Mosqueta (20%), Urucúm (15%), Bardana (15%), Cola de Caballo (10%), Caléndula (5%) y Llantén (5%)."
            }
          </li>
          <li>
            {
              "Acción: Shock de carotenoides y precursores de colágeno que protegen la piel de la oxidación lumínica y devuelven el brillo natural."
            }
          </li>
        </ul>
      </section>
      <section aria-labelledby="botiquin-botanico-seccion-5">
        <h2 id="botiquin-botanico-seccion-5">
          {"Medicina en Sinergia Simultánea"}
        </h2>
        <p>
          {
            "Innovación en matrices glicero-hidroalcohólicas suaves diseñadas para actuar en simultáneo desde el torrente sanguíneo (IN) y sobre el estrato córneo dérmico (OUT):"
          }
        </p>
        <ul>
          <li>
            {
              "ILUMINA DUAL: Sérum facial iluminador + Gotas antioxidantes orales (Urucúm, Centella y Rosa Mosqueta)."
            }
          </li>
          <li>
            {
              "CIRCULA DUAL: Fricción refrescante para piernas con arañitas o várices + Gotas drenantes linfáticas orales."
            }
          </li>
          <li>
            {
              "RELAJA DUAL: Loción de fricción muscular y articular + Gotas orales desinflamatorias con Cúrcuma y Jarilla."
            }
          </li>
          <li>
            {
              "SÉRUM DUAL ROSÁCEA & CALMA: Suero facial anti-rojeces + Gotas que enfrían la inflamación de las mucosas internas."
            }
          </li>
          <li>
            {
              "ELIXIR DUAL ANTIOXIDANTE REGENERADOR: Tratamiento pro-age con Té Verde y Bardana para proteger el ADN celular por dentro y tensar la piel por fuera."
            }
          </li>
        </ul>
      </section>
      <section aria-labelledby="botiquin-botanico-seccion-6">
        <h2 id="botiquin-botanico-seccion-6">
          {"Cuidado Maternal, Infantil y Estómagos Delicados"}
        </h2>
        <p>
          {
            "Extractos 100% hidroglicerinados en vehículo de agua pura y glicerina vegetal, naturalmente dulces y libres de solventes alcohólicos:"
          }
        </p>
        <h3>
          {
            "1. RESPIRA SENSIBLE / NIÑOS: Jarabe expectorante con Chañar, Llantén y Tomillo para aliviar la tos y el espasmo bronquial infantil."
          }
        </h3>
        <h3>
          {
            "2. CALMA NERVOSA / SUEÑO SENSIBLE: Elixir floral de Manzanilla, Melisa y Tilo para calmar berrinches, hiperactividad y terrores nocturnos."
          }
        </h3>
        <h3>
          {
            "3. DESPARASITACIÓN INFANTIL SUAVE: Tónico expulsivo con semillas de zapallo (Cucurbita pepo) y carqueja suave que respeta la microbiota infantil."
          }
        </h3>
      </section>
      <section aria-labelledby="botiquin-botanico-seccion-7">
        <h2 id="botiquin-botanico-seccion-7">
          {"Reeducación Emocional Celular & Olfato Límbico"}
        </h2>
        <ul>
          <li>
            {
              "Las 38 Esencias de Edward Bach: Las emociones no resueltas generan un campo de interferencia bioeléctrica que antecede a la enfermedad física. Abordamos los 7 senderos arquetípicos: Miedo, Incertidumbre, Falta de Interés, Soledad, Hipersensibilidad a influencias, Desaliento y Preocupación Excesiva."
            }
          </li>
          <li>
            {
              "Neurobiología Olfativa (Línea Alma Terra): El nervio olfativo es el único sentido con conexión directa a la corteza cerebral sin pasar por el filtro racional del tálamo. Un aroma noble envía una señal de seguridad al nervio vago en menos de 3 segundos."
            }
          </li>
        </ul>
      </section>
      <section aria-labelledby="botiquin-botanico-seccion-8">
        <h2 id="botiquin-botanico-seccion-8">
          {"La Medicina Viva No se Compra a Ciegas"}
        </h2>
        <p>
          {
            "En Da Luz no vendemos extractos de mostrador. Cada planta tiene fitoquímica real y, por ende, contraindicaciones específicas (embarazo, lactancia, interacciones con anticoagulantes o fármacos psiquiátricos)."
          }
        </p>
        <p>
          {
            "Para acceder a tu preparado personalizado, evaluamos tu terreno en una Sesión de Anamnesis / Sesión Umbral, donde podemos co-crear un mix a medida (integrando, por ejemplo, Microdosis de Tintura + Flores de Bach en el mismo frasco)."
          }
        </p>
      </section>
    </TemplateAzul>
  );
}
