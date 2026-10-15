/**
 * Partner logos for the homepage marquee: official vendor artwork, unaltered
 * except for removing scripts/metadata/external references (see
 * docs/design-proposals/homepage-partner-logos). `aspect` is the SVG viewBox
 * width ÷ height (or pixel size for the raster Microsoft Partner mark), used
 * to give every logo the same optical size; `scale`
 * nudges marks that read heavier or lighter than their area suggests. Names
 * without a file render as text until official artwork is supplied.
 */
export const partnerLogos: Record<
  string,
  { file: string; aspect: number; scale?: number }
> = {
  "Hitachi Vantara": { file: "hitachi-vantara.svg", aspect: 260 / 45, scale: 1.15 },
  Commvault: { file: "commvault.svg", aspect: 1145.68 / 223.37 },
  Fortinet: { file: "fortinet.svg", aspect: 487.6 / 55, scale: 0.85 },
  Cisco: { file: "cisco.svg", aspect: 108 / 57 },
  Juniper: { file: "juniper.svg", aspect: 718.2 / 196.3 },
  Lenovo: { file: "lenovo.svg", aspect: 124 / 40, scale: 0.88 },
  VMware: { file: "vmware.svg", aspect: 302 / 90 },
  Fujitsu: { file: "fujitsu.svg", aspect: 200.2 / 97.4 },
  Oracle: { file: "oracle.svg", aspect: 231 / 30 },
  Microsoft: { file: "microsoft-partner.webp", aspect: 510 / 131 },
  "Palo Alto": { file: "palo-alto.svg", aspect: 348 / 65 },
  IBM: { file: "ibm.svg", aspect: 50 / 21, scale: 0.8 },
  HPE: { file: "hpe.svg", aspect: 630 / 180 },
  DELL: { file: "dell.svg", aspect: 1017 / 132 },
};
