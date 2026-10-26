// Cloud hero timeline (CloudScene.astro), ported from
// artifacts/hero-previews/cloud.html. Intro (~8.3 s): 1 · data-centre floor and
// server towers, 2 · towers merge into the virtualisation platform, 3 · the
// hybrid cloud lands, a link of light connects and two VMs migrate, 4 · a DR
// replica slides out and syncs. Idle: a pulse round-trips the link, a blip
// syncs DR, one ring at a time, a slow camera drift (moving the whole scene,
// so connectors always stay attached to their slabs).
import { registerScene, type SceneContext } from "../scene-runtime";

const EASE = "cubic-bezier(.16,1,.3,1)";
const INOUT = "cubic-bezier(.55,0,.25,1)";
const CON = 2250;
const F = 8300;

type Frame = [number, Keyframe];

/** Absolute-time keyframes, held before and after. */
function K(
  el: Element | null | undefined,
  frames: Frame[],
  opts: KeyframeAnimationOptions = {},
) {
  if (!el) return;
  const t0 = frames[0][0];
  const t1 = frames[frames.length - 1][0];
  return el.animate(
    frames.map(([t, p]) => ({
      easing: EASE,
      ...p,
      offset: (t - t0) / (t1 - t0),
    })),
    { delay: t0, duration: t1 - t0, fill: "both", ...opts },
  );
}

function intro({ stage, token }: SceneContext) {
  const $ = <T extends Element = HTMLElement>(
    sel: string,
    root: ParentNode = stage,
  ) => root.querySelector<T>(sel);
  const $$ = <T extends Element = HTMLElement>(
    sel: string,
    root: ParentNode = stage,
  ) => [...root.querySelectorAll<T>(sel)];
  const BRIGHT = token("--color-bright");
  const SURFACE = token("--color-surface");
  const show = (el: Element | null, t: number, d = 450, to = 1) =>
    K(el, [
      [t, { opacity: 0 }],
      [t + d, { opacity: to }],
    ]);
  const draw = (els: Element[], t: number, step = 30) =>
    els.forEach((el, k) => {
      const d = t + k * step;
      const dashed = el.closest("[stroke-dasharray]");
      const strokeless = !/\b(i|h)\b/.test(el.getAttribute("class") ?? "");
      if (dashed || strokeless) {
        const o = Number(el.getAttribute("opacity") ?? 1);
        K(el, [
          [d + 150, { opacity: 0 }],
          [d + 650, { opacity: o }],
        ]);
        return;
      }
      el.setAttribute("pathLength", "1");
      K(el, [
        [
          d,
          {
            strokeDasharray: "1",
            strokeDashoffset: 1,
            opacity: 0,
            easing: INOUT,
          },
        ],
        [d + 50, { opacity: 1, easing: INOUT }],
        [d + 700, { strokeDasharray: "1", strokeDashoffset: 0, opacity: 1 }],
      ]);
    });
  const type = (slab: Element, t: number) =>
    $$(".tag tspan", slab).forEach((ts, k) =>
      K(ts, [
        [t + k * 28, { opacity: 0, fill: SURFACE, easing: "linear" }],
        [t + k * 28 + 170, { opacity: 1, fill: BRIGHT, easing: "linear" }],
        [t + k * 28 + 420, { opacity: 1 }],
      ]),
    );
  const sheen = (slab: Element, t: number) =>
    $(".sheen", slab)?.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(420%)" }],
      {
        duration: 1300,
        delay: t,
        easing: "cubic-bezier(.45,0,.2,1)",
        fill: "both",
        pseudoElement: "::before",
      },
    );
  const ring = (slab: Element, t: number, peak = 0.5) =>
    K($(".ring", slab), [
      [t, { opacity: 0, transform: "scale(1)" }],
      [t + 120, { opacity: peak, transform: "scale(1.01)" }],
      [t + 1100, { opacity: 0, transform: "scale(1.12)" }],
    ]);
  const glow = (slab: Element, t: number, d = 900) =>
    K($(".glow", slab), [
      [t, { opacity: 0, easing: "ease-out" }],
      [t + 350, { opacity: 0.7, easing: "ease-in-out" }],
      [t + d, { opacity: 0 }],
    ]);

  const floor = $('[data-slab="floor"]')!;
  const virt = $('[data-slab="virt"]')!;
  const cloud = $('[data-slab="cloud"]')!;
  const dr = $('[data-slab="dr"]')!;

  K($(".cam"), [
    [
      0,
      {
        transform: "translateY(10px) scale(1.035)",
        easing: "cubic-bezier(.33,0,.15,1)",
      },
    ],
    [F, { transform: "none" }],
  ]);
  K($(".ambient"), [
    [0, { opacity: 0.35, easing: "ease-in-out" }],
    [F - 1000, { opacity: 1 }],
  ]);

  // 1 · Data-centre floor, then scattered server towers.
  K(floor, [
    [150, { opacity: 0, transform: "translateY(-34px)", filter: "blur(8px)" }],
    [950, { opacity: 1, transform: "none", filter: "blur(0px)" }],
  ]);
  show($('[data-shadow="floor"]'), 300, 800);
  $$(".fp-s", floor).forEach((el, k) =>
    K(el, [
      [700 + k * 90, { opacity: 0 }],
      [1100 + k * 90, { opacity: 1 }],
      [CON + 250, { opacity: 1 }],
      [CON + 750, { opacity: 0 }],
    ]),
  );
  $$(".fp-d", floor).forEach((el) =>
    K(el, [
      [CON + 500, { opacity: 0 }],
      [CON + 1000, { opacity: 0.7 }],
    ]),
  );
  K($(".art", floor), [
    [CON + 600, { opacity: 1 }],
    [CON + 1400, { opacity: 0.5 }],
  ]);
  type(floor, 900);
  $$(".tower").forEach((el) => {
    const i = Number(el.dataset.tower);
    const k = Number(el.dataset.unit);
    const dx = Number(el.dataset.dx);
    const dy = Number(el.dataset.dy);
    const a = 420 + i * 170 + k * 110;
    const m = CON + i * 70 + k * 30;
    K(el, [
      [
        a,
        {
          opacity: 0,
          transform: "translateY(-26px)",
          filter: "blur(6px)",
          easing: "cubic-bezier(.3,.7,.2,1)",
        },
      ],
      [a + 520, { opacity: 1, transform: "none", filter: "blur(0px)" }],
      [m, { opacity: 1, transform: "none", easing: INOUT }],
      [
        m + 650,
        {
          opacity: 0.9,
          transform: `translate(${dx * 0.78}px, ${dy * 0.78}px) scale(.72)`,
          easing: "ease-in",
        },
      ],
      [
        m + 900,
        { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(.45)` },
      ],
    ]);
  });

  // 2 · Servers merge into one platform; VMs appear on it.
  K(virt, [
    [CON + 450, { opacity: 0, transform: "scale(.94)", filter: "blur(8px)" }],
    [CON + 1150, { opacity: 1, transform: "none", filter: "blur(0px)" }],
  ]);
  glow(virt, CON + 750, 1300);
  ring(virt, CON + 950);
  sheen(virt, CON + 900);
  draw($$(".frame", virt), CON + 1000);
  $$(".vm", virt).forEach((g, k) => {
    const t = CON + 1150 + k * 85;
    draw($$("rect, line", g), t, 40);
    if (g.classList.contains("moved")) {
      const leave = g.dataset.i === "1" ? 5550 : 5950;
      K(g, [
        [t, { opacity: 1 }],
        [leave, { opacity: 1 }],
        [leave + 200, { opacity: 0 }],
      ]);
    }
  });
  $$(".ph", virt).forEach((el) => {
    const t = el.dataset.i === "1" ? 5550 : 5950;
    K(el, [
      [t, { opacity: 0 }],
      [t + 400, { opacity: 1 }],
    ]);
  });
  type(virt, CON + 1250);

  // 3 · Hybrid cloud lands, a link of light connects, VMs migrate.
  K(cloud, [
    [
      4150,
      {
        opacity: 0,
        transform: "translateY(-80px)",
        filter: "blur(10px)",
        easing: "cubic-bezier(.3,.7,.2,1)",
      },
    ],
    [4850, { opacity: 1, transform: "translateY(4px)", filter: "blur(0px)" }],
    [5100, { transform: "none" }],
  ]);
  glow(cloud, 4550, 1000);
  ring(cloud, 4800);
  sheen(cloud, 4700);
  draw(
    $$(".art g > path, .art g > rect:not(.ph), .art g > line", cloud),
    4800,
    50,
  );
  $$(".ph", cloud).forEach((el) => {
    const t = el.dataset.j === "2" ? 6650 : 6950;
    K(el, [
      [5000, { opacity: 0 }],
      [5400, { opacity: 1 }],
      [t, { opacity: 1 }],
      [t + 250, { opacity: 0 }],
    ]);
  });
  $$(".cf", cloud).forEach((g) => {
    const t = g.dataset.j === "2" ? 6650 : 6950;
    K(g, [
      [t, { opacity: 0 }],
      [t + 300, { opacity: 1 }],
    ]);
  });
  type(cloud, 4950);
  for (const sel of [".link", ".link-glow"])
    K($(sel), [
      [5150, { strokeDasharray: "1", strokeDashoffset: 1, easing: INOUT }],
      [5650, { strokeDasharray: "1", strokeDashoffset: 0 }],
    ]);
  show($('[data-port="1"]'), 5100, 300);
  show($('[data-port="2"]'), 5550, 300);
  const travel = (el: Element | null, t: number, d: number) =>
    K(el, [
      [
        t,
        {
          opacity: 0,
          offsetDistance: "0%",
          transform: "scale(1)",
          easing: "linear",
        },
      ],
      [
        t + 120,
        {
          opacity: 1,
          offsetDistance: "3%",
          easing: "cubic-bezier(.45,0,.3,1)",
        },
      ],
      [
        t + d - 120,
        {
          opacity: 1,
          offsetDistance: "97%",
          transform: "scale(.66)",
          easing: "linear",
        },
      ],
      [t + d, { opacity: 0, offsetDistance: "100%", transform: "scale(.652)" }],
    ]);
  travel($('[data-mover="a"]'), 5550, 1150);
  travel($('[data-mover="b"]'), 5950, 1050);

  // 4 · A DR replica slides out on the ground, the sync line draws, tiles fill.
  K(dr, [
    [
      6500,
      { opacity: 0, transform: "translate(-34px, -17px)", filter: "blur(4px)" },
    ],
    [7200, { opacity: 0.8, transform: "none", filter: "blur(0px)" }],
  ]);
  show($('[data-shadow="dr"]'), 6600, 700, 0.7);
  draw($$(".frame, .ph", dr), 6900, 20);
  type(dr, 7000);
  K($(".sync-mask"), [
    [7050, { strokeDasharray: "1", strokeDashoffset: 1, easing: INOUT }],
    [7500, { strokeDasharray: "1", strokeDashoffset: 0 }],
  ]);
  show($('[data-port="3"]'), 7000, 300);
  show($('[data-port="4"]'), 7450, 300);
  K($('[data-pulse="blip"]'), [
    [7100, { opacity: 0, offsetDistance: "0%", easing: "linear" }],
    [7180, { opacity: 1, easing: "ease-in-out" }],
    [7650, { opacity: 1, offsetDistance: "100%" }],
    [7750, { opacity: 0, offsetDistance: "100%" }],
  ]);
  $$(".df", dr).forEach((g, k) =>
    K(g, [
      [7550 + k * 75, { opacity: 0 }],
      [7550 + k * 75 + 300, { opacity: 1 }],
    ]),
  );
  ring(dr, 7500, 0.35);
}

// Idle loop: one cycle, one accent at a time.
function idle({ stage }: SceneContext) {
  const $ = (sel: string) => stage.querySelector(sel);
  const C = 4400;
  const loop = (
    el: Element | null,
    frames: Keyframe[],
    o: KeyframeAnimationOptions = {},
  ) => el?.animate(frames, { duration: C, iterations: Infinity, ...o });
  const pulse = "cubic-bezier(.45,0,.3,1)";
  loop($('[data-pulse="link"]'), [
    { opacity: 0, offsetDistance: "0%" },
    { opacity: 1, offsetDistance: "2%", offset: 0.02, easing: pulse },
    { opacity: 1, offsetDistance: "98%", offset: 0.27 },
    { opacity: 0, offsetDistance: "100%", offset: 0.3 },
    { opacity: 0, offsetDistance: "100%", offset: 0.62 },
    { opacity: 1, offsetDistance: "98%", offset: 0.64, easing: pulse },
    { opacity: 1, offsetDistance: "2%", offset: 0.89 },
    { opacity: 0, offsetDistance: "0%", offset: 0.92 },
    { opacity: 0, offsetDistance: "0%" },
  ]);
  loop($('[data-pulse="blip"]'), [
    { opacity: 0, offsetDistance: "0%" },
    { opacity: 0, offsetDistance: "0%", offset: 0.34 },
    { opacity: 1, offsetDistance: "3%", offset: 0.36, easing: "ease-in-out" },
    { opacity: 1, offsetDistance: "97%", offset: 0.53 },
    { opacity: 0, offsetDistance: "100%", offset: 0.55 },
    { opacity: 0, offsetDistance: "100%" },
  ]);
  const cloud = $('[data-slab="cloud"]');
  const dr = $('[data-slab="dr"]');
  const virt = $('[data-slab="virt"]');
  loop(cloud?.querySelector(".ring") ?? null, [
    { opacity: 0 },
    { opacity: 0, offset: 0.26 },
    { opacity: 0.4, offset: 0.29 },
    { opacity: 0, offset: 0.4 },
    { opacity: 0 },
  ]);
  loop(dr?.querySelector(".ring") ?? null, [
    { opacity: 0 },
    { opacity: 0, offset: 0.52 },
    { opacity: 0.3, offset: 0.55 },
    { opacity: 0, offset: 0.66 },
    { opacity: 0 },
  ]);
  loop(virt?.querySelector(".ring") ?? null, [
    { opacity: 0 },
    { opacity: 0, offset: 0.88 },
    { opacity: 0.3, offset: 0.91 },
    { opacity: 0 },
  ]);
  // Replicated tiles re-confirm in sequence as the blip lands.
  dr?.querySelectorAll(".df rect.if").forEach((el, k) =>
    loop(el, [
      { fillOpacity: 0.06 },
      { fillOpacity: 0.06, offset: 0.54 + k * 0.012 },
      { fillOpacity: 0.24, offset: 0.56 + k * 0.012 },
      { fillOpacity: 0.06, offset: 0.66 + k * 0.012 },
      { fillOpacity: 0.06 },
    ]),
  );
  $(".sync")?.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -18 }], {
    duration: 1400,
    iterations: Infinity,
  });
  stage.querySelectorAll(".frame").forEach((el) =>
    el.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -16 }], {
      duration: 2400,
      iterations: Infinity,
    }),
  );
  $(".cam")?.animate(
    [{ transform: "translateY(0)" }, { transform: "translateY(-4px)" }],
    {
      duration: 4300,
      iterations: Infinity,
      direction: "alternate",
      easing: "ease-in-out",
    },
  );
}

registerScene('[data-scene="cloud"]', { intro, idle });
