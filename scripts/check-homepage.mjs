// Built-homepage regression: the hero stack animation (intro → idle loop, no
// pause control by owner decision), settling after off-screen resume, still
// fallbacks (reduced motion, no JS), the partner logo marquee, useful geometry,
// and teardown across Astro navigation.
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
const cloudSelector = "[data-cloud-video]";
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

// After the intro the scene must stay settled: resuming (scrolling back, tab
// switch) must never rewind and replay the intro on top of the idle loop.
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

// Partner strip: 14 official logos with alt text and an aria-hidden clone; a
// CSS marquee that pauses on hover when motion is allowed, static otherwise.
async function partners(page, label, { motion }) {
  const root = page.locator("[data-logo-marquee]");
  const info = await root.evaluate((el) => {
    const imgs = [...el.querySelectorAll(".lm-list:not(.lm-clone) img")];
    return {
      logos: imgs.length,
      alts: imgs.every((img) => img.alt.trim().length > 0),
      loaded: imgs.every((img) => img.complete && img.naturalWidth > 0),
      clonesHidden: [...el.querySelectorAll(".lm-clone")].every(
        (list) => list.getAttribute("aria-hidden") === "true",
      ),
      cloneShown: getComputedStyle(el.querySelector(".lm-clone")).display !== "none",
      controls: el.querySelectorAll("button").length,
    };
  });
  assert.equal(info.logos, 14, `${label}: expected 14 partner logos`);
  assert.equal(
    await root.locator(".lm-list:not(.lm-clone) .lm-text").count(),
    0,
    `${label}: a partner still renders as text`,
  );
  assert(info.alts, `${label}: partner logo without alt text`);
  assert(info.loaded, `${label}: partner logo failed to load`);
  assert(info.clonesHidden, `${label}: marquee clone exposed to AT`);
  assert.equal(info.controls, 0, `${label}: strip should have no controls`);
  const play = () =>
    root.locator(".lm-track").evaluate((el) => el.getAnimations()[0]?.playState ?? "none");
  if (!motion) {
    assert(!info.cloneShown, `${label}: static strip shows the clone`);
    assert.equal(await play(), "none", `${label}: strip animates under reduced motion`);
    return;
  }
  assert(info.cloneShown, `${label}: marquee clone missing`);
  assert.equal(await play(), "running", `${label}: marquee not animating`);
  await root.locator(".lm-viewport").hover();
  assert.equal(await play(), "paused", `${label}: hover did not pause`);
  await page.mouse.move(0, 0);
  assert.equal(await play(), "running", `${label}: marquee did not resume`);
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
      stackOverlapsCopy: overlap(stack, copy),
      stackInsideViewport: stack.left >= -1 && stack.right <= innerWidth + 1,
    };
  });
  assert(
    !result.overflow && !result.serviceOverflow,
    `${route}@${width}: horizontal overflow`,
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
    const cloudPause = en ? "Pause video" : "Pauză video";
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
    assert.equal(await page.locator(stackSelector).count(), 1);
    assert.equal(
      await page.locator("[data-homepage-video], .home-hero video").count(),
      0,
      "Old homepage video remains",
    );
    await moving(page);
    await skipIntro(page);
    await moving(page);
    assert.equal(
      await page.locator(".home-hero button").count(),
      0,
      "Hero must not render a pause control",
    );
    await page.evaluate(() => scrollTo(0, 3000));
    await page.waitForTimeout(200);
    await page.evaluate(() => scrollTo(0, 0));
    await settled(page, `${route} scroll away/back`);

    await page.emulateMedia({ reducedMotion: "reduce" });
    // The script settles on the (async) media-query change event.
    await page.waitForFunction(
      (sel) => document.querySelector(sel)?.dataset.state === "static",
      stackSelector,
    );
    assert.deepEqual(await still(page, `${route} reduced`), expectedTags);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    // The media-query change event is async; wait for the intro to restart.
    await page.waitForFunction(
      (sel) => document.querySelector(sel)?.dataset.state === "intro",
      stackSelector,
    );
    await moving(page);
    assert.equal(await page.locator(".service-link").count(), 4);
    assert.equal(await page.locator(".product-link").count(), 2);
    await partners(page, `${route} partners`, { motion: true });

    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.reload({ waitUntil: "networkidle" });
      await skipIntro(page);
      await geometry(page, route, width);
    }

    // Astro navigation must tear the stack down and leave the Cloud video alone.
    const cloudRoute = en ? "/en/servicii/cloud/" : "/servicii/cloud/";
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
      "Cloud video did not start after leaving Home",
    );
    await page.locator(`nav a[href="${route}"]`).first().click();
    await page.waitForURL(base + route);
    await page.waitForFunction(
      (sel) => document.querySelector(sel)?.dataset.state === "intro",
      stackSelector,
    );
    await moving(page);
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
      // Without JS the marquee still runs (it is CSS); reduced motion stops it.
      await partners(staticPage, `${route} ${mode} partners`, {
        motion: mode !== "reduced",
      });
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
    "Homepage check passed: RO/EN hero stack intro → idle loop with no pause control, settled after scrolling away/back, Astro teardown and Cloud handover, reduced-motion/no-JS still state with engraved labels, partner logo marquee (hover pause, static under reduced motion), 320/390/768/1280px geometry, contact/CTA visibility.",
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
