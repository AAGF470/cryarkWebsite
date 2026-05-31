import { useState, useEffect } from 'react'
import { sanityClient } from '../lib/sanity'

// ---------------------------------------------------------------------------
// useSanityQuery — thin data-fetching hook for Sanity GROQ queries.
//
// Usage:
//   const { data, loading, error } = useSanityQuery(SOME_QUERY, { slug: "derg" })
//
// Re-fetches automatically when query or params change.
// ---------------------------------------------------------------------------

export function useSanityQuery(query, params = {}) {
  const [data,    set_data]    = useState(null)
  const [loading, set_loading] = useState(true)
  const [error,   set_error]   = useState(null)

  // Stringify params so useEffect can compare by value, not reference
  const params_key = JSON.stringify(params)

  useEffect(() => {
    let cancelled = false
    set_loading(true)
    set_error(null)

    sanityClient
      .fetch(query, params)
      .then(result => {
        if (!cancelled) {
          set_data(result)
          set_loading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.error('[useSanityQuery]', err)
          set_error(err)
          set_loading(false)
        }
      })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, params_key])

  return { data, loading, error }
}
