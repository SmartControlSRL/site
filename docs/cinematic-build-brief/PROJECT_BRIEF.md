# Smart Control — Cinematic Website Project Brief

> Project-specific brief adapted from the MIT-licensed
> [Cinematic Scroll Prompt Kit project brief](https://github.com/amirmushichge/cinematic-scroll-prompt-kit/blob/main/examples/PROJECT_BRIEF.example.md).
> Use this file with the kit's stable
> [`PROMPT.txt`](https://github.com/amirmushichge/cinematic-scroll-prompt-kit/blob/main/PROMPT.txt)
> implementation contract.
>
> **Scope assumption:** create one homepage-only cinematic signature chapter,
> centred on the existing `StackTeardown` section. Preserve the normal document
> flow, all interior routes, the existing products band, Cloud teaser, partner
> marquee, closing CTA, and footer. Do not turn every page into a pinned
> microsite.

## Agent mandate

Inspect the repository, current homepage, current Git history, and the references
listed below before changing files. Treat the current `src/` implementation as
the visual and public-copy source of truth. Some older design/build documents
describe motion, claims, and components that were deliberately removed; do not
restore them by accident.

The existing Romanian and English copy has already been reviewed and approved.
Treat every visible string as locked. This is a UI/UX and motion task, not a
copywriting task.

First return a concise scene map, layer map, responsive plan, and list of files
you expect to change. Then implement the approved experience, run it, inspect
every timeline checkpoint in both scroll directions, fix visible defects, and
report verification results.

## Project

- Project name: `Smart Control — One accountable technology stack`
- Subject, destination, or brand: `Smart Control SRL, a Romanian enterprise IT services, cloud, networking, cybersecurity, software, and managed-services company founded in 2003`
- Audience: `CIOs, CISOs, CTOs, IT directors, infrastructure leaders, procurement stakeholders, and regulated-enterprise buyers in Romania and international markets`
- Existing repository or project path: `/Users/claude/code/site`
- Existing stack: `Astro 5.18 static SSG, Tailwind CSS 4.1 via Vite, TypeScript, Astro View Transitions, static @lucide/astro icons, self-hosted Inter Variable and JetBrains Mono Variable, and a small vanilla-JavaScript motion layer in src/scripts/motion.js`
- Required launch or delivery date: `Not specified; deliver as a production-ready, reviewable iteration without weakening the acceptance criteria`
- Implementation scope: `Romanian and English homepages only (/ and /en/), plus the smallest shared-component or motion changes required. Preserve all other routes, page templates, content order, and approved copy.`

## Goal

Primary message: `Use the existing page promise “Infrastructură. Securitate. Software. Execuție 100% in-house.” and the existing StackTeardown heading “Un singur partener, unic responsabil.” verbatim. Do not add a new proposition, tagline, proof point, or explanatory sentence.`

Desired user response: `Understand how the four operational layers connect, trust Smart Control as an accountable delivery partner, and choose the relevant service route. The experience should make technical breadth easier to grasp, not merely make the page more animated.`

Final interaction or CTA: `An accessible four-item service rail built from the existing StackTeardown data, with real links to the existing service pages. Do not add a competing conversion CTA inside the chapter: the fixed nav and existing closing CtaBand retain the primary “Solicită assessment” mailto action with subject “Evaluare gratuită”.`

## Copy lock — non-negotiable

- Reuse the current strings from `src/pages/index.astro`,
  `src/pages/en/index.astro`, and `src/i18n/ui.ts` verbatim.
- Do not rewrite, shorten, expand, translate, merge, split semantically, or
  invent headings, paragraphs, labels, chips, CTAs, aria-labels, metadata, or
  claims.
- Copy may be wrapped in semantic spans or moved between visual containers only
  when its text content, reading order, meaning, and localized parity remain
  unchanged.
- Do not remove copy to make the cinematic layout easier. Adapt the layout to
  the approved content.
- Avoid duplicate visible or assistive-technology copy when the sticky and
  normal-flow states share content.
- Review the implementation with a string diff. Any changed public string is a
  defect unless required for a purely technical accessibility fix and explicitly
  reported.

## Visual direction

- Overall style: `Precision-engineering editorial design expressed as a code-native 2.5D infrastructure cutaway. Evolve the existing exploded StackTeardown plates, blueprint ruling, mono layer codes, hard-edged geometry, and restrained white cards. The result should feel specific to an enterprise delivery architecture—not like an AI-SaaS landing page, game HUD, or sci-fi control room.`
- Mood: `Calm, exact, accountable, assured, technical, and operational. Spatial depth is welcome; spectacle, menace, and hype are not.`
- Time of day and lighting: `Non-photographic white-studio / technical-drawing light. Begin on the existing warm-blue page wash and white surfaces. Use navy linework and restrained bright/sky highlights. Do not simulate sunset, neon night, volumetric beams, bloom, or cinematic grain.`
- Camera and lens character: `An architectural 40–50 mm-equivalent perspective approaching orthographic. Use a slow, shallow push and measured separation between planes. Keep vanishing points stable, verticals controlled, and the central stack anchored. Avoid fisheye distortion, extreme dolly travel, barrel rolls, or deep Z-space that exposes empty edges.`
- Color palette: `Use existing named tokens only: midnight #040C2B, navy #0E1F5B, royal #1F3C80, mid-blue #3470C0, bright #4487DC, sky #7AB4E8, blue-wash #EDF5FC, page #F3F6FC, surface #FFFFFF, border-blue #D6E8F7, border #E5E7EB, ink #111827, slate #374151, and cool #6B7280. Royal—not bright blue—is the small-link color on light surfaces. Teal remains reserved for compliance content and is not part of this chapter.`
- Display typeface: `Inter Variable, using the current fluid scale and current desktop maxima; no serif substitution`
- Interface typeface: `Inter Variable for UI and body copy; JetBrains Mono Variable for eyebrows, L1–L4 codes, coordinates, compact labels, and technical chips`
- Styles to avoid: `Photography; AI-generated raster scenes; WebGL; particle/node backgrounds; radial glows; neon cybersecurity imagery; glassmorphism; grain; texture overlays; decorative blur; generic gradients; floating random objects; morphing the Smart Control logo; transparent navigation; huge empty type; bouncy easing; per-word headline animation; constant ambient motion; fake dashboards; status red/green/amber on marketing surfaces; new colors; and animation on every card`

### Permitted brand evolution

- Deepen the existing isometric plates and make their spatial relationships more
  legible.
- Add blueprint coordinates, datum rules, measured connector paths, and modest
  asymmetric composition using existing colors and line weights.
- Let one geometric wipe or stack-alignment move bridge timeline beats.
- Slightly refine section spacing or display scale when needed to own the
  viewport, while retaining the 1180 px grid and current type hierarchy.
- Keep the nav and footer light. Keep the existing products band and closing CTA
  as the only dark homepage zones.

## Narrative beats

The following beats occur inside one continuous sticky chapter placed where the
current `StackTeardown` section lives. The page hero and services introduction
remain normal-flow content above it; the products band and subsequent homepage
content remain normal-flow content below it.

### Beat 1 — Hero

- Headline: `Un singur partener, unic responsabil`
- Supporting copy: `Acoperim întregul stack tehnologic — infrastructură, rețea, platforme și software — cu accent deosebit pe securitate, sub un SLA unic, end-to-end.`
- Visible visual layers: `The complete but compact L4→L1 stack at rest; page-wash background; existing 56 px blueprint ruling and plus marks; a faint datum spine; L1–L4 mono labels; restrained routing lines; section eyebrow “STACK TEARDOWN”. All copy remains semantic HTML.`
- Intended motion: `Hold a complete first composition. Then let the title and supporting copy leave with a small opacity/vertical transition while the camera advances only slightly and the stack opens enough to expose the upper layers. No per-word animation and no blur.`

### Beat 2 — First narrative

- Headline: `Use the two existing layer titles in sequence—L4 “Aplicații & Automatizare”, then L3 “Platforme & Date”. Do not introduce an aggregate headline. Use the existing English counterparts on /en/.`
- Supporting copy: `Use each layer's existing description verbatim: “Software custom, API-uri și automatizare cu AI / LLM.” and “Virtualizare, cloud privat / hibrid, containere și storage.” Use the existing English counterparts on /en/.`
- Facts or CTA: `Use the existing L4 and L3 chips, link labels, href values, and aria-labels verbatim from each localized stackLayers array.`
- Intended transition: `L4 and L3 separate by a measured amount and receive the active line treatment while L2 and L1 remain visible as context. Side labels move into the newly created negative space. Text enters independently with a short translate and opacity change. No element flies across the viewport.`

### Beat 3 — World reveal

- Purpose: `Show the complete stack as one connected delivery system. This is the quiet proof frame: applications, platforms, network, and physical infrastructure align around one datum spine. Display the existing note “SLA 24/7, end-to-end — zero pasare a responsabilității între furnizori.” Do not add stats or public product claims that are absent from the current homepage.`
- Intended transition: `Return all four plates to a balanced exploded view; complete the connector paths; remove narrative panels; hold the clean technical composition long enough to read. Use stroke reveal, opacity, and small transforms only.`

### Beat 4 — Second narrative

- Headline: `Use the two existing layer titles in sequence—L2 “Rețea & Conectivitate”, then L1 “Infrastructură fizică”. Do not introduce an aggregate headline. Use the existing English counterparts on /en/.`
- Supporting copy: `Use each layer's existing description verbatim: “Core networking, SD-WAN și acces remote securizat.” and “Data center, compute, energie și cablare structurată.” Use the existing English counterparts on /en/.`
- Facts or CTA: `Use the existing L2 and L1 chips, link labels, href values, and aria-labels verbatim from each localized stackLayers array.`
- Intended transition: `Shift emphasis from the upper to the lower pair without hiding the full system. L2 and L1 separate, connector routes settle toward the lower datum, and the second text panel occupies the same controlled text region used by Beat 2. Then the world returns to the complete stack before the catalog enters.`

### Beat 5 — Final catalog

- Catalog purpose: `Turn the four-layer explanation into four clear routes through the real Smart Control service architecture, then release scroll naturally into the existing dark products band.`
- Card content: `Use the localized stackLayers arrays already defined in src/pages/index.astro and src/pages/en/index.astro. Preserve the current layer codes, titles, descriptions, chips, href values, and disclosure level. Do not duplicate content in a new data source unless both locales consume it safely.`
- Card action: `Each card is a semantic link to its existing service route. The active card can also select its corresponding plate. Use a finite four-item rail—no infinite loop or cloned cards. Provide previous/next controls, keyboard operation, touch swipe, a readable position label, disabled states at both ends, and visible focus.`
- Final CTA: `No new assessment or demo button inside the rail. The final state stays interactive, then the sticky stage unpins into the current products band. The nav and existing closing CtaBand remain the conversion surfaces.`

## Assets

- Asset directory: `public/cinematic-stack/ if external SVG files are needed; prefer the existing inline SVG/DOM geometry in src/components/StackTeardown.astro and create no raster scene by default`
- Asset manifest: `docs/cinematic-build-brief/assets.json — create before implementation if any external layer is added; record id, role, dimensions/viewBox, anchor, transform origin, depth, criticality, responsive behavior, and source`
- Reference screencast: `None supplied. Record a short before/after capture during handoff if the local environment supports it.`
- Reference screenshots: `Current / and /en/ pages rendered from the repository are canonical. docs/SMC Web/Home.dc.html is historical composition reference only and must not override current content or the July 2026 precision-engineering direction.`
- Brand assets: `public/smartcontrol-mark.png, public/smartcontrol-mark-96.png, docs/SMC Web/ds/assets/smartcontrol-mark.png, and the current HTML/CSS SmartControl wordmark. Do not redraw, recolor, distort, or animate the official mark.`
- Fonts: `Existing @fontsource-variable/inter and @fontsource-variable/jetbrains-mono packages, imported locally by BaseLayout; no external font requests`

### Layer contract

Use the kit's layer numbering as a conceptual map, implemented with aligned
DOM/SVG rather than photography:

- `00-stage-bg` — opaque page-wash/surface background.
- `10-blueprint-ruling` — existing static `GridTexture` geometry.
- `20-datum-and-routing` — distant SVG rules, connector paths, and coordinate
  ticks.
- `30-operational-stack` — the four aligned L4→L1 plates and their internal
  diagrams.
- `40-foreground-left` — left-side layer codes and narrative framing.
- `41-foreground-right` — right-side semantic narrative panel and details.
- `50-edge-frame` — optional hard-edged crop protection only if the composition
  needs it; never use a vignette to hide layout problems.

Every layer must share one viewBox/perspective model, stable anchors, and enough
bleed for the maximum transform. UI copy, links, and controls remain semantic
HTML and are never baked into SVG or images.

## Responsive requirements

- Desktop priority: `At ≥1100 px, use one sticky 100svh/100dvh-aware stage with a section-local deterministic timeline of approximately 3000–3600 CSS px. Compose and test at 1440×900 and 1280×720. Preserve the fixed light nav offset.`
- Mobile priority: `Below 1100 px, prioritize comprehension over spectacle. Do not use a long pinned chapter. Render the same four layers and all copy in normal flow as a vertical interactive stack/accordion or compact step sequence. Below 768 px, disable pointer parallax and ambient cycling; keep controls reachable with one hand.`
- Mobile crop or composition notes: `No blind desktop crop. Reframe the isometric stack above the active description, reduce plate separation, keep the active layer fully visible, preserve 24 px gutters, and prevent horizontal document overflow. The final catalog may use native horizontal scroll-snap with a visible next-card cue.`
- Required browsers: `Current stable Safari, Chrome, Edge, and Firefox; iOS Safari and Android Chrome. Verify Astro View Transition navigation as well as direct loads.`
- Minimum device expectations: `A normal enterprise laptop and a modern mid-range phone without discrete graphics. The chapter must not depend on WebGL, high refresh rate, hover, or a fine pointer.`

## Accessibility

- Reduced-motion preference: `Render a complete static stack followed by normal-flow layer descriptions and the same service links. Disable pinning, inertial smoothing, pointer parallax, automatic cycling, large scale/translation, stroke-drawing choreography, and decorative transitions. No information may exist only at a timeline position.`
- Keyboard requirements: `All four layer selectors and catalog controls must be native links/buttons or have equivalent semantics; support Tab, Shift+Tab, Enter, Space where appropriate, and ArrowLeft/ArrowRight for the rail. Preserve the existing visible brand focus ring. Never trap page scroll or keyboard focus.`
- Image-description requirements: `Mark decorative blueprint/SVG layers aria-hidden with empty alternative text. Expose the four-layer relationship through headings, ordered/list semantics, descriptions, and real links—not through a verbose description of decorative geometry.`
- Localization requirements: `Romanian is default at / and English has full parity at /en/. Reuse the current localized copy and routes. Romanian diacritics are mandatory. Keep technical terms in English. Do not bake copy into art, and do not ship a fake language switcher.`

## Performance

- Target initial transfer size: `Add no more than 12 kB gzip of homepage JavaScript for the cinematic controller and no new runtime dependency. Preserve server-rendered first content and avoid hydration-dependent first-frame shifts.`
- Target total image transfer size: `0 kB is preferred for the chapter by reusing inline SVG/DOM. If external SVG assets are justified, keep the complete added visual payload under 150 kB compressed and reserve dimensions/viewBox to prevent layout shift.`
- Required analytics or monitoring: `Do not add analytics; Umami is deferred until the EU instance exists. Use the browser Performance API, DevTools/Lighthouse where available, and the repository QA scripts to inspect frame stability, layout shift, overflow, console errors, and late asset loading.`

## Constraints

- Dependencies that may be used: `Only the dependencies already present in package.json and native browser APIs: requestAnimationFrame, IntersectionObserver, ResizeObserver when justified, matchMedia, CSS custom properties, transforms, opacity, clip-path, and SVG stroke properties.`
- Dependencies that must not be added: `GSAP, ScrollTrigger, Lenis, Three.js, WebGL frameworks, React, Svelte, Lottie, a smooth-scroll library, a carousel package, a remote icon/font script, or any package added merely for convenience.`
- Existing components that must be preserved: `BaseLayout, Nav, Footer, GridTexture, SectionHeading, StackTeardown, ModuleCard, MailtoLink, TextLink, CtaBand, SeknetConsole, CloudPipeline, LogoMarquee, current Astro ClientRouter behavior, the existing route tree, and the current obfuscated email wiring. Refactor StackTeardown only when the result remains reusable and both locales stay in parity.`
- Out-of-scope items: `Copywriting, translation, copy trimming, content reordering, a full-site redesign, pinned experiences on every page, changes to interior-page content, new public stats or product specifications, new products, client names or case studies, forms, phone, maps, customer login, e-commerce, CMS, blog, careers, cookie banner, analytics deployment, product UI screenshots, photography, or generated cinematic bitmaps.`

### Public-content guardrails

- Keep exactly two products: SEKNET and S-VPN.
- Keep exactly four ISO certifications: 9001, 27001, 14001, and 45001.
- Preserve computed years from the 2003 founding date.
- Do not restore the removed homepage stats strip or removed compliance pills.
- Do not restore old public product throughput, tunnel, module, integration, or
  security-event claims. Current product copy is deliberately general.
- Preserve the current CTA labels and mailto subjects from `src/i18n/ui.ts`.
- Keep email obfuscated in static HTML. Add no form, phone number, or map.
- No client names, emoji, or prohibited marketing register.

## Acceptance criteria

- `At ≥1100 px, the StackTeardown chapter reads as one polished, continuous 2.5D technical composition with five clear beats, one pinned stage, deterministic section-local progress, stable anchors, and clean reversal when scrolling upward.`
- `Below 1100 px and with prefers-reduced-motion, every heading, layer description, chip, link, and final catalog action remains available in readable normal flow without pinning, hidden states, autoplay, or horizontal page overflow.`
- `The implementation is recognizably the current Smart Control brand: light nav/footer, unchanged palette and logo, Inter/JetBrains Mono, blueprint ruling, restrained motion, current copy/disclosure level, four ISO badges, two products, full RO/EN parity, and no resurrected AI-SaaS tropes.`
- `A string-level review confirms that the existing Romanian and English public copy, labels, chips, links, CTA wording, mailto subjects, aria-labels, metadata, and reading order are unchanged.`
- `npm run check and npm run build complete with zero errors; all real links and obfuscated mailto actions work; direct loads and View Transition navigations initialize and clean up correctly; keyboard, touch, reverse scroll, 200% zoom, and console-error checks pass.`

## Notes

### Timeline checkpoints

Treat these as tuning targets, not immutable values:

- `p=0.00` — complete section hero and compact full stack.
- `p=0.18` — opening copy has exited without a pop or crop.
- `p=0.27` — L4/L3 narrative is readable and the upper pair is emphasized.
- `p=0.44` — clean full-stack reveal; all four layers and the SLA note are clear.
- `p=0.58` — L2/L1 narrative is readable and the lower pair is emphasized.
- `p=0.74` — full stack returns to focus with no transform discontinuity.
- `p=0.90` — service rail is mostly entered and operable.
- `p=1.00` — final interactive state is stable; continued scrolling releases
  naturally into the existing products band.

At every checkpoint inspect layer order, SVG alignment, transparent/empty edges,
text contrast, text collisions, clipping, transform continuity, focus visibility,
and horizontal overflow. Scroll both downward and upward.

### Implementation rules

- Derive progress from this chapter's own scroll range, never global document
  progress.
- Keep scene boundaries in one readable configuration object.
- Request rendering through `requestAnimationFrame`; listeners only request a
  frame. Stop scheduling frames after values converge and while the section is
  offscreen.
- Expose a small set of CSS custom properties and let CSS own final transforms.
- Cache geometry and remeasure on resize; do not force layout repeatedly inside
  the frame loop.
- Preserve content visibility without JavaScript. Do not initialize meaningful
  content at `opacity: 0` and hope a trigger reveals it.
- The existing 3.2-second StackTeardown ambient cycle must not fight scroll
  control. Disable it while the desktop cinematic mode is active; retain direct
  click/keyboard selection in the final state and the compact fallback.
- Initialize on `astro:page-load`, clean up on `astro:before-swap`, and prove
  repeated View Transition visits do not duplicate listeners or animation loops.
- Do not modify `package.json`, `astro.config.mjs`, `tsconfig.json`, or
  `vercel.json`.

### Required handoff

Return:

1. Implementation summary.
2. Scene/timeline map.
3. Asset/layer map.
4. Files changed.
5. Local run command.
6. Desktop, tablet, mobile, keyboard, and reduced-motion verification.
7. Build/check results.
8. Known limitations and any missing production assets.
