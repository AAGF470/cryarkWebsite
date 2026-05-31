// ---------------------------------------------------------------------------
// skill — an individual skill / technology on the About page
//
// Proficiency levels describe how deeply you've worked with the tool.
// The description field overrides the default proficiency label in the
// tooltip shown on hover — write it in your own voice.
// ---------------------------------------------------------------------------

export const skillType = {
  name:  'skill',
  title: 'Skill',
  type:  'document',

  fields: [
    {
      name:  'name',
      title: 'Skill name',
      type:  'string',
      validation: Rule => Rule.required(),
    },
    {
      name:  'category',
      title: 'Category',
      type:  'string',
      options: {
        list: [
          { title: 'Languages', value: 'Languages' },
          { title: 'Engines',   value: 'Engines'   },
          { title: '3D / Art',  value: '3D / Art'  },
          { title: 'Web',       value: 'Web'        },
          { title: 'Tools',     value: 'Tools'      },
          { title: 'Other',     value: 'Other'      },
        ],
        layout: 'dropdown',
      },
      validation: Rule => Rule.required(),
    },
    {
      name:  'proficiency',
      title: 'Proficiency level',
      type:  'string',
      options: {
        // Scale = depth of real-world use, not self-assessed skill level.
        list: [
          {
            title: '◦ Exploring — newly picked up, building familiarity through experiments',
            value: 'exploring',
          },
          {
            title: '◦ Integrating — actively using in real projects, deepening experience through use',
            value: 'integrating',
          },
          {
            title: '◦ Established — a reliable part of my workflow across multiple shipped projects',
            value: 'proficient',
          },
          {
            title: '◦ Core tooling — central to how I build, deeply woven into real deliverables',
            value: 'expert',
          },
        ],
        layout: 'radio',
      },
      initialValue: 'proficient',
    },
    {
      name:        'description',
      title:       'Tooltip description',
      type:        'text',
      rows:        2,
      description: 'Shown on hover — describe your experience in your own words. Overrides the default proficiency label.',
    },
    {
      name:  'order',
      title: 'Order (within category)',
      type:  'number',
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
      title: 'Category then order',
      name:  'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order',    direction: 'asc' },
      ],
    },
  ],

  preview: {
    select: { title: 'name', subtitle: 'category' },
  },
}
