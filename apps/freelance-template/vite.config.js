import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// Freelance template — the productized $600 tier.
// Dev in the monorepo via `npm run dev:freelance`. When spun out to a client
// repo, the @shared alias is swapped for the @aagf470/ui package (see README).
// ---------------------------------------------------------------------------
export default defineConfig({
  plugins: [react()],
  root: __dirname,
  // Lightning CSS: keep both `backdrop-filter` and the `-webkit-` prefix so
  // frosted glass renders in Chromium (unprefixed) and Safari (prefixed).
  css: {
    transformer: 'lightningcss',
    lightningcss: { targets: { chrome: 87 << 16, safari: 14 << 16, firefox: 103 << 16, edge: 88 << 16 } },
  },
  build: { cssMinify: 'lightningcss' },
  resolve: { alias: { '@shared': path.resolve(__dirname, '../../shared') } },
})
