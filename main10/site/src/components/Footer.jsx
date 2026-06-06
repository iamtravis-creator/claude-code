import { business } from '../data/site'
import Icon from './Icon'

export default function Footer() {
  return (
    <footer className="bg-band text-white">
      {/* Final CTA */}
      <div className="border-b border-white/10">
        <div className="container-x flex flex-col items-center gap-6 py-14 text-center sm:py-16">
          <h2 className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
            Ready to get your bond back?
          </h2>
          <p className="max-w-md text-white/70">
            Lock in a fixed price today. Same-week availability across Melbourne.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#quote" className="btn-primary text-base">
              Get my fixed price
              <Icon name="arrow" className="h-4 w-4" />
            </a>
            <a href={business.phoneHref} className="btn-ghost text-base">
              <Icon name="phone" className="h-4 w-4" />
              {business.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="container-x grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent font-black text-accentink">
              M
            </span>
            <span className="text-lg font-extrabold">Main10</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-white/60">
            {business.tagline}. Bond-back guarantee on every job. Fully insured.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-white/50">
            Services
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>End-of-lease cleaning</li>
            <li>Carpet steam cleaning</li>
            <li>Move-in cleaning</li>
            <li>Office cleaning</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-white/50">
            Company
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li><a href="#how" className="hover:text-white">Why Main10</a></li>
            <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
            <li><a href="#agencies" className="hover:text-white">For agencies</a></li>
            <li><a href="#faq" className="hover:text-white">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-white/50">
            Contact
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>
              <a href={business.phoneHref} className="hover:text-white">
                {business.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="hover:text-white">
                {business.email}
              </a>
            </li>
            <li>{business.web}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
          <p>Fully insured · Public liability certificate on request</p>
        </div>
      </div>
    </footer>
  )
}
