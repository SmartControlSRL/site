import { createHash } from 'node:crypto';
import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const policyPath = resolve(root, 'config/public-claims-policy.json');
const policy = JSON.parse(await readFile(policyPath, 'utf8'));
const textExtensions = new Set(['.astro', '.ts', '.js', '.mjs', '.md', '.mdx', '.html', '.xml']);

if (!policy.register || !policy.reviewOwner || !policy.reviewBy) {
  throw new Error('Claims policy is missing register, reviewOwner, or reviewBy.');
}
if (!Array.isArray(policy.claims) || policy.claims.some((claim) =>
  !claim.id || claim.status !== 'blocked' || !claim.reason || !claim.patterns?.length
)) {
  throw new Error('Every machine-enforced claim must declare id, blocked status, reason, and patterns.');
}

async function existingTextFiles(target) {
  const path = resolve(root, target);
  let info;
  try {
    info = await stat(path);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  if (info.isFile()) return textExtensions.has(extname(path)) ? [path] : [];
  const entries = await readdir(path, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) =>
    existingTextFiles(resolve(path, entry.name))
  ))).flat();
}

const files = (await Promise.all(policy.scanTargets.map(existingTextFiles))).flat();
const failures = [];
for (const file of files) {
  const text = await readFile(file, 'utf8');
  const rel = relative(root, file).split('\\').join('/');
  const publicOutput = rel.startsWith('src/') || rel.startsWith('dist/');
  for (const claim of policy.claims) {
    const patterns = publicOutput
      ? [...claim.patterns, ...(claim.publicOnlyPatterns ?? [])]
      : claim.patterns;
    for (const source of patterns) {
      if (new RegExp(source, 'iu').test(text)) {
        failures.push(`${rel}: ${claim.id} — ${claim.reason}`);
        break;
      }
    }
  }
}

if (!Array.isArray(policy.socialAssets) || policy.socialAssets.length !== 2) {
  failures.push('Claims policy must register exactly one Romanian and one English social asset.');
} else {
  const locales = new Set(policy.socialAssets.map((entry) => entry.locale));
  if (locales.size !== 2 || !locales.has('ro') || !locales.has('en')) {
    failures.push('Claims policy social assets must cover the ro and en locales.');
  }
  for (const entry of policy.socialAssets) {
    const assetPath = resolve(root, entry.path);
    const asset = await readFile(assetPath);
    const assetHash = createHash('sha256').update(asset).digest('hex');
    if (assetHash !== entry.sha256) {
      failures.push(`${entry.path}: social asset hash does not match the approved policy hash`);
    }
    const binding = await readFile(resolve(root, entry.bindingSource), 'utf8');
    if (!binding.includes(entry.path.replace(/^public\//, ''))) {
      failures.push(`${entry.bindingSource}: ${entry.locale} social asset is not an active binding`);
    }
  }
}

if (failures.length) {
  console.error(`Blocked or unregistered public claims found:\n${[...new Set(failures)].join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Claims check passed across ${files.length} source, binding, and generated files.`);
}
