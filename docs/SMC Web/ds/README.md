# Smart Control — Design System

A canonical brand & design-token system for **Smart Control (SMC)** — a Romanian B2B IT services company that positions itself as a *Trusted Service Delivery Partner* for infrastructure, cybersecurity, software development and managed services.

> Founded **2003** · **650+** projects delivered · **250+** clients · **4 ISO** certifications (9001 · 27001 · 14001 · 45001) · Headquartered in Bucharest, Romania.

This system contains the brand foundations only — **logo / colour / type / spacing / iconography rules**, plus reusable component tokens. The marketing website and product UIs (SEKNET, Asset Management) are being designed in separate sessions and are intentionally out of scope here.

---

## Sources this system is built from

All upstream materials are mirrored in `/source/` so a future maintainer can re-derive decisions from the originals.

| Source | Mirror in this project | What it is |
|---|---|---|
| `SmartControl_Brand_Guide_2026.html` | `source/Brand_Guide_2026.html` | Canonical brand guide — colours, tokens, type, voice, do/don't, pillars. Treat as ground truth. |
| `SmartControl_Designer_Brief_2026.md` | `source/Designer_Brief_2026.md` | Scope of missing visual assets (logo variants, icon decision, PPTX theme) — context for what is *still to be produced*. |
| `SmartControl_2026_Oferta_Servicii_v5.pdf` | `source/Oferta_Servicii_2026.txt` | The 10-page 2026 services offering. Source of product copy, pillar definitions, voice samples. |
| `logo copy.png` | `assets/smartcontrol-mark.png` | The only existing logo asset — a circular blue gradient mark with a white swoosh and dark navy arrow. Geometry-corrected here (the upload was vertically squashed ~6.7%; restored to a true circle) and used to derive the inverse / mono / duotone variants in `assets/`. |

There is no Figma file, no codebase, no live website crawl. Everything in this system is derived from the four files above and is internally consistent with the 2026 brand guide.

---

## Index — what's in this project

```
/  ─ root
├── README.md                       this file
├── SKILL.md                        agent-skill front matter (for Claude Code import)
├── colors_and_type.css             all design tokens — colour, type, radius, shadow, spacing
│
├── assets/                         brand-owned visual assets
│   ├── smartcontrol-mark.png       official mark, geometry-corrected (transparent PNG, 683×683)
│   ├── smartcontrol-mark-white.png inverse — single-colour white, carved arrow gap (navy backgrounds)
│   ├── smartcontrol-mark-duotone.png two-tone — white circle + dark arrow (hero gradient)
│   ├── smartcontrol-mark-mono.png  single-colour deep navy, carved arrow gap (single-ink print)
│   ├── favicon.ico + favicon-16/32/192.png  favicon set, generated from the corrected mark
│   └── iso-badges.svg              the 5 ISO certification badges as one sprite
│
├── source/                         upstream source files (do not edit)
│   ├── Brand_Guide_2026.html
│   ├── Designer_Brief_2026.md
│   └── Oferta_Servicii_2026.txt
│
├── templates/                      starting points for consuming projects
│   ├── pitch-deck/                 8-layout 1920×1080 presentation (cover · divider · content · compare · pillars · metrics · quote · closer)
│   └── offer-onepager/             print-ready A4 offer one-pager
│
└── preview/                        per-token preview cards (Design System tab)
    ├── logo.html               logo lockups (primary / inverse / light / hero)
    ├── logo-mark.html          mark-only variants + minimum-size check
    ├── iso-badges.html         the 5 ISO certification roundels
    ├── iconography.html        the 12 canonical Lucide icons
    ├── email-signature.html    Outlook/Gmail signature block
    ├── favicon.html            favicon set preview
    ├── colors-primary.html     core blue ladder (6 stops)
    ├── colors-neutrals.html    ink ladder + surface tints
    ├── colors-compliance.html  the reserved teal + how to use it
    ├── colors-status.html      success / warning / danger (product UI only)
    ├── gradient.html           the brand hero gradient
    ├── type-scale.html         display → label, in order
    ├── type-families.html      Segoe UI / Inter / JetBrains Mono
    ├── radii.html              the 5-step radius scale
    ├── shadows.html            navy-tinted shadow ladder
    ├── spacing.html            4-pt spacing scale
    ├── buttons.html            primary / secondary / accent / ghost
    ├── badges.html             default + compliance variants
    ├── inputs.html             text field states
    ├── callout.html            blue-wash info block (signature element)
    ├── table.html              navy-header data table
    ├── service-pillar.html     the 4 canonical service-pillar cards
    └── metric.html             40% · 3× · 98% metric block
```

---

## Brand context

The brand serves IT decision-makers (CIO, CTO, IT Director) at mid-market and enterprise companies in Romania and abroad. Tone is **technical, restrained, partner-not-vendor**. The four canonical service pillars must be referenced by their exact Romanian names — never invented or paraphrased:

| 01 | Infrastructură & Cloud |
| 02 | Securitate & Conformitate |
| 03 | Software & Automatizare |
| 04 | Servicii Gestionate |

---

## CONTENT FUNDAMENTALS

How copy is written for Smart Control.

### Language
- **Romanian by default.** English versions get a `_EN` suffix. Romanian diacritics (ă, â, î, ș, ț) are **mandatory** — never ASCII fallback.
- **Technical terms stay in English** even inside Romanian copy: *cloud, DevOps, smart contracts, Kubernetes, refactoring* — do not translate.

### Voice & tone
SMC speaks as a **confident, technical partner** — never as a vendor pitching. The voice is:

- **Direct & concrete.** Lead with numbers, frameworks, certifications. *"650+ proiecte în 22 de ani, raport ROI la 90 de zile"* — not *"experiență vastă"*.
- **Consultative honesty.** SMC will openly tell a client when a technology is wrong for them. *"Nu propunem blockchain acolo unde o bază de date relațională este suficientă"* — this kind of self-restraint *is* the brand.
- **Partner, not supplier.** The phrase *"echipa proprie, nu subcontractori"* is a real differentiator and recurs.
- **Verbs of delivery.** *"Livrăm"*, *"operăm"*, *"implementăm"* — present-tense, first-person plural, active voice. Avoid *"oferim"*.

### Specific phrases (canonical — use verbatim)
- **"Trusted Service Delivery Partner"** — the tagline. Always English, never translated. Always italic when paired with the logo.
- **"echipă proprie, nu subcontractori"**
- **"cod sursă inclus"** (about the proprietary platforms)
- **"abordare consultativă"**, **"relație pe termen lung"**
- **"raport ROI la 90 de zile"**

### Compliance language
Always **name the framework**, never paraphrase. *"NIS 2"*, *"DORA"*, *"GDPR"*, *"ISO 27001"* — these are recognised by buyers and prove SMC is fluent. Compliance content is the **only** place the teal accent (`#1A7A6E`) appears.

### Casing & punctuation
- Sentence case for headings. Title Case is reserved for product names and proper nouns.
- En-dash for ranges (*22 ani*, *2003–2026*); em-dash for explanatory inserts.
- Bullets use the chevron glyph `›` in marketing copy, not `•` and not `*`.

### Client references
**Never name clients in public materials** without explicit per-use approval. Use generic shorthand: *"o bancă românească"*, *"un operator telecom"*, *"un client din sectorul financiar"*. Always end with a measurable outcome.

### Forbidden register
Don't use: *"soluții inovatoare"*, *"de ultimă generație"*, *"lider de piață"*, *"world-leading"*, *"revoluționează afacerea"*, *"transformare digitală"* (used alone — it's a buzzword without numbers). Don't hype AI or blockchain without a concrete use case attached. Avoid emoji entirely.

---

## VISUAL FOUNDATIONS

What the brand looks like — the answer to *"is this on-brand?"*.

### Colour
- **Spine of the system: blue.** Six stops from `#040C2B` (midnight) through `#0E1F5B` (deep navy, the primary) to `#7AB4E8` (sky). The full ladder is in `colors_and_type.css`.
- **One non-blue colour: teal `#1A7A6E`.** Reserved exclusively for compliance content. Never a decorative accent.
- **Surfaces are warm-blue, not neutral grey.** Page background is `#F3F6FC` (page wash); info callouts are `#EDF5FC` (blue wash). Cards are pure white. Plain `#F5F5F5` neutral greys feel off-brand — keep the wash.
- **Status colours exist for product UI only.** Don't use red/green/amber on marketing surfaces.

### Type
- **Segoe UI everywhere.** It's the Microsoft system font — chosen because SMC's clients live in Outlook, Word, PowerPoint. On surfaces without Segoe UI (this design system, the web), the open-source substitute is **Inter** (Google Fonts) — the most widely-used B2B sans on the web.
- **Mono = Courier New** in the brand guide, **JetBrains Mono** in this system (better screen rendering at small sizes; same fixed-width feel).
- **Three weights only:** 400 body, 600 H3 / links / labels, 700 H1+H2. 500 reserved for nav, 800 for hero display.
- **Tight letter-spacing on headings** (`-0.5px` on H1+). **Wide letter-spacing (`2px`) + uppercase on labels** — this little eyebrow above section titles is a signature.

### Spacing & rhythm
- 4-pt scale (`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80`). Sections breathe with `48–64px` of vertical space. Cards have `24×28px` internal padding.
- Content is constrained to **`max-width: 1100px`** centred — never edge-to-edge body copy.

### Backgrounds & imagery
- **No photography** as the default. The brand is geometric: blocks of colour, the hero gradient, the logo mark. Deliberate decision documented in the designer brief — keeps cost predictable and reinforces the technical, restrained feel.
- The single permitted hero background is the **brand gradient** (`--sc-gradient-hero`). Used on PowerPoint covers, web hero banners, footer panels. Never behind body copy.
- **No patterns, no textures, no grain, no hand-drawn illustration.** Everything is hard-edged, vector, flat.

### Animation
- **Minimal.** 150ms ease on hover; that's the budget. No bounces, no scroll-triggered choreography, no Lottie. The brand reads "operational" and "audited"; motion would break the register.

### Hover & press states
- **Buttons:** primary navy → midnight (darker). Secondary ghost → fills with blue-wash. Accent bright-blue → darkens to royal.
- **Links:** bright blue → royal blue on hover. Underline persists (3px offset).
- **Press:** 1px `translateY(1)` for tactile feedback. No scale, no shadow change.
- **Focus:** 3px ring in `rgba(68,135,220,0.30)` — visible but unobtrusive.

### Borders
- Hairlines are `#E5E7EB` for neutral, `#D6E8F7` (blue-wash border) for tinted areas. The eyebrow rule under a section title is a **2px** `#D6E8F7` underline — this is a signature element.
- Cards are **borderless** by default — they sit on shadow alone. Borders only appear on dark-on-light contrast pairings (logo tile on white, callout on blue-wash).

### Shadows
A **navy-tinted** ladder, never neutral black:
- `xs` `0 1px 2px rgba(14,31,91,0.06)` — almost nothing
- `sm` `0 2px 8px rgba(14,31,91,0.06)`
- `md` `0 2px 12px rgba(14,31,91,0.08)` — default card
- `lg` `0 12px 32px rgba(14,31,91,0.14)`
- `xl` `0 24px 56px rgba(4,12,43,0.22)` — modal / overlay
- `focus` `0 0 0 3px rgba(68,135,220,0.30)` — focus rings

### Corner radii
- `4 / 6 / 10 / 14 / 16px` — restrained. Pills only on badges. No `border-radius: 50%` cards, no extreme squircles. The brand reads serious; tight radii reinforce that.

### Transparency & blur
- Avoid both. The brand is opaque and solid. Blur permitted only on in-product modal scrims.

### Cards
- Background white, `border-radius: 16px`, shadow `md`, **no border**. Pad `24×28px`. Stack with `16px` vertical gap.
- Variant: **info card** (blue-wash, `1px` blue-border tinted border, `10px` radius). Used for callouts and side notes.
- Variant: **compliance card** (teal-tint background, teal border, teal heading) — for NIS 2 / DORA / GDPR / ISO blocks only.

### Layout rules
- Marketing surfaces use a **1100px centred container** with `40px` horizontal padding.
- Tables are full-width inside their container, with a navy header bar (`#0E1F5B`) and white rows.

### Signature visual moves (the things that make something feel SMC)
1. The **uppercase wide-letterspaced eyebrow** (`SECTION TITLE`) over an H2, with a 2px blue-wash rule under it.
2. The **metric pattern** — a giant number (`40%` `3×` `98%`) over a one-line plain-text caption.
3. The **navy → bright-blue gradient diagonal** as cover background.
4. The **pillar count card** with a tiny `01` tag above the pillar name.
5. **Hex code displayed as a typed-text pill** (`#0E1F5B` in mono on a blue-wash chip) — this turns "design system" cards into something that reads as engineering documentation.
6. The **white protection capsule** around the colored mark when placed over any dark or blue surface.

---

## ICONOGRAPHY

### Current state
The brand guide and services PDF **do not use icons** as such — they use Unicode glyphs (`›` for chevron bullets, `•` for plain bullets) and the certification badges drawn as text-set seals. There is no icon font, no SVG sprite, no Lucide adoption — but the **designer brief explicitly recommends Lucide** as the canonical set if/when icons are introduced.

### Decision adopted by this design system
- **Canonical icon set: [Lucide](https://lucide.dev/)** — open-source MIT, ~1400 glyphs, 1.5px stroke, rounded caps. Matches the technical-but-warm voice. Loaded via CDN: `https://unpkg.com/lucide@latest`.
- **Stroke weight:** 1.5px (default). Never filled, never duotone.
- **Grid:** 24×24px default; 20×20px in dense product UI; 32×32px in marketing pillar cards.
- **Colour:** icons inherit `currentColor`. In the brand context that means navy (`--sc-deep-navy`) on light backgrounds, sky (`--sc-sky`) on dark.
- **No emoji.** Anywhere. The brief is explicit — emoji read as off-brand. Use the chevron `›` (U+203A) for bullets in marketing copy; use Lucide icons everywhere else.

### Logo usage hierarchy

**The full-colour primary lockup is the default — always reach for it first.** Design surfaces to be light so the primary lockup can sit on them (white or page-wash; the gradient as an accent band, not the canvas). The inverse, duotone and mono variants exist *only* for surfaces where the primary genuinely cannot work — a navy footer, the hero gradient, single-ink print.

### Brand vector assets stored in `/assets/`

| File | Use |
|---|---|
| `smartcontrol-mark.png` | The **official** circular gradient mark on transparent background, geometry-corrected to a true circle (683×683, square). Drop it in at min 48px; never below 24px. Use as-is, do not re-trace or alter colours. |
| `smartcontrol-mark-white.png` | Single-colour white inverse with a carved gap outlining the inner arrow — for solid navy / dark backgrounds. |
| `smartcontrol-mark-duotone.png` | Two-tone inverse (white circle, dark navy arrow, knocked-out swoosh) — for the hero gradient and mid-blue surfaces. |
| `smartcontrol-mark-mono.png` | Single-colour deep-navy mono with carved arrow gap — single-ink print (stamps, fax, engraving). |
| `iso-badges.svg` | The four ISO certifications (9001, 27001, 14001, 45001) as a horizontal sprite. Re-drawn as simple navy-on-white roundels. |

The **wordmark** (`Smart` navy + `Control` bright-blue) is composed in HTML/CSS — see `preview/logo.html` for canonical lockups. Avoids re-drawing a wordmark in SVG until SMC's designer produces an official typeset version (see `source/Designer_Brief_2026.md` §1).

### ⚠️ Substitutions to flag
1. **Segoe UI → Inter.** Segoe UI is a Microsoft system font and cannot be redistributed via Google Fonts. Inter is the de-facto open-source B2B sans on the web and the closest match in proportion and neutrality. **Action:** if SMC owns or licenses Segoe UI for web, please provide the WOFF2 files and update `colors_and_type.css`.
2. **Courier New → JetBrains Mono.** Courier New ships with Windows but isn't a great web font. JetBrains Mono is the closest open-source replacement with better screen rendering.
3. **Logo vector still pending.** The mark exists only as raster PNG. This system corrected its geometry (the source was a squashed ellipse) and derived the inverse / mono / duotone raster variants the 2026 designer brief calls for — but the SVG set and favicon ICO still require the designer's hand-drawn vector.

---

## How to use this system

- **For any new SMC artifact** (slide, one-pager, email, document): include `colors_and_type.css`, use the `sc-*` classes, copy `assets/smartcontrol-mark.png` into the new project. Reach for the preview cards in `/preview/` for the canonical look of each token.
- **For new components:** before designing, check whether an existing token covers it. If you need a new colour, you almost certainly don't — derive from the existing ladder. The compliance teal is the only sanctioned non-blue.
- **For Claude Code / agent skills:** see `SKILL.md` — this folder works as a portable skill when copied into a `.claude/skills/` directory.
