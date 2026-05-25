# Main10 Clean — 30-Day Melbourne Go-To-Market Plan

## Executive Summary

**Business**: Main10 Clean — residential cleaning services, Melbourne inner suburbs  
**Goal**: 20 recurring weekly or fortnightly clients within 30 days of launch  
**Team**: 2 Ops Leads + 5 Cleaners

| Role | Focus | Heavy days |
|------|-------|------------|
| **Ops Lead 1** | Brand, website, local SEO, systems | Days 1–14, 19, 27–29 |
| **Ops Lead 2** | CX, reviews, ads, metrics | Days 15–17, 20–26, 30 |

**Target suburbs**: Richmond, Northcote, Elwood, Camberwell, Brunswick, Caulfield, Brunswick East, Brighton, St Kilda, Balaclava

**Pricing**: Standard $35–45/hr · Deep $55–75/hr · Move-in/Move-out fit-to-job or hourly premium

### Success Metrics (30 days)

| Metric | Target |
|--------|--------|
| Google Business Profile views | 500+ |
| GBP calls / website clicks | 50+ |
| Completed paid jobs | 20+ |
| Google reviews | 10+ |
| Recurring weekly/fortnightly clients | 20 |
| Cost per booked lead | < $15 |
| Email open rate (post-clean sequence) | > 40% |

### CLI Tool Usage Summary

| Stage | Command | Owner |
|-------|---------|-------|
| Before every job | `python scheduler.py sop --job "..."` | Ops Lead 1 or 2 |
| After every job | `python scheduler.py emails --client "..." --job "..."` | Ops Lead 2 |
| Adding a suburb page | `python scheduler.py suburb --suburb "..."` | Ops Lead 1 |
| Pre-planning a full day's roster | `python scheduler.py batch jobs.json` | Ops Lead 1 or 2 |

---

## Week 1 — Foundation (Days 1–7)

**Theme**: Define the offer, lock the brand, get infrastructure live.  
**Owner**: Ops Lead 1  
**KPIs**: Service bundles finalised, GBP live, 5 core suburb pages published, booking form operational.

### Day 1 — Define ICP & Suburbs
**Owner**: Ops Lead 1

Define ideal customer profile: busy families and professionals in 10–15 inner-ring Melbourne suburbs.

Lock the 10 launch suburbs: Richmond, Northcote, Elwood, Camberwell, Brunswick, Caulfield, Brunswick East, Brighton, St Kilda, Balaclava.

Create a tracking spreadsheet: columns for suburb, page live date, GBP service area confirmed, first booking date, review count.

**Why**: Anchors all marketing, messaging, and suburb page copy to real Melbourne households.

---

### Day 2 — Finalise Service Bundles
**Owner**: Ops Lead 1

Lock 3 bundles with exact inclusions, exclusions, and price ranges:
- **Standard** ($35–45/hr): light refresh, 1–2 rooms + bathroom, ideal for weekly/fortnightly maintenance
- **Deep** ($55–75/hr): whole home, oven, inside fridge, skirting boards, blinds
- **Move-in / Move-out**: fit-to-job or hourly premium; bond-back focus, all fixtures + appliances

Write a 50-word description for each bundle. Run 3–5 competitor price checks.

---

### Day 3 — Lock Pricing & Draft Pricing Page
**Owner**: Ops Lead 1

Finalise per-room pricing examples for 1–4 bed properties across each bundle.

Draft the Pricing page: lead with a value statement ("No haggling. No hidden fees."), 3 bundle cards with price ranges + inclusions, "Get a quote" CTA. Keep URL clean: `/pricing`.

---

### Day 4 — Build Core Website Pages
**Owner**: Ops Lead 1

Launch 7 pages: Home, Services, Pricing, How It Works (3–4 step process), About (founder story, insurance, checks), FAQ (seed with content from `templates/faq-content.md`), Contact/Book.

Every page needs at least one CTA linked to the booking form.

---

### Day 5 — Create & Verify Google Business Profile
**Owner**: Ops Lead 1

Create GBP: "Main10 Clean – Melbourne Residential Cleaning"

Fill every field: service areas (list all 10–15 suburbs individually, not a radius), category "House Cleaning Service" + "Cleaning Service", phone/email/website, business hours, attributes ("insured", "background-checked staff", "online booking available"), 10–15 photos (team, before/after, supplies).

Request verification.

---

### Day 6 — Draft FAQ & Trust Messaging
**Owner**: Ops Lead 1

Draft FAQ blocks across 6 categories: Trust & Safety, Access, Pets, Pricing, Hidden Fees, Products.

Identify the top 3 objections from competitor reviews. Ensure each has a strong FAQ answer.

Full FAQ content template: `templates/faq-content.md`

---

### Day 7 — Objection-Handling Drill with Cleaners
**Owner**: Ops Lead 1 (+ all 5 Cleaners)

1-hour session covering:
- "I don't trust strangers in my home" → background checks, insurance, reviews, same-cleaner policy
- "You're too expensive" → explain value, recurring discount, cost vs DIY
- "I'm never home — how do you get in?" → key safe, lockbox, digital lock, concierge procedure
- What to do if a client is dissatisfied mid-job → stop work, call Ops Lead, do not argue

---

## Week 2 — Website, Local SEO & Systems (Days 8–14)

**Theme**: Digital infrastructure fully live and generating leads.  
**Owner**: Ops Lead 1  
**KPIs**: Booking form live, 5+ suburb pages published, end-to-end booking flow tested, GBP active.

### Day 8 — Finalise Homepage & Services Pages
**Owner**: Ops Lead 1

Homepage: clear above-the-fold value prop, 3 service cards, 1–2 proof points, 3 CTAs ("Book 10% off your first clean", "Check availability", "Refer a neighbour").

Services page: one section per bundle with description, inclusions list, price range, "Book this service" button.

---

### Day 9 — Launch 5–7 Suburb Landing Pages
**Owner**: Ops Lead 1

**CLI**: `python scheduler.py suburb --suburb "Richmond"` — repeat for each

First wave: Richmond, Northcote, Fitzroy, Brunswick, Elwood

URL structure: `/cleaning/[suburb-name]`. Page title: "House Cleaning [Suburb] | Main10 Clean". Review and lightly edit CLI output before publishing — add local detail where you know it.

Template reference: `templates/suburb-page-template.md`

---

### Day 10 — Add CTAs & Booking Form Links
**Owner**: Ops Lead 1

Add 1–2 CTAs on every page. Connect all CTAs to the online booking form/calendar. Verify every CTA works on mobile.

---

### Day 11 — Finalise GBP Optimisation
**Owner**: Ops Lead 1

Add all 10–15 suburbs to service area. Confirm business category, attributes, and service list matches the website. Add captions to all photos. Follow up on verification if still pending.

---

### Day 12 — Publish First 3 GBP Posts
**Owner**: Ops Lead 1

- Post 1 (Offer): "10% off your first clean in Melbourne" + booking link
- Post 2 (What's New): "Why Main10 Clean?" — 3 bullets: vetted cleaners, transparent pricing, easy booking
- Post 3 (What's New): "Now serving [new suburb]" — description + photo

Schedule 1 post per week ongoing from this point.

---

### Day 13 — Set Up Online Booking & Email Capture
**Owner**: Ops Lead 1

Configure booking form: name, email, phone, suburb (dropdown of all 10–15), service type, preferred date/time, special notes.

Set up: instant email notification to Ops Lead 1 + client auto-confirmation. Build email list in Mailchimp free tier or similar. Plan post-clean email trigger for Ops Lead 2 to activate after each job.

---

### Day 14 — Test End-to-End Booking Flow
**Owner**: Ops Lead 1

Book 1–2 dummy jobs from a different device. Verify: form submission → confirmation email → Ops Lead notification → calendar entry.

Test CLI tools:
```bash
python scheduler.py sop --job "2-bed test job, dummy suburb, 1 cleaner"
python scheduler.py emails --client "Test" --job "2-bed, dummy suburb"
```

Document any friction and fix before soft launch.

---

## Week 3 — Launch Prep & Early Reviews (Days 15–21)

**Theme**: Test with real customers, collect first reviews, refine everything.  
**KPIs**: 5–10 completed soft-launch jobs, 3+ Google reviews, QR workflow live, email sequence sent after every job.

### Day 15 — Design QR Feedback Card
**Owner**: Ops Lead 2

Design a two-sided card (Canva free tier):
- Front: "How was your Main10 Clean?" + QR code
- Back: "Scan to review us on Google + get $20 off your next clean"

QR links to `main10.au/review` → Google Maps review page. Print 50–100 cards.

---

### Day 16 — Set Up QR & Review Workflow
**Owner**: Ops Lead 2

Create short URL: `main10.au/review` → Google review page (Bitly free tier).

Generate QR code, test full flow: scan → landing page → Google review.

Create separate short URL for job card QR codes used in SOPs (arrival/departure tracking).

---

### Day 17 — Draft 3-Email Post-Clean Sequence
**Owner**: Ops Lead 2

**CLI**: `python scheduler.py emails --client "[Name]" --job "[details]"`

Email schedule:
- Email 1 (same day, within 2 hrs): Thank you + review ask + $20 off incentive
- Email 2 (Day 3): Satisfaction check + soft review reminder
- Email 3 (Day 7): Referral offer — $20 off for both client and friend

Load personalised versions into your email tool. For the first 20 clients, use the CLI for each.

Template reference: `templates/email-sequence.md`

---

### Day 18 — Train Cleaners on QR + Communication
**Owner**: Ops Lead 1 + Ops Lead 2 (+ all 5 Cleaners)

30-minute briefing:
- When to leave the QR card: always, on bench before leaving
- Verbal prompt: "We've left a card on the bench — if you have a moment, a Google review really helps us out"
- What to do if a client seems unhappy: call Ops Lead 2 immediately, do not fix it yourself, do not leave without handover
- Arrival and departure QR scan procedure

---

### Day 19 — Confirm Full Suburb Coverage
**Owner**: Ops Lead 1

Verify all 10–15 target suburbs are: (a) live as suburb pages, (b) in GBP service area, (c) in the booking form dropdown. Fix any gaps. Generate missing pages:
```bash
python scheduler.py suburb --suburb "[Missing Suburb]"
```

---

### Day 20 — Soft Launch (3–5 Suburbs)
**Owner**: Ops Lead 2 (+ Cleaners 1–5)

Start taking and fulfilling real bookings in Richmond, Northcote, Fitzroy, Brunswick, Elwood.

Target: 5–10 jobs this week.

Before each job: `python scheduler.py sop --job "[description]"` → print for cleaner.  
After each job: `python scheduler.py emails` → send within 2 hours.  
After each job: Cleaner leaves QR card.

Log every job: date, suburb, cleaner, service type, duration, issues, review received (Y/N).

---

### Day 21 — Collect & Act on Feedback
**Owner**: Ops Lead 2

Call or message every soft-launch client: "Anything we should improve?"

Collect cleaner feedback: access issues, unclear SOP steps, product gaps.

Key questions: "What made you book?", "Was booking easy?", "Any surprises?"

Update website, FAQ, pricing, and suburb pages based on real answers.

---

## Week 4 — Go-Live, Ads & Optimisation (Days 22–30)

**Theme**: Full public launch. Activate paid ads. Optimise from data. Expand suburbs.  
**KPIs**: 20 cumulative bookings, 5+ recurring clients confirmed, 10+ Google reviews, CPL < $15.

### Day 22 — Activate Public Promotions
**Owner**: Ops Lead 2

Make "10% off first clean" visible on homepage, every suburb page, GBP, and all CTAs.

Add recurring discount badge to pricing page (5% fortnightly, 10% weekly).

Create referral code format: `REFER-[CLIENTNAME]`, track in spreadsheet.

---

### Day 23 — Launch Hyper-Local Ads
**Owner**: Ops Lead 2

Budget: $20–30/day, start with 2 best-performing suburbs from soft launch.

Facebook/Instagram campaign:
- Objective: Leads (or Traffic if leads not yet set up)
- Targeting: 1–3 km radius, age 25–55, homeowners + renters
- Run 2–3 creative variants per suburb — see `templates/ad-copy.md`
- Total test budget cap: $200 for first week

Kill ad sets with CPL > $25 after 3 days. Scale ad sets with CPL < $15.

---

### Day 24 — Respond to All GBP Reviews
**Owner**: Ops Lead 2

Check GBP and respond to every review within 24 hours:
- Positive: thank by name, mention suburb, invite them back
- Negative: acknowledge, apologise, offer to fix privately ("Please reach out at [email]")

Never argue publicly.

---

### Day 25 — Increase GBP Posting Frequency
**Owner**: Ops Lead 2

Post 1 GBP update per suburb per week going forward.

Rotate post types: offer (discount), update (new suburb or service), thank-you (review milestone), seasonal.

Create 4–5 posts in bulk each Monday — spend 30 minutes.

---

### Day 26 — Review KPIs & Identify Quick Wins
**Owner**: Ops Lead 1 + Ops Lead 2

Pull data: GBP views, calls, website clicks, form submissions, bookings, reviews.

Identify 1–2 conversion wins:
- Which suburb page converts best? Copy its structure to others.
- Is the pricing page getting traffic but few bookings? Simplify it.
- Are email open rates low? Test a new subject line.

---

### Day 27 — Optimise Top 3 Suburb Pages
**Owner**: Ops Lead 1

Pick the 3 suburbs with most traffic or bookings.

For each: test a new headline, strengthen CTA (add urgency: "Only 3 spots left this week in [suburb]"), add a real review quote if available, ensure booking form is above fold on mobile.

---

### Day 28 — Add 3–5 New Suburb Pages
**Owner**: Ops Lead 1

**CLI**: `python scheduler.py suburb --suburb "[New Suburb]"` for each

Next-wave suburbs: Caulfield East, Caulfield North, Thornbury, Fitzroy North, Clifton Hill, Reservoir.

Generate, edit, publish. Add to GBP service area and booking form dropdown.

---

### Day 29 — Finalise 1-Page Cleaner SOP
**Owner**: Ops Lead 1 + Ops Lead 2

Generate a standard reference SOP:
```bash
python scheduler.py sop --job "2-bed regular clean, Melbourne inner suburb, 1 cleaner, key safe"
```

Lightly edit for generality. Print 2 copies per cleaner (laminate one). Distribute digitally at `templates/cleaner-sop.md`. Hand the print-ready checklist from `templates/cleaner-checklist.md` to each cleaner.

---

### Day 30 — 30-Day Review & Month-2 Planning
**Owner**: Ops Lead 1 + Ops Lead 2

30-minute review meeting:
1. Did we hit 20 recurring clients? What was the gap?
2. Which suburb converted best?
3. Which cleaner received the most positive feedback?
4. What was the biggest booking friction point?
5. What would we do differently in Week 1?

**Month-2 priorities**:
- Expand to 10+ additional suburbs
- Test a "Premium Clean" tier at $85/hr
- Automate email sequence via CRM (HubSpot free, Klaviyo, or ActiveCampaign)
- Introduce a loyalty program
- Partner outreach: real estate agencies, property managers, AirBnB co-hosts
- Spring Clean seasonal campaign (August–September)

---

## Ops Lead 1 — Full Task View

*Brand · Website · SEO · Systems*

| Day | Task |
|-----|------|
| 1 | Define ICP + lock 10 launch suburbs |
| 2 | Finalise 3 service bundles with descriptions |
| 3 | Lock pricing + draft Pricing page |
| 4 | Build 7 core website pages |
| 5 | Create + verify Google Business Profile |
| 6 | Draft FAQ blocks (6 categories) |
| 7 | Objection-handling drill with cleaners |
| 8 | Finalise homepage + Services page |
| 9 | Launch 5–7 suburb landing pages |
| 10 | Add CTAs + connect booking form to all pages |
| 11 | Finalise GBP: service areas, categories, photos |
| 12 | Publish 3 GBP posts |
| 13 | Configure booking form + email capture |
| 14 | Test end-to-end booking flow |
| 18 | Co-lead cleaner training on QR + communication |
| 19 | Confirm full suburb coverage across GBP + website |
| 26 | Co-lead KPI review |
| 27 | Optimise top 3 suburb pages |
| 28 | Add 3–5 new suburb pages |
| 29 | Co-finalise 1-page SOP + distribute to cleaners |
| 30 | Co-lead 30-day review + Month-2 planning |

---

## Ops Lead 2 — Full Task View

*CX · Reviews · Ads · Metrics*

| Day | Task |
|-----|------|
| 15 | Design QR feedback card (front + back) |
| 16 | Set up QR → short URL → Google review workflow |
| 17 | Draft + load 3-email post-clean sequence |
| 18 | Co-lead cleaner training on QR + communication |
| 20 | Run soft launch in 3–5 suburbs (with cleaners) |
| 21 | Collect + act on feedback from soft-launch jobs |
| 22 | Activate public promo ("10% off first clean") |
| 23 | Launch hyper-local FB/IG ads |
| 24 | Review + respond to all GBP reviews |
| 25 | Increase GBP posting frequency (1/suburb/week) |
| 26 | Co-lead KPI review |
| 29 | Co-finalise 1-page SOP |
| 30 | Co-lead 30-day review + Month-2 planning |

---

## Template & Tool Reference

| Resource | Location | CLI command |
|----------|----------|-------------|
| Email sequence templates | `templates/email-sequence.md` | `python scheduler.py emails` |
| Suburb landing page template | `templates/suburb-page-template.md` | `python scheduler.py suburb` |
| Cleaner SOP template | `templates/cleaner-sop.md` | `python scheduler.py sop` |
| Cleaner 30-day checklist | `templates/cleaner-checklist.md` | — print and hand out |
| FB/IG ad copy | `templates/ad-copy.md` | — use manually |
| FAQ content blocks | `templates/faq-content.md` | — paste into website |
| Notion-importable CSV | `launch-plan.csv` | — import into Notion |
| Full CLI documentation | `README.md` | — |
