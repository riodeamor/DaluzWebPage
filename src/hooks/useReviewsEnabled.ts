"use client";

import { useEffect, useState } from "react";

export function useReviewsEnabled() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const response = await fetch("/api/public/config?keys=reviews_enabled", { signal: controller.signal, cache: "no-store" });
        if (!response.ok) return;
        const { configs } = await response.json();
        setEnabled(configs?.reviews_enabled === true);
      } catch { /* Hidden until the public switch is available. */ }
    };
    void refresh();
    window.addEventListener("focus", refresh);
    return () => { controller.abort(); window.removeEventListener("focus", refresh); };
  }, []);
  return enabled;
}
