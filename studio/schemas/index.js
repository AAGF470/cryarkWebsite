import { productType }              from './product'
import { labEntryType }             from './labEntry'
import { docSpaceType }             from './docSpace'
import { docPageType }              from './docPage'
import { skillType }                from './skill'
import { experienceType }           from './experience'
import { aboutProfileType }         from './aboutProfile'
import { aboutProjectType }         from './aboutProject'
import { siteLinkType }             from './siteLink'
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
]
