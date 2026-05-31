// ---------------------------------------------------------------------------
// experience — a role, project, or position entry on the About timeline
//
// demo_url: optional iframe src shown when the accordion is expanded
// project:  reference to a product document — surfaces a "View project" link
// order:    lower numbers appear first in the timeline
// ---------------------------------------------------------------------------

export const experienceType = {
  name:  'experience',
  title: 'Experience',
  type:  'document',

  fields: [
    {
      name:  'title',
      title: 'Role or project title',
      type:  'string',
      validation: Rule => Rule.required(),
    },
    {
      name:  'sub',
      title: 'Subtitle (company or context)',
      type:  'string',
    },
    {
      name:        'date_range',
      title:       'Date range',
      type:        'string',
      placeholder: '2023 – Present',
    },
    {
      name:  'description',
      title: 'Description',
      type:  'text',
      rows:  5,
    },
    {
      name:  'tags',
      title: 'Tech / skill tags',
      type:  'array',
      of:    [{ type: 'string' }],
    },
    {
      name:        'demo_url',
      title:       'Demo URL',
      type:        'url',
      description: 'Optional — loaded in an iframe inside the expanded accordion.',
    },
    {
      name:  'project',
      title: 'Linked project page',
      type:  'reference',
      to:    [{ type: 'product' }],
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
    select: { title: 'title', subtitle: 'sub' },
  },
}
