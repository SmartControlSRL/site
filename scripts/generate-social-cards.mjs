import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const mark = await readFile(resolve(root, 'public/smartcontrol-mark.png'));

const escapeXml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const cards = [
  {
    path: 'public/og-ro.png',
    eyebrow: 'SERVICII IT ENTERPRISE',
    headline: 'Claritate tehnică. Livrare coordonată.',
    supporting: 'Infrastructură · Securitate · Software · Operare',
  },
  {
    path: 'public/og-en.png',
    eyebrow: 'ENTERPRISE IT SERVICES',
    headline: 'Technical clarity. Coordinated delivery.',
    supporting: 'Infrastructure · Security · Software · Operations',
  },
];

for (const card of cards) {
  const background = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#040C2B"/>
          <stop offset="0.58" stop-color="#0E1F5B"/>
          <stop offset="1" stop-color="#1F3C80"/>
        </linearGradient>
        <radialGradient id="glow" cx="78%" cy="24%" r="64%">
          <stop offset="0" stop-color="#4487DC" stop-opacity="0.72"/>
          <stop offset="1" stop-color="#4487DC" stop-opacity="0"/>
        </radialGradient>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#7AB4E8" stroke-opacity="0.09"/>
        </pattern>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <rect width="1200" height="630" fill="url(#glow)"/>
      <rect width="1200" height="630" fill="url(#grid)"/>
      <path d="M760 0H1200V630H1010L760 0Z" fill="#4487DC" fill-opacity="0.08"/>
      <text x="96" y="117" fill="#7AB4E8" font-family="JetBrains Mono, monospace" font-size="18" font-weight="600" letter-spacing="4">${escapeXml(card.eyebrow)}</text>
      <text x="96" y="294" fill="#FFFFFF" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="700">Smart<tspan fill="#A8D0F2">Control</tspan></text>
      <text x="96" y="382" fill="#FFFFFF" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="650">${escapeXml(card.headline)}</text>
      <text x="96" y="442" fill="#D6E8F7" font-family="Inter, Arial, sans-serif" font-size="22">${escapeXml(card.supporting)}</text>
      <line x1="96" y1="505" x2="1104" y2="505" stroke="#7AB4E8" stroke-opacity="0.35"/>
      <text x="96" y="552" fill="#A8D0F2" font-family="JetBrains Mono, monospace" font-size="18" letter-spacing="2">SMARTCONTROL.RO</text>
    </svg>
  `);

  const resizedMark = await sharp(mark).resize(86, 86).png().toBuffer();
  await sharp(background)
    .composite([{ input: resizedMark, left: 1018, top: 72 }])
    .png({ palette: true, quality: 92, compressionLevel: 9 })
    .toFile(resolve(root, card.path));
}

console.log(`Generated ${cards.length} locale-specific 1200x630 social cards.`);
