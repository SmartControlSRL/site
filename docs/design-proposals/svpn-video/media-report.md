# S-VPN video media report

Source supplied by the owner: `Create_an_eight_second_silent (5).mp4`,
1,095,167 bytes, 1280 × 720, 24 fps, approximately 10.005 seconds including audio.
Source SHA-256:
`f8ddcec63b81f8495126ab92e89bc18367fadf490204ab3b8697b3d1efcff660`.

| Delivered public file | Dimensions | Bytes | Encoding |
| --- | --- | ---: | --- |
| `videos/s-vpn-hero-1280.mp4` | 1280 × 720 | 424,044 | H.264 High, yuv420p, CRF 23 |
| `videos/s-vpn-hero-800.mp4` | 800 × 450 | 117,423 | H.264 High, yuv420p, CRF 24 |
| `images/s-vpn-video-1280.webp` | 1280 × 720 | 15,680 | WebP quality 86, effort 6 |
| `images/s-vpn-video-800.webp` | 800 × 450 | 7,512 | WebP quality 86, effort 6 |

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
frame mean absolute RGB differences are approximately 1.088/255 at 1280 and
1.045/255 at 800. These measurements describe the seam; they do not establish
an imperceptible transition.

At the owner’s request, the visible provider watermark is now removed with a
local pixel mask before encoding. The composition is not cropped.
[Removal record and mask](../product-watermark-removal/README.md).
Each poster comes from its delivered video's opening frame. The original
`svpn-connection-1600.webp` and `svpn-connection-800.webp` references are retained.

## Reproduction

FFmpeg 7.1 desktop filter:
`removelogo=docs/design-proposals/product-watermark-removal/mask.png,setpts=PTS-STARTPTS,fps=24`.
Mobile adds `scale=800:450:flags=lanczos`.

Select `0:v:0`, remove audio/subtitle/data streams and source metadata/chapters,
limit to 240 frames, and encode with `libx264`, preset `slow`, CRF 23 (desktop)
or 24 (mobile), `yuv420p`, profile `high`, constant 24 fps and `+faststart`.
Posters use Sharp WebP quality 86, effort 6, on the first decoded output frame.
Temporary tooling and original input media are outside the committed website.

## Delivered SHA-256

- `s-vpn-hero-1280.mp4`: `4551046d301017481c5b39343818255695f028d783076e5301a74a1aac144320`
- `s-vpn-video-1280.webp`: `d47465dac5477995d280ba1562f07f31be0388e3cb840fae50e9b6a0ee1dd5f6`
- `s-vpn-hero-800.mp4`: `2743260419d1c941254ce3c92f5f7e28c3a776d6cebb9c92e786180bface478f`
- `s-vpn-video-800.webp`: `6d4cbac2033ad3a68e20f26c7e4a2097b0efa1e78ab4f6e6e70d460bfc6697b7`
