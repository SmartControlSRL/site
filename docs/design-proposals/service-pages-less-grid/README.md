# Service pages: fewer grids, less template

This follows the homepage rework ([homepage-less-grid](../homepage-less-grid/README.md)).
The owner's review on the homepage was "too many grids, shapes too regular, it
looks AI-generated". The same criteria now apply to the shared service template,
`ServiceDetailPage.astro`. It renders Infrastructură & Cloud, Networking &
Security, Software & Automatizare and Servicii Gestionate in RO and EN.

Before this change, every section used the same formula: a mono eyebrow, the
heading on the left and the lead on the right, then an equal-column grid with a
hairline above each item. Each section now has its own composition. The brand
stays geometric and hard-edged: the variety comes from asymmetry, scale and one
connected sequence, not from organic shapes.

| Section          | Before                                                               | After                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hero             | Copy about 92px under the nav                                        | Same media machinery, actions and anchors. On desktop the copy now sits about 50px under the nav. Below 901px the padding is unchanged, because the video toggle moves to the top-right corner there.                                                                                                                                                                                                                                                                                                                                                                                |
| Scope            | 2-column hairline list, inside the capabilities section              | Its own statement band on white: the heading (and body, where present) sits beside a flowing row of mono `›` pills, with no hairlines. Lists made only of short technical tokens (Security: `LAN / WAN core`, `SD-WAN`, `Load balancing`) get larger, stat-style pills.                                                                                                                                                                                                                                                                                                              |
| Capabilities     | 2×2 / 2×3 hairline grid of icon, title and text                      | A stacked intro (eyebrow, heading, then lead) over an asymmetric bento of white cards on the wash. The first item is the tall featured tile: larger icon and type, plus a code-drawn stepped-plates SVG that bleeds off its edge. The next two items are side tiles. The rest alternate 5/7 and 7/5 pairs, and an odd leftover runs full width with its title beside its text. This handles 4 (Cloud), 5 (Software), 6 (Security) and 7 (Managed) items. Cloud's `items[]` sub-points render as a `›` list instead of being joined with " · ".                                       |
| Flow / workflow  | Equal columns with a top rule, labels as `0n / Label`                | A sticky intro beside a vertical timeline (stacked on mobile). A rail runs down rounded-square numbered nodes. Its bright fill grows with scroll and lights each node, using the existing `initStepper` through `[data-stepper]`, `[data-stepper-fill]`, `[data-step]`, `[data-step-dot]` and `[data-step-body]`. The mono stage label sits on the node's line, with the title and body under it. The caption closes the rail as a note beside a square terminal. The numbers stay because the order is real. Unlike the homepage staircase, this is a vertical, scroll-linked rail. |
| Proof (Software) | The capabilities grid reused                                         | An asymmetric split on the wash: the heading on the left, and on the right a compact list of icon chips, each with a title and one line. No cards, no hairlines.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Related services | Eyebrow, split intro and three equal hairline columns with body text | A compact band with a short heading and intro beside one row of whole-card links (title and arrow). It becomes a stacked column on mobile.                                                                                                                                                                                                                                                                                                                                                                                                                                           |

## Section rhythm

The backgrounds alternate deliberately:

- hero, which fades from the page wash to white;
- white: scope (Cloud, Security);
- wash: capabilities;
- white: workflow;
- wash: proof (Software only);
- related services: on the wash when there is no proof section (Cloud, Security, Managed), on white after proof (Software);
- navy: closing CTA.

The intro layouts vary too:

- **Scope:** heading beside the pills, no eyebrow.
- **Capabilities:** stacked.
- **Workflow:** sticky split.
- **Proof:** split, no eyebrow.
- **Related services:** small heading, no eyebrow.

## Design decisions

- **Shared selectors are untouched.** `ProductDetailPage.astro` still uses `.detail-intro`, `.detail-capabilities`, `.detail-capability`, `.detail-steps`, `.detail-step*`, `.detail-scope-list` and `.detail-related`, so those rules stay as they were. Only `.detail-scope` and `.detail-caption` were deleted, because nothing else uses them. All new layouts live under `svc-*` classes, plus a desktop-only padding rule on the service-only `.service-hero`.
- **Theme tokens only.** All colours come from `var(--color-*)`, cards use `--radius-xl` and `--shadow-sm`, nodes and chips use `--radius-md`, and icons are Lucide at stroke 1.5. Body-size link text is navy/royal. Bright blue is used only for rules, the rail fill, the node accent and the decorative `›` glyphs.
- **Motion.** Motion uses the existing `DetailMotion` reveal and the `initStepper` already wired in `BaseLayout`. There is no new script and no inline script. Under `prefers-reduced-motion` the rail renders fully filled with all nodes active, and the related-link transitions are off. Text is never dimmed, so the no-JS and contrast baselines hold.
- **Anchors.** `#capabilities` now marks the capabilities section itself; the scope band sits above it. `#flux` (Cloud) and `#workflow` remain on the workflow section. `data-route-visual` and the `<figcaption>` stay on the workflow figure. The first `<ol>` on each page is still the workflow, with one `data-step` per stage.
- **What is shown.** The capability cards still show `body` where it exists. The `items[]` sub-points (which Security and Managed also carry) are rendered only where there is no body, which is Cloud. This keeps the visible content the same as before.

## Copy changes

No strings in `src/content/` were edited. The template no longer renders two
items that the old layout showed:

- the "Smart Control" eyebrow above "Servicii conexe" / "Related services";
- the one-line descriptions under each related-service link. These are the homepage service summaries from `home-page.ts`; they repeat what the destination pages say.

The stage label is no longer prefixed with `0n /`. The number now sits in the
timeline node, so the label text itself is unchanged.

## Check adjustment

`scripts/audit.mjs`: the reduced-motion smoke test located the Cloud stages with
`.detail-step p`, which ties the check to the old class name. It now uses
`[data-step] p`. The intent is unchanged: five stages, all readable at full
opacity under reduced motion. The selector now targets the stepper hook that
`initStepper` itself uses. No other check needed changing.

## Validation

`npm run check` reports 0 errors. The full `npm run qa` passes, including:

- the Cloud and per-service video checks (media container, poster/video frames, toggle geometry at 320/390/1280px);
- the navigation/responsive check (hero actions stack under 640px, the TextLink label and chevron stay on one line, no meaningful overflow at 320–1280px);
- the localization check (route visuals, five Cloud stages, heading parity);
- the site audit: 18 routes × 6 profiles, 0 contrast failures.

The pages were reviewed at 1440px and 390px for all four RO pages, with EN
Cloud and EN Security spot-checked. The timeline was also checked mid-scroll
(fill and active nodes), under reduced motion (full rail) and at 320px (no
overflow).

| Before                                      | After (desktop)                         | After (mobile)               |
| ------------------------------------------- | --------------------------------------- | ---------------------------- |
| [Cloud](before-cloud-desktop.png)           | [Cloud](cloud-ro-desktop.png)           | [Cloud](cloud-ro-mobile.png) |
| [Securitate](before-securitate-desktop.png) | [Securitate](securitate-ro-desktop.png) |                              |
