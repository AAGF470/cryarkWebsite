import { useEffect, useState } from 'react'
import {
  HeroSection, FeatureGrid, Gallery, Faq, CtaBanner,
} from '@aagf470/ui'

// ---------------------------------------------------------------------------
// PayloadPage — renders a Payload `pages` doc's block layout using @aagf470/ui.
// The Payload equivalent of SanityPage: same components, different data source.
// Point the guillen.studio site at this to graduate it from static to CMS.
//
// blockType (Payload block slug) → component. Extend as blocks are added.
// ---------------------------------------------------------------------------
const MAP = {
  hero:        HeroSection,
  featureGrid: FeatureGrid,
  gallery:     Gallery,
  faq:         Faq,
  ctaBanner:   CtaBanner,
}

const API = import.meta.env.VITE_CMS_URL // e.g. https://cms.guillen.studio

// Flatten Payload upload objects → the plain src strings the sections expect.
function adapt(block) {
  const b = { ...block }
  if (Array.isArray(b.images)) {
    b.images = b.images.map(i => ({ src: i.image?.url ?? i.image, alt: i.image?.alt ?? '', caption: i.caption }))
  }
  return b
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
