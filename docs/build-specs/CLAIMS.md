# Marketing claims register

This register is the publication gate for quantitative, security, SLA,
certification, compliance and absolute delivery claims. A source document is
not, by itself, approval to publish. Restricted commercial or certification
evidence should be referenced by identifier and owner; do not commit it here.

## Required approval fields

Before a claim marked `pending` can be published, replace the role placeholders
with the approver name, approval date, evidence reference and review date.
Romanian and English wording must be approved together.

| ID | Approved RO / EN wording | Permitted surfaces | Evidence and scope | Owners | Status / review |
| --- | --- | --- | --- | --- | --- |
| C-001 | `Fondată în 2003` / `Founded in 2003` | Company/about and calculated years-in-business copy | `docs/build-specs/oferta-servicii.txt:26`; year calculations only, never a hard-coded current age | Commercial: pending; Legal: pending | Provisional repository source; approval date pending; annual review |
| C-002 | `4 sisteme de management certificate: ISO 9001, ISO 27001, ISO 14001, ISO 45001` / `4 certified management systems: ISO 9001, ISO 27001, ISO 14001, ISO 45001` | Certification sections and metadata | Current certificate identifiers/expiry dates must be supplied by the legal/compliance owner. ISO 27701 is explicitly prohibited. | Legal/compliance: pending | Pending primary evidence; review at certificate renewal |
| C-003 | `650+ proiecte`, `250+ clienți`, `25+ internaționali` and EN equivalents | Not currently approved for publication | Source mentions: `docs/SMC Web/ds/README.md:5`, `docs/build-specs/oferta-servicii.txt:13`. CRM/commercial evidence is required; counts must not be extrapolated. | Commercial: pending; Legal: pending | Pending; do not publish |
| C-004 | `50 de specialiști interni`, `500+ ani experiență cumulată` and EN equivalents | Not currently approved for publication | Source mentions: `docs/smartcontrol-ro-brief.md:16`, `docs/build-specs/oferta-servicii.txt:131`. HR-approved headcount and calculation method are required. | HR/commercial: pending; Legal: pending | Pending; do not publish |
| C-005 | `<60s alerting` / `<60s alerting` | SEKNET product specifications only | `docs/build-specs/seknet.md:203` plus current approved product test evidence. Never extrapolate to all security services or incident response. | Technical: pending; Commercial: pending | Pending current product evidence; do not publish outside SEKNET |
| C-006 | SEKNET throughput/uptime and S-VPN performance figures | Product specification tables only | `docs/build-specs/seknet.md` and `docs/build-specs/svpn.md:182`; require versioned product test evidence. | Technical: pending; Commercial: pending | Pending; do not publish until evidence/version/date are recorded |
| C-007 | `Nivelurile de serviciu și indicatorii sunt agreate contractual` / `Service levels and indicators are agreed contractually` | Service and delivery copy | Contract-specific wording only. No universal `24/7`, guaranteed metric, zero-handoff or zero-downtime promise. | Commercial: pending; Legal: pending | Safe scoped wording; review with contract template changes |
| C-008 | `Accesul la codul sursă este definit pentru livrabilele software aplicabile` / `Source-code access is defined for applicable software deliverables` | Software-service copy | Contract-specific. Never claim source code is included with every project or imply proprietary product licensing terms. | Technical: pending; Commercial: pending; Legal: pending | Safe scoped wording; review with licensing terms |
| C-009 | Initial assessment offer, duration and price | CTA label and assessment sections only after terms are recorded | `docs/build-specs/oferta-servicii.txt:563-572` is a source mention, not current commercial approval. Record eligibility, deliverables, exclusions, duration, availability and expiry. | Commercial: pending; Legal: pending | Pending; duration/free claims must not be published |
| C-010 | ROI or post-launch performance reporting | Only project-specific proposals using agreed indicators and interval | No unconditional 90-day ROI/report promise. Measurement scope and baseline belong in the contract or statement of work. | Technical: pending; Commercial: pending | Safe scoped wording only; review per proposal template |

## Prohibited extrapolations

- Do not present GDPR, NIS 2 or DORA as certifications or ISO equivalents.
- Do not use ISO 27701 as a current certification.
- Do not convert a SEKNET product metric into a service-wide response promise.
- Do not use `100%`, `every project`, `zero downtime`, `zero hand-offs`, a
  universal `24/7 SLA` or `guaranteed metrics` without a registered,
  contractually bounded claim.
- Do not publish client names, logos or case studies.

## Approval record

The commercial, technical and legal owners must append a dated approval entry
here for each claim promoted from `pending`. Until then, the safe scoped wording
above is the maximum allowed wording, and claims marked “do not publish” remain
out of generated pages, metadata, JSON-LD and social artwork.
