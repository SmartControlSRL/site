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
const server = createServer(async (req, res) => {
  const path = new URL(req.url, "http://localhost").pathname;
  try {
    const file = join("dist", path.endsWith("/") ? path + "index.html" : path);
    const data = await readFile(file);
    res.writeHead(200, {
      "Content-Type": mime[extname(file)] ?? "application/octet-stream",
      "Content-Length": data.length,
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const selector = "[data-cloud-video]";
const toggle = "[data-cloud-video-toggle]";
const errors = [];
let browser;

async function playing(page) {
  await page.waitForFunction(() => {
    const v = document.querySelector("[data-cloud-video]");
    return v && !v.paused && v.currentTime > 0 && v.dataset.ready === "true";
  });
  const before = await page.locator(selector).evaluate((v) => v.currentTime);
  await page.waitForTimeout(180);
  const after = await page.locator(selector).evaluate((v) => v.currentTime);
  assert(after > before + 0.05, "Video frames do not advance");
}

async function frozen(page) {
  await page.waitForTimeout(80);
  const before = await page
    .locator(selector)
    .evaluate((v) => ({ paused: v.paused, time: v.currentTime }));
  assert(before.paused);
  await page.waitForTimeout(180);
  const after = await page.locator(selector).evaluate((v) => v.currentTime);
  assert(Math.abs(after - before.time) < 0.03, "Paused video advances");
}

async function poster(page) {
  assert(
    await page
      .locator(".ambient-artwork img")
      .evaluate((img) => img.complete && img.naturalWidth > 0),
  );
  assert.equal(await page.locator(selector).getAttribute("src"), null);
  assert.equal(await page.locator(toggle).isVisible(), false);
}

try {
  browser = await chromium.launch();
  for (const width of [320, 390, 1280]) {
    for (const prefix of ["", "/en"]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
      });
      const page = await context.newPage();
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(base + prefix + "/servicii/cloud/", {
        waitUntil: "networkidle",
      });
      await playing(page);
      assert.match(
        await page.locator(selector).getAttribute("src"),
        width <= 600 ? /800\.mp4$/ : /1280\.mp4$/,
      );
      assert.equal(
        await page.locator(toggle).innerText(),
        prefix ? "Pause video" : "Pauză video",
      );
      const geometry = await page.locator(toggle).evaluate((button) => {
        const r = button.getBoundingClientRect();
        return {
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          size: r.width >= 24 && r.height >= 24,
          overlaps: [
            ...document.querySelectorAll(
              ".detail-hero h1, .detail-lead, .detail-actions a",
            ),
          ].some((el) => {
            const b = el.getBoundingClientRect();
            return (
              Math.min(b.right, r.right) > Math.max(b.left, r.left) + 1 &&
              Math.min(b.bottom, r.bottom) > Math.max(b.top, r.top) + 1
            );
          }),
        };
      });
      assert(
        !geometry.overflow && geometry.size && !geometry.overlaps,
        `Cloud control geometry at ${width}`,
      );
      await page.locator(toggle).click();
      await frozen(page);
      assert.equal(
        await page.locator(toggle).innerText(),
        prefix ? "Play video" : "Redă video-ul",
      );
      await page.locator(toggle).press("Space");
      await playing(page);
      await context.close();
    }
  }

  const context = await browser.newContext();
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + "/servicii/cloud/");
  await playing(page);
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
  );
  await frozen(page);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await playing(page);
  // Exercise an actual media loop rather than trusting the loop attribute.
  await page.locator(selector).evaluate((v) => {
    v.currentTime = v.duration - 0.15;
  });
  await page.waitForFunction(() => {
    const v = document.querySelector("[data-cloud-video]");
    return !v.paused && v.currentTime < 1;
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await poster(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await playing(page);
  await page.locator(toggle).click();
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(
    await page.locator(selector).getAttribute("src"),
    null,
    "Session pause still downloads video",
  );
  assert.equal(await page.locator(toggle).innerText(), "Redă video-ul");
  await page.locator(toggle).click();
  await playing(page);
  await page.evaluate(() => {
    window.__oldCloudVideo = document.querySelector("[data-cloud-video]");
    window.__cloudDocument = document;
  });
  await page.locator('footer a[href="/servicii/securitate/"]').first().click();
  await page.waitForURL("**/servicii/securitate/");
  assert(
    await page.evaluate(
      () =>
        window.__cloudDocument === document &&
        window.__oldCloudVideo.paused &&
        !window.__oldCloudVideo.hasAttribute("src"),
    ),
    "Astro swap leaves the old video alive",
  );
  assert.equal(await page.locator(selector).count(), 0);
  await page.locator('footer a[href="/servicii/cloud/"]').first().click();
  await page.waitForURL("**/servicii/cloud/");
  await playing(page);
  await context.close();

  for (const mode of ["reduced", "no-js", "save-data"]) {
    const ctx = await browser.newContext({
      javaScriptEnabled: mode !== "no-js",
      reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
    });
    if (mode === "save-data")
      await ctx.addInitScript(() =>
        Object.defineProperty(navigator, "connection", {
          value: { saveData: true },
        }),
      );
    const p = await ctx.newPage();
    const requests = [];
    p.on("request", (req) => {
      if (req.url().includes(".mp4")) requests.push(req.url());
    });
    await p.goto(base + "/servicii/cloud/", { waitUntil: "networkidle" });
    await poster(p);
    assert.deepEqual(requests, [], `${mode}: video downloaded`);
    await ctx.close();
  }

  const failure = await browser.newContext();
  await failure.route("**/*.mp4", (route) =>
    route.fulfill({ status: 404, body: "missing" }),
  );
  const failPage = await failure.newPage();
  await failPage.goto(base + "/servicii/cloud/");
  await failPage.waitForFunction(
    () =>
      document.querySelector("[data-cloud-video]").dataset.state === "static",
  );
  await poster(failPage);
  await failure.close();

  const blocked = await browser.newContext();
  await blocked.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    let first = true;
    HTMLMediaElement.prototype.play = function () {
      if (first) {
        first = false;
        return Promise.reject(
          new DOMException("Autoplay blocked", "NotAllowedError"),
        );
      }
      return play.call(this);
    };
  });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(base + "/servicii/cloud/");
  await blockedPage.waitForFunction(
    () =>
      document.querySelector("[data-cloud-video-toggle]").dataset.paused ===
      "true",
  );
  await blockedPage.locator(toggle).click();
  await playing(blockedPage);
  await blocked.close();

  const others = await browser.newPage();
  const requests = [];
  others.on("request", (req) => {
    if (req.url().includes("/videos/cloud-hero-")) requests.push(req.url());
  });
  for (const prefix of ["", "/en"])
    for (const route of [
      "/",
      "/servicii/securitate/",
      "/servicii/software/",
      "/servicii/managed/",
      "/solutii/seknet/",
      "/solutii/s-vpn/",
    ]) {
      await others.goto(base + prefix + route, { waitUntil: "networkidle" });
      assert.equal(
        await others.locator(selector).count(),
        0,
        `${prefix + route}: unexpected Cloud video`,
      );
    }
  assert.deepEqual(requests, [], "Other pages download Cloud video");
  assert.deepEqual(errors, []);
  console.log(
    "Cloud video check passed: RO/EN at 320/390/1280px, actual playback and loop, keyboard pause, offscreen suspension, session preference, reduced-motion/no-JS/save-data with no video downloads, error/autoplay fallback, Astro teardown, Cloud-only scope.",
  );
} finally {
  await browser?.close();
  server.close();
}
