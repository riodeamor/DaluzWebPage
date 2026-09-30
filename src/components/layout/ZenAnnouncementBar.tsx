"use client";

import { useEffect, useState } from "react";

const defaultNotice = "Da Luz Consciente · Alkimyas para alma y cuerpo";

function readNotices(value: unknown): string[] {
  if (typeof value === "string") return value.trim() ? [value.trim()] : [];
  if (Array.isArray(value)) return value.flatMap(readNotices);
  if (!value || typeof value !== "object") return [];

  const notice = value as Record<string, unknown>;
  if (notice.active === false || notice.is_active === false || notice.enabled === false) return [];

  const items = notice.messages ?? notice.notices ?? notice.items;
  if (items !== undefined) return readNotices(items);

  const label = notice.text ?? notice.message ?? notice.title;
  return typeof label === "string" && label.trim() ? [label.trim()] : [];
}

export default function ZenAnnouncementBar() {
  const [notices, setNotices] = useState<string[]>([defaultNotice]);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadNotices = async () => {
      try {
        const response = await fetch("/api/public/config", { signal: controller.signal });
        if (!response.ok) return;

        const data = await response.json();
        const configs = data.configs as Record<string, unknown> | undefined;
        if (!configs) return;

        const active = Object.entries(configs)
          .filter(([key]) => /announcement|anuncio|zen/i.test(key))
          .flatMap(([, value]) => readNotices(value));

        const threshold = Number(configs.free_shipping_threshold);
        if (Number.isFinite(threshold) && threshold > 0) {
          active.unshift(`Envío gratis desde $ ${new Intl.NumberFormat("es-AR").format(threshold)}`);
        }

        setNotices(active.length ? Array.from(new Set(active)) : [defaultNotice]);
      } catch (error) {
        if (!controller.signal.aborted) console.error("Error loading announcements:", error);
      }
    };

    loadNotices();
    const interval = window.setInterval(loadNotices, 300000);
    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, []);

  const group = (key: string) => (
    <div key={key} className="zen-announcement-group" aria-hidden={key === "copy"}>
      {notices.map((notice, index) => (
        <span key={`${index}-${notice}`} className="zen-announcement-item">{notice}</span>
      ))}
    </div>
  );

  return (
    <div
      className="zen-announcement-bar"
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      aria-label="Avisos de Da Luz Consciente"
    >
      <div className={`zen-announcement-track ${pressed ? "zen-announcement-paused" : ""}`}>
        {group("original")}
        {group("copy")}
      </div>
      <style jsx>{`
        .zen-announcement-bar {
          overflow: hidden;
          background: #faf7f2;
          border-bottom: 1px solid rgba(10, 29, 74, 0.12);
          color: #0a1d4a;
          touch-action: pan-y;
        }
        .zen-announcement-track {
          display: flex;
          width: max-content;
          animation: zen-scroll 45s linear infinite;
        }
        .zen-announcement-bar:hover .zen-announcement-track,
        .zen-announcement-paused {
          animation-play-state: paused;
        }
        .zen-announcement-group {
          display: flex;
          flex: none;
          align-items: center;
          justify-content: space-around;
          min-width: 100vw;
          min-height: 32px;
          gap: 4rem;
          padding: 0 2rem;
        }
        .zen-announcement-item {
          flex: none;
          font-family: var(--font-montserrat), Montserrat, sans-serif;
          font-size: 0.75rem;
          line-height: 1.25rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        @keyframes zen-scroll {
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .zen-announcement-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
