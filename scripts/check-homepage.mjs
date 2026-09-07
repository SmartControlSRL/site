// Built-homepage regression: both locales, meaningful geometry, resilient
// content, pause/resume, live reduced-motion changes and route re-entry.
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
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};
const server = createServer(async (req, res) => {
  const path = new URL(req.url, "http://localhost").pathname;
  const file = join("dist", path.endsWith("/") ? `${path}index.html` : path);
  try {
    res.writeHead(200, {
      "Content-Type": mime[extname(file)] || "application/octet-stream",
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch();
  for (const route of ["/", "/en/"]) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base + route, { waitUntil: "networkidle" });
    const button = page.locator("[data-map-toggle]");
    const signals = page.locator(".signals");
    assert(
      await button.isVisible(),
      `${route}: diagram control must be available`,
    );
    await button.click();
    assert.equal(await button.getAttribute("aria-pressed"), "true");
    assert.equal(
      await signals.evaluate((el) => getComputedStyle(el).animationPlayState),
      "paused",
    );
    await button.press("Space");
    assert.equal(await button.getAttribute("aria-pressed"), "false");
    assert.equal(
      await signals.evaluate((el) => getComputedStyle(el).animationPlayState),
      "running",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await button.waitFor({ state: "hidden" });
    assert.equal(
      await signals.evaluate((el) => getComputedStyle(el).animationName),
      "none",
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await button.waitFor({ state: "visible" });
    assert.equal(await page.locator(".service-link").count(), 4);
    assert.equal(await page.locator(".product-link").count(), 2);
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      const geometry = await page.evaluate(() => {
        const boxes = [...document.querySelectorAll(".map-node,.map-core")].map(
          (el) => el.getBoundingClientRect(),
        );
        const overlaps = boxes.some((a, i) =>
          boxes.some(
            (b, j) =>
              i < j &&
              Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
              Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1,
          ),
        );
        const cta = document
          .querySelector(".hero-actions a")
          .getBoundingClientRect();
        const serviceBoxes = [
          ...document.querySelectorAll(".service-link"),
        ].map((el) => el.getBoundingClientRect());
        return {
          overflowing: [...document.querySelectorAll(".home-redesign *")]
            .filter((el) => {
              const r = el.getBoundingClientRect();
              return (
                r.width > 0 && (r.left < -0.5 || r.right > innerWidth + 0.5)
              );
            })
            .map((el) => ({
              tag: el.tagName,
              cls: el.getAttribute("class"),
              text: el.textContent.slice(0, 60),
            }))
            .slice(0, 15),
          nodeOverflow: [...document.querySelectorAll(".map-node")].some(
            (el) => el.scrollWidth > el.clientWidth + 1,
          ),
          overlaps,
          ctaBottom: cta.bottom + scrollY,
          overflow: document.documentElement.scrollWidth > innerWidth,
          serviceOverflow: serviceBoxes.some(
            (b) => b.left < 0 || b.right > innerWidth,
          ),
        };
      });
      assert(
        !geometry.nodeOverflow,
        `${route}@${width}: diagram text overflows its node`,
      );
      assert(!geometry.overlaps, `${route}@${width}: diagram nodes overlap`);
      assert(
        !geometry.overflow && !geometry.serviceOverflow,
        `${route}@${width}: horizontal overflow ${JSON.stringify(geometry.overflowing)}`,
      );
      assert(
        geometry.ctaBottom < 750,
        `${route}@${width}: primary CTA is too far down (${geometry.ctaBottom})`,
      );
    }
    // Astro client navigation must reinitialise the map exactly once.
    await page.setViewportSize({ width: 1280, height: 900 });
    const destination =
      route === "/" ? "/servicii/cloud/" : "/en/servicii/cloud/";
    await page.locator(".service-link").first().click();
    await page.waitForURL(base + destination);
    await page.locator('nav a[href="' + route + '"]').click();
    await page.waitForURL(base + route);
    await button.waitFor({ state: "visible" });
    await button.click();
    assert.equal(
      await button.getAttribute("aria-pressed"),
      "true",
      `${route}: pause must work after route re-entry`,
    );
    assert.deepEqual(errors, [], `${route}: browser errors`);
    await context.close();
    const noJs = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const staticPage = await noJs.newPage();
    await staticPage.goto(base + route);
    assert(
      await staticPage.locator('.hero-actions a[href^="mailto:"]').isVisible(),
    );
    assert.equal(await staticPage.locator(".service-link").count(), 4);
    assert(await staticPage.locator("[data-map-toggle]").isHidden());
    assert.equal(
      await staticPage
        .locator(".signals")
        .evaluate((el) => getComputedStyle(el).animationName),
      "none",
    );
    assert.equal(
      (await staticPage.locator("#contact a").last().textContent()).trim(),
      "office@smartcontrol.ro",
    );
    await noJs.close();
  }
  console.log(
    "Homepage check passed: RO/EN, 320/390/768/1280px geometry, CTA visibility, pause/resume, reduced motion, route re-entry and no-JS contact.",
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
