// Focused StackTeardown regression check. Build first, then run:
//   node scripts/check-stack-teardown.mjs
//
// Covers the native disclosure contract, focus-safe cycling, localized cycle
// control, reduced-motion stability, and element geometry at 320/390/1280px.
import { chromium } from 'playwright';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const MIME = {
  '.css': 'text/css',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function serveDist(port = 0) {
  const server = http.createServer(async (request, response) => {
    try {
      let path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (path.endsWith('/')) path += 'index.html';
      const file = join('dist', path);
      const body = await readFile(file);
      response.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  });
  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  return server;
}

async function checkContract(page, route, width) {
  await page.goto(route, { waitUntil: 'networkidle' });
  const root = page.locator('[data-sctd]');
  await root.waitFor();

  const contract = await root.evaluate((section) => {
    const triggers = [...section.querySelectorAll('[data-sctd-trigger]')];
    const plates = [...section.querySelectorAll('.sctd-plate')];
    const controls = triggers.map((trigger) => {
      const panel = document.getElementById(trigger.getAttribute('aria-controls') || '');
      return {
        tag: trigger.tagName,
        controls: trigger.getAttribute('aria-controls'),
        expanded: trigger.getAttribute('aria-expanded'),
        panelExists: Boolean(panel),
        panelLabelledBy: panel?.getAttribute('aria-labelledby'),
        panelHidden: panel?.hidden,
        panelInert: panel?.hasAttribute('inert'),
        nestedLink: Boolean(trigger.querySelector('a')),
      };
    });
    const overflow = [...section.querySelectorAll('*')]
      .filter((element) => {
        const style = getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden';
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { element: `${element.tagName.toLowerCase()}.${element.className?.baseVal || element.className || ''}`, left: rect.left, right: rect.right };
      })
      .filter(({ left, right }) => left < -0.5 || right > innerWidth + 0.5);
    return {
      controls,
      uniquePanelIds: new Set(controls.map(({ controls: id }) => id)).size,
      plates: plates.map((plate) => ({
        role: plate.getAttribute('role'),
        tabindex: plate.getAttribute('tabindex'),
        hiddenFromAT: plate.getAttribute('aria-hidden'),
      })),
      visiblePanels: controls.filter(({ panelHidden }) => !panelHidden).length,
      overflow,
    };
  });

  assert(contract.controls.length === 4, `${route} @ ${width}: expected four disclosure buttons`);
  assert(contract.controls.every(({ tag }) => tag === 'BUTTON'), `${route} @ ${width}: disclosure is not a native button`);
  assert(contract.uniquePanelIds === 4, `${route} @ ${width}: panel IDs are not unique`);
  assert(contract.controls.every(({ controls, panelExists, panelLabelledBy }) => panelExists && panelLabelledBy && controls), `${route} @ ${width}: broken panel association`);
  assert(contract.controls.every(({ nestedLink }) => !nestedLink), `${route} @ ${width}: destination link is nested in a disclosure button`);
  assert(contract.visiblePanels === 1, `${route} @ ${width}: expected one visible panel`);
  assert(contract.plates.every(({ role, tabindex, hiddenFromAT }) => !role && !tabindex && hiddenFromAT === 'true'), `${route} @ ${width}: decorative plate exposes interaction semantics`);
  assert(contract.overflow.length === 0, `${route} @ ${width}: elements overflow viewport: ${JSON.stringify(contract.overflow)}`);

  const triggers = root.locator('[data-sctd-trigger]');
  await triggers.nth(1).focus();
  await page.keyboard.press('Enter');
  assert(await triggers.nth(1).getAttribute('aria-expanded') === 'true', `${route}: Enter did not expand layer 2`);
  assert(await triggers.nth(1).evaluate((element) => document.activeElement === element), `${route}: Enter moved focus`);
  await triggers.nth(2).focus();
  await page.keyboard.press('Space');
  assert(await triggers.nth(2).getAttribute('aria-expanded') === 'true', `${route}: Space did not expand layer 3`);
  assert(await triggers.nth(2).evaluate((element) => document.activeElement === element), `${route}: Space moved focus`);
}

const server = await serveDist();
const address = server.address();
const port = typeof address === 'object' && address ? address.port : 4392;
const browser = await chromium.launch();

try {
  for (const width of [320, 390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    for (const path of ['/', '/en/']) await checkContract(page, `http://127.0.0.1:${port}${path}`, width);
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  const root = page.locator('[data-sctd]');
  const firstLink = root.locator('.sctd-panel:not([hidden]) .sctd-link');
  await firstLink.focus();
  const before = await root.locator('[data-sctd-trigger][aria-expanded="true"]').getAttribute('data-layer');
  await page.waitForTimeout(3400);
  const after = await root.locator('[data-sctd-trigger][aria-expanded="true"]').getAttribute('data-layer');
  assert(before === after, 'cycling advanced while focus was inside the component');
  assert(await firstLink.evaluate((element) => document.activeElement === element), 'cycling destroyed focused panel content');

  const cycle = root.locator('[data-sctd-cycle]');
  assert(await cycle.isVisible(), 'normal-motion cycle control is not visible');
  assert((await cycle.textContent())?.includes('Oprește'), 'RO pause label is missing');
  assert(await cycle.getAttribute('aria-pressed') === null, 'cycle action exposes contradictory toggle state');
  await cycle.click();
  const pausedAt = await root.locator('[data-sctd-trigger][aria-expanded="true"]').getAttribute('data-layer');
  await page.mouse.move(0, 0);
  await page.locator('body').press('Tab');
  await page.waitForTimeout(3400);
  assert(await root.locator('[data-sctd-trigger][aria-expanded="true"]').getAttribute('data-layer') === pausedAt, 'explicit pause did not stop cycling');
  await context.close();

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(`http://127.0.0.1:${port}/en/`, { waitUntil: 'networkidle' });
  const reducedRoot = reducedPage.locator('[data-sctd]');
  assert(await reducedRoot.locator('[data-sctd-cycle]').isHidden(), 'reduced-motion mode exposes an unnecessary cycle control');
  const reducedBefore = await reducedRoot.locator('[data-sctd-trigger][aria-expanded="true"]').getAttribute('data-layer');
  await reducedPage.waitForTimeout(3400);
  assert(await reducedRoot.locator('[data-sctd-trigger][aria-expanded="true"]').getAttribute('data-layer') === reducedBefore, 'reduced-motion state is not stable');
  await reducedContext.close();

  const noJsContext = await browser.newContext({
    viewport: { width: 390, height: 900 },
    javaScriptEnabled: false,
  });
  const noJsPage = await noJsContext.newPage();
  await noJsPage.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
  const noJsRoot = noJsPage.locator('[data-sctd]');
  assert(await noJsRoot.locator('[data-sctd-trigger][aria-expanded="true"]').count() === 4, 'no-JS disclosures are not represented as expanded');
  assert(await noJsRoot.locator('.sctd-panel:visible').count() === 4, 'no-JS fallback hides layer content');
  assert(await noJsRoot.locator('.sctd-panel a:visible').count() === 4, 'no-JS fallback hides destination links');
  await noJsContext.close();

  console.log('StackTeardown check passed: disclosures, focus, pause, reduced motion, no-JS fallback, and 320/390/1280px geometry.');
} finally {
  await browser.close();
  server.close();
}
