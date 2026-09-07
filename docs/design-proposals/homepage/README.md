# Homepage redesign proposal

The homepage now leads with a short message and a connected infrastructure diagram, then routes visitors through service outcomes, delivery responsibilities, the two proprietary products and the assessment contact action. The proposal applies to both `/` and `/en/` through one shared page template and paired content.

## Design direction

**IT complex. Direcție clară. / Complex IT. Clear direction.**

The visual direction keeps the light Smart Control identity, navy/blue palette, self-hosted Inter and technical diagrams. Open layouts, larger supporting copy and deliberate dividers replace the repeated card-and-bullet catalogue. The hero introduces the relationship between infrastructure, security, software and operations; the existing interactive stack gives visitors a deeper explanation later in the page.

The service summaries are now whole-card links with explicit directional arrows. Product introductions have equal prominence, conceptual flow diagrams and a direct link to each detail page. The cloud section follows the existing five-stage workflow. Partners are shown in a stationary text grid, and the closing contact section exposes a working email link as well as the assessment CTA.

## Motion

- Hero: short, staggered entrance and continuous connection-path animation. A keyboard-accessible pause/resume control stops the diagram; animation begins only after JavaScript initialises the control.
- Services: accent rules and directional arrows respond to hover; focus remains visible.
- Sections: a small vertical entrance on first intersection, without hiding the new page content behind opacity reveals.
- Infrastructure stack: retains the existing disclosure, automatic-cycle control, focus safety and reduced-motion behaviour.
- Products: the connection signal plays once for 3.5 seconds when the section enters view.
- Cloud workflow: a brief accent on each stage as it enters view.
- Reduced motion: new background loops and entrance motion are disabled, including when the preference changes during the visit. Navigation removes observers, listeners and active Web Animations before reinitialisation.

## Scope and content

The proposal starts from current main, preserving its approved claims register, resilient mailto links, locale-specific social cards and SEO conventions. It does not restore unapproved statistics, certification badges, founding-year claims, assessment price/duration promises or product-performance claims from earlier design documents. Product diagrams are explicitly conceptual, not screenshots or live telemetry.

Shared navigation, footer and interior page designs remain intact. No dependency, hosting, privacy-policy or product-licensing changes are included. The only package-script change adds the new homepage regression check to the existing browser QA command. The redesign intentionally supersedes earlier homepage export-fidelity constraints; it does not change the canonical service names or delivery workflow.

## Review

Run `npm run dev` and inspect `/` and `/en/`. Check the primary assessment action on the first mobile screen, follow a service link, return home, pause/resume the diagram, explore the infrastructure disclosures, and try reduced motion.

The proposal includes generated [Romanian desktop](index@1280.png), [Romanian mobile](index@390.png), [English desktop](en@1280.png) and [English mobile](en@390.png) screenshots. They are visual review evidence; the local preview demonstrates the animations.

## Validation

- `npm run qa:static`: type checking, build, internal links, email links, claims, deployment configuration, indexing and localisation.
- `npm run check:homepage`: both locales at 320/390/768/1280px; non-overlapping diagram nodes, horizontal bounds, early CTA, keyboard pause/resume, live reduced-motion changes, client-navigation re-entry and no-JavaScript contact.
- Existing stack, navigation/responsive and site-audit gates remain part of `npm run qa:browser`.

Screenshots can be refreshed with the repository's `scripts/screenshot.mjs` harness using `--dir dist --routes /,/en/ --widths 1280,390 --out docs/design-proposals/homepage` after a successful build.
