// ---------------------------------------------------------------------------
// aboutProfile — hero content, bio, education, and contact links
//
// One document per site (site field = "guillen" | "cryark").
// Skills and experience are separate document types for easier ordering.
// ---------------------------------------------------------------------------

export const aboutProfileType = {
  name:  'aboutProfile',
  title: 'About Profile',
  type:  'document',

  fields: [
    // ── Which site ────────────────────────────────────────────────────────
    {
      name:        'site',
      title:       'Site',
      type:        'string',
      description: 'One profile document per site.',
      options: {
        list: [
          { title: 'Guillen.Studio', value: 'guillen' },
          { title: 'Cryark.net',     value: 'cryark'  },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    },

    // ── Hero ─────────────────────────────────────────────────────────────
    {
      name:  'name',
      title: 'Full name',
      type:  'string',
    },
    {
      name:        'title',
      title:       'Title / roles',
      type:        'string',
      placeholder: 'Engineer · Game Developer',
    },
    {
      name:        'tagline',
      title:       'Tagline / motto',
      type:        'string',
      placeholder: 'vivere est creare',
    },
    {
      name:  'bio',
      title: 'Bio',
      type:  'text',
      rows:  5,
    },

    // ── Education ────────────────────────────────────────────────────────
    {
      name:  'education',
      title: 'Education',
      type:  'array',
      of: [{
        type:  'object',
        name:  'edu_entry',
        title: 'Entry',
        fields: [
          { name: 'degree',      title: 'Degree',       type: 'string' },
          { name: 'institution', title: 'Institution',  type: 'string' },
          { name: 'year',        title: 'Year / range', type: 'string' },
          {
            name:        'notes',
            title:       'Notes',
            type:        'string',
            description: 'Optional — e.g. relevant coursework',
          },
        ],
        preview: {
          select: { title: 'degree', subtitle: 'institution' },
        },
      }],
    },

    // ── Contact links ─────────────────────────────────────────────────────
    {
      name:  'contact_links',
      title: 'Contact links',
      type:  'array',
      of: [{
        type:  'object',
        name:  'contact_link',
        title: 'Link',
        fields: [
          {
            name:        'label',
            title:       'Label',
            type:        'string',
            placeholder: 'GitHub',
          },
          {
            name:  'href',
            title: 'URL',
            type:  'url',
            validation: Rule => Rule.uri({ allowRelative: false }),
          },
          {
            name:        'display',
            title:       'Display text',
            type:        'string',
            placeholder: 'github.com/you',
          },
        ],
        preview: {
          select: { title: 'label', subtitle: 'display' },
        },
      }],
    },
  ],

  preview: {
    select: { title: 'name', subtitle: 'site' },
  },
}
