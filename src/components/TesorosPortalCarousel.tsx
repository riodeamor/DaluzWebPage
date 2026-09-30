'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PortalCard = {
  title: string
  subtitle: string
  items: string[]
  effect: string
}

const ITEM_TITLES = ['Frecuencia Acústica de Autor', 'Activación Somática', 'Código de Reprogramación']

export default function TesorosPortalCarousel({ cards }: { cards: PortalCard[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const show = (index: number) => setActiveIndex((index + cards.length) % cards.length)

  return (
    <div className="tesoros-portal-carousel" aria-roledescription="carrusel" aria-label="Tesoros por línea">
      <div className="tesoros-portal-carousel-stage">
        <button
          type="button"
          className="tesoros-portal-arrow"
          aria-label="Tesoro anterior"
          onClick={() => show(activeIndex - 1)}
        >
          <ChevronLeft aria-hidden="true" />
        </button>

        <div className="tesoros-portal-carousel-cards">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className="tesoros-portal-card"
              aria-hidden={index !== activeIndex}
              style={{ visibility: index === activeIndex ? 'visible' : 'hidden' }}
            >
              <h5 className="tesoros-portal-title">{card.title}</h5>
              <p className="tesoros-portal-subtitle">{card.subtitle}</p>
              <p className="tesoros-portal-kicker">Tu experiencia exclusiva en el portal</p>
              <ul className="tesoros-portal-items">
                {card.items.map((item, itemIndex) => (
                  <li key={item}>
                    <strong>{ITEM_TITLES[itemIndex]}:</strong> {item}
                  </li>
                ))}
              </ul>
              <p className="tesoros-portal-effect">
                <strong>El efecto en tu cuerpo:</strong> {card.effect}
              </p>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="tesoros-portal-arrow"
          aria-label="Tesoro siguiente"
          onClick={() => show(activeIndex + 1)}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <div className="tesoros-portal-dots" aria-label="Elegir tesoro">
        {cards.map((card, index) => (
          <button
            key={card.title}
            type="button"
            aria-label={`Ver ${card.title}`}
            aria-current={index === activeIndex}
            onClick={() => show(index)}
          />
        ))}
      </div>
    </div>
  )
}
