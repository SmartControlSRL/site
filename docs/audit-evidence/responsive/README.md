# Responsive before/after evidence

Captured 2026-09-01 with `scripts/screenshot.mjs` after scrolling each full
page so reveal states had settled.

- **Before:** commit `2ecae40fca4504ac93ffee469d38af77e31c452a`, the first parent of audit PR #34.
- **After:** the current `codex/complete-audit-followups` working tree.
- **Routes:** English Cloud and Romanian Managed Services.
- **Widths:** 320 px (narrow CTA, nav target, and footer stacking) and 768 px
  (the former mobile/desktop breakpoint collision and tablet footer state).

The matched PNGs are stored under `before/` and `after/`. They are review
evidence, not production assets. Automated coverage remains authoritative for
all eight RO/EN service-detail CTA rows and the 320, 390, 767, 768, 769, 1024,
1100, and 1280 px widths through `npm run check:nav-responsive`.

Observed result: at 768 px, the after build retains the mobile navigation until
the desktop row fits; at 320 px, actions stack without clipping and the footer
uses one column. The 768 px after footer uses two columns, while desktop uses
four. TextLink labels remain attached to their chevrons.
