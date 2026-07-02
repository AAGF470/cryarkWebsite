import { useEffect, useState } from 'react'
import {
  HeroSection, FeatureGrid, Steps, ImageText, Testimonials, Gallery, Faq,
  PricingPlans, ServiceList, HoursLocation, CtaBanner, ContactSection,
} from '@aagf470/ui'

// ---------------------------------------------------------------------------
// PayloadPage — renders a CMS `pages` doc's block layout with @aagf470/ui.
// The site fetches a page by slug and maps each block → its section component.
// Editors control the blocks + their content; the components own the design.
//
// Drop this into the site (or eventually @aagf470/ui/payload) and set
// VITE_CMS_URL=https://cms.guillensolutions.com.
// ---------------------------------------------------------------------------
const MAP = {
  hero: HeroSection, featureGrid: FeatureGrid, steps: Steps, imageText: ImageText,
  testimonials: Testimonials, gallery: Gallery, faq: Faq, pricingPlans: PricingPlans,
  serviceList: ServiceList, hoursLocation: HoursLocation, ctaBanner: CtaBanner,
  contactSection: ContactSection,
}

const API = import.meta.env.VITE_CMS_URL

// Normalize Payload's stored shape → the plain props the components expect.
function adapt(block) {
  const o = { ...block }
  if (o.columns != null) o.columns = Number(o.columns)                 // select string → number
  if (o.image?.url) o.image = o.image.url                              // upload → src
  if (Array.isArray(o.images))                                         // gallery uploads → {src,alt,caption}
    o.images = o.images.map(i => ({ src: i.image?.url ?? i.image, alt: i.alt || '', caption: i.caption || '' }))
  if (Array.isArray(o.plans))                                          // features [{text}] → [string]
    o.plans = o.plans.map(p => ({ ...p, features: (p.features || []).map(f => f?.text ?? f) }))
  return o
}

export default function PayloadPage({ slug, fallback = null }) {
  const [layout, setLayout] = useState(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetch(`${API}/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&depth=2`)
      .then(r => r.json())
      .then(d => {
        const doc = d?.docs?.[0]
        doc?.layout ? setLayout(doc.layout) : setMissing(true)
      })
      .catch(() => setMissing(true))
  }, [slug])

  if (missing) return fallback
  if (!layout) return null

  return (
    <>
      {layout.map(block => {
        const C = MAP[block.blockType]
        return C ? <C key={block.id} {...adapt(block)} /> : null
      })}
    </>
  )
}
