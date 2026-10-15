export {};

// Homepage hero stack (HeroStack.astro). The markup is the final state; this
// plays the build-up intro once per visit, then an idle loop (breathing
// layers, flowing dashes, a scan climbing the stack). Everything is WAAPI so
// one getAnimations() call pauses it off-screen and in a hidden tab. Reduced
// motion / Save-Data keep the still state. No pause control, by owner decision
// (2026-10-15; see docs/design-proposals/homepage-hero-stack).

const STEP = 1500;
const T0 = 500;
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
let stop = () => {};

type Frames = Keyframe[];

function wireHeroStack() {
  stop();
  stop = () => {};
  const root = document.querySelector<HTMLElement>("[data-hero-stack]");
  if (!root) return;
  const $ = <T extends Element = HTMLElement>(sel: string) =>
    root.querySelector<T>(sel)!;
  const $$ = <T extends Element = HTMLElement>(sel: string) => [
    ...root.querySelectorAll<T>(sel),
  ];
  const slabs = $$(".hs-slab");
  const token = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const NAVY = token("--color-navy");
  const BRIGHT = token("--color-bright");
  const SURFACE = token("--color-surface");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const saveData = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection?.saveData;

  let visible = true;
  let disposed = false;
  let started = false;
  let idle = false;
  let scanTimer = 0;
  let scanIndex = 0;

  const allowed = () =>
    !disposed && !reduced.matches && !saveData && "animate" in root;
  const running = () => allowed() && visible && !document.hidden;
  const animate = (
    el: Element | null,
    frames: Frames,
    options: KeyframeAnimationOptions,
  ) => el?.animate(frames, { fill: "forwards", easing: EASE_OUT, ...options });
  const hold = { fill: "both" } as const;

  // Drop every animation and intro-only inline style: the markup's CSS is the
  // single source of truth for the settled scene.
  function reset() {
    root!.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    clearTimeout(scanTimer);
    scanTimer = 0;
    $$<SVGElement>(".hs-art *").forEach((el) => {
      el.removeAttribute("pathLength");
      el.style.strokeDasharray = "";
      el.style.strokeDashoffset = "";
      el.style.opacity = "";
      delete el.dataset.draw;
    });
    $$(".hs-art").forEach((el) => (el.style.opacity = ""));
  }

  function still() {
    reset();
    root!.dataset.state = "static";
    started = false;
    idle = false;
  }

  function intro() {
    root!.dataset.state = "intro";
    // Drawings start hidden and trace themselves; dashed strokes fade in.
    $$<SVGGeometryElement>(".hs-art g *").forEach((el) => {
      if (el.tagName === "g") return;
      if (el.closest("[stroke-dasharray]")) {
        el.style.opacity = "0";
        el.dataset.draw = "fade";
        return;
      }
      el.setAttribute("pathLength", "1");
      el.style.strokeDasharray = "1";
      el.style.strokeDashoffset = "1";
      el.style.opacity = "0";
      el.dataset.draw = /hs-(hf|if)/.test(el.getAttribute("class") ?? "")
        ? "fade"
        : "line";
    });
    $$(".hs-art").forEach((el) => (el.style.opacity = "1"));
    const total = T0 + 4 * STEP + 1400;
    animate($(".hs-ambient"), [{ opacity: 0 }, { opacity: 1 }], {
      ...hold,
      duration: total,
      easing: "ease-in-out",
    });
    animate(
      $(".hs-camera"),
      [
        { transform: "translate(-30px, 46px) scale(1.16) rotate(-2.2deg)" },
        { transform: "none" },
      ],
      {
        ...hold,
        duration: total + 600,
        easing: "cubic-bezier(0.33, 0, 0.15, 1)",
      },
    );
    animate(
      $(".hs-shadow"),
      [
        { opacity: 0, transform: "scale(0.6)" },
        { opacity: 1, transform: "none" },
      ],
      { ...hold, duration: 1200, delay: T0 + 300 },
    );
    let last: Animation | undefined;
    slabs.forEach((slab, n) => {
      const s = T0 + n * STEP;
      animate(
        slab,
        [
          { opacity: 0, transform: "translateY(-150px)", filter: "blur(10px)" },
          {
            opacity: 1,
            transform: "translateY(7px)",
            filter: "blur(0)",
            offset: 0.72,
          },
          { opacity: 1, transform: "translateY(0)", filter: "none" },
        ],
        {
          ...hold,
          duration: 1000,
          delay: s,
          easing: "cubic-bezier(0.3, 0.7, 0.2, 1)",
        },
      );
      // The glow is a sibling layer, not a filter on the slab, so the slab
      // never becomes a backdrop root and the frost keeps blurring what's below.
      animate(slab.querySelector(".hs-glow"), [{ opacity: 0 }, { opacity: 1 }], {
        ...hold,
        duration: 600,
        delay: s + 700,
      });
      slab.querySelector(".hs-ring")?.animate(
        [
          { opacity: 0, transform: "scale(1)" },
          { opacity: 0.55, transform: "scale(1.01)", offset: 0.1 },
          { opacity: 0, transform: "scale(1.16)" },
        ],
        { duration: 1200, delay: s + 720, easing: EASE_OUT },
      );
      slab
        .querySelector(".hs-sheen")
        ?.animate(
          [{ transform: "translateX(0)" }, { transform: "translateX(420%)" }],
          {
            duration: 1300,
            delay: s + 650,
            easing: "cubic-bezier(0.45, 0, 0.2, 1)",
            pseudoElement: "::before",
          },
        );
      slab
        .querySelectorAll<SVGElement>(".hs-art [data-draw]")
        .forEach((el, k) => {
          const d = s + 780 + k * 22;
          if (el.dataset.draw === "line")
            animate(
              el,
              [
                { strokeDashoffset: 1, opacity: 0 },
                { opacity: 1, offset: 0.08 },
                { strokeDashoffset: 0, opacity: 1 },
              ],
              {
                ...hold,
                duration: 750,
                delay: d,
                easing: "cubic-bezier(0.6, 0, 0.2, 1)",
              },
            );
          else
            animate(el, [{ opacity: 0 }, { opacity: 1 }], {
              ...hold,
              duration: 500,
              delay: d + 200,
            });
        });
      slab.querySelectorAll(".hs-tag tspan").forEach((t, k) => {
        last = animate(
          t,
          [
            { opacity: 0, fill: SURFACE },
            { opacity: 1, fill: BRIGHT, offset: 0.4 },
            { opacity: 1 },
          ],
          { ...hold, duration: 420, delay: s + 950 + k * 26, easing: "linear" },
        );
      });
      if (n > 0) {
        packet(4 - n, 3 - n, s + 600, 650);
        const prev = slabs[n - 1];
        animate(prev.querySelector(".hs-glow"), [{ opacity: 1 }, { opacity: 0 }], {
          duration: 900,
          delay: s + 700,
        });
        animate(
          prev.querySelector(".hs-art"),
          [{ opacity: 1 }, { opacity: 0.36 }],
          {
            duration: 900,
            delay: s + 700,
          },
        );
      }
    });
    last?.finished.then(
      () => {
        if (disposed || root!.dataset.state !== "intro") return;
        // Settle: filled intro animations would rewind on the next play(),
        // so drop them and let the CSS final state take over.
        reset();
        startIdle();
      },
      () => {},
    );
  }

  function packet(
    fromTop: number,
    toTop: number,
    delay: number,
    duration: number,
  ) {
    const y = (top: number) =>
      `calc(${top} * var(--hs-gap) + var(--hs-h) * 0.476 - 7px)`;
    $(".hs-packet").animate(
      [
        { opacity: 0, top: y(fromTop) },
        { opacity: 1, offset: 0.22 },
        { opacity: 1, offset: 0.78 },
        { opacity: 0, top: y(toTop) },
      ],
      { duration, delay, easing: "cubic-bezier(0.5, 0, 0.3, 1)" },
    );
  }

  function startIdle() {
    idle = true;
    root!.dataset.state = "idle";
    slabs.forEach((slab, n) =>
      slab.animate(
        [
          { transform: "translateY(0)" },
          { transform: `translateY(${-(2 + n * 3)}px)` },
        ],
        {
          duration: 2600 + n * 380,
          iterations: Infinity,
          direction: "alternate",
          easing: "ease-in-out",
          composite: "add",
        },
      ),
    );
    $$(".hs-art [stroke-dasharray], .hs-art [stroke-dasharray] *").forEach(
      (el) =>
        el.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -21 }], {
          duration: 1400,
          iterations: Infinity,
          easing: "linear",
        }),
    );
    $$(".hs-particle").forEach((p, k) =>
      p.animate(
        [
          { opacity: 0, transform: "translateY(0)" },
          { opacity: 0.8, offset: 0.3 },
          { opacity: 0, transform: "translateY(-90px)" },
        ],
        {
          duration: 4200 + k * 260,
          delay: 300 + k * 330,
          iterations: Infinity,
          easing: "ease-out",
        },
      ),
    );
    scheduleScan(700);
  }

  function scheduleScan(delay: number) {
    clearTimeout(scanTimer);
    scanTimer = window.setTimeout(scan, delay);
  }

  // One layer lights up — edge, drawing, label, sheen — and hands a packet up.
  function scan() {
    scanTimer = 0;
    if (!running()) return;
    const n = scanIndex++ % 4;
    const slab = slabs[n];
    const o = { duration: 1700, easing: "ease-in-out" };
    const dim = n === 3 ? 1 : 0.36;
    slab
      .querySelector(".hs-edge")
      ?.animate([{ opacity: 0 }, { opacity: 0.7 }, { opacity: 0 }], o);
    slab
      .querySelector(".hs-art")
      ?.animate([{ opacity: dim }, { opacity: 1 }, { opacity: dim }], o);
    slab
      .querySelectorAll(".hs-tag tspan:not(.hs-code)")
      .forEach((t) =>
        t.animate(
          [{ fill: NAVY }, { fill: BRIGHT }, { fill: NAVY }],
          o,
        ),
      );
    slab
      .querySelector(".hs-sheen")
      ?.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(420%)" }],
        {
          duration: 1500,
          easing: "cubic-bezier(0.45, 0, 0.2, 1)",
          pseudoElement: "::before",
        },
      );
    if (n < 3) packet(3 - n, 2 - n, 700, 900);
    scheduleScan(n === 3 ? 2600 : 1250);
  }

  function sync() {
    if (disposed) return;
    if (!allowed()) {
      still();
      return;
    }
    if (!started) {
      started = true;
      intro();
    }
    const animations = root!.getAnimations({ subtree: true });
    // Only touch animations in flight: play() on a finished one would rewind it.
    if (running()) {
      animations.forEach((a) => a.playState === "paused" && a.play());
      if (idle && !scanTimer) scheduleScan(400);
    } else {
      animations.forEach((a) => a.playState === "running" && a.pause());
      clearTimeout(scanTimer);
      scanTimer = 0;
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      sync();
    },
    { threshold: 0.01 },
  );
  reduced.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  observer.observe(root);
  sync();

  stop = () => {
    disposed = true;
    observer.disconnect();
    clearTimeout(scanTimer);
    reduced.removeEventListener("change", sync);
    document.removeEventListener("visibilitychange", sync);
    root.getAnimations({ subtree: true }).forEach((a) => a.cancel());
  };
}

document.addEventListener("astro:page-load", wireHeroStack);
document.addEventListener("astro:before-swap", () => stop());
window.addEventListener("pagehide", () => stop());
window.addEventListener("pageshow", (event) => {
  if (event.persisted) wireHeroStack();
});
