// Deterministic link / hreflang / parity checker over the built dist/.
// Verifies: every internal href + src resolves to a built file; hreflang pairs
// point at existing pages; RO/EN route parity; sitemap covers all real pages.
// The two locale-specific 404 files are deployment error documents rather
// than navigable routes. They remain fully link-checked, but are explicitly
// excluded from parity and sitemap expectations and must not emit route SEO.
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
const ERROR_DOCUMENT_ROUTES = new Set(['/404', '/en/404/']);
const ERROR_DOCUMENT_TARGETS = new Set(['/404', '/404/', '/en/404', '/en/404/']);
const LEGAL_HOLD_ROUTES = new Set(['/confidentialitate/', '/en/privacy/']);

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
    const targetPath = url.split('#')[0].split('?')[0];
    if (ERROR_DOCUMENT_TARGETS.has(targetPath)) {
      errors.push(`${route}: error document exposed as an internal link ${url}`);
      continue;
    }
    if (!resolves(url)) errors.push(`${route}: broken internal link ${url}`);
  }

  // hreflang alternates must resolve
  for (const m of html.matchAll(/hreflang="(?:ro|en|x-default)" href="https:\/\/smartcontrol\.ro([^"]*)"/g)) {
    if (!resolves(m[1] || '/')) errors.push(`${route}: hreflang target missing ${m[1]}`);
  }

  if (ERROR_DOCUMENT_ROUTES.has(route)) {
    if (!/<meta(?=[^>]*\bname="robots")(?=[^>]*\bcontent="[^"]*\bnoindex\b)[^>]*>/.test(html)) {
      errors.push(`${route}: error document must remain noindex`);
    }
    if (/<link rel="(?:canonical|alternate)"/.test(html)) {
      errors.push(`${route}: error document emits canonical/alternate metadata`);
    }
    if (/<meta property="og:(?:locale:alternate|url)"/.test(html)) {
      errors.push(`${route}: error document emits misleading alternate/og:url metadata`);
    }
  }
  if (LEGAL_HOLD_ROUTES.has(route)) {
    if (!html.includes('data-privacy-status="pending-legal-review"')) {
      errors.push(`${route}: legal hold marker is missing`);
    }
    if (!/<meta(?=[^>]*\bname="robots")(?=[^>]*\bcontent="[^"]*\bnoindex\b)[^>]*>/.test(html)) {
      errors.push(`${route}: legal hold page must remain noindex`);
    }
    if (/<link rel="(?:canonical|alternate)"/.test(html) || /<meta property="og:(?:locale:alternate|url)"/.test(html)) {
      errors.push(`${route}: legal hold page emits publication metadata`);
    }
  }
}

// RO/EN parity (privacy maps to a different EN slug)
const routes = new Set(pages.map(routeOf));
for (const errorRoute of ERROR_DOCUMENT_ROUTES) {
  if (!routes.has(errorRoute)) errors.push(`404: missing locale error document ${errorRoute}`);
}
const map = { '/confidentialitate/': '/en/privacy/' };
for (const r of routes) {
  if (ERROR_DOCUMENT_ROUTES.has(r)) continue;
  if (r.startsWith('/en/')) continue;
  const en = map[r] || ('/en' + r);
  if (!routes.has(en)) errors.push(`parity: ${r} has no EN twin ${en}`);
}
for (const r of routes) {
  if (ERROR_DOCUMENT_ROUTES.has(r)) continue;
  if (!r.startsWith('/en/')) continue;
  const roFromMap = Object.entries(map).find(([, v]) => v === r)?.[0];
  const ro = roFromMap || r.replace(/^\/en/, '') || '/';
  if (!routes.has(ro)) errors.push(`parity: ${r} has no RO twin ${ro}`);
}

// sitemap coverage
const sm = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
for (const r of routes) {
  const inSitemap = sm.includes(`https://smartcontrol.ro${r}`);
  if (ERROR_DOCUMENT_ROUTES.has(r) || LEGAL_HOLD_ROUTES.has(r)) {
    if (inSitemap) errors.push(`sitemap: non-indexable route must be excluded ${r}`);
    continue;
  }
  if (!inSitemap) errors.push(`sitemap: missing ${r}`);
}

if (errors.length) {
  console.log(errors.join('\n'));
  console.log(`\nFAIL: ${errors.length} problems`);
  process.exit(1);
}
console.log(`OK: ${pages.length} pages, including ${LEGAL_HOLD_ROUTES.size} legal holds; links/fragments/hreflang/parity/sitemap verified`);
