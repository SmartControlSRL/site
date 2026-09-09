# Managed Services video media report

Source supplied by the user: `Create_an_eight_second_silent (3).mp4`, 1,520,634 bytes, 1280 × 720, 24 fps, approximately 10.005 seconds including audio. Source SHA-256: `a36f1e5e7b1f33ecf7347e4751d8e2466811aac2a62c14f35dd1bd9780d4827d`.

| Delivered public file | Dimensions | Bytes | Encoding |
| --- | --- | ---: | --- |
| `videos/managed-services-hero-1280.mp4` | 1280 × 720 | 631,726 | H.264 High, yuv420p, CRF 23 |
| `videos/managed-services-hero-800.mp4` | 800 × 450 | 209,739 | H.264 High, yuv420p, CRF 24 |
| `images/managed-services-video-1280.webp` | 1280 × 720 | 27,212 | WebP quality 86, method 6 |
| `images/managed-services-video-800.webp` | 800 × 450 | 14,072 | WebP quality 86, method 6 |

Both videos contain all 240 source frames at constant 24 fps, exactly 10.0 seconds. No trim, crossfade, interpolation, crop or speed change was applied. Audio, subtitle/data streams, source metadata and chapters were removed; ordinary MP4/codec identifiers remain. Both decode through the last frame without errors, and box inspection confirms `moov` before `mdat` for faststart. The visible provider sparkle is preserved. Each poster is the actual first decoded frame of its delivered video, without upscaling. Original `managed-services-1600.webp` and `managed-services-800.webp` files are untouched.

## Visual and loop review

A bounded contact sheet and first/last frame pairs were inspected. The inner blue arcs rotate visibly, then return to the opening configuration. The outer white frame, base and overall composition remain stable in these samples. The movement is broader than a tiny oscillation; the supplied action is preserved. No major generated breakage or duplicated component was apparent in the sampled frames.

The resting endpoint configurations are close enough for a direct preview loop. Small differences in reflections, fine detail and alignment remain; the frames are not identical. Final whole-frame seam differences are approximately 1.685/255 at 1280 and 1.559/255 at 800. A crossfade would add unnecessary overlap to moving arcs, so none was introduced. Responsive browser playback and keyboard pause passed; the accompanying README links frames captured during actual playback.

Local review evidence includes a source contact sheet, source and delivered endpoints, complete-decode logs and stream/container checks. In-page frames are linked in the accompanying README.

## Commands

Run from the repository root with FFmpeg 7.1; place the supplied source beside it or adjust its input path.

```sh
ffmpeg -hide_banner -loglevel error -i 'Create_an_eight_second_silent (3).mp4' -map 0:v:0 -an -sn -dn -map_metadata -1 -map_chapters -1 -frames:v 240 -vf 'setpts=PTS-STARTPTS,fps=24' -r 24 -fps_mode cfr -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -profile:v high -movflags +faststart -fflags +bitexact -flags:v +bitexact -metadata encoder= -metadata:s:v:0 encoder= public/videos/managed-services-hero-1280.mp4

ffmpeg -hide_banner -loglevel error -i 'Create_an_eight_second_silent (3).mp4' -map 0:v:0 -an -sn -dn -map_metadata -1 -map_chapters -1 -frames:v 240 -vf 'setpts=PTS-STARTPTS,fps=24,scale=800:450:flags=lanczos' -r 24 -fps_mode cfr -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -profile:v high -movflags +faststart -fflags +bitexact -flags:v +bitexact -metadata encoder= -metadata:s:v:0 encoder= public/videos/managed-services-hero-800.mp4
```

Posters were encoded with Pillow from the corresponding `delivered1280-01.png` and `delivered800-01.png` first frames using `image.convert('RGB').save(path, 'WEBP', quality=86, method=6, exact=True)`.

## SHA-256

- `managed-services-hero-1280.mp4`: `8b3b6c6609800dfd80566f0a30ad15653825ec7a43a18a34e63db4fc25c8e6dd`
- `managed-services-hero-800.mp4`: `24827e7aa2bc0033505c2257f975fc27a6eb8d1dea97e26755d89cc870bb0dea`
- `managed-services-video-1280.webp`: `7894682a731448fd6b67bf1afb646802d31e072e3b81b2a36a8ec2e787312a64`
- `managed-services-video-800.webp`: `fe1f7a76557579742a1f3cd08318fb4185d04ae564890bce5d2a3a635ac2ebc6`
