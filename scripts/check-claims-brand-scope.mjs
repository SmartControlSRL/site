import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { applyBrandClaimScope } from './claims-brand-scope.mjs';
const { approvedCopy } = JSON.parse(await readFile(new URL('../config/public-claims-policy.json', import.meta.url), 'utf8'));
const brand = '<a href="/"><span data-brand-wordmark>Smart<span>Control</span></span><span data-brand-since class="brand">DIN 2003</span></a>';
const nav = `<nav data-nav-shrink aria-label="Navigație">${brand}</nav>`;
const masked = (text, path = 'dist/index.html', claim = 'C-001') => applyBrandClaimScope(text, path, claim, approvedCopy);
for (const path of ['src/components/Nav.astro', 'dist/index.html', 'dist/en/servicii/cloud/index.html']) {
  assert(!masked(nav, path).includes('2003'), `approved brand allowed in ${path}`);
}
for (const text of [brand, `<nav>${brand}</nav>`, nav.replace('data-brand-wordmark', 'data-unrelated'), nav.replace('DIN 2003', 'Fondată în 2003')]) {
  assert(masked(text).includes('2003'), 'year outside exact approved logo must remain blocked');
}
for (const path of ['src/content/home-page.ts', 'src/components/Footer.astro', 'dist/_astro/content.js']) {
  assert.equal(masked(nav, path), nav, 'no exception outside navigation source / rendered HTML');
}
assert.equal(masked(nav, 'dist/index.html', 'C-002'), nav, 'other claim checks remain intact');
assert.equal(applyBrandClaimScope(nav, 'dist/index.html', 'C-001', []), nav, 'registration required');
const publicCopy = '<meta name="description" content="Founded in 2003"><main>Din 2003</main>';
assert(masked(nav + publicCopy).endsWith(publicCopy), 'metadata and prose remain subject to the gate');
assert(masked(nav.replace('DIN 2003', 'DIN 2003 650+ proiecte')).includes('650+ proiecte'), 'additional claims are not masked');
console.log('Brand claim scope passed: exact registered navigation logo only; prose, metadata and other claims remain checked.');
