import { defineType, defineField, defineArrayMember } from 'sanity'

// ---------------------------------------------------------------------------
// Lab Entry schema
// Research projects, engineering deep-dives, collab work.
// Renders on the frontend via DynamicLabPage.jsx with DocLayout sidebar.
// ---------------------------------------------------------------------------

export const labEntryType = defineType({
  name:  'labEntry',
  title: 'Lab Entry',
  type:  'document',

  fields: [
    // ── Identity ──────────────────────────────────────────────────────────
    defineField({
      name:  'title',
      title: 'Title / codename',
      type:  'string',
      description: 'The bold display title — e.g. "DERG"',
      validation: R => R.required(),
    }),
    defineField({
      name:    'slug',
      title:   'URL slug',
      type:    'slug',
      options: { source: 'title', maxLength: 80 },
      validation: R => R.required(),
    }),
    defineField({
      name:  'eyebrow',
      title: 'Eyebrow',
      type:  'string',
      description: 'e.g. "NU AERO × Cryark"',
    }),
    defineField({
      name:  'subtitle',
      title: 'Subtitle',
      type:  'string',
      description: 'Full name below the title — e.g. "Dynamic Environment Render Generator"',
    }),
    defineField({
      name:  'abstract',
      title: 'Abstract',
      type:  'text',
      rows:  4,
      description: '2–3 sentence description for the LabHero.',
    }),
    defineField({
      name:  'collab',
      title: 'Collaboration credit',
      type:  'string',
      description: 'e.g. "Collaboration with NU AERO — Northeastern University Aerospace Club"',
    }),

    // ── Project link ──────────────────────────────────────────────────────
    defineField({
      name:  'project',
      title: 'Project',
      type:  'reference',
      to:    [{ type: 'product' }],
      description: 'Link this entry to a project — it will appear in the project\'s devlog feed on the work page.',
    }),
    defineField({
      name:  'entry_type',
      title: 'Entry type',
      type:  'string',
      options: {
        list: [
          { title: 'Devlog — project build journal', value: 'devlog' },
          { title: 'Lab entry — research / collab',  value: 'lab'    },
        ],
        layout: 'radio',
      },
      initialValue: 'devlog',
    }),

    // ── Status & Tags ─────────────────────────────────────────────────────
    defineField({
      name:  'status',
      title: 'Status',
      type:  'string',
      options: {
        list: [
          { title: 'Released',  value: 'released'  },
          { title: 'In Dev',    value: 'in_dev'    },
          { title: 'Research',  value: 'research'  },
          { title: 'Live',      value: 'live'      },
          { title: 'Collab',    value: 'collab'    },
        ],
      },
    }),
    defineField({
      name:  'tags',
      title: 'Tags (Pill components)',
      type:  'array',
      of:    [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name:  'stats',
      title: 'Stats row',
      type:  'array',
      of:    [defineArrayMember({
        type:  'object',
        name:  'stat',
        fields: [
          defineField({ name: 'value', title: 'Value', type: 'string' }),
          defineField({ name: 'label', title: 'Label', type: 'string' }),
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      })],
    }),

    // ── Doc sidebar structure ─────────────────────────────────────────────
    defineField({
      name:  'sidebar_sections',
      title: 'Sidebar navigation',
      type:  'array',
      description: 'Groups shown in the DocLayout sidebar.',
      of:    [defineArrayMember({
        type:  'object',
        name:  'sidebarGroup',
        fields: [
          defineField({ name: 'label', title: 'Group label', type: 'string' }),
          defineField({
            name:  'items',
            title: 'Nav items',
            type:  'array',
            of:    [defineArrayMember({
              type:  'object',
              name:  'navItem',
              fields: [
                defineField({ name: 'label',  title: 'Label',       type: 'string' }),
                defineField({ name: 'anchor', title: 'Section ID',  type: 'string', description: 'Matches the id="" on the section. Leave blank for external href.' }),
                defineField({ name: 'href',   title: 'External URL', type: 'string', description: 'Used when anchor is blank.' }),
              ],
              preview: { select: { title: 'label', subtitle: 'anchor' } },
            })],
          }),
        ],
        preview: { select: { title: 'label' } },
      })],
    }),

    // ── Content sections ─────────────────────────────────────────────────
    defineField({
      name:  'content_sections',
      title: 'Content sections',
      type:  'array',
      description: 'Each item becomes a <section id="..."> in the page.',
      of:    [defineArrayMember({
        type:  'object',
        name:  'contentSection',
        fields: [
          defineField({ name: 'section_id',    title: 'Section ID',    type: 'string', description: 'Must match the sidebar anchor. e.g. "overview"' }),
          defineField({ name: 'section_label', title: 'Section label', type: 'string', description: 'Displayed above the content.' }),
          defineField({
            name:  'content',
            title: 'Content',
            type:  'array',
            of: [
              defineArrayMember({ type: 'block'           }), // rich text
              defineArrayMember({ type: 'codeBlock'       }), // code snippet
              defineArrayMember({ type: 'calloutBlock'    }), // note/tip/warning/info aside
              defineArrayMember({ type: 'imageBlock'      }), // single inline image
              defineArrayMember({ type: 'designDecision'  }), // key + description
              defineArrayMember({ type: 'spacerBlock'     }), // vertical gap
            ],
          }),
        ],
        preview: { select: { title: 'section_label', subtitle: 'section_id' } },
      })],
    }),

    // ── Full-width page sections (rendered above the doc layout) ─────────
    defineField({
      name:  'sections',
      title: 'Page sections',
      type:  'array',
      description: 'Full-width blocks rendered above the sidebar doc layout — trailers, demos, asset downloads, roadmaps, etc.',
      of: [
        defineArrayMember({ type: 'sideBySideBlock'    }),
        defineArrayMember({ type: 'videoBlock'         }),
        defineArrayMember({ type: 'embeddedAppBlock'   }),
        defineArrayMember({ type: 'assetDownloadBlock' }),
        defineArrayMember({ type: 'roadmapBlock'       }),
        defineArrayMember({ type: 'changelogBlock'     }),
        defineArrayMember({ type: 'screenshotGalleryBlock' }),
        defineArrayMember({ type: 'contentCardsBlock'  }),
        defineArrayMember({ type: 'factGridBlock'      }),
        defineArrayMember({ type: 'modelViewerBlock'   }),
        defineArrayMember({ type: 'cinematicBannerBlock' }),
        defineArrayMember({ type: 'titleBlock'         }),
        defineArrayMember({ type: 'spacerBlock'        }),
      ],
    }),

    // ── Site visibility ───────────────────────────────────────────────────
    defineField({
      name:  'site_visibility',
      title: 'Visible on',
      type:  'array',
      of:    [defineArrayMember({ type: 'string' })],
      options: {
        list: [
          { title: 'Cryark.net (Lab)',      value: 'cryark'   },
          { title: 'Guillen.Studio (Devlog)', value: 'guillen'  },
        ],
        layout: 'checkbox',
      },
      initialValue: ['guillen'],
      description:  'Devlogs default to Guillen.Studio only. Check Cryark.net to also show in the Lab section.',
    }),

    // ── Publishing ────────────────────────────────────────────────────────
    defineField({
      name:         'is_draft',
      title:        'Hide from site',
      description:  'Turn OFF to make this page visible on cryark.net. Remember to also click Publish.',
      type:         'boolean',
      initialValue: true,
    }),
    defineField({
      name:  'published_at',
      title: 'Published at',
      type:  'datetime',
    }),
  ],

  preview: {
    select: { title: 'title', subtitle: 'status' },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ?? 'draft' }
    },
  },
})
