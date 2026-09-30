const linePresentation = {
  umbral: { title: "LÍNEA UMBRAL SENS", color: "#C85A32", solid: "/assets/lineas/solido-umbral.svg" },
  ecos: { title: "LÍNEA ECOS", color: "#005080", solid: "/assets/lineas/solido-ecos.svg" },
  "alma-terra": { title: "LÍNEA ALMA TERRA", color: "#6E3B2B", solid: "/assets/lineas/solido-almaterra.svg" },
  "jade-ritual": { title: "LÍNEA JADE RITUAL", color: "#1B4D3E", solid: "/assets/lineas/solido-jaderitual.svg" },
  utopica: { title: "LÍNEA PRISMA", color: "#B8860B", solid: "/assets/lineas/solido-prisma.svg" },
  "kits-experiencia": { title: "KITS & CEREMONIAS", color: "#7D1D2B", solid: "/assets/lineas/solido-kits.svg" },
} as const;

export function getLinePresentation(theme: string) {
  return linePresentation[theme as keyof typeof linePresentation] || null;
}

export default function LineSolid({ theme }: { theme: string }) {
  const presentation = getLinePresentation(theme);
  if (!presentation) return null;

  return (
    <span
      className="mx-auto mb-3 block h-12 w-12 md:h-16 md:w-16"
      style={{
        backgroundColor: presentation.color,
        mask: `url("${presentation.solid}") center / contain no-repeat`,
        WebkitMask: `url("${presentation.solid}") center / contain no-repeat`,
      }}
      aria-hidden="true"
    />
  );
}
