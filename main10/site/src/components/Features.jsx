import { features } from '../data/site'
import Icon from './Icon'

export default function Features() {
  return (
    <section id="how" className="section">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Why Main10</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            We&apos;ve done this 1,000+ times
          </h2>
          <p className="mt-4 text-muted">
            End-of-lease cleaning is the only thing we do. That focus is why
            agents trust us and tenants get their bond back.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl2 border border-hair bg-surface p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-trustlight text-trust transition group-hover:bg-trust group-hover:text-white">
                <Icon name={f.icon} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-heading">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
