#!/usr/bin/env python3
"""Main10 Clean — AI-powered cleaning operations toolkit."""

import argparse
import json
import sys
import anthropic

MODEL = "claude-opus-4-7"

SYSTEM_PROMPT_SCHEDULE = """You are a professional cleaning operations manager with 15+ years of experience scheduling cleaning crews.

When given a job description, create a detailed, practical work schedule for the cleaning team. Your schedule must include:

1. **Job Summary** — brief overview (location type, scope, key requirements)
2. **Team Assignment** — assign each cleaner by number to specific areas or tasks
3. **Timed Schedule** — time slots for every task (e.g., 9:00–9:30 AM · Cleaner 1 — Kitchen deep clean)
4. **Task Order** — ordered by priority and logical flow (client priorities first, then top-to-bottom, wet areas before dry)
5. **Estimated Total Duration** — how long the full job takes
6. **Special Notes** — priority items, client preferences, supplies needed, or safety considerations

Format the schedule clearly with headers and time blocks. Be specific and actionable — a cleaner should be able to follow this schedule without any additional instructions."""

SYSTEM_PROMPT_SUBURB = """You are an SEO copywriter specialising in local home services for Melbourne, Australia.

When given a suburb name, generate complete SEO-optimised landing page copy for a residential cleaning business called Main10 Clean.

Your output must include these clearly labelled sections:

**META**
- Page title (60 chars max): optimised for "[suburb] house cleaning" searches
- Meta description (155 chars max): compelling, includes suburb name and a CTA

**H1 HEADLINE**
A single punchy headline that includes the suburb name.

**VALUE PROPOSITION**
An 80–100 word paragraph that speaks directly to homeowners in that suburb. Reference the suburb naturally, mention local context where relevant (lifestyle, housing type, busy schedules), and communicate Main10 Clean's key differentiators: transparent pricing, vetted cleaners, easy booking.

**OUR SERVICES IN [SUBURB]**
Three service blocks, each with a bolded service name and a 40–60 word description:
1. Regular Clean — what it covers, who it suits, frequency options
2. End-of-Lease Clean — what's included, bond-back focus, timeline
3. Spring / Deep Clean — scope, frequency, ideal triggers (moving in, seasonal refresh)

**WHY MAIN10 CLEAN IN [SUBURB]?**
Three trust signal bullet points. Each should feel locally grounded — reference the suburb or nearby area naturally.

**CALL TO ACTION**
- CTA headline (one sentence)
- Primary button copy (4–6 words)
- Secondary link text (e.g. "See pricing")

**FAQs FOR [SUBURB]**
Three suburb-specific FAQ items (question + 2–3 sentence answer each). Focus on the most common local objections: access/parking, pet-friendliness, or timing.

Keep the tone warm, professional, and Melbourne-local. Avoid superlatives ("best", "cheapest") and generic filler."""

SYSTEM_PROMPT_EMAILS = """You are a customer success copywriter for Main10 Clean, a Melbourne residential cleaning business.

When given a client's first name and job details, generate a 3-email post-clean sequence designed to collect Google reviews and drive referrals.

Produce exactly three emails, each with a clear heading:

## Email 1 — Same-Day Thank You (send within 2 hours of job completion)
Subject line + body (under 150 words). Thank the client by name, reference the job type naturally, ask them to leave a Google review using the placeholder [REVIEW_LINK], and mention the $20 off incentive for reviewing.

## Email 2 — Day 3 Satisfaction Check
Subject line + body (under 120 words). Light check-in — ask if everything met their expectations, offer to fix anything if not, gently remind them of the review link [REVIEW_LINK].

## Email 3 — Day 7 Referral Offer
Subject line + body (under 130 words). Thank them again, introduce the referral program: both the client and their friend get $20 off when the friend books using [REFERRAL_CODE]. Keep it casual and friendly, not salesy.

Rules:
- Use the client's first name throughout all three emails
- Reference the specific job type and suburb where natural
- Tone: warm, conversational, Melbourne-local — like a message from a trusted local business, not a corporate template
- Use placeholders exactly as shown: [REVIEW_LINK], [REFERRAL_CODE]
- Sign off as "The Main10 Clean team" """

SYSTEM_PROMPT_PARTNER = """You are a B2B sales copywriter for Main10 Clean, a Melbourne residential cleaning business that wants to build referral partnerships with real estate agents, property managers, and AirBnB / short-stay hosts.

When given a partner type and suburb, write a concise, warm outreach email that feels personal — not a mass-blast template.

Your output must include these clearly labelled sections:

## Subject Line
One subject line, under 60 characters. Avoid spam words ("free", "guaranteed", "limited time"). Make it specific to their role and the suburb.

## Email Body
Under 200 words. Structure:
1. Opening: brief personal hook referencing their role and suburb (1 sentence)
2. What Main10 Clean offers them: a reliable cleaning partner they can recommend to clients — vetted cleaners, bond-back end-of-lease specialisation, consistent quality, easy online booking
3. The referral arrangement: Main10 Clean will give their clients priority booking + $20 off first clean, and the partner gets a named referral code to track bookings (no financial incentive to them — this is a value-add for their clients)
4. Soft CTA: suggest a 15-minute call or a trial clean at one of their properties

## Follow-Up Line
One short follow-up sentence to send 5 days later if no response. Under 20 words.

Rules:
- Address the contact by name if provided
- Reference the partner type and suburb throughout
- Real estate agent angle: end-of-lease cleans for departing tenants, first-impression cleans for new listings
- Property manager angle: reliable turnaround cleans between tenancies, consistent quality across a portfolio
- AirBnB / short-stay angle: fast, reliable changeover cleans, flexible scheduling around guest check-in/check-out
- Tone: professional, friendly, low-pressure. This is a local business reaching out to another local business."""

SYSTEM_PROMPT_LOYALTY = """You are a CRM copywriter for Main10 Clean, a Melbourne residential cleaning business.

When given a client's name and a loyalty milestone (number of cleans completed), write a warm milestone email that makes the client feel valued and nudges them toward their next booking.

Your output must include these clearly labelled sections:

## Subject Line
One subject line under 55 characters. Reference the milestone number. Keep it warm, not corporate.

## Email Body
Under 160 words. Structure:
1. Opening: celebrate the milestone specifically — "You've had your 10th clean with us!" (1–2 sentences)
2. Thank them genuinely — reference that loyal clients are the foundation of Main10 Clean (1 sentence)
3. Reward: offer a loyalty reward — for every 10th clean, the next clean is discounted. Use placeholder [LOYALTY_DISCOUNT] for the discount amount or describe as "10% off your next clean" if milestone is 5, 10, 20 etc.
4. Soft nudge: one-line CTA to book their next clean, with placeholder [BOOKING_LINK]

## SMS Version (optional)
A 2-line SMS version under 160 characters for clients who prefer SMS contact. Include [BOOKING_LINK].

Rules:
- Use the client's first name
- Adjust tone by milestone — 5th clean is warm, 10th is celebratory, 20th is effusively grateful
- Never make it feel like a points program — frame it as a personal thank-you
- Sign off as "The Main10 Clean team" """

SYSTEM_PROMPT_CAMPAIGN = """You are a marketing copywriter for Main10 Clean, a Melbourne residential cleaning business.

When given a campaign type and target suburbs, generate a complete campaign copy kit ready to use across channels.

Your output must include these clearly labelled sections:

## Campaign Overview
Campaign name, theme (1 sentence), and the core offer (e.g. "20% off spring cleans booked in August").

## Email
Subject line + body (under 200 words). Hook on the seasonal moment, explain the offer, list 2–3 key benefits, include a strong CTA with placeholder [BOOKING_LINK]. Address the reader as "you", not "customers".

## SMS
One SMS under 160 characters. Include the offer and [BOOKING_LINK].

## Social Post (Facebook / Instagram)
Caption under 150 characters + 3–5 relevant hashtags. Keep it punchy. Reference the suburb(s) if 1–3 are provided.

## Google Business Profile Post
Under 100 words. Include the offer, a trust signal, and a CTA. This is for the "What's New" or "Offer" post type.

## Landing Page Headline
One H1 headline (under 60 characters) and one subheadline (under 100 characters) for the campaign landing page.

Rules:
- Anchor everything to the seasonal moment (spring = fresh start, end-of-lease = bond back, summer = holiday prep)
- Include all provided suburbs by name where it fits naturally; if more than 3, say "inner Melbourne suburbs"
- Use placeholder [DISCOUNT_CODE] for promo codes
- Avoid superlatives and spam-trigger words
- Tone: warm, locally grounded, direct"""

SYSTEM_PROMPT_SOP = """You are a cleaning operations manager writing single-page field SOPs for residential cleaners at Main10 Clean, Melbourne.

When given a job description, generate a job-specific Standard Operating Procedure that fits on a single printed page (400–600 words).

Structure the SOP with these exact sections using markdown headers:

## Job Overview
A compact summary: date placeholder, address placeholder, access method, number of cleaners, estimated hours, client contact placeholder.

## Arrival Protocol
Numbered steps: parking instruction (derive from job type if possible), key/lockbox access, how to introduce yourself if client is home.

## Supplies Check
Two-column table: "We Bring" vs "Client Provides". Derive from the job description — a deep clean needs more supplies than a regular refresh.

## Room-by-Room Checklist
Ordered by logical flow (kitchen → bathrooms → bedrooms → living areas → laundry → outdoor if applicable). Use checkboxes: `- [ ] Task`. Be specific and actionable.

## Priority Items
A short bulleted list of any special requirements, fragile items, pet considerations, or client preferences mentioned in the job description.

## QR Card Usage
Three steps: scan arrival QR on job card when you enter, scan task-completion QR after final walkthrough, scan departure QR when leaving.

## Exit Protocol
Numbered checklist: final walkthrough items (windows closed, taps off, appliances off, doors locked), bin placement instruction, leave client note on bench, confirm departure QR scanned.

## Emergency Contacts
Placeholders: Main10 Clean operations [OPS_PHONE], Client [CLIENT_PHONE].

Keep language direct and imperative. A cleaner with no prior context should be able to follow this SOP from start to finish without asking any questions."""


def print_cache_stats(usage):
    cache_parts = []
    if getattr(usage, "cache_creation_input_tokens", 0):
        cache_parts.append(f"cache created: {usage.cache_creation_input_tokens} tokens")
    if getattr(usage, "cache_read_input_tokens", 0):
        cache_parts.append(f"cache hit: {usage.cache_read_input_tokens} tokens")
    if cache_parts:
        print(f"[{', '.join(cache_parts)}]\n", file=sys.stderr)


def call_claude(system_prompt, user_message, max_tokens=2048):
    client = anthropic.Anthropic()
    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=max_tokens,
            system=[
                {
                    "type": "text",
                    "text": system_prompt,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=[{"role": "user", "content": user_message}],
        )
    except anthropic.APIError as e:
        print(f"API error: {e}", file=sys.stderr)
        sys.exit(1)
    print_cache_stats(response.usage)
    return response.content[0].text


def read_input(job_arg, file_arg, prompt_msg="Enter input (Ctrl+D when done):"):
    if file_arg:
        with open(file_arg) as f:
            text = f.read().strip()
    elif job_arg:
        text = job_arg.strip()
    else:
        print(prompt_msg, file=sys.stderr)
        text = sys.stdin.read().strip()
    if not text:
        print("Error: no input provided.", file=sys.stderr)
        sys.exit(1)
    return text


def _apply_format(text, fmt):
    if fmt == "json":
        return json.dumps({"schedule": text})
    if fmt == "markdown":
        return f"## Schedule\n\n```\n{text}\n```"
    return text


def cmd_schedule(args):
    description = read_input(args.job, args.file, "Enter job description (Ctrl+D when done):")
    print("Generating schedule...\n", file=sys.stderr)
    result = call_claude(SYSTEM_PROMPT_SCHEDULE, f"Job Description:\n\n{description}")
    print(_apply_format(result, args.format))


def cmd_suburb(args):
    user_message = (
        f"Generate SEO landing page copy for: {args.suburb}, {args.city} "
        "— residential cleaning services for Main10 Clean."
    )
    print(f"Generating suburb page copy for {args.suburb}...\n", file=sys.stderr)
    result = call_claude(SYSTEM_PROMPT_SUBURB, user_message, max_tokens=1500)
    print(result)


def cmd_emails(args):
    job_details = read_input(args.job, args.file, "Enter job details (Ctrl+D when done):")
    user_message = (
        f"Client name: {args.client}\n"
        f"Job: {job_details}\n\n"
        "Generate the 3-email post-clean sequence."
    )
    print(f"Generating email sequence for {args.client}...\n", file=sys.stderr)
    result = call_claude(SYSTEM_PROMPT_EMAILS, user_message, max_tokens=2000)
    print(result)


def cmd_sop(args):
    description = read_input(args.job, args.file, "Enter job description (Ctrl+D when done):")
    print("Generating SOP...\n", file=sys.stderr)
    result = call_claude(SYSTEM_PROMPT_SOP, f"Job Description:\n\n{description}", max_tokens=1200)
    print(result)


def cmd_partner(args):
    partner_labels = {
        "real-estate": "real estate agent",
        "property-manager": "property manager",
        "airbnb": "AirBnB / short-stay host",
    }
    partner_label = partner_labels[args.type]
    suburb_line = f" in {args.suburb}" if args.suburb else " in Melbourne"
    contact_line = f"Contact name: {args.contact}\n" if args.contact else ""
    user_message = (
        f"Partner type: {partner_label}{suburb_line}\n"
        f"{contact_line}"
        "Generate the outreach email and follow-up line."
    )
    print(f"Generating partner pitch for {partner_label}{suburb_line}...\n", file=sys.stderr)
    result = call_claude(SYSTEM_PROMPT_PARTNER, user_message, max_tokens=800)
    print(result)


def cmd_loyalty(args):
    notes_line = f"Additional context: {args.notes}\n" if args.notes else ""
    user_message = (
        f"Client name: {args.client}\n"
        f"Cleans completed: {args.milestone}\n"
        f"{notes_line}"
        "Generate the loyalty milestone email."
    )
    print(f"Generating loyalty email for {args.client} (milestone: {args.milestone} cleans)...\n", file=sys.stderr)
    result = call_claude(SYSTEM_PROMPT_LOYALTY, user_message, max_tokens=600)
    print(result)


def cmd_campaign(args):
    campaign_labels = {
        "spring-clean": "Spring Clean (August–October, Melbourne)",
        "end-of-lease": "End-of-Lease Season (January–February peak, lease turnover)",
        "summer": "Summer Refresh (December–January)",
        "winter": "Winter Deep Clean (June–July)",
        "custom": args.custom or "Custom campaign",
    }
    campaign_label = campaign_labels[args.type]
    suburbs_line = f"Target suburbs: {args.suburbs}\n" if args.suburbs else ""
    user_message = (
        f"Campaign type: {campaign_label}\n"
        f"{suburbs_line}"
        "Generate the full campaign copy kit."
    )
    print(f"Generating campaign copy for: {campaign_label}...\n", file=sys.stderr)
    result = call_claude(SYSTEM_PROMPT_CAMPAIGN, user_message, max_tokens=1800)
    print(result)


def cmd_batch(args):
    try:
        with open(args.input_file) as f:
            jobs = json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        print(f"Error reading input file: {e}", file=sys.stderr)
        sys.exit(1)
    if not isinstance(jobs, list):
        print("Error: input file must contain a JSON array.", file=sys.stderr)
        sys.exit(1)

    results = []
    for i, job in enumerate(jobs):
        if not isinstance(job, dict) or "description" not in job:
            print(f"Warning: skipping item {i} — missing 'description' key.", file=sys.stderr)
            continue
        job_id = job.get("id", str(i))
        print(f"Processing job {job_id}...", file=sys.stderr)
        schedule_text = call_claude(
            SYSTEM_PROMPT_SCHEDULE,
            f"Job Description:\n\n{job['description']}",
        )
        results.append({"id": job_id, "schedule": schedule_text})

    print(f"\nProcessed {len(results)}/{len(jobs)} jobs.", file=sys.stderr)

    if args.format == "json":
        output = json.dumps(results, indent=2)
    elif args.format == "markdown":
        parts = [f"## Job {r['id']}\n\n```\n{r['schedule']}\n```" for r in results]
        output = "\n\n---\n\n".join(parts)
    else:
        sep = "\n\n" + "=" * 40 + "\n\n"
        parts = [f"=== Job {r['id']} ===\n\n{r['schedule']}" for r in results]
        output = sep.join(parts)

    if args.output:
        with open(args.output, "w") as f:
            f.write(output)
        print(f"Output written to {args.output}", file=sys.stderr)
    else:
        print(output)


def build_parser():
    parser = argparse.ArgumentParser(
        prog="scheduler",
        description="Main10 Clean — AI-powered cleaning operations toolkit",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    p_schedule = subparsers.add_parser(
        "schedule",
        help="Generate a timed crew work schedule from a job description",
        description="Generate a detailed, timed cleaning crew work schedule.",
    )
    p_schedule.add_argument("--job", "-j", help="Job description as a quoted string")
    p_schedule.add_argument("--file", "-f", help="Path to a file containing the job description")
    p_schedule.add_argument(
        "--format",
        choices=["text", "json", "markdown"],
        default="text",
        help="Output format (default: text)",
    )

    p_suburb = subparsers.add_parser(
        "suburb",
        help="Generate SEO landing page copy for a Melbourne suburb",
        description="Generate SEO-optimised suburb landing page copy for Main10 Clean.",
    )
    p_suburb.add_argument("--suburb", "-s", required=True, help="Suburb name, e.g. Richmond")
    p_suburb.add_argument("--city", default="Melbourne", help="City name (default: Melbourne)")

    p_emails = subparsers.add_parser(
        "emails",
        help="Generate a 3-email post-clean review and referral sequence",
        description="Generate a 3-email post-clean sequence: thank you, satisfaction check, referral.",
    )
    p_emails.add_argument("--client", "-c", required=True, help="Client first name, e.g. Sarah")
    p_emails.add_argument("--job", "-j", help="Job details as a quoted string")
    p_emails.add_argument("--file", "-f", help="Path to a file containing job details")

    p_sop = subparsers.add_parser(
        "sop",
        help="Generate a job-specific single-page SOP for the attending cleaner",
        description="Generate a printable single-page Standard Operating Procedure for a cleaning job.",
    )
    p_sop.add_argument("--job", "-j", help="Job description as a quoted string")
    p_sop.add_argument("--file", "-f", help="Path to a file containing the job description")

    p_partner = subparsers.add_parser(
        "partner",
        help="Generate a B2B outreach email for a referral partner",
        description="Generate a partner outreach email for real estate agents, property managers, or AirBnB hosts.",
    )
    p_partner.add_argument(
        "--type", "-t",
        required=True,
        choices=["real-estate", "property-manager", "airbnb"],
        help="Partner type",
    )
    p_partner.add_argument("--suburb", "-s", help="Target suburb or area, e.g. Richmond")
    p_partner.add_argument("--contact", "-c", help="Contact's first name for personalisation")

    p_loyalty = subparsers.add_parser(
        "loyalty",
        help="Generate a loyalty milestone email for a returning client",
        description="Generate a loyalty milestone email celebrating a client's Nth clean.",
    )
    p_loyalty.add_argument("--client", "-c", required=True, help="Client first name, e.g. Sarah")
    p_loyalty.add_argument(
        "--milestone", "-m",
        required=True,
        type=int,
        help="Number of cleans completed, e.g. 5 or 10",
    )
    p_loyalty.add_argument("--notes", "-n", help="Optional extra context about the client or job history")

    p_campaign = subparsers.add_parser(
        "campaign",
        help="Generate a seasonal marketing campaign copy kit",
        description="Generate email, SMS, social, GBP post, and landing page copy for a seasonal campaign.",
    )
    p_campaign.add_argument(
        "--type", "-t",
        required=True,
        choices=["spring-clean", "end-of-lease", "summer", "winter", "custom"],
        help="Campaign type",
    )
    p_campaign.add_argument("--suburbs", "-s", help="Comma-separated target suburbs, e.g. 'Richmond,Northcote'")
    p_campaign.add_argument("--custom", help="Custom campaign description (required when --type is 'custom')")

    p_batch = subparsers.add_parser(
        "batch",
        help="Process multiple jobs from a JSON file and generate schedules",
        description="Process a JSON array of jobs and generate a schedule for each.",
    )
    p_batch.add_argument(
        "input_file",
        help='Path to a JSON file: [{"id": "job-001", "description": "..."}, ...]',
    )
    p_batch.add_argument(
        "--format",
        choices=["text", "json", "markdown"],
        default="text",
        help="Output format (default: text)",
    )
    p_batch.add_argument("--output", "-o", help="Write output to a file instead of stdout")

    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()
    dispatch = {
        "schedule": cmd_schedule,
        "suburb": cmd_suburb,
        "emails": cmd_emails,
        "sop": cmd_sop,
        "batch": cmd_batch,
        "partner": cmd_partner,
        "loyalty": cmd_loyalty,
        "campaign": cmd_campaign,
    }
    dispatch[args.command](args)


if __name__ == "__main__":
    main()
