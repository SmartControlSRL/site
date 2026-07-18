// Privacy-page reading progress and current-section state. The complete TOC and
// policy are server rendered; this module only enhances state feedback.
export function initLegalReader(root) {
  if (!root || root.dataset.legalInit) return () => {};
  root.dataset.legalInit = '1';
  const article = root.querySelector('[data-legal-article]');
  const progress = root.querySelector('[data-legal-progress]');
  const links = [...root.querySelectorAll('[data-legal-toc] a[href^="#"]')];
  const headings = links.map((link) => article?.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (!article || !progress || !links.length || !headings.length) {
    delete root.dataset.legalInit;
    return () => {};
  }
  let frame = 0;
  let destroyed = false;
  const render = () => {
    frame = 0;
    if (destroyed) return;
    const rect = article.getBoundingClientRect();
    const range = Math.max(1, rect.height - window.innerHeight * 0.45);
    const value = Math.min(1, Math.max(0, (-rect.top + window.innerHeight * 0.2) / range));
    progress.style.setProperty('--legal-progress', value.toFixed(4));
    const threshold = Math.min(window.innerHeight * 0.34, 280);
    let active = 0;
    headings.forEach((heading, index) => { if (heading.getBoundingClientRect().top <= threshold) active = index; });
    links.forEach((link, index) => {
      link.classList.toggle('is-current', index === active);
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const request = () => { if (!frame && !destroyed) frame = requestAnimationFrame(render); };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  request();
  return () => {
    destroyed = true;
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener('scroll', request);
    window.removeEventListener('resize', request);
    progress.style.removeProperty('--legal-progress');
    links.forEach((link) => { link.classList.remove('is-current'); link.removeAttribute('aria-current'); });
    delete root.dataset.legalInit;
  };
}
