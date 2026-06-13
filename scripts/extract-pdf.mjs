// One-time extraction of PDF text for the build (privacy policy + services offer).
// Usage: node scripts/extract-pdf.mjs <input.pdf> <output.txt>
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const [, , input, output] = process.argv;
const data = new Uint8Array(readFileSync(input));
const doc = await getDocument({ data, useSystemFonts: true }).promise;

let out = '';
for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const content = await page.getTextContent();
  // Group items by line using their y coordinate, keep reading order.
  let lastY = null;
  let line = '';
  const lines = [];
  for (const item of content.items) {
    const y = Math.round(item.transform[5]);
    if (lastY !== null && Math.abs(y - lastY) > 2) {
      lines.push(line.trimEnd());
      line = '';
    }
    line += item.str + (item.hasEOL ? '\n' : '');
    lastY = y;
  }
  if (line.trim()) lines.push(line.trimEnd());
  out += `\n=== PAGE ${i} ===\n` + lines.join('\n') + '\n';
}
writeFileSync(output, out, 'utf8');
console.log(`OK ${doc.numPages} pages -> ${output} (${out.length} chars)`);
