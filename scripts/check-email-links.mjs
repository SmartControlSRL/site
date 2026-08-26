import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const distDir = new URL('../dist/', import.meta.url);

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(dir.pathname, entry.name);
    return entry.isDirectory() ? htmlFiles(new URL(`file://${path}/`)) : path.endsWith('.html') ? [path] : [];
  }));
  return nested.flat();
}

function attribute(markup, name) {
  return markup.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, 'i'))?.slice(1).find((value) => value !== undefined);
}

function visibleText(markup) {
  return markup
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

const failures = [];
const files = await htmlFiles(distDir);
let checkedLinks = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const route = relative(distDir.pathname, file);

  if (/href=(?:"#"|'#')/i.test(html)) failures.push(`${route}: contains a dead href="#" link`);

  const emailElements = html.match(/<a\b(?=[^>]*\bdata-email-user=)[^>]*>[\s\S]*?<\/a>/gi) ?? [];
  for (const anchor of emailElements) {
    checkedLinks += 1;
    const href = attribute(anchor, 'href') ?? '';
    const label = attribute(anchor, 'aria-label') ?? visibleText(anchor);
    if (!href.startsWith('mailto:')) failures.push(`${route}: email link does not have a mailto destination`);
    if (!label) failures.push(`${route}: email link has no accessible name`);
    if (href.includes('?subject=') && /\s/.test(href)) failures.push(`${route}: mail subject is not URL-encoded`);
  }
}

const representative = [
  'index.html',
  'en/index.html',
  'confidentialitate/index.html',
  'en/privacy/index.html',
  'servicii/cloud/index.html',
  'solutii/seknet/index.html',
];

for (const route of representative) {
  const html = await readFile(join(distDir.pathname, route), 'utf8');
  if (!html.includes('mailto:office@smartcontrol.ro')) failures.push(`${route}: missing the static contact destination`);
}

if (!checkedLinks) failures.push('No email links were found in the generated site');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Email link check passed (${checkedLinks} links across ${files.length} HTML files).`);
}
