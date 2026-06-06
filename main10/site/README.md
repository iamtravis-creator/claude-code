# Main10 Cleaning — Website

A React + Tailwind marketing site for Main10 Cleaning, Melbourne's end-of-lease
cleaning specialists. Built with Vite.

## Stack

- **React 18** — component-based UI
- **Tailwind CSS 3** — utility-first styling (brand palette in `tailwind.config.js`)
- **Vite 5** — dev server + production build

## Develop

```bash
cd main10/site
npm install
npm run dev      # local dev server with hot reload
```

## Build

```bash
npm run build    # outputs static site to dist/
npm run preview  # preview the production build locally
```

The build is fully static (`dist/`) and can be hosted on any static host
(Netlify, Vercel, GitHub Pages, S3, etc.). `vite.config.js` uses a relative
`base` so it works from any path.

## Structure

```
src/
├── App.jsx                 # assembles the page sections
├── main.jsx                # React entry point
├── index.css               # Tailwind layers + component classes
├── data/site.js            # all copy, pricing, FAQ, suburbs (single source)
└── components/
    ├── Nav.jsx             # sticky nav with mobile menu
    ├── Hero.jsx            # headline + guarantee card
    ├── Features.jsx        # "Why Main10" grid
    ├── Checklist.jsx       # REIV checklist by area
    ├── Pricing.jsx         # fixed price tiers
    ├── QuoteCalculator.jsx # interactive instant-quote form
    ├── Testimonials.jsx    # social proof
    ├── PreferredSupplier.jsx # property-manager partnership
    ├── Suburbs.jsx         # service area
    ├── FAQ.jsx             # accordion
    ├── Footer.jsx          # final CTA + contact
    └── Icon.jsx            # inline SVG icon set
```

## Editing content

Most copy and all pricing live in `src/data/site.js` — edit there rather than
in the components. Update the contact details (`phone`, `email`) and the ABN /
insurance placeholders before going live.

## Note

The quote form is front-end only (no backend) — on submit it shows a
confirmation and directs the customer to call. Wire it to a form handler or
booking API before launch if you want submissions captured.
