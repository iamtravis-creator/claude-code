import { business } from '../data/site'
import Icon from './Icon'

const benefits = [
  'Priority booking slots, including same-day urgent vacates',
  'Dedicated agency contact line',
  'Monthly consolidated invoicing',
  'Discounted volume pricing (5+ jobs/month)',
  'Co-branded tenant communication materials',
  'Photo report cc’d to your agency on every clean',
]

export default function PreferredSupplier() {
  return (
    <section id="agencies" className="section bg-canvas">
      <div className="container-x">
        <div className="overflow-hidden rounded-xl2 border border-hair bg-surface shadow-card">
          <div className="grid lg:grid-cols-2">
            <div className="bg-band p-8 text-white sm:p-10">
              <p className="eyebrow text-accent">For property managers</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                Preferred supplier partnerships
              </h2>
              <p className="mt-4 text-white/75">
                Stop chasing cleaners. We handle tenant coordination, deliver to
                REIV standard, and resolve any inspection issue within 24 hours —
                so you get faster bond releases and fewer disputes.
              </p>
              <div className="mt-8 rounded-xl2 border border-white/10 bg-white/[0.05] p-5">
                <p className="text-sm font-medium italic text-white/85">
                  &ldquo;You don&apos;t chase cleaners. We handle it.&rdquo;
                </p>
              </div>
              <a href={business.phoneHref} className="btn-primary mt-8">
                <Icon name="phone" className="h-4 w-4" />
                Talk to us about partnering
              </a>
            </div>

            <div className="p-8 sm:p-10">
              <h3 className="text-lg font-bold text-heading">
                Agencies on our preferred list receive
              </h3>
              <ul className="mt-6 space-y-4">
                {benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-sm text-ink">
                    <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-trustlight text-trust">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
