# @aagf470/ui

Guillen Solutions' shared component library: section blocks, UI primitives, design
tokens, and (optionally) Sanity page rendering. One source of truth, published so
separate client-site repos can install it instead of copy-pasting components.

## What's in it

| Import | Contents |
| --- | --- |
| `@aagf470/ui` | Section library (`HeroSection`, `FeatureGrid`, `Steps`, `ImageText`, `Testimonials`, `CtaBanner`, `ContactSection`, `PricingPlans`, `ServiceList`, `HoursLocation`, `Gallery`, `Faq`, `SectionIcon`) + primitives (`Button`, `Card`, `Pill`, `SiteNav`) |
| `@aagf470/ui/cms` | `SanityPage`, `PageRouter` — render `clientPage` docs. Only for Sanity-backed sites. |
| `@aagf470/ui/styles.css` | All component styles + design tokens (self-contained). Import once. |
| `@aagf470/ui/styles/tokens.css` | Raw token defaults, if you want them without the component CSS. |

`react`, `react-dom`, `react-router-dom`, and the Sanity packages are **peer
dependencies** — the consuming site provides them.

---

## Using it in a site (separate repo)

1. **Auth** — the package lives on GitHub Packages. Add an `.npmrc` in the repo:
   ```
   @aagf470:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```
   (`GITHUB_TOKEN` = a GitHub PAT with `read:packages`.)

2. **Install**
   ```bash
   npm install @aagf470/ui
   ```

3. **Wire it up** — in `main.jsx`:
   ```js
   import '@aagf470/ui/styles.css'   // tokens + reset + all component styles
   import './theme/theme.css'         // this site's overrides (accent, dark/light…)
   import { HeroSection, FeatureGrid } from '@aagf470/ui'
   ```
   Sanity-backed sites also:
   ```js
   import { PageRouter } from '@aagf470/ui/cms'
   ```

The per-site `theme/theme.css` stays in the site repo — that's the whole point of
the token system. The package ships defaults; each site re-themes by overriding
CSS variables.

---

## Releasing a new version (from this monorepo)

The package source is `shared/` in the `cryarkwebsite` monorepo. Cryark and
guillen.studio consume it locally via the `@shared` Vite alias (instant, no
publish needed); the separate client-site repos consume the published build.

```bash
# 1. make component changes in shared/…
npm run build:ui                     # → shared/dist/  (run from repo root)

# 2. bump the version
cd shared && npm version patch       # patch | minor | major (semver)

# 3. publish
npm publish                          # uses publishConfig → GitHub Packages
```

Then in each client site: `npm update @aagf470/ui` (and redeploy). Because it's
versioned, a component change never silently ships to a live client site — each
site opts in on its own schedule.

### At client handoff
To honor the "you own everything, no lock-in" promise, vendor a snapshot instead
of leaving the client tethered to this registry: copy `shared/dist` +
`styles.css` into their repo (or `npm pack` and commit the tarball's contents) so
their site keeps working with zero dependency on our package feed.

---

## Publishing notes

The scope `@aagf470` matches the GitHub account that owns the package (required by
GitHub Packages). To publish you need a GitHub PAT with `write:packages`, either
via `npm login --registry=https://npm.pkg.github.com` or an `//npm.pkg.github.com/:_authToken=`
line in your `.npmrc`. The repo hosting this package must live under the `AAGF470`
account (or an org you rename the scope to).
