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

  // Lightning CSS so `backdrop-filter` keeps a `-webkit-` prefix for Safari
  // AND the unprefixed property Chromium needs (esbuild drops one → frosted
  // glass breaks in Chromium on the deployed site).
  css: {
    transformer: 'lightningcss',
    lightningcss: { targets: { chrome: 87 << 16, safari: 14 << 16, firefox: 103 << 16, edge: 88 << 16 } },
  },

  build: {
    cssMinify: 'lightningcss',
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../shared'),
    },
  },
})
