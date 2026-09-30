"use client";

import { useState } from "react";
import Link from "next/link";

const officialNotices = [
  "ENVÍO GRATIS A TODO EL PAÍS EN COMPRAS SUPERIORES A $ 77.000",
  "10% OFF POR TRANSFERENCIA BANCARIA • 3 CUOTAS SIN INTERÉS",
  "TESORO RITUAL DE REGALO EN CADA COMPRA PARA ACTIVAR EL GOCE EN EL COTIDIANO ✨",
  "¿NO SABÉS QUÉ ALQUIMIA NECESITA TU PIEL? AGENDÁ TU SESIÓN UMBRAL 1 A 1 →",
];

export default function ZenAnnouncementBar() {
  const [pressed, setPressed] = useState(false);

  const group = (key: string) => (
    <div key={key} className="zen-announcement-group" aria-hidden={key === "copy"}>
      {officialNotices.map((notice, index) => (
        <span key={`${index}-${notice}`} className="zen-announcement-item">
          {index === 3 ? <Link href="/servicios/consultas" tabIndex={key === "copy" ? -1 : 0}>{notice}</Link> : notice}
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
          justify-content: space-around;
          min-width: 100vw;
          min-height: 32px;
          gap: 1.5rem;
          padding: 0 1rem;
        }
        .zen-announcement-item {
          flex: none;
          display: inline-flex;
          align-items: center;
          gap: 1.5rem;
          font-family: var(--font-montserrat), Montserrat, sans-serif;
          font-size: 0.75rem;
          line-height: 1.25rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .zen-announcement-separator { color: #7d1d2b; }
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
