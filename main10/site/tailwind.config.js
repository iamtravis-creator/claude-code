/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Main10 brand palette (carried over from the original landing page)
        navy: {
          DEFAULT: '#1a3c5e',
          deep: '#0d2540',
        },
        gold: {
          DEFAULT: '#f0a500',
          dark: '#c88400',
        },
        trust: {
          DEFAULT: '#2e7d32',
          light: '#e8f5e9',
        },
        ink: '#1a1a2e',
        muted: '#5a6478',
        surface: '#ffffff',
        canvas: '#f7f9fc',
        hair: '#dde3ec',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 3px rgba(13, 37, 64, 0.06), 0 8px 24px rgba(13, 37, 64, 0.06)',
        lift: '0 12px 40px rgba(13, 37, 64, 0.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
