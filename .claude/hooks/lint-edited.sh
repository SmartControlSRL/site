#!/bin/bash
# PostToolUse (Edit|Write): best-effort prettier auto-fix on the edited file.
# Non-blocking — always exits 0; a lint hiccup must never wedge an agent.
# Adapted from periscop's ruff/Python version (2026-07-13): site is an
# Astro/TypeScript repo (see package.json), so this runs the repo-local
# prettier binary instead.
input=$(cat)
f=$(printf '%s' "$input" | python3 -c 'import sys,json
try: print(json.load(sys.stdin).get("tool_input",{}).get("file_path",""))
except Exception: print("")' 2>/dev/null)
[ -z "$f" ] && exit 0
case "$f" in
  *.ts|*.tsx|*.js|*.jsx|*.astro|*.json|*.css|*.md)
    bin="$CLAUDE_PROJECT_DIR/node_modules/.bin/prettier"
    [ -x "$bin" ] && "$bin" --write "$f" >/dev/null 2>&1 || true
    ;;
esac
exit 0
