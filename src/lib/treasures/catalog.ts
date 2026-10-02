export const TREASURES = [
  { id: "tesoro-gral", route: "/tesoro-bienvenida", title: "Bienvenida" },
  { id: "linea-ecos", route: "/tesoro-ecos", title: "Ecos" },
  { id: "linea-umbral", route: "/tesoro-umbral", title: "Umbral" },
  { id: "linea-alma-terra", route: "/tesoro-alma-terra", title: "Alma Terra" },
  { id: "linea-jade", route: "/tesoro-jade", title: "Jade" },
  { id: "linea-prisma", route: "/tesoro-prisma", title: "Prisma" },
  { id: "kit-antena", route: "/tesoro-kit-antena", title: "Kit Antena" },
  { id: "kit-templo", route: "/tesoro-kit-templo", title: "Kit Templo" },
  { id: "kit-alquimia", route: "/tesoro-kit-alquimia", title: "Kit Alquimia" },
  { id: "kit-aura", route: "/tesoro-kit-aura", title: "Kit Aura" },
] as const;
export function safeReturn(value: string | null) {
  return value && /^\/(?!\/)/.test(value) && !/[\\\r\n]/.test(value)
    ? value
    : "/perfil";
}
