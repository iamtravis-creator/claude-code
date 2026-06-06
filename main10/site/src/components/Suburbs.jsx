import { suburbs } from '../data/site'

export default function Suburbs() {
  return (
    <section className="section">
      <div className="container-x text-center">
        <p className="eyebrow">Service area</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          Covering all major Melbourne rental suburbs
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Based in the inner suburbs and servicing the whole Melbourne metro
          area. If your suburb isn&apos;t listed, just ask.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {suburbs.map((s) => (
            <span
              key={s}
              className="rounded-full border border-hair bg-surface px-4 py-2 text-sm font-medium text-heading shadow-card"
            >
              {s}
            </span>
          ))}
          <span className="rounded-full bg-band px-4 py-2 text-sm font-medium text-white">
            + all metro suburbs
          </span>
        </div>
      </div>
    </section>
  )
}
