# Build Spec — `/servicii/cloud` (Cloud & Modernization)

**Source export:** `docs/SMC Web/Cloud.dc.html` (visual ground truth, client-approved — match closely)
**Target route:** `/servicii/cloud` (RO) + `/en/servicii/cloud` (EN). Template B (service/solution, flagship).
**Motion lib:** `docs/SMC Web/motion.js` (port to a deferred Astro island wired with GSAP/ScrollTrigger per CLAUDE.md, or port the vanilla functions verbatim — see "Deviations").

## Page-level shell

- `font-family: Inter` (self-host `Inter Variable` → `--font-sans`); base body color `#374151` → `text-slate`, body `font-size: 16px`, `line-height: 1.65`. Export sets page body bg `#FFFFFF` (`--color-surface`/`text-white`/`bg-surface`). NOTE: global.css `body{ background: var(--color-page) #F3F6FC }` — the export root div forces white; render the page content on white (`bg-surface`).
- Root wrapper has `overflow-x: hidden`.
- `html { scroll-behavior: smooth }` and full `prefers-reduced-motion` reset already in global.css.
- `::selection { background: rgba(68,135,220,0.25) }` — present in export, add to global if not there.
- Section order top→bottom: **Nav → Hero → "De ce acum" (3 cards) → "Flux 5 etape" (#flux stepper) → "Stack / Ce livrăm" → CTA (#contact, dark) → Footer.**
- Both `#flux` and `#contact` carry `scroll-margin-top: 76px` (nav offset).

---

## SECTION 1 — NAV (light, shared)

- **Shared component** — reuse existing `src/components/Nav.astro`, but the export's nav differs from current scaffold (5 link items incl. SEKNET + S-VPN as separate items, active-page underline, full-label CTA). Match the export for this page family or extend Nav. Document differences below.
- **Background:** `#FFFFFF` (`bg-surface`). Fixed, `top/left/right:0`, `z-index:50`.
- **Padding:** `18px 40px` (shrinks to `11px 40px` on scroll via `initNavShrink`).
- **Border-bottom:** `1px solid rgba(229,231,235,0)` → animates to `#E5E7EB` (`--color-border`) on scroll.
- **Transition:** `padding 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s`. Scrolled box-shadow `0 2px 12px rgba(14,31,91,0.08)` (= `--shadow-md`).
- **Inner container:** `max-width: 1180px; margin:0 auto`; flex, `align-items:center; justify-content:space-between; gap:32px`. (NOTE: export uses 1180px; theme `.container` is 1200px max — flag.)
- **Logo:** `<a href="Home.dc.html">` → in Astro `href={p('/')}`. Mark `ds/assets/smartcontrol-mark.png` (34×34) → `/smartcontrol-mark.png`. Wordmark: `font-size:17px; font-weight:700; letter-spacing:-0.3px; color:#0E1F5B` (`text-navy`) with "Control" in `#4487DC` (`text-bright`). Verbatim: **Smart**Control.
- **Nav links** (`font-size:13.5px; font-weight:500; color:#374151` slate; hover `color:#0E1F5B` + `border-bottom-color:#4487DC`; `padding-bottom:3px; border-bottom:2px solid transparent`):
  - **Servicii** → `Home.dc.html#servicii` → `/#servicii` (or `/servicii`)
  - **SEKNET** → `SEKNET.dc.html` → `/solutii/seknet`
  - **S-VPN** → `SVPN.dc.html` → `/solutii/s-vpn`
  - **Cloud & Modernization** → `Cloud.dc.html` → `/servicii/cloud` — ACTIVE: `font-weight:600; color:#0E1F5B; border-bottom:2px solid #4487DC` (always-on underline)
- **CTA button** (verbatim label): **Solicită assessment** → `#contact`. `font-size:13.5px; font-weight:600; color:#FFFFFF; padding:9px 18px; border-radius:10px` (`--radius-md`); `background:#0E1F5B` (`bg-navy`); hover `background:#040C2B` (`bg-midnight`) + `box-shadow:0 4px 16px rgba(14,31,91,0.25)`.
- **Motion:** `data-screen-label="Nav"` (export tooling only, drop). `initNavShrink(nav)` called with defaults (`padBig:'18px 40px'`, `padSmall:'11px 40px'`).

---

## SECTION 2 — HERO (light)

- **Element:** `<header data-screen-label="Cloud Hero">`.
- **Background:** `linear-gradient(180deg, #F3F6FC 0%, #FFFFFF 100%)` (page-wash → white). `position:relative; overflow:hidden`.
- **Container:** inner `max-width:1180px; margin:0 auto`; **padding `190px 40px 100px`** (large top to clear fixed nav).
- **Decorative parallax blob** (absolute layer, `data-parallax="0.3"`, `pointer-events:none`, `inset:0`): a `680×680px` circle at `top:-160px; right:-140px`, `border-radius:999px`, `background: radial-gradient(circle, rgba(122,180,232,0.2), rgba(122,180,232,0) 65%)`, with CSS `animation: scDriftA 18s ease-in-out infinite alternate` (keyframe `scDriftA: translate(0,0) → translate(60px,40px)`).
- **Hero content carries `data-hero-scrub`** (whole inner block sinks + fades on scroll).

**Copy (verbatim):**
- **Eyebrow:** `Cloud & Modernization` — `font-family:'JetBrains Mono'; font-size:12.5px; font-weight:500; letter-spacing:2.5px; text-transform:uppercase; color:#4487DC` (`text-bright`); `padding-bottom:10px; border-bottom:2px solid #D6E8F7` (`--color-border-blue`). Intro fade `scFadeIn 0.8s ease-out 0.1s`.
- **H1** (`font-size:58px; font-weight:800; letter-spacing:-1.8px; line-height:1.1; color:#040C2B` `text-midnight`; `max-width:860px`). Split into per-word `<span>`s each `scWordIn` animated with staggered delays. Verbatim, with line break and the second line in bright blue `#4487DC`:
  > Hardware-ul se scumpește.
  > **[bright]** Aplicațiile tale nu trebuie.

  Word spans + delays (keep the stagger feel; in Astro these become the GSAP/`initWordFill`-style or CSS `scWordIn` per-word): "Hardware-ul" 0.25s · "se" 0.37s · "scumpește." 0.49s · `<br>` · "Aplicațiile" 0.67s · "tale" 0.79s · "nu" 0.91s · "trebuie." 1.03s (last four `color:#4487DC`).
- **Lead paragraph** (`font-size:18px; line-height:1.7; max-width:640px; color:#374151`; `scFadeIn 0.9s ease-out 1.2s`), verbatim:
  > Prețurile componentelor critice cresc sub presiunea cererii pentru infrastructură AI, iar bugetele de refresh nu mai ajung. **Re-arhitecturarea și optimizarea aplicațiilor** devine strategia principală — extragi mai multă performanță din infrastructura existentă, înainte să cumperi una nouă.
  - The bold span: `color:#0E1F5B; font-weight:600` (`text-navy`).
- **CTA row** (`margin-top:38px`, flex, `gap:16px`, wrap; `scFadeIn 0.9s ease-out 1.4s`):
  - **Primary button:** **Programează assessment-ul gratuit** → `#contact`. `font-size:14.5px; font-weight:600; color:#FFFFFF; padding:13px 26px; border-radius:10px` (`--radius-md`); `background:#4487DC` (`bg-bright`); `box-shadow:0 4px 18px rgba(68,135,220,0.35)`; hover `background:#1F3C80` (`bg-royal`) + `box-shadow:0 6px 24px rgba(68,135,220,0.45)`.
  - **Text link:** **Vezi fluxul în 5 etape ›** → `#flux`. `font-size:14.5px; font-weight:600; color:#4487DC; padding:13px 4px`; hover `color:#1F3C80`. NOTE: this is body-size link text in `#4487DC` (3.66:1) — see Deviations; render text as royal `#1F3C80`.

---

## SECTION 3 — "DE CE ACUM" (3 cards, light)

- **Element:** `<section data-screen-label="De ce acum">`. **Background:** white (inherits page). **Padding:** `40px 40px 110px`.
- **Container/grid:** `max-width:1180px; margin:0 auto`; `display:grid; grid-template-columns:repeat(3,1fr); gap:20px`. Grid wrapper carries **`data-skew="4"`** (scroll-velocity lean on the whole row).
- **Cards** (3): white, `border:1px solid #E5E7EB` (`--color-border`), `border-radius:16px` (`--radius-xl`), `padding:30px 32px`, `box-shadow:0 2px 12px rgba(14,31,91,0.06)` (= `--shadow-sm`; note `--shadow-md` is 0.08). `height:100%; box-sizing:border-box`. Hover: `transform:translateY(-5px); box-shadow:0 12px 32px rgba(14,31,91,0.14)` (= `--shadow-lg`); `transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s`.
  - **NOTE:** CLAUDE.md cards rule says "no border" — export uses a 1px border. Match export (border present); flag in Deviations as a judgment call.
- **Icon chip** per card: `44×44px; border-radius:10px` (`--radius-md`); `background:#EDF5FC` (`--color-blue-wash`); `border:1px solid #D6E8F7` (`--color-border-blue`); centered icon `22×22px; color:#0E1F5B` (`text-navy`).
- **Card title** `h3`: `margin:18px 0 0; font-size:17px; font-weight:700; color:#0E1F5B` (`text-navy`).
- **Card body** `p`: `margin:10px 0 0; font-size:14px; line-height:1.65; color:#6B7280` (`text-cool`).

**Cards (verbatim, in order):**
1. icon `trending-up` — **Costuri hardware în creștere** — "Cererea pentru infrastructură AI pune presiune pe lanțul de aprovizionare — memorie, stocare și GPU-uri la prețuri record, cu termene de livrare imprevizibile."
2. icon `recycle` — **Refresh-ul clasic nu mai e rentabil** — "Înlocuirea „la 5 ani" a serverelor devine tot mai greu de justificat în business case — capacitatea existentă e adesea folosită sub 40%." (NOTE: low-curly „ + straight " quotes around *la 5 ani* — preserve exactly.)
3. icon `rocket` — **Re-arhitecturarea câștigă** — "Containerizare, tuning aplicativ și migrare selectivă în cloud extrag performanță din ce ai deja — cu costuri predictibile, CAPEX→OPEX."

- **Motion per card** (`data-reveal` on the outer wrapper div, with the styled card nested inside):
  - Card 1: `data-reveal data-reveal-rotate="-4" data-drift="0.07"`
  - Card 2: `data-reveal data-reveal-delay="100" data-reveal-rotate="4"`
  - Card 3: `data-reveal data-reveal-delay="200" data-reveal-rotate="-4" data-drift="-0.07"`

---

## SECTION 4 — FLUX 5 ETAPE (#flux, scroll stepper, wash band)

- **Element:** `<section id="flux" data-band data-screen-label="Flux 5 etape">`. **Background:** `#F3F6FC` (`--color-page`/`bg-page`). **Padding:** `110px 40px`. `scroll-margin-top:76px`. **`data-band`** = band scale-in (0.94→1, corners 40px→0 on entry).
- **Container:** `max-width:1180px; margin:0 auto`.

**Header block (`data-reveal`):**
- **Eyebrow:** `Abordare` — mono, `font-size:12px; font-weight:500; letter-spacing:2.5px; uppercase; color:#4487DC; border-bottom:2px solid #D6E8F7; padding-bottom:10px`.
- **H2** (`data-word-fill="light"`): **Fluxul de lucru în 5 etape** — `margin:24px 0 0; font-size:38px; font-weight:700; letter-spacing:-1px; line-height:1.15; color:#0E1F5B` (`text-navy`); `max-width:700px`.
- **Paragraph** (`font-size:16.5px; max-width:640px; color:#6B7280` cool): "Nu propunem doar o actualizare tehnică, ci o re-arhitecturare strategică — un flux validat în 650+ proiecte, care minimizează riscurile și maximizează ROI."

**Stepper rig** (`ref=stepsRef`, `position:relative; margin-top:52px`):
- **Rail track:** absolute `left:25px; top:28px; bottom:28px; width:2px; background:#D6E8F7` (`--color-border-blue`).
- **Rail fill** (`ref=stepsFillRef`): absolute `left:25px; top:28px; height:0px; width:2px; background:linear-gradient(180deg,#4487DC,#7AB4E8)` (bright→sky); `box-shadow:0 0 12px rgba(68,135,220,0.5)`. Height driven by scroll via `initStepper`.
- **Each step** (`data-step`): `position:relative; display:grid; grid-template-columns:52px 1fr; gap:32px; padding:26px 0`.
  - **Dot** (`data-step-dot`): `52×52px; border-radius:12px` (between `--radius-md` 10 and `--radius-lg` 14 — flag, no exact token); default `background:#FFFFFF; border:1px solid #D6E8F7`; centered mono number `font-size:15px; font-weight:600; color:#9CA3AF` (faint). Active state (set by JS): `border-color:#4487DC; color:#0E1F5B; background:#EDF5FC; box-shadow:0 0 0 4px rgba(68,135,220,0.14)`. Transition `border-color 0.4s, color 0.4s, box-shadow 0.4s, background 0.4s`.
  - **Body** (`data-step-body`): `opacity:0.45` default → `1` when active; `transition:opacity 0.4s; max-width:760px`.
  - **Title row:** flex baseline, `gap:14px`, wrap. `h3` `font-size:20px; font-weight:700; letter-spacing:-0.3px; color:#0E1F5B`. **Pill (mono badge):** `font-size:11px; letter-spacing:1px; uppercase; color:#4487DC; padding:3px 10px; border:1px solid #D6E8F7; border-radius:999px; background:#FFFFFF`.
  - **Body `p`:** `margin:10px 0 0; font-size:14.5px; line-height:1.7; color:#6B7280`.

**Steps (verbatim, in order — number / title / pill / body):**
1. **01** · **Propunere de re-arhitecturare** · pill `Fast Track` · "Pentru clienții cu care avem deja o relație stabilă: valorificăm cunoștințele despre infrastructura existentă pentru a identifica punctele critice și propunem modernizări bazate pe date reale, nu pe estimări teoretice."
2. **02** · **Assessment inițial & Quick Wins** · pill `2 zile · gratuit` · "Inventariere automatizată cu platforma proprie de Asset Management, analiză de performanță prin instrumentele noastre de monitorizare, evaluarea gap-urilor NIS 2 / GDPR — și rezolvarea problemelor minore încă din primele zile."
3. **03** · **Planul de refactoring & business case** · pill `ROI estimat` · "Roadmap tehnic cu prioritizarea aplicațiilor pentru containerizare (Kubernetes-ready), analiză cost-beneficiu înainte de implementare și strategii de testare în staging cu planuri de rollback pentru zero-downtime."
4. **04** · **Implementare agilă & transfer de cunoștințe** · pill `DevSecOps` · "Containerizare și migrare pe Kubernetes / OpenShift / AKS / GKE, pipeline-uri CI/CD, integrare hibridă on-premise–cloud — plus workshop-uri tehnice și documentație pentru autonomia echipei tale."
5. **05** · **Observabilitate continuă & optimizare** · pill `Raport ROI la 90 de zile` · "Monitorizare proactivă cu soluția proprietară Smart Control, validarea ROI printr-un raport de performanță la 90 de zile și iterație continuă pe baza datelor de telemetrie."

- **Motion:** `initStepper(this.steps, this.stepsFill)` — no `dark` opt (light variant). Header block `data-reveal`; H2 `data-word-fill="light"`; section `data-band`.

---

## SECTION 5 — STACK / CE LIVRĂM (light)

- **Element:** `<section data-screen-label="Stack">`. **Background:** white. **Padding:** `110px 40px`. **Container:** `max-width:1180px; margin:0 auto`.

**Header (`data-reveal`):**
- **Eyebrow:** `Capabilități` (mono, same eyebrow style as #flux: 12px / 2.5px / `#4487DC` / 2px `#D6E8F7` rule).
- **H2** (`data-word-fill="light"`): **Ce livrăm concret** — same H2 style (38px/700/-1px/1.15/`#0E1F5B`/max-width 700px).

**Capabilities bento:** `margin-top:44px; display:grid; grid-template-columns:1fr 1fr; gap:20px` (2×2). Grid wrapper carries **`data-skew="4"`**.
- **Cards** (4): white, `border:1px solid #E5E7EB`, `border-radius:16px`, `padding:30px 34px`, `box-shadow:0 2px 12px rgba(14,31,91,0.06)`. `height:100%; box-sizing:border-box`. (No hover transform here, unlike Section 3.)
- **Card head:** flex, `gap:12px`, `align-items:center` — Lucide icon `20×20px; color:#4487DC` (bright) + `h3` `font-size:17px; font-weight:700; color:#0E1F5B`.
- **Bullet list:** `margin-top:16px; display:grid; gap:9px`; each row `font-size:14px; color:#374151` (slate), with a leading chevron `›` in `color:#4487DC; margin-right:8px` (per CLAUDE.md, chevron glyph, not •).

**Cards (verbatim — icon / title / 3 bullets):**
1. icon `container` — **Containerizare & orchestrare**
   - › Kubernetes · OpenShift · AKS · GKE
   - › Prioritizarea aplicațiilor Kubernetes-ready
   - › Migrare cu zero-downtime, rollback planificat
2. icon `git-branch` — **DevSecOps & CI/CD**
   - › Pipeline-uri CI/CD cu security gates
   - › Testare automată în staging
   - › Infrastructure-as-Code
3. icon `cloud` — **Integrare hibridă**
   - › On-premise ↔ cloud, fără lock-in
   - › Migrare selectivă — doar ce are sens economic
   - › CAPEX→OPEX cu costuri predictibile
4. icon `gauge` — **Observabilitate & ROI**
   - › Monitorizare proactivă cu SEKNET
   - › Raport de performanță la 90 de zile
   - › Iterație continuă pe date de telemetrie

- **Motion:** Header `data-reveal`. Cards: card1 `data-reveal`; card2 `data-reveal data-reveal-delay="80"`; card3 `data-reveal`; card4 `data-reveal data-reveal-delay="80"`. H2 `data-word-fill="light"`.

---

## SECTION 6 — CTA (#contact, dark band)

- **Element:** `<section id="contact" data-band data-screen-label="CTA (dark)">`. **Background:** `#040C2B` (`bg-midnight`). **Padding:** `110px 40px`. `position:relative; overflow:hidden`. `scroll-margin-top:76px`. **`data-band`** scale-in. This is one of the allowed dark zones (closing CTA).
- **Canvas** (`ref=ctaCanvasRef`): absolute `inset:0; width/height:100%; opacity:0.5` — animated node-graph via `initNetwork`.
- **Glow layer:** absolute `inset:0; background: radial-gradient(ellipse 60% 70% at 50% 40%, rgba(68,135,220,0.16), rgba(4,12,43,0) 70%)`.
- **Content:** `position:relative; z-index:1; max-width:760px; margin:0 auto; text-align:center`. Wrapped in `data-reveal`.

**Copy (verbatim):**
- **Eyebrow:** `Etapa 1 · gratuită` — mono, `font-size:12px; font-weight:500; letter-spacing:2.5px; uppercase; color:#7AB4E8` (`text-sky` — light accent on dark; NO underline rule here).
- **H2** (`data-word-fill="dark"`): **Assessment Inițial — 2 zile, fără angajamente** — `margin:22px 0 0; font-size:40px; font-weight:700; letter-spacing:-1px; line-height:1.15; color:#FFFFFF`.
- **Paragraph** (`font-size:16.5px; line-height:1.7; max-width:560px; margin:18px auto 0; color:rgba(226,233,245,0.7)`): "Identificăm împreună zona de interes prioritară și livrăm un raport de recomandări la final. Decizia de a continua îți aparține."
- **Email capture pill** (`margin-top:34px; display:inline-flex; align-items:stretch; gap:8px; padding:7px; background:rgba(255,255,255,0.05); border:1px solid rgba(122,180,232,0.25); border-radius:14px` (`--radius-lg`)):
  - `<input type="email" placeholder="email@companie.ro">` — `font-family:Inter; font-size:14.5px; color:#FFFFFF; background:transparent; border:none; outline:none; padding:10px 14px; width:230px`. **NOTE:** CLAUDE.md hard rule "No forms of any kind — email contact only." This `<input>` is visual only (no form action) but VIOLATES the no-forms rule — see Deviations. Recommended: replace with a static mailto button only.
  - **Button:** **Solicită assessment-ul** — `data-email-user="office" data-email-domain="smartcontrol.ro"` (mailto hydrated at runtime). `font-size:14.5px; font-weight:600; color:#FFFFFF; padding:11px 22px; border-radius:10px; background:#4487DC; box-shadow:0 0 28px rgba(68,135,220,0.45)`; hover `background:#3470C0` (`--color-mid-blue`) + `box-shadow:0 0 40px rgba(68,135,220,0.65)`.
- **Contact line below** (`margin-top:26px; font-family:'JetBrains Mono'; font-size:13px; color:rgba(226,233,245,0.55)`): `<span data-email-user="office" data-email-domain="smartcontrol.ro"></span>` (renders `office@smartcontrol.ro`) ` · www.smartcontrol.ro`.
- **Motion:** `initNetwork(ctaCanvas, { lineAlpha:0.18, dotAlpha:0.45, spread:24000, lineDist:140 })` (default colors `68,135,220` / `122,180,232`, default `maxNodes:110`, `speed:0.16`). Content `data-reveal`; H2 `data-word-fill="dark"`; section `data-band`; emails via `initEmails`.

---

## SECTION 7 — FOOTER (light, shared)

- **Shared component** — existing `src/components/Footer.astro` is a SIMPLER 2-column footer. The export footer is a richer 4-column layout. Decide: extend Footer to match export, or keep the scaffold's lighter footer. Documented here so the coder has the full export content.
- **Background:** `#FFFFFF` (`bg-surface`); `border-top:1px solid #E5E7EB`; **padding `64px 40px 40px`**. Container `max-width:1180px; margin:0 auto`.
- **Top grid:** `grid-template-columns:1.4fr 1fr 1fr 1.2fr; gap:48px`.

**Col 1 (brand):**
- Logo (mark + **Smart**Control wordmark, same as nav) → `/`.
- Tagline (`margin-top:14px; font-size:13.5px; font-style:italic; color:#6B7280`): **Trusted Service Delivery Partner** (always English, italic — per CLAUDE.md).
- Meta (`margin-top:18px; font-size:13px; line-height:1.7; color:#9CA3AF` faint): "Fondată în 2003 · 650+ proiecte livrate" `<br>` "ISO 9001 · 27001 · 14001 · 45001 · 27701". (NOTE: export lists FIVE ISO incl. **27701**; CLAUDE.md trust-stats list only four ISO (9001/27001/14001/45001) — flag in Open questions.)

**Col 2 (Servicii)** — heading mono `font-size:11px; font-weight:600; letter-spacing:2px; uppercase; color:#9CA3AF`; links `font-size:13.5px; color:#374151; hover color:#4487DC`, `gap:10px`:
- Infrastructură & Cloud → `Home.dc.html#servicii` → `/#servicii`
- Securitate & Conformitate → `/#servicii`
- Software & Automatizare → `/#servicii`
- Servicii Gestionate → `/#servicii`
(These are the four locked pillar names — keep exact.)

**Col 3 (Produse):**
- SEKNET → `SEKNET.dc.html` → `/solutii/seknet`
- S-VPN → `SVPN.dc.html` → `/solutii/s-vpn`
- Asset Management → `Home.dc.html#produse` → `/#produse`
- Cloud & Modernization → `Cloud.dc.html` → `/servicii/cloud`

**Col 4 (Contact):**
- Email link `<a data-email-user="office" data-email-domain="smartcontrol.ro">` (renders `office@smartcontrol.ro`, mailto), `font-size:13.5px; color:#374151; hover #4487DC`. NOTE: body-size link in slate `#374151` → fine; if rendered as accent use royal.
- `www.smartcontrol.ro` (plain span, `color:#374151`).
- Address (`color:#6B7280; line-height:1.6`): "Intrarea Aviator Teodor Iliescu 37," `<br>` "011672 București".

**Bottom bar** (`margin-top:48px; padding-top:24px; border-top:1px solid #F1F5F9` `--color-divider`; flex space-between, `gap:24px`):
- Left: `© 2026 Smart Control. Toate drepturile rezervate.` (`font-size:12.5px; color:#9CA3AF`). NOTE: hardcoded **2026** in export — compute year dynamically (scaffold already does `getUTCFullYear()`).
- Right (3 plain spans, NOT links, `font-size:12.5px; color:#9CA3AF`): `Politica de confidențialitate` · `Termeni și condiții` · `Cookies`.
  - **DEVIATION:** CLAUDE.md locks **no cookie policy, no terms page**; only privacy gets a page (`/confidentialitate`). Render only "Politica de confidențialitate" as a real link to `/confidentialitate`; DROP "Termeni și condiții" and "Cookies". See Deviations.

---

## Inline `<script>` — init calls (componentDidMount order)

Port these into a single deferred Astro island (`client:idle` / `client:visible`). The export calls, in order:
1. `hydrateIcons()` — Lucide createIcons w/ `stroke-width:1.5` (replace with static `@lucide/astro` SVGs — see Deviations).
2. `initEmails(root)` — mailto hydration for `[data-email-user]`.
3. `initNavShrink(nav)` — defaults.
4. `initNetwork(ctaCanvas, { lineAlpha:0.18, dotAlpha:0.45, spread:24000, lineDist:140 })`.
5. `initReveals(root)`.
6. `initWordFill(root)`.
7. `initParallax(root)`.
8. `initDrift(root)`.
9. `initBandScale(root)`.
10. `initHeroScrub(root)`.
11. `initStepper(steps, stepsFill)` — light variant (no `dark` opt).
Not called on this page: `initCounters`, `initScrollLean`, `initVelocitySkew`. (Note `data-skew` IS present on two grids but the page does NOT call `initScrollLean` — so the skew lean is effectively inert in the export. Flag in Open questions: include `initScrollLean(root)` to honor the `data-skew` attrs, or drop the attrs.)

## CSS keyframes referenced (define in island/global)
- `scWordIn`: `opacity 0→1, translateY 20px→0, blur 3px→0` (hero words).
- `scFadeIn`: `opacity 0→1` (eyebrow, lead, CTA row).
- `scDriftA`: `translate(0,0) → translate(60px,40px)` (hero blob).

## Lucide icons used
- `trending-up`, `recycle`, `rocket` (Section 3 cards).
- `container`, `git-branch`, `cloud`, `gauge` (Section 5 cards).
All 1.5px stroke. Section-3 icons `22px @ #0E1F5B`; Section-5 icons `20px @ #4487DC`.

## Assets
- `ds/assets/smartcontrol-mark.png` (34×34 in nav, 34×34 in footer) → existing `/smartcontrol-mark.png` in scaffold. No other images. Node-graph is `<canvas>`, not an asset. No photography/patterns.

## Links / CTAs summary (Astro hrefs)
- Primary CTA (hero, nav, CTA-band button): assessment → per CLAUDE.md use `mailto:office@smartcontrol.ro?subject=Evaluare gratuită`. Export wires hero/nav buttons to `#contact` (in-page scroll to the CTA band) and the CTA-band button to the obfuscated mailto. Match: hero/nav → `#contact`; band button → mailto.
- Hero secondary link → `#flux`.
- mailto obfuscation: `data-email-user="office" data-email-domain="smartcontrol.ro"` → hydrated to `mailto:office@smartcontrol.ro` (anchors) / text `office@smartcontrol.ro` (empty spans) by `initEmails`.
- Internal route remaps: `Home.dc.html`→`/`, `Home.dc.html#servicii`→`/#servicii` (or `/servicii`), `Home.dc.html#produse`→`/#produse`, `SEKNET.dc.html`→`/solutii/seknet`, `SVPN.dc.html`→`/solutii/s-vpn`, `Cloud.dc.html`→`/servicii/cloud`.

---

## Shared components observed
- **Eyebrow** (mono uppercase, 2.5px tracking, `#4487DC`, 2px `#D6E8F7` bottom rule) — reused in Hero, #flux, Stack. On dark CTA it's `#7AB4E8` with NO rule. Maps to global `.eyebrow` (but global uses `letter-spacing:0.16em` ≈ 1.92px and label size; export uses 12–12.5px / 2.5px — reconcile or add an `--eyebrow-rule` variant). Reusable `<Eyebrow text rule? dark?>` component.
- **Section header block** = eyebrow + `data-word-fill` H2 (+ optional lead `p`), `data-reveal` wrapper. Reusable `<SectionHeading>`.
- **Module/feature card** (white, 1px `#E5E7EB` border, 16px radius, `0 2px 12px rgba(14,31,91,0.06)` shadow, icon-chip or inline-icon head + title + body/bullets). Two variants: icon-chip + hover-lift (Sec 3) vs inline-icon + bullet list (Sec 5). Reusable `<ModuleCard>`.
- **Mono pill / badge** (`11px`, `#4487DC`, `1px #D6E8F7`, `999px` radius, white bg) — stepper badges; also a hex/stat-pill pattern site-wide.
- **CTA band (dark)** = midnight bg + node-graph canvas + radial glow + centered eyebrow/H2/lead + mailto button + contact line. Reusable `<CtaBand>`; appears on every Template-A/B page.
- **Vertical scroll stepper** (rail + fill + numbered dots + step bodies) — the signature 5-stage methodology; unique to Cloud but worth its own `<Stepper>` component.
- **Nav** / **Footer** — shared (existing components; this page's export versions are richer — reconcile).

## New components needed (Astro)
- `Stepper.astro` + island (the 5-stage scroll stepper; `initStepper`).
- `CtaBand.astro` (dark CTA with node-graph canvas + email pill).
- `ModuleCard.astro` (capability/reason card, both variants).
- `Eyebrow.astro` / `SectionHeading.astro`.
- `MotionIsland` (a deferred island porting `motion.js` — `initReveals/WordFill/Parallax/Drift/BandScale/HeroScrub/NavShrink/Network/Stepper/Emails`), OR re-implement these in GSAP+ScrollTrigger per CLAUDE.md.
- `NetworkCanvas.astro` (2D canvas + `initNetwork`).
- Extend `Nav.astro` (active-state underline, SEKNET/S-VPN items, full-label CTA) and `Footer.astro` (4-col layout) to match export — or document the simplification as an intentional deviation.

## Deviations to apply (export violates CLAUDE.md — record, fix in build, do NOT alter the design intent)
1. **Google Fonts CDN** (`<link href="fonts.googleapis.com...">`) — MUST use self-hosted `@fontsource-variable/inter` + `jetbrains-mono` (already in BaseLayout). Drop the CDN link.
2. **Lucide via CDN** (`<script src="unpkg.com/lucide@latest">` + `hydrateIcons()`) — MUST use static `@lucide/astro` SVG imports (no runtime CDN, no JS hydration). Keep `stroke-width:1.5`.
3. **Body-size link in bright `#4487DC` fails WCAG AA** (3.66:1): hero "Vezi fluxul în 5 etape ›" link text, and CTA-band hover `#3470C0`. Render link TEXT as royal `#1F3C80` (`text-royal`, 10.6:1). Keep `#4487DC` only for rules/underlines/large headings/icons. (Footer nav links hover to `#4487DC` — small text; consider royal on hover for AA.)
4. **`<input type="email">` in the CTA band violates the "No forms of any kind" hard rule.** Render contact as email-only: drop the input, keep just the mailto button (and/or show the address). No form element, no action.
5. **Footer "Termeni și condiții" + "Cookies" links** — locked: no cookie/terms pages exist (zero cookies, no forms). Drop both; keep only "Politica de confidențialitate" linking to `/confidentialitate` (`/en/privacy`).
6. **Hardcoded `© 2026`** — compute the year dynamically (scaffold Footer already does).
7. **Container width 1180px** vs theme `.container` max 1200px — align to the theme token (1200px) or add a 1180px variant; don't hardcode. Likewise inner pad `40px` ≈ theme `1.5rem`/24px is narrower — reconcile (export uses 40px gutters).
8. **Card border** — export cards use `1px solid #E5E7EB`; CLAUDE.md cards rule says "no border, soft navy shadow." Export is client-approved → keep the border, but note it as an intentional override (shadow IS navy-tinted, compliant).
9. **`scroll-margin-top:76px`** hardcoded for nav offset — fine, but tie to the actual nav height token if one is added.
10. **Inline styles + `style-hover` + `ref={{...}}` + `data-screen-label`** are design-tool artifacts — convert to Tailwind classes / real CSS; drop `data-screen-label`.
11. **i18n:** export is RO only — must ship an EN mirror at `/en/servicii/cloud` with translated copy (full parity per CLAUDE.md). Keep English technical terms (cloud, Kubernetes, DevSecOps, CI/CD, refactoring, etc.).
12. **`data-skew="4"`** present on the two grids but `initScrollLean` is never called → either wire `initScrollLean(root)` (matches the attribute intent) or drop the attrs. Light zones should stay calmer per CLAUDE.md — recommend dropping the skew on light grids.

## Open questions
1. Footer ISO list shows **27701** (5 ISO) but CLAUDE.md trust-stats name only four ISO (9001/27001/14001/45001) and treats GDPR/NIS2/DORA as frameworks (reserved teal). Include 27701? Render the regulatory frameworks in teal `#1A7A6E`? The export uses no teal at all — does compliance content stay blue here?
2. Hero/nav assessment CTA: scroll to in-page `#contact` (export) vs direct `mailto:?subject=Evaluare gratuită` (CLAUDE.md primary ask). Confirm the in-page-scroll-then-mailto pattern is acceptable, and whether the subject line should be standardized to "Evaluare gratuită" (CLAUDE.md) vs the export's "assessment" wording.
3. "Servicii" / "Asset Management" footer targets point to Home anchors (`#servicii`, `#produse`) in the export, but the locked sitemap has real `/servicii` and `/solutii` hubs — link to the hub pages or keep Home anchors?
4. Should the richer 4-column export footer and 5-item export nav REPLACE the current lighter scaffold components site-wide, or is the scaffold (2-col footer, 4-link nav) the intended simplification? This affects every page.
5. `data-word-fill` per-character dictation sweep is bespoke (not GSAP). Port the vanilla `initWordFill` as-is, or re-create with GSAP SplitText? (SplitText is now free but adds weight.)
6. Reduced-motion: `initWordFill`/`initReveals` bail entirely under reduced-motion, leaving final text/opacity visible (good). Confirm the stepper renders all dots "active" (it does: `rm` short-circuits) and the canvas draws one static frame — acceptable static fallbacks.
7. Eyebrow tracking mismatch: export 2.5px vs global `.eyebrow` 0.16em — which wins? And eyebrow font-size differs per section (12 vs 12.5px) — normalize to one token?
8. Stepper dot radius `12px` has no exact theme token (between `--radius-md` 10 and `--radius-lg` 14). Add a token or round to 10/14?
