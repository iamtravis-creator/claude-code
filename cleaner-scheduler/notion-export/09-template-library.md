# Template Library

> All copy templates in one place. Each section links to the full template file and includes a CLI command to generate personalised versions.

---

## How to Use

For each template type, you can:
1. **Generate with CLI** — produces a personalised, AI-written version in seconds
2. **Use the static template** — paste from the `templates/` file, fill in placeholders manually

---

## 1. Post-Clean Email Sequence

**CLI**:
```bash
python scheduler.py emails --client "Sarah" --job "Deep clean, 2-bed, Fitzroy, 23 May"
```

**Full template**: `templates/email-sequence.md`

**Quick reference — placeholders**: `[CLIENT_NAME]` `[JOB_TYPE]` `[SUBURB]` `[REVIEW_LINK]` `[REFERRAL_CODE]`

**Sequence**:
- Email 1 (same day): Thank you + Google review ask + $20 off incentive
- Email 2 (Day 3): Satisfaction check + soft review reminder
- Email 3 (Day 7): Referral offer — $20 off for client + friend

---

## 2. Suburb Landing Page

**CLI**:
```bash
python scheduler.py suburb --suburb "South Yarra" > content/south-yarra.md
```

**Full template**: `templates/suburb-page-template.md`

**Page structure**: Meta tags → H1 → Value prop (80–100 words) → 3 service blocks → 3 trust signals → CTA → 3 FAQs

**SEO checklist**: suburb name in title, meta, H1, first paragraph; internal links to Pricing and FAQ pages; CTA above fold on mobile

---

## 3. Cleaner SOP

**CLI**:
```bash
python scheduler.py sop --job "End-of-lease, 3-bed, 2 cleaners, Elwood, key safe"
```

**Full template**: `templates/cleaner-sop.md`

**Sections**: Job Overview → Arrival Protocol → Supplies Check → Room-by-Room Checklist → Priority Items → QR Card Usage → Exit Protocol → Emergency Contacts

---

## 4. Partner Outreach Email

**CLI**:
```bash
python scheduler.py partner --type real-estate --suburb "Richmond" --contact "James"
python scheduler.py partner --type property-manager --suburb "Northcote"
python scheduler.py partner --type airbnb --suburb "St Kilda" --contact "Lisa"
```

**Full template**: `templates/partner-pitch.md`

**Partner types**: Real estate agents (end-of-lease focus) · Property managers (portfolio turnaround) · AirBnB hosts (changeover cleans)

**Output**: Subject line + email body (< 200 words) + 1 follow-up line

---

## 5. Loyalty Milestone Email

**CLI**:
```bash
python scheduler.py loyalty --client "James" --milestone 5
python scheduler.py loyalty --client "Emma" --milestone 10 --notes "always requests eco products"
python scheduler.py loyalty --client "Tom" --milestone 20
```

**Full template**: `templates/loyalty-program.md`

**Milestones**: 5 cleans ($10 off) · 10 cleans ($20 off + priority booking) · 20 cleans ($30 off + free add-on)

**Output**: Email subject + body + optional SMS version

---

## 6. Seasonal Campaign Copy Kit

**CLI**:
```bash
python scheduler.py campaign --type spring-clean --suburbs "Richmond,Northcote,Fitzroy"
python scheduler.py campaign --type end-of-lease --suburbs "Brunswick,Elwood"
python scheduler.py campaign --type summer
python scheduler.py campaign --type winter
python scheduler.py campaign --type custom --custom "Back-to-school clean, February, family households"
```

**Full template**: `templates/seasonal-campaign.md`

**Output per campaign**: Email · SMS · FB/IG social post · GBP post · Landing page headline + subheadline

**Campaign types**: Spring Clean (Aug–Oct) · End-of-Lease (Jan–Feb) · Summer (Dec–Jan) · Winter Deep (Jun–Jul) · Custom

---

## 7. FB/IG Ad Copy

**Full template**: `templates/ad-copy.md`

*(No CLI command — use the static template and customise per suburb)*

**Variants**: Hook-led (problem/solution) · Offer-led (discount/urgency) · Proof-led (review quote)

**Format**: Primary text (125 chars) · Headline (40 chars) · Description (30 chars) · CTA button · IG Stories version

---

## 8. FAQ Content Blocks

**Full template**: `templates/faq-content.md`

*(No CLI command — paste directly into website FAQ page)*

**Categories**: Trust & Safety · Access · Pets · Pricing · Hidden Fees · Products

**Usage**: Full FAQ page (all 6 categories) · Suburb pages (3 FAQs: access, pricing, 1 local) · Schema markup guide included

---

## 9. Work Schedule

**CLI**:
```bash
python scheduler.py schedule --job "4-bed, Camberwell, 3 cleaners, spring clean"
python scheduler.py schedule --job "Studio, St Kilda, end-of-lease" --format json
python scheduler.py batch todays-jobs.json --format markdown
```

**Output**: Job summary → Team assignment → Timed schedule → Task order → Duration → Special notes

---

## Template Status

| Template | CLI command | File | Last updated |
|----------|-------------|------|-------------|
| Post-clean emails | `emails` | `templates/email-sequence.md` | — |
| Suburb page | `suburb` | `templates/suburb-page-template.md` | — |
| Cleaner SOP | `sop` | `templates/cleaner-sop.md` | — |
| Partner outreach | `partner` | `templates/partner-pitch.md` | — |
| Loyalty email | `loyalty` | `templates/loyalty-program.md` | — |
| Seasonal campaign | `campaign` | `templates/seasonal-campaign.md` | — |
| Ad copy | — | `templates/ad-copy.md` | — |
| FAQ content | — | `templates/faq-content.md` | — |
| Work schedule | `schedule` / `batch` | — (CLI only) | — |
