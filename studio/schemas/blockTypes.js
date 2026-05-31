import { defineType, defineField, defineArrayMember } from 'sanity'

// ---------------------------------------------------------------------------
// Shared block / object types
// Referenced by both product.js and labEntry.js document schemas.
// ---------------------------------------------------------------------------

// ── Code Block ──────────────────────────────────────────────────────────────
// Used inside labEntry → content_sections → content[]
// Renders as <CodeBlock> on the frontend.
export const codeBlockType = defineType({
  name:  'codeBlock',
  title: 'Code Block',
  type:  'object',
  fields: [
    defineField({
      name:    'language',
      title:   'Language',
      type:    'string',
      options: {
        list: [
          { title: 'Python',      value: 'python'      },
          { title: 'JavaScript',  value: 'javascript'  },
          { title: 'TypeScript',  value: 'typescript'  },
          { title: 'JSON',        value: 'json'        },
          { title: 'Bash',        value: 'bash'        },
          { title: 'CSS',         value: 'css'         },
          { title: 'Plain text',  value: 'text'        },
        ],
      },
      initialValue: 'text',
    }),
    defineField({
      name:        'title',
      title:       'Title / filename',
      type:        'string',
      description: 'Shown as a label above the code panel.',
    }),
    defineField({
      name:        'code',
      title:       'Code',
      type:        'text',
      description: 'Paste raw code here. Indentation is preserved.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'language' },
    prepare({ title, subtitle }) {
      return { title: title ?? '(untitled snippet)', subtitle: subtitle ?? 'text' }
    },
  },
})

// ── Design Decision ─────────────────────────────────────────────────────────
// Used inside labEntry → content_sections → content[]
// Renders as a gold left-border decision item on the frontend.
export const designDecisionType = defineType({
  name:  'designDecision',
  title: 'Design Decision',
  type:  'object',
  fields: [
    defineField({
      name:        'key',
      title:       'Key',
      type:        'string',
      description: 'Short heading — e.g. "Single session.json"',
    }),
    defineField({
      name:  'description',
      title: 'Description',
      type:  'text',
      rows:  3,
    }),
  ],
  preview: {
    select: { title: 'key', subtitle: 'description' },
  },
})

// ── Feature Spotlight Block ─────────────────────────────────────────────────
// Used inside product → sections[]
// Renders as <FeatureSpotlight> on the frontend.
export const featureSpotlightBlockType = defineType({
  name:  'featureSpotlightBlock',
  title: 'Feature Spotlight',
  type:  'object',
  fields: [
    defineField({ name: 'eyebrow',   title: 'Eyebrow label',  type: 'string' }),
    defineField({ name: 'heading',   title: 'Heading',        type: 'string' }),
    defineField({ name: 'body',      title: 'Body text',      type: 'text', rows: 4 }),
    defineField({
      name:    'image',
      title:   'Media image',
      type:    'image',
      options: { hotspot: true },
    }),
    defineField({
      name:        'video_src',
      title:       'Video URL (optional)',
      type:        'string',
      description: 'Takes precedence over image when both are set.',
    }),
    defineField({
      name:         'flip',
      title:        'Flip layout (image on left)',
      type:         'boolean',
      initialValue: false,
    }),
    defineField({
      name:         'media_fit',
      title:        'Media fit',
      type:         'string',
      options:      { list: ['cover', 'contain'] },
      initialValue: 'cover',
    }),
    defineField({
      name:        'media_bg',
      title:       'Media background colour',
      type:        'string',
      description: 'CSS colour used when media_fit is "contain". e.g. "#07040a"',
    }),
    defineField({ name: 'cta_label', title: 'CTA button label', type: 'string' }),
    defineField({ name: 'cta_href',  title: 'CTA button URL',   type: 'string' }),
  ],
  preview: {
    select: { title: 'heading', media: 'image' },
    prepare({ title, media }) {
      return { title: title ?? '(untitled spotlight)', media }
    },
  },
})

// ── Text Section ────────────────────────────────────────────────────────────
// Used inside product → sections[]
// Renders as a simple rich-text section.
export const textSectionType = defineType({
  name:  'textSection',
  title: 'Text Section',
  type:  'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name:  'body',
      title: 'Body',
      type:  'array',
      of:    [defineArrayMember({ type: 'block' })],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title ?? '(untitled section)' }
    },
  },
})

// ── Fact Grid Block ──────────────────────────────────────────────────────────
// Used inside product → sections[]
// Renders as a <FactGrid> stat/fact card grid on the frontend.
// Great for game specs: "4 Maps", "200+ Gun Customizations", "9 Characters", etc.
export const factGridBlockType = defineType({
  name:  'factGridBlock',
  title: 'Fact Grid',
  type:  'object',
  fields: [
    defineField({
      name:        'heading',
      title:       'Section heading',
      type:        'string',
      description: 'Optional label above the grid — e.g. "By the numbers" or "Specifications"',
    }),
    defineField({
      name:         'columns',
      title:        'Columns',
      type:         'number',
      description:  'Force a specific column count (2, 3, or 4). Leave blank to auto-size.',
      options:      { list: [2, 3, 4] },
    }),
    defineField({
      name:  'facts',
      title: 'Facts / Stats',
      type:  'array',
      of:    [defineArrayMember({
        type:  'object',
        name:  'fact',
        fields: [
          defineField({ name: 'value',       title: 'Value',       type: 'string', description: 'e.g. "4", "200+", "8 GB"' }),
          defineField({ name: 'label',       title: 'Label',       type: 'string', description: 'e.g. "Maps", "RAM Required"' }),
          defineField({ name: 'description', title: 'Description', type: 'string', description: 'Optional sub-line for extra detail.' }),
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      })],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title ?? 'Fact Grid', subtitle: 'factGridBlock' }
    },
  },
})

// ── Cinematic Banner Block ───────────────────────────────────────────────────
// Used inside product → sections[]
// Full-width atmospheric block — background image with organic gradient fade.
export const cinematicBannerBlockType = defineType({
  name:  'cinematicBannerBlock',
  title: 'Cinematic Banner',
  type:  'object',
  fields: [
    defineField({
      name:    'image',
      title:   'Background image',
      type:    'image',
      options: { hotspot: true },
      validation: R => R.required(),
    }),
    defineField({ name: 'eyebrow',  title: 'Eyebrow',  type: 'string', description: 'Small label above the heading.' }),
    defineField({ name: 'heading',  title: 'Heading',  type: 'string', description: 'Main callout — e.g. "Largest map we\'ve ever made"' }),
    defineField({ name: 'body',     title: 'Body',     type: 'string', description: 'Optional supporting line below the heading.' }),
    defineField({
      name:         'align',
      title:        'Text alignment',
      type:         'string',
      options:      { list: ['left', 'center'], layout: 'radio' },
      initialValue: 'left',
    }),
    defineField({
      name:        'min_height',
      title:       'Minimum height',
      type:        'string',
      description: 'CSS value — e.g. "520px", "60vh". Default: 520px',
      initialValue: '520px',
    }),
    defineField({ name: 'cta_label', title: 'CTA button label', type: 'string' }),
    defineField({ name: 'cta_href',  title: 'CTA button URL',   type: 'string' }),
  ],
  preview: {
    select: { title: 'heading', media: 'image' },
    prepare({ title, media }) {
      return { title: title ?? '(untitled banner)', media }
    },
  },
})

// ── Content Cards Block ──────────────────────────────────────────────────────
// Used inside product → sections[]
// Grid of hover-reveal cards — title visible by default, description expands.
export const contentCardsBlockType = defineType({
  name:  'contentCardsBlock',
  title: 'Content Cards',
  type:  'object',
  fields: [
    defineField({
      name:        'heading',
      title:       'Section heading',
      type:        'string',
      description: 'Optional label — e.g. "Maps", "Characters", "Weapons"',
    }),
    defineField({
      name:        'columns',
      title:       'Columns',
      type:        'number',
      description: 'Force a specific column count (2, 3, or 4). Leave blank to auto-size.',
      options:     { list: [2, 3, 4] },
    }),
    defineField({
      name:         'card_height',
      title:        'Card height (px)',
      type:         'number',
      description:  'Fixed card height in pixels. Increase if descriptions are long. Default: 280',
      initialValue: 280,
    }),
    defineField({
      name:  'cards',
      title: 'Cards',
      type:  'array',
      of:    [defineArrayMember({
        type:  'object',
        name:  'contentCard',
        fields: [
          defineField({ name: 'title',       title: 'Title',              type: 'string' }),
          defineField({ name: 'category',    title: 'Category (eyebrow)', type: 'string', description: 'e.g. "Map", "Character", "Weapon"' }),
          defineField({ name: 'description', title: 'Description',        type: 'text',   rows: 4 }),
          defineField({ name: 'image',       title: 'Card background',    type: 'image',  options: { hotspot: true }, description: 'Optional background image for this card.' }),
        ],
        preview: {
          select: { title: 'title', subtitle: 'category', media: 'image' },
          prepare({ title, subtitle, media }) {
            return { title: title ?? '(untitled)', subtitle: subtitle ?? '', media }
          },
        },
      })],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title ?? 'Content Cards', subtitle: 'contentCardsBlock' }
    },
  },
})

// ── Screenshot Gallery Block ─────────────────────────────────────────────────
// Used inside product → sections[]
// Renders as a <ScreenshotGallery> horizontal scroll strip.
export const screenshotGalleryBlockType = defineType({
  name:  'screenshotGalleryBlock',
  title: 'Screenshot Gallery',
  type:  'object',
  fields: [
    defineField({
      name:        'label',
      title:       'Label',
      type:        'string',
      description: 'Optional heading above the strip — e.g. "Screenshots"',
    }),
    defineField({
      name:  'images',
      title: 'Images',
      type:  'array',
      of:    [defineArrayMember({
        type:  'object',
        name:  'galleryImage',
        fields: [
          defineField({ name: 'image',   title: 'Image',    type: 'image', options: { hotspot: true } }),
          defineField({ name: 'alt',     title: 'Alt text', type: 'string' }),
          defineField({ name: 'caption', title: 'Caption',  type: 'string' }),
        ],
        preview: { select: { title: 'caption', media: 'image' } },
      })],
    }),
  ],
  preview: {
    select: { title: 'label' },
    prepare({ title }) {
      return { title: title ?? 'Screenshot Gallery', subtitle: 'screenshotGalleryBlock' }
    },
  },
})

// ── Model Viewer Block ───────────────────────────────────────────────────────
// Used inside product → sections[]
// Renders as a <ModelViewer> 3D asset viewer on the frontend.
// Model files (.glb) are hosted on the VPS at assets.cryark.net/models/
export const modelViewerBlockType = defineType({
  name:  'modelViewerBlock',
  title: '3D Model Viewer',
  type:  'object',
  fields: [
    defineField({
      name:        'model_url',
      title:       'Model URL (.glb)',
      type:        'string',
      description: 'Full URL to the .glb file on your VPS — e.g. https://assets.cryark.net/models/character.glb',
      validation:  R => R.required(),
    }),
    defineField({
      name:        'poster',
      title:       'Poster image',
      type:        'image',
      options:     { hotspot: true },
      description: 'Preview image shown while the model is loading. Highly recommended.',
    }),
    defineField({
      name:        'alt',
      title:       'Alt text',
      type:        'string',
      description: 'Accessibility description — e.g. "Main character, 3D model"',
    }),
    defineField({
      name:        'caption',
      title:       'Caption',
      type:        'string',
      description: 'Optional label shown below the viewer.',
    }),
    defineField({
      name:         'auto_rotate',
      title:        'Auto-rotate',
      type:         'boolean',
      description:  'Slowly spin the model when idle.',
      initialValue: true,
    }),
    defineField({
      name:         'height',
      title:        'Viewer height (px)',
      type:         'number',
      description:  'Height of the 3D canvas. Default: 520. Use 680–800 for full-body characters.',
      initialValue: 520,
    }),
    defineField({
      name:         'bg_style',
      title:        'Background',
      type:         'string',
      options: {
        list: [
          { title: 'Dark — #07060a',      value: 'dark'        },
          { title: 'Neutral — warm grey', value: 'neutral'     },
          { title: 'Transparent',         value: 'transparent' },
        ],
        layout: 'radio',
      },
      initialValue: 'dark',
    }),
    defineField({
      name:         'enable_ar',
      title:        'Enable AR on mobile',
      type:         'boolean',
      description:  'Lets mobile users place the model in their real environment via AR.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'alt', subtitle: 'model_url', media: 'poster' },
    prepare({ title, subtitle, media }) {
      return { title: title ?? '3D Model Viewer', subtitle: subtitle ?? '', media }
    },
  },
})

// ── Spacer Block ─────────────────────────────────────────────────────────────
// Used inside product → sections[] and labEntry → content_sections → content[]
// Adds vertical whitespace between sections.
export const spacerBlockType = defineType({
  name:  'spacerBlock',
  title: 'Spacer',
  type:  'object',
  fields: [
    defineField({
      name:         'size',
      title:        'Size',
      type:         'string',
      options: {
        list: [
          { title: 'XS — 32px',  value: 'xs' },
          { title: 'SM — 56px',  value: 'sm' },
          { title: 'MD — 88px',  value: 'md' },
          { title: 'LG — 128px', value: 'lg' },
          { title: 'XL — 180px', value: 'xl' },
        ],
        layout: 'radio',
      },
      initialValue: 'md',
    }),
  ],
  preview: {
    select: { title: 'size' },
    prepare({ title }) {
      const labels = { xs: 'XS — 32px', sm: 'SM — 56px', md: 'MD — 88px', lg: 'LG — 128px', xl: 'XL — 180px' }
      return { title: 'Spacer', subtitle: labels[title] ?? 'MD — 88px' }
    },
  },
})

// ── Video Block ──────────────────────────────────────────────────────────────
// Used inside product → sections[] and labEntry → sections[]
// Renders as a <VideoPlayer> click-to-play section on the frontend.
export const videoBlockType = defineType({
  name:  'videoBlock',
  title: 'Video Player',
  type:  'object',
  fields: [
    defineField({ name: 'eyebrow',    title: 'Eyebrow label', type: 'string', description: 'e.g. "Trailer", "Gameplay", "Announcement"' }),
    defineField({ name: 'title',      title: 'Title',         type: 'string' }),
    defineField({
      name:        'video_mp4',
      title:       'Video URL — MP4',
      type:        'string',
      description: 'Full URL to .mp4 on your VPS. e.g. https://assets.cryark.net/videos/trailer.mp4',
      validation:  R => R.required(),
    }),
    defineField({
      name:        'video_webm',
      title:       'Video URL — WebM (optional)',
      type:        'string',
      description: 'VP9/WebM version for Chrome/Firefox. Preferred when both are available.',
    }),
    defineField({
      name:        'poster',
      title:       'Poster image',
      type:        'image',
      options:     { hotspot: true },
      description: 'Shown before the user hits play. Use a key art frame.',
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    defineField({
      name:         'aspect_ratio',
      title:        'Aspect ratio',
      type:         'string',
      options:      { list: ['16/9', '21/9', '4/3'], layout: 'radio' },
      initialValue: '16/9',
    }),
  ],
  preview: {
    select: { title: 'title', media: 'poster' },
    prepare({ title, media }) {
      return { title: title ?? 'Video Player', media }
    },
  },
})

// ── Embedded App Block ───────────────────────────────────────────────────────
// Used inside product → sections[] and labEntry → sections[]
// Renders as <EmbeddedApp> — click-to-launch iframe for interactive demos.
export const embeddedAppBlockType = defineType({
  name:  'embeddedAppBlock',
  title: 'Embedded App / Demo',
  type:  'object',
  fields: [
    defineField({ name: 'title',       title: 'App title',    type: 'string', validation: R => R.required() }),
    defineField({ name: 'description', title: 'Description',  type: 'text', rows: 2 }),
    defineField({
      name:        'embed_url',
      title:       'Embed URL',
      type:        'string',
      description: 'URL of the deployed app — Godot HTML5, Unity WebGL, custom tool, etc.',
      validation:  R => R.required(),
    }),
    defineField({ name: 'poster',       title: 'Poster image',  type: 'image', options: { hotspot: true } }),
    defineField({ name: 'launch_label', title: 'Launch button label', type: 'string', initialValue: 'Launch' }),
    defineField({
      name:        'warning',
      title:       'Warning / note',
      type:        'string',
      description: 'e.g. "Requires WebGL · ~45 MB download"',
    }),
    defineField({
      name:         'height',
      title:        'Frame height (px)',
      type:         'number',
      description:  'Default: 620. Games typically 600–720px.',
      initialValue: 620,
    }),
  ],
  preview: {
    select: { title: 'title', media: 'poster' },
    prepare({ title, media }) {
      return { title: title ?? 'Embedded App', subtitle: 'embeddedAppBlock', media }
    },
  },
})

// ── Asset Download Block ─────────────────────────────────────────────────────
// Used inside product → sections[] and labEntry → sections[]
// Renders as <AssetGrid> — downloadable file cards with license badges.
export const assetDownloadBlockType = defineType({
  name:  'assetDownloadBlock',
  title: 'Asset Downloads',
  type:  'object',
  fields: [
    defineField({ name: 'heading', title: 'Section heading', type: 'string', description: 'e.g. "Download Assets", "Free Resources"' }),
    defineField({
      name:  'assets',
      title: 'Assets',
      type:  'array',
      of:    [defineArrayMember({
        type:  'object',
        name:  'asset',
        fields: [
          defineField({ name: 'name',        title: 'Name',            type: 'string', validation: R => R.required() }),
          defineField({ name: 'category',    title: 'Category',        type: 'string', description: 'e.g. "3D Character", "Texture Pack", "Sound FX"' }),
          defineField({ name: 'preview',     title: 'Preview image',   type: 'image',  options: { hotspot: true } }),
          defineField({ name: 'file_url',    title: 'Download URL',    type: 'string', description: 'Full URL to file on VPS. e.g. https://assets.cryark.net/models/character.glb', validation: R => R.required() }),
          defineField({
            name:    'file_type',
            title:   'File type',
            type:    'string',
            options: { list: ['glb','fbx','obj','blend','png','psd','zip','svg','mp3','wav'] },
          }),
          defineField({ name: 'file_size',   title: 'File size',       type: 'string', description: 'e.g. "4.2 MB"' }),
          defineField({
            name:         'license',
            title:        'License',
            type:         'string',
            options:      { list: [
              { title: 'Free',               value: 'free'        },
              { title: 'CC0 (Public Domain)', value: 'cc0'        },
              { title: 'CC-BY (Attribution)', value: 'attribution' },
              { title: 'Patreon Exclusive',   value: 'patreon'    },
            ]},
            initialValue: 'free',
          }),
          defineField({ name: 'description', title: 'Description',     type: 'text', rows: 2 }),
        ],
        preview: {
          select: { title: 'name', subtitle: 'file_type', media: 'preview' },
          prepare({ title, subtitle, media }) {
            return { title: title ?? '(untitled)', subtitle: subtitle ?? '', media }
          },
        },
      })],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title ?? 'Asset Downloads', subtitle: 'assetDownloadBlock' }
    },
  },
})

// ── Pricing CTA Block ────────────────────────────────────────────────────────
// Used inside product → sections[]
// Renders as <PricingCTA> — purchase/download section with optional Patreon strip.
export const pricingCtaBlockType = defineType({
  name:  'pricingCtaBlock',
  title: 'Pricing / Download CTA',
  type:  'object',
  fields: [
    defineField({ name: 'heading',       title: 'Heading',           type: 'string', description: 'e.g. "Get the Game", "Available Now"', initialValue: 'Available Now' }),
    defineField({ name: 'price',         title: 'Price',             type: 'string', description: 'e.g. "$9.99", "Free", "Pay What You Want"' }),
    defineField({ name: 'price_note',    title: 'Price note',        type: 'string', description: 'e.g. "One-time purchase · DRM-free"' }),
    defineField({
      name:  'links',
      title: 'Store links',
      type:  'array',
      of:    [defineArrayMember({
        type:  'object',
        name:  'storeLink',
        fields: [
          defineField({ name: 'label',   title: 'Button label',  type: 'string' }),
          defineField({ name: 'href',    title: 'URL',           type: 'string' }),
          defineField({
            name:    'variant',
            title:   'Style',
            type:    'string',
            options: { list: ['solid', 'ghost', 'ghost-bordered'] },
            initialValue: 'solid',
          }),
        ],
        preview: { select: { title: 'label', subtitle: 'href' } },
      })],
    }),
    defineField({ name: 'patreon_href',  title: 'Patreon URL',       type: 'string', description: 'Leave blank to hide Patreon strip.' }),
    defineField({ name: 'patreon_label', title: 'Patreon label',     type: 'string', initialValue: 'Support on Patreon' }),
    defineField({ name: 'note',          title: 'Fine print',        type: 'string', description: 'e.g. "DRM-free · No login required"' }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'price' },
    prepare({ title, subtitle }) {
      return { title: title ?? 'Pricing CTA', subtitle: subtitle ?? '' }
    },
  },
})

// ── Roadmap Block ────────────────────────────────────────────────────────────
// Used inside product → sections[] and labEntry → sections[]
// Renders as <RoadmapBlock> — horizontal milestone track with status nodes.
export const roadmapBlockType = defineType({
  name:  'roadmapBlock',
  title: 'Roadmap',
  type:  'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name:  'milestones',
      title: 'Milestones',
      type:  'array',
      of:    [defineArrayMember({
        type:  'object',
        name:  'milestone',
        fields: [
          defineField({ name: 'label',       title: 'Label',       type: 'string', validation: R => R.required() }),
          defineField({ name: 'description', title: 'Description', type: 'string' }),
          defineField({
            name:         'status',
            title:        'Status',
            type:         'string',
            options:      { list: [
              { title: '✓ Done',        value: 'done'        },
              { title: '◎ In Progress', value: 'in_progress' },
              { title: '○ Planned',     value: 'planned'     },
              { title: '✕ Cut',         value: 'cut'         },
            ]},
            initialValue: 'planned',
          }),
        ],
        preview: {
          select: { title: 'label', subtitle: 'status' },
        },
      })],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title ?? 'Roadmap', subtitle: 'roadmapBlock' }
    },
  },
})

// ── System Requirements Block ────────────────────────────────────────────────
// Used inside product → sections[] (games only)
// Renders as <SystemRequirements> — min/recommended specs table.
export const systemRequirementsBlockType = defineType({
  name:  'systemRequirementsBlock',
  title: 'System Requirements',
  type:  'object',
  fields: [
    defineField({ name: 'heading',       title: 'Heading',        type: 'string', initialValue: 'System Requirements' }),
    defineField({ name: 'platform_note', title: 'Platform note',  type: 'string', description: 'e.g. "PC only · Mac support planned 2025"' }),
    defineField({
      name:  'minimum',
      title: 'Minimum',
      type:  'object',
      fields: [
        defineField({ name: 'os',      title: 'OS',      type: 'string' }),
        defineField({ name: 'cpu',     title: 'CPU',     type: 'string' }),
        defineField({ name: 'gpu',     title: 'GPU',     type: 'string' }),
        defineField({ name: 'ram',     title: 'RAM',     type: 'string' }),
        defineField({ name: 'storage', title: 'Storage', type: 'string' }),
        defineField({ name: 'notes',   title: 'Notes',   type: 'string' }),
      ],
    }),
    defineField({
      name:  'recommended',
      title: 'Recommended',
      type:  'object',
      fields: [
        defineField({ name: 'os',      title: 'OS',      type: 'string' }),
        defineField({ name: 'cpu',     title: 'CPU',     type: 'string' }),
        defineField({ name: 'gpu',     title: 'GPU',     type: 'string' }),
        defineField({ name: 'ram',     title: 'RAM',     type: 'string' }),
        defineField({ name: 'storage', title: 'Storage', type: 'string' }),
        defineField({ name: 'notes',   title: 'Notes',   type: 'string' }),
      ],
    }),
    defineField({ name: 'tested_on',    title: 'Tested on',      type: 'string', description: 'e.g. "Tested on Windows 11 · RTX 3080 · Ryzen 7 5800X"' }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title ?? 'System Requirements', subtitle: 'systemRequirementsBlock' }
    },
  },
})

// ── Changelog Block ──────────────────────────────────────────────────────────
// Used inside product → sections[] and labEntry → sections[]
// Renders as <ChangelogBlock> — version history timeline.
export const changelogBlockType = defineType({
  name:  'changelogBlock',
  title: 'Changelog',
  type:  'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'Changelog' }),
    defineField({
      name:  'entries',
      title: 'Entries',
      type:  'array',
      of:    [defineArrayMember({
        type:  'object',
        name:  'changelogEntry',
        fields: [
          defineField({ name: 'version', title: 'Version',    type: 'string', description: 'e.g. "v2.1.0"' }),
          defineField({ name: 'date',    title: 'Date',       type: 'date'  }),
          defineField({ name: 'title',   title: 'Title',      type: 'string', description: 'Optional short description — e.g. "Multiplayer Update"' }),
          defineField({
            name:  'changes',
            title: 'Changes',
            type:  'array',
            of:    [defineArrayMember({
              type:  'object',
              name:  'changeItem',
              fields: [
                defineField({
                  name:    'type',
                  title:   'Type',
                  type:    'string',
                  options: { list: [
                    { title: '+ Added',    value: 'added'    },
                    { title: '✓ Fixed',    value: 'fixed'    },
                    { title: '~ Changed',  value: 'changed'  },
                    { title: '⚠ Breaking', value: 'breaking' },
                    { title: '− Removed',  value: 'removed'  },
                  ]},
                  initialValue: 'added',
                }),
                defineField({ name: 'text', title: 'Description', type: 'string' }),
              ],
              preview: { select: { title: 'text', subtitle: 'type' } },
            })],
          }),
        ],
        preview: {
          select: { title: 'version', subtitle: 'title' },
          prepare({ title, subtitle }) {
            return { title: title ?? '(version)', subtitle: subtitle ?? '' }
          },
        },
      })],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title ?? 'Changelog', subtitle: 'changelogBlock' }
    },
  },
})

// ── Title Block ──────────────────────────────────────────────────────────────
// Used inside product → sections[] and labEntry → sections[]
// Renders as a large section heading — use before ContentCards, FeatureSpotlights,
// or any group of blocks that needs a prominent title explaining what's below.
export const titleBlockType = defineType({
  name:  'titleBlock',
  title: 'Section Title',
  type:  'object',
  fields: [
    defineField({
      name:        'heading',
      title:       'Heading',
      type:        'string',
      description: 'The large, prominent section title.',
      validation:  R => R.required(),
    }),
    defineField({
      name:        'eyebrow',
      title:       'Eyebrow label',
      type:        'string',
      description: 'Small uppercase label above the heading. e.g. "Characters", "Weapons"',
    }),
    defineField({
      name:        'description',
      title:       'Description',
      type:        'text',
      rows:        2,
      description: 'Optional supporting paragraph below the heading.',
    }),
    defineField({
      name:         'align',
      title:        'Alignment',
      type:         'string',
      options:      { list: ['left', 'center'], layout: 'radio' },
      initialValue: 'left',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'eyebrow' },
    prepare({ title, subtitle }) {
      return { title: title ?? '(untitled)', subtitle: subtitle ?? 'Section Title' }
    },
  },
})
