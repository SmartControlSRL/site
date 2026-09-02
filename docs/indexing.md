# Preview and production indexing policy

This document defines verifiable crawler behavior. It does not claim that the production VPS is deployed, publicly reachable, submitted to search engines, or indexed.

## Environment contract

| Environment | Hosting contract | Indexing behavior | Source of truth |
|---|---|---|---|
| Vercel preview | Team validation only; never attach `smartcontrol.ro` | Every response includes `X-Robots-Tag: noindex` | `vercel.json` |
| Production VPS | Approved VPS after an authorized rollout | Content pages, including the approved privacy notices, are indexable; missing URLs are noindex | `deployment/nginx/`, `BaseLayout.astro`, and `docs/deployment.md` |

The Vercel rule is intentionally unconditional because Vercel is not a production target. Do not copy its `X-Robots-Tag` into Nginx and do not point the production domain at a Vercel preview.

Preview builds deliberately retain the same generated HTML, production-origin canonicals/hreflang, `robots.txt`, and sitemap artifacts as the release candidate. The preview response header is the authoritative noindex guard. Keeping one build output makes preview validation representative and directs any discovered URL signals to the production canonical origin. A preview-specific `Disallow: /` file is not generated because robots exclusion can prevent crawlers from seeing the `noindex` response header. Revisit environment-specific generation only if the hosting contract changes and Vercel is approved to serve a production environment.

## Locally enforceable assertions

After `npm run build`, run:

```bash
npm run check:indexing
```

The checker proves from repository state that:

- Vercel applies an unconditional catch-all `X-Robots-Tag: noindex` header;
- the production Nginx template contains no `X-Robots-Tag: noindex` directive;
- Nginx preserves real 404 status and internal localized error documents;
- all 20 content routes have no meta noindex;
- canonical and RO/EN/x-default hreflang targets use `https://smartcontrol.ro` and resolve to generated pages;
- the bilingual privacy routes carry the approved attorney-upload source marker and participate in canonical, hreflang and sitemap checks;
- both generated 404 documents contain meta noindex and omit canonical/hreflang;
- `robots.txt` allows crawling and advertises the production sitemap index; and
- sitemap contents exactly equal the generated indexable routes and exclude both 404 documents.

These are configuration/build assertions, not observations of a deployed server.

## Remote preview verification

For a real Vercel preview URL supplied by the preview job or operator:

```bash
npm run verify:indexing -- --mode preview --base https://CONFIGURED_PREVIEW_HOST/
```

The read-only verifier checks representative RO/EN/detail pages, robots, sitemap, and a missing path. Every preview response, including 404, must carry `X-Robots-Tag: noindex`; page canonicals must remain production-origin.

## Post-deployment production verification

Only after #27’s authorized VPS rollout provides a real target, run from outside the VPS:

```bash
node scripts/verify-production.mjs https://smartcontrol.ro
npm run verify:indexing -- --mode production --base https://smartcontrol.ro/
```

The indexing verifier reads the live sitemap inventory, checks every listed page for status 200 and absence of header/meta noindex, validates canonical and hreflang origins and resolution, checks robots and child sitemaps, excludes error documents, and verifies RO/EN missing URLs return non-indexable 404 responses. The production verifier also requires both privacy routes to carry the approved attorney-upload source marker and rejects an obsolete `pending-legal-review` or meta-noindex state.

Record the command output, timestamp, deployed release ID and operator in the approved change ticket. A failed production assertion is a launch/rollback blocker unless the infrastructure and website owners document a narrower understood exception.

## Search-engine follow-up

HTTP correctness does not prove that a search engine has indexed the site. After DNS, TLS and both production verifiers are green, the authorized site owner should:

1. add or confirm the `smartcontrol.ro` property in the chosen webmaster console;
2. submit `https://smartcontrol.ro/sitemap-index.xml`;
3. inspect `/`, `/en/` and `/servicii/cloud/` for canonical/indexability status; and
4. record crawl/index status and revisit after the search engine has processed the sitemap.

Webmaster-console credentials and indexing outcomes are external operational state and are not stored or inferred by this repository.
