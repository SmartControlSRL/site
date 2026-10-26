// Networking & Security hero (docs/design-proposals/service-hero-scenes):
// layered defence. Four nested glass slabs (perimeter, network, identity,
// data) around a protected core; a legitimate request is validated at every
// layer, a threat is stopped at the identity edge and a SOC sweep watches
// every layer. Ported from artifacts/hero-previews/security.html as one SVG
// in the slab render's coordinates (2236×1214 per full-size slab).
import {
  FACE_C,
  FACE_L,
  FACE_R,
  FACE_T,
  MATRIX,
  letters,
  r2,
  type Point,
} from "./slab";

export const SECURITY_NAMES = {
  ro: ["Perimetru", "Rețea", "Identitate", "Date"],
  en: ["Perimeter", "Network", "Identity", "Data"],
} as const;

const EX: Point = [
  (FACE_R[0] - FACE_T[0]) / 280,
  (FACE_R[1] - FACE_T[1]) / 280,
];
const EY: Point = [
  (FACE_L[0] - FACE_T[0]) / 280,
  (FACE_L[1] - FACE_T[1]) / 280,
];
const M = `matrix(${MATRIX})`;
export const SCALES = [1, 0.76, 0.54, 0.34]; // nested slab scales, outside → in
export const MG = SCALES.map((s) => 140 * (1 - s)); // face-space margin per slab
export const LIFT = [0, 168, 336, 504]; // lift of each slab (render units)
export const THK = 70; // edge thickness of a full-size slab
export const CORE_H = 180;
export const CORE_R = 19; // core cylinder height / face-space radius
export const BADGE_Y = 159;
export const PATH_Y = 140;
export const THREAT_X = 196;
export const badgeX = (k: number) => 280 - MG[k] - 15;
/** Face point (x, y) of slab k → render coordinates. */
export const P = (x: number, y: number, k: number): Point => [
  FACE_T[0] + x * EX[0] + y * EY[0],
  FACE_T[1] + x * EX[1] + y * EY[1] - LIFT[k],
];

/** The SVG viewBox: the outer slab edge to edge, the core and the ground. */
export const SECURITY_VIEWBOX = "10 -200 2216 1450";

const f = r2;
const pt = (p: Point) => `${f(p[0])} ${f(p[1])}`;

// Labels: desktop engraves "0n  NAME" at 10.2 units; phones hide the number
// and engrave the name larger (CSS), so loops leave room for the larger one.
const DESKTOP_ADVANCE = 7.35;
const MOBILE_FONT = 16.5;
const MOBILE_ADVANCE = MOBILE_FONT * 0.6 + 0.3;
const MOBILE_SHIFT = 15;
function labelEnd(k: number, lang: "ro" | "en") {
  const n = SECURITY_NAMES[lang][k].length;
  return Math.max(
    MG[k] + 13 + DESKTOP_ADVANCE * (4 + n),
    MG[k] + 13 + MOBILE_SHIFT + MOBILE_ADVANCE * n,
  );
}

export function securityMarkup(lang: "ro" | "en") {
  /** A square loop that leaves a gap on the front-left edge for the label. */
  const openLoop = (k: number, inset: number, cls: string, extra = "") => {
    const a = MG[k] + inset;
    const b = 280 - a;
    const g = Math.max(a, labelEnd(k, lang) + 6);
    return `<path class="${cls}" d="M${f(g)} ${f(b)} L${f(b)} ${f(b)} L${f(b)} ${f(a)} L${f(a)} ${f(a)} L${f(a)} ${f(b)}" ${extra}/>`;
  };
  const rimRect = (k: number, inset: number, cls: string, extra = "") => {
    const a = MG[k] + inset;
    const w = 280 - 2 * a;
    return `<rect class="${cls}" x="${f(a)}" y="${f(a)}" width="${f(w)}" height="${f(w)}" rx="5" ${extra}/>`;
  };
  const badge = (k: number) => {
    const x = badgeX(k);
    const y = BADGE_Y;
    const box = `x="${f(x - 8)}" y="${f(y - 8)}" width="16" height="16" rx="3.5"`;
    const tick = `M${f(x - 4.4)} ${f(y + 0.2)} L${f(x - 1.2)} ${f(y + 3.6)} L${f(x + 4.6)} ${f(y - 3.4)}`;
    return (
      `<g class="badge"><rect class="i" ${box} pathLength="1"/><path class="d" d="${tick}" pathLength="1"/></g>` +
      `<g class="badge-on" data-k="${k}"><rect class="h hf" fill-opacity=".14" ${box}/><path class="h" d="${tick}"/></g>`
    );
  };
  const art = (k: number) => {
    let s = rimRect(k, 4, "i", 'pathLength="1"');
    if (k === 0) {
      // Perimeter: dashed fence with two gate posts where traffic enters.
      s += openLoop(0, 13, "d", 'stroke-dasharray="2 4"');
      s += `<line class="i" x1="261" y1="${PATH_Y - 9}" x2="273" y2="${PATH_Y - 9}" pathLength="1"/><line class="i" x1="261" y1="${PATH_Y + 9}" x2="273" y2="${PATH_Y + 9}" pathLength="1"/>`;
      s += `<line class="i" x1="${THREAT_X - 9}" y1="261" x2="${THREAT_X - 9}" y2="273" pathLength="1"/><line class="i" x1="${THREAT_X + 9}" y1="261" x2="${THREAT_X + 9}" y2="273" pathLength="1"/>`;
      // Endpoints on the outer band.
      s += `<rect class="i" x="252" y="58" width="16" height="11" rx="2" pathLength="1"/><line class="i" x1="256" y1="73" x2="264" y2="73" pathLength="1"/>`;
      s += `<rect class="i" x="252" y="208" width="16" height="11" rx="2" pathLength="1"/><line class="i" x1="256" y1="223" x2="264" y2="223" pathLength="1"/>`;
    }
    if (k === 1) {
      // Network: a meshed loop of nodes (SD-WAN), one node on each traffic path.
      const a = MG[1] + 16;
      const b = 280 - a;
      const mid = 140;
      s += openLoop(1, 16, "d", 'stroke-dasharray="3 4"');
      const nodes: Point[] = [
        [a, a],
        [mid, a],
        [b, a],
        [b, 98],
        [b, mid],
        [b, 182],
        [b, b],
        [THREAT_X, b],
        [mid, b],
        [a, b],
        [a, mid],
      ];
      nodes
        .filter(([x, y]) => !(y === b && x < labelEnd(1, lang) + 6))
        .forEach(([x, y], n) => {
          s +=
            n % 3 === 1
              ? `<circle class="if" cx="${f(x)}" cy="${f(y)}" r="2.4" stroke="none"/>`
              : `<circle class="i" cx="${f(x)}" cy="${f(y)}" r="3" pathLength="1"/>`;
        });
    }
    if (k === 2) {
      // Identity: solid loop with a user credential and a key (SSO & PKI).
      const a = MG[2] + 14;
      const b = 280 - a;
      s += openLoop(2, 14, "d", 'pathLength="1"');
      s += `<circle class="i" cx="${f(b)}" cy="96" r="3.2" pathLength="1"/><path class="i" d="M${f(b - 6)} 107 Q${f(b)} 99 ${f(b + 6)} 107" pathLength="1"/>`;
      s += `<circle class="i" cx="${f(b)}" cy="196" r="3" pathLength="1"/><line class="i" x1="${f(b)}" y1="199" x2="${f(b)}" y2="${f(b - 6)}" pathLength="1"/>`;
    }
    if (k === 3) s += openLoop(3, 10, "d", 'stroke-dasharray="1.5 3.5"');
    s += badge(k);
    s += rimRect(k, 4, "h rim-hi", `data-k="${k}"`);
    return s;
  };
  // Monitoring sweep: a radial line with a fading trail, clipped to each face.
  const sweep = (k: number) => {
    let wedges = "";
    (
      [
        [0, 9, 0.16],
        [9, 18, 0.1],
        [18, 28, 0.055],
        [28, 40, 0.025],
      ] as const
    ).forEach(([a0, a1, o]) => {
      const r = 210;
      const p = (a: number) => [
        r * Math.cos((-a * Math.PI) / 180),
        r * Math.sin((-a * Math.PI) / 180),
      ];
      const [x0, y0] = p(a0);
      const [x1, y1] = p(a1);
      wedges += `<path class="wedge" d="M0 0 L${f(x1)} ${f(y1)} A${r} ${r} 0 0 1 ${f(x0)} ${f(y0)} Z" fill-opacity="${o}"/>`;
    });
    return `<g clip-path="url(#ss-clip-${k})"><g transform="translate(140 140)"><g class="sweep">${wedges}<line x1="0" y1="0" x2="210" y2="0"/></g></g></g>`;
  };
  const label = (k: number) => {
    const code = `0${k + 1}`;
    const name = SECURITY_NAMES[lang][k].toLocaleUpperCase(lang);
    return (
      `<text class="lbl" data-k="${k}" x="${f(MG[k] + 13)}" y="${f(280 - MG[k] - 9)}">` +
      letters(code, () => "code") +
      letters("  ", () => "sp") +
      letters(name, () => "nm") +
      `</text>`
    );
  };
  // Shadow a raised slab casts on the face below it.
  const castShadow = (k: number) => {
    const a = MG[k + 1] - 4;
    const w = 280 - 2 * a;
    return `<rect class="cast" x="${f(a)}" y="${f(a)}" width="${f(w)}" height="${f(w)}" rx="10" filter="url(#ss-soft)"/>`;
  };
  // Identity wall: the slab's front-left edge lights locally where the threat
  // is stopped. Drawn above the threat so the light reads clearly.
  const wall = () => {
    const y = 280 - MG[2];
    const th = THK * SCALES[2];
    const a = P(THREAT_X - 70, y, 2);
    const b = P(280 - MG[2] - 2, y, 2);
    const poly = [a, b, [b[0], b[1] + th] as Point, [a[0], a[1] + th] as Point]
      .map(pt)
      .join(" ");
    const c = P(THREAT_X, y, 2);
    const stop = (c[0] - a[0]) / (b[0] - a[0]);
    return (
      `<defs><linearGradient id="ss-wall" gradientUnits="userSpaceOnUse" x1="${f(a[0])}" y1="0" x2="${f(b[0])}" y2="0">` +
      `<stop offset="0" class="stop-bright" stop-opacity="0"/><stop offset="${f(stop)}" class="stop-bright" stop-opacity=".95"/><stop offset="1" class="stop-bright" stop-opacity=".2"/></linearGradient></defs>` +
      `<g class="wall"><polygon points="${poly}" fill="url(#ss-wall)"/><line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="url(#ss-wall)"/></g>`
    );
  };
  // Protected core: an etched database standing on the innermost slab.
  const core = () => {
    const [cx, cy] = P(140, 140, 3);
    const rx = (CORE_R * Math.hypot(EX[0] - EY[0], EX[1] - EY[1])) / Math.SQRT2;
    const ry = (CORE_R * (EX[1] + EY[1])) / Math.SQRT2;
    const top = cy - CORE_H;
    const tiers = [cy - CORE_H / 3, cy - (2 * CORE_H) / 3];
    const front = (y: number) =>
      `M${f(cx - rx)} ${f(y)} A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(y)}`;
    const body = `M${f(cx - rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(cy)} L${f(cx + rx)} ${f(top)} A${f(rx)} ${f(ry)} 0 0 0 ${f(cx - rx)} ${f(top)} Z`;
    const rows = [cy - CORE_H / 6, cy - CORE_H / 2, cy - (5 * CORE_H) / 6];
    const leds = rows
      .map(
        (y, n) =>
          `<circle class="${n === 2 ? "hf" : "if"}" cx="${f(cx + rx * 0.62)}" cy="${f(y + ry * 0.78)}" r="7" stroke="none"/>`,
      )
      .join("");
    const bars = rows
      .map(
        (y) =>
          `<path class="i" d="M${f(cx - rx * 0.7)} ${f(y + ry * 0.72)} Q${f(cx - rx * 0.35)} ${f(y + ry * 0.9)} ${f(cx + rx * 0.1)} ${f(y + ry * 0.95)}" pathLength="1"/>`,
      )
      .join("");
    // Shield etched on the top disc, in the disc's own (face) plane.
    const lift = LIFT[3] + CORE_H;
    const shield = `<g transform="translate(0 ${-lift}) ${M}"><path class="h shield" d="M140 129 L149 132.5 L149 139 Q149 146.5 140 151 Q131 146.5 131 139 L131 132.5 Z"/></g>`;
    return (
      `<g class="core">` +
      `<ellipse class="core-shadow" cx="${f(cx)}" cy="${f(cy + 10)}" rx="${f(rx * 1.08)}" ry="${f(ry * 1.08)}" filter="url(#ss-softR)"/>` +
      `<path d="${body}" fill="url(#ss-core)"/>` +
      `<ellipse class="core-top" cx="${f(cx)}" cy="${f(top)}" rx="${f(rx)}" ry="${f(ry)}"/>` +
      `<g class="core-lines" fill="none"><path class="i" d="${body}" pathLength="1"/><ellipse class="i" cx="${f(cx)}" cy="${f(top)}" rx="${f(rx)}" ry="${f(ry)}" pathLength="1"/>` +
      tiers
        .map((y) => `<path class="i tier" d="${front(y)}" pathLength="1"/>`)
        .join("") +
      bars +
      `</g>` +
      leds +
      shield +
      `<ellipse class="core-glow" cx="${f(cx)}" cy="${f(top)}" rx="${f(rx)}" ry="${f(ry)}" filter="url(#ss-glow)"/></g>`
    );
  };
  const packets = () =>
    `<g class="pk"><g class="sz"><circle class="pk-halo" r="84" fill="url(#ss-halo)"/><circle class="pk-dot" r="20"/></g></g>` +
    `<g class="threat"><g class="sz"><circle class="ring" r="40"/><circle class="dot" r="12"/></g></g>`;
  const blocked = `<g class="blocked"><g class="sz"><circle r="44"/><line x1="-31" y1="31" x2="31" y2="-31"/></g></g>`;

  const clips = SCALES.map((_, k) => {
    const a = MG[k] + 2.5;
    const w = 280 - 2 * a;
    return `<clipPath id="ss-clip-${k}"><rect x="${f(a)}" y="${f(a)}" width="${f(w)}" height="${f(w)}" rx="8"/></clipPath>`;
  }).join("");
  let layers = "";
  for (let k = 0; k < 4; k++) {
    const lift = `translate(0 ${-LIFT[k]})`;
    layers +=
      `<g class="layer" data-k="${k}">` +
      `<g transform="${lift} ${M}"><rect class="frost" x="${f(MG[k] + 3)}" y="${f(MG[k] + 3)}" width="${f(274 - 2 * MG[k])}" height="${f(274 - 2 * MG[k])}" rx="10"/></g>` +
      `<g transform="${lift} translate(${FACE_C[0]} ${FACE_C[1]}) scale(${SCALES[k]}) translate(${-FACE_C[0]} ${-FACE_C[1]})"><image href="/images/hero-stack-slab-1160.webp" width="2236" height="1214" preserveAspectRatio="none"/></g>` +
      `<g class="face" fill="none" transform="${lift} ${M}">${k < 3 ? castShadow(k) : ""}${art(k)}${sweep(k)}${label(k)}</g>` +
      `</g>`;
  }
  const base = P(140, 140, 0);
  return (
    `<svg class="scene-svg" viewBox="${SECURITY_VIEWBOX}" fill="none">` +
    `<defs>${clips}` +
    `<filter id="ss-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>` +
    `<filter id="ss-softR" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="14"/></filter>` +
    `<filter id="ss-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="22"/></filter>` +
    `<filter id="ss-ground" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="26"/></filter>` +
    `<radialGradient id="ss-halo"><stop offset="0" class="stop-bright" stop-opacity=".55"/><stop offset=".45" class="stop-sky" stop-opacity=".25"/><stop offset="1" class="stop-sky" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="ss-core" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="stop-wash"/><stop offset=".55" class="stop-surface"/><stop offset="1" class="stop-border"/></linearGradient>` +
    `</defs>` +
    `<ellipse class="ground" cx="${f(base[0])}" cy="${f(base[1] + 600)}" rx="900" ry="120" filter="url(#ss-ground)"/>` +
    layers +
    core() +
    packets() +
    wall() +
    blocked +
    `</svg>`
  );
}
