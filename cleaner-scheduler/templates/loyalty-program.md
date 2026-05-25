# Loyalty Program — Main10 Clean

## Program Overview

The Main10 Clean loyalty program rewards recurring clients with discounts and priority perks at milestone clean numbers. It's designed to feel like a personal thank-you from a local business — not a points system.

Generate personalised milestone emails with:
```bash
python scheduler.py loyalty --client "Sarah" --milestone 5
python scheduler.py loyalty --client "James" --milestone 10
python scheduler.py loyalty --client "Emma" --milestone 20
```

---

## Tier Structure

| Milestone | Reward | Status label |
|-----------|--------|--------------|
| 5 cleans | $10 off next clean | Regular |
| 10 cleans | $20 off next clean + priority booking | Main10 Regular |
| 20 cleans | $30 off next clean + free add-on (oven or fridge) | Main10 VIP |
| Referral (any time) | $20 off for client + $20 off for friend's first clean | — |

**Add-on options for 20-clean milestone**: inside oven clean, inside fridge clean, or interior windows.

---

## Tracking

Track cleans per client in your spreadsheet or CRM:

| Client name | Email | Suburb | Service type | Cleans total | Last clean date | Current tier | Reward sent |
|---|---|---|---|---|---|---|---|
| Sarah M. | sarah@... | Richmond | Regular | 10 | 15 Jun | Main10 Regular | Yes |

Set a CRM automation trigger at 5, 10, and 20 cleans (or use a manual calendar reminder if you're not on a CRM yet).

---

## Email Templates

### Milestone: 5 Cleans

**Subject**: You've had 5 cleans with Main10 Clean 🎉

Hi [CLIENT_NAME],

You've just hit your 5th clean with us — and we wanted to say thank you.

Clients like you are exactly what Main10 Clean is built around. Your $10 reward is applied automatically to your next booking.

Just book as usual at [BOOKING_LINK] and it'll come off at checkout.

Thanks again for having us in your home.

The Main10 Clean team

---

### Milestone: 10 Cleans — "Main10 Regular"

**Subject**: 10 cleans — you're officially a Main10 Regular

Hi [CLIENT_NAME],

Ten cleans. That means you've trusted us with your home ten times — and we don't take that lightly.

As a Main10 Regular, you now get:
- **$20 off your next clean** (applied automatically)
- **Priority booking** — your preferred time slot is held for you first

Book your next clean at [BOOKING_LINK] and your discount will be waiting.

Thank you for being part of Main10 Clean.

The Main10 Clean team

---

### Milestone: 20 Cleans — "Main10 VIP"

**Subject**: 20 cleans with Main10 Clean — you're a VIP

Hi [CLIENT_NAME],

Twenty cleans. We're genuinely grateful.

You're now a Main10 VIP — which means your next clean comes with:
- **$30 off**, automatically applied
- **Priority booking** (your slot is always held first)
- **A free add-on** on your next clean — choose from: inside oven, inside fridge, or interior windows

Just book at [BOOKING_LINK] and reply to this email to nominate your free add-on.

You've been a brilliant client and we're so glad to be your cleaners.

The Main10 Clean team

---

### Referral Announcement (send to all clients when launching the program)

**Subject**: Refer a friend — you both get $20 off

Hi [CLIENT_NAME],

We're launching a referral program, and we wanted you to know about it first.

If you refer a friend, neighbour, or colleague to Main10 Clean:
- They get **$20 off their first clean**
- You get **$20 off your next clean**

All they need to do is use your code when booking: **[REFERRAL_CODE]**

Book or refer at [BOOKING_LINK].

Thanks for being a Main10 Clean regular.

The Main10 Clean team

---

## SMS Versions (for clients who prefer SMS)

**5-clean milestone**:
```
Hi [CLIENT_NAME], you've hit 5 cleans with Main10 Clean! $10 off your next booking — use [BOOKING_LINK]. Thanks for being a regular :)
```

**10-clean milestone**:
```
Hi [CLIENT_NAME], 10 cleans — you're a Main10 Regular! $20 off your next clean + priority booking. Book at [BOOKING_LINK].
```

**20-clean milestone**:
```
Hi [CLIENT_NAME], 20 cleans — you're a Main10 VIP. $30 off + a free add-on on your next clean. Book at [BOOKING_LINK] and reply with your add-on choice.
```

---

## Launch Sequence

When launching the program for the first time:

1. Send the referral announcement to all existing clients (same day)
2. Identify all clients at 5, 10, 20 clean milestones from your job log
3. Generate and send personalised milestone emails using the CLI
4. Set CRM automation triggers for future milestones
5. Add "Loyalty Program" to the website FAQ and footer

---

## Program Rules (keep it simple)

- Discounts apply to the client's next clean after the milestone date
- Discounts cannot be combined with other promo codes
- Referral discount applies to the referring client's next clean after the friend's first clean is completed
- No cash value — discounts apply to bookings only
- Main10 Clean reserves the right to modify tier thresholds with 30 days' notice to existing clients
