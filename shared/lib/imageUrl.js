import { createImageUrlBuilder as imageUrlBuilder } from '@sanity/image-url'
import { sanityClient }  from './sanity'

// ---------------------------------------------------------------------------
// Sanity image URL builder
// Usage: urlFor(sanity_image_asset).width(800).url()
// ---------------------------------------------------------------------------

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source) {
  return builder.image(source)
}
