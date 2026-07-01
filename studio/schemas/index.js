import { productType }              from './product'
import { labEntryType }             from './labEntry'
import { docSpaceType }             from './docSpace'
import { docPageType }              from './docPage'
import { skillType }                from './skill'
import { experienceType }           from './experience'
import { aboutProfileType }         from './aboutProfile'
import { aboutProjectType }         from './aboutProject'
import { siteLinkType }             from './siteLink'
import { pageConfigType }           from './pageConfig'
import { clientPageType }           from './clientPage'
import {
  ctaItemType,
  heroSectionType,
  featureGridSectionType,
  stepsSectionType,
  imageTextSectionType,
  testimonialsSectionType,
  ctaBannerSectionType,
  contactSectionType,
  pricingPlansSectionType,
  serviceListSectionType,
  hoursLocationSectionType,
  gallerySectionType,
  faqSectionType,
} from './pageSections'
import {
  codeBlockType,
  designDecisionType,
  calloutBlockType,
  imageBlockType,
  sideBySideBlockType,
  featureSpotlightBlockType,
  textSectionType,
  factGridBlockType,
  spacerBlockType,
  screenshotGalleryBlockType,
  cinematicBannerBlockType,
  contentCardsBlockType,
  modelViewerBlockType,
  videoBlockType,
  embeddedAppBlockType,
  assetDownloadBlockType,
  pricingCtaBlockType,
  roadmapBlockType,
  systemRequirementsBlockType,
  changelogBlockType,
  titleBlockType,
  diagramBlockType,
  rawDiagramBlockType,
  architectureBlockType,
  hierarchyBlockType,
} from './blockTypes'

// Register every schema type that the studio needs to know about.
// Document types appear in the navigation; object types are only embedded.
export const schemaTypes = [
  // ── Document types (shown in nav) ────────────────────────────────────────
  productType,
  labEntryType,
  docSpaceType,
  docPageType,
  aboutProfileType,
  skillType,
  experienceType,
  aboutProjectType,
  siteLinkType,
  pageConfigType,
  clientPageType,

  // ── Page builder section types ────────────────────────────────────────────
  ctaItemType,
  heroSectionType,
  featureGridSectionType,
  stepsSectionType,
  imageTextSectionType,
  testimonialsSectionType,
  ctaBannerSectionType,
  contactSectionType,
  pricingPlansSectionType,
  serviceListSectionType,
  hoursLocationSectionType,
  gallerySectionType,
  faqSectionType,

  // ── Shared object / block types ───────────────────────────────────────────
  codeBlockType,
  designDecisionType,
  calloutBlockType,
  imageBlockType,
  sideBySideBlockType,
  featureSpotlightBlockType,
  textSectionType,
  factGridBlockType,
  spacerBlockType,
  screenshotGalleryBlockType,
  cinematicBannerBlockType,
  contentCardsBlockType,
  modelViewerBlockType,
  videoBlockType,
  embeddedAppBlockType,
  assetDownloadBlockType,
  pricingCtaBlockType,
  roadmapBlockType,
  systemRequirementsBlockType,
  changelogBlockType,
  titleBlockType,
  diagramBlockType,
  rawDiagramBlockType,
  architectureBlockType,
  hierarchyBlockType,
]
