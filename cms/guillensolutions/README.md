# guillensolutions.com — CMS (Payload)

The curated CMS for the live-but-in-progress Guillen Solutions site. **Editors change
content and add/remove/reorder blocks; they can never touch structure or code** — the
proof-of-concept for what every client gets.

> **Build status:** these are the deploy-ready files (schema, blocks, compose, Dockerfile,
> seed, render adapter). Payload is a running Node app + Postgres, so it can't be
> click-verified in the build sandbox — the steps below run + verify it on RAYA (or your
> Mac). Everything a client edits lives on **your** Postgres, backed up by `ops/raya`.

## Files
| File | Role |
|---|---|
| `payload.config.ts` | Collections (Pages · Posts · Media · Users) + curated access (Users admin-only). |
| `../blocks.ts` | The shared section blocks = the editable surface (copy in beside the config). |
| `docker-compose.yml` | Payload + internal-only Postgres; data under `/srv/docker` (backed up). |
| `Dockerfile` · `.env.example` | Production image + secrets template. |
| `seed.ts` | Starter Home page so there's content to edit immediately. |
| `site/PayloadPage.jsx` | Renders a page's blocks with `@aagf470/ui` — drop into the site. |

## Deploy runbook (RAYA)
```bash
# 1. Scaffold the Next/Payload plumbing (choose Postgres, blank), then drop our files in:
npx create-payload-app@latest guillensolutions-cms   # → creates the Next app + Dockerfile
cd guillensolutions-cms
cp /path/to/cms/blocks.ts               src/blocks.ts
cp /path/to/cms/guillensolutions/payload.config.ts src/payload.config.ts
cp /path/to/cms/guillensolutions/{docker-compose.yml,Dockerfile,.env.example,seed.ts} .
cp .env.example .env    # fill PAYLOAD_SECRET + DB_PASSWORD (strong, random)

# 2. Build + run on RAYA (in /srv/docker/guillensolutions-cms/)
docker compose up -d --build
docker compose exec guillensolutions-cms npx tsx seed.ts   # starter Home page
# create your admin user at first load

# 3. Route it: add an NPM proxy host  cms.guillensolutions.com -> guillensolutions-cms:3000
#    Postgres stays internal-only. pgdata + media under /srv/docker are already backed up.
```
Log in at `https://cms.guillensolutions.com/admin` → open **Pages → Home** → edit text,
swap images, add a **Feature grid** or **Gallery** block, save. That's the curated editing.

## Point the site at the CMS
In the guillenwebsites app:
1. Copy `site/PayloadPage.jsx` in (or publish it as `@aagf470/ui/payload`).
2. Set `VITE_CMS_URL=https://cms.guillensolutions.com` in the site's `.env`.
3. Render a CMS-driven route with a static fallback while content is still being built:
   ```jsx
   <PayloadPage slug="home" fallback={<Home />} />
   ```
   As blocks are filled in, the page flips from the hardcoded version to the CMS one —
   same `@aagf470/ui` components, now editable.

## Adding to the editable palette later
New section in `@aagf470/ui` → add a matching block to `../blocks.ts` and a line to
`PayloadPage.jsx`'s `MAP`. That's the "add new components" selling point: the palette of
blocks a client can drop in grows with the library.

## Reuse for other sites (guillen.studio, cryark)
`../blocks.ts` is shared. Copy this folder per site, swap the domain/container names in
`docker-compose.yml` + `.env`, and point that site's `PayloadPage` at its own CMS URL.
