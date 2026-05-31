// ---------------------------------------------------------------------------
// aboutProject — a project entry on the About page
//
// Each card has two states:
//   Glance  — name, status, stack chips, description, "my role", thumbnail/media
//   Expanded — deep-dive drawer: text paragraphs, images, code snippets
//
// order: lower numbers appear first
// project: optional reference to a product doc → surfaces "Full project" link
// ---------------------------------------------------------------------------

export const aboutProjectType = {
  name:  'aboutProject',
  title: 'About — Project',
  type:  'document',

  fields: [

    // ── At-a-glance ────────────────────────────────────────────────────────

    {
      name:       'title',
      title:      'Project name',
      type:       'string',
      validation: Rule => Rule.required(),
    },
    {
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
        layout: 'dropdown',
      },
    },
    {
      name:  'stack',
      title: 'Tech stack',
      type:  'array',
      of:    [{ type: 'string' }],
    },
    {
      name:        'description',
      title:       'What it does',
      type:        'text',
      rows:        2,
      description: 'One or two sentences — shown at a glance.',
    },
    {
      name:        'role',
      title:       'My contribution',
      type:        'text',
      rows:        2,
      description: 'What you specifically built or owned on this project.',
    },
    {
      name:    'thumbnail',
      title:   'Thumbnail / GIF',
      type:    'image',
      options: { hotspot: true },
    },
    {
      name:        'video_url',
      title:       'Video URL',
      type:        'url',
      description: 'Optional — takes priority over thumbnail. YouTube/Vimeo embed or direct .mp4 URL.',
    },

    // ── Expanded content (deep-dive drawer) ─────────────────────────────────

    {
      name:        'expanded_content',
      title:       'Expanded content',
      type:        'array',
      description: 'Shown when the reader clicks "More details". Add text, images, and code freely.',
      of: [
        // ── Text paragraph ─────────────────────────────────────────────────
        {
          type:  'object',
          name:  'proj_text',
          title: 'Text',
          fields: [
            { name: 'text', type: 'text', rows: 5 },
          ],
          preview: {
            select: { title: 'text' },
            prepare: ({ title }) => ({ title: title?.slice(0, 72) + (title?.length > 72 ? '…' : '') }),
          },
        },
        // ── Image ──────────────────────────────────────────────────────────
        {
          type:  'object',
          name:  'proj_image',
          title: 'Image',
          fields: [
            {
              name:    'image',
              type:    'image',
              options: { hotspot: true },
            },
            {
              name:  'caption',
              type:  'string',
              title: 'Caption (optional)',
            },
            {
              name:         'full_width',
              title:        'Full width',
              type:         'boolean',
              initialValue: false,
              description:  'Span the full drawer width instead of constrained max-width.',
            },
          ],
          preview: {
            select: { title: 'caption', media: 'image' },
            prepare: ({ title, media }) => ({ title: title || 'Image', media }),
          },
        },
        // ── Code snippet ────────────────────────────────────────────────────
        {
          type:  'object',
          name:  'proj_code',
          title: 'Code snippet',
          fields: [
            {
              name:    'language',
              title:   'Language',
              type:    'string',
              options: {
                list: [
                  { title: 'C#',         value: 'csharp'     },
                  { title: 'C++',        value: 'cpp'        },
                  { title: 'Python',     value: 'python'     },
                  { title: 'JavaScript', value: 'javascript' },
                  { title: 'TypeScript', value: 'typescript' },
                  { title: 'GDScript',   value: 'gdscript'   },
                  { title: 'GLSL',       value: 'glsl'       },
                  { title: 'Bash',       value: 'bash'       },
                ],
                layout: 'dropdown',
              },
              initialValue: 'csharp',
            },
            { name: 'label', title: 'Label (optional)', type: 'string' },
            { name: 'code',  title: 'Code',             type: 'text', rows: 12 },
          ],
          preview: {
            select: { title: 'label', subtitle: 'language' },
            prepare: ({ title, subtitle }) => ({ title: title || 'Code', subtitle }),
          },
        },
      ],
    },

    // ── Metadata ─────────────────────────────────────────────────────────────

    {
      name:        'project',
      title:       'Linked project page',
      type:        'reference',
      to:          [{ type: 'product' }],
      description: 'Optional — shows a "Full project" link pointing to /work/:slug.',
    },
    {
      name:        'order',
      title:       'Sort order',
      type:        'number',
      description: 'Lower numbers appear first.',
    },
    {
      name:  'site_visibility',
      title: 'Visible on',
      type:  'array',
      of:    [{ type: 'string' }],
      options: {
        list: [
          { title: 'Guillen.Studio', value: 'guillen' },
          { title: 'Cryark.net',     value: 'cryark'  },
        ],
      },
      initialValue: ['guillen'],
    },
  ],

  orderings: [
    {
      title: 'Sort order',
      name:  'orderAsc',
      by:    [{ field: 'order', direction: 'asc' }],
    },
  ],

  preview: {
    select: { title: 'title', subtitle: 'status', media: 'thumbnail' },
  },
}
