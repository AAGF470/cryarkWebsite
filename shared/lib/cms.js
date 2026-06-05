// ---------------------------------------------------------------------------
// cms.js — CMS abstraction layer
//
// The rest of the app imports from here, never directly from sanity.js.
// To migrate to a different CMS, update this file and the files in src/lib/
// that it wraps. Components, pages, and hooks stay completely unchanged.
//
// Current backend: Sanity v3
// ---------------------------------------------------------------------------

export { sanityClient as cmsClient }   from './sanity'
export { urlFor as cmsImageUrl }       from './imageUrl'
export { useSanityQuery as useCmsQuery } from '../hooks/useSanityQuery'

export {
  PRODUCT_BY_SLUG,
  LAB_ENTRY_BY_SLUG,
  // Cryark
  ALL_PRODUCTS,
  ALL_LAB_ENTRIES,
  PRODUCTS_BY_TYPE,
  RELATED_PRODUCTS,
  // Guillen
  ALL_PRODUCTS_WORK,
  ALL_DEVLOGS,
  // Project-linked devlogs (Guillen)
  LATEST_DEVLOG_BY_PROJECT,
  DEVLOGS_BY_PROJECT,
  // Docs
  DOC_SPACE_NAV,
  DOC_PAGE_BY_SLUG,
  ALL_DOC_SPACES,
  // About page (shared — pass { site: "guillen" | "cryark" } as params)
  ABOUT_PROFILE,
  ALL_SKILLS,
  ALL_EXPERIENCE,
  ALL_ABOUT_PROJECTS,
  // Site links — social / external links per site (pass { site: ... } as params)
  ALL_SITE_LINKS,
} from './queries'
