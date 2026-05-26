#!/usr/bin/env bash

cat << 'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "## Repository: iamtravis-creator/claude-code\n\nThis is the **Claude Code plugin collection** repository — not a single Node.js package. Key facts:\n\n### Structure\n- `plugins/` — individual Claude Code plugins (each is self-contained with its own `.claude-plugin/plugin.json`, `commands/`, `hooks/`, `skills/`)\n- `examples/` — example hooks, settings, and MDM configs (`examples/hooks/`, `examples/settings/`, `examples/mdm/`)\n- `scripts/` — TypeScript utility scripts for GitHub automation (issue lifecycle, sweep, auto-close, etc.)\n- `.claude/commands/` — project-level slash commands (commit-push-pr, dedupe, triage-issue)\n- `cleaner-scheduler/` — Python CLI that generates cleaning work schedules via the Claude API\n\n### No root package.json\nThere is no root-level `package.json` or unified test/lint runner. TypeScript scripts in `scripts/` are standalone.\n\n### Active Development Branch\nAll changes must be developed and pushed to: `claude/repository-connection-YTdeH`\n\n### Plugin Development\nWhen creating or modifying plugins, follow the structure in `plugins/plugin-dev/skills/` for guidance on hooks, skills, and plugin schemas."
  }
}
EOF

exit 0
