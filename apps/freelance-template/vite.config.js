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
  resolve: { alias: { '@shared': path.resolve(__dirname, '../../shared') } },
})
