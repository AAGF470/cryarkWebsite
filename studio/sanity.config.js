import { defineConfig }  from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool }    from '@sanity/vision'
import { schemaTypes }   from './schemas/index'

// ---------------------------------------------------------------------------
// Sanity Studio v3 configuration for cryark.net
// Project ID is intentionally hardcoded (it's public, not a secret).
// ---------------------------------------------------------------------------

export default defineConfig({
  name:    'cryark-studio',
  title:   'Cryark Studio',

  projectId: '6ve9y0jl',
  dataset:   'production',

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
