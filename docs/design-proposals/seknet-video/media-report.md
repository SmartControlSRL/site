# SEKNET video media report

Source supplied by the owner: `Create_an_eight_second_silent (4).mp4`,
1,514,323 bytes, 1280 × 720, 24 fps, approximately 10.005 seconds including audio.
Source SHA-256:
`44f423bcaead133ffbd35b3001e6000df5907ccd07d7b1dba47520d78744f7c9`.

| Delivered public file | Dimensions | Bytes | Encoding |
| --- | --- | ---: | --- |
| `videos/seknet-hero-1280.mp4` | 1280 × 720 | 638,878 | H.264 High, yuv420p, CRF 23 |
| `videos/seknet-hero-800.mp4` | 800 × 450 | 199,730 | H.264 High, yuv420p, CRF 24 |
| `images/seknet-video-1280.webp` | 1280 × 720 | 21,566 | WebP quality 86, effort 6 |
| `images/seknet-video-800.webp` | 800 × 450 | 11,124 | WebP quality 86, effort 6 |

Both videos decode completely: 228 frames at constant 24 fps, exactly 9.5 seconds.
Only the video stream is present. Source metadata and chapters are omitted;
ordinary container/codec identifiers remain. MP4 box order is `ftyp`, `moov`,
`free`, `mdat`, confirming faststart.

## Loop treatment

The supplied clip ends while the lower light pulse is still reaching the centre.
The first frame has no comparable pulse. The scene geometry remains stable in
the sampled frames, so a 0.5-second tail/opening crossfade reduces the abrupt
brightness change. Source frames 12–239 form the main stream, and frames 0–11
form the opening stream blended over its last half-second. The resulting loop
begins at the original 0.5-second position and runs at the original speed.

Source contact sheets, endpoint pairs and six samples spanning the last second
of the delivered video were reviewed. The blend gradually attenuates the pulse;
no conspicuous doubled structural edge was apparent in those samples. Residual
lighting/detail differences remain. The delivered first/last-frame mean absolute
RGB differences are approximately 1.043/255 at 1280 and 1.194/255 at 800; these
values describe the seam, not a guarantee of an imperceptible transition.

At the owner’s request, the visible provider watermark is now removed with a
local pixel mask before the existing loop treatment. The composition is not
cropped. [Removal record and mask](../product-watermark-removal/README.md).
Each poster comes from its delivered video's opening frame, so it matches that
video's composition. Original `seknet-observability-1600.webp` and
`seknet-observability-800.webp` are retained.

## Reproduction

FFmpeg 7.1 filter graph for the desktop encode:

```text
[0:v]removelogo=docs/design-proposals/product-watermark-removal/mask.png,split=2[main][intro];
[main]trim=start_frame=12:end_frame=240,setpts=PTS-STARTPTS,fps=24,settb=1/24[a];
[intro]trim=start_frame=0:end_frame=12,setpts=PTS-STARTPTS,fps=24,settb=1/24[b];
[a][b]xfade=transition=fade:duration=0.5:offset=9,format=yuv420p[out]
```

Select `[out]`, remove audio/subtitle/data streams and source metadata/chapters,
limit to 228 frames, and encode with `libx264`, preset `slow`, CRF 23,
`yuv420p`, profile `high`, constant 24 fps and `+faststart`. Mobile uses the same
source graph with `scale=800:450:flags=lanczos` after the blend and CRF 24.
Posters use Sharp WebP quality 86, effort 6, on the first decoded output frame.
Temporary tooling and original input media are outside the committed website.

## Delivered SHA-256

- `seknet-hero-1280.mp4`: `78db9b33af39e52f535b01956e85ae54538e388bb2a4dcdd474f4351ad8972b5`
- `seknet-hero-800.mp4`: `0018422c1fd7f4d0588b0435b795f4c9e9eca002febade02bac44b4d3f07a847`
- `seknet-video-1280.webp`: `fc285cedf3629cedb509ab4723c5a5f2d1d8213d3f0bb0c19d55577a683ce00a`
- `seknet-video-800.webp`: `18b3fb64f803c2b7ad02d32bd4275d4e704045634b6df4e726a15fbc4b88e601`
