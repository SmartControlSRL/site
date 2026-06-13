// Deterministic link / hreflang / parity checker over the built dist/.
// Verifies: every internal href + src resolves to a built file; hreflang pairs
// point at existing pages; RO/EN route parity; sitemap covers all pages.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const pages = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const fp = join(dir, e);
    if (statSync(fp).isDirectory()) walk(fp);
    else if (e.endsWith('.html')) pages.push(fp);
  }
})(DIST);

const errors = [];
const routeOf = (fp) => '/' + fp.replace(/^dist\//, '').replace(/index\.html$/, '').replace(/\.html$/, '');

const resolves = (path) => {
  const clean = path.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return existsSync(join(DIST, 'index.html'));
  const c1 = join(DIST, clean);
  return (
    existsSync(c1) ||
    existsSync(join(DIST, clean, 'index.html')) ||
    existsSync(join(DIST, clean.replace(/\/$/, '') + '.html'))
  );
};

for (const fp of pages) {
  const html = readFileSync(fp, 'utf8');
  const route = routeOf(fp);

  // anchors with ids for fragment checking
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:|#$)/.test(url)) continue;
    if (url.startsWith('#')) {
      if (!ids.has(url.slice(1))) errors.push(`${route}: dead fragment ${url}`);
      continue;
    }
    if (!url.startsWith('/')) continue; // relative — astro emits absolute; skip
    if (!resolves(url)) errors.push(`${route}: broken internal link ${url}`);
  }

  // hreflang alternates must resolve
  for (const m of html.matchAll(/hreflang="(?:ro|en|x-default)" href="https:\/\/smartcontrol\.ro([^"]*)"/g)) {
    if (!resolves(m[1] || '/')) errors.push(`${route}: hreflang target missing ${m[1]}`);
  }
}

// RO/EN parity (privacy maps to a different EN slug)
const routes = new Set(pages.map(routeOf));
const map = { '/confidentialitate/': '/en/privacy/' };
for (const r of routes) {
  if (r.startsWith('/en/')) continue;
  const en = map[r] || ('/en' + r);
  if (!routes.has(en)) errors.push(`parity: ${r} has no EN twin ${en}`);
}
for (const r of routes) {
  if (!r.startsWith('/en/')) continue;
  const roFromMap = Object.entries(map).find(([, v]) => v === r)?.[0];
  const ro = roFromMap || r.replace(/^\/en/, '') || '/';
  if (!routes.has(ro)) errors.push(`parity: ${r} has no RO twin ${ro}`);
}

// sitemap coverage
const sm = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
for (const r of routes) {
  if (!sm.includes(`https://smartcontrol.ro${r}`)) errors.push(`sitemap: missing ${r}`);
}

if (errors.length) {
  console.log(errors.join('\n'));
  console.log(`\nFAIL: ${errors.length} problems`);
  process.exit(1);
}
console.log(`OK: ${pages.length} pages, all internal links/fragments/hreflang/parity/sitemap verified`);
