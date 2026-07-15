// SmartControl.ro — shared motion utilities. All return cleanup callbacks.
export function reducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function initReveals(root) {
  if (!root || reducedMotion()) return () => {};
  const pending = [...root.querySelectorAll('[data-reveal]')].filter((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.88) return false;
    el.style.opacity = '0'; el.style.transform = 'translateY(24px)'; return true;
  });
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target; const delay = Number(el.getAttribute('data-reveal-delay') || 0);
    el.style.transition = `opacity .5s ease-out ${delay}ms, transform .6s cubic-bezier(.16,1,.3,1) ${delay}ms`;
    el.style.opacity = '1'; el.style.transform = 'translateY(0)'; io.unobserve(el);
  }), { threshold: 0.12 });
  pending.forEach((el) => io.observe(el)); return () => io.disconnect();
}

export function initCounters(root) {
  if (!root || reducedMotion()) return () => {};
  const els = root.querySelectorAll('[data-count]');
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return; const el = e.target; io.unobserve(el);
    const target = Number(el.getAttribute('data-count')) || 0; const start = performance.now();
    const tick = (now) => { const p = Math.min(1, (now-start)/1400); el.textContent = String(Math.round(target*(1-Math.pow(1-p,3)))); if (p<1) requestAnimationFrame(tick); };
    el.textContent='0'; requestAnimationFrame(tick);
  }), { threshold: .5 });
  els.forEach((el) => io.observe(el)); return () => io.disconnect();
}

export function initNavShrink(nav, opts={}) {
  if (!nav) return () => {}; const big=opts.padBig||'18px 40px'; const small=opts.padSmall||'11px 40px';
  const update=()=>{ const on=window.scrollY>24; nav.style.padding=on?small:big; nav.style.boxShadow=on?'0 2px 12px rgba(14,31,91,.08)':'none'; nav.style.borderBottomColor=on?'#E5E7EB':'transparent'; };
  window.addEventListener('scroll',update,{passive:true}); update(); return ()=>window.removeEventListener('scroll',update);
}

export function initStepper(container, fill, opts={}) {
  if (!container||!fill) return ()=>{}; const dark=!!opts.dark; const steps=container.querySelectorAll('[data-step]');
  const update=()=>{ const rect=container.getBoundingClientRect(); const px=Math.max(0,Math.min(rect.height,window.innerHeight*.55-rect.top)); fill.style.height=`${px}px`;
    steps.forEach((step)=>{ const dot=step.querySelector('[data-step-dot]'); const body=step.querySelector('[data-step-body]'); const active=px>=step.offsetTop+(dot?dot.offsetTop+dot.offsetHeight/2:26)||reducedMotion();
      if(dot){dot.style.borderColor=active?'#4487DC':(dark?'rgba(122,180,232,.25)':'#D6E8F7');dot.style.color=active?(dark?'#fff':'#0E1F5B'):(dark?'rgba(226,233,245,.45)':'#9CA3AF');dot.style.background=active?(dark?'rgba(68,135,220,.16)':'#EDF5FC'):(dark?'#040C2B':'#fff');}
      if(body) body.style.opacity=active?'1':'.45'; }); };
  window.addEventListener('scroll',update,{passive:true}); window.addEventListener('resize',update); update(); return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);};
}

export function initEmails(root) {
  root?.querySelectorAll('[data-email-user]').forEach((el)=>{ const address=`${el.getAttribute('data-email-user')}@${el.getAttribute('data-email-domain')}`; if(el.tagName==='A'){const subject=el.getAttribute('data-email-subject');el.setAttribute('href',`mailto:${address}${subject?`?subject=${encodeURIComponent(subject)}`:''}`);} if(!el.textContent.trim())el.textContent=address; });
}
