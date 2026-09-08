# Smart Control redesign proposal

Draft PR #40 now covers the homepage-led site redesign agreed with the owner on
8 September 2026. Large clients typically have multiple connected IT needs;
the site presents one coordinated relationship and keeps specialist detail optional.

## Agreed structure

Seven marketing pages in each language: Home, Infrastructure & Cloud,
Networking & Security, Software & Automation, Managed Services, SEKNET and S-VPN.
Privacy remains in the footer in both languages. There are no separate company,
contact, services-overview or products-overview pages.

Home contains the positioning and animated expertise map, concise service links,
interactive infrastructure layers, the four-part engagement (understand, agree,
deliver, operate/improve), product teasers, technology partners and contact.

The navigation links to homepage sections, with dropdowns for direct access to
service and product details. Former `/servicii/` and `/solutii/` routes redirect
to Home's relevant section; EN equivalents stay in English. Nginx and Vercel
provide permanent redirects, and Astro generates immediate static fallbacks.
Redirects are omitted from the sitemap.

## Detail pages

Service pages share a light editorial layout: concise hero, capability summaries,
a visible workflow, related expertise and an assessment action. Infrastructure
& Cloud includes physical infrastructure, cloud, continuity and modernisation;
the five-stage migration process is retained there. Managed Services explains
the continuing relationship across the environment.

Product pages share a dark hero with a conceptual diagram, concise capabilities,
implementation/support steps, relevant service links and product-specific demos.
The diagrams describe concepts and contain no invented telemetry or customer data.

## Artwork and final UI review

Each service has its own light hero artwork: architectural planes for
Infrastructure & Cloud, routed connections for Networking & Security, modular
assembly for Software & Automation, and a circular mechanism for Managed Services.
The same service uses the same image in both languages. SEKNET has a vertical
signal collector; S-VPN has a protected channel connecting two endpoints. Their
conceptual summaries sit below the main hero content to leave the artwork visible.
Only Home's product band uses the original dark optical-glass image. An independent asset agent generated
the artwork with the built-in image tool. All images have optimised desktop and
mobile WebP variants. [Prompts and files](generated-artwork.md).

The review shortened service heroes, removed repeated capability lists and the
redundant homepage process strip, balanced product capability/related grids,
and tightened RO/EN copy. Product navigation uses the relevant demo action.

## Motion and resilience

The homepage retains its animated infrastructure map with pause/resume control,
keyboard-operable stack and finite product flow animation. Detail sections have
small, finite entrance movements, without hiding content. View Transition
cleanup cancels observers and running animations. Reduced-motion changes cancel
motion immediately; reading and contact work without JavaScript.

No dependency or lockfile changes. Privacy text, claims gates, email routing,
preview noindex and the production hosting plan remain intact.

Detail headers retain their approved still images with soft gradient edges. The
service-header background also blends into the white section below. The rejected
SVG/CSS header animation treatment has been removed; a real image-to-video pilot
for Cloud is pending a connected generator. See the
[current header review](../header-fade/README.md).

## Review evidence

The PNGs in this directory record the **initial homepage-only proposal** and are
historical. Current desktop/mobile screenshots are in `../refinement/`; use the
PR's latest Vercel preview for interaction review.
The current validation covers the generated site, RO/EN parity, metadata,
redirect destinations, contact links, claims, responsive navigation, homepage
interactions and the repository-wide browser audit. Results are reported in the PR.
