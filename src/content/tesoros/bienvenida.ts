import type { TesoroData } from "@/components/tesoros/TesoroLayout";

/** First instance of the shared six-block treasure layout. Media URLs are added after upload. */
export const tesoroBienvenida: TesoroData = {
  eyebrow: "Tesoro Da Luz · Portal de bienvenida",
  title: "Tu Tesoro de Bienvenida",
  manifesto:
    "Este es un espacio para detener el ruido y volver a escucharte. Cada Alkimya que llega a tus manos abre una pausa de presencia: un gesto sencillo para habitar tu cuerpo, reconocer su pulso y elegir cómo querés cuidarte hoy.",
  theme: {
    primary: "#7D1D2B",
    accent: "#C9A974",
    pale: "#F4E8DC",
  },
  audios: [{
    title: "Audio 0: Práctica de Indagación y Respiración",
    durationSeconds: 120,
  }],
  physical: {
    introduction:
      "Cuatro puertas breves para conocer el universo Da Luz antes de iniciar tu propio ritual.",
    media: [
      { title: "Manifiesto Da Luz" },
      { title: "La Ciencia / Fascia" },
      { title: "Seguridad y Ética" },
      { title: "Pausa Sagrada" },
    ],
    steps: [
      "Elegí un momento tranquilo y acomodate con el cuerpo sostenido.",
      "Recorré los contenidos a tu propio ritmo, dejando una pausa entre uno y otro.",
      "Al terminar, registrá qué sensación o pregunta apareció en vos.",
    ],
  },
  breathing: {
    name: "Pausa de indagación",
    instructions:
      "Apoyá los pies en el suelo. Inhalá sin forzar y dejá que la exhalación sea un poco más larga. Repetí unas veces, prestando atención a la sensación del aire al entrar y salir.",
    effect:
      "Una invitación a bajar el ritmo y escuchar el estado de tu cuerpo antes de continuar.",
  },
  intention: {
    map: "Preguntate dónde estás hoy y qué parte de vos pide atención.",
    pulse: "Observá tu respiración, tu postura y la velocidad de tus pensamientos.",
    action: "Elegí un gesto pequeño y posible para acompañarte durante el día.",
    seedWords: "Nombrá una palabra que quieras llevar con vos al iniciar este ciclo.",
  },
  geometry: {
    name: "Isotipo Central Da Luz",
    images: [{ src: "/svg/logo.svg", alt: "Isotipo Central Da Luz" }],
    closing:
      "Que este primer encuentro sea una llave: podés volver a esta pausa cada vez que necesites recordar tu propio ritmo. Tu ceremonia empieza en el instante en que elegís estar presente.",
  },
};
