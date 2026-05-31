import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// Guillen.Studio Vite config
//
// Run from the monorepo root:
//   npm run dev:guillen
//
// @shared alias resolves to ../../shared (the monorepo's shared library).
// ---------------------------------------------------------------------------

export default defineConfig({
  plugins: [react()],

  root: __dirname,

  // .env lives at the monorepo root, two levels up from apps/guillen/
  envDir: path.resolve(__dirname, '../../'),

  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../shared'),
    },
  },
})
