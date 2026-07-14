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
- **Area SEO pages** (`site/src/areaPages.js`): 11 generated hyperlocal
  guides (Tomball/Spring/Klein/Woodlands/Conroe + Roxbury/South End/Seaport/
  West Roxbury/Downtown/Cambridge), EN+ES, appended into LOCATION_GUIDES so
  routing/prerender/sitemap/schema inherit automatically. Adding an area =
  one AREAS entry (roads, places, hand-written flavor line — the anti-
  doorway ingredient). Market guides + /guides index interlink the areas.
  All 15 guides are footer-linked ("Serving:" strip, React footer + the
  prerender template footer in `scripts/prerender.mjs` — BOTH must carry
  new links, prerender does not run React) → crawl depth 1 from every page.
- **Guides** (`cms/scripts/push-guides.mjs`, 8 articles): ownership checklist,
  cost-2026, pages-vs-items, local SEO, Squarespace comparison, Wix
  comparison, nonprofit guide, AI-phone-menu explainer.

## guillen.studio v2 rebuild (decided 2026-07-13, in design)

- **v3 CONTENT-FIRST (2026-07-14, current direction):** professional-
  consensus strip-down for the graphics-portfolio genre — "the work is the
  design." Full-bleed SSF media hero (autoplay loop slot) with statement
  overlaid; quiet gallery below; glass ONLY on floating chrome (nav,
  console); CUT: wafer, chip hero (die mark demoted to logo/About), rail,
  metallic text, glass content panels. KEPT: 218° hue-unified neutrals,
  sparse red accent (60-30-10), wheel-related status hues, 8px rhythm,
  light-bleed (the one signature effect — feeds on real media), console.
  Mock: index.html (v3); v1-datasheet.html + v2-soft-silicon.html kept.
  **BLOCKER: needs 3 real captures from Angel** (SSF viewport clip,
  Toolkit screenshot, Last Call gameplay) — design judged only w/ real
  media; do not restyle further until then.
- **Typography (2026-07-14): Space Grotesk only** (display + body, 700 for
  headings) + JetBrains Mono. Archivo/wide-stretch REMOVED (read as squished
  — Angel wants boxy/vertical). Content column 1040px; prose measure 720px.
- **Devlog + docs page templates + PAYLOAD BLOCK PALETTE (2026-07-14):**
  mocks `devlog.html` + `docs.html` in guillen-concept/. Angel authors these
  himself in the CMS — blocks ARE the schema:
  - Shared blocks: `prose` (richtext, 720px measure) · `media` (upload +
    caption + wide/inset variant, light-bleed) · `code` (filename + language
    + body) · `callout` (tip/note/warning) · `metrics` (label/value/was/
    delta-direction cards) · `compare` (before/after upload pair, slider).
  - Devlog-only: `changelog` (added/changed/fixed rows) · `embed` (YouTube).
  - Docs-only: `steps` (numbered title+body) · `params` (name/type/
    description table rows).
  - Collections: Devlogs (title, project rel, date, version, blocks[],
    readingTime auto) · DocSpaces (project rel, version label, grouped tree)
    · DocPages (space rel, group, order, slug, blocks[]; prev/next + on-this-
    page derived). Docs layout: sidebar tree / content / on-this-page rail.
  - Nav behavior: auto-hide (hide on scroll-down, show on scroll-up, 16px
    top hover zone summons it; never hidden near page top). All pages.
- **Widened layout (2026-07-14):** home main/hero 1040→1280px; devlog article 880→1020px (measure 720→760px, wide-media breakout recalculated against 1020px column, spans up to 1320px); docs shell 1280→1560px (sidebar 230→250px, rail 190→220px). Spacing scale opened further: sp-5 48→56, sp-6 80→96, sp-7 112/128→128/144. Reason: more room for visual content (media/renders), plus a boxier/more-vertical feel over the earlier squished one.
- Prior iteration — "Soft Silicon" (v2) — softened,
  media-first evolution of the datasheet concept. Mock:
  `~/Desktop/guillen-concept/index.html` (v1 kept at `v1-datasheet.html`).
  Palette: steel `#97a0ac` (structure) · blue `#8fb9e6` (labels/links) ·
  soft signal red `#ee5560` (alive: LEDs, active nav, CTAs). Sentence-case
  Archivo (700/800, 110% stretch), 14-18px radii, quiet grain, whisper bus
  rail (single line + vias), subtle metallic .metal display text, wafer halo
  behind chip hero. **Engineering flavor = seasoning, not the dish** (target
  audience incl. recruiters): human labels ("Featured project", "Devlog"),
  no part numbers/SHT/barcode chrome; deep-tech lives in the hidden serial
  console (` key) only.
  **Light-bleed media system**: every media well = .media > .bleed (blurred
  clone behind) + .frame; hover diffuses the artwork's own edge colors
  outward (ambilight). Works with img/video via clone JS. Media slots:
  SSF gameplay/trailer, 4 work-card thumbs, about portrait, chip die render.
- **Strategy: fresh build, no morphing.** New bare app `apps/studio` (this
  repo) + NEW container on RAYA; domain swap = one NPM proxy-host edit when
  ready; old guillen-static container kept as rollback.
- **CMS: Payload replaces Sanity** for this site. Separate instance cloned
  from GuillenSolutionsWeb/cms patterns (own Postgres + container, NOT shared
  with the client CMS). Collections: Devlogs (errata), Projects (datasheets),
  DocSpaces/DocPages, Media; globals: operator profile, site links.
- **v2.1 (2026-07-14): hue-unified + frosted glass.** All neutrals on one
  218° blue axis (bg #0b0d12, glass rgba(198,214,235,.045), steel #9aa7ba,
  ink cool-white); red #ee5560 = split-complement accent, ≤10% (60-30-10).
  Status hues wheel-related: shipped=teal #7fd8c3 (red's complement),
  in-dev=blue, R&D=violet #b7a3e8 (blue↔red bridge). Frosted `.glass`
  convention (blur 22px + saturate + top-edge inset highlight) over a dim
  2-tone ambient field. 8px spacing scale (--sp-1..7), dark-mode generous
  rhythm. Light-bleed doubles as glass illumination.
- **REAL PROJECT SLATE (corrected 2026-07-14 — SSF is NOT a game):**
  SSF = **procedural foliage scattering/rendering system for UNREAL** (C++/
  HLSL, flagship, in dev); Cinematic Toolkit (Godot modules: AA shader,
  asset inspector, The Instancer, proc generators, FPS controller, in dev);
  DERG = synthetic training-data pipeline (Blender/Python, R&D — the old
  "Derg docs" nav comment refers to this); Last Call (Unity team game,
  shipped, course); GPA Tracker (PyQt6 packaged macOS app, shipped).
  Cooper proc-gen research: add ONLY when confirmed. Framing rule: every
  project carries a "what it demonstrates" line; lead with graphics/engine
  work; honest in-dev vs shipped status. Site purposes: project showcase +
  live docs + **beta build distribution** + how-it-was-made breakdowns +
  small hire-me pitch.
- **New IA:** / (media-first board) · /ssf (flagship hub) · /work · /devlog ·
  /docs (into nav) · /builds (beta distribution) · /lab (seeds) · /about
  (recruiter sheet — co-op deadline Fall 2026). "Work with me" = small
  hire-me block in About + footer link → guillensolutions.com.

## Infra (RAYA — 72.61.11.169, ssh alias `raya`)

- **Edge: nginx-proxy-manager container** owns 80/443 + all Let's Encrypt
  certs (GUI on :81). Every site/service is proxied through it — so
  edge-level settings apply to ALL current and future client sites at once.
- **Gzip (added 2026-07-11):** NPM's stock conf had `gzip on` but no
  gzip_types and gzip_proxied off → proxied CSS/JS/JSON shipped raw
  (166KB CSS → 27KB after fix). Lives at
  `/srv/docker/nginx-proxy-manager/npm/data/nginx/custom/http.conf`
  (NPM's documented http-context hook). Rollback: delete file →
  `docker exec nginx-proxy-manager nginx -s reload`. NEVER touch
  `/srv/docker/nginx-proxy-manager/npm/letsencrypt` (certs).
- Per-site static sites are `nginx:alpine` containers (guillensolutions-static,
  clientpreview-one/two, guillen-static, cryark-static…) rsync'd by CI;
  hashed /assets already ship `max-age=31536000, immutable` from those.
- **New-client server checklist:** gzip = inherited from edge (nothing to do);
  add proxy host in NPM GUI (+ cert); static container from the standard
  nginx:alpine pattern; CMS clones get the media cache-headers next.config +
  WebP imageSizes from GuillenSolutionsWeb/cms (copy, don't reinvent).

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
- Identity: Latino-owned + bilingual EN/ES is the PUBLIC brand; LGBTQ+
  ownership is true but NOT brand-displayed as of 2026-07-11 (political
  sensitivity, Texas markets — owner's call). Site carries a quiet "everyone
  is welcome" line in Where-we-are instead. Chamber/LGBTBE strategy
  unaffected. Boutique/product-business focus; nonprofits = initial target.
- Socials: Facebook https://www.facebook.com/profile.php?id=61591594841523 + Instagram https://www.instagram.com/guillensolutions/ (both in footer + ORG.sameAs; swap FB for its vanity URL once granted).
- Lead finder: tools/leadfinder.py — feed it "Name | domain" lines (from browsing Maps/Yelp), it probes each site once via curl and scores lead heat (dead site/TLS/EOL PHP/no viewport/stale copyright); outputs ranked CSV for the tracker. Technical decay only — design judgment stays human.
- Pitch: PITCH.md (this repo) — canonical copy-paste sales pitch; keep synced with pricing changes.
- Social: SOCIAL.md (this repo) — hashtag bank per market/vertical + caption conventions; pull from it for every IG/FB post.
- Docs: `GuillenSolutionsWeb/docs/CMS_MIGRATIONS.md` (migration safety),
  `docs/COMPETITIVE.md` (vs Webflow/Framer), `shared/RELEASING.md` (publish),
  `DESIGN_SYSTEM.md` (style guide, this repo).
