import { defineType, defineField } from 'sanity'

// ---------------------------------------------------------------------------
// pageSections.js
// Sanity object types for the clientPage page builder.
// Each type maps 1-to-1 to a section component in shared/sections/.
// ---------------------------------------------------------------------------

const ICON_OPTIONS = [
  'globe', 'phone', 'wrench', 'shield',
  'star', 'check', 'zap', 'map', 'clock', 'mail', 'users',
].map(v => ({ title: v, value: v }))

const VARIANT_OPTIONS = [
  { title: 'Default (primary bg)', value: 'default' },
  { title: 'Alt (surface bg)',     value: 'alt' },
]

// ── Shared sub-objects ─────────────────────────────────────────────────────

export const ctaItemType = defineType({
  name:  'ctaItem',
  title: 'CTA Button',
  type:  'object',
  fields: [
    defineField({ name: 'label',   title: 'Label', type: 'string', validation: R => R.required() }),
    defineField({ name: 'href',    title: 'URL',   type: 'string', validation: R => R.required() }),
    defineField({
      name:  'variant',
      title: 'Style',
      type:  'string',
      options: { list: ['solid', 'ghost', 'ghost-bordered'].map(v => ({ title: v, value: v })) },
      initialValue: 'solid',
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'variant' } },
})

// ── Section schemas ────────────────────────────────────────────────────────

export const heroSectionType = defineType({
  name:  'heroSection',
  title: 'Hero',
  type:  'object',
  fields: [
    defineField({ name: 'eyebrow',  title: 'Eyebrow text',  type: 'string' }),
    defineField({ name: 'headline', title: 'Headline',      type: 'string', validation: R => R.required() }),
    defineField({ name: 'subtext',  title: 'Subtext',       type: 'text', rows: 2 }),
    defineField({
      name:  'ctas',
      title: 'Buttons',
      type:  'array',
      of:    [{ type: 'ctaItem' }],
    }),
    defineField({
      name:  'layout',
      title: 'Layout',
      type:  'string',
      options: { list: [
        { title: 'Left-aligned', value: 'left' },
        { title: 'Centered',     value: 'centered' },
      ]},
      initialValue: 'left',
    }),
    defineField({
      name:  'variant',
      title: 'Background',
      type:  'string',
      options: { list: [...VARIANT_OPTIONS, { title: 'Accent (colored)', value: 'accent' }] },
      initialValue: 'default',
    }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'eyebrow' },
    prepare({ title, subtitle }) {
      return { title: `Hero — ${title ?? 'Untitled'}`, subtitle }
    },
  },
})

export const featureGridSectionType = defineType({
  name:  'featureGridSection',
  title: 'Feature Grid',
  type:  'object',
  fields: [
    defineField({ name: 'eyebrow',  title: 'Eyebrow',  type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'subtext',  title: 'Subtext',  type: 'text', rows: 2 }),
    defineField({
      name:  'columns',
      title: 'Columns',
      type:  'number',
      options: { list: [
        { title: '2 columns', value: 2 },
        { title: '3 columns', value: 3 },
      ]},
      initialValue: 3,
    }),
    defineField({
      name:  'items',
      title: 'Features',
      type:  'array',
      of: [{
        type:  'object',
        fields: [
          defineField({ name: 'icon',  title: 'Icon',  type: 'string', options: { list: ICON_OPTIONS } }),
          defineField({ name: 'title', title: 'Title', type: 'string', validation: R => R.required() }),
          defineField({ name: 'body',  title: 'Description', type: 'text', rows: 3 }),
        ],
        preview: { select: { title: 'title', subtitle: 'body' } },
      }],
    }),
    defineField({
      name: 'variant', title: 'Background', type: 'string',
      options: { list: VARIANT_OPTIONS }, initialValue: 'default',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) { return { title: `Feature Grid — ${title ?? 'Untitled'}` } },
  },
})

export const stepsSectionType = defineType({
  name:  'stepsSection',
  title: 'Steps / How It Works',
  type:  'object',
  fields: [
    defineField({ name: 'eyebrow',  title: 'Eyebrow',  type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'subtext',  title: 'Subtext',  type: 'text', rows: 2 }),
    defineField({
      name:  'items',
      title: 'Steps',
      type:  'array',
      of: [{
        type:  'object',
        fields: [
          defineField({ name: 'title', title: 'Step title',   type: 'string', validation: R => R.required() }),
          defineField({ name: 'body',  title: 'Description',  type: 'text',   rows: 3 }),
        ],
        preview: { select: { title: 'title', subtitle: 'body' } },
      }],
    }),
    defineField({
      name: 'variant', title: 'Background', type: 'string',
      options: { list: VARIANT_OPTIONS }, initialValue: 'default',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) { return { title: `Steps — ${title ?? 'Untitled'}` } },
  },
})

export const imageTextSectionType = defineType({
  name:  'imageTextSection',
  title: 'Image + Text',
  type:  'object',
  fields: [
    defineField({ name: 'eyebrow',  title: 'Eyebrow',        type: 'string' }),
    defineField({ name: 'headline', title: 'Headline',        type: 'string' }),
    defineField({ name: 'body',     title: 'Body text',       type: 'text', rows: 4 }),
    defineField({ name: 'image',    title: 'Image',           type: 'image', options: { hotspot: true } }),
    defineField({ name: 'imageAlt', title: 'Image alt text',  type: 'string' }),
    defineField({
      name:  'layout',
      title: 'Image position',
      type:  'string',
      options: { list: [
        { title: 'Image right', value: 'image-right' },
        { title: 'Image left',  value: 'image-left'  },
      ]},
      initialValue: 'image-right',
    }),
    defineField({ name: 'cta', title: 'Button', type: 'ctaItem' }),
    defineField({
      name: 'variant', title: 'Background', type: 'string',
      options: { list: VARIANT_OPTIONS }, initialValue: 'default',
    }),
  ],
  preview: {
    select: { title: 'headline', media: 'image' },
    prepare({ title, media }) {
      return { title: `Image+Text — ${title ?? 'Untitled'}`, media }
    },
  },
})

export const testimonialsSectionType = defineType({
  name:  'testimonialsSection',
  title: 'Testimonials',
  type:  'object',
  fields: [
    defineField({ name: 'eyebrow',  title: 'Eyebrow',  type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({
      name:  'items',
      title: 'Quotes',
      type:  'array',
      of: [{
        type:  'object',
        fields: [
          defineField({ name: 'quote',   title: 'Quote',     type: 'text', rows: 4, validation: R => R.required() }),
          defineField({ name: 'author',  title: 'Author',    type: 'string',        validation: R => R.required() }),
          defineField({ name: 'role',    title: 'Job title', type: 'string' }),
          defineField({ name: 'company', title: 'Company',   type: 'string' }),
        ],
        preview: { select: { title: 'author', subtitle: 'company' } },
      }],
    }),
    defineField({
      name: 'variant', title: 'Background', type: 'string',
      options: { list: VARIANT_OPTIONS }, initialValue: 'default',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) { return { title: `Testimonials — ${title ?? 'Untitled'}` } },
  },
})

export const ctaBannerSectionType = defineType({
  name:  'ctaBannerSection',
  title: 'CTA Banner',
  type:  'object',
  fields: [
    defineField({ name: 'eyebrow',  title: 'Eyebrow',  type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string', validation: R => R.required() }),
    defineField({ name: 'subtext',  title: 'Subtext',  type: 'text', rows: 2 }),
    defineField({ name: 'cta',      title: 'Button',   type: 'ctaItem' }),
    defineField({
      name:  'variant',
      title: 'Background',
      type:  'string',
      options: { list: [
        { title: 'Accent (colored)', value: 'accent' },
        ...VARIANT_OPTIONS,
      ]},
      initialValue: 'accent',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) { return { title: `CTA — ${title ?? 'Untitled'}` } },
  },
})

export const contactSectionType = defineType({
  name:  'contactSection',
  title: 'Contact',
  type:  'object',
  fields: [
    defineField({ name: 'eyebrow',  title: 'Eyebrow',  type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'subtext',  title: 'Subtext',  type: 'text', rows: 2 }),
    defineField({ name: 'email',    title: 'Email address', type: 'string' }),
    defineField({ name: 'phone',    title: 'Phone number',  type: 'string' }),
    defineField({
      name:         'showForm',
      title:        'Show contact form',
      type:         'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'variant', title: 'Background', type: 'string',
      options: { list: VARIANT_OPTIONS }, initialValue: 'default',
    }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'email' },
    prepare({ title, subtitle }) {
      return { title: `Contact — ${title ?? 'Untitled'}`, subtitle }
    },
  },
})

export const pricingPlansSectionType = defineType({
  name:  'pricingPlansSection',
  title: 'Pricing / Packages',
  type:  'object',
  fields: [
    defineField({ name: 'eyebrow',  title: 'Eyebrow',  type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'subtext',  title: 'Subtext',  type: 'text', rows: 2 }),
    defineField({
      name:  'plans',
      title: 'Plans',
      type:  'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'tag',         title: 'Tag (small label)', type: 'string' }),
          defineField({ name: 'badge',       title: 'Ribbon badge',      type: 'string', description: 'e.g. "Most popular" — floats above the card' }),
          defineField({ name: 'price',       title: 'Price',             type: 'string', validation: R => R.required(), description: 'e.g. $800 or +$400' }),
          defineField({ name: 'period',      title: 'Period',            type: 'string', description: 'e.g. one-time, /mo' }),
          defineField({ name: 'description', title: 'Description',       type: 'text', rows: 2 }),
          defineField({ name: 'note',        title: 'Separator note',    type: 'string', description: 'e.g. "Includes everything above, plus:"' }),
          defineField({ name: 'features',    title: 'Features',          type: 'array', of: [{ type: 'string' }] }),
          defineField({
            name:  'total',
            title: 'Total row (optional)',
            type:  'object',
            fields: [
              defineField({ name: 'label',  title: 'Label',  type: 'string' }),
              defineField({ name: 'amount', title: 'Amount', type: 'string' }),
            ],
          }),
          defineField({ name: 'cta',      title: 'Button',         type: 'ctaItem' }),
          defineField({ name: 'featured', title: 'Highlight this plan', type: 'boolean', initialValue: false }),
        ],
        preview: { select: { title: 'price', subtitle: 'tag' } },
      }],
    }),
    defineField({
      name: 'variant', title: 'Background', type: 'string',
      options: { list: VARIANT_OPTIONS }, initialValue: 'default',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) { return { title: `Pricing — ${title ?? 'Untitled'}` } },
  },
})

export const serviceListSectionType = defineType({
  name:  'serviceListSection',
  title: 'Service List / Menu',
  type:  'object',
  fields: [
    defineField({ name: 'eyebrow',  title: 'Eyebrow',  type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'subtext',  title: 'Subtext',  type: 'text', rows: 2 }),
    defineField({
      name:  'columns',
      title: 'Columns',
      type:  'number',
      options: { list: [{ title: '1 column', value: 1 }, { title: '2 columns', value: 2 }] },
      initialValue: 2,
    }),
    defineField({
      name:  'services',
      title: 'Services',
      type:  'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'name',        title: 'Name',        type: 'string', validation: R => R.required() }),
          defineField({ name: 'description', title: 'Description', type: 'string' }),
          defineField({ name: 'price',       title: 'Price',       type: 'string', description: 'e.g. $45' }),
          defineField({ name: 'from',        title: 'Show "from" before price', type: 'boolean', initialValue: false }),
        ],
        preview: { select: { title: 'name', subtitle: 'price' } },
      }],
    }),
    defineField({
      name: 'variant', title: 'Background', type: 'string',
      options: { list: VARIANT_OPTIONS }, initialValue: 'default',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) { return { title: `Services — ${title ?? 'Untitled'}` } },
  },
})

export const hoursLocationSectionType = defineType({
  name:  'hoursLocationSection',
  title: 'Hours + Location',
  type:  'object',
  fields: [
    defineField({ name: 'eyebrow',  title: 'Eyebrow',  type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({
      name:  'hours',
      title: 'Hours',
      type:  'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'day',    title: 'Day(s)', type: 'string', validation: R => R.required() }),
          defineField({ name: 'time',   title: 'Hours',  type: 'string', description: 'e.g. 9:00 AM – 5:00 PM' }),
          defineField({ name: 'closed', title: 'Closed', type: 'boolean', initialValue: false }),
        ],
        preview: { select: { title: 'day', subtitle: 'time' } },
      }],
    }),
    defineField({ name: 'address',     title: 'Address',       type: 'text', rows: 2 }),
    defineField({ name: 'phone',       title: 'Phone',         type: 'string' }),
    defineField({ name: 'email',       title: 'Email',         type: 'string' }),
    defineField({ name: 'mapEmbedUrl', title: 'Map embed URL', type: 'url', description: 'Google Maps "embed" iframe src (optional)' }),
    defineField({
      name: 'variant', title: 'Background', type: 'string',
      options: { list: VARIANT_OPTIONS }, initialValue: 'default',
    }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'address' },
    prepare({ title, subtitle }) {
      return { title: `Hours + Location — ${title ?? 'Untitled'}`, subtitle }
    },
  },
})

export const gallerySectionType = defineType({
  name:  'gallerySection',
  title: 'Gallery',
  type:  'object',
  fields: [
    defineField({ name: 'eyebrow',  title: 'Eyebrow',  type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'subtext',  title: 'Subtext',  type: 'text', rows: 2 }),
    defineField({
      name:  'columns',
      title: 'Columns',
      type:  'number',
      options: { list: [2, 3, 4].map(v => ({ title: `${v} columns`, value: v })) },
      initialValue: 3,
    }),
    defineField({
      name:  'aspect',
      title: 'Image shape',
      type:  'string',
      options: { list: [
        { title: 'Square',    value: '1 / 1' },
        { title: 'Landscape', value: '4 / 3' },
        { title: 'Portrait',  value: '3 / 4' },
        { title: 'Wide',      value: '16 / 9' },
      ]},
      initialValue: '1 / 1',
    }),
    defineField({
      name:  'images',
      title: 'Images',
      type:  'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'image',   title: 'Image',   type: 'image', options: { hotspot: true }, validation: R => R.required() }),
          defineField({ name: 'alt',     title: 'Alt text', type: 'string' }),
          defineField({ name: 'caption', title: 'Caption',  type: 'string' }),
        ],
        preview: { select: { title: 'caption', subtitle: 'alt', media: 'image' } },
      }],
    }),
    defineField({
      name: 'variant', title: 'Background', type: 'string',
      options: { list: VARIANT_OPTIONS }, initialValue: 'default',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) { return { title: `Gallery — ${title ?? 'Untitled'}` } },
  },
})

export const faqSectionType = defineType({
  name:  'faqSection',
  title: 'FAQ',
  type:  'object',
  fields: [
    defineField({ name: 'eyebrow',  title: 'Eyebrow',  type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'subtext',  title: 'Subtext',  type: 'text', rows: 2 }),
    defineField({
      name:  'single',
      title: 'Only one answer open at a time',
      type:  'boolean',
      initialValue: false,
    }),
    defineField({
      name:  'items',
      title: 'Questions',
      type:  'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'q', title: 'Question', type: 'string', validation: R => R.required() }),
          defineField({ name: 'a', title: 'Answer',   type: 'text', rows: 3, validation: R => R.required() }),
        ],
        preview: { select: { title: 'q' } },
      }],
    }),
    defineField({
      name: 'variant', title: 'Background', type: 'string',
      options: { list: VARIANT_OPTIONS }, initialValue: 'default',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) { return { title: `FAQ — ${title ?? 'Untitled'}` } },
  },
})
