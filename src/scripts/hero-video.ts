export {};

const pausedPreferences = new Map<string, boolean>();
let stop = () => {};

function wireHeroVideo() {
  stop();
  stop = () => {};
  const video = document.querySelector<HTMLVideoElement>("[data-hero-video]");
  const button = document.querySelector<HTMLButtonElement>(
    "[data-hero-video-toggle]",
  );
  if (!video || !button) return;
  const label = button.querySelector<HTMLElement>("[data-video-label]");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  const preferenceKey = `smartcontrol-${video.dataset.heroVideo}-video-paused`;
  let userPaused = pausedPreferences.get(preferenceKey) ?? false;
  try {
    userPaused = sessionStorage.getItem(preferenceKey) === "true";
  } catch {
    /* Retain the in-memory preference if storage is blocked. */
  }
  let visible = false;
  let failed = false;
  let disposed = false;
  let pending: Promise<void> | null = null;
  video.muted = true;

  const allowed = () =>
    !disposed && !failed && !reduced.matches && !connection?.saveData;
  const shouldPlay = () =>
    allowed() && visible && !document.hidden && !userPaused;

  function unload() {
    video!.pause();
    video!.dataset.ready = "false";
    if (video!.hasAttribute("src")) {
      video!.removeAttribute("src");
      video!.load();
    }
  }

  function sync() {
    if (disposed) return;
    button!.hidden = !allowed();
    button!.dataset.paused = String(userPaused);
    if (label)
      label.textContent = userPaused
        ? button!.dataset.labelPlay!
        : button!.dataset.labelPause!;
    if (!allowed()) {
      unload();
      video!.dataset.state = "static";
      return;
    }
    if (!shouldPlay()) {
      video!.pause();
      video!.dataset.state = "paused";
      return;
    }
    if (!video!.hasAttribute("src")) {
      video!.src = matchMedia("(max-width: 600px)").matches
        ? video!.dataset.srcMobile!
        : video!.dataset.src!;
      video!.dataset.state = "loading";
    }
    if (!video!.paused || pending) return;
    const attempt = video!.play();
    pending = attempt;
    attempt
      .catch((error: DOMException) => {
        if (!shouldPlay() || error.name === "AbortError") return;
        if (error.name === "NotAllowedError") {
          userPaused = true;
        } else {
          failed = true;
        }
        sync();
      })
      .finally(() => {
        if (pending === attempt) pending = null;
        // A rapid pause/resume can abort the old play request; retry only if wanted.
        if (shouldPlay() && video!.paused) sync();
      });
  }

  const playing = () => {
    if (!shouldPlay()) {
      video.pause();
      return;
    }
    video.dataset.ready = "true";
    video.dataset.state = "playing";
  };
  const error = () => {
    failed = true;
    sync();
  };
  const toggle = () => {
    userPaused = !userPaused;
    pausedPreferences.set(preferenceKey, userPaused);
    try {
      sessionStorage.setItem(preferenceKey, String(userPaused));
    } catch {
      /* In-memory fallback. */
    }
    sync();
  };
  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      sync();
    },
    { threshold: 0.01 },
  );
  video.addEventListener("playing", playing);
  video.addEventListener("error", error);
  button.addEventListener("click", toggle);
  reduced.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  observer.observe(video);
  sync();

  stop = () => {
    disposed = true;
    observer.disconnect();
    video.removeEventListener("playing", playing);
    video.removeEventListener("error", error);
    button.removeEventListener("click", toggle);
    reduced.removeEventListener("change", sync);
    document.removeEventListener("visibilitychange", sync);
    button.hidden = true;
    unload();
  };
}

document.addEventListener("astro:page-load", wireHeroVideo);
document.addEventListener("astro:before-swap", () => stop());
window.addEventListener("pagehide", () => stop());
window.addEventListener("pageshow", (event) => {
  if (event.persisted) wireHeroVideo();
});
