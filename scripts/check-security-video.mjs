// Security-specific media integration. Detailed controller lifecycle and
// autoplay behavior remain covered by check-cloud-video.mjs.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { chromium } from "playwright";

const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
};
const server = createServer(async (request, response) => {
  const path = new URL(request.url, "http://localhost").pathname;
  try {
    const file = join("dist", path.endsWith("/") ? path + "index.html" : path);
    const data = await readFile(file);
    response.writeHead(200, {
      "Content-Type": mime[extname(file)] ?? "application/octet-stream",
      "Content-Length": data.length,
    });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const route = "/servicii/securitate/";
const selector = '[data-hero-video="network-security"]';
const toggle = "[data-hero-video-toggle]";
const errors = [];
let browser;

async function playback(page, playing, query = selector) {
  await page.waitForFunction(
    ({ query, playing }) => {
      const video = document.querySelector(query);
      return (
        video &&
        (playing
          ? !video.paused &&
            video.currentTime > 0 &&
            video.dataset.ready === "true"
          : video.paused)
      );
    },
    { query, playing },
  );
  const before = await page
    .locator(query)
    .evaluate((video) => video.currentTime);
  await page.waitForTimeout(180);
  const delta =
    (await page.locator(query).evaluate((video) => video.currentTime)) - before;
  assert(
    playing ? delta > 0.05 : Math.abs(delta) < 0.03,
    `${query}: ${playing ? "playing" : "paused"} frames behave incorrectly`,
  );
}

async function fallback(page) {
  const image = page.locator(".detail-hero .ambient-artwork img");
  assert(await image.isVisible(), "Security poster is hidden");
  assert(
    await image.evaluate(
      (element) => element.complete && element.naturalWidth > 0,
    ),
    "Security poster failed to load",
  );
  assert.match(
    await image.evaluate((element) => element.currentSrc),
    /\/images\/network-security-video-(800|1280)\.webp$/,
  );
  assert.equal(
    await page.locator(selector).getAttribute("src"),
    null,
    "Fallback still loads Security video",
  );
  assert(
    await page.locator(toggle).isHidden(),
    "Static fallback offers an unusable control",
  );
  assert(await page.locator(".detail-hero h1").isVisible());
  assert(
    await page
      .locator('.detail-hero .detail-actions a[href^="mailto:"]')
      .isVisible(),
  );
}

try {
  browser = await chromium.launch();
  // Fresh contexts verify actual responsive source selection, not a resize of
  // an already downloaded desktop video.
  for (const prefix of ["", "/en"]) {
    for (const width of [320, 390, 1280]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
      });
      const page = await context.newPage();
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base + prefix + route, { waitUntil: "networkidle" });
      await playback(page, true);
      const video = page.locator(selector);
      const button = page.locator(toggle);
      const size = width <= 600 ? 800 : 1280;
      assert.equal(await video.count(), 1);
      assert.equal(
        await video.getAttribute("id"),
        "network-security-hero-video",
      );
      assert.equal(
        await video.getAttribute("src"),
        `/videos/network-security-hero-${size}.mp4`,
      );
      assert.match(
        await page
          .locator(".detail-hero .ambient-artwork img")
          .evaluate((image) => image.currentSrc),
        new RegExp(`/images/network-security-video-${size}\\.webp$`),
      );
      assert(
        await video.evaluate(
          (element) => element.muted && element.playsInline && element.loop,
        ),
        "Security media must be muted, inline and looping",
      );
      assert.equal(
        await button.innerText(),
        prefix ? "Pause video" : "Pauză video",
      );
      const geometry = await button.evaluate((element) => {
        const box = element.getBoundingClientRect();
        return {
          fits:
            document.documentElement.scrollWidth <= innerWidth + 1 &&
            box.left >= 0 &&
            box.right <= innerWidth + 1,
          usable: box.width >= 24 && box.height >= 24,
          overlaps: [
            ...document.querySelectorAll(
              ".detail-hero h1, .detail-hero .detail-lead, .detail-hero .detail-actions a",
            ),
          ].some((target) => {
            const copy = target.getBoundingClientRect();
            return (
              Math.min(box.right, copy.right) >
                Math.max(box.left, copy.left) + 1 &&
              Math.min(box.bottom, copy.bottom) >
                Math.max(box.top, copy.top) + 1
            );
          }),
        };
      });
      assert(
        geometry.fits && geometry.usable && !geometry.overlaps,
        `${prefix + route}@${width}: invalid control geometry ${JSON.stringify(geometry)}`,
      );
      await button.click();
      await playback(page, false);
      assert.equal(
        await button.innerText(),
        prefix ? "Play video" : "Redă video-ul",
      );
      await button.press("Space");
      await playback(page, true);
      // Validate the supplied file actually loops after decoding its end.
      if (width === 1280) {
        await video.evaluate((element) => {
          element.currentTime = element.duration - 0.15;
        });
        await page.waitForFunction((query) => {
          const element = document.querySelector(query);
          return !element.paused && element.currentTime < 1;
        }, selector);
      }
      await context.close();
    }
  }

  for (const mode of ["reduced", "no-js", "save-data"]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      javaScriptEnabled: mode !== "no-js",
      reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
    });
    if (mode === "save-data")
      await context.addInitScript(() =>
        Object.defineProperty(navigator, "connection", {
          value: { saveData: true },
        }),
      );
    const page = await context.newPage();
    const requests = [];
    page.on("request", (request) => {
      if (request.url().includes(".mp4")) requests.push(request.url());
    });
    await page.goto(base + route, { waitUntil: "networkidle" });
    await fallback(page);
    assert.deepEqual(
      requests,
      [],
      `${mode}: Security fallback downloads media`,
    );
    await context.close();
  }

  const failure = await browser.newContext();
  await failure.route("**/videos/network-security-hero-*.mp4", (request) =>
    request.fulfill({ status: 404, body: "missing" }),
  );
  const failedPage = await failure.newPage();
  await failedPage.goto(base + route);
  await failedPage.waitForFunction(
    (query) => document.querySelector(query)?.dataset.state === "static",
    selector,
  );
  await fallback(failedPage);
  await failure.close();

  // A new page key must not inherit Cloud's preference or leave its media
  // alive when Astro replaces the body.
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base + route);
  await playback(page, true);
  await page.locator(toggle).click();
  const oldSecurity = await page.locator(selector).elementHandle();
  const originalDocument = await page.evaluateHandle(() => document);
  await page.locator('footer a[href="/servicii/cloud/"]').first().click();
  await page.waitForURL(base + "/servicii/cloud/");
  await playback(page, true, "[data-cloud-video]");
  assert(
    await originalDocument.evaluate((previous) => previous === document),
    "Expected Astro client navigation",
  );
  assert(
    await oldSecurity.evaluate(
      (video) =>
        !video.isConnected && video.paused && !video.hasAttribute("src"),
    ),
    "Old Security video remains loaded after navigation",
  );
  await page.locator(toggle).click();
  const oldCloud = await page.locator("[data-cloud-video]").elementHandle();
  await page.locator(`footer a[href="${route}"]`).first().click();
  await page.waitForURL(base + route);
  await page.locator(toggle).waitFor({ state: "visible" });
  assert(
    await oldCloud.evaluate(
      (video) =>
        !video.isConnected && video.paused && !video.hasAttribute("src"),
    ),
    "Old Cloud video remains loaded after navigation",
  );
  assert.equal(
    await page.locator(toggle).innerText(),
    "Redă video-ul",
    "Security pause was not restored",
  );
  assert.equal(
    await page.locator(selector).getAttribute("src"),
    null,
    "Paused Security video downloaded on re-entry",
  );
  await page.locator(toggle).press("Space");
  await playback(page, true);
  assert.equal(
    await page.evaluate(() =>
      sessionStorage.getItem("smartcontrol-network-security-video-paused"),
    ),
    "false",
  );
  await page.locator('footer a[href="/servicii/cloud/"]').first().click();
  await page.waitForURL(base + "/servicii/cloud/");
  await page.locator(toggle).waitFor({ state: "visible" });
  assert.equal(
    await page.locator(toggle).innerText(),
    "Redă video-ul",
    "Security resume changed Cloud preference",
  );
  assert.equal(
    await page.locator("[data-cloud-video]").getAttribute("src"),
    null,
  );
  await context.close();

  const others = await browser.newPage();
  const requests = [];
  others.on("request", (request) => {
    if (request.url().includes("/videos/network-security-hero-"))
      requests.push(request.url());
  });
  for (const prefix of ["", "/en"])
    for (const path of [
      "/",
      "/servicii/software/",
      "/servicii/managed/",
      "/solutii/seknet/",
      "/solutii/s-vpn/",
    ]) {
      await others.goto(base + prefix + path, { waitUntil: "networkidle" });
      assert.equal(
        await others.locator(selector).count(),
        0,
        `${prefix + path}: unexpected Security video`,
      );
    }
  assert.deepEqual(requests, [], "Unrelated pages download Security video");
  assert.deepEqual(errors, [], "Security browser errors");
  console.log(
    "Security video check passed: RO/EN at 320/390/1280px, correct media/poster sources, actual playback/loop, keyboard pause and geometry, reduced-motion/no-JS/save-data without downloads, error fallback, Astro teardown and independent Cloud/Security preferences, Security-only media scope.",
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
