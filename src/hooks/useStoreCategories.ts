"use client";

import { useEffect, useState } from "react";

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export function useStoreCategories() {
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const response = await fetch("/api/categories?active=true", { signal: controller.signal, cache: "no-store" });
        if (response.ok) setCategories((await response.json()).categories ?? []);
      } catch { /* Keep the last successful list on a transient failure. */ }
    };
    void refresh();
    window.addEventListener("focus", refresh);
    return () => { controller.abort(); window.removeEventListener("focus", refresh); };
  }, []);
  return categories;
}
