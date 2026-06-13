# Build Spec — Home (`/`)

Source of truth: `docs/SMC Web/Home.dc.html` (Claude Design export). Motion hooks wired to `docs/SMC Web/motion.js`. This spec is 1:1 with the export — a coder should never need to open the HTML for copy or values.

## Global page shell

- Root wrapper: `font-family: Inter, 'Segoe UI', -apple-system, sans-serif`; `background: #FFFFFF` (→ `--color-surface`); base text color `#374151` (→ `--color-slate` / `text-slate`); `font-size: 16px` (NOTE: theme `--text-body` is 17px — see Deviations); `line-height: 1.65`; `-webkit-font-smoothing: antialiased`; `overflow-x: hidden`.
- Container width across ALL sections: `max-width: 1180px; margin: 0 auto` (NOTE: theme `.container` is 1200px — see Deviations). Horizontal padding `40px` lives on the section, not the container.
- Section horizontal padding: `40px` left/right almost everywhere (Parteneri is the exception — see that section).
- Body font: Inter. Mono font: `'JetBrains Mono', monospace` (eyebrows, stats, pills, partner names, hex labels, contact line). Map to `--font-sans` / `--font-mono`.
- Global keyframes defined in `<helmet>`: `scWordIn` (opacity 0→1, translateY 20px→0, blur 3px→0), `scFadeIn` (opacity 0→1), `scMarquee` (translateX 0→-50%), `scDriftA` (translate 0,0 → 60px,40px), `scDriftB` (translate 0,0 → -50px,-30px). All gated by `prefers-reduced-motion` reduce block (durations→0.01ms).
- `::selection { background: rgba(68,135,220,0.25); }` (bright-blue 25%).
- `html { scroll-behavior: smooth; }`.

### Inline script init calls (componentDidMount, imports `./motion.js`)
Called in this order:
1. `hydrateIcons()` — lucide createIcons with `stroke-width: 1.5`.
2. `initEmails(root)` — fills `data-email-user`/`data-email-domain` anchors.
3. `initNavShrink(nav)` — default opts (padBig `18px 40px`, padSmall `11px 40px`).
4. `initNetwork(heroCanvas, { lineAlpha: 0.1, dotAlpha: 0.3, spread: 26000, lineDist: 140, speed: 0.12 })` — faint network behind light hero.
5. `initNetwork(darkCanvas, { lineAlpha: 0.22, dotAlpha: 0.55, spread: 20000, lineDist: 150 })` — visible glow in dark Produse band.
6. `initNetwork(ctaCanvas, { lineAlpha: 0.18, dotAlpha: 0.45, spread: 24000, lineDist: 140 })` — dark CTA band.
7. `initReveals(root)` · 8. `initWordFill(root)` · 9. `initParallax(root)` · 10. `initDrift(root)` · 11. `initBandScale(root)` · 12. `initHeroScrub(root)` · 13. `initCounters(root)`.
- NOT called on Home: `initStepper`, `initScrollLean`, `initVelocitySkew`. IMPORTANT: `data-skew` attributes exist on Home (services grid, partners marquee) but `initScrollLean` is NOT called — so they are inert in the export. Treat `data-skew` as decorative/no-op on Home unless the coder also wires `initScrollLean` (open question).
- `initNetwork` default color `68,135,220` (bright), color2 `122,180,232` (sky); no `color` opt passed on Home so all three canvases use brand bright/sky.

---

## SECTION 1 — Nav (always light, fixed)

- **Background:** `#FFFFFF` (→ `--color-surface`). `position: fixed; top/left/right: 0; z-index: 50`.
- **Padding:** `18px 40px` initial; shrinks to `11px 40px` after 24px scroll (via `initNavShrink`).
- **Border-bottom:** `1px solid rgba(229,231,235,0)` (transparent at top) → `#E5E7EB` (→ `--color-border`) when shrunk. **Box-shadow:** none at top → `0 2px 12px rgba(14,31,91,0.08)` (→ `--shadow-md`) when shrunk. Transitions: `padding 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s`.
- **Inner container:** `max-width: 1180px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 32px`.
- **Logo (left):** anchor `href="Home.dc.html"` (→ `/`), `display: flex; align-items: center; gap: 11px`. Mark `<img src="ds/assets/smartcontrol-mark.png" alt="Smart Control">` 34×34px. Wordmark `<span>` 17px / weight 700 / letter-spacing -0.3px / color `#0E1F5B` (→ `--color-navy`) with inner `Control` span colored `#4487DC` (→ `--color-bright`). Markup: `Smart` navy + `Control` bright.
- **Nav links (right cluster, gap 28px):** font 13.5px, weight 500, color `#374151` (→ slate), no underline, `padding-bottom: 3px`, `border-bottom: 2px solid transparent`. Hover: color `#0E1F5B`, border-bottom-color `#4487DC`. Links:
  - `Servicii` → `#servicii`
  - `SEKNET` → `SEKNET.dc.html` (→ `/solutii/seknet`)
  - `S-VPN` → `SVPN.dc.html` (→ `/solutii/s-vpn`)
  - `Cloud & Modernization` → `Cloud.dc.html` (→ `/servicii/cloud`)
- **Nav CTA button:** label **`Solicită assessment`**, `href="#contact"`, font 13.5px weight 600 color `#FFFFFF`, `padding: 9px 18px`, `border-radius: 10px` (→ `--radius-md`), background `#0E1F5B` (→ `--color-navy`). Hover: background `#040C2B` (→ `--color-midnight`), box-shadow `0 4px 16px rgba(14,31,91,0.25)`.
- Carries `ref="{{ navRef }}"` for `initNavShrink`.

---

## SECTION 2 — Hero (light)

- **Element:** `<header>`. **Background:** `linear-gradient(180deg, #F3F6FC 0%, #FFFFFF 100%)` (page-wash `--color-page` → surface). `position: relative; overflow: hidden`.
- **Container/padding:** content wrapper `max-width: 1180px; margin: 0 auto; padding: 190px 40px 110px; position: relative; z-index: 1`. Carries `data-hero-scrub`.
- **Decorative layers (3, behind content):**
  - Parallax blob A: wrapper `data-parallax="0.35"`, `position: absolute; inset: 0; pointer-events: none`; inner circle `top: -180px; left: -120px; 640×640px; border-radius: 999px; background: radial-gradient(circle, rgba(122,180,232,0.22), rgba(122,180,232,0) 65%); animation: scDriftA 16s ease-in-out infinite alternate`.
  - Parallax blob B: wrapper `data-parallax="0.2"`; inner circle `top: 60px; right: -200px; 720×720px; radial-gradient(circle, rgba(68,135,220,0.14), rgba(68,135,220,0) 65%); animation: scDriftB 20s ease-in-out infinite alternate`.
  - Canvas: `ref="{{ heroCanvasRef }}"`, `position: absolute; inset: 0; width/height 100%` — faint node network.
- **Eyebrow:** mono 12.5px, weight 500, letter-spacing 2.5px, uppercase, color `#4487DC` (→ bright), inline-block, `padding-bottom: 10px; border-bottom: 2px solid #D6E8F7` (→ `--color-border-blue`). Animation `scFadeIn 0.8s ease-out 0.1s forwards` (starts opacity 0). Text: **`Trusted Service Delivery Partner`** (verbatim English — locked phrase).
- **H1:** `margin: 28px 0 0; font-size: 64px; font-weight: 800; letter-spacing: -2px; line-height: 1.08; color: #040C2B` (→ midnight); `max-width: 860px`. Built from per-word `<span style="display:inline-block">` each with `scWordIn` staggered animation. Words & delays:
  - `Infrastructură.` (0.25s)
  - `Securitate.` (0.40s)
  - `Software.` (0.55s)
  - `<br>`
  - `Livrate` (0.75s) — color `#4487DC`
  - `de` (0.87s) — color `#4487DC`
  - `echipa` (0.99s) — color `#4487DC`
  - `proprie.` (1.11s) — color `#4487DC`
  - Full line: **"Infrastructură. Securitate. Software. / Livrate de echipa proprie."** (second line in bright blue).
- **Subhead `<p>`:** `margin: 26px 0 0; font-size: 18px; line-height: 1.7; max-width: 600px; color: #374151`; `scFadeIn 0.9s ease-out 1.3s forwards`. Text (verbatim): **"De 22 de ani, Smart Control proiectează, operează și securizează infrastructuri IT pentru companii din România și internațional — `<strong style="color:#0E1F5B; font-weight:600">`echipă proprie, nu subcontractori`</strong>`, abordare consultativă și livrare bazată pe date reale."** (the bolded phrase is navy weight-600).
  - NOTE: "22 de ani" is hardcoded; CLAUDE.md says compute years from 2003 — see Deviations.
- **CTA row:** `margin-top: 38px; display: flex; align-items: center; gap: 18px; flex-wrap: wrap`; `scFadeIn 0.9s ease-out 1.5s forwards`.
  - **Email pill group:** `display: flex; align-items: stretch; gap: 8px; padding: 7px; background: #FFFFFF; border: 1px solid #D6E8F7; border-radius: 14px` (→ `--radius-lg`); box-shadow `0 2px 12px rgba(14,31,91,0.08)` (→ `--shadow-md`).
    - `<input type="email" placeholder="email@companie.ro">` — Inter 14.5px, color `#111827` (→ ink), transparent bg, no border, `padding: 10px 14px; width: 230px`. NOTE: site has NO forms (locked) — this input is decorative/non-functional; the button is the real action. See Deviations.
    - Button label **`Programează un assessment gratuit`**, `href="#contact"`. Inline-flex, 14.5px weight 600 color white, `padding: 11px 22px; border-radius: 10px; background: #4487DC` (→ bright); box-shadow `0 4px 18px rgba(68,135,220,0.35)`. Hover: background `#1F3C80` (→ royal), box-shadow `0 6px 24px rgba(68,135,220,0.45)`.
  - **Secondary text link:** **`Vezi serviciile ›`**, `href="#servicii"`, 14.5px weight 600 color `#4487DC`, `padding: 12px 4px`. Hover color `#1F3C80`. NOTE: bright-blue body-size link text fails AA — see Deviations.
- **ISO/GDPR pill row:** `margin-top: 52px; display: flex; gap: 10px; flex-wrap: wrap`; `scFadeIn 0.9s ease-out 1.7s forwards`. Each pill: mono 11.5px, letter-spacing 0.5px, color `#6B7280` (→ cool), `padding: 5px 12px; border: 1px solid #E5E7EB; border-radius: 999px; background: #FFFFFF`. Pills in order: **`ISO 9001` · `ISO 27001` · `ISO 14001` · `ISO 45001` · `ISO 27701` · `GDPR`**.
  - NOTE: per CLAUDE.md, GDPR (and NIS2/DORA) are regulatory frameworks, render distinct from ISO roundels in reserved teal `#1A7A6E`. The export renders GDPR identical to ISO pills — see Deviations.

---

## SECTION 3 — Statistici (count-up)

- **Background:** white page (no section bg). `padding: 72px 40px 0` (note: top+sides only, 0 bottom — it butts against Servicii).
- **Container:** `max-width: 1180px; margin: 0 auto`.
- **Grid wrapper:** carries `data-reveal data-drift="-0.05"`. `display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #E5E7EB` (→ border; the 1px gap shows as hairline dividers); `border: 1px solid #E5E7EB; border-radius: 16px` (→ `--radius-xl`); `overflow: hidden`; box-shadow `0 2px 12px rgba(14,31,91,0.06)` (→ `--shadow-sm`-ish; exact value is the 0.06 navy tint).
- **Each cell:** `background: #FFFFFF; padding: 34px 32px`. Number: mono 48px weight 600 line-height 1 color `#0E1F5B` (→ navy), with a `+` span colored `#4487DC` (→ bright). Number carries `data-count="N"` (count-up to N over 1400ms, ease-out-cubic; final text is the no-JS fallback). Label below: `margin-top: 12px; font-size: 14px; color: #6B7280` (→ cool).
- **Cells (4):**
  1. `650` + → **`Proiecte livrate`** (`data-count="650"`)
  2. `250` + → **`Clienți satisfăcuți`** (`data-count="250"`)
  3. `25` + → **`Clienți internaționali`** (`data-count="25"`)
  4. `20` + → **`Ani de experiență`** (`data-count="20"`) — NOTE: 20 hardcoded; compute from 2003. See Deviations.

---

## SECTION 4 — Servicii (bento, light)

- **Section:** `id="servicii"`, `padding: 110px 40px; scroll-margin-top: 76px`.
- **Background:** white page (no explicit bg → inherits `#FFFFFF`).
- **Container:** `max-width: 1180px; margin: 0 auto`.
- **Header block** (`data-reveal`):
  - Eyebrow: mono 12px weight 500 letter-spacing 2.5px uppercase color `#4487DC`, inline-block, `padding-bottom: 10px; border-bottom: 2px solid #D6E8F7`. Text: **`Servicii`**.
  - H2 (`data-word-fill="light"`): `margin: 24px 0 0; font-size: 38px; font-weight: 700; letter-spacing: -1px; line-height: 1.15; color: #0E1F5B` (→ navy); `max-width: 700px`. Text: **"Un portofoliu integrat, de la infrastructura fizică până la cod"**.
  - Sub `<p>`: `margin: 16px 0 0; font-size: 16.5px; max-width: 620px; color: #6B7280` (→ cool). Text: **"Patru piloni de servicii, susținuți de 50 de specialiști interni cu peste 500 de ani de experiență cumulată — on-site și remote, același nivel de calitate."**
- **Bento grid:** wrapper `data-skew="4"` (inert — see global note), `margin-top: 52px; display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px`.
- **Card shell (all 4):** outer div has grid-column span + `data-reveal` + `data-reveal-rotate` + `data-drift`. Inner card: `height: 100%; box-sizing: border-box; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 16px; padding: 34px 38px`; box-shadow `0 2px 12px rgba(14,31,91,0.06)`. Transition `transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s, border-color 0.35s`. Hover: `transform: translateY(-5px) scale(1.005); box-shadow: 0 12px 32px rgba(14,31,91,0.14)` (→ `--shadow-lg`); border-color `#D6E8F7`.
- **Card head row:** `display: flex; align-items: center; justify-content: space-between`. Icon chip: `44×44px; border-radius: 10px; background: #EDF5FC` (→ `--color-blue-wash`); `border: 1px solid #D6E8F7`; lucide icon 22×22px color `#0E1F5B`. Index number: mono 12px letter-spacing 2px color `#9CA3AF` (→ faint), values `01`–`04`.
- **Card title `<h3>`:** `margin: 20px 0 0; font-size: 21px; font-weight: 700; letter-spacing: -0.4px; color: #0E1F5B`.
- **Card desc `<p>`:** `margin: 10px 0 0; font-size: 14.5px; color: #6B7280`.
- **Bullet list:** `margin-top: 20px; display: grid; gap: 9px` (cards 01 & 04 use `grid-template-columns: 1fr 1fr; gap: 9px 24px`; cards 02 & 03 single column). Each bullet: 14px color `#374151`; leading `<span style="color:#4487DC; margin-right:8px">›</span>` (chevron glyph per copy rule).

### Card 01 — span 7 · `data-reveal-rotate="-4"` · `data-drift="0.07"` · icon `server`
- Title: **`Infrastructură & Cloud`**
- Desc: **"Proiectăm și consolidăm centre de date, virtualizăm și operăm medii private, hibride și cloud."**
- Bullets (2-col): `Data Center Design & Implementation` · `Consolidare & Virtualizare` · `Private & Hybrid Cloud` · `Business Continuity & DR` · `Storage & Information Management` · `Infrastructure Management`

### Card 02 — span 5 · `data-reveal-delay="100"` · `data-reveal-rotate="4"` · `data-drift="-0.07"` · icon `shield-check`
- Title: **`Securitate & Conformitate`**
- Desc: **"Apărare perimetrală și end-point, identitate și operațiuni de securitate gestionate."**
- Bullets (1-col): `Perimeter & End-point Security` · `Enterprise SSO / PKI` · `Data Leakage Prevention · WAF` · `Conformitate GDPR / NIS 2` · `Managed Security Operations`

### Card 03 — span 5 · `data-reveal-rotate="4"` · `data-drift="0.07"` · icon `code`
- Title: **`Software & Automatizare`**
- Desc: **"Dezvoltare custom, modernizare aplicații și automatizare cu AI — livrare DevSecOps."**
- Bullets (1-col): `Dezvoltare software custom & API` · `DevOps / DevSecOps & CI/CD` · `Migrare și modernizare aplicații` · `Blockchain (Hyperledger, Multichain)` · `Automatizare cu AI / LLM`

### Card 04 — span 7 · `data-reveal-delay="100"` · `data-reveal-rotate="-4"` · `data-drift="-0.07"` · icon `life-buoy`
- Title: **`Servicii Gestionate`**
- Desc: **"Operăm infrastructura, rețeaua și securitatea ta — service desk și suport on-site & remote."**
- Bullets (2-col): `Service Desk Outsourcing` · `Managed Infrastructure Operations` · `Network Managed Services` · `Cyber Security Managed Services` · `Outsourced Systems Support` · `Cloud Based System Support`

---

## SECTION 5 — Produse (DARK band)

- **Section:** `id="produse"`, `data-band` (scale-in 0.94→1, corners 40px→0 via `initBandScale`), `position: relative; overflow: hidden`. **Background:** `#040C2B` (→ `--color-midnight`). `padding: 110px 40px; scroll-margin-top: 76px`.
- **Decorative:** canvas `ref="{{ darkCanvasRef }}"` `position: absolute; inset: 0; 100%×100%; opacity: 0.65` (glow network). Overlay div: `position: absolute; inset: 0; background: radial-gradient(ellipse 70% 60% at 70% 30%, rgba(68,135,220,0.14), rgba(4,12,43,0) 70%)`.
- **Content wrapper:** `position: relative; z-index: 1; max-width: 1180px; margin: 0 auto`.
- **Top split grid:** `display: grid; grid-template-columns: 1.05fr 1fr; gap: 64px; align-items: center`.

**Left column** (`data-reveal`):
- Eyebrow: mono 12px weight 500 ls 2.5px uppercase color `#7AB4E8` (→ sky), `padding-bottom: 10px; border-bottom: 2px solid rgba(122,180,232,0.3)`. Text: **`Produse proprietare`**.
- H2 (`data-word-fill="dark"`): `margin: 24px 0 0; font-size: 38px; weight 700; letter-spacing: -1px; line-height: 1.15; color: #FFFFFF`. Text: **"SEKNET — monitorizare și securitate dintr-o singură consolă"**.
- `<p>`: `margin: 16px 0 0; font-size: 16px; line-height: 1.7; color: rgba(226,233,245,0.7)`. Text: **"Platformă enterprise integrată: vizibilitate completă, detectare avansată a amenințărilor și management granular al identității. Cinci module specializate, o singură sursă de adevăr — acum cu `<strong style="color:#FFFFFF; font-weight:600">`Seknet Trap`</strong>`, modulul de decepție activă."**
- CTA row: `margin-top: 28px; display: flex; align-items: center; gap: 20px`.
  - Primary: **`Explorează SEKNET ›`**, `href="SEKNET.dc.html"` (→ `/solutii/seknet`). Inline-flex gap 8px, 14.5px weight 600 white, `padding: 12px 24px; border-radius: 10px; background: #4487DC`; box-shadow `0 0 28px rgba(68,135,220,0.4)` (glow). Hover: background `#3470C0` (→ `--color-mid-blue`), box-shadow `0 0 40px rgba(68,135,220,0.6)`.
  - Secondary: **`Explorează S-VPN ›`**, `href="SVPN.dc.html"` (→ `/solutii/s-vpn`), 14.5px weight 600 color `#7AB4E8`, `padding: 12px 4px`. Hover color `#FFFFFF`.

**Right column** — module mini-grid (`data-reveal data-reveal-delay="120" data-drift="-0.05"`): `display: grid; grid-template-columns: 1fr 1fr; gap: 14px`.
- Standard module card: `background: rgba(255,255,255,0.03); border: 1px solid rgba(122,180,232,0.18); border-radius: 14px; padding: 22px`. Transition `transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s, box-shadow 0.3s`. Hover: `transform: translateY(-4px); border-color: rgba(68,135,220,0.55); box-shadow: 0 0 28px rgba(68,135,220,0.18)`. Inside: lucide icon 20×20px color `#7AB4E8`; title `margin-top: 12px; font-size: 15.5px; weight 700; color: #FFFFFF`; sub `margin-top: 6px; font-size: 12.5px; line-height: 1.55; color: rgba(226,233,245,0.6)`.
  - `fingerprint` — **`Identity`** — **`SSO · MFA FIDO2 · SCIM 2.0`**
  - `shield` — **`Shield`** — **`SIEM · IDS · MITRE ATT&CK`**
  - `activity` — **`Insight`** — **`ML · detecție anomalii`**
  - `layout-dashboard` — **`View`** — **`Dashboards · topologie · rapoarte`**
- **Trap card (full width):** `grid-column: span 2; display: flex; align-items: center; gap: 14px; background: rgba(68,135,220,0.1); border: 1px solid rgba(68,135,220,0.4); border-radius: 14px; padding: 18px 22px`. Same hover transition; hover border-color `rgba(122,180,232,0.7)`, box-shadow `0 0 28px rgba(68,135,220,0.2)`. Icon `radar` 20×20px color `#7AB4E8` (`flex: none`). Then a baseline-aligned flex (gap 10px, wrap): title **`Trap`** (15.5px weight 700 white); badge **`Nou`** (mono 10px ls 1px uppercase white, `padding: 2px 8px; border-radius: 999px; background: #4487DC`); desc **"Decepție activă — honeypot-uri 20+ protocoale, IDS rețea, hartă de atac live"** (12.5px color `rgba(226,233,245,0.6)`).

**Bottom dual cards** (`data-reveal`): `margin-top: 56px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px`.
- Card A (static, not a link): `display: flex; gap: 18px; align-items: flex-start; background: rgba(255,255,255,0.03); border: 1px solid rgba(122,180,232,0.18); border-radius: 14px; padding: 24px 28px`. Icon chip `40×40px; border-radius: 10px; background: rgba(68,135,220,0.12); border: 1px solid rgba(68,135,220,0.3); flex: none`, lucide `boxes` 20px color `#7AB4E8`. Title **`Asset Management`** (15.5px weight 700 white); desc **"Întregul ciclu de viață al activelor IT — inventariere automată, alerte end-of-life, rapoarte de conformitate NIS 2 / ISO 27001. Cod sursă inclus."** (13.5px line-height 1.6 color `rgba(226,233,245,0.6)`).
- Card B (anchor → `SVPN.dc.html`, i.e. `/solutii/s-vpn`): same shell as Card A but it's an `<a>` with hover (`translateY(-4px)`, border `rgba(68,135,220,0.55)`, box-shadow glow). Icon chip same, lucide `lock`. Title **`S-VPN`**; desc **"Suită integrată de acces remote securizat — VPN, MFA, WAF, Endpoint și Console, la −60% față de soluțiile tradiționale."** (note the minus glyph `−`); link affordance line **`Explorează S-VPN ›`** (`margin-top: 10px; font-size: 13px; weight 600; color: #7AB4E8`).

---

## SECTION 6 — Cloud teaser (light wash)

- **Section:** `data-band` (scale-in). **Background:** `#F3F6FC` (→ `--color-page`). `padding: 110px 40px`.
- **Container:** `max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center`.

**Left column** (`data-reveal`):
- Eyebrow: mono 12px weight 500 ls 2.5px uppercase color `#4487DC`, `padding-bottom: 10px; border-bottom: 2px solid #D6E8F7`. Text: **`Cloud & Modernization`**.
- H2 (`data-word-fill="light"`): `margin: 24px 0 0; 38px; weight 700; letter-spacing: -1px; line-height: 1.15; color: #0E1F5B`. Text: **"Alternativa la hardware-ul tot mai scump: re-arhitecturarea"**.
- `<p>`: `margin: 16px 0 0; 16px; line-height: 1.7; color: #374151`. Text: **"Prețurile componentelor critice cresc sub presiunea cererii pentru infrastructură AI, iar bugetele de refresh nu mai ajung. Re-arhitecturarea și optimizarea aplicațiilor devine strategia principală — iar noi o livrăm printr-un flux de lucru în 5 etape, validat în 650+ proiecte."**
- CTA (anchor): **`Explorează Cloud & Modernization ›`**, `href="Cloud.dc.html"` (→ `/servicii/cloud`). `margin-top: 26px; inline-flex; gap 8px; 14.5px weight 600 white; padding: 12px 24px; border-radius: 10px; background: #0E1F5B` (→ navy). Hover: background `#040C2B`, box-shadow `0 6px 20px rgba(14,31,91,0.25)`.

**Right column** — 3 stacked rows (`data-reveal data-reveal-delay="120" data-drift="-0.05"`): `display: grid; gap: 14px`. Each row: `display: flex; gap: 16px; align-items: center; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 14px; padding: 20px 24px`; box-shadow `0 2px 12px rgba(14,31,91,0.06)`. Each has a mono label tag (`font-family mono; 12px; letter-spacing 1px; color: #4487DC; flex: none; width: 88px`) + a body span (14px color `#374151`):
  - **`CAPEX→OPEX`** — **"Migrarea investițiilor hardware spre modele cloud sau hybrid, cu costuri predictibile."**
  - **`K8S-READY`** — **"Containerizare și migrare pe Kubernetes / OpenShift / AKS / GKE, cu zero-downtime."**
  - **`ROI 90 ZILE`** — **"Validarea investiției printr-un raport de performanță la 90 de zile — date reale, nu estimări."**

---

## SECTION 7 — Parteneri (light marquee)

- **Section:** `id="parteneri"`, `padding: 96px 0; overflow: hidden`. **Background:** `#FFFFFF`. NOTE: vertical padding only — horizontal padding handled by inner wrappers (full-bleed marquee).
- **Heading block** (centered): inner `max-width: 1180px; margin: 0 auto; padding: 0 40px`; child `data-reveal` `text-align: center`.
  - Eyebrow (inline-block, centered): mono 12px weight 500 ls 2.5px uppercase color `#4487DC`, `padding-bottom: 10px; border-bottom: 2px solid #D6E8F7`. Text: **`Parteneri tehnologici`**.
  - `<p>`: `margin: 20px auto 0; 15.5px; max-width: 540px; color: #6B7280; text-align center`. Text: **"Parteneriate cu cei mai importanți producători din lume — soluții testate, suport garantat, roadmap clar."**
- **Marquee:** wrapper `data-skew="8"` (inert), `margin-top: 44px; position: relative; will-change: transform`.
  - Left fade mask: `position: absolute; left: 0; top/bottom 0; width: 160px; z-index: 1; background: linear-gradient(90deg, #FFFFFF, rgba(255,255,255,0))`.
  - Right fade mask: same `right: 0; background: linear-gradient(270deg, #FFFFFF, rgba(255,255,255,0))`.
  - Track: `display: flex; gap: 64px; width: max-content; animation: scMarquee 50s linear infinite` (translateX 0→-50%, so the list is **duplicated** to loop seamlessly).
  - Each label: mono 14px, letter-spacing 2px, uppercase, color `#9CA3AF` (→ faint), `white-space: nowrap`.
  - **Partner names (15 unique, listed twice for the loop):** `Hitachi Vantara` · `Commvault` · `Fortinet` · `Cisco` · `Juniper` · `Lenovo` · `VMware` · `Fujitsu` · `Oracle` · `Microsoft` · `Palo Alto` · `Hanasis` · `IBM` · `HP` · `DELL`. (Text labels only — no logo images. Partner logos-only rule satisfied since no client names appear.)

---

## SECTION 8 — CTA / Contact (DARK band)

- **Section:** `id="contact"`, `data-band` (scale-in), `position: relative; overflow: hidden`. **Background:** `#040C2B` (→ midnight). `padding: 110px 40px; scroll-margin-top: 76px`.
- **Decorative:** canvas `ref="{{ ctaCanvasRef }}"` `position: absolute; inset: 0; 100%×100%; opacity: 0.5`. Overlay: `radial-gradient(ellipse 60% 70% at 50% 40%, rgba(68,135,220,0.16), rgba(4,12,43,0) 70%)`.
- **Content:** `position: relative; z-index: 1; max-width: 760px; margin: 0 auto; text-align: center`. Inner block `data-reveal`.
- Eyebrow: mono 12px weight 500 ls 2.5px uppercase color `#7AB4E8` (no rule under it here). Text: **`Pașii următori`**.
- H2 (`data-word-fill="dark"`): `margin: 22px 0 0; font-size: 40px; weight 700; letter-spacing: -1px; line-height: 1.15; color: #FFFFFF`. Text: **"Assessment Inițial gratuit — 2 zile"**.
- `<p>`: `margin: 18px auto 0; 16.5px; line-height: 1.7; max-width: 560px; color: rgba(226,233,245,0.7)`. Text: **"Fără angajamente. Identificăm împreună zona de interes prioritară și livrăm un raport de recomandări la final."**
- **Email pill group:** `margin-top: 34px; display: inline-flex; align-items: stretch; gap: 8px; padding: 7px; background: rgba(255,255,255,0.05); border: 1px solid rgba(122,180,232,0.25); border-radius: 14px`.
  - `<input type="email" placeholder="email@companie.ro">` — Inter 14.5px, color `#FFFFFF`, transparent, no border, `padding: 10px 14px; width: 230px`. (Decorative — no forms.)
  - Button: **`Solicită assessment-ul`**, anchor carries `data-email-user="office" data-email-domain="smartcontrol.ro"` `href="#"` (JS rewrites to `mailto:office@smartcontrol.ro`). Inline-flex 14.5px weight 600 white, `padding: 11px 22px; border-radius: 10px; background: #4487DC`; box-shadow `0 0 28px rgba(68,135,220,0.45)`. Hover: background `#3470C0`, box-shadow `0 0 40px rgba(68,135,220,0.65)`.
- **Contact line:** `margin-top: 26px; font-family mono; 13px; color: rgba(226,233,245,0.55)`. Contains `<span data-email-user="office" data-email-domain="smartcontrol.ro"></span>` (JS fills text `office@smartcontrol.ro`) ` · www.smartcontrol.ro`.
  - NOTE per CLAUDE.md the canonical CTA subject is `mailto:office@smartcontrol.ro?subject=Evaluare gratuită`; the export's mailto has no subject — see Deviations.

---

## SECTION 9 — Footer (light)

- **Element:** `<footer>`. **Background:** `#FFFFFF`. `border-top: 1px solid #E5E7EB; padding: 64px 40px 40px`.
- **Container:** `max-width: 1180px; margin: 0 auto`.
- **Columns grid:** `display: grid; grid-template-columns: 1.4fr 1fr 1fr 1.2fr; gap: 48px`.

**Col 1 — brand:** logo anchor (`href="Home.dc.html"` → `/`, gap 11px) with `ds/assets/smartcontrol-mark.png` 34×34px + wordmark (17px weight 700 ls -0.3px, `Smart` navy `#0E1F5B` / `Control` bright `#4487DC`). Below: tagline `margin-top: 14px; 13.5px; font-style: italic; color: #6B7280` — **`Trusted Service Delivery Partner`**. Then `margin-top: 18px; 13px; line-height: 1.7; color: #9CA3AF` — **"Fondată în 2003 · 650+ proiecte livrate`<br>`ISO 9001 · 27001 · 14001 · 45001 · 27701"**.

**Col 2 — Servicii:** column header mono 11px weight 600 ls 2px uppercase color `#9CA3AF` — **`Servicii`**. Links (`margin-top: 16px; grid; gap: 10px`; each 13.5px color `#374151`, hover color `#4487DC`), all `href="#servicii"`:
  - **`Infrastructură & Cloud`** · **`Securitate & Conformitate`** · **`Software & Automatizare`** · **`Servicii Gestionate`**

**Col 3 — Produse:** header **`Produse`** (same style). Links:
  - **`SEKNET`** → `SEKNET.dc.html` (→ `/solutii/seknet`)
  - **`S-VPN`** → `SVPN.dc.html` (→ `/solutii/s-vpn`)
  - **`Asset Management`** → `Home.dc.html#produse` (→ `/#produse`)
  - **`Cloud & Modernization`** → `Cloud.dc.html` (→ `/servicii/cloud`)

**Col 4 — Contact:** header **`Contact`** (same style). Then (`margin-top: 16px; grid; gap: 10px`):
  - Email anchor `data-email-user="office" data-email-domain="smartcontrol.ro" href="#"` (JS → `mailto:` + fills text `office@smartcontrol.ro`), 13.5px color `#374151`, hover `#4487DC`.
  - `<span>` **`www.smartcontrol.ro`** (13.5px color `#374151`).
  - Address `<span>` 13.5px line-height 1.6 color `#6B7280`: **"Intrarea Aviator Teodor Iliescu 37,`<br>`011672 București"**.

**Footer bottom bar:** `margin-top: 48px; padding-top: 24px; border-top: 1px solid #F1F5F9` (→ `--color-divider`); `display: flex; justify-content: space-between; align-items: center; gap: 24px`.
  - Left `<span>` 12.5px color `#9CA3AF`: **"© 2026 Smart Control. Toate drepturile rezervate."** (year hardcoded — should be dynamic; see Deviations.)
  - Right cluster (`display: flex; gap: 20px`), three `<span>` (NOT links in the export) 12.5px color `#9CA3AF`: **`Politica de confidențialitate`** · **`Termeni și condiții`** · **`Cookies`**.
    - NOTE per CLAUDE.md / locked sitemap: NO cookie page and NO terms page exist; only `/confidentialitate` (RO) exists as a real link. "Termeni și condiții" and "Cookies" must be removed; "Politica de confidențialitate" must become a real link to `/confidentialitate`. See Deviations.

---

## Icons used (lucide `data-lucide`)
- Services bento: `server` (01), `shield-check` (02), `code` (03), `life-buoy` (04).
- Produse module grid: `fingerprint` (Identity), `shield` (Shield), `activity` (Insight), `layout-dashboard` (View), `radar` (Trap).
- Produse bottom cards: `boxes` (Asset Management), `lock` (S-VPN).
- All rendered at 1.5px stroke (`hydrateIcons` sets `stroke-width: 1.5`). Light-zone icons color navy `#0E1F5B`; dark-zone icons color sky `#7AB4E8`.

## Assets referenced
- `ds/assets/smartcontrol-mark.png` — logo mark, 34×34px, used in nav + footer (in repo: `public/smartcontrol-mark.png`, present at `docs/SMC Web/ds/assets/smartcontrol-mark.png`).
- No other images. No partner logo images (text labels only). Other available marks in `ds/assets/`: `smartcontrol-mark-white.png`, `-mono.png`, `-duotone.png`, `iso-badges.svg`, favicons — not referenced by this export but `-white.png` is useful if logo ever lands on dark.

## Links / CTAs summary (export → Astro route)
- `Home.dc.html` → `/`
- `SEKNET.dc.html` → `/solutii/seknet`
- `SVPN.dc.html` → `/solutii/s-vpn`
- `Cloud.dc.html` → `/servicii/cloud`
- `#servicii` / `#produse` / `#contact` / `#parteneri` — in-page anchors (sections carry `scroll-margin-top: 76px`).
- Mailto obfuscation: anchors/spans with `data-email-user="office"` + `data-email-domain="smartcontrol.ro"`; `initEmails` builds `mailto:office@smartcontrol.ro` and fills empty textContent. Used in CTA button, CTA contact line span, footer contact anchor.

---

## Shared components observed (reusable across pages)
- **Eyebrow** — mono, 12px (12.5px in hero), weight 500, letter-spacing 2.5px, uppercase, bright `#4487DC` (sky `#7AB4E8` on dark), `padding-bottom: 10px`, `border-bottom: 2px solid #D6E8F7` (or `rgba(122,180,232,0.3)` on dark; CTA dark has no rule). Matches `.eyebrow` token but tracking/size differ slightly. → `<Eyebrow variant="light|dark" rule={true|false}>`.
- **Section heading block** — eyebrow + `data-word-fill` H2 (38px / weight 700 / ls -1px / lh 1.15; CTA is 40px) + optional sub `<p>`. → `<SectionHeader>`.
- **Stat block / metric grid** — mono 48px navy number + bright `+`, `data-count`, 14px cool label; 4-up grid with 1px hairline dividers, 16px radius, navy-tinted shadow. → `<StatGrid>` / `<Stat>`.
- **Service / module card** — white, 16px radius, 1px border, navy-tinted shadow, icon chip (44px, blue-wash, bordered) + index + h3 + p + chevron bullets; lift-on-hover. → `<ServiceCard>`. Dark variant (Produse modules): translucent white bg, sky icon. → `<ModuleCard dark>`.
- **Mono pill** — small rounded-full mono label (ISO/GDPR pills; partner names; Trap "Nou" badge; Cloud capability tags). → `<MonoPill>`.
- **Email-capture CTA group** — bordered rounded-14 group: decorative email input + filled primary button; light variant (white bg, border-blue) and dark variant (translucent). The button is the only functional element (mailto). → `<EmailCta variant>`.
- **Dark band** — `data-band` full-bleed midnight section with canvas network + radial glow overlay + relative z-1 content. Used by Produse + CTA. → `<DarkBand>`.
- **Ghost/secondary text link** — `Label ›` chevron-suffixed inline link (bright on light / sky on dark). → `<TextLink>`.
- **CTA band** — centered dark band: eyebrow + word-fill H2 + p + email CTA + mono contact line. → `<CtaBand>`.
- **Marquee** — duplicated mono-label track, 50s linear loop, edge fade masks. → `<LogoMarquee>` (use logo SVGs eventually).
- **Footer** — 4-col (brand / Servicii / Produse / Contact) + bottom legal bar. (Repo's existing `Footer.astro` is a simpler 2-col layout — this export's 4-col footer is richer; reconcile.)
- **Sticky-shrink Nav** — light, fixed, shrinks padding + adds hairline/shadow past 24px. (Repo's `Nav.astro` is `sticky` not `fixed` and has a language switch + different links — reconcile.)

## Deviations to apply (export violates project rules — record, fix at build, do NOT silently restyle)
1. **Google Fonts CDN** — export `<link>`s `fonts.googleapis.com` (Inter + JetBrains Mono). CLAUDE.md: self-host WOFF2 via `@fontsource-variable`, NO Google CDN. Fix: use `Inter Variable` / `JetBrains Mono Variable` already wired in `global.css`; drop the CDN link + preconnects.
2. **Lucide from unpkg CDN** — export loads `https://unpkg.com/lucide@latest` + runtime `hydrateIcons`. CLAUDE.md: use `@lucide/astro` static SVGs (no runtime, no CDN). Fix: replace each `<i data-lucide="x">` with the static `<X />` Astro component at the same size/color/stroke 1.5.
3. **Bright-blue body-size link text fails WCAG AA** — `#4487DC` (3.66:1) used as text on: hero "Vezi serviciile ›", footer hover color, Cloud-tag labels, S-VPN affordance line (on dark it's `#7AB4E8` which is fine on `#040C2B`). On LIGHT, body-size link text must be royal `#1F3C80` (→ `--color-royal`) or navy. Fix: render light-zone text links as royal; keep bright only for underlines/rules/large headings. (Hero button text is white-on-bright — fine.)
4. **Container width 1180px vs theme 1200px** — export uses 1180; theme `.container` is 1200. Decide one; recommend the theme's 1200 with 1.5rem inline padding, or override to 1180 to match the export pixel-for-pixel. (Visual match preference → 1180.)
5. **Base font-size 16px vs theme 17px** — export root is 16px; theme `--text-body` is 17px (web-native scale, deliberate per CLAUDE.md). The fixed px sizes in this export (38px H2, 14.5px copy, etc.) were tuned for 16px base. Recommend adopting the theme's fluid scale (`--text-h2`, `--text-body`…) rather than hardcoding export px — CLAUDE.md explicitly says derive a separate responsive scale, don't copy the deck/export 1:1. Flag: H2 should map to `--text-h2` (clamp 1.5–2rem), hero H1 to `--text-display`, etc. Coder must reconcile pixel-match vs fluid-scale intent.
6. **"22 de ani" / "20+" / "© 2026" hardcoded** — CLAUDE.md: compute years from 2003 founding; don't hardcode. Fix: derive `currentYear - 2003` for the experience figures (today → 23) and `new Date().getFullYear()` for copyright. (The stat count target `data-count="20"` and hero "22 de ani" disagree even within the export — pick the computed value.)
7. **GDPR pill styled like ISO certs** — CLAUDE.md: GDPR/NIS2/DORA are regulatory frameworks, render distinct from ISO roundels in reserved teal `#1A7A6E` (→ `--color-compliance`). Export renders GDPR identical to ISO pills. Fix: render GDPR (and any NIS2/DORA) in compliance teal, visually distinct. (Same applies to "Conformitate GDPR / NIS 2" in service card 02 and "NIS 2 / ISO 27001" in Asset Management — teal accent for framework names where it reads as a badge.)
8. **Footer legal links: Termeni / Cookies don't exist** — locked sitemap has NO terms page and NO cookie page (zero cookies, no forms). Export shows three plain `<span>`s: "Politica de confidențialitate", "Termeni și condiții", "Cookies". Fix: remove "Termeni și condiții" and "Cookies"; make "Politica de confidențialitate" a real `<a href="/confidentialitate">` (`/en/privacy` for EN).
9. **CTA mailto has no subject** — export builds `mailto:office@smartcontrol.ro` (no subject). CLAUDE.md primary CTA: `mailto:office@smartcontrol.ro?subject=Evaluare gratuită`. Fix: append the subject. (Note the export's button copy is "Solicită assessment-ul" / "Programează un assessment gratuit"; CLAUDE.md canonical label is "Programează evaluarea gratuită de 2 zile" — reconcile copy with owner; keeping export copy is acceptable as visual ground truth, but the mailto subject should be added.)
10. **Decorative email `<input>` with no form** — locked: no forms anywhere. The two email inputs are non-functional decoration; only the adjacent button (mailto) works. Fix: either drop the input (cleanest, true to "no forms") or keep it purely visual with no name/submit and ensure it's not in a `<form>`. Recommend keeping the visual pill but the input must do nothing (and ideally be removed for honesty/accessibility). Flag for owner.
11. **`data-skew` present but `initScrollLean` never called** — the export wires `data-skew="4"` (services grid) and `data-skew="8"` (marquee) but the inline script does NOT call `initScrollLean`, so they're inert. Fix: either drop `data-skew` or intentionally enable `initScrollLean` if the lean effect is wanted (it was authored but disabled). Default = leave inert to match export behavior.
12. **i18n** — export is RO-only. Both `/` (RO) and `/en/` (EN) are first-class. All verbatim copy here is the RO source; EN parity must be authored. Nav needs the RO/EN switch (present in repo `Nav.astro`, absent in export).

## Open questions
- Pixel-match vs fluid type: should the build reproduce the export's exact px (16px base, 1180 container, 38/40/64px headings) for a 1:1 visual match, or adopt the theme's fluid `clamp()` scale per CLAUDE.md? The two are in tension; needs an explicit owner/lead call. (This drives whether `home` looks identical to the export or "on-brand but rescaled".)
- Should `data-skew` lean be enabled (call `initScrollLean`) or stay inert as in the export?
- Decorative email inputs: drop entirely (true "no forms") or keep as visual-only? Accessibility prefers dropping.
- Footer: adopt the export's richer 4-column footer, or keep the repo's existing simpler 2-column `Footer.astro`? They differ substantially.
- Nav: export is `fixed` + shrink-on-scroll with a CTA "Solicită assessment" and product links (SEKNET/S-VPN as separate items); repo `Nav.astro` is `sticky` + RO/EN switch + grouped "Servicii/Cloud/Produse/Contact". Which wins? (Export is the visual ground truth, but repo nav already encodes i18n + the locked sitemap grouping.)
- Mobile/responsive: the export has NO media queries beyond `prefers-reduced-motion` — all grids are desktop fixed (12-col bento, 4-col stats, 2-col splits, 4-col footer). Responsive breakpoints (stacking on mobile) are unspecified and must be designed.
- "Cloud & Modernization" nav label vs the locked route `/servicii/cloud` under the Services hub — confirm the IA mapping (export treats Cloud as a top-level nav item alongside Servicii).
- Hero H1 line break: the `<br>` forces "Livrate de echipa proprie." onto line 2 at desktop; confirm desired wrapping at narrower widths.
