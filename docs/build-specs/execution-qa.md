# Execution QA — motion & render correctness checklist

Distilled from the pols.dev anti-slop law (https://pols.dev/slop.md), stripped to
the **brand-independent execution bugs** that actually apply to this site. The
source file's font/icon/palette/layout opinions are **rejected** here: they fight
the locked brand system, and by that file's own rule ("the user's word overrides
these defaults") the brand system wins. Keep only the mechanical QA below.

**Precedence:** subordinate to `CLAUDE.md`, `RESOLUTIONS.md`, `foundation.md`,
and the design system. This never overrides a locked brand decision — it only
catches broken execution of decisions already made. Run it during any
motion/refresh work, before calling a page done.

---

## Motion correctness (GSAP / ScrollTrigger / canvas)

1. **Content is visible by default — never gate existence on a reveal.** The
   single most damaging bug. Do NOT start text/controls at `opacity: 0` (or a
   translated-away state) relying on ScrollTrigger/JS to reveal them. If the
   trigger never fires — backgrounded tab, throttled engine, hydration hiccup,
   screenshot/OG pass, `prefers-reduced-motion`, no-JS — the section renders as an
   empty void. Animate elements that are **already on screen** (y-offset,
   count-ups, parallax, hovers). An entrance reveal is only OK when the no-JS
   fallback still shows the content fully. Verify the reduced-motion path renders
   every section.

2. **Fill/progress animations: stable caps, full track.** The 5-stage stepper's
   progress lines and any bar fills — never animate `scaleY`/`scaleX` on a rounded
   shape (caps flip sharp→round mid-transition). Animate a clip or width/height
   with stable caps, fill the **full** intended length, ease smoothly. Half-filled
   or stuttering motion reads broken.

3. **Node-graph canvas must belong to its section, not trail the page.** A
   background pinned behind everything (incl. nav) that just follows scroll reads
   cheap. Keep the canvas scoped to its dark zones, reacting/moving, low-contrast,
   behind content, gated behind reduced-motion.

4. **No hover boop on buttons.** No `translateY`/scale lift on button hover.
   Change state cleanly (fill/colour shift, icon slide). Lift is for cards at
   most, and tonal, not bouncy. (Aligns with brand restraint anyway.)

5. **Every interactive control works.** Anything that looks clickable (stepper,
   tabs, accordions) must respond to a real pointer click in the browser. No dead
   props dressed as live controls.

## Render correctness

6. **Clear the cut.** Any `clip-path` / `overflow: hidden` / fixed height must be
   proven not to crop live text. Pad content clear of the cut by more than the cut
   removes, then zoom the exact clipped edge and check pixel-for-pixel. Applies to
   diagonal-gradient covers, notches, and any section overlap.

7. **Verify centering — don't eyeball it.** Giant metric blocks, mono stat pills,
   glyphs in circles. In SVG: `text-anchor: middle` centres horizontally but you
   still need `dominant-baseline: central` (or a measured `dy`) vertically. Zoom
   and confirm dead-centre, mathematically and optically.

8. **Comparison columns share a grid.** Service cards, product spec tiers,
   any side-by-side set: equal card heights, CTA anchored to the **bottom** of
   each card, feature lists and headings on shared baselines. Never let the
   longest string in one cell decide where every other cell's content lands.

9. **Display type needs air.** Giant stat numbers and hero display — don't crush
   tracking or jam a separator (`650+·projects`) tight. The larger the type, the
   more spacing decides composed vs squeezed.

10. **Text clears every edge.** Deliberate, consistent gutter from every viewport
    or container edge it nears. Copy kissing the rim reads as accidental overflow.

## Dark-zone glow QA (glow is brand-permitted — these keep it clean)

11. **No clipped glow.** A glow/bloom cut by a section edge or `overflow: hidden`
    ends in a hard line. Contain the glow with room to fall off, or fade it before
    the boundary.

12. **Cast, don't clone.** A "glow" that is just the element's own outline
    blurred and offset = a sticker halo / second rounded box behind the shape. Use
    a real directional, tight, low-offset light, tinted to the surface or the
    element's own colour — never a symmetric radial ring behind an object.

13. **Section colour handoffs, not hard seams everywhere.** Light↔dark band
    transitions (the site has many) should feel composed. A reserved hard break is
    fine (footer stepping onto its floor); a soft glow that dies dead at a
    boundary is not.

## Composition smell-tests (within locked Templates A/B)

14. **Don't stack default skeletons.** Templates A/B are locked, but within them,
    vary how sections _begin_ and _compose_. A page built as hero-stack →
    label-over-heading → label-over-heading → two-button-CTA-slab reads generated
    even when each block is clean. One ask per view is already scoped — keep it.

15. **Hero owns the fold.** Compose the first viewport deliberately; no stray
    half-section peeking in at the bottom edge.
