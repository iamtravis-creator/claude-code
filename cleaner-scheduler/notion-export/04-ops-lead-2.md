# Ops Lead 2 — Task Board

> **Focus**: CX · Reviews · Ads · Loyalty · Seasonal Campaigns · Metrics

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
| 15 | Design QR feedback card (front + back) | - [ ] |
| 16 | Set up QR workflow: main10.au/review → Google review page | - [ ] |
| 17 | Draft + load 3-email post-clean sequence | - [ ] |
| 18 | Co-lead cleaner training on QR + communication | - [ ] |
| 20 | Run soft launch in 3–5 suburbs with cleaners | - [ ] |
| 21 | Collect + act on feedback from soft-launch jobs | - [ ] |
| 22 | Activate "10% off first clean" + recurring discount | - [ ] |
| 23 | Launch hyper-local FB/IG ads in 2 suburbs ($20–30/day) | - [ ] |
| 24 | Review + respond to all GBP reviews | - [ ] |
| 25 | Start 1 GBP post per suburb per week cadence | - [ ] |
| 26 | Co-lead KPI review | - [ ] |
| 29 | Co-finalise 1-page SOP | - [ ] |
| 30 | Co-lead 30-day review + Month 2 planning | - [ ] |

---

## Month 2 Tasks — Full List

| Day | Task | Status |
|-----|------|--------|
| 35 | AirBnB host outreach via host groups + pitch emails | - [ ] |
| 37 | Co-send partner follow-ups | - [ ] |
| 38 | Design loyalty tier structure (5/10/20 cleans) | - [ ] |
| 39 | Announce loyalty program + send milestone emails | - [ ] |
| 42 | Co-review partner responses | - [ ] |
| 43 | Launch Spring Clean campaign (if Aug–Oct) | - [ ] |
| 44 | Install Meta Pixel + launch retargeting campaign | - [ ] |
| 46 | Publish GBP posts for all 10 new suburbs | - [ ] |
| 47 | Send mid-month loyalty check-in to all clients | - [ ] |
| 50 | Scale winning ad suburbs; pause losing suburbs | - [ ] |
| 51 | Review + respond to all new GBP reviews | - [ ] |
| 53 | Loyalty emails for milestone clients | - [ ] |
| 54 | Batch weekly GBP posts for all active suburbs | - [ ] |
| 56 | Launch End-of-Lease campaign (if Jan–Feb) | - [ ] |
| 58 | Co-assess partner program ROI | - [ ] |
| 59 | Full KPI review | - [ ] |
| 60 | Month 2 review + Month 3 planning | - [ ] |

---

## Ad Campaign Tracker

| Suburb | Variant | Start | Daily budget | CPL (latest) | Status |
|--------|---------|-------|-------------|-------------|--------|
| | Hook | | $20 | — | - [ ] Active |
| | Offer | | $20 | — | - [ ] Active |
| | Proof | | $20 | — | - [ ] Active |

**Decision rules**: Kill if CPL > $25 for 3+ days. Scale if CPL < $10 and CTR > 2%.

---

## Review Response Log

| Date | Review (stars) | Client name | Suburb | Response sent | Notes |
|------|---------------|-------------|--------|--------------|-------|
| | ⭐⭐⭐⭐⭐ | | | - [ ] | |
| | ⭐⭐⭐⭐ | | | - [ ] | |

---

## CLI Commands (OL2 Focus)

```bash
# Post-clean email sequence
python scheduler.py emails --client "Sarah" --job "Deep clean, 2-bed, Fitzroy, 23 May"

# Loyalty milestone email
python scheduler.py loyalty --client "James" --milestone 10
python scheduler.py loyalty --client "Emma" --milestone 5

# Seasonal campaign kit
python scheduler.py campaign --type spring-clean --suburbs "Richmond,Northcote,Fitzroy"
python scheduler.py campaign --type end-of-lease --suburbs "Brunswick,Elwood,Camberwell"

# AirBnB partner pitch
python scheduler.py partner --type airbnb --suburb "St Kilda" --contact "Lisa"
```

---

## Blockers & Notes

| Date | Blocker | Owner | Resolved |
|------|---------|-------|----------|
| | | | - [ ] |
