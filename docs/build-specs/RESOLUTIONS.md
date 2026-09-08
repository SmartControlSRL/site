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
9. **RO copy follows the specs** (diacritics exact), except claims blocked by
   `CLAIMS.md`. Certification counts/badges and ISO 27701 are stripped; Asset
   Management is stripped. SEKNET's cross-sell pairs with **S-VPN** instead.
10. **Founding/tenure figures are omitted** until C-001 is approved; © year is dynamic.
11. **CTA wording = export wording** ("Solicită un demo", "Solicită assessment").
    CLAUDE.md's "Cere un demo" is superseded — export copy was approved.
12. **EN pages**: translate the RO copy per the brand voice rules (technical
    terms stay English; no marketing fluff; diacritics N/A). Full parity.

## CTAs & email
13. **Primary CTAs go straight to mailto** (no #contact anchor hops): nav CTA +
    hero assessment CTAs → `office@smartcontrol.ro` subject `Solicitare assessment`;
    product hero demo CTAs → subject `Demo SEKNET` / `Demo S-VPN`. In-page
    secondary anchors (e.g. "vezi modulele") stay anchors. A product page keeps
    the export pattern: hero = demo ask, closing band = assessment ask.
14. **Resilient email links**: render a complete static `mailto:` destination
    and a non-empty accessible name at every call site. Address-style links
    also expose `office@smartcontrol.ro` as selectable text without JavaScript.
    The `data-email-user/-domain/-subject` attributes and `initEmails` may stay
    only as idempotent progressive enhancement; they must never replace or
    regress the static fallback. The small scraper benefit of splitting the
    address does not justify a broken no-JS contact path.
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

## Localisation and content architecture (approved 2026-09-01)

26. **CTA matrix:** service pages and service hubs use “Solicită assessment” /
    “Request an assessment”; SEKNET and S-VPN detail pages use “Solicită un
    demo” / “Request a demo”. A view presents one primary ask. Product-hub
    guidance may route to the assessment mailbox when the visitor has not yet
    selected a product.
27. **Inbox-routing subject:** the assessment subject remains Romanian
    (`Solicitare assessment`) on both locales. It is an intentional routing
    token and is not visible page copy. Product subjects remain `Demo SEKNET`
    and `Demo S-VPN`.
28. **Romanian glossary:** keep `assessment`, `cloud`, `deployment`, `DevOps`,
    `DevSecOps`, `Kubernetes`, `refactoring`, and `handover` where they identify
    established technical or commercial concepts. Use Romanian
    `modernizare`, `securitate`, `operare`, `livrare`, and `indicatori` in
    descriptive prose. Do not alternate `assessment` with `evaluare` for the
    primary service CTA.
29. **English convention:** public English copy uses British spelling:
    `organisation`, `modernisation`, `optimisation`, `prioritise`,
    `centralised`, and `containerisation`. Schema.org type names remain their
    canonical vocabulary and are not prose.
30. **Service pillar 02:** the approved public name is **Networking &
    Security** in both locales. The older “Securitate & Conformitate” direction
    is superseded; regulatory frameworks must not be implied as service
    certifications.
31. **Cloud workflow:** the canonical five stages are assessment, target
    re-architecture design, containerisation/delivery preparation, controlled
    migration/knowledge transfer, and validation/continuous optimisation.
    Fast Track is an optional path for clients whose technical context is
    already known; it is never presented as a universal first stage.
32. **Social cards:** use separate 1200×630 Romanian and English images with
    locale-specific alt text. Cards contain brand positioning only and no
    blocked quantitative, certification, client, or product-performance claim.
33. **Shared source of truth:** repeated service-detail and hub structures are
    rendered from typed localized content in `src/content/` through templates
    in `src/components/pages/`. Unique Cloud and product-detail compositions
    may stay page-local, while shared diagrams use `RouteFlowVisual.astro`.
34. **Card and contact affordance:** `ModuleCard` is a static content container
    and carries no lift, pointer, focus, or card-wide link styling. A destination
    is an explicit `TextLink` or a deliberately authored whole-card anchor; do
    not nest links. Homepage service cards are intentionally static summaries.
    The navigation label “Contact” targets the homepage `#contact` band, which
    exposes the static email address as well as the mail action.
35. **Privacy-policy source (owner decision 2026-09-02):** retain the uploaded
    attorney-authored Romanian policy in `docs/Politica de confidentialitate.pdf`
    and the existing English courtesy translation as the public RO/EN notices.
    Render them as indexable, accessible HTML and preserve the resilient static
    rights-request email link. The advisory processing inventory remains useful
    for future revisions but does not gate publication of this approved source.

## File ownership (conflict avoidance)
- Foundation agent owns: `global.css`, `BaseLayout.astro`, `Nav.astro`,
  `Footer.astro`, `src/components/*`, `src/scripts/*`, `src/i18n/ui.ts`, OG image.
- Page agents own ONLY their page files under `src/pages/` (+ their EN twin).
  If a page needs a shared change, it reports it in its result instead of
  editing shared files.

## Homepage-led structure (owner agreement, 2026-09-08)

The owner approved the homepage redesign and a smaller site for large clients
with multiple connected needs. This supersedes the old locked hub sitemap and
page-template density: seven marketing pages per language (Home, four service
details, two products), plus the existing approved privacy notices.

- Home is the expertise overview and contains the company approach and contact.
- Navigation: Expertiză / Expertise, Produse / Products, Cum lucrăm / How we work,
  Contact. Overview links target homepage sections; dropdowns retain detail links.
- Retire Services and Solutions hubs. Permanent redirects preserve old URLs and
  route to the appropriate homepage sections in both languages. Exclude redirect
  documents from the sitemap and keep static-host redirect fallbacks.
- Infrastructure & Cloud covers the full pillar; its five-stage modernisation
  process stays on the detail page. The homepage describes the broader engagement.
- Managed Services is the ongoing relationship across the IT environment.
- Detail pages use concise capability summaries, open layouts, related expertise
  and motion that respects reduced-motion settings. No new dependency is needed.
- Existing claims, product-disclosure, privacy and deployment policies still apply.

### Artwork and UI refinement (owner request, 2026-09-08)

The owner requested a further UI and copy check with generated imagery from a
separate agent. Decorative generated material studies are approved within this
redesign, superseding the older no-imagery restriction. Preserve the palette,
light navigation/footer, accurate diagrams and claims policy. Asset prompts and
delivery files are recorded in `docs/design-proposals/homepage/generated-artwork.md`.
Product-page navigation now uses the relevant product demo action, keeping one
conversion purpose throughout the page.

The owner subsequently rejected sharing one header image across the four service
pages. Give each service a distinct subject and composition within the same light
blue palette; retain the architectural image only on Infrastructure & Cloud.
Assign artwork explicitly per service and preserve the mapping across RO and EN.

The same correction applies to products: SEKNET and S-VPN each have their own dark
hero image, distinct from the homepage product-band background. Give the artwork
visible space and preserve the labelled conceptual summaries and demo actions.

### Header artwork motion (owner request, 2026-09-08)

The owner approved the new header images and requested animation using specialised
agents. Preserve the approved images and add restrained, image-aligned motion to
all six service/product detail headers in both languages. Use separate service
and product motion work plus independent lifecycle/accessibility QA. Provide a
pause control, honour reduced motion, suspend work offscreen and in hidden tabs,
and clean up on Astro navigation. No video downloads or new animation dependency
are needed for the chosen SVG/CSS and Web Animations implementation.
