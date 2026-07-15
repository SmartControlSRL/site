#!/bin/bash
# PreToolUse guardrail for Bash. Blocks destructive box ops (exit 2 = block).
# Adapted from periscop's .claude/hooks/block-destructive.sh (2026-07-13):
# `gh pr merge` is gated by a ship marker (2026-07-15): allowed only while
# .claude/.ship-active exists and is <3h old — the /work-issue* skills raise it
# right before merging and clear it right after. Tag pushes / releases stay
# blocked unconditionally (releases are manual on site).
input=$(cat)
cmd=$(printf '%s' "$input" | python3 -c 'import sys,json
try:
    print(json.load(sys.stdin).get("tool_input",{}).get("command",""))
except Exception:
    print("")' 2>/dev/null)
[ -z "$cmd" ] && exit 0
low=$(printf '%s' "$cmd" | tr "A-Z" "a-z")
block(){ echo "BLOCKED by .claude guardrail: $1 (see .claude/hooks/block-destructive.sh)" >&2; exit 2; }

if [[ "$cmd" =~ (^|[^[:alnum:]_])sudo([[:space:]]|$) ]]; then block "sudo not allowed"; fi
if [[ "$cmd" =~ (^|[^[:alnum:]_])rm[[:space:]]+-[a-zA-Z]*r[a-zA-Z]*f ]]; then block "rm -rf"; fi
if [[ "$cmd" =~ docker[[:space:]]+(restart|prune)|docker[[:space:]]+system[[:space:]]+prune|docker[[:space:]]+compose[[:space:]]+(up|down) ]]; then block "destructive docker op"; fi
if [[ "$cmd" =~ (^|[^[:alnum:]_])colima([[:space:]]|$) ]]; then block "colima control"; fi

# git push: block pushing tags, and pushing to main/master (any refspec form)
if [[ "$cmd" =~ git[[:space:]]+push ]]; then
  if [[ "$cmd" =~ (--tags|--follow-tags|refs/tags/|[[:space:]]v[0-9]+\.[0-9]+\.[0-9]+) ]]; then block "push tags"; fi
  if [[ "$cmd" =~ [[:space:]:](main|master)([[:space:]]|$) ]]; then block "push to main/master"; fi
fi

# gh pr merge: allowed only while a fresh ship marker exists (<3h)
if [[ "$cmd" =~ gh[[:space:]]+pr[[:space:]]+merge ]]; then
  marker="${CLAUDE_PROJECT_DIR:-$PWD}/.claude/.ship-active"
  age=$(( $(date +%s) - $(stat -f %m "$marker" 2>/dev/null || echo 0) ))
  if [ -f "$marker" ] && [ "$age" -lt 10800 ]; then :
  else block "pr merge (raise .claude/.ship-active first)"; fi
fi
if [[ "$cmd" =~ gh[[:space:]]+release[[:space:]]+create ]]; then block "gh release create (releases are tag-driven)"; fi

# mutating SQL against prod: case-insensitive; also block -f script files via psql
if [[ "$low" =~ (psql|pg_dump|pg_restore|docker[[:space:]]+exec.*psql) ]]; then
  if [[ "$low" =~ (drop[[:space:]]|truncate[[:space:]]|delete[[:space:]]+from|update[[:space:]].*[[:space:]]set|insert[[:space:]]+into) ]] || [[ "$low" =~ psql[^|]*[[:space:]]-f[[:space:]] ]]; then
    block "mutating SQL / -f script against prod (read-only only)"
  fi
fi
exit 0
