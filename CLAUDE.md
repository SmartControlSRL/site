# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is the project for **www.smartcontrol.ro** — the marketing website for Smart Control SRL, a Romanian enterprise IT services & cybersecurity company. **Phase 1 (scaffold) is done:** Astro 5 + Tailwind 4 + built-in i18n, brand tokens ported to the Tailwind theme, self-hosted fonts, base layout (Nav/Footer), and placeholder RO `/` + EN `/en/` homepages that build clean.

## Commands

```bash
npm install        # deps (Node 22+)
npm run dev        # local dev server
npm run build      # static build → dist/
npm run preview    # serve the built dist/
npm run check      # astro check (type-check; must stay 0 errors)
```

## Toolchain pin — do NOT "upgrade" blindly

Pinned to **Astro `~5.18.2` + `@tailwindcss/vite` `~4.1.18`**, with an npm `overrides` forcing a single **`vite@^6.4.3`** across the tree. This is deliberate: Astro 6 ships Vite 7, and `@tailwindcss/vite@4.3.0` pulls Vite 8 / rolldown — the two combos produce a `tsconfigPaths` rolldown binding crash at build and a dual-Vite type clash in `astro check`. The override de-dupes Vite so both build and type-check pass. Re-evaluate the whole trio together before bumping any one of them.

The two specs are the source of truth and should be re-read before any build work:
- `docs/smartcontrol-ro-brief.md` — **project brief**: sitemap, content-per-page, stack, functional/non-functional requirements, locked decisions, build phases.
- `docs/design-brief.md` — **design & motion brief**: light/dark rhythm, page templates, motion stack, iconography, ready-to-paste design prompt.
- `docs/SMC Web/ds/` — the **brand design system** (`README.md` + `colors_and_type.css`). This is the canonical token source. The other files under `docs/SMC Web/` (`*.dc.html`, `*.js`) are design-tool exports/mockups, not the codebase.

## Stack (scaffolded)

- **Astro 5 + Tailwind 4**, fully static (SSG). No server runtime — the site has **no forms**; contact is email-only (`mailto:office@smartcontrol.ro`, lightly obfuscated against scrapers).
- React/Svelte islands **only where motion/interactivity needs them**; everything else is static `.astro`.
- Content in **Markdown/MDX content collections**.
- **i18n: RO + EN, both first-class from launch.** RO default at `/`, EN under `/en/`, full parity across every page. Use Astro built-in i18n.
- Motion stack: **GSAP + ScrollTrigger** (scroll reveals, count-ups, the pinned 5-stage stepper); the node-graph background is a **2D `<canvas>`, NOT Three.js/WebGL** (keeps Core Web Vitals green); CSS for micro-interactions; **Astro View Transitions** for page transitions. Render all motion as **deferred Astro islands** so it never blocks first paint, and gate everything behind `prefers-reduced-motion`. (Owner wants it to look polished — invest in the animation quality, just not in JS weight on the critical path.)
- Analytics: **self-hosted Umami (EU), cookieless.** Combined with no forms, no Google Maps, and self-hosted fonts, the site sets **zero cookies → no consent banner** (and the claim is actually true — important for a GDPR/NIS2/DORA vendor).
- **Self-host fonts (WOFF2).** Do NOT load the Google Fonts CDN — it transfers visitor IPs to Google in the US, the same data-transfer problem that got the Google Map dropped.
- **No Google Maps** (dropped — sets cookies, US data transfer). Contact section is email + address only; a static map image is acceptable if a visual is wanted.
- Hosting: **Vercel free tier for team validation / preview only → production on the company's own EU VPS (datacenter).** EU data residency is part of the compliance pitch. Note: Vercel's Hobby (free) plan is **non-commercial** — never point the production `smartcontrol.ro` domain at it; use it for preview URLs only.

When translating design tokens, put them in the **Tailwind theme** and reference by name — never hardcode hex. The tokens live in `docs/SMC Web/ds/colors_and_type.css` as `--sc-*` CSS variables.

## Sitemap (locked)

The site is **multi-page**, but Home is a catch-all that absorbs About / Partners / Contact as in-page sections. There are **no** standalone About/Partners/Contact pages, **no cookie policy, and no terms page** (zero cookies, no forms, no e-commerce → none needed). **Exception: the privacy policy gets its own page** — `/confidentialitate` (RO) + `/en/privacy` (EN), linked from the footer, rendered as accessible HTML (convert `docs/Politica de confidentialitate.pdf`, do NOT link the raw PDF). Verify the policy text matches the no-forms / cookieless / self-hosted-Umami reality before publishing.

- `/` — Home (hero, stats, About, services bento, products teaser, Cloud teaser, partners, CTA, contact, footer)
- `/servicii` — Services hub →
  - `/servicii/cloud` — **Cloud & Modernization** (the flagship/deepest page; home of the 5-stage methodology)
  - `/servicii/securitate`, `/servicii/software`, `/servicii/managed` — lighter service pages
- `/solutii` — products index →
  - `/solutii/seknet`, `/solutii/s-vpn` — one full product detail page each

**Conversion / CTAs (two asks, scoped):**
- **Primary, site-wide:** "Programează evaluarea gratuită de 2 zile" → `mailto:office@smartcontrol.ro?subject=Evaluare gratuită`. The single ask on Home, services, Cloud, footer.
- **Products only** (SEKNET, S-VPN pages + the Home products-teaser band): "Cere un demo" → `mailto:` with a product-specific subject (`Demo SEKNET` / `Demo S-VPN`) so inbound self-routes. Never put both asks competing on the same view.

## Two page templates

- **Template A — product detail** (SEKNET, S-VPN): dark hero → light overview → module/feature grid → mono spec table → use cases → integrations → dark CTA → light footer.
- **Template B — service/solution** (Cloud is the flagship instance): light hero → context/problem → capabilities bento → signature section (Cloud's is the 5-stage scroll-pinned stepper) → proof → dark CTA → light footer.

## Design system — non-negotiable rules

Read `docs/SMC Web/ds/README.md` in full before building UI. The key constraints:

- **Light-first.** Nav/header and footer are **always light** so the logo sits on white on every page. Dark is reserved for exactly three things: product-page heroes, the homepage products band, and closing CTA bands. Don't add more dark zones — overuse kills the contrast.
- **Blue is the whole palette.** 6-stop blue ladder (`#040C2B`→`#7AB4E8`); `--sc-deep-navy #0E1F5B` is primary, `--sc-bright-blue #4487DC` is the accent. Surfaces are **warm-blue washes** (`#F3F6FC` page, `#EDF5FC` callouts), not neutral grey.
- **Teal `#1A7A6E` is the ONLY non-blue colour, reserved exclusively for compliance content** (NIS 2 / DORA / GDPR / ISO). Never decorative, never a CTA. Status red/green/amber are product-UI only — never on marketing surfaces.
- **Type:** Segoe UI (web substitute **Inter**) for everything; **JetBrains Mono** (sub for Courier New) for technical labels, stats, eyebrows, spec tables. Weights: 400/600/700, 500 nav only, 800 hero only.
- **Signature moves:** uppercase wide-letterspaced eyebrow with a 2px blue-wash rule under section titles; giant-number metric blocks; mono hex/stat pills; navy→bright-blue diagonal gradient on covers.
- **Icons: Lucide** (MIT, free; 1.5px stroke, accent on hover). Decided over Hugeicons to avoid commercial licensing. Pick one set, never mix.
- **Motion follows the design brief, NOT the brand-system restraint** (owner's call — the animated direction is wanted). Full GSAP + ScrollTrigger (count-ups, the pinned 5-stage stepper), an animated node-graph in dark zones, accent glow. Light zones stay calmer than dark zones, not motionless. The design-system README's "minimal motion / 150ms-hover-only / no scroll choreography" rule is **overridden**. Still honor `prefers-reduced-motion` — disable background loops and large motion (non-negotiable for locked-down enterprise clients).
- **Link text color must pass WCAG AA.** Bright-blue `#4487DC` is only **3.66:1** on white — fails AA for body text. Use **royal `#1F3C80`** (10.6:1) or deep-navy for link *text*; keep bright-blue for underlines, rules, and large headings only.
- Cards: white, 16px radius, soft **navy-tinted** shadow (never neutral black), no border. Tight radii (4/6/10/14/16). No photography, patterns, or textures — the brand is geometric and hard-edged. (The brand-system "no blur / no glow" rule is **overridden** for dark-zone accent glow, per the design brief.)
- **Type scale is web-native, not 1:1 with the tokens.** The design-system tokens (14px body, 44px display, 1100px container) were built for a pitch deck / A4 one-pager and are undersized for web. Keep the palette/shadow/radius/voice tokens as-is; derive a **separate responsive type scale** (fluid `clamp()`, larger body/hero) for the site.

## Content rules (RO copy)

- **Romanian by default with mandatory diacritics** (ă â î ș ț — never ASCII fallback). EN versions carry an `_EN` suffix in the design system, but on the site they live under `/en/`.
- Keep technical terms in English even inside RO copy (cloud, DevOps, Kubernetes, refactoring, smart contracts).
- Reference the four service pillars by their exact Romanian names: **Infrastructură & Cloud · Securitate & Conformitate · Software & Automatizare · Servicii Gestionate**.
- Canonical verbatim phrases: "Trusted Service Delivery Partner" (always English, italic with the logo), "echipă proprie, nu subcontractori", "cod sursă inclus", "abordare consultativă", "raport ROI la 90 de zile".
- Name compliance frameworks exactly ("NIS 2", "DORA", "GDPR", "ISO 27001") — never paraphrase.
- Marketing bullets use the chevron `›` glyph, not `•` or `*`. **No emoji anywhere.**
- Forbidden register: "soluții inovatoare", "de ultimă generație", "lider de piață", "transformare digitală" used alone, and hyping AI/blockchain without a concrete use case.
- **Never name clients publicly.** Partner logos only (no client names/logos/case studies — locked decision).

## Hard scope boundaries (locked)

- No forms of any kind — email contact only, no phone.
- No customer portal / product logins, no e-commerce/payments.
- No blog/insights, no careers (excluded permanently).
- No full CMS — content lives in-repo.

## Trust stats to reuse

650+ projects · 250+ clients · 25+ international · **20+ years (compute from the 2003 founding date — don't hardcode)** · 50 in-house specialists / 500+ cumulative years · **4 ISO certifications (9001 / 27001 / 14001 / 45001)** + GDPR / NIS2 / DORA (these three are regulatory frameworks, not ISO certs — render them distinct from the ISO roundels, in the reserved teal). Product spec headlines — SEKNET: 50k+ events/sec/node, <60s alerting, 99.9% uptime; S-VPN: 20 Gbps+, 10k+ IPSec tunnels, 400+ SSL, 200+ site-to-site.
