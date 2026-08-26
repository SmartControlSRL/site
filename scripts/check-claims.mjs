import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const sourceDir = new URL('../src/', import.meta.url);

async function sourceFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const paths = await Promise.all(entries.map((entry) => {
    const path = join(dir.pathname, entry.name);
    if (entry.isDirectory()) return sourceFiles(new URL(`file://${path}/`));
    return /\.(astro|ts|js|mdx?)$/.test(entry.name) ? [path] : [];
  }));
  return paths.flat();
}

const forbidden = [
  [/execuție\s+100%\s+in-house/iu, 'absolute in-house execution'],
  [/execution\s+100%\s+in-house/iu, 'absolute in-house execution'],
  [/zero[- ]downtime/iu, 'zero-downtime promise'],
  [/zero\s+pasare/iu, 'zero hand-off promise'],
  [/zero\s+hand-offs?/iu, 'zero hand-off promise'],
  [/(?:sla\s+24\/7|24\/7\s+sla)/iu, 'universal 24/7 SLA'],
  [/cod\s+sursă\s+inclus\s+pentru\s+fiecare\s+proiect/iu, 'universal source-code promise'],
  [/source\s+code\s+included\s+with\s+every\s+project/iu, 'universal source-code promise'],
  [/metrici\s+garantate/iu, 'guaranteed metrics'],
  [/guaranteed\s+metrics/iu, 'guaranteed metrics'],
  [/50\s+de\s+specialiști/iu, 'unapproved headcount'],
  [/50\s+in-house\s+specialists/iu, 'unapproved headcount'],
  [/500\s+de\s+ani/iu, 'unapproved cumulative experience'],
  [/500\s+cumulative\s+years/iu, 'unapproved cumulative experience'],
  [/250\+\s+clienți/iu, 'unapproved client count'],
  [/250\+\s+clients/iu, 'unapproved client count'],
  [/(?:alertăm\s+în\s+sub|alert\s+in\s+under)\s+60\s+(?:de\s+)?sec/iu, 'SEKNET metric extrapolated beyond the product'],
  [/(?:2\s+zile\s*[·—-]\s*gratuit|2\s+days\s*[·—-]\s*free|free\s+(?:initial\s+)?2-day\s+assessment|assessment(?:-ul)?\s+gratuit(?:ă)?\s+(?:—\s*)?2\s+zile)/iu, 'unapproved assessment duration/price'],
];

const failures = [];
for (const file of await sourceFiles(sourceDir)) {
  const text = await readFile(file, 'utf8');
  for (const [pattern, reason] of forbidden) {
    if (reason.startsWith('SEKNET metric') && /\/solutii\/seknet\.astro$/.test(file)) continue;
    if (pattern.test(text)) failures.push(`${relative(sourceDir.pathname, file)}: ${reason}`);
  }
}

if (failures.length) {
  console.error(`Unregistered or over-broad claims found:\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log('Claims check passed.');
}
