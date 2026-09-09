import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = resolve(root, 'dist');
const failures = [];

const pairs = [
  ['/', '/en/'],
  ['/servicii/cloud/', '/en/servicii/cloud/'],
  ['/servicii/securitate/', '/en/servicii/securitate/'],
  ['/servicii/software/', '/en/servicii/software/'],
  ['/servicii/managed/', '/en/servicii/managed/'],
  ['/solutii/seknet/', '/en/solutii/seknet/'],
  ['/solutii/s-vpn/', '/en/solutii/s-vpn/'],
];

const visualRoutes = new Set([
  '/servicii/cloud/', '/en/servicii/cloud/',
  '/servicii/securitate/', '/en/servicii/securitate/',
  '/servicii/software/', '/en/servicii/software/',
  '/servicii/managed/', '/en/servicii/managed/',
  '/solutii/seknet/', '/en/solutii/seknet/',
  '/solutii/s-vpn/', '/en/solutii/s-vpn/',
]);

const routeFile = (route) => resolve(dist, route === '/' ? 'index.html' : `${route.replace(/^\//, '')}index.html`);
const htmlByRoute = new Map();
for (const route of new Set(pairs.flat())) {
  htmlByRoute.set(route, await readFile(routeFile(route), 'utf8'));
}

const tagContent = (html, pattern) => html.match(pattern)?.[1]?.trim() ?? '';
const headingLevels = (html) => [...html.matchAll(/<h([1-6])\b/giu)].map((match) => Number(match[1]));
const visibleText = (html) => html
  .replace(/<script\b[\s\S]*?<\/script>/giu, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/giu, ' ')
  .replace(/<[^>]+>/gu, ' ')
  .replaceAll('&amp;', '&')
  .replaceAll('&#39;', "'")
  .replace(/\s+/gu, ' ');

for (const [roRoute, enRoute] of pairs) {
  const ro = htmlByRoute.get(roRoute);
  const en = htmlByRoute.get(enRoute);
  const roLevels = headingLevels(ro);
  const enLevels = headingLevels(en);
  if (roLevels.join(',') !== enLevels.join(',')) {
    failures.push(`${roRoute} / ${enRoute}: heading-level sequence differs (${roLevels} vs ${enLevels})`);
  }

  for (const [route, html, lang] of [[roRoute, ro, 'ro'], [enRoute, en, 'en']]) {
    if (!new RegExp(`<html[^>]+lang=["']${lang}["']`, 'iu').test(html)) {
      failures.push(`${route}: html lang is not ${lang}`);
    }
    if ((html.match(/<h1\b/giu) ?? []).length !== 1) failures.push(`${route}: expected exactly one h1`);
    const levels = headingLevels(html);
    for (let index = 1; index < levels.length; index += 1) {
      if (levels[index] > levels[index - 1] + 1) failures.push(`${route}: heading level jumps from h${levels[index - 1]} to h${levels[index]}`);
    }

    const title = tagContent(html, /<title>([\s\S]*?)<\/title>/iu);
    const description = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)/iu)?.[1] ?? '';
    if (title.length < 30 || title.length > 80) failures.push(`${route}: title length ${title.length} is outside the reviewed 30–80 range`);
    if (description.length < 70 || description.length > 190) failures.push(`${route}: description length ${description.length} is outside the reviewed 70–190 range`);

    const expectedCard = lang === 'en' ? 'https://smartcontrol.ro/og-en.png' : 'https://smartcontrol.ro/og-ro.png';
    const expectedAltFragment = lang === 'en' ? 'technical clarity' : 'claritate tehnică';
    if (!html.includes(`property="og:image" content="${expectedCard}"`)) failures.push(`${route}: wrong locale social image`);
    if (!new RegExp(`property="og:image:alt" content="[^"]*${expectedAltFragment}`, 'iu').test(html)) failures.push(`${route}: missing localised og:image:alt`);
    if (!new RegExp(`name="twitter:image:alt" content="[^"]*${expectedAltFragment}`, 'iu').test(html)) failures.push(`${route}: missing localised twitter:image:alt`);

    if (visualRoutes.has(route)) {
      if (!html.includes('data-route-visual')) failures.push(`${route}: missing approved route visual`);
      if (!/<figcaption\b|data-stepper[\s\S]*?<p\b/iu.test(html)) failures.push(`${route}: route visual lacks a visible text equivalent`);
    }
  }

  const enText = visibleText(en);
  const usSpellings = [
    /\borganizations?\b/iu,
    /\bmodernization\b/iu,
    /\boptimization\b/iu,
    /\bprioritization\b/iu,
    /\bcentralized\b/iu,
    /\bcontainerization\b/iu,
  ];
  for (const spelling of usSpellings) {
    if (spelling.test(enText)) failures.push(`${enRoute}: public copy contains non-approved US spelling ${spelling}`);
  }
}

for (const route of ['/servicii/cloud/', '/en/servicii/cloud/']) {
  const html = htmlByRoute.get(route);
  const workflow = html.match(/<ol\b[\s\S]*?<\/ol>/iu)?.[0] ?? '';
  if ((workflow.match(/data-step(?:\s|=|>)/gu) ?? []).length !== 5) failures.push(`${route}: Cloud workflow must contain five stages`);
  if (/Fast Track/iu.test(workflow)) failures.push(`${route}: Fast Track must not be a universal workflow stage`);
}

for (const route of ['/', '/en/']) {
  const html = htmlByRoute.get(route);
  const contact = html.match(/<section[^>]+id=["']contact["'][\s\S]*?<\/section>/iu)?.[0] ?? '';
  if (!contact.includes('office@smartcontrol.ro')) failures.push(`${route}: Contact destination lacks visible static email text`);
}

const sharedWrappers = [
  'src/pages/servicii/cloud.astro', 'src/pages/en/servicii/cloud.astro',
  'src/pages/solutii/seknet.astro', 'src/pages/en/solutii/seknet.astro',
  'src/pages/solutii/s-vpn.astro', 'src/pages/en/solutii/s-vpn.astro',
  'src/pages/servicii/securitate.astro', 'src/pages/en/servicii/securitate.astro',
  'src/pages/servicii/software.astro', 'src/pages/en/servicii/software.astro',
  'src/pages/servicii/managed.astro', 'src/pages/en/servicii/managed.astro',
];
for (const source of sharedWrappers) {
  const text = await readFile(resolve(root, source), 'utf8');
  if (!/components\/pages\/(?:ServiceDetailPage|ProductDetailPage)\.astro/iu.test(text)) {
    failures.push(`${source}: duplicated page markup replaced the shared typed template`);
  }
}

const moduleCard = await readFile(resolve(root, 'src/components/ModuleCard.astro'), 'utf8');
if (/hover:-translate|cursor-pointer/iu.test(moduleCard)) failures.push('ModuleCard: static cards expose false interaction cues');

for (const asset of ['public/og-ro.png', 'public/og-en.png']) {
  const metadata = await sharp(resolve(root, asset)).metadata();
  if (metadata.width !== 1200 || metadata.height !== 630) failures.push(`${asset}: expected 1200x630, received ${metadata.width}x${metadata.height}`);
}

if (failures.length) {
  console.error(`Localisation/content checks failed:\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`OK: ${pairs.length} RO/EN route pairs, 12 route visuals, shared templates, metadata, headings, and social cards verified`);
}
