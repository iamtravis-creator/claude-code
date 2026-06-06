# bash-safety

A Claude Code plugin that provides a skill with best practices for writing
safe, robust Bash scripts.

## What it does

The `bash-safety` skill is **auto-invoked** — Claude pulls it into context
automatically whenever you ask it to write or edit shell scripts, hook scripts,
or non-trivial bash commands. There is no command to remember.

It covers:

- Strict mode (`set -euo pipefail`)
- Quoting variable expansions to survive spaces and special characters
- Literal (`=`) vs. glob (`==`) string comparison inside `[[ ]]`
- Validating input before arithmetic
- Atomic file writes (temp file + `mv`)
- Sending diagnostics to stderr and using clear exit codes
- Portability across macOS and Linux

## Structure

```
bash-safety/
├── .claude-plugin/plugin.json      # plugin metadata
├── skills/
│   └── bash-safety/
│       └── SKILL.md                # the skill (frontmatter + guidance)
└── README.md
```

## How skills get invoked

Claude reads the `description` field in each skill's frontmatter to decide
whether the skill is relevant to the current task. When it matches, the body of
`SKILL.md` is injected into context. A precise, trigger-rich description is what
makes auto-invocation reliable.
