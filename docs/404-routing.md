# Locale-specific 404 routing

The static build produces two error documents:

- `dist/404.html` for unknown Romanian/default-locale URLs.
- `dist/en/404/index.html` for unknown English URLs under `/en/`.

They are deployment internals, not content routes. Neither document is linked,
canonicalized, advertised with `hreflang`, assigned an `og:url`, or included in
the sitemap. Both remain `noindex`. Their navigation, footer and primary
homepage recovery action are rendered in the matching locale.

Production must use an internal error-page mapping based on the requested URL:

- Unknown `/en/*` requests use `dist/en/404/index.html`.
- All other unknown requests use `dist/404.html`.
- The original request URL stays in the browser and the response status stays
  HTTP 404. The error-document paths must not be externally redirected to.

The checked-in source of truth is split deliberately:

- `deployment/nginx/maps.conf` selects the locale-specific error document.
- `deployment/nginx/site-rules.conf` preserves the original URL and `=404`
  status while keeping both generated documents internal.
- `deployment/nginx/smartcontrol.ro.conf` installs those shared rules in the
  canonical production TLS virtual host.

Astro's development and preview servers do not model that locale-aware nginx
error routing. `node scripts/check-nginx-config.mjs` validates the source and
built documents locally; `node scripts/verify-production.mjs <https-base-url>`
checks the real status and locale behavior only after an authorized deployment.

`node scripts/check-links.mjs` applies explicit exceptions for only `/404` and
`/en/404/`: they are excluded from locale-parity and sitemap requirements. All
their internal links and fragments are still checked, and the command fails if
either document is missing, indexable, linked as a route or emits route SEO
metadata.
