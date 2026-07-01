import { useEffect, useState } from 'react'
import { createClient } from '@sanity/client'
import HeroSection    from '../sections/HeroSection'
import FeatureGrid    from '../sections/FeatureGrid'
import Steps          from '../sections/Steps'
import ImageText      from '../sections/ImageText'
import Testimonials   from '../sections/Testimonials'
import CtaBanner      from '../sections/CtaBanner'
import ContactSection from '../sections/ContactSection'
import PricingPlans   from '../sections/PricingPlans'
import ServiceList    from '../sections/ServiceList'
import HoursLocation  from '../sections/HoursLocation'
import Gallery        from '../sections/Gallery'
import Faq            from '../sections/Faq'

// ---------------------------------------------------------------------------
// SanityPage
// Fetches a `clientPage` document by slug and renders its sections[].
// Each app must set VITE_SANITY_PROJECT_ID (and optionally VITE_SANITY_DATASET)
// in its .env file.
//
// Props:
//   slug      string     — matches clientPage.slug.current in Sanity
//   fallback  ReactNode  — rendered when the slug has no matching document
// ---------------------------------------------------------------------------

const SECTION_MAP = {
  heroSection:         HeroSection,
  featureGridSection:  FeatureGrid,
  stepsSection:        Steps,
  imageTextSection:    ImageText,
  testimonialsSection: Testimonials,
  ctaBannerSection:    CtaBanner,
  contactSection:      ContactSection,
  pricingPlansSection: PricingPlans,
  serviceListSection:  ServiceList,
  hoursLocationSection: HoursLocation,
  gallerySection:      Gallery,
  faqSection:          Faq,
}

// Sanity stores images as asset references. Flatten the dereferenced
// `{ asset: { url } }` shape down to the plain `src`/`image` strings that the
// section components expect. Everything else passes through untouched.
function adaptSection({ _type, _key, ...rest }) {
  // ImageText: single image field → string
  if (rest.image?.asset?.url) {
    rest.image = rest.image.asset.url
  }
  // Gallery: images[] of { image, alt, caption } → { src, alt, caption }
  if (Array.isArray(rest.images)) {
    rest.images = rest.images.map(img => ({
      src:     img?.image?.asset?.url ?? img?.asset?.url ?? null,
      alt:     img?.alt ?? '',
      caption: img?.caption ?? '',
    }))
  }
  return rest
}

// Spread every scalar field automatically (...) and only special-case the
// image dereferencing. New section fields work without editing this query.
const PAGE_QUERY = /* groq */ `
  *[_type == "clientPage" && slug.current == $slug][0]{
    sections[] {
      ...,
      image { ..., asset -> { url } },
      images[] {
        ...,
        image { ..., asset -> { url } }
      }
    }
  }
`

function makeClient() {
  return createClient({
    projectId:  import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset:    import.meta.env.VITE_SANITY_DATASET ?? 'production',
    apiVersion: '2024-01-01',
    useCdn:     true,
  })
}

export default function SanityPage({ slug, fallback = null }) {
  const [sections, setSections] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    const client = makeClient()
    client
      .fetch(PAGE_QUERY, { slug })
      .then(doc => {
        if (doc?.sections) setSections(doc.sections)
        else setNotFound(true)
      })
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) return fallback
  if (!sections) return null

  return (
    <>
      {sections.map(section => {
        const Component = SECTION_MAP[section._type]
        if (!Component) return null
        return <Component key={section._key} {...adaptSection(section)} />
      })}
    </>
  )
}
