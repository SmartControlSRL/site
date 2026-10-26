# Service pages: code-animated hero scenes

Three service headers replace their generated videos with code-animated
scenes built from the homepage's [hero stack](../homepage-hero-stack/README.md)
glass slab:

| Page                   | RO / EN route                                       | Replaces                  |
| ---------------------- | --------------------------------------------------- | ------------------------- |
| Infrastructure & Cloud | `/servicii/cloud/`, `/en/servicii/cloud/`           | the Veo Cloud pilot video |
| Networking & Security  | `/servicii/securitate/`, `/en/servicii/securitate/` | the security video        |
| Software & Automation  | `/servicii/software/`, `/en/servicii/software/`     | the software video        |

Managed Services, SEKNET and S-VPN keep their videos unchanged.

## Why

The owner rejected the AI videos for these three pages. Like the homepage, a
video can't tell a specific, accurate story, and any text baked into it would
need one encode per language. The owner reviewed standalone previews of these
three scenes and approved the direction (`artifacts/hero-previews/`, not
committed). This change ports those previews faithfully and applies the
review feedback listed below.

## Stories

**Cloud: consolidation and hybrid cloud** (intro about 8.5 s)

1. _Centru de date / Data centre._ The floor lands and server towers rise on
   their footprints.
2. _Virtualizare / Virtualisation._ The towers merge into one platform, and VM
   tiles trace themselves onto it.
3. _Cloud hibrid / Hybrid cloud._ The cloud slab lands, a link of light
   connects it, and two VMs migrate along the link into its slots.
4. _Recuperare DR / Disaster recovery._ A replica slides out on the ground, the
   sync line draws, and its tiles fill.

Idle loop (4.4 s): a pulse makes a round trip on the link, a blip syncs DR and
its tiles re-confirm. Rings light one slab at a time while the camera drifts
slowly.

**Security: layered defence** (first story complete in under 8 s)

The four nested layers build from the outside in (_Perimetru, Rețea,
Identitate, Date_ / _Perimeter, Network, Identity, Data_), then the protected
core appears. Three beats follow:

- a legitimate request is validated at each layer's badge and reaches the core,
  which acknowledges it;
- a threat slips past the outer layers and is stopped at the identity edge,
  which lights up;
- a SOC sweep passes over every layer.

Idle loop (9 s): the request and threat beats alternate, each followed by a
calmer sweep.

**Software: delivery pipeline** (stations land in about 2.5 s; the release
cycle repeats every 10 s from 1.5 s)

A release chip travels the rail through _Cod, Build, Test, Securitate,
Producție_ / _Code, Build, Test, Security, Production_:

- the code is written and the gear turns;
- the build bar fills and the tests are ticked;
- a scan line and a light curtain cross the release;
- the chip lifts into the production app window with one soft landing glow,
  and the dashboard bars rise.

The trail and ticks then reset for the next release.

## Review feedback applied

- **Mobile labels (≤600px):** each scene has a phone layout where every
  engraved label is at least 10px effective. At 320px the minimum is 10.3–10.6px;
  at 390px it is 12.2–12.9px.
  - **Cloud:** one column. The cloud floats above the platform, a riser
    carries the VMs, and DR stands in front of the floor. Labels drop the
    number prefix.
  - **Security:** the SVG bleeds to the screen edges and engraves larger
    labels without the prefix.
  - **Software:** stations in a column beside a vertical rail. The production
    server stack is omitted here because it would cover the security label.
- **Security:**
  - the first story now finishes within 8 s (before: 9.9 s);
  - the identity-edge light renders above the threat;
  - the threat recoils clear of the edge, and the blocked mark appears beside
    it;
  - the stack is about 10% larger (wider column, tighter viewBox).
- **Cloud:**
  - server units are 15% larger, and the cloud slab is 10% larger (so the
    migrated VM tiles read);
  - the connected slabs no longer breathe individually. A whole-scene camera
    drift replaces it, so connectors never detach.
- **Software:**
  - the release chip is 15% larger;
  - production gets one soft landing glow, and the chip's glow hands over to
    it;
  - the scene column is wider and bleeds into the page margin, which cuts the
    empty corners.
- **Layout:**
  - **901–1440px:** the scene takes the second column (wider for Security and
    Software) and never overlaps the copy. Its right edge bleeds into the
    margin on wide screens.
  - **≤900px:** the scene sits under the copy.
  - The copy keeps the template's ~50px offset under the nav.

## Implementation

- **Runtime:** `src/scripts/scene-runtime.ts` is the lifecycle shared by all
  three scenes. It covers:
  - the reduced-motion and Save-Data still state;
  - pausing offscreen and in hidden tabs (animations _and_ timers);
  - settling after the intro;
  - restarting on a desktop↔mobile layout switch;
  - teardown on `astro:before-swap` and `pagehide`.
- **Components:** `src/components/scenes/{Cloud,Security,Software}Scene.astro`.
  Geometry and markup live in `cloud-scene.ts`, `security-scene.ts` and
  `software-scene.ts`, with shared slab maths in `slab.ts`. The Security
  and Software scripts import the same geometry modules (Cloud reads its
  tower vectors from data attributes), so markup and motion can't drift
  apart.
- **Timelines:** `src/scripts/scenes/{cloud,security,software}.ts`, using WAAPI
  only.
- **Styles:** `src/styles/scenes.css` (shared frame) and per-component global
  styles. Colours are theme tokens only; WAAPI reads them through
  `getComputedStyle`.
- **Assets:** no new raster assets. Every slab is
  `public/images/hero-stack-slab-640/1160.webp`, and fonts are the self-hosted
  site fonts.
- **Template:** `ServiceDetailPage.astro` renders the scene as the second grid
  column for the three artwork keys. The hero actions
  (`[data-service-hero-actions]`), anchors and JSON-LD are unchanged.

### Removed

- **Videos:** `public/videos/{cloud,network-security,software-automation}-hero-{1280,800}.mp4`.
- **Video posters:** `public/images/{network-security,software-automation}-video-{1280,800}.webp`.
- **Retired stills:**
  - `architecture-light-1600.webp`;
  - `network-security-{1600,800}.webp`;
  - `software-automation-{1600,800}.webp`.

  `AmbientArtwork` no longer accepts these artwork keys.
  `architecture-light-800.webp` stays because the homepage Cloud tile uses it.

- **Component variants:** `HeroVideoArtwork` drops the `cloud`,
  `network-security` and `software-automation` variants and the
  `data-cloud-video*` hooks.
- **Checks:**
  - `scripts/check-cloud-video.mjs` is deleted;
  - `check-service-video.mjs` drops the two retired keys;
  - the shared video controller's lifecycle checks (offscreen suspension,
    session pause across reload, blocked autoplay) now run on Managed.

## Behaviour

Each scene renders its final composed state and is `aria-hidden`; the page copy
carries the meaning. Labels are real SVG text in the page language, typed per
letter with diacritics intact.

**No pause control.** This is the same owner decision as the homepage
(2026-10-15). The idle loops run indefinitely, so these headers don't meet
WCAG 2.2.2 Pause, Stop, Hide (Level A). Reduced motion and Save-Data show the
still state, and motion stops offscreen and in hidden tabs.

**No inline JavaScript.** The CSP is `script-src 'self'`. Until the bundled
script takes over, CSS keeps the scene hidden; without JS, it fades the still
state in after 1.2 s.

**Settled state.** When the intro ends, its animations are cancelled and the CSS
still state takes over, so a resume never replays the intro. Intro animations
carry the id `scene-intro`, so checks can tell them from idle beats.

**Glow budget.** At most one glow leads at a time:

- **Cloud:** slab glows during the intro; idle rings take turns.
- **Security:** the core acknowledgement, the identity edge and the sweep are
  spaced apart.
- **Software:** the chip glow hands over to the landing glow.

## Validation

- `npm run check` reports 0 errors, and the full `npm run qa` passes (site
  audit: 0 contrast failures).
- `scripts/check-service-scenes.mjs` (`npm run check:service-scenes`, part of
  `qa:browser`) covers RO/EN on all three pages:
  - intro → idle, with animations advancing and no pause control;
  - pausing offscreen, and staying settled (no `scene-intro` animations)
    after scrolling back;
  - live reduced motion;
  - reduced-motion, Save-Data and no-JS still states with the exact engraved
    labels;
  - no MP4 requests;
  - the desktop↔mobile layout switch;
  - geometry at 320/390/768/1024/1280/1440px: no overflow, no copy overlap,
    the scene under the copy at ≤900px, the CTA above 750px, and labels ≥10px
    on phones;
  - Astro navigation teardown Cloud → Security → Software → Managed (video)
    → Cloud.
- The scene check ran 3× in a row without failure.

| Scene         | Desktop, final                              | Desktop, mid-story                              | Mobile, final                                   | Mobile, mid-story                              |
| ------------- | ------------------------------------------- | ----------------------------------------------- | ----------------------------------------------- | ---------------------------------------------- |
| Cloud (RO)    | [final](cloud-ro-desktop-final.png)         | [VMs migrating](cloud-ro-desktop-story.png)     | [final](cloud-ro-mobile-final.png)              | [VMs migrating](cloud-ro-mobile-story.png)     |
| Security (RO) | [final](security-ro-desktop-final.png)      | [threat stopped](security-ro-desktop-story.png) | [final](security-ro-mobile-final.png)           | [threat stopped](security-ro-mobile-story.png) |
| Software (RO) | [final](software-ro-desktop-final.png)      | [security scan](software-ro-desktop-story.png)  | [final](software-ro-mobile-final.png)           | [security scan](software-ro-mobile-story.png)  |
| English       | [Cloud desktop](cloud-en-desktop-final.png) |                                                 | [Software mobile](software-en-mobile-final.png) |                                                |

"Final" shows the still state, which is also the state after the intro.
Mid-story frames are the intro seeked to a fixed time. The PNGs are
palette-compressed. Use the PR preview to review the motion.
