# Hero media v2: one concrete scene per page

The owner asked for new, more original hero videos (note 2 of the 2026-10-14
review) and, on 2026-10-26, for scenes with an artistic point: a clear
illustration of what each page covers, "not abstract things just to exist",
like the homepage's layer stack. These six clips replace the previous stock-like
cubes and ribbons. The old files are overwritten under the same names, so the
media contract (`HeroVideoArtwork`, posters, checks) is unchanged.

## Scenes

All six share the homepage hero's language: frosted glass with navy etched
line-art, a single bright-blue glow, pale blue-white studio (light pages) or
midnight studio (product pages), subject on the right, headline space on the
left.

| Page                             | Scene                                                                                                                                                                                       | What it says                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Cloud (`cloud`)                  | Three etched server racks on a glass base; a ramp of blue light rises to an elevated cloud platform tiled with VM/container icons; workload blocks travel up the ramp and settle into tiles | Consolidation and migration from the data centre onto a cloud platform |
| Securitate (`network-security`)  | A glass pane stands as a perimeter in front of a lattice of network nodes; rays arrive from the left and stop at the pane; exactly one passes through the gate                              | Perimeter protection with controlled access                            |
| Software (`software-automation`) | Five upright glass gates in a row on a light rail; a pulse travels through them, lighting each gate as it passes                                                                            | A delivery pipeline (build → test → release)                           |
| Managed (`managed-services`)     | A client estate (rack, switch panel, app window) on a round base, inside a glass orbit ring; a glowing marker circles and checks each piece                                                 | Continuous monitoring and care of the whole estate                     |
| SEKNET (`seknet`)                | A tall glass lens; small cubes send beams that converge into one core inside it                                                                                                             | Everything observed through one lens                                   |
| S-VPN (`s-vpn`)                  | Two glass blocks (devices, servers) joined by a glass tube with a keyhole gate; a packet passes the gate                                                                                    | A controlled tunnel                                                    |

The first Cloud and Managed drafts were abstract (a monolith splitting into
slabs; a gauge disc). They were redone with recognisable objects after the
owner's note. Keyframes: `keyframes.jpg`.

## Production

- **Keyframes:** Gemini `gemini-3-pro-image`, two candidates per page from a
  scene prompt plus the homepage slab render as style reference; the best was
  picked per page.
- **Motion:** Veo 3.1 was shut down by Google on 2026-10-22; the clips were
  generated with Gemini Omni (`gemini-omni-1.1-flash`) through the Interactions
  API, image-to-video with the keyframe as both first and last frame (seamless
  loop). Prompts constrain the camera and geometry (locked-off, rigid objects,
  motion only in light). Managed and SEKNET needed a stricter second round to
  remove flares, streaks and rotating parts.
- **Encoding:** ffmpeg 9: silent, H.264 High / yuv420p, 24 fps, 10.0 s,
  faststart, no metadata. 1280×720 at CRF 24 and 800×450 at CRF 25. Sizes:
  432–724 KB (1280) and 155–262 KB (800); 4.6 MB for all twelve files.
- **Posters:** first-frame WebP exports of the chosen keyframes, at the same
  names as before (`<key>-video-1280/800.webp`; Cloud keeps
  `architecture-light-1600/800.webp`).
- The clips carry Google's invisible SynthID watermark only; no visible marks.

Tooling lives outside the repo (`artifacts/tools`, git-ignored):
`gen-image.mjs`, `gen-video.mjs`, `encode-hero.sh`, `video-sheets.mjs`.

## Validation

`npm run check` 0 errors; `npm run build`; all six video checks, StackTeardown,
nav-responsive and the site audit (0 contrast failures) pass. In one full
`npm run qa` run the SEKNET playback check flaked while two other build jobs
ran on the same machine; re-run alone it passed three times in a row.
