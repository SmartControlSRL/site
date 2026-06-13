// SmartControl.ro — shared motion utilities (network bg, reveals, counters, stepper, nav)
// All functions return a cleanup() and honor prefers-reduced-motion.

export function reducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* Ambient network/node graph. opts: {color, color2, lineDist, lineAlpha, dotAlpha, speed, spread, maxNodes} */
export function initNetwork(canvas, opts = {}) {
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  const color = opts.color || '68,135,220';
  const color2 = opts.color2 || '122,180,232';
  const lineDist = opts.lineDist || 150;
  const lineAlpha = opts.lineAlpha != null ? opts.lineAlpha : 0.2;
  const dotAlpha = opts.dotAlpha != null ? opts.dotAlpha : 0.55;
  const speed = opts.speed != null ? opts.speed : 0.16;
  const spread = opts.spread || 21000;
  const maxNodes = opts.maxNodes || 110;
  let w = 0, h = 0, nodes = [], raf = 0, visible = true, destroyed = false;

  function make() {
    return {
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * speed * 2, vy: (Math.random() - 0.5) * speed * 2,
      r: 1 + Math.random() * 1.5,
      c: Math.random() < 0.3 ? color2 : color
    };
  }
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.max(1, w * dpr); canvas.height = Math.max(1, h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.max(14, Math.min(maxNodes, Math.floor((w * h) / spread)));
    while (nodes.length < target) nodes.push(make());
    nodes.length = target;
  }
  function frame() {
    if (destroyed) return;
    raf = 0;
    if (!visible || document.hidden) return;
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < -10) n.x = w + 10; else if (n.x > w + 10) n.x = -10;
      if (n.y < -10) n.y = h + 10; else if (n.y > h + 10) n.y = -10;
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < lineDist * lineDist) {
          const t = 1 - Math.sqrt(d2) / lineDist;
          ctx.strokeStyle = 'rgba(' + color + ',' + (t * lineAlpha).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.fillStyle = 'rgba(' + n.c + ',' + dotAlpha + ')';
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf && !destroyed) raf = requestAnimationFrame(frame); }

  resize();
  if (reducedMotion()) {
    // static single frame, no loop
    visible = true; ctx.clearRect(0, 0, w, h);
    for (const n of nodes) { ctx.fillStyle = 'rgba(' + n.c + ',' + dotAlpha + ')'; ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill(); }
    return () => {};
  }
  const onResize = () => { resize(); kick(); };
  const onVis = () => kick();
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVis);
  const io = new IntersectionObserver((es) => {
    for (const e of es) { visible = e.isIntersecting; }
    kick();
  }, { threshold: 0 });
  io.observe(canvas);
  kick();
  return () => { destroyed = true; if (raf) cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVis); };
}

/* Fade+rise reveals on [data-reveal]; optional data-reveal-delay="ms". */
export function initReveals(root) {
  if (!root) return () => {};
  const els = root.querySelectorAll('[data-reveal]');
  if (reducedMotion()) return () => {};
  const pending = [];
  els.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.88) return; // already visible — leave it
    el.style.opacity = '0';
    const rot = el.getAttribute('data-reveal-rotate');
    el.style.transform = rot ? 'translateY(56px) scale(0.96)' : 'translateY(34px)';
    if (rot) el.style.filter = 'blur(10px)';
    pending.push(el);
  });
  if (!pending.length) return () => {};
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const d = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
      const rot = el.getAttribute('data-reveal-rotate');
      // feature cards: deep rise + focus pull (blur→sharp); plain blocks stay precise
      const ease = rot ? 'cubic-bezier(0.22,1,0.36,1)' : 'cubic-bezier(0.16,1,0.3,1)';
      const dur = rot ? '0.95s' : '0.75s';
      el.style.transition = 'opacity 0.55s ease-out ' + d + 'ms, transform ' + dur + ' ' + ease + ' ' + d + 'ms, filter 0.7s ease-out ' + d + 'ms';
      el.style.opacity = '1';
      el.style.filter = 'blur(0px)';
      el.style.transform = rot ? 'translateY(0) scale(1)' : 'translateY(0)';
      io.unobserve(el);
    });
  }, { threshold: 0.12 });
  pending.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

/* Count-up on [data-count="650"]. Keeps final text as no-JS fallback. */
export function initCounters(root) {
  if (!root) return () => {};
  const els = root.querySelectorAll('[data-count]');
  if (!els.length || reducedMotion()) return () => {};
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      io.unobserve(el);
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const dur = 1400;
      const t0 = performance.now();
      function step(t) {
        const p = Math.min(1, (t - t0) / dur);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * ease));
        if (p < 1) requestAnimationFrame(step);
      }
      el.textContent = '0';
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

/* Sticky-shrink light nav: adds hairline + shadow + tighter padding after 24px. */
export function initNavShrink(nav, opts = {}) {
  if (!nav) return () => {};
  const padBig = opts.padBig || '18px 40px';
  const padSmall = opts.padSmall || '11px 40px';
  let shrunk = null;
  function onScroll() {
    const s = window.scrollY > 24;
    if (s === shrunk) return;
    shrunk = s;
    nav.style.padding = s ? padSmall : padBig;
    nav.style.boxShadow = s ? '0 2px 12px rgba(14,31,91,0.08)' : '0 0 0 rgba(14,31,91,0)';
    nav.style.borderBottomColor = s ? '#E5E7EB' : 'rgba(229,231,235,0)';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return () => window.removeEventListener('scroll', onScroll);
}

/* Scroll-driven vertical stepper. container holds [data-step] rows with
   [data-step-dot] and [data-step-body]; fill is the accent rail. */
export function initStepper(container, fill, opts = {}) {
  if (!container || !fill) return () => {};
  const dark = !!opts.dark;
  const steps = container.querySelectorAll('[data-step]');
  const rm = reducedMotion();
  function onScroll() {
    const rect = container.getBoundingClientRect();
    const focus = window.innerHeight * 0.55;
    let px = focus - rect.top;
    px = Math.max(0, Math.min(rect.height, px));
    fill.style.height = px + 'px';
    steps.forEach((stepEl) => {
      const dot = stepEl.querySelector('[data-step-dot]');
      const body = stepEl.querySelector('[data-step-body]');
      const mid = stepEl.offsetTop + (dot ? dot.offsetTop + dot.offsetHeight / 2 : 26);
      const active = px >= mid || rm;
      if (dot) {
        dot.style.borderColor = active ? '#4487DC' : (dark ? 'rgba(122,180,232,0.25)' : '#D6E8F7');
        dot.style.color = active ? (dark ? '#FFFFFF' : '#0E1F5B') : (dark ? 'rgba(226,233,245,0.45)' : '#9CA3AF');
        dot.style.background = active ? (dark ? 'rgba(68,135,220,0.16)' : '#EDF5FC') : (dark ? '#040C2B' : '#FFFFFF');
        dot.style.boxShadow = active ? '0 0 0 4px rgba(68,135,220,0.14)' : 'none';
      }
      if (body) body.style.opacity = active ? '1' : '0.45';
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
}

/* NovaVoice-style dictation sweep for [data-word-fill="light"|"dark"] headings.
   Plays once on viewport entry: characters fade in left→right with a soft edge,
   tinted in the accent gradient while revealing, then settle to the final ink. */
export function initWordFill(root) {
  if (!root) return () => {};
  const els = root.querySelectorAll('[data-word-fill]');
  if (!els.length || reducedMotion()) return () => {};
  const timers = [];
  const items = [];
  els.forEach((el) => {
    if (el.getAttribute('data-wf-done')) return;
    el.setAttribute('data-wf-done', '1');
    const dark = el.getAttribute('data-word-fill') === 'dark';
    const finalInk = dark ? '#FFFFFF' : '#0E1F5B';
    const g0 = [68, 135, 220], g1 = [122, 180, 232]; // accent sweep: #4487DC → #7AB4E8
    const words = (el.textContent || '').split(/\s+/).filter(Boolean);
    const total = words.join('').length;
    el.textContent = '';
    const chars = [];
    let ci = 0;
    words.forEach((w, wi) => {
      const wrap = document.createElement('span');
      wrap.style.whiteSpace = 'nowrap';
      for (const ch of w) {
        const s = document.createElement('span');
        s.textContent = ch;
        const t = total > 1 ? ci / (total - 1) : 0;
        s.style.color = 'rgb(' + Math.round(g0[0] + (g1[0] - g0[0]) * t) + ',' + Math.round(g0[1] + (g1[1] - g0[1]) * t) + ',' + Math.round(g0[2] + (g1[2] - g0[2]) * t) + ')';
        s.style.opacity = '0';
        wrap.appendChild(s);
        chars.push(s);
        ci++;
      }
      el.appendChild(wrap);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    items.push({ el, chars, finalInk, played: false });
  });
  if (!items.length) return () => {};
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const it = items.find((x) => x.el === e.target);
      if (!it || it.played) return;
      it.played = true;
      io.unobserve(e.target);
      // soft left→right reveal: per-char stagger with a gentle fade edge
      const step = Math.max(16, Math.min(42, 1000 / it.chars.length));
      it.chars.forEach((s, i) => {
        s.style.transition = 'opacity 0.5s ease ' + Math.round(i * step) + 'ms';
        s.style.opacity = '1';
      });
      // settle: gradient tint sweeps into the final ink color
      const settle = Math.round(it.chars.length * step + 600);
      timers.push(setTimeout(() => {
        it.chars.forEach((s, i) => {
          s.style.transition = 'color 0.9s ease ' + Math.round(i * 7) + 'ms';
          s.style.color = it.finalInk;
        });
      }, settle));
    });
  }, { threshold: 0.4 });
  items.forEach((it) => io.observe(it.el));
  return () => { io.disconnect(); timers.forEach(clearTimeout); };
}

/* Scroll parallax for [data-parallax="0.2"] layers (offset vs parent's viewport position). */
export function initParallax(root) {
  if (!root) return () => {};
  const els = Array.prototype.slice.call(root.querySelectorAll('[data-parallax]'));
  if (!els.length || reducedMotion()) return () => {};
  let raf = 0;
  function update() {
    raf = 0;
    const vh = window.innerHeight;
    els.forEach((el) => {
      const f = parseFloat(el.getAttribute('data-parallax')) || 0.15;
      const host = el.parentElement;
      if (!host) return;
      const r = host.getBoundingClientRect();
      const off = (r.top + r.height / 2 - vh / 2) * f;
      el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
    });
  }
  function onScroll() { if (!raf) raf = requestAnimationFrame(update); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
  return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
}

/* Layered drift v2 — column-rigid + inertial.
   Offsets are computed from the PARENT grid's viewport position, so every card
   in a column shares the exact same offset at any instant — gaps can never
   collapse into overlap. Columns with opposite signs glide against each other.
   The offset eases toward its target (lerp) so the drift lags the scroll a
   touch and settles softly. Uses the independent CSS `translate` property so it
   composes with reveal transforms. */
export function initDrift(root) {
  if (!root) return () => {};
  const els = Array.prototype.slice.call(root.querySelectorAll('[data-drift]'));
  if (!els.length || reducedMotion()) return () => {};
  const items = els.map((el) => ({
    el,
    f: parseFloat(el.getAttribute('data-drift')) || 0,
    anchor: el.parentElement,
    cur: 0,
    tgt: 0
  }));
  let raf = 0, stopped = false;
  function measure() {
    const vh = window.innerHeight;
    items.forEach((it) => {
      if (!it.anchor) return;
      const r = it.anchor.getBoundingClientRect();
      const off = (r.top + r.height / 2 - vh / 2) * it.f;
      it.tgt = Math.max(-44, Math.min(44, off));
    });
  }
  function loop() {
    raf = 0;
    if (stopped) return;
    let active = false;
    items.forEach((it) => {
      it.cur += (it.tgt - it.cur) * 0.14;
      if (Math.abs(it.tgt - it.cur) > 0.1) active = true;
      it.el.style.translate = '0 ' + it.cur.toFixed(1) + 'px';
    });
    if (active) raf = requestAnimationFrame(loop);
  }
  function onScroll() { measure(); if (!raf) raf = requestAnimationFrame(loop); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  return () => { stopped = true; if (raf) cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); items.forEach((it) => { it.el.style.translate = ''; }); };
}

/* Band scale-in: [data-band] full-bleed sections grow into place as they enter —
   scale 0.94→1 with rounded corners melting to square. Scrubbed both directions. */
export function initBandScale(root) {
  if (!root) return () => {};
  const els = Array.prototype.slice.call(root.querySelectorAll('[data-band]'));
  if (!els.length || reducedMotion()) return () => {};
  let raf = 0;
  function update() {
    raf = 0;
    const vh = window.innerHeight;
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      let p = (vh - r.top) / (vh * 0.45);
      p = Math.max(0, Math.min(1, p));
      const e = 1 - Math.pow(1 - p, 2);
      el.style.transform = 'scale(' + (0.94 + 0.06 * e).toFixed(4) + ')';
      el.style.borderRadius = Math.round((1 - e) * 40) + 'px';
    });
  }
  function onScroll() { if (!raf) raf = requestAnimationFrame(update); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
  return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
}

/* Hero depth exit: [data-hero-scrub] content sinks slower than the scroll and
   fades, reading as a layer behind the incoming page. */
export function initHeroScrub(root) {
  if (!root) return () => {};
  const el = root.querySelector('[data-hero-scrub]');
  if (!el || reducedMotion()) return () => {};
  let raf = 0;
  function update() {
    raf = 0;
    const y = window.scrollY;
    const p = Math.max(0, Math.min(1, y / (window.innerHeight * 0.85)));
    el.style.translate = '0 ' + (y * 0.3).toFixed(1) + 'px';
    el.style.opacity = (1 - 0.92 * p).toFixed(3);
  }
  function onScroll() { if (!raf) raf = requestAnimationFrame(update); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
  return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
}

/* Scroll-velocity lean for ALL [data-skew] elements in root: they lag and lean
   with fast scrolling (skew + translate), then spring back at rest. The attr
   value caps the lean amount, e.g. data-skew="4". */
export function initScrollLean(root) {
  if (!root) return () => {};
  const els = Array.prototype.slice.call(root.querySelectorAll('[data-skew]'));
  if (!els.length || reducedMotion()) return () => {};
  let last = window.scrollY, vel = 0, raf = 0, stopped = false;
  function loop() {
    raf = 0;
    if (stopped) return;
    vel *= 0.85;
    if (Math.abs(vel) < 0.04) {
      vel = 0;
      els.forEach((el) => { el.style.transform = ''; });
      return;
    }
    els.forEach((el) => {
      const max = parseFloat(el.getAttribute('data-skew')) || 6;
      const v = Math.max(-max, Math.min(max, vel));
      el.style.transform = 'skewX(' + (-v * 0.6).toFixed(2) + 'deg) translateY(' + (v * 2.4).toFixed(1) + 'px)';
    });
    raf = requestAnimationFrame(loop);
  }
  function onScroll() {
    if (stopped) return;
    const y = window.scrollY;
    vel = Math.max(-12, Math.min(12, vel + (y - last) * 0.09));
    last = y;
    if (!raf) raf = requestAnimationFrame(loop);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => { stopped = true; if (raf) cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
}

/* Scroll-velocity skew: element leans with fast scrolling, springs back at rest. */
export function initVelocitySkew(el, max) {
  if (!el || reducedMotion()) return () => {};
  max = max || 6;
  let last = window.scrollY, vel = 0, raf = 0, stopped = false;
  function loop() {
    raf = 0;
    if (stopped) return;
    vel *= 0.86;
    if (Math.abs(vel) < 0.04) { vel = 0; el.style.transform = ''; return; }
    el.style.transform = 'skewX(' + (-vel).toFixed(2) + 'deg)';
    raf = requestAnimationFrame(loop);
  }
  function onScroll() {
    if (stopped) return;
    const y = window.scrollY;
    vel = Math.max(-max, Math.min(max, vel + (y - last) * 0.05));
    last = y;
    if (!raf) raf = requestAnimationFrame(loop);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => { stopped = true; if (raf) cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
}

/* Render email addresses at runtime so origin-level email obfuscation
   (e.g. Cloudflare scrape protection) can't rewrite the visible text.
   Usage: <a data-email-user="office" data-email-domain="smartcontrol.ro"></a>
   Optional data-email-subject="Evaluare gratuită" appends ?subject= (URL-encoded).
   Sets mailto: href on anchors; fills textContent only if element is empty. */
export function initEmails(root) {
  if (!root) return;
  root.querySelectorAll('[data-email-user]').forEach((el) => {
    const addr = el.getAttribute('data-email-user') + '@' + el.getAttribute('data-email-domain');
    if (el.tagName === 'A') {
      const subject = el.getAttribute('data-email-subject');
      const href = 'mailto:' + addr + (subject ? '?subject=' + encodeURIComponent(subject) : '');
      el.setAttribute('href', href);
    }
    if (!el.textContent.trim()) el.textContent = addr;
  });
}

/* Lucide icon hydration with retry (script loads async in helmet). */
export function hydrateIcons(attempt = 0) {
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
  } else if (attempt < 20) {
    setTimeout(() => hydrateIcons(attempt + 1), 250);
  }
}
