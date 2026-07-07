import { useState } from 'react'
import { pricing } from '../data/site'
import Icon from './Icon'

export default function QuoteCalculator() {
  const [bedrooms, setBedrooms] = useState(pricing[1].size)
  const [carpet, setCarpet] = useState(false)
  const [details, setDetails] = useState({ name: '', phone: '', suburb: '' })
  const [submitted, setSubmitted] = useState(false)

  const tier = pricing.find((t) => t.size === bedrooms) ?? pricing[0]
  const total = carpet ? tier.carpet : tier.standard

  const handleSubmit = (e) => {
    e.preventDefault()
    // No backend in this static build — confirm in the UI and hand off to phone.
    setSubmitted(true)
  }

  return (
    <section id="quote" className="section bg-canvas">
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Instant quote</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Your fixed price in 60 seconds
            </h2>
            <p className="mt-4 max-w-md text-muted">
              Pick your property size and any extras — the price you see is the
              price you pay. No inspection, no hourly creep.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              {[
                'Locked-in flat price, confirmed on booking',
                'Same-week and urgent slots available',
                'Pay later with Afterpay',
              ].map((p) => (
                <li key={p} className="flex items-center gap-2.5">
                  <Icon name="check" className="h-5 w-5 flex-none text-trust" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl2 border border-hair bg-surface p-6 shadow-card sm:p-8">
            {submitted ? (
              <div className="py-6 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-trustlight text-trust">
                  <Icon name="check" className="h-8 w-8" />
                </span>
                <h3 className="mt-4 text-2xl font-black text-heading">
                  Booking request received!
                </h3>
                <p className="mt-2 text-muted">
                  Thanks {details.name || 'there'} — we&apos;ll confirm your{' '}
                  <strong>{bedrooms}</strong> clean
                  {details.suburb ? ` in ${details.suburb}` : ''} within 2
                  business hours.
                </p>
                <p className="mt-4 text-3xl font-black text-heading">${total}</p>
                <p className="text-sm text-muted">
                  {carpet ? 'incl. carpet steam' : 'standard clean'}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-outline mt-6"
                >
                  Edit details
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-heading">
                    Property size
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {pricing.map((t) => (
                      <button
                        key={t.size}
                        type="button"
                        onClick={() => setBedrooms(t.size)}
                        className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                          bedrooms === t.size
                            ? 'border-accent bg-band text-white'
                            : 'border-hair bg-surface text-heading hover:border-accent'
                        }`}
                      >
                        {t.size}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-hair bg-surface px-4 py-3">
                  <span className="text-sm font-medium text-heading">
                    Add carpet steam clean
                  </span>
                  <input
                    type="checkbox"
                    checked={carpet}
                    onChange={(e) => setCarpet(e.target.checked)}
                    className="h-5 w-5 accent-accent"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    required
                    placeholder="Your name"
                    value={details.name}
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    className="rounded-lg border border-hair px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Phone"
                    value={details.phone}
                    onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                    className="rounded-lg border border-hair px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <input
                  placeholder="Suburb"
                  value={details.suburb}
                  onChange={(e) => setDetails({ ...details, suburb: e.target.value })}
                  className="w-full rounded-lg border border-hair px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
                />

                <div className="flex items-center justify-between rounded-lg bg-band px-4 py-3 text-white">
                  <span className="text-sm text-white/70">Your fixed price</span>
                  <span className="text-2xl font-black text-accent">${total}</span>
                </div>

                <button type="submit" className="btn-primary w-full text-base">
                  Request this booking
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
                <p className="text-center text-xs text-muted">
                  No payment now. We confirm availability within 2 business hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
