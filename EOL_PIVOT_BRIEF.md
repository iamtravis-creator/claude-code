# Main10 — End-of-Lease Niche Pivot

You are working on the Main10 codebase (single-file HTML site, n8n workflows, Mailchimp/Twilio automation). Reposition the business around end-of-lease (bond-back) cleaning as the primary wedge service while keeping other services available.

## Context
- Melbourne-based cleaning business, solo operator scaling up
- Existing: single-file HTML site, quote wizard with Afterpay integration
- Existing n8n Stage 1: Facebook Ads → Twilio SMS + Mailchimp
- Target customers: tenants 1-2 weeks from vacate date; secondary: property managers

## Tasks

### 1. Website restructure
- Update hero to lead with "Bond-Back Guarantee — Melbourne's End-of-Lease Specialists"
- Add a guarantee badge component (7-day free re-clean if agent flags issues)
- Build an EOL-specific landing page section with REIV-aligned room-by-room checklist (kitchen incl. oven/rangehood/filters, bathrooms, bedrooms incl. wardrobes/skirtings, living areas, windows/tracks/blinds, carpets)
- Add fixed-price-by-bedroom pricing table (1BR / 2BR / 3BR / 4BR+, with/without carpet steam)
- Suburb-targeted landing page template (parameterised) for top 10 Melbourne rental suburbs
- Bundle carpet steam as default-checked add-on in quote wizard

### 2. Trust assets
- Photo evidence gallery section (before/after grid)
- Testimonial block prioritising bond-return outcomes ("got our full $2400 bond back")
- Property manager logos strip (placeholder until partnerships land)

### 3. n8n workflow additions
- New "EOL Lead" tag in Mailchimp segmentation
- Urgency-aware drip: different cadence for "vacate <7 days" vs ">14 days"
- Post-job automation: send photo report PDF to tenant + nominated agent email
- Review request trigger 48hrs post-clean, gated on positive SMS reply

### 4. Property manager outreach kit
- One-page PDF pitch (Main10 branding) for cold-walking agencies
- Email template sequence for property manager outreach (intro, follow-up, value-add)
- Preferred supplier application boilerplate

## Constraints
- Keep the site as a single HTML file
- Maintain existing Main10 branding (do not invent new colours/logos — preserve what's in the current HTML)
- Don't break the existing quote wizard / Afterpay flow
- All copy in Australian English, tenant-facing tone (reassuring, time-pressured empathy)

## Deliverables
Work through tasks in order. Show diffs before applying changes to the live HTML. For n8n, export the new workflow JSON. For the outreach kit, output as separate markdown files.
