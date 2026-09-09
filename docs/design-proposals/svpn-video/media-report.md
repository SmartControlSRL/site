# S-VPN video media report

Source supplied by the owner: `Create_an_eight_second_silent (5).mp4`,
1,095,167 bytes, 1280 × 720, 24 fps, approximately 10.005 seconds including audio.
Source SHA-256:
`f8ddcec63b81f8495126ab92e89bc18367fadf490204ab3b8697b3d1efcff660`.

| Delivered public file | Dimensions | Bytes | Encoding |
| --- | --- | ---: | --- |
| `videos/s-vpn-hero-1280.mp4` | 1280 × 720 | 424,301 | H.264 High, yuv420p, CRF 23 |
| `videos/s-vpn-hero-800.mp4` | 800 × 450 | 116,581 | H.264 High, yuv420p, CRF 24 |
| `images/s-vpn-video-1280.webp` | 1280 × 720 | 15,850 | WebP quality 86, effort 6 |
| `images/s-vpn-video-800.webp` | 800 × 450 | 7,570 | WebP quality 86, effort 6 |

Both videos decode completely: 240 frames at constant 24 fps, exactly 10 seconds.
Only the video stream is present. Source metadata and chapters are omitted;
ordinary container/codec identifiers remain. MP4 box order is `ftyp`, `moov`,
`free`, `mdat`, confirming faststart.

## Loop treatment

The original sequence is retained at its original speed. A blue light pulse
travels between two fixed blocks; the connection settles before the clip ends.
The first and last frames have closely aligned geometry and similar lighting,
so this integration uses a direct loop without a crossfade or time remapping.

The source contact sheet and delivered endpoint pairs were visually reviewed.
Small reflection and brightness differences remain. The delivered first/last
frame mean absolute RGB differences are approximately 1.089/255 at 1280 and
1.052/255 at 800. These measurements describe the seam; they do not establish
an imperceptible transition.

No crop, geometry retouch, watermark removal or generated replacement was used.
Each poster comes from its delivered video's opening frame. The original
`svpn-connection-1600.webp` and `svpn-connection-800.webp` references are retained.

## Reproduction

FFmpeg 7.1 desktop filter: `setpts=PTS-STARTPTS,fps=24`.
Mobile adds `scale=800:450:flags=lanczos`.

Select `0:v:0`, remove audio/subtitle/data streams and source metadata/chapters,
limit to 240 frames, and encode with `libx264`, preset `slow`, CRF 23 (desktop)
or 24 (mobile), `yuv420p`, profile `high`, constant 24 fps and `+faststart`.
Posters use Sharp WebP quality 86, effort 6, on the first decoded output frame.
Temporary tooling and original input media are outside the committed website.

## Delivered SHA-256

- `s-vpn-hero-1280.mp4`: `6b80571296c14f644b2f6ef43f49115fd8312d7c6e4794ef6c9551d22b129dae`
- `s-vpn-video-1280.webp`: `354576827459dfba70736b1444118edd750ddbfb0d15f96c307c0b443285e68c`
- `s-vpn-hero-800.mp4`: `370bdda303cbc20cbe1c04cbbddb8ed63e6b128a2bac54338490359a43e8b474`
- `s-vpn-video-800.webp`: `a27d60337d5396fa557b180ceb0fc70596e9cb16ff78465c6d8be7c6e9fa9ec8`
