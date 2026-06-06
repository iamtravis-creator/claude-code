import { useState } from 'react'
import { faqs } from '../data/site'

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="section bg-canvas">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Questions</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-2xl divide-y divide-hair overflow-hidden rounded-xl2 border border-hair bg-surface shadow-card">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-navy">{item.q}</span>
                  <span
                    className={`grid h-7 w-7 flex-none place-items-center rounded-full border border-hair text-navy transition ${
                      isOpen ? 'rotate-45 bg-navy text-white' : ''
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
