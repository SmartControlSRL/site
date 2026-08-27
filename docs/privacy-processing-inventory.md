# Privacy processing inventory and legal-review handoff

> **Status: evidence pack only — not a privacy notice and not legal approval.**
> Do not copy unknowns, questions, or provisional infrastructure plans into the
> Romanian or English privacy pages. A Romanian privacy lawyer must approve the
> final notices after the responsible owners supply the external evidence below.

The public routes now render minimal bilingual `pending-legal-review` holding
pages. They are noindex, omit publication metadata, and are excluded from the
sitemap. `scripts/verify-production.mjs` rejects production while that state
remains; replacing it requires the completed approval record below.

Prepared from the repository working tree on **2026-08-26** for issue #19. The
review covers the website code, generated static output, Vercel preview guard,
and the versioned-but-not-deployed EU VPS Nginx template. It does not inspect
Vercel account settings, the production VPS, DNS, the company mailbox, internal
procedures, contracts, or vendor portals.

## Status vocabulary

- **Verified in repository:** directly evidenced by code, generated output, or
  checked-in configuration. This says nothing about an uninspected live service.
- **Planned, not deployed:** represented by the production template/runbook but
  not verified on a live host.
- **Unknown — owner evidence required:** cannot be answered from this repository
  and must remain out of published copy until the identified evidence is filed.

## Verified current implementation facts

| ID | Fact | Boundary | Repository evidence |
| --- | --- | --- | --- |
| `CODE-01` | The website is an Astro static build. There is no application server runtime in the site project. | Does not describe the existing live site or VPS operating system. | `astro.config.mjs`; static output under `dist/`; `CLAUDE.md` stack decision |
| `CODE-02` | No `<form>`, `<input>` or `<textarea>` exists under `src/`. Contact controls render static `mailto:` URLs. | Clicking a mail link transfers control to the visitor's mail client; subsequent email processing is outside the website code. | `src/components/MailtoLink.astro`; built RO/EN privacy pages contain `mailto:office@smartcontrol.ro` rights links |
| `CODE-03` | The site bundles Inter and JetBrains Mono through `@fontsource-variable`; no Google Fonts stylesheet or font request is emitted by the implementation. | Does not cover browser extensions, user agents, or an uninspected upstream service. | `src/layouts/BaseLayout.astro`; `src/styles/global.css`; built files under `dist/_astro/` |
| `CODE-04` | No first-party cookie creation API, `Set-Cookie` directive, analytics loader, beacon, `fetch`, `XMLHttpRequest`, WebSocket, local storage, or session storage use was found in the website implementation/configuration reviewed. | This is an absence-of-code finding, not proof that Vercel, the current live host, a reverse proxy, or the mailbox sets no cookies or creates no logs. Runtime headers must be checked separately. | Search commands below; `src/`; `public/`; `astro.config.mjs`; `vercel.json`; `deployment/nginx/` |
| `CODE-05` | Umami is deferred and no analytics script is currently implemented. | Enabling Umami or any other measurement tool requires a new inventory and notice review before release. | `docs/build-specs/RESOLUTIONS.md` decision 23; repository search |
| `CODE-06` | The Vercel configuration applies `X-Robots-Tag: noindex` to every preview response. Project rules limit Vercel to preview/validation. | `noindex` is a search-engine control, not a privacy or access-control guarantee. Account ownership, logs, regions, recipients, retention, transfers, and runtime cookies remain unknown. | `vercel.json`; `CLAUDE.md`; `docs/deployment.md` |
| `CODE-07` | The planned production target is a company-operated EU VPS serving `dist/` with Nginx from `/var/www/smartcontrol.ro/current`. | This configuration has not been deployed or verified against a production URL. It does not prove the VPS country, provider, account owner, or contractual role. | `deployment/nginx/smartcontrol.ro.conf`; `docs/deployment.md` |
| `CODE-08` | In the planned Nginx rules, access logging is disabled only for `/_astro/` hashed assets. The project does not version a server-level `access_log`, `error_log`, or `log_format`. | All fields, paths, rotation, retention, access permissions, IP treatment, backup behavior, and recipients for production logs are unknown. The host's global Nginx configuration would govern them unless production is changed. | `deployment/nginx/site-rules.conf`; absence from the remaining versioned Nginx files |
| `CODE-09` | No automated decision-making or profiling implementation was found in the website code. | The mailbox workflow and wider Smart Control business processes were not inspected; the responsible owner must confirm the organization-level statement. | Repository search; static architecture; no analytics/data-entry workflow |
| `CODE-10` | No age gate, age field, parental-consent workflow, or other minors-verification control exists in the website code. | Legal wording about minors must describe the actual absence of a website mechanism and must not promise verification the site cannot perform. | No form/input workflow under `src/` |
| `CODE-11` | The UI displays “Smart Control SRL”, a Bucharest contact address, and `office@smartcontrol.ro`. | UI content is not evidence that the name/address is the controller's exact registered identity or registered office. CUI, Trade Registry data, DPO and representative status are absent. | `src/i18n/ui.ts`; footer output |
| `CODE-12` | The legal-review holding pages render complete static privacy-request mailto URLs in both languages and work without JavaScript. | Mailbox availability, authorization, routing, retention, rights procedure and approved notice wording remain unverified. | `src/components/MailtoLink.astro`; `dist/confidentialitate/index.html`; `dist/en/privacy/index.html` |

Reproduce the absence checks from the repository root:

```bash
rg -n --glob 'src/**' --glob 'public/**' --glob 'deployment/**' \
  'document\.cookie|cookieStore|Set-Cookie|<form|<input|<textarea|umami|plausible|gtag|googletagmanager|analytics\.js|fonts\.googleapis|fonts\.gstatic|fetch\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage'
npm run build
rg -o 'href="mailto:[^"]+"' dist/confidentialitate/index.html dist/en/privacy/index.html
node scripts/check-nginx-config.mjs
```

An empty first search is the expected repository result. It is not a substitute
for inspecting runtime response headers, infrastructure logs, or vendor records.

## Provisional processing inventory

Unknown fields are deliberately left unknown; proposed purposes or legal bases
must not be inferred from common practice.

| Activity | Current status | Data/categories evidenced | Purpose and legal basis | Recipients/processors | Retention | Transfers/safeguards | Evidence needed before notice approval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Public static website delivery on the EU VPS | Planned, not deployed | HTTP requests will reach Nginx; the fields captured or retained are unknown | Unknown; owner and counsel must document each purpose and basis | VPS provider/operator and anyone with log access unknown | Unknown | VPS location, provider chain, support access and safeguards unknown | `EXT-03`, `EXT-04`, `EXT-07`, `EXT-08`, `EXT-09`, `EXT-10`, `EXT-14` |
| Production Nginx access/error logging | Planned; behavior incomplete in repo | Hashed `/_astro/` access logging is disabled; every other log field is unknown | Unknown; do not assume “security” or legitimate interest without owner/counsel confirmation | Unknown | Unknown, including rotation and backups | Unknown | `EXT-04`, `EXT-07`, `EXT-08`, `EXT-09`, `EXT-10` |
| Vercel preview delivery | Preview configuration exists; account/runtime uninspected | No repository-defined collection fields; `noindex` header is configured | Preview purpose is described as team validation, but legal basis is unassigned | Vercel role/subprocessors and authorized users unknown | Unknown | Regions, transfers and safeguards unknown | `EXT-06`, `EXT-07`, `EXT-08`, `EXT-09`, `EXT-10` |
| Visitor-initiated email contact | Website mailto is implemented | The website supplies recipient and optional subject only. Message content, sender identity and metadata enter the mailbox through the visitor's email client, not a site form. | Business purposes and legal basis for mailbox handling are unknown | Mailbox host, gateways, spam/security vendors, support access and internal recipient groups unknown | Unknown by message type, including backups and archives | Unknown | `EXT-05`, `EXT-07`, `EXT-08`, `EXT-09`, `EXT-10` |
| Rights request by email | Static RO/EN mailto route implemented | Same boundary as email contact; submitted identity/evidence depends on the sender and rights procedure | GDPR rights handling procedure and basis require legal confirmation | Mailbox chain and authorized privacy recipients unknown | Unknown | Unknown | `EXT-02`, `EXT-05`, `EXT-07`, `EXT-08`, `EXT-09`, `EXT-11` |
| Cookies/local browser storage | No implementation found in repository | None evidenced in site code | Not applicable to current code; runtime must still be verified | Upstream behavior unknown | Unknown outside site code | Unknown outside site code | `EXT-03`, `EXT-06`, `EXT-14` |
| Analytics/Umami | Not implemented; deferred | None in current site code | Not applicable until a tool is proposed and assessed | None evidenced | None evidenced | None evidenced | New privacy review is mandatory before implementation |
| Automated decisions/profiling | None found in website code | None evidenced | Not applicable to website code | None evidenced | None evidenced | None evidenced | Organizational confirmation in `EXT-10` |

## Required external evidence register

The artifact owner should attach or link each item in the issue/change record.
“Confirmed by email” is insufficient where a contract, registry document,
configuration export, or retention policy exists.

| ID | Required evidence | Accountable owner | Status |
| --- | --- | --- | --- |
| `EXT-01` | Current Romanian registry extract confirming exact controller legal name, CUI, Trade Registry number and registered office | Company/legal owner | **Missing** |
| `EXT-02` | Written DPO assessment/appointment record and EU representative applicability decision, with approved contact details where applicable | Legal/privacy owner | **Missing** |
| `EXT-03` | Production VPS contract/account record, provider/subprocessor list, physical hosting country, support-access locations and controller/processor roles | Infrastructure owner | **Missing** |
| `EXT-04` | Effective `nginx -T` output plus logging/rotation configuration documenting every access/error-log field, path, IP handling, permissions, recipients, rotation, backups and deletion | Infrastructure/security owner | **Missing — production not deployed** |
| `EXT-05` | Mail service contract/account export, provider/subprocessors, mail gateways/security tools, hosting/support regions, DPA, mailbox access groups and backup/archive behavior | Email/IT owner | **Missing** |
| `EXT-06` | Vercel account/project export, plan/role, authorized users, logs, regions, retention, subprocessors, DPA and runtime header/cookie capture | Preview platform owner | **Missing** |
| `EXT-07` | Complete processor/recipient register covering VPS, DNS, certificate/ACME, email, preview, security/support, backups and any reporting endpoint | Privacy/procurement owner | **Missing** |
| `EXT-08` | Transfer assessment identifying each non-EEA access/transfer, transfer mechanism, SCC/module where used, supplementary measures and approved wording | Legal/privacy owner | **Missing** |
| `EXT-09` | Approved retention schedule or objective criteria for server logs, email categories, rights requests, security records, previews and backups, including deletion owners | Records/privacy owner | **Missing** |
| `EXT-10` | Purpose/legal-basis matrix, legitimate-interest assessments where relied upon, required/optional-data analysis, consequences, and organization-level confirmation of no automated decisions/profiling | Legal/privacy and business owners | **Missing** |
| `EXT-11` | Current rights-handling procedure, identity-verification rules, response mailbox/owners, consent-withdrawal applicability, and verified ANSPDCP complaint route/contact | Legal/privacy owner | **Missing** |
| `EXT-12` | Approved minors statement based on actual controls and intended audience, without claiming an unimplemented parental-consent mechanism | Legal/privacy owner | **Missing** |
| `EXT-13` | Final RO notice, section-equivalent EN translation, named Romanian privacy legal reviewer, approval date and revision identifier | Legal reviewer | **Missing** |
| `EXT-14` | Timestamped production deployment verification: URL/DNS/TLS, hosting owner/location attestation, response headers/cookies, locale 404s, indexability and active configuration checksum | Infrastructure and website owners | **Missing — production not deployed** |

## Owner questionnaire

Every answer must cite one or more `EXT-*` evidence IDs. If the answer is not
known, record “unknown” and an owner/date for resolution; do not draft around it.

### Controller, governance and audience

1. What is the controller's exact registered legal name, CUI, Trade Registry
   number and registered office? Is the displayed contact address the registered
   office, a correspondence address, or neither? (`EXT-01`)
2. Is a DPO appointed or legally required? If not, who approved that conclusion?
   What contact may be published? (`EXT-02`)
3. Is an EU representative applicable? If not, what fact/legal analysis supports
   that conclusion? (`EXT-02`)
4. Is the website directed only to organizations/professionals? What minors
   statement accurately describes the audience and actual controls? (`EXT-12`)

### Production and logs

5. Which legal entity owns the VPS account, which provider/data center is used,
   and in which country is data stored and supported? (`EXT-03`)
6. What exact access and error log formats are active? List every field rather
   than naming a preset format. Are full/truncated/anonymized IP addresses kept?
   Are query strings, referrers, user agents, TLS details or request bodies ever
   recorded? (`EXT-04`)
7. Which requests are excluded from logs? Are application, firewall, SSH, CDN,
   load-balancer, DNS, certificate-renewal or system journals additional
   processing surfaces? (`EXT-04`, `EXT-07`)
8. Where are logs stored, who can access/export them, how are they rotated and
   backed up, and when is each copy irreversibly deleted? (`EXT-04`, `EXT-09`)
9. What purpose and legal basis applies to each log type? If legitimate interest
   is used, where is the approved assessment? (`EXT-10`)

### Preview and email

10. Who owns the Vercel account/project, who can open previews, and are previews
    protected beyond `noindex`? What logs/cookies/regions/retention/subprocessors
    apply? (`EXT-06`)
11. Who hosts `office@smartcontrol.ro`? Identify mail gateways, spam/malware
    scanning, archives, backups, support access, subprocessors and regions.
    (`EXT-05`, `EXT-07`)
12. Which teams receive general enquiries and rights requests? Are messages
    forwarded into ticketing, CRM, security, sales, document management or other
    systems? (`EXT-05`, `EXT-07`)
13. Which email categories exist, which fields are required versus optional,
    what happens if they are not provided, and what retention applies to each
    category and copy? (`EXT-09`, `EXT-10`)

### Recipients, transfers and rights

14. List every processor, subprocessor, independent recipient and internal
    recipient group for each activity. (`EXT-07`)
15. Can data or support access leave the EEA? For every case, identify the
    safeguard and approved transfer wording. (`EXT-08`)
16. Which purposes/legal bases apply to website delivery, logs, enquiries,
    rights handling and security? Where is consent genuinely used, if anywhere?
    (`EXT-10`)
17. What identity evidence is requested for rights handling, which mailbox/team
    responds, and what retention applies? (`EXT-09`, `EXT-11`)
18. Confirm whether automated decisions or profiling occur anywhere in the
    website-to-mailbox workflow, not only in this codebase. (`EXT-10`)
19. Verify the current ANSPDCP name, complaint route and contact from an
    authoritative source on the legal-review date. (`EXT-11`)

## Romanian/English section-parity checklist

Complete only after the Romanian source notice is legally approved. “Equivalent”
means the same substance and scope, not necessarily a literal translation.

| Section/content obligation | RO approved | EN equivalent | Facts traced to evidence IDs | Legal check | Implementation check | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Notice purpose, scope and informational/consent framing | ☐ | ☐ | ☐ | ☐ | ☐ | |
| Last-updated date, revision ID and language-precedence statement | ☐ | ☐ | ☐ | ☐ | ☐ | |
| Controller legal identity and contact block | ☐ | ☐ | ☐ | ☐ | ☐ | |
| DPO and EU representative status/contact where applicable | ☐ | ☐ | ☐ | ☐ | ☐ | |
| Static-site/no-form boundary and visitor-initiated email workflow | ☐ | ☐ | ☐ | ☐ | ☐ | |
| Data categories and sources for each activity | ☐ | ☐ | ☐ | ☐ | ☐ | |
| Purposes, legal bases and legitimate interests | ☐ | ☐ | ☐ | ☐ | ☐ | |
| Required/optional provision and consequences | ☐ | ☐ | ☐ | ☐ | ☐ | |
| Server/security logs, fields and retention | ☐ | ☐ | ☐ | ☐ | ☐ | |
| Current cookies/local storage and analytics status | ☐ | ☐ | ☐ | ☐ | ☐ | |
| Recipients, processors and subprocessors | ☐ | ☐ | ☐ | ☐ | ☐ | |
| International transfers and safeguards | ☐ | ☐ | ☐ | ☐ | ☐ | |
| Retention periods or objective criteria by activity | ☐ | ☐ | ☐ | ☐ | ☐ | |
| Data-subject rights and usable rights-request route | ☐ | ☐ | ☐ | ☐ | ☐ | |
| Consent withdrawal only where consent is actually used | ☐ | ☐ | ☐ | ☐ | ☐ | |
| ANSPDCP complaint route/contact | ☐ | ☐ | ☐ | ☐ | ☐ | |
| Automated decision-making/profiling status | ☐ | ☐ | ☐ | ☐ | ☐ | |
| Minors statement matching actual controls | ☐ | ☐ | ☐ | ☐ | ☐ | |
| Security description without absolute guarantees | ☐ | ☐ | ☐ | ☐ | ☐ | |
| Change notification and contact details | ☐ | ☐ | ☐ | ☐ | ☐ | |

## Review and approval record

These fields must remain visibly incomplete until real reviewers approve the
evidence and text.

| Role | Name | Review scope | Date | Evidence/revision | Approval |
| --- | --- | --- | --- | --- | --- |
| Inventory owner | `[required]` | Completeness and owner answers | `[YYYY-MM-DD]` | `[issue/change link]` | `[pending]` |
| Infrastructure owner | `[required]` | Production/VPS/logging facts | `[YYYY-MM-DD]` | `EXT-03`, `EXT-04`, `EXT-14` | `[pending]` |
| Email/IT owner | `[required]` | Mailbox/provider/access/retention facts | `[YYYY-MM-DD]` | `EXT-05` | `[pending]` |
| Privacy owner/DPO where applicable | `[required]` | Processing inventory and internal procedures | `[YYYY-MM-DD]` | `[EXT IDs]` | `[pending]` |
| Romanian privacy legal reviewer | `[required]` | Article 13 completeness and RO source text | `[YYYY-MM-DD]` | `EXT-13 / revision [required]` | `[pending]` |
| EN translation reviewer | `[required]` | Section-equivalent translation | `[YYYY-MM-DD]` | `EXT-13 / revision [required]` | `[pending]` |
| Publishing approver | `[required]` | Approved revision deployed unchanged | `[YYYY-MM-DD]` | `[release + verification]` | `[pending]` |

## Mandatory change triggers

Reopen the inventory and legal review **before** release when any of these
changes is proposed or discovered:

- Umami, another analytics product, session replay, pixels, A/B testing or a
  consent-management tool is added or reconfigured.
- Cookies, local/session storage, identifiers, forms, uploads, chat, phone,
  accounts, portals or other collection surfaces are introduced.
- Production/preview hosting, datacenter country, CDN, reverse proxy, DNS,
  certificate/ACME, DDoS/WAF, backup, monitoring or support vendor changes.
- Nginx/global host logging fields, IP handling, paths, access groups, rotation,
  backup or retention changes.
- Email host, gateway, spam/security service, archive, backup, forwarding,
  ticketing, CRM or mailbox access changes.
- A CSP reporting endpoint, error tracker, uptime monitor or other telemetry
  recipient is enabled.
- A processor/subprocessor, recipient, support region, non-EEA transfer or
  safeguard changes.
- Controller identity, registered office, contact, DPO/representative status,
  rights procedure, purpose, legal basis, legitimate interest or retention
  schedule changes.
- Automated decisions/profiling or a minors-directed service/control is added.
- An owner finds that any “verified” repository statement differs from the live
  preview, production host, mailbox or organizational process.

The approved notices must carry their own visible last-updated date and revision
record. Updating this evidence pack alone does not authorize publication.
