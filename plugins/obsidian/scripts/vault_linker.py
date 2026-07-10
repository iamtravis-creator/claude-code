#!/usr/bin/env python3
"""Find broken wikilinks and orphan notes in an Obsidian vault.

Standard library only. Usage:
    python3 vault_linker.py /path/to/vault [--json]
"""
import argparse
import json
import re
import sys
from pathlib import Path

WIKILINK_RE = re.compile(r"\[\[([^\]|#^]+)")


def index_vault(root: Path):
    """Return {stem_lower: Path} for every markdown file, and {stem_lower: [linked_targets]}."""
    files_by_stem = {}
    links_by_file = {}
    for path in root.rglob("*.md"):
        if ".obsidian" in path.parts:
            continue
        stem_key = path.stem.lower()
        files_by_stem.setdefault(stem_key, []).append(path)
        text = path.read_text(encoding="utf-8", errors="replace")
        targets = [m.group(1).strip() for m in WIKILINK_RE.finditer(text)]
        links_by_file[path] = targets
    return files_by_stem, links_by_file


def analyze(root: Path):
    files_by_stem, links_by_file = index_vault(root)

    broken = []  # (source_file, target_text)
    inbound_counts = {p: 0 for paths in files_by_stem.values() for p in paths}

    for source, targets in links_by_file.items():
        for target in targets:
            key = target.strip().lower()
            matches = files_by_stem.get(key)
            if not matches:
                broken.append((str(source.relative_to(root)), target))
            else:
                for m in matches:
                    inbound_counts[m] += 1

    orphans = [
        str(p.relative_to(root))
        for p, count in inbound_counts.items()
        if count == 0
    ]

    duplicates = {
        stem: [str(p.relative_to(root)) for p in paths]
        for stem, paths in files_by_stem.items()
        if len(paths) > 1
    }

    return {
        "total_notes": sum(len(v) for v in files_by_stem.values()),
        "broken_links": [{"file": f, "target": t} for f, t in broken],
        "orphan_notes": sorted(orphans),
        "duplicate_titles": duplicates,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("vault", help="Path to the Obsidian vault directory")
    parser.add_argument("--json", action="store_true", help="Output JSON instead of a report")
    args = parser.parse_args()

    root = Path(args.vault).expanduser().resolve()
    if not root.is_dir():
        print(f"Not a directory: {root}", file=sys.stderr)
        sys.exit(1)

    result = analyze(root)

    if args.json:
        print(json.dumps(result, indent=2))
        return

    print(f"Vault: {root}")
    print(f"Notes scanned: {result['total_notes']}")

    print(f"\nBroken wikilinks: {len(result['broken_links'])}")
    for item in result["broken_links"]:
        print(f"  {item['file']} -> [[{item['target']}]]")

    print(f"\nOrphan notes (no inbound links): {len(result['orphan_notes'])}")
    for note in result["orphan_notes"]:
        print(f"  {note}")

    if result["duplicate_titles"]:
        print(f"\nDuplicate titles (ambiguous link targets): {len(result['duplicate_titles'])}")
        for stem, paths in result["duplicate_titles"].items():
            print(f"  {stem}: {', '.join(paths)}")


if __name__ == "__main__":
    main()
