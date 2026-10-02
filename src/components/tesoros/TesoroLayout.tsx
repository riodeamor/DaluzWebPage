import type { CSSProperties } from "react";
import RitualAudioPlayer from "./RitualAudioPlayer";

export type TesoroTheme = {
  primary: string;
  accent: string;
  pale: string;
};

export type TesoroMedia = {
  title: string;
  description?: string;
  /** Bunny.net embed URL. Empty until the video is uploaded. */
  embedUrl?: string;
};

export type TesoroAudio = {
  title: string;
  durationSeconds?: number;
  durationLabel?: string;
  /** Audio file URL. Empty until the recording is uploaded. */
  src?: string;
};

export type TesoroData = {
  eyebrow: string;
  title: string;
  element?: string;
  chakra?: string;
  manifesto: string;
  theme: TesoroTheme;
  audios: TesoroAudio[];
  physical: {
    introduction: string;
    media: TesoroMedia[];
    steps: string[];
  };
  breathing: { name: string; instructions: string; effect: string };
  intention: {
    map: string;
    pulse: string;
    action: string;
    seedWords: string;
  };
  geometry: {
    name: string;
    images: { src: string; alt: string }[];
    closing: string;
  };
};

const anchors = [
  ["El Mapa", "map"],
  ["El Pulso", "pulse"],
  ["La Acción", "action"],
  ["Palabras Semilla", "seedWords"],
] as const;

export default function TesoroLayout({ treasure }: { treasure: TesoroData }) {
  const colors = {
    "--tesoro-primary": treasure.theme.primary,
    "--tesoro-accent": treasure.theme.accent,
    "--tesoro-pale": treasure.theme.pale,
  } as CSSProperties;

  return (
    <article className="tesoro-layout" style={colors}>
      <header className="tesoro-hero">
        <div className="tesoro-shell tesoro-hero-inner">
          <p className="tesoro-eyebrow">{treasure.eyebrow}</p>
          <h1>{treasure.title}</h1>
          {(treasure.element || treasure.chakra) && (
            <p className="tesoro-association">
              {[treasure.element, treasure.chakra].filter(Boolean).join(" · ")}
            </p>
          )}
          <img className="tesoro-hero-ornament" src="/assets/tesoros/onda-marfil.svg" alt="" />
          <p className="tesoro-manifesto">{treasure.manifesto}</p>
        </div>
      </header>

      <div className="tesoro-shell tesoro-content">
        <section className="tesoro-section" aria-labelledby="tesoro-audio-title">
          <SectionHeading number="01" title="Audio ritual guiado" id="tesoro-audio-title" />
          <div className="tesoro-audio-list">
            {treasure.audios.map((audio) => <RitualAudioPlayer key={audio.title} audio={audio} />)}
          </div>
        </section>

        <div className="tesoro-divider" aria-hidden="true" />

        <section className="tesoro-section" aria-labelledby="tesoro-physical-title">
          <SectionHeading number="02" title="Alkimya física" id="tesoro-physical-title" />
          <p className="tesoro-section-intro">{treasure.physical.introduction}</p>
          <div className={`tesoro-media-grid${treasure.physical.media.length === 1 ? " tesoro-media-single" : ""}${treasure.physical.media.length >= 3 ? " tesoro-media-multi" : ""}`}>
            {treasure.physical.media.map((item, index) => (
              <div className="tesoro-media-card" key={item.title}>
                <div className="tesoro-media-frame">
                  {item.embedUrl ? (
                    <iframe
                      src={item.embedUrl}
                      title={item.title}
                      loading="lazy"
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="tesoro-media-pending" aria-label={`${item.title}: video pendiente de carga`}>
                      <span className="tesoro-media-play" aria-hidden="true">▷</span>
                      <span>Video en preparación</span>
                    </div>
                  )}
                </div>
                <div className="tesoro-media-caption">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  {item.description && <p>{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
          {treasure.physical.steps.length > 0 && (
            <div className="tesoro-practice">
              <h3>La práctica, paso a paso</h3>
              <ol>
                {treasure.physical.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
          )}
        </section>

        <div className="tesoro-divider" aria-hidden="true" />

        <section className="tesoro-section" aria-labelledby="tesoro-breath-title">
          <SectionHeading number="03" title="Respiración consciente" id="tesoro-breath-title" />
          <div className="tesoro-breath-card">
            <p className="tesoro-card-label">Una pausa para volver al cuerpo</p>
            <h3>{treasure.breathing.name}</h3>
            <p>{treasure.breathing.instructions}</p>
            <p className="tesoro-breath-effect">{treasure.breathing.effect}</p>
          </div>
        </section>

        <div className="tesoro-divider" aria-hidden="true" />

        <section className="tesoro-section" aria-labelledby="tesoro-intention-title">
          <SectionHeading number="04" title="Juego de intención" id="tesoro-intention-title" />
          <div className="tesoro-anchors">
            {anchors.map(([label, key], index) => (
              <div className="tesoro-anchor" key={key}>
                <span className="tesoro-anchor-number">0{index + 1}</span>
                <h3>{label}</h3>
                <p>{treasure.intention[key]}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="tesoro-divider" aria-hidden="true" />

        <section className="tesoro-section tesoro-closing" aria-labelledby="tesoro-closing-title">
          <SectionHeading number="05" title="Geometría sagrada & cierre" id="tesoro-closing-title" />
          <div className="tesoro-closing-content">
            <div className="tesoro-geometry-frame">
              {treasure.geometry.images.map((image) => (
                <img key={image.src} src={image.src} alt={image.alt} />
              ))}
            </div>
            <div>
              <p className="tesoro-card-label">Geometría de este portal</p>
              <h3>{treasure.geometry.name}</h3>
              <p>{treasure.geometry.closing}</p>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}

function SectionHeading({ number, title, id }: { number: string; title: string; id: string }) {
  return (
    <div className="tesoro-section-heading">
      <span>{number}</span>
      <h2 id={id}>{title}</h2>
      <img src="/assets/tesoros/trazo-dorado.svg" alt="" />
    </div>
  );
}
