// Software hero timeline (SoftwareScene.astro), ported from
// artifacts/hero-previews/software.html. Intro: the rail draws, stations land
// and trace their line-art, production gets its servers and bars. From 1.5 s
// the release cycle loops (10 s): a chip travels the rail, each station checks
// it (code written, gear turns, tests ticked, security scan), it lifts into
// the production app window with one soft landing glow and the dashboard rises.
import { registerScene, type SceneContext } from "../scene-runtime";
import {
  BAR_H,
  add,
  softwareLayout,
  type SoftwareLayoutKind,
} from "../../components/scenes/software-scene";
import type { Point } from "../../components/scenes/slab";

const OUT = "cubic-bezier(.16,1,.3,1)";
const INOUT = "cubic-bezier(.45,0,.2,1)";
const P_CYCLE = 10000;
const C0 = 1500; // the first release starts while the last stations settle
const CY = {
  spawn: [0, 450],
  ticks: [560, 1820, 2980, 4260, 5980],
  moves: [
    [800, 1250],
    [2000, 2450],
    [3150, 3600],
    [4450, 4900],
  ],
  lift: [4980, 5300, 5620],
  absorb: [5620, 5880],
  gear: [1250, 1950],
  prog: [1280, 1860],
  rows: [2500, 2650, 2800],
  scan: [3620, 4320],
  active: [
    [0, 800],
    [1250, 2000],
    [2450, 3150],
    [3600, 4450],
    [4900, 6300],
  ],
  bars: [5700, 6400],
  reset: [9450, 10000],
};
const BAR_BASE = 0.8; // idle bar level as a share of full
const f = (n: number) => +n.toFixed(2);
const tr = (p: Point, s = 1) =>
  `translate(${f(p[0])}px, ${f(p[1])}px) scale(${s})`;

let cycleDelay = 0;
const layoutOf = (stage: HTMLElement) =>
  softwareLayout(
    (stage.dataset.sceneLayout ?? "desktop") as SoftwareLayoutKind,
  );

function intro(ctx: SceneContext) {
  const { stage, root } = ctx;
  const $ = (s: string, r: ParentNode = stage) =>
    r.querySelector<SVGElement>(s);
  const $$ = (s: string, r: ParentNode = stage) => [
    ...r.querySelectorAll<SVGElement>(s),
  ];
  const A = (el: Element | null, kf: Keyframe[], o: KeyframeEffectOptions) =>
    el?.animate(kf, { fill: "both", easing: OUT, ...o });

  A(root.querySelector(".ambient"), [{ opacity: 0 }, { opacity: 1 }], {
    duration: 2600,
    easing: "ease-in-out",
  });
  A(
    $(".camera"),
    [
      { transform: "translate(-10px, 14px) scale(1.035)" },
      { transform: "none" },
    ],
    {
      duration: 4200,
      easing: "cubic-bezier(.33,0,.15,1)",
    },
  );
  // The rail draws itself first, stops appear as it passes.
  $$(".rail-line").forEach((l) =>
    A(
      l,
      [
        { strokeDasharray: "1 1", strokeDashoffset: 1 },
        { strokeDasharray: "1 1", strokeDashoffset: 0 },
      ],
      {
        duration: 1500,
        delay: 150,
        easing: "cubic-bezier(.6,0,.2,1)",
      },
    ),
  );
  const land: number[] = [];
  $$(".st").forEach((st, i) => {
    const d = 120 + i * 190;
    land[i] = d + 560;
    A(
      st,
      [
        { opacity: 0, transform: "translateY(-48px)" },
        { opacity: 1, transform: "translateY(3px)", offset: 0.74 },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 780, delay: d, easing: "cubic-bezier(.3,.7,.2,1)" },
    );
    A($(`.shadow[data-i="${i}"]`), [{ opacity: 0 }, { opacity: 1 }], {
      duration: 700,
      delay: d + 300,
      easing: "ease-out",
    });
    A($(`.rail-stop[data-i="${i}"]`), [{ opacity: 0 }, { opacity: 1 }], {
      duration: 400,
      delay: 300 + i * 260,
    });
    const drawing = st.querySelector(":scope > g");
    if (drawing)
      $$(".art > *, .art .gear > *", drawing).forEach((el, k) => {
        if (el.matches(".dyn, clipPath, g") || el.closest(".dyn")) return;
        const dl = land[i] + 40 + k * 16;
        if (el.matches(".hf, .if") || el.hasAttribute("stroke-dasharray"))
          A(el, [{ opacity: 0 }, { opacity: 1 }], {
            duration: 450,
            delay: dl + 220,
          });
        else {
          el.setAttribute("pathLength", "1");
          A(
            el,
            [
              { strokeDasharray: "1 1", strokeDashoffset: 1, opacity: 0 },
              { opacity: 1, offset: 0.06 },
              { strokeDasharray: "1 1", strokeDashoffset: 0, opacity: 1 },
            ],
            { duration: 640, delay: dl, easing: "cubic-bezier(.6,0,.2,1)" },
          );
        }
      });
    $$(".tag tspan", st).forEach((t, k) =>
      A(t, [{ opacity: 0 }, { opacity: 1 }], {
        duration: 240,
        delay: land[i] + 260 + k * 30,
        easing: "linear",
      }),
    );
  });
  // Production extras: servers stack up, bars rise from the face.
  $$(".mini").forEach((m, n) => {
    A(
      m,
      [
        { opacity: 0, transform: "translateY(-34px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 620,
        delay: land[4] + 80 + n * 150,
        easing: "cubic-bezier(.3,.7,.2,1)",
      },
    );
    $$(".art > *", m).forEach((el, k) => {
      if (el.matches(".hf, .if"))
        A(el, [{ opacity: 0 }, { opacity: 1 }], {
          duration: 400,
          delay: land[4] + 400 + n * 150 + k * 20,
        });
      else {
        el.setAttribute("pathLength", "1");
        A(
          el,
          [
            { strokeDasharray: "1 1", strokeDashoffset: 1 },
            { strokeDasharray: "1 1", strokeDashoffset: 0 },
          ],
          {
            duration: 500,
            delay: land[4] + 360 + n * 150 + k * 20,
          },
        );
      }
    });
  });
  $$(".bar3d").forEach((g, b) =>
    A(g, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 500,
      delay: land[4] + 500 + b * 90,
    }),
  );
  // The app window stays empty until the first release lands.
  A($(".slot-fill"), [{ opacity: 0 }, { opacity: 1 }], {
    duration: 400,
    delay: C0 + CY.absorb[0],
    easing: "ease-out",
  });
  // The release cycle starts while the last stations settle.
  cycleDelay = C0;
  ctx.startIdle();
}

function idle({ stage, token }: SceneContext) {
  const delay = cycleDelay;
  cycleDelay = 0;
  const L = layoutOf(stage);
  const $ = (s: string, r: ParentNode = stage) =>
    r.querySelector<SVGElement>(s);
  const $$ = (s: string, r: ParentNode = stage) => [
    ...r.querySelectorAll<SVGElement>(s),
  ];
  const NAVY = token("--color-navy");
  const BRIGHT = token("--color-bright");
  const SURFACE = token("--color-surface");
  const BORDER = token("--color-border-blue");
  type Frame = [number, Keyframe, string?];
  // A looping animation on the release cycle; frames are [ms, props, easing?].
  function cyc(el: Element | null, frames: Frame[]) {
    if (!el) return;
    const fr = frames.slice().sort((a, b) => a[0] - b[0]);
    if (fr[0][0] > 0) fr.unshift([0, fr[0][1]]);
    if (fr[fr.length - 1][0] < P_CYCLE)
      fr.push([P_CYCLE, fr[fr.length - 1][1]]);
    return el.animate(
      fr.map(([t, p, e]) => ({
        offset: t / P_CYCLE,
        ...p,
        easing: e ?? "linear",
      })),
      { duration: P_CYCLE, delay, iterations: Infinity, fill: "both" },
    );
  }
  const T = CY;
  const { RP, slotC, liftMid, D } = L;
  const C = (i: number) => add(RP[i], [0, -3]);
  const chip = $(".chip");
  cyc(chip, [
    [0, { transform: tr(C(0), 0.55), opacity: 0 }, OUT],
    [T.spawn[1], { transform: tr(C(0)), opacity: 1 }],
    ...T.moves.flatMap(([a, b], i): Frame[] => [
      [a, { transform: tr(C(i)), opacity: 1 }, INOUT],
      [b, { transform: tr(C(i + 1)), opacity: 1 }],
    ]),
    [T.lift[0], { transform: tr(C(4)), opacity: 1 }, "cubic-bezier(.3,0,.4,1)"],
    [
      T.lift[1],
      { transform: tr(liftMid, 0.9), opacity: 1 },
      "cubic-bezier(.3,0,.2,1)",
    ],
    [T.lift[2], { transform: tr(slotC, 0.62), opacity: 1 }, "ease-in"],
    [T.absorb[1], { transform: tr(slotC, 0.56), opacity: 0 }],
  ]);
  // The chip's glow is the one glow while it travels; it hands over to the
  // landing glow on the production window.
  cyc($(".chip-glow"), [
    [0, { opacity: 0 }],
    [T.spawn[1], { opacity: 0.75 }],
    [T.scan[0] - 60, { opacity: 0.75 }],
    [T.scan[0] + 140, { opacity: 0 }],
    [T.scan[1] - 80, { opacity: 0 }],
    [T.scan[1] + 120, { opacity: 0.75 }],
    [T.lift[2], { opacity: 0.4 }],
    [T.absorb[0], { opacity: 0 }],
  ]);
  cyc($(".land-glow"), [
    [0, { opacity: 0 }],
    [T.absorb[0], { opacity: 0 }, "ease-out"],
    [T.absorb[0] + 260, { opacity: 0.85 }, "ease-in-out"],
    [T.absorb[0] + 1500, { opacity: 0 }],
  ]);

  // The trail along the rail follows the chip, then clears for the next release.
  const total = Math.hypot(RP[4][0] - RP[0][0], RP[4][1] - RP[0][1]);
  const frac = (i: number) =>
    Math.hypot(RP[i][0] - RP[0][0], RP[i][1] - RP[0][1]) / total;
  cyc($(".trail"), [
    [0, { strokeDasharray: "1 1", strokeDashoffset: 1, opacity: 0.85 }],
    ...T.moves.flatMap(([a, b], i): Frame[] => [
      [
        a,
        {
          strokeDasharray: "1 1",
          strokeDashoffset: 1 - frac(i),
          opacity: 0.85,
        },
        INOUT,
      ],
      [
        b,
        {
          strokeDasharray: "1 1",
          strokeDashoffset: 1 - frac(i + 1),
          opacity: 0.85,
        },
      ],
    ]),
    [
      T.reset[0],
      { strokeDasharray: "1 1", strokeDashoffset: 0, opacity: 0.85 },
    ],
    [T.reset[1], { strokeDasharray: "1 1", strokeDashoffset: 0, opacity: 0 }],
  ]);

  // Each station: the label lights while the release is there, the check is
  // etched in, then everything resets for the next release.
  $$(".st").forEach((st, i) => {
    const [a, b] = T.active[i];
    cyc($(".tag text", st), [
      [0, { fill: NAVY }],
      [a, { fill: NAVY }],
      [a + 250, { fill: BRIGHT }],
      [b, { fill: BRIGHT }],
      [b + 500, { fill: NAVY }],
    ]);
    const undrawn = { strokeDasharray: "1 1", strokeDashoffset: 1, opacity: 1 };
    const drawn = { strokeDasharray: "1 1", strokeDashoffset: 0, opacity: 1 };
    cyc($(".tick-on", st), [
      [0, undrawn],
      [T.ticks[i], undrawn, OUT],
      [T.ticks[i] + 380, drawn],
      [T.reset[0], drawn],
      [T.reset[1], { ...drawn, opacity: 0 }],
    ]);
    cyc($(".tick-bg", st), [
      [0, { opacity: 0 }],
      [T.ticks[i] + 120, { opacity: 0 }, OUT],
      [T.ticks[i] + 420, { opacity: 1 }],
      [T.reset[0], { opacity: 1 }],
      [T.reset[1], { opacity: 0 }],
    ]);
    cyc($(`.rail-stop[data-i="${i}"]`), [
      [0, { fill: SURFACE }],
      [a, { fill: SURFACE }],
      [a + 200, { fill: BORDER }],
      [b, { fill: BORDER }],
      [b + 400, { fill: SURFACE }],
    ]);
  });

  // Code: lines are written (a bright pass runs down the editor).
  $$('.st[data-i="0"] .cl').forEach((l, j) => {
    let dup = l.nextElementSibling as SVGElement | null;
    if (!dup?.classList.contains("cl-pass")) {
      dup = l.cloneNode() as SVGElement;
      dup.setAttribute("class", "h bold cl-pass");
      l.after(dup);
    }
    cyc(dup, [
      [0, { opacity: 0 }],
      [60 + j * 90, { opacity: 0 }, "ease-out"],
      [200 + j * 90, { opacity: 1 }],
      [520 + j * 90, { opacity: 1 }, "ease-in"],
      [900 + j * 90, { opacity: 0 }],
    ]);
  });
  // Build: the gear turns one tooth, the compile bar fills.
  cyc($(".gear"), [
    [0, { transform: "rotate(0deg)" }],
    [T.gear[0], { transform: "rotate(0deg)" }, INOUT],
    [T.gear[1], { transform: "rotate(45deg)" }],
  ]);
  cyc($(".prog"), [
    [0, { transform: "scaleX(0)", opacity: 1 }],
    [
      T.prog[0],
      { transform: "scaleX(0)", opacity: 1 },
      "cubic-bezier(.4,0,.3,1)",
    ],
    [T.prog[1], { transform: "scaleX(1)", opacity: 1 }],
    [T.reset[0], { transform: "scaleX(1)", opacity: 1 }],
    [T.reset[1], { transform: "scaleX(1)", opacity: 0 }],
  ]);
  // Test: the checklist is ticked row by row.
  $$(".row-tick").forEach((el, r) => {
    const t = T.rows[Math.min(r, 2)] + (r === 3 ? 150 : 0);
    const undrawn = { strokeDasharray: "1 1", strokeDashoffset: 1, opacity: 1 };
    const drawn = { strokeDasharray: "1 1", strokeDashoffset: 0, opacity: 1 };
    cyc(el, [
      [0, undrawn],
      [t, undrawn, OUT],
      [t + 260, drawn],
      [T.reset[0], drawn],
      [T.reset[1], { ...drawn, opacity: 0 }],
    ]);
  });
  // Security: a scan line crosses the shield and a curtain of light crosses the release.
  const [s0, s1] = T.scan;
  const sm = (s0 + s1) / 2;
  cyc($(".scan"), [
    [0, { transform: "translateY(0px)", opacity: 0 }],
    [s0, { transform: "translateY(0px)", opacity: 1 }, INOUT],
    [sm, { transform: "translateY(164px)", opacity: 1 }, INOUT],
    [s1, { transform: "translateY(0px)", opacity: 1 }],
    [s1 + 150, { transform: "translateY(0px)", opacity: 0 }],
  ]);
  const bp = (d: number) => tr(add(C(3), D, d));
  cyc($(".beam"), [
    [0, { transform: bp(-34), opacity: 0 }],
    [s0 - 120, { transform: bp(-34), opacity: 0 }],
    [s0, { transform: bp(-34), opacity: 1 }, INOUT],
    [sm, { transform: bp(34), opacity: 1 }, INOUT],
    [s1, { transform: bp(-34), opacity: 1 }],
    [s1 + 160, { transform: bp(-34), opacity: 0 }],
  ]);
  // Production: the release settles into the app window, the dashboard rises.
  cyc($(".slot-flash"), [
    [0, { opacity: 0 }],
    [T.absorb[0], { opacity: 0 }, "ease-out"],
    [T.absorb[0] + 200, { opacity: 1 }],
    [T.absorb[0] + 900, { opacity: 0 }],
  ]);
  $$(".bar3d").forEach((g, b) => {
    const H = BAR_H[b];
    const lvl = (s: number) => ({
      grow: { transform: `scaleY(${s})` },
      top: { transform: `translateY(${f(H * (1 - s))}px)` },
    });
    const t0 = T.bars[0] + b * 120;
    const t1 = T.bars[1] + b * 120;
    (["grow", "top"] as const).forEach((part) => {
      const els = part === "grow" ? $$(".grow", g) : [$(".tf", g)];
      els.forEach((el) =>
        cyc(el, [
          [0, lvl(BAR_BASE)[part]],
          [t0, lvl(BAR_BASE)[part], "cubic-bezier(.2,.8,.2,1)"],
          [t1, lvl(1)[part]],
          [t1 + 700, lvl(1)[part], "cubic-bezier(.5,0,.5,1)"],
          [P_CYCLE, lvl(BAR_BASE)[part]],
        ]),
      );
    });
  });
  $$(".mini .led").forEach((led, n) =>
    cyc(led, [
      [0, { opacity: 1 }],
      [T.ticks[4] - 200 + n * 90, { opacity: 1 }],
      [T.ticks[4] - 60 + n * 90, { opacity: 0.2 }],
      [T.ticks[4] + 120 + n * 90, { opacity: 1 }],
    ]),
  );
}

registerScene('[data-scene="software"]', { intro, idle });
