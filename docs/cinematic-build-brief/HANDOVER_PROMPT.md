# Handover prompt — reimagine the complete Smart Control website in a review PR

You are the senior product designer, frontend architect, and motion-systems
engineer responsible for this implementation. Work in the existing repository
and deliver a materially redesigned, production-quality pull request against
`main` with a working Vercel preview for owner review.

## Required outcome

Implement the full-site UI/UX reimagination specified in:

- `docs/cinematic-build-brief/PROJECT_BRIEF.md`

Redesign every public route and shared page family while preserving the reviewed
copy and recognizable Smart Control brand. This is **not** a StackTeardown
enhancement and not a request to add animation to the existing layouts.

The existing StackTeardown animation may be retained, replaced, or refined as
one homepage chapter. It is not the project scope or the primary acceptance
target. A homepage-only, single-section, or animation-only diff is incomplete.

The owner must be able to review the complete reimagination through the PR's
Vercel preview.

## Authority and stopping point

You are authorized to:

- inspect the repository and existing remote branch/PR state;
- create or continue the appropriate feature branch;
- refactor or replace presentational components, page layouts, CSS architecture,
  and motion code across `src/`;
- add reusable UI/scene components and focused design documentation;
- run local and preview validation;
- make logical commits, push the feature branch, and open or update a PR;
- wait for Vercel, inspect the final preview, and fix defects before handoff.

Do not merge the PR, deploy to production, change a production domain, or alter
production infrastructure. Stop only after the complete PR and final-HEAD
preview are ready for owner review, or after clearly reporting a genuine
external blocker such as unavailable GitHub authorization.

## Preflight — repository and existing PR

1. Inspect `git status`, current branch, remotes, recent history, and all existing
   user changes. Preserve untracked/user-authored files; never reset or clean
   them away.
2. Verify access early:

   ```bash
   git ls-remote origin
   gh auth status
   ```

3. Inspect whether the previous narrow implementation already has a branch or
   open PR, especially `feat/cinematic-stack-teardown`:

   ```bash
   gh pr list --state open --head feat/cinematic-stack-teardown
   ```

4. If that PR exists and is the owner's current review PR, continue on its branch
   and broaden/supersede the narrow implementation. Update its title, body, and
   preview. Do not open a duplicate PR merely to correct scope.
5. If the remote branch exists without a usable PR, inspect it before deciding
   whether to continue it or create `feat/cinematic-site-reimagination` from the
   latest `origin/main`.
6. If no previous work is reusable, fetch `origin` without disturbing the
   working tree and create `feat/cinematic-site-reimagination` from current
   `origin/main`.
7. Never use destructive Git commands, `git clean`, hard reset, or force-push.
8. If GitHub authentication is unavailable, continue safe local implementation,
   commits, and validation, but do not claim a PR or preview exists without real
   URLs. Report the external blocker exactly.

The user-authored files under `docs/cinematic-build-brief/` are part of the
project context. Preserve and include the current project brief in the PR.

## Read and inventory before editing

Read completely:

1. `docs/cinematic-build-brief/PROJECT_BRIEF.md`
2. root `CLAUDE.md`
3. `docs/build-specs/RESOLUTIONS.md`
4. `docs/build-specs/execution-qa.md`
5. `docs/SMC Web/ds/README.md`
6. `src/styles/global.css`
7. every file under `src/pages/**`, `src/components/**`, `src/layouts/**`, and
   `src/scripts/**`
8. `src/i18n/ui.ts`, `astro.config.mjs`, `vercel.json`, and the repository QA
   scripts

Treat current `src/` as the public-copy/disclosure source of truth. Older design
exports and briefs are references only where they do not conflict with current
copy, the project brief, or binding resolutions.

Before changing source files, produce a concise working plan containing:

- complete route and page-family inventory;
- current shared-component and lifecycle map;
- copy-lock baseline for both locales;
- proposed shared tokens, primitives, scene grammar, nav/footer, and route
  transition;
- component refactor/replacement map;
- page-family composition concepts;
- route-by-route motion map with one dominant idea per route;
- responsive, reduced-motion, no-JavaScript, and accessibility plan;
- performance risks and payload budget;
- expected files and logical commit phases.

Do not pause merely to request approval of that plan. Continue autonomously
unless a genuine conflict would materially change the owner's requested scope.

## Baseline evidence

Before editing, build the current site and capture uncommitted baseline evidence
for every unique page family at desktop and mobile widths. At minimum capture:

- Home
- Services hub
- Cloud
- Security
- Software
- Managed services
- Solutions hub
- SEKNET
- S-VPN
- Privacy
- 404

Use the baseline for direct before/after comparison. Never commit raw captures,
`dist/`, audit JSON, Playwright output, logs, or temporary artifacts. Deliver
curated visual evidence through PR-uploaded assets or CI artifacts when the
available client supports them. If neither mechanism is available, commit only
an optimized, review-specific evidence set under
`docs/cinematic-build-brief/review/` (WebP, sensible dimensions, descriptive
filenames, no sensitive data, and a total budget of 5 MB) and explain why in the
PR. Raw evidence stays outside the repository.

## Non-negotiable content and product rules

- This is a UI/UX redesign. Public copy is locked.
- Preserve reviewed RO/EN copy, facts, claims, CTA labels/destinations, mailto
  subjects, metadata, structured data, route mapping, anchors, and locale parity.
- Visual order, grouping, markup, and component boundaries may change when
  semantic meaning remains intact.
- UI-only accessibility/control labels may be added or corrected when necessary;
  localize and report them.
- Preserve exactly two products and four ISO certifications.
- Keep years computed from 2003.
- Do not restore removed stats, compliance pills, detailed product claims,
  throughput/tunnel counts, module specs, integrations, or fake operational data.
- No new content, claims, clients, routes, forms, phone, map, portal, e-commerce,
  CMS, blog, careers, analytics, or cookie banner.
- Keep obfuscated email behavior and page-specific CTA subjects.

## Brand and art-direction rules

- Implement the project brief's “The Control Plane” concept across the entire
  site.
- Preserve the logo, blue-led identity, Inter/JetBrains Mono, light-first rhythm,
  compliance-teal restriction, and AA-safe light-surface links.
- Keep nav and footer light.
- Keep dark zones limited to product-detail heroes, the homepage products world,
  and closing CTA bands.
- Current tokens and the 1180 px grid are a foundation. Controlled evolution of
  derived tints, spacing, type scale, grid proportions, radii, shadows, and
  composition is allowed when documented.
- Use code-native HTML/CSS/SVG architectural visuals. No photography, generated
  raster scenes, video, fake UI, full-page canvas, WebGL, particles, neon hacker
  aesthetics, grain, glassmorphism, or generic AI-SaaS decoration.
- Do not merely keep the current hero/card layouts and add reveals.

## Technical constraints

- Keep Astro static SSG and progressive enhancement.
- Add no dependency.
- Do not edit `package.json`, `package-lock.json`, `astro.config.mjs`,
  `tsconfig.json`, or `vercel.json`.
- Do not add GSAP, ScrollTrigger, Lenis, Three.js, WebGL frameworks, React,
  Svelte, Lottie, carousel packages, remote font/icon scripts, or smooth-scroll
  interception.
- Preserve `vercel.json`'s `X-Robots-Tag: noindex` preview protection.
- Reuse named tokens. Do not scatter hardcoded colors when a token exists.
- Prefer data-driven shared components over duplicated locale markup or motion
  logic.
- Content and navigation must remain visible and usable before JavaScript runs.

## Implementation phases

Use logical phases and commits so the large visual change stays reviewable.

### Phase 1 — foundations and shared shell

- Establish the full-site layout/scene primitives and any controlled token
  evolution.
- Materially redesign the fixed light nav, dropdown/route context, mobile menu,
  focus/hover states, and light footer while preserving all destinations/copy.
- Establish shared route-header, chapter, diagram-frame, routing/datum, proof,
  cross-sell, and CTA compositions.
- Implement a restrained native Astro route transition with correct focus,
  history, and reduced-motion behavior.
- Refactor the motion lifecycle so all scenes initialize on initial load and
  `astro:page-load`, and clean up listeners/observers/timers/frames on
  `astro:before-swap`.

### Phase 2 — Home

- Recompose the entire Home journey, not only StackTeardown.
- Create the assembled-system hero and hero-to-services signature chapter.
- Integrate the current service content and StackTeardown into one coherent
  architecture ending in a usable route atlas.
- Reimagine the dark products world, Cloud route, partners presentation, and CTA
  framing using current content.
- Preserve one long pinned Home chapter at most; the rest stays normal flow.

### Phase 3 — services family

- Redesign the Services hub as a system atlas.
- Redesign Cloud around its five-stage modernization corridor and capability
  outcome.
- Redesign Security around a restrained control-perimeter model.
- Redesign Software around a commit-to-operation delivery spine.
- Redesign Managed Services around a service-envelope/operating model.
- Use shared system rules without giving all five pages the same layout or
  animation.

### Phase 4 — solutions and products family

- Redesign the Solutions hub as a light dual-product bay.
- Redesign SEKNET's dark hero and light body around generic signal convergence.
- Redesign S-VPN's dark hero and light body around a secure access corridor.
- Recompose capabilities, contexts, associated services, audiences, cross-sells,
  and CTA frames using existing copy only.
- Make the two product pages related but visibly distinct.

### Phase 5 — privacy and 404

- Redesign both privacy routes as premium legal reading experiences with
  generated sticky TOC/current-section state, reading progress, accessible
  anchors, print-friendly typography, and restrained motion.
- Redesign 404 as a small light missing-route blueprint with current bilingual
  copy and recovery links.

### Phase 6 — full-system refinement

- Remove residual generic card-grid grammar where it undermines the new system.
- Ensure all locales/routes use the shared system without visual regressions.
- Tune responsive composition, motion, reduced motion, focus, contrast, payload,
  lifecycle cleanup, and route transitions.
- Compare every page family against its baseline. Fix any page that merely looks
  animated rather than redesigned.

Suggested logical commit subjects:

- `feat(ui): establish cinematic control-plane system`
- `feat(home): reimagine complete homepage journey`
- `feat(services): redesign service page family`
- `feat(products): redesign solutions and product pages`
- `feat(site): refine legal, error, responsive and accessibility UX`

A single squashed final commit is not required. Keep commits coherent and avoid
unrelated formatting churn.

## Motion and lifecycle quality

- Use four tiers only: route transition; Home/Cloud signature chapters; short
  route-specific explanatory states; micro-interactions.
- One dominant motion idea per route. Do not repeat a long pinned scene across
  every page.
- Derive progress locally from each scene, never global document scroll.
- Timelines are deterministic and reversible in both directions.
- Scroll/resize/pointer listeners request frames; rendering occurs through
  `requestAnimationFrame` and a small set of CSS custom properties.
- Cache geometry; do not alternate repeated layout reads/writes in the frame
  loop. Pause offscreen and while the document is hidden.
- At most one render loop per active scene.
- Prefer explicit transition properties over `transition: all` in touched code.
- Do not intercept wheel/touch scrolling or trap page scroll.
- Repeated View Transition navigation must not duplicate initialization.

## Responsive and reduced-motion requirements

- `>=1100px`: full architectural scenes. Long pinning is allowed only for Home's
  main chapter and Cloud's methodology.
- `768–1099px`: use stepped split layouts or short sticky artifacts rather than
  desktop pins.
- `<768px`: normal-flow composition, artifact above copy, 24 px gutters, no
  desktop crop, and no hover-dependent information.
- At 200% zoom or insufficient height, sticky layouts fall back safely.
- Reduced motion disables pinning, inertia, parallax, route sweeps, path drawing,
  auto-advance, and ambient loops while retaining polished static composition.
- No-JavaScript mode preserves every meaningful content item, route, and action.

## Accessibility and interaction

- Use native headings, lists, buttons, links, landmarks, and disclosures.
- Do not nest interactive controls or use dead card affordances.
- Decorative SVG is `aria-hidden`; copy remains semantic HTML.
- Preserve visible focus, logical tab order, correct disabled states, 44 px touch
  targets, keyboard operation, and route-transition focus restoration.
- No focus trap except the correctly managed mobile navigation while open; ESC
  closes it and focus returns to its trigger.
- Validate contrast, 200% zoom, keyboard-only use, touch, reduced motion,
  screen-reader reading meaning, and print behavior for privacy.

## Copy-lock verification

Compare every route against `origin/main`. Markup and component boundaries may
change; public strings may not.

Verify all:

- headings, paragraphs, labels, chips, notes, lists, and link text;
- CTAs, mailto subjects, routes, anchors, canonical/hreflang, metadata, and
  structured data;
- product disclosure level and ISO count;
- RO/EN equivalence;
- UI-only accessibility labels added by the redesign.

Any unavoidable accessibility-only string adjustment must be localized and
called out explicitly in the PR.

## Local validation

Use Node 22+. Install with `npm ci` only when dependencies are unavailable.

Run at minimum:

```bash
npm run check
npm run build
node scripts/check-links.mjs
node scripts/overlap-check.mjs --dir dist --width 390
node scripts/audit.mjs --dir dist --out /tmp/smc-cinematic-audit.json
```

Where Playwright is available, capture after screenshots for every page family
at `1280`, `768`, and `390`, plus focused `1440×900` and `1280×720` inspection of
Home and Cloud:

```bash
node scripts/screenshot.mjs --dir dist --routes "/,/servicii/,/servicii/cloud/,/servicii/securitate/,/servicii/software/,/servicii/managed/,/solutii/,/solutii/seknet/,/solutii/s-vpn/,/confidentialitate/,/en/,/en/servicii/,/en/servicii/cloud/,/en/servicii/securitate/,/en/servicii/software/,/en/servicii/managed/,/en/solutii/,/en/solutii/seknet/,/en/solutii/s-vpn/,/en/privacy/,/404.html" --out /tmp/smc-cinematic-after --widths 1280,768,390
```

Do not commit generated evidence. If Playwright cannot run locally, report the
exact limitation and perform equivalent browser inspection on the Vercel
preview.

### Manual route matrix

Inspect every generated route at least once. Perform deeper review on both
locales for:

- Home
- Services hub
- Cloud, Security, Software, and Managed Services individually
- Solutions hub
- SEKNET and S-VPN
- Privacy
- 404

Test at `1440×900`, `1280×720`, `1024×768`, `768×1024`, and `390×844`, plus
reduced motion and 200% zoom.

Verify:

- deliberate composition before any animation runs;
- forward and reverse scroll through signature chapters;
- direct load and refresh at top/middle/end scene positions;
- resize/orientation across the `1100px` mode boundary;
- navigation away/back through Astro View Transitions;
- mouse, touch/swipe, keyboard, focus order, and mobile menu;
- no empty edges, cropping, text collisions, clipped focus, trapped scroll,
  overflow, layout jumps, or stale scene state;
- no new console/network errors;
- no disruptive CLS and proportionate transfer/JS growth.

Fix all in-scope defects before handoff. Do not relabel fixable visual defects as
“known limitations.”

## PR and Vercel workflow

1. Review the complete diff against `origin/main` for scope, copy, secrets,
   generated files, dependency churn, and unintended content changes.
2. Confirm the diff materially changes shared chrome and every page family. A
   diff centred on `StackTeardown.astro` or `motion.js` fails.
3. Commit logical changes and push without force.
4. Open or update the PR against `main`. Suggested title:
   `Cinematic full-site UI/UX reimagination`.
5. Do not merge.
6. Wait for PR checks and the existing Vercel Git integration.
7. Confirm the preview deployment is built from the PR's final HEAD commit and
   obtain its exact URL.
8. Verify `X-Robots-Tag: noindex` on the preview.
9. Inspect all 21 generated routes on the actual preview, including every RO/EN
   service detail and `/404.html`. Repeat deeper Home/Cloud motion, mobile,
   reduced-motion, navigation, and console checks there.
10. Fix preview-only defects, push, wait for the new final-HEAD deployment, and
    recheck it.

If Vercel integration or permissions are missing, do not edit `vercel.json`,
link another project, use production credentials, or deploy manually. Report the
external blocker truthfully.

## PR description requirements

Include:

- full-site outcome and concept summary;
- explicit statement that the previous narrow animation scope was superseded;
- shared UI/design-system changes;
- page-family composition map;
- route-by-route motion map;
- responsive and reduced-motion behavior;
- accessibility/keyboard/no-JS behavior;
- copy-lock and locale-parity result;
- validation command table with truthful pass/fail/not-run status;
- payload/JS delta;
- files changed and commit structure;
- before/after desktop/mobile evidence for every page family;
- short recordings of Home and Cloud motion when tooling permits;
- final commit SHA;
- final-HEAD Vercel preview URL;
- true limitations or external blockers only.

Use a visible checklist. Do not claim a browser, viewport, assistive mode, or
script was tested when it was not.

## Final handoff

Return:

1. PR URL.
2. Final-HEAD Vercel preview URL.
3. Branch name and commit SHA(s).
4. Full-site implementation summary.
5. Page-family redesign summary.
6. Validation and visual-review results.
7. Copy-lock and RO/EN parity confirmation.
8. Payload/performance result.
9. Any true external blocker or remaining limitation.

The task is complete only when the full-site redesign is present across all 21
routes, the PR is open or updated, the final preview is reachable and inspected,
and the work is ready for owner review. Do not merge it.
