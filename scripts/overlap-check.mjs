// Mobile overlap detector. Loads each route at a phone width with MOTION ENABLED
// (no reduced-motion), scrolls through in steps, and at each scroll position
// measures vertical overlap between motion-transformed elements ([data-drift] /
// [data-parallax]) and their adjacent block siblings — the failure mode where
// drift (±44px translateY) pushes a stacked mobile card into its neighbor.
// Also does a general stacked-card overlap sweep. Reports the worst overlap seen.
//
// Usage: node scripts/overlap-check.mjs --dir dist [--width 390] [--routes "/,/en/"]
import { chromium } from 'playwright';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => { if (x.startsWith('--')) a.push([x.slice(2), arr[i + 1]]); return a; }, []));
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain' };
async function serveDir(dir, port) {
  const s = http.createServer(async (req, res) => {
    try { let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html'; let f = join(dir, p), b;
      try { b = await readFile(f); } catch { b = await readFile(join(dir, p, 'index.html')); f = 'x.html'; }
      res.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' }); res.end(b);
    } catch { res.writeHead(404); res.end('nf'); }
  });
  await new Promise((r) => s.listen(port, r)); return s;
}

const ROUTES = (args.routes || '/,/servicii/,/servicii/cloud/,/servicii/securitate/,/servicii/software/,/servicii/managed/,/solutii/,/solutii/seknet/,/solutii/s-vpn/,/confidentialitate/,/en/,/en/servicii/,/en/servicii/cloud/,/en/servicii/securitate/,/en/servicii/software/,/en/servicii/managed/,/en/solutii/,/en/solutii/seknet/,/en/solutii/s-vpn/,/en/privacy/').split(',');
const WIDTH = Number(args.width || 390);

const detect = () => {
  const desc = (el) => {
    const t = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    const cls = (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '').toString().slice(0, 40);
    return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''} "${t}"`;
  };
  const vis = (el) => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    if (!(r.width > 4 && r.height > 4) || cs.visibility === 'hidden' || cs.display === 'none') return false;
    // Skip decorative background layers: absolutely/fixed-positioned, aria-hidden,
    // or non-interactive empty-text layers (parallax blobs, network canvas).
    if (cs.position === 'absolute' || cs.position === 'fixed') return false;
    if (el.closest('[aria-hidden="true"]')) return false;
    if (cs.pointerEvents === 'none' && !(el.textContent || '').trim()) return false;
    return true;
  };
  const out = [];
  // 1) motion (content) elements vs adjacent block siblings
  document.querySelectorAll('[data-drift],[data-parallax]').forEach((el) => {
    if (!vis(el)) return;
    const r = el.getBoundingClientRect();
    for (const sib of [el.previousElementSibling, el.nextElementSibling]) {
      if (!sib || !vis(sib)) continue;
      const sr = sib.getBoundingClientRect();
      // vertical overlap between the two stacked boxes
      const ov = Math.min(r.bottom, sr.bottom) - Math.max(r.top, sr.top);
      // only count when they're vertically stacked (similar x) and overlap > 4px
      const xOverlap = Math.min(r.right, sr.right) - Math.max(r.left, sr.left);
      if (ov > 4 && xOverlap > r.width * 0.5) out.push({ type: 'drift-sibling', a: desc(el), b: desc(sib), overlapPx: Math.round(ov) });
    }
  });
  return out;
};

(async () => {
  let server = null, base = args.url;
  // Port: explicit --port, else an ephemeral OS-assigned port (0) so concurrent
  // runs (e.g. parallel per-route agents) don't collide on a fixed port.
  if (args.dir) { server = await serveDir(args.dir, Number(args.port || 0)); base = `http://127.0.0.1:${server.address().port}`; }
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 780 } }); // motion ENABLED
  const page = await ctx.newPage();
  const report = {};
  for (const route of ROUTES) {
    await page.goto(base + route, { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(300);
    const h = await page.evaluate(() => document.body.scrollHeight);
    const worst = {};
    for (let y = 0; y <= h; y += 320) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(160); // let drift settle toward target
      const found = await page.evaluate(detect);
      for (const f of found) {
        const key = f.a + ' || ' + f.b;
        if (!worst[key] || f.overlapPx > worst[key].overlapPx) worst[key] = f;
      }
    }
    const list = Object.values(worst).filter((f) => f.overlapPx > 6);
    if (list.length) report[route] = list;
  }
  await browser.close();
  if (server) server.close();
  const total = Object.values(report).reduce((n, l) => n + l.length, 0);
  console.log(JSON.stringify({ width: WIDTH, totalOverlaps: total, byRoute: report }, null, 1));
})();
