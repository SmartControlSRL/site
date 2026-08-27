# Dependency security and toolchain policy

## Supported toolchain

- Node is pinned to `22.22.3` in `.nvmrc`; `package.json#engines` accepts only the Node 22.22 maintenance line used by CI.
- npm is pinned to `10.9.4` through `packageManager` and constrained to npm 10 in `engines`.
- Install with `npm ci`. Do not regenerate the lockfile with an unsupported Node/npm pair.
- Astro `~5.18.2`, `@tailwindcss/vite` `~4.1.18`, Tailwind `~4.1.18` and the `vite@^6.4.3` override are one compatibility unit. The override must continue to produce one de-duplicated Vite tree.

This project deploys generated static files, not a Node process. All packages are therefore build, editor, test or asset-compilation dependencies and are classified as `devDependencies`. This classification makes the deployment boundary accurate; it does **not** remediate or hide build-tool advisories. CI audits both the complete tree and the production-omitted view.

## Dependency classification

| Class | Packages / paths | Production reachability |
|---|---|---|
| Static-site compiler | `astro`, `@astrojs/sitemap`, `@lucide/astro`, Fontsource packages | Build only; generated HTML/CSS/assets are deployed |
| CSS compiler | `tailwindcss`, `@tailwindcss/vite`, overridden `vite` subtree | Build only; inputs are repository-controlled |
| Type/editor checks | `@astrojs/check`, `typescript`, language-server subtree | Local and CI checks only |
| Browser QA | `playwright` | Local and CI tests only |
| Server runtime | None | No Node/Astro server is deployed |

## Current advisory decision

The complete audit currently reports 12 vulnerable packages representing 21 advisory IDs. Their machine-enforced records are in `config/dependency-risk-acceptance.json`; every record contains the advisory ID, affected path, severity, reachability, exposure, rationale, owner and review date. The acceptance expires on **2026-11-26** and must be reviewed earlier if the deployment model changes, untrusted build inputs are introduced, or an advisory’s exploit conditions change.

The production-omitted audit must remain clean. `npm run audit:dependencies` fails when:

- npm reports an advisory absent from the register;
- an acceptance or the register has expired;
- a required register field is missing; or
- `npm audit --omit=dev` reports any vulnerable production package.

Moving dependencies to `devDependencies` only documents the static deployment boundary. The complete audit and time-bounded register deliberately keep the accepted build/editor risk visible.

## Safe coordinated remediation plan

Do not run `npm audit fix --force` and do not bump Astro, Tailwind’s Vite integration or Vite independently.

1. Open a dedicated migration branch and review the Astro, Tailwind and Vite migration notes together.
2. Select an Astro/Tailwind/Vite candidate trio and document why their peer ranges are compatible.
3. Remove or revise the Vite override only when the candidate no longer needs it.
4. Run `npm ci` and require `npm ls` to show a valid tree with a single Vite version.
5. Run `npm run qa`, which covers type-check, the production build, claims, email links, internal links, locale parity, all generated routes, intentional 404 responses, contrast states, LCP and browser smoke tests.
6. Verify desktop/mobile ClientRouter navigation, the mobile menu, email links, Cloud steppers, normal motion, reduced motion and no-JS output.
7. Compare the generated route inventory and audit artifact with the pinned baseline before merging.
8. Update or remove advisory acceptances only after the candidate passes; record any residual advisory with a new owner and review date.

If the candidate fails, retain the current pin and renew an acceptance only after reassessing reachability and exposure. A severity count alone is not enough.
