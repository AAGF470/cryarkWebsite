# Releasing `@aagf470/ui`

This is the shared component library every site builds against (guillensolutions,
cryark, fencingpatrol, nsl). Sites install it from **GitHub Packages** — they do
**not** build from this repo directly. So a change here isn't live anywhere until
it's published and each site bumps its dependency.

## Publish — the easy way (no terminal, no token)

There's a GitHub Action for this: `.github/workflows/publish-ui.yml`. It uses
the repo's built-in `GITHUB_TOKEN`, so no PAT and no local publish at all:

1. Bump `"version"` in `shared/package.json`, commit, push.
2. On GitHub → **Actions → "Publish @aagf470/ui" → Run workflow** (or publish
   a GitHub Release, which triggers it too).
3. Done — CI installs, builds, and publishes. Then bump the consuming sites.

## Publish — locally (fallback)

```bash
cd shared
NODE_AUTH_TOKEN="ghp_yourPAT" npm run release          # patch bump + publish
# npm run release -- minor      (new components / features)
# npm run release -- major      (breaking API changes)
```

The `release` script guards the things that bit us before:
- **Refuses a dirty tree** — publishing ships the current `dist/`, so commit/stash
  unrelated work first.
- **Requires `NODE_AUTH_TOKEN`** (a GitHub PAT with `write:packages`) with a clear
  message instead of npm's `ENEEDAUTH`.
- `prepublishOnly` **rebuilds `dist/`** automatically — you can't ship stale output.

The token only lives in that one command's env (mind your shell history). It is
**not** stored in this repo; `.npmrc` here only references `${NODE_AUTH_TOKEN}`.

## After publishing

Each consuming site builds against the published version. For every site that
should get the change:

1. Bump `"@aagf470/ui"` in its `package.json` (or rely on the `^` range picking up
   the new version on a fresh install).
2. Redeploy that site (CI runs `npm install` against the registry, so the new
   version is what ships).
3. Push the tag from here: `git push --follow-tags`.

## Adding a component the CMS can use

Library-first: a section should exist here **and** be wired into the CMS before a
client needs it. The full loop:

1. Add the section (`sections/Foo.jsx` + `.css`), export it from `sections/index.js`.
2. `npm run release` (publish), bump + redeploy consumers.
3. In each site's CMS (`cms/src/blocks.ts`): add a matching Payload block, register
   it in `SECTION_BLOCKS`, and map it in `site/src/PayloadPage.jsx` (+ `adapt` for
   any upload/array fields).
4. Generate the migration **against a DB at HEAD** and verify it contains only your
   delta before committing (see the CMS repo's migration notes).
