// Single source of truth for Main10 site content.
// Pricing, copy and details mirror the business outreach materials.

export const business = {
  name: 'Main10 Cleaning',
  tagline: "Melbourne's End-of-Lease Specialists",
  phone: '0400 000 000',
  phoneHref: 'tel:+61400000000',
  email: 'hello@main10.com.au',
  web: 'main10.com.au',
}

export const features = [
  {
    title: 'REIV-Aligned Process',
    body: 'Every clean follows the Real Estate Institute of Victoria inspection checklist — room by room, nothing skipped.',
    icon: 'clipboard',
  },
  {
    title: '7-Day Free Re-Clean',
    body: 'If your inspection flags anything within 7 days, we return within 24 hours and fix it at no charge.',
    icon: 'shield',
  },
  {
    title: 'Photo Report Included',
    body: 'Timestamped before/after photos emailed to you and your agent the moment the clean is complete.',
    icon: 'camera',
  },
  {
    title: 'Fixed Prices, No Surprises',
    body: 'Flat pricing by bedroom count. No hourly rates, no padded invoices, no surprises on the day.',
    icon: 'tag',
  },
  {
    title: 'Fast Turnaround',
    body: 'Same-week availability as standard, with same-day slots for urgent vacate timelines.',
    icon: 'clock',
  },
  {
    title: 'Afterpay Available',
    body: 'Split the cost of your bond clean into four. Pay later while you wait for your bond to be released.',
    icon: 'wallet',
  },
]

export const pricing = [
  { size: '1 Bedroom', standard: 299, carpet: 349, popular: false },
  { size: '2 Bedroom', standard: 380, carpet: 450, popular: true },
  { size: '3 Bedroom', standard: 460, carpet: 549, popular: false },
  { size: '4+ Bedroom', standard: 550, carpet: 649, popular: false },
]

export const checklist = [
  {
    area: 'Kitchen',
    items: [
      'Oven — interior, racks & door glass',
      'Rangehood & filters',
      'Stovetop & splashback',
      'Benchtops & sink',
      'All cupboards inside & out',
      'Dishwasher & microwave',
    ],
  },
  {
    area: 'Bathrooms',
    items: [
      'Tiles & grout',
      'Shower screen descaled',
      'Toilet, vanity & mirror',
      'Exhaust fan & towel rails',
    ],
  },
  {
    area: 'Bedrooms & Living',
    items: [
      'Inside & outside all wardrobes',
      'Wardrobe tracks',
      'Skirting boards & architraves',
      'Ceiling fans & light fittings',
      'A/C filters',
    ],
  },
  {
    area: 'Windows & Floors',
    items: [
      'Interior glass, tracks & sills',
      'Flyscreens & blinds',
      'Vacuum & mop all floors',
      'Carpet steam (optional add-on)',
    ],
  },
]

export const testimonials = [
  {
    quote:
      'Got my full bond back with zero deductions. The photo report meant my agent had nothing to dispute. Worth every cent.',
    name: 'Jessica R.',
    detail: '2BR apartment, Richmond',
  },
  {
    quote:
      'Booked Thursday, cleaned Saturday, inspection passed Monday. The oven looked brand new. Could not fault them.',
    name: 'Daniel K.',
    detail: '3BR townhouse, Brunswick',
  },
  {
    quote:
      'Our agency now sends Main10 every vacate. No re-cleans, no tenant complaints, no chasing. They just handle it.',
    name: 'Priya S.',
    detail: 'Property Manager, Fitzroy',
  },
]

export const suburbs = [
  'Richmond',
  'St Kilda',
  'Fitzroy',
  'Brunswick',
  'South Yarra',
  'Northcote',
  'Prahran',
  'Carlton',
  'Collingwood',
  'Footscray',
]

export const faqs = [
  {
    q: 'Do you guarantee my bond back?',
    a: 'We guarantee our clean against the REIV inspection checklist. If your agent flags any cleaning issue within 7 days, we return within 24 hours and re-clean it free of charge. Bond release itself is decided by your agent, but our re-clean guarantee removes cleaning as a reason to withhold it.',
  },
  {
    q: 'How long does an end-of-lease clean take?',
    a: 'Most properties take 3–6 hours depending on size and condition. We work to a standard, not a clock — the job is done when it passes the checklist, not when an hourly timer runs out.',
  },
  {
    q: 'Is carpet steam cleaning included?',
    a: 'It is an optional add-on. Many leases require professional carpet cleaning, so we offer hot-water-extraction steam cleaning on any booking. Pricing is shown alongside the standard clean for each property size.',
  },
  {
    q: 'What if I need it done urgently?',
    a: 'Same-week availability is standard and we keep same-day slots open for urgent vacates. Call us directly and we will do everything we can to fit you in.',
  },
  {
    q: 'Are you insured?',
    a: 'Yes — Main10 carries public liability insurance and a certificate of currency is available on request.',
  },
]
