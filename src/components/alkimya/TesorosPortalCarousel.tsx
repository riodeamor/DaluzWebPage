'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, type CardProps } from '@/components/ui/card'

export type PortalCard = {
  title: string
  portal: string
  frequency: string
  experiences: string[][]
  effect: string
  variant: NonNullable<CardProps['variant']>
}

export default function TesorosPortalCarousel({ cards }: { cards: PortalCard[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeCard = cards[activeIndex]
  const show = (index: number) => setActiveIndex((index + cards.length) % cards.length)

  if (!activeCard) return null

  return (
    <div className="tesoros-portal-carousel" role="region" aria-roledescription="carrusel" aria-label="Tesoros por línea">
      <button type="button" className="tesoros-portal-arrow" aria-label="Tesoro anterior" onClick={() => show(activeIndex - 1)}>
        <ChevronLeft aria-hidden="true" />
      </button>
      <div className="tesoros-portal-carousel-slide" aria-live="polite">
        <span className="sr-only">{activeIndex + 1} de {cards.length}</span>
        <Card variant={activeCard.variant} padding="default" className="tesoros-portal-card">
          <CardHeader>
            <CardTitle className="tesoros-portal-title font-subtitle text-xl md:text-2xl">
              {activeCard.title}
            </CardTitle>
            <p className="tesoros-portal-meta"><strong>{activeCard.portal}</strong> · {activeCard.frequency}</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <p className="tesoros-portal-kicker">Tu experiencia exclusiva en el portal</p>
            <ul className="tesoros-portal-list">
              {activeCard.experiences.map(([label, content]) => (
                <li key={label}><strong>{label}:</strong> {content}</li>
              ))}
            </ul>
            <p className="tesoros-portal-effect"><strong>El efecto en tu cuerpo:</strong> {activeCard.effect}</p>
          </CardContent>
        </Card>
      </div>
      <button type="button" className="tesoros-portal-arrow" aria-label="Tesoro siguiente" onClick={() => show(activeIndex + 1)}>
        <ChevronRight aria-hidden="true" />
      </button>
    </div>
  )
}
