#!/usr/bin/env node

// Post-deployment verification for the static production site. This script is
// intentionally not called by local QA: it performs network requests against
// the explicit base URL supplied by an operator.
import { connect } from 'node:tls';
import { hasRobotsDirective, hasRobotsMeta } from './robots-directives.mjs';

const argv = process.argv.slice(2);
if (argv.includes('--help') || argv.length === 0) {
  console.log(`Usage:
  node scripts/verify-production.mjs https://smartcontrol.ro [options]

Options:
  --alias-host <host>   Alternate host expected to redirect to the base URL
                       (default: www.<base-host>)
  --skip-alias-host     Skip the alternate-host redirect check
  --timeout <ms>        Per-request timeout (default: 15000)
`);
  process.exit(argv.length === 0 ? 1 : 0);
}

const base = new URL(argv[0]);
if (base.protocol !== 'https:' || base.pathname !== '/' || base.search || base.hash) {
  throw new Error('Base URL must be an HTTPS origin ending at /, without query or fragment');
}

function option(name) {
  const index = argv.indexOf(name);
  return index === -1 ? undefined : argv[index + 1];
}

const timeout = Number(option('--timeout') ?? 15_000);
if (!Number.isFinite(timeout) || timeout < 1_000) throw new Error('--timeout must be at least 1000ms');
const skipAlias = argv.includes('--skip-alias-host');
const aliasHost = option('--alias-host') ?? `www.${base.hostname}`;
const failures = [];
let checks = 0;
const EXPECTED_CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'none'";

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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalizedDirectives(value) {
  return value.trim().replace(/\s*;\s*/g, '; ').replace(/\s+/g, ' ');
}

function assertLegacyTlsRejected(version) {
  return new Promise((resolve, reject) => {
    let connected = false;
    let timedOut = false;
    const socket = connect({
      host: base.hostname,
      port: Number(base.port || 443),
      servername: base.hostname,
      minVersion: version,
      maxVersion: version,
      rejectUnauthorized: true,
      timeout,
    });
    socket.once('secureConnect', () => {
      connected = true;
      socket.destroy();
      reject(new Error(`${version} was accepted`));
    });
    socket.once('timeout', () => {
      timedOut = true;
      socket.destroy(new Error(`${version} probe timed out`));
    });
    socket.once('error', (error) => (connected || timedOut) ? reject(error) : resolve());
  });
}

async function request(url, init = {}) {
  return fetch(url, {
    ...init,
    signal: AbortSignal.timeout(timeout),
  });
}

async function followRedirects(url, maximum = 8) {
  const seen = new Set();
  const chain = [];
  let current = new URL(url);
  for (let index = 0; index <= maximum; index += 1) {
    assert(!seen.has(current.href), `redirect loop at ${current.href}`);
    seen.add(current.href);
    const response = await request(current, { redirect: 'manual' });
    chain.push({ url: current, response });
    if (![301, 302, 303, 307, 308].includes(response.status)) return chain;
    const location = response.headers.get('location');
    assert(location, `${response.status} response has no Location header`);
    current = new URL(location, current);
  }
  throw new Error(`more than ${maximum} redirects`);
}

function cacheControl(response) {
  return response.headers.get('cache-control')?.toLowerCase() ?? '';
}

let homepageResponse;
let homepageHtml = '';

await check('TLS certificate and protocol', () => new Promise((resolve, reject) => {
  const socket = connect({
    host: base.hostname,
    port: Number(base.port || 443),
    servername: base.hostname,
    rejectUnauthorized: true,
    timeout,
  });
  socket.once('secureConnect', () => {
    try {
      assert(socket.authorized, socket.authorizationError || 'TLS socket is not authorized');
      assert(['TLSv1.2', 'TLSv1.3'].includes(socket.getProtocol()), `unexpected ${socket.getProtocol()}`);
      const certificate = socket.getPeerCertificate();
      const remaining = Date.parse(certificate.valid_to) - Date.now();
      assert(remaining > 14 * 86_400_000, 'certificate expires in fewer than 14 days');
      socket.end();
      resolve();
    } catch (error) {
      socket.destroy();
      reject(error);
    }
  });
  socket.once('timeout', () => socket.destroy(new Error('TLS connection timed out')));
  socket.once('error', reject);
}));

for (const version of ['TLSv1', 'TLSv1.1']) {
  await check(`${version} is rejected`, () => assertLegacyTlsRejected(version));
}

await check('HTTP redirects once to the canonical HTTPS origin', async () => {
  const url = new URL(base);
  url.protocol = 'http:';
  url.port = '';
  const chain = await followRedirects(url);
  assert(chain.length === 2, `expected one redirect, got ${chain.length - 1}`);
  assert([301, 308].includes(chain[0].response.status), `unexpected ${chain[0].response.status}`);
  assert(chain[1].url.origin === base.origin, `ended at ${chain[1].url.origin}`);
  assert(chain[1].response.status === 200, `canonical homepage returned ${chain[1].response.status}`);
});

if (!skipAlias) {
  await check('alternate host redirects once to the canonical host', async () => {
    const alias = new URL(base);
    alias.hostname = aliasHost;
    const chain = await followRedirects(alias);
    assert(chain.length === 2, `expected one redirect, got ${chain.length - 1}`);
    assert([301, 308].includes(chain[0].response.status), `unexpected ${chain[0].response.status}`);
    assert(chain[1].url.origin === base.origin, `ended at ${chain[1].url.origin}`);
  });
}

await check('homepage status, indexing and security headers', async () => {
  homepageResponse = await request(base, { redirect: 'error' });
  assert(homepageResponse.status === 200, `returned ${homepageResponse.status}`);
  homepageHtml = await homepageResponse.text();

  const headers = homepageResponse.headers;
  const hsts = headers.get('strict-transport-security')?.toLowerCase().replace(/\s/g, '');
  assert(hsts === 'max-age=31536000;includesubdomains', `HSTS mismatch: ${hsts || '<missing>'}`);
  assert(headers.get('x-content-type-options')?.toLowerCase() === 'nosniff', 'nosniff missing');
  assert(headers.get('x-frame-options')?.toUpperCase() === 'DENY', 'X-Frame-Options missing');
  assert(headers.get('referrer-policy') === 'strict-origin-when-cross-origin', 'Referrer-Policy mismatch');
  assert(headers.get('cross-origin-opener-policy')?.toLowerCase() === 'same-origin', 'Cross-Origin-Opener-Policy mismatch');
  assert(headers.get('permissions-policy')?.includes('camera=()'), 'Permissions-Policy missing');
  assert(!hasRobotsDirective(headers.get('x-robots-tag'), 'noindex'), 'production header is noindex');
  assert(!hasRobotsMeta(homepageHtml, 'noindex'), 'production HTML is noindex');

  const csp = headers.get('content-security-policy-report-only') ?? '';
  assert(normalizedDirectives(csp) === normalizedDirectives(EXPECTED_CSP), `CSP report-only mismatch: ${csp || '<missing>'}`);
});

await check('HTML revalidates', async () => {
  const response = homepageResponse ?? await request(base);
  const value = cacheControl(response);
  assert(value.includes('no-cache'), `unexpected Cache-Control: ${value || '<missing>'}`);
  assert(!value.includes('immutable'), 'HTML must not be immutable');
});

await check('eligible content is compressed', async () => {
  const response = await request(base, { headers: { 'accept-encoding': 'br, gzip' } });
  const encoding = response.headers.get('content-encoding')?.toLowerCase();
  assert(encoding === 'br' || encoding === 'gzip', `unexpected Content-Encoding: ${encoding || '<missing>'}`);
  assert(response.headers.get('vary')?.toLowerCase().includes('accept-encoding'), 'Vary: Accept-Encoding missing');
});

await check('hashed assets are immutable', async () => {
  if (!homepageHtml) homepageHtml = await (await request(base)).text();
  const asset = homepageHtml.match(/["'](\/_astro\/[^"']+\.(?:css|js|woff2?))["']/)?.[1];
  assert(asset, 'could not discover a hashed Astro asset from the homepage');
  const response = await request(new URL(asset, base), { redirect: 'error' });
  assert(response.status === 200, `asset returned ${response.status}`);
  const value = cacheControl(response);
  assert(value.includes('max-age=31536000') && value.includes('immutable'), `unexpected Cache-Control: ${value}`);
});

await check('non-hashed assets revalidate', async () => {
  const response = await request(new URL('/favicon.ico', base), { redirect: 'error' });
  assert(response.status === 200, `favicon returned ${response.status}`);
  const value = cacheControl(response);
  assert(value.includes('max-age=3600') && value.includes('must-revalidate'), `unexpected Cache-Control: ${value}`);
  assert(!value.includes('immutable'), 'non-hashed favicon must not be immutable');
});

await check('directory routes canonicalize to a trailing slash without loops', async () => {
  const chain = await followRedirects(new URL('/servicii', base));
  assert(chain.length === 2, `expected one redirect, got ${chain.length - 1}`);
  assert([301, 308].includes(chain[0].response.status), `unexpected ${chain[0].response.status}`);
  assert(chain[1].url.pathname === '/servicii/', `ended at ${chain[1].url.pathname}`);
  assert(chain[1].response.status === 200, `canonical route returned ${chain[1].response.status}`);
});

for (const [locale, path, lang, marker] of [
  ['RO', `/__deployment-check-missing-${Date.now()}`, 'ro', 'Pagina nu a fost găsită'],
  ['EN', `/en/__deployment-check-missing-${Date.now()}`, 'en', 'Page not found'],
]) {
  await check(`${locale} unknown paths preserve URL and return the localized 404`, async () => {
    const url = new URL(path, base);
    const response = await request(url, { redirect: 'error' });
    const html = await response.text();
    assert(response.status === 404, `returned ${response.status}`);
    assert(response.url === url.href, `request was externally redirected to ${response.url}`);
    assert(new RegExp(`<html\\s+lang=["']${lang}["']`).test(html), `lang=${lang} missing`);
    assert(html.includes(marker), `localized marker “${marker}” missing`);
    assert(hasRobotsMeta(html, 'noindex'), '404 noindex missing');
  });
}

for (const path of ['/confidentialitate/', '/en/privacy/']) {
  await check(`${path} is approved for publication`, async () => {
    const response = await request(new URL(path, base), { redirect: 'error' });
    const html = await response.text();
    assert(response.status === 200, `returned ${response.status}`);
    assert(!html.includes('data-privacy-status="pending-legal-review"'), 'legal-review holding marker is still deployed');
    assert(!hasRobotsMeta(html, 'noindex'), 'privacy notice is still noindex');
  });
}

await check('robots.txt does not block production indexing', async () => {
  const response = await request(new URL('/robots.txt', base), { redirect: 'error' });
  const body = await response.text();
  assert(response.status === 200, `returned ${response.status}`);
  assert(!/^\s*Disallow:\s*\/\s*$/im.test(body), 'robots.txt blocks all crawling');
});

if (failures.length) {
  console.error(`\nFAIL: ${failures.length} of ${checks + failures.length} production checks failed`);
  process.exit(1);
}
console.log(`\nOK: ${checks} production checks passed for ${base.origin}`);
