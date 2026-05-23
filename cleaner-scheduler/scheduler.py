#!/usr/bin/env python3
"""Generate a cleaner work schedule from a job description using the Claude API."""

import argparse
import sys
import anthropic

SYSTEM_PROMPT = """You are a professional cleaning operations manager with 15+ years of experience scheduling cleaning crews.

When given a job description, create a detailed, practical work schedule for the cleaning team. Your schedule must include:

1. **Job Summary** — brief overview (location type, scope, key requirements)
2. **Team Assignment** — assign each cleaner by number to specific areas or tasks
3. **Timed Schedule** — time slots for every task (e.g., 9:00–9:30 AM · Cleaner 1 — Kitchen deep clean)
4. **Task Order** — ordered by priority and logical flow (client priorities first, then top-to-bottom, wet areas before dry)
5. **Estimated Total Duration** — how long the full job takes
6. **Special Notes** — priority items, client preferences, supplies needed, or safety considerations

Format the schedule clearly with headers and time blocks. Be specific and actionable — a cleaner should be able to follow this schedule without any additional instructions."""


def get_schedule(job_description: str) -> str:
    client = anthropic.Anthropic()

    response = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=2048,
        system=[
            {
                "type": "text",
                "text": SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[{"role": "user", "content": f"Job Description:\n\n{job_description}"}],
    )

    usage = response.usage
    cache_parts = []
    if getattr(usage, "cache_creation_input_tokens", 0):
        cache_parts.append(f"cache created: {usage.cache_creation_input_tokens} tokens")
    if getattr(usage, "cache_read_input_tokens", 0):
        cache_parts.append(f"cache hit: {usage.cache_read_input_tokens} tokens")
    if cache_parts:
        print(f"[{', '.join(cache_parts)}]\n", file=sys.stderr)

    return response.content[0].text


def main():
    parser = argparse.ArgumentParser(
        description="Generate a cleaner work schedule from a job description."
    )
    parser.add_argument("--job", "-j", help="Job description as a quoted string")
    parser.add_argument("--file", "-f", help="Path to a file containing the job description")
    args = parser.parse_args()

    if args.file:
        with open(args.file) as f:
            job_description = f.read().strip()
    elif args.job:
        job_description = args.job.strip()
    else:
        print("Enter job description (Ctrl+D when done):", file=sys.stderr)
        job_description = sys.stdin.read().strip()

    if not job_description:
        print("Error: no job description provided.", file=sys.stderr)
        sys.exit(1)

    print("Generating schedule...\n", file=sys.stderr)
    print(get_schedule(job_description))


if __name__ == "__main__":
    main()
