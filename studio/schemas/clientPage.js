import { defineType, defineField } from 'sanity'

// ---------------------------------------------------------------------------
// clientPage — page builder document type
//
// Each document represents one page on a client site.
// The `sections[]` array is built using the section object types defined
// in pageSections.js. The studio renders them as a drag-and-drop page builder.
//
// GROQ slug lookup:
//   *[_type == "clientPage" && slug.current == $slug][0]
// ---------------------------------------------------------------------------

export const clientPageType = defineType({
  name:  'clientPage',
  title: 'Page',
  type:  'document',

  fields: [
    defineField({
      name:  'title',
      title: 'Page title',
      type:  'string',
      validation: R => R.required(),
    }),

    defineField({
      name:  'slug',
      title: 'URL path',
      type:  'slug',
      description: 'e.g. "about" → /about · Home page → "home"',
      options: { source: 'title', maxLength: 96 },
      validation: R => R.required(),
    }),

    defineField({
      name:        'site',
      title:       'Site',
      type:        'string',
      description: 'Which client site this page belongs to.',
    }),

    defineField({
      name:  'sections',
      title: 'Sections',
      type:  'array',
      of: [
        { type: 'heroSection' },
        { type: 'featureGridSection' },
        { type: 'stepsSection' },
        { type: 'imageTextSection' },
        { type: 'pricingPlansSection' },
        { type: 'serviceListSection' },
        { type: 'hoursLocationSection' },
        { type: 'gallerySection' },
        { type: 'testimonialsSection' },
        { type: 'faqSection' },
        { type: 'ctaBannerSection' },
        { type: 'contactSection' },
      ],
    }),
  ],

  preview: {
    select: { title: 'title', site: 'site', slug: 'slug.current' },
    prepare({ title, site, slug }) {
      return {
        title:    title ?? 'Untitled page',
        subtitle: [site, slug ? `/${slug}` : ''].filter(Boolean).join(' · '),
      }
    },
  },
})
