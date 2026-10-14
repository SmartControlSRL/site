# Cloud video integration

The owner supplied a Veo-generated clip based on the approved Cloud artwork.
It is integrated on Cloud in Romanian and English only. The original image and
soft gradient edges remain in place. Other service and product headers stay static.

The video agent reviewed the source and both web encodes. Geometry stays stable,
and the light/refraction motion is restrained. A 0.5-second crossfade smooths the
join; no visible double edges were found. The result runs for 9.5 seconds without
audio, at 24 fps, and is about 594 KiB on desktop / 200 KiB on mobile.

| Review | Frame |
| --- | --- |
| Desktop, 1280px | [View](cloud-1280.png) |
| Mobile, 390px | [View](cloud-390.png) |

These are individual frames. Review playback in the
[Cloud preview](https://site-git-codex-homepage-redesign-proposal-mihaiscs-projects.vercel.app/servicii/cloud/).

The localised pause control supports the keyboard and remembers the browser-session
preference. The clip loads only when playback is allowed. Reduced-motion, no-JS
and save-data visitors retain the image without downloading the MP4. Media errors
also fall back to the image. The runtime pauses offscreen/in hidden documents and
unloads media on Astro route changes.

[Source, generation prompt, encoding and review notes](../header-fade/cloud-video-pilot.md).

Validation: `npm run qa:static` and the full `npm run qa:browser` pass. The focused
video check exercises RO/EN at 320/390/1280px, a real loop, keyboard pause,
offscreen suspension, session preference, reduced-motion/no-JS/save-data without
MP4 requests, media-error/autoplay fallback and Astro cleanup. The all-route audit
covers 18 routes × six profiles with zero contrast failures and 216 existing logo
exemptions. Real hidden-tab transitions remain a manual verification item.
