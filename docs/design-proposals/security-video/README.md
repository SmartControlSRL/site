# Networking & Security: supplied Veo video

The owner supplied `Create_an_eight_second_silent (1).mp4` for Networking &
Security. The clip is integrated on `/servicii/securitate/` and
`/en/servicii/securitate/`, using the existing header layout and gradient edges.
The other pages keep their own artwork and clips.

## Visible source limitation

Around source seconds 2–4, some cables separate into visible open tube ends,
curve independently and reconnect. This is present in the supplied Veo video;
it differs from the original prompt's fixed cable geometry. The owner was
informed during integration. The action is retained for preview review rather
than hidden through large cuts or interpolation.

[Frame captured during playback at three seconds](security-motion-3s.png).

The source also changes from a cooler opening background to a warmer ending.
A separate video agent prepared and reviewed the loop join and web encodes.
See [media provenance](media-report.md) for the exact processing, dimensions,
file hashes and residual visual limitations.

## Delivery and fallback

- Responsive H.264 files: `network-security-hero-1280.mp4` and
  `network-security-hero-800.mp4` in `public/videos/`.
- Both are silent MP4s with faststart. No external player or new dependency.
- WebP fallback images: `network-security-video-1280.webp` and
  `network-security-video-800.webp` in `public/images/`, extracted from the
  delivered opening frames. The original approved stills are retained.
- The shared hero player supplies localised pause/play controls, keyboard
  access, an independent Security session preference, offscreen and hidden-page
  suspension, and Astro navigation cleanup.
- Reduced motion, no JavaScript and save-data retain the poster without
  downloading video. A loading error returns to that image.

## Review

The Security regression covers RO/EN at 320/390/1280px, actual advancing frames
and looping, responsive poster/video sources, controls clear of the headline
and actions, keyboard pause, no-download fallbacks, media errors, and independent
Security/Cloud preferences with previous media unloaded during navigation.
The existing Home and Cloud regressions cover their continued playback.

| Romanian | English |
| --- | --- |
| [Desktop](security-ro-desktop.png) | [Desktop](security-en-desktop.png) |
| [Mobile](security-ro-mobile.png) | [Mobile](security-en-mobile.png) |

All static quality checks and every browser regression passed, including the
18-route, six-profile audit with zero contrast failures and 216 existing logo
exemptions. Use the PR preview to assess motion. The four layout screenshots
record the opening composition; the separate three-second frame shows the
source's cable deformation during actual playback.
