# Seasonal Campaign Templates — Main10 Clean

Generate a full campaign copy kit with:
```bash
python scheduler.py campaign --type spring-clean --suburbs "Richmond,Northcote,Fitzroy"
python scheduler.py campaign --type end-of-lease --suburbs "Brunswick,Elwood,Camberwell"
python scheduler.py campaign --type summer --suburbs "St Kilda,Brighton,Balaclava"
python scheduler.py campaign --type winter
python scheduler.py campaign --type custom --custom "Back-to-school clean, February, family households"
```

This file contains static starter templates. Use the CLI for suburbs-specific, personalised versions.

---

## Campaign A: Spring Clean (August–October)

**Theme**: Fresh start, new season, shake off winter.  
**Core offer**: 20% off any Deep or Premium Clean booked in [MONTH].  
**Campaign code**: `SPRING[YEAR]`

### Email

**Subject**: Spring clean your home in [SUBURB] — 20% off this [MONTH]

Hi [CLIENT_NAME],

Spring in Melbourne means it's time to open the windows, let the air in, and get your home feeling fresh again.

For the whole month of [MONTH], Main10 Clean is offering 20% off any Deep or Premium Clean across [SUBURB] and the inner suburbs.

What's included in a spring clean:
- Full kitchen including oven, fridge, and rangehood
- All bathrooms and wet areas
- Windows and window sills (interior)
- Skirting boards and light fittings
- Vacuum and mop throughout

Use code **[DISCOUNT_CODE]** at checkout.

[BOOKING_LINK]

The team at Main10 Clean

---

### SMS
```
Spring clean special — 20% off Deep & Premium cleans in [SUBURB] this [MONTH]. Use code [DISCOUNT_CODE]: [BOOKING_LINK]
```

### Social Post (FB/IG)
```
Spring is here and so is your chance to refresh your home 🪟 20% off deep cleans in [SUBURB] this [MONTH]. Book online — link in bio. #SpringCleaning #[SUBURB]Melbourne #Main10Clean #MelbourneCleaner
```

### GBP Post (What's New / Offer)
```
Spring Clean Special — [MONTH] only

20% off Deep and Premium Cleans across [SUBURB] and surrounding suburbs. Vetted cleaners, easy online booking, full home coverage. Use code [DISCOUNT_CODE] at checkout.

[BOOKING_LINK]
```

### Landing Page

**H1**: Spring Clean Your Melbourne Home — 20% Off This [MONTH]

**Subheadline**: Vetted cleaners, full-home coverage, easy online booking. Suburbs include [SUBURB LIST].

---

## Campaign B: End-of-Lease Season (January–February)

**Theme**: Bond back, stress-free moving out.  
**Core offer**: Priority booking + free oven clean with every end-of-lease booking in January–February.  
**Campaign code**: `BOND[YEAR]`

### Email

**Subject**: Moving out in [SUBURB]? We'll get your bond back.

Hi [CLIENT_NAME],

Moving out of a Melbourne rental is stressful enough without worrying about the end-of-lease clean.

Main10 Clean specialises in bond-back cleans across [SUBURB] and the inner suburbs. We cover everything the real estate checklist requires — kitchen, bathrooms, oven, fridge, windows, and more.

Book before [DATE] and we'll include a **free oven clean** (normally $60) at no extra charge.

Use code **[DISCOUNT_CODE]** at checkout.

[BOOKING_LINK]

The Main10 Clean team

---

### SMS
```
Moving out of [SUBURB]? Bond-back clean from Main10 Clean. Free oven clean with every EOL booking in Jan-Feb. Book: [BOOKING_LINK]
```

### Social Post (FB/IG)
```
January lease ending? We'll handle the end-of-lease clean so you can focus on moving. Free oven clean included. [SUBURB] and inner Melbourne 🏠 #EndOfLease #BondBack #Melbourne #[SUBURB]
```

### GBP Post (Offer)
```
End-of-Lease Special — January & February

Bond-back cleans across [SUBURB] and surrounds. Free oven clean included with every end-of-lease booking this month. Insured, background-checked team. Book now:

[BOOKING_LINK]
```

### Landing Page

**H1**: End-of-Lease Clean in [SUBURB] — Bond Back or We'll Come Back

**Subheadline**: Full-home EOL cleans with free oven included. Easy online booking, fast turnaround. Serving [SUBURB LIST].

---

## Campaign C: Summer Refresh (December–January)

**Theme**: Home ready for the holidays and summer entertaining.  
**Core offer**: 15% off any clean booked in December for a pre-Christmas or post-New Year date.  
**Campaign code**: `SUMMER[YEAR]`

### Email

**Subject**: Get your [SUBURB] home holiday-ready — 15% off this December

Hi [CLIENT_NAME],

December in Melbourne means guests, gatherings, and a home that needs to be at its best.

Book a clean this December and get 15% off — whether it's a quick tidy before Christmas guests arrive or a full reset after the New Year.

Use code **[DISCOUNT_CODE]** at checkout.

[BOOKING_LINK]

The Main10 Clean team

---

### SMS
```
Get your home holiday-ready — 15% off any clean this Dec in [SUBURB]. Code [DISCOUNT_CODE]: [BOOKING_LINK]
```

### Social Post
```
Home ready for the holidays? ☀️ 15% off December cleans in [SUBURB]. Book online — link in bio. #SummerCleaning #Melbourne #[SUBURB] #Main10Clean
```

### GBP Post
```
Summer Special — December

15% off all cleans booked this month. Holiday-ready home, easy online booking, insured team. Suburbs: [SUBURB LIST].

[BOOKING_LINK]
```

### Landing Page

**H1**: Holiday-Ready Home in [SUBURB] — 15% Off This December

**Subheadline**: Book your pre-Christmas or post-New Year clean. Easy booking, reliable team.

---

## Campaign D: Winter Deep Clean (June–July)

**Theme**: Use the slow season to do the clean you've been putting off.  
**Core offer**: $30 off any Premium Clean booked in June or July.  
**Campaign code**: `WINTER[YEAR]`

### Email

**Subject**: Winter is the perfect time for a proper deep clean

Hi [CLIENT_NAME],

Winter in Melbourne means more time at home — and more time noticing the things you've been meaning to clean.

June and July are perfect for a Premium Clean: we go deep on everything you haven't touched since last year — oven, fridge, grout, windows, wardrobes, and more.

$30 off any Premium Clean booked this month. Use code **[DISCOUNT_CODE]**.

[BOOKING_LINK]

The Main10 Clean team

---

### SMS
```
Winter Premium Clean — $30 off this June/July in [SUBURB]. Deep clean, full home. Code [DISCOUNT_CODE]: [BOOKING_LINK]
```

### Social Post
```
Winter is perfect for a deep clean 🧹 $30 off Premium Cleans this June & July in [SUBURB]. Book online — link in bio. #WinterCleaning #Melbourne #[SUBURB]
```

### GBP Post
```
Winter Deep Clean — June & July

$30 off Premium Cleans this winter. Full home, oven, fridge, windows, wardrobes and more. Vetted and insured team.

[BOOKING_LINK]
```

### Landing Page

**H1**: Winter Deep Clean in [SUBURB] — $30 Off in June & July

**Subheadline**: The clean your home has been waiting for. Premium coverage, easy booking.

---

## Campaign Checklist (run before launching any campaign)

- [ ] Confirm offer and discount code created in booking system
- [ ] Update all suburb landing pages with campaign banner or CTA
- [ ] Schedule GBP post (Offer type, set expiry date)
- [ ] Draft email and load into automation tool
- [ ] Set campaign start and end dates; set reminder to remove banners after end date
- [ ] Track bookings with campaign code in spreadsheet
- [ ] Review CPL for campaign vs baseline at end of period
