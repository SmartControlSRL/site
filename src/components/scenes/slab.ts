// Shared geometry for the service hero scenes. Every scene reuses the
// homepage glass slab render (public/images/hero-stack-slab-*.webp, a
// 2236×1214 box) and engraves line-art on its top face through one affine
// matrix that maps a 280×280 drawing space onto the face.

/** Top-face corners of the slab render: top, right, left (bottom = R + L − T). */
export const FACE_T = [1105, 14] as const;
export const FACE_R = [2214, 578] as const;
export const FACE_L = [22, 578] as const;
export const RENDER_W = 2236;
export const RENDER_H = 1214;
/** Face centre in render coordinates. */
export const FACE_C = [1118, 578] as const;
/** Edge thickness of a full-size slab, in render units. */
export const SLAB_THICKNESS = 70;

/** Affine matrix (a b c d e f) from the 280×280 drawing space to the face. */
export const MAT = [
  (FACE_R[0] - FACE_T[0]) / 280,
  (FACE_R[1] - FACE_T[1]) / 280,
  (FACE_L[0] - FACE_T[0]) / 280,
  (FACE_L[1] - FACE_T[1]) / 280,
  FACE_T[0],
  FACE_T[1],
] as const;
export const MATRIX = MAT.map((v) => +v.toFixed(4)).join(" ");
/** Length of one drawing unit along the face's x axis, in render units. */
export const UNIT = Math.hypot(MAT[0], MAT[1]);

export const SLAB_SRC = "/images/hero-stack-slab-640.webp";
export const SLAB_SRCSET =
  "/images/hero-stack-slab-640.webp 640w, /images/hero-stack-slab-1160.webp 1160w";

export type Point = [number, number];

export const r1 = (v: number) => +v.toFixed(1);
export const r2 = (v: number) => +v.toFixed(2);
export const pathOf = (pts: Point[]) =>
  "M" + pts.map((p) => `${r1(p[0])} ${r1(p[1])}`).join(" L");

/** Escape one character for SVG text; spaces become no-break spaces. */
export const escapeChar = (c: string) =>
  c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === " " ? " " : c;

/**
 * One tspan per character so a script can type the label in; built as a
 * string because template whitespace between tspans would render as spaces.
 */
export const letters = (text: string, cls?: (index: number) => string) =>
  [...text]
    .map((c, i) => {
      const name = cls?.(i);
      return `<tspan${name ? ` class="${name}"` : ""}>${escapeChar(c)}</tspan>`;
    })
    .join("");
