// Shared lifecycle for the service hero scenes (Cloud, Security, Software;
// see docs/design-proposals/service-hero-scenes). It mirrors the homepage
// stack (hero-stack.ts): the markup is the composed final state, the scene
// plays its intro once and then an idle loop, everything is WAAPI so one
// getAnimations() call pauses it off-screen and in a hidden tab, and reduced
// motion / Save-Data keep the still state. No pause control, by owner
// decision (2026-10-15). Timers handed out by the runtime pause with it.

export interface SceneContext {
  /** The scene root ([data-scene]). */
  root: HTMLElement;
  /** The layout being shown (desktop or mobile variant of the markup). */
  stage: HTMLElement;
  /** A theme colour token (e.g. "--color-navy") resolved for WAAPI. */
  token(name: string): string;
  /** setTimeout that pauses with the scene and is dropped on teardown. */
  later(fn: () => void, ms: number): void;
  /** Start the idle loop early (it still starts once at the latest after the intro). */
  startIdle(): void;
}

export interface SceneDefinition {
  /** Finite intro animations; the scene settles when they have all finished. */
  intro(ctx: SceneContext): void;
  /** Idle loop: infinite animations and/or runtime timers. Runs once per start. */
  idle(ctx: SceneContext): void;
}

/** Layout switch shared with scenes.css (desktop ↔ stacked markup). */
export const SCENE_MOBILE = "(max-width: 1100px)";

interface Timer {
  fn: () => void;
  remaining: number;
  start: number;
  id: number;
}

export function registerScene(selector: string, def: SceneDefinition) {
  let stop = () => {};

  function wire() {
    stop();
    stop = () => {};
    const root = document.querySelector<HTMLElement>(selector);
    if (!root) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const layoutQuery = matchMedia(SCENE_MOBILE);
    const saveData = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData;
    const timers = new Set<Timer>();
    let visible = true;
    let disposed = false;
    let started = false;
    let idleStarted = false;
    let generation = 0;
    let stage: HTMLElement = root;

    const allowed = () =>
      !disposed && !reduced.matches && !saveData && "animate" in root;
    const running = () => allowed() && visible && !document.hidden;
    const token = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    function arm(timer: Timer) {
      timer.start = performance.now();
      timer.id = window.setTimeout(
        () => {
          timers.delete(timer);
          timer.fn();
        },
        Math.max(0, timer.remaining),
      );
    }
    function pauseTimers() {
      timers.forEach((timer) => {
        if (!timer.id) return;
        clearTimeout(timer.id);
        timer.id = 0;
        timer.remaining -= performance.now() - timer.start;
      });
    }
    function clearTimers() {
      timers.forEach((timer) => clearTimeout(timer.id));
      timers.clear();
    }

    // Callbacks scheduled by an older run (before a reset) must not fire.
    const guard = (run: number, fn: () => void) => () => {
      if (!disposed && run === generation) fn();
    };

    const ctx: SceneContext = {
      root,
      get stage() {
        return stage;
      },
      token,
      later(fn, ms) {
        const timer: Timer = {
          fn: guard(generation, fn),
          remaining: ms,
          start: 0,
          id: 0,
        };
        timers.add(timer);
        if (running()) arm(timer);
      },
      startIdle,
    };

    function startIdle() {
      if (idleStarted || !started) return;
      idleStarted = true;
      def.idle(ctx);
      sync();
    }

    // Drop every animation and timer: the markup's CSS is the single source of
    // truth for the settled scene.
    function reset() {
      generation++;
      clearTimers();
      root!.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      started = false;
      idleStarted = false;
    }

    function still() {
      reset();
      root!.dataset.state = "static";
    }

    function begin() {
      started = true;
      // The visible layout variant (the other one is display:none).
      stage =
        [...root!.querySelectorAll<HTMLElement>("[data-scene-layout]")].find(
          (el) => getComputedStyle(el).display !== "none",
        ) ?? root!;
      root!.dataset.state = "intro";
      const run = generation;
      def.intro(ctx);
      const intro = stage
        .getAnimations({ subtree: true })
        .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity);
      // Named so a regression check can tell the intro from idle beats.
      intro.forEach((a) => (a.id = "scene-intro"));
      Promise.all(intro.map((a) => a.finished)).then(
        guard(run, () => {
          // Settle: filled intro animations would rewind on the next play(),
          // so drop them and let the CSS final state take over.
          intro.forEach((a) => a.cancel());
          root!.dataset.state = "idle";
          startIdle();
          sync();
        }),
        () => {},
      );
    }

    function sync() {
      if (disposed) return;
      if (!allowed()) {
        if (root!.dataset.state !== "static") still();
        return;
      }
      if (!started) begin();
      const animations = root!.getAnimations({ subtree: true });
      // Only touch animations in flight: play() on a finished one would rewind it.
      if (running()) {
        animations.forEach((a) => a.playState === "paused" && a.play());
        timers.forEach((timer) => !timer.id && arm(timer));
      } else {
        animations.forEach((a) => a.playState === "running" && a.pause());
        pauseTimers();
      }
    }

    // A different layout variant needs its own intro: restart on the new one.
    const relayout = () => {
      if (!started) return;
      reset();
      sync();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { threshold: 0.01 },
    );
    reduced.addEventListener("change", sync);
    layoutQuery.addEventListener("change", relayout);
    document.addEventListener("visibilitychange", sync);
    observer.observe(root);
    sync();

    stop = () => {
      disposed = true;
      generation++;
      observer.disconnect();
      clearTimers();
      reduced.removeEventListener("change", sync);
      layoutQuery.removeEventListener("change", relayout);
      document.removeEventListener("visibilitychange", sync);
      root.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    };
  }

  document.addEventListener("astro:page-load", wire);
  document.addEventListener("astro:before-swap", () => stop());
  window.addEventListener("pagehide", () => stop());
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) wire();
  });
}
