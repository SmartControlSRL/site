---
name: work-issues
description: Run several site issues through the work-issue pipeline as a batch — dependency-orders them, then processes sequentially (default) or in parallel via worktrees, merging each once its gates are green.
argument-hint: [issues e.g. "12 13 15" or "12-18" or "12-15 20"] [--parallel]
allowed-tools: [Agent, Read, Edit, Write, Grep, Glob, Bash]
disable-model-invocation: true
user-invocable: true
model: opus
---
You are the BATCH ORCHESTRATOR for the **site** repo (`www.smartcontrol.ro`). Input ($ARGUMENTS)
is a set of issue numbers and an optional `--parallel` flag.

## 1. Parse the selection
- Expand ranges: `12-18` -> 12,13,...,18. Accept space/comma-separated lists and a leading `#`.
  Dedupe. Detect the `--parallel` flag (default is sequential).
- If the selection is empty or malformed, STOP and ask.

## 2. Triage the whole batch first
- Run `issue-triage` on each issue (independent — run them in PARALLEL).
- From each issue's body + triage, extract dependencies: explicit "depends on #N",
  "Part of epic #N", "do #N before", and known ordering (e.g. shared component / design-token
  changes before the pages that consume them). Build a dependency graph over the selected issues.

## 3. Order + plan
- Topologically sort the batch so prerequisites run before dependents. Security / privacy-tagged
  issues sort first within their dependency tier.
- If an issue depends on something NOT in the batch and not yet merged, FLAG it: offer to add the
  prerequisite or skip the dependent.
- GATE: present the ordered run plan — per issue: number, title, complexity S/M/L, risk tags,
  affected pages, parallel or serialized. Wait for my approval.

## 4. Execute — run the `/work-issue` pipeline for each issue
For every issue, run the standard pipeline (triage already done): plan (M/L, with its own approval
gate) -> branch off `main` `fix/<n>-slug` -> implement (`implementer` or `implementer-complex`)
with a FAILING case first for bugs -> `test-author` (Playwright e2e where interactive) ->
`code-reviewer` (+ `security-reviewer` for JS islands / external resources / privacy page) ->
`verifier` (`npm run check` 0 errors + `npm run build` clean + acceptance + RO/EN parity) -> open a
PR referencing the issue -> confirm the PR checks (incl. Vercel preview build) green via the
bounded foreground gate from `/work-issue` step 8 (`timeout 900 gh pr checks <pr> --watch
--interval 30 --fail-fast`; re-issue on exit 124/early tool kill, budget 4 calls; NEVER a
backgrounded watcher — its handle is dropped at a compaction/resume boundary and the session hangs
forever) -> **merge it once the checks gate is green AND code-reviewer approved AND verifier
green**, via the ship marker: `mkdir -p .claude && touch .claude/.ship-active` -> `gh pr merge <n> --squash
--delete-branch` -> `rm -f .claude/.ship-active` (always clear). Then post-merge verify on `main`
(`git switch main && git pull --ff-only && npm ci && npm run check && npm run build`). Never push
release tags, never deploy.

### Sequential (default)
- Process issues one at a time in dependency order: implement → gates → merge → post-merge verify,
  then move on. Stop the batch if an issue fails its gates and can't be fixed in a couple of review
  loops, or if post-merge verify on `main` fails — report and ask.

### Parallel (`--parallel`)
- For issues with NO unmet dependency, create an isolated **git worktree** per issue
  (`git worktree add ../site-wt-<n> -b fix/<n>-slug`) and run their implement/review/verify phases
  concurrently. Cap concurrency at 3. Each worktree builds in isolation, so parallel `astro check` /
  `build` is safe.
- **Serialize the merge step even in parallel mode** — merge and post-merge-verify ONE PR at a time
  so `main` advances cleanly; after each merge, rebase/retarget the remaining open PRs on the new
  `main` and re-run their `verifier` before merging.
- Watch for edit collisions on shared files (design tokens `app/globals.css`, Nav/Footer layout,
  i18n dictionaries) — if two batched issues touch the same shared file, serialize them.
- Clean up worktrees (`git worktree remove`) once each issue's PR is merged.

## 5. Report
- A batch summary table: issue -> branch/PR -> merge commit -> post-merge gate status.
- List anything skipped/blocked and why. Publishing to Vercel/VPS stays a separate manual step.

Enforce the same operating principles as `/work-issue` throughout: reproduce-before-fix,
reviewer != implementer, surgical in-scope diffs, no secrets, design tokens (no hardcoded hex),
RO diacritics + RO/EN parity, WCAG AA link text, `prefers-reduced-motion`, no forms / cookies.
