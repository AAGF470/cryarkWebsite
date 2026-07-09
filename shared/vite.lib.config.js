import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// @aagf470/ui — library build (Vite lib mode).
// Emits ESM bundles + a single styles.css to dist/, with React / Router /
// Sanity left as peer externals. Run from repo root:
//   npm run build:ui
// ---------------------------------------------------------------------------

export default defineConfig({
  plugins: [react()],
  // Minify CSS with Lightning CSS so vendor prefixes are added correctly from
  // the target list. Source writes only the standard `backdrop-filter`; this
  // adds `-webkit-` for older Safari. (esbuild's default minifier collapsed
  // hand-written prefix pairs and kept only `-webkit-`, which Chromium ignores
  // → frosted glass rendered only in Safari on built sites.)
  css: {
    transformer: 'lightningcss',
    lightningcss: { targets: { chrome: 87 << 16, safari: 14 << 16, firefox: 103 << 16, edge: 88 << 16 } },
  },
  build: {
    cssMinify: 'lightningcss',
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    cssCodeSplit: false, // one combined styles.css
    lib: {
      entry: {
        index: path.resolve(__dirname, 'index.js'),   // @aagf470/ui
        cms:   path.resolve(__dirname, 'page/index.js'), // @aagf470/ui/cms
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react', 'react-dom', 'react/jsx-runtime',
        'react-router-dom',
        '@sanity/client', '@sanity/image-url',
      ],
      output: {
        assetFileNames: 'styles[extname]',
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    },
  },
})
