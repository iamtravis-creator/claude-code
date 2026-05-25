# Ops Lead 1 — Task Board

> **Focus**: Brand · Website · Local SEO · Systems · Partner Outreach

Use this as your personal task board. Update the Status column daily.

---

## Active This Week

*Move tasks here from the monthly plans each Monday.*

| Task | Month / Day | Status | Due | Notes |
|------|-------------|--------|-----|-------|
| | | | | |

---

## Month 1 Tasks — Full List

| Day | Task | Status |
|-----|------|--------|
| 1 | Define ICP + lock 10 launch suburbs | - [ ] |
| 2 | Finalise 3 service bundles with descriptions and pricing ranges | - [ ] |
| 3 | Lock pricing against competitors + draft Pricing page | - [ ] |
| 4 | Build 7 core website pages | - [ ] |
| 5 | Create + verify Google Business Profile | - [ ] |
| 6 | Draft FAQ blocks across 6 categories | - [ ] |
| 7 | Objection-handling drill with all 5 cleaners | - [ ] |
| 8 | Finalise homepage + Services page with CTAs | - [ ] |
| 9 | Launch 5–7 suburb landing pages | - [ ] |
| 10 | Add CTAs to every page + connect booking form | - [ ] |
| 11 | Finalise GBP: suburbs, categories, attributes, photo captions | - [ ] |
| 12 | Publish first 3 GBP posts | - [ ] |
| 13 | Configure booking form + confirmation email + email list | - [ ] |
| 14 | Test end-to-end booking flow | - [ ] |
| 18 | Co-lead cleaner training on QR + communication | - [ ] |
| 19 | Confirm all 10–15 suburbs live across website + GBP + booking form | - [ ] |
| 26 | Co-lead KPI review | - [ ] |
| 27 | Optimise top 3 suburb pages (headline, CTA, proof) | - [ ] |
| 28 | Add 3–5 new suburb pages | - [ ] |
| 29 | Co-finalise 1-page SOP + distribute to cleaners | - [ ] |
| 30 | Co-lead 30-day review + Month 2 planning | - [ ] |

---

## Month 2 Tasks — Full List

| Day | Task | Status |
|-----|------|--------|
| 31 | Launch Premium Clean tier — update all pages + GBP | - [ ] |
| 32 | Add Premium block to existing suburb pages | - [ ] |
| 33 | Real estate agency outreach: 10–15 agencies in top suburbs | - [ ] |
| 34 | Property manager outreach: 5–10 independent PMs | - [ ] |
| 36 | Set up CRM email automation (Mailchimp/HubSpot) | - [ ] |
| 37 | Send follow-up lines to non-responding partners | - [ ] |
| 40 | Generate + publish 10 new suburb pages | - [ ] |
| 41 | Add Premium block to all new suburb pages | - [ ] |
| 42 | Review partner responses; send welcome kits | - [ ] |
| 45 | A/B test new headlines on top 5 suburb pages | - [ ] |
| 48 | Audit booking flow; fix biggest drop-off point | - [ ] |
| 49 | Send second wave of partner outreach | - [ ] |
| 55 | Partner check-in calls for booking referrers | - [ ] |
| 57 | Review Premium tier; consider monthly bundle | - [ ] |
| 58 | Co-assess partner program ROI | - [ ] |
| 59 | Full KPI review | - [ ] |
| 60 | Month 2 review + Month 3 planning | - [ ] |

---

## CLI Commands (OL1 Focus)

```bash
# New suburb page
python scheduler.py suburb --suburb "South Yarra" > content/south-yarra.md

# Partner outreach
python scheduler.py partner --type real-estate --suburb "Richmond" --contact "James"
python scheduler.py partner --type property-manager --suburb "Northcote" --contact "Priya"

# Job SOP before each job
python scheduler.py sop --job "3-bed, Richmond, 2 cleaners, end-of-lease"

# Batch schedule for tomorrow's jobs
python scheduler.py batch todays-jobs.json --format markdown
```

---

## Blockers & Notes

*Track anything slowing you down:*

| Date | Blocker | Owner | Resolved |
|------|---------|-------|----------|
| | | | - [ ] |
