# CI and QA gates

`npm run qa` is the local equivalent of the blocking site checks in `.github/workflows/ci.yml`. CI uses `.nvmrc`, performs a clean install, validates the dependency tree and risk register, installs Chromium, then runs the quality gate.

## Commands

| Command | Gate |
|---|---|
| `npm run check` | Astro/type diagnostics |
| `npm run build` | Production static generation |
| `npm run check:links` | Internal links, fragments, hreflang, RO/EN parity, sitemap and the #26-approved 404 contract |
| `npm run check:email` | Resilient contact addresses and `mailto:` targets in generated HTML |
| `npm run check:claims` | Registry-driven blocked claims across binding sources and generated output, plus the approved social-card hash |
| `npm run check:deployment` | Versioned Nginx structure, security/cache/error rules and preview/production separation |
| `npm run check:nginx-runtime` | Native pinned Nginx `-t`, route/redirect behavior, and localized 404 smoke tests in Docker (CI) |
| `npm run check:indexing` | Preview/production headers, structured-data URL parity, canonicals/hreflang, sitemap, legal holds and noindex error documents |
| `npm run check:stack-teardown` | Native disclosure semantics, focus-safe cycling, pause/reduced-motion behavior and 320/390/1280px geometry |
| `npm run check:nav-responsive` | Navigation semantics/focus, localized language links, breakpoints, service CTAs, footer tracks and meaningful overflow |
| `npm run audit:site` | Generated-route HTTP, contrast, performance and browser smoke coverage |
| `npm run audit:dependencies` | Complete dependency audit against the time-bounded register plus a clean production-omitted audit |

The site audit discovers HTML routes from `dist/`; no hand-maintained route list is used. It tests 1280px and 390px viewports in normal motion, reduced motion and no-JS profiles. Normal-motion runs initialize the page, traverse it, and rescan focus, hover, current-link, stepper-scroll and page-end states. Contrast calculation includes cumulative ancestor opacity. Decorative non-text graphics and `aria-hidden` content are excluded; large text uses WCAG AA’s 3:1 threshold rather than an exemption.

The only current contrast exemption is the bright-blue `Control` portion of the locked Smart Control wordmark. It is recorded with an owner and expiry in `config/site-audit-policy.json`; ordinary bright-blue text is not exempt. All other contrast failures block CI. LCP is observed before navigation with a buffered `PerformanceObserver`, must be present for every non-error route in the desktop normal-motion profile, and must not exceed 2.5 seconds in the local deterministic harness.

The audit expects generated `/404` and `/en/404/` documents to return HTTP 404. Their parity, metadata, sitemap and linking rules are owned by `scripts/check-links.mjs`. Navigation errors, unexpected status codes, browser page errors, missing LCP and smoke-test failures are blocking.

`npm run qa:browser` runs the two focused component regressions before the all-route browser audit. All three browser checks are part of `npm run qa` and therefore block CI.

CI additionally runs `npm run check:nginx-runtime` after the build. The image is
the official stable Alpine Nginx release pinned by registry digest, so tag drift
cannot change the tested runtime.

Reports are written below `artifacts/` and uploaded for 14 days even when CI fails. For a real post-deployment target, first build locally so route discovery remains authoritative, then run:

```bash
node scripts/audit.mjs --dir dist --url https://configured-target.example --policy config/site-audit-policy.json --out artifacts/post-deploy-audit.json
```

No target is embedded in CI. A post-deployment job becomes blocking only after the preview/production policy and server configuration from #23 and #27 provide a real URL.

Remote indexing checks require an explicit environment and URL; see `docs/indexing.md` and run `npm run verify:indexing -- --mode preview|production --base https://configured-origin/`.
