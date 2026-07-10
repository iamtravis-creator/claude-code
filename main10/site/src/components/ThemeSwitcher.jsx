import { useEffect, useRef, useState } from 'react'

export const THEMES = [
  { id: 'mint', label: 'Fresh Mint', swatch: '#0d9488', dot: '#84cc16' },
  { id: 'coral', label: 'Sunny Coral', swatch: '#ff5d52', dot: '#ffd6cf' },
  { id: 'dark', label: 'Premium Dark', swatch: '#0c1110', dot: '#34d399' },
]

const STORAGE_KEY = 'main10-theme'

export function applyTheme(id) {
  document.documentElement.dataset.theme = id
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState('mint')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Restore the saved theme on mount.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && THEMES.some((t) => t.id === saved)) {
      setTheme(saved)
      applyTheme(saved)
    }
  }, [])

  // Dismiss picker when clicking outside.
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const choose = (id) => {
    setTheme(id)
    applyTheme(id)
    localStorage.setItem(STORAGE_KEY, id)
    setOpen(false)
  }

  return (
    <div ref={ref} className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-2">
      {open && (
        <div className="overflow-hidden rounded-2xl border border-hair bg-surface p-1.5 shadow-lift">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => choose(t.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                theme === t.id ? 'bg-canvas text-heading' : 'text-muted hover:bg-canvas'
              }`}
            >
              <span
                className="grid h-6 w-6 flex-none place-items-center rounded-full ring-1 ring-black/10"
                style={{ background: t.swatch }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: t.dot }} />
              </span>
              {t.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change theme"
        className="flex items-center gap-2 rounded-full border border-hair bg-surface px-4 py-3 text-sm font-semibold text-heading shadow-lift transition hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="10.5" r="2.5" /><circle cx="8.5" cy="7.5" r="2.5" /><circle cx="6.5" cy="12.5" r="2.5" />
          <path d="M12 22a10 10 0 1 1 0-20 8 8 0 0 1 0 16h-2a2 2 0 0 0 0 4z" />
        </svg>
        Theme
      </button>
    </div>
  )
}
