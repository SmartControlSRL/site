// Page-specific media integration. Detailed controller lifecycle and
// autoplay behavior remain covered by check-cloud-video.mjs.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { chromium } from "playwright";

const configurations = {
  "network-security": {
    route: "/servicii/securitate/",
    label: "Security",
    contain: false,
  },
  "software-automation": {
    route: "/servicii/software/",
    label: "Software",
    contain: true,
  },
  "managed-services": {
    route: "/servicii/managed/",
    label: "Managed",
    contain: true,
  },
  seknet: {
    route: "/solutii/seknet/",
    label: "SEKNET",
    contain: true,
    product: true,
  },
  "s-vpn": {
    route: "/solutii/s-vpn/",
    label: "S-VPN",
    contain: true,
    product: true,
  },
};
const key = process.argv[2];
assert(
  Object.hasOwn(configurations, key),
  "Usage: node scripts/check-service-video.mjs network-security|software-automation|managed-services|seknet|s-vpn",
);
const config = configurations[key];

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
const route = config.route;
const selector = `[data-hero-video="${key}"]`;
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
  assert(await image.isVisible(), `${config.label} poster is hidden`);
  assert(
    await image.evaluate(
      (element) => element.complete && element.naturalWidth > 0,
    ),
    `${config.label} poster failed to load`,
  );
  assert.match(
    await image.evaluate((element) => element.currentSrc),
    new RegExp(`/images/${key}-video-(800|1280)\\.webp$`),
  );
  assert.equal(
    await page.locator(selector).getAttribute("src"),
    null,
    `Fallback still loads ${config.label} video`,
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

async function containedFrame(page) {
  const frame = await page.locator(selector).evaluate((video) => {
    const root = video.closest(".ambient-artwork");
    const image = root.querySelector("img");
    const box = (element) => {
      const rect = element.getBoundingClientRect();
      return [rect.x + scrollX, rect.y + scrollY, rect.width, rect.height];
    };
    return {
      root: box(root),
      video: box(video),
      image: box(image),
      videoFit: getComputedStyle(video).objectFit,
      imageFit: getComputedStyle(image).objectFit,
      videoPosition: getComputedStyle(video).objectPosition,
      imagePosition: getComputedStyle(image).objectPosition,
      videoMask: getComputedStyle(video).maskImage,
      imageMask: getComputedStyle(image).maskImage,
      videoAspect: video.videoWidth / video.videoHeight,
      imageAspect: image.naturalWidth / image.naturalHeight,
    };
  });
  assert.equal(
    frame.videoFit,
    "contain",
    `${config.label} video crops its supplied composition`,
  );
  assert.equal(
    frame.imageFit,
    "contain",
    `${config.label} poster crops its supplied composition`,
  );
  assert.equal(
    frame.videoPosition,
    frame.imagePosition,
    `${config.label} poster/video alignment differs`,
  );
  if (config.product) {
    assert(
      frame.video.every((value, index) => Math.abs(value - frame.image[index]) <= 1),
      `${config.label} video and poster have different display frames`,
    );
    const [x, y, width, height] = frame.video;
    const [rootX, rootY, rootWidth, rootHeight] = frame.root;
    assert(x >= rootX - 1 && y >= rootY - 1 && x + width <= rootX + rootWidth + 1 && y + height <= rootY + rootHeight + 1,
      `${config.label} media extends outside its artwork container`);
    assert.equal(frame.videoMask, frame.imageMask, `${config.label} video/poster edge fades differ`);
    assert.match(frame.videoMask, /linear-gradient/, `${config.label} edge fade is missing`);
  } else {
    for (const kind of ["video", "image"])
      assert(
        frame[kind].every(
          (value, index) => Math.abs(value - frame.root[index]) <= 1,
        ),
        `${config.label} ${kind} does not fill the same media container`,
      );
  }
  assert(
    Math.abs(frame.videoAspect - frame.imageAspect) < 0.001,
    `${config.label} poster/video aspect ratios would jump at playback`,
  );
  return frame.root;
}

try {
  browser = await chromium.launch();
  // Fresh contexts verify actual responsive source selection, not a resize of
  // an already downloaded desktop video.
  for (const prefix of ["", "/en"]) {
    for (const width of config.product ? [320, 390, 768, 1280] : [320, 390, 1280]) {
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
      assert.equal(await video.getAttribute("id"), `${key}-hero-video`);
      assert.equal(
        await video.getAttribute("src"),
        `/videos/${key}-hero-${size}.mp4`,
      );
      assert.match(
        await page
          .locator(".detail-hero .ambient-artwork img")
          .evaluate((image) => image.currentSrc),
        new RegExp(`/images/${key}-video-${size}\\.webp$`),
      );
      assert(
        await video.evaluate(
          (element) => element.muted && element.playsInline && element.loop,
        ),
        `${config.label} media must be muted, inline and looping`,
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
              ".detail-hero h1, .detail-hero .detail-lead, .detail-hero .detail-actions a, .product-signal",
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
      const mediaFrame = config.contain ? await containedFrame(page) : null;
      await button.click();
      await playback(page, false);
      if (config.contain)
        assert.deepEqual(
          await containedFrame(page),
          mediaFrame,
          `${config.label} media shifts when playback pauses`,
        );
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
      `${mode}: ${config.label} fallback downloads media`,
    );
    await context.close();
  }

  const failure = await browser.newContext();
  await failure.route(`**/videos/${key}-hero-*.mp4`, (request) =>
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
  const oldService = await page.locator(selector).elementHandle();
  const originalDocument = await page.evaluateHandle(() => document);
  await page.locator('footer a[href="/servicii/cloud/"]').first().click();
  await page.waitForURL(base + "/servicii/cloud/");
  await playback(page, true, "[data-cloud-video]");
  assert(
    await originalDocument.evaluate((previous) => previous === document),
    "Expected Astro client navigation",
  );
  assert(
    await oldService.evaluate(
      (video) =>
        !video.isConnected && video.paused && !video.hasAttribute("src"),
    ),
    `Old ${config.label} video remains loaded after navigation`,
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
    `${config.label} pause was not restored`,
  );
  assert.equal(
    await page.locator(selector).getAttribute("src"),
    null,
    `Paused ${config.label} video downloaded on re-entry`,
  );
  await page.locator(toggle).press("Space");
  await playback(page, true);
  assert.equal(
    await page.evaluate(
      (key) => sessionStorage.getItem(`smartcontrol-${key}-video-paused`),
      key,
    ),
    "false",
  );
  await page.locator('footer a[href="/servicii/cloud/"]').first().click();
  await page.waitForURL(base + "/servicii/cloud/");
  await page.locator(toggle).waitFor({ state: "visible" });
  assert.equal(
    await page.locator(toggle).innerText(),
    "Redă video-ul",
    `${config.label} resume changed Cloud preference`,
  );
  assert.equal(
    await page.locator("[data-cloud-video]").getAttribute("src"),
    null,
  );
  await context.close();

  const others = await browser.newPage();
  const requests = [];
  others.on("request", (request) => {
    if (request.url().includes(`/videos/${key}-hero-`))
      requests.push(request.url());
  });
  for (const prefix of ["", "/en"])
    for (const path of [
      "/",
      "/servicii/cloud/",
      "/servicii/securitate/",
      "/servicii/software/",
      "/servicii/managed/",
      "/solutii/seknet/",
      "/solutii/s-vpn/",
    ].filter((path) => path !== route)) {
      await others.goto(base + prefix + path, { waitUntil: "networkidle" });
      assert.equal(
        await others.locator(selector).count(),
        0,
        `${prefix + path}: unexpected ${config.label} video`,
      );
    }
  assert.deepEqual(
    requests,
    [],
    `Unrelated pages download ${config.label} video`,
  );
  assert.deepEqual(errors, [], `${config.label} browser errors`);
  console.log(
    `${config.label} video check passed: RO/EN at ${config.product ? "320/390/768/1280" : "320/390/1280"}px, correct media/poster sources, actual playback/loop, keyboard pause and geometry${config.contain ? ", matching contained media/poster frames" : ""}, reduced-motion/no-JS/save-data without downloads, error fallback, Astro teardown and independent Cloud/${config.label} preferences, page-specific media scope.`,
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
