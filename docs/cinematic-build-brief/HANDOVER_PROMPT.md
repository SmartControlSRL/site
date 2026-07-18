# Handover prompt — implement the cinematic Stack Teardown in a review PR

You are the senior frontend and motion-systems engineer responsible for this
implementation. Work in the existing repository and deliver a focused pull
request against `main` with a working Vercel preview for owner review.

## Required outcome

Implement the homepage cinematic UI/UX described in:

- `docs/cinematic-build-brief/PROJECT_BRIEF.md`

The result is a homepage-only, scroll-driven cinematic chapter centred on the
existing `StackTeardown` section. It must preserve the current Smart Control
brand and all reviewed Romanian and English copy. The owner will review the
result through the PR's Vercel preview.

You are authorized to:

- create a feature branch;
- edit the in-scope repository files;
- add focused implementation documentation when useful;
- run the full local validation suite;
- make logical commits;
- push the feature branch to `origin`;
- open a pull request against `main`;
- wait for and inspect PR checks and the Vercel preview;
- update the branch and PR to fix defects found during verification.

Do **not** merge the PR, deploy to production, point a production domain at
Vercel, or change production infrastructure. Stop after the reviewable PR and
preview are complete.

## Read before editing

Read these files completely and resolve them in this order:

1. Current implementation under `src/` — source of truth for approved public
   copy, disclosure level, and the current visual direction.
2. `docs/cinematic-build-brief/PROJECT_BRIEF.md` — implementation scope,
   cinematic scene contract, copy lock, timeline, responsive behavior, and
   acceptance criteria.
3. Root `CLAUDE.md` — repository, product, brand, legal, and safety rules.
4. `docs/build-specs/RESOLUTIONS.md` — binding technical and content rulings.
5. `docs/build-specs/execution-qa.md` — motion and render-correctness checks.
6. `docs/SMC Web/ds/README.md` and `src/styles/global.css` — current brand
   foundations and implemented tokens.
7. `src/components/StackTeardown.astro`, `src/scripts/motion.js`,
   `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, and
   `src/pages/en/index.astro` — current behavior and integration points.

Older design documents contain motion effects and public claims that were
deliberately removed. Do not restore node graphs, radial glow, parallax drift,
word-fill animation, removed stats, compliance pills, detailed product specs,
or generic AI-SaaS decoration.

## Non-negotiable product constraints

- This is a UI/UX and motion task. **Do not change any reviewed copy.**
- Preserve current RO/EN strings, metadata, labels, chips, links, CTA wording,
  mailto subjects, aria-labels, reading order, and route parity.
- Preserve exactly two products and four ISO certifications.
- Keep the fixed nav and footer light. Do not add a dark homepage hero or a new
  dark section.
- Keep the existing products band and closing CTA unchanged except for any
  strictly necessary, invisible integration fix.
- Preserve the current palette, Inter/JetBrains Mono typography, 1180 px grid,
  breakpoint system, logo treatment, and blueprint-ruling motif.
- Use code-native HTML/CSS/SVG and the existing inline layer diagrams. Do not
  generate or add photography, raster scenes, video, fake screenshots, or a
  full-page canvas.
- Add no dependency. Do not add GSAP, ScrollTrigger, Lenis, Three.js, WebGL,
  React, Svelte, Lottie, or a carousel library.
- Do not modify `package.json`, `package-lock.json`, `astro.config.mjs`,
  `tsconfig.json`, or `vercel.json`.
- Preserve `vercel.json`'s `X-Robots-Tag: noindex` preview protection.
- No forms, phone, map, analytics, cookie banner, client names, or invented
  claims.

## Git and branch workflow

1. Inspect `git status`, the active branch, remotes, and recent history before
   editing. Existing changes and untracked files belong to the user; preserve
   them.
2. Check repository access early with `git ls-remote origin` and, when using the
   GitHub CLI, `gh auth status`. Do not assume push/PR access works. If
   authentication is unavailable, continue safe local implementation and
   validation, but report that PR and Vercel-preview delivery remain externally
   blocked; never claim either without its real URL.
3. Fetch `origin` without changing the working tree.
4. Create a new branch from current `origin/main`, preferably:
   `feat/cinematic-stack-teardown`. If it already exists, use a clear unique
   suffix. Never overwrite or delete an existing branch.
5. Do not use destructive Git commands, `git clean`, hard reset, or force-push.
6. Keep the diff focused. Do not reformat unrelated files or include generated
   `dist/`, `.astro/`, screenshots, audit output/JSON, logs, or temporary
   artifacts in commits.
7. Use one or more logical commits. Suggested final commit subject:
   `feat(home): add cinematic stack teardown`.

The existing `docs/cinematic-build-brief/PROJECT_BRIEF.md` is user-authored
project documentation. Preserve it and include it in the PR if it is currently
untracked. This handover file may also be included for traceability, but it must
not substitute for implementation documentation in the PR body.

## Plan before implementation

Before changing source files, produce a concise internal plan containing:

- current component and event-lifecycle map;
- five-beat scene/timeline map;
- DOM/SVG layer map (`00` through `50` from the brief);
- files expected to change;
- desktop, tablet/mobile, reduced-motion, and no-JavaScript behavior;
- likely performance and accessibility risks.

Where browser tooling is available, capture an uncommitted baseline of `/` and
`/en/` at desktop and mobile widths before editing. Use it for direct before /
after comparison; do not rely on memory of the current design.

Do not pause for approval unless you find a real conflict that materially
changes scope. Otherwise make the safest in-scope decision, implement it, and
document the decision in the PR.

## Implementation expectations

### Architecture

- Use progressive enhancement. All content and links must be present, readable,
  and correctly ordered in server-rendered HTML before JavaScript runs.
- Scope scroll progress to the cinematic section; never derive it from global
  page progress.
- Use a deterministic, reversible timeline with readable scene constants and
  small helpers such as `clamp`, `lerp`, `smoothstep`, and segmented progress.
- Event listeners should only request a render. Render through
  `requestAnimationFrame`, write a small set of CSS custom properties, and let
  CSS own final transforms and opacity.
- Cache stable geometry and remeasure on resize. Do not repeatedly force layout
  in the frame loop. Stop frames when values converge or the section is
  offscreen.
- Prefer explicit transition properties over `transition: all` in touched code.
- Keep the implementation local and understandable; do not build a generic
  animation framework.

### Astro lifecycle

- Refactor the current component-local StackTeardown behavior as needed so all
  listeners, timers, observers, and animation frames have explicit cleanup.
- Initialize reliably on initial load and `astro:page-load`.
- Tear down on `astro:before-swap`.
- Repeated navigation away from and back to `/` or `/en/` must not duplicate
  listeners, intervals, observers, or animation loops.
- The current 3.2-second ambient cycle must not compete with scroll control.
  Disable it in desktop cinematic mode. Retain appropriate direct interaction
  in the final state and compact fallback.

### Desktop cinematic mode

- Activate the sticky cinematic chapter at `>=1100px` only.
- Use `100svh`/`100dvh`-aware sizing with a robust fallback and account for the
  fixed light nav.
- Follow the brief's five beats and checkpoint targets:
  `0.00`, `0.18`, `0.27`, `0.44`, `0.58`, `0.74`, `0.90`, and `1.00`.
- Keep the stack anchored. Use restrained scale, plate separation, connector
  progress, opacity, and small translation—no large fly-ins, blur, bounce,
  particle field, or decorative continuous loop.
- Reverse scroll must reverse every visual state smoothly and deterministically.
- The final four-item rail is finite, not infinite. It requires semantic
  previous/next controls, correct disabled states, visible position feedback,
  keyboard support, touch/swipe support, and real destination links.
- Continued scrolling must unpin cleanly into the existing products band with no
  jump, blank frame, overlapping section, or trapped scroll.

### Tablet, mobile, reduced motion, and no JavaScript

- Below `1100px`, do not use the long pinned experience. Present the same copy,
  diagrams, chips, and links in readable normal flow using the compact
  interactive stack/accordion described in the brief.
- At `390px`, preserve 24 px gutters, avoid scaled text, and prevent document
  overflow, clipped controls, or overlapping cards.
- For `prefers-reduced-motion: reduce`, disable pinning, automatic cycling,
  inertial smoothing, connector drawing, pointer effects, and large transforms.
  Keep a complete static composition and every interaction/content destination.
- With JavaScript unavailable or initialization failing, meaningful content must
  remain visible and navigable.

### Semantics and interaction

- Prefer native buttons and links over `div role="button"` when refactoring.
- Do not nest interactive elements. If a layer selector reveals a real link,
  keep the selector and link as distinct valid controls.
- Preserve focus visibly. Ensure hidden/collapsed content is removed from tab
  order and restored correctly when active.
- Support keyboard operation without trapping focus or scroll.
- Mark decorative SVG geometry `aria-hidden`; communicate the layer model with
  semantic headings/lists and existing copy.
- Verify browser zoom at 200%.

## Copy-lock verification

Before committing, compare the rendered/public strings on `/` and `/en/`
against the base branch. Markup may change, but text content must not.

At minimum verify that there are no unintended changes to:

- headings, paragraphs, layer titles/descriptions, chips, notes, and link labels;
- CTA labels and obfuscated mailto subjects;
- metadata and structured data;
- aria-labels and language parity.

Report any unavoidable accessibility-only string change explicitly; do not make
one silently.

## Required local validation

Use Node 22+. Install with `npm ci` only if dependencies are not already
available. Before pushing, run:

```bash
npm run check
npm run build
node scripts/check-links.mjs
```

Where the environment supports Playwright browsers, also run focused visual and
runtime checks for `/` and `/en/`:

```bash
node scripts/screenshot.mjs --dir dist --routes "/,/en/" --out /tmp/smc-cinematic-shots --widths 1280,768,390
node scripts/overlap-check.mjs --dir dist --routes "/,/en/" --width 390
node scripts/audit.mjs --dir dist --routes "/,/en/" --out /tmp/smc-cinematic-audit.json
```

Do not commit `/tmp` output or generated reports. If the environment cannot run
Playwright, report the exact blocker and complete equivalent browser inspection
on the Vercel preview.

### Manual visual/runtime matrix

Inspect both `/` and `/en/` at minimum at:

- `1440×900` and `1280×720` — full cinematic mode;
- `1024×768` and `768×1024` — normal-flow tablet mode;
- `390×844` — mobile mode;
- desktop and mobile with reduced motion;
- 200% browser zoom.

Verify:

- every timeline checkpoint in both scroll directions;
- refresh at the top, middle, and final state of the cinematic chapter;
- resize across the `1100px` mode boundary;
- touch/swipe, mouse, keyboard, and focus order;
- no transparent holes, empty edges, text collisions, clipped focus rings,
  layout jumps, or horizontal document overflow;
- no duplicate initialization after View Transition navigation;
- no console errors or warnings attributable to the change;
- payload remains inside the budget in the project brief.

Fix defects before opening the PR. Do not describe known, fixable visual defects
as limitations.

## Pull request and Vercel preview

After local validation:

1. Review `git diff` carefully for scope, copy, generated files, and secrets.
2. Commit the focused changes and push the feature branch to `origin` without a
   force push.
3. Open a PR against `main`. Suggested title:
   `Cinematic Stack Teardown homepage experience`.
4. Do not merge it.
5. Wait for PR checks and the existing Vercel Git integration. Confirm the
   preview deployment succeeds and obtain its exact URL from the deployment
   check/comment.
6. Confirm the deployment is for the PR's final HEAD commit, not an earlier
   preview, then open it and repeat the focused `/` and `/en/` smoke tests.
   Verify the preview response retains `X-Robots-Tag: noindex`.
7. If the Vercel integration is missing or cannot create a preview, do not alter
   `vercel.json`, connect a production domain, or deploy production manually.
   Report the external blocker clearly in the PR and final handoff.

The PR description must contain:

- summary of the UI/UX outcome;
- scope and non-goals;
- scene/timeline map;
- responsive and reduced-motion behavior;
- accessibility and keyboard behavior;
- copy-lock verification result;
- performance/payload result;
- exact commands run and results;
- manual viewport matrix completed;
- files changed;
- Vercel preview URL;
- screenshots or review notes for desktop and mobile when the tooling permits;
- known limitations or external blockers, if any.

Use a checklist so incomplete verification is visible. Do not claim a test was
performed when it was not.

## Final handoff

Return to the owner with:

1. PR URL.
2. Vercel preview URL.
3. Branch name and commit SHA(s).
4. Concise implementation summary.
5. Validation and manual-review results.
6. Copy-lock confirmation.
7. Any true remaining limitation or external blocker.

The task is complete only when the PR is open, the preview is reachable, the
cinematic behavior has been checked on the preview, and the PR is ready for
owner review. Do not merge it.
