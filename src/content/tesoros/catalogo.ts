import type { TesoroData, TesoroTheme } from "@/components/tesoros/TesoroLayout";

// The pliego supplies each portal's structure and identifiers. Copy not yet
// supplied by Da Luz is visibly marked as pending, ready for later replacement.
const pendingIntention: TesoroData["intention"] = {
  map: "La pregunta de indagación de este ciclo se incorporará aquí.",
  pulse: "La pauta de registro corporal de este ciclo se incorporará aquí.",
  action: "La acción concreta de este ciclo se incorporará aquí.",
  seedWords: "Las palabras semilla de este ciclo se incorporarán aquí.",
};

const themes: Record<string, TesoroTheme> = {
  ecos: { primary: "#0A1D4A", accent: "#B9DFDC", pale: "#E7F2F1" },
  umbral: { primary: "#74313B", accent: "#F0C3AF", pale: "#F6E5DD" },
  alma: { primary: "#594038", accent: "#DFC5A5", pale: "#F1E7D8" },
  jade: { primary: "#184A3F", accent: "#BED9C5", pale: "#E6F0E8" },
  prisma: { primary: "#895019", accent: "#F3D7A1", pale: "#F9F0DE" },
  kit: { primary: "#7D1D2B", accent: "#C9A974", pale: "#F4E8DC" },
};

type LineInput = {
  title: string;
  element: string;
  chakra: string;
  theme: TesoroTheme;
  audioTitle: string;
  durationLabel: string;
  mediaTitle: string;
  breathingName: string;
  geometryName: string;
  geometryImage: string;
};

function lineTreasure(input: LineInput): TesoroData {
  return {
    eyebrow: "Tesoro Da Luz · Línea individual",
    title: input.title,
    element: `Elemento ${input.element}`,
    chakra: `Chakra ${input.chakra}`,
    manifesto: `El manifiesto poético y somático de ${input.title} se incorporará en este espacio.`,
    theme: input.theme,
    audios: [{ title: input.audioTitle, durationLabel: input.durationLabel }],
    physical: {
      introduction: input.mediaTitle,
      media: [{ title: input.mediaTitle }],
      steps: ["La guía paso a paso de esta práctica se incorporará aquí."],
    },
    breathing: {
      name: input.breathingName,
      instructions: "La secuencia guiada de respiración se incorporará aquí.",
      effect: "La explicación de su efecto en el sistema nervioso se incorporará aquí.",
    },
    intention: pendingIntention,
    geometry: {
      name: input.geometryName,
      images: [{ src: input.geometryImage, alt: input.geometryName }],
      closing: "El mensaje de integración de esta ceremonia se incorporará aquí.",
    },
  };
}

type KitInput = {
  title: string;
  kits: string;
  audios: TesoroData["audios"];
  physicalIntro: string;
  mediaTitles: string[];
  geometryName: string;
  geometryImages: TesoroData["geometry"]["images"];
};

function kitTreasure(input: KitInput): TesoroData {
  return {
    eyebrow: `Tesoro Da Luz · ${input.kits}`,
    title: input.title,
    manifesto: `El manifiesto poético y somático de ${input.title} se incorporará en este espacio.`,
    theme: themes.kit,
    audios: input.audios,
    physical: {
      introduction: input.physicalIntro,
      media: input.mediaTitles.map((title) => ({ title })),
      steps: ["La guía paso a paso de esta práctica se incorporará aquí."],
    },
    breathing: {
      name: "Respiración consciente",
      instructions: "La técnica de respiración de este portal se incorporará aquí.",
      effect: "La explicación de su efecto en el sistema nervioso se incorporará aquí.",
    },
    intention: pendingIntention,
    geometry: {
      name: input.geometryName,
      images: input.geometryImages,
      closing: "El mensaje de integración de esta ceremonia se incorporará aquí.",
    },
  };
}

export const tesoros = {
  ecos: lineTreasure({
    title: "Tesoro Ecos",
    element: "Éter · Purificación",
    chakra: "Laríngeo",
    theme: themes.ecos,
    audioTitle: "Audio L1: El Silencio Fértil",
    durationLabel: "3–5 min",
    mediaTitle: "Base del cráneo + El Diapasón Humano (zumbido «Mmm»)",
    breathingName: "Limpieza y exhalación bucal",
    geometryName: "Dodecaedro Azul",
    geometryImage: "/assets/lineas/solido-ecos.svg",
  }),
  umbral: lineTreasure({
    title: "Tesoro Umbral Sens",
    element: "Agua · Goce y Nutrición",
    chakra: "Sacro",
    theme: themes.umbral,
    audioTitle: "Audio L2: Habitar la Memoria Líquida",
    durationLabel: "3–5 min",
    mediaTitle: "Masaje mandíbula-ATM + Ochos pélvicos en el sacro",
    breathingName: "De la Marea (abdominal profunda)",
    geometryName: "Icosaedro Naranja",
    geometryImage: "/assets/lineas/solido-umbral.svg",
  }),
  almaTerra: lineTreasure({
    title: "Tesoro Alma Terra",
    element: "Tierra · Presencia y Raíz",
    chakra: "Raíz",
    theme: themes.alma,
    audioTitle: "Audio L3: El Retorno al Origen",
    durationLabel: "3 min",
    mediaTitle: "Mudra Prithvi + Contacto de peso descalza",
    breathingName: "Alternada (Nadi Shodhana)",
    geometryName: "Cubo / Hexaedro",
    geometryImage: "/assets/lineas/solido-almaterra.svg",
  }),
  jade: lineTreasure({
    title: "Tesoro Jade Ritual",
    element: "Aire · Sanación y Linaje",
    chakra: "Cardíaco",
    theme: themes.jade,
    audioTitle: "Audio L4: Coherencia y Sincronía",
    durationLabel: "3–5 min",
    mediaTitle: "Sostén pecho-espalda + Mudra del Corazón (Anjali Mudra)",
    breathingName: "Coherencia Cardíaca (inhalar 5 s, exhalar 5 s)",
    geometryName: "Octaedro Verde",
    geometryImage: "/assets/lineas/solido-jaderitual.svg",
  }),
  prisma: lineTreasure({
    title: "Tesoro Prisma",
    element: "Fuego · Brillo y Soberanía",
    chakra: "Plexo Solar",
    theme: themes.prisma,
    audioTitle: "Audio L5: Encender la Propia Luz",
    durationLabel: "3 min",
    mediaTitle: "Palming visual + Postura de Plexo Solar",
    breathingName: "Cuadrada (4-4-4-4)",
    geometryName: "Tetraedro Dorado",
    geometryImage: "/assets/lineas/solido-prisma.svg",
  }),
  kitAntena: kitTreasure({
    title: "Portal Antena",
    kits: "Kits Sagrada, Raíces y Sinergia",
    audios: [{ title: "Audio C1: La Identidad y el Reflejo", durationLabel: "7 min" }],
    physicalIntro: "Módulos A y B · Capilar y Facial",
    mediaTitles: ["Módulo A · Capilar", "Módulo B · Facial"],
    geometryName: "Dodecaedro + Icosaedro",
    geometryImages: [
      { src: "/assets/lineas/solido-ecos.svg", alt: "Dodecaedro" },
      { src: "/assets/lineas/solido-umbral.svg", alt: "Icosaedro" },
    ],
  }),
  kitTemplo: kitTreasure({
    title: "Portal Templo",
    kits: "Kits Templo, Flujo Vital y Trinidad",
    audios: [{ title: "Audio C2: Templo y Vitalidad", durationLabel: "7 min" }],
    physicalIntro: "Módulos B, C y E · Fascia y Rostro",
    mediaTitles: ["Módulo B", "Módulo C", "Módulo E"],
    geometryName: "Hexaedro / Cubo",
    geometryImages: [{ src: "/assets/lineas/solido-almaterra.svg", alt: "Hexaedro" }],
  }),
  kitAlquimia: kitTreasure({
    title: "Portal Alkimya",
    kits: "Kits Portal Interno y Alkimya Maestra",
    audios: [
      { title: "Audio C3: Medicina del Linaje" },
      { title: "Audio C4: Flor de la Vida" },
    ],
    physicalIntro: "Módulos A al F completos",
    mediaTitles: ["Módulo A", "Módulo B", "Módulo C", "Módulo D", "Módulo E", "Módulo F"],
    geometryName: "Flor de la Vida",
    geometryImages: [{ src: "/assets/tesoros/flor-de-la-vida.svg", alt: "Flor de la Vida" }],
  }),
  kitAura: kitTreasure({
    title: "Portal Aura",
    kits: "Kits Equilibra 7 Pócimas y Elemental 5 Brumas",
    audios: [
      { title: "Audio C5: Merkabah" },
      { title: "Audio C6: Santuario Elemental Fibonacci" },
    ],
    physicalIntro: "Módulos D y E · Brumas y Pócimas",
    mediaTitles: ["Módulo D · Brumas", "Módulo E · Pócimas"],
    geometryName: "Merkabah",
    geometryImages: [{ src: "/assets/tesoros/merkabah.svg", alt: "Merkabah" }],
  }),
} satisfies Record<string, TesoroData>;
