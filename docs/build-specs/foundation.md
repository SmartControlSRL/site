# Foundation — shared layer usage (READ BEFORE building any page)

The foundation agent owns the shared layer: `global.css`, `BaseLayout.astro`,
`Nav.astro`, `Footer.astro`, every `src/components/*`, `src/scripts/motion.js`,
`src/i18n/ui.ts`, and the OG image. **Page agents do NOT edit any of these** — if
a page needs a shared change, report it; don't touch the file (RESOLUTIONS §file
ownership).

This doc is the contract: component props + examples, the motion wiring (what
each data-attr does), the i18n helpers, and the rules every page coder obeys.

---

## Rules every page coder MUST obey

1. **No shared-file edits.** You own only your page file under `src/pages/` (+ its
   EN twin). Need a new shared primitive or a token? Report it; don't add it.
2. **Email is obfuscated, always.** Never write a raw `office@smartcontrol.ro`
   into HTML. Use `<MailtoLink>` (CTAs/links) or the bare
   `data-email-user`/`data-email-domain` pattern (contact lines). `initEmails`
   (auto-wired) fills the href + text at runtime and appends `?subject=` from
   `data-email-subject`.
3. **Bans (CLAUDE.md / RESOLUTIONS §9):** strip **ISO 27701** everywhere (only 4
   ISO badges: 9001 / 27001 / 14001 / 45001). Strip **Asset Management** entirely
   (no card, no footer link, no cross-sell). SEKNET cross-sells pair with
   **S-VPN**.
4. **AA link text (RESOLUTIONS §22):** body-size link TEXT is royal
   (`text-royal` `#1F3C80`) on light, sky (`text-sky`) on dark. Bright
   (`#4487DC`) is ONLY for rules, eyebrows, large display headings, accent
   glyphs — never readable link text on white. `<TextLink>` and `<MailtoLink>`
   already do this.
5. **Recompute stale figures (RESOLUTIONS §10):** years from 2003
   (`yearsInBusiness(new Date().getUTCFullYear())`), © year dynamic. Don't
   hardcode "22 de ani" / "© 2026".
6. **CTA wording = export wording (RESOLUTIONS §11):** "Solicită assessment"
   (assessment ask), "Solicită un demo" (product demo ask). Pulled from
   `ui.ts` keys.
7. **No forms / no email input (RESOLUTIONS §15):** the decorative `<input>` in
   CTA bands is gone. `<CtaBand>` is the mailto button only.
8. **Mono numbers** use `font-mono`; the brand bullet glyph is `›` (never `•`/`*`)
   — use `<ChevronList>`.
9. **Icons:** `import { Server } from '@lucide/astro'`, render with
   `strokeWidth={1.5}`. No CDN, no `hydrateIcons`. (Note: this lucide build has
   no plain `Fingerprint` — use `FingerprintPattern` or `ScanFace` where the
   spec says `fingerprint`.)
10. **`data-skew` stays inert** (RESOLUTIONS §5): keep the attribute if a spec
    shows it, but `initScrollLean` is never wired.

---

## Tokens & global.css (canonical values)

- **Base 16px**, `line-height 1.65`. `.container` = `max-width 1180px` + `40px`
  inline padding (`24px` < 768px).
- **Type scale** (`text-display`/`text-h1`/`text-h2`/`text-h3` are fluid clamp()
  whose MAX = export desktop px): hero H1 → 64px, product hero → 46px, section
  H2 → 38px, card H3 → 21px. Body = `text-body` (16px), `text-small` (14px),
  `text-label` (12px mono eyebrow).
- **Colors:** `text-navy` `#0E1F5B` (primary), `text-royal` `#1F3C80` (AA link
  text), `text-bright` `#4487DC` (accent/rules), `text-sky` `#7AB4E8` (accent on
  dark), `text-slate`/`text-cool`/`text-faint` (ink ladder), `text-compliance`
  `#1A7A6E` (teal — GDPR/NIS2/DORA/ISO badge contexts only). Surfaces:
  `bg-surface` white, `bg-page` `#F3F6FC`, `bg-blue-wash` `#EDF5FC`,
  `bg-midnight` `#040C2B`. Borders: `border-border`, `border-border-blue`,
  `border-divider`. Wash: `bg-hover-tint` (`#F8FAFF`, the SpecTable label cell).
- **Shadows:** `shadow-sm` (resting card), `shadow-md` (shrunk nav),
  `shadow-lg` (card hover). **Radii:** `rounded-md` 10px, `rounded-lg` 14px,
  `rounded-xl` 16px.
- **`.eyebrow`** = 12px mono, 2.5px tracking, uppercase, bright; add
  `.eyebrow--rule` for the 2px blue-wash underline. (Or just use `<Eyebrow>`.)
- **Keyframes available:** `scWordIn`, `scFadeIn`, `scMarquee`, `scDriftA`,
  `scDriftB` (use for hero entry animations / drift blobs / marquee). All
  neutralized under `prefers-reduced-motion`.
- The body has `padding-top: var(--nav-offset)` (76px) for the fixed nav, and
  `section[id]` gets `scroll-margin-top: 76px` automatically.

---

## Motion wiring contract (BaseLayout, auto-runs — you only add attributes)

BaseLayout enables Astro View Transitions (`<ClientRouter />`) and runs a single
bundled script. On every `astro:page-load` it runs, in order:
`initEmails(document)` → `initNavShrink([data-nav-shrink])` → `initReveals` →
`initWordFill` → `initCounters` → `initParallax` → `initDrift` →
`initBandScale` → `initHeroScrub` → per-element `initStepper` →
per-canvas `initNetwork`. All cleanups run on `astro:before-swap`. Everything is
reduced-motion-safe (static fallbacks live in motion.js).

**You wire motion purely by putting data-attributes in your markup:**

| Attribute | On | Effect |
|---|---|---|
| `data-reveal` | any block | fade + rise on viewport entry |
| `data-reveal-delay="120"` | + reveal | delay (ms) |
| `data-reveal-rotate="-4"` | + reveal | deeper rise + blur-to-sharp (feature cards) |
| `data-word-fill="light\|dark"` | an H2 (plain text!) | left→right dictation sweep, accent→ink |
| `data-count="650"` | a number span | count-up to N (1400ms); text content = no-JS fallback |
| `data-parallax="0.35"` | a layer | parallax offset vs parent |
| `data-drift="0.07"` | a card/column | column-rigid inertial drift (±44px) |
| `data-band` | a full-bleed section | scale 0.94→1, corners 40→0 on entry |
| `data-hero-scrub` | hero content wrapper | sinks at 0.3× scroll + fades |
| `data-skew="4"` | any | INERT (kept for fidelity; initScrollLean not wired) |

**NetworkCanvas opts → data-attrs.** `<NetworkCanvas>` emits `canvas[data-network]`
plus `data-line-alpha`, `data-dot-alpha`, `data-spread`, `data-line-dist`,
`data-speed`, `data-max-nodes` (only when you pass the prop). BaseLayout parses
them (floats for alpha/speed, ints for spread/dist/maxNodes) and omits any absent
one so `initNetwork` falls back to its defaults (lineAlpha 0.2, dotAlpha 0.55,
speed 0.16, spread 21000, lineDist 150, maxNodes 110, colors bright/sky).

Per-zone opts from the specs (copy precisely):
- Home hero (faint light): `lineAlpha={0.1} dotAlpha={0.3} spread={26000} lineDist={140} speed={0.12}`
- Home dark Produse: `lineAlpha={0.22} dotAlpha={0.55} spread={20000} lineDist={150}` + `opacity={0.65}`
- Home / SEKNET CTA band: `lineAlpha={0.18} dotAlpha={0.45} spread={24000} lineDist={140}` + `opacity={0.5}` (this is `<CtaBand>`'s built-in canvas)
- SEKNET hero (dark): `lineAlpha={0.24} dotAlpha={0.6} spread={18000} lineDist={155}` + `opacity={0.75}`

**Stepper.** `<Stepper>` renders `[data-stepper]` + a `[data-stepper-fill]` rail +
`[data-step]` rows (each with `[data-step-dot]` + `[data-step-body]`). BaseLayout
finds each container, locates its fill, and runs
`initStepper(container, fill, { dark })` where `dark` = the container has
`data-stepper-dark` (set by `dark={true}`). You only pass the `steps` array.

---

## i18n helpers (`src/i18n/ui.ts`)

```ts
import { getLangFromUrl, useTranslations, localizedPath, EMAIL_USER, EMAIL_DOMAIN, yearsInBusiness } from '../i18n/ui';
const lang = getLangFromUrl(Astro.url);      // 'ro' | 'en'
const t = useTranslations(lang);             // t('cta.assessment')
const p = (path) => localizedPath(lang, path); // p('/servicii/cloud') → /en/... under EN
const years = yearsInBusiness(new Date().getUTCFullYear()); // 2003-based
```

Chrome strings (nav/footer/CTA/subjects/company) live in `ui`. **Page marketing
copy is authored in the page file** (RO verbatim from the spec, EN translated).
Add page-specific strings to your own page, not to `ui.ts`.

Key string groups: `nav.*`, `cta.assessment` / `cta.demo.*`, `subject.assessment`
/ `subject.demo.*`, `footer.*`, `company.*`, `lang.switch`.

---

## Component inventory + examples

All under `src/components/`. Import paths shown relative to a page in
`src/pages/` (one level: `../components/...`; nested pages adjust `../`).

### Eyebrow
```astro
<Eyebrow variant="light">Servicii</Eyebrow>          {/* bright + rule */}
<Eyebrow variant="dark" rule={false}>Pașii următori</Eyebrow>
```
Props: `variant: 'light'|'dark'|'hero'` (light/hero=bright, dark=sky),
`rule?: boolean` (default true; 2px underline).

### SectionHeading
Eyebrow + word-fill H2 + optional sub-paragraph (default slot).
```astro
<SectionHeading
  eyebrow="Servicii"
  heading="Un portofoliu integrat, de la infrastructura fizică până la cod"
  variant="light"
  headingMaxWidth="700px">
  Patru piloni de servicii, susținuți de 50 de specialiști interni…
</SectionHeading>
```
Props: `eyebrow`, `heading` (plain string — fed to initWordFill char-by-char),
`variant`, `size: 'section'|'cta'` (cta = ~40px), `rule`, `center`,
`headingMaxWidth`, `headingId`.

### NetworkCanvas
```astro
<div class="relative overflow-hidden">
  <NetworkCanvas lineAlpha={0.1} dotAlpha={0.3} spread={26000} lineDist={140} speed={0.12} />
  …content (relative z-1)…
</div>
```
Absolutely positioned, `aria-hidden`. Parent must be `relative overflow-hidden`.

### CtaBand
Dark midnight full-bleed band: canvas + glow + centered eyebrow/H2/lead/mailto +
mono contact line. NO input.
```astro
<CtaBand
  id="contact"
  eyebrow="Pașii următori"
  heading="Assessment Inițial gratuit — 2 zile"
  cta={t('cta.assessment')}
  subject={t('subject.assessment')}>
  Fără angajamente. Identificăm împreună zona de interes prioritară…
</CtaBand>
```
Props: `id?`, `eyebrow`, `heading`, `cta` (button label), `subject?` (mailto
subject), `class?`. Lead text = default slot.

### ModuleCard
```astro
{/* light service/module card */}
<ModuleCard title="Infrastructură & Cloud" index="01"
  body="Proiectăm și consolidăm centre de date…"
  items={['Data Center Design', 'Consolidare & Virtualizare', …]} cols={2}>
  <Server slot="icon" class="h-[22px] w-[22px] text-navy" strokeWidth={1.5} />
</ModuleCard>

{/* dark featured card (SEKNET Trap) */}
<ModuleCard variant="dark" kicker="Seknet" title="Trap" badge="Nou în v2.3"
  body="Detecție activă prin decepție și honeypot…" items={[…]} cols={2}>
  <Radar slot="icon" class="h-[22px] w-[22px] text-sky" strokeWidth={1.5} />
</ModuleCard>
```
Props: `variant: 'light'|'dark'`, `title`, `kicker?`, `index?`, `body?`,
`items?: string[]`, `cols: 1|2`, `badge?`, `class?`. Icon via `slot="icon"`;
extra content via default slot.

### StatStrip + StatBlock
4-up hairline grid (2-up mobile). StatStrip carries `data-reveal`.
```astro
<StatStrip>
  <StatBlock value="650" count={650} suffix="+" caption="Proiecte livrate" />
  <StatBlock value="250" count={250} suffix="+" caption="Clienți satisfăcuți" />
  <StatBlock value="25"  count={25}  suffix="+" caption="Clienți internaționali" />
  <StatBlock value={String(years)} count={years} suffix="+" caption="Ani de experiență" />
</StatStrip>
```
StatBlock props: `value` (no-JS fallback text), `count?` (count-up int — plain
integers only), `suffix?` (bright), `caption`, `numberSize?` (48 home / 34 spec).

### SpecTable
```astro
<SpecTable rows={[
  { label: 'Performanță', value: '≥ 50.000 EPS / nod · indexare < 1s · …' },
  { label: 'Deployment',  value: 'Cloud-native, microservicii containerizate · …' },
]} />
```
Props: `rows: {label, value}[]`. Label cell = bright mono on hover-tint;
200px/1fr at desktop, stacked on mobile; last row no divider.

### ChevronList
```astro
<ChevronList items={['SSO — OAuth2, OIDC, SAML 2.0', 'MFA — TOTP, WebAuthn']} cols={2} />
<ChevronList items={[…]} dark />   {/* sky chevrons on dark */}
```
Props: `items: string[]`, `cols: 1|2`, `dark?`.

### MonoPill
```astro
<MonoPill>ISO 9001</MonoPill>
<MonoPill variant="compliance">GDPR</MonoPill>   {/* teal — framework badges */}
<MonoPill variant="dark">Nou</MonoPill>
```
Props: `variant: 'light'|'dark'|'compliance'`.

### IconChip
```astro
<IconChip><Shield class="h-[22px] w-[22px] text-navy" strokeWidth={1.5} /></IconChip>
<IconChip variant="dark" size={40}><Lock class="h-5 w-5 text-sky" strokeWidth={1.5} /></IconChip>
```
Props: `variant: 'light'|'dark'`, `size?` (default 44). Icon = slot.

### LogoMarquee
```astro
<LogoMarquee items={['Hitachi Vantara','Commvault','Fortinet','Cisco', …]} />
```
Renders the list twice for a seamless 50s loop + edge fades. Props: `items:
string[]`. (Partner names only — no client names, no logo images.)

### Stepper
```astro
<Stepper steps={[
  { title: 'Assessment', body: '2 zile, fără angajament…' },
  { title: 'Re-arhitecturare', body: '…' },
  …5 stages…
]} />
<Stepper dark steps={[…]} />   {/* on a dark band */}
```
Props: `steps: {title, body}[]`, `dark?`. Auto-wired to `initStepper`.

### TextLink
```astro
<TextLink href={p('/servicii/cloud')}>Explorează Cloud &amp; Modernization</TextLink>
<TextLink href="#module" dark>Vezi modulele</TextLink>   {/* sky on dark */}
```
Props: `href`, `dark?`, `chevron?` (default true — appends `›`). Royal on light
/ sky on dark (AA).

### MailtoLink
```astro
<MailtoLink variant="button" subject={t('subject.demo.seknet')}>Solicită un demo</MailtoLink>
<MailtoLink variant="link" subject={t('subject.assessment')}>office@smartcontrol.ro</MailtoLink>
```
Props: `subject?`, `variant: 'button'|'link'|'plain'`, `dark?`, `class?`,
`user?`/`domain?` (default office@smartcontrol.ro). Emits the obfuscated
`data-email-*` attrs; `initEmails` builds the mailto at runtime.

---

## OG image
`public/og.png` (1200×630): hero-gradient background, duotone mark, white
"SmartControl" wordmark, sky italic "Trusted Service Delivery Partner" tagline +
credentials line. Referenced by BaseLayout's `og:image`/`twitter:image` (absolute
URL from `Astro.site`). Regenerate by rasterizing an SVG (gradient + embedded
Inter woff2 + the duotone mark) with `sharp` — see the report; no Google CDN.
