// Deterministic, section-local progress for Control Plane scenes. No scene
// owns a continuous loop: scroll/resize/visibility only request one shared
// frame, geometry is cached between measurements, and cleanup is explicit.
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function initControlScenes(root = document) {
  const elements = [...root.querySelectorAll('[data-control-scene],[data-control-chapter]')];
  if (!elements.length) return () => {};
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const entries = elements.map((element) => ({
    element,
    chapter: element.hasAttribute('data-control-chapter'),
    steps: [...element.querySelectorAll('[data-chapter-step]')],
    visible: true,
    top: 0,
    height: 1,
  }));
  let frame = 0;
  let measureNeeded = true;
  let destroyed = false;

  const measure = () => {
    measureNeeded = false;
    entries.forEach((entry) => {
      const rect = entry.element.getBoundingClientRect();
      entry.top = rect.top + window.scrollY;
      entry.height = Math.max(1, entry.element.offsetHeight);
    });
  };
  const render = () => {
    frame = 0;
    if (destroyed) return;
    if (measureNeeded) measure();
    const viewport = window.innerHeight;
    entries.forEach((entry) => {
      if (!entry.visible && !entry.chapter) return;
      const staticMode = reduce.matches;
      const start = entry.top - viewport * 0.76;
      const end = entry.top + entry.height - viewport * 0.28;
      const progress = staticMode ? 1 : clamp((window.scrollY - start) / Math.max(1, end - start));
      entry.element.style.setProperty('--scene-progress', progress.toFixed(4));
      if (entry.steps.length) {
        const index = staticMode ? entry.steps.length - 1 : Math.min(entry.steps.length - 1, Math.floor(progress * entry.steps.length));
        entry.element.style.setProperty('--scene-step', String(index));
        entry.element.dataset.sceneStep = String(index);
        entry.steps.forEach((step, stepIndex) => {
          const active = staticMode || stepIndex <= index;
          step.toggleAttribute('data-active', active);
          if (stepIndex === index) step.setAttribute('data-current', '');
          else step.removeAttribute('data-current');
        });
      }
    });
  };
  const request = () => { if (!frame && !destroyed && !document.hidden) frame = requestAnimationFrame(render); };
  const requestMeasure = () => { measureNeeded = true; request(); };

  const intersection = new IntersectionObserver((observed) => {
    observed.forEach((item) => {
      const entry = entries.find((candidate) => candidate.element === item.target);
      if (entry) entry.visible = item.isIntersecting;
    });
    request();
  }, { rootMargin: '180px 0px' });
  entries.forEach((entry) => intersection.observe(entry.element));
  const resize = new ResizeObserver(requestMeasure);
  entries.forEach((entry) => resize.observe(entry.element));
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', requestMeasure, { passive: true });
  reduce.addEventListener('change', requestMeasure);
  document.addEventListener('visibilitychange', request);
  requestMeasure();

  return () => {
    destroyed = true;
    if (frame) cancelAnimationFrame(frame);
    intersection.disconnect();
    resize.disconnect();
    window.removeEventListener('scroll', request);
    window.removeEventListener('resize', requestMeasure);
    reduce.removeEventListener('change', requestMeasure);
    document.removeEventListener('visibilitychange', request);
    entries.forEach((entry) => {
      entry.element.style.removeProperty('--scene-progress');
      entry.element.style.removeProperty('--scene-step');
      delete entry.element.dataset.sceneStep;
      entry.steps.forEach((step) => {
        step.removeAttribute('data-active');
        step.removeAttribute('data-current');
      });
    });
  };
}
