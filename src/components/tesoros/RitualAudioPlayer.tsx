"use client";

import { useRef, useState } from "react";
import type { TesoroAudio } from "./TesoroLayout";

function formatTime(seconds: number) {
  const safe = Number.isFinite(seconds) ? Math.floor(seconds) : 0;
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

export default function RitualAudioPlayer({ audio }: { audio: TesoroAudio }) {
  const element = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(audio.durationSeconds ?? 0);
  const displayDuration = audio.durationLabel ?? (duration ? formatTime(duration) : "—");

  async function togglePlayback() {
    if (!element.current || !audio.src) return;
    if (element.current.paused) {
      try {
        await element.current.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      element.current.pause();
      setPlaying(false);
    }
  }

  return (
    <div className="tesoro-audio-card">
      {audio.src && (
        <audio
          ref={element}
          src={audio.src}
          preload="metadata"
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || audio.durationSeconds || 0)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onEnded={() => setPlaying(false)}
        />
      )}
      <button
        className="tesoro-audio-toggle"
        type="button"
        onClick={togglePlayback}
        disabled={!audio.src}
        aria-label={audio.src ? (playing ? "Pausar audio ritual" : "Reproducir audio ritual") : "Audio ritual en preparación"}
      >
        {playing ? "Ⅱ" : "▶"}
      </button>
      <div className="tesoro-audio-details">
        <div className="tesoro-audio-title-row">
          <div>
            <p className="tesoro-card-label">Escuchá a tu ritmo</p>
            <h3>{audio.title}</h3>
          </div>
          <span>{displayDuration}</span>
        </div>
        <input
          aria-label="Progreso del audio ritual"
          type="range"
          min="0"
          max={duration || audio.durationSeconds || 1}
          value={Math.min(currentTime, duration || audio.durationSeconds || 1)}
          disabled={!audio.src}
          onChange={(event) => {
            const time = Number(event.target.value);
            if (element.current) element.current.currentTime = time;
            setCurrentTime(time);
          }}
        />
        <div className="tesoro-audio-times">
          <span>{formatTime(currentTime)}</span>
          <span>{audio.src ? displayDuration : "Audio en preparación"}</span>
        </div>
      </div>
    </div>
  );
}
