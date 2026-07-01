# Freelance template — the productized $600 tier

A complete freelance/solo site that's driven by **one file**: `src/site.config.js`.
Fill it in and you have a client site — no per-client design or CSS work. This is the
"industrialized production" that makes the $600 tier profitable.

## Preview it in the monorepo
```bash
npm run dev:freelance      # from repo root
npm run build:freelance
```

## How it works
- **`src/site.config.js`** — the only file you touch. Brand name + one **accent color**,
  phone/email, and content for the sections (hero, services, about, faq, contact).
- **`applyTheme.js`** — derives the entire accent palette + button styling from that one
  color, so the site is on-brand with zero CSS editing.
- **`theme.css`** — fixed professional light neutrals (the "professional template").
- **`FreelanceSite.jsx`** — composes `@aagf470/ui` sections from the config; optional
  sections (about, faq) appear only if present.

The 3 "designed" pages are these config-driven sections; the 2 "self-serve" pages are
added later from the client's CMS.

## Spinning out a real client (standalone repo)
Same pattern as the other client sites — the template uses the `@shared` alias for
in-monorepo dev; a client repo consumes the published package instead:

```bash
# 1. create + clone the client repo, then from the template:
cp -R apps/freelance-template/src <client>/src
cp apps/freelance-template/index.html apps/freelance-template/vite.config.js <client>/
# 2. swap the alias for the package + add standalone config:
#    - in src/*: @shared/sections     -> @aagf470/ui
#                @shared/styles/base.css -> @aagf470/ui/styles.css   (import in main.jsx)
#    - add package.json (deps: @aagf470/ui react react-dom) + .npmrc (see any client repo)
# 3. edit src/site.config.js, then: npm install && npm run dev
```
(A `new-freelance-client.sh` generator that does steps 1–2 automatically is the natural
next step — the manual version is above so nothing's a black box.)

> Note: `main.jsx` imports `@shared/styles/base.css` for monorepo dev. In a client repo
> that becomes `import '@aagf470/ui/styles.css'`.
