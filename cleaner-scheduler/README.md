# Main10 Clean — Operations Toolkit

A Python CLI for Melbourne residential cleaning operations. Generates work schedules, suburb landing page copy, post-clean email sequences, job SOPs, and batch schedule processing — all powered by the Claude API with prompt caching.

## Prerequisites

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY=your_key_here
```

## Quick Start

```bash
python scheduler.py schedule --job "3-bed house, Richmond, 2 cleaners, end-of-lease"
python scheduler.py suburb --suburb "Northcote"
python scheduler.py emails --client "Sarah" --job "Deep clean, 2-bed, Fitzroy"
python scheduler.py sop --job "End-of-lease, 3-bed, pets on premises, Elwood"
python scheduler.py batch jobs.json --format json
python scheduler.py partner --type real-estate --suburb "Richmond" --contact "James"
python scheduler.py loyalty --client "Emma" --milestone 10
python scheduler.py campaign --type spring-clean --suburbs "Richmond,Northcote,Fitzroy"
```

---

## Subcommand Reference

### `schedule` — Generate a crew work schedule

Produces a timed, cleaner-assigned work schedule from a job description.

| Flag | Short | Description |
|------|-------|-------------|
| `--job` | `-j` | Job description as a quoted string |
| `--file` | `-f` | Path to a `.txt` file with the job description |
| `--format` | | Output format: `text` (default), `json`, `markdown` |

**Examples**

```bash
# Basic schedule
python scheduler.py schedule --job "4-bed house, Camberwell, 3 cleaners, spring clean, oven included"

# Read from file
python scheduler.py schedule --file jobs/camberwell_23may.txt

# JSON output (pipe to booking system)
python scheduler.py schedule --job "Studio, St Kilda, 1 cleaner" --format json

# Markdown output (paste into Notion)
python scheduler.py schedule --job "3-bed, Brunswick, move-out" --format markdown
```

---

### `suburb` — Generate suburb landing page copy

Produces SEO-optimised copy for a Main10 Clean suburb landing page: meta tags, H1, value prop, service blocks, trust signals, CTA, and FAQs.

| Flag | Short | Description |
|------|-------|-------------|
| `--suburb` | `-s` | Suburb name (required), e.g. `Richmond` |
| `--city` | | City name (default: `Melbourne`) |

**Examples**

```bash
python scheduler.py suburb --suburb "Northcote"
python scheduler.py suburb --suburb "Brighton"

# Save to file for website upload
python scheduler.py suburb --suburb "Elwood" > content/elwood.md
```

---

### `emails` — Generate post-clean email sequence

Produces a 3-email sequence for a completed job: same-day thank you + review ask, Day 3 satisfaction check, Day 7 referral offer.

Placeholders in the output: `[REVIEW_LINK]`, `[REFERRAL_CODE]`

| Flag | Short | Description |
|------|-------|-------------|
| `--client` | `-c` | Client first name (required), e.g. `Sarah` |
| `--job` | `-j` | Job details as a quoted string |
| `--file` | `-f` | Path to a file containing job details |

**Examples**

```bash
python scheduler.py emails --client "James" --job "End-of-lease, 3-bed, Fitzroy, 23 May"

# Longer job notes from file
python scheduler.py emails --client "Priya" --file jobs/priya_details.txt

# Save sequence for mail merge
python scheduler.py emails --client "Tom" --job "Regular clean, 2-bed, Richmond" > emails/tom_sequence.md
```

---

### `sop` — Generate a job-specific SOP

Produces a single-page Standard Operating Procedure for the attending cleaner: arrival, supplies, room checklist, QR card steps, exit protocol.

| Flag | Short | Description |
|------|-------|-------------|
| `--job` | `-j` | Job description as a quoted string |
| `--file` | `-f` | Path to a file containing the job description |

**Examples**

```bash
python scheduler.py sop --job "Deep clean, 4-bed, 2 cats on premises, Elwood, key safe"

# Print-ready output
python scheduler.py sop --job "End-of-lease, studio, Collingwood" > sop_collingwood.md
```

---

### `batch` — Process multiple jobs

Reads a JSON array of jobs and generates a schedule for each. Useful for pre-planning a full day's roster.

**Input JSON format**

```json
[
  {"id": "job-001", "description": "3-bed house, Richmond, 2 cleaners, end-of-lease"},
  {"id": "job-002", "description": "Studio apartment, St Kilda, 1 cleaner, regular clean"},
  {"description": "2-bed, Brunswick, deep clean, oven + fridge"}
]
```

The `"id"` field is optional — items without one use their array index.

| Arg / Flag | Short | Description |
|------------|-------|-------------|
| `input_file` | | Path to the JSON input file (positional, required) |
| `--format` | | Output format: `text` (default), `json`, `markdown` |
| `--output` | `-o` | Write output to a file instead of stdout |

**Examples**

```bash
# Process today's jobs, print to terminal
python scheduler.py batch todays_jobs.json

# JSON output for downstream tooling
python scheduler.py batch todays_jobs.json --format json --output schedules_25may.json

# Markdown output for team Notion page
python scheduler.py batch todays_jobs.json --format markdown --output schedules_25may.md
```

---

## Output Formats

`schedule` and `batch` support three output formats via `--format`:

| Format | Description | Use case |
|--------|-------------|----------|
| `text` | Plain text (default) | Terminal, print |
| `json` | `{"schedule": "..."}` or `[{"id": "...", "schedule": "..."}]` | APIs, Zapier, Make |
| `markdown` | Fenced code block with heading | Notion, GitHub, Confluence |

---

## Cache Stats

Each call prints a line to **stderr** showing prompt caching activity:

```
[cache created: 312 tokens]   ← first call with this subcommand (system prompt written to cache)
[cache hit: 312 tokens]       ← subsequent calls (system prompt read from cache, lower cost)
```

Ephemeral cache entries persist for ~5 minutes. Running the same subcommand within that window will always hit the cache. Each subcommand has its own system prompt and its own cache entry.

---

## Templates

The `templates/` directory contains ready-to-use content templates that complement this CLI:

| File | Contents |
|------|----------|
| [`templates/email-sequence.md`](templates/email-sequence.md) | Manual email templates with placeholders |
| [`templates/suburb-page-template.md`](templates/suburb-page-template.md) | Blank suburb landing page template |
| [`templates/cleaner-sop.md`](templates/cleaner-sop.md) | Blank cleaner SOP template |
| [`templates/ad-copy.md`](templates/ad-copy.md) | FB/IG ad copy variants |
| [`templates/faq-content.md`](templates/faq-content.md) | Full FAQ content blocks |

---

### `partner` — Generate a B2B partner outreach email

Produces a personalised outreach email and follow-up line for a referral partner.

| Flag | Short | Description |
|------|-------|-------------|
| `--type` | `-t` | Partner type (required): `real-estate`, `property-manager`, `airbnb` |
| `--suburb` | `-s` | Target suburb or area, e.g. `Richmond` |
| `--contact` | `-c` | Contact's first name for personalisation |

**Examples**

```bash
python scheduler.py partner --type real-estate --suburb "Richmond" --contact "James"
python scheduler.py partner --type property-manager --suburb "Northcote"
python scheduler.py partner --type airbnb --suburb "St Kilda" --contact "Lisa"

# Save to file
python scheduler.py partner --type real-estate --suburb "Elwood" --contact "Mark" > outreach/elwood-realty.md
```

---

### `loyalty` — Generate a loyalty milestone email

Produces a personalised milestone email celebrating a client's Nth clean, with an optional SMS version.

| Flag | Short | Description |
|------|-------|-------------|
| `--client` | `-c` | Client first name (required), e.g. `Sarah` |
| `--milestone` | `-m` | Number of cleans completed (required), e.g. `5`, `10`, `20` |
| `--notes` | `-n` | Optional extra context about the client or job history |

**Examples**

```bash
python scheduler.py loyalty --client "Sarah" --milestone 5
python scheduler.py loyalty --client "James" --milestone 10
python scheduler.py loyalty --client "Emma" --milestone 20 --notes "Always requests eco products"
```

---

### `campaign` — Generate a seasonal campaign copy kit

Produces email, SMS, social post, GBP post, and landing page copy for a seasonal campaign.

| Flag | Short | Description |
|------|-------|-------------|
| `--type` | `-t` | Campaign type (required): `spring-clean`, `end-of-lease`, `summer`, `winter`, `custom` |
| `--suburbs` | `-s` | Comma-separated target suburbs, e.g. `'Richmond,Northcote,Fitzroy'` |
| `--custom` | | Custom campaign description (required when `--type custom`) |

**Examples**

```bash
python scheduler.py campaign --type spring-clean --suburbs "Richmond,Northcote,Elwood"
python scheduler.py campaign --type end-of-lease --suburbs "Brunswick,Fitzroy,Collingwood"
python scheduler.py campaign --type summer
python scheduler.py campaign --type custom --custom "Back-to-school clean, February, family households in Brunswick"

# Save full kit to file
python scheduler.py campaign --type spring-clean --suburbs "Richmond,Northcote" > campaigns/spring-2026.md
```

---

See [`LAUNCH_PLAN.md`](LAUNCH_PLAN.md) for the full 30-day Melbourne go-to-market plan and [`MONTH2_PLAN.md`](MONTH2_PLAN.md) for Month 2 expansion.
