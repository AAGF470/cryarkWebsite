# SYSTEMS.md — the living systems ledger

> **Purpose:** fast retrieval for AI-assisted work. This file is the compact,
> greppable source of truth for how the two-repo system fits together — so a
> session can *read this* instead of re-analyzing old code, and so drift bugs
> (like the `wordpress` plan id that crashed the Author-pages workflow months
> after the plan was removed) get caught by a checklist instead of production.
>
> **Maintenance rule:** any change to pipelines, conventions, plan/block
> lineups, or gates MUST update this file in the same commit. Keep entries
> terse and factual. Last full update: **2026-07-10**.

## Repo map

| Repo | What lives here | Deploys via |
|---|---|---|
| `cryarkwebsite` (this repo) | Shared library `shared/` = **@aagf470/ui** (published to GitHub Packages); apps: `apps/cryark`, `apps/guillen` (guillen.studio), `apps/freelance-template` (static-preview scaffold) | Library: **Actions → "Publish @aagf470/ui"** (GITHUB_TOKEN, no PAT). See `shared/RELEASING.md` |
| `GuillenSolutionsWeb` | `site/` = guillensolutions.com (Vite SPA + prerender); `cms/` = Payload CMS (cms.guillensolutions.com, Postgres, Docker on RAYA) | Push to `main`: `deploy-site` (site/**), `deploy-cms` (cms/**). Manual Actions: "Author guides", "Author pages" (CMS content upserts) |

## The gates (things that silently break if forgotten)

1. **CI builds the site against the PUBLISHED @aagf470/ui**, not the local
   symlink (`site/node_modules/@aagf470/ui → ../../cryarkwebsite/shared`).
   New lib exports must be **published** before site code importing them hits
   `main`, or CI fails. Publish = version bump in `shared/package.json` →
   commit/push → Actions button.
2. **CMS migrations:** `push: false`; `payload migrate` runs at container
   boot. Every migration `.ts` MUST have its paired `.json` snapshot or
   `migrate:create` drifts and re-emits old tables (bit us once — see
   `GuillenSolutionsWeb/docs/CMS_MIGRATIONS.md` for the throwaway-Postgres
   validation recipe). Never ship a migration that re-creates existing tables.
3. **Content scripts import site data** (`cms/scripts/push-pages.mjs` imports
   `site/src/planPages.js` + `data.js`). When the plan/product lineup changes,
   grep `cms/scripts/` for stale ids. Loops should derive from
   `Object.keys(...)`, never hardcoded id lists.
4. **No hardcoded media paths in site code** — images/audio are CMS uploads
   (Media collection / globals like `voiceDemo`). Cards render placeholders
   until authored.
5. **CMS-page text fields are localized (en/es)** since 2026-07-10; site
   fetches default locale unless `?locale=es`. Coded pages use the site's own
   `t()` + `content.es.js` system instead.
6. **A CMS page with blocks TAKES OVER its route from the coded React page**
   (PayloadPage fallback pattern, main routes like `/`). So authoring a page
   via "Author pages" replaces the coded version for JS visitors — if the
   script's layout is stale, live sections silently disappear (happened
   2026-07-10: CMS `home` hid the markets/identity/nonprofit sections and all
   Spanish). Home authoring is PARKED in `push-pages.mjs`
   (`HOME_PAGE_DISABLED`) until it reaches full EN+ES parity with
   `site/src/pages/Home.jsx`. Before authoring any main-route page, diff the
   script layout against the coded page. Prerendered/SEO HTML is unaffected
   (takeover is client-side).

## Current lineups (update when they change!)

- **Plans** (`site/src/data.js` PACKAGES + `planPages.js` PLAN_PAGES):
  `freelance` ($600/yr1, $200/yr), `standard` ($950, $350, featured),
  `enhanced` (~$1,900, ~$650, approx), `private-hosting` (**tbd: true** — no
  numeric price; mailto CTA, excluded from configurator/schema math).
- **@aagf470/ui**: v0.1.14. 18 section components (incl. LocationGrid,
  ContactMethods, VoiceSample) + Reveal (motion) + studio blocks. All sections
  are CMS blocks (41 total) mapped in `site/src/PayloadPage.jsx` (MAP +
  `adapt()` normalizes uploads/arrays/columns).
- **Recipes** (`shared/lib/recipes.js`): 7 (editorial-paper, bold-trade,
  dark-cinematic, frosted, coastal-light, workshop, dark-pastel). A client
  theme = recipe id + accent hex. Motion personality per recipe
  (calm/standard/expressive → `--motion-*` vars).
- **Motion** (`shared/styles/motion.css` + `Reveal`): variants fade-up/fade/
  slide-left/slide-right/zoom/blur, `stagger`, `m-lift`/`m-grow`. Pre-reveal
  hiding gated on `html.js-motion`; reduced-motion safe.
- **Section variability props**: Testimonials.columns (unset=auto), Steps.
  columns (1–3, def 1), PricingPlans.columns (unset=plan count), ServiceList.
  columns (1–3, def 2), VoiceSample.layout (phone|plain), plus variant/
  expression on hero+featureGrid.
- **CMS collections**: Pages, Posts (guides), Projects, Media, Users,
  Inquiries (form submissions land here — NO email notifications configured),
  Updates, Builds. Globals: voiceDemo (AI-phone-menu sample clips), markets (one photo per market → Home grid + guide rails, arched duotone on guide pages), siteImages (keyed image slots → home-story-1/2 + six renders-* gallery shots; empty slots show their id). /contact is CMS-takeover-capable (PayloadPage fallback); PayloadPage fetches pass ?locale; contactSection block form posts to Inquiries (email optional).
- **Guides** (`cms/scripts/push-guides.mjs`, 8 articles): ownership checklist,
  cost-2026, pages-vs-items, local SEO, Squarespace comparison, Wix
  comparison, nonprofit guide, AI-phone-menu explainer.

## Client pipeline (the business process the code serves)

Call → static preview from `apps/freelance-template` (copy dir, edit
`site.config.js`: brand/accent/recipe/sections) → contract → iterate →
port to CMS block pages (localized en/es) → owner edits text/uploads media in
/admin → prerender harness (`site/scripts/prerender-core.mjs`, generic; per-
site manifest supplies routes) bakes SEO/AI-readable HTML + sitemap → deploy
→ collect final 50%.

## Key facts that keep coming up

- Contact: contact@guillensolutions.com · text + WhatsApp (508) 794-9751 (Google Voice + WhatsApp Business, one number) — **text-only, no calls**.
- Exit promise: runnable site copy + content export, 30 days (extendable to a
  120-day hard cap). Never promise "price never changes" — renewal rates are
  agreed in writing ("you'll always know the number in advance").
- Referral: 10% of first $600 + 5% above, Zelle same day.
- AI Phone Menu add-on: $200 one-time setup; number+voice subscription in the
  client's own name.
- Identity: LGBTQ+ & Latino-owned, bilingual EN/ES, boutique/product-business
  focus; nonprofits = initial target market.
- Socials: Facebook https://www.facebook.com/profile.php?id=61591594841523 (in footer + ORG.sameAs; swap for the vanity URL once FB grants a username).
- Docs: `GuillenSolutionsWeb/docs/CMS_MIGRATIONS.md` (migration safety),
  `docs/COMPETITIVE.md` (vs Webflow/Framer), `shared/RELEASING.md` (publish),
  `DESIGN_SYSTEM.md` (style guide, this repo).
