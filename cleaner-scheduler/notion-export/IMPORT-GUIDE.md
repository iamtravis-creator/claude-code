# Notion Import Guide

## How to Set Up Your Main10 Clean Ops Dashboard in Notion

Import these 10 pages in order. Each file is one Notion page.

---

## Step 1 — Create the workspace

1. In Notion, create a new **page** called `Main10 Clean`
2. Set it as a full-page view (not inline)
3. This will be the root of your workspace

---

## Step 2 — Import each page

For each file below:
1. Create a new sub-page inside `Main10 Clean`
2. Name it as shown in the table
3. Open the file, select all content (Ctrl+A / Cmd+A), paste into the Notion page

Notion will automatically render:
- Tables → Notion tables
- Checkboxes (`- [ ]`) → Notion to-do checkboxes
- Headers (`#`, `##`, `###`) → Notion heading blocks
- Bold (`**text**`) → bold
- Code blocks (` ``` `) → code blocks
- `>` blockquotes → callout-style indented blocks

| File | Notion page name | Icon suggestion |
|------|-----------------|-----------------|
| `00-dashboard.md` | Main10 Clean — Ops Dashboard | 🏠 |
| `01-month1-plan.md` | Month 1 Plan — Days 1–30 | 📅 |
| `02-month2-plan.md` | Month 2 Plan — Days 31–60 | 📈 |
| `03-ops-lead-1.md` | Ops Lead 1 Tasks | ✅ |
| `04-ops-lead-2.md` | Ops Lead 2 Tasks | ✅ |
| `05-kpi-tracker.md` | KPI Tracker | 📊 |
| `06-suburb-tracker.md` | Suburb Tracker | 📍 |
| `07-partner-tracker.md` | Partner Tracker | 🤝 |
| `08-client-database.md` | Client Database | 👤 |
| `09-template-library.md` | Template Library | 📝 |
| `10-cleaner-hub.md` | Cleaner Hub | 🧹 |

---

## Step 3 — Link the pages together

In the Dashboard page (`00-dashboard.md`), the Navigation table has placeholder links like `[KPI Tracker](05-kpi-tracker.md)`.

Replace each with a Notion page mention:
1. Delete the placeholder text
2. Type `/page` and select the relevant Notion page from the list

Alternatively, add each sub-page to the Notion sidebar by right-clicking → "Add to sidebar".

---

## Step 4 — Set up the Notion database (optional but recommended)

For the Client Database and KPI Tracker, you can convert the static markdown tables into proper **Notion databases**:

1. Select the entire table in Notion
2. Click the `···` menu → "Turn into database"
3. Add properties: Status (select), Date, Number, etc.
4. Create views: Table view (default), Filter by owner, Sort by date

This lets you:
- Filter tasks by owner (Ops Lead 1 vs Ops Lead 2)
- Sort clients by clean count for loyalty tracking
- Track KPIs with formula properties

---

## Step 5 — CSV import (Notion databases)

To import `launch-plan.csv` or `month2-plan.csv` as a proper Notion database:

1. In Notion, create a new page → choose "Table" (database type)
2. Click "Import" → "CSV"
3. Select `launch-plan.csv` or `month2-plan.csv`
4. Map columns: Day → Number, Week → Number, Task → Title, Owner → Select, etc.

This gives you a fully filterable task database where you can:
- Filter by Owner: "Ops Lead 1" only
- Filter by Week
- Add a Status column (Not started / In progress / Done)
- Create a Board view grouped by Week

---

## Step 6 — Share with your team

1. Click "Share" on the `Main10 Clean` root page
2. Invite Ops Lead 2 as "Can edit"
3. Share the Cleaner Hub page with cleaners as "Can view" (or generate a shareable link)

---

## Files in this directory

```
notion-export/
├── IMPORT-GUIDE.md          ← this file
├── 00-dashboard.md          ← main hub page
├── 01-month1-plan.md        ← Days 1–30
├── 02-month2-plan.md        ← Days 31–60
├── 03-ops-lead-1.md         ← OL1 task board
├── 04-ops-lead-2.md         ← OL2 task board
├── 05-kpi-tracker.md        ← weekly metrics
├── 06-suburb-tracker.md     ← suburb status
├── 07-partner-tracker.md    ← partner outreach
├── 08-client-database.md    ← client + loyalty
├── 09-template-library.md   ← all copy templates
└── 10-cleaner-hub.md        ← cleaner SOP + log
```
