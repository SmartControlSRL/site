#!/usr/bin/env node

// Rootless, dependency-free validation for the versioned production nginx
// template. This catches drift and checks the generated error documents. It is
// complementary to (not a replacement for) `nginx -t` during deployment.
import { existsSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const paths = {
  maps: resolve(ROOT, 'deployment/nginx/maps.conf'),
  rules: resolve(ROOT, 'deployment/nginx/site-rules.conf'),
  tls: resolve(ROOT, 'deployment/nginx/tls.conf'),
  site: resolve(ROOT, 'deployment/nginx/smartcontrol.ro.conf'),
  smoke: resolve(ROOT, 'deployment/nginx/local-smoke.conf'),
  preview: resolve(ROOT, 'vercel.json'),
  ro404: resolve(ROOT, 'dist/404.html'),
  en404: resolve(ROOT, 'dist/en/404/index.html'),
};

const errors = [];
const ok = [];
const argv = process.argv.slice(2);
if (argv.includes('--help')) {
  console.log(`Usage:
  node scripts/check-nginx-config.mjs [--installed-dir /etc/nginx/smartcontrol]

Without options, validates the checked-in nginx template and generated 404
documents. --installed-dir additionally performs an exact configuration-drift
comparison against an installed copy.`);
  process.exit(0);
}

function requireFile(name, path) {
  if (!existsSync(path)) {
    errors.push(`${name}: missing ${path}`);
    return '';
  }
  return readFileSync(path, 'utf8');
}

const config = Object.fromEntries(
  ['maps', 'rules', 'tls', 'site', 'smoke'].map((name) => [name, requireFile(name, paths[name])]),
);
const combined = Object.values(config).join('\n');

const installedIndex = argv.indexOf('--installed-dir');
if (installedIndex !== -1) {
  const installedArgument = argv[installedIndex + 1];
  if (!installedArgument) errors.push('--installed-dir requires a path');
  else {
    const installedDir = resolve(installedArgument);
    for (const name of ['maps', 'rules', 'tls', 'site']) {
      const installedPath = resolve(installedDir, basename(paths[name]));
      const installed = requireFile(`installed ${name}`, installedPath);
      if (installed && installed !== config[name]) {
        errors.push(`configuration drift: ${installedPath} differs from ${paths[name]}`);
      } else if (installed) ok.push(`installed ${name} matches`);
    }
  }
}

function expect(name, value, pattern, message = `missing ${pattern}`) {
  if (!pattern.test(value)) errors.push(`${name}: ${message}`);
  else ok.push(name);
}

function balancedBraces(name, value) {
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (const character of value.replace(/^\s*#.*$/gm, '')) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === '\\') {
      escaped = true;
      continue;
    }
    if (quote) {
      if (character === quote) quote = '';
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '{') {
      depth += 1;
    } else if (character === '}') {
      depth -= 1;
      if (depth < 0) break;
    }
  }
  if (depth !== 0 || quote) errors.push(`${name}: unbalanced braces or quotes`);
}

for (const [name, value] of Object.entries(config)) balancedBraces(name, value);

expect('locale error map', config.maps, /~\^\/en\(\?:\/\|\$\)\s+\/en\/404\/index\.html;/);
expect('default error map', config.maps, /default\s+\/404\.html;/);
expect('hashed asset cache', config.maps, /~\^\/_astro\/[^;]+max-age=31536000, immutable/);
expect('HTML revalidation', config.maps, /~\*\\\.html\$\s+"no-cache";/);
expect('non-hashed revalidation', config.maps, /max-age=3600, must-revalidate/);

expect('default index', config.rules, /\bindex\s+index\.html;/);
expect('MIME map', config.rules, /include\s+\/etc\/nginx\/mime\.types;/);
expect('safe MIME fallback', config.rules, /default_type\s+application\/octet-stream;/);
expect('gzip baseline', config.rules, /\bgzip\s+on;/);
expect('gzip proxy behavior', config.rules, /\bgzip_proxied\s+any;/);
expect('gzip vary', config.rules, /\bgzip_vary\s+on;/);

for (const header of [
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Permissions-Policy',
  'Cross-Origin-Opener-Policy',
  'Content-Security-Policy-Report-Only',
]) {
  expect(`header ${header}`, config.rules, new RegExp(`add_header\\s+${header.replaceAll('-', '\\-')}\\s+`));
}
for (const directive of [
  'default-src',
  'script-src',
  'style-src',
  'img-src',
  'font-src',
  'connect-src',
  'frame-ancestors',
  'base-uri',
  'object-src',
  'form-action',
]) {
  expect(`CSP ${directive}`, config.rules, new RegExp(`${directive}\\s`));
}

expect('real 404 status', config.rules, /error_page\s+404\s+=404\s+\$smartcontrol_error_document;/);
expect('RO error document internal', config.rules, /location\s+=\s+\/404\.html\s*{\s*internal;/s);
expect('EN error document internal', config.rules, /location\s+=\s+\/en\/404\/index\.html\s*{\s*internal;/s);
expect('directory-format routing', config.rules, /try_files\s+\$uri\s+\$uri\/\s+=404;/);
expect('hashed asset misses are 404', config.rules, /location\s+\^~\s+\/_astro\/\s*{[^}]*try_files\s+\$uri\s+=404;/s);

expect('HTTP to HTTPS', config.site, /return\s+308\s+https:\/\/smartcontrol\.ro\$request_uri;/);
expect('canonical host', config.site, /server_name\s+www\.smartcontrol\.ro;[\s\S]*?return\s+308\s+https:\/\/smartcontrol\.ro\$request_uri;/);
expect('production web root', config.site, /root\s+\/var\/www\/smartcontrol\.ro\/current;/);
expect('HTTP/2 enabled', config.site, /\bhttp2\s+on;/);
expect('HSTS', config.site, /add_header\s+Strict-Transport-Security\s+"max-age=31536000; includeSubDomains"\s+always;/);
expect('TLS 1.2 and 1.3', config.tls, /ssl_protocols\s+TLSv1\.2\s+TLSv1\.3;/);
expect('local unprivileged port', config.smoke, /listen\s+8080;/);
expect('local built-site root', config.smoke, /root\s+\/srv\/site;/);

if (/X-Robots-Tag\s+"?noindex/i.test(combined)) {
  errors.push('production nginx config must not emit X-Robots-Tag: noindex');
}
if (/BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/.test(combined)) {
  errors.push('private key material must not be committed');
}

const preview = requireFile('preview', paths.preview);
expect('preview noindex guard', preview, /"key"\s*:\s*"X-Robots-Tag"[\s\S]*?"value"\s*:\s*"noindex"/);

for (const [locale, path, lang, marker] of [
  ['RO 404', paths.ro404, 'ro', 'Pagina nu a fost găsită'],
  ['EN 404', paths.en404, 'en', 'Page not found'],
]) {
  const html = requireFile(locale, path);
  expect(`${locale} language`, html, new RegExp(`<html\\s+lang="${lang}"`));
  expect(`${locale} noindex`, html, /<meta(?=[^>]*name="robots")(?=[^>]*content="noindex")[^>]*>/);
  expect(`${locale} content`, html, new RegExp(marker));
  if (/<link\s+rel="(?:canonical|alternate)"/.test(html)) {
    errors.push(`${locale}: error document must not emit canonical or alternate links`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `FAIL: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`OK: nginx template passed ${ok.length} static checks`);
console.log('OK: RO and EN generated error documents are present, localized and noindex');
console.log('NOTE: run nginx -t and scripts/verify-production.mjs during an authorized deployment');
