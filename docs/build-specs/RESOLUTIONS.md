# Build resolutions — BINDING for all agents

Orchestrator rulings on every open question raised by the design extraction
(2026-06-12). These are consistent across all pages. When a page spec in
`docs/build-specs/*.md` conflicts with this file, THIS FILE WINS.

## Fidelity & sizing
1. **Export desktop values are canonical at ≥1100px viewport**: 16px base body,
   **1180px container with 40px inline padding** (24px below 768px), export
   heading sizes (38/40/64px etc.) as the max of fluid `clamp()`. The earlier
   "web-native larger scale" idea is superseded by "match closely". Update
   `.container` and type tokens in `global.css` accordingly.
2. **Responsive is designed by us** (exports have no media queries): grids
   stack to 1-col on mobile, 2-col at tablet where natural. Breakpoints: 768px,
   1100px. Visual review checks 390 / 768 / 1280 widths.
3. **Nav mobile**: exports have no mobile menu — implement a clean light
   hamburger + slide-down panel (brand-styled, focus-trapped, ESC closes).

## Motion
4. **Vanilla `motion.js` port is the stack** (already at `src/scripts/motion.js`,
   verbatim). NO GSAP. Wire via BaseLayout `<script>` on `astro:page-load`,
   cleanups on `astro:before-swap` (View Transitions enabled via `ClientRouter`).
5. **Inert `data-skew` stays inert** — keep the attributes, do NOT call
   `initScrollLean` (matches the approved visual exactly).
6. Per-page init calls + opts: exactly as each page spec records them
   (initNetwork opts differ per zone — copy them precisely).
7. Reduced-motion fallbacks = whatever motion.js already does (static states).
8. CSS keyframes from exports (`scWordIn`, `scFadeIn`, `scMarquee`, `scDriftA/B`)
   move into `global.css`.

## Copy & content
9. **RO copy verbatim from the specs** (diacritics exact), EXCEPT the
   known-stale facts in CLAUDE.md: **ISO 27701 stripped everywhere** (4 ISO
   badges: 9001/27001/14001/45001) and **Asset Management stripped everywhere**
   (footers, cross-sells, nav). SEKNET's cross-sell pairs with **S-VPN** instead.
10. **Hardcoded years are recomputed**: "22 de ani" → computed
    `new Date().getUTCFullYear() - 2003` ("23 de ani" in 2026); stats "20+"
    stays the computed decade floor; © year dynamic.
11. **CTA wording = export wording** ("Solicită un demo", "Solicită assessment").
    CLAUDE.md's "Cere un demo" is superseded — export copy was approved.
12. **EN pages**: translate the RO copy per the brand voice rules (technical
    terms stay English; no marketing fluff; diacritics N/A). Full parity.

## CTAs & email
13. **Primary CTAs go straight to mailto** (no #contact anchor hops): nav CTA +
    hero assessment CTAs → `office@smartcontrol.ro` subject `Evaluare gratuită`;
    product hero demo CTAs → subject `Demo SEKNET` / `Demo S-VPN`. In-page
    secondary anchors (e.g. "vezi modulele") stay anchors. A product page keeps
    the export pattern: hero = demo ask, closing band = assessment ask.
14. **Obfuscation**: use the `data-email-user/-domain` pattern + `initEmails`
    everywhere (no raw address in static HTML). **Extend `initEmails`** to honor
    a `data-email-subject` attribute (the one permitted motion.js change).
15. **The decorative email `<input>` in CTA bands is REMOVED** (no-forms rule,
    a11y) — keep the pill shell + mailto button only.

## Chrome (shared)
16. **Nav = export nav**: fixed, shrink-on-scroll (initNavShrink), active-page
    underline, items: Servicii, Cloud & Modernizare, SEKNET, S-VPN, Contact +
    assessment CTA button + RO/EN switch (from scaffold). Cloud is top-level in
    nav; route stays `/servicii/cloud`.
17. **Footer = export 4-col footer**, minus dead links: NO "Termeni și
    condiții", NO "Cookies", NO "Asset Management". Privacy →
    `/confidentialitate` (`/en/privacy`). Service/product links point to the
    real routes, not Home anchors. © year computed.
18. **Compliance terms stay export-colored** (slate/cool inline) — the reserved
    teal rule from the old brand system is NOT applied (exports won approval
    without it). Teal remains available for badges if a page spec shows it.

## Components & tokens
19. Shared primitives live in `src/components/`: Eyebrow, SectionHeading
    (word-fill H2), NetworkCanvas, CtaBand (dark, canvas + glow + mailto),
    ModuleCard (light + dark variants), StatStrip/StatBlock, SpecTable,
    ChevronList, MonoPill, IconChip, LogoMarquee, Stepper, TextLink, MailtoLink.
    Page-specific composites (FeaturedDarkCard, AudiencePill, GiantStatBlock,
    CrossSell pair...) are built INSIDE the page file that needs them.
20. **No new theme tokens** unless a value is visibly distinct: stepper dot
    radius = literal 12px; table label bg = `--color-hover-tint`; card shadow =
    `--shadow-md`. Eyebrow component matches export visuals (12px mono,
    2.5px tracking, 2px blue-wash rule) — update `.eyebrow` in global.css.
21. **Icons: `@lucide/astro` static SVG imports** (stroke-width 1.5). No CDN,
    no `hydrateIcons` (delete the call sites; keep the function in motion.js
    untouched otherwise).
22. **Links**: body-size link TEXT uses royal `#1F3C80` on light (AA), sky on
    dark — exports' bright-blue body links are the one accessibility fix we
    apply over fidelity. Bright stays for rules/eyebrows/large display text.

## Out of scope for pages
23. No analytics script (Umami deferred until the EU instance exists).
24. `vercel.json` (noindex) + `robots.txt` + sitemap integration already done.
25. Do NOT touch: package.json, astro.config.mjs, tsconfig, vercel.json.

## File ownership (conflict avoidance)
- Foundation agent owns: `global.css`, `BaseLayout.astro`, `Nav.astro`,
  `Footer.astro`, `src/components/*`, `src/scripts/*`, `src/i18n/ui.ts`, OG image.
- Page agents own ONLY their page files under `src/pages/` (+ their EN twin).
  If a page needs a shared change, it reports it in its result instead of
  editing shared files.
