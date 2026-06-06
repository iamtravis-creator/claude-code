---
name: bash-safety
description: Best practices for writing safe, robust Bash scripts. Use this skill whenever authoring or editing shell scripts (.sh files), hook scripts, or non-trivial bash commands — covers strict mode, quoting, error handling, and portable string comparison.
---

This skill guides the creation of Bash scripts that fail loudly instead of silently, handle untrusted input safely, and behave the same on macOS and Linux.

Apply this guidance whenever you write or modify a `.sh` file, a hook command, or a multi-line bash snippet.

## Start every script with strict mode

```bash
#!/bin/bash
set -euo pipefail
```

- `-e` — exit immediately if any command fails.
- `-u` — error on use of an unset variable (catches typos in variable names).
- `-o pipefail` — a pipeline fails if *any* stage fails, not just the last one.

## Always quote variable expansions

Unquoted expansions undergo word-splitting and glob expansion, which breaks on
spaces and special characters.

```bash
# Bad — breaks if $FILE contains spaces
rm $FILE

# Good
rm "$FILE"
```

Quote command substitutions too: `dir="$(dirname "$path")"`.

## Compare strings literally, not with glob matching

Inside `[[ ]]`, `==` performs glob pattern matching. If the right-hand side may
contain `*`, `?`, or `[`, use `=` for a literal comparison.

```bash
# Bad — $expected is treated as a glob pattern
[[ "$actual" == "$expected" ]]

# Good — literal string comparison
[[ "$actual" = "$expected" ]]
```

## Validate input before using it in arithmetic

```bash
if [[ ! "$count" =~ ^[0-9]+$ ]]; then
  echo "Error: expected a number, got '$count'" >&2
  exit 1
fi
result=$((count + 1))
```

## Write files atomically

Don't edit a file in place if a crash mid-write would corrupt it. Write to a
temp file and rename — `mv` within the same filesystem is atomic.

```bash
tmp="${target}.tmp.$$"
process_data > "$tmp"
mv "$tmp" "$target"
```

## Send diagnostics to stderr and use clear exit codes

```bash
echo "Warning: config not found, using defaults" >&2   # not stdout
exit 0   # success    |    exit 1   # failure
```

This keeps stdout clean for data that other commands may consume, and lets
callers (and hooks) detect failures reliably.

## Prefer portable constructs

Avoid GNU-only flags (e.g. `sed -i` behaves differently on macOS). When in
doubt, use the temp-file-and-`mv` pattern above instead of in-place editing.
