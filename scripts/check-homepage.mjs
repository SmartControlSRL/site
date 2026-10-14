// Built-homepage regression: the hero stack animation (intro → idle loop),
// its pause control and session preference, still fallbacks (reduced motion,
// no JS), useful geometry, and independence from the Cloud video across Astro
// navigation.
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
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};
const server = createServer(async (req, res) => {
  const path = new URL(req.url, "http://localhost").pathname;
  const file = join("dist", path.endsWith("/") ? `${path}index.html` : path);
  try {
    const data = await readFile(file);
    res.writeHead(200, {
      "Content-Type": mime[extname(file)] || "application/octet-stream",
      "Content-Length": data.length,
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const stackSelector = "[data-hero-stack]";
const toggleSelector = "[data-hero-stack-toggle]";
const cloudSelector = "[data-cloud-video]";
const PREF_KEY = "smartcontrol-homepage-animation-paused";
const errors = [];
let browser;

const state = (page) =>
  page.locator(stackSelector).evaluate((el) => el.dataset.state);

// Jump the finite intro to its end so the idle loop takes over.
async function skipIntro(page) {
  await page.waitForFunction(
    (sel) => document.querySelector(sel)?.dataset.state === "intro",
    stackSelector,
  );
  await page.locator(stackSelector).evaluate((el) =>
    el.getAnimations({ subtree: true }).forEach((a) => {
      if (a.effect.getComputedTiming().iterations !== Infinity) a.finish();
    }),
  );
  await page.waitForFunction(
    (sel) => document.querySelector(sel)?.dataset.state === "idle",
    stackSelector,
  );
}

async function moving(page) {
  const sample = () =>
    page.locator(stackSelector).evaluate((el) =>
      el
        .getAnimations({ subtree: true })
        .filter((a) => a.playState === "running")
        .map((a) => Number(a.currentTime)),
    );
  const before = await sample();
  assert(before.length > 0, "Hero stack has no running animations");
  await page.waitForTimeout(180);
  const after = await sample();
  assert(
    after.some((t, i) => t > (before[i] ?? 0) + 50),
    "Hero stack animations do not advance",
  );
}

// After the intro the scene must stay settled: resuming (Play, scrolling back,
// tab switch) must never rewind and replay the intro on top of the idle loop.
async function settled(page, label) {
  await page.waitForTimeout(150);
  const result = await page.locator(stackSelector).evaluate((el) => ({
    state: el.dataset.state,
    slabOpacity: getComputedStyle(el.querySelector(".hs-slab")).opacity,
    cameraTransform: getComputedStyle(el.querySelector(".hs-camera")).transform,
    replaying: el
      .getAnimations({ subtree: true })
      .filter(
        (a) =>
          a.playState === "running" &&
          a.effect.target?.closest?.(".hs-camera") &&
          a.effect.getComputedTiming().duration > 3000 &&
          a.effect.getComputedTiming().iterations !== Infinity,
      ).length,
  }));
  assert.equal(result.state, "idle", `${label}: left the idle state`);
  assert.equal(result.slabOpacity, "1", `${label}: intro replayed (L1 hidden)`);
  assert.equal(result.cameraTransform, "none", `${label}: camera intro replayed`);
  assert.equal(result.replaying, 0, `${label}: intro animations running again`);
}

async function frozen(page) {
  await page.waitForTimeout(80);
  const playStates = await page
    .locator(stackSelector)
    .evaluate((el) =>
      el.getAnimations({ subtree: true }).map((a) => a.playState),
    );
  assert(
    playStates.every((s) => s !== "running"),
    "Paused hero stack still animates",
  );
}

// Still fallback: all four slabs, their drawings and engraved labels visible.
async function still(page, label) {
  const result = await page.locator(stackSelector).evaluate((el) => {
    const visible = (node) => {
      let n = node;
      while (n && n !== document.body) {
        if (Number(getComputedStyle(n).opacity) < 0.3) return false;
        n = n.parentElement;
      }
      return true;
    };
    const slabs = [...el.querySelectorAll(".hs-slab")];
    return {
      slabs: slabs.length,
      allVisible: slabs.every(visible),
      images: [...el.querySelectorAll(".hs-slab img")].every(
        (img) => img.complete && img.naturalWidth > 0,
      ),
      tags: [...el.querySelectorAll(".hs-tag text")].map((t) =>
        t.textContent.replace(/ /g, " "),
      ),
      ariaHidden: el.getAttribute("aria-hidden"),
    };
  });
  assert.equal(result.slabs, 4, `${label}: expected four slabs`);
  assert(result.allVisible, `${label}: still state hides a slab`);
  assert(result.images, `${label}: slab image failed to load`);
  assert.equal(result.ariaHidden, "true", `${label}: visual must be decorative`);
  return result.tags;
}

async function geometry(page, route, width) {
  const result = await page.evaluate(() => {
    const hero = document.querySelector(".home-hero");
    const control = hero
      .querySelector("[data-hero-stack-toggle]")
      .getBoundingClientRect();
    const stack = hero.querySelector(".hs-stack").getBoundingClientRect();
    const copy = hero.querySelector(".hero-copy").getBoundingClientRect();
    const cta = hero.querySelector(".hero-actions a").getBoundingClientRect();
    const serviceBoxes = [...document.querySelectorAll(".service-link")].map(
      (element) => element.getBoundingClientRect(),
    );
    const overlap = (a, b) =>
      Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
      Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
    return {
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      serviceOverflow: serviceBoxes.some(
        (box) => box.left < -1 || box.right > innerWidth + 1,
      ),
      ctaBottom: cta.bottom + scrollY,
      controlInsideViewport:
        control.left >= 0 && control.right <= innerWidth + 1,
      controlSize: control.width >= 24 && control.height >= 24,
      controlOverlapsCopy: overlap(control, copy),
      stackOverlapsCopy: overlap(stack, copy),
      stackInsideViewport: stack.left >= -1 && stack.right <= innerWidth + 1,
    };
  });
  assert(
    !result.overflow && !result.serviceOverflow,
    `${route}@${width}: horizontal overflow`,
  );
  assert(
    result.controlInsideViewport && result.controlSize,
    `${route}@${width}: unusable animation control geometry`,
  );
  assert(
    !result.controlOverlapsCopy,
    `${route}@${width}: animation control overlaps hero copy`,
  );
  assert(
    !result.stackOverlapsCopy && result.stackInsideViewport,
    `${route}@${width}: hero stack overlaps copy or leaves the viewport`,
  );
  assert(
    result.ctaBottom < 750,
    `${route}@${width}: primary CTA too far down (${result.ctaBottom})`,
  );
}

try {
  browser = await chromium.launch();
  for (const route of ["/", "/en/"]) {
    const en = route === "/en/";
    const pauseLabel = en ? "Pause animation" : "Pauză animație";
    const playLabel = en ? "Play animation" : "Redă animația";
    const cloudPause = en ? "Pause video" : "Pauză video";
    const cloudPlay = en ? "Play video" : "Redă video-ul";
    const expectedTags = en
      ? [
          "L1  PHYSICAL INFRASTRUCTURE",
          "L2  NETWORK & CONNECTIVITY",
          "L3  PLATFORMS & DATA",
          "L4  APPLICATIONS & AUTOMATION",
        ]
      : [
          "L1  INFRASTRUCTURĂ FIZICĂ",
          "L2  REȚEA & CONECTIVITATE",
          "L3  PLATFORME & DATE",
          "L4  APLICAȚII & AUTOMATIZARE",
        ];
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(`${route}: ${error.message}`));
    await page.goto(base + route, { waitUntil: "networkidle" });
    const button = page.locator(toggleSelector);
    assert.equal(await page.locator(stackSelector).count(), 1);
    assert.equal(
      await page.locator("[data-homepage-video], .home-hero video").count(),
      0,
      "Old homepage video remains",
    );
    await moving(page);
    await skipIntro(page);
    await moving(page);
    assert.equal(await button.innerText(), pauseLabel);
    await button.click();
    await frozen(page);
    assert.equal(await button.innerText(), playLabel);
    await button.press("Space");
    await moving(page);
    assert.equal(await button.innerText(), pauseLabel);
    await settled(page, `${route} pause/play`);
    await page.evaluate(() => scrollTo(0, 3000));
    await page.waitForTimeout(200);
    await page.evaluate(() => scrollTo(0, 0));
    await settled(page, `${route} scroll away/back`);

    await page.emulateMedia({ reducedMotion: "reduce" });
    // CSS hides the toggle at once; the script settles on the (async)
    // media-query change event, so wait for its state, not the button.
    await button.waitFor({ state: "hidden" });
    await page.waitForFunction(
      (sel) => document.querySelector(sel)?.dataset.state === "static",
      stackSelector,
    );
    assert.deepEqual(await still(page, `${route} reduced`), expectedTags);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    // The media-query change event is async; wait for the intro to restart.
    await button.waitFor({ state: "visible" });
    await page.waitForFunction(
      (sel) => document.querySelector(sel)?.dataset.state === "intro",
      stackSelector,
    );
    await moving(page);
    assert.equal(await page.locator(".service-link").count(), 4);
    assert.equal(await page.locator(".product-link").count(), 2);

    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.reload({ waitUntil: "networkidle" });
      await skipIntro(page);
      await geometry(page, route, width);
    }

    // Home pause must not leak into the Cloud video, and Astro navigation must
    // tear the stack down.
    const cloudRoute = en ? "/en/servicii/cloud/" : "/servicii/cloud/";
    await button.click();
    await frozen(page);
    const originalDocument = await page.evaluateHandle(() => document);
    const oldStack = await page.locator(stackSelector).elementHandle();
    await page.locator(`.service-link[href="${cloudRoute}"]`).click();
    await page.waitForURL(base + cloudRoute);
    await page.locator(cloudSelector).waitFor();
    assert(
      await originalDocument.evaluate((previous) => previous === document),
      "Expected Astro client navigation",
    );
    assert(
      await oldStack.evaluate(
        (el) => !el.isConnected && el.getAnimations({ subtree: true }).length === 0,
      ),
      `${route}: Astro swap leaves the old stack animating`,
    );
    await page.locator("[data-cloud-video-toggle]").waitFor({ state: "visible" });
    assert.equal(
      await page.locator("[data-cloud-video-toggle]").innerText(),
      cloudPause,
      "Homepage pause leaked into Cloud",
    );
    await page.locator("[data-cloud-video-toggle]").click();
    await page.locator(`nav a[href="${route}"]`).first().click();
    await page.waitForURL(base + route);
    await button.waitFor({ state: "visible" });
    assert.equal(
      await button.innerText(),
      playLabel,
      "Homepage user pause lost on route re-entry",
    );
    assert.equal(await state(page), "paused");
    assert.deepEqual(await still(page, `${route} paused`), expectedTags);
    await button.press("Space");
    await moving(page);
    await page.locator(`.service-link[href="${cloudRoute}"]`).click();
    await page.waitForURL(base + cloudRoute);
    await page.locator("[data-cloud-video-toggle]").waitFor({ state: "visible" });
    assert.equal(
      await page.locator("[data-cloud-video-toggle]").innerText(),
      cloudPlay,
      "Resuming Home changed Cloud pause preference",
    );
    await page.locator(`nav a[href="${route}"]`).first().click();
    await page.waitForURL(base + route);
    await button.waitFor({ state: "visible" });
    assert.equal(
      await button.innerText(),
      pauseLabel,
      "Cloud pause leaked into resumed Home",
    );

    await button.click();
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(
      await button.innerText(),
      playLabel,
      "Session pause lost on reload",
    );
    assert.equal(await state(page), "paused");
    assert.equal(
      await page.evaluate((key) => sessionStorage.getItem(key), PREF_KEY),
      "true",
    );
    await context.close();

    for (const mode of ["no-js", "reduced"]) {
      const fallbackContext = await browser.newContext({
        javaScriptEnabled: mode !== "no-js",
        reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
        viewport: { width: 390, height: 844 },
      });
      const staticPage = await fallbackContext.newPage();
      const mediaRequests = [];
      staticPage.on("request", (request) => {
        if (request.url().includes(".mp4")) mediaRequests.push(request.url());
      });
      await staticPage.goto(base + route, { waitUntil: "networkidle" });
      // Without JS the still state fades in via the CSS fallback (1.2 s + 0.6 s).
      if (mode === "no-js") await staticPage.waitForTimeout(2100);
      assert.deepEqual(await still(staticPage, `${route} ${mode}`), expectedTags);
      assert(await staticPage.locator(toggleSelector).isHidden());
      assert(await staticPage.locator(".home-hero h1").isVisible());
      assert(
        await staticPage
          .locator('.hero-actions a[href^="mailto:"]')
          .isVisible(),
      );
      assert.equal(await staticPage.locator(".service-link").count(), 4);
      assert.equal(await staticPage.locator(".product-link").count(), 2);
      assert.equal(
        (await staticPage.locator("#contact a").last().textContent()).trim(),
        "office@smartcontrol.ro",
      );
      assert.deepEqual(
        mediaRequests,
        [],
        `${route} ${mode}: fallback downloaded video`,
      );
      await fallbackContext.close();
    }
  }
  assert.deepEqual(errors, [], "Homepage browser errors");
  console.log(
    "Homepage check passed: RO/EN hero stack intro → idle loop, click and Space pause, session pause across reload and Astro navigation, independent Cloud video preference and teardown, reduced-motion/no-JS still state with engraved labels, 320/390/768/1280px geometry, contact/CTA visibility.",
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
