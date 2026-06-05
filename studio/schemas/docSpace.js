import { defineType, defineField, defineArrayMember } from 'sanity'

// ---------------------------------------------------------------------------
// Doc Space schema
// A single documentation collection tied to one product.
// e.g. "FleetKit Docs", "DERG Docs"
//
// Pages live in separate docPage documents that reference back to a docSpace.
// URL pattern: /docs/:space_slug/:page_slug
// ---------------------------------------------------------------------------

export const docSpaceType = defineType({
  name:  'docSpace',
  title: 'Doc Space',
  type:  'document',

  fields: [
    // ── Identity ──────────────────────────────────────────────────────────
    defineField({
      name:  'title',
      title: 'Title',
      type:  'string',
      description: 'e.g. "FleetKit Docs" — shown at the top of the sidebar.',
      validation: R => R.required(),
    }),
    defineField({
      name:    'slug',
      title:   'URL slug',
      type:    'slug',
      options: { source: 'title', maxLength: 60 },
      description: 'Used as the /docs/:space_slug prefix. e.g. "fleetkit"',
      validation: R => R.required(),
    }),
    defineField({
      name:  'description',
      title: 'Short description',
      type:  'text',
      rows:  2,
      description: 'Shown on the /docs index listing.',
    }),

    // ── Product link ──────────────────────────────────────────────────────
    defineField({
      name:  'product',
      title: 'Product',
      type:  'reference',
      to:    [{ type: 'product' }],
      description: 'Link this doc space to a product — lets the work page link to the docs.',
    }),

    // ── Site visibility ───────────────────────────────────────────────────
    defineField({
      name:  'site_visibility',
      title: 'Visible on',
      type:  'array',
      of:    [defineArrayMember({ type: 'string' })],
      options: {
        list: [
          { title: 'Cryark.net',     value: 'cryark'  },
          { title: 'Guillen.Studio', value: 'guillen' },
        ],
        layout: 'checkbox',
      },
      initialValue: ['guillen'],
    }),

    // ── Publishing ────────────────────────────────────────────────────────
    defineField({
      name:         'is_draft',
      title:        'Hide from site',
      type:         'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    select: { title: 'title', subtitle: 'description' },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ?? 'doc space' }
    },
  },
})
