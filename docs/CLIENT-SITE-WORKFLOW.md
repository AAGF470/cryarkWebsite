# Client Site Workflow — Standard Operating Procedure

The pipeline that takes a client from "no website" to a maintained, CMS-managed
site on RAYA. Written after bringing **guillensolutions.com** online end-to-end;
every pitfall below actually happened. Follow the order — most of the pain came
from skipping steps or doing them out of sequence.

**The business model this serves:** AI automation develops the site from the
component library → client sees a static preview → on approval, the site gets
its CMS + container on the VPS → client edits content themselves, we maintain
it for the yearly fee. Bounded, fixed-scope, setup-and-handoff.

---

## Stage 0 — Prerequisites (once per client)

1. **Angel creates the repo**: empty GitHub repo `AAGF470/<Name>Web`, cloned
   under `/Users/ag/Desktop/website/`. AI never creates repos.
2. Decide the domain situation early (owned? transferring? placeholder brand?).
   Never claim licenses/track record the client doesn't have on the site.

## Stage 1 — Static site (AI-built from the library)

Build a standalone Vite app composing sections from **`@aagf470/ui`**:

- `.npmrc`: `@aagf470:registry=https://npm.pkg.github.com` +
  `//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}` (classic PAT,
  `read:packages`).
- Import `@aagf470/ui` + `@aagf470/ui/styles.css`; site-local `theme/theme.css`
  overrides tokens only.
- **Fidelity rule:** if a page needs a pattern the library lacks, PROMOTE the
  pattern into the library (new component + block) — never build it site-local.
  Site-local sections are invisible to the CMS and create pages that can't be
  reproduced after CMS-ification (this bit us with `gs-intro` → became
  HeroSection `size="compact"`, and the ownership list → became `Checklist`).
- Components must be fully tokenized. New CSS that must beat base/media rules
  needs double-class specificity (`.hero-section.hero-section--compact`) —
  cascade order across the CSS bundle is NOT guaranteed.

## Stage 2 — Static preview on RAYA

- Preview slots are constant nginx containers (`clientpreview-one/two`,
  `/srv/preview/<slot>/`, SPA fallback via `try_files … /index.html` in the
  slot's own nginx.conf — NPM can't do this part).
- Deploy: `npm run build && rsync -a --delete dist/ raya:/srv/preview/<slot>/`.
  No Node, no tokens, no git on RAYA for previews.
- Client feedback loops happen here — cheap, fast, throwaway.

## Stage 3 — Feedback → static revisions

Apply design/structure feedback while it's still static. Do NOT start CMS work
until the design is approved — the CMS is the expensive, stateful part and this
stage boundary is what keeps engagements fixed-scope (deposit gate lives here).

## Stage 4 — CMS-ification (Payload)

1. Scaffold: `npx create-payload-app` in `<repo>/cms/` (blank template,
   **Postgres**).
2. Drop in the curated config: `src/blocks.ts` (shared block schema — copy from
   GuillenSolutionsWeb, keep in sync) and `src/payload.config.ts` (Pages/Posts/
   Media + admin-only Users; postgres adapter; KEEP the generated `sharp`,
   `admin.importMap`, `typescript.outputFile` plumbing).
3. Wire the site: `PayloadPage.jsx` renders blocks via `@aagf470/ui`; main
   routes = `<PayloadPage slug="..." fallback={<Bespoke/>} fallbackWhileLoading/>`
   (CMS page with blocks takes over; empty/missing → bespoke, no blank flash);
   `/:slug` route for CMS-only pages.
4. Author pages programmatically with `cms/scripts/push-pages.mjs` (logs into
   the live API, upserts by slug, idempotent) — this is the AI-authoring loop.

**DEFAULT: every page ends CMS-authored.** The static build (Stage 1) is the
cheap showcase; after approval, ALL of its pages get converted to block
layouts and pushed — the bespoke React pages remain only as fallbacks. Rules:
- Import shared copy (pricing, promises) into push-pages from the site's
  `data.js` — one source of truth until the CMS takes over as the live copy.
- Standard sections → library blocks 1:1.
- Highly custom sections → `customHtml` blocks carrying the exact bespoke
  markup (the classes still exist because the fallback pages stay bundled);
  promote recurring patterns into `@aagf470/ui` as real components over time.
- Anchors: set a block's built-in "Block Name" to e.g. `packages` — the
  renderer wraps it in `<div id="packages">` so `#packages` links keep working.
- Images: `imageText`/`gallery` blocks use Media uploads; authored pages start
  imageless — upload media in `/admin` after the push (or extend push-pages to
  upload files).

### Stage-4 pitfalls (all hit in production — check every one)

| Pitfall | Symptom | Fix |
|---|---|---|
| Node/npm version mismatch | `npm ci` "lock file out of sync" in Docker only | Build image node major = dev machine's (`node:24-alpine` for an npm-11 lockfile) |
| `.npmrc` not in image | same `npm ci` failure persists | `COPY … .npmrc* ./` in the deps stage (lockfile was resolved with `legacy-peer-deps`) |
| Next **standalone** image | `payload migrate`/CLI/seed impossible in container; schema push silently no-ops → `relation "users" does not exist` | Full-app image (no `output: 'standalone'`); `CMD payload migrate && next start` |
| Runtime schema push in prod | tables never created | `push: false` + `migrationDir` + committed migrations; regenerate per schema change: `npm run payload -- migrate:create <name>` |
| Migrate races Postgres | first boot flaky | compose healthcheck (`pg_isready`) + `depends_on: condition: service_healthy` |
| Stale `payload-types.ts` | `next build` type-check fails on collection slugs | `npm run generate:types` after EVERY schema change |
| Widened TS literals in shared field helpers | `not assignable to type 'Field'` | `type: 'select' as const` etc. in helper objects |
| Blank template has no `public/` | runner-stage COPY fails | commit `public/.gitkeep` |
| New library export used before publish | site CI build fails on missing import | ORDER: publish `@aagf470/ui` first, then deploy site |
| CORS | localhost dev can't fetch live CMS | expected — config allows only the site origin; test on the deployed site |

### Non-negotiable security defaults
- Postgres on an `internal` network ONLY — never on `proxy`, no host ports.
- `.env` lives on RAYA only (DB_PASSWORD + PAYLOAD_SECRET via
  `openssl rand -hex 32`); **store PAYLOAD_SECRET in the password manager** —
  it's not in git and rebuilding without it invalidates sessions.
- git = code, Postgres = content. The serving layer stays disposable.
- Client editors get the `editor` role (Pages/Posts/Media only); `customHtml`
  blocks are admin-only at the field level.

## Stage 5 — Container on the VPS + go-live

1. RAYA pulls via a **read-only deploy key** (repo → Settings → Deploy keys).
2. `git pull && cd cms && cp .env.example .env` (fill) `&& docker compose up -d --build`.
3. NPM route: `cms.<domain>` → `<name>-cms:3000` (container name on the shared
   `proxy` network) + Let's Encrypt. Static site container: nginx:alpine slot
   under `/srv/static/<name>/html` + apex route.
4. First admin: created in the browser at `/admin` (empty users collection
   shows the create-first-user form).
5. CI/CD (GitHub Actions): `deploy-site.yml` (build+rsync on `site/**` push),
   `deploy-cms.yml` (SSH pull+rebuild on `cms/**` push), `author-pages.yml`
   (**manual dispatch ONLY** — it overwrites page layouts; auto-running it
   would clobber client content tweaks). Secrets set once per repo:
   RAYA_HOST/RAYA_USER/RAYA_SSH_KEY/PACKAGES_TOKEN/CMS_ADMIN_EMAIL/PASSWORD.

### Ops pitfalls (also all real)
- **OpenSSH 10 PerSourcePenalties**: repeated failed auth gets an IP's packets
  DROPPED (timeouts, not "denied") — this silently banned GitHub runners after
  a key mismatch. Fix auth, `systemctl restart ssh` to clear the penalty table,
  and give CI `ConnectTimeout=20` + retry-with-backoff.
- **Never rewrite `authorized_keys`** — append-only, and verify the derived
  pubkey (`ssh-keygen -y -f key`) matches before authorizing. A bad rewrite
  locked us out of the server.
- `ssh-keyscan` can flake under `set -e` — make it `|| true` and use
  `StrictHostKeyChecking=accept-new`.
- Deploy keys for pulls (read-only, per-repo); a dedicated CI keypair for
  Actions (revocable by deleting one `authorized_keys` line).

## Stage 6 — Handoff to the client

- Client owns: domain, content, CMS login, email/phone accounts — all in their
  name, per the contract. Editor login handed over with a 15-minute walkthrough
  (Pages → blocks → save; they can't break structure by design).
- Vendor a snapshot of `@aagf470/ui` into the repo at handoff if the client
  ever wants to leave (no registry lock-in).
- Repo remains the source of truth; the client's production presence must
  never depend on our machines.

## Stage 7 — Maintain (the yearly fee)

- Backups: restic → B2, append-only key on RAYA, prune from the Mac
  (`ops/raya/`); what matters: `/srv/docker/<name>-cms/pgdata` + media.
- Library updates flow: bump `@aagf470/ui` → publish → client-site CI rebuilds.
- Content changes: client self-serves free; we bill only hands-off work.

---

## Quick-reference: bringing up a new client CMS in ~30 minutes
```bash
# local
npx create-payload-app cms          # blank, postgres
# drop in blocks.ts + payload.config.ts, fix Dockerfile/compose from the GS repo
npm run generate:types && npm run payload -- migrate:create initial
npx tsc --noEmit                    # must be clean — this is what Docker runs
git push                            # CI or manual deploy on RAYA
# RAYA: .env → compose up → NPM route → /admin first user → author-pages
```
