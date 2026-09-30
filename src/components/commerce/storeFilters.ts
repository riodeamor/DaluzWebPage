export const BODY_CATEGORIES = [
  { id: "all", label: "Todos los productos" },
  { id: "rostro", label: "Rostro" },
  { id: "cuerpo", label: "Cuerpo" },
  { id: "cabello", label: "Cabello" },
  { id: "bucal", label: "Bucal" },
  { id: "aromaterapia", label: "Aromaterapia" },
  { id: "maquillaje", label: "Maquillaje de la Tierra" },
  { id: "herbales", label: "Herbales" },
  { id: "kits", label: "Kits & Ceremonias" },
] as const;

export const BOTANICAL_LINES = [
  { id: "umbral", label: "Línea Umbral Sens", slug: "linea-umbral" },
  { id: "ecos", label: "Línea Ecos", slug: "linea-ecos" },
  { id: "alma-terra", label: "Línea Alma Terra", slug: "linea-alma-terra" },
  { id: "jade-ritual", label: "Línea Jade Ritual", slug: "linea-jade-ritual" },
  { id: "prisma", label: "Línea Prisma", slug: "linea-prisma" },
  { id: "kits", label: "Kits & Ceremonias", slug: "linea-kits-y-experiencia" },
] as const;

export type BodyCategory = (typeof BODY_CATEGORIES)[number]["id"];
export type BotanicalLine = (typeof BOTANICAL_LINES)[number]["id"];
export type Synergy = "facial-serena" | "facial-ilumina" | "facial-soy" | "facial-claridad" | "facial-rituales" | "capilar-raiz" | "capilar-serena" | "capilar-ilumina" | "capilar-pureza" | "capilar-ceremonia";

type FilterableProduct = {
  name: string;
  short_description?: string;
  categories?: { name?: string; slug?: string };
};

const normalize = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const contentOf = (product: FilterableProduct) =>
  normalize([product.name, product.short_description, product.categories?.name, product.categories?.slug].filter(Boolean).join(" "));

const patterns: Record<Exclude<BodyCategory, "all">, RegExp> = {
  rostro: /rostro|facial|serum|tonico|mascarilla/,
  cuerpo: /cuerpo|corporal|body|exfoliante/,
  cabello: /cabello|capilar|shampoo|champu|acondicionador|cuero cabelludo|prelavado|pre-lavado/,
  bucal: /bucal|dental|enjuague|dentifrico|pasta de dientes/,
  aromaterapia: /aromaterapia|bruma|roll.on|alma terra|aromatic/,
  maquillaje: /maquillaje|prisma|sombra|labial|iluminador|pigmento/,
  herbales: /herbal|jade ritual|tintura madre|fitoterapia|extracto|flores de bach/,
  kits: /\bkit\b|\bkits\b|ceremonia|ritual completo/,
};

export function matchesBodyCategory(product: FilterableProduct, category: BodyCategory) {
  return category === "all" || patterns[category].test(contentOf(product));
}

export function matchesBotanicalLine(product: FilterableProduct, line: BotanicalLine) {
  const category = normalize(`${product.categories?.slug || ""} ${product.categories?.name || ""}`);
  const name = normalize(product.name);
  if (line === "kits") return /kit|ceremonia|experiencia/.test(category) || /\bkit\b/.test(name);
  if (line === "prisma") return /prisma|utopica/.test(category);
  return category.replace(/[-_]/g, " ").includes(line.replace(/-/g, " "));
}

export function matchesSynergy(product: FilterableProduct, synergy: Synergy | null) {
  if (!synergy) return true;
  const text = normalize(product.name + " " + (product.categories?.name || ""));
  const hair = patterns.cabello.test(text);
  switch (synergy) {
    case "facial-serena": return /serena/.test(text) && !hair;
    case "facial-ilumina": return /ilumina/.test(text) && !hair;
    case "facial-soy": return /\bsoy\b/.test(text) && !hair;
    case "facial-claridad": return /claridad/.test(text) && !hair;
    case "facial-rituales": return patterns.kits.test(text) && patterns.rostro.test(text);
    case "capilar-raiz": return /raiz/.test(text) && hair;
    case "capilar-serena": return /serena/.test(text) && hair;
    case "capilar-ilumina": return /ilumina/.test(text) && hair;
    case "capilar-pureza": return /pureza/.test(text) && hair;
    case "capilar-ceremonia": return patterns.kits.test(text) && hair;
  }
}
