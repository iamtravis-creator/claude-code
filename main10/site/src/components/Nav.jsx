import { useEffect, useState } from 'react'
import { business } from '../data/site'
import Icon from './Icon'

const links = [
  { href: '#how', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#quote', label: 'Get a quote' },
  { href: '#agencies', label: 'For agencies' },
  { href: '#faq', label: 'FAQ' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition ${
        scrolled
          ? 'bg-band/95 shadow-lift backdrop-blur'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2 text-white">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent font-black text-accentink">
            M
          </span>
          <span className="text-lg font-extrabold tracking-tight">Main10</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/80 transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a href={business.phoneHref} className="btn-primary">
            <Icon name="phone" className="h-4 w-4" />
            {business.phone}
          </a>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-band md:hidden">
          <div className="container-x flex flex-col gap-1 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/85 hover:bg-white/10"
              >
                {l.label}
              </a>
            ))}
            <a href={business.phoneHref} className="btn-primary mt-2">
              <Icon name="phone" className="h-4 w-4" />
              Call {business.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
