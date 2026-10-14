# Managed Services: supplied Veo video

The owner supplied `Create_an_eight_second_silent (3).mp4` for the Managed
Services header on `/servicii/managed/` and `/en/servicii/managed/`.
The inner arcs rotate and return close to their opening position, while the
outer frame and pedestal remain stable. The complete ten-second sequence is
retained without trimming or a crossfade.

Video and poster share the existing **contain** fit and right alignment, keeping
the whole mechanism visible without a crop change when playback starts. The
header layout and soft gradient edges remain in place.

## Media

- Silent H.264, 24 fps, 10 seconds, MP4 faststart.
- `public/videos/managed-services-hero-1280.mp4`: 631,726 bytes.
- `public/videos/managed-services-hero-800.mp4`: 209,739 bytes.
- WebP fallbacks from the actual delivered opening frames: 27,212 bytes at
  1280 × 720 and 14,072 bytes at 800 × 450. Original reference stills remain.
- [Source, encoding and loop review](media-report.md).

The shared player provides localised pause, a separate Managed session preference,
visibility suspension and navigation cleanup. Reduced motion, no JavaScript and
save-data show the image without downloading an MP4.

## Review

The existing configurable service-video regression now includes Managed Services.
It verifies RO/EN at 320/390/1280px: responsive sources, actual playback and loop,
keyboard pause, controls clear of copy, static and media-error fallbacks, page
scope and independent Cloud preferences. It also checks matching poster/video
contain fit, alignment, aspect ratio and frame dimensions, including while paused.

RO/EN desktop/mobile frames were reviewed visually during actual playback.
All static quality checks and browser regressions passed. The site audit covered
18 routes across six profiles, with zero contrast failures and 216 existing logo
exemptions.

| Romanian | English |
| --- | --- |
| [Desktop](managed-ro-desktop.png) | [Desktop](managed-en-desktop.png) |
| [Mobile](managed-ro-mobile.png) | [Mobile](managed-en-mobile.png) |

Use the PR preview to review motion.
