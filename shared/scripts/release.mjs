#!/usr/bin/env node
// ---------------------------------------------------------------------------
// release.mjs — guarded publish for @aagf470/ui (GitHub Packages).
//
//   npm run release            # patch bump (0.1.11 → 0.1.12)
//   npm run release -- minor   # minor bump
//   npm run release -- major   # major bump
//
// Guards against the footguns we actually hit:
//   • refuses to publish from a dirty git tree (no shipping half-done work)
//   • requires NODE_AUTH_TOKEN (the write:packages PAT) up front, with a clear
//     message instead of npm's cryptic ENEEDAUTH
//   • `prepublishOnly` (in package.json) rebuilds dist, so you can never ship
//     stale build output
//
// After it publishes, bump each consuming site's "@aagf470/ui" dependency and
// redeploy. Consumers build against the PUBLISHED package, not the local repo.
// ---------------------------------------------------------------------------
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts })
const capture = cmd => execSync(cmd, { encoding: 'utf8' }).trim()
const die = msg => { console.error(`\n✗ ${msg}\n`); process.exit(1) }

const bump = process.argv[2] || 'patch'
if (!['patch', 'minor', 'major'].includes(bump)) die(`Unknown bump "${bump}". Use patch | minor | major.`)

// 1) auth present?
if (!process.env.NODE_AUTH_TOKEN)
  die('NODE_AUTH_TOKEN is not set. Publishing needs a GitHub PAT with write:packages.\n' +
      '  Run:  NODE_AUTH_TOKEN="ghp_…" npm run release')

// 2) clean tree? (npm version will also refuse, but this message is clearer)
if (capture('git status --porcelain'))
  die('Working tree is dirty. Commit or stash first — publishing ships the current dist,\n' +
      '  and this repo often has unrelated in-progress changes. Get it clean, then release.')

const { name, version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)))
console.log(`\n▶ Releasing ${name} (currently ${version}) — ${bump} bump\n`)

// 3) bump (commits + tags), 4) publish (prepublishOnly rebuilds dist)
run(`npm version ${bump}`)
run('npm publish')

const next = JSON.parse(readFileSync(new URL('../package.json', import.meta.url))).version
console.log(`\n✓ Published ${name}@${next}\n`)
console.log('Next: bump "@aagf470/ui" in each consuming site (guillensolutions, cryark,')
console.log('fencingpatrol, nsl) and redeploy. Push your tag too: git push --follow-tags\n')
