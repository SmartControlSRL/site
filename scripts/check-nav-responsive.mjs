// Focused regression check for issues #29 (navigation semantics/focus) and #28
// (service hero actions, nav/footer breakpoints, and meaningful overflow).
// Build first, then run: node scripts/check-nav-responsive.mjs
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
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function serveDist() {
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
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return server;
}

const semanticCases = [
  {
    path: '/servicii/securitate/',
    current: '/servicii/securitate/',
    parent: '/#servicii',
    alt: '/en/servicii/securitate/',
    label: 'EN — Comută în limba engleză',
    token: 'EN',
    lang: 'ro',
    altLang: 'en',
  },
  {
    path: '/servicii/cloud/',
    current: '/servicii/cloud/',
    parent: '/#servicii',
    alt: '/en/servicii/cloud/',
    label: 'EN — Comută în limba engleză',
    token: 'EN',
    lang: 'ro',
    altLang: 'en',
  },
  {
    path: '/en/solutii/s-vpn/',
    current: '/en/solutii/s-vpn/',
    parent: '/en/#produse',
    alt: '/solutii/s-vpn/',
    label: 'RO — Switch language to Romanian',
    token: 'RO',
    lang: 'en',
    altLang: 'ro',
  },
  {
    path: '/en/solutii/seknet/',
    current: '/en/solutii/seknet/',
    parent: '/en/#produse',
    alt: '/solutii/seknet/',
    label: 'RO — Switch language to Romanian',
    token: 'RO',
    lang: 'en',
    altLang: 'ro',
  },
];

const servicePaths = [
  '/servicii/cloud/',
  '/servicii/securitate/',
  '/servicii/software/',
  '/servicii/managed/',
  '/en/servicii/cloud/',
  '/en/servicii/securitate/',
  '/en/servicii/software/',
  '/en/servicii/managed/',
];

async function exposeCurrentNavigation(page, testCase, desktop) {
  if (desktop) {
    if (testCase.parent) {
      await page.locator(`[data-nav-dropdown-trigger][href="${testCase.parent}"]`).focus();
      await page.waitForTimeout(50);
    }
  } else {
    await page.locator('[data-nav-toggle]').click();
  }
}

async function checkNavigationSemantics(page, base, width) {
  const desktop = width >= 1024;
  await page.setViewportSize({ width, height: 900 });
  for (const testCase of semanticCases) {
    await page.goto(base + testCase.path, { waitUntil: 'networkidle' });
    await exposeCurrentNavigation(page, testCase, desktop);

    const exposedCurrent = page.locator('nav [aria-current="page"]:visible, [data-nav-panel] [aria-current="page"]:visible');
    assert(await exposedCurrent.count() === 1, `${testCase.path} @ ${width}: expected exactly one exposed current-page marker`);
    assert(await exposedCurrent.first().getAttribute('href') === testCase.current, `${testCase.path} @ ${width}: wrong current destination`);

    if (testCase.parent) {
      const scope = desktop ? page.locator('[data-nav-desktop]') : page.locator('[data-nav-panel]');
      const parent = scope.locator(`a[href="${testCase.parent}"]`).first();
      assert(await parent.getAttribute('aria-current') === null, `${testCase.path} @ ${width}: tree parent is semantically current`);
      const parentClass = await parent.getAttribute('class');
      assert(parentClass?.includes('font-semibold'), `${testCase.path} @ ${width}: tree parent lost visual highlighting`);
    }

    const switchLink = page.locator('nav a[hreflang]').first();
    assert(await switchLink.getAttribute('href') === testCase.alt, `${testCase.path}: non-canonical language-switch target`);
    assert(await switchLink.locator('#language-switch-token').getAttribute('lang') === testCase.altLang, `${testCase.path}: visible switch token has incorrect lang`);
    assert(await switchLink.locator('#language-switch-action').getAttribute('lang') === testCase.lang, `${testCase.path}: localized action has incorrect language boundary`);
    assert(await switchLink.getAttribute('hreflang') === testCase.altLang, `${testCase.path}: incorrect switch hreflang`);
    assert(await switchLink.getAttribute('lang') === testCase.altLang, `${testCase.path}: incorrect switch language boundary`);
    assert(await switchLink.getAttribute('aria-labelledby') === 'language-switch-token language-switch-action', `${testCase.path}: switch name is not composed from explicit language spans`);
    const switchName = await switchLink.evaluate((element) => element.textContent?.replace(/\s+/g, ' ').trim());
    assert(switchName === testCase.label, `${testCase.path}: incorrect localized accessible name`);
    assert(switchName?.includes(testCase.token), `${testCase.path}: visible language token absent from accessible name`);
  }
}

async function checkFocusAndResize(page, base) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(base + '/servicii/cloud/', { waitUntil: 'networkidle' });
  const desktopTrigger = page.locator('[data-nav-dropdown-trigger][href="/#servicii"]');
  await desktopTrigger.focus();
  const desktopPanel = desktopTrigger.locator('xpath=following-sibling::*[@data-nav-dropdown]');
  await desktopPanel.locator('a[href="/servicii/cloud/"]').focus();
  await page.keyboard.press('Escape');
  assert(await desktopTrigger.evaluate((element) => document.activeElement === element), 'desktop Escape did not restore trigger focus');
  assert(await desktopPanel.evaluate((element) => getComputedStyle(element).visibility === 'hidden'), 'desktop Escape did not dismiss dropdown');

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(base + '/en/servicii/cloud/', { waitUntil: 'networkidle' });
  const toggle = page.locator('[data-nav-toggle]');
  const mobilePanel = page.locator('[data-nav-panel]');
  await toggle.click();
  await mobilePanel.locator('a[href="/en/servicii/cloud/"]').focus();
  await page.keyboard.press('Escape');
  assert(await toggle.getAttribute('aria-expanded') === 'false' && await mobilePanel.isHidden(), 'mobile Escape did not close panel');
  assert(await toggle.evaluate((element) => document.activeElement === element), 'mobile Escape did not restore trigger focus');
  assert(await page.locator('body').evaluate((body) => body.style.overflow === ''), 'mobile Escape left body scroll locked');

  await toggle.click();
  assert(await page.locator('body').evaluate((body) => body.style.overflow === 'hidden'), 'open mobile panel did not lock body scroll');
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.waitForTimeout(100);
  assert(await toggle.getAttribute('aria-expanded') === 'false' && await mobilePanel.isHidden(), 'desktop breakpoint crossing did not reset mobile panel');
  assert(await page.locator('body').evaluate((body) => body.style.overflow === ''), 'desktop breakpoint crossing left body scroll locked');

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(base + '/servicii/cloud/', { waitUntil: 'networkidle' });
  const languageSwitch = page.locator('nav a[hreflang]').first();
  const hoverOnlyTrigger = page.locator('[data-nav-dropdown-trigger][href="/#servicii"]');
  await languageSwitch.focus();
  await hoverOnlyTrigger.hover();
  await page.keyboard.press('Escape');
  assert(await languageSwitch.evaluate((element) => document.activeElement === element), 'desktop Escape stole focus from an unrelated control');
}

async function checkBreakpointsAndFooter(page, base) {
  await page.goto(base + '/en/servicii/cloud/', { waitUntil: 'networkidle' });
  for (const width of [320, 390, 767, 768, 769, 1023, 1024, 1025, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(50);
    const desktopVisible = await page.locator('[data-nav-desktop]').isVisible();
    const toggleVisible = await page.locator('[data-nav-toggle]').isVisible();
    assert(desktopVisible === (width >= 1024), `@ ${width}: desktop navigation exposed at wrong breakpoint`);
    assert(toggleVisible === (width < 1024), `@ ${width}: mobile trigger exposed at wrong breakpoint`);
    if (toggleVisible) {
      const rect = await page.locator('[data-nav-toggle]').boundingBox();
      assert(rect && rect.width >= 40 && rect.height >= 40, `@ ${width}: hamburger target shrank below 40px`);
    }
    const navOverflow = await page.locator('nav').evaluate((nav) =>
      [...nav.querySelectorAll('a,button')]
        .filter((element) => {
          const style = getComputedStyle(element);
          return style.display !== 'none' && style.visibility !== 'hidden' && !element.closest('[hidden]');
        })
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return { text: element.textContent?.trim(), left: rect.left, right: rect.right };
        })
        .filter(({ left, right }) => left < -0.5 || right > innerWidth + 0.5)
    );
    assert(navOverflow.length === 0, `@ ${width}: meaningful nav overflow ${JSON.stringify(navOverflow)}`);
  }

  for (const [width, expectedColumns] of [[320, 1], [768, 2], [1024, 4], [1280, 4]]) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await page.locator('footer').evaluate((footer) => {
      const grid = footer.querySelector('[data-footer-grid]');
      const track = footer.querySelector('[data-footer-track]');
      const columns = (element) => getComputedStyle(element).gridTemplateColumns.split(' ').filter(Boolean);
      return {
        grid: columns(grid),
        track: columns(track),
        ticks: [...track.children].filter((tick) => getComputedStyle(tick).display !== 'none').length,
      };
    });
    assert(layout.grid.length === expectedColumns, `@ ${width}: footer expected ${expectedColumns} columns, got ${layout.grid.length}`);
    assert(layout.track.length === expectedColumns && layout.ticks === expectedColumns, `@ ${width}: footer datum track does not match active grid`);
    assert(layout.grid.every((column, index) => Math.abs(parseFloat(column) - parseFloat(layout.track[index])) < 0.2), `@ ${width}: footer datum tracks are misaligned`);
  }
}

async function checkServiceActions(page, base) {
  for (const path of servicePaths) {
    // The pages are fully static: navigate once and resize, matching
    // checkBreakpointsAndFooter, instead of reloading per width.
    await page.goto(base + path, { waitUntil: 'domcontentloaded' });
    for (const width of [320, 390, 767, 768, 769, 1023, 1024, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      const actions = page.locator('[data-service-hero-actions]');
      assert(await actions.count() === 1, `${path}: missing unique hero-action group`);
      const result = await actions.evaluate((group) => {
        const rects = [...group.children].map((element) => {
          const rect = element.getBoundingClientRect();
          return { left: rect.left, right: rect.right };
        });
        const textLink = group.querySelector('[data-text-link]');
        const textParts = textLink ? [...textLink.children].map((element) => element.getBoundingClientRect()) : [];
        return {
          direction: getComputedStyle(group).flexDirection,
          overflow: rects.filter(({ left, right }) => left < -0.5 || right > innerWidth + 0.5),
          textPartCount: textParts.length,
          textPartsShareLine: textParts.length === 2 && Math.abs(textParts[0].top - textParts[1].top) < 1,
        };
      });
      assert(result.direction === (width < 640 ? 'column' : 'row'), `${path} @ ${width}: wrong hero-action direction`);
      assert(result.overflow.length === 0, `${path} @ ${width}: hero action overflows viewport`);
      assert(result.textPartCount === 2 && result.textPartsShareLine, `${path} @ ${width}: TextLink label and chevron detached`);

      const meaningfulOverflow = await page.evaluate(() =>
        [...document.querySelectorAll('a,button,h1,h2,h3,p')]
          .filter((element) => {
            if (element.closest('[aria-hidden="true"], [hidden]')) return false;
            if (element.matches('.sr-only:not(:focus)')) return false;
            const style = getComputedStyle(element);
            return style.display !== 'none' && style.visibility !== 'hidden';
          })
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return { element: element.tagName, text: element.textContent?.trim().slice(0, 48), left: rect.left, right: rect.right };
          })
          .filter(({ left, right }) => left < -0.5 || right > innerWidth + 0.5)
      );
      assert(meaningfulOverflow.length === 0, `${path} @ ${width}: meaningful elements overflow ${JSON.stringify(meaningfulOverflow)}`);
    }
  }
}

const server = await serveDist();
const address = server.address();
const port = typeof address === 'object' && address ? address.port : 4393;
const base = `http://127.0.0.1:${port}`;
const browser = await chromium.launch();

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await checkNavigationSemantics(page, base, 1280);
  await checkNavigationSemantics(page, base, 390);
  await checkFocusAndResize(page, base);
  await checkBreakpointsAndFooter(page, base);
  await checkServiceActions(page, base);
  await page.close();
  console.log('Navigation/responsive check passed: semantics, focus, resize, CTAs, footer tracks, breakpoints, and meaningful bounds.');
} finally {
  await browser.close();
  server.close();
}
