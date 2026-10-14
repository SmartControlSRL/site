# Homepage: hero stack animation

This replaces the [connected-sculpture video](../homepage-video/README.md) on `/`
and `/en/` (owner request, 2026-10-14). The new hero shows the four layers from
the "Arhitectură IT" schema (L1 Infrastructură fizică → L4 Aplicații &
Automatizare). They assemble one at a time as frosted-glass slabs, then the
stack keeps moving slowly.

## Why code instead of video

Veo 3.1 was tried first. It could not build the stack reliably:

- From an empty first frame, clips stayed empty.
- When used to edit keyframes, it hollowed out or duplicated slabs instead of
  removing them.
- When asked for separate slabs, it rendered them standing upright.

Text baked into a video would also need one encode per language. Diacritics
would be at risk, and the text would be invisible to assistive technology and
search.

The final hero is therefore:

- **Slab image:** one generated slab, reused four times.
- **Drawings:** the existing schema drawings as SVG.
- **Labels:** real SVG text engraved on each slab's front edge.
- **Motion:** driven by the Web Animations API, with no new dependency.

## Assets

- `public/images/hero-stack-slab-640.webp` (30,624 bytes) and
  `hero-stack-slab-1160.webp` (78,302 bytes), 2236 × 1214 aspect, with alpha.
- **Source:** Gemini `gemini-3-pro-image`, in two steps:
  1. An isometric "four frosted-glass layers" keyframe was generated using a
     screenshot of `StackTeardown` as reference.
  2. From that keyframe, a single blank slab was rendered on pure white.
- **Processing:** median and blur denoising, colour-to-alpha against white with
  alpha gain 1.25, then a crop. Sizes were exported with sharp at WebP q80 /
  alpha q75. The output carries Google's invisible SynthID watermark and no
  visible mark.
- **Drawings:** `src/content/hero-stack-art.ts` holds the StackTeardown drawings
  in a 280 × 280 face space. One affine matrix maps them onto the slab's top
  face (corners measured from the render).

The previous homepage MP4s and posters (`homepage-hero-*.mp4` and
`homepage-connected-*.webp`) are deleted. `HeroVideoArtwork` and
`AmbientArtwork` no longer have a homepage variant.

## Motion

**Intro, about 7.5 s:**

- **Camera:** starts close and tilted, then pulls back.
- **Slabs:** each drops in with motion blur and a small settle, about every 1.5 s.
- **Impact:** a glow that follows the slab silhouette, plus a sheen sweep.
- **Drawings:** each one traces itself after its slab lands.
- **Labels:** the engraved label types itself onto the edge.
- **Layer handover:** a light packet climbs from the previous layer, and that
  layer recedes (glow off, dimmed drawing, slight blur).

**Idle loop:**

- the layers breathe at different rates;
- dashed links flow;
- particles drift;
- a scan climbs the stack, lighting each layer's edge, drawing and label in
  turn.

## Behaviour

`HeroStack.astro` renders the final still state and is `aria-hidden`; the
"Arhitectură IT" section below carries the same content. `src/scripts/hero-stack.ts`
plays the intro and the idle loop.

**Pause and preferences**

- A localised pause control works with mouse and keyboard.
- The pause preference is stored in session storage under
  `smartcontrol-homepage-animation-paused`, independent of the Cloud video's
  preference.
- Animation pauses when the hero is offscreen or the document is hidden.

**Still state.** Reduced motion and Save-Data keep the still state and hide the
control. A session-paused visit starts still, and Play resumes the idle loop.

**No inline JavaScript.** The planned CSP (`script-src 'self'`) allows no inline
script. Before the script runs, CSS keeps the scene hidden and fades the still
state in after 1.2 s, so no-JS visitors see it. The bundled script takes over
before then.

**Navigation.** Astro navigation and `pagehide` cancel every animation and timer.

## Validation

`scripts/check-homepage.mjs` was rewritten for the stack. It checks:

- RO/EN intro → idle;
- that animations advance;
- click and Space pause and resume;
- reduced-motion and no-JS still states with all four engraved labels (exact
  RO/EN text);
- no MP4 requests;
- session pause across reload and Astro navigation;
- Home↔Cloud teardown with independent preferences;
- 320/390/768/1280px geometry: no overflow, the stack does not overlap the copy,
  and the CTA stays above 750px.

The full `npm run qa` passes, including the site audit (0 contrast failures).

| Romanian                       | English                        |
| ------------------------------ | ------------------------------ |
| [Desktop](home-ro-desktop.png) | [Desktop](home-en-desktop.png) |
| [Mobile](home-ro-mobile.png)   | [Mobile](home-en-mobile.png)   |

Screenshots show the end of the intro. Use the PR preview to review the motion.
