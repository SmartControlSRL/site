# Smart Control — Cinematic Full-Site Reimagination Brief

> Full-site project brief adapted from the MIT-licensed
> [Cinematic Scroll Prompt Kit](https://github.com/amirmushichge/cinematic-scroll-prompt-kit).
> This document supersedes the earlier StackTeardown-only brief.
>
> **Scope directive:** Reimagine the complete Smart Control public website as
> one cohesive cinematic UI/UX system: all Romanian and English routes, shared
> navigation/footer/layout, homepage, services hub and four service pages,
> solutions hub and two product pages, privacy pages, and 404. Preserve the
> reviewed copy, facts, routes, CTA destinations, localization, and recognizable
> brand identity. Existing layouts and presentational components are inputs, not
> visual constraints. A PR limited to StackTeardown, homepage motion, or a
> single animated section is incomplete.

## Project

- Project name: `Smart Control — The Control Plane`
- Subject or brand: `Smart Control SRL, a Romanian enterprise IT, cloud, networking, cybersecurity, software, and managed-services company founded in 2003`
- Audience: `CIOs, CISOs, CTOs, IT directors, infrastructure leaders, procurement stakeholders, and regulated-enterprise buyers in Romania and international markets`
- Repository: `/Users/claude/code/site`
- Existing stack: `Astro 5.18 static SSG, Tailwind CSS 4.1 via Vite, TypeScript, Astro View Transitions, @lucide/astro, self-hosted Inter Variable and JetBrains Mono Variable, and vanilla JavaScript motion utilities`
- Delivery target: `A production-quality pull request with a reviewable Vercel preview; no production deployment or merge`
- Implementation scope: `All 21 generated routes and the shared UI system. Redesign and recompose the global shell, navigation, footer, page heroes, section architecture, grids, cards, CTA presentation, diagrams, interaction states, responsive behavior, and motion language across every page family. Maintain full RO/EN parity.`

### Route inventory

- Home: `/`, `/en/`
- Services hub: `/servicii`, `/en/servicii`
- Cloud: `/servicii/cloud`, `/en/servicii/cloud`
- Security: `/servicii/securitate`, `/en/servicii/securitate`
- Software: `/servicii/software`, `/en/servicii/software`
- Managed services: `/servicii/managed`, `/en/servicii/managed`
- Solutions hub: `/solutii`, `/en/solutii`
- SEKNET: `/solutii/seknet`, `/en/solutii/seknet`
- S-VPN: `/solutii/s-vpn`, `/en/solutii/s-vpn`
- Privacy: `/confidentialitate`, `/en/privacy`
- Error page: `/404.html`

## Goal

Create a visibly new, premium enterprise website experience—not animation added
to the current website. Establish a site-wide cinematic visual language rooted
in Smart Control's precision-engineering brand, then express it differently
across homepage, hub, service, product, legal, and error-page contexts. A
reviewer must recognize the reimagination from the first viewport and continue
to see it throughout the site.

Primary message: `Smart Control operates as one accountable, technically rigorous delivery partner across infrastructure, security, software, products, cloud modernization, and managed operation. Use the current approved copy to communicate this; add no new marketing proposition.`

Desired user response: `Understand the service and product architecture quickly, feel the depth and operational discipline of the company, navigate confidently to the relevant route, and use the existing assessment or product-demo CTA.`

Interaction principle: `Use a small number of purposeful page-level cinematic moments plus refined transitions and micro-interactions. Do not make every section sticky or sacrifice readability for spectacle.`

### Definition of “reimagined”

- Shared navigation, footer, page framing, spacing rhythm, and route transitions
  are materially redesigned.
- The homepage becomes an authored end-to-end journey, not the existing section
  stack with reveal animations.
- Every page family receives a deliberate composition and a route-relevant
  technical visual language.
- Repetitive `hero → card grid → card grid → CTA` layouts are replaced with
  connected diagrams, architectural slabs, split narratives, indexed chapters,
  route rails, ledgers, and page-specific signature interactions.
- An existing `ModuleCard` grid may remain only when it is materially recomposed,
  is demonstrably the clearest information structure, and is justified in the
  PR. No page may retain its current `hero → grids → CTA` structure unchanged.
- Layout, hierarchy, component boundaries, styling, and interactions may change
  substantially while the brand and content remain recognizable.
- A page is not redesigned merely because it has reveal animations. If it still
  reads as the current headers and generic cards with motion attached, it fails
  acceptance.

## Copy lock — non-negotiable

The Romanian and English copy has already been reviewed and approved.

- Preserve public marketing copy, facts, claims, CTA labels and destinations,
  mailto subjects, metadata, structured data, and translations verbatim.
- Do not add, remove, shorten, combine, embellish, or retranslate public copy.
- Visual order, grouping, markup, and component boundaries may change. Preserve
  semantic relationships and do not reorder information in a way that changes
  its meaning.
- Copy may be wrapped or distributed across new semantic containers when its
  text content and accessible reading meaning remain intact.
- UI-only accessibility/control labels may be added or adjusted when necessary;
  localize them in both languages and report them in the PR.
- Do not duplicate visible or screen-reader content to support sticky/static
  variants. Use one semantic content source whenever possible.
- Verify the final implementation with a route-wide string/content diff.

## Visual direction

### Core concept — The Control Plane

Express Smart Control as a living infrastructure blueprint: one connected
operational system rather than a collection of generic service cards. A royal or
bright-blue datum line, precise routing geometry, indexed mono labels, and
code-native 2.5D planes recur across routes. Light surfaces represent planning,
architecture, and explanation. The few approved dark surfaces represent live
products and operation.

Cinematic means spatial choreography—assemble, separate, route, lock, validate,
and hand off. It does not mean video, a dark cyberpunk theme, constant motion,
or visual effects placed on top of unchanged layouts.

- Overall style: `A site-wide precision-engineering editorial system with cinematic depth: architectural framing, code-native technical diagrams, strong typographic composition, measured spatial layering, blueprint datum/routing details, and choreographed transitions.`
- Mood: `Calm, exact, assured, accountable, technical, and operational—not aggressive, theatrical, futuristic, or playful.`
- Lighting: `Light-first white-studio / technical-drawing clarity. Dark product environments remain deep navy rather than black. No volumetric beams, bloom, grain, or photographic lighting simulation.`
- Camera character: `Architectural 40–50 mm-equivalent perspective approaching orthographic. Stable anchors, restrained scale, short travel, controlled verticals, and deliberate transform origins.`
- Palette: `Retain the existing blue ladder, warm-blue washes, white surfaces, neutral ink ladder, and compliance-teal restriction. Derived alpha/tint values from existing tokens are allowed. Add no unrelated hue.`
- Display typeface: `Inter Variable with the current 64 px desktop hero cap as a foundation; controlled responsive evolution is permitted when documented.`
- Interface typeface: `Inter Variable for UI/body and JetBrains Mono Variable for eyebrows, coordinates, indices, technical chips, progress, and route context.`
- Iconography: `Lucide static SVG only, 1.5 px stroke, used sparingly and never as the primary visual concept.`

### Brand elements to preserve

- Official Smart Control mark and wordmark; never redraw, distort, recolor, or
  animate the logo.
- Recognizable blue-led palette and navy-tinted elevation.
- Light nav and light footer on every page.
- Dark zones restricted to product-detail heroes, the homepage products world,
  and closing CTA bands.
- Royal link text on light surfaces for WCAG AA; bright blue remains an
  indicator, line, or large-display accent.
- Inter / JetBrains Mono pairing and the technical eyebrow language.
- Tight radii and hard-edged geometry. Controlled use of 4, 10, and 16 px radii.
- Romanian-first experience with equal English execution.

### Controlled evolution allowed

- More asymmetric editorial compositions within a disciplined 12-column grid.
- Edge-to-edge scene frames, stronger whitespace, vertical datum rails,
  coordinate ticks, numbered chapters, and hard section handoffs.
- Derived blue tints/alphas, refined spacing, type scale, grid proportions,
  component geometry, and motion timing.
- Fewer but larger architectural slabs in place of walls of equal cards.
- Shared route-specific SVG/DOM diagrams built from the same layer grammar.
- A redesigned light navigation system, mobile menu, footer, CTA composition,
  and route-transition language using current destinations and copy.

### Styles to avoid

- The current page composition with animations layered on top.
- Generic AI-SaaS bento walls or identical rounded cards on every page.
- Photography, generated raster scenes, stock art, video timelines, code rain,
  hacker imagery, fake terminals, fake dashboards, or invented live status.
- WebGL, Three.js, particle fields, randomized node backgrounds, full-page
  canvas, excessive glow, glassmorphism, grain, texture, or permanent blur.
- New dark sections, transparent navigation, animated logo, custom cursor,
  preloader, scroll hijacking, smooth-scroll interception, giant zooms, per-word
  animation, autoplay carousel, or endless ambient movement.
- Repeating the same pinned effect on every page.

## Shared UI/UX system

### Global shell

- Reimagine the fixed light nav as a precise command/index bar using the current
  logo, routes, assessment CTA, and RO/EN switch.
- Preserve immediate navigation. Route menus may become richer light panels, but
  every destination must remain one interaction away, keyboard accessible, and
  usable without motion.
- Use active-route datum/underline treatment, clear focus, 44 px mobile targets,
  ESC-close behavior, focus management, and no delayed navigation.
- Redesign the mobile menu as an intentional light navigation surface rather
  than a compressed desktop menu.
- Redesign the light footer as a calm “system index” using the current four
  columns, contact details, links, privacy destination, and brand copy.

### Layout and surfaces

- Use the current 1180 px container and breakpoint system as a foundation, not a
  visual prison. Document any controlled change.
- Establish shared scene containers, route headers, chapter indices, diagram
  frames, capability lanes, proof ledgers, cross-sell bridges, and CTA frames.
- Keep semantic HTML separate from decorative SVG/DOM layers.
- Build data-driven components where content repeats across locales/pages; do
  not duplicate animation math or copy.
- Vary page composition while maintaining recognizable system rules.

### Shared scene layer contract

- `00-field` — page wash, white, or approved dark floor.
- `10-blueprint` — ruling, coordinates, datum ticks, or quiet structural grid.
- `20-routing` — paths, rails, connectors, and section continuity.
- `30-artifact` — route-specific primary architectural object.
- `40-narrative` — semantic headings, copy, lists, and actions.
- `50-frame` — crop protection, route context, or chrome when required.

All visual layers share stable viewBox/perspective rules, anchors, transform
origins, and sufficient bleed. Text and controls remain semantic HTML and are
never baked into artwork.

## Page-family experience map

### 1. Home — the complete system

Recompose the entire current journey while retaining its content groups and
order: hero → services → StackTeardown/accountability → products → Cloud →
partners → assessment CTA.

- Hero: create a deliberate first viewport with the assembled four-layer
  operational system beside/behind the existing headline, supporting copy, CTA,
  secondary link, and four ISO badges.
- Hero-to-services signature chapter: at `>=1100px`, one main pinned experience
  may move from the assembled system into the four service domains. Existing
  service copy appears in controlled negative space as each layer becomes active.
- StackTeardown becomes the culmination of the service architecture, not a
  separate animated widget or the entire project.
- Final service state becomes a usable four-route atlas.
- Products: transition into the existing approved dark zone. Recompose SEKNET
  and S-VPN as two connected operational worlds; retain generic disclosure and
  current links. The existing console may be redesigned but must not invent data.
- Cloud: turn the same routing line into the current five-stage modernization
  path and capability proof, rather than another standard card tier.
- Partners: present current partner names as a calm trust ledger or refined
  marquee with accessible static fallback.
- Closing CTA: recompose its frame and transition while preserving current copy,
  subject, action, and dark-zone role.

Only the primary hero-to-services chapter is long-pinned. The rest of Home uses
normal document flow with short local transitions.

### 2. Services hub — the system atlas

- Create a light editorial hero with a compact four-domain architectural index.
- Replace the generic pillar grid with a connected service atlas or four
  full-width chapters sharing a topology/spine.
- Each domain must remain fully readable in semantic normal flow and route to
  the existing detail page.
- Recompose current proof and differentiators into a credential rail,
  accountability ledger, or delivery matrix rather than additional card walls.
- Give the page a clear beginning, exploration state, and handoff to the existing
  assessment CTA.

### 3. Cloud detail — the modernization corridor

- Make the existing five stages the page's main signature cinematic journey.
- Visually transform a rigid legacy/application block through target
  architecture, containerization, migration routing, and validated operation.
- Preserve all current step copy and capability copy.
- At `>=1100px`, this may be the only other long-pinned experience on the site.
- The final topology should persist into the capabilities/output section so the
  page feels continuous rather than resetting to a grid.
- Do not invent financial results, infrastructure diagrams, dashboards, or
  claims beyond current content.

### 4. Security detail — the control perimeter

- Recompose the current hero and context panels around a restrained blue
  perimeter/control schematic.
- Map the six existing capability groups to defensive/control layers around one
  protected core, activated by normal scrolling or selection.
- Keep content readable without interaction and avoid fake threats, incidents,
  red alert states, or padlock clichés.
- Present ISO proof as a quiet assurance ledger and SEKNET cross-sell as a
  connected system extension.
- No long full-page pin.

### 5. Software detail — commit to operation

- Build a source-to-production delivery spine: architecture → code/API →
  CI/CD/DevSecOps → modernization → automation → operated system.
- Recompose current promises and capabilities as stages/guarantees on that path,
  not two separate card grids.
- Use code-native structural diagrams, not fake code, terminals, or code rain.
- Keep normal document scrolling with short state transitions.

### 6. Managed services — the service envelope

- Recompose the page around a continuous operating model spanning service desk,
  infrastructure, network, security, systems, cloud, and automation.
- Use layered operational lanes or a restrained SLA/control circuit; do not
  invent live status or operational metrics.
- Connect existing SEKNET and S-VPN cross-sells as optional endpoints/modules in
  the operating model rather than two generic cards.
- Keep normal document scrolling and a clear assessment handoff.

### 7. Solutions hub — the dual product bay

- Keep the page light while turning SEKNET and S-VPN into two large blueprint
  specimens rather than ordinary product cards.
- SEKNET's abstract language: telemetry/routing paths converge into one control
  plane.
- S-VPN's abstract language: endpoints align through a protected access
  corridor.
- Both paths converge into the current integration rationale and CTA.
- All information and links remain visible without hover.

### 8. SEKNET detail — signal convergence

- Preserve the approved dark hero/light body/dark CTA rhythm.
- Reimagine the dark hero around generic distributed signals converging into one
  operational control plane beside the existing copy and demo action.
- On leaving the hero, flatten the artifact into a light capability map.
- Recompose current capabilities and use contexts as indexed chapters around the
  map rather than standard grids.
- Cross-sells become deliberate next-system bridges.
- Never invent product metrics, module specs, alerts, integrations, or fake UI.

### 9. S-VPN detail — the secure corridor

- Preserve the approved dark hero/light body/dark CTA rhythm.
- Use endpoints, access planes, and protected tunnel/routing geometry as the
  route-specific artifact.
- Recompose current capabilities, implementation services, and audience groups
  along the same connection path.
- Share product-template system rules with SEKNET without making the two pages
  visually identical.
- Add no throughput, tunnel-count, security-method, or licensing claims.

### 10. Privacy — premium reading experience

- Do not force cinematic choreography onto legal content.
- Create an editorial light header, sticky desktop table of contents derived from
  existing headings, current-section highlight, thin reading-progress rule, and
  a comfortable 65–75ch text measure.
- Mobile TOC becomes a normal accessible disclosure or compact index.
- Preserve every policy word and anchor destination; keep print behavior clean.
- Motion is limited to state feedback.

### 11. 404 — missing route

- Use a small light “missing node / broken route” blueprint composition with the
  current bilingual copy and both real recovery links.
- One brief entrance is sufficient; no loop or long scene.
- Keep the page fast, accessible, and noindex.

## Motion language

Use four tiers:

1. Route transition — native Astro transition with a short datum/rule movement
   and restrained page crossfade/translation.
2. Signature chapters — Home hero/services and Cloud methodology only.
3. Short explanatory state changes — service/product route diagrams.
4. Micro-interactions — navigation, links, controls, cards/slabs, focus.

Motion must explain hierarchy, sequence, connection, or state. Otherwise keep it
static.

- Use section-local deterministic progress, not global scroll position.
- Reverse scroll reverses every timeline state cleanly.
- Use the current vanilla stack, `requestAnimationFrame`, CSS custom properties,
  transforms, opacity, stroke, and clip. Add no animation dependency.
- At most one active render loop per scene; pause offscreen and in hidden tabs.
- Suggested bounds: micro `140–220ms`; section states `420–650ms`; entrance
  travel `<=24px`; card/plane hover travel `<=3px`; camera scale normally
  `<=1.06`; pointer parallax `<=12px`; rotation adjustment `<=2deg`.
- No wheel interception, custom scroll physics, global smoothing, or trapped
  scroll.

## Responsive requirements

- `>=1100px`: full architectural scenes; pin only Home's main chapter and Cloud's
  methodology when warranted.
- `768–1099px`: replace long pins with stepped split layouts or short sticky
  artifacts; preserve all content in normal flow.
- `<768px`: normal-flow scenes with artifact above copy, 24 px gutters, compact
  depth, and native finite scroll-snap only when it improves navigation.
- No interaction may depend on hover, fine pointer, or desktop crop rules.
- Recompose every page family deliberately for mobile; stacking desktop columns
  without visual review is insufficient.
- At 200% zoom or insufficient viewport height, sticky/pinned layouts must fall
  back safely.
- Test at `1440×900`, `1280×720`, `1024×768`, `768×1024`, and `390×844`.

## Accessibility

- Content is visible and navigable before JavaScript initializes.
- Reduced motion presents polished static compositions with normal-flow content;
  disable pinning, inertia, parallax, route sweeps, path drawing, auto-advance,
  and ambient loops.
- Use semantic headings, lists, links, buttons, and landmarks. Prefer native
  controls; do not nest interactive elements.
- Decorative SVG/DOM geometry is `aria-hidden`; meaningful relationships are
  communicated by semantic content.
- Preserve visible focus, logical tab order, disabled states, and 44 px touch
  targets. No focus or scroll traps.
- Validate text/link contrast, 200% zoom, keyboard operation, touch, screen-reader
  reading order, and route-transition focus restoration.
- Full RO/EN UI capability and localized accessibility labels are required.

## Performance and implementation quality

- Keep Astro fully static and progressively enhanced.
- Add no dependency and no remote font/icon/image request.
- Prefer code-native SVG/DOM. Added raster payload target: `0 kB`.
- Keep added route-specific JavaScript small and split by route. Target no more
  than `30 kB gzip` added across the complete redesign and no more than
  `15 kB gzip` required by any one route.
- Cache measurements; do not mix repeated layout reads and writes in frame loops.
- Use passive listeners, `IntersectionObserver` for scene visibility, and
  `ResizeObserver` only when justified.
- Initialize on initial load and `astro:page-load`; explicitly tear down every
  listener, observer, timer, and frame on `astro:before-swap`.
- Repeated ClientRouter visits must not duplicate state or cause first-frame
  shifts.
- Reserve geometry/aspect ratio to prevent CLS.
- Keep console clean and avoid unnecessary rerenders/continuous animation.

## Assets

- Reuse current logo, font, icon, and inline SVG assets.
- Prefer route-specific code-native diagrams built as shared primitives.
- If an external asset is introduced, create
  `docs/cinematic-build-brief/assets.json` recording role, source, dimensions or
  viewBox, anchor, transform origin, depth, responsive variants, criticality,
  and license.
- Do not generate or source photography/raster artwork without separate owner
  approval.

## Constraints

- Allowed: `Existing package dependencies and native browser APIs only.`
- Forbidden dependencies: `GSAP, ScrollTrigger, Lenis, Three.js, WebGL frameworks, React, Svelte, Lottie, carousel packages, remote icon/font scripts, or packages added for convenience.`
- Existing components: `Preserve their public behavior and data contracts where useful, but refactor, replace, split, or consolidate presentational components to create a coherent reusable full-site system. Do not preserve a component merely because it exists.`
- Preserve: `Route tree, canonical/hreflang behavior, static SSG, ClientRouter lifecycle, obfuscated email behavior, CTA destinations, privacy content, logo integrity, product/legal guardrails, Vercel noindex preview configuration, and unrelated user work.`
- Out of scope: `Copywriting or translation, new claims/content/routes/products, forms, phone, map, portal, e-commerce, CMS, blog, careers, client names, analytics deployment, production deployment, generated decorative photography, or production-domain changes.`
- Do not modify: `package.json, package-lock.json, astro.config.mjs, tsconfig.json, or vercel.json.`

## Public-content guardrails

- Exactly two products: SEKNET and S-VPN.
- Exactly four ISO certifications: 9001, 27001, 14001, and 45001.
- Years remain computed from 2003.
- Do not restore removed homepage stats, compliance pills, detailed product
  claims, throughput/tunnel counts, module specs, attack logs, or integrations.
- Preserve current CTA labels, subjects, obfuscated email, and page-specific ask.
- No client names, emoji, prohibited marketing register, forms, phone, or map.

## Acceptance criteria

- `All 21 routes use the new shared UI system. Home, both hubs, Cloud, Security, Software, Managed Services, SEKNET, S-VPN, both privacy routes, and 404 each show intentional route-appropriate composition; no secondary page is accepted merely because it inherits new global CSS.`
- `The redesign is clearly visible before the visitor reaches StackTeardown. A diff confined to StackTeardown, motion.js, a homepage section, or reveal animation fails acceptance.`
- `Shared navigation/footer, heroes, body-section architecture, CTA framing, and responsive composition are materially redesigned.`
- `The homepage and every page-family journey feel authored end to end. Cinematic motion supports comprehension and degrades to a polished static experience.`
- `Existing public copy, facts, claims, routes, CTA destinations, metadata, and translations remain unchanged; RO and EN have equal UI capability.`
- `The recognizable Smart Control brand remains intact with controlled evolution only.`
- `Every route works at 1440, 1024, 768, and 390 px, with reduced motion, keyboard, touch, 200% zoom, no JavaScript, direct load, and View Transition navigation.`
- `npm run check, npm run build, and link/parity checks pass; there is no horizontal overflow, broken focus, console/lifecycle error, disruptive CLS, or disproportionate payload growth.`
- `The PR includes before/after visual evidence for every page family and recordings of the Home and Cloud signature chapters.`
- `The final Vercel preview is generated from the PR's final HEAD and all 21 routes are inspected; deeper motion/responsive review covers every page family in both locales.`

## Required design/verification checkpoints

Before implementation, inventory every route and capture baseline screenshots.
Define shared tokens/primitives, component refactor map, page-family compositions,
route-by-route motion map, responsive/reduced-motion/no-JS plan, copy-lock
baseline, and performance/accessibility risks.

During implementation, review each page family before proceeding. At handoff,
provide:

1. Design-system and shared-component summary.
2. Page-family composition map.
3. Motion/scene map and lifecycle architecture.
4. Files changed and commit structure.
5. Before/after desktop/mobile evidence for every page family.
6. Accessibility, reduced-motion, keyboard, zoom, and no-JS results.
7. Copy-lock and RO/EN parity results.
8. Build, link, overflow, console, CLS, and payload results.
9. PR URL and final-HEAD Vercel preview URL.
10. True remaining limitations or external blockers.
