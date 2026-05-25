# Post-Clean Email Sequence — Templates

Three emails sent after every completed job. Generate personalised versions with:
```bash
python scheduler.py emails --client "[First Name]" --job "[job type, suburb, date]"
```

Replace all `[PLACEHOLDERS]` before sending.

---

## Email 1 — Same-Day Thank You
*Send within 2 hours of job completion.*

**Subject**: Your Main10 Clean is done — how did we go?

Hi [CLIENT_NAME],

Thanks for choosing Main10 Clean today. We hope your [JOB_TYPE] in [SUBURB] was everything you expected.

If you have a moment, we'd love a Google review — it helps other Melbourne locals find us, and as a thank-you we'll take **$20 off your next clean**.

[REVIEW_LINK]

It only takes 2 minutes and means the world to a small local team.

Thanks again,  
The Main10 Clean team

---

*Keep under 150 words. Personalise [JOB_TYPE] (e.g. "end-of-lease clean", "deep clean", "regular tidy-up") and [SUBURB]. Send from a real email address, not a no-reply.*

---

## Email 2 — Day 3 Satisfaction Check
*Send on Day 3 after the job.*

**Subject**: Everything looking good after your clean?

Hi [CLIENT_NAME],

Just checking in — we hope everything's still looking great after your Main10 Clean.

If anything wasn't quite right, please let us know and we'll make it right, no questions asked.

And if you were happy, a quick Google review would make our day:  
[REVIEW_LINK]

Thanks for having us in your home.

The Main10 Clean team

---

*Keep under 120 words. The real purpose is to catch any dissatisfied clients before they write a negative review. A personal tone works better than a corporate follow-up here.*

---

## Email 3 — Day 7 Referral Offer
*Send on Day 7 after the job.*

**Subject**: Know someone who'd love a clean? You'll both get $20 off

Hi [CLIENT_NAME],

Thanks again for booking with Main10 Clean.

We have a referral offer running: if you know someone who could use a hand with their home, send them your code and you'll **both get $20 off** your next clean.

Your code: **[REFERRAL_CODE]**

They just need to mention it when booking at [WEBSITE_LINK].

No pressure — just thought you might know a neighbour or colleague who'd appreciate it.

Thanks again,  
The Main10 Clean team

---

*Keep under 130 words. Don't push too hard — this email relies on the goodwill built by emails 1 and 2. Track referral codes in your spreadsheet (format: REFER-[CLIENTNAME]).*

---

## Sending Notes

**Recommended tools** (all have free tiers):
- Mailchimp — automation sequences, mail merge
- Gmail Templates — manual personalisation for first 20 clients
- Klaviyo — if you want advanced segmentation later
- Notion email blocks — for drafting and reviewing copy

**Personalisation minimum**: Always fill in [CLIENT_NAME], [JOB_TYPE], [SUBURB], and [REVIEW_LINK] before sending. [REFERRAL_CODE] is only needed for Email 3.

**Timing**: Set a calendar reminder after each job is marked complete — Email 1 same day, Email 2 in 3 days, Email 3 in 7 days. Once you have 20+ clients, set up an automation sequence.
