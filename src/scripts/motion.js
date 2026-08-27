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
  if (!nav) return () => {}; const big=opts.padBig||'18px'; const small=opts.padSmall||'11px';
  const update=()=>{ const on=window.scrollY>24; nav.style.paddingBlock=on?small:big; nav.style.boxShadow=on?'0 2px 12px rgba(14,31,91,.08)':'none'; nav.style.borderBottomColor=on?'#E5E7EB':'transparent'; };
  window.addEventListener('scroll',update,{passive:true}); update(); return ()=>window.removeEventListener('scroll',update);
}

export function initStepper(container, fill, opts={}) {
  if (!container||!fill) return ()=>{}; const dark=!!opts.dark; const steps=container.querySelectorAll('[data-step]');
  const update=()=>{ const rect=container.getBoundingClientRect(); const px=Math.max(0,Math.min(rect.height,window.innerHeight*.55-rect.top)); fill.style.height=`${px}px`;
    steps.forEach((step)=>{ const dot=step.querySelector('[data-step-dot]'); const body=step.querySelector('[data-step-body]'); const active=px>=step.offsetTop+(dot?dot.offsetTop+dot.offsetHeight/2:26)||reducedMotion();
      step.dataset.stepState=active?'active':'inactive';
      if(dot){dot.style.borderColor=active?'var(--color-bright)':(dark?'color-mix(in srgb,var(--color-sky) 55%,transparent)':'var(--color-border-blue)');dot.style.color=active?(dark?'var(--color-surface)':'var(--color-navy)'):(dark?'var(--color-on-dark)':'var(--color-royal)');dot.style.background=active?(dark?'color-mix(in srgb,var(--color-bright) 16%,transparent)':'var(--color-blue-wash)'):(dark?'var(--color-midnight)':'var(--color-surface)');dot.style.boxShadow=active?'0 0 0 3px color-mix(in srgb,var(--color-bright) 16%,transparent)':'none';}
      if(body) body.style.removeProperty('opacity'); }); };
  window.addEventListener('scroll',update,{passive:true}); window.addEventListener('resize',update); update(); return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);};
}

// StackTeardown uses one interaction model: four native disclosure buttons.
// Tab follows document order and Enter/Space use native button behavior. The
// decorative plates mirror state only. Ambient cycling pauses while pointer or
// focus is inside, and any explicit selection pauses it until the user resumes.
export function initStackTeardown(root) {
  if (!root || root.dataset.sctdInit) return () => {};
  root.dataset.sctdInit = '1';

  const triggers = [...root.querySelectorAll('[data-sctd-trigger]')];
  const rows = [...root.querySelectorAll('.sctd-row[data-layer]')];
  const plates = [...root.querySelectorAll('.sctd-plate[data-layer]')];
  const callouts = [...root.querySelectorAll('.sctd-callout[data-layer]')];
  const cycleControl = root.querySelector('[data-sctd-cycle]');
  const cycleLabel = cycleControl?.querySelector('[data-sctd-cycle-label]');
  if (!triggers.length) {
    delete root.dataset.sctdInit;
    return () => {};
  }
  const cleanups = [];
  let active = Math.max(0, triggers.findIndex((trigger) => trigger.getAttribute('aria-expanded') === 'true'));
  let pointerInside = false;
  let focusInside = root.contains(document.activeElement);
  let userPaused = false;
  let timer = 0;

  const listen = (target, event, handler) => {
    target?.addEventListener(event, handler);
    cleanups.push(() => target?.removeEventListener(event, handler));
  };
  const syncCycleControl = () => {
    if (!cycleControl || !cycleLabel) return;
    cycleLabel.textContent = userPaused
      ? cycleControl.dataset.resumeLabel
      : cycleControl.dataset.pauseLabel;
  };
  const apply = (next) => {
    active = ((next % triggers.length) + triggers.length) % triggers.length;
    for (const el of [...rows, ...plates, ...callouts]) {
      const index = Number(el.dataset.layer);
      el.classList.toggle('is-active', index === active);
      el.classList.toggle('is-above', index < active);
    }
    triggers.forEach((trigger, index) => {
      const expanded = index === active;
      trigger.setAttribute('aria-expanded', String(expanded));
      const panelId = trigger.getAttribute('aria-controls');
      const panel = panelId ? root.querySelector(`#${CSS.escape(panelId)}`) : null;
      if (panel) {
        panel.hidden = !expanded;
        panel.toggleAttribute('inert', !expanded);
      }
    });
  };
  const choose = (index) => {
    userPaused = true;
    const focusedPanel = document.activeElement?.closest?.('.sctd-panel');
    if (focusedPanel && focusedPanel.id !== triggers[index]?.getAttribute('aria-controls')) {
      triggers[index]?.focus({ preventScroll: true });
    }
    apply(index);
    syncCycleControl();
  };

  triggers.forEach((trigger, index) => {
    listen(trigger, 'click', () => choose(index));
  });
  listen(root, 'pointerenter', () => { pointerInside = true; });
  listen(root, 'pointerleave', () => { pointerInside = false; });
  listen(root, 'focusin', () => { focusInside = true; });
  listen(root, 'focusout', (event) => { focusInside = root.contains(event.relatedTarget); });
  listen(cycleControl, 'click', () => {
    userPaused = !userPaused;
    syncCycleControl();
  });

  if (!reducedMotion() && triggers.length > 1 && cycleControl) {
    cycleControl.hidden = false;
    timer = window.setInterval(() => {
      if (!root.isConnected) {
        window.clearInterval(timer);
        timer = 0;
      } else if (!pointerInside && !focusInside && !userPaused) {
        apply(active + 1);
      }
    }, 3200);
  }

  apply(active);
  syncCycleControl();
  return () => {
    if (timer) window.clearInterval(timer);
    cleanups.forEach((cleanup) => cleanup());
    delete root.dataset.sctdInit;
  };
}

export function initEmails(root) {
  root?.querySelectorAll('[data-email-user]').forEach((el)=>{
    const user=el.getAttribute('data-email-user'),domain=el.getAttribute('data-email-domain');
    if(!user||!domain)return;
    const address=`${user}@${domain}`;
    if(el.tagName==='A'&&(!el.getAttribute('href')||el.getAttribute('href')==='#')){
      const subject=el.getAttribute('data-email-subject');
      el.setAttribute('href',`mailto:${address}${subject?`?subject=${encodeURIComponent(subject)}`:''}`);
    }
    if(!el.textContent.trim()&&!el.getAttribute('aria-label'))el.textContent=address;
  });
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
