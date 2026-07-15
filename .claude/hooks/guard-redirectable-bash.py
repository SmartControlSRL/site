#!/usr/bin/env python3
"""PreToolUse guard for the Bash tool (local-only, gitignored).

Denies any Bash command whose *leading* token is a redirectable file/search
command (grep/egrep/fgrep/rg/find/cat/head/tail/sed/awk/ls/wc) or `cd`,
nudging toward the dedicated Grep/Read/Glob tools per CLAUDE.md's
"Tool discipline" rule. Pipelines like `git log | grep foo` still pass —
only the leading verb of the whole command string is checked.

See .claude memory note `project_tool_health_bash_guard` for the history:
added 2026-06-27 after a PRISM session-health audit graded tool_health F
(94% of Bash calls were grep/tail/head/sed/cat — a wrong-tool habit).

Recreated 2026-07-06 after the hook script went missing from a local,
gitignored path (settings.local.json still referenced it, blocking every
Bash call). Restoring the documented behavior, no config changed.
"""

from __future__ import annotations

import json
import re
import sys

_DENIED = {
    "grep",
    "egrep",
    "fgrep",
    "rg",
    "find",
    "cat",
    "head",
    "tail",
    "sed",
    "awk",
    "ls",
    "wc",
    "cd",
}


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return 0

    cmd = (payload.get("tool_input") or {}).get("command", "")
    if not cmd:
        return 0

    stripped = cmd.strip()
    match = re.match(r"[A-Za-z0-9_./-]+", stripped)
    if not match:
        return 0

    leading = match.group(0).rsplit("/", 1)[-1]
    if leading in _DENIED:
        print(
            f"BLOCKED by .claude guardrail: leading command {leading!r} is a "
            "redirectable file/search command — use the dedicated tool instead "
            "(Grep for grep/rg, Read for cat/head/tail, Glob for find/ls). "
            "See .claude/hooks/guard-redirectable-bash.py.",
            file=sys.stderr,
        )
        return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
