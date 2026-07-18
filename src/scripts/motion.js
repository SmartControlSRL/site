// SmartControl.ro — shared motion utilities. All return cleanup callbacks.
export function reducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function initReveals(root) {
  if (!root || reducedMotion()) return () => {};
  const pending = [...root.querySelectorAll("[data-reveal]")].filter((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.88)
      return false;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    return true;
  });
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const delay = Number(el.getAttribute("data-reveal-delay") || 0);
        el.style.transition = `opacity .5s ease-out ${delay}ms, transform .6s cubic-bezier(.16,1,.3,1) ${delay}ms`;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        io.unobserve(el);
      }),
    { threshold: 0.12 },
  );
  pending.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

export function initCounters(root) {
  if (!root || reducedMotion()) return () => {};
  const els = root.querySelectorAll("[data-count]");
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        io.unobserve(el);
        const target = Number(el.getAttribute("data-count")) || 0;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / 1400);
          el.textContent = String(
            Math.round(target * (1 - Math.pow(1 - p, 3))),
          );
          if (p < 1) requestAnimationFrame(tick);
        };
        el.textContent = "0";
        requestAnimationFrame(tick);
      }),
    { threshold: 0.5 },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

// Toggles `.is-scrolled` on the nav past 24px; the resting hairline + the
// scrolled padding/shadow/deepened-border all live in global.css (the nav's
// bottom hairline is now PERMANENT — no transparent reset). Signature and
// cleanup-return shape preserved from the previous inline-style version.
export function initNavShrink(nav, opts = {}) {
  if (!nav) return () => {};
  void opts;
  const update = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
  return () => window.removeEventListener("scroll", update);
}

// Scene engine for [data-scene] elements. Per scene: one IntersectionObserver
// gates activity (active only while intersecting && !document.hidden); scroll
// listeners are passive and only request an rAF-coalesced frame; geometry is
// cached and recomputed via a single ResizeObserver (never per-frame layout
// reads). Each frame computes section-local progress p and writes exactly ONE
// custom property --p; all visuals are CSS keyed off var(--p). Pin guard adds
// `is-pinned` only on wide, non-reduced, tall-enough viewports. No-ops when no
// [data-scene] elements exist. Returns a cleanup that cancels frames and
// disconnects every observer/listener.
export function initScenes(doc) {
  if (!doc) return () => {};
  const scenes = [...doc.querySelectorAll("[data-scene]")];
  if (!scenes.length) return () => {};
  const prefersReduced = reducedMotion();
  const desktop = window.matchMedia("(min-width:1100px)");
  const navOffset =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--nav-offset",
      ),
    ) || 0;
  const cleanups = [];

  scenes.forEach((scene) => {
    let top = 0,
      height = 0,
      rafId = 0,
      queued = false,
      listening = false,
      intersecting = false;

    const measure = () => {
      const rect = scene.getBoundingClientRect();
      top = rect.top + window.scrollY;
      height = rect.height;
    };
    const render = () => {
      queued = false;
      const stageH = window.innerHeight - navOffset;
      const denom = height - stageH;
      const p =
        denom > 0
          ? Math.min(1, Math.max(0, (window.scrollY - top) / denom))
          : 0;
      scene.style.setProperty("--p", p.toFixed(4));
    };
    const requestFrame = () => {
      if (queued) return;
      queued = true;
      rafId = requestAnimationFrame(render);
    };
    const onScroll = () => requestFrame();
    const startListening = () => {
      if (listening) return;
      listening = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      requestFrame();
    };
    const stopListening = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("scroll", onScroll);
    };
    const sync = () => {
      if (intersecting && !document.hidden) startListening();
      else stopListening();
    };
    const evalPin = () => {
      const pin =
        desktop.matches && !prefersReduced && window.innerHeight >= 640;
      scene.classList.toggle("is-pinned", pin);
    };
    const onVisibility = () => sync();
    const onResize = () => {
      evalPin();
      measure();
      requestFrame();
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        intersecting = e.isIntersecting;
      });
      sync();
    });
    const ro = new ResizeObserver(() => {
      measure();
      requestFrame();
    });

    measure();
    evalPin();
    io.observe(scene);
    ro.observe(scene);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize, { passive: true });
    desktop.addEventListener?.("change", evalPin);

    cleanups.push(() => {
      stopListening();
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      desktop.removeEventListener?.("change", evalPin);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

// StackTeardown layer sync (folded in from the component's former inline
// <script>). Hover previews a layer, click/Enter pins it (stopping the ambient
// cycle), and an auto-advance every 3.2s runs until the visitor interacts —
// disabled under prefers-reduced-motion. Listeners are grouped under an
// AbortController; the returned cleanup clears the interval and removes every
// listener (the old inline interval survived View Transition swaps — the leak
// this fold-in fixes).
export function initStackTeardown(doc) {
  if (!doc) return () => {};
  const roots = [...doc.querySelectorAll("[data-sctd]")];
  if (!roots.length) return () => {};
  const cleanups = [];

  roots.forEach((root) => {
    const els = Array.from(root.querySelectorAll("[data-layer]"));
    if (!els.length) return;
    const count = new Set(els.map((el) => el.dataset.layer)).size;
    let active = 0,
      hover = false,
      picked = false,
      timer = 0;
    const controller = new AbortController();
    const { signal } = controller;

    const apply = () => {
      els.forEach((el) => {
        const i = Number(el.dataset.layer);
        const isActive = i === active;
        el.classList.toggle("is-active", isActive);
        el.classList.toggle("is-above", i < active);
        // role="button" plates + rows expose expanded state to AT; collapsed
        // row content leaves the tab order via inert (WCAG 2.4.7).
        if (el.getAttribute("role") === "button")
          el.setAttribute("aria-expanded", String(isActive));
        const more = el.querySelector(".sctd-more");
        if (more) more.toggleAttribute("inert", !isActive);
      });
    };
    const set = (i, byUser) => {
      if (byUser) picked = true;
      if (i !== active) {
        active = i;
        apply();
      }
    };

    els.forEach((el) => {
      const i = Number(el.dataset.layer);
      el.addEventListener("mouseenter", () => set(i, false), { signal });
      el.addEventListener("click", () => set(i, true), { signal });
      el.addEventListener(
        "keydown",
        (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            set(i, true);
          }
        },
        { signal },
      );
    });
    root.addEventListener(
      "mouseenter",
      () => {
        hover = true;
      },
      { signal },
    );
    root.addEventListener(
      "mouseleave",
      () => {
        hover = false;
      },
      { signal },
    );

    if (!reducedMotion()) {
      timer = window.setInterval(() => {
        if (!hover && !picked) {
          active = (active + 1) % count;
          apply();
        }
      }, 3200);
    }
    apply();

    cleanups.push(() => {
      if (timer) window.clearInterval(timer);
      controller.abort();
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

export function initStepper(container, fill, opts = {}) {
  if (!container || !fill) return () => {};
  const dark = !!opts.dark;
  const steps = container.querySelectorAll("[data-step]");
  const update = () => {
    const rect = container.getBoundingClientRect();
    const px = Math.max(
      0,
      Math.min(rect.height, window.innerHeight * 0.55 - rect.top),
    );
    fill.style.height = `${px}px`;
    steps.forEach((step) => {
      const dot = step.querySelector("[data-step-dot]");
      const body = step.querySelector("[data-step-body]");
      const active =
        px >=
          step.offsetTop + (dot ? dot.offsetTop + dot.offsetHeight / 2 : 26) ||
        reducedMotion();
      if (dot) {
        dot.style.borderColor = active
          ? "#4487DC"
          : dark
            ? "rgba(122,180,232,.25)"
            : "#D6E8F7";
        dot.style.color = active
          ? dark
            ? "#fff"
            : "#0E1F5B"
          : dark
            ? "rgba(226,233,245,.45)"
            : "#9CA3AF";
        dot.style.background = active
          ? dark
            ? "rgba(68,135,220,.16)"
            : "#EDF5FC"
          : dark
            ? "#040C2B"
            : "#fff";
      }
      if (body) body.style.opacity = active ? "1" : ".45";
    });
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
  return () => {
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
  };
}

export function initEmails(root) {
  root?.querySelectorAll("[data-email-user]").forEach((el) => {
    const address = `${el.getAttribute("data-email-user")}@${el.getAttribute("data-email-domain")}`;
    if (el.tagName === "A") {
      const subject = el.getAttribute("data-email-subject");
      el.setAttribute(
        "href",
        `mailto:${address}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`,
      );
    }
    if (!el.textContent.trim()) el.textContent = address;
  });
}

// Ambient console visual used in the homepage product band. The copy remains generic;
// motion stops completely when reduced motion is requested.
export function initConsole(container) {
  if (!container) return () => {};
  const canvas = container.querySelector("[data-console-canvas]");
  const cleanups = [];
  if (canvas?.getContext) {
    const ctx = canvas.getContext("2d");
    let width = 0,
      height = 0,
      frame = 0,
      visible = true,
      destroyed = false,
      time = 0,
      pings = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, width * dpr);
      canvas.height = Math.max(1, height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = () => {
      const edge = Math.floor(Math.random() * 4);
      let x, y;
      if (edge === 0) {
        x = Math.random() * width;
        y = -6;
      } else if (edge === 1) {
        x = width + 6;
        y = Math.random() * height;
      } else if (edge === 2) {
        x = Math.random() * width;
        y = height + 6;
      } else {
        x = -6;
        y = Math.random() * height;
      }
      pings.push({ x, y, p: 0, speed: 0.006 + Math.random() * 0.007 });
    };
    const rings = (x, y) => {
      for (let i = 1; i <= 3; i++) {
        ctx.strokeStyle = "rgba(122,180,232,.10)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(
          x,
          y,
          (Math.min(width, height) / 2) * (i / 3.4),
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(68,135,220,.9)";
      ctx.beginPath();
      ctx.arc(x, y, 3.2, 0, Math.PI * 2);
      ctx.fill();
    };
    const draw = () => {
      frame = 0;
      if (destroyed || !visible || document.hidden) return;
      time++;
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2,
        cy = height / 2;
      rings(cx, cy);
      const pulse = (time % 150) / 150;
      ctx.strokeStyle = `rgba(68,135,220,${(1 - pulse) * 0.22})`;
      ctx.beginPath();
      ctx.arc(cx, cy, (pulse * Math.min(width, height)) / 2, 0, Math.PI * 2);
      ctx.stroke();
      pings.forEach((point) => {
        point.p += point.speed;
        const x = point.x + (cx - point.x) * point.p,
          y = point.y + (cy - point.y) * point.p;
        ctx.strokeStyle = "rgba(122,180,232,.12)";
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = "rgba(68,135,220,.95)";
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      pings = pings.filter((point) => point.p < 1);
      if (Math.random() < 0.05 && pings.length < 14) spawn();
      frame = requestAnimationFrame(draw);
    };
    resize();
    if (reducedMotion()) rings(width / 2, height / 2);
    else {
      for (let i = 0; i < 6; i++) spawn();
      const kick = () => {
        if (!frame && !destroyed) frame = requestAnimationFrame(draw);
      };
      const onResize = () => {
        resize();
        kick();
      };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => (visible = entry.isIntersecting));
        kick();
      });
      observer.observe(canvas);
      window.addEventListener("resize", onResize);
      kick();
      cleanups.push(() => {
        destroyed = true;
        if (frame) cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener("resize", onResize);
      });
    }
  }
  const log = container.querySelector("[data-console-log]");
  if (log && !reducedMotion()) {
    const seeds = [...log.querySelectorAll("li")].map((item) => ({
      msg: item.getAttribute("data-msg") || "",
      allow: item.getAttribute("data-kind") === "allow",
    }));
    let index = 0;
    const pad = (value) => String(value).padStart(2, "0");
    const timer = setInterval(() => {
      if (!seeds.length) return;
      const now = new Date(),
        seed = seeds[index++ % seeds.length],
        item = document.createElement("li");
      item.className = "flex items-center gap-2.5";
      item.innerHTML = `<span style="color:#7AB4E8">${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}</span><span style="color:${seed.allow ? "#7AB4E8" : "#4487DC"}">${seed.allow ? "▸" : "■"}</span><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(226,233,245,.72)">${seed.msg}</span>`;
      log.prepend(item);
      while (log.children.length > 6) log.lastElementChild.remove();
    }, 1900);
    cleanups.push(() => clearInterval(timer));
  }
  return () => cleanups.forEach((cleanup) => cleanup());
}
