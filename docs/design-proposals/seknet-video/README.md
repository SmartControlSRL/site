# SEKNET: supplied Veo video

The owner supplied `Create_an_eight_second_silent (4).mp4` for SEKNET on
9 September 2026. It is integrated on `/solutii/seknet/` and
`/en/solutii/seknet/`. Light pulses travel from the three nodes into the central
element. The source composition and visible provider mark are retained.

## Media and presentation

- Source: 1280 × 720, 24 fps, approximately 10.005 seconds, H.264 with AAC audio.
- Web versions: silent H.264 High/yuv420p, 228 frames, 9.5 seconds, MP4 faststart.
  Desktop is 639,124 bytes; mobile is 199,646 bytes at 800 × 450.
- A half-second crossfade blends the tail into the opening segment. It softens
  the final light pulse at the loop boundary without changing playback speed.
- WebP fallbacks are taken from the first decoded frame of each delivered video:
  21,922 bytes at 1280 × 720 and 11,220 bytes at 800 × 450.
- Video and poster share the product artwork's contained fit, right alignment,
  vertical centring and top/bottom fade. Both use 85% width on desktop and full
  width below 901 px, so playback starts without a framing jump.
- A dark, localised pause control sits clear of the heading, demo action and
  conceptual summary. It works with keyboard input and retains SEKNET's own
  browser-session preference.

The shared controller defers loading until playback is allowed, pauses offscreen
and in hidden documents, and unloads media during Astro navigation. Reduced
motion, no JavaScript, save-data and media failures retain the poster. S-VPN
remains a static header. Approved editorial copy and the original reference
stills are unchanged.

[Source hashes, encoding and loop review](media-report.md).

## Validation

`check:seknet-video` extends the existing configurable media harness. It checks
RO/EN at 320, 390, 768 and 1280 px: actual playback and looping, responsive
sources, matching video/poster frames and edge masks, pause/resume, control
geometry, static fallbacks without MP4 downloads, media errors, Astro cleanup
and independent Cloud/SEKNET preferences. It also confirms other pages do not
request the SEKNET video. The check is included in `qa:browser`.

The focused check and static quality checks pass. The remaining browser gates
also pass: Home, Cloud, Security, Software, Managed Services, infrastructure-layer
interaction and responsive navigation. The site audit covers 18 routes across
six profiles, with zero contrast failures and 216 existing logo exemptions.
In-page playback captures in
both languages were visually inspected, along with source samples, the last
half-second blend, and delivered first/last frames. No major geometry breakage
or overlapping object edges was apparent in those samples; the endpoint frames
are not identical. Real background-tab behaviour relies on the established
controller and remains a manual check.

| Romanian | English |
| --- | --- |
| [Desktop](seknet-ro-desktop.png) | [Desktop](seknet-en-desktop.png) |
| [Mobile](seknet-ro-mobile.png) | [Mobile](seknet-en-mobile.png) |

Use the PR preview to review the motion.
