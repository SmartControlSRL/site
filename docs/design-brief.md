# SmartControl.ro — Design & Motion Brief

> Visual/motion spec for www.smartcontrol.ro. Companion to the project brief (`smartcontrol-ro-brief.md`). Built on the existing SmartControl design system in Claude Design; defines tone, page architecture, the light/dark rhythm, motion, iconography, and references. Ready-to-paste Claude Design prompt at the end (§12).

## 1. Direction

Modern, premium, **approachable-but-engineered** enterprise aesthetic for a 20-year IT services + cybersecurity firm. **Light-first**: the site is predominantly light and the **logo always sits on white/light surfaces**. Drama comes from a few deliberate dark "showcase" moments, not from an all-dark theme. This is a **multi-page** site, not a one-page landing — products and the cloud offering each get full, deep pages. Motion reads as *precision, not decoration*; for enterprise buyers, restraint signals trust.

## 2. Light / dark rhythm

Light is the default. The **nav/header is always light on every page** (logo on white). Dark is reserved for three things only:
1. **Product-page heroes** (the products earn a dramatic dark opener).
2. The **homepage products band** (SEKNET teaser).
3. **Closing CTA bands.**

Footers stay light (logo on white). Everything else is light. Don't add more dark zones — overuse kills the contrast effect.

## 3. Page inventory & templates

A multi-page architecture with two reusable templates.

**Pages**
- **Home** — rich single page that teases services/products **and absorbs the About, Partners, Contact, and (minimal) legal content as sections**.
- **Cloud & Modernization** ("cloudification") — flagship solution page; the deepest service page; home of the 5-stage methodology.
- **Security & Compliance**, **Software & Automation**, **Managed Services** — service detail pages.
- **SEKNET**, **S-VPN** — one full product detail page each.
- Services hub + Products index (light landing pages that route into the above).

No standalone About / Partners / Contact / Privacy / Terms / Cookies pages — that content lives in Home sections (footer legal links point to in-page anchors).

**Template A — Product detail page** (SEKNET / S-VPN): dark hero → light overview → feature/module grid → spec table → use cases → integrations → dark CTA → light footer.

**Template B — Service / solution detail page** (Cloud & Modernization is the flagship instance; Security / Software / Managed reuse a lighter version): light hero → context/problem → capabilities (bento) → signature section (for Cloud: the 5-stage methodology) → proof → dark CTA → light footer.

## 4. Color

- **Light base:** white / off-white / very light neutral. Near-black or dark-slate text.
- **Accent:** one luminous brand accent (from your tokens). On light it carries CTAs, links, active states, the network animation; on dark it *glows*.
- **Dark zones:** deep charcoal/navy (never pure black) so accent + abstracts glow. Light text, light-on-dark hairlines.
- **Surfaces:** light hairline borders + soft shadows on light; subtle elevation, no heavy drop shadows.

## 5. Typography

- Clean geometric/grotesque **sans** for UI and big confident display headings.
- A **monospace** for technical labels, eyebrows, stats, and spec tables — reinforces the engineered feel.
- Tight display tracking; generous body line-height; strong hierarchy, few weights.

## 6. Iconography — Hugeicons

- Library: **Hugeicons** (React/Vue/Svelte/SVG/icon-font packages + Figma plugin — Figma for design, React/SVG for the Astro build).
- **Locked style: Stroke Standard** — clean, neutral, professional; pairs well with light backgrounds. *(Alt for a more technical edge: Stroke Sharp. Pick one, never mix.)*
- Treatment: consistent stroke weight + size grid; neutral by default, **accent on hover/active**. Treat the chosen style as a design token.

## 7. Motion language

Principle: light zones stay calm and crisp; dark zones (product heroes, products band, CTA) carry richer motion and glow.

**Background animations**
- *Light hero (home, Cloud, service pages):* very subtle — faint network/node lines + a soft gradient-mesh drift in brand tints, quiet behind the headline.
- *Dark zones:* the visible **animated network-node graph** (drifting points + connecting lines — ties to the monitoring/connectivity and blockchain story) + soft accent glow.

**Scroll & reveal**
- Sections fade + rise on enter, staggered for grouped cards/rows.
- **Count-up stats** in view (650+, 250+, 25+, 20+).
- **5-stage methodology** (on the Cloud page) as a scroll-pinned vertical stepper with an accent progress rail that fills as you scroll.
- Subtle parallax on background layers.

**Micro-interactions**
- *Light:* hover = soft-shadow lift + slight scale; animated accent underline on links.
- *Dark:* hover = accent border-glow lift (esp. SEKNET's 5 module cards).
- Nav: sticky shrink on scroll; smooth animated mobile menu.
- Partners: subtle infinite marquee or hover-highlight grid.

**Page transitions:** smooth fade/slide between routes via **Astro View Transitions** (native) — important now that it's genuinely multi-page.

**Accessibility:** honor `prefers-reduced-motion` — disable background loops and large motion, keep essential feedback. Non-negotiable; also protects enterprise users on locked-down machines.

## 8. Motion build stack (for the code phase)

- **GSAP + ScrollTrigger** — scroll reveals, count-ups, the pinned 5-stage section.
- **Lightweight WebGL/Three.js or a 2D canvas** — the node-graph background in dark zones (and the faint light-hero version).
- **CSS** — hover/micro-interactions and simple transitions.
- **Astro View Transitions** — page transitions.
- Calibration: many "animation showcase" sites go heavy on 3D (agency/portfolio style); for an enterprise buyer that reads as gimmicky. Keep backgrounds ambient, reveals crisp, 3D restrained.

## 9. Imagery & abstracts

- For products (SEKNET, S-VPN) use **abstract "feature" graphics** — geometric/data-motif visuals styled to the brand — **not literal screenshots**. More premium, avoids exposing real consoles, and they glow on the dark product heroes.
- Certification and partner logos as clean, consistent components (grayscale → color on hover optional).

## 10. Page-by-page treatment

**Home (light, two dark bands) — now the catch-all page**
Light hero (logo on white, faint network/gradient background, word-by-word headline reveal, glowing email CTA) → count-up stats → **About/company** (founding 2003, mission, team 50/500+ yrs, why-us pillars, certifications & compliance) → services bento (four areas, staggered reveal, soft-shadow hover) → **DARK** SEKNET/products teaser band (glow, node bg, abstract visual) → Cloud & Modernization teaser → **partners** logo grid (light) → **DARK** closing CTA → **contact** (email/address/map) → **light footer** with email and minimal legal (privacy/terms via in-page anchors).

**Product detail pages — SEKNET / S-VPN (Template A)**
Light nav (logo on white) → **DARK hero**: product name + tagline glow, animated node background, abstract feature visual, email CTA → light overview ("what it is / who it's for") → feature/module grid (SEKNET: the 5 modules with glow-lift hover; S-VPN: VPN/MFA/WAF/endpoint/UTM/console) → mono **spec table** (SEKNET: 50k+ events/sec, <60s, 99.9%, encryption, audit log; S-VPN: 20 Gbps+, 10k+ tunnels, 400+ SSL, 200+ S2S) → use cases → integrations → **DARK** CTA → light footer. Both reuse this template with their own content + abstracts.

**Cloud & Modernization — flagship "cloudification" page (Template B)**
Light nav → light hero (market-context hook: hardware-cost pressure → re-architecture as the smart alternative; email CTA) → "the pressure" context section (CAPEX→OPEX, refresh deferral) → Infrastructure & Cloud capabilities (bento) → **signature section: the 5-stage methodology** as a scroll-pinned stepper with accent progress rail (Fast Track → Assessment/Quick Wins → Refactoring Plan/ROI → Agile Implementation/Knowledge Transfer → Continuous Observability/90-day ROI) → ROI/business-case proof → **DARK** CTA → light footer.

**Service detail pages — Security / Software / Managed (Template B, lighter)**
Light hero → short intro → capability bento → relevant proof (certs/compliance for Security; tech/stack motifs for Software; SLA/coverage for Managed) → **DARK** CTA → light footer.

## 11. Curated inspiration & references

**Saaspo — by your industry / page type**
- Security — https://saaspo.com/industry/security-saas-websites-inspiration
- Cloud — https://saaspo.com/industry/cloud-saas-websites-inspiration
- Infrastructure — https://saaspo.com/industry/infrastructure-saas-websites-inspiration
- Crypto — https://saaspo.com/industry/crypto-saas-websites-inspiration
- Enterprise page — https://saaspo.com/page-types/saas-enterprise-page-examples
- Product page — https://saaspo.com/page-types/saas-product-page-examples
- Why-us page — https://saaspo.com/page-types/saas-why-us-page-examples

**Saaspo — style / assets**
- Bento — https://saaspo.com/style/bento
- Technical — https://saaspo.com/style/technical
- Greyscale / Black & White (for the light-first tone) — https://saaspo.com/style/greyscale , https://saaspo.com/style/black-and-white
- Scroll Animations — https://saaspo.com/style/scroll-animations
- Feature Abstracts (product visuals) — https://saaspo.com/assets/feature-abstracts

**landing.love — motion in action (full-page video)**
- Technology — https://www.landing.love/categories/technology/
- SaaS — https://www.landing.love/categories/saas/
- GSAP — https://www.landing.love/collection/gsap/
- WebGL — https://www.landing.love/collection/webgl/

**component.gallery — UI patterns** (accordion, tabs, popover); enterprise design-system references incl. Red Hat and Elastic UI — https://component.gallery/components

**cta.gallery — for the single email CTA:** Button & Navigation — https://www.cta.gallery/categories/button

**craftwork.design** — browse Tech / Web3 / AI / Finance — https://craftwork.design/curated/websites

**Reference sites to study** (modern, technical; note the restraint): Neon (neon.com), ente (ente.com), Tempo (tempo.xyz), Measured (measured.site), Remix (remix.run); plus enterprise leaders — Vercel, Linear, Cloudflare, Datadog, Wiz. Many are dark; translate their *structure and restraint* into our light-first system, not the dark palette.

**Icons:** Hugeicons — https://hugeicons.com/?via=Abraham (Stroke Standard; Figma plugin for design, React/SVG packages for build).

## 12. Ready-to-paste Claude Design prompt

> Design a modern, **light-first, multi-page** enterprise IT/security website for Smart Control using our existing brand tokens. The **nav/header and footer are always light so the logo sits on white on every page**. Tone: clean, premium, approachable-but-engineered — geometric sans for UI with **monospace** accents for stats/labels/spec tables, generous whitespace, **bento-grid** sections, hairline borders, soft shadows. Reserve dark "showcase" treatment for three things only: **product-page heroes**, the homepage products band, and **closing CTA bands** — there, add an ambient **animated network-node background** and soft accent glow. Light sections use crisp scroll reveals, **count-up stats**, and soft-shadow hover lifts. Use **Hugeicons, Stroke Standard style only**, accent-colored on hover. For product visuals use **abstract "feature" graphics, not literal screenshots**, styled to the brand. Smooth, intentional motion only; honor reduced-motion.
>
> Show me these pages:
> 1. **Homepage** (this is also the catch-all page) — light hero → count-up stats → About/company (mission, team, certifications) → bento services → dark SEKNET/products band → Cloud teaser → partners logo grid → dark CTA → contact (email/address) → light footer with minimal legal links.
> 2. **SEKNET product page** — dark hero (product glow + node background + abstract visual) → overview → 5-module grid → mono spec table → integrations → dark CTA. (This is the product-page template; S-VPN reuses it.)
> 3. **Cloud & Modernization page** ("cloudification") — light hero with the modernization hook → market-context section → capabilities bento → the **5-stage methodology as a scroll-pinned stepper** → ROI proof → dark CTA.
