# SEKNET video media report

Source supplied by the owner: `Create_an_eight_second_silent (4).mp4`,
1,514,323 bytes, 1280 × 720, 24 fps, approximately 10.005 seconds including audio.
Source SHA-256:
`44f423bcaead133ffbd35b3001e6000df5907ccd07d7b1dba47520d78744f7c9`.

| Delivered public file | Dimensions | Bytes | Encoding |
| --- | --- | ---: | --- |
| `videos/seknet-hero-1280.mp4` | 1280 × 720 | 639,124 | H.264 High, yuv420p, CRF 23 |
| `videos/seknet-hero-800.mp4` | 800 × 450 | 199,646 | H.264 High, yuv420p, CRF 24 |
| `images/seknet-video-1280.webp` | 1280 × 720 | 21,922 | WebP quality 86, effort 6 |
| `images/seknet-video-800.webp` | 800 × 450 | 11,220 | WebP quality 86, effort 6 |

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
RGB differences are approximately 1.051/255 at 1280 and 1.207/255 at 800; these
values describe the seam, not a guarantee of an imperceptible transition.

No geometry retouch, crop, watermark removal or generated replacement was used.
Each poster comes from its delivered video's opening frame, so it matches that
video's composition. Original `seknet-observability-1600.webp` and
`seknet-observability-800.webp` are retained.

## Reproduction

FFmpeg 7.1 filter graph for the desktop encode:

```text
[0:v]split=2[main][intro];
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

- `seknet-hero-1280.mp4`: `c2a2f7cacd8382aad1c8c3bb4ebaeecc3748d9182a8338dfc69024374e7d6453`
- `seknet-hero-800.mp4`: `41348d78973fb35b06c852405047f345bc7ccae3d454cb963755c3305509dbac`
- `seknet-video-1280.webp`: `215964181b45501c1c704895b7b6f3955d8643e6bf22c11c3c2264345293ae7c`
- `seknet-video-800.webp`: `8300e031460cdb22c78b025bc395f40097e520a9bdd5646c373f9ed17f584237`
