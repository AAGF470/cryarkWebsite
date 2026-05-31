// siteLink — external platform / social link
// Replaces hardcoded URLs in SiteFooter and GuillenHomePage.
// Each link can be shown in: footer, hero, nav, about
// Icon key maps to SocialIcon.jsx registry: github, linkedin, itch, steam, patreon
// Custom logo image overrides icon key when set.

export const siteLinkType = {
  name: 'siteLink',
  title: 'Site Link',
  type: 'document',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Display name e.g. "GitHub", "LinkedIn"',
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: Rule => Rule.required(),
    },
    {
      name: 'display',
      title: 'Display text',
      type: 'string',
      description: 'Short display text shown next to icon (e.g. username, domain)',
    },
    {
      name: 'icon',
      title: 'Icon key',
      type: 'string',
      description: 'Key from SocialIcon registry: github, linkedin, itch, steam, patreon, youtube, twitter, bluesky',
      options: {
        list: [
          { title: 'GitHub',    value: 'github'   },
          { title: 'LinkedIn',  value: 'linkedin' },
          { title: 'itch.io',   value: 'itch'     },
          { title: 'Steam',     value: 'steam'    },
          { title: 'Patreon',   value: 'patreon'  },
          { title: 'YouTube',   value: 'youtube'  },
          { title: 'Twitter/X', value: 'twitter'  },
          { title: 'Bluesky',   value: 'bluesky'  },
        ],
        layout: 'dropdown',
      },
    },
    {
      name: 'logo',
      title: 'Custom logo / icon',
      type: 'image',
      description: 'Upload a custom icon — overrides the icon key above',
    },
    {
      name: 'show_in',
      title: 'Show in',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Footer',     value: 'footer' },
          { title: 'Hero',       value: 'hero'   },
          { title: 'About page', value: 'about'  },
          { title: 'Navigation', value: 'nav'    },
        ],
      },
      initialValue: ['footer'],
      description: 'Which site sections show this link',
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
    },
    {
      name: 'site_visibility',
      title: 'Visible on',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Guillen.Studio', value: 'guillen' },
          { title: 'Cryark.net',     value: 'cryark'  },
        ],
      },
      initialValue: ['guillen', 'cryark'],
    },
  ],
  orderings: [
    { title: 'Order', name: 'byOrder', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'label', subtitle: 'url' },
  },
}
