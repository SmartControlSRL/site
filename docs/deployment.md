# Production deployment: EU VPS and nginx

This runbook deploys the static Astro build to the company-operated EU VPS. It
does **not** describe or authorize a deployment by itself. Vercel remains a
preview-only target and its `X-Robots-Tag: noindex` guard must not be copied into
production.

Production logging and provider facts are legal-review inputs as well as
operational settings. The responsible owners must complete the evidence and
questionnaire in `docs/privacy-processing-inventory.md`; this runbook does not
assign a logging legal basis, retention period, processor role or transfer
safeguard.

## Versioned source of truth

| File | Purpose | Installed path |
| --- | --- | --- |
| `deployment/nginx/smartcontrol.ro.conf` | HTTP/HTTPS virtual hosts and canonical host | `/etc/nginx/smartcontrol/smartcontrol.ro.conf` |
| `deployment/nginx/maps.conf` | Locale error document and cache-class maps | `/etc/nginx/smartcontrol/maps.conf` |
| `deployment/nginx/site-rules.conf` | Static serving, headers, gzip and error routing | `/etc/nginx/smartcontrol/site-rules.conf` |
| `deployment/nginx/tls.conf` | Non-secret TLS policy and certificate paths | `/etc/nginx/smartcontrol/tls.conf` |
| `deployment/nginx/local-smoke.conf` | Local HTTP-only smoke harness; never install | not installed |

The production document root is `/var/www/smartcontrol.ro/current`, an atomic
symlink to one release under `/var/www/smartcontrol.ro/releases/`. Certificate
and private-key material remains under `/etc/letsencrypt/` on the VPS.

## Local validation (no root and no VPS)

Build and validate the generated site and checked-in server contract:

```bash
npm ci
npm run check
npm run build
npm run check:links
node scripts/check-nginx-config.mjs
```

The checker validates balanced configuration blocks, required directives,
preview/production indexing separation, and both built error documents. It is a
fast static gate; production still requires the native `nginx -t` command.

When Docker is available, the exact shared serving rules can also be exercised
without root or TLS. The script uses the official Nginx 1.28.0 Alpine image
pinned by registry digest, runs `nginx -t`, starts a rootless server, tests
representative routes and localized errors, and cleans up the container:

```bash
npm run check:nginx-runtime
```

Expected results are a `200` homepage, one redirect from `/servicii` to
`/servicii/`, and genuine localized `404` responses in both languages. HSTS and
TLS are intentionally absent from this HTTP-only harness.

## Production prerequisites

The infrastructure operator must confirm all of the following before changing
the active site:

1. The VPS is company-controlled and located in the approved EU datacenter.
2. Nginx is 1.28.0+ or a supported distribution package with equivalent
   security backports, TLS 1.3 and variable `error_page` URI support.
3. DNS for `smartcontrol.ro` and `www.smartcontrol.ro` resolves to the VPS.
4. The existing certificate covers both names and has more than 14 days left.
5. `/var/www/letsencrypt/.well-known/acme-challenge/` is writable by the ACME
   renewal process.
6. The currently active web root, enabled nginx configuration, and current
   symlink target have been recorded in the approved change ticket.
7. A named infrastructure operator owns rollout/rollback; the website technical
   owner owns application verification; the security owner owns CSP approval.

HSTS includes subdomains. Enable this checked-in state only after the operator
has verified the certificate, HTTPS reachability and ownership of relevant
subdomains. The template intentionally does not request browser preload.

## Build and stage a release

Use an immutable release identifier supplied by the deployment system (for
example the full Git commit SHA). Never build as root.

```bash
npm ci
npm run qa:static
node scripts/check-nginx-config.mjs
npm run check:nginx-runtime
rsync -a --delete dist/ deploy@VPS_HOST:/var/www/smartcontrol.ro/releases/RELEASE_ID/
rsync -a \
  deployment/nginx/maps.conf \
  deployment/nginx/site-rules.conf \
  deployment/nginx/tls.conf \
  deployment/nginx/smartcontrol.ro.conf \
  deploy@VPS_HOST:/tmp/smartcontrol-nginx-RELEASE_ID/
```

`VPS_HOST` and `RELEASE_ID` are operator inputs, not literal values. The deploy
account needs write access only to the release directory. Privileged nginx and
symlink operations happen in the approved VPS session.

## Install and validate nginx configuration

On the VPS, first preserve the active configuration in the change ticket's
backup directory. Then copy the four staged production files into a root-owned
directory and make the site symlink point to the versioned virtual host:

```bash
sudo install -d -m 0700 /var/backups/smartcontrol-nginx/CHANGE_ID
if sudo test -e /etc/nginx/smartcontrol; then sudo cp -a /etc/nginx/smartcontrol /var/backups/smartcontrol-nginx/CHANGE_ID/; fi
if sudo test -e /etc/nginx/sites-enabled/smartcontrol.ro.conf; then sudo cp -a /etc/nginx/sites-enabled/smartcontrol.ro.conf /var/backups/smartcontrol-nginx/CHANGE_ID/; fi
sudo install -d -m 0755 /etc/nginx/smartcontrol
sudo install -m 0644 /tmp/smartcontrol-nginx-RELEASE_ID/maps.conf /etc/nginx/smartcontrol/maps.conf
sudo install -m 0644 /tmp/smartcontrol-nginx-RELEASE_ID/site-rules.conf /etc/nginx/smartcontrol/site-rules.conf
sudo install -m 0644 /tmp/smartcontrol-nginx-RELEASE_ID/tls.conf /etc/nginx/smartcontrol/tls.conf
sudo install -m 0644 /tmp/smartcontrol-nginx-RELEASE_ID/smartcontrol.ro.conf /etc/nginx/smartcontrol/smartcontrol.ro.conf
sudo ln -sfn /etc/nginx/smartcontrol/smartcontrol.ro.conf /etc/nginx/sites-enabled/smartcontrol.ro.conf
sudo nginx -t
```

Do not reload after a failed syntax test. The certificate paths follow the
standard Certbot layout; adjust them only when the VPS uses a different approved
certificate manager, then record that intentional divergence in the change
ticket.

Before switching public traffic, the operator can compare the installed files
with the checkout used for deployment:

```bash
sudo node scripts/check-nginx-config.mjs --installed-dir /etc/nginx/smartcontrol
```

## Atomic rollout

Record the current target before switching, then atomically replace the symlink:

```bash
readlink -f /var/www/smartcontrol.ro/current
sudo ln -sfn /var/www/smartcontrol.ro/releases/RELEASE_ID /var/www/smartcontrol.ro/current.next
sudo mv -Tf /var/www/smartcontrol.ro/current.next /var/www/smartcontrol.ro/current
sudo nginx -t
sudo systemctl reload nginx
```

Run the post-deployment verifier from a network outside the VPS:

```bash
node scripts/verify-production.mjs https://smartcontrol.ro
```

It checks the certificate, TLS 1.2/1.3 acceptance and TLS 1.0/1.1 rejection,
deterministic redirects, exact HSTS/CSP/COOP and companion security headers,
gzip or Brotli, cache classes, trailing slashes, production indexability, and
localized RO/EN 404 bodies with a real `404` status. It also fails while either
privacy route remains a legal-review holding page. That is an intentional launch
blocker until the evidence pack and bilingual notices are approved. The command
requests only the explicitly supplied origin.

## Rollback

Rollback uses the previously recorded release and configuration backups; it
does not rebuild an old commit in place.

```bash
sudo ln -sfn /var/www/smartcontrol.ro/releases/PREVIOUS_RELEASE /var/www/smartcontrol.ro/current.next
sudo mv -Tf /var/www/smartcontrol.ro/current.next /var/www/smartcontrol.ro/current
sudo nginx -t
sudo systemctl reload nginx
node scripts/verify-production.mjs https://smartcontrol.ro
```

If nginx configuration changed, restore `/etc/nginx/smartcontrol` and the site
symlink from `/var/backups/smartcontrol-nginx/CHANGE_ID/` first, run `nginx -t`,
then reload. Keep at least the active and previous release until the observation
window closes. A failed verifier is a rollback signal unless the infrastructure
and website owners document a narrower, understood exception.

## CSP report-only observation and enforcement

`site-rules.conf` sends a `Content-Security-Policy-Report-Only` baseline. It is
deliberately stricter than the current inline-script behavior so violations are
visible without blocking the site. No third-party reporting collector is
assumed or approved by this repository.

For 14 calendar days after production rollout, the website technical owner must
exercise every RO/EN route and core interaction in the supported browser matrix,
capture CSP console violations in the change ticket, and repeat after each
release. If a company-controlled EU reporting endpoint is approved, add
`report-to`/`report-uri` only with the matching `Reporting-Endpoints` ownership,
retention and privacy review.

Enforcement is a separate approved change. Before replacing the report-only
header, all legitimate scripts must be externalized or covered by build-derived
hashes, the route matrix must be clean for seven consecutive days, and both the
website technical owner and security owner must approve the exact policy. Never
silence findings by adding broad external origins or `unsafe-eval`.

## Drift and recurring verification

After every nginx package change and at least quarterly:

```bash
sudo nginx -t
sudo node scripts/check-nginx-config.mjs --installed-dir /etc/nginx/smartcontrol
node scripts/verify-production.mjs https://smartcontrol.ro
```

Any intentional VPS-only difference must be reviewed, documented and folded
back into the versioned template. CI orchestration remains owned by issue #33;
this runbook and its scripts are safe to call from that future workflow.
