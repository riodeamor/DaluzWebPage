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
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="raices-accordion-column" aria-label={title}>
      <h3>{title}</h3>
      <div className="raices-accordion-list">
        {items.map((item, index) => {
          const isOpen = openIndex === index
          const panelId = `${title.toLowerCase().replace(/\s+/g, '-')}-${index}`

          return (
            <article className={`raices-accordion-item${isOpen ? ' is-open' : ''}`} key={item.title}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{item.title}</span>
                <span className="raices-accordion-icon" aria-hidden="true">{isOpen ? '×' : '+'}</span>
              </button>
              <div id={panelId} className="raices-accordion-panel" hidden={!isOpen}>
                <p>{item.description}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
