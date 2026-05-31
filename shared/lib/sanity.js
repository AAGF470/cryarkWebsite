import { createClient } from '@sanity/client'

// ---------------------------------------------------------------------------
// Sanity CDN client for cryark.net frontend
//
// Required env vars (set in .env — see .env.example at project root):
//   VITE_SANITY_PROJECT_ID   — from sanity.io/manage
//   VITE_SANITY_DATASET      — usually "production"
// ---------------------------------------------------------------------------

export const sanityClient = createClient({
  projectId:  import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset:    import.meta.env.VITE_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn:     true,
})
