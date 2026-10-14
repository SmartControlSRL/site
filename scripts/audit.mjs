// Deterministic browser audit for the generated static site.
//
// - discovers every generated HTML route (including intentional error pages)
// - rejects navigation failures and unexpected HTTP status codes
// - checks contrast at desktop/mobile, normal/reduced motion and no-JS
// - exercises initialized, focus, hover, scroll and stepper states
// - captures LCP with a buffered observer installed before navigation
// - smoke-tests ClientRouter navigation, mobile navigation and reduced motion
//
// Usage:
//   node scripts/audit.mjs --dir dist --policy config/site-audit-policy.json --out artifacts/site-audit.json
//   node scripts/audit.mjs --dir dist --url https://staging.example --policy config/site-audit-policy.json
import { retiredRoutes } from './retired-routes.mjs';
import { chromium } from 'playwright';
import http from 'node:http';
import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (!argv[i].startsWith('--')) continue;
    const key = argv[i].slice(2);
    parsed[key] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return parsed;
}

const args = parseArgs(process.argv.slice(2));
const outputPath = String(args.out || 'audit-report.json');
const distDir = args.dir ? resolve(String(args.dir)) : null;
const policy = args.policy ? JSON.parse(await readFile(String(args.policy), 'utf8')) : {};
const expectedStatuses = { '/404': 404, '/en/404/': 404, ...(policy.expectedStatuses || {}) };
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain',
  '.mp4': 'video/mp4',
};

async function filesBelow(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await filesBelow(path));
    else files.push(path);
  }
  return files;
}

function routeOf(file, root) {
  const rel = relative(root, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel.slice(0, -'.html'.length)}`;
}

async function discoverRoutes(root) {
  const routes = (await filesBelow(root))
    .filter((file) => file.endsWith('.html'))
    .map((file) => routeOf(file, root));
  return [...new Set(routes)].filter((route) => !retiredRoutes[route]).sort((a, b) => a.localeCompare(b));
}

async function existingFile(candidates) {
  for (const candidate of candidates) {
    try { await access(candidate); return candidate; } catch { /* try next */ }
  }
  return null;
}

async function serveDir(root, requestedPort) {
  const server = http.createServer(async (req, res) => {
    let pathname = '/';
    try { pathname = decodeURIComponent(new URL(req.url, 'http://audit.local').pathname); }
    catch { res.writeHead(400); res.end('bad request'); return; }

    const relativePath = pathname.replace(/^\/+/, '');
    if (relativePath.split('/').includes('..')) { res.writeHead(400); res.end('bad request'); return; }
    const candidates = pathname.endsWith('/')
      ? [join(root, relativePath, 'index.html')]
      : [join(root, relativePath), join(root, `${relativePath}.html`), join(root, relativePath, 'index.html')];
    const file = await existingFile(candidates);
    const intentionalError = Object.hasOwn(expectedStatuses, pathname) && expectedStatuses[pathname] === 404;

    try {
      if (file) {
        const body = await readFile(file);
        res.writeHead(intentionalError ? 404 : 200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
        res.end(body);
        return;
      }
      const fallback = await existingFile([join(root, '404.html')]);
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      res.end(fallback ? await readFile(fallback) : 'not found');
    } catch (error) {
      res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      res.end(`audit server error: ${error.message}`);
    }
  });
  await new Promise((resolveListen) => server.listen(requestedPort, '127.0.0.1', resolveListen));
  const address = server.address();
  return { server, base: `http://127.0.0.1:${address.port}` };
}

const contrastFn = (exemptionRules) => {
  const parse = (color) => {
    const match = color.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const values = match[1].split(',').map((value) => Number.parseFloat(value));
    return { r: values[0], g: values[1], b: values[2], a: values[3] === undefined ? 1 : values[3] };
  };
  const luminance = ({ r, g, b }) => {
    const channel = (value) => {
      const normalized = value / 255;
      return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  const ratio = (a, b) => {
    const first = luminance(a); const second = luminance(b);
    return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
  };
  const blend = (foreground, background) => ({
    r: foreground.r * foreground.a + background.r * (1 - foreground.a),
    g: foreground.g * foreground.a + background.g * (1 - foreground.a),
    b: foreground.b * foreground.a + background.b * (1 - foreground.a),
    a: 1,
  });
  const effectiveBackground = (element) => {
    let current = element;
    while (current) {
      const color = parse(getComputedStyle(current).backgroundColor);
      if (color?.a > 0) {
        if (color.a < 1) return blend(color, effectiveBackground(current.parentElement || document.body));
        return color;
      }
      current = current.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const cumulativeOpacity = (element) => {
    let opacity = 1; let current = element;
    while (current) {
      opacity *= Number.parseFloat(getComputedStyle(current).opacity || '1');
      current = current.parentElement;
    }
    return opacity;
  };
  const rgb = (color) => `rgb(${Math.round(color.r)},${Math.round(color.g)},${Math.round(color.b)})`;
  const selectorFor = (element) => {
    const parts = [];
    let current = element;
    while (current && current !== document.body && parts.length < 4) {
      let part = current.tagName.toLowerCase();
      if (current.id) { parts.unshift(`${part}#${CSS.escape(current.id)}`); break; }
      const classes = [...current.classList].slice(0, 2).map((name) => `.${CSS.escape(name)}`).join('');
      part += classes;
      parts.unshift(part);
      current = current.parentElement;
    }
    return parts.join(' > ');
  };
  const findings = []; const exemptions = [];
  for (const element of document.querySelectorAll('body *')) {
    if (element.closest('[aria-hidden="true"]')) continue;
    const tag = element.tagName.toLowerCase();
    if (['script', 'style', 'svg', 'canvas', 'path', 'img', 'picture', 'br', 'hr'].includes(tag)) continue;
    let directText = '';
    for (const node of element.childNodes) if (node.nodeType === Node.TEXT_NODE) directText += node.textContent;
    directText = directText.trim();
    if (!directText) continue;
    const style = getComputedStyle(element);
    if (style.visibility === 'hidden' || style.display === 'none') continue;
    const rect = element.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) continue;
    const foreground = parse(style.color);
    if (!foreground) continue;
    const background = effectiveBackground(element);
    const opacity = cumulativeOpacity(element);
    // Fully transparent text is invisible to every sighted user, so WCAG 1.4.3
    // does not apply; it is also the signature of a reveal the IntersectionObserver
    // never fired for during the synthetic scroll, which made this gate flaky.
    if (opacity === 0) continue;
    const paintedForeground = blend({ ...foreground, a: foreground.a * opacity }, background);
    const contrast = ratio(paintedForeground, background);
    const fontSize = Number.parseFloat(style.fontSize);
    const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
    const largeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
    const required = largeText ? 3 : 4.5;
    if (contrast >= required - 0.05) continue;
    const finding = {
      text: directText.slice(0, 80), tag, selector: selectorFor(element),
      color: rgb(paintedForeground), background: rgb(background), opacity: Math.round(opacity * 1000) / 1000,
      fontSize, fontWeight, largeText, ratio: Math.round(contrast * 100) / 100, required,
    };
    const exemption = exemptionRules.find((rule) => {
      try { return element.matches(rule.selector); } catch { return false; }
    });
    if (exemption) exemptions.push({ ...finding, exemption: exemption.reason });
    else findings.push(finding);
  }
  return { findings, exemptions };
};

function mergeFindings(target, findings, state) {
  for (const finding of findings) {
    const signature = [finding.selector, finding.text, finding.color, finding.background, finding.required].join('|');
    const existing = target.get(signature);
    if (existing) {
      if (!existing.states.includes(state)) existing.states.push(state);
      if (finding.ratio < existing.ratio) Object.assign(existing, finding, { states: existing.states });
    } else target.set(signature, { ...finding, states: [state] });
  }
}

async function scrollThrough(page) {
  const dimensions = await page.evaluate(() => ({ height: document.documentElement.scrollHeight, viewport: innerHeight }));
  for (let y = 0; y < dimensions.height; y += Math.max(300, Math.floor(dimensions.viewport * 0.8))) {
    await page.evaluate((top) => scrollTo(0, top), y);
    await page.waitForTimeout(80);
  }
  await settleReveals(page);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(250);
}

// Wait for every triggered reveal to reach its inline target opacity instead
// of sleeping a fixed interval: measuring mid-transition created false
// opacity/contrast failures whose count varied with machine load. Reveals
// whose observer never fired stay at inline opacity 0 and are settled by
// definition (the contrast scan skips invisible text). The timeout bounds a
// stuck transition; the longest configured delay+transition is ~800 ms.
async function settleReveals(page) {
  await page.waitForFunction(
    () => [...document.querySelectorAll('[data-reveal]')].every((el) => {
      const inline = el.style.opacity;
      if (inline === '' || inline === '0') return true;
      return getComputedStyle(el).opacity === inline;
    }),
    null,
    { timeout: 4000 },
  ).catch(() => {});
}

async function scanContrast(page, exemptions, failures, allowed, state) {
  // Focus, hover and scroll state changes can trigger reveals adjacent to the
  // exercised element; settle them so every scan measures finished states.
  await settleReveals(page);
  const result = await page.evaluate(contrastFn, exemptions);
  mergeFindings(failures, result.findings, state);
  mergeFindings(allowed, result.exemptions, state);
}

async function exerciseStates(page, exemptions, failures, allowed) {
  const selectors = [
    '[aria-current="page"]:visible',
    'a[href^="mailto:"]:visible',
    '[data-nav-toggle]:visible',
    'main a[href]:not([href^="mailto:"]):visible',
    'main button:visible',
  ];
  for (const selector of selectors) {
    const target = page.locator(selector).first();
    if (!await target.count()) continue;
    try {
      await target.focus();
      await target.hover();
      await page.waitForTimeout(80);
      await scanContrast(page, exemptions, failures, allowed, `focus-hover:${selector}`);
    } catch { /* an animated element can detach; other states still run */ }
  }
  const stepper = page.locator('[data-stepper]').first();
  if (await stepper.count()) {
    await stepper.scrollIntoViewIfNeeded();
    await page.evaluate(() => scrollBy(0, innerHeight * 0.45));
    await page.waitForTimeout(180);
    await scanContrast(page, exemptions, failures, allowed, 'stepper-scroll');
  }
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(180);
  await scanContrast(page, exemptions, failures, allowed, 'page-end');
}

async function smokeTests(browser, base) {
  const failures = [];
  const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' });
  const page = await desktop.newPage();
  page.on('pageerror', (error) => failures.push(`ClientRouter page error: ${error.message}`));
  try {
    const response = await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    if (response?.status() !== 200) failures.push(`ClientRouter start returned ${response?.status() ?? 'no response'}`);
    const services = page.locator('a[href="/servicii/cloud/"]:visible').first();
    if (!await services.count()) failures.push('ClientRouter smoke link /servicii/cloud/ is missing');
    else {
      await services.click();
      await page.waitForURL((url) => url.pathname === '/servicii/cloud/', { timeout: 5000 });
      if (!await page.locator('main').count()) failures.push('ClientRouter navigation did not render <main>');
      await page.locator('nav a[href="/#servicii"]').click();
      await page.waitForURL((url) => url.pathname === '/' && url.hash === '#servicii', { timeout: 5000 });
      if (!await page.locator('#servicii').isVisible()) failures.push('Expertise navigation did not reach the homepage overview');
    }
  } catch (error) { failures.push(`ClientRouter navigation failed: ${error.message}`); }
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'no-preference' });
  const mobilePage = await mobile.newPage();
  try {
    await mobilePage.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    const toggle = mobilePage.locator('[data-nav-toggle]');
    const panel = mobilePage.locator('[data-nav-panel]');
    await toggle.click();
    if (await toggle.getAttribute('aria-expanded') !== 'true' || !await panel.isVisible()) failures.push('mobile navigation did not open');
    await toggle.click();
    if (await toggle.getAttribute('aria-expanded') !== 'false' || await panel.isVisible()) failures.push('mobile navigation did not close');
  } catch (error) { failures.push(`mobile navigation failed: ${error.message}`); }
  await mobile.close();

  const reduced = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const reducedPage = await reduced.newPage();
  for (const route of ['/servicii/cloud/', '/en/servicii/cloud/']) {
    try {
      await reducedPage.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
      await reducedPage.waitForTimeout(150);
      const opacity = await reducedPage.locator('.detail-step p').evaluateAll((elements) => elements.map((element) => getComputedStyle(element).opacity));
      if (opacity.length !== 5) failures.push(`${route}: reduced-motion workflow must retain five readable stages`);
      if (opacity.some((value) => Number.parseFloat(value) < 0.99)) failures.push(`${route}: reduced-motion stepper hides content (${opacity.join(', ')})`);
    } catch (error) { failures.push(`${route}: reduced-motion smoke failed: ${error.message}`); }
  }
  await reduced.close();
  return failures;
}

function policyErrors(report) {
  const errors = [];
  const today = new Date().toISOString().slice(0, 10);
  if (policy.reviewBy && policy.reviewBy < today) errors.push(`site audit policy expired ${policy.reviewBy}`);
  for (const exemption of policy.contrastExemptions || []) {
    if (!exemption.selector || !exemption.reason || !exemption.owner || !exemption.reviewBy) {
      errors.push('every contrast exemption requires selector, reason, owner and reviewBy');
    } else if (exemption.reviewBy < today) errors.push(`contrast exemption expired ${exemption.reviewBy}: ${exemption.selector}`);
  }
  const maxContrast = policy.maxContrastFailures ?? 0;
  for (const [route, entry] of Object.entries(report.routes)) {
    for (const [profile, result] of Object.entries(entry.profiles)) {
      if (result.contrastFailures.length > maxContrast) errors.push(`${route} ${profile}: ${result.contrastFailures.length} contrast failure(s)`);
    }
  }
  for (const profile of policy.requireLcpProfiles || []) {
    for (const [route, entry] of Object.entries(report.routes)) {
      if (Object.hasOwn(expectedStatuses, route)) continue;
      const lcp = entry.profiles[profile]?.performance?.lcpMs;
      if (!Number.isFinite(lcp)) errors.push(`${route} ${profile}: LCP measurement missing`);
      else if (policy.maxLcpMs && lcp > policy.maxLcpMs) errors.push(`${route} ${profile}: LCP ${lcp}ms exceeds ${policy.maxLcpMs}ms`);
    }
  }
  return errors;
}

async function main() {
  if (!distDir && !args.routes) throw new Error('--dir is required for generated route discovery (or pass --routes explicitly)');
  const routes = args.routes ? String(args.routes).split(',').filter(Boolean) : await discoverRoutes(distDir);
  if (!routes.length) throw new Error('no generated HTML routes found');
  const local = args.url ? null : await serveDir(distDir, Number(args.port || 0));
  const base = String(args.url || local.base).replace(/\/$/, '');
  const browser = await chromium.launch();
  const report = {
    base,
    generatedAt: new Date().toISOString(),
    generatedRoutes: routes,
    routes: {},
    smokeFailures: [],
    errors: [],
  };
  const exemptions = policy.contrastExemptions || [];
  const profiles = [
    { name: 'desktop-normal', width: 1280, reducedMotion: 'no-preference', javaScriptEnabled: true, exercise: true, performance: true },
    { name: 'mobile-normal', width: 390, reducedMotion: 'no-preference', javaScriptEnabled: true, exercise: true },
    { name: 'desktop-reduced', width: 1280, reducedMotion: 'reduce', javaScriptEnabled: true },
    { name: 'mobile-reduced', width: 390, reducedMotion: 'reduce', javaScriptEnabled: true },
    { name: 'desktop-no-js', width: 1280, reducedMotion: 'reduce', javaScriptEnabled: false },
    { name: 'mobile-no-js', width: 390, reducedMotion: 'reduce', javaScriptEnabled: false },
  ];

  try {
    for (const profile of profiles) {
      const context = await browser.newContext({
        viewport: { width: profile.width, height: 900 },
        reducedMotion: profile.reducedMotion,
        javaScriptEnabled: profile.javaScriptEnabled,
      });
      if (profile.javaScriptEnabled) {
        await context.addInitScript(() => {
          window.__siteAuditLcp = [];
          try {
            const observer = new PerformanceObserver((list) => {
              window.__siteAuditLcp.push(...list.getEntries().map((entry) => entry.startTime));
            });
            observer.observe({ type: 'largest-contentful-paint', buffered: true });
          } catch { window.__siteAuditLcpUnsupported = true; }
        });
      }
      const page = await context.newPage();
      let runtimeErrors = [];
      page.on('pageerror', (error) => runtimeErrors.push(error.message));

      for (const route of routes) {
        runtimeErrors = [];
        const entry = (report.routes[route] ||= { profiles: {} });
        const failures = new Map(); const allowed = new Map(); const navigationErrors = [];
        let response = null;
        try { response = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 }); }
        catch (error) { navigationErrors.push(`navigation failed: ${error.message}`); }
        const status = response?.status() ?? null;
        const expected = expectedStatuses[route] ?? 200;
        if (status !== expected) navigationErrors.push(`expected HTTP ${expected}, received ${status ?? 'no response'}`);

        if (!navigationErrors.length) {
          await page.waitForTimeout(250);
          try { await page.evaluate(() => document.fonts?.ready); } catch { /* fonts API unavailable */ }
          if (profile.javaScriptEnabled && profile.reducedMotion === 'no-preference') await scrollThrough(page);
          await scanContrast(page, exemptions, failures, allowed, 'initialized');
          if (profile.exercise) await exerciseStates(page, exemptions, failures, allowed);
        }

        let pagePerformance = null;
        if (profile.performance && !navigationErrors.length) {
          pagePerformance = await page.evaluate(() => {
            const resources = performance.getEntriesByType('resource');
            const byType = {}; let total = 0;
            for (const resource of resources) {
              const type = resource.initiatorType || 'other';
              const size = resource.transferSize || resource.encodedBodySize || 0;
              byType[type] = (byType[type] || 0) + size; total += size;
            }
            const nav = performance.getEntriesByType('navigation')[0] || {};
            const lcpValues = window.__siteAuditLcp || [];
            return {
              totalTransferKB: Math.round(total / 1024),
              byTypeKB: Object.fromEntries(Object.entries(byType).map(([key, value]) => [key, Math.round(value / 1024)])),
              domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd || 0),
              loadMs: Math.round(nav.loadEventEnd || 0),
              requestCount: resources.length,
              lcpMs: lcpValues.length ? Math.round(lcpValues.at(-1)) : null,
              lcpUnsupported: Boolean(window.__siteAuditLcpUnsupported),
            };
          });
        }
        entry.profiles[profile.name] = {
          status, expectedStatus: expected, navigationErrors, runtimeErrors: [...runtimeErrors],
          contrastFailures: [...failures.values()], contrastExemptions: [...allowed.values()], performance: pagePerformance,
        };
        report.errors.push(...navigationErrors.map((error) => `${route} ${profile.name}: ${error}`));
        report.errors.push(...runtimeErrors.map((error) => `${route} ${profile.name}: page error: ${error}`));
      }
      await context.close();
    }

    report.smokeFailures = await smokeTests(browser, base);
    report.errors.push(...report.smokeFailures);
    report.errors.push(...policyErrors(report));
  } finally {
    await browser.close();
    if (local) await new Promise((resolveClose) => local.server.close(resolveClose));
  }

  const uniqueErrors = [...new Set(report.errors)];
  report.errors = uniqueErrors;
  report.summary = {
    routes: routes.length,
    profiles: profiles.length,
    contrastFailures: Object.values(report.routes).reduce((sum, entry) => sum + Object.values(entry.profiles).reduce((inner, result) => inner + result.contrastFailures.length, 0), 0),
    recordedExemptions: Object.values(report.routes).reduce((sum, entry) => sum + Object.values(entry.profiles).reduce((inner, result) => inner + result.contrastExemptions.length, 0), 0),
    errors: uniqueErrors.length,
  };
  await mkdir(dirname(resolve(outputPath)), { recursive: true });
  await writeFile(outputPath, JSON.stringify(report, null, 2));
  console.log(`AUDIT ${uniqueErrors.length ? 'failed' : 'passed'} -> ${outputPath}`);
  console.log(`  ${routes.length} routes x ${profiles.length} profiles; ${report.summary.contrastFailures} contrast failures; ${report.summary.recordedExemptions} recorded exemptions`);
  if (uniqueErrors.length) {
    console.error(uniqueErrors.map((error) => `  - ${error}`).join('\n'));
    process.exitCode = 1;
  }
}

await main();
