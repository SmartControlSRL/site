# Product pages: fewer grids, own identity

This applies the owner's 2026-10-14 feedback ("too many grids, shapes too
regular, it looks AI-generated") to the shared product template
(`ProductDetailPage.astro`, used by `/solutii/seknet/` and `/solutii/s-vpn/`
in RO and EN). It follows the homepage rework
([homepage-less-grid](../homepage-less-grid/README.md)).

Before, every section repeated one formula: a mono eyebrow, the heading on the
left and the lead on the right, then an equal-column grid with a hairline above
each item. The two products were identical apart from their text, down to the
same three-icon "signal" strip in the hero. Each product now carries its own
code-drawn scene, and each section has its own composition.

| Section            | Before                                                                       | After                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero (dark)        | Copy, then a full-width strip of three icon tiles, the same on both products | The video machinery is unchanged. The icon strip is gone. The three `signal` labels sit under the lead as mono pills joined by a short blue rail, reading as a flow (Infrastructură → Evenimente & context → Analiză & răspuns; Utilizator → Acces securizat → Resurse IT). Below 640px they stack with a vertical connector.                                          |
| Overview (wash)    | Heading left / lead right, then 3 equal hairline columns                     | A sticky stacked intro on the left (kicker, heading, context). On the right sits the product's own `ProductVisual` scene: SEKNET's observability lens or S-VPN's controlled tunnel, with the "Schemă conceptuală / …" caption. Below it, the three capabilities step out as white strata cards with icon chips. No numbers.                                            |
| Journey (white)    | Heading left / lead right, 3–4 equal columns under a rail, `01 / Label`      | Stacked intro, then a connected vertical timeline. A mono gutter (number + label) sits beside a square node on a rail, followed by the title and body. It reads as a spec table, not as the homepage staircase. The rail fills as it scrolls into view (CSS scroll timeline, progressive). Numbers stay because the order is real. Below 640px it becomes a left rail. |
| Associated (S-VPN) | Heading left / body right, 2-column hairline list                            | Heading, body and kicker stacked on the left. The four services are white `›` chips on the right, offset in alternation like small strata. One column on mobile.                                                                                                                                                                                                       |
| Related            | Two equal hairline columns                                                   | Three unequal columns: a narrow intro, a wide wordmark card for the other product (large name, its headline in royal, its intro) and a narrower service card set lower. Both are deliberate whole-card links with a navy-tinted shadow. They become 2 columns on tablet and 1 on mobile.                                                                               |
| CTA (dark)         | Unchanged                                                                    | Unchanged: "Solicită un demo" / "Request a demo", subjects `Demo SEKNET` / `Demo S-VPN`.                                                                                                                                                                                                                                                                               |

Section rhythm:

- SEKNET: dark hero, wash, white, wash (related), dark CTA, light footer.
- S-VPN: dark hero, wash, white, wash (associated), white (related), dark CTA,
  light footer.

The related band takes whichever background the optional associated band
leaves.

## Decisions

- **ProductVisual sits in the light overview, not the hero.** The hero's right
  half is the product video (85% wide, edge-faded, behind the copy). A second
  animated scene on top of it competed with the video and covered it.
  `ProductVisual` therefore gained an optional `tone="light"` prop. It keeps the
  same geometry and timing but uses a white card with a navy-tinted shadow,
  royal node icons and faint royal rails. It has no glow, because glow is
  reserved for dark zones; nodes flash with a border colour only. The navy
  core/gate remains as the only dark accent, so no new dark zone is added. The
  default stays `dark`, and the homepage band is unchanged (the dark flash
  shadows moved into custom properties with identical values).
- **The other product in Related is a wordmark card, not a second scene.** Two
  animated scenes on one light page would compete. The large name and headline
  make the cross-sell distinct at no runtime cost.
- **Capability icons** are now chosen per capability (SEKNET: Activity,
  ShieldCheck, LayoutDashboard; S-VPN: KeyRound, SlidersHorizontal, Network).
  Previously the hero's signal icons were reused.
- **Styles**: everything new lives in `src/styles/product.css` under a `prd-`
  prefix. `detail.css` is still imported only for the shared base (hero, kicker,
  headings, sections, wash, close band, `product-hero`). The template no longer
  uses `.detail-intro`, `.detail-capabilit*`, `.detail-step*`,
  `.detail-related`, `.detail-scope-list` or `.product-signal`. Nothing in
  `detail.css` was edited.
- **Motion**: the existing `DetailMotion` reveal, plus CSS only (the scene
  loops and the timeline rail fill). Under `prefers-reduced-motion`, the scene
  pulses and rings are hidden, its nodes are static and the rail is drawn in
  full. There are no inline scripts and no new dependencies or raster images.

## Copy changes

None. All strings come from `src/content/product-pages.ts` unchanged, and the
template's own strings (kicker, "Schemă conceptuală / Conceptual overview",
"Servicii și produse conexe / Related services and products") are kept. The
caption moved from the hero strip to the overview scene.

## Checks adjusted

- `scripts/check-service-video.mjs`: the toggle-overlap guard listed
  `.product-signal`, which no page renders any more. It now lists
  `.prd-signal li` instead, so the pause control is still proven not to cover
  the hero pills.
- `check-localization.mjs` was not changed. Its `data-route-visual` +
  `figcaption` requirement is now met by the overview scene figure.

## Review follow-ups

An independent review found no functional blockers. These fixes followed:

1. **Hero pills wrapped at 901–1060px**, leaving a loose connector at the start
   of row 2. The hero's right column is the video, so on product pages the copy
   now spans the hero grid at 901px and up, with a 680px measure. The pill row
   never wraps above 640px (the widest row is 550px; the narrowest single-row
   column is 593px) and stacks vertically below that. A connector can no longer
   start a row; verified at 641–1440px in RO and EN.
2. **The capability stair flattened at 901–1150px.** The cards now use a
   percentage width (86%) and offsets (0 / 7% / 14%). The stair holds at every
   width of 901px and up (offsets measured at 0/32/64px at 901px and
   0/45/90px at 1280px). Below 900px it keeps the 20/40px (12/24px on mobile)
   steps.
3. **Glow removed from the light-tone ProductVisual.** The node flash is a
   border-colour change only, and the core/gate keep a navy-tinted shadow with
   no 6px halo.
4. **Related wordmark weight** reduced from 800 to 700; 800 is hero-only.
5. **Mobile pill connector**: `gap: 0` in the stacked layout, so the line
   touches both pills.
6. **Product card on a wash band**: the wash-to-white gradient disappeared on
   SEKNET's wash Related band. There the card is plain white, and both cards
   use `--shadow-lg` everywhere. The gradient remains on S-VPN's white band.
7. The inner square of each timeline node uses `var(--radius-xs)` instead of a
   literal 2px.
8. **Pruning**:
   - removed the unused `prd-hero`, `prd-overview` and `prd-overview-body`
     classes;
   - merged the duplicated `.pv--light` block in `ProductVisual.astro`;
   - removed the stale `.product-signal` entry from the video check.

   `detail.css` is still untouched; its stale product rules will be pruned
   after both template branches merge.
9. **Accessibility**:
   - the two cross-sell cards are named by their `h3` (`aria-labelledby`), so
     each link's name is just the product or service name;
   - the visible journey numbers are `aria-hidden`, since the `<ol>` already
     conveys the order.

## Validation

The full `npm run qa` passes and `npm run check` reports 0 errors. That covers:

- `check:seknet-video` and `check:svpn-video` (contained poster/video frame,
  masks, no overflow at 320/390/768/1280, keyboard pause);
- nav-responsive;
- localization;
- the site audit, with 0 contrast failures.

The pages were reviewed visually at 1440 and 390 (RO), 768 (EN S-VPN) and with
reduced motion.

| Before                              | After (desktop)                 | After (mobile)                 |
| ----------------------------------- | ------------------------------- | ------------------------------ |
| [SEKNET](before-seknet-desktop.png) | [SEKNET](seknet-ro-desktop.png) | [SEKNET](seknet-ro-mobile.png) |
| [S-VPN](before-svpn-desktop.png)    | [S-VPN](svpn-ro-desktop.png)    |                                |
