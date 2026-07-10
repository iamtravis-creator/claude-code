/** @type {import('tailwindcss').Config} */

// Semantic, themeable color tokens. Each maps to a CSS variable (R G B
// channels) defined per-theme in index.css, so a single [data-theme] swap
// restyles the whole site. <alpha-value> keeps Tailwind opacity modifiers working.
const token = (name) => `rgb(var(${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: token('--c-canvas'), // page background
        surface: token('--c-surface'), // cards / inputs
        ink: token('--c-ink'), // body text
        muted: token('--c-muted'), // secondary text
        hair: token('--c-hair'), // borders / dividers
        heading: token('--c-heading'), // headings on light surfaces
        band: token('--c-band'), // dark/colored section background (always light text)
        accent: token('--c-accent'), // primary CTA colour
        accentdark: token('--c-accentdark'), // CTA hover / eyebrow
        accentink: token('--c-accentink'), // text that sits on the accent colour
        trust: token('--c-trust'), // success / checkmarks
        trustlight: token('--c-trustlight'), // success chip background
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgb(var(--c-shadow) / 0.06), 0 8px 24px rgb(var(--c-shadow) / 0.06)',
        lift: '0 12px 40px rgb(var(--c-shadow) / 0.14)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
