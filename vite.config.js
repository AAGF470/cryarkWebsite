import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// Monorepo root Vite config — serves the cryark app by default.
//
//   npm run dev           → cryark.net (apps/cryark)
//   npm run dev:guillen   → guillen.studio (apps/guillen)
//   npm run build         → builds cryark app to apps/cryark/dist/
//
// @shared alias resolves to ./shared/ for both apps.
// ---------------------------------------------------------------------------

export default defineConfig({
  plugins: [react()],

  // Point Vite's project root at the cryark app directory.
  // Vite will serve apps/cryark/index.html as the entry point.
  root: path.resolve(__dirname, 'apps/cryark'),

  // .env files live at the monorepo root, not inside apps/cryark.
  // Without this, VITE_SANITY_* vars would be undefined and Sanity throws.
  envDir: __dirname,

  // Build output goes inside the app directory.
  build: {
    outDir: path.resolve(__dirname, 'apps/cryark/dist'),
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      // @shared → the shared component library at monorepo root
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
})
