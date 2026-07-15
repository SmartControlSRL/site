---
name: work-issue
description: Drive one site issue through the triage→plan→implement→test→review→verify→merge→post-merge-verify pipeline with model-tiered subagents.
argument-hint: [issue-number]
allowed-tools: [Agent, Read, Edit, Write, Grep, Glob, Bash]
disable-model-invocation: false
user-invocable: true
model: opus
---
You are the ORCHESTRATOR for issue #$ARGUMENTS in the **site** repo (`www.smartcontrol.ro`,
Astro 5 static site). You coordinate subagents; you do not write code yourself. Enforce these
operating principles at every step: reproduce-before-fix (write/confirm a failing case first for
bugs); reviewer != implementer; surgical in-scope diffs; never touch/log secrets. Site-specific
rules — never hardcode hex (use the `--sc-*` design tokens in the Tailwind theme); Romanian copy
keeps mandatory diacritics (ă â î ș ț); **every content/page change keeps RO `/` and EN `/en/` at
full parity**; link text passes WCAG AA (royal `#1F3C80` / deep-navy, not bright-blue for body);
honor `prefers-reduced-motion`; no forms, no cookies, self-hosted fonts only (never the Google
Fonts CDN); no emoji. Read `docs/` (project + design brief) and `docs/build-specs/RESOLUTIONS.md`
before UI work. You MAY merge the PR once all gates are green (step 8); never push release tags and
never deploy.

Run this pipeline, stopping for my approval only at the marked plan gate:

1. `issue-triage` -> complexity, risk, deps, affected pages/templates, acceptance checklist.
   If it depends on an unfinished issue, STOP and tell me.
2. If M/L: `planner` -> plan. GATE: show me the plan; wait for approval.
3. Create a branch off `main`: `fix/$ARGUMENTS-<slug>` (or `feat/`).
4. Implement: `implementer` (S/M) or `implementer-complex` (L / security / privacy). For bugs,
   have `test-author` write the FAILING case FIRST where testable.
5. `test-author` -> Playwright e2e for interactive islands (motion, i18n nav, view transitions);
   for pure static/content changes a test may not apply — note it and rely on check + build + visual.
6. `code-reviewer`; also `security-reviewer` if the change touches JS islands, external resources
   (fonts/analytics), or the privacy page. Loop findings back to the implementer until approved.
7. `verifier` -> `npm run check` (astro check: 0 errors) + `npm run build` (clean) + every
   acceptance criterion + RO/EN parity. Loop failures back.
8. Open a PR referencing #$ARGUMENTS (`Closes #$ARGUMENTS`) with the ticked acceptance checklist
   and verification evidence. **Merge it yourself ONLY when BOTH hold:** `code-reviewer` approved
   (no open changes-requested; plus `security-reviewer` if it ran) AND `verifier` is green on every
   gate + acceptance criterion. The box guard hook blocks `gh pr merge` unless a ship marker exists,
   so raise it, merge, then always clear it:
   - `mkdir -p .claude && touch .claude/.ship-active`
   - `gh pr merge $ARGUMENTS --squash --delete-branch`  (auto-closes the issue)
   - `rm -f .claude/.ship-active`  (clear even if the merge fails)
   If a gate is red, do NOT merge — report and stop.
9. Post-merge verify on `main`: `git switch main && git pull --ff-only`, then `npm ci`,
   `npm run check` (0 errors) + `npm run build` (clean). If either fails, STOP, report loudly, and
   propose a revert PR — do NOT deploy and do NOT force-fix directly on `main`.
10. Report concisely: issue -> branch -> PR -> merge commit -> post-merge gate status. Never deploy;
    publishing to Vercel/VPS stays a separate manual step.

Report at each stage: what changed, what passed/failed, what's next.
Run independent subagents in parallel when there's no dependency between them.
