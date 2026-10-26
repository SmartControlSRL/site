// Infrastructure & Cloud hero (docs/design-proposals/service-hero-scenes):
// physical servers on a data-centre floor consolidate into one virtualised
// platform, two VMs migrate to a hybrid cloud over a link of light and a DR
// replica syncs beside it. Ported from artifacts/hero-previews/cloud.html;
// the markup is the composed final state, the script animates it.
import {
  MAT,
  MATRIX,
  RENDER_H,
  RENDER_W,
  SLAB_SRC,
  SLAB_SRCSET,
  UNIT,
  letters,
  pathOf,
  r1,
  type Point,
} from "./slab";

export type CloudLayoutKind = "desktop" | "mobile";

const SU = MAT[1] / MAT[0]; // screen slopes of the two iso axes
const SV = MAT[3] / -MAT[2];

export const CLOUD_NAMES = {
  ro: ["Centru de date", "Virtualizare", "Cloud hibrid", "Recuperare DR"],
  en: ["Data centre", "Virtualisation", "Hybrid cloud", "Disaster recovery"],
} as const;

interface Slab {
  c: Point;
  W: number;
  k: number;
  left: number;
  top: number;
  H: number;
}
const geom = (c: Point, W: number): Slab => {
  const k = W / RENDER_W;
  return {
    c,
    W,
    k,
    left: c[0] - 1118 * k,
    top: c[1] - 578 * k,
    H: RENDER_H * k,
  };
};
/** Face point (280×280 drawing space) → scene px. */
const P = (s: Slab, x: number, y: number): Point => [
  s.left + (MAT[0] * x + MAT[2] * y + MAT[4]) * s.k,
  s.top + (MAT[1] * x + MAT[3] * y + MAT[5]) * s.k,
];
/** Face-axis vectors of a slab, per drawing unit, in scene px. */
const axes = (s: Slab) => ({
  u: [MAT[0] * s.k, MAT[1] * s.k] as Point,
  v: [MAT[2] * s.k, MAT[3] * s.k] as Point,
});

// Physical servers: towers of small glass units standing on the floor
// (owner feedback: ~15% larger than the preview's 98px units).
const TOWERS = [
  { f: [76, 92] as Point, n: 3 },
  { f: [196, 72] as Point, n: 2 },
  { f: [90, 200] as Point, n: 2 },
  { f: [204, 188] as Point, n: 3 },
];
const TW_RATIO = 113 / 380;
const TGAP_RATIO = 17 / 380;

// ---- Line-art in the 280×280 face space (verbatim from the preview).
const SERVER_ART = `
  <rect class="i" x="40" y="60" width="200" height="62" rx="10"/><rect class="i" x="40" y="150" width="200" height="62" rx="10"/>
  <line class="i" x1="66" y1="91" x2="160" y2="91"/><line class="i" x1="66" y1="181" x2="160" y2="181"/>
  <circle class="hf" cx="208" cy="91" r="9"/><circle class="if" cx="208" cy="181" r="9"/>`;
const FLOOR_ART = TOWERS.map(
  ({ f: [x, y] }) =>
    `<rect class="i fp-s" x="${x - 32}" y="${y - 32}" width="64" height="64" rx="7"/><rect class="i fp-d" x="${x - 32}" y="${y - 32}" width="64" height="64" rx="7" stroke-dasharray="3 5" opacity=".7"/>`,
).join("");
const GRID = [57, 117, 177];
const tiles = (fn: (x: number, y: number, i: number) => string) =>
  GRID.flatMap((y, r) => GRID.map((x, c) => fn(x, y, r * 3 + c))).join("");
const MOVERS = [1, 4]; // virt tiles that migrate to the cloud
const VIRT_ART =
  `<rect class="i frame" x="42" y="42" width="196" height="196" rx="12" stroke-dasharray="2 6" opacity=".7"/>` +
  tiles((x, y, i) => {
    const moved = MOVERS.includes(i);
    return (
      (moved
        ? `<rect class="i ph" data-i="${i}" x="${x}" y="${y}" width="46" height="46" rx="6" stroke-dasharray="3 4"/>`
        : "") +
      `<g class="vm${moved ? " moved" : ""}" data-i="${i}">` +
      (moved
        ? `<rect class="hf" x="${x}" y="${y}" width="46" height="46" rx="6" fill-opacity=".14"/><rect class="h" x="${x}" y="${y}" width="46" height="46" rx="6"/>`
        : `<rect class="i" x="${x}" y="${y}" width="46" height="46" rx="6"/>`) +
      `<line class="${moved ? "h" : "i"}" x1="${x + 9}" y1="${y + 13}" x2="${x + 29}" y2="${y + 13}"/></g>`
    );
  });
const SLOTS = [73, 121, 169];
const SLOT_Y = 150; // cloud slots (38×38)
const CLOUD_ART =
  `<path class="i" d="M60 212 H222 A34 34 0 0 0 226 144 A52 52 0 0 0 128 104 A40 40 0 0 0 64 140 A36 36 0 0 0 60 212 Z"/>` +
  SLOTS.map((x, j) =>
    j === 0
      ? `<rect class="i" x="${x}" y="${SLOT_Y}" width="38" height="38" rx="5"/><line class="i" x1="${x + 8}" y1="${SLOT_Y + 11}" x2="${x + 24}" y2="${SLOT_Y + 11}"/>`
      : `<rect class="i ph" x="${x}" y="${SLOT_Y}" width="38" height="38" rx="5" stroke-dasharray="3 4" data-j="${j}"/>` +
        `<g class="cf" data-j="${j}"><rect class="hf" x="${x}" y="${SLOT_Y}" width="38" height="38" rx="5" fill-opacity=".16"/><rect class="h" x="${x}" y="${SLOT_Y}" width="38" height="38" rx="5"/><line class="h" x1="${x + 8}" y1="${SLOT_Y + 11}" x2="${x + 24}" y2="${SLOT_Y + 11}"/></g>`,
  ).join("");
const DR_ART =
  `<rect class="i frame" x="42" y="42" width="196" height="196" rx="12" stroke-dasharray="2 6" opacity=".7"/>` +
  tiles(
    (x, y, i) =>
      `<rect class="i ph" x="${x}" y="${y}" width="46" height="46" rx="6" stroke-dasharray="3 4" opacity=".7"/>` +
      `<g class="df" data-i="${i}"><rect class="if" x="${x}" y="${y}" width="46" height="46" rx="6" style="fill-opacity:.06"/><rect class="i" x="${x}" y="${y}" width="46" height="46" rx="6"/><line class="i" x1="${x + 9}" y1="${y + 13}" x2="${x + 29}" y2="${y + 13}"/></g>`,
  );

const virtTile = (i: number): Point => [
  GRID[i % 3] + 23,
  GRID[Math.floor(i / 3)] + 23,
];
const slotC = (j: number): Point => [SLOTS[j] + 19, SLOT_Y + 19];

/** Scene-wide placement of the four slabs, before fitting to the box. */
function placement(kind: CloudLayoutKind) {
  if (kind === "desktop") {
    // Preview layout, on the iso grid: virt straight above the floor, cloud
    // offset along −v and lifted (now 10% larger so migrated VMs read), DR
    // offset along +u on the ground plane.
    const floor = geom([200, 420], 380);
    const virt = geom([200, 302], 380);
    const cloud = geom([200 + 280, 302 - 280 * SV - 66], 330);
    let dr: Point = [200 + 236, 420 + 236 * SU];
    // Shift DR along v so its back row shares an iso line with the floor's.
    const dk = (140 * (300 - 380)) / RENDER_W;
    dr = [dr[0] + dk * MAT[2], dr[1] + dk * MAT[3]];
    return { floor, virt, cloud, dr: geom(dr, 300) };
  }
  // Mobile: one column so every engraved label stays ≥10px on a phone. The
  // cloud floats straight above the platform, the DR replica stands in front
  // of the floor (disjoint on the ground plane, so no label is covered).
  const floor = geom([0, 0], 380);
  const virt = geom([0, -92], 380);
  const cloud = geom([0, -236], 380);
  const { u, v } = axes(floor);
  const a = 284;
  const dr = geom([(u[0] + v[0]) * a, (u[1] + v[1]) * a], 360);
  return { floor, virt, cloud, dr };
}

export function cloudLayout(kind: CloudLayoutKind) {
  const raw = placement(kind);
  const tw = 380 * TW_RATIO;
  const tgap = 380 * TGAP_RATIO;
  // Fit the composition (slabs, tower tops, ground shadows) into the box.
  const boxes: [number, number, number, number][] = Object.values(raw).map(
    (s) => [s.left, s.top, s.left + s.W, s.top + s.H + s.W * 0.16],
  );
  TOWERS.forEach((t) => {
    const b = P(raw.floor, ...t.f);
    boxes.push([
      b[0] - tw / 2,
      b[1] - 4 - (t.n - 1) * tgap - 578 * (tw / RENDER_W),
      b[0],
      b[1],
    ]);
  });
  const pad = kind === "desktop" ? 14 : 8;
  const minX = Math.min(...boxes.map((b) => b[0]));
  const minY = Math.min(...boxes.map((b) => b[1]));
  const maxX = Math.max(...boxes.map((b) => b[2]));
  const maxY = Math.max(...boxes.map((b) => b[3]));
  const dx = pad - minX;
  const dy = pad - minY;
  const at = (s: Slab) => geom([s.c[0] + dx, s.c[1] + dy], s.W);
  const S = {
    floor: at(raw.floor),
    virt: at(raw.virt),
    cloud: at(raw.cloud),
    dr: at(raw.dr),
  };
  const box: Point = [r1(maxX - minX + 2 * pad), r1(maxY - minY + 2 * pad)];

  // ---- Paths between slabs (scene px), each made of iso-aligned segments.
  let LINK: Point[], MOVE_A: Point[], MOVE_B: Point[], PULSE: Point[];
  let SYNC: Point[], BLIP: Point[];
  let ports: Point[];
  if (kind === "desktop") {
    const E1 = P(S.virt, 140, 0);
    const E2 = P(S.cloud, 140, 280);
    const K1: Point = [E1[0], E2[1] + SV * (E2[0] - E1[0])];
    MOVE_A = [
      P(S.virt, ...virtTile(1)),
      E1,
      K1,
      E2,
      P(S.cloud, 140, slotC(2)[1]),
      P(S.cloud, ...slotC(2)),
    ];
    MOVE_B = [
      P(S.virt, ...virtTile(4)),
      E1,
      K1,
      E2,
      P(S.cloud, 140, slotC(1)[1]),
    ];
    LINK = [E1, K1, E2];
    PULSE = [P(S.virt, 140, 140), E1, K1, E2, P(S.cloud, 140, slotC(1)[1])];
    const E3 = P(S.virt, 280, 0);
    const E4 = P(S.dr, 0, 0);
    const K2: Point = [E3[0], E4[1] - SU * (E4[0] - E3[0])];
    SYNC = [E3, K2, E4];
    BLIP = [P(S.virt, 200, 0), E3, K2, E4, P(S.dr, 80, 0)];
    ports = [E1, E2, E3, E4];
  } else {
    // A riser at the front-right edges carries VMs up to the cloud; the DR
    // sync drops from the platform's right corner to the replica's.
    const E1 = P(S.virt, 280, 140);
    const E2 = P(S.cloud, 280, 140);
    const t1 = virtTile(1);
    MOVE_A = [
      P(S.virt, ...t1),
      P(S.virt, 280, t1[1]),
      E1,
      E2,
      P(S.cloud, 280, slotC(2)[1]),
      P(S.cloud, ...slotC(2)),
    ];
    MOVE_B = [
      P(S.virt, ...virtTile(4)),
      E1,
      E2,
      P(S.cloud, 140, 140),
      P(S.cloud, ...slotC(1)),
    ];
    LINK = [E1, E2];
    PULSE = [
      P(S.virt, 140, 140),
      E1,
      E2,
      P(S.cloud, 140, 140),
      P(S.cloud, ...slotC(1)),
    ];
    const E3 = P(S.virt, 280, 0);
    const E4 = P(S.dr, 280, 0);
    const K2: Point = [E3[0], E4[1] - SU * (E4[0] - E3[0])];
    SYNC = [E3, K2, E4];
    BLIP = [P(S.virt, 200, 0), E3, K2, E4, P(S.dr, 200, 0)];
    ports = [LINK[0], LINK[1], E3, E4];
  }

  // Towers: each unit's resting centre and the vector that merges it into
  // the virtualisation platform (used by the intro).
  const towers = TOWERS.flatMap((t, i) => {
    const b = P(S.floor, ...t.f);
    return Array.from({ length: t.n }, (_, k) => {
      const c: Point = [b[0], b[1] - 4 - k * tgap];
      return {
        i,
        k,
        top: k === t.n - 1,
        base: b[1],
        c,
        d: [r1(S.virt.c[0] - c[0]), r1(S.virt.c[1] - c[1])] as Point,
      };
    });
  });

  return {
    kind,
    S,
    box,
    tw,
    LINK,
    MOVE_A,
    MOVE_B,
    PULSE,
    SYNC,
    BLIP,
    ports,
    towers,
  };
}

export type CloudLayout = ReturnType<typeof cloudLayout>;

// ---- Markup ----

function tagSVG(
  n: number,
  W: number,
  lang: "ro" | "en",
  kind: CloudLayoutKind,
) {
  const name = CLOUD_NAMES[lang][n].toLocaleUpperCase(lang);
  const unit = (UNIT * W) / RENDER_W; // scene px per drawing unit
  // Size that fills the front edge (mono advance 0.6em + tracking), capped
  // at a comfortable on-screen size for the composition's full scale.
  const size = (text: string, spacing: number, cap: number) =>
    +Math.min((242 / text.length - spacing) / 0.6, cap / unit).toFixed(1);
  // The bare name, engraved large: the stacked layout always, the desktop
  // one below 1440px (CSS), where the number prefix would push it under 10px.
  const short = size(name, 1, 16);
  if (kind === "mobile")
    return `<svg class="tag" viewBox="0 0 ${RENDER_W} ${RENDER_H}"><g transform="matrix(${MATRIX})"><text x="24" y="262" font-size="${short}">${letters(name)}</text></g></svg>`;
  const full = size(`0${n + 1}  ${name}`, 1.6, 12.5);
  const html =
    letters(`0${n + 1}`, () => "code") +
    letters("  ", () => "sp") +
    letters(name);
  return `<svg class="tag" viewBox="0 0 ${RENDER_W} ${RENDER_H}"><g transform="matrix(${MATRIX})"><text x="24" y="262" font-size="${full}" style="--fs-full:${full}px;--fs-short:${short}px">${html}</text></g></svg>`;
}

function slabHTML(
  id: string,
  s: { left: number; top: number; W: number; H: number },
  art: string,
  z: number,
  extra = "",
  tag = "",
  data = "",
) {
  return (
    `<div class="slab${extra ? " " + extra : ""}" data-slab="${id}"${data} style="left:${r1(s.left)}px;top:${r1(s.top)}px;width:${r1(s.W)}px;height:${r1(s.H)}px;z-index:${z}">` +
    `<span class="glow"><span></span></span><span class="frost"></span>` +
    `<img src="${SLAB_SRC}" srcset="${SLAB_SRCSET}" sizes="(max-width: 600px) 320px, 480px" width="1160" height="631" alt="" decoding="async">` +
    `<svg class="art" viewBox="0 0 ${RENDER_W} ${RENDER_H}" fill="none"><g transform="matrix(${MATRIX})">${art}</g></svg>` +
    `<span class="sheen"></span><span class="ring"></span>${tag}</div>`
  );
}

function moverSVG(s: Slab, size: number) {
  const { u, v } = axes(s);
  const h = size / 2;
  const pt = (a: number, b: number): Point => [
    r1(u[0] * a + v[0] * b),
    r1(u[1] * a + v[1] * b),
  ];
  const poly = [pt(-h, -h), pt(h, -h), pt(h, h), pt(-h, h)]
    .map((p) => p.join(","))
    .join(" ");
  const [x1, y1] = pt(-h + 9, -h + 13);
  const [x2, y2] = pt(-h + 29, -h + 13);
  return `<svg width="1" height="1"><polygon points="${poly}"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/></svg>`;
}

export function cloudMarkup(L: CloudLayout, lang: "ro" | "en") {
  const { S, box, kind } = L;
  const id = `cs-${kind}`;
  const tag = (n: number, s: Slab) => tagSVG(n, s.W, lang, kind);
  const shadow = (s: Slab, name: string, alpha = 1) =>
    `<div class="gshadow" data-shadow="${name}" style="left:${r1(s.c[0] - s.W * 0.44)}px;top:${r1(s.c[1] + s.W * 0.2)}px;width:${r1(s.W * 0.88)}px;height:${r1(s.W * 0.2)}px;opacity:${alpha}"></div>`;
  let html = `<div class="ambient"></div><div class="cam" style="width:${box[0]}px;height:${box[1]}px">`;
  html += shadow(S.floor, "floor") + shadow(S.dr, "dr", 0.7);
  html += slabHTML("floor", S.floor, FLOOR_ART, 2, "", tag(0, S.floor));
  // On mobile the cloud floats above the platform, so it paints after it.
  html += slabHTML(
    "cloud",
    S.cloud,
    CLOUD_ART,
    kind === "desktop" ? 3 : 31,
    "",
    tag(2, S.cloud),
  );
  html += slabHTML(
    "dr",
    S.dr,
    DR_ART,
    kind === "desktop" ? 4 : 32,
    "dr",
    tag(3, S.dr),
  );
  // Towers, back to front.
  [...L.towers]
    .sort((a, b) => a.base - b.base || a.k - b.k)
    .forEach((t, z) => {
      html += slabHTML(
        `tw-${t.i}-${t.k}`,
        geom(t.c, L.tw),
        t.top ? SERVER_ART : "",
        5 + z,
        "tower small",
        "",
        ` data-dx="${t.d[0]}" data-dy="${t.d[1]}" data-tower="${t.i}" data-unit="${t.k}"`,
      );
    });
  html += slabHTML("virt", S.virt, VIRT_ART, 30, "", tag(1, S.virt));
  const [p1, p2, p3, p4] = L.ports;
  html += `<svg class="overlay" viewBox="0 0 ${box[0]} ${box[1]}" fill="none">
    <defs><mask id="${id}-sync" maskUnits="userSpaceOnUse"><path class="sync-mask" d="${pathOf(L.SYNC)}" pathLength="1"/></mask></defs>
    <path class="link-glow" d="${pathOf(L.LINK)}" pathLength="1"/>
    <path class="link" d="${pathOf(L.LINK)}" pathLength="1"/>
    <path class="sync" d="${pathOf(L.SYNC)}" mask="url(#${id}-sync)"/>
    <circle class="port" data-port="1" cx="${r1(p1[0])}" cy="${r1(p1[1])}" r="3.2"/><circle class="port" data-port="2" cx="${r1(p2[0])}" cy="${r1(p2[1])}" r="3.2"/>
    <circle class="port dr-port" data-port="3" cx="${r1(p3[0])}" cy="${r1(p3[1])}" r="3"/><circle class="port dr-port" data-port="4" cx="${r1(p4[0])}" cy="${r1(p4[1])}" r="3"/>
  </svg>`;
  html += `<div class="mover" data-mover="a" style="offset-path:path('${pathOf(L.MOVE_A)}')">${moverSVG(S.virt, 46)}</div>`;
  html += `<div class="mover" data-mover="b" style="offset-path:path('${pathOf(L.MOVE_B)}')">${moverSVG(S.virt, 46)}</div>`;
  html += `<div class="pulse" data-pulse="link" style="offset-path:path('${pathOf(L.PULSE)}')"></div>`;
  html += `<div class="pulse small" data-pulse="blip" style="offset-path:path('${pathOf(L.BLIP)}')"></div>`;
  html += `</div>`;
  return html;
}
