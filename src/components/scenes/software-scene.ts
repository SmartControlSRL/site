// Software & Automation hero (docs/design-proposals/service-hero-scenes): a
// delivery pipeline. Five glass stations (code, build, test, security,
// production) on one rail; a release chip travels it, each station checks it,
// and it lands in the production app window. Ported from
// artifacts/hero-previews/software.html. Desktop keeps the preview's single
// isometric diagonal; phones stack the stations in one column so the engraved
// labels stay legible.
import {
  FACE_L,
  FACE_R,
  FACE_T,
  MATRIX,
  RENDER_H,
  RENDER_W,
  SLAB_THICKNESS,
  letters,
  r2,
  type Point,
} from "./slab";

export type SoftwareLayoutKind = "desktop" | "mobile";

export const SOFTWARE_LABELS = {
  ro: ["COD", "BUILD", "TEST", "SECURITATE", "PRODUCȚIE"],
  en: ["CODE", "BUILD", "TEST", "SECURITY", "PRODUCTION"],
} as const;

const SLAB = "/images/hero-stack-slab-640.webp";
const ULEN = Math.hypot(FACE_R[0] - FACE_T[0], FACE_R[1] - FACE_T[1]);
export const UD: Point = [
  (FACE_R[0] - FACE_T[0]) / ULEN,
  (FACE_R[1] - FACE_T[1]) / ULEN,
];
const VLEN = Math.hypot(FACE_L[0] - FACE_T[0], FACE_L[1] - FACE_T[1]);
export const VD: Point = [
  (FACE_L[0] - FACE_T[0]) / VLEN,
  (FACE_L[1] - FACE_T[1]) / VLEN,
];
export const add = (a: Point, b: Point, s = 1): Point => [
  a[0] + b[0] * s,
  a[1] + b[1] * s,
];
const f = r2;
const pt = (p: Point) => `${f(p[0])},${f(p[1])}`;

const SPEC = [
  { id: "code", W: 236 },
  { id: "build", W: 236 },
  { id: "test", W: 236 },
  { id: "sec", W: 236 },
  { id: "prod", W: 318 },
] as const;
const GAP = 40;
const RAIL_OFF = 40;
/** Release chip size (owner feedback: ~15% larger than the preview's 86). */
const CHIP = 99;
export const BAR_FOOT = [
  [26, 50],
  [56, 80],
  [86, 110],
];
export const BAR_Y = [176, 198];
export const BAR_H = [30, 44, 62];

interface Station {
  id: (typeof SPEC)[number]["id"];
  W: number;
  i: number;
  k: number;
  edge: number;
  O: Point;
}
/** Face point (x, y in the 280-unit drawing space) → scene coordinates. */
export const P = (s: Station, x: number, y: number): Point => [
  s.O[0] +
    s.k *
      (FACE_T[0] +
        (x * (FACE_R[0] - FACE_T[0])) / 280 +
        (y * (FACE_L[0] - FACE_T[0])) / 280),
  s.O[1] +
    s.k *
      (FACE_T[1] +
        (x * (FACE_R[1] - FACE_T[1])) / 280 +
        (y * (FACE_L[1] - FACE_T[1])) / 280),
];

export function softwareLayout(kind: SoftwareLayoutKind) {
  const ST: Station[] = [];
  if (kind === "desktop") {
    // Stations along one isometric diagonal; front-left edges collinear so the
    // rail and the engraved labels read as a single line.
    let Lp: Point = [0, 0];
    SPEC.forEach((s, i) => {
      const k = s.W / RENDER_W;
      const edge = ULEN * k;
      ST.push({
        ...s,
        i,
        k,
        edge,
        O: [Lp[0] - FACE_L[0] * k, Lp[1] - FACE_L[1] * k],
      });
      Lp = add(Lp, UD, edge + GAP);
    });
  } else {
    // One column: each station's back corner sits just in front of the
    // previous one's front corner, so no station covers another's label.
    let T: Point = [0, 0];
    SPEC.forEach((s, i) => {
      const k = s.W / RENDER_W;
      ST.push({
        ...s,
        i,
        k,
        edge: ULEN * k,
        O: [T[0] - FACE_T[0] * k, T[1] - FACE_T[1] * k],
      });
      const B = P(ST[i], 280, 280);
      T = [B[0], B[1] + 12];
    });
  }
  let RP: Point[];
  let D: Point; // rail direction
  let N: Point; // offset between the two rail lines
  let r0: Point;
  let r1: Point;
  if (kind === "desktop") {
    const railAt = (s: Station, x: number) =>
      add(add(P(s, x, 280), [0, SLAB_THICKNESS * s.k]), VD, RAIL_OFF);
    RP = ST.map((s) => railAt(s, 140));
    D = UD;
    N = VD;
    r0 = add(RP[0], UD, -ST[0].edge * 1.1);
    r1 = add(RP[4], UD, ST[4].edge * 0.55);
  } else {
    // A vertical rail to the left of the column, one stop level with each
    // station's left corner.
    const x = Math.min(...ST.map((s) => P(s, 0, 280)[0])) - 26;
    RP = ST.map(
      (s) => [x, P(s, 0, 280)[1] + SLAB_THICKNESS * s.k * 0.5] as Point,
    );
    D = [0, 1];
    N = [1, 0];
    r0 = add(RP[0], D, -70);
    r1 = add(RP[4], D, 36);
  }
  const prod = ST[4];
  const slotC = P(prod, 165, 98);
  const liftMid: Point =
    kind === "desktop"
      ? [(RP[4][0] + slotC[0]) / 2 - 6, Math.min(RP[4][1], slotC[1]) - 34]
      : [(RP[4][0] + slotC[0]) / 2, Math.min(RP[4][1], slotC[1]) - 46];

  // Fit the viewBox to the composition (the faded rail lead-in may run out).
  const boxes: [number, number, number, number][] = [];
  ST.forEach((s) => {
    boxes.push([
      s.O[0],
      s.O[1],
      s.O[0] + RENDER_W * s.k,
      s.O[1] + RENDER_H * s.k + 10,
    ]);
  });
  const stackTop =
    P(prod, 62, 62)[1] - (578 + 70) * (104 / RENDER_W) - 2 * 30 - 4;
  const barsTop = Math.min(
    ...BAR_H.map((h, b) => P(prod, BAR_FOOT[b][0], BAR_Y[0])[1] - h),
  );
  boxes.push([
    P(prod, 62, 62)[0] - 60,
    kind === "desktop" ? Math.min(stackTop, barsTop) : barsTop,
    P(prod, 62, 62)[0] + 60,
    P(prod, 62, 62)[1],
  ]);
  RP.forEach((c) => boxes.push([c[0] - 40, c[1] - 26, c[0] + 40, c[1] + 20]));
  const pad = kind === "desktop" ? 14 : 8;
  const x0 = Math.min(...boxes.map((b) => b[0])) - pad;
  const y0 =
    Math.min(...boxes.map((b) => b[1])) - pad - (kind === "desktop" ? 10 : 0);
  const x1 = Math.max(...boxes.map((b) => b[2])) + pad;
  const y1 = Math.max(...boxes.map((b) => b[3])) + pad;
  const viewBox = [f(x0), f(y0), f(x1 - x0), f(y1 - y0)];

  // One screen size for every label: the tightest fit on the smaller slabs.
  const unit = (s: Station) => (s.k * ULEN) / 280;
  return { kind, ST, RP, D, N, r0, r1, slotC, liftMid, viewBox, unit };
}

export type SoftwareLayout = ReturnType<typeof softwareLayout>;

// ---------- Etched line-art per station (280 × 280 face space) ----------
const TICK = `<circle class="hf dyn tick-bg" cx="238" cy="202" r="21" fill-opacity=".16"/><circle class="i" cx="238" cy="202" r="21"/><polyline class="i" points="228,202 235,210 249,192" style="stroke-opacity:.22"/><polyline class="h bold dyn tick-on" pathLength="1" points="228,202 235,210 249,192"/>`;
const gearPath = (cx: number, cy: number) => {
  let d = "";
  for (let t = 0; t < 8; t++) {
    const a = t * 45;
    [
      [a - 15, 30],
      [a - 8, 40],
      [a + 8, 40],
      [a + 15, 30],
    ].forEach(([deg, r], j) => {
      const rad = (deg * Math.PI) / 180;
      d += `${t === 0 && j === 0 ? "M" : "L"}${f(cx + r * Math.cos(rad))} ${f(cy + r * Math.sin(rad))} `;
    });
  }
  return d + "Z";
};
const art = (id: Station["id"], uid: string) =>
  ({
    code: `
      <rect class="i" x="30" y="28" width="156" height="166" rx="10"/>
      <line class="i" x1="30" y1="56" x2="186" y2="56"/>
      <circle class="hf" cx="45" cy="42" r="4"/><circle class="if" cx="59" cy="42" r="4"/><circle class="if" cx="73" cy="42" r="4"/>
      <line class="i cl" x1="48" y1="82" x2="118" y2="82"/>
      <line class="h cl" x1="66" y1="106" x2="162" y2="106"/>
      <line class="i cl" x1="66" y1="130" x2="140" y2="130"/>
      <line class="i cl" x1="84" y1="154" x2="152" y2="154"/>
      <line class="i cl" x1="48" y1="178" x2="104" y2="178"/>
      <line class="i" x1="214" y1="44" x2="214" y2="140"/>
      <circle class="i" cx="214" cy="36" r="8"/><circle class="i" cx="214" cy="148" r="8"/>
      <path class="h" d="M214 118 C214 92 246 96 246 72"/><circle class="hf" cx="246" cy="64" r="8"/>
      ${TICK}`,
    build: `
      <g class="gear"><path class="i" d="${gearPath(84, 96)}"/><circle class="i" cx="84" cy="96" r="12"/><circle class="hf" cx="84" cy="96" r="4"/></g>
      <line class="i" x1="132" y1="96" x2="146" y2="96"/><polyline class="i" points="141,91 146,96 141,101"/>
      <rect class="h" x="154" y="46" width="94" height="24" rx="6"/>
      <rect class="i" x="154" y="84" width="94" height="24" rx="6"/>
      <rect class="i" x="154" y="122" width="94" height="24" rx="6"/>
      <rect class="i" x="30" y="166" width="174" height="20" rx="10"/>
      <rect class="hf dyn prog" x="35" y="171" width="164" height="10" rx="5" fill-opacity=".55"/>
      ${TICK}`,
    test:
      [34, 76, 118, 160]
        .map(
          (y, r) => `
      <rect class="i" x="34" y="${y}" width="26" height="26" rx="6"/>
      <polyline class="h bold dyn row-tick" data-r="${r}" pathLength="1" points="40,${y + 13} 46,${y + 19} 55,${y + 7}"/>
      <line class="i" x1="76" y1="${y + 13}" x2="${[204, 178, 216, 160][r]}" y2="${y + 13}"/>`,
        )
        .join("") + TICK,
    sec: `
      <clipPath id="${uid}-shield"><path d="M100 30 L162 54 V112 C162 154 136 182 100 200 C64 182 38 154 38 112 V54 Z"/></clipPath>
      <path class="i" d="M100 30 L162 54 V112 C162 154 136 182 100 200 C64 182 38 154 38 112 V54 Z"/>
      <circle class="h" cx="100" cy="104" r="13"/><line class="h" x1="100" y1="117" x2="100" y2="142"/>
      <g clip-path="url(#${uid}-shield)"><line class="h bold dyn scan" opacity="0" x1="30" y1="34" x2="170" y2="34"/></g>
      ${[
        [54, 250],
        [78, 230],
        [102, 246],
        [126, 218],
        [150, 240],
      ]
        .map(
          ([y, x2], j) =>
            `<line class="${j === 2 ? "h" : "i"}" x1="186" y1="${y}" x2="${x2}" y2="${y}"/>`,
        )
        .join("")}
      ${TICK}`,
    prod: `
      <rect class="hf dyn land-glow" x="124" y="22" width="138" height="132" rx="9" filter="url(#${uid}-landglow)"/>
      <rect class="i" x="124" y="22" width="138" height="132" rx="9"/>
      <line class="i" x1="124" y1="44" x2="262" y2="44"/>
      <circle class="hf" cx="136" cy="33" r="3.5"/><circle class="if" cx="147" cy="33" r="3.5"/>
      <rect class="i" x="138" y="58" width="54" height="80" rx="6" stroke-dasharray="4 4"/>
      <g class="dyn slot-fill"><rect class="hf" x="138" y="58" width="54" height="80" rx="6" fill-opacity=".16"/>
        <path class="h" d="M148 86 H170 L180 98 L170 110 H148 Z"/><circle class="h" cx="156" cy="98" r="3.5"/></g>
      <rect class="h bold dyn slot-flash" opacity="0" x="138" y="58" width="54" height="80" rx="6"/>
      ${[
        [70, 248],
        [88, 236],
        [106, 250],
        [124, 228],
      ]
        .map(
          ([y, x2]) =>
            `<line class="i" x1="206" y1="${y}" x2="${x2}" y2="${y}"/>`,
        )
        .join("")}
      ${TICK}`,
  })[id];
const SERVER_ART = `
  <rect class="i" x="40" y="62" width="200" height="56" rx="10"/><rect class="i" x="40" y="146" width="200" height="56" rx="10"/>
  <line class="i" x1="62" y1="90" x2="150" y2="90"/><line class="i" x1="62" y1="174" x2="150" y2="174"/>
  <circle class="hf led" cx="212" cy="90" r="8"/><circle class="if" cx="212" cy="174" r="8"/>`;
const CHIP_ART = `<path class="h bold" d="M54 92 H168 L214 140 L168 188 H54 Z"/><circle class="h bold" cx="92" cy="140" r="15"/>`;

export function softwareMarkup(L: SoftwareLayout, lang: "ro" | "en") {
  const uid = `sw-${L.kind}`;
  const { ST, RP, unit } = L;
  // One screen size for every label: the tightest fit on the smaller slabs.
  const u0 = unit(ST[0]);
  let fs = 15 / u0;
  ST.forEach((s, i) => {
    const n = SOFTWARE_LABELS[lang][i].length;
    const fit = 226 / n / 0.66; // mono advance ~0.6em + 0.06em tracking
    fs = Math.min(fs, (fit * unit(s)) / u0);
  });
  const lpx = fs * u0; // in scene px
  let shadows = "";
  let stations = "";
  ST.forEach((s, i) => {
    const sh = [P(s, 0, 0), P(s, 280, 0), P(s, 280, 280), P(s, 0, 280)].map(
      (p) => pt(add(p, [0, SLAB_THICKNESS * s.k + 8])),
    );
    shadows += `<polygon class="shadow" data-i="${i}" points="${sh.join(" ")}" filter="url(#${uid}-soft)"/>`;
    const size = f(lpx / unit(s));
    const spacing = f(size * 0.06);
    let extra = "";
    if (s.id === "prod") {
      // Server stack on the back corner: three mini slabs.
      const c = P(s, 62, 62);
      const mk = 104 / RENDER_W;
      let stack = "";
      // Phones stack the stations in one column, where the server stack would
      // stand over the security label, so only the desktop diagonal has it.
      for (let n = 0; n < (L.kind === "desktop" ? 3 : 0); n++) {
        const o: Point = [
          c[0] - 1118 * mk,
          c[1] - 578 * mk - SLAB_THICKNESS * mk - n * 30 - 2,
        ];
        stack +=
          `<g class="mini" data-n="${n}"><g transform="translate(${f(o[0])} ${f(o[1])}) scale(${mk.toFixed(5)})">` +
          `<image href="${SLAB}" width="${RENDER_W}" height="${RENDER_H}"/>` +
          `<g class="art etch" transform="matrix(${MATRIX})">${SERVER_ART}</g></g></g>`;
      }
      // 3D bars standing on the face.
      let bars = "";
      BAR_FOOT.forEach(([x0, x1], b) => {
        const [y0, y1] = BAR_Y;
        const H = BAR_H[b];
        const Pt = P(s, x0, y0);
        const Pr = P(s, x1, y0);
        const Pf = P(s, x1, y1);
        const Pl = P(s, x0, y1);
        const angL = (Math.atan2(Pf[1] - Pl[1], Pf[0] - Pl[0]) * 180) / Math.PI;
        const angR = (Math.atan2(Pr[1] - Pf[1], Pr[0] - Pf[0]) * 180) / Math.PI;
        bars +=
          `<g class="bar3d${b === 2 ? " hi" : ""}" data-b="${b}">` +
          `<g transform="translate(${f(Pl[0])} ${f(Pl[1])}) skewY(${f(angL)})"><rect class="lf grow" x="0" y="${-H}" width="${f(Pf[0] - Pl[0])}" height="${H}"/></g>` +
          `<g transform="translate(${f(Pf[0])} ${f(Pf[1])}) skewY(${f(angR)})"><rect class="rf grow" x="0" y="${-H}" width="${f(Pr[0] - Pf[0])}" height="${H}"/></g>` +
          `<polygon class="tf" points="${[Pt, Pr, Pf, Pl].map((p) => pt([p[0], p[1] - H])).join(" ")}"/></g>`;
      });
      extra = `<g class="stack">${stack}</g><g class="bars">${bars}</g>`;
    }
    stations +=
      `<g class="st" data-i="${i}"><g transform="translate(${f(s.O[0])} ${f(s.O[1])}) scale(${s.k.toFixed(5)})">` +
      `<image href="${SLAB}" width="${RENDER_W}" height="${RENDER_H}"/>` +
      `<g class="art etch" transform="matrix(${MATRIX})">${art(s.id, uid)}</g>` +
      `<g class="tag" transform="matrix(${MATRIX})"><text x="24" y="263" font-size="${size}" letter-spacing="${spacing}">${letters(SOFTWARE_LABELS[lang][i])}</text></g>` +
      `</g>${extra}</g>`;
  });

  // Rail: a thin etched track beside the stations, with a stop at each.
  const { r0, r1, D, N } = L;
  const track = [-3.5, 3.5]
    .map(
      (o) =>
        `<line class="rail-line" stroke="url(#${uid}-railfade)" x1="${f(r0[0] + N[0] * o)}" y1="${f(r0[1] + N[1] * o)}" x2="${f(r1[0] + N[0] * o)}" y2="${f(r1[1] + N[1] * o)}" pathLength="1"/>`,
    )
    .join("");
  const stopPts = (c: Point) =>
    [add(c, D, -14), add(c, N, -8), add(c, D, 14), add(c, N, 8)]
      .map(pt)
      .join(" ");
  const stops = RP.map(
    (c, i) =>
      `<polygon class="rail-stop" data-i="${i}" points="${stopPts(c)}"/>`,
  ).join("");
  const trail = `<line class="trail" x1="${f(RP[0][0])}" y1="${f(RP[0][1])}" x2="${f(RP[4][0])}" y2="${f(RP[4][1])}" pathLength="1"/>`;

  // Release chip: a mini glass tile with a version-tag glyph (no number).
  const ck = CHIP / RENDER_W;
  const face = [
    [1105, 14],
    [2214, 578],
    [1131, 1142],
    [22, 578],
  ]
    .map(([x, y]) => pt([(x - 1118) * ck, (y - 578) * ck]))
    .join(" ");
  const chip =
    `<g class="chip"><polygon class="chip-glow" points="${face}" filter="url(#${uid}-glow)"/>` +
    `<g transform="translate(${f(-1118 * ck)} ${f(-578 * ck)}) scale(${ck.toFixed(5)})">` +
    `<image href="${SLAB}" width="${RENDER_W}" height="${RENDER_H}"/>` +
    `<g class="art etch" transform="matrix(${MATRIX})">${CHIP_ART}</g></g></g>`;

  // Security scan curtain (moves along the rail over the chip).
  const b0 = add([0, 0], VD, -34);
  const b1 = add([0, 0], VD, 30);
  const beam =
    `<g class="beam"><polygon points="${[b0, b1, [b1[0], b1[1] - 70] as Point, [b0[0], b0[1] - 70] as Point].map(pt).join(" ")}" fill="url(#${uid}-curtain)"/>` +
    `<line class="beam-glow" x1="${f(b0[0])}" y1="${f(b0[1])}" x2="${f(b1[0])}" y2="${f(b1[1])}" filter="url(#${uid}-glow)"/>` +
    `<line class="beam-line" x1="${f(b0[0])}" y1="${f(b0[1])}" x2="${f(b1[0])}" y2="${f(b1[1])}"/></g>`;

  const [vx, vy, vw, vh] = L.viewBox;
  return (
    `<svg class="scene-svg" viewBox="${vx} ${vy} ${vw} ${vh}" fill="none" xmlns="http://www.w3.org/2000/svg"><defs>` +
    `<filter id="${uid}-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>` +
    `<filter id="${uid}-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="7"/></filter>` +
    `<filter id="${uid}-landglow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="16"/></filter>` +
    `<linearGradient id="${uid}-railfade" gradientUnits="userSpaceOnUse" x1="${f(r0[0])}" y1="${f(r0[1])}" x2="${f(RP[0][0])}" y2="${f(RP[0][1])}"><stop offset="0" class="stop-navy" stop-opacity="0"/><stop offset="1" class="stop-navy"/></linearGradient>` +
    `<linearGradient id="${uid}-curtain" x1="0" y1="1" x2="0" y2="0"><stop offset="0" class="stop-bright" stop-opacity=".45"/><stop offset="1" class="stop-sky" stop-opacity="0"/></linearGradient>` +
    `</defs><g class="content"><g class="shadows">${shadows}</g><g class="rail">${track}${stops}${trail}</g>` +
    `<g class="stations">${stations}</g>${chip}${beam}</g></svg>`
  );
}
