---
description: Create a new note in an Obsidian vault following its existing conventions
argument-hint: [vault-path] [note-title]
---

Create a new note titled "$2" in the Obsidian vault at $1.

Before writing:
1. Confirm $1 is a vault (contains `.obsidian/`) or ask the user for the correct path.
2. Search the vault for an existing note with the same title (case-insensitive filename match) — if found, ask whether to edit it instead of creating a duplicate.
3. Read one or two existing notes in the vault to detect its frontmatter convention (field names, date format) and folder layout, then match it.
4. If there's an obvious index or "Map of Content" note for this topic, add a wikilink to the new note from it so it isn't orphaned.

Use the `obsidian-vault` skill for wikilink/frontmatter/tag conventions.
