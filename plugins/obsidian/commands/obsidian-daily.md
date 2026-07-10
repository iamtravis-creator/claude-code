---
description: Open or create today's daily note in an Obsidian vault
argument-hint: [vault-path]
---

Open today's daily note in the Obsidian vault at $1, creating it if it doesn't exist yet.

1. Confirm $1 is a vault (contains `.obsidian/`).
2. Look for an existing `Daily/`, `Journal/`, or similarly-named folder and inspect a recent daily note there to detect the filename date format in use (e.g. `YYYY-MM-DD.md`) and any template it follows.
3. If no daily notes exist yet, use `YYYY-MM-DD.md` at the vault root and ask the user whether they'd prefer a `Daily/` subfolder going forward.
4. Create today's note only if it doesn't already exist — never overwrite one.

Use the `obsidian-vault` skill for frontmatter and wikilink conventions.
