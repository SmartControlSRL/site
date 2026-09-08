# Soft header edges and Cloud video pilot

The owner rejected the SVG/CSS header animation treatment. All six detail headers
now use their approved original still images. The light effects, drift controller,
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

A separate video agent prepared the [Cloud image-to-video pilot brief](cloud-video-pilot.md).
The pilot is limited to Infrastructure & Cloud, with the same media for RO/EN.
No video has been generated or embedded: a video-generation connection is still
needed. The current still-image treatment is ready independently of that pilot.

Original WebP assets, headings, CTAs and homepage interactions are unchanged.

Validation: `npm run qa:static` and `npm run qa:browser` pass. The all-route audit
covers 18 routes × six profiles with zero contrast failures and 216 existing logo
exemptions. A direct browser check confirms all 12 detail routes load their images
with zero header animation timelines and no remaining effect or control elements.
