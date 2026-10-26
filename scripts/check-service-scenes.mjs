// Built-site regression for the code-animated service hero scenes (Cloud,
// Security, Software): intro → idle loop with no pause control (owner
// decision), settling after off-screen resume, still fallbacks (reduced
// motion, Save-Data, no JS) with the exact engraved RO/EN labels, no video
// downloads, geometry and label legibility at 320/390/768/1024/1280/1440px,
// the desktop ↔ mobile layout switch, and teardown across Astro navigation.
// Build first, then run: node scripts/check-service-scenes.mjs
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

// Engraved labels per layout: desktop keeps the number prefix where the
// preview has one; phones engrave the bare name larger.
const scenes = {
  cloud: {
    route: "/servicii/cloud/",
    labels: {
      ro: ["Centru de date", "Virtualizare", "Cloud hibrid", "Recuperare DR"],
      en: ["Data centre", "Virtualisation", "Hybrid cloud", "Disaster recovery"],
    },
    desktop: (names, lang) =>
      names.map((n, i) => `0${i + 1}  ${n.toLocaleUpperCase(lang)}`),
    mobile: (names, lang) => names.map((n) => n.toLocaleUpperCase(lang)),
    order: [0, 2, 3, 1], // markup order: floor, cloud, DR, (towers), virt
  },
  security: {
    route: "/servicii/securitate/",
    labels: {
      ro: ["Perimetru", "Rețea", "Identitate", "Date"],
      en: ["Perimeter", "Network", "Identity", "Data"],
    },
    desktop: (names, lang) =>
      names.map((n, i) => `0${i + 1}  ${n.toLocaleUpperCase(lang)}`),
    // One SVG: the prefix is hidden by CSS on phones, still in the text.
    mobile: (names, lang) =>
      names.map((n, i) => `0${i + 1}  ${n.toLocaleUpperCase(lang)}`),
    visibleMobile: (names, lang) => names.map((n) => n.toLocaleUpperCase(lang)),
  },
  software: {
    route: "/servicii/software/",
    labels: {
      ro: ["COD", "BUILD", "TEST", "SECURITATE", "PRODUCȚIE"],
      en: ["CODE", "BUILD", "TEST", "SECURITY", "PRODUCTION"],
    },
    desktop: (names) => names,
    mobile: (names) => names,
  },
};
const sel = (key) => `[data-scene="${key}"]`;
const errors = [];
let browser;

function expectedTags(key, lang, layout) {
  const scene = scenes[key];
  const names = scene.labels[lang];
  const tags = scene[layout](names, lang);
  return scene.order ? scene.order.map((i) => tags[i]) : tags;
}

const state = (page, key) =>
  page.locator(sel(key)).evaluate((el) => el.dataset.state);

async function waitState(page, key, value) {
  await page.waitForFunction(
    ({ s, value }) => document.querySelector(s)?.dataset.state === value,
    { s: sel(key), value },
  );
}

// Jump the finite intro to its end so the idle loop takes over.
async function skipIntro(page, key) {
  await waitState(page, key, "intro");
  await page.locator(sel(key)).evaluate((el) =>
    el.getAnimations({ subtree: true }).forEach((a) => {
      if (a.id === "scene-intro") a.finish();
    }),
  );
  await waitState(page, key, "idle");
}

async function moving(page, key, label) {
  // Idle beats can start on a short timer after settling.
  await page.waitForFunction(
    (s) =>
      document
        .querySelector(s)
        ?.getAnimations({ subtree: true })
        .some((a) => a.playState === "running"),
    sel(key),
  );
  // Sample the same animation objects twice.
  const before = await page.locator(sel(key)).evaluate((el) => {
    const list = el
      .getAnimations({ subtree: true })
      .filter((a) => a.playState === "running");
    window.__sceneSample = list;
    return list.map((a) => Number(a.currentTime));
  });
  await page.waitForTimeout(200);
  const after = await page.evaluate(() =>
    window.__sceneSample.map((a) => Number(a.currentTime)),
  );
  assert(
    after.some((t, i) => t > before[i] + 50),
    `${label}: scene animations do not advance`,
  );
}

// After the intro the scene must stay settled: resuming (scrolling back, tab
// switch) must never rewind and replay the intro on top of the idle loop.
async function settled(page, key, label) {
  await page.waitForTimeout(150);
  const result = await page.locator(sel(key)).evaluate((el) => ({
    state: el.dataset.state,
    intro: el.getAnimations({ subtree: true }).filter((a) => a.id === "scene-intro").length,
  }));
  assert.equal(result.state, "idle", `${label}: left the idle state`);
  assert.equal(result.intro, 0, `${label}: intro animations replayed`);
}

// Still state: the visible layout, its slabs and exact engraved labels.
async function still(page, key, label) {
  return page.locator(sel(key)).evaluate((el) => {
    const visible = (node) => {
      let n = node;
      while (n && n !== document.body) {
        const style = getComputedStyle(n);
        if (style.display === "none" || Number(style.opacity) < 0.3) return false;
        n = n.parentElement;
      }
      return true;
    };
    const layout =
      [...el.querySelectorAll("[data-scene-layout]")].find(
        (l) => getComputedStyle(l).display !== "none",
      ) ?? el;
    const texts = [...layout.querySelectorAll(".tag text, text.lbl")];
    const images = [...layout.querySelectorAll("img, image")];
    return {
      ariaHidden: el.getAttribute("aria-hidden"),
      layout: layout.dataset.sceneLayout ?? "single",
      tags: texts.map((t) => t.textContent.replace(/ /g, " ")),
      shown: texts.map((t) =>
        [...t.querySelectorAll("tspan")]
          .filter((s) => getComputedStyle(s).display !== "none")
          .map((s) => s.textContent)
          .join("")
          .replace(/ /g, " ")
          .trim(),
      ),
      labelsVisible: texts.every(visible),
      images: images.length > 0 &&
        images.every((img) =>
          img.tagName === "img" ? img.complete && img.naturalWidth > 0 : true,
        ),
      buttons: el.closest("header").querySelectorAll("button").length,
      video: el.closest("header").querySelectorAll("video, [data-hero-video]").length,
    };
  }).then((result) => {
    assert.equal(result.ariaHidden, "true", `${label}: scene must be decorative`);
    assert(result.labelsVisible, `${label}: still state hides a label`);
    assert(result.images, `${label}: slab image failed to load`);
    assert.equal(result.buttons, 0, `${label}: hero must not render a pause control`);
    assert.equal(result.video, 0, `${label}: hero still renders a video`);
    return result;
  });
}

async function labelsMatch(page, key, lang, label) {
  const result = await still(page, key, label);
  const layout = result.layout === "mobile" ? "mobile" : "desktop";
  assert.deepEqual(result.tags, expectedTags(key, lang, layout), `${label}: labels`);
  const vis = scenes[key].visibleMobile;
  const width = page.viewportSize().width;
  if (vis && width <= 600)
    assert.deepEqual(result.shown, vis(scenes[key].labels[lang], lang), `${label}: visible labels`);
  return result;
}

async function geometry(page, key, route, width) {
  const result = await page.evaluate((s) => {
    const root = document.querySelector(s);
    const hero = root.closest("header");
    const box = root.getBoundingClientRect();
    const copy = [
      ...hero.querySelectorAll(".detail-kicker, h1, .detail-lead, .detail-actions a"),
    ].map((el) => el.getBoundingClientRect());
    const cta = hero.querySelector('.detail-actions a[href^="mailto:"]').getBoundingClientRect();
    const actions = hero.querySelector(".detail-actions").getBoundingClientRect();
    const overlap = (a, b) =>
      Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
      Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
    const layout =
      [...root.querySelectorAll("[data-scene-layout]")].find(
        (l) => getComputedStyle(l).display !== "none",
      ) ?? root;
    // Effective size of each engraved label: on-screen advance per glyph
    // divided by the mono advance (0.6em + tracking) in user units.
    const sizes = [...layout.querySelectorAll(".tag text, text.lbl")].map((text) => {
      const spans = [...text.querySelectorAll("tspan")].filter(
        (t) => getComputedStyle(t).display !== "none",
      );
      const c = (t) => {
        const r = t.getBoundingClientRect();
        return [r.x + r.width / 2, r.y + r.height / 2];
      };
      const [a, b] = [c(spans[0]), c(spans[spans.length - 1])];
      const advance = Math.hypot(b[0] - a[0], b[1] - a[1]) / (spans.length - 1);
      const style = getComputedStyle(text);
      const font = parseFloat(style.fontSize);
      const spacing = parseFloat(style.letterSpacing) || 0;
      return +((advance * font) / (0.6 * font + spacing)).toFixed(1);
    });
    return {
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      overlapsCopy: copy.some((r) => overlap(box, r)),
      inside: box.left >= -1 && box.right <= innerWidth + 1,
      below: box.top >= actions.bottom - 1,
      height: box.height,
      ctaBottom: cta.bottom + scrollY,
      copyTop: hero.querySelector(".detail-kicker").getBoundingClientRect().top -
        document.querySelector("header nav, nav")?.getBoundingClientRect().bottom,
      sizes,
    };
  }, sel(key));
  const at = `${route}@${width}`;
  assert(!result.overflow, `${at}: horizontal overflow`);
  assert(!result.overlapsCopy, `${at}: scene overlaps the hero copy`);
  assert(result.inside, `${at}: scene leaves the viewport`);
  if (width <= 900) assert(result.below, `${at}: scene is not below the copy`);
  assert(result.height > 150, `${at}: scene collapsed (${result.height}px)`);
  assert(result.ctaBottom < 750, `${at}: primary CTA too far down (${result.ctaBottom})`);
  if (width <= 600)
    assert(
      result.sizes.every((s) => s >= 10),
      `${at}: engraved labels below 10px (${result.sizes.join(", ")})`,
    );
  return result;
}

try {
  browser = await chromium.launch();
  const report = [];
  for (const [key, scene] of Object.entries(scenes)) {
    for (const prefix of ["", "/en"]) {
      const lang = prefix ? "en" : "ro";
      const route = prefix + scene.route;
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await context.newPage();
      const media = [];
      page.on("request", (r) => r.url().includes(".mp4") && media.push(r.url()));
      page.on("pageerror", (e) => errors.push(`${route}: ${e.message}`));
      await page.goto(base + route, { waitUntil: "networkidle" });
      assert.equal(await page.locator("[data-scene]").count(), 1, `${route}: one scene`);
      assert.equal(await state(page, key), "intro", `${route}: intro did not start`);
      await moving(page, key, `${route} intro`);
      await skipIntro(page, key);
      await moving(page, key, `${route} idle`);
      await labelsMatch(page, key, lang, `${route} idle`);

      // Off-screen: everything pauses; back on screen it resumes settled.
      await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(250);
      assert.equal(
        await page.locator(sel(key)).evaluate(
          (el) => el.getAnimations({ subtree: true }).filter((a) => a.playState === "running").length,
        ),
        0,
        `${route}: scene keeps animating off-screen`,
      );
      await page.evaluate(() => scrollTo(0, 0));
      await settled(page, key, `${route} scroll away/back`);
      await moving(page, key, `${route} resumed`);

      await page.emulateMedia({ reducedMotion: "reduce" });
      await waitState(page, key, "static");
      assert.equal(
        await page.locator(sel(key)).evaluate((el) => el.getAnimations({ subtree: true }).length),
        0,
        `${route}: animations left under reduced motion`,
      );
      await labelsMatch(page, key, lang, `${route} reduced`);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await waitState(page, key, "intro");
      await moving(page, key, `${route} motion restored`);

      // Desktop ↔ mobile composition switch restarts on the visible layout.
      if (key !== "security") {
        // Settle first, so "intro" below can only come from the relayout.
        await skipIntro(page, key);
        await page.setViewportSize({ width: 390, height: 844 });
        await waitState(page, key, "intro");
        assert.equal(
          await page.locator(sel(key)).evaluate((el) => {
            const targets = el.getAnimations({ subtree: true }).map((a) => a.effect.target);
            return targets.every((t) => !t.closest("[data-scene-layout]") ||
              t.closest("[data-scene-layout]").dataset.sceneLayout === "mobile");
          }),
          true,
          `${route}: layout switch animates the hidden layout`,
        );
        await page.setViewportSize({ width: 1280, height: 900 });
      }

      for (const width of [320, 390, 768, 1024, 1280, 1440]) {
        await page.setViewportSize({ width, height: width <= 600 ? 844 : 900 });
        await page.reload({ waitUntil: "networkidle" });
        await skipIntro(page, key);
        const g = await geometry(page, key, route, width);
        await labelsMatch(page, key, lang, `${route}@${width}`);
        report.push(`${route}@${width}: labels ${Math.min(...g.sizes)}–${Math.max(...g.sizes)}px, scene ${Math.round(g.height)}px, CTA ${Math.round(g.ctaBottom)}`);
      }
      assert.deepEqual(media, [], `${route}: downloaded video`);
      await context.close();

      for (const mode of ["no-js", "reduced", "save-data"]) {
        for (const width of [390, 1280]) {
          const fallback = await browser.newContext({
            javaScriptEnabled: mode !== "no-js",
            reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
            viewport: { width, height: width <= 600 ? 844 : 900 },
          });
          if (mode === "save-data")
            await fallback.addInitScript(() =>
              Object.defineProperty(navigator, "connection", { value: { saveData: true } }),
            );
          const staticPage = await fallback.newPage();
          const requests = [];
          staticPage.on("request", (r) => r.url().includes(".mp4") && requests.push(r.url()));
          staticPage.on("pageerror", (e) => errors.push(`${route} ${mode}: ${e.message}`));
          await staticPage.goto(base + route, { waitUntil: "networkidle" });
          // Without JS the still state fades in via the CSS fallback (1.2 s + 0.6 s).
          if (mode === "no-js") await staticPage.waitForTimeout(2100);
          else {
            await waitState(staticPage, key, "static");
            assert.equal(
              await staticPage.locator(sel(key)).evaluate((el) => el.getAnimations({ subtree: true }).length),
              0,
              `${route} ${mode}: still state animates`,
            );
          }
          await labelsMatch(staticPage, key, lang, `${route} ${mode}@${width}`);
          assert(await staticPage.locator(".detail-hero h1").isVisible());
          assert(
            await staticPage.locator('.detail-hero .detail-actions a[href^="mailto:"]').isVisible(),
            `${route} ${mode}: CTA hidden`,
          );
          assert.deepEqual(requests, [], `${route} ${mode}: fallback downloaded video`);
          await fallback.close();
        }
      }
    }
  }

  // Astro navigation tears each scene down and starts the next one; a video
  // page in between keeps its own controller.
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(`navigation: ${e.message}`));
  await page.goto(base + "/servicii/cloud/", { waitUntil: "networkidle" });
  const originalDocument = await page.evaluateHandle(() => document);
  const hops = [
    ["/servicii/securitate/", "security"],
    ["/servicii/software/", "software"],
    ["/servicii/managed/", null],
    ["/servicii/cloud/", "cloud"],
  ];
  let previous = "cloud";
  for (const [href, key] of hops) {
    const old = await page.locator(sel(previous)).elementHandle();
    await page.locator(`footer a[href="${href}"]`).first().click();
    await page.waitForURL(base + href);
    assert(
      await originalDocument.evaluate((d) => d === document),
      "Expected Astro client navigation",
    );
    await page.waitForFunction((el) => !el.isConnected, old);
    assert(
      await old.evaluate((el) => el.getAnimations({ subtree: true }).length === 0),
      `${href}: Astro swap leaves the old ${previous} scene animating`,
    );
    if (key) {
      await waitState(page, key, "intro");
      await moving(page, key, `${href} after navigation`);
      previous = key;
    } else {
      await page.locator('[data-hero-video="managed-services"]').waitFor({ state: "attached" });
      await page.locator("[data-hero-video-toggle]").waitFor({ state: "visible" });
      assert.equal(await page.locator("[data-scene]").count(), 0);
      previous = null;
      // Next hop starts from a page without a scene.
      const [nextHref, nextKey] = hops[hops.length - 1];
      await page.locator(`footer a[href="${nextHref}"]`).first().click();
      await page.waitForURL(base + nextHref);
      await waitState(page, nextKey, "intro");
      await moving(page, nextKey, `${nextHref} after the video page`);
      break;
    }
  }
  await context.close();

  assert.deepEqual(errors, [], "Service scene browser errors");
  console.log(report.join("\n"));
  console.log(
    "Service scenes check passed: Cloud/Security/Software RO/EN intro → idle loop with no pause control, paused off-screen and settled after scrolling back, reduced-motion/Save-Data/no-JS still state with exact engraved labels, no video downloads, desktop↔mobile layout switch, 320/390/768/1024/1280/1440px geometry (no overflow, no copy overlap, scene below the copy ≤900px, CTA above the fold, labels ≥10px on phones), Astro navigation teardown.",
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
