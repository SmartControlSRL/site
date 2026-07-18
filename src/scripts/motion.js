// SmartControl.ro — shared motion utilities. All return cleanup callbacks.
export function reducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function initReveals(root) {
  if (!root || reducedMotion()) return () => {};
  // Content remains fully visible before and after enhancement. The local
  // settle uses transform only, avoiding the blank-section failure mode of an
  // opacity-gated reveal.
  const pending = [...root.querySelectorAll('[data-reveal]')].filter((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return false;
    el.style.transform = 'translateY(12px)'; return true;
  });
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target; const delay = Number(el.getAttribute('data-reveal-delay') || 0);
    el.style.transition = `transform .6s cubic-bezier(.16,1,.3,1) ${delay}ms`;
    el.style.transform = 'translateY(0)'; io.unobserve(el);
  }), { threshold: 0.12 });
  pending.forEach((el) => io.observe(el));
  return () => {
    io.disconnect();
    pending.forEach((el) => {
      el.style.removeProperty('transform');
      el.style.removeProperty('transition');
    });
  };
}

export function initCounters(root) {
  if (!root || reducedMotion()) return () => {};
  const els = root.querySelectorAll('[data-count]');
  const frames = new Set();
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return; const el = e.target; io.unobserve(el);
    const target = Number(el.getAttribute('data-count')) || 0; const start = performance.now();
    const tick = (now) => { const p = Math.min(1, (now-start)/1400); el.textContent = String(Math.round(target*(1-Math.pow(1-p,3)))); if (p<1) { const id=requestAnimationFrame((time)=>{frames.delete(id);tick(time);});frames.add(id); } };
    el.textContent='0'; const id=requestAnimationFrame((time)=>{frames.delete(id);tick(time);});frames.add(id);
  }), { threshold: .5 });
  els.forEach((el) => io.observe(el)); return () => { io.disconnect(); frames.forEach((id)=>cancelAnimationFrame(id)); frames.clear(); };
}

export function initNavShrink(nav, opts={}) {
  if (!nav) return () => {}; const big=opts.padBig; const small=opts.padSmall;
  let frame=0,last=null;
  const update=()=>{frame=0;const on=window.scrollY>24;if(on===last)return;last=on;nav.toggleAttribute('data-shrunk',on);if(big&&small)nav.style.padding=on?small:big;nav.style.boxShadow=on?'0 2px 12px rgba(14,31,91,.08)':'none';nav.style.borderBottomColor=on?'#E5E7EB':'transparent';};
  const request=()=>{if(!frame)frame=requestAnimationFrame(update);};
  window.addEventListener('scroll',request,{passive:true}); update(); return ()=>{window.removeEventListener('scroll',request);if(frame)cancelAnimationFrame(frame);nav.removeAttribute('data-shrunk');nav.style.removeProperty('padding');nav.style.removeProperty('box-shadow');nav.style.removeProperty('border-bottom-color');};
}

export function initStepper(container, fill, opts={}) {
  if (!container||!fill) return ()=>{}; const dark=!!opts.dark; const steps=container.querySelectorAll('[data-step]');
  const paint=(step,active)=>{ const dot=step.querySelector('[data-step-dot]'); const body=step.querySelector('[data-step-body]');
    if(dot){dot.style.borderColor=active?'#4487DC':(dark?'rgba(122,180,232,.25)':'#D6E8F7');dot.style.color=active?(dark?'#fff':'#0E1F5B'):(dark?'rgba(226,233,245,.45)':'#9CA3AF');dot.style.background=active?(dark?'rgba(68,135,220,.16)':'#EDF5FC'):(dark?'#040C2B':'#fff');}
    if(body) body.style.opacity=active?'1':'.45'; };
  const reset=()=>{ fill.style.removeProperty('height');steps.forEach((step)=>{const dot=step.querySelector('[data-step-dot]');const body=step.querySelector('[data-step-body]');dot?.style.removeProperty('border-color');dot?.style.removeProperty('color');dot?.style.removeProperty('background');body?.style.removeProperty('opacity');}); };
  if(reducedMotion()){fill.style.height='100%';steps.forEach((step)=>paint(step,true));return reset;}
  let frame=0;
  const update=()=>{ frame=0;const rect=container.getBoundingClientRect(); const px=Math.max(0,Math.min(rect.height,window.innerHeight*.55-rect.top)); fill.style.height=`${px}px`;
    steps.forEach((step)=>{ const dot=step.querySelector('[data-step-dot]');paint(step,px>=step.offsetTop+(dot?dot.offsetTop+dot.offsetHeight/2:26)); }); };
  const request=()=>{if(!frame)frame=requestAnimationFrame(update);};
  window.addEventListener('scroll',request,{passive:true}); window.addEventListener('resize',request); update(); return()=>{window.removeEventListener('scroll',request);window.removeEventListener('resize',request);if(frame)cancelAnimationFrame(frame);reset();};
}

export function initEmails(root) {
  root?.querySelectorAll('[data-email-user]').forEach((el)=>{ const address=`${el.getAttribute('data-email-user')}@${el.getAttribute('data-email-domain')}`; if(el.tagName==='A'){const subject=el.getAttribute('data-email-subject');el.setAttribute('href',`mailto:${address}${subject?`?subject=${encodeURIComponent(subject)}`:''}`);} if(!el.textContent.trim())el.textContent=address; });
}

// Ambient console visual used in the homepage product band. The copy remains generic;
// motion stops completely when reduced motion is requested.
export function initConsole(container) {
  if (!container) return () => {};
  const canvas = container.querySelector('[data-console-canvas]');
  const cleanups = [];
  if (canvas?.getContext) {
    const ctx = canvas.getContext('2d');
    let width=0,height=0,frame=0,visible=true,destroyed=false,time=0,pings=[];
    const resize=()=>{const dpr=Math.min(window.devicePixelRatio||1,2);width=canvas.clientWidth;height=canvas.clientHeight;canvas.width=Math.max(1,width*dpr);canvas.height=Math.max(1,height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);};
    const spawn=()=>{const edge=Math.floor(Math.random()*4);let x,y;if(edge===0){x=Math.random()*width;y=-6;}else if(edge===1){x=width+6;y=Math.random()*height;}else if(edge===2){x=Math.random()*width;y=height+6;}else{x=-6;y=Math.random()*height;}pings.push({x,y,p:0,speed:.006+Math.random()*.007});};
    const rings=(x,y)=>{for(let i=1;i<=3;i++){ctx.strokeStyle='rgba(122,180,232,.10)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,Math.min(width,height)/2*(i/3.4),0,Math.PI*2);ctx.stroke();}ctx.fillStyle='rgba(68,135,220,.9)';ctx.beginPath();ctx.arc(x,y,3.2,0,Math.PI*2);ctx.fill();};
    const draw=()=>{frame=0;if(destroyed||!visible||document.hidden)return;time++;ctx.clearRect(0,0,width,height);const cx=width/2,cy=height/2;rings(cx,cy);const pulse=(time%150)/150;ctx.strokeStyle=`rgba(68,135,220,${(1-pulse)*.22})`;ctx.beginPath();ctx.arc(cx,cy,pulse*Math.min(width,height)/2,0,Math.PI*2);ctx.stroke();pings.forEach(point=>{point.p+=point.speed;const x=point.x+(cx-point.x)*point.p,y=point.y+(cy-point.y)*point.p;ctx.strokeStyle='rgba(122,180,232,.12)';ctx.beginPath();ctx.moveTo(point.x,point.y);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle='rgba(68,135,220,.95)';ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);ctx.fill();});pings=pings.filter(point=>point.p<1);if(Math.random()<.05&&pings.length<14)spawn();frame=requestAnimationFrame(draw);};
    resize();
    if (reducedMotion()) rings(width/2,height/2);
    else {for(let i=0;i<6;i++)spawn();const kick=()=>{if(!frame&&!destroyed)frame=requestAnimationFrame(draw);};const onResize=()=>{resize();kick();};const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>visible=entry.isIntersecting);kick();});observer.observe(canvas);window.addEventListener('resize',onResize);kick();cleanups.push(()=>{destroyed=true;if(frame)cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('resize',onResize);});}
  }
  const log=container.querySelector('[data-console-log]');
  if(log&&!reducedMotion()){const seeds=[...log.querySelectorAll('li')].map(item=>({msg:item.getAttribute('data-msg')||'',allow:item.getAttribute('data-kind')==='allow'}));let index=0;const pad=value=>String(value).padStart(2,'0');const timer=setInterval(()=>{if(!seeds.length)return;const now=new Date(),seed=seeds[index++%seeds.length],item=document.createElement('li');item.className='flex items-center gap-2.5';item.innerHTML=`<span style="color:#7AB4E8">${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}</span><span style="color:${seed.allow?'#7AB4E8':'#4487DC'}">${seed.allow?'▸':'■'}</span><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(226,233,245,.72)">${seed.msg}</span>`;log.prepend(item);while(log.children.length>6)log.lastElementChild.remove();},1900);cleanups.push(()=>clearInterval(timer));}
  return()=>cleanups.forEach(cleanup=>cleanup());
}

// Homepage Stack Teardown. The desktop chapter is driven only by its own
// scroll range; compact and reduced-motion modes remain ordinary document
// flow. All listeners/observers/frames are owned by the returned cleanup.
const sctdClamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const sctdSmoothstep = (start, end, value) => {
  const t = sctdClamp((value - start) / Math.max(0.0001, end - start));
  return t * t * (3 - 2 * t);
};
const sctdWindow = (progress, start, end, fade = 0.025) =>
  sctdSmoothstep(start, start + fade, progress) *
  (1 - sctdSmoothstep(end - fade, end, progress));

const SCTD_SCENES = Object.freeze({
  introEnd: 0.18,
  upperL4: [0.18, 0.3],
  upperL3: [0.3, 0.4],
  world: [0.39, 0.515],
  lowerL2: [0.5, 0.61],
  lowerL1: [0.61, 0.71],
  aligned: [0.695, 0.86],
  railStart: 0.81,
  railReady: 0.9,
});

export function initStackTeardown(root) {
  if (!root || root.dataset.sctdInit) return () => {};
  root.dataset.sctdInit = '1';

  const stage = root.querySelector('[data-sctd-stage]');
  const story = root.querySelector('[data-sctd-story]');
  const items = [...root.querySelectorAll('[data-sctd-item]')];
  const plates = [...root.querySelectorAll('.sctd-plate[data-layer]')];
  const callouts = [...root.querySelectorAll('.sctd-callout[data-layer]')];
  const accordions = items.map((item) => item.querySelector('[data-sctd-accordion]'));
  const panels = items.map((item) => item.querySelector('[data-sctd-panel]'));
  const links = items.map((item) => item.querySelector('[data-sctd-link]'));
  const controls = root.querySelector('[data-sctd-controls]');
  const viewport = root.querySelector('[data-sctd-viewport]');
  const prev = root.querySelector('[data-sctd-prev]');
  const next = root.querySelector('[data-sctd-next]');
  const positionCode = root.querySelector('[data-sctd-position-code]');
  const positionName = root.querySelector('[data-sctd-position-name]');
  if (
    !stage ||
    !story ||
    !controls ||
    !viewport ||
    items.length !== 4 ||
    plates.length !== 4 ||
    accordions.some((control) => !control) ||
    panels.some((panel) => !panel) ||
    links.some((link) => !link)
  ) {
    delete root.dataset.sctdInit;
    return () => {};
  }

  const desktop = window.matchMedia('(min-width: 1100px)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const listeners = [];
  const on = (target, type, handler, options) => {
    target?.addEventListener(type, handler, options);
    listeners.push(() => target?.removeEventListener(type, handler, options));
  };

  let mode = 'static';
  let active = 0;
  let picked = false;
  let progress = 0;
  let start = 0;
  let range = 1;
  let frame = 0;
  let needsMeasure = true;
  let destroyed = false;
  let visible = true;
  let swipeStart = null;
  let suppressClick = false;
  let suppressTimer = 0;
  let syncedState = '';

  const layerMeta = items.map((item, index) => ({
    code: item.querySelector('.sctd-code')?.textContent?.trim() || '',
    name: item.querySelector('.sctd-name')?.textContent?.trim() || '',
    aria: plates[index]?.getAttribute('aria-label') || '',
  }));
  const direction = document.documentElement.lang === 'ro'
    ? { previous: 'Nivelul anterior', next: 'Nivelul următor' }
    : { previous: 'Previous layer', next: 'Next layer' };

  const resetTimelineStyles = () => {
    root.style.setProperty('--sctd-intro-opacity', '1');
    root.style.setProperty('--sctd-intro-y', '0px');
    root.style.setProperty('--sctd-story-opacity', '1');
    root.style.setProperty('--sctd-story-y', '0px');
    root.style.setProperty('--sctd-note-opacity', '1');
    root.style.setProperty('--sctd-note-y', '0px');
    root.style.setProperty('--sctd-controls-opacity', mode === 'static' ? '0' : '1');
    root.style.setProperty('--sctd-controls-y', '0px');
    root.style.setProperty('--sctd-route-offset', '0');
    root.style.setProperty('--sctd-route-opacity', '0.5');
    root.style.setProperty('--sctd-camera-scale', '1');
    for (let index = 0; index < 4; index += 1) {
      root.style.setProperty(`--sctd-lift-${index}`, '0px');
      root.style.setProperty(`--sctd-alpha-${index}`, '1');
    }
  };

  const syncActive = (contentAvailable = true, railAvailable = true, visualActive = true) => {
    const stateKey = `${mode}:${active}:${Number(contentAvailable)}:${Number(railAvailable)}:${Number(visualActive)}`;
    if (stateKey === syncedState) return;
    syncedState = stateKey;
    plates.forEach((plate, index) => {
      const isActive = index === active;
      plate.classList.toggle('is-active', visualActive && isActive);
      plate.disabled = mode === 'cinematic' && !railAvailable;
      plate.setAttribute('aria-expanded', String(mode === 'static' || isActive));
    });
    callouts.forEach((callout, index) => {
      callout.classList.toggle('is-active', visualActive && index === active);
    });
    items.forEach((item, index) => {
      const isActive = index === active;
      item.classList.toggle('is-active', visualActive && isActive);
      accordions[index].disabled = mode === 'cinematic';
      accordions[index]?.setAttribute('aria-expanded', String(mode === 'static' || isActive));

      if (mode === 'compact') {
        panels[index]?.toggleAttribute('hidden', !isActive);
        panels[index]?.toggleAttribute('inert', !isActive);
        item.removeAttribute('inert');
        item.removeAttribute('aria-hidden');
      } else if (mode === 'cinematic') {
        panels[index]?.removeAttribute('hidden');
        panels[index]?.removeAttribute('inert');
        item.toggleAttribute('inert', !contentAvailable || !isActive);
        item.setAttribute('aria-hidden', String(!contentAvailable || !isActive));
      } else {
        panels[index]?.removeAttribute('hidden');
        panels[index]?.removeAttribute('inert');
        item.removeAttribute('inert');
        item.removeAttribute('aria-hidden');
      }
    });

    if (prev) prev.disabled = active === 0;
    if (next) next.disabled = active === items.length - 1;
    prev?.setAttribute('aria-label', `${direction.previous} — ${layerMeta[Math.max(0, active - 1)].aria}`);
    next?.setAttribute('aria-label', `${direction.next} — ${layerMeta[Math.min(items.length - 1, active + 1)].aria}`);
    if (positionCode) positionCode.textContent = layerMeta[active].code;
    if (positionName) positionName.textContent = layerMeta[active].name;
    root.style.setProperty('--sctd-rail-x', `${active * -100}%`);

    if (controls) {
      controls.hidden = mode === 'static';
      controls.toggleAttribute('inert', mode === 'cinematic' && !railAvailable);
      controls.setAttribute('aria-hidden', String(mode === 'cinematic' && !railAvailable));
    }
  };

  const setActive = (nextIndex, byUser = false) => {
    if (mode === 'cinematic' && progress < SCTD_SCENES.railStart && byUser) return;
    const resolved = sctdClamp(nextIndex, 0, items.length - 1);
    if (byUser) picked = true;
    active = resolved;
    syncActive(true, mode !== 'cinematic' || progress >= SCTD_SCENES.railStart);
  };

  const storyAt = (value) => {
    const entries = [
      { index: 0, bounds: SCTD_SCENES.upperL4 },
      { index: 1, bounds: SCTD_SCENES.upperL3 },
      { index: 2, bounds: SCTD_SCENES.lowerL2 },
      { index: 3, bounds: SCTD_SCENES.lowerL1 },
    ];
    let best = { index: active, opacity: 0 };
    entries.forEach((entry) => {
      const opacity = sctdWindow(value, entry.bounds[0], entry.bounds[1]);
      if (opacity > best.opacity) best = { index: entry.index, opacity };
    });
    return best;
  };

  const renderCinematic = () => {
    progress = sctdClamp((window.scrollY - start) / range);
    const introExit = sctdSmoothstep(0.06, SCTD_SCENES.introEnd, progress);
    const upper = sctdWindow(progress, 0.15, 0.415, 0.04);
    const lower = sctdWindow(progress, 0.485, 0.72, 0.04);
    const firstWorld = sctdWindow(progress, ...SCTD_SCENES.world, 0.025);
    const aligned = sctdWindow(progress, ...SCTD_SCENES.aligned, 0.03);
    const noteOpacity = Math.max(firstWorld, aligned);
    const rail = sctdSmoothstep(SCTD_SCENES.railStart, SCTD_SCENES.railReady, progress);
    const open = sctdSmoothstep(0.08, 0.27, progress);
    const route = 0.32 + sctdSmoothstep(0.18, 0.46, progress) * 0.68;
    const storyState = storyAt(progress);
    const focusedItem = document.activeElement?.closest?.('[data-sctd-item]');
    const focusedIndex = focusedItem ? Number(focusedItem.dataset.layer) : -1;
    const controlsHaveFocus = controls.contains(document.activeElement);

    if (controlsHaveFocus) {
      picked = true;
    } else if (focusedIndex >= 0) {
      active = focusedIndex;
      if (progress >= SCTD_SCENES.railStart) picked = true;
    } else if (progress < SCTD_SCENES.railStart) {
      picked = false;
      active = storyState.index;
    } else if (!picked && progress >= SCTD_SCENES.railStart) {
      active = 0;
    }

    const storyOpacity = Math.max(storyState.opacity, rail);
    const storyHasFocus = story?.contains(document.activeElement);
    const storyAvailable = storyOpacity > 0.08 || storyHasFocus;
    const railAvailable = rail > 0.55 || controlsHaveFocus;

    root.dataset.sctdBeat = progress < 0.18
      ? 'hero'
      : progress < 0.3
        ? 'upper-l4'
        : progress < 0.405
          ? 'upper-l3'
          : progress < 0.5
            ? 'world'
            : progress < 0.61
              ? 'lower-l2'
              : progress < 0.705
                ? 'lower-l1'
                : progress < 0.82
                  ? 'aligned'
                  : 'catalog';

    root.style.setProperty('--sctd-intro-opacity', String(1 - introExit));
    root.style.setProperty('--sctd-intro-y', `${-18 * introExit}px`);
    const presentedStoryOpacity = storyHasFocus ? Math.max(storyOpacity, 1) : storyOpacity;
    root.style.setProperty('--sctd-story-opacity', String(presentedStoryOpacity));
    root.style.setProperty('--sctd-story-y', `${14 * (1 - presentedStoryOpacity)}px`);
    root.style.setProperty('--sctd-note-opacity', String(storyHasFocus ? 0 : noteOpacity * (1 - rail)));
    root.style.setProperty('--sctd-note-y', `${12 * (1 - noteOpacity)}px`);
    root.style.setProperty('--sctd-controls-opacity', String(controlsHaveFocus ? 1 : rail));
    root.style.setProperty('--sctd-controls-y', `${controlsHaveFocus ? 0 : 10 * (1 - rail)}px`);
    root.style.setProperty('--sctd-route-offset', String(1 - route));
    root.style.setProperty('--sctd-route-opacity', String(0.28 + route * 0.36));
    root.style.setProperty('--sctd-camera-scale', String(1 + sctdSmoothstep(0.08, 0.44, progress) * (1 - sctdSmoothstep(0.68, 0.8, progress)) * 0.022));

    const baseLift = [-12, -4, 4, 12];
    const upperLift = [-6, -2, 4, 7];
    const lowerLift = [-7, -4, 2, 6];
    for (let index = 0; index < 4; index += 1) {
      const focus = index === active ? storyOpacity : 0;
      const lift = baseLift[index] * open + upperLift[index] * upper + lowerLift[index] * lower - 5 * focus;
      const contextualFade = index > 1 ? upper * 0.38 : lower * 0.32;
      root.style.setProperty(`--sctd-lift-${index}`, `${lift.toFixed(2)}px`);
      root.style.setProperty(`--sctd-alpha-${index}`, String(1 - contextualFade));
    }
    syncActive(storyAvailable, railAvailable, storyOpacity > 0.08);
  };

  const measure = () => {
    needsMeasure = false;
    const nextMode = reduce.matches ? 'static' : desktop.matches ? 'cinematic' : 'compact';
    const changed = nextMode !== mode;
    mode = nextMode;
    root.dataset.sctdMode = mode;
    if (changed) {
      active = 0;
      picked = false;
    }
    resetTimelineStyles();
    const rect = root.getBoundingClientRect();
    const navOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 0;
    start = rect.top + window.scrollY - navOffset;
    range = Math.max(1, root.offsetHeight - stage.offsetHeight);
    if (mode !== 'cinematic') {
      delete root.dataset.sctdBeat;
      progress = 0;
      syncActive(true, true, mode === 'compact');
    }
  };

  const render = () => {
    frame = 0;
    if (destroyed) return;
    if (needsMeasure) measure();
    if (mode === 'cinematic') renderCinematic();
  };
  const request = () => {
    if (!frame && !destroyed) frame = window.requestAnimationFrame(render);
  };
  const requestMeasure = () => {
    needsMeasure = true;
    request();
  };

  root.querySelectorAll('[data-sctd-select]').forEach((selector) => {
    on(selector, 'click', () => setActive(Number(selector.closest('[data-layer]')?.dataset.layer), true));
  });
  on(prev, 'click', () => setActive(active - 1, true));
  on(next, 'click', () => setActive(active + 1, true));
  on(root, 'keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (mode !== 'cinematic' || progress < SCTD_SCENES.railStart) return;
    event.preventDefault();
    const delta = event.key === 'ArrowLeft' ? -1 : 1;
    setActive(active + delta, true);
    if (event.target.closest?.('[data-sctd-item]')) {
      const focusTarget = mode === 'cinematic' ? links[active] : accordions[active];
      focusTarget?.focus({ preventScroll: true });
    }
  });
  on(viewport, 'pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    if (mode === 'cinematic' && progress < SCTD_SCENES.railStart) return;
    swipeStart = { x: event.clientX, y: event.clientY };
  }, { passive: true });
  on(viewport, 'pointerup', (event) => {
    if (!swipeStart || event.pointerType === 'mouse') return;
    const dx = event.clientX - swipeStart.x;
    const dy = event.clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    suppressClick = true;
    window.clearTimeout(suppressTimer);
    suppressTimer = window.setTimeout(() => { suppressClick = false; }, 350);
    setActive(active + (dx < 0 ? 1 : -1), true);
  }, { passive: true });
  on(viewport, 'pointercancel', () => {
    swipeStart = null;
  }, { passive: true });
  on(viewport, 'click', (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    suppressClick = false;
  }, true);
  on(window, 'scroll', () => {
    if (visible) request();
  }, { passive: true });
  on(window, 'resize', requestMeasure, { passive: true });
  on(desktop, 'change', requestMeasure);
  on(reduce, 'change', requestMeasure);
  on(story, 'focusin', request);
  on(story, 'focusout', request);

  const intersection = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (visible || mode === 'cinematic') request();
  }, { rootMargin: '200px 0px' });
  intersection.observe(root);
  const resizeObserver = new ResizeObserver(requestMeasure);
  resizeObserver.observe(root);
  requestMeasure();

  return () => {
    destroyed = true;
    if (frame) window.cancelAnimationFrame(frame);
    window.clearTimeout(suppressTimer);
    intersection.disconnect();
    resizeObserver.disconnect();
    listeners.forEach((cleanup) => cleanup());
    controls.hidden = true;
    controls.removeAttribute('inert');
    controls.removeAttribute('aria-hidden');
    items.forEach((item, index) => {
      item.classList.remove('is-active');
      item.removeAttribute('inert');
      item.removeAttribute('aria-hidden');
      panels[index]?.removeAttribute('hidden');
      panels[index]?.removeAttribute('inert');
      accordions[index].disabled = true;
      accordions[index]?.setAttribute('aria-expanded', 'true');
    });
    plates.forEach((plate) => {
      plate.classList.remove('is-active');
      plate.disabled = true;
      plate.setAttribute('aria-expanded', 'false');
    });
    callouts.forEach((callout) => callout.classList.remove('is-active'));
    delete root.dataset.sctdInit;
    delete root.dataset.sctdMode;
    delete root.dataset.sctdBeat;
    root.removeAttribute('style');
  };
}
