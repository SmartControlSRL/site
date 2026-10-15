# Homepage: partner logo marquee

On 2026-10-15 the owner asked for the partner names to be replaced by the
partners' logos in a strip that scrolls on its own. The owner confirmed on the
same day that Smart Control has approval from every partner to show its logo.
Several vendors require written authorization before their logo is used:
Oracle (`oracle.com/legal/logos`), HPE (terms of use), Microsoft (trademark
page) and IBM (logo request). Keep that authorization on file. Reconfirm it
before adding a partner or changing how its logo is shown.

## Artwork

Each logo is the vendor's **official artwork, unaltered**. Every one was
downloaded from the vendor's own domain: the header logo, a press kit, or a
brand page. Colours, proportions and lockups are untouched, because most
guidelines forbid altering a logo. The only processing is a security pass:

- dropped `<script>`, `<foreignObject>`, metadata, raster `<image>` and links;
- dropped event handlers, external references and CSS `@import`/`url()`;
- unwrapped Illustrator `<switch>` blocks so the vector artwork stays.

A side-by-side render showed each cleaned file identical to its original.

| Logo               | Source (official)                                     |
| ------------------ | ----------------------------------------------------- |
| Hitachi Vantara    | hitachivantara.com header (`hv-nav-logo-2025.svg`)    |
| Commvault          | commvault.com header (inline SVG)                     |
| Fortinet           | fortinet.com header / press kit (`fortinet-logo.svg`) |
| Cisco              | newsroom.cisco.com header (`cisco-logo.svg`)          |
| Juniper Networks   | juniper.net header (`juniper_black-rgb-header.svg`)   |
| Lenovo             | lenovo.com header (Lenovo CDN)                        |
| VMware by Broadcom | vmware.com header (`vmware-logo-grey.svg`)            |
| Fujitsu            | global.fujitsu header (Fujitsu CDN)                   |
| Oracle             | oracle.com header (inline SVG)                        |
| Palo Alto Networks | paloaltonetworks.com brand page (`pan-logo-dark.svg`) |
| IBM                | ibm.com/design/language 8-bar logo page (`ibm.svg`)   |
| HPE                | hpe.com header (`logo-lm.svg`, static version)        |
| Dell Technologies  | dell.com/ro-ro header (inline SVG)                    |

Files are in `public/images/partners/` (about 45 KB in total). Sizing lives in
`src/content/partner-logos.ts`:

- each logo gets the same optical area, computed from its aspect ratio;
- small per-logo scales balance marks that read heavier (Fortinet, IBM, Lenovo)
  or lighter (Hitachi Vantara) than their area suggests.

**Pending:** no Microsoft or Hanasis artwork is in place, and both render as
text. Microsoft publishes only a 216 × 46 PNG publicly; its SVG is in the
login-gated brand kit. The only "Hanasis" found is a South Korean POS and
industrial PC maker. The owner needs to confirm the partner, and its site has
only a 259 × 35 PNG.

## Behaviour

`LogoMarquee.astro`:

- **CSS only, no script.** The first list is the real content: logos with
  `alt` text.
- **Marquee.** When motion is allowed, an `aria-hidden` clone list follows the
  first, and the track loops (`translateX(0 → -50%)`) with faded edges.
- **Reduced motion.** The strip stays a static wrapped row.
- **Pausing.** Hovering the strip pauses it. There is no pause control, by owner
  decision (2026-10-15). The strip therefore does not meet WCAG 2.2.2 Pause,
  Stop, Hide (Level A) for keyboard and touch users, and the owner accepted
  this knowingly. Reinstating a control (see this PR's history) restores
  conformance.
