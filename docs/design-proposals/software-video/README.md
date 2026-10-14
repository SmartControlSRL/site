# Software & Automation: supplied Veo video

The owner supplied `Create_an_eight_second_silent (2).mp4` for the Software &
Automation header on `/servicii/software/` and `/en/servicii/software/`.
The modules lift and settle in sequence on their existing platforms, with local
flexing of the blue ribbon. The sequence returns close to its opening pose.
The ten-second clip is retained without trimming or a crossfade.

The video uses the same **contain** fit and right alignment as the static
artwork, preserving the entire stepped assembly when playback starts or falls
back to the image. The existing gradient edges and header layout remain.

## Media

- Silent H.264, 24 fps, 10 seconds, MP4 faststart.
- `public/videos/software-automation-hero-1280.mp4`: 415,705 bytes.
- `public/videos/software-automation-hero-800.mp4`: 112,822 bytes.
- WebP fallbacks from the delivered opening frames: 19,646 bytes at 1280 × 720
  and 10,474 bytes at 800 × 450. The original reference stills remain available.
- [Source, encoding and loop review](media-report.md).

The existing shared player provides localised pause, a separate Software session
preference, visibility suspension and navigation cleanup. Reduced motion,
no JavaScript and save-data use the image without downloading an MP4.

## Review

The service-video regression now runs from one configurable script for Security
and Software. It verifies each route's responsive sources, actual playback and
loop, keyboard pause, fallbacks, page scope and independent Cloud preferences.
Software also verifies that poster and video use the same contain fit, alignment
and frame dimensions.

All static quality checks and every browser regression passed. The site audit
covered 18 routes across six profiles with zero contrast failures and 216
existing logo exemptions. RO/EN desktop/mobile frames were reviewed visually.

| Romanian | English |
| --- | --- |
| [Desktop](software-ro-desktop.png) | [Desktop](software-en-desktop.png) |
| [Mobile](software-ro-mobile.png) | [Mobile](software-en-mobile.png) |

Frames are captured during actual playback. Use the PR preview to review motion.
