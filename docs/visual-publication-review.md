# Route visual publication review

Review date: 2026-09-01

Owner: Smart Control site maintainers

Scope: Cloud, Networking & Security, Software & Automation, Managed Services,
SEKNET, and S-VPN in Romanian and English.

## Decision

The published visuals are semantic HTML/CSS process diagrams. They are
self-hosted in the generated page, require no runtime request, have explicit
layout dimensions through the responsive grid, and contain no animation. Each
uses visible headings, ordered steps, body text, and a caption as its accessible
text equivalent. Text colours use the existing contrast-audited brand tokens.

Cloud retains its five-stage methodology visual. Security shows only the
conceptual detect–triage–respond collaboration flow. Software shows a delivery
lifecycle. Managed Services shows an operating loop. SEKNET shows only the
relationship from signal to shared context. S-VPN shows only a high-level
request–verify–connect–review journey.

## Sensitive-footprint review

The SEKNET and S-VPN diagrams disclose no topology, protocol, deployment mode,
vendor, capacity, technical footprint, customer environment, client identity,
or reconstructed product interface. Their captions state these limits. Any
future addition of those details requires a new pre-publication security review.

## Proof and partner rights

No client identity, client logo, testimonial, case study, quantitative proof
figure, or new partner mark was introduced. Evidence and approval are therefore
not applicable to this visual change. Existing partner names elsewhere on the
site are outside the new diagrams; adding or replacing a partner mark requires
documented usage rights before publication.
