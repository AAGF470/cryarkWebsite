import { useParams } from 'react-router-dom'
import SanityPage from './SanityPage'

// ---------------------------------------------------------------------------
// PageRouter
// Drop-in catch-all route that renders Sanity-driven pages.
// Add this as the last route in your React Router config so custom pages
// are matched first, and everything else falls through to Sanity.
//
// Usage:
//   <Route path="/:slug" element={<PageRouter fallback={<NotFound />} />} />
//
// The slug is read from the :slug param and matched against clientPage
// documents in Sanity by slug.current.
// ---------------------------------------------------------------------------

export default function PageRouter({ fallback = null }) {
  const { slug } = useParams()
  return <SanityPage slug={slug} fallback={fallback} />
}
