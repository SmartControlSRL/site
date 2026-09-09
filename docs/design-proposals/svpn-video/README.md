# S-VPN: supplied Veo video

The owner supplied `Create_an_eight_second_silent (5).mp4` for S-VPN on
9 September 2026. It is integrated on `/solutii/s-vpn/` and
`/en/solutii/s-vpn/`. The light pulse travels through the connection between
two fixed blocks. The original composition and visible provider mark remain.

## Media and presentation

- Silent H.264 MP4, 240 frames at 24 fps, 10 seconds, faststart.
  Desktop: 424,301 bytes at 1280 × 720. Mobile: 116,581 bytes at 800 × 450.
- The complete sequence plays at its original speed and loops directly.
  Closely aligned endpoints make a crossfade unnecessary for this clip.
- WebP fallbacks use the delivered videos' opening frames:
  15,850 bytes at 1280 × 720 and 7,570 bytes at 800 × 450.
- Video and poster share the product artwork's contained fit, right alignment,
  vertical centring and top/bottom fade, with 85% width on desktop and full
  width below 901 px. Starting playback does not change the composition.
- The dark pause control is localised and keyboard accessible. S-VPN has its
  own browser-session preference, independent of the other hero videos.

The shared controller defers loading until playback is allowed, pauses offscreen
and in hidden documents, and unloads media during Astro navigation. Reduced
motion, no JavaScript, save-data and media failures retain the poster.
All seven marketing pages now have their own supplied video. Approved editorial
copy, the DIN 2003 navigation logo and the other media are unchanged.

[Source hashes, encoding and loop review](media-report.md).

## Validation

`check:svpn-video` is included in `qa:browser`. It passes in RO/EN at 320, 390,
768 and 1280 px: actual playback and looping, responsive video/poster sources,
matching contained frames and fades, keyboard pause, non-overlapping controls,
static fallbacks without MP4 downloads, media errors, Astro cleanup and
independent Cloud/S-VPN preferences. It also confirms that other pages do not
request the S-VPN media.

Static checks pass (Astro check/build, links, email routing, claims, deployment
configuration, indexing and localisation). All six existing hero checks,
infrastructure-layer interaction and responsive navigation pass. Local
validation uses Node 24; CI targets Node 22. The full `qa:browser` suite passes,
including the site audit across 18 routes and six profiles with zero contrast
failures and 216 existing logo exemptions.

Four in-page playback captures were visually inspected alongside the source
contact sheet and delivered endpoint pairs. The video and poster keep the same
framing on desktop and mobile, and the text and pause control remain legible.
Real background-tab behaviour relies on the established controller and remains
a manual check.

| Romanian | English |
| --- | --- |
| [Desktop](svpn-ro-desktop.png) | [Desktop](svpn-en-desktop.png) |
| [Mobile](svpn-ro-mobile.png) | [Mobile](svpn-en-mobile.png) |

Use the PR preview to review the motion.
