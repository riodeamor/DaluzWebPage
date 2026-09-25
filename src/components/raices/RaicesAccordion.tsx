'use client'

import { useState } from 'react'

type AccordionItem = {
  title: string
  description: string
}

type RaicesAccordionProps = {
  title: string
  items: AccordionItem[]
}

export default function RaicesAccordion({ title, items }: RaicesAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = `${title.toLowerCase().replace(/\s+/g, '-')}-panel`

  return (
    <section className={`raices-accordion-column${isOpen ? ' is-open' : ''}`} aria-label={title}>
      <button
        type="button"
        className="raices-accordion-trigger"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{title}</span>
        <span className="raices-accordion-icon" aria-hidden="true">{isOpen ? '×' : '+'}</span>
      </button>

      <div id={panelId} className="raices-accordion-group-panel" hidden={!isOpen}>
        <ol className="raices-accordion-content-list">
          {items.map((item) => (
            <li key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
