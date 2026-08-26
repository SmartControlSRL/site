#!/usr/bin/env node

// Read-only remote verification for preview or production indexing behavior.
// Requires an explicit origin and never infers or deploys an environment.
const argv = process.argv.slice(2);
function option(name) {
  const index = argv.indexOf(name);
  return index === -1 ? undefined : argv[index + 1];
}

if (argv.includes('--help')) {
  console.log(`Usage:
  node scripts/verify-indexing.mjs --mode preview --base https://preview.example
  node scripts/verify-indexing.mjs --mode production --base https://smartcontrol.ro

Options:
  --timeout <ms>   Per-request timeout (default: 15000)
`);
  process.exit(0);
}

const mode = option('--mode');
const suppliedBase = option('--base');
if (!['preview', 'production'].includes(mode) || !suppliedBase) {
  throw new Error('--mode preview|production and --base https://origin are required');
}
const base = new URL(suppliedBase);
if (base.protocol !== 'https:' || base.pathname !== '/' || base.search || base.hash || base.username || base.password) {
  throw new Error('--base must be a credential-free HTTPS origin ending at /');
}
const timeout = Number(option('--timeout') || 15_000);
if (!Number.isFinite(timeout) || timeout < 1_000) throw new Error('--timeout must be at least 1000ms');
const failures = [];
let checks = 0;
const cache = new Map();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hasNoindexHeader(response) {
  return response.headers.get('x-robots-tag')?.toLowerCase().split(/[\s,]+/).includes('noindex') || false;
}

function hasNoindexMeta(html) {
  return /<meta(?=[^>]*name=["']robots["'])(?=[^>]*content=["'][^"']*\bnoindex\b)[^>]*>/i.test(html);
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, 'i'))?.slice(1).find((value) => value !== undefined);
}

async function fetchText(url) {
  const href = new URL(url, base).href;
  if (!cache.has(href)) {
    cache.set(href, (async () => {
      const response = await fetch(href, { redirect: 'error', signal: AbortSignal.timeout(timeout) });
      return { response, body: await response.text() };
    })());
  }
  return cache.get(href);
}

async function check(name, task) {
  try {
    await task();
    checks += 1;
    console.log(`OK: ${name}`);
  } catch (error) {
    failures.push(`${name}: ${error instanceof Error ? error.message : error}`);
    console.error(`FAIL: ${failures.at(-1)}`);
  }
}

if (mode === 'preview') {
  for (const path of ['/', '/en/', '/servicii/cloud/', '/robots.txt', '/sitemap-index.xml']) {
    await check(`preview ${path} is header-noindex`, async () => {
      const { response, body } = await fetchText(path);
      assert(response.status === 200, `returned ${response.status}`);
      assert(hasNoindexHeader(response), 'X-Robots-Tag noindex is missing');
      if (path.endsWith('/robots.txt')) {
        assert(/Sitemap:\s*https:\/\/smartcontrol\.ro\/sitemap-index\.xml/i.test(body), 'preview robots must advertise the production canonical sitemap');
      }
      if (path === '/' || path === '/en/' || path.endsWith('/cloud/')) {
        const canonical = body.match(/<link(?=[^>]*rel=["']canonical["'])(?=[^>]*href=["']([^"']+)["'])[^>]*>/i)?.[1];
        assert(canonical?.startsWith('https://smartcontrol.ro/'), `canonical is not production-origin: ${canonical || '<missing>'}`);
      }
    });
  }
  await check('preview missing route remains header-noindex', async () => {
    const { response } = await fetchText('/__indexing-verification-missing__');
    assert(response.status === 404, `returned ${response.status}`);
    assert(hasNoindexHeader(response), '404 X-Robots-Tag noindex is missing');
  });
} else {
  const robotsUrl = new URL('/robots.txt', base);
  await check('production robots policy', async () => {
    const { response, body } = await fetchText(robotsUrl);
    assert(response.status === 200, `returned ${response.status}`);
    assert(!hasNoindexHeader(response), 'robots.txt response is header-noindex');
    assert(!/^\s*Disallow:\s*\/\s*$/im.test(body), 'robots.txt blocks all crawling');
    assert(body.includes(new URL('/sitemap-index.xml', base).href), 'production sitemap index is missing');
  });

  const { response: indexResponse, body: indexBody } = await fetchText('/sitemap-index.xml');
  await check('production sitemap index', async () => {
    assert(indexResponse.status === 200, `returned ${indexResponse.status}`);
    assert(!hasNoindexHeader(indexResponse), 'sitemap index is header-noindex');
  });
  const childSitemaps = [...indexBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const pageUrls = new Set();
  for (const childUrl of childSitemaps) {
    await check(`child sitemap ${childUrl}`, async () => {
      const parsed = new URL(childUrl);
      assert(parsed.origin === base.origin, `uses ${parsed.origin}`);
      const { response, body } = await fetchText(parsed);
      assert(response.status === 200, `returned ${response.status}`);
      assert(!hasNoindexHeader(response), 'child sitemap is header-noindex');
      for (const match of body.matchAll(/<loc>([^<]+)<\/loc>/g)) pageUrls.add(match[1]);
    });
  }

  await check('sitemap route inventory', () => {
    assert(pageUrls.size > 0, 'sitemap contains no page URLs');
    assert(![...pageUrls].some((url) => /\/(?:en\/)?404\/?$/.test(new URL(url).pathname)), 'sitemap contains a 404 document');
    for (const required of ['/', '/en/', '/servicii/cloud/']) {
      assert(pageUrls.has(new URL(required, base).href), `missing ${required}`);
    }
  });

  const alternateTargets = new Set();
  for (const pageUrl of pageUrls) {
    await check(`indexable page ${new URL(pageUrl).pathname}`, async () => {
      const parsed = new URL(pageUrl);
      assert(parsed.origin === base.origin, `uses ${parsed.origin}`);
      const { response, body } = await fetchText(parsed);
      assert(response.status === 200, `returned ${response.status}`);
      assert(!hasNoindexHeader(response), 'response is header-noindex');
      assert(!hasNoindexMeta(body), 'HTML contains meta noindex');
      const links = body.match(/<link\b[^>]*>/gi) || [];
      const canonical = links.find((tag) => attribute(tag, 'rel')?.toLowerCase() === 'canonical');
      assert(attribute(canonical || '', 'href') === parsed.href, `canonical mismatch: ${attribute(canonical || '', 'href') || '<missing>'}`);
      for (const language of ['ro', 'en', 'x-default']) {
        const alternate = links.find((tag) => attribute(tag, 'rel')?.toLowerCase() === 'alternate' && attribute(tag, 'hreflang') === language);
        const href = attribute(alternate || '', 'href');
        assert(Boolean(href), `missing ${language} hreflang`);
        assert(new URL(href).origin === base.origin, `${language} hreflang uses ${new URL(href).origin}`);
        alternateTargets.add(href);
      }
    });
  }
  for (const target of alternateTargets) {
    await check(`hreflang resolves ${new URL(target).pathname}`, async () => {
      const { response } = await fetchText(target);
      assert(response.status === 200, `returned ${response.status}`);
    });
  }

  for (const path of ['/__indexing-verification-missing__', '/en/__indexing-verification-missing__']) {
    await check(`production error policy ${path}`, async () => {
      const { response, body } = await fetchText(path);
      assert(response.status === 404, `returned ${response.status}`);
      assert(hasNoindexHeader(response) || hasNoindexMeta(body), '404 response is indexable');
    });
  }
}

if (failures.length) {
  console.error(`\nFAIL: ${failures.length} of ${checks + failures.length} indexing checks failed`);
  process.exit(1);
}
console.log(`\nOK: ${checks} ${mode} indexing checks passed for ${base.origin}`);
