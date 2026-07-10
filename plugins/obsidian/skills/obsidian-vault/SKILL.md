---
name: obsidian-vault
description: Use when reading, writing, or organizing notes in an Obsidian vault — creating notes, linking with wikilinks, tagging, managing daily notes, or when the user mentions "Obsidian", "vault", "wikilink", "backlink", or a folder of markdown notes with YAML frontmatter. Covers vault conventions so notes stay compatible with Obsidian's link graph, tag pane, and the Dataview plugin.
version: 1.0.0
---

# Obsidian Vault

Obsidian vaults are plain folders of markdown files. Compatibility comes entirely from following its conventions — there's no special file format, just markdown plus a link/tag syntax Obsidian parses.

## Locating the vault

A directory is an Obsidian vault if it contains a `.obsidian/` folder. If the user hasn't named a path, look for one in the current directory or ask. Never create a `.obsidian/` folder yourself — that's owned by the Obsidian app.

## Note conventions

**Frontmatter** (YAML, optional but recommended for Dataview queries):
```markdown
---
title: Note Title
tags: [project-x, meeting-notes]
created: 2026-07-09
---
```

**Wikilinks** — Obsidian's native link syntax, resolved by filename (not path):
- `[[Note Title]]` — link to a note
- `[[Note Title|display text]]` — link with custom display text
- `[[Note Title#Heading]]` — link to a specific heading
- `[[Note Title#^block-id]]` — link to a specific block

Prefer wikilinks over markdown links (`[text](path.md)`) inside a vault — only wikilinks populate Obsidian's graph view and backlinks pane.

**Tags** — either in frontmatter (`tags: [foo, bar]`) or inline in body text (`#foo`). Nested tags use `/`: `#project/active`.

**Filenames** are the link target, so keep them stable once other notes link to them. Renaming a note in Obsidian auto-updates links; renaming it externally (e.g. via this tool) does not — grep for `[[Old Name` and update references manually if you rename a linked note outside the app.

## Folder layout

There's no required structure. Common patterns:
- Flat vault — all notes in one folder, organized by tags/links instead of folders
- `Daily/` — one note per day, filename `YYYY-MM-DD.md`
- Topic folders (`Projects/`, `People/`, `Areas/`) — mirrors a PARA or Zettelkasten method

Match whatever structure already exists in the vault rather than imposing a new one.

## Creating a note

1. Check whether a note with that title already exists (search by filename, not just an exact path guess) — Obsidian treats duplicate titles across folders as ambiguous link targets.
2. Write frontmatter if the vault's existing notes use it (check a sample note first for the convention in use — key names and date format vary per vault).
3. Link the new note from at least one existing note if there's an obvious parent (e.g. an index or MOC — "Map of Content" — note), so it isn't orphaned.

## Daily notes

Filename is normally `YYYY-MM-DD.md` in a `Daily/` or `Journal/` folder (check the vault's existing daily notes for the actual convention — some invert to `DD-MM-YYYY` or nest by month). Today's date is available from the session context.

## Searching a vault

- Grep is sufficient for filename, tag, and content search — a vault is just markdown files.
- For "what links here" (backlinks), grep for `[[Note Title` across the vault rather than trying to parse Obsidian's own link cache (`.obsidian/` is app-internal state, not a public API).

## Link health

Use `scripts/vault_linker.py` to find broken wikilinks (targets that don't resolve to any file) and orphan notes (no inbound links from anywhere else in the vault):

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/vault_linker.py /path/to/vault
```

Add `--json` for machine-readable output. See `/obsidian-links` for the packaged command.

## Dataview compatibility

If the vault uses the Dataview community plugin, frontmatter fields become queryable columns (`tags`, `created`, or any custom key). Keep frontmatter keys consistent across notes of the same type so Dataview queries don't silently miss notes with a differently-named field.

## What this skill does not do

It does not manage Obsidian's own settings, plugins, themes, or the `.obsidian/` config folder — treat that as owned by the Obsidian application, not by Claude Code. For building an actively-maintained "second brain" wiki with an ingest workflow (sources → summarized, cross-referenced pages), see the more elaborate `llm-wiki` skill instead; this skill is the lighter-weight note/link/tag layer underneath it.
