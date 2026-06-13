# Build Spec — S-VPN product page

- **Target route:** `/solutii/s-vpn` (RO default) + `/en/solutii/s-vpn` (EN parity, copy not provided here — RO is ground truth).
- **Template:** A — product detail (dark hero → light overview/stats → module grid → wash benefits band → mono spec table → included-services + audience split → dark CTA band → light footer).
- **Source export:** `/Users/claude/code/site/docs/SMC Web/SVPN.dc.html` (visual ground truth, client-approved).
- **Motion library:** `/Users/claude/code/site/docs/SMC Web/motion.js` — port the referenced init* functions as a deferred Astro motion island (project rule: GSAP+ScrollTrigger is the chosen stack, but the export ships these vanilla utilities; reproduce the same behavior/feel, gate on `prefers-reduced-motion`).
- **Page-wide root style:** `font-family: Inter; background:#FFFFFF; color:#374151 (--color-slate); font-size:16px; line-height:1.65; overflow-x:hidden; -webkit-font-smoothing:antialiased`.
- **Container width used everywhere:** `max-width:1180px; margin:0 auto` with horizontal padding `40px` on the section (NOT on the inner div). Theme `.container` is `max-width:1200px` / `padding-inline:1.5rem` — close but not identical; either widen the export to 1180 or accept 1200. Flag in Open Questions.
- **Section horizontal padding is always `40px`** (left/right) on the `<section>`; vertical padding varies per section (listed below).

Color token map used throughout (resolve hex → token, do NOT hardcode hex):
- `#040C2B` → `--color-midnight` (hero/CTA floor)
- `#0E1F5B` → `--color-navy` (primary ink, headings, stat numbers)
- `#1F3C80` → `--color-royal` (AA-safe link text — see Deviations)
- `#3470C0` → `--color-mid-blue` (CTA hover bg)
- `#4487DC` → `--color-bright` (accent rules, chevrons, eyebrow, large-number accents, primary button bg)
- `#7AB4E8` → `--color-sky` (light accent on dark; hero eyebrow + secondary hero words + dark-zone mono ticks)
- `#EDF5FC` → `--color-blue-wash` (icon chip bg)
- `#F3F6FC` → `--color-page` (benefits band bg)
- `#FFFFFF` → `--color-surface` (cards, nav, footer)
- `#D6E8F7` → `--color-border-blue` (eyebrow rule, icon-chip border, card hover border)
- `#E5E7EB` → `--color-border` (card/table borders, grid hairline)
- `#374151` → `--color-slate` (body, list text)
- `#6B7280` → `--color-cool` (muted paragraphs, stat captions)
- `#9CA3AF` → `--color-faint` (footer labels/legal)
- `#F1F5F9` → `--color-divider` (table row dividers, footer divider)
- `#FAFBFD` → spec-table label-cell bg — **NO existing token** (near-white tint; closest is `--color-hover-tint #f8faff` but not equal). Flag.
- `#7AB4E8 @ 0.3` rule, `rgba(226,233,245,*)` dark-zone text tints, `rgba(122,180,232,*)` dark borders/glow → **NO tokens** (dark-zone one-offs; define as needed).

Shadows: card resting `0 2px 12px rgba(14,31,91,0.06)` ≈ `--shadow-md` is `0 2px 12px rgba(14,31,91,0.08)` (0.06 vs 0.08 — close, use `--shadow-md` or define `--shadow-sm-card`). Card hover `0 12px 32px rgba(14,31,91,0.14)` = `--shadow-lg` exact.
Radii: `16px` = `--radius-xl`; `14px` = `--radius-lg`; `10px` = `--radius-md`. All map cleanly.
Fonts: body Inter (`--font-sans`), mono `'JetBrains Mono'` (`--font-mono`) for eyebrows/stats/spec table/dark ticks.

---

## Section 0 — NAV (light, shared component)

- **Background:** `#FFFFFF` (--color-surface), fixed, `z-index:50`, `top/left/right:0`.
- **Padding (resting):** `18px 40px`; border-bottom `1px solid rgba(229,231,235,0)` (transparent until shrink). Transition `padding .3s cubic-bezier(0.16,1,0.3,1), box-shadow .3s, border-color .3s`.
- **Inner:** `max-width:1180px; margin:0 auto`, flex, `align-items:center; justify-content:space-between; gap:32px`.
- **Logo (left):** `<a href="/">` flex gap `11px`; `<img src="/smartcontrol-mark.png" alt="Smart Control" width=34 height=34>` + wordmark `<span>` 17px / 700 / letter-spacing -0.3px / `#0E1F5B` with "Control" in `#4487DC`. Markup: `Smart<span style="color:#4487DC">Control</span>`.
- **Nav links (right):** flex gap `28px`, font 13.5px:
  - `Servicii` → `/servicii` (was `Home.dc.html#servicii`) — weight 500, `#374151`, hover `color:#0E1F5B; border-bottom-color:#4487DC` (2px bottom border, transparent at rest, padding-bottom 3px).
  - `SEKNET` → `/solutii/seknet` (was `SEKNET.dc.html`) — same style.
  - `S-VPN` → `/solutii/s-vpn` (current page) — **active state:** weight 600, color `#0E1F5B`, solid `border-bottom:2px solid #4487DC`.
  - `Cloud & Modernization` → `/servicii/cloud` (was `Cloud.dc.html`) — same as Servicii. Label exact: `Cloud & Modernization`.
  - **CTA button** `Solicită demo` → `#contact` — weight 600, white text, padding `9px 18px`, radius `10px`, bg `#0E1F5B`, hover `background:#040C2B; box-shadow:0 4px 16px rgba(14,31,91,0.25)`.
- **Motion:** `initNavShrink(nav)` — after scrollY>24: padding→`11px 40px`, box-shadow→`0 2px 12px rgba(14,31,91,0.08)`, border-bottom-color→`#E5E7EB`.
- Note: this nav has NO product CTA conflict — it shows the site-wide "Solicită demo". Per CLAUDE.md, products use the demo ask; OK.

---

## Section 1 — PRODUCT HERO (dark + network canvas)

- **Element:** `<header>` `data-screen-label="S-VPN Hero (dark)"`, `position:relative; overflow:hidden; background:#040C2B` (--color-midnight).
- **Canvas:** `<canvas>` `position:absolute; inset:0; width/height:100%; opacity:0.75` — driven by `initNetwork(heroCanvas, { lineAlpha:0.24, dotAlpha:0.6, spread:18000, lineDist:155 })`. (color defaults `68,135,220`; color2 `122,180,232`.)
- **Radial vignette overlay:** absolute, `background: radial-gradient(ellipse 75% 65% at 35% 40%, rgba(4,12,43,0) 0%, rgba(4,12,43,0.5) 60%, #040C2B 100%)`.
- **Content wrapper:** `data-hero-scrub`, `position:relative; z-index:1; max-width:1180px; margin:0 auto; padding:190px 40px 120px`.
- **Eyebrow:** mono 12.5px / 500 / letter-spacing 2.5px / uppercase / `#7AB4E8` (--color-sky), inline-block, padding-bottom 10px, border-bottom `2px solid rgba(122,180,232,0.3)`. Entrance: `scFadeIn .8s ease-out .1s`.
  - Text: `Produs proprietar · Suită integrată de acces remote`
- **H1:** margin `26px 0 0`, font 62px / 800 / letter-spacing -2px / line-height 1.08 / `#FFFFFF`, max-width 860px. Words animate per-`<span>` via `scWordIn` keyframe (translateY 20px + blur 3px → settle), staggered delays:
  - `S-VPN.` (white, delay .25s)
  - `Acces` (sky #7AB4E8, .45s)
  - `remote` (sky, .57s)
  - `sigur.` (sky, .69s)
  - `<br>`
  - `Fără` (sky, .86s)
  - `compromisuri.` (sky, .98s)
  - Full heading text: **S-VPN. Acces remote sigur. Fără compromisuri.**
- **Subhead `<p>`:** margin `26px 0 0`, 18px / line-height 1.7 / max-width 640px / color `rgba(226,233,245,0.72)`. Entrance `scFadeIn .9s ease-out 1.15s`. Verbatim:
  > Ce la alți furnizori se cumpără și se administrează separat, S-VPN livrează integrat: **VPN, MFA, WAF, protecție endpoint și consolă de management** — la o fracțiune din costul soluțiilor tradiționale, cu toate serviciile incluse în licență.
  - (`<strong>` span is `color:#FFFFFF; font-weight:600`.)
- **CTA row:** margin-top 38px, flex gap 16px wrap, `scFadeIn .9s ease-out 1.35s`:
  - Primary: `Solicită un demo` → `#contact` — inline-flex, 14.5px / 600 / white, padding `13px 26px`, radius 10px, bg `#4487DC`, glow `box-shadow:0 0 28px rgba(68,135,220,0.45)`, hover `background:#3470C0; box-shadow:0 0 40px rgba(68,135,220,0.65)`.
  - Secondary text link: `Vezi modulele ›` → `#module` — 14.5px / 600 / `#7AB4E8`, padding `13px 8px`, hover `color:#FFFFFF`.
- **Hero ticker row (mono ticks):** margin-top 56px, flex gap 36px wrap, `scFadeIn .9s ease-out 1.55s`. Each item mono 12.5px / `rgba(226,233,245,0.55)` with a leading `▸` span in `#7AB4E8`:
  - `▸ TLS 1.2 / 1.3 · AES-256 + PFS`
  - `▸ 5 metode MFA, active simultan`
  - `▸ Zero hardware proprietar`
  - `▸ −60% față de Cisco / Fortinet`
- **Motion:** `initHeroScrub` (content sinks at 0.3× scroll, fades to ~8% over 0.85vh). Entrance animations are CSS keyframes `scWordIn`/`scFadeIn` (defined in helmet `<style>`), reproduce them.

---

## Section 2 — PERFORMANȚĂ (count-up stat strip)

- **Element:** `<section>` `data-screen-label="Performanță"`, padding `72px 40px 0` (top only; bottom flows into next). Background page-default white.
- **Inner:** `max-width:1180px; margin:0 auto`.
- **Grid:** `data-reveal`, `display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:#E5E7EB; border:1px solid #E5E7EB; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(14,31,91,0.06)`. (The 1px gap on a #E5E7EB background creates hairline dividers between cells.)
- **4 cells**, each `background:#FFFFFF; padding:34px 32px`:
  - Number: mono 48px / 600 / line-height 1 / `#0E1F5B`, with a `data-count` span (animated) + accent suffix span in `#4487DC`.
    1. `<span data-count="20">20</span><span>Gbps+</span>` — caption `Inspecție trafic Layer 7`
    2. `<span data-count="10">10</span><span>K+</span>` — caption `Tuneluri IPSec simultane`
    3. `<span data-count="400">400</span><span>+</span>` — caption `Tuneluri SSL concurente`
    4. `<span data-count="200">200</span><span>+</span>` — caption `Locații site-to-site IPSec`
  - Caption: margin-top 12px, 14px / `#6B7280`.
- **Motion:** `data-reveal` on the grid (fade+rise). `data-count` on the four number spans → `initCounters` (count 0→target over 1400ms cubic ease-out, fires at 50% in view; final text is the no-JS fallback).

---

## Section 3 — MODULE (5 modules, 3+2 layout)

- **Element:** `<section id="module">` `data-screen-label="Module"`, padding `110px 40px`, `scroll-margin-top:76px`.
- **Inner:** `max-width:1180px; margin:0 auto`.
- **Header block** (`data-reveal`):
  - Eyebrow (light variant): mono 12px / 500 / ls 2.5px / uppercase / `#4487DC`, inline-block, padding-bottom 10px, border-bottom `2px solid #D6E8F7`. Text: `Module`
  - H2 `data-word-fill="light"`: margin `24px 0 0`, 38px / 700 / ls -1px / lh 1.15 / `#0E1F5B`, max-width 700px. Text: `Cinci capabilități, un singur produs`
  - `<p>`: margin `16px 0 0`, 16.5px / max-width 640px / `#6B7280`. Text: `30 de specificații funcționale și 19 non-funcționale, documentate în fișa tehnică. 5 module · 1 produs · 1 licență.`
- **Card grid wrapper:** `data-skew="4"`, margin-top 52px, `display:grid; grid-template-columns:repeat(6,1fr); gap:20px`. (6-col base → first three cards `span 2` = 3-up row; last two cards `span 3` = 2-up row.)
- **Each card outer div** carries reveal/drift hooks; **inner div** is the visible card: `height:100%; box-sizing:border-box; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:16px; padding:30px 32px; box-shadow:0 2px 12px rgba(14,31,91,0.06); transition: transform .35s cubic-bezier(0.16,1,0.3,1), box-shadow .35s, border-color .35s`. Hover: `transform:translateY(-5px); box-shadow:0 12px 32px rgba(14,31,91,0.14); border-color:#D6E8F7`.
- **Card header:** flex gap 14px — icon chip (`width/height:44px; border-radius:10px; background:#EDF5FC; border:1px solid #D6E8F7`, contains lucide `<i>` 22px / `#0E1F5B`) + a div with mono kicker (11px / ls 1.5px / uppercase / `#4487DC`, text `S-VPN`) and `<h3>` (margin `2px 0 0`, 19px / 700 / ls -0.3px / `#0E1F5B`).
- **Card body `<p>`:** margin `16px 0 0`, 13.5px / `#6B7280`.
- **Feature list:** margin-top 16px, `display:grid; gap:8px` (or 2-col for wide cards — see below). Each row 13.5px / `#374151`, prefixed with `<span style="color:#4487DC; margin-right:8px">›</span>` chevron.

Cards in order:

**Card 1 — VPN** (`data-reveal data-reveal-rotate="-4" data-drift="0.07"`, `grid-column: span 2`)
- icon `data-lucide="network"`; kicker `S-VPN`; h3 `VPN`
- p: `Conectivitate securizată SSL & IPSec.`
- list (1-col): `SSL VPN — până la 400 tuneluri concurente` · `IPSec — peste 10.000 tuneluri simultane` · `Site-to-site — 200+ locații` · `Windows, macOS, Linux, iOS, Android` · `Split tunneling per utilizator / grup`

**Card 2 — MFA** (`data-reveal data-reveal-delay="80" data-reveal-rotate="4"`, `span 2`)
- icon `data-lucide="key-round"`; kicker `S-VPN`; h3 `MFA`
- p: `Cinci metode — alegi varianta potrivită.`
- list (1-col): `SMS On-Premises — server la client` · `SMS Shared — gestionat de SmartControl` · `E-mail OTP — fără infrastructură nouă` · `TOTP — Google / Microsoft Authenticator` · `Certificate X.509 — nivel maxim de asigurare`

**Card 3 — WAF** (`data-reveal data-reveal-delay="160" data-reveal-rotate="-4" data-drift="-0.07"`, `span 2`)
- icon `data-lucide="shield-alert"`; kicker `S-VPN`; h3 `WAF`
- p: `Web Application Firewall + UTM.`
- list (1-col): `Protecție SQL Injection și XSS` · `HTTP constraints și rate limiting` · `Semnături OWASP Top 10, actualizate` · `DPI Layer 7 la peste 20 Gbps` · `Filtrare URL și categorii la gateway`

**Card 4 — Endpoint** (`data-reveal data-reveal-rotate="4" data-drift="0.07"`, `grid-column: span 3`)
- icon `data-lucide="laptop"`; kicker `S-VPN`; h3 `Endpoint`
- p: `Protecția stației client — niciun dispozitiv neconform nu intră în rețea.`
- list **2-col** (`grid-template-columns:1fr 1fr; gap:8px 20px`): `Scanare vulnerabilități OS în timp real` · `Detecție CVE aplicații terțe` · `Verificare conformitate la conectare` · `Blocare dispozitive neconforme`

**Card 5 — Console** (`data-reveal data-reveal-delay="80" data-reveal-rotate="-4" data-drift="-0.07"`, `grid-column: span 3`)
- icon `data-lucide="sliders-horizontal"`; kicker `S-VPN`; h3 `Console`
- p: `Management centralizat — totul dintr-un singur loc, prin browser.`
- list **2-col** (`gap:8px 20px`): `Politici VPN, MFA, WAF, Endpoint` · `Monitorizare trafic în timp real` · `Audit log tamper-proof` · `Rapoarte NIS 2, ISO 27001, GDPR` · `AD / LDAP / RADIUS nativ` · `API REST — OpenAPI / Swagger`
  - Note: `NIS 2`, `ISO 27001`, `GDPR` are compliance frameworks — per CLAUDE.md they should render in reserved teal `--color-compliance #1A7A6E`. The export renders them plain `#374151`. Flag in Deviations (designer decision needed: export shows no teal).
- **Motion:** wrapper `data-skew="4"` (scroll-velocity lean — note: page script does NOT call `initScrollLean`, see motion summary). Each card `data-reveal` + `data-reveal-rotate` (deep rise + blur→sharp focus pull) + `data-reveal-delay` stagger + `data-drift` (column-rigid inertial parallax). Reproduce all four.

---

## Section 4 — DE CE S-VPN (benefits, wash band)

- **Element:** `<section>` `data-band data-screen-label="Beneficii"`, padding `110px 40px`, `background:#F3F6FC` (--color-page).
- **Inner:** `max-width:1180px; margin:0 auto`.
- **Header** (`data-reveal`):
  - Eyebrow (light): `De ce S-VPN` (same style as Module eyebrow).
  - H2 `data-word-fill="light"`: 38px / 700 / ls -1px / lh 1.15 / `#0E1F5B`, max-width 720px. Text: `Securitate enterprise, fără privilegiul bugetelor mari`
- **Grid:** `data-skew="4"`, margin-top 48px, `grid-template-columns:repeat(4,1fr); gap:20px`.
- **Each benefit card** outer carries `data-reveal` (+ delay + drift); inner card: `height:100%; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:16px; padding:30px 32px; box-shadow:0 2px 12px rgba(14,31,91,0.06)` (no hover transition here).
  - Big number: mono 40px / 600 / lh 1 / `#0E1F5B`, accent fragment in `#4487DC`.
  - H3: margin `16px 0 0`, 16px / 700 / `#0E1F5B`.
  - p: margin `8px 0 0`, 13.5px / lh 1.65 / `#6B7280`.

Cards in order:
1. `data-reveal data-drift="0.06"` — number `−60` + `%` (accent). h3 `Cost predictibil`. p: `Set complet de capabilități la o fracțiune din costul Cisco / Fortinet — fără facturare per utilizator sau dispozitiv.`
2. `data-reveal data-reveal-delay="80" data-drift="-0.05"` — number `0` (no accent suffix). h3 `Costuri ascunse`. p: `Toate licențele includ instalare, configurare, integrare, suport, mentenanță și garanție. Fără dependență de terți.`
3. `data-reveal data-reveal-delay="160" data-drift="0.06"` — number `360` + `°` (accent). h3 `Vizibilitate deplină`. p: `Imagine completă în timp real asupra suprafeței de atac — politici, trafic, vulnerabilități, conformitate.`
4. `data-reveal data-reveal-delay="240" data-drift="-0.05"` — number `<5` + `min` (accent; literal `&lt;5`). h3 `Setup în minute`. p: `Clientul se instalează și se conectează în mai puțin de 5 minute de la provizionare — fără expertiză tehnică avansată.`
- **Motion:** section `data-band` → `initBandScale` (scale 0.94→1, border-radius 40px→0 scrubbed on entry). Wrapper `data-skew="4"`. Cards `data-reveal`+`data-drift`.

---

## Section 5 — SPECIFICAȚII (mono spec table)

- **Element:** `<section>` `data-screen-label="Specificații"`, padding `110px 40px`, white bg.
- **Inner:** `max-width:1180px; margin:0 auto`.
- **Header** (`data-reveal`):
  - Eyebrow (light): `Specificații · v1.0`
  - H2 `data-word-fill="light"`: 38px / 700 / ls -1px / lh 1.15 / `#0E1F5B`. Text: `Construit pentru scară enterprise`
  - p: margin `16px 0 0`, 16.5px / max-width 620px / `#6B7280`. Text: `Arhitectură software-first, testată la scară în perioada pandemiei — fără dependență de echipamente proprietare.`
- **Table card:** `data-reveal data-drift="-0.04"`, margin-top 44px, `background:#FFFFFF; border:1px solid #E5E7EB; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(14,31,91,0.06)`.
- **Rows:** each `display:grid; grid-template-columns:200px 1fr`, divided by `border-bottom:1px solid #F1F5F9` (last row has none).
  - Label cell: mono 11.5px / ls 1.5px / uppercase / `#4487DC`, padding `18px 28px`, `background:#FAFBFD` (no token — flag).
  - Value cell: mono 13px / lh 1.7 / `#374151`, padding `18px 28px`.

Rows (label → value, verbatim, note `&gt;`=`>`, `&lt;`=`<`):
1. `Performanță` → `> 20 Gbps inspecție L7 · > 10.000 tuneluri IPSec · > 400 tuneluri SSL · > 200 site-to-site · latență MFA < 3s`
2. `Criptare` → `TLS 1.2 / 1.3 (fără SSLv3, TLS 1.0) · IPSec AES-256 + SHA-2 + Perfect Forward Secrecy · X.509 v3 cu OCSP / CRL · secrete criptate la repaus`
3. `Scalabilitate` → `Utilizatori simultani nelimitați — zero cost licență · scalare orizontală fără downtime · 5 / 5 metode MFA active simultan`
4. `Continuitate` → `Rolling updates fără întreruperea sesiunilor · failover automat < 30s · arhitectură testată la scară în perioada pandemiei`
5. `Integrări` → `Active Directory · LDAP · RADIUS · API REST (OpenAPI / Swagger) pentru ITSM, SOAR, NOC · consolă exclusiv web (Chrome, Firefox, Edge)`
6. `Deployment` → `Hardware standard sau cloud (AWS, Azure, GCP) · on-premise, cloud sau hibrid · client < 5 minute setup · wizard onboarding inclus`
- **Motion:** header `data-reveal`; table card `data-reveal data-drift="-0.04"`.

---

## Section 6 — SERVICII INCLUSE + AUDIENȚĂ (two-column split)

- **Element:** `<section>` `data-screen-label="Servicii incluse"`, padding `0 40px 110px` (no top padding — continues from spec section).
- **Inner:** `max-width:1180px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:start`.

**Left column** (`data-reveal`):
- Eyebrow (light): `Incluse în licență`
- H2 `data-word-fill="light"`: margin `24px 0 0`, **30px** / 700 / ls -0.7px / lh 1.2 / `#0E1F5B`. Text: `Tot ce trebuie — inclus`
- p: margin `14px 0 0`, 15px / `#6B7280`. Text: `Soluție operațională din prima zi, fără costuri suplimentare sau dependență de parteneri terți.`
- Check grid: margin-top 24px, `grid-template-columns:1fr 1fr; gap:10px 24px`. Each item 14px / `#374151` with leading `<span style="color:#4487DC; margin-right:8px">✓</span>` checkmark:
  - `Instalare & configurare` · `Suport tehnic` · `Servicii de integrare` · `Mentenanță & actualizări` · `Suport echipamente incluse` · `Garanție certificată`

**Right column** (`data-reveal data-reveal-delay="100" data-drift="-0.05"`, `display:grid; gap:12px`):
- 4 audience pill rows, each `display:flex; gap:16px; align-items:center; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:14px; padding:18px 24px; box-shadow:0 2px 12px rgba(14,31,91,0.06)`.
  - Tag span (left, fixed): mono 11px / ls 1px / `#4487DC`, `flex:none; width:104px`.
  - Description span: 13.5px / `#374151`.
- Rows:
  1. `ENTERPRISE` → `Protecție completă, fără bugetele prohibitive ale soluțiilor clasice.`
  2. `SMB IT TEAM` → `Echipe IT mici-medii, fără expertiză pentru implementări complexe.`
  3. `REGULATED` → `Medii reglementate — audit log imutabil și autentificare cu certificate.`
  4. `DISTRIBUTED` → `Multiple locații, sute–mii de utilizatori remote, site-to-site 200+.` (note en-dash in `sute–mii`)
- **Motion:** both columns `data-reveal`; right column also `data-drift="-0.05"`.

---

## Section 7 — CTA (dark band, email capture)

- **Element:** `<section id="contact">` `data-band data-screen-label="CTA (dark)"`, `position:relative; overflow:hidden; background:#040C2B; padding:110px 40px; scroll-margin-top:76px`.
- **Canvas:** `<canvas>` `position:absolute; inset:0; 100%×100%; opacity:0.5` — `initNetwork(ctaCanvas, { lineAlpha:0.18, dotAlpha:0.45, spread:24000, lineDist:140 })`.
- **Radial glow overlay:** absolute, `radial-gradient(ellipse 60% 70% at 50% 40%, rgba(68,135,220,0.16), rgba(4,12,43,0) 70%)`.
- **Content:** `position:relative; z-index:1; max-width:760px; margin:0 auto; text-align:center`, inner `data-reveal`.
- Eyebrow (DARK, no rule): mono 12px / 500 / ls 2.5px / uppercase / `#7AB4E8`. Text: `Pașii următori`
- H2 `data-word-fill="dark"`: margin `22px 0 0`, 40px / 700 / ls -1px / lh 1.15 / `#FFFFFF`. Text: `Assessment Inițial gratuit — 2 zile`
- p: margin `18px auto 0`, 16.5px / lh 1.7 / max-width 560px / `rgba(226,233,245,0.7)`. Text: `Fără angajamente. Identificăm împreună zona de interes prioritară și livrăm un raport de recomandări la final.`
- **Email capture pill:** margin-top 34px, inline-flex `align-items:stretch; gap:8px; padding:7px; background:rgba(255,255,255,0.05); border:1px solid rgba(122,180,232,0.25); border-radius:14px`.
  - `<input type="email" placeholder="email@companie.ro">` — Inter 14.5px / `#FFFFFF` / transparent bg / no border / outline none / padding `10px 14px` / `width:230px`.
  - Button `<a data-email-user="office" data-email-domain="smartcontrol.ro" href="#">`: inline-flex, 14.5px / 600 / white, padding `11px 22px`, radius 10px, bg `#4487DC`, glow `0 0 28px rgba(68,135,220,0.45)`, hover `background:#3470C0; box-shadow:0 0 40px rgba(68,135,220,0.65)`. Text: `Solicită assessment-ul`
- **Email line:** margin-top 26px, mono 13px / `rgba(226,233,245,0.55)`: `<span data-email-user="office" data-email-domain="smartcontrol.ro"></span> · www.smartcontrol.ro` (the span fills with `office@smartcontrol.ro` at runtime).
- **CRITICAL scope note:** Per CLAUDE.md the site has **NO forms** (email-only). This export's email input is decorative — the button is a `mailto:`. On products the CTA must be **"Cere un demo" → `mailto:office@smartcontrol.ro?subject=Demo S-VPN`**, but this export shows an "assessment" ask (`Solicită assessment-ul`) which is the site-wide free-evaluation ask, not the product demo ask. **Conflict — see Deviations.** The `<input>` is also a form element; either drop it (no-forms rule) or keep it purely visual with the mailto button. Flag.
- **Motion:** section `data-band` → `initBandScale`; canvas `initNetwork`; inner `data-reveal`; H2 `data-word-fill="dark"`. Emails via `initEmails`.

---

## Section 8 — FOOTER (light, shared component)

- **Element:** `<footer>` `data-screen-label="Footer"`, `background:#FFFFFF; border-top:1px solid #E5E7EB; padding:64px 40px 40px`.
- **Inner:** `max-width:1180px; margin:0 auto`.
- **Top grid:** `grid-template-columns:1.4fr 1fr 1fr 1.2fr; gap:48px`.

**Col 1 — brand:**
- Logo lockup (same as nav: `/smartcontrol-mark.png` 34px + `Smart` `#0E1F5B` / `Control` `#4487DC` wordmark 17px/700), href `/`.
- Tagline: margin-top 14px, 13.5px / **italic** / `#6B7280`: `Trusted Service Delivery Partner` (always English, italic — canonical).
- Meta: margin-top 18px, 13px / lh 1.7 / `#9CA3AF`: `Fondată în 2003 · 650+ proiecte livrate` `<br>` `ISO 9001 · 27001 · 14001 · 45001 · 27701`

**Col 2 — Servicii** (heading mono 11px / 600 / ls 2px / uppercase / `#9CA3AF`: `Servicii`):
- Links margin-top 16px, grid gap 10px, 13.5px / `#374151`, hover `color:#4487DC`:
  - `Infrastructură & Cloud` → `/servicii` (was `Home.dc.html#servicii`)
  - `Securitate & Conformitate` → `/servicii`
  - `Software & Automatizare` → `/servicii`
  - `Servicii Gestionate` → `/servicii`

**Col 3 — Produse** (heading `Produse`):
- `SEKNET` → `/solutii/seknet`
- `S-VPN` → `/solutii/s-vpn`
- `Asset Management` → `/solutii` (was `Home.dc.html#produse`) — note: no dedicated Asset Mgmt page in sitemap; point to products index. Flag.
- `Cloud & Modernization` → `/servicii/cloud`

**Col 4 — Contact** (heading `Contact`):
- `<a data-email-user="office" data-email-domain="smartcontrol.ro" href="#">` (empty → fills `office@smartcontrol.ro`, mailto) 13.5px / `#374151`, hover `#4487DC`.
- `<span>www.smartcontrol.ro</span>` 13.5px / `#374151`.
- `<span>Intrarea Aviator Teodor Iliescu 37,<br>011672 București</span>` 13.5px / lh 1.6 / `#6B7280`.

**Bottom bar:** margin-top 48px, padding-top 24px, `border-top:1px solid #F1F5F9; display:flex; justify-content:space-between; align-items:center; gap:24px`.
- Left: 12.5px / `#9CA3AF`: `© 2026 Smart Control. Toate drepturile rezervate.`
- Right: flex gap 20px, three 12.5px / `#9CA3AF` `<span>` (NOT links in export): `Politica de confidențialitate` · `Termeni și condiții` · `Cookies`
  - Per CLAUDE.md: there are NO terms/cookies pages (zero cookies, no forms). Only `Politica de confidențialitate` → `/confidentialitate` should be a real link. Flag in Deviations.

---

## Shared components observed

- **Eyebrow (light)** — mono 12px / 500 / ls 2.5px / uppercase / `#4487DC`, inline-block, padding-bottom 10px, border-bottom `2px solid #D6E8F7`. Maps to `.eyebrow` token but the rule (bottom border) is per-instance. Reusable `<Eyebrow variant="light|dark">` (dark = `#7AB4E8`, hero variant has a `rgba(122,180,232,0.3)` rule, CTA dark variant has no rule).
- **Word-fill heading** — `<h2 data-word-fill="light|dark">` driven by `initWordFill` (per-char left→right dictation sweep, accent gradient #4487DC→#7AB4E8 settling to final ink #0E1F5B light / #FFFFFF dark). Reusable component.
- **Module/feature card** — white, 16px radius, `#E5E7EB` border, shadow `rgba(14,31,91,0.06)`, padding `30px 32px`, icon chip (44px, blue-wash bg, blue-border, lucide 22px navy) + mono kicker + h3 + p + chevron `›` list. Hover lift -5px + shadow-lg + border-blue. Used in Section 3 (and reused minus hover in Section 4).
- **Giant-number metric block** — mono 48px (stat strip) / 40px (benefits) / 600 / navy, with accent-colored suffix fragment; caption/h3 below. Reusable `<StatBlock>`.
- **Mono spec table** — rounded card, `200px 1fr` two-col rows, `#FAFBFD` label cell (mono uppercase accent), `#374151` mono value cell, `#F1F5F9` row dividers. Reusable `<SpecTable rows={[...]}>`.
- **Chevron `›` bullet list** and **`✓` checklist** — accent glyph + slate text. Reusable list primitive.
- **Audience/tag pill row** — flex row, fixed-width mono tag + slate description, white card. Reusable.
- **Dark CTA band** — midnight bg, network canvas (`opacity:0.5`), radial glow overlay, centered content, dark word-fill H2, glow button. `data-band` scale-in. Reusable across all product/closing pages.
- **Nav (light, shrink-on-scroll)** and **Footer (light, 4-col)** — shared site chrome.
- **Network canvas background** — `initNetwork` with per-zone opts. Hero `{lineAlpha:0.24, dotAlpha:0.6, spread:18000, lineDist:155}` @ canvas opacity 0.75; CTA `{lineAlpha:0.18, dotAlpha:0.45, spread:24000, lineDist:140}` @ opacity 0.5.

---

## Deviations to apply (export violates CLAUDE.md — record, do not silently keep export)

1. **Google Fonts CDN** — helmet `<link>` loads Inter + JetBrains Mono from `fonts.googleapis.com`. CLAUDE.md forbids the Google Fonts CDN (US IP transfer / GDPR). **Fix:** self-host via `@fontsource-variable/inter` + `@fontsource-variable/jetbrains-mono`; use `--font-sans` / `--font-mono` tokens. (Theme already defines these.)
2. **Lucide via CDN `<script src="unpkg.com/lucide@latest">` + runtime `hydrateIcons()`** — CLAUDE.md wants static SVGs. **Fix:** use `@lucide/astro` static components for icons `network`, `key-round`, `shield-alert`, `laptop`, `sliders-horizontal` (stroke-width 1.5, color via `currentColor`/navy). No runtime JS, no CDN.
3. **Bright-blue `#4487DC` used as body-size link/text** — chevrons/kickers are decorative-OK at large size, but any **body-size link text** in `#4487DC` fails WCAG AA (3.66:1). Footer link hover is `#4487DC` (hover-only, acceptable as it's not the resting state, but verify). Resting link text in the export is `#374151` (slate) which is fine. **Fix:** ensure all actual `<a>` resting text uses royal `#1F3C80` (`--color-royal`) or slate; keep `#4487DC` only for underlines/rules/large headings/glyphs.
4. **CTA shows an email `<input>` form field** — CLAUDE.md: **no forms of any kind**, email-only contact. **Fix:** drop the `<input>` (or render purely decorative/non-functional) and keep only the `mailto:` button. Confirm with owner whether the visual pill stays.
5. **Product CTA copy mismatch** — export CTA reads `Assessment Inițial gratuit — 2 zile` / `Solicită assessment-ul` (the site-wide free-evaluation ask). CLAUDE.md says **product pages use the demo ask**: `Cere un demo` → `mailto:office@smartcontrol.ro?subject=Demo S-VPN`, and must NOT compete with the evaluation ask on the same view. The hero already uses `Solicită un demo`. **Fix (owner decision):** either (a) make this closing band the demo ask to match the hero, or (b) keep assessment but confirm it's the intended single product CTA. Hero button currently `href="#contact"` → should become `mailto:…?subject=Demo S-VPN` per the demo-ask rule. Flag for owner.
6. **Compliance frameworks not in reserved teal** — Card 5 "Console" lists `Rapoarte NIS 2, ISO 27001, GDPR`; spec table and footer mention ISO/GDPR; all render in default ink. CLAUDE.md reserves teal `#1A7A6E` (`--color-compliance`) exclusively for compliance content. **Fix (owner decision):** either tint the NIS 2 / ISO 27001 / GDPR / DORA mentions teal, or confirm the export's plain treatment is intentional for inline list copy.
7. **Footer legal items are plain `<span>`, and include Terms + Cookies** — CLAUDE.md: no terms page, no cookie policy (zero cookies). Only privacy policy exists. **Fix:** render only `Politica de confidențialitate` as a link → `/confidentialitate`; drop `Termeni și condiții` and `Cookies` (or confirm removal with owner).
8. **`#FAFBFD` spec-table label-cell bg has no theme token** — closest is `--color-hover-tint #f8faff` (not equal). **Fix:** add a token (e.g. `--color-table-label`) or reuse `--color-hover-tint`; do not hardcode.
9. **Card resting shadow `rgba(14,31,91,0.06)` vs `--shadow-md` (0.08)** — minor mismatch. **Fix:** add a `--shadow-card` at 0.06 or accept `--shadow-md`; don't hardcode.
10. **Container 1180px vs theme `.container` 1200px** — pick one and apply globally; export is 1180, theme is 1200. Flag for consistency.
11. **`data-skew="4"` present but `initScrollLean` is NOT called** by this page's inline script — the export imports skew hooks but the script only wires `initNavShrink, initNetwork×2, initReveals, initCounters, initWordFill, initParallax, initDrift, initBandScale, initHeroScrub`. **Decision:** either wire `initScrollLean(root)` to honor the `data-skew` attrs (matches the lean intent), or drop the unused attrs. Recommend wiring it for parity with sibling pages, but note it's inert in THIS export.
12. **`initParallax` is called but the page has NO `data-parallax` elements** — it's a no-op here (only `data-drift` is used). Safe to include or omit; note for the coder so they don't hunt for missing parallax targets.

---

## Open questions

1. EN copy for `/en/solutii/s-vpn` is not in this export — needs translation with diacritics-equivalent care; who supplies it?
2. Hero primary CTA `href="#contact"` jumps to the closing band; should it instead be a direct `mailto:…?subject=Demo S-VPN` (the locked product demo ask)? Or keep anchor-to-band + band is the mailto?
3. Is the closing band the "assessment" (free 2-day evaluation, site-wide ask) or the "demo" (product ask)? They are different asks; CLAUDE.md says don't compete them on one view. Which one belongs on the product page?
4. Should the email `<input>` pill be removed entirely (no-forms rule) or kept as a non-functional visual with only the mailto button live?
5. Should NIS 2 / ISO 27001 / GDPR / DORA mentions be tinted with the reserved compliance teal (per design system) or stay inline-plain as the export shows?
6. Footer "Asset Management" links to a products index (`#produse` in export) but there's no Asset Management page in the locked sitemap — confirm target (drop, or point to `/solutii`).
7. `data-skew` lean: wire `initScrollLean` for parity or remove the attrs? (currently inert).
8. Confirm container width 1180 vs theme 1200, and whether to introduce `--shadow-card` (0.06) and `--color-table-label` (#FAFBFD) tokens vs reuse existing near-matches.
9. Motion stack: port these vanilla `motion.js` utilities as-is into an Astro island, or re-implement the same behaviors on GSAP+ScrollTrigger (the project's stated stack)? Behavior/feel must match either way.
10. `scroll-margin-top:76px` on `#module` and `#contact` assumes a ~76px sticky nav height — verify against the built nav's shrunk height.
