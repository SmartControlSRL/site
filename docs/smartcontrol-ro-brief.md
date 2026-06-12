# SmartControl.ro — Website Brief

> Working spec for www.smartcontrol.ro, built from the 2026 services offer. Hand to Claude Code as project context. Content below describes **what goes where** — phrasing is for the build, not final copy. All decisions are settled (see §10).
>
> **⚠️ `/CLAUDE.md` at the repo root is the authoritative final spec.** Where this brief and CLAUDE.md disagree, CLAUDE.md wins. This brief has been corrected to match the locked decisions (2 products not 3, 4 ISO not 5, two CTAs, dedicated privacy page, no map, self-hosted Umami + fonts, Vercel-preview-only → EU VPS prod, Lucide icons, full animated direction).

## 1. Overview

New public site for **Smart Control SRL** — an enterprise IT services and solutions company ("Trusted Service Delivery Partner"). Founded 2003, 20+ years, 50 in-house specialists. Domains: **Infrastructure · Cloud · Cybersecurity · Blockchain · Software Development.**

The site's job: establish credibility with enterprise/B2B buyers, explain the service portfolio and the two proprietary products (SEKNET, S-VPN), and drive enquiries by **email** — primarily to book the free Initial Assessment. It is a static marketing site: no e-commerce, no customer portal, no forms.

## 2. Positioning & key messages

- **Partner, not vendor** — long-term, consultative, data-driven delivery.
- **Own team, not subcontractors** — 50 internal specialists, 500+ years cumulative experience, on-site & remote.
- **Proprietary solutions, no vendor lock-in** — SEKNET and S-VPN, both with source-code access, no third-party license costs.
- **Certified & compliant** — 4 ISO certifications (ISO 9001, 27001, 14001, 45001), GDPR, NIS2, DORA.
- **Proven scale** — 650+ projects, 250+ clients, 25+ international.

## 3. Audience & conversions

**Audience:** enterprise IT decision-makers (CIO/CISO/IT managers) in RO and internationally; financial-sector buyers (DORA angle); orgs facing NIS2 obligations or hardware-refresh budget pressure.

**Primary actions (ranked):**
1. **Email to book the free 2-day Initial Assessment** — main CTA, site-wide (mailto to office@smartcontrol.ro).
2. **Email to request a product demo** — "Cere un demo" CTA, on the SEKNET / S-VPN pages and the Home products band only (same address, product-specific subject so inbound self-routes).
3. Email sales / general enquiry (same address).
4. Read a product/service page → then email.

## 4. Sitemap

- `/` — **Home** (also absorbs About, Partners, Contact, and minimal legal as sections — see below)
- `/servicii` — **Services** hub, linking to a dedicated page per area:
  - `/servicii/cloud` — **Cloud & Modernization** (flagship "cloudification" page; includes the 5-stage methodology in depth)
  - `/servicii/securitate` — Security & Compliance
  - `/servicii/software` — Software & Automation
  - `/servicii/managed` — Managed Services
- `/solutii` — **Proprietary products** index, **each a full detail page**:
  - `/solutii/seknet` — SEKNET
  - `/solutii/s-vpn` — S-VPN
- **No standalone About / Partners / Contact pages, and no Terms / Cookies pages** (zero cookies, no forms → none needed) — that content lives in Home sections. **Exception: the privacy policy gets a dedicated page** — `/confidentialitate` (RO) + `/en/privacy` (EN), linked from the footer, rendered as accessible HTML (converted from `docs/Politica de confidentialitate.pdf`, not linked as a raw PDF).
- Languages: **RO + EN**, both first-class from launch (see §8)

## 5. Content per page

**Home (catch-all page):** hero (positioning line + "email us to book the free assessment" CTA), trust stats (650+/250+/25+/20+), **About/company block** (founding 2003, mission, team 50 / 500+ yrs), four service areas, proprietary-products teaser (SEKNET/S-VPN), why-us pillars, certifications strip (ISO ×4 + GDPR/NIS2/DORA badges — frameworks rendered distinct from the ISO roundels), **partner logos**, closing email CTA, **contact block** (email/address, no map), and a **footer** linking the dedicated privacy page.

**Services hub + area pages:** the hub gives a short intro and links to a dedicated page per area; each area page has its own intro + capability detail. Pull items from the offer:
- ***Cloud & Modernization — flagship "cloudification" page:*** the deepest service page. Frames the market context (hardware-cost pressure → CAPEX-to-OPEX shift → re-architecture as the alternative to costly hardware), the Infrastructure & Cloud capabilities (Data Center design/consolidation, virtualization, private/hybrid cloud, BC & DR, storage & information management, access & application delivery, infrastructure management), the **5-stage methodology** (below) as its centerpiece, and an ROI/business-case angle. This is where prospects land for the modernization story.
- *Security & Compliance:* DLP, secure remote access, enterprise SSO/PKI, perimeter & endpoint security, WAF, cybersecurity & GDPR/NIS2 compliance, managed security operations.
- *Software & Automation:* custom dev & APIs, DevOps/DevSecOps & CI/CD, app migration & modernization, blockchain (Hyperledger, Multichain), AI/LLM automation, architectural consulting, staff augmentation.
- *Managed Services:* service desk outsourcing, managed infrastructure ops, network managed services, cybersecurity managed services, outsourced systems support (on-site & remote), cloud-based system support, software automation.

**Product pages — one full detail page each** (these are differentiators; give each room to breathe, going deeper than the homepage teaser):
- **SEKNET** — integrated monitoring + cybersecurity + identity platform; cloud-native microservices. Present the 5 modules (Identity / Shield / Insight / View / Trap), the headline specs (50k+ events/sec/node, <60s alerting, 99.9% uptime, TLS in transit, AES-256 at rest, immutable audit log), and integrations (REST/OpenAPI, ServiceNow/Jira/Zendesk, SOAR, AWS/Azure/GCP, source available). A module-grid + a spec table works well.
- **S-VPN** — enterprise secure remote access bundling VPN (SSL & IPSec), MFA (5 methods), WAF, endpoint protection, UTM firewall, central console — positioned as a lower-cost integrated alternative to Cisco/Fortinet. Show performance figures (20 Gbps+, 10k+ IPSec tunnels, 400+ SSL, 200+ site-to-site) and "everything included in license."

**5-stage methodology (lives on the Cloud & Modernization page):** (1) Re-architecture Fast Track for existing clients, (2) Assessment & Quick Wins Deep Dive for new clients, (3) Refactoring Plan & ROI business case, (4) Agile implementation & knowledge transfer, (5) Continuous observability & 90-day ROI validation. A numbered, scroll-pinned vertical stepper.

**Partners (Home section):** logo grid — Hitachi Vantara, Commvault, Fortinet, Cisco, Juniper, Lenovo, VMware, Fujitsu, Oracle, Microsoft, Palo Alto, Hanasis, IBM, HP, DELL.

**Contact (Home section):** email (office@smartcontrol.ro, as a clear CTA), address (Intrarea Aviator Teodor Iliescu 37, 011672 București). No form, no phone, no map (a Google Map would set cookies / transfer data to the US — dropped; a static map image is acceptable if a visual is wanted).

## 6. Functional requirements

- Responsive, mobile-first.
- **Email-only contact:** prominent mailto CTAs site-wide, lightly obfuscated against scrapers. No forms, no validation/spam-handling, no confirmation flows.
- Site-wide "Email us for the free assessment" CTA.
- Cookieless analytics.
- Certification / compliance badges and partner logos as reusable components.

## 7. Design

- **Use the existing SmartControl design system from Claude Design** as source of truth (palette, typography, spacing, components).
- Translate its tokens into the Tailwind theme (`tailwind.config`); reference by name, never hardcode.
- Core components: Button, Card, Section, Hero, Nav, Footer, StatBlock, CertBadge, LogoGrid, ModuleCard, SpecTable, StepperStage.

## 8. Technical requirements

**Stack:** Astro + Tailwind, React/Svelte islands only where needed, content in Markdown/MDX content collections, Astro built-in i18n. **No forms → the site is fully static (SSG), no server runtime required.**

- **i18n:** RO + EN both first-class from launch. RO default at `/`, EN under `/en/`, full parity across all pages.
- **Analytics:** self-hosted **Umami (EU), cookieless**. With no forms, no map, and self-hosted fonts → zero cookies → genuinely no consent banner.
- **Fonts:** self-hosted WOFF2 (Inter + JetBrains Mono). **Do not** use the Google Fonts CDN — it transfers visitor IPs to Google (US), the same issue that dropped the map.
- **Hosting/CI:** **Vercel free tier for team preview/validation only → production on the company's own EU VPS (datacenter).** EU data residency is part of the compliance pitch. Vercel Hobby is non-commercial — the production `smartcontrol.ro` domain never points at it.
  - *Vercel (preview only):* zero-config, automatic preview deploys per PR.
  - *VPS (production):* full EU control/residency — build static, serve via Nginx, deploy via GitHub Action or rsync.

**Non-functional**
- Performance: Core Web Vitals green; Astro `<Image>`; minimal JS.
- SEO: per-page title/meta/OG, semantic HTML, sitemap.xml, robots.txt, hreflang RO/EN; structured data — Organization, Service, and Product (for SEKNET/S-VPN). Target enterprise terms in both languages (NIS2/DORA compliance, SIEM, data center transformation, managed security, enterprise VPN, blockchain development, etc.).
- Accessibility: WCAG AA — landmarks, alt text, focus states, contrast (verify against design tokens).
- Legal/GDPR: privacy policy aligned to their existing GDPR posture (lighter — no form data collected on-site); cookieless analytics avoids consent friction; add a consent mechanism only if any cookies are introduced. *(No ANPC/SOL — no online sales.)*

## 9. Out of scope

- On-site forms of any kind (contact via email only).
- Customer/identity portal or product logins (SEKNET/S-VPN consoles stay separate).
- Online payments / e-commerce.
- Blog/insights and Careers (excluded permanently).
- Full CMS (in-repo content; revisit only if non-tech editing becomes necessary).

## 10. Decisions (locked)

1. **Languages:** RO + EN from launch, full parity.
2. **PDF offer:** none — site content is sufficient.
3. **Contact:** email only, no form.
4. **Hosting:** Vercel free for preview/validation only; production on the company's own EU VPS.
5. **Client proof:** partner logos only — no client names/logos/case studies.
6. **Phone:** none — email only.
7. **Blog & Careers:** excluded, now and ongoing.

## 11. Build phases (for Claude Code)

1. **Scaffold:** Astro + Tailwind + i18n; theme from design tokens; base layout. Fully static output.
2. **Components:** Nav, Footer, Hero, Section, Card, StatBlock, CertBadge, LogoGrid, ModuleCard, SpecTable, StepperStage.
3. **Pages:** Home (incl. About / Partners / Contact / minimal legal sections) → Services hub → Cloud & Modernization (flagship, incl. methodology) → Security / Software / Managed area pages → Product detail pages (SEKNET, S-VPN).
4. **Content & i18n:** RO + EN content collections, full parity.
5. **Analytics + CTAs:** cookieless analytics; obfuscated mailto CTAs wired site-wide.
6. **SEO + a11y pass:** meta/OG, sitemap, robots, hreflang, structured data (Org/Service/Product), contrast & landmark audit.
7. **Deploy:** Vercel preview for validation → production on the EU VPS; verify Core Web Vitals; ship.
