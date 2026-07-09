---
description: Audit an Obsidian vault for broken wikilinks, orphan notes, and duplicate titles
argument-hint: [vault-path]
allowed-tools: Bash(python3:*)
---

Run the vault link-health check on $1:

!`python3 ${CLAUDE_PLUGIN_ROOT}/scripts/vault_linker.py "$1"`

Summarize the results:
1. **Broken wikilinks** — for each, suggest the closest existing note title as a likely fix (typo, or the target note doesn't exist yet).
2. **Orphan notes** — notes nothing links to; suggest where they'd fit given other notes' topics, or ask whether they should be deleted.
3. **Duplicate titles** — filenames that collide across folders, which Obsidian can't disambiguate as link targets; recommend renaming one.

Don't apply fixes automatically — report findings and propose specific changes for the user to confirm.
