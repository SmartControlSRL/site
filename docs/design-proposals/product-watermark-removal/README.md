# Product hero watermark removal

On 9 September 2026 the owner requested removal of the visible provider sparkle
from the SEKNET and S-VPN headers. Both desktop/mobile videos and their matching
WebP fallback frames have been replaced. The original supplied MP4s and earlier
reference artwork remain available for provenance.

## Processing

FFmpeg 7.1 `removelogo` fills a small masked region from surrounding pixels in
each source frame. The [1280 × 720 mask](mask.png) follows the sparkle's curved
outline with a small margin. This avoids a rectangular patch over the adjacent
SEKNET base edge. The mask covers only the visible provider mark; the videos
retain their dimensions, speed, colour treatment and composition.

The mask has a black background with this white path:

```svg
<path d="M1160 569 C1168 587 1173 592 1191 600
C1173 608 1168 613 1160 631 C1152 613 1147 608 1129 600
C1147 592 1152 587 1160 569Z" fill="white"/>
```

Apply `removelogo=docs/design-proposals/product-watermark-removal/mask.png`
before the existing filter graph and encode directly from the supplied source.
SEKNET retains its 0.5-second tail/opening blend and 228-frame, 9.5-second loop;
S-VPN retains its complete 240-frame, 10-second sequence. Both remain silent
H.264/yuv420p at 24 fps with MP4 faststart. Posters are extracted from the first
decoded frame of each new encode.

Current file sizes, hashes and full encode settings are recorded with each
integration: [SEKNET](../seknet-video/media-report.md) and
[S-VPN](../svpn-video/media-report.md). Their in-page review captures are also
refreshed. No page copy, player logic, layout or other header media is changed.

## Review

Full decodes confirm all four videos have their expected frame counts and only
a video stream. Opening frames and ten one-second samples of the edited region
were inspected for both clips. No residual sparkle or conspicuous patch was
apparent in those samples. The localised repair reconstructs the obscured
background rather than recovering its unknown original pixels.

`qa:static`, `check:seknet-video` and `check:svpn-video` pass. The focused browser
checks cover RO/EN at 320, 390, 768 and 1280 px, actual playback and looping,
keyboard pause, responsive sources, matching poster/video framing, reduced-motion,
no-JS and save-data fallbacks, media errors and Astro navigation cleanup.
Desktop/mobile captures were refreshed in both languages, with representative
playback frames visually inspected. The wider browser suite was already green
at the preceding S-VPN integration; this update changes media and review records
only.
