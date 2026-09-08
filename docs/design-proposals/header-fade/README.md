# Soft header edges and Cloud video pilot

The owner rejected the SVG/CSS header animation treatment. The detail headers
retain their approved original images. The light effects, drift controller,
pause controls and animation-specific regression have been removed.

Service artwork gradually fades at the top and across the lower half of the
header. The underlying pale-blue surface also blends into the white content
section, removing the abrupt horizontal cutoff. Product artwork fades into its
existing dark header at its own image edges on both desktop and mobile.

| Header | Desktop | Mobile |
| --- | --- | --- |
| Infrastructure & Cloud | [Frame](cloud-desktop.png) | [Frame](cloud-mobile.png) |
| Networking & Security | [Frame](security-desktop.png) | — |
| Software & Automation | [Frame](software-desktop.png) | — |
| Managed Services | [Frame](managed-desktop.png) | [Frame](managed-mobile.png) |
| SEKNET | [Frame](seknet-desktop.png) | — |
| S-VPN | [Frame](svpn-desktop.png) | [Frame](svpn-mobile.png) |

A separate video agent prepared and reviewed the [Cloud video pilot](cloud-video-pilot.md).
The owner supplied the Veo-generated clip, now integrated only on Infrastructure
& Cloud in RO/EN. Its original image remains the fallback. The frames above
document the gradient treatment before the video pilot.

Original WebP assets, headings, CTAs and homepage interactions are unchanged.

Validation: `npm run qa:static` and `npm run qa:browser` pass. The all-route audit
covers 18 routes × six profiles with zero contrast failures and 216 existing logo
exemptions. The `check:cloud-video` regression covers actual playback/loop, pause,
media loading/fallback and navigation lifecycle. Other detail headers remain static.
