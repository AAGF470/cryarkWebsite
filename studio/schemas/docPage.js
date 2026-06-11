import { defineType, defineField, defineArrayMember } from 'sanity'

// ---------------------------------------------------------------------------
// Doc Page schema
// A single page inside a Doc Space.
//
// Pages nest via `parent` reference:
//   → Top-level pages:  parent = null
//   → Nested pages:     parent = reference to another docPage
//
// The `order` field controls sidebar sort order within each level.
// ---------------------------------------------------------------------------

export const docPageType = defineType({
  name:  'docPage',
  title: 'Doc Page',
  type:  'document',

  fields: [
    // ── Identity ──────────────────────────────────────────────────────────
    defineField({
      name:  'title',
      title: 'Title',
      type:  'string',
      description: 'Shown in the sidebar and as the page <h1>.',
      validation: R => R.required(),
    }),
    defineField({
      name:    'slug',
      title:   'URL slug',
      type:    'slug',
      options: { source: 'title', maxLength: 80 },
      description: 'e.g. "getting-started" → /docs/fleetkit/getting-started',
      validation: R => R.required(),
    }),

    // ── Space + hierarchy ─────────────────────────────────────────────────
    defineField({
      name:  'space',
      title: 'Doc Space',
      type:  'reference',
      to:    [{ type: 'docSpace' }],
      description: 'Which documentation set this page belongs to.',
      validation: R => R.required(),
    }),
    defineField({
      name:  'parent',
      title: 'Parent page',
      type:  'reference',
      to:    [{ type: 'docPage' }],
      description: 'Leave blank for top-level pages. Set to nest under another page.',
    }),
    defineField({
      name:        'order',
      title:       'Sidebar order',
      type:        'number',
      description: 'Lower numbers appear first. Pages with the same parent are sorted by this.',
      initialValue: 0,
    }),

    // ── Content ───────────────────────────────────────────────────────────
    defineField({
      name:  'content_sections',
      title: 'Content sections',
      type:  'array',
      description: 'Each section becomes an anchor in the on-page TOC. Give every section a unique ID.',
      of: [defineArrayMember({
        type:  'object',
        name:  'docSection',
        fields: [
          defineField({
            name:        'section_id',
            title:       'Section ID (anchor)',
            type:        'string',
            description: 'Lowercase, no spaces — e.g. "installation". Used for #anchor links.',
          }),
          defineField({
            name:        'section_label',
            title:       'Section heading',
            type:        'string',
            description: 'Shown as a heading in the page and listed in the TOC.',
          }),
          defineField({
            name:  'content',
            title: 'Content',
            type:  'array',
            of: [
              defineArrayMember({ type: 'block'        }), // rich text
              defineArrayMember({ type: 'codeBlock'    }), // code snippet
              defineArrayMember({ type: 'calloutBlock' }), // note / tip / warning / info
              defineArrayMember({ type: 'imageBlock'   }), // inline image with caption
              defineArrayMember({ type: 'diagramBlock' }), // mermaid flow diagram
              defineArrayMember({ type: 'spacerBlock'  }), // vertical gap
            ],
          }),
        ],
        preview: {
          select: { title: 'section_label', subtitle: 'section_id' },
          prepare({ title, subtitle }) {
            return { title: title ?? '(untitled section)', subtitle: subtitle ?? '' }
          },
        },
      })],
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
    select: { title: 'title', space_title: 'space.title', subtitle: 'parent.title' },
    prepare({ title, space_title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `↳ ${subtitle}  ·  ${space_title ?? ''}` : (space_title ?? 'doc page'),
      }
    },
  },
})
