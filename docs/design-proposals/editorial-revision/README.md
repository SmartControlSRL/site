# Reviewed editorial revision — 8 September 2026

The owner approved implementation of the editorial audit after an independent
agent reviewed A01–A09. This revision starts from the restored copy at `bc64ae8`;
the internally approved baseline remains `main` at `c551648`. It changes specific
passages and recovers omitted information within the agreed seven-page structure.

## Decisions implemented

| ID | Final change in RO and EN | Source and review correction |
| --- | --- | --- |
| A01 | Move the existing sentence about separate or coordinated services to the four-pillar introduction. Give the three-stage process its own introduction. | Main Services hub portfolio. Related-service sections still use the original portfolio sentence, not the new process description. |
| A02 | “Stack Teardown” becomes “Arhitectură IT” / “IT architecture”; the process heading becomes “Cum lucrăm împreună” / “How we work together”. | Keep the original Software responsibility heading: the audit's “Delivery, documentation and support” alternative did not describe its cards. |
| A03 | Present the full Infrastructure & Cloud pillar in the hero and metadata, followed by a compact scope list. Keep modernisation capabilities and all five workflow stages as a distinct offering. | Main Services hub: data centre design/implementation, consolidation/virtualisation, private/hybrid cloud and business continuity/disaster recovery. No public-cloud scope is inferred. The Home summary uses the same explicit private/hybrid wording. |
| A04 | Add “Rețea & conectivitate” / “Network & connectivity” before the security capabilities. | LAN/WAN core, SD-WAN and load balancing come from the approved Home layer; the operations description comes from Managed Services. Remote access remains in its existing card. The six cards are headed “Securitate & acces” / “Security & access”. No per-technology design/implementation commitment is added. |
| A05 | Remove the note about visible email contact. Use short indicative introductions for the SEKNET and S-VPN workflows; remove the topology-publication clause from the last S-VPN step too. | Keep conceptual labels and the actual roles of administration, audit and access review. No technical implementation information is added. |
| A06 | Remove only the generic introductory sentence in Software's responsibility section. | Preserve source-code/documentation conditions, applicable-deliverable limits, support, indicators, Staff Augmentation levels and contractual handover. Managed service conditions remain intact. |
| A07 | Put L1/L2/L3 support and reporting into the Service Desk summary; monitoring, updates, backup and recovery into Infrastructure Operations. Introduce the operating cycle through its actual activities. | These examples already existed in approved `items` arrays but the short-summary renderer did not display them. They are folded into the relevant bodies; the renderer does not expose every hidden list across the site. |
| A08 | Keep one commercial-information note in Home's product introduction. Move SEKNET's event-grouping/prioritisation explanation into the capability summary. Restore S-VPN's four associated services. | Home retains its existing Explore links, with no new demo CTA. S-VPN separates associated services from product capabilities and states that the needed services are defined for each project. |
| A09 | Use natural Romanian for production deployment and handover; correct the English verb to “Hand over”. Simplify the Security workflow introduction. Resolve the Cloud RO/EN meaning difference as part of A03. | Technical terms and approved assessment/demo labels and email subjects remain. English uses British spelling. |

## Cloud wording and scope

The old RO hero asserted rising hardware prices, insufficient refresh budgets
and re-architecture as the primary strategy. EN made a narrower assertion about
prices and optimisation. Neither passage is retained as an undated market claim.

| Passage | Romanian | English |
| --- | --- | --- |
| Hero | Proiectăm și operăm infrastructuri IT. | We design and operate IT infrastructure. |
| Hero description | Proiectăm și consolidăm centre de date, virtualizăm și operăm medii de cloud privat și hibrid. | We design and consolidate data centres, virtualise and operate private and hybrid cloud environments. |
| Modernisation introduction | Analizăm infrastructura și aplicațiile existente pentru a stabili ce poate fi optimizat, re-arhitecturat sau migrat în cloud. | We review existing infrastructure and applications to identify what can be optimised, re-architected or migrated to the cloud. |

The original four modernisation capability groups, five workflow stages,
optional Fast Track description, scope/indicator qualifier and assessment contact
copy remain. Modernisation is one application of the broader pillar.

## Exact contractual edit

Removed from the Software responsibility-section introduction:

- RO: “Angajamentele comerciale și tehnice se stabilesc contractual pentru proiectul concret.”
- EN: “Commercial and technical commitments are defined contractually for the specific project.”

The section's source-code and indicator cards retain their original contractual
conditions. Its consultative card and heading remain unchanged. The delivery
workflow still limits documentation, source-code access and support to applicable
deliverables. Staff Augmentation retains its agreed contractual service levels.

The closing paragraph is split for readability, with handover still explicit:

- RO: “Clarificăm arhitectura, integrările și constrângerile. Livrabilele software aplicabile și predarea acestora sunt definite contractual.”
- EN: “We clarify architecture, integrations and constraints. Applicable software deliverables and their handover are defined contractually.”

## Recovered S-VPN services

The main RO/EN S-VPN pages contained initial assessment/configuration, integration
with the existing environment, technical assistance, and maintenance/updates.
These now appear under “Servicii asociate” / “Associated services”, after the
conceptual access journey. The introduction retains the original implementation
and operation purpose and explicitly makes service selection project-specific.
It does not promise automatic inclusion, support hours or response targets.

## External references

The audit used [Kyndryl's services overview](https://www.kyndryl.com/us/en/services),
[Bechtle's IT services page](https://www.bechtle.com/gb/it-services) and
[NTT DATA's managed network services page](https://services.global.ntt/en-us/services-and-products/enterprise-networking/managed-network-services)
as selective references for organising services and naming practical work.
Smart Control capabilities come from internal approved sources. No competitor
performance claims, metrics or guarantees are adopted.

## Validation

- `npm run qa:static` passes: 52 Astro files with no errors or warnings;
  build, links, 86 email destinations, public claims, deployment configuration,
  indexing and all seven RO/EN route pairs.
- `npm run qa:browser` passes: the five video integrations, infrastructure-layer
  interaction, responsive navigation and the site audit. The audit covers 18
  routes and six profiles with zero contrast failures and 216 existing logo
  exemptions.
- All 14 marketing pages were captured at 390, 768 and 1280 px: no horizontal
  overflow or page errors, and the original DIN 2003 navigation brand is visible.
  Visual inspection includes the Cloud scope/modernisation split, Network scope,
  Software responsibilities and S-VPN associated services.
- 28 rendered preservation checks confirm unchanged approved headlines outside
  Cloud, the Home responsibility/measurement paragraph, four distinct Software
  commitments per language, related-service context and conceptual product labels.
- Local validation uses Node 24; CI targets Node 22. The pre-existing dependency
  advisory gate is separate from the editorial change; dependencies and its risk
  register are unchanged.

Representative captures of this revision:

| Page | Capture |
| --- | --- |
| Cloud, Romanian desktop | [Full page](cloud-ro-desktop.png) |
| Cloud, English mobile | [Full page](cloud-en-mobile.png) |
| Networking, Romanian mobile | [Full page](network-ro-mobile.png) |
| S-VPN, English desktop | [Full page](svpn-en-desktop.png) |

The previous main-copy restoration screenshots are historical references,
not captures of this revision.
