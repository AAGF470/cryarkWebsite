import { defineType, defineField, defineArrayMember } from 'sanity'

// ---------------------------------------------------------------------------
// Product schema
// Covers games, developer tools, and asset packs.
// Renders on the frontend via DynamicProductPage.jsx
// ---------------------------------------------------------------------------

export const productType = defineType({
  name:  'product',
  title: 'Product',
  type:  'document',

  fields: [
    // ── Identity ──────────────────────────────────────────────────────────
    defineField({
      name:  'title',
      title: 'Title',
      type:  'string',
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
      title: 'Eyebrow label',
      type:  'string',
      description: 'Small text above the hero title. e.g. "Cryark · Games"',
    }),
    defineField({
      name:  'subtitle',
      title: 'Subtitle',
      type:  'string',
      description: 'Tagline shown in the hero.',
    }),
    defineField({
      name:  'description',
      title: 'Short description',
      type:  'text',
      rows: 3,
      description: 'Used on cards and meta tags.',
    }),

    // ── Status & Classification ────────────────────────────────────────────
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
      name:  'product_type',
      title: 'Product type',
      type:  'string',
      description: 'Controls which section this product appears under in the nav and listing pages.',
      options: {
        list: [
          { title: 'Game',                value: 'game'         },
          { title: 'Developer Tool',      value: 'dev_tool'     },
          { title: '3D Asset Pack',       value: 'asset_pack'   },
          { title: 'Developer Download',  value: 'dev_download' },
        ],
        layout: 'radio',
      },
      // game / dev_tool → appears on both cryark.net and guillen.studio
      // asset_pack      → 3D assets for distribution (guillen.studio primary)
      // dev_download    → pre-built scripts, components, models, sounds, art etc.
    }),
    defineField({
      name:  'tags',
      title: 'Tags',
      type:  'array',
      of:    [defineArrayMember({ type: 'string' })],
      description: 'e.g. Godot 4, Blender, Narrative',
    }),
    defineField({
      name:  'platforms',
      title: 'Platform badges',
      type:  'array',
      of:    [defineArrayMember({
        type:  'object',
        name:  'platform',
        fields: [
          defineField({ name: 'slug',  title: 'Slug',     type: 'string', description: 'godot | blender | itch | steam | gumroad — used to auto-find /icons/{slug}.png' }),
          defineField({ name: 'label', title: 'Label',    type: 'string' }),
          defineField({ name: 'icon',  title: 'Custom icon (upload)', type: 'image', description: 'Upload a custom icon here. Takes priority over the slug lookup.' }),
          defineField({ name: 'src',   title: 'Icon URL (fallback)', type: 'string', description: 'Direct URL fallback. Used only if no upload and no matching /icons/{slug}.png' }),
        ],
        preview: { select: { title: 'label', subtitle: 'slug', media: 'icon' } },
      })],
    }),

    // ── Media ────────────────────────────────────────────────────────────
    defineField({
      name:  'hero_image',
      title: 'Hero image / screenshot',
      type:  'image',
      description: 'Full-screen background for the CinematicHero.',
      options: { hotspot: true },
    }),
    defineField({
      name:  'key_art',
      title: 'Key art (portrait poster)',
      type:  'image',
      options: { hotspot: true },
    }),
    defineField({
      name:  'thumbnail',
      title: 'Card thumbnail',
      type:  'image',
      options: { hotspot: true },
    }),
    defineField({
      name:  'preview_code',
      title: 'Code preview (work card slot)',
      type:  'object',
      description: 'Short snippet shown in the horizontal work card. Keep it 8–12 lines — it\'s a teaser, not a tutorial.',
      fields: [
        defineField({
          name:    'language',
          title:   'Language',
          type:    'string',
          options: {
            list: [
              // Web
              { title: 'JavaScript',   value: 'javascript'  },
              { title: 'TypeScript',   value: 'typescript'  },
              { title: 'JSX',          value: 'jsx'         },
              { title: 'TSX',          value: 'tsx'         },
              { title: 'HTML',         value: 'html'        },
              { title: 'CSS',          value: 'css'         },
              { title: 'SCSS',         value: 'scss'        },
              { title: 'Vue',          value: 'vue'         },
              // Data / config
              { title: 'JSON',         value: 'json'        },
              { title: 'YAML',         value: 'yaml'        },
              { title: 'TOML',         value: 'toml'        },
              { title: 'GraphQL',      value: 'graphql'     },
              { title: 'SQL',          value: 'sql'         },
              // Scripting
              { title: 'Python',       value: 'python'      },
              { title: 'Bash / Shell', value: 'bash'        },
              { title: 'Lua',          value: 'lua'         },
              { title: 'Ruby',         value: 'ruby'        },
              { title: 'PHP',          value: 'php'         },
              // Systems
              { title: 'C#',           value: 'csharp'      },
              { title: 'C++',          value: 'cpp'         },
              { title: 'C',            value: 'c'           },
              { title: 'Rust',         value: 'rust'        },
              { title: 'Go',           value: 'go'          },
              { title: 'Zig',          value: 'zig'         },
              { title: 'Swift',        value: 'swift'       },
              { title: 'Kotlin',       value: 'kotlin'      },
              { title: 'Java',         value: 'java'        },
              // Shaders / game
              { title: 'GDScript',     value: 'gdscript'    },
              { title: 'GLSL',         value: 'glsl'        },
              { title: 'HLSL',         value: 'hlsl'        },
              { title: 'WGSL',         value: 'wgsl'        },
              // Other
              { title: 'Markdown',     value: 'markdown'    },
              { title: 'Dockerfile',   value: 'dockerfile'  },
              { title: 'Solidity',     value: 'solidity'    },
              { title: 'Plain text',   value: 'text'        },
            ],
          },
          initialValue: 'python',
        }),
        defineField({
          name:  'label',
          title: 'Slot label',
          type:  'string',
          description: 'Short context label. e.g. "Procedural mesh gen" or "Batch render loop"',
        }),
        defineField({
          name:  'code',
          title: 'Code',
          type:  'text',
          rows:  12,
        }),
      ],
    }),
    defineField({
      name:  'screenshots',
      title: 'Screenshot gallery',
      type:  'array',
      of:    [defineArrayMember({
        type:  'object',
        name:  'screenshot',
        fields: [
          defineField({ name: 'image',   title: 'Image',   type: 'image', options: { hotspot: true } }),
          defineField({ name: 'alt',     title: 'Alt text', type: 'string' }),
          defineField({ name: 'caption', title: 'Caption',  type: 'string' }),
        ],
        preview: { select: { title: 'caption', media: 'image' } },
      })],
    }),

    // ── Page sections (block builder) ────────────────────────────────────
    defineField({
      name:  'sections',
      title: 'Page sections',
      type:  'array',
      description: 'Add FeatureSpotlight blocks, text sections, etc. in order.',
      of: [
        defineArrayMember({ type: 'sideBySideBlock'          }),
        defineArrayMember({ type: 'featureSpotlightBlock'  }),
        defineArrayMember({ type: 'cinematicBannerBlock'   }),
        defineArrayMember({ type: 'contentCardsBlock'      }),
        defineArrayMember({ type: 'factGridBlock'          }),
        defineArrayMember({ type: 'screenshotGalleryBlock'    }),
        defineArrayMember({ type: 'modelViewerBlock'         }),
        defineArrayMember({ type: 'videoBlock'               }),
        defineArrayMember({ type: 'embeddedAppBlock'         }),
        defineArrayMember({ type: 'assetDownloadBlock'       }),
        defineArrayMember({ type: 'pricingCtaBlock'          }),
        defineArrayMember({ type: 'roadmapBlock'             }),
        defineArrayMember({ type: 'systemRequirementsBlock'  }),
        defineArrayMember({ type: 'changelogBlock'           }),
        defineArrayMember({ type: 'titleBlock'               }),
        defineArrayMember({ type: 'textSection'              }),
        defineArrayMember({ type: 'codeBlock'                }),
        defineArrayMember({ type: 'diagramBlock'             }),
        defineArrayMember({ type: 'architectureBlock'        }),
        defineArrayMember({ type: 'spacerBlock'              }),
      ],
    }),

    // ── Built-with logos ─────────────────────────────────────────────────
    defineField({
      name:  'built_with',
      title: 'Built with',
      type:  'array',
      of:    [defineArrayMember({
        type:  'object',
        name:  'tool',
        fields: [
          defineField({ name: 'name', title: 'Tool name',   type: 'string' }),
          defineField({ name: 'logo', title: 'Logo image',  type: 'image'  }),
          defineField({ name: 'src',  title: 'Logo URL',    type: 'string', description: 'Use /logos/{slug}-full.png or upload above' }),
        ],
        preview: { select: { title: 'name', media: 'logo' } },
      })],
    }),

    // ── CTAs ─────────────────────────────────────────────────────────────
    defineField({
      name:  'cta_links',
      title: 'CTA buttons',
      type:  'array',
      of:    [defineArrayMember({
        type:  'object',
        name:  'cta',
        fields: [
          defineField({ name: 'label',   title: 'Label',   type: 'string' }),
          defineField({ name: 'href',    title: 'URL',     type: 'string' }),
          defineField({ name: 'variant', title: 'Variant', type: 'string',
            options: { list: ['solid', 'ghost', 'ghost-bordered'] },
            initialValue: 'solid',
          }),
          defineField({ name: 'lava', title: 'Lava fill', type: 'boolean', initialValue: false }),
        ],
        preview: { select: { title: 'label', subtitle: 'href' } },
      })],
    }),

    // ── Site visibility ───────────────────────────────────────────────────
    defineField({
      name:  'site_visibility',
      title: 'Visible on',
      type:  'array',
      of:    [defineArrayMember({ type: 'string' })],
      options: {
        list: [
          { title: 'Cryark.net',     value: 'cryark'   },
          { title: 'Guillen.Studio', value: 'guillen'  },
        ],
        layout: 'checkbox',
      },
      initialValue: ['cryark', 'guillen'],
      description:  'Which site(s) this product appears on. Games and tools usually belong on both.',
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
    select: { title: 'title', subtitle: 'status', media: 'thumbnail' },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle ?? 'draft', media }
    },
  },
})
