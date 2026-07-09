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
export { default as AuroraBackground } from './components/ui/AuroraBackground'

// Studio component library (guillen.studio building blocks)
export { default as ArchitectureBlock }  from './components/ui/ArchitectureBlock'
export { default as AssetGrid }          from './components/ui/AssetGrid'
export { default as BackgroundCanvas }   from './components/ui/BackgroundCanvas'
export { default as CalloutBlock }       from './components/ui/CalloutBlock'
export { default as ChangelogBlock }     from './components/ui/ChangelogBlock'
export { default as CinematicBanner }    from './components/ui/CinematicBanner'
export { default as CinematicHero }      from './components/ui/CinematicHero'
export { default as CodeBlock }          from './components/ui/CodeBlock'
export { default as ContentCards }       from './components/ui/ContentCards'
export { default as DocLayout }          from './components/ui/DocLayout'
export { default as DocSidebar }         from './components/ui/DocSidebar'
export { default as EmbeddedApp }        from './components/ui/EmbeddedApp'
export { default as FactGrid }           from './components/ui/FactGrid'
export { default as FeatureSpotlight }   from './components/ui/FeatureSpotlight'
export { default as HierarchyBlock }     from './components/ui/HierarchyBlock'
export { default as ImageBlock }         from './components/ui/ImageBlock'
export { default as LabHero }            from './components/ui/LabHero'
export { default as PageLoader }         from './components/ui/PageLoader'
export { default as PlatformBadge }      from './components/ui/PlatformBadge'
export { default as PricingCTA }         from './components/ui/PricingCTA'
export { default as ProductInfoBar }     from './components/ui/ProductInfoBar'
export { default as RawDiagramBlock }    from './components/ui/RawDiagramBlock'
export { default as RoadmapBlock }       from './components/ui/RoadmapBlock'
export { default as ScreenshotGallery }  from './components/ui/ScreenshotGallery'
export { default as SideBySide }         from './components/ui/SideBySide'
export { default as Spacer }             from './components/ui/Spacer'
export { default as SystemRequirements } from './components/ui/SystemRequirements'
export { default as TitleBlock }         from './components/ui/TitleBlock'
export { default as VideoPlayer }        from './components/ui/VideoPlayer'

// SocialIcon has no default export — it's an icon registry (SOCIAL_ICONS +
// individual icon components).
export * from './components/ui/SocialIcon'

// Intentionally excluded (do not add to the barrel):
// - SiteFooter, WorkCard        → coupled to the cryark Sanity CMS (@shared/lib/cms)
// - RelatedProducts             → coupled to ../../lib/cms + lib/queries
// - DiagramBlock                → lazy-imports `mermaid` (heavy dep; future './diagram' subpath export)
// - ModelViewer                 → imports `@google/model-viewer` (heavy dep; future subpath export)
// Sites build their own footer.

// Style recipes — named art directions (recipe + client accent → full theme).
export { RECIPES, recipeVars, applyRecipe, loadRecipeFont } from './lib/recipes'
