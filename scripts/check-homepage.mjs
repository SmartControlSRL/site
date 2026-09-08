// Built-homepage regression: actual video playback, resilient content, useful
// geometry and independent Home/Cloud preferences across Astro navigation.
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
const videoSelector = "[data-homepage-video]";
const toggleSelector = "[data-homepage-video-toggle]";
const cloudSelector = "[data-cloud-video]";
const errors = [];
let browser;

async function playing(page, selector = videoSelector) {
  await page.waitForFunction((query) => {
    const video = document.querySelector(query);
    return (
      video &&
      !video.paused &&
      video.currentTime > 0 &&
      video.dataset.ready === "true"
    );
  }, selector);
  const video = page.locator(selector);
  const before = await video.evaluate((element) => element.currentTime);
  await page.waitForTimeout(180);
  const after = await video.evaluate((element) => element.currentTime);
  assert(after > before + 0.05, `${selector}: video frames do not advance`);
}

async function frozen(page, selector = videoSelector) {
  await page.waitForTimeout(80);
  const video = page.locator(selector);
  const before = await video.evaluate((element) => ({
    paused: element.paused,
    time: element.currentTime,
  }));
  assert(before.paused, `${selector}: video did not pause`);
  await page.waitForTimeout(180);
  assert(
    Math.abs(
      (await video.evaluate((element) => element.currentTime)) - before.time,
    ) < 0.03,
    `${selector}: paused frames still advance`,
  );
}

async function poster(page) {
  const image = page.locator(".home-hero .ambient-artwork img");
  assert(await image.isVisible(), "Homepage poster is hidden");
  assert(
    await image.evaluate(
      (element) => element.complete && element.naturalWidth > 0,
    ),
    "Homepage poster failed to load",
  );
  assert.equal(
    await page.locator(videoSelector).getAttribute("src"),
    null,
    "Static fallback still loads video",
  );
  assert(
    await page.locator(toggleSelector).isHidden(),
    "Static fallback offers an unusable control",
  );
}

async function detachedVideo(handle, label) {
  assert(
    await handle.evaluate(
      (video) =>
        !video.isConnected && video.paused && !video.hasAttribute("src"),
    ),
    `${label}: Astro swap leaves old video loaded`,
  );
}

async function geometry(page, route, width) {
  const result = await page.evaluate(() => {
    const hero = document.querySelector(".home-hero");
    const control = hero
      .querySelector("[data-homepage-video-toggle]")
      .getBoundingClientRect();
    const image = hero
      .querySelector(".ambient-artwork")
      .getBoundingClientRect();
    const copy = hero.querySelector(".hero-copy").getBoundingClientRect();
    const cta = hero.querySelector(".hero-actions a").getBoundingClientRect();
    const serviceBoxes = [...document.querySelectorAll(".service-link")].map(
      (element) => element.getBoundingClientRect(),
    );
    return {
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      serviceOverflow: serviceBoxes.some(
        (box) => box.left < -1 || box.right > innerWidth + 1,
      ),
      ctaBottom: cta.bottom + scrollY,
      controlInsideViewport:
        control.left >= 0 && control.right <= innerWidth + 1,
      controlSize: control.width >= 24 && control.height >= 24,
      controlOverlapsCopy:
        Math.min(control.right, copy.right) -
          Math.max(control.left, copy.left) >
          1 &&
        Math.min(control.bottom, copy.bottom) -
          Math.max(control.top, copy.top) >
          1,
      mobileImageBelowCopy: innerWidth > 600 || image.top >= copy.bottom - 1,
    };
  });
  assert(
    !result.overflow && !result.serviceOverflow,
    `${route}@${width}: horizontal overflow`,
  );
  assert(
    result.controlInsideViewport && result.controlSize,
    `${route}@${width}: unusable video control geometry`,
  );
  assert(
    !result.controlOverlapsCopy,
    `${route}@${width}: video control overlaps hero copy`,
  );
  assert(
    result.mobileImageBelowCopy,
    `${route}@${width}: mobile video area overlaps copy`,
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
    const pauseLabel = en ? "Pause video" : "Pauză video";
    const playLabel = en ? "Play video" : "Redă video-ul";
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const page = await context.newPage();
    const requests = [];
    page.on("pageerror", (error) => errors.push(`${route}: ${error.message}`));
    page.on("request", (request) => {
      if (request.url().includes("/videos/homepage-hero-"))
        requests.push(request.url());
    });
    await page.goto(base + route, { waitUntil: "networkidle" });
    const button = page.locator(toggleSelector);
    await playing(page);
    assert.equal(await page.locator(videoSelector).count(), 1);
    assert.equal(
      await page.locator("[data-map-toggle]").count(),
      0,
      "Old map control remains",
    );
    assert.equal(await button.innerText(), pauseLabel);
    assert(
      await page
        .locator(videoSelector)
        .evaluate((video) => video.muted && video.playsInline && video.loop),
      "Hero video must be muted, inline and looping",
    );
    await button.click();
    await frozen(page);
    assert.equal(await button.innerText(), playLabel);
    await button.press("Space");
    await playing(page);
    assert.equal(await button.innerText(), pauseLabel);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await button.waitFor({ state: "hidden" });
    await poster(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await playing(page);
    assert.equal(await page.locator(".service-link").count(), 4);
    assert.equal(await page.locator(".product-link").count(), 2);

    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      // Reload to exercise source selection, which intentionally occurs once
      // per media load instead of redownloading on every viewport resize.
      await page.reload({ waitUntil: "networkidle" });
      await playing(page);
      assert.match(
        await page.locator(videoSelector).getAttribute("src"),
        width <= 600 ? /homepage-hero-800\.mp4$/ : /homepage-hero-1280\.mp4$/,
      );
      await geometry(page, route, width);
    }
    // Exercise an actual loop rather than only checking the loop attribute.
    await page.locator(videoSelector).evaluate((video) => {
      video.currentTime = video.duration - 0.15;
    });
    await page.waitForFunction(() => {
      const video = document.querySelector("[data-homepage-video]");
      return !video.paused && video.currentTime < 1;
    });

    const cloudRoute = en ? "/en/servicii/cloud/" : "/servicii/cloud/";
    await button.click();
    await frozen(page);
    const originalDocument = await page.evaluateHandle(() => document);
    const oldHome = await page.locator(videoSelector).elementHandle();
    await page.locator(`.service-link[href="${cloudRoute}"]`).click();
    await page.waitForURL(base + cloudRoute);
    await playing(page, cloudSelector);
    assert(
      await originalDocument.evaluate((previous) => previous === document),
      "Expected Astro client navigation",
    );
    await detachedVideo(oldHome, route);
    assert.equal(
      await page.locator("[data-cloud-video-toggle]").innerText(),
      pauseLabel,
      "Homepage pause leaked into Cloud",
    );
    await page.locator("[data-cloud-video-toggle]").click();
    await frozen(page, cloudSelector);
    const oldCloud = await page.locator(cloudSelector).elementHandle();
    await page.locator(`nav a[href="${route}"]`).first().click();
    await page.waitForURL(base + route);
    await button.waitFor({ state: "visible" });
    await detachedVideo(oldCloud, cloudRoute);
    assert.equal(
      await button.innerText(),
      playLabel,
      "Homepage user pause lost on route re-entry",
    );
    assert.equal(
      await page.locator(videoSelector).getAttribute("src"),
      null,
      "Paused homepage downloaded video on re-entry",
    );
    await button.press("Space");
    await playing(page);
    await page.locator(`.service-link[href="${cloudRoute}"]`).click();
    await page.waitForURL(base + cloudRoute);
    await page
      .locator("[data-cloud-video-toggle]")
      .waitFor({ state: "visible" });
    assert.equal(
      await page.locator("[data-cloud-video-toggle]").innerText(),
      playLabel,
      "Resuming Home changed Cloud pause preference",
    );
    assert.equal(await page.locator(cloudSelector).getAttribute("src"), null);
    await page.locator(`nav a[href="${route}"]`).first().click();
    await page.waitForURL(base + route);
    await playing(page);
    assert.equal(
      await button.innerText(),
      pauseLabel,
      "Cloud pause leaked into resumed Home",
    );

    await button.click();
    requests.length = 0;
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(
      await button.innerText(),
      playLabel,
      "Session pause lost on reload",
    );
    assert.equal(await page.locator(videoSelector).getAttribute("src"), null);
    assert.deepEqual(
      requests,
      [],
      "Session-paused homepage still downloads video",
    );
    assert.equal(
      await page.evaluate(() =>
        sessionStorage.getItem("smartcontrol-homepage-video-paused"),
      ),
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
      await poster(staticPage);
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

  const failure = await browser.newContext();
  await failure.route("**/videos/homepage-hero-*.mp4", (route) =>
    route.fulfill({ status: 404, body: "missing" }),
  );
  const failurePage = await failure.newPage();
  await failurePage.goto(base + "/");
  await failurePage.waitForFunction(
    () =>
      document.querySelector("[data-homepage-video]").dataset.state ===
      "static",
  );
  await poster(failurePage);
  assert(
    await failurePage.locator('.hero-actions a[href^="mailto:"]').isVisible(),
    "Video failure hides primary CTA",
  );
  await failure.close();
  assert.deepEqual(errors, [], "Homepage browser errors");
  console.log(
    "Homepage check passed: RO/EN, 320/390/768/1280px layout and responsive video sources, actual playback/loop, click and Space pause, reduced-motion/no-JS poster with no video downloads, error fallback, contact/CTA visibility, Home–Cloud Astro teardown and independent session pause preferences.",
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
