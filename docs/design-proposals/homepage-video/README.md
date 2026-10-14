# Homepage: connected-sculpture video

The owner supplied `Create_an_eight_second_silent.mp4` for the homepage. It
replaces the previous animated infrastructure map on `/` and `/en/`. The four
connected modules rotate together beside the headline on desktop. On screens
up to 900px wide, the artwork sits below the copy with a closer crop that keeps
the entire sculpture visible. Its edges fade into the pale header and white
section below.

## Source and delivery

- Original: 1280 × 720, 24 fps, approximately 10.005 seconds, H.264 + AAC.
- Source SHA-256: `65a77a5bd4973ed1ef3d28c6eb5b200f1b68aa532e2150f29f79db18bd3619f0`.
- Desktop: `public/videos/homepage-hero-1280.mp4`, 731,044 bytes.
- Mobile: `public/videos/homepage-hero-800.mp4`, 262,004 bytes, 800 × 450.
- Both outputs: 239 frames, 9.958 seconds, 24 fps, silent H.264 High/yuv420p,
  MP4 faststart. No source metadata or new runtime dependency.
- WebP fallbacks: `homepage-connected-1280.webp` (15,516 bytes) and
  `homepage-connected-800.webp` (7,992 bytes), in `public/images/`.

A separate video agent compared the original endpoints and removed only the
final frame (about 42ms). The retained frames return closer to the opening pose;
there is no crossfade, geometry retouching or additional animation. A small
residual lighting/texture change remains at the join. The first and last frames
are not claimed to be identical. The original provider mark remains in the
encoded media and posters.

Each poster comes from the first decoded frame of its delivered video so that
playback begins on the same composition. The larger poster retains the actual
1280 × 720 dimensions rather than being upscaled.

Encoding uses FFmpeg 7.1: select the video stream, retain frames 0–238, reset
timestamps, set constant 24 fps, and encode with libx264, preset slow, CRF 23
(desktop) or 24 (mobile), yuv420p, profile high and faststart. Mobile is scaled
with Lanczos. Source metadata and chapters are removed. Both streams decode
fully, and both MP4s place `moov` before `mdat`. Temporary tooling remains
outside the repository.

## Playback and review

`HeroVideoArtwork` and `hero-video.ts` share playback behaviour between Home and
Cloud. Each page has its own session pause preference. The localised control
works with mouse and keyboard. The picture stays beneath the video, which
fades in after playback starts. Loading is deferred until the hero is visible;
the 800px source is selected at viewport widths up to 600px.

Reduced motion, no JavaScript and save-data retain the image without requesting
an MP4. Media failure returns to the image; blocked autoplay offers manual play.
Playback pauses offscreen or when the document is hidden. Astro navigation and
page teardown unload the previous media. The old map component is removed.

Validation passed: static quality checks; homepage and Cloud playback tests;
stack and navigation regressions; desktop/mobile visual review in RO and EN.
The homepage regression verifies advancing frames and an actual loop, source
selection at 320/390/768/1280px, click/Space pause, reduced-motion/no-JS fallback,
media errors, primary CTA visibility and Home↔Cloud disposal with independent
pause preferences. Real background-tab visibility remains a manual browser
check, as noted for the original Cloud pilot.

These screenshots show the integrated video at approximately one second:

| Romanian | English |
| --- | --- |
| [Desktop](home-ro-desktop.png) | [Desktop](home-en-desktop.png) |
| [Mobile](home-ro-mobile.png) | [Mobile](home-en-mobile.png) |

Use the PR preview to review motion and the join in actual playback.
