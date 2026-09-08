# Networking & Security video media report

Source supplied by the user: `Create_an_eight_second_silent (1).mp4` — 1,546,223 bytes, 1280 × 720, 24 fps, approximately 10.005 seconds including audio.

Source SHA-256: `9042e1163e51ff00a26efa868478b7f37bff78859303ff6de3f9c0fcdfb4ac18`.

## Delivered media

| Public file | Dimensions | Bytes | Encoding |
| --- | --- | ---: | --- |
| `videos/network-security-hero-1280.mp4` | 1280 × 720 | 664,992 | H.264 High, yuv420p, CRF 23 |
| `videos/network-security-hero-800.mp4` | 800 × 450 | 221,130 | H.264 High, yuv420p, CRF 24 |
| `images/network-security-video-1280.webp` | 1280 × 720 | 23,242 | WebP quality 86, method 6 |
| `images/network-security-video-800.webp` | 800 × 450 | 13,018 | WebP quality 86, method 6 |

Both MP4 files have 227 frames at constant 24 fps and an exact track duration of 9.458333 seconds. Both decode fully without errors. Audio, subtitle/data streams, chapters and source metadata were removed; normal MP4/codec identification fields remain. MP4 box inspection confirms `moov` precedes `mdat` for faststart. The source's provider mark was preserved; no crop, retouching or watermark removal was applied.

Each poster comes from the actual first decoded frame of its corresponding delivered video. The larger poster retains its real 1280-pixel width; no upscaling was performed. The separately approved `network-security-1600.webp` and `network-security-800.webp` files remain untouched.

## Source appearance and limitations

The original contains substantial generated geometry changes: approximately between source seconds 2 and 4, some cables develop open tubular ends and separate loops before returning to the original bundle. This is present in the user-supplied video and was not introduced by encoding. The central action is preserved; no large trim or interpolation hides it. It does not match a strictly stationary cable bundle with moving reflections only.

The source also shifts from a cool pale background at the start to a warmer off-white background by the end. A raw loop would make this colour change abrupt. In the encoded version the shift is gradual at the join, while the source's changing background temperature remains visible over the cycle.

## Loop treatment

The output begins near source second 0.5. The central portion remains at its original speed. The approximately final half-second is blended with the original first half-second, using the quiet endpoint portions where the gate and cable bundle are aligned. The join uses a short fade over approximately 0.5 seconds; frame-rate normalisation produces the exact 227-frame duration above.

The whole-frame mean absolute RGB difference across the source seam is approximately 12.54/255. After processing it is 1.685/255 at 1280 and 1.820/255 at 800. Visual inspection of the final transition found no conspicuous doubled gate/cable geometry. The endpoints are not mathematically identical, and a small residual change in colour and reflection remains. This is a preview of the supplied clip with a smoother join, not a correction of its central cable morphing.

Review evidence includes source and delivered boundary frames, transition contact sheets, full decode logs and stream/MP4-box checks. In-page screenshots are linked in the accompanying README.

## Processing details

Encoding tool: FFmpeg 7.1. Temporary media tooling is outside the repository.

The source is split into main frames 12–227, tail frames 228–239 and head frames 0–11. Each segment has reset timestamps, 24 fps and a 1/24 time base. Tail and head use `xfade=transition=fade:duration=0.458333333333:offset=0`, trimmed to at most 12 frames; the main segment and join are concatenated and normalised to constant 24 fps. Encoding uses libx264 `preset=slow`, `pix_fmt=yuv420p`, `profile=high` and `movflags=+faststart`. The mobile version adds Lanczos scaling to 800 × 450. Source metadata is disabled with `map_metadata=-1` and `map_chapters=-1`; bitexact flags avoid embedding encoder version metadata.

## SHA-256

- `network-security-hero-1280.mp4`: `f7af244dc71323beab3ffdf0aebd25d13f563d8b99a72fa4ce5bc24b98cae653`
- `network-security-hero-800.mp4`: `42f5690b7454d567986fa583992cbbfa96799d95d5e07894d92c726a150e2213`
- `network-security-video-1280.webp`: `5c4921f52ae7a11bd94e91b7955031c59a58bc39ebfc8516b858d5ad817afced`
- `network-security-video-800.webp`: `727637fbb8c4702166689b833dd3801bb0b2caa9158ff35fcc915ea16b9ea0f0`
