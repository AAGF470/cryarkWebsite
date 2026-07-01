// ---------------------------------------------------------------------------
// @aagf470/ui — public entry.
// Re-exports the section library + generic UI primitives, and pulls in the
// base stylesheet (design tokens + reset) so the bundled `styles.css` is
// self-contained. Apps still layer their own theme.css on top.
// ---------------------------------------------------------------------------

import './styles/base.css'

// Section library (client-facing building blocks)
export * from './sections'

// Generic UI primitives
export { default as Button }  from './components/ui/Button'
export { default as Card }    from './components/ui/Card'
export { default as Pill }    from './components/ui/Pill'
export { default as SiteNav } from './components/ui/SiteNav'
// Note: SiteFooter is intentionally excluded — it's coupled to the cryark
// Sanity CMS (@shared/lib/cms). Sites build their own footer.
