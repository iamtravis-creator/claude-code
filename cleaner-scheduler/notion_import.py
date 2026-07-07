#!/usr/bin/env python3
"""
notion_import.py — Auto-import Main10 Clean Notion export into a Notion workspace.

Usage:
    export NOTION_TOKEN=secret_xxx
    export NOTION_PARENT_PAGE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    python notion_import.py [--dry-run] [--file FILE] [--yes] [--verbose] [--dir DIR]
"""

import argparse
import os
import re
import sys
import time
from pathlib import Path

try:
    from notion_client import Client
    from notion_client.errors import APIResponseError
except ImportError:
    print("Error: notion-client is not installed. Run: pip install notion-client", file=sys.stderr)
    sys.exit(1)

EXPORT_DIR = Path(__file__).parent / "notion-export"
SKIP_FILES = {"IMPORT-GUIDE.md"}
BLOCKS_PER_APPEND = 100  # Notion API limit per call
RATE_LIMIT_DELAY = 0.35  # seconds between API calls


# ---------------------------------------------------------------------------
# Markdown → Notion block conversion
# ---------------------------------------------------------------------------

def _rich_text(text):
    """Convert inline markdown (bold, italic, code, links) to Notion rich_text."""
    segments = []
    pattern = r"(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+?)`|\[([^\]]+?)\]\(([^)]+?)\))"
    pos = 0
    for m in re.finditer(pattern, text):
        if m.start() > pos:
            segments.append(_plain(text[pos:m.start()]))
        if m.group(2) is not None:  # **bold**
            segments.append(_plain(m.group(2), bold=True))
        elif m.group(3) is not None:  # *italic*
            segments.append(_plain(m.group(3), italic=True))
        elif m.group(4) is not None:  # `code`
            segments.append(_plain(m.group(4), code=True))
        elif m.group(5) is not None:  # [text](url)
            segments.append(_link(m.group(5), m.group(6)))
        pos = m.end()
    if pos < len(text):
        segments.append(_plain(text[pos:]))
    return segments or [_plain(text)]


def _plain(text, bold=False, italic=False, code=False):
    ann = {"bold": bold, "italic": italic, "code": code,
           "strikethrough": False, "underline": False, "color": "default"}
    return {"type": "text", "text": {"content": text}, "annotations": ann}


def _link(text, url):
    ann = {"bold": False, "italic": False, "code": False,
           "strikethrough": False, "underline": False, "color": "default"}
    return {"type": "text", "text": {"content": text, "link": {"url": url}}, "annotations": ann}


def _heading_block(level, text):
    key = {1: "heading_1", 2: "heading_2", 3: "heading_3"}[level]
    return {"object": "block", "type": key, key: {"rich_text": _rich_text(text)}}


def _paragraph_block(text):
    return {"object": "block", "type": "paragraph",
            "paragraph": {"rich_text": _rich_text(text)}}


def _todo_block(text, checked=False):
    return {"object": "block", "type": "to_do",
            "to_do": {"rich_text": _rich_text(text), "checked": checked}}


def _bullet_block(text):
    return {"object": "block", "type": "bulleted_list_item",
            "bulleted_list_item": {"rich_text": _rich_text(text)}}


def _numbered_block(text):
    return {"object": "block", "type": "numbered_list_item",
            "numbered_list_item": {"rich_text": _rich_text(text)}}


def _divider_block():
    return {"object": "block", "type": "divider", "divider": {}}


def _quote_block(text):
    return {"object": "block", "type": "quote",
            "quote": {"rich_text": _rich_text(text)}}


def _code_block(text, language="plain text"):
    lang_map = {
        "python": "python", "py": "python", "bash": "bash", "sh": "bash",
        "json": "json", "javascript": "javascript", "js": "javascript",
        "typescript": "typescript", "ts": "typescript", "sql": "sql",
        "html": "html", "css": "css", "markdown": "markdown", "md": "markdown",
    }
    notion_lang = lang_map.get(language.lower(), "plain text")
    return {"object": "block", "type": "code",
            "code": {"rich_text": [_plain(text)], "language": notion_lang}}


def _table_block(rows):
    """Convert a list of row lists (strings) into a Notion table block."""
    if not rows:
        return None
    # Remove separator rows (all cells are dashes/colons)
    data_rows = [r for r in rows if not all(re.match(r"^[-:]+$", c.strip()) for c in r)]
    col_count = max(len(r) for r in data_rows)
    table_rows = []
    for row in data_rows:
        cells = [_rich_text(cell.strip()) for cell in row]
        while len(cells) < col_count:
            cells.append([_plain("")])
        table_rows.append({"type": "table_row", "table_row": {"cells": cells}})
    return {
        "object": "block",
        "type": "table",
        "table": {
            "table_width": col_count,
            "has_column_header": True,
            "has_row_header": False,
            "children": table_rows,
        },
    }


# ---------------------------------------------------------------------------
# Markdown file parser
# ---------------------------------------------------------------------------

def parse_markdown(text):
    """Parse markdown text into (title, blocks). First H1 becomes the page title."""
    lines = text.splitlines()
    title = None
    blocks = []
    i = 0
    in_code_block = False
    code_lang = ""
    code_lines = []
    in_table = False
    table_rows = []

    def flush_table():
        nonlocal in_table, table_rows
        if table_rows:
            block = _table_block(table_rows)
            if block:
                blocks.append(block)
        in_table = False
        table_rows = []

    while i < len(lines):
        line = lines[i]

        # Code fence start/end
        if line.startswith("```"):
            if in_table:
                flush_table()
            if in_code_block:
                blocks.append(_code_block("\n".join(code_lines), code_lang))
                in_code_block = False
                code_lang = ""
                code_lines = []
            else:
                in_code_block = True
                code_lang = line[3:].strip()
            i += 1
            continue

        if in_code_block:
            code_lines.append(line)
            i += 1
            continue

        # Table rows
        if line.startswith("|"):
            if not in_table:
                in_table = True
                table_rows = []
            cols = [c for c in line.split("|") if c != ""]
            table_rows.append(cols)
            i += 1
            continue
        elif in_table:
            flush_table()

        stripped = line.strip()
        if not stripped:
            i += 1
            continue

        # Headings
        heading_m = re.match(r"^(#{1,3})\s+(.+)$", stripped)
        if heading_m:
            level = len(heading_m.group(1))
            text = heading_m.group(2).strip()
            if level == 1 and title is None:
                title = text
            else:
                blocks.append(_heading_block(min(level, 3), text))
            i += 1
            continue

        # Divider
        if re.match(r"^---+$", stripped):
            blocks.append(_divider_block())
            i += 1
            continue

        # Blockquote
        if stripped.startswith(">"):
            blocks.append(_quote_block(stripped.lstrip("> ").strip()))
            i += 1
            continue

        # To-do checkbox
        todo_m = re.match(r"^-\s+\[([ xX])\]\s+(.+)$", stripped)
        if todo_m:
            checked = todo_m.group(1).lower() == "x"
            blocks.append(_todo_block(todo_m.group(2).strip(), checked=checked))
            i += 1
            continue

        # Bullet list
        bullet_m = re.match(r"^[-*]\s+(.+)$", stripped)
        if bullet_m:
            blocks.append(_bullet_block(bullet_m.group(1).strip()))
            i += 1
            continue

        # Numbered list
        num_m = re.match(r"^\d+\.\s+(.+)$", stripped)
        if num_m:
            blocks.append(_numbered_block(num_m.group(1).strip()))
            i += 1
            continue

        # Paragraph
        blocks.append(_paragraph_block(stripped))
        i += 1

    if in_table:
        flush_table()
    if in_code_block and code_lines:
        blocks.append(_code_block("\n".join(code_lines), code_lang))

    return title or "Untitled", blocks


# ---------------------------------------------------------------------------
# Notion API helpers
# ---------------------------------------------------------------------------

def create_page(notion, parent_id, title, verbose=False):
    if verbose:
        print(f"  Creating page: {title}")
    page = notion.pages.create(
        parent={"type": "page_id", "page_id": parent_id},
        properties={"title": {"title": [{"type": "text", "text": {"content": title}}]}},
    )
    return page["id"]


def append_blocks(notion, page_id, blocks, verbose=False):
    total = len(blocks)
    for start in range(0, total, BLOCKS_PER_APPEND):
        chunk = blocks[start:start + BLOCKS_PER_APPEND]
        if verbose:
            end = min(start + BLOCKS_PER_APPEND, total)
            print(f"  Appending blocks {start + 1}–{end} of {total}")
        notion.blocks.children.append(block_id=page_id, children=chunk)
        if start + BLOCKS_PER_APPEND < total:
            time.sleep(RATE_LIMIT_DELAY)


# ---------------------------------------------------------------------------
# Main import logic
# ---------------------------------------------------------------------------

def collect_files(source_dir, only_file=None):
    source = Path(source_dir)
    if not source.is_dir():
        print(f"Error: source directory not found: {source}", file=sys.stderr)
        sys.exit(1)
    if only_file:
        path = source / only_file
        if not path.exists():
            print(f"Error: file not found: {path}", file=sys.stderr)
            sys.exit(1)
        return [path]
    files = sorted(f for f in source.glob("*.md") if f.name not in SKIP_FILES)
    if not files:
        print(f"Error: no .md files found in {source}", file=sys.stderr)
        sys.exit(1)
    return files


def import_file(notion, parent_id, md_path, dry_run=False, verbose=False):
    text = md_path.read_text(encoding="utf-8")
    title, blocks = parse_markdown(text)
    print(f"  {'[dry-run] ' if dry_run else ''}'{title}' — {len(blocks)} blocks from {md_path.name}")
    if dry_run:
        return
    try:
        page_id = create_page(notion, parent_id, title, verbose=verbose)
        if blocks:
            time.sleep(RATE_LIMIT_DELAY)
            append_blocks(notion, page_id, blocks, verbose=verbose)
        print(f"  ✓ Created: {title}")
    except APIResponseError as e:
        print(f"  ✗ API error for '{title}': {e}", file=sys.stderr)


def main():
    parser = argparse.ArgumentParser(
        prog="notion_import",
        description="Import Main10 Clean Notion export files into a Notion workspace.",
    )
    parser.add_argument(
        "--token",
        default=os.environ.get("NOTION_TOKEN"),
        help="Notion integration token (or set NOTION_TOKEN env var)",
    )
    parser.add_argument(
        "--parent-id",
        default=os.environ.get("NOTION_PARENT_PAGE_ID"),
        help="Parent Notion page ID (or set NOTION_PARENT_PAGE_ID env var)",
    )
    parser.add_argument(
        "--dir",
        default=str(EXPORT_DIR),
        help=f"Source directory containing markdown files (default: {EXPORT_DIR})",
    )
    parser.add_argument(
        "--file",
        metavar="FILE",
        help="Import a single file instead of all files (e.g. 00-dashboard.md)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Parse files and show block counts without making any API calls",
    )
    parser.add_argument(
        "--yes", "-y",
        action="store_true",
        help="Skip confirmation prompt",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Show detailed output for each API call",
    )
    args = parser.parse_args()

    if not args.dry_run:
        if not args.token:
            print("Error: NOTION_TOKEN is not set. Pass --token or set the environment variable.", file=sys.stderr)
            sys.exit(1)
        if not args.parent_id:
            print("Error: NOTION_PARENT_PAGE_ID is not set. Pass --parent-id or set the environment variable.", file=sys.stderr)
            sys.exit(1)

    files = collect_files(args.dir, only_file=args.file)

    print(f"\nMain10 Clean — Notion Import")
    print(f"Source directory : {args.dir}")
    print(f"Files to import  : {len(files)}")
    if not args.dry_run:
        print(f"Parent page ID   : {args.parent_id}")
    print()

    if not args.dry_run and not args.yes:
        confirm = input(f"Import {len(files)} pages into Notion? [y/N] ").strip().lower()
        if confirm != "y":
            print("Aborted.")
            sys.exit(0)

    notion = None if args.dry_run else Client(auth=args.token)

    print(f"\n{'[DRY RUN] ' if args.dry_run else ''}Importing {len(files)} files...\n")
    success = 0
    for md_path in files:
        try:
            import_file(notion, args.parent_id, md_path, dry_run=args.dry_run, verbose=args.verbose)
            success += 1
            if not args.dry_run:
                time.sleep(RATE_LIMIT_DELAY)
        except Exception as e:
            print(f"  ✗ Unexpected error for {md_path.name}: {e}", file=sys.stderr)

    print(f"\n{'[DRY RUN] ' if args.dry_run else ''}Done: {success}/{len(files)} pages {'parsed' if args.dry_run else 'imported'}.")
    if args.dry_run:
        print("\nRun without --dry-run to import for real.")


if __name__ == "__main__":
    main()
