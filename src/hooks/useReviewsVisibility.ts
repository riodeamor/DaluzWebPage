"use client";

import { useEffect, useState } from "react";

export function useReviewsVisibility() {
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/public/config?keys=reviews_enabled")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (active) setShowReviews(data?.configs?.reviews_enabled === true);
      })
      .catch(() => {
        if (active) setShowReviews(false);
      });
    return () => { active = false; };
  }, []);

  return showReviews;
}
