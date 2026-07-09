# Obsidian

Lightweight Obsidian vault integration for Claude Code: create notes with the right frontmatter and wikilinks, manage daily notes, and audit link health — without imposing a specific knowledge-management workflow on top.

## Contents

| Component | Purpose |
|---|---|
| **Skill:** `obsidian-vault` | Vault conventions (wikilinks, frontmatter, tags, folder layout, Dataview compatibility) — auto-invoked when working with Obsidian notes |
| **Command:** `/obsidian-note <vault-path> <title>` | Create a new note following the vault's existing conventions |
| **Command:** `/obsidian-daily <vault-path>` | Open or create today's daily note |
| **Command:** `/obsidian-links <vault-path>` | Report broken wikilinks, orphan notes, and duplicate titles |
| **Script:** `scripts/vault_linker.py` | Standard-library-only link health scanner used by `/obsidian-links` |

## Usage

```bash
/obsidian-note ~/vaults/notes "Project Kickoff"
/obsidian-daily ~/vaults/notes
/obsidian-links ~/vaults/notes
```

Or run the scanner directly:

```bash
python3 scripts/vault_linker.py ~/vaults/notes --json
```

## Scope

This plugin is the lightweight note/link/tag layer for any Obsidian vault. For an actively-maintained "second brain" wiki with a source-ingest workflow (papers/articles → summarized, cross-referenced pages), see the `llm-wiki` skill in `plugins/claude-skills/engineering/llm-wiki/` instead.
