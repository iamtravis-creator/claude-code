import { testimonials } from '../data/site'
import Icon from './Icon'

export default function Testimonials() {
  return (
    <section className="section">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Proof</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Tenants who got their bond back
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-xl2 border border-hair bg-surface p-6 shadow-card"
            >
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" className="h-4 w-4" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-hair pt-4">
                <p className="text-sm font-bold text-heading">{t.name}</p>
                <p className="text-xs text-muted">{t.detail}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
