"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Notice = { id: string; message: string; link: string | null };

export default function ZenAnnouncementBar() {
  const [pressed, setPressed] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [threshold, setThreshold] = useState<number | null>(null);
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [ar, cr] = await Promise.all([fetch("/api/public/announcements", { cache: "no-store" }), fetch("/api/public/config?keys=free_shipping_threshold")]);
        if (!ar.ok || !cr.ok) throw new Error("Avisos no disponibles");
        const [a, c] = await Promise.all([ar.json(), cr.json()]);
        const amount = c.configs?.free_shipping_threshold;
        if (active) { setNotices(a.announcements); setThreshold(typeof amount === "number" && Number.isFinite(amount) && amount >= 0 ? amount : null); }
      } catch { if (active) setNotices([]); }
    };
    void load();
    const timer = setInterval(load, 60000);
    window.addEventListener("focus", load);
    return () => { active = false; clearInterval(timer); window.removeEventListener("focus", load); };
  }, []);
  const visibleNotices = notices.filter(notice => threshold !== null || !notice.message.includes("{{free_shipping_threshold}}"));
  const text = (notice: Notice) => notice.message.split("{{free_shipping_threshold}}").join( threshold === null ? "" : new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 }).format(threshold));

  const group = (key: string) => (
    <div key={key} className="zen-announcement-group" aria-hidden={key === "copy"}>
      {visibleNotices.map((notice) => (
        <span key={notice.id} className="zen-announcement-item">
          {notice.link ? <Link href={notice.link} tabIndex={key === "copy" ? -1 : 0}>{text(notice)}</Link> : text(notice)}
          <span className="zen-announcement-separator" aria-hidden="true">•</span>
        </span>
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
          animation: zen-scroll 28s linear infinite;
        }
        .zen-announcement-bar:hover .zen-announcement-track,
        .zen-announcement-paused {
          animation-play-state: paused;
        }
        .zen-announcement-group {
          display: flex;
          flex: none;
          align-items: center;
          justify-content: flex-start;
          min-width: 100vw;
          min-height: 32px;
          gap: 0;
          padding: 0 .5rem;
        }
        .zen-announcement-item {
          flex: none;
          display: inline-flex;
          align-items: center;
          gap: 0;
          font-family: var(--font-montserrat), Montserrat, sans-serif;
          font-size: 0.75rem;
          line-height: 1.25rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .zen-announcement-separator { color: #7d1d2b; margin-inline: 2rem; }
        .zen-announcement-item a:hover { color: #7d1d2b; text-decoration: underline; }
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
