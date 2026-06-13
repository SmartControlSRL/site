// Screenshot harness for the visual-review loop.
// Serves a static dir (or uses an existing URL) and captures full-page shots,
// scrolling through each page first so IntersectionObserver-driven reveals
// (data-reveal / word-fill / counters) have fired before capture.
//
// Usage:
//   node scripts/screenshot.mjs --dir dist --routes "/,/solutii/seknet" --out shots/built --widths 1280,768,390
//   node scripts/screenshot.mjs --url http://localhost:4321 --routes "/" --out shots
//   node scripts/screenshot.mjs --dir "docs/SMC Web" --routes "/Home.dc.html" --out shots/ref --widths 1280
import { chromium } from 'playwright';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, [])
);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
};

async function serveDir(dir, port) {
  const server = http.createServer(async (req, res) => {
    try {
      let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (path.endsWith('/')) path += 'index.html';
      let file = join(dir, path);
      let body;
      try {
        body = await readFile(file);
      } catch {
        // Astro static routes: /foo -> /foo/index.html
        body = await readFile(join(dir, path, 'index.html'));
        file = 'index.html';
      }
      res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end('not found');
    }
  });
  await new Promise((r) => server.listen(port, r));
  return server;
}

const widths = (args.widths || '1280').split(',').map(Number);
const routes = args.routes.split(',');
mkdirSync(args.out, { recursive: true });

let server = null;
let base = args.url;
if (args.dir) {
  const port = Number(args.port || 4399);
  server = await serveDir(args.dir, port);
  base = `http://127.0.0.1:${port}`;
}

const browser = await chromium.launch();
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const route of routes) {
    const slug =
      (route.replace(/[\/.]+/g, '-').replace(/^-|-$/g, '') || 'index') + `@${width}`;
    await page.goto(base + route, { waitUntil: 'networkidle', timeout: 30000 }).catch(async () => {
      await page.goto(base + route, { waitUntil: 'load', timeout: 30000 });
    });
    await page.waitForTimeout(800);
    // Scroll through in viewport steps to fire every IntersectionObserver.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.7;
      const max = document.body.scrollHeight;
      for (let y = 0; y <= max; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 300));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 600));
    });
    // Let word-fill settle transitions finish.
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${args.out}/${slug}.png`, fullPage: true });
    console.log(`shot ${slug}`);
  }
  await page.close();
}
await browser.close();
if (server) server.close();
console.log('DONE');
