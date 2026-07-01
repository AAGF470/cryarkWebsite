# Payload pilot — guillen.studio

Piloting **Payload** (self-hosted, Node + Postgres) on our own property before betting a
paying client on it. Content lives in *our* Postgres on RAYA (own-everything), and the
editing surface is **curated**: clients edit structured blocks we define — never raw
HTML/layout/code.

> **Status: INITIALIZATION SCAFFOLD.** These files are the durable, reusable parts
> (block schema, compose, render adapter). Payload itself isn't installed/run yet — do
> that with the runbook below. The `.ts` config's *plumbing* is version-sensitive; the
> *blocks* are not.

## What's here
| File | Role |
|---|---|
| `payload.config.ts` | Collections + **section blocks** mirroring `@aagf470/ui` (the curated editing surface) + admin-only access on Users. |
| `docker-compose.yml` | Payload + Postgres. DB on an internal-only network; data under `/srv/docker/guillen-cms/pgdata` so the backup kit captures it. |
| `.env.example` | Secrets template. |
| `adapters/PayloadPage.jsx` | Renders a page's blocks via `@aagf470/ui` — the Payload twin of `SanityPage`. |

## Init runbook (local first)
```bash
# 1. generate the project (choose Postgres, blank template)
npx create-payload-app@latest guillen-cms
cd guillen-cms
# 2. replace its payload.config.ts with the one here; add the section blocks
cp ../payload.config.ts src/payload.config.ts
# 3. env + run
cp ../.env.example .env   # fill PAYLOAD_SECRET + DB creds
docker compose -f ../docker-compose.yml up -d guillen-cms-db   # local Postgres
npm run dev               # http://localhost:3000/admin — create the admin user
```
Create a `Pages` doc, add Hero + FeatureGrid + FAQ + CTA blocks, save.

## Point guillen.studio at it
In the guillen.studio site, set `VITE_CMS_URL=https://cms.guillen.studio` and render a
route with `<PayloadPage slug="home" fallback={<StaticHome/>} />`. Same section components,
now CMS-driven — graduating it from static without changing the look.

## On RAYA (when the pilot is ready)
- `build` the Payload image, drop the stack in `/srv/docker/guillen-cms/`, `docker compose up -d`.
- Add an NPM proxy host: `cms.guillen.studio` → `guillen-cms:3000`.
- Postgres stays internal-only. `pgdata` under `/srv/docker` is already covered by
  `ops/raya/backup.sh` (and `backup.sh` auto-dumps the `postgres` container).

## Next to flesh out
- Add the remaining blocks (steps, imageText, pricingPlans, serviceList, hoursLocation,
  testimonials, contactSection) — same pattern.
- Tighten field-level access if some fields should be read-only to editors.
- Decide Sanity vs Payload per client; this pilot is how we learn the ops reality first.
