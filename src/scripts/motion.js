// SmartControl.ro — shared motion utilities (reveals, counters, stepper, nav, console)
// All functions return a cleanup() and honor prefers-reduced-motion.

export function reducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* Quiet fade+rise reveals on [data-reveal]; optional data-reveal-delay="ms". */
export function initReveals(root) {
  if (!root) return () => {};
  const els = root.querySelectorAll('[data-reveal]');
  if (reducedMotion()) return () => {};
  const pending = [];
  els.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.88) return; // already visible — leave it
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    pending.push(el);
  });
  if (!pending.length) return () => {};
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const d = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
      el.style.transition = 'opacity 0.5s ease-out ' + d + 'ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ' + d + 'ms';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
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

/* SEKNET live console: animated attack-map canvas + scrolling log feed + ticking
   metrics. Operates on a [data-console] container holding a [data-console-canvas],
   a [data-console-log] <ul> of seed <li data-msg data-kind>, and [data-console-metric]
   numbers (data-base). All brand-blue (no status green on marketing surfaces).
   Reduced motion: paints one static radar frame and leaves the seed log/metrics. */
export function initConsole(container) {
  if (!container) return () => {};
  const rm = reducedMotion();
  const cleanups = [];
  const ACCENT = '68,135,220';   // #4487DC
  const SKY = '122,180,232';     // #7AB4E8

  // — attack-map canvas —
  const canvas = container.querySelector('[data-console-canvas]');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, raf = 0, visible = true, destroyed = false, pings = [], t = 0;
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.max(1, w * dpr); canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn() {
      const edge = Math.floor(Math.random() * 4);
      let x, y;
      if (edge === 0) { x = Math.random() * w; y = -6; }
      else if (edge === 1) { x = w + 6; y = Math.random() * h; }
      else if (edge === 2) { x = Math.random() * w; y = h + 6; }
      else { x = -6; y = Math.random() * h; }
      pings.push({ x, y, p: 0, sp: 0.006 + Math.random() * 0.007, blocked: Math.random() < 0.78 });
    }
    function rings(cx, cy) {
      const rmax = Math.min(w, h) / 2;
      for (let i = 1; i <= 3; i++) {
        ctx.strokeStyle = 'rgba(' + SKY + ',0.10)';
        ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, rmax * (i / 3.4), 0, Math.PI * 2); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(' + ACCENT + ',0.9)'; ctx.beginPath(); ctx.arc(cx, cy, 3.2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(' + ACCENT + ',0.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.stroke();
    }
    function draw() {
      raf = 0; if (destroyed || !visible || document.hidden) return;
      t++;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      rings(cx, cy);
      // expanding sweep pulse
      const pr = (t % 150) / 150;
      ctx.strokeStyle = 'rgba(' + ACCENT + ',' + ((1 - pr) * 0.22).toFixed(3) + ')';
      ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, pr * (Math.min(w, h) / 2), 0, Math.PI * 2); ctx.stroke();
      // inbound pings homing on the core
      for (const g of pings) {
        g.p += g.sp;
        const x = g.x + (cx - g.x) * g.p, y = g.y + (cy - g.y) * g.p;
        ctx.strokeStyle = 'rgba(' + SKY + ',0.12)';
        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(g.x, g.y); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = g.blocked ? 'rgba(' + ACCENT + ',0.95)' : 'rgba(' + SKY + ',0.95)';
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
      }
      pings = pings.filter((g) => g.p < 1);
      if (Math.random() < 0.05 && pings.length < 14) spawn();
      raf = requestAnimationFrame(draw);
    }
    function kick() { if (!raf && !destroyed && !rm) raf = requestAnimationFrame(draw); }
    resize();
    if (rm) {
      rings(w / 2, h / 2);
    } else {
      for (let i = 0; i < 6; i++) spawn();
      const onResize = () => { resize(); kick(); };
      const onVis = () => kick();
      const io = new IntersectionObserver((es) => { for (const e of es) visible = e.isIntersecting; kick(); }, { threshold: 0 });
      io.observe(canvas);
      window.addEventListener('resize', onResize);
      document.addEventListener('visibilitychange', onVis);
      kick();
      cleanups.push(() => { destroyed = true; if (raf) cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVis); });
    }
  }

  // — scrolling log feed —
  const logEl = container.querySelector('[data-console-log]');
  if (logEl && !rm) {
    const seeds = Array.prototype.slice.call(logEl.querySelectorAll('li')).map((li) => ({
      msg: li.getAttribute('data-msg') || li.textContent.trim(),
      blocked: li.getAttribute('data-kind') !== 'allow',
    }));
    if (seeds.length) {
      const max = 6;
      const pad = (x) => String(x).padStart(2, '0');
      const stamp = () => { const d = new Date(); return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()); };
      const line = (s) => {
        const li = document.createElement('li');
        li.className = 'flex items-center gap-2.5';
        li.innerHTML =
          '<span style="color:#7AB4E8">' + stamp() + '</span>' +
          '<span style="color:' + (s.blocked ? '#4487DC' : '#7AB4E8') + '">' + (s.blocked ? '■' : '▸') + '</span>' +
          '<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(226,233,245,0.72)">' + s.msg + '</span>';
        return li;
      };
      // re-render seeds with live timestamps for a consistent look
      logEl.innerHTML = '';
      for (let k = 0; k < Math.min(max, seeds.length); k++) logEl.appendChild(line(seeds[k]));
      let i = 0;
      const id = setInterval(() => {
        const li = line(seeds[i % seeds.length]); i++;
        li.style.opacity = '0'; li.style.transition = 'opacity .4s ease';
        logEl.insertBefore(li, logEl.firstChild);
        requestAnimationFrame(() => { li.style.opacity = '1'; });
        while (logEl.children.length > max) logEl.removeChild(logEl.lastChild);
      }, 1900);
      cleanups.push(() => clearInterval(id));
    }
  }

  // — ticking metrics —
  const metrics = Array.prototype.slice.call(container.querySelectorAll('[data-console-metric]'));
  if (metrics.length && !rm) {
    const fmt = (x) => String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const id = setInterval(() => {
      metrics.forEach((el) => {
        const base = parseFloat(el.getAttribute('data-base')) || 0;
        el.textContent = fmt(base + (Math.random() * 2 - 1) * base * 0.04);
      });
    }, 2100);
    cleanups.push(() => clearInterval(id));
  }

  return () => cleanups.forEach((fn) => { try { fn(); } catch { /* noop */ } });
}

/* Lucide icon hydration with retry (script loads async in helmet). */
export function hydrateIcons(attempt = 0) {
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
  } else if (attempt < 20) {
    setTimeout(() => hydrateIcons(attempt + 1), 250);
  }
}
