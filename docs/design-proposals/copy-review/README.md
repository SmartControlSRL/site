# Copy aligned with main — 8 September 2026

This records the restoration at `bc64ae8`. The subsequent owner-approved
[editorial revision](../editorial-revision/README.md) documents the specific
changes made after the independent audit review. The screenshots below show
the restoration, before that revision.

The site owner clarified that much of the copy on `main` had been approved
internally. The broad tone rewrite in `fc3c492` exceeded that request and is
superseded by this comparison and restoration.

Baseline: [`c551648`](https://github.com/SmartControlSRL/site/tree/c551648).
The redesign keeps the agreed page structure and media. It reuses the baseline
wording for the sections that remain, instead of rewriting them to fit the layout.

## Source mapping

| Current content | Baseline source | Restored material |
| --- | --- | --- |
| `src/content/home-page.ts` | RO / EN `src/pages/index.astro` | Hero, descriptions, service summaries, stack, products, partners and contact |
| Homepage “How we work” | `src/content/hub-pages.ts`, `servicesHub` | Original three-stage delivery process; portfolio introduction |
| `src/content/service-pages.ts` | Same file on main | Entire Security, Software and Managed Services records, including titles, capabilities, workflows and contact copy |
| `src/content/cloud-page.ts` | RO / EN `src/pages/servicii/cloud.astro` | Original Cloud hero, descriptions, five stages, capabilities and contact copy |
| `src/content/product-pages.ts` | RO / EN `src/pages/solutii/seknet.astro` and `s-vpn.astro` | Product positioning, capabilities, context, conceptual operating journeys and demo introductions |
| Related product service cards | `src/content/hub-pages.ts`, service pillars | Existing service summaries |
| Shared footer | `src/i18n/ui.ts` | Both approved footer descriptions |
| Navigation logo | Explicit owner instruction on 2026-09-08 | Original `DIN 2003` subline, identical in RO / EN |

## Romanian headline comparison

| Page | Superseded PR copy | Restored from main |
| --- | --- | --- |
| Home | Servicii IT pentru companii. | Infrastructură. Securitate. Software. Livrare coordonată de echipa noastră. |
| Cloud | Proiectăm și modernizăm infrastructura IT. | Hardware-ul se scumpește. Propunem următoarea abordare. |
| Networking & Security | Securitate pentru rețele, date și acces. | Monitorizăm rețeaua. Coordonăm răspunsul. |
| Software | Dezvoltare software și automatizare. | Dezvoltare software end-to-end |
| Managed Services | Administrare și suport pentru echipa ta IT. | Infrastructura ta, operată de echipa noastră. |
| SEKNET | Monitorizare și securitate IT. | Monitorizare. Securitate. Control. |
| S-VPN | Acces remote securizat. | Acces remote sigur. |

The homepage again states that Smart Control is directly responsible for
delivery, coordinates the required specialists and technology partners, and
bases recommendations on measurements from the client's infrastructure.
Software again shows the original source-code and contractual delivery scope.
The corresponding English copy is restored from the English routes on main.

## Presentation adaptations retained

- Home remains the overview; retired Services and Solutions hubs redirect to
  its sections. The main Services hub's three-stage process replaces the
  invented four-stage homepage text.
- The navigation retains the four agreed pillar names, including Infrastructure
  & Cloud. The Cloud detail copy returns to the main page's modernisation focus.
- The service renderer displays short capability summaries. Cloud shows its
  original capability bullet phrases separated by dots; subordinate service
  bullet lists and redundant supporting sections remain omitted.
- Product layouts keep their conceptual hero labels and related-service links.
  The workflow uses each product's original operating journey, including all
  four S-VPN stages, rather than an invented implementation sequence. Secondary
  audience/use-case grids from the previous site remain omitted.
- Existing layout labels and short navigation hints are retained. English
  spellings on Home are normalised to British English: centre(s), virtualise and
  virtualisation. No service claim is added by these spelling changes.
- Hero type is sized for the restored longer text; headings are not shortened
  merely to fit. Approved stills, supplied videos, fades and playback controls
  are retained.
- C-001 permits only the exact marked navigation brand subline. Broader founding
  or tenure copy remains blocked. The social images and registered hashes are
  unchanged.

## Validation

See the PR validation record for the current build and responsive checks.
The header sheets now show the restored main copy and navigation logo:

| Romanian | English |
| --- | --- |
| [Mobile](headers-ro-390.png) | [Mobile](headers-en-390.png) |
| [Desktop](headers-ro-1280.png) | [Desktop](headers-en-1280.png) |

## Earlier tone references

The earlier review consulted [Kyndryl](https://www.kyndryl.com/us/en/services),
[Bechtle](https://www.bechtle.com/gb/it-services) and
[NTT DATA](https://services.global.ntt/en-us/services-and-products/enterprise-networking/managed-network-services).
These remain references for specific editorial suggestions, not replacements
for Smart Control's approved wording or evidence for its capabilities.
