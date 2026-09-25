'use client';

import { useState } from 'react';

type CeremonyStep = {
  num: number;
  titulo: string;
  proposito: string;
  intencion: string;
  consejos: string;
};

type CeremonyStepsCarouselProps = {
  steps: readonly CeremonyStep[];
  imagePrefix: string;
  imageAltPrefix: string;
};

export default function CeremonyStepsCarousel({ steps, imagePrefix, imageAltPrefix }: CeremonyStepsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = steps[activeIndex];
  const goTo = (index: number) => setActiveIndex((index + steps.length) % steps.length);

  return (
    <div className="ceremony-steps" aria-label="Pasos de la ceremonia">
      <div className="ceremony-steps__tabs" role="tablist" aria-label="Elegir paso">
        {steps.map((step, index) => (
          <button
            key={step.num}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-controls={`ceremony-step-${step.num}`}
            className="ceremony-steps__tab"
            onClick={() => goTo(index)}
          >
            <span>Paso {step.num}</span>
            <strong>{step.titulo}</strong>
          </button>
        ))}
      </div>

      <article id={`ceremony-step-${active.num}`} className="ceremony-steps__card" role="tabpanel">
        <div className="ceremony-steps__copy">
          <p className="ceremony-steps__eyebrow">paso {active.num}</p>
          <h3>{active.titulo}</h3>
          <dl>
            <div><dt>Propósito y beneficio</dt><dd>{active.proposito}</dd></div>
            <div><dt>Intención de la ceremonia</dt><dd>{active.intencion}</dd></div>
            <div><dt>Consejos de aplicación</dt><dd>{active.consejos}</dd></div>
          </dl>
        </div>
        <figure className="ceremony-steps__media">
          <span className="ceremony-steps__organic-ring" aria-hidden="true" />
          <img src={`${imagePrefix}${active.num}.png`} alt={`${imageAltPrefix} ${active.num}: ${active.titulo}`} />
        </figure>
      </article>

      <div className="ceremony-steps__nav">
        <button type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Ver paso anterior">← ANTERIOR</button>
        <span>{activeIndex + 1} / {steps.length}</span>
        <button type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Ver paso siguiente">SIGUIENTE →</button>
      </div>
    </div>
  );
}
