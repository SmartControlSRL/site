// Security hero timeline (SecurityScene.astro), ported from
// artifacts/hero-previews/security.html. Intro: the defence builds from the
// outside in and the core appears, then the first story within 8 s — a
// legitimate request validated at every layer, a threat stopped at the
// identity edge, one SOC sweep. Idle: the same beats, calmer, every 9 s.
import { registerScene, type SceneContext } from "../scene-runtime";
import {
  CORE_R,
  MG,
  P,
  PATH_Y,
  THREAT_X,
  badgeX,
} from "../../components/scenes/security-scene";
import type { Point } from "../../components/scenes/slab";

const EASE = "cubic-bezier(.16,1,.3,1)";
const INOUT = "cubic-bezier(.45,0,.25,1)";
const f = (v: number) => +v.toFixed(2);
const tr = (p: Point) => `translate(${f(p[0])}px, ${f(p[1])}px)`;

function beats({ stage, token }: SceneContext) {
  const $ = (sel: string) => stage.querySelector(sel);
  const $$ = (sel: string) => [...stage.querySelectorAll(sel)];
  const NAVY = token("--color-navy");
  const BRIGHT = token("--color-bright");
  const SURFACE = token("--color-surface");
  const BORDER = token("--color-border-blue");
  // Beats leave no residue: fill backwards only.
  const B = (el: Element | null, kf: Keyframe[], o: KeyframeEffectOptions) =>
    el?.animate(kf, { fill: "backwards", easing: "linear", ...o });

  type Way = { p: Point; d?: number; o?: number; e?: string };
  function travel(el: Element | null, pts: Way[], delay: number) {
    const total = pts.reduce((s, q) => s + (q.d ?? 0), 0);
    let t = 0;
    const kf = pts.map((q) => {
      t += q.d ?? 0;
      return {
        transform: tr(q.p),
        opacity: q.o ?? 1,
        offset: t / total,
        easing: q.e ?? INOUT,
      };
    });
    B(el, kf, { duration: total, delay });
    return total;
  }

  // A legitimate request is validated at every layer and reaches the core.
  function legit(delay: number, pace = 1) {
    const pts: Way[] = [
      { p: P(352, PATH_Y, 0), o: 0 },
      { p: P(281, PATH_Y, 0), d: 420 * pace, e: "cubic-bezier(.2,.6,.3,1)" },
    ];
    const lit: number[] = [];
    let t = 420 * pace;
    for (let k = 0; k < 4; k++) {
      const edge = 280 - MG[k];
      if (k > 0) {
        // Climb: jump to the next layer's height at the same face point.
        pts.push({ p: P(edge + 3, PATH_Y, k), d: 230 * pace });
        t += 230 * pace;
      }
      const dx = badgeX(k) + 1;
      pts.push({ p: P(dx, PATH_Y, k), d: 190 * pace });
      t += 190 * pace;
      lit.push(t);
      pts.push({ p: P(dx, PATH_Y, k), d: 170 * pace }); // dwell: validation
      t += 170 * pace;
      const next = k < 3 ? 280 - MG[k + 1] + 3 : 140 + CORE_R + 3;
      pts.push({ p: P(next, PATH_Y, k), d: 170 * pace });
      t += 170 * pace;
    }
    pts.push({ p: P(140 + CORE_R - 2, PATH_Y, 3), d: 200 * pace, o: 0 });
    t += 200 * pace;
    travel($(".pk"), pts, delay);
    const end = delay + t;
    lit.forEach((lt, k) =>
      B(
        $(`.badge-on[data-k="${k}"]`),
        [
          { opacity: 0 },
          { opacity: 1, offset: 0.08 },
          { opacity: 1, offset: 0.8 },
          { opacity: 0 },
        ],
        { duration: end - (delay + lt) + 1100, delay: delay + lt },
      ),
    );
    // The core acknowledges (the single glow accent of this beat).
    B(
      $(".core-glow"),
      [{ opacity: 0 }, { opacity: 0.55, offset: 0.25 }, { opacity: 0 }],
      {
        duration: 1200,
        delay: end - 200,
        easing: "ease-out",
      },
    );
    B(
      $(".core-top"),
      [{ fill: SURFACE }, { fill: BORDER, offset: 0.3 }, { fill: SURFACE }],
      {
        duration: 1200,
        delay: end - 200,
      },
    );
    return t;
  }

  // A suspicious request slips the outer layers and is stopped at identity.
  function threat(delay: number) {
    const y2 = 280 - MG[2];
    const y1 = 280 - MG[1];
    const D = [420, 330, 240, 380, 240, 300, 220, 640];
    const pts: Way[] = [
      { p: P(THREAT_X, 326, 0), o: 0 },
      { p: P(THREAT_X, 282, 0), d: D[0], e: "cubic-bezier(.2,.6,.3,1)" },
      { p: P(THREAT_X, y1 + 3, 0), d: D[1] },
      { p: P(THREAT_X, y1 + 3, 1), d: D[2] },
      { p: P(THREAT_X, y2 + 7, 1), d: D[3] },
      { p: P(THREAT_X, y2 + 7, 2), d: D[4] },
      { p: P(THREAT_X, y2 + 3, 2), d: D[5], e: "cubic-bezier(.5,0,.9,.6)" },
      // Refused: it recoils clear of the edge so the light stays readable.
      { p: P(THREAT_X, y2 + 24, 2), d: D[6], e: "cubic-bezier(.2,.8,.3,1)" },
      { p: P(THREAT_X, y2 + 24, 2), d: D[7], o: 0 },
    ];
    const total = travel($(".threat"), pts, delay);
    const hit = delay + D.slice(0, 6).reduce((a, b) => a + b, 0);
    // Dissolve: the dashed ring breaks outward, the core dot collapses.
    B(
      $(".threat .ring"),
      [
        { transform: "scale(1)", opacity: 1, strokeDashoffset: 0 },
        { transform: "scale(1)", opacity: 1, offset: 0.2 },
        { transform: "scale(1.9)", opacity: 0, strokeDashoffset: 12 },
      ],
      { duration: 700, delay: hit - 60, easing: "ease-out" },
    );
    B(
      $(".threat .dot"),
      [
        { transform: "scale(1)" },
        { transform: "scale(1)", offset: 0.3 },
        { transform: "scale(0)" },
      ],
      {
        duration: 600,
        delay: hit - 60,
        easing: "ease-in",
      },
    );
    // The identity edge lights locally (the single glow accent of this beat).
    B(
      $(".wall"),
      [
        { opacity: 0 },
        { opacity: 1, offset: 0.1 },
        { opacity: 0.9, offset: 0.45 },
        { opacity: 0 },
      ],
      {
        duration: 1450,
        delay: hit - 80,
        easing: "ease-out",
      },
    );
    B(
      $('.rim-hi[data-k="2"]'),
      [{ opacity: 0 }, { opacity: 0.85, offset: 0.15 }, { opacity: 0 }],
      {
        duration: 1400,
        delay: hit - 80,
        easing: "ease-out",
      },
    );
    $$('.lbl[data-k="2"] .nm').forEach((t) =>
      B(
        t,
        [
          { fill: NAVY },
          { fill: BRIGHT, offset: 0.15 },
          { fill: BRIGHT, offset: 0.6 },
          { fill: NAVY },
        ],
        {
          duration: 1500,
          delay: hit - 80,
        },
      ),
    );
    const bp = P(THREAT_X, y2 + 24, 2);
    B(
      $(".blocked"),
      [
        { transform: `${tr(bp)} scale(.7)`, opacity: 0 },
        { transform: `${tr(bp)} scale(1)`, opacity: 1, offset: 0.2 },
        { transform: `${tr(bp)} scale(1)`, opacity: 1, offset: 0.65 },
        { transform: `${tr(bp)} scale(1)`, opacity: 0 },
      ],
      { duration: 1200, delay: hit + 220, easing: "ease-out" },
    );
    return total;
  }

  // The SOC sweep: one calm revolution across every layer.
  function soc(delay: number, dur = 2200) {
    $$(".sweep").forEach((el) => {
      B(
        el,
        [{ transform: "rotate(-20deg)" }, { transform: "rotate(340deg)" }],
        {
          duration: dur,
          delay,
          easing: "cubic-bezier(.4,0,.6,1)",
        },
      );
      B(
        el,
        [
          { opacity: 0 },
          { opacity: 1, offset: 0.1 },
          { opacity: 1, offset: 0.86 },
          { opacity: 0 },
        ],
        {
          duration: dur,
          delay,
          composite: "add",
        },
      );
    });
    // Each layer's rim and label light as the line crosses its label.
    for (let k = 0; k < 4; k++) {
      const lx = MG[k] + 50 - 140;
      const ly = 280 - MG[k] - 12 - 140;
      const ang = (Math.atan2(ly, lx) * 180) / Math.PI;
      const u = (ang + 20) / 360;
      const at = delay + dur * (0.5 + (u - 0.5) * 0.82) - 120;
      B(
        $(`.rim-hi[data-k="${k}"]`),
        [{ opacity: 0 }, { opacity: 0.8, offset: 0.3 }, { opacity: 0 }],
        {
          duration: 1000,
          delay: at,
          easing: "ease-in-out",
        },
      );
      $$(`.lbl[data-k="${k}"] .nm`).forEach((t) =>
        B(t, [{ fill: NAVY }, { fill: BRIGHT, offset: 0.3 }, { fill: NAVY }], {
          duration: 1000,
          delay: at,
        }),
      );
    }
    return dur;
  }

  return { legit, threat, soc };
}

function intro(ctx: SceneContext) {
  const { stage, token } = ctx;
  const $ = (sel: string) => stage.querySelector(sel);
  const BRIGHT = token("--color-bright");
  const NAVY = token("--color-navy");
  const SURFACE = token("--color-surface");
  const A = (el: Element | null, kf: Keyframe[], o: KeyframeEffectOptions) =>
    el?.animate(kf, { fill: "both", easing: EASE, ...o });
  // The defence builds from the outside in, then the core appears.
  const STEP = 330;
  const T0 = 120;
  A(
    $(".ground"),
    [
      { opacity: 0, transform: "scale(.7)" },
      { opacity: 1, transform: "none" },
    ],
    {
      duration: 1400,
      delay: T0,
    },
  );
  for (let k = 0; k < 4; k++) {
    const s = T0 + k * STEP;
    const layer = $(`.layer[data-k="${k}"]`);
    if (!layer) continue;
    A(
      layer,
      [
        { opacity: 0, transform: "translateY(-110px)", filter: "blur(6px)" },
        {
          opacity: 1,
          transform: "translateY(6px)",
          filter: "blur(0px)",
          offset: 0.7,
        },
        { opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" },
      ],
      { duration: 820, delay: s, easing: "cubic-bezier(.3,.7,.2,1)" },
    );
    layer.querySelectorAll(".face [pathLength]").forEach((el, n) =>
      A(
        el,
        [
          { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 },
          { opacity: 1, offset: 0.1 },
          { strokeDasharray: 1, strokeDashoffset: 0, opacity: 1 },
        ],
        {
          duration: 650,
          delay: s + 480 + n * 18,
          easing: "cubic-bezier(.6,0,.2,1)",
        },
      ),
    );
    layer
      .querySelectorAll(".face > [stroke-dasharray], .face > circle.if")
      .forEach((el) =>
        A(el, [{ opacity: 0 }, { opacity: 1 }], {
          duration: 500,
          delay: s + 600,
        }),
      );
    layer.querySelectorAll(".lbl tspan").forEach((t, n) =>
      A(
        t,
        [
          { opacity: 0, fill: SURFACE },
          { opacity: 1, fill: BRIGHT, offset: 0.4 },
          { opacity: 1, fill: t.classList.contains("code") ? BRIGHT : NAVY },
        ],
        { duration: 380, delay: s + 620 + n * 34, easing: "linear" },
      ),
    );
  }
  const c0 = T0 + 4 * STEP + 120;
  A(
    $(".core"),
    [
      { opacity: 0, transform: "translateY(-60px)" },
      { opacity: 1, transform: "translateY(0px)" },
    ],
    {
      duration: 700,
      delay: c0,
      easing: "cubic-bezier(.3,.7,.2,1)",
    },
  );
  stage.querySelectorAll(".core-lines [pathLength]").forEach((el, n) =>
    A(
      el,
      [
        { strokeDasharray: 1, strokeDashoffset: 1 },
        { strokeDasharray: 1, strokeDashoffset: 0 },
      ],
      {
        duration: 700,
        delay: c0 + 200 + n * 40,
        easing: "cubic-bezier(.6,0,.2,1)",
      },
    ),
  );
  // The first full story, within 8 s of arrival (owner feedback).
  const { legit, threat, soc } = beats(ctx);
  // Beats are spaced so only one accent (core, identity edge, sweep) leads.
  legit(1500, 0.65);
  threat(3350);
  soc(6250, 1650);
}

function idle(ctx: SceneContext) {
  const { legit, threat, soc } = beats(ctx);
  let cycle = 0;
  const next = () => {
    if (cycle % 2 === 0) legit(300, 1.25);
    else threat(300);
    soc(4200, 2800);
    cycle++;
    ctx.later(next, 9000);
  };
  ctx.later(next, 400);
}

registerScene('[data-scene="security"]', { intro, idle });
