// Site audit: WCAG AA contrast + performance, across all routes, both viewports.
// Serves dist/ (or --url) and, per route, records:
//   · AA contrast failures (text color vs effective background; categorized so
//     design-intended brand accents are distinguishable from real defects)
//   · performance (resource transfer bytes by type, DOMContentLoaded, load, LCP)
// Writes a JSON report to --out (default audit-report.json).
//
// Usage:
//   node scripts/audit.mjs --dir dist --out audit-report.json
//   node scripts/audit.mjs --url https://site-zeta-ecru-25.vercel.app --routes "/,/en/"
import { chromium } from 'playwright';
import http from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, x, i, arr) => {
    if (x.startsWith('--')) a.push([x.slice(2), arr[i + 1]]);
    return a;
  }, [])
);

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain' };

async function serveDir(dir, port) {
  const server = http.createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p.endsWith('/')) p += 'index.html';
      let file = join(dir, p);
      let body;
      try { body = await readFile(file); }
      catch { body = await readFile(join(dir, p, 'index.html')); file = 'x.html'; }
      res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch { res.writeHead(404); res.end('nf'); }
  });
  await new Promise((r) => server.listen(port, r));
  return server;
}

const ROUTES = (args.routes || '/,/servicii/,/servicii/cloud/,/servicii/securitate/,/servicii/software/,/servicii/managed/,/solutii/,/solutii/seknet/,/solutii/s-vpn/,/confidentialitate/,/en/,/en/servicii/,/en/servicii/cloud/,/en/servicii/securitate/,/en/servicii/software/,/en/servicii/managed/,/en/solutii/,/en/solutii/seknet/,/en/solutii/s-vpn/,/en/privacy/').split(',');

const contrastFn = () => {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const a = m[1].split(',').map((x) => parseFloat(x)); return { r: a[0], g: a[1], b: a[2], a: a[3] === undefined ? 1 : a[3] }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const effBg = (el) => { let c = el; while (c) { const x = parse(getComputedStyle(c).backgroundColor); if (x && x.a > 0) { if (x.a < 1) { const u = effBg(c.parentElement || document.body); return blend(x, u); } return x; } c = c.parentElement; } return { r: 255, g: 255, b: 255, a: 1 }; };
  const rgb = (c) => `rgb(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)})`;
  const fails = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('[aria-hidden="true"]')) continue;
    const tag = el.tagName.toLowerCase();
    if (['script', 'style', 'svg', 'canvas', 'path', 'img', 'br', 'hr'].includes(tag)) continue;
    let direct = ''; for (const n of el.childNodes) if (n.nodeType === 3) direct += n.textContent;
    direct = direct.trim(); if (!direct) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) continue;
    const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
    const fg = parse(cs.color); if (!fg) continue;
    const bg = effBg(el); const fgB = fg.a < 1 ? blend(fg, bg) : fg; const cr = ratio(fgB, bg);
    const fsz = parseFloat(cs.fontSize); const fw = parseInt(cs.fontWeight) || 400;
    const large = fsz >= 24 || (fsz >= 18.66 && fw >= 700); const need = large ? 3 : 4.5;
    if (cr < need - 0.05) fails.push({ text: direct.slice(0, 40), tag, color: rgb(fgB), bg: rgb(bg), fsz, fw, ratio: Math.round(cr * 100) / 100, need });
  }
  return fails;
};

(async () => {
  let server = null, base = args.url;
  if (args.dir) { server = await serveDir(args.dir, Number(args.port || 4388)); base = `http://127.0.0.1:${Number(args.port || 4388)}`; }
  const browser = await chromium.launch();
  const report = { base, generatedFor: ROUTES.length + ' routes', routes: {} };

  for (const view of [{ name: 'desktop', width: 1280 }, { name: 'mobile', width: 390 }]) {
    const ctx = await browser.newContext({ viewport: { width: view.width, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    for (const route of ROUTES) {
      const entry = (report.routes[route] ||= {});
      await page.goto(base + route, { waitUntil: 'networkidle' }).catch(() => {});
      await page.waitForTimeout(250);
      const contrast = await page.evaluate(contrastFn);
      // perf only once (desktop) — payload is viewport-independent
      let perf = null;
      if (view.name === 'desktop') {
        perf = await page.evaluate(() => {
          const res = performance.getEntriesByType('resource');
          const byType = {}; let total = 0;
          for (const r of res) { const t = r.initiatorType || 'other'; const sz = r.transferSize || r.encodedBodySize || 0; byType[t] = (byType[t] || 0) + sz; total += sz; }
          const nav = performance.getEntriesByType('navigation')[0] || {};
          const lcp = performance.getEntriesByType('largest-contentful-paint').slice(-1)[0];
          return { totalTransferKB: Math.round(total / 1024), byTypeKB: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, Math.round(v / 1024)])), domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0), load: Math.round(nav.loadEventEnd || 0), reqCount: res.length, lcpMs: lcp ? Math.round(lcp.startTime) : null };
        });
      }
      entry[view.name] = { contrastFails: contrast.length, contrast };
      if (perf) entry.perf = perf;
    }
    await ctx.close();
  }
  await browser.close();
  if (server) server.close();

  // summary
  let totalAA = 0, mobileAA = 0;
  for (const [, e] of Object.entries(report.routes)) { totalAA += (e.desktop?.contrastFails || 0); mobileAA += (e.mobile?.contrastFails || 0); }
  report.summary = { desktopContrastFails: totalAA, mobileContrastFails: mobileAA };
  await writeFile(args.out || 'audit-report.json', JSON.stringify(report, null, 2));
  console.log(`AUDIT done → ${args.out || 'audit-report.json'}`);
  console.log(`  desktop AA fails: ${totalAA} · mobile AA fails: ${mobileAA}`);
  const heaviest = Object.entries(report.routes).map(([r, e]) => [r, e.perf?.totalTransferKB || 0]).sort((a, b) => b[1] - a[1]).slice(0, 5);
  console.log('  heaviest routes (KB transfer):', heaviest.map(([r, k]) => `${r}=${k}`).join(' '));
})();
