# Client Database

> One row per client. Update after every clean. Use this to track loyalty milestones, recurring status, and referrals.

---

## How to Generate Post-Clean Emails

```bash
# After each job — personalised review + referral sequence
python scheduler.py emails --client "Sarah" --job "Regular clean, 2-bed, Richmond, 28 May"

# Loyalty milestone email when client hits 5, 10, or 20 cleans
python scheduler.py loyalty --client "Sarah" --milestone 5
```

---

## Client List

| # | First name | Last name | Email | Phone | Suburb | Service type | Total cleans | Last clean | Loyalty tier | Referral code | Referred by | Reviews left | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | Regular | 0 | — | — | REFER-[NAME] | — | - [ ] | |
| 2 | | | | | | | 0 | — | — | REFER-[NAME] | — | - [ ] | |
| 3 | | | | | | | 0 | — | — | REFER-[NAME] | — | - [ ] | |

*Add a row for each new client. Referral code format: REFER-[FIRSTNAME] (e.g. REFER-SARAH)*

---

## Loyalty Milestones — Dashboard

| Tier | Cleans required | Reward | Clients currently at this tier |
|------|----------------|--------|-------------------------------|
| Regular (entry) | 1–4 | — | |
| 5-clean milestone | 5 | $10 off next clean | |
| Main10 Regular | 10 | $20 off + priority booking | |
| Main10 VIP | 20 | $30 off + free add-on | |

---

## Upcoming Milestones

*Check this weekly and send loyalty emails for anyone who has just reached a milestone.*

| Client | Current cleans | Next milestone | Milestone date (est.) | Email sent |
|--------|---------------|---------------|----------------------|------------|
| | | 5 | | - [ ] |
| | | 10 | | - [ ] |
| | | 20 | | - [ ] |

---

## Referral Tracking

| Referrer (client) | Referral code | Friend referred | Friend's first clean date | Discount applied to referrer | Discount applied to friend |
|---|---|---|---|---|---|
| | REFER-[NAME] | | | - [ ] | - [ ] |

---

## Client Satisfaction Log

*Note any feedback, complaints, or special requests here for continuity.*

| Date | Client | Job | Feedback | Action taken | Resolved |
|------|--------|-----|----------|-------------|---------|
| | | | | | - [ ] |

---

## Recurring Schedule Overview

| Client | Suburb | Frequency | Day/time preference | Assigned cleaner | Next clean |
|--------|--------|-----------|--------------------|--------------------|------------|
| | Richmond | Weekly | Thursdays, 9am | Cleaner 1 | |
| | Northcote | Fortnightly | Tuesdays | Cleaner 2 | |

*Keep this updated as recurring schedules are confirmed. Share with cleaners weekly.*
