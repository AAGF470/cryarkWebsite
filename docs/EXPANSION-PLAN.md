# Guillen Digital Solutions — Expansion Plan

The operating map for the whole system: what's built, what's next, and why,
across the design system, the platform, our own properties, the business
tooling, and the infrastructure underneath. Companion to
[CLIENT-SITE-WORKFLOW.md](./CLIENT-SITE-WORKFLOW.md) (the per-client SOP).

**The thesis:** the moat is *taste encoded as a system* — tokens × expressions
× recipes × automation. Every item below either deepens that moat, converts it
into revenue, or protects it.

---

## Track 1 — Design system (the product)

| # | Item | Status | Notes |
|---|---|---|---|
| 1.1 | Design tokens (color, `--font-display`, rhythm: `--section-space`, `--container-max`) | ✅ ui 0.1.5 | Recipes and themes drive everything through these |
| 1.2 | Full catalog exported & tokenized (47 components) | ✅ ui 0.1.4–0.1.6 | Studio-dark hardcodes gone; category colors themable |
| 1.3 | Expressions wave 1 — Hero (classic/editorial/statement), FeatureGrid (cards/list/columns) | ✅ ui 0.1.5 | CMS-selectable |
| 1.4 | Style recipes ×5 + `applyRecipe` (recipe + accent = full identity) | ✅ ui 0.1.7 | Wired into freelance template; live demo on Work & Library |
| 1.5 | **Nav/header presets** — SiteNav `preset`: bar/center/minimal/split + built-in mobile drawer; recipes gain nav bias | ✅ ui 0.1.8 | The header is the strongest "template tell" after the hero |
| 1.6 | Expressions wave 2 — ImageText, Testimonials, CtaBanner, PricingPlans (2–3 skeletons each) | next | Kills the remaining shared-skeleton tells |
| 1.7 | **Per-section width** — a `width` option (narrow/default/wide/full-bleed) per block, on top of `--container-max` | next | Today width is per-theme only |
| 1.8 | Footer presets (SiteFooter is still Sanity-coupled and excluded) — rebuild as a tokenized, preset-driven component | queued | Every site currently hand-rolls its footer |
| 1.9 | Signature-element rule in the SOP: every client site ships one bespoke flourish (art, icon set, hero treatment) | queued (doc edit) | The 10% craft that makes 90% system read as 100% custom |
| 1.10 | Deep component rebuilds flagged by the refinement pass: Card (JS nav, glow machinery), ArchitectureBlock layout math, CodeBlock syntax highlighting (Shiki), CinematicHero/Banner heading-level prop | backlog | Do Card first — oldest-feeling piece |
| 1.11 | Subpath exports for heavy deps: `@aagf470/ui/diagrams` (mermaid), `/model-viewer` | backlog | Unlocks DiagramBlock/ModelViewer for consumers without bundle cost |
| 1.12 | Recipe expansion: more recipes as client niches appear; per-recipe icon styles | ongoing | A recipe per vertical eventually |

## Track 2 — CMS & platform

| # | Item | Status | Notes |
|---|---|---|---|
| 2.1 | Curated Payload stack (blocks, migrations, CI, admin-only escape hatches) | ✅ live | guillensolutions.com |
| 2.2 | Full-catalog block palette (Pages ~35 blocks, Posts 14 in-prose) | ✅ | Every component reachable from the editor |
| 2.3 | Devlog-grade posts (blocks-in-prose, projects collection, lexical renderer, /guides) | ✅ | Prerequisite for 3.1 and 4.4 |
| 2.4 | Expression + recipe selects surfaced in CMS | ✅ partial | hero/featureGrid have expression selects; extend with wave 2 |
| 2.5 | **Prerendering** the main routes + guides to static HTML at build time | next | Social scrapers see real meta; guides shouldn't need JS to be read |
| 2.6 | Media pipeline polish: image upload guidance, focal points, upload-from-URL in push-pages | queued | Story images still need manual admin upload |
| 2.7 | Payload upgrade cadence + `npm audit` in CI (the "security is on me" answer) | queued | Quarterly, scripted |
| 2.8 | Sanity tier kept as the hosted-CMS offering for clients wanting zero-infra security | ✅ policy | Payload = our properties + managed clients |

## Track 3 — Our properties (migrations & dogfood)

| # | Item | Status | Notes |
|---|---|---|---|
| 3.1 | **guillen.studio → Payload**: stand up guillenstudio-cms container (copy GS stack), swap Sanity data layer (useCmsQuery→REST, cmsImageUrl→media URLs), decouple SiteFooter/WorkCard/RelatedProducts, migrate content | next (~2 sessions) | Posts system already built for this. Fixes the RelatedProducts raw-`asset._ref` thumbnail bug as part of the swap |
| 3.2 | cryark.net → same treatment | after 3.1 | Reuses everything from 3.1 |
| 3.3 | Retire Sanity project for own properties once both migrate | after 3.2 | |
| 3.4 | NSL/CubeSat: iterate on club feedback rounds; CMS-ify when they commit to hosting (their infra decision: Railway vs VPS) | ongoing client | Preview live; awaiting photos, socials, real copy |

## Track 4 — Business tooling & content

| # | Item | Status | Notes |
|---|---|---|---|
| 4.1 | Quote flow: /pricing order page (configurator + estimator + rail) | ✅ | All CTAs route there |
| 4.2 | On-demand service line (newsletter, landing pages, QR menus, seasonal, rush) | ✅ priced & live | Newsletter vendor runbook still to write on first sale |
| 4.3 | Freelance automation: recipe + accent + site.config → site | ✅ mechanism | Write `new-freelance-client.sh` scaffolder (repo, config, deploy slot) |
| 4.4 | **Guides #1–2**: "Do I own my website?" and "Domains, hosting, design: what you're paying for" | next | /guides infra is live and empty; sales collateral first, SEO second |
| 4.5 | "Same page, three recipes" as a first-class sales artifact (exists on Work & Library — link it in outreach) | ✅ demo | |
| 4.6 | Client handoff kit: editor walkthrough one-pager + credentials checklist template | queued | Makes handoff day repeatable |
| 4.7 | Referral (5% renewal credit) mechanics: tracking note in client records | queued | Currently honor-system |

## Track 5 — Infrastructure & risk

| # | Item | Status | Notes |
|---|---|---|---|
| 5.1 | **B2 backups (restic kit at ops/raya)** — THE open risk: CMS holds real content with no offsite backup | ⛔ blocked on B2 account | One session to wire + test restore once keys exist. Highest priority on this whole document |
| 5.2 | RAYA reboot (pending kernel from patching) | ⛔ user action | `ssh raya reboot`, ~2 min |
| 5.3 | SSH hardening: disable password auth + root-login tightening (post-backup, with console recovery verified) | after 5.1 | Removes the brute-force surface behind the PerSourcePenalties saga |
| 5.4 | Swapfile on RAYA; fix cryark.net NPM upstream (→ cryark-static) | queued | Small |
| 5.5 | Automated site-health reports (uptime/speed/backup-verified per client, quarterly) | queued | Near-zero labor; justifies renewals |
| 5.6 | Publish-ui idempotency (409 = green) + consider auto-publish on shared/ tag | queued | Cosmetic CI polish |
| 5.7 | Consumer dedupe hygiene: react dedupe guard now in all three consumer configs; add to workflow doc + freelance scaffolder template | ✅ guard / doc edit queued | Two-React prod crash class closed |

## Sequencing (what I'd run, in order)

1. **5.1 B2 backups** the moment the account exists — everything else is
   rearrangeable; lost client content is not.
2. **1.5 nav presets** (in flight) → **1.6 expressions wave 2** → **1.7 width
   option** — completes the de-AI system's visible surface.
3. **4.4 guides #1–2** — cheap, compounding, uses finished infra.
4. **3.1 guillen.studio migration** — proves the full platform on a second
   property and kills the Sanity coupling debt.
5. **2.5 prerendering** — before any real SEO push on the guides.
6. Everything else opportunistically in the gaps.

## Standing dependencies on Angel (the clicks only you can do)

- Backblaze B2 account + bucket + app keys (unblocks 5.1)
- `ssh raya reboot` (5.2)
- publish-ui runs when versions bump; Author pages after content-shape changes
- Client-side: NSL photos/socials/copy; story images in /admin Media
