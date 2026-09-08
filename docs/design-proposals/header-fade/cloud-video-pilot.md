# Cloud header: image-to-video pilot brief

Status: prepared; no video generated. The original approved still is unchanged.

## Scope and source

- Pilot page: Infrastructure & Cloud (`/servicii/cloud/`, with the same media available to its English translation).
- Input: `public/images/architecture-light-1600.webp`.
- Input dimensions: 1600 × 900 (16:9).
- Input SHA-256: `5a0124178841420434f10fb73c3e351e5757ef5a5ceddec7e9bfc714a9c2a3e8`.
- Preserve the exact white/ice-blue palette, blue glass edges, rigid slab geometry, right-weighted composition, and the empty left half used for the page heading.

## Ready-to-use generation prompt

Use this image as the first frame and exact composition reference. A locked-off architectural product shot of the existing translucent blue-edged glass planes and white slabs. The glass planes and all architecture remain perfectly rigid and stationary. Soft daylight slowly shifts through the existing glass, producing subtle physically plausible moving refractions and faint caustic highlights on the existing white surfaces. The movement is restrained, smooth and continuous, suitable as a quiet website header. Maintain the clean white and cool blue palette and the open light area on the left. Maintain straight lines and stable edges throughout. The lighting gently returns to its initial state at the end, creating a calm seamless five-second loop. Keep the camera completely locked, with no zoom or pan. No additional objects, text, logos, UI elements, light trails or particles. No deformation, flicker, cuts or sudden changes.

## Output and acceptance targets

- A real generated image-to-video clip, initially 5 seconds, 16:9, 1280 × 720 or higher, silent.
- A clean loop is a review target, not a guaranteed property of an untested generation. Inspect the final/first-frame transition; reject visible jumps or geometry morphing.
- Keep the original WebP as poster/fallback. Display video only after it can play; the page must not show a blank media area.
- Later encode a web-sized H.264 MP4 (optional WebM) from the approved clip; do not encode a zooming still as a substitute for generated motion.
- Respect reduced-motion preference by retaining the static image. Pause motion when offscreen or the page is hidden. Keep text and the parent's gradient fade separate from the video.
- Pilot only this service. Do not roll video out to other service/product headers until the user approves the result.

## Generation status

A separate video agent prepared this brief. No video generator is connected in
the current session, so no clip has been generated or embedded. The owner has
been asked which available video plugin to connect. After connection, verify
image-to-video support, generate the pilot and review it before integration.
