# Main10 Clean — Month 2 Plan (Days 31–60)

## Executive Summary

Month 2 builds on the 20-client base from Month 1 and shifts focus from acquisition to **depth**: more suburbs, a premium tier, automated systems, partner referral channels, and a loyal repeat-client base.

**Goal**: Reach 50 active recurring clients by Day 60.

| Role | Month 2 Focus |
|------|---------------|
| **Ops Lead 1** | Premium tier, suburb expansion (10+), partner outreach, CRM automation setup |
| **Ops Lead 2** | Loyalty program launch, seasonal campaign, ad optimisation, review management |

### Month 2 Success Metrics

| Metric | Target |
|--------|--------|
| Active recurring clients | 50 |
| Total suburbs with live pages | 25+ |
| Partner referral bookings | 5+ |
| Google reviews (cumulative) | 25+ |
| Loyalty emails sent | 10+ |
| Cost per booked lead | < $12 |
| Email list size | 100+ contacts |

### New CLI Commands (Month 2)

| Command | Use |
|---------|-----|
| `python scheduler.py partner --type real-estate --suburb "Richmond"` | Generate partner pitch email |
| `python scheduler.py loyalty --client "Sarah" --milestone 5` | Generate loyalty milestone email |
| `python scheduler.py campaign --type spring-clean --suburbs "Richmond,Northcote"` | Generate campaign copy kit |

---

## Week 5 — Tier & Partner Foundation (Days 31–37)

**Theme**: Introduce the Premium tier, begin partner outreach, automate the email sequence.  
**KPIs**: Premium tier live on website, 10 partner outreach emails sent, email automation active.

### Day 31 — Launch Premium Clean Tier
**Owner**: Ops Lead 1

Add a fourth service tier: **Premium Clean** at $80–90/hr.

What's included beyond the Deep Clean:
- Steam cleaning of grout and tile
- Interior window cleaning
- Blind and venetian cleaning
- Mattress vacuuming
- Full wardrobe interior wipe-down

Update: Pricing page (add Premium card), Services page (new section), GBP service list, and all suburb pages.

---

### Day 32 — Update Suburb Pages for Premium Tier
**Owner**: Ops Lead 1

Add a "Premium Clean" block to every existing suburb page. Regenerate any suburb pages that need a full refresh:
```bash
python scheduler.py suburb --suburb "[Suburb]"
```
Review output and add Premium tier details manually.

---

### Day 33 — Begin Real Estate Agent Outreach
**Owner**: Ops Lead 1

Identify 10–15 real estate agencies operating in your top 5 suburbs. Look for: lettings-focused offices, agencies with high rental listing volume.

Generate personalised pitch emails:
```bash
python scheduler.py partner --type real-estate --suburb "Richmond" --contact "James"
```

Send to the property management or lettings manager directly. Use their first name if you can find it.

Template reference: `templates/partner-pitch.md`

---

### Day 34 — Begin Property Manager Outreach
**Owner**: Ops Lead 1

Identify 5–10 independent property management companies (not the big chains) in your service area. Smaller PMs often welcome reliable cleaning referrals more readily.

```bash
python scheduler.py partner --type property-manager --suburb "Northcote" --contact "Priya"
```

---

### Day 35 — Begin AirBnB / Short-Stay Outreach
**Owner**: Ops Lead 2

Search AirBnB for top-rated Melbourne hosts in your service area. Join Melbourne AirBnB host Facebook groups (e.g. "Melbourne AirBnB Hosts") and introduce Main10 Clean.

```bash
python scheduler.py partner --type airbnb --suburb "St Kilda"
```

AirBnB hosts need fast, reliable changeover cleans — emphasise same-day turnaround and flexible scheduling.

---

### Day 36 — Set Up CRM Email Automation
**Owner**: Ops Lead 1

Move from manual email sends (CLI + copy-paste) to an automated trigger sequence.

**Recommended free-tier tools**:
- **Mailchimp**: Customer Journey builder, up to 1,000 contacts free
- **HubSpot CRM**: free tier, good sequencing
- **Klaviyo**: strong for e-commerce flow but works for services

**Automation to set up**:
- Trigger: new booking confirmed → send Email 1 (Day 0), Email 2 (Day 3), Email 3 (Day 7)
- Trigger: 5 cleans completed → send loyalty milestone email
- Trigger: 10 cleans completed → send loyalty milestone email

Use CLI output as the content source for the email templates.

---

### Day 37 — Partner Follow-Up Cadence
**Owner**: Ops Lead 1 + Ops Lead 2

Send follow-up lines (from CLI output) to any partners who didn't respond to the Day 33–35 outreach.

Track all outreach in the partnership spreadsheet: partner name, type, suburb, date contacted, response status, next action.

---

## Week 6 — Loyalty Program & Suburb Expansion (Days 38–44)

**Theme**: Launch the loyalty program, expand to 10+ new suburbs.  
**KPIs**: Loyalty program announced to all existing clients, 10 new suburb pages live.

### Day 38 — Design Loyalty Program Structure
**Owner**: Ops Lead 2

Define the tiers:
- **5 cleans**: $10 off next clean
- **10 cleans**: $20 off next clean + "Main10 Regular" status (priority booking)
- **20 cleans**: $30 off + a free add-on (inside fridge or oven) on their next clean
- **Referral bonus**: $20 off for client + $20 off for the friend they refer (ongoing)

Document this in `templates/loyalty-program.md`.

---

### Day 39 — Announce Loyalty Program to Existing Clients
**Owner**: Ops Lead 2

Send a loyalty launch email to all existing clients. Generate personalised milestone emails for any client who has already hit 5 or 10 cleans:

```bash
python scheduler.py loyalty --client "Tom" --milestone 5
python scheduler.py loyalty --client "Emma" --milestone 10
```

For clients who haven't hit a milestone yet, send a brief "coming soon" announcement email.

---

### Day 40 — Expand to 10 New Suburbs
**Owner**: Ops Lead 1

Generate and publish suburb pages for the next wave. Prioritise by:
1. Proximity to existing high-booking suburbs
2. Population density and renter proportion (ABS data or Domain suburb profiles)
3. Gaps in your GBP service area

Recommended next-wave suburbs: Clifton Hill, Thornbury, Preston, Fitzroy North, Kensington, Footscray, Yarraville, Prahran, Windsor, South Yarra.

```bash
python scheduler.py suburb --suburb "South Yarra"
# repeat for each
```

Add each to: GBP service area, booking form dropdown, suburb tracking spreadsheet.

---

### Day 41 — Add Premium Tier to New Suburb Pages
**Owner**: Ops Lead 1

Edit each new suburb page to include a Premium Clean service block. Check that all CTAs link to the booking form with the suburb pre-selected if your booking tool supports it.

---

### Day 42 — Review Partner Outreach Results
**Owner**: Ops Lead 1 + Ops Lead 2

Tally responses from the Day 33–37 outreach:
- How many replied?
- How many are interested?
- Any referral bookings so far?

For any interested partners: arrange a call or send a partner welcome kit (PDF or email with referral code, discount terms, and your booking link).

---

### Day 43 — Launch Spring Clean Campaign (if timing aligns)
**Owner**: Ops Lead 2

Run if it's August–October. Generate the full campaign kit:

```bash
python scheduler.py campaign --type spring-clean --suburbs "Richmond,Northcote,Fitzroy,Brunswick,Elwood"
```

Deploy across: email (all existing clients), social (FB/IG), GBP post, and suburb landing page banners.

Template reference: `templates/seasonal-campaign.md`

---

### Day 44 — Add Retargeting Audience to Meta Ads
**Owner**: Ops Lead 2

Install the Meta Pixel on your website (if not already done). Create a retargeting audience: "Website visitors in the last 30 days who didn't book".

Run a retargeting campaign at $10/day with Variant B (offer-led copy) from `templates/ad-copy.md`. Retargeting CPL should be < $8 since these are warm leads.

---

## Week 7 — Optimisation & Automation (Days 45–51)

**Theme**: Improve conversion rates, scale what's working, automate what's repeatable.  
**KPIs**: Email automation live, top 5 suburb pages A/B tested, ad CPL < $12.

### Day 45 — A/B Test Top 5 Suburb Page Headlines
**Owner**: Ops Lead 1

For the 5 best-performing suburb pages: test a second headline variant. Use the CLI to regenerate fresh copy and compare:
```bash
python scheduler.py suburb --suburb "Richmond" > content/richmond-v2.md
```

Compare CTR (from GA4 or your analytics tool) between original and new headline after 7 days.

---

### Day 46 — Refresh GBP Posts for New Suburbs
**Owner**: Ops Lead 2

Publish a "Now serving [suburb]" GBP post for each of the 10 new suburbs added in Week 6. Write in batches of 5 each sitting.

---

### Day 47 — Send Mid-Month Check-In to All Clients
**Owner**: Ops Lead 2

Send a brief mid-month email to all active clients:
- "Thanks for being a Main10 Clean regular"
- A reminder of their current loyalty tier and how close they are to the next milestone
- A soft ask to refer a friend

Generate personalised loyalty emails for anyone who recently hit a milestone.

---

### Day 48 — Audit Booking Flow for Drop-Off
**Owner**: Ops Lead 1

Use Google Analytics or your booking tool's funnel data to find where visitors drop off:
- Landing page → booking form: if < 5% click through, improve the CTA or reduce friction
- Form step 1 → step 2: if drop-off here, shorten the form
- Form step 2 → confirmation: if drop-off here, check for error messages or slow loading

Fix the biggest drop-off point. Test on mobile first (most visitors will be on mobile).

---

### Day 49 — Expand Partner Program to 20 Contacts
**Owner**: Ops Lead 1

Send a second wave of partner outreach to 10 more contacts. Use CLI to generate:
```bash
python scheduler.py partner --type property-manager --suburb "South Yarra" --contact "Michael"
```

For any existing partners who have referred a booking: send a personal thank-you email and reinforce the value of the arrangement.

---

### Day 50 — Scale Winning Ad Suburbs
**Owner**: Ops Lead 2

Review 4-week ad performance data. For suburbs with CPL < $10 and CTR > 2.5%: double the daily budget. For suburbs with CPL > $20: pause and replace with a new suburb from the expansion list.

Run a new Variant C (social proof) ad for any suburb where you now have 5+ Google reviews.

---

### Day 51 — Review and Respond to All New Reviews
**Owner**: Ops Lead 2

Check GBP and respond to every review received in the last 2 weeks. For particularly detailed positive reviews: screenshot and use in Variant C ad copy (with implied permission — the review is public).

---

## Week 8 — Consolidate & Plan Month 3 (Days 52–60)

**Theme**: Consolidate gains, measure everything, plan the next 30 days.  
**KPIs**: 50 active clients, 25+ reviews, partner program active, Month 3 plan drafted.

### Days 52–55 — Steady-State Operations
**Owner**: Ops Lead 1 + Ops Lead 2

Maintain routine:
- Before every job: `python scheduler.py sop --job "..."`
- After every job: `python scheduler.py emails --client "..." --job "..."`
- Weekly GBP posts (1 per active suburb per week, in batches)
- Partner follow-ups on anyone who hasn't replied in 10+ days
- Loyalty emails for milestone clients

---

### Day 56 — End-of-Lease Season Prep (if Jan–Feb)
**Owner**: Ops Lead 2

Melbourne's lease turnover peaks in January–February. If Month 2 lands in this window, generate the campaign kit:
```bash
python scheduler.py campaign --type end-of-lease --suburbs "Richmond,Fitzroy,Brunswick,Northcote"
```

Set up a dedicated landing page and run targeted ads at renters (Facebook interest: "renting", "moving").

---

### Day 57 — Update Pricing for Premium Tier Performance
**Owner**: Ops Lead 1

Check how many Premium Clean bookings you've had in Month 2. If demand is strong: consider introducing a "Premium Clean Package" (e.g. quarterly Premium + fortnightly Standard bundle at a fixed monthly rate).

If demand is low: review whether the Premium tier is visible enough on suburb pages and in ads.

---

### Day 58 — Assess Partner Program ROI
**Owner**: Ops Lead 1 + Ops Lead 2

Tally partner-referred bookings for the month:
- Which partner type (real estate, PM, AirBnB) drove the most bookings?
- Which suburbs had active partners?
- What was the CPL vs direct ad channels?

Double down on the highest-ROI partner type. Pause outreach to channels producing 0 referrals after 4 weeks.

---

### Day 59 — Full KPI Review
**Owner**: Ops Lead 1 + Ops Lead 2

Pull all data for Days 31–59:
- Active recurring clients (target: 50)
- Total completed jobs
- GBP reviews (target: 25+)
- Partner referral bookings
- Email open rates and click rates
- Ad CPL per suburb
- Loyalty milestone emails sent

Document findings in the "What's Working" log.

---

### Day 60 — Month 2 Review & Month 3 Planning
**Owner**: Ops Lead 1 + Ops Lead 2  
**Format**: 45-minute meeting

**Retrospective questions**:
1. Did we hit 50 active clients?
2. Which 5 suburbs are now our highest-volume?
3. Is the Premium tier pulling its weight?
4. Which partner type should we double down on?
5. What's the biggest operations bottleneck at this scale?

**Month 3 priorities to consider**:
- Hire a 6th cleaner if demand is exceeding capacity
- Build a client portal (booking management, clean history, invoice download)
- Launch a Google Ads (Search) campaign in top 3 suburbs
- Introduce a gift card / corporate gifting product
- Investigate franchise or territory model if growth warrants it

---

## Template & Tool Reference

| Resource | Location | CLI command |
|----------|----------|-------------|
| Partner outreach emails | `templates/partner-pitch.md` | `python scheduler.py partner` |
| Loyalty milestone emails | `templates/loyalty-program.md` | `python scheduler.py loyalty` |
| Seasonal campaign copy kit | `templates/seasonal-campaign.md` | `python scheduler.py campaign` |
| Month 2 CSV (Notion import) | `month2-plan.csv` | — |
| All Month 1 templates | `templates/` | — |
| Full CLI documentation | `README.md` | — |
