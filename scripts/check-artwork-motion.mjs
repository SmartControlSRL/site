// Built-site checks for decorative header motion. Exercise browser animation
// timelines and real navigation, rather than trusting state attributes alone.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { chromium } from "playwright";

const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};
const server = createServer(async (request, response) => {
  const path = new URL(request.url, "http://localhost").pathname;
  const file = join("dist", path.endsWith("/") ? `${path}index.html` : path);
  try {
    const content = await readFile(file);
    response.writeHead(200, {
      "Content-Type": mime[extname(file)] || "application/octet-stream",
    });
    response.end(content);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const paths = [
  "/servicii/cloud/",
  "/servicii/securitate/",
  "/servicii/software/",
  "/servicii/managed/",
  "/solutii/seknet/",
  "/solutii/s-vpn/",
];
const artworkSelector = ".detail-hero .ambient-artwork[data-artwork-name]";
const toggleSelector = ".detail-hero [data-artwork-toggle]";
const browserErrors = [];
let browser;

function collectErrors(page, route) {
  page.on("pageerror", (error) =>
    browserErrors.push(`${route}: ${error.message}`),
  );
  page.on("response", (response) => {
    if (
      response.status() >= 400 &&
      /\.(webp|js|css)(\?|$)/.test(response.url())
    ) {
      browserErrors.push(`${route}: ${response.status()} ${response.url()}`);
    }
  });
}

async function state(page, expected) {
  await page.waitForFunction(
    ({ selector, value }) =>
      document.querySelector(selector)?.dataset.artworkState === value,
    { selector: artworkSelector, value: expected },
  );
}

async function timelines(artwork) {
  return artwork.evaluate((element) =>
    element.getAnimations({ subtree: true }).map((animation) => ({
      time: Number(animation.currentTime ?? 0),
      state: animation.playState,
    })),
  );
}

async function imageTransform(artwork) {
  return artwork.locator("img").evaluate((image) => {
    const transforms = [];
    // Moving a wrapper moves the actual image just as moving the img does.
    for (
      let node = image;
      node && !node.classList.contains("ambient-artwork");
      node = node.parentElement
    ) {
      transforms.push(getComputedStyle(node).transform);
    }
    return transforms.join(" | ");
  });
}

async function progresses(page, artwork, label) {
  const before = await timelines(artwork);
  assert(
    before.some((animation) => animation.state === "running"),
    `${label}: no running animation`,
  );
  const imageBefore = await imageTransform(artwork);
  await page.waitForTimeout(180);
  const after = await timelines(artwork);
  const imageAfter = await imageTransform(artwork);
  assert(
    after.some(
      (animation, index) =>
        animation.time > (before[index]?.time ?? Infinity) + 30,
    ),
    `${label}: animation timelines do not advance`,
  );
  assert.notEqual(
    imageAfter,
    imageBefore,
    `${label}: header image itself does not move`,
  );
}

async function frozen(page, artwork, label) {
  // Let a last rendering frame settle before comparing paused timelines.
  await page.waitForTimeout(60);
  const before = await timelines(artwork);
  const imageBefore = await imageTransform(artwork);
  await page.waitForTimeout(180);
  const after = await timelines(artwork);
  const imageAfter = await imageTransform(artwork);
  assert(
    after.every((animation) => animation.state !== "running"),
    `${label}: animation still running`,
  );
  assert.equal(
    after.length,
    before.length,
    `${label}: animation count changes while paused`,
  );
  assert(
    after.every(
      (animation, index) => Math.abs(animation.time - before[index].time) < 1,
    ),
    `${label}: paused timeline advances`,
  );
  assert.equal(
    imageAfter,
    imageBefore,
    `${label}: paused image transform changes`,
  );
}

async function noAnimations(artwork, label) {
  assert.equal(
    (await timelines(artwork)).length,
    0,
    `${label}: artwork retains an animation`,
  );
}

async function geometry(page, route, width) {
  await page.setViewportSize({ width, height: 900 });
  const result = await page.evaluate(() => {
    const hero = document.querySelector(".detail-hero");
    const control = hero
      .querySelector("[data-artwork-toggle]")
      .getBoundingClientRect();
    const targets = [
      ...hero.querySelectorAll("h1, .detail-lead, .detail-actions a"),
    ];
    const overlaps = targets
      .filter((target) => {
        const box = target.getBoundingClientRect();
        return (
          Math.min(control.right, box.right) -
            Math.max(control.left, box.left) >
            1 &&
          Math.min(control.bottom, box.bottom) -
            Math.max(control.top, box.top) >
            1
        );
      })
      .map((target) => target.tagName + ": " + target.textContent.trim());
    return {
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      controlInsideViewport:
        control.left >= 0 && control.right <= innerWidth + 1,
      controlSize: [control.width, control.height],
      overlaps,
    };
  });
  assert(
    !result.horizontalOverflow,
    `${route}@${width}: page overflows horizontally`,
  );
  assert(
    result.controlInsideViewport,
    `${route}@${width}: motion control leaves viewport`,
  );
  assert(
    result.controlSize.every((value) => value >= 24),
    `${route}@${width}: motion target below 24px`,
  );
  assert.deepEqual(
    result.overlaps,
    [],
    `${route}@${width}: motion control covers content`,
  );
}

try {
  browser = await chromium.launch();
  // Every distinct image and both locales must initialise, load, and keep the
  // motion control clear of reading and action areas at narrow widths.
  const smoke = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const smokePage = await smoke.newPage();
  collectErrors(smokePage, "route smoke");
  const names = new Map();
  for (const prefix of ["", "/en"]) {
    for (const path of paths) {
      const route = prefix + path;
      await smokePage.goto(base + route, { waitUntil: "networkidle" });
      await state(smokePage, "running");
      const artwork = smokePage.locator(artworkSelector);
      const toggle = smokePage.locator(toggleSelector);
      assert.equal(
        await artwork.count(),
        1,
        `${route}: expected one hero artwork`,
      );
      assert.equal(
        await toggle.count(),
        1,
        `${route}: expected one motion control`,
      );
      assert(await toggle.isVisible(), `${route}: motion control hidden`);
      assert.equal(
        await toggle.getAttribute("aria-pressed"),
        "false",
        `${route}: unexpected initial pause`,
      );
      assert(
        await artwork.locator("[data-artwork-layer]").count(),
        `${route}: motion layers missing`,
      );
      assert.equal(
        await artwork.locator("svg[data-artwork-effects]").count(),
        1,
        `${route}: effects missing`,
      );
      assert(
        await artwork
          .locator("img")
          .evaluate((image) => image.complete && image.naturalWidth > 0),
        `${route}: image failed to load`,
      );
      const label = await toggle.getAttribute("aria-label");
      assert.equal(
        await toggle.getAttribute("title"),
        label,
        `${route}: title and accessible label differ`,
      );
      assert.match(
        label || "",
        prefix ? /pause|resume/i : /oprește|pauză|pornește|reia/i,
        `${route}: control label is not localised`,
      );
      const name = await artwork.getAttribute("data-artwork-name");
      if (prefix)
        assert.equal(name, names.get(path), `${route}: locale changes artwork`);
      else names.set(path, name);
      await progresses(smokePage, artwork, route);
      for (const width of [320, 390, 1280])
        await geometry(smokePage, route, width);
    }
  }
  assert.equal(
    new Set(names.values()).size,
    6,
    "Every service/product must retain its distinct image",
  );
  await smoke.close();

  for (const prefix of ["", "/en"]) {
    const route = prefix + "/servicii/securitate/";
    const productRoute = prefix + "/solutii/seknet/";
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const page = await context.newPage();
    collectErrors(page, route);
    await page.goto(base + route, { waitUntil: "networkidle" });
    const artwork = page.locator(artworkSelector);
    const toggle = page.locator(toggleSelector);
    await state(page, "running");

    await toggle.click();
    await state(page, "paused");
    assert.equal(await toggle.getAttribute("aria-pressed"), "true");
    await frozen(page, artwork, `${route}: manual pause`);
    await toggle.press("Space");
    await state(page, "running");
    assert.equal(await toggle.getAttribute("aria-pressed"), "false");
    await progresses(page, artwork, `${route}: keyboard resume`);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await state(page, "paused");
    await frozen(page, artwork, `${route}: outside viewport`);
    assert.equal(
      await toggle.getAttribute("aria-pressed"),
      "false",
      `${route}: visibility pause became a user preference`,
    );
    await page.evaluate(() => window.scrollTo(0, 0));
    await state(page, "running");
    await progresses(page, artwork, `${route}: viewport resume`);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await state(page, "static");
    assert(
      await toggle.isHidden(),
      `${route}: reduced-motion control should be hidden`,
    );
    await noAnimations(artwork, `${route}: live reduced motion`);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await state(page, "running");
    await progresses(page, artwork, `${route}: reduced motion disabled`);
    await toggle.click();
    await state(page, "paused");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await state(page, "static");
    await noAnimations(artwork, `${route}: manual pause plus reduced motion`);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await state(page, "paused");
    assert.equal(
      await toggle.getAttribute("aria-pressed"),
      "true",
      `${route}: user pause lost after preference change`,
    );

    // Use real Astro links. Holding the old document proves this was client
    // navigation; holding old animations detects missing teardown explicitly.
    const originalDocument = await page.evaluateHandle(() => document);
    const oldArtwork = await artwork.elementHandle();
    const oldToggle = await toggle.elementHandle();
    const oldAnimations = await artwork.evaluateHandle((element) =>
      element.getAnimations({ subtree: true }),
    );
    const home = prefix + "/";
    await page.locator(`nav a[href="${home}"]`).first().click();
    await page.waitForURL(base + home);
    await page.locator(`.product-link[href="${productRoute}"]`).click();
    await page.waitForURL(base + productRoute);
    await state(page, "paused");
    assert(
      await originalDocument.evaluate(
        (documentBefore) => documentBefore === document,
      ),
      `${route}: expected Astro client navigation`,
    );
    assert.equal(
      await oldArtwork.evaluate((element) => element.isConnected),
      false,
      `${route}: previous artwork retained in document`,
    );
    assert(
      await oldAnimations.evaluate((animations) =>
        animations.every((animation) => animation.playState === "idle"),
      ),
      `${route}: old artwork animation survives navigation`,
    );
    assert.equal(
      await toggle.getAttribute("aria-pressed"),
      "true",
      `${productRoute}: user pause did not persist across pages`,
    );
    await frozen(page, artwork, `${productRoute}: persistent user pause`);

    // Clicking a detached old button must have no effect. This catches event
    // handlers that survived before-swap even when their image is no longer seen.
    const savedPause = await page.evaluate(() =>
      sessionStorage.getItem("smartcontrol-artwork-paused"),
    );
    await oldToggle.evaluate((element) => element.click());
    await page.waitForTimeout(60);
    assert.equal(
      await toggle.getAttribute("aria-pressed"),
      "true",
      `${route}: detached control affects current artwork`,
    );
    assert.equal(
      await page.evaluate(() =>
        sessionStorage.getItem("smartcontrol-artwork-paused"),
      ),
      savedPause,
      `${route}: detached control changed stored pause`,
    );
    await toggle.press("Space");
    await state(page, "running");
    assert.equal(
      await toggle.getAttribute("aria-pressed"),
      "false",
      `${productRoute}: duplicate handler prevents resume`,
    );

    await page.locator(`nav a[href="${home}"]`).first().click();
    await page.waitForURL(base + home);
    await page.locator(`.service-link[href="${route}"]`).click();
    await page.waitForURL(base + route);
    await state(page, "running");
    await toggle.click();
    await state(page, "paused");
    assert.equal(
      await toggle.getAttribute("aria-pressed"),
      "true",
      `${route}: control failed after re-entry`,
    );
    await page.reload({ waitUntil: "networkidle" });
    await state(page, "paused");
    assert.equal(
      await toggle.getAttribute("aria-pressed"),
      "true",
      `${route}: session pause lost on reload`,
    );
    await context.close();

    for (const reducedMotion of [true, false]) {
      const staticContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        reducedMotion: reducedMotion ? "reduce" : "no-preference",
        javaScriptEnabled: reducedMotion,
      });
      const staticPage = await staticContext.newPage();
      for (const staticRoute of [route, productRoute]) {
        await staticPage.goto(base + staticRoute, { waitUntil: "networkidle" });
        const staticArtwork = staticPage.locator(artworkSelector);
        assert(
          await staticArtwork.locator("img").isVisible(),
          `${staticRoute}: static image invisible`,
        );
        assert(
          await staticArtwork
            .locator("img")
            .evaluate((image) => image.complete && image.naturalWidth > 0),
          `${staticRoute}: static image failed to load`,
        );
        assert(
          await staticPage.locator(".detail-hero h1").isVisible(),
          `${staticRoute}: static heading invisible`,
        );
        assert(
          await staticPage
            .locator('.detail-hero .detail-actions a[href^="mailto:"]')
            .isVisible(),
          `${staticRoute}: static CTA invisible`,
        );
        assert(
          await staticPage.locator(toggleSelector).isHidden(),
          `${staticRoute}: static mode offers unusable control`,
        );
        await noAnimations(
          staticArtwork,
          `${staticRoute}: ${reducedMotion ? "initial reduced motion" : "no JavaScript"}`,
        );
      }
      await staticContext.close();
    }
  }

  const homeContext = await browser.newContext();
  const homePage = await homeContext.newPage();
  for (const route of ["/", "/en/"]) {
    await homePage.goto(base + route, { waitUntil: "networkidle" });
    const artwork = homePage.locator(
      '.ambient-artwork[data-artwork-name="optical-dark"]',
    );
    assert.equal(
      await artwork.count(),
      1,
      `${route}: static product band artwork missing`,
    );
    await artwork.scrollIntoViewIfNeeded();
    await noAnimations(artwork, `${route}: homepage band must remain static`);
    assert.equal(
      await homePage.locator("[data-artwork-toggle]").count(),
      0,
      `${route}: homepage band should not have a motion control`,
    );
  }
  await homeContext.close();
  assert.deepEqual(browserErrors, [], "Browser errors or failed assets");
  console.log(
    "Artwork motion check passed: 12 detail routes, distinct images and RO/EN controls, 320/390/1280px geometry, actual image/timeline motion, click/Space pause and resume, offscreen suspension, live/initial reduced motion, no-JS content, Astro teardown and session pause persistence, static homepage band.",
  );
  console.log(
    "Coverage limit: real background-tab visibility is not exercised by headless Chromium; no document-state simulation is used.",
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
