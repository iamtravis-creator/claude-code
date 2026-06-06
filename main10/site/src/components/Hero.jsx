import Icon from './Icon'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy-deep text-white">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-trust/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container-x relative pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-36">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-trust" />
              Bond-back guarantee on every job
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Get your full bond back.
              <span className="block text-gold">Or we come back free.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              Melbourne&apos;s end-of-lease cleaning specialists. Fixed prices,
              REIV-aligned checklist, and a 7-day free re-clean — so your
              inspection passes the first time.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#quote" className="btn-primary text-base">
                Get a fixed price in 60 seconds
                <Icon name="arrow" className="h-4 w-4" />
              </a>
              <a href="#pricing" className="btn-ghost text-base">
                See pricing
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/70">
              <span className="inline-flex items-center gap-2">
                <Icon name="check" className="h-5 w-5 text-trust" />
                1,000+ bonds returned
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon name="check" className="h-5 w-5 text-trust" />
                Fully insured
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon name="check" className="h-5 w-5 text-trust" />
                Afterpay available
              </span>
            </div>
          </div>

          {/* guarantee card */}
          <div className="relative">
            <div className="rounded-xl2 border border-white/10 bg-white/[0.06] p-6 shadow-lift backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gold text-navy-deep">
                  <Icon name="shield" className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gold">The Main10 Guarantee</p>
                  <p className="text-xs text-white/60">Backed in writing</p>
                </div>
              </div>
              <p className="mt-5 text-lg font-medium leading-snug">
                &ldquo;If a Main10 clean doesn&apos;t pass your inspection, we
                return within 24 hours and fix it — at no cost to you.&rdquo;
              </p>
              <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  ['24h', 'Re-clean response'],
                  ['7-day', 'Guarantee window'],
                  ['$0', 'Re-clean cost'],
                ].map(([n, l]) => (
                  <div key={l} className="rounded-lg bg-white/5 p-3">
                    <dt className="text-xl font-black text-gold">{n}</dt>
                    <dd className="mt-1 text-[11px] leading-tight text-white/65">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
