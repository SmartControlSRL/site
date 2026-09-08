# Animated header artwork

The owner approved the six header images and requested specialised agents to
animate them. A service motion agent and a product motion agent created the
image-aligned SVG effects. A separate QA agent built and ran the motion lifecycle
regression. The integrating agent added the shared controller and reviewed the
rendered artwork. Original WebP files are unchanged.

| Header | Motion | Desktop frame | Mobile frame |
| --- | --- | --- | --- |
| Infrastructure & Cloud | Light travels along the existing glass edges | [Frame](cloud-desktop.png) | — |
| Networking & Security | A highlight follows the cable towards the gateway | [Frame](security-desktop.png) | — |
| Software & Automation | Connectors light in sequence along the assembly path | [Frame](software-desktop.png) | — |
| Managed Services | Highlights follow the mechanism's existing arcs | [Frame](managed-desktop.png) | [Frame](managed-mobile.png) |
| SEKNET | Staggered signals converge on the collector | [Frame](seknet-desktop.png) | [Frame](seknet-mobile.png) |
| S-VPN | A restrained pulse travels through the protected channel | [Frame](svpn-desktop.png) | [Frame](svpn-mobile.png) |

The complete image and its effects move together by a few pixels on a slow cycle.
The copy and its contrast overlay remain still. The diagrams describe the same
approved product concepts; no telemetry, labels or architecture claims were added.

Each header has a localised keyboard-accessible pause/resume control. The pause
preference persists for the browser session. Motion suspends outside the viewport
and listens for page visibility changes. Reduced motion cancels the animation and
restores the original still image; the same static image works without JavaScript.
Astro navigation cleans up observers, handlers and both image/effect animations.
The homepage product-band artwork remains static.

Implementation: SVG/CSS effects plus a shared Web Animations controller, about
2.4 KB minified before compression. No added dependencies or video downloads.

Validation: `npm run qa:static` and the full `npm run qa:browser` pass. The new
motion check covers 12 RO/EN routes, 36 viewport combinations, actual image and
effect timelines, keyboard pause, offscreen suspension, reduced-motion changes,
no-JS, session persistence and navigation teardown. The all-route audit covers
18 routes × six profiles with zero contrast failures and 216 existing wordmark
exemptions. Tab visibility is implemented with the browser visibility event;
automated Chromium did not reliably expose real background-tab visibility, so
that particular lifecycle transition was not verified end to end.

These files are individual frames. Review the animation itself in the
[current PR preview](https://site-git-codex-homepage-redesign-proposal-mihaiscs-projects.vercel.app/solutii/seknet/).
