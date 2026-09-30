"use client";

import { useEffect, useState } from "react";
import { BODY_CATEGORIES, BOTANICAL_LINES } from "@/components/commerce/storeFilters";

interface StoreCategoryNavigationProps {
  selectedCategory: string;
  onSelect: (category: string) => void;
  compact?: boolean;
}

export default function StoreCategoryNavigation({ selectedCategory, onSelect, compact = false }: StoreCategoryNavigationProps) {
  const [view, setView] = useState<"lines" | "categories">(!selectedCategory || selectedCategory.startsWith("line:") ? "lines" : "categories");
  useEffect(() => {
    if (selectedCategory) setView(selectedCategory.startsWith("line:") ? "lines" : "categories");
  }, [selectedCategory]);
  const items = view === "lines"
    ? [{ id: "", label: "Todas" }, ...BOTANICAL_LINES.map((line) => ({ id: `line:${line.id}`, label: line.label }))]
    : BODY_CATEGORIES.map((category) => ({ id: category.id === "all" ? "" : category.id, label: category.label }));

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className="grid grid-cols-2 gap-1 rounded-[0_12px] bg-[#4A0D10]/10 p-1" role="group" aria-label="Tipo de navegación de Tienda">
        <button type="button" className="tienda-nav-tab" aria-pressed={view === "lines"} onClick={() => { setView("lines"); onSelect(""); }}>Por Líneas</button>
        <button type="button" className="tienda-nav-tab" aria-pressed={view === "categories"} onClick={() => { setView("categories"); onSelect(""); }}>Por Categorías</button>
      </div>
      <div className={compact ? "space-y-1" : "space-y-2"}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="tienda-nav-item w-full text-left"
            aria-pressed={selectedCategory === item.id}
            onClick={() => onSelect(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
