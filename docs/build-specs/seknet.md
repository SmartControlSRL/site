# Build Spec — SEKNET product page

- **Target route:** `/solutii/seknet` (RO) + `/en/solutii/seknet` (EN parity). Template A (product detail, dark hero).
- **Source of truth:** `docs/SMC Web/SEKNET.dc.html` (export, visual ground truth). This spec carries all copy verbatim — a coder should never need to open the HTML for text.
- **Page background:** `#FFFFFF` (white) at the page root. Root text color `#374151` → `text-slate`, base font 16px / line-height 1.65, `overflow-x: hidden`, `-webkit-font-smoothing: antialiased`. Note global.css sets body bg `--color-page #F3F6FC` and body text `--text-body 17px`; the export's page root is white/16px — render sections with explicit backgrounds (every section declares its own), and let section bg win.
- **Font families used:** Inter (sans) and JetBrains Mono (`'JetBrains Mono', monospace`) for eyebrows / stats / spec table / hero stat row. Both self-hosted (see Deviations).
- **Global container:** `max-width: 1180px; margin: 0 auto;` with horizontal padding `40px` carried on each section's padding shorthand. Existing `.container` token is `max-width: 1200px; padding-inline: 1.5rem(24px)` — close but NOT identical (1180 vs 1200, 40px vs 24px). Use a 1180px max-width + 40px inline padding to match; flag if standardizing on `.container`.
- **Selection color:** `::selection { background: rgba(68,135,220,0.25); }`.

---

## Section order (top → bottom)
1. Nav (light, shared, fixed)
2. Product Hero (dark + network canvas)
3. Module — 5 specialized modules (light)
4. Spec Table (mono, gray wash band)
5. Alte produse / "Din aceeași familie" (light)
6. CTA (dark band + network canvas)
7. Footer (light, shared)

---

## 1. NAV (light, shared, fixed)

- **Element:** `<nav>` `data-screen-label="Nav"`. `position: fixed; top/left/right: 0; z-index: 50;`
- **Background:** `#FFFFFF` → `bg-surface`. Bottom border `1px solid rgba(229,231,235,0)` (transparent at top; becomes `#E5E7EB` → `border` when shrunk — handled by `initNavShrink`).
- **Padding:** `18px 40px` at top; shrinks to `11px 40px` after 24px scroll. Transition `padding 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s`. On shrink also adds `box-shadow: 0 2px 12px rgba(14,31,91,0.08)` (= `--shadow-md`).
- **Inner:** `max-width: 1180px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 32px;`

### Logo (left)
- `<a href="Home.dc.html">` → Astro: `/` (RO home). `display: flex; align-items: center; gap: 11px; text-decoration: none;`
- Image: `ds/assets/smartcontrol-mark.png` alt `Smart Control`, `34×34px`.
- Wordmark: `<span>` `font-size: 17px; font-weight: 700; letter-spacing: -0.3px; color: #0E1F5B`(→`text-navy`): text **`Smart`** + nested `<span style="color:#4487DC">`(→`text-bright`)**`Control`**.

### Nav links (right) — `display: flex; align-items: center; gap: 28px;`
All links `font-size: 13.5px`, `text-decoration: none; padding-bottom: 3px; border-bottom: 2px solid transparent`. Inactive: `font-weight: 500; color: #374151`(→`text-slate`); hover (`style-hover`) → `color: #0E1F5B; border-bottom-color: #4487DC`.
- `Servicii` → `Home.dc.html#servicii` → Astro `/#servicii` (or `/servicii`). weight 500.
- `SEKNET` → `SEKNET.dc.html` → `/solutii/seknet`. **ACTIVE state:** `font-weight: 600; color: #0E1F5B; border-bottom: 2px solid #4487DC`.
- `S-VPN` → `SVPN.dc.html` → `/solutii/s-vpn`. weight 500.
- `Cloud & Modernization` → `Cloud.dc.html` → `/servicii/cloud`. weight 500. (Label literal: `Cloud & Modernization`.)
- **CTA button** `Solicită demo` → `#contact`. `font-weight: 600; color: #FFFFFF; padding: 9px 18px; border-radius: 10px`(→`rounded-md`); `background: #0E1F5B`(→`bg-navy`); hover → `background: #040C2B`(→`bg-midnight`), `box-shadow: 0 4px 16px rgba(14,31,91,0.25)`.

---

## 2. PRODUCT HERO (dark + network)

- **Element:** `<header>` `data-screen-label="SEKNET Hero (dark)"`. `position: relative; overflow: hidden;`
- **Background:** `#040C2B` → `bg-midnight`.
- **Canvas:** `<canvas ref="{{ heroCanvasRef }}">` `position: absolute; inset: 0; width/height: 100%; opacity: 0.75;` → ambient network (see Motion).
- **Vignette overlay:** absolute div, `background: radial-gradient(ellipse 75% 65% at 35% 40%, rgba(4,12,43,0) 0%, rgba(4,12,43,0.5) 60%, #040C2B 100%);` (no token — inline literal).
- **Content wrapper:** `<div data-hero-scrub>` `position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 190px 40px 120px;` (large top padding to clear the fixed nav).

### Eyebrow
`font-family: 'JetBrains Mono'; font-size: 12.5px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase; color: #7AB4E8`(→`text-sky`); `display: inline-block; padding-bottom: 10px; border-bottom: 2px solid rgba(122,180,232,0.3)`. Entry anim: `opacity:0; animation: scFadeIn 0.8s ease-out 0.1s forwards`.
Copy: **`Produs proprietar · Fișa de specificații v2.3`**

### H1
`margin: 26px 0 0; font-size: 62px; font-weight: 800; letter-spacing: -2px; line-height: 1.08; color: #FFFFFF; max-width: 840px;`. Built from 4 inline-block `<span>`s each with `scWordIn` keyframe (staggered delays), then a `<br>` after the 2nd span:
- Span 1 (white, delay 0.25s): **`SEKNET.`**
- Span 2 (`color: #7AB4E8`→sky, delay 0.45s): **`Monitorizare.`**
- `<br>`
- Span 3 (sky, delay 0.62s): **`Securitate.`**
- Span 4 (sky, delay 0.79s): **`Control.`**
Rendered text: `SEKNET. Monitorizare.` / `Securitate. Control.`

### Lead paragraph
`margin: 26px 0 0; font-size: 18px; line-height: 1.7; max-width: 640px; color: rgba(226,233,245,0.72);` anim `scFadeIn 0.9s ease-out 1.0s forwards`. Inline `<strong style="color:#FFFFFF; font-weight:600">` on two phrases.
Copy (verbatim, strong-wrapped phrases marked **bold**):
> Platformă enterprise integrată de monitorizare, securitate cibernetică și management al identității — **cinci module specializate**, arhitectură cloud-native pe microservicii, scalare orizontală nelimitată **fără costuri de licențiere adiționale**.

### CTA row
`margin-top: 38px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap;` anim `scFadeIn 0.9s ease-out 1.2s forwards`.
- **Primary button** `Solicită un demo` → `#contact`. `display: inline-flex; align-items: center; font-size: 14.5px; font-weight: 600; color: #FFFFFF; padding: 13px 26px; border-radius: 10px; background: #4487DC`(→`bg-bright`); `box-shadow: 0 0 28px rgba(68,135,220,0.45)` (accent glow); hover → `background: #3470C0`(→`bg-mid-blue`), `box-shadow: 0 0 40px rgba(68,135,220,0.65)`.
- **Text link** `Vezi modulele ›` → `#module`. `font-size: 14.5px; font-weight: 600; color: #7AB4E8`(→sky on dark, OK for contrast); `padding: 13px 8px`; hover → `color: #FFFFFF`. (Glyph `›`.)

### Hero stat row (4 mono pills)
`margin-top: 56px; display: flex; gap: 36px; flex-wrap: wrap;` anim `scFadeIn 0.9s ease-out 1.4s forwards`. Each item: `font-family: 'JetBrains Mono'; font-size: 12.5px; color: rgba(226,233,245,0.55);` with a leading `<span style="color:#7AB4E8">▸</span>` (sky triangle glyph `▸`).
Copy (4 items, each prefixed `▸`):
- `≥ 50.000 EPS per nod`
- `< 1s latență indexare`
- `Multi-tenancy, izolare per tenant`
- `Stocare istorică nelimitată`

---

## 3. MODULE (light deep-dive, 5 modules)

- **Element:** `<section id="module">` `data-screen-label="Module"`. `padding: 110px 40px; scroll-margin-top: 76px;` (anchor offset for fixed nav).
- **Background:** none declared → inherits white page bg. (light)
- **Inner:** `max-width: 1180px; margin: 0 auto;`

### Header block — `<div data-reveal>`
- **Eyebrow:** mono, `font-size: 12px; font-weight: 500; letter-spacing: 2.5px; uppercase; color: #4487DC`(→bright); `display: inline-block; padding-bottom: 10px; border-bottom: 2px solid #D6E8F7`(→`border-border-blue`). Copy: **`Module`**
- **H2:** `data-word-fill="light"`. `margin: 24px 0 0; font-size: 38px; font-weight: 700; letter-spacing: -1px; line-height: 1.15; color: #0E1F5B`(→navy); `max-width: 700px`. Copy: **`Cinci module specializate, o singură sursă de adevăr`**
- **Sub-paragraph:** `margin: 16px 0 0; font-size: 16.5px; max-width: 640px; color: #6B7280`(→`text-cool`). Copy:
  > 50 de specificații funcționale și 30 non-funcționale, documentate în fișa tehnică v2.3 — fiecare capabilitate aparține unui modul, totul operat dintr-o singură interfață.

### Card grid — `<div data-skew="4">`
`margin-top: 52px; display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px;`. 5 cards spanning a 6-col grid: row 1 = three `span 2` cards; row 2 = two `span 3` cards. `data-skew="4"` on the grid wrapper drives scroll-lean (NOTE: page script does NOT call `initScrollLean`, so this is inert in the export — see Open Questions).

**Standard light card shell (cards 1–4):** `height: 100%; box-sizing: border-box; background: #FFFFFF; border: 1px solid #E5E7EB`(→border); `border-radius: 16px`(→`rounded-xl`); `padding: 30px 32px; box-shadow: 0 2px 12px rgba(14,31,91,0.06)`(≈`--shadow-md` but 0.06 not 0.08 — flag: closer to `--shadow-sm` opacity); transition `transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s, border-color 0.35s`; hover → `transform: translateY(-5px); box-shadow: 0 12px 32px rgba(14,31,91,0.14)`(→`--shadow-lg`); `border-color: #D6E8F7`(border-blue).

**Card header pattern:** `display: flex; align-items: center; gap: 14px;`
- Icon chip: `display:flex; align-items:center; justify-content:center; width:44px; height:44px; border-radius:10px`(→`rounded-md`); `background: #EDF5FC`(→`bg-blue-wash`); `border: 1px solid #D6E8F7`(border-blue). Icon `<i data-lucide="...">` `width/height: 22px; color: #0E1F5B`(navy).
- Eyebrow line: mono `font-size: 11px; letter-spacing: 1.5px; uppercase; color: #4487DC`(bright). Text **`Seknet`**.
- H3: `margin: 2px 0 0; font-size: 19px; font-weight: 700; letter-spacing: -0.3px; color: #0E1F5B`(navy).
- Module sub-label `<p>`: `margin: 16px 0 0; font-size: 13.5px; color: #6B7280`(cool).
- Bullet list: `margin-top: 16px; display: grid; gap: 8px;` (single column for span-2 cards; two-column `grid-template-columns: 1fr 1fr; gap: 8px 20px;` for the span-3 View card). Each bullet `font-size: 13.5px; color: #374151`(slate) with leading `<span style="color:#4487DC; margin-right:8px">›</span>` (bright chevron `›`).

#### Card 1 — Seknet **Identity** (`span 2`)
`data-reveal data-reveal-rotate="-4" data-drift="0.07"`. Icon `data-lucide="fingerprint"`.
- Sub-label: **`Management identitate și acces (IAM).`**
- Bullets (5, single col):
  - `SSO — OAuth2, OIDC, SAML 2.0`
  - `MFA — TOTP, WebAuthn / FIDO2`
  - `RBAC granular + Segregation of Duties`
  - `AD / LDAP / RADIUS nativ`
  - `Provizionare automată SCIM 2.0`

#### Card 2 — Seknet **Shield** (`span 2`)
`data-reveal data-reveal-delay="80" data-reveal-rotate="4"`. Icon `data-lucide="shield"`.
- Sub-label: **`SIEM și securitate cibernetică.`**
- Bullets (5):
  - `Corelație multi-sursă + MITRE ATT&CK`
  - `IDS — semnături și comportament`
  - `File Integrity Monitoring în timp real`
  - `Threat intel — VirusTotal, OTX, MISP`
  - `Răspuns activ — blocare IP, izolare endpoint`

#### Card 3 — Seknet **Insight** (`span 2`)
`data-reveal data-reveal-delay="160" data-reveal-rotate="-4" data-drift="-0.07"`. Icon `data-lucide="activity"`.
- Sub-label: **`Analiză, căutare și stocare date.`**
- Bullets (5):
  - `Căutare distribuită, indexare în timp real`
  - `Query DSL, Lucene sau SQL`
  - `Stocare istorică nelimitată — zero cost / GB`
  - `ML nativ — anomalii spike & drop`
  - `API RESTful — OpenAPI / Swagger`

#### Card 4 — Seknet **View** (`span 3`)
`data-reveal data-reveal-rotate="4" data-drift="0.07"`. Icon `data-lucide="layout-dashboard"`.
- Sub-label: **`Interfață unificată și RBAC avansat.`**
- Bullets (5, TWO-COLUMN layout `1fr 1fr; gap: 8px 20px`):
  - `200+ dashboard-uri predefinite`
  - `Hartă topologică interactivă`
  - `Rapoarte automate PDF / CSV`
  - `Acces vizualizare per rol`
  - `Conformitate PCI-DSS, HIPAA, GDPR, NIS 2, ISO 27001`
  - (NOTE: "GDPR, NIS 2, ISO 27001" are compliance terms appearing in slate body — see Deviations re: reserved teal.)

#### Card 5 — Seknet **Trap** (`span 3`, DARK featured card)
`data-reveal data-reveal-delay="80" data-reveal-rotate="-4" data-drift="-0.07"`.
- **Dark card shell:** `background: #0E1F5B`(navy); `border: 1px solid #1F3C80`(→`border-royal`/royal); `border-radius: 16px; padding: 30px 32px; box-shadow: 0 2px 12px rgba(14,31,91,0.2)`; hover → `transform: translateY(-5px); box-shadow: 0 12px 36px rgba(14,31,91,0.35); border-color: #3470C0`(mid-blue).
- **Header row:** `display: flex; align-items: center; justify-content: space-between; gap: 14px;`
  - Left group `display:flex; gap:14px;`: Icon chip `background: rgba(68,135,220,0.16); border: 1px solid rgba(68,135,220,0.4);` icon `data-lucide="radar"` `color: #7AB4E8`(sky). Eyebrow mono `color: #7AB4E8`(sky) text **`Seknet`**; H3 `color: #FFFFFF` text **`Trap`**.
  - Right badge/pill: `font-family: 'JetBrains Mono'; font-size: 10.5px; letter-spacing: 1px; uppercase; color: #FFFFFF; padding: 4px 10px; border-radius: 999px; background: #4487DC`(bright). Text **`Nou în v2.3`**.
- **Sub-label `<p>`:** `margin: 16px 0 0; font-size: 13.5px; color: rgba(226,233,245,0.7);` with inline `<strong style="color:#FFFFFF">`. Copy:
  > Detecție activă prin decepție și honeypot — orice interacțiune e prin definiție malițioasă: **zero fals pozitive**.
- **Bullets (6, TWO-COLUMN `1fr 1fr; gap: 8px 20px`):** each `font-size: 13.5px; color: rgba(226,233,245,0.85);` leading `<span style="color:#7AB4E8">›</span>` (sky chevron):
  - `Honeypot-uri — 20+ protocoale`
  - `Detecție mișcare laterală`
  - `Capturare sesiuni + export IoC`
  - `IDS rețea — scan, exploit, C2`
  - `Hartă de atac live cu geolocație`
  - `Honeypot-uri LLM — servicii simulate`

---

## 4. SPEC TABLE (mono, gray wash band)

- **Element:** `<section data-band>` `data-screen-label="Specificații"`. `padding: 110px 40px;`
- **Background:** `#F3F6FC` → `bg-page`. (wash band)
- **`data-band`** → drives band scale-in (scale 0.94→1, border-radius 40→0). Note `position` is static here; the scale/radius applies to the whole `<section>`.
- **Inner:** `max-width: 1180px; margin: 0 auto;`

### Header — `<div data-reveal>`
- Eyebrow: mono `12px; ls 2.5px; uppercase; color #4487DC; border-bottom: 2px solid #D6E8F7`. Copy: **`Specificații · v2.3`**
- H2 `data-word-fill="light"`: `margin: 24px 0 0; 38px/700; ls -1px; lh 1.15; color #0E1F5B`. Copy: **`Specificații documentate, negru pe alb`**

### Stat strip (4 giant-number cells) — `<div data-reveal>`
`margin-top: 44px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #E5E7EB`(hairline grid via 1px gap on grey bg); `border: 1px solid #E5E7EB; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(14,31,91,0.06);`
Each cell: `background: #FFFFFF; padding: 28px 28px;`
- Number: `font-family: 'JetBrains Mono'; font-size: 34px; font-weight: 600; line-height: 1; color: #0E1F5B`(navy) with accent sub-part in `#4487DC`(bright).
- Caption: `margin-top: 10px; font-size: 13.5px; color: #6B7280`(cool).

| Number (navy + bright accent) | Caption |
|---|---|
| `50K` + `+`(bright) | `Evenimente / secundă / nod` |
| `<1` + `s`(bright) | `Latență indexare` |
| `10GB` + `+`(bright) | `Ingestie zilnică, fără plafon` |
| `∞` (navy only) | `Retenție date — zero cost licență` |

(Static numbers — NO `data-count` here; render literally.)

### Spec rows table — `<div data-reveal data-drift="-0.04">`
`margin-top: 20px; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(14,31,91,0.06);`
Each row: `display: grid; grid-template-columns: 200px 1fr;` with `border-bottom: 1px solid #F1F5F9`(→`border-divider`) on all rows EXCEPT the last (Deployment) which has none.
- **Label cell (left):** mono `font-size: 11.5px; letter-spacing: 1.5px; uppercase; color: #4487DC`(bright); `padding: 18px 28px; background: #FAFBFD;` (NOTE `#FAFBFD` has NO token — near-white tint; closest is `--color-hover-tint #F8FAFF` but not identical → flag).
- **Value cell (right):** mono `font-size: 13px; line-height: 1.7; color: #374151`(slate); `padding: 18px 28px;`

| Label | Value (verbatim, mono) |
|---|---|
| `Performanță` | `≥ 50.000 EPS / nod · indexare < 1s · căutare < 5s pe 100 GB · alertă < 60s · overhead agent < 1% CPU` |
| `Scalabilitate` | `1.000+ surse simultane · ≥ 10 GB/zi fără plafon · scalare orizontală fără downtime · multi-tenancy cu izolare completă` |
| `Continuitate` | `RTO < 4h · RPO < 1h · failover < 30s · rolling updates fără întrerupere · replicare ≥ 2x` |
| `Securitate` | `TLS 1.2 / 1.3 în tranzit · AES-256 la repaus · jurnal audit tamper-proof · secrete în vault (K8s Secrets) · hardening CIS Level 1 implicit` |
| `Integrări` | `API REST (OpenAPI/Swagger) · ServiceNow, Jira, Zendesk · SOAR — Splunk, IBM, TheHive · email, Slack, Teams, SNS, PagerDuty, webhooks` |
| `Deployment` | `Cloud-native, microservicii containerizate · on-premise, hibrid sau cloud (AWS, Azure, GCP) · agenți Windows, Linux, macOS, Solaris, AIX, HP-UX · interfață ro-RO și en-US` |

(Separator glyph between value items is the middle dot `·`. Comparison glyphs `≥ < ∞` rendered as Unicode literals in the export — keep as text.)

---

## 5. ALTE PRODUSE ("Din aceeași familie", light)

- **Element:** `<section>` `data-screen-label="Alte produse"`. `padding: 110px 40px;`
- **Background:** none → white page bg. (light)
- **Inner:** `max-width: 1180px; margin: 0 auto;`

### Header — `<div data-reveal>`
- Eyebrow: mono `12px; ls 2.5px; uppercase; color #4487DC; border-bottom: 2px solid #D6E8F7`. Copy: **`Din aceeași familie`**
- H2 `data-word-fill="light"`: `24px 0 0; 38px/700; ls -1px; lh 1.15; color #0E1F5B`. Copy: **`Completează platforma`**

### Card grid
`margin-top: 44px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;` (2 cols).

#### Card A — S-VPN (clickable link card) — `<div data-reveal data-drift="0.06">`
Inner is an `<a href="SVPN.dc.html">` → Astro `/solutii/s-vpn`. `height:100%; box-sizing:border-box; display: flex; gap: 20px; align-items: flex-start; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 16px; padding: 30px 34px; box-shadow: 0 2px 12px rgba(14,31,91,0.06); text-decoration: none;` hover → `translateY(-5px); box-shadow: 0 12px 32px rgba(14,31,91,0.14); border-color: #D6E8F7`.
- Icon chip (`flex: none`): `44×44; rounded 10px; background #EDF5FC; border 1px #D6E8F7`; icon `data-lucide="lock"` `22px; color #0E1F5B`.
- Body `<span style="display:block">`:
  - H3: `margin:0; font-size: 18px; font-weight: 700; color: #0E1F5B`. Copy: **`S-VPN`**
  - `<p>`: `margin: 8px 0 0; font-size: 14px; line-height: 1.65; color: #6B7280`. Copy:
    > Suită integrată de acces remote securizat — VPN, MFA, WAF, Endpoint și Console, la −60% față de Cisco / Fortinet.
    (NOTE the minus glyph `−` in `−60%`, a U+2212, not hyphen.)
  - Link cue `<span>`: `display:inline-block; margin-top: 12px; font-size: 13.5px; font-weight: 600; color: #4487DC`(bright). Copy: **`Explorează S-VPN ›`** — (this is the visible CTA text inside a link card; bright `#4487DC` on white = 3.66:1, fails AA → see Deviations.)

#### Card B — Asset Management (non-link, static) — `<div data-reveal data-reveal-delay="100" data-drift="-0.06">`
Inner is a `<div>` (NOT a link, no href). Same shell minus border-color hover: `display:flex; gap:20px; align-items:flex-start; background #FFFFFF; border 1px #E5E7EB; rounded 16px; padding 30px 34px; box-shadow 0 2px 12px rgba(14,31,91,0.06);` hover → `translateY(-5px); box-shadow: 0 12px 32px rgba(14,31,91,0.14)` (no border-color change).
- Icon chip: `44×44; rounded 10px; background #EDF5FC; border 1px #D6E8F7`; icon `data-lucide="boxes"` `22px; color #0E1F5B`.
- H3: `18px/700; color #0E1F5B`. Copy: **`Asset Management`**
- `<p>`: `8px 0 0; 14px; lh 1.65; color #6B7280`. Copy:
  > Întregul ciclu de viață al activelor IT — inventariere automată, alerte end-of-life, rapoarte de conformitate NIS 2 și pregătire audit ISO 27001. Integrare nativă cu SEKNET.

---

## 6. CTA (dark band + network)

- **Element:** `<section id="contact" data-band>` `data-screen-label="CTA (dark)"`. `position: relative; overflow: hidden; padding: 110px 40px; scroll-margin-top: 76px;`
- **Background:** `#040C2B` → `bg-midnight`. (dark)
- **Canvas:** `<canvas ref="{{ ctaCanvasRef }}">` `position: absolute; inset: 0; 100%/100%; opacity: 0.5;` → network bg (calmer opts than hero).
- **Glow overlay:** absolute div, `background: radial-gradient(ellipse 60% 70% at 50% 40%, rgba(68,135,220,0.16), rgba(4,12,43,0) 70%);`
- **Content:** `position: relative; z-index: 1; max-width: 760px; margin: 0 auto; text-align: center;`

### Inner — `<div data-reveal>`
- Eyebrow: mono `font-size: 12px; font-weight: 500; ls 2.5px; uppercase; color: #7AB4E8`(sky). Copy: **`Demo live`**
- H2 `data-word-fill="dark"`: `margin: 22px 0 0; font-size: 40px; font-weight: 700; ls -1px; lh 1.15; color: #FFFFFF`. Copy: **`Vezi SEKNET pe infrastructura ta`**
- `<p>`: `margin: 18px auto 0; font-size: 16.5px; lh 1.7; max-width: 560px; color: rgba(226,233,245,0.7);` Copy:
  > Demo pe un mediu de test cu datele tale reale — nu un slide deck. Programăm în aceeași săptămână.

### Email "input" group (decorative pill — see Deviations)
`margin-top: 34px; display: inline-flex; align-items: stretch; gap: 8px; padding: 7px; background: rgba(255,255,255,0.05); border: 1px solid rgba(122,180,232,0.25); border-radius: 14px;`(→`rounded-lg`)
- `<input type="email" placeholder="email@companie.ro">`: `font-family: Inter; font-size: 14.5px; color: #FFFFFF; background: transparent; border: none; outline: none; padding: 10px 14px; width: 230px;` Placeholder text: **`email@companie.ro`**.
- **Submit button** `<a data-email-user="office" data-email-domain="smartcontrol.ro" href="#">`: at runtime `initEmails` rewrites href → `mailto:office@smartcontrol.ro`. `display: inline-flex; align-items: center; font-size: 14.5px; font-weight: 600; color: #FFFFFF; padding: 11px 22px; border-radius: 10px; background: #4487DC`(bright); `box-shadow: 0 0 28px rgba(68,135,220,0.45);` hover → `background #3470C0; box-shadow 0 0 40px rgba(68,135,220,0.65)`. Copy: **`Solicită demo`**.
- **Caption line:** `margin-top: 26px; font-family: 'JetBrains Mono'; font-size: 13px; color: rgba(226,233,245,0.55);` = `<span data-email-user="office" data-email-domain="smartcontrol.ro"></span>` (filled to `office@smartcontrol.ro` at runtime) + ` · www.smartcontrol.ro`.

**SCOPE NOTE (CLAUDE.md):** This is a product page → the product CTA should be **"Cere un demo" → mailto with subject `Demo SEKNET`** (`mailto:office@smartcontrol.ro?subject=Demo SEKNET`). The export uses "Solicită demo"/"Solicită un demo" with a plain `mailto:` (no subject) and a fake email input. Project also forbids forms. See Deviations.

---

## 7. FOOTER (light, shared)

- **Element:** `<footer>` `data-screen-label="Footer"`. `background: #FFFFFF; border-top: 1px solid #E5E7EB; padding: 64px 40px 40px;`
- **Inner:** `max-width: 1180px; margin: 0 auto;`
- **Top grid:** `display: grid; grid-template-columns: 1.4fr 1fr 1fr 1.2fr; gap: 48px;`

### Col 1 — brand
- Logo `<a href="Home.dc.html">`→`/`: same mark (34×34, `ds/assets/smartcontrol-mark.png`) + `Smart`+`Control`(bright) wordmark (17px/700/-0.3px/navy).
- Tagline `<div>`: `margin-top: 14px; font-size: 13.5px; font-style: italic; color: #6B7280`. Copy: **`Trusted Service Delivery Partner`** (canonical English italic phrase).
- Meta `<div>`: `margin-top: 18px; font-size: 13px; line-height: 1.7; color: #9CA3AF`(→`text-faint`). Copy (with `<br>`):
  > `Fondată în 2003 · 650+ proiecte livrate`
  > `ISO 9001 · 27001 · 14001 · 45001 · 27701`

### Col 2 — Servicii
- Heading: mono `font-size: 11px; font-weight: 600; ls 2px; uppercase; color: #9CA3AF`. Copy: **`Servicii`**
- Links `margin-top: 16px; display: grid; gap: 10px;` each `font-size: 13.5px; color: #374151; text-decoration: none;` hover→`color: #4487DC`. All → `Home.dc.html#servicii` (Astro `/#servicii` or `/servicii`):
  - `Infrastructură & Cloud`
  - `Securitate & Conformitate`
  - `Software & Automatizare`
  - `Servicii Gestionate`

### Col 3 — Produse
- Heading mono (same style): **`Produse`**
- Links:
  - `SEKNET` → `SEKNET.dc.html` → `/solutii/seknet`
  - `S-VPN` → `SVPN.dc.html` → `/solutii/s-vpn`
  - `Asset Management` → `Home.dc.html#produse` → `/#produse`
  - `Cloud & Modernization` → `Cloud.dc.html` → `/servicii/cloud`

### Col 4 — Contact
- Heading mono (same style): **`Contact`**
- Items `margin-top: 16px; display: grid; gap: 10px;`:
  - `<a data-email-user="office" data-email-domain="smartcontrol.ro" href="#">` → runtime `mailto:office@smartcontrol.ro`, text filled to `office@smartcontrol.ro`. `font-size: 13.5px; color: #374151;` hover→`#4487DC`.
  - `<span>`: `font-size: 13.5px; color: #374151;` Copy: **`www.smartcontrol.ro`**
  - `<span>`: `font-size: 13.5px; line-height: 1.6; color: #6B7280;` Copy (with `<br>`):
    > `Intrarea Aviator Teodor Iliescu 37,`
    > `011672 București`

### Footer bottom bar
`margin-top: 48px; padding-top: 24px; border-top: 1px solid #F1F5F9; display: flex; justify-content: space-between; align-items: center; gap: 24px;`
- Left `<span>`: `font-size: 12.5px; color: #9CA3AF`. Copy: **`© 2026 Smart Control. Toate drepturile rezervate.`**
- Right `<div style="display:flex; gap:20px;">` three `<span>`s `font-size: 12.5px; color: #9CA3AF` (plain text, NOT links in export):
  - `Politica de confidențialitate`
  - `Termeni și condiții`
  - `Cookies`
  (NOTE: per CLAUDE.md there is NO terms or cookies page and zero cookies → see Deviations. Privacy policy DOES get a page `/confidentialitate`; should become a real link.)

---

## Motion — full data-* hook inventory

### Init calls in inline `<script>` (`componentDidMount`, dynamic `import('./motion.js')`):
1. `hydrateIcons()` — lucide `createIcons({ attrs: { 'stroke-width': 1.5 } })`.
2. `initEmails(this.root)` — fills `[data-email-user]`/`[data-email-domain]` → mailto + text.
3. `initNavShrink(this.nav)` — default pads `18px 40px`→`11px 40px` after 24px scroll.
4. `initNetwork(this.heroCanvas, { lineAlpha: 0.24, dotAlpha: 0.6, spread: 18000, lineDist: 155 })` — hero canvas. (color defaults: nodes `68,135,220` w/ 30% `122,180,232`; speed 0.16; maxNodes 110.)
5. `initNetwork(this.ctaCanvas, { lineAlpha: 0.18, dotAlpha: 0.45, spread: 24000, lineDist: 140 })` — CTA canvas (sparser).
6. `initReveals(this.root)` — `[data-reveal]`, optional `data-reveal-delay`(ms) + `data-reveal-rotate`(deg, triggers deeper rise + blur-to-sharp).
7. `initWordFill(this.root)` — `[data-word-fill="light"|"dark"]` headings; per-char left→right dictation sweep, accent gradient (#4487DC→#7AB4E8) settling to final ink (navy for light, white for dark).
8. `initParallax(this.root)` — `[data-parallax]`. (None present on this page.)
9. `initDrift(this.root)` — `[data-drift="<factor>"]` column-rigid inertial drift (clamped ±44px).
10. `initBandScale(this.root)` — `[data-band]` sections scale 0.94→1, radius 40→0 on entry.
11. `initHeroScrub(this.root)` — single `[data-hero-scrub]`; sinks at 0.3× scroll + fades out.

**NOT called:** `initCounters`, `initStepper`, `initScrollLean`, `initVelocitySkew`. → `data-skew="4"` and the static stat numbers are present but inert in the export.

### data-* attribute map (element → attribute = value)
- Hero content wrapper → `data-hero-scrub`
- Module section header div → `data-reveal`
- Module H2 → `data-word-fill="light"`
- Module grid wrapper → `data-skew="4"` (inert — see above)
- Card 1 (Identity) → `data-reveal`, `data-reveal-rotate="-4"`, `data-drift="0.07"`
- Card 2 (Shield) → `data-reveal`, `data-reveal-delay="80"`, `data-reveal-rotate="4"`
- Card 3 (Insight) → `data-reveal`, `data-reveal-delay="160"`, `data-reveal-rotate="-4"`, `data-drift="-0.07"`
- Card 4 (View) → `data-reveal`, `data-reveal-rotate="4"`, `data-drift="0.07"`
- Card 5 (Trap) → `data-reveal`, `data-reveal-delay="80"`, `data-reveal-rotate="-4"`, `data-drift="-0.07"`
- Spec section → `data-band` (on `<section>`)
- Spec header div → `data-reveal`
- Spec H2 → `data-word-fill="light"`
- Spec stat strip → `data-reveal`
- Spec rows table → `data-reveal`, `data-drift="-0.04"`
- Alte-produse header div → `data-reveal`
- Alte-produse H2 → `data-word-fill="light"`
- Card A (S-VPN) wrapper → `data-reveal`, `data-drift="0.06"`
- Card B (Asset Mgmt) wrapper → `data-reveal`, `data-reveal-delay="100"`, `data-drift="-0.06"`
- CTA section → `data-band`
- CTA inner div → `data-reveal`
- CTA H2 → `data-word-fill="dark"`
- CTA submit anchor + caption span → `data-email-user="office"` `data-email-domain="smartcontrol.ro"`
- Footer contact anchor → `data-email-user="office"` `data-email-domain="smartcontrol.ro"`

### CSS keyframes (helmet `<style>`) used by hero only:
- `scWordIn` — `opacity 0→1; translateY(20px)→0; blur(3px)→0`. On the 4 hero H1 spans (staggered 0.25 / 0.45 / 0.62 / 0.79s).
- `scFadeIn` — `opacity 0→1`. On hero eyebrow (0.1s), lead (1.0s), CTA row (1.2s), stat row (1.4s).
- These are CSS entry animations independent of motion.js; in Astro port as keyframes or fold into the island. Honor `prefers-reduced-motion` (helmet has the reduce block; global.css also has it).

### Canvas opts summary (for initNetwork island):
- **Hero canvas:** `lineAlpha: 0.24, dotAlpha: 0.6, spread: 18000, lineDist: 155`, canvas `opacity: 0.75`.
- **CTA canvas:** `lineAlpha: 0.18, dotAlpha: 0.45, spread: 24000, lineDist: 140`, canvas `opacity: 0.5`.
- Both use default colors (`68,135,220` / `122,180,232`), speed `0.16`, maxNodes `110`. Per CLAUDE.md: 2D canvas, NOT WebGL; deferred island; disabled under reduced-motion (static single frame).

---

## Icons (lucide `data-lucide`) — and location
- `fingerprint` — Module Card 1 (Identity) chip.
- `shield` — Module Card 2 (Shield) chip.
- `activity` — Module Card 3 (Insight) chip.
- `layout-dashboard` — Module Card 4 (View) chip.
- `radar` — Module Card 5 (Trap, dark) chip.
- `lock` — Alte produse Card A (S-VPN) chip.
- `boxes` — Alte produse Card B (Asset Management) chip.
All rendered at 22×22, stroke-width 1.5. (Deviation: load via `@lucide/astro` static SVG, not CDN.)

---

## Assets referenced
- `ds/assets/smartcontrol-mark.png` (34×34) — nav logo + footer logo. In Astro: `src/assets/smartcontrol-mark.png` (path exists under `docs/SMC Web/ds/assets/`; sibling files: `smartcontrol-mark-white.png`, `-mono.png`, `-duotone.png`, `iso-badges.svg`, favicons).
- No other images. No photography/patterns (brand rule).

---

## Links / CTAs / mailto map
| Where | Export href | Astro target |
|---|---|---|
| Nav logo, footer logo | `Home.dc.html` | `/` |
| Nav "Servicii", footer Servicii ×4 | `Home.dc.html#servicii` | `/#servicii` (or `/servicii`) |
| Nav "SEKNET" (active), footer SEKNET | `SEKNET.dc.html` | `/solutii/seknet` |
| Nav "S-VPN", footer S-VPN, card A | `SVPN.dc.html` | `/solutii/s-vpn` |
| Nav "Cloud & Modernization", footer Cloud | `Cloud.dc.html` | `/servicii/cloud` |
| Footer "Asset Management" | `Home.dc.html#produse` | `/#produse` |
| Nav CTA "Solicită demo", hero primary, hero "Vezi modulele ›" | `#contact` / `#module` | in-page anchors |
| CTA submit, CTA caption, footer email | `data-email-user="office"` + `data-email-domain="smartcontrol.ro"` | `mailto:office@smartcontrol.ro` (add `?subject=Demo SEKNET` per scope) |

Mailto obfuscation: split user/domain into `data-email-user`/`data-email-domain` attrs; `initEmails` joins them at runtime to set `mailto:` href + visible text (anti-scraper). Preserve this pattern (matches CLAUDE.md "lightly obfuscated").

---

## Shared components observed (reusable across pages)
- **Nav (light, fixed, sticky-shrink)** — logo + 4 links + 1 dark CTA button; `initNavShrink` behavior. Identical across product pages (active link differs).
- **Footer (light, 4-col 1.4/1/1/1.2 grid + bottom bar)** — brand col + Servicii + Produse + Contact; obfuscated email; ISO/founding meta line; legal span row.
- **Eyebrow** — mono, uppercase, `letter-spacing: 2.5px`, bright (`#4487DC`) on light / sky (`#7AB4E8`) on dark, `inline-block; padding-bottom: 10px; border-bottom: 2px solid #D6E8F7` (light) — matches `.eyebrow` token but adds the rule + 12px size + 2.5px tracking (token uses 0.16em ≈ 1.9px and no rule). Build as a component prop (light/dark + with/without rule).
- **Section heading + word-fill** — `data-word-fill` H2, 38px/700/-1px/navy (light) or 40px/white (dark CTA).
- **Module card (light)** — chip(44px, blue-wash, border-blue) + mono eyebrow + H3 + sub-label + chevron bullet list; white, 16px radius, navy-tinted shadow, lift-on-hover. Span-2 (1-col bullets) vs span-3 (2-col bullets) variants.
- **Featured dark card** — navy bg, royal border, sky icon-on-tint chip, bright "Nou în v2.3" pill, white H3, sky chevrons.
- **Giant-number stat block** — mono 34px navy with bright accent fragment + 13.5px cool caption; in a 1px-hairline 4-up grid.
- **Mono spec table** — `200px 1fr` rows, bright uppercase label on `#FAFBFD`, slate mono value, `·`-delimited; divider rows.
- **Dark CTA band** — midnight bg + network canvas + radial glow + centered eyebrow/H2/lead + bright glow button; `data-band` scale-in. Reusable on S-VPN, Home, Cloud.
- **Cross-sell card pair** — 2-up grid, one link card (with "Explorează ... ›" cue) + one static card.
- **Network canvas island** — `initNetwork` with per-zone opts; deferred, reduced-motion-safe.

---

## Deviations to apply (export violates CLAUDE.md / project rules — record, fix, do NOT silently restyle)
1. **Google Fonts CDN** — export `<link>`s `fonts.googleapis.com` (Inter + JetBrains Mono). FIX: self-host via `@fontsource-variable/inter` + `@fontsource-variable/jetbrains-mono` (already wired in global.css `--font-sans`/`--font-mono`). Do NOT emit the CDN link.
2. **Lucide via unpkg CDN** (`<script src="https://unpkg.com/lucide@latest">` + runtime `hydrateIcons`). FIX: use `@lucide/astro` static SVG components (icons: fingerprint, shield, activity, layout-dashboard, radar, lock, boxes), stroke-width 1.5. No client JS for icons.
3. **AA link-text color failures (bright `#4487DC` on white as readable link/CTA text):**
   - "Explorează S-VPN ›" cue (#4487DC, 13.5px) — fails AA (3.66:1). FIX: render as royal `#1F3C80` (`--color-royal`).
   - Module bullet chevrons & spec labels use #4487DC but as accent glyphs / non-link short labels — borderline; bullet body text itself is slate `#374151` (passes). Keep bright only for the rule/underline/chevron decoration; if any of these become link text, switch to royal. Hero "Vezi modulele ›" is sky on dark (OK). Footer hover-to-#4487DC on links: hover state, acceptable, but consider royal for consistency.
4. **Forms / fake email input** — CTA has a non-functional `<input type="email">` inside a styled pill. Project rule: **NO forms of any kind, email-only contact.** FIX: drop the input; render the CTA as a single mailto button ("Cere un demo" → `mailto:office@smartcontrol.ro?subject=Demo SEKNET`). Either remove the pill or keep it purely visual with only the button. Confirm with owner (Open Q).
5. **Product CTA copy/subject** — export says "Solicită demo" / "Solicită un demo" with a plain `mailto:` (no subject). CLAUDE.md mandates product CTA = **"Cere un demo"** with subject **`Demo SEKNET`**. FIX: relabel to "Cere un demo" and add `?subject=Demo SEKNET`. (Decide whether to keep export's exact wording for hero vs. enforce canonical — record as Open Q.)
6. **Footer legal links** — export shows "Politica de confidențialitate", "Termeni și condiții", "Cookies" as plain non-link spans. CLAUDE.md: **no terms page, no cookies page (zero cookies)**; privacy policy DOES exist at `/confidentialitate`. FIX: make "Politica de confidențialitate" a real link → `/confidentialitate`; REMOVE "Termeni și condiții" and "Cookies" (no such pages).
7. **Container width** — export 1180px max + 40px inline padding vs theme `.container` 1200px + 24px. Minor; decide whether to match export exactly (1180/40) or normalize to the token. Recommend matching export for 1:1 fidelity, or document the 20px/16px delta.
8. **Shadow opacity** — cards use `rgba(14,31,91,0.06)` resting (between `--shadow-sm` 0.06/`8px` and `--shadow-md` 0.06/`12px`; the export blur is 12px → closest is a 12px-blur-at-0.06 which has NO exact token). Hover `0 12px 32px rgba(14,31,91,0.14)` = `--shadow-lg` exact. FIX: map resting to `--shadow-md` (or define a token) and note the opacity difference.
9. **No-token colors to flag:** `#FAFBFD` (spec label cell bg — closest `--color-hover-tint #F8FAFF`, not identical); the hero/CTA radial-gradient overlays (`rgba(4,12,43,*)`, `rgba(68,135,220,0.16)`) — inline literals, no tokens; `rgba(226,233,245,*)` (dark-zone body text on dark) — recurring "light ink on dark" with no token (consider adding one). Accent glow `0 0 28px/40px rgba(68,135,220,*)` — no token.
10. **Compliance terms NOT in reserved teal** — export renders "GDPR, NIS 2, ISO 27001" (View card) and "NIS 2", "ISO 27001" (Asset Mgmt copy), plus "PCI-DSS, HIPAA" inline in normal slate/cool text. CLAUDE.md reserves teal `#1A7A6E` exclusively for NIS2/DORA/GDPR/ISO compliance content. FIX/DECISION: the design keeps them inline (no teal). Record — owner may want the regulatory frameworks tinted teal, but the approved export does not. Do not silently add teal; flag for sign-off.
11. **`.dc.html` / `#anchor` hrefs** — rewrite all to Astro routes per the Links table. `Home.dc.html#produse` → confirm `/#produse` anchor exists on Home.
12. **`scroll-margin-top: 76px`** on `#module` and `#contact` — keep (offsets the fixed nav for anchor jumps).

---

## Open questions
1. **Hero CTA wording:** export uses "Solicită un demo" (hero) and "Solicită demo" (nav/CTA). Enforce canonical "Cere un demo" everywhere per CLAUDE.md, or preserve the export's "Solicită" wording the client approved? (CLAUDE.md is explicit → likely "Cere un demo" + subject `Demo SEKNET`.)
2. **Email pill in CTA:** remove entirely, or keep the pill as a purely decorative shell with only the mailto button (no `<input>`)? No-forms rule forces removing the functional input regardless.
3. **`data-skew="4"`** on the module grid is wired but `initScrollLean` is never called in this export → no effect. Reproduce the inert attribute for fidelity, or intentionally wire `initScrollLean` to honor the apparent design intent? (Recommend: do NOT add it unless owner wants the lean; matching the export means no skew.)
4. **Stat numbers** (50K+, <1s, 10GB+, ∞) are static — no `data-count`. Animate with count-up to match the design system's "count-up" motion language, or keep literal as the export does? (Export = literal.)
5. **Compliance teal:** should the regulatory frameworks (GDPR / NIS 2 / ISO 27001 / DORA) be re-tinted teal per the brand rule, against the approved export which leaves them inline? Needs owner sign-off.
6. **Container token:** standardize on `.container` (1200/24px) or match export's 1180/40px exactly? Affects every page's rhythm.
7. **EN parity:** `/en/solutii/seknet` needs translated copy — not present in this export; all RO strings above need `_EN` counterparts (per i18n requirement).
8. **"Asset Management" link target** — footer points it to `/#produse` but the cross-sell card B is non-clickable. Is there a dedicated Asset Management page/section, or is it always an in-page anchor? (CLAUDE.md sitemap lists only seknet + s-vpn under `/solutii` — Asset Management appears teaser-only.)
