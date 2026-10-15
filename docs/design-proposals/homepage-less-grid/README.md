# Homepage: fewer grids, less template

The owner reviewed the site on 2026-10-14 and said it has too many grids and
looks too AI-generated. The homepage was built from one formula repeated in
every section: a mono eyebrow, the heading on the left and the lead on the
right, then an equal-column grid with a hairline above each item, often numbered
01–04. This change breaks that formula up.

The brand system stays geometric and hard-edged. "Less regular" therefore means
asymmetry, varied scale and stepped geometry, not organic shapes.

| Section        | Before                                                                     | After                                                                                                                                                                                                                                              |
| -------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Services       | 2×2 equal grid, hairlines, `01`–`04`                                       | Asymmetric bento of white cards with navy-tinted shadows. Cloud (the flagship) is the tall tile and carries its hero still. Managed runs full width with its description beside the title. Stacked intro (heading, then lead). No ordinal numbers. |
| Arhitectură IT | Exploded-plate schema plus layer list. This duplicated the new hero stack. | `StackTeardown visual={false}`: a sticky intro beside the layer rows. The rows step out like strata (L4 indented most, L1 at the base). The rows stay visitor-driven disclosures. The ambient auto-cycle and its pause control are dropped in this variant: without the plates, cycling only opened and closed rows and shifted content under the reader. The cycle also never advanced while the pointer or focus was in the (now full-width) section, so the control appeared to do nothing.                                                  |
| Cum lucrăm     | 3 equal columns with top rails                                             | A connected staircase. Each step sits lower and a stepped line joins the squares. The numbers stay because the order is real. Mobile keeps the vertical rail.                                                                                      |
| Products       | Equal columns, hairline, `01`/`02`                                         | Showcase cards, S-VPN offset downward. Each card leads with the product's own hero still (`seknet-video` / `s-vpn-video` posters), then the approved headline, intro and capability titles from `product-pages.ts`. These replace the two identical three-icon diagrams. No ordinal numbers or hairline.                                                                                                                                                                                          |
| Partners       | 4×4 table of names with rules                                              | An auto-scrolling strip of the partners' official logos (details in [homepage-partner-logos](../homepage-partner-logos/README.md)).                                                                                                                                                                                    |

The section backgrounds now alternate:

- hero;
- wash: services;
- white: architecture;
- wash: process;
- dark: products;
- white: partners;
- navy: contact.

Other notes:

- No new assets; the Cloud tile reuses `architecture-light-800.webp`.
- The new `visual` prop on `StackTeardown` defaults to `true`.

## Validation

The full `npm run qa` passes. That includes:

- the homepage check and the StackTeardown contract (disclosures, focus, no auto-cycle,
  reduced motion, no-JS, geometry at 320/390/1280px);
- navigation/responsive checks;
- the site audit, with 0 contrast failures.

It was also reviewed visually in RO and EN at 1440px and 390px.

| Before                                | After (desktop)                | After (mobile)               |
| ------------------------------------- | ------------------------------ | ---------------------------- |
| [Desktop](before-home-ro-desktop.png) | [Desktop](home-ro-desktop.png) | [Mobile](home-ro-mobile.png) |
