# Cloud header: Veo video pilot

Status: owner supplied the generated clip for integration on Infrastructure & Cloud.
The same pilot is used on `/servicii/cloud/` and `/en/servicii/cloud/` only.
The separate video agent reviewed the original and optimised loop.

## Source and delivery

- Original approved reference: `public/images/architecture-light-1600.webp`, 1600 × 900.
- Owner-supplied file: `Create_an_second_premium_arc.mp4`, generated with Veo.
- Original SHA-256: `4c58a45d7114c7056176632033da43cf24c1abae7abc0972cd87a014387e77e1`.
- Input: 10.005 seconds, H.264, 1280 × 720, 24 fps, with AAC stereo audio.
- Desktop: `public/videos/cloud-hero-1280.mp4`, 594 KiB, 1280 × 720.
- Mobile: `public/videos/cloud-hero-800.mp4`, 200 KiB, 800 × 450.
- Both outputs: 9.5 seconds, H.264/yuv420p, 24 fps, silent, MP4 faststart.

The first 0.5 seconds is rotated to the end and blended with the final 0.5 seconds
of the original. The reviewer found no visible double edges or geometric jumps;
a small residual lighting/texture difference remains at the join. This is a
reviewed loop, not a claim of mathematically identical endpoints. The original
provider mark in the lower-right corner remains in the encoded media.

## Playback and fallback

The original image remains beneath the video. The video fades in after playback
starts and shares the same image crop and CSS edge gradients. A localised control
pauses/resumes playback and preserves the preference within the browser session.
The browser chooses the 800px clip at widths up to 600px before loading media.

No video source is assigned without JavaScript, with reduced motion, or with the
browser's save-data preference. Playback pauses offscreen and when the document
is hidden. Astro navigation pauses and unloads the departing clip. A media error
returns to the original image; blocked autoplay leaves a manual play control.
No third-party player, iframe, media host or runtime dependency is introduced.

## Prompt supplied for the user's Veo generation

Create an 8-second premium architectural animation using the uploaded image as the exact first frame and composition reference. Single continuous shot, fixed camera, 16:9.

Animate the natural light interacting with the existing translucent blue glass. Broad, soft reflections glide slowly across the glass planes. Delicate refracted light patterns travel across the white surfaces, creating visible but restrained depth and movement. The glass and white architectural slabs remain rigid, with perfectly straight edges and stable proportions.

Preserve the original white and ice-blue palette, materials, framing and object positions. Keep the left half bright, empty and visually quiet for the website headline. Concentrate the motion on the glass structure on the right. The result should feel like a carefully lit architectural film.

Use one gentle lighting cycle that returns to its starting state by the final frame, aiming for a seamless loop. Maintain stable exposure throughout. Keep the camera locked: no pan, zoom, orbit or shake. No morphing, new objects, particles, drawn light trails, text, logos, flicker or cuts. Silent video, no music, dialogue or sound effects.

## Encoding

Using FFmpeg 7.1, trim the main stream to frames 12–239 and the opening stream to
frames 0–11; reset timestamps and set each to 24 fps. Combine with
`xfade=transition=fade:duration=0.5:offset=9`. Encode the main output with
`libx264 -preset slow -crf 23 -pix_fmt yuv420p -an -movflags +faststart`.
Scale that result to 800 × 450 with CRF 24 for mobile. Source metadata is removed.
The temporary media tooling is outside the repository; package dependencies and
lockfile are unchanged.
