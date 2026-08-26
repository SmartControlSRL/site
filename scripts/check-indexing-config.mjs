#!/usr/bin/env node

// Deterministic indexing-policy validation over checked-in preview/production
// server configuration and the generated static site. No network is used.
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = resolve(ROOT, 'dist');
const PRODUCTION_ORIGIN = 'https://smartcontrol.ro';
const failures = [];
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

async function filesBelow(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await filesBelow(path));
    else files.push(path);
  }
  return files;
}

function routeOf(file) {
  const rel = relative(DIST, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel.slice(0, -'.html'.length)}`;
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, 'i'))?.slice(1).find((value) => value !== undefined);
}

function linkTags(html) {
  return html.match(/<link\b[^>]*>/gi) || [];
}

function hasNoindexMeta(html) {
  return /<meta(?=[^>]*name=["']robots["'])(?=[^>]*content=["'][^"']*\bnoindex\b)[^>]*>/i.test(html);
}

function pathForProductionUrl(url) {
  const parsed = new URL(url);
  if (parsed.origin !== PRODUCTION_ORIGIN || parsed.search || parsed.hash) return null;
  if (parsed.pathname === '/') return resolve(DIST, 'index.html');
  if (parsed.pathname.endsWith('/')) return resolve(DIST, parsed.pathname.slice(1), 'index.html');
  return resolve(DIST, parsed.pathname.slice(1));
}

const previewConfig = JSON.parse(await readFile(resolve(ROOT, 'vercel.json'), 'utf8'));
const catchAll = previewConfig.headers?.find((rule) => rule.source === '/(.*)');
const robotsHeader = catchAll?.headers?.find((header) => header.key?.toLowerCase() === 'x-robots-tag');
assert(Boolean(catchAll), 'preview: vercel.json must retain the unconditional /(.*) header rule');
assert(robotsHeader?.value?.toLowerCase().split(/[\s,]+/).includes('noindex'), 'preview: catch-all X-Robots-Tag must include noindex');
assert(!catchAll?.has && !catchAll?.missing, 'preview: noindex guard must not depend on request conditions');

const nginxFiles = ['smartcontrol.ro.conf', 'maps.conf', 'site-rules.conf', 'tls.conf'];
const nginx = (await Promise.all(nginxFiles.map((name) => readFile(resolve(ROOT, 'deployment/nginx', name), 'utf8'))))
  .join('\n')
  .replace(/^\s*#.*$/gm, '');
assert(!/X-Robots-Tag\s+[^;]*\bnoindex\b/i.test(nginx), 'production: nginx must not emit X-Robots-Tag noindex');
assert(/error_page\s+404\s+=404\s+\$smartcontrol_error_document;/i.test(nginx), 'production: nginx must preserve a real 404 status');
assert(/location\s+=\s+\/404\.html\s*{\s*internal;/s.test(nginx), 'production: RO error document must remain internal');
assert(/location\s+=\s+\/en\/404\/index\.html\s*{\s*internal;/s.test(nginx), 'production: EN error document must remain internal');

const htmlFiles = (await filesBelow(DIST)).filter((file) => file.endsWith('.html'));
const errorRoutes = new Set(['/404', '/en/404/']);
const contentFiles = htmlFiles.filter((file) => !errorRoutes.has(routeOf(file)));
const generatedUrls = new Set(contentFiles.map((file) => `${PRODUCTION_ORIGIN}${routeOf(file)}`));

for (const file of contentFiles) {
  const route = routeOf(file);
  const html = await readFile(file, 'utf8');
  assert(!hasNoindexMeta(html), `${route}: indexable content must not contain meta noindex`);
  const links = linkTags(html);
  const canonical = links.find((tag) => attribute(tag, 'rel')?.toLowerCase() === 'canonical');
  const canonicalHref = canonical && attribute(canonical, 'href');
  assert(canonicalHref === `${PRODUCTION_ORIGIN}${route}`, `${route}: canonical must equal the production route`);

  const alternates = links.filter((tag) => attribute(tag, 'rel')?.toLowerCase() === 'alternate' && attribute(tag, 'hreflang'));
  for (const language of ['ro', 'en', 'x-default']) {
    const alternate = alternates.find((tag) => attribute(tag, 'hreflang') === language);
    const href = alternate && attribute(alternate, 'href');
    assert(Boolean(href), `${route}: missing ${language} hreflang`);
    if (href) {
      const target = pathForProductionUrl(href);
      assert(Boolean(target) && htmlFiles.includes(target), `${route}: ${language} hreflang target is not a generated production page (${href})`);
    }
  }
}

for (const [route, path] of [
  ['/404', resolve(DIST, '404.html')],
  ['/en/404/', resolve(DIST, 'en/404/index.html')],
]) {
  const html = await readFile(path, 'utf8');
  assert(hasNoindexMeta(html), `${route}: error document must contain meta noindex`);
  assert(!linkTags(html).some((tag) => ['canonical', 'alternate'].includes(attribute(tag, 'rel')?.toLowerCase())), `${route}: error document must not emit canonical/hreflang links`);
}

const robots = await readFile(resolve(DIST, 'robots.txt'), 'utf8');
assert(/^\s*Allow:\s*\/\s*$/im.test(robots), 'robots.txt must allow production crawling');
assert(!/^\s*Disallow:\s*\/\s*$/im.test(robots), 'robots.txt must not block the production site');
assert(/^\s*Sitemap:\s*https:\/\/smartcontrol\.ro\/sitemap-index\.xml\s*$/im.test(robots), 'robots.txt must advertise the production sitemap index');

const sitemapIndex = await readFile(resolve(DIST, 'sitemap-index.xml'), 'utf8');
const sitemapLocations = [...sitemapIndex.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert(sitemapLocations.length > 0, 'sitemap index must contain at least one child sitemap');
const sitemapUrls = new Set();
for (const location of sitemapLocations) {
  const parsed = new URL(location);
  assert(parsed.origin === PRODUCTION_ORIGIN, `sitemap index contains a non-production origin: ${location}`);
  const child = await readFile(resolve(DIST, parsed.pathname.slice(1)), 'utf8');
  for (const match of child.matchAll(/<loc>([^<]+)<\/loc>/g)) sitemapUrls.add(match[1]);
}
assert(![...sitemapUrls].some((url) => /\/(?:en\/)?404\/?$/.test(new URL(url).pathname)), '404 documents must be absent from sitemap contents');
assert(sitemapUrls.size === generatedUrls.size && [...generatedUrls].every((url) => sitemapUrls.has(url)), 'sitemap contents must exactly match generated indexable routes');

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join('\n'));
  process.exit(1);
}
console.log(`OK: preview and production indexing contracts passed ${checks} local assertions`);
console.log(`OK: ${contentFiles.length} indexable routes; ${errorRoutes.size} localized noindex error documents`);
