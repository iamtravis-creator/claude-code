# Main10 Clean — Ops Dashboard

> **How to use this dashboard**: Each section below links to a sub-page. Paste each file from `notion-export/` into a new Notion page, then link them together using `/page` mentions or the sidebar.

---

## Live Status

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Active recurring clients | 50 (Month 2) | — | — |
| Google reviews | 25+ | — | — |
| Suburbs with live pages | 25+ | — | — |
| Partner referral bookings | 5+ | — | — |
| Cost per booked lead | < $12 | — | — |
| Email list size | 100+ | — | — |

*Update this table weekly. Use Notion formula cells to auto-calculate % to target if you connect a database.*

---

## Team Directory

| Name | Role | Focus | Contact |
|------|------|-------|---------|
| [NAME] | Ops Lead 1 | Brand, website, SEO, systems, partner outreach | [PHONE / EMAIL] |
| [NAME] | Ops Lead 2 | CX, reviews, ads, loyalty, campaigns | [PHONE / EMAIL] |
| Cleaner 1 | Field Cleaner | [SUBURB area] | [PHONE] |
| Cleaner 2 | Field Cleaner | [SUBURB area] | [PHONE] |
| Cleaner 3 | Field Cleaner | [SUBURB area] | [PHONE] |
| Cleaner 4 | Field Cleaner | [SUBURB area] | [PHONE] |
| Cleaner 5 | Field Cleaner | [SUBURB area] | [PHONE] |

---

## Navigation

| Page | Owner | Description |
|------|-------|-------------|
| [Month 1 Plan — Days 1–30](01-month1-plan.md) | Both | Full 30-day GTM launch plan |
| [Month 2 Plan — Days 31–60](02-month2-plan.md) | Both | Expansion: Premium tier, partners, loyalty, campaigns |
| [Ops Lead 1 Tasks](03-ops-lead-1.md) | Ops Lead 1 | Filtered task board for OL1 |
| [Ops Lead 2 Tasks](04-ops-lead-2.md) | Ops Lead 2 | Filtered task board for OL2 |
| [KPI Tracker](05-kpi-tracker.md) | Both | Week-by-week metrics |
| [Suburb Tracker](06-suburb-tracker.md) | Ops Lead 1 | Status of all suburb pages |
| [Partner Tracker](07-partner-tracker.md) | Ops Lead 1 | All partner outreach and referral bookings |
| [Client Database](08-client-database.md) | Ops Lead 2 | All clients, loyalty tier, clean count |
| [Template Library](09-template-library.md) | Both | All copy templates in one place |
| [Cleaner Hub](10-cleaner-hub.md) | Ops Lead 1 | SOP, checklist, and job log for cleaners |

---

## Active Campaigns

| Campaign | Type | Start | End | Code | Status |
|----------|------|-------|-----|------|--------|
| First clean 10% off | Ongoing | — | — | FIRST10 | Active |
| Referral program | Ongoing | — | — | REFER-[NAME] | Active |
| [Campaign name] | [Type] | — | — | — | — |

---

## Key Links & Bookmarks

| Resource | URL |
|----------|-----|
| Booking form | [BOOKING_LINK] |
| Google Business Profile | [GBP_LINK] |
| Google Analytics | [GA_LINK] |
| Meta Ads Manager | [ADS_LINK] |
| Email platform (Mailchimp / HubSpot) | [EMAIL_PLATFORM_LINK] |
| Review link (short URL) | main10.au/review |
| Referral landing page | [REFERRAL_LINK] |

---

## CLI Quick Reference

```bash
# Before every job
python scheduler.py sop --job "3-bed, Richmond, 2 cleaners"

# After every job
python scheduler.py emails --client "Sarah" --job "Deep clean, Fitzroy, 23 May"

# New suburb page
python scheduler.py suburb --suburb "South Yarra"

# Partner outreach
python scheduler.py partner --type real-estate --suburb "Richmond" --contact "James"

# Loyalty milestone
python scheduler.py loyalty --client "Emma" --milestone 10

# Seasonal campaign
python scheduler.py campaign --type spring-clean --suburbs "Richmond,Northcote"

# Full day's batch schedule
python scheduler.py batch todays-jobs.json --format json
```

---

## Weekly Ops Checklist

Run this every Monday:

- [ ] Check GBP for new reviews — respond within 24 hrs
- [ ] Review ad performance — kill CPL > $20, scale CPL < $10
- [ ] Check email open rates — flag anything below 30%
- [ ] Update KPI tracker (page: KPI Tracker)
- [ ] Update suburb tracker for any new pages added
- [ ] Review partner tracker — follow up any non-responders
- [ ] Check for loyalty milestones this week — send milestone emails
- [ ] Publish 1 GBP post per active suburb (batch in 30 mins)
- [ ] Log any new bookings and review count in Client Database
