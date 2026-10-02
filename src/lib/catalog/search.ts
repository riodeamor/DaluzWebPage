export function searchTokens(value: string): string[] {
  if (value.length > 120 || !/^[\p{L}\p{M}\p{N}\s'-]*$/u.test(value))
    throw new Error(
      "Usá letras, números y espacios en la búsqueda (máximo 120 caracteres).",
    );
  return [
    ...new Set(
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .split(/[\s'-]+/)
        .filter(Boolean),
    ),
  ];
}
export interface CatalogTerm {
  id: string;
  slug: string;
  label: string;
  kind: "anatomy" | "need";
  group_name: "facial" | "capilar" | null;
  is_active: boolean;
  sort_order: number;
}
