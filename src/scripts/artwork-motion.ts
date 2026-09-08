export {};

type ArtworkState = {
  root: HTMLElement;
  layer: HTMLElement;
  button: HTMLButtonElement;
  visible: boolean;
  animation: Animation | null;
};

const storageKey = "smartcontrol-artwork-paused";
let pausedPreference = false;
let stop = () => {};

function readPreference() {
  try {
    pausedPreference = sessionStorage.getItem(storageKey) === "true";
  } catch {
    // Keep the in-memory preference when storage is unavailable.
  }
  return pausedPreference;
}

const profiles: Record<string, { x: number; y: number; duration: number }> = {
  "architecture-light": { x: -3, y: -4, duration: 15000 },
  "network-security": { x: -4, y: 2, duration: 13000 },
  "software-automation": { x: -3, y: -3, duration: 14000 },
  "managed-services": { x: 2, y: -4, duration: 17000 },
  "seknet-observability": { x: -2, y: -3, duration: 15000 },
  "svpn-connection": { x: -4, y: 1, duration: 14000 },
};

function wireArtworkMotion() {
  stop();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let userPaused = readPreference();
  const states: ArtworkState[] = [];
  const unbind: Array<() => void> = [];

  function update(state: ArtworkState) {
    const { root, layer, button } = state;
    button.hidden = reduced.matches;
    button.setAttribute("aria-pressed", String(userPaused));
    const label = userPaused
      ? button.dataset.labelResume
      : button.dataset.labelPause;
    button.setAttribute("aria-label", label ?? "Pause animation");
    button.title = label ?? "Pause animation";

    if (reduced.matches) {
      state.animation?.cancel();
      state.animation = null;
      root.dataset.artworkState = "static";
      return;
    }

    const running = state.visible && !document.hidden && !userPaused;
    if (running) {
      if (!state.animation) {
        const profile = profiles[root.dataset.artworkName ?? ""];
        if (!profile) return;
        state.animation = layer.animate(
          [
            { transform: "translate3d(0, 0, 0) scale(1)" },
            {
              transform: `translate3d(${profile.x}px, ${profile.y}px, 0) scale(1.012)`,
            },
            { transform: "translate3d(0, 0, 0) scale(1)" },
          ],
          {
            duration: profile.duration,
            iterations: Infinity,
            easing: "ease-in-out",
          },
        );
      }
      state.animation.play();
      root.dataset.artworkState = "running";
    } else {
      state.animation?.pause();
      root.dataset.artworkState = "paused";
    }
  }

  const updateAll = () => states.forEach(update);
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const state = states.find((item) => item.root === entry.target);
        if (!state) continue;
        state.visible = entry.isIntersecting;
        update(state);
      }
    },
    { threshold: 0 },
  );

  document
    .querySelectorAll<HTMLElement>("[data-artwork-animated]")
    .forEach((root) => {
      const layer = root.querySelector<HTMLElement>("[data-artwork-layer]");
      const button = document.querySelector<HTMLButtonElement>(
        `[data-artwork-toggle="${root.dataset.artworkName}"]`,
      );
      if (!layer || !button) return;
      const state: ArtworkState = {
        root,
        layer,
        button,
        visible: false,
        animation: null,
      };
      states.push(state);
      const toggle = () => {
        userPaused = !userPaused;
        pausedPreference = userPaused;
        try {
          sessionStorage.setItem(storageKey, String(userPaused));
        } catch {
          // The control also works with storage disabled.
        }
        updateAll();
      };
      button.addEventListener("click", toggle);
      unbind.push(() => button.removeEventListener("click", toggle));
      observer.observe(root);
    });

  reduced.addEventListener("change", updateAll);
  document.addEventListener("visibilitychange", updateAll);
  updateAll();
  stop = () => {
    observer.disconnect();
    reduced.removeEventListener("change", updateAll);
    document.removeEventListener("visibilitychange", updateAll);
    unbind.forEach((remove) => remove());
    states.forEach((state) => {
      state.animation?.cancel();
      state.root.dataset.artworkState = "static";
      state.button.hidden = true;
    });
  };
}

document.addEventListener("astro:page-load", wireArtworkMotion);
document.addEventListener("astro:before-swap", () => stop());
window.addEventListener("pagehide", () => stop());
window.addEventListener("pageshow", (event) => {
  if (event.persisted) wireArtworkMotion();
});
