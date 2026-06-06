import { pricing } from '../data/site'
import Icon from './Icon'

export default function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Pricing</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Upfront pricing by bedroom
          </h2>
          <p className="mt-4 text-muted">
            Fixed prices, inclusive of all labour and products. No hourly rates,
            no surprises on the day.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pricing.map((tier) => (
            <div
              key={tier.size}
              className={`relative flex flex-col rounded-xl2 border p-6 ${
                tier.popular
                  ? 'border-gold bg-surface shadow-lift ring-1 ring-gold'
                  : 'border-hair bg-surface shadow-card'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-navy-deep">
                  Most booked
                </span>
              )}
              <h3 className="text-sm font-bold uppercase tracking-wide text-muted">
                {tier.size}
              </h3>
              <p className="mt-3 text-4xl font-black text-navy">
                ${tier.standard}
              </p>
              <p className="mt-1 text-sm text-muted">standard clean</p>

              <div className="mt-4 rounded-lg bg-trust-light px-3 py-2 text-sm text-trust">
                <span className="font-semibold">${tier.carpet}</span> with carpet
                steam
              </div>

              <ul className="mt-5 space-y-2 text-sm text-muted">
                {['Full REIV checklist', 'Photo report', '7-day re-clean'].map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <Icon name="check" className="h-4 w-4 flex-none text-trust" />
                    {p}
                  </li>
                ))}
              </ul>

              <a href="#quote" className="btn-outline mt-6 w-full">
                Book this
              </a>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Agencies referring 5+ jobs a month qualify for volume pricing —{' '}
          <a href="#agencies" className="font-semibold text-navy underline">
            see partnership benefits
          </a>
          .
        </p>
      </div>
    </section>
  )
}
