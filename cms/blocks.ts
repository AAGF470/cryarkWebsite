// ═══════════════════════════════════════════════════════════════════════════
//  Curated section blocks — the editable surface of the client CMS.
//
//  Each block maps 1:1 to an @aagf470/ui section component. Editors fill in the
//  CONTENT fields here (text, images, arrays); they can add / remove / reorder
//  blocks on a page — but the structure, styling, and device behavior live in
//  the components and can't be touched. That's the "curated, can't-break-it"
//  editing our clients get. Shared across every client CMS (guillensolutions,
//  guillen-studio, cryark, …).
//
//  Payload's field API is stable in shape; confirm exact imports against the
//  Payload 3.x version you install.
// ═══════════════════════════════════════════════════════════════════════════
import type { Block } from 'payload'

const ICONS = ['check', 'star', 'shield', 'zap', 'clock', 'users', 'wrench', 'mail',
  'globe', 'layers', 'home', 'fence', 'map', 'phone', 'droplet', 'wind']
  .map(v => ({ label: v, value: v }))

const cta = (name = 'cta') => ({
  name, type: 'group', fields: [
    { name: 'label', type: 'text' },
    { name: 'href', type: 'text' },
    { name: 'variant', type: 'select', defaultValue: 'solid',
      options: ['solid', 'ghost', 'ghost-bordered'].map(v => ({ label: v, value: v })) },
  ],
})
const variant = {
  name: 'variant', type: 'select', defaultValue: 'default',
  options: [
    { label: 'Default (page bg)', value: 'default' },
    { label: 'Alt (surface bg)', value: 'alt' },
    { label: 'Accent (colored)', value: 'accent' },
  ],
}

export const hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'headline', type: 'text', required: true },
    { name: 'subtext', type: 'textarea' },
    { name: 'layout', type: 'select', defaultValue: 'left',
      options: [{ label: 'Left', value: 'left' }, { label: 'Centered', value: 'centered' }] },
    { name: 'ctas', type: 'array', maxRows: 2, fields: [cta('_')].flatMap(g => g.fields) },
  ],
}

export const featureGrid: Block = {
  slug: 'featureGrid',
  labels: { singular: 'Feature grid', plural: 'Feature grids' },
  fields: [
    { name: 'eyebrow', type: 'text' }, { name: 'headline', type: 'text' },
    { name: 'subtext', type: 'textarea' },
    { name: 'columns', type: 'select', defaultValue: '3', options: ['2', '3', '4'].map(v => ({ label: v, value: v })) },
    { name: 'items', type: 'array', fields: [
      { name: 'icon', type: 'select', options: ICONS },
      { name: 'title', type: 'text', required: true },
      { name: 'body', type: 'textarea' },
    ] },
    variant,
  ],
}

export const steps: Block = {
  slug: 'steps',
  labels: { singular: 'Steps', plural: 'Steps' },
  fields: [
    { name: 'eyebrow', type: 'text' }, { name: 'headline', type: 'text' }, { name: 'subtext', type: 'textarea' },
    { name: 'items', type: 'array', fields: [
      { name: 'title', type: 'text', required: true }, { name: 'body', type: 'textarea' },
    ] },
    variant,
  ],
}

export const imageText: Block = {
  slug: 'imageText',
  labels: { singular: 'Image + text', plural: 'Image + text' },
  fields: [
    { name: 'eyebrow', type: 'text' }, { name: 'headline', type: 'text' },
    { name: 'body', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'imageAlt', type: 'text' },
    { name: 'layout', type: 'select', defaultValue: 'image-right',
      options: [{ label: 'Image right', value: 'image-right' }, { label: 'Image left', value: 'image-left' }] },
    cta(),
    variant,
  ],
}

export const testimonials: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  fields: [
    { name: 'eyebrow', type: 'text' }, { name: 'headline', type: 'text' },
    { name: 'items', type: 'array', fields: [
      { name: 'quote', type: 'textarea', required: true },
      { name: 'author', type: 'text', required: true },
      { name: 'role', type: 'text' }, { name: 'company', type: 'text' },
    ] },
    variant,
  ],
}

export const gallery: Block = {
  slug: 'gallery',
  labels: { singular: 'Gallery', plural: 'Galleries' },
  fields: [
    { name: 'eyebrow', type: 'text' }, { name: 'headline', type: 'text' }, { name: 'subtext', type: 'textarea' },
    { name: 'columns', type: 'select', defaultValue: '3', options: ['2', '3', '4'].map(v => ({ label: v, value: v })) },
    { name: 'aspect', type: 'select', defaultValue: '1 / 1',
      options: [
        { label: 'Square', value: '1 / 1' }, { label: 'Landscape', value: '4 / 3' },
        { label: 'Portrait', value: '3 / 4' }, { label: 'Wide', value: '16 / 9' },
      ] },
    { name: 'images', type: 'array', fields: [
      { name: 'image', type: 'upload', relationTo: 'media', required: true },
      { name: 'alt', type: 'text' }, { name: 'caption', type: 'text' },
    ] },
    variant,
  ],
}

export const faq: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    { name: 'eyebrow', type: 'text' }, { name: 'headline', type: 'text' }, { name: 'subtext', type: 'textarea' },
    { name: 'single', type: 'checkbox', label: 'Only one answer open at a time' },
    { name: 'items', type: 'array', fields: [
      { name: 'q', type: 'text', required: true }, { name: 'a', type: 'textarea', required: true },
    ] },
    variant,
  ],
}

export const pricingPlans: Block = {
  slug: 'pricingPlans',
  labels: { singular: 'Pricing', plural: 'Pricing' },
  fields: [
    { name: 'eyebrow', type: 'text' }, { name: 'headline', type: 'text' }, { name: 'subtext', type: 'textarea' },
    { name: 'plans', type: 'array', fields: [
      { name: 'badge', type: 'text' }, { name: 'tag', type: 'text' }, { name: 'name', type: 'text' },
      { name: 'price', type: 'text', required: true }, { name: 'period', type: 'text' },
      { name: 'description', type: 'textarea' }, { name: 'note', type: 'text' },
      { name: 'features', type: 'array', fields: [{ name: 'text', type: 'text' }] },
      { name: 'featured', type: 'checkbox' },
      cta(),
    ] },
    variant,
  ],
}

export const serviceList: Block = {
  slug: 'serviceList',
  labels: { singular: 'Service list', plural: 'Service lists' },
  fields: [
    { name: 'eyebrow', type: 'text' }, { name: 'headline', type: 'text' }, { name: 'subtext', type: 'textarea' },
    { name: 'columns', type: 'select', defaultValue: '2', options: ['1', '2'].map(v => ({ label: v, value: v })) },
    { name: 'services', type: 'array', fields: [
      { name: 'name', type: 'text', required: true }, { name: 'description', type: 'text' },
      { name: 'price', type: 'text' }, { name: 'from', type: 'checkbox', label: 'Show "from"' },
    ] },
    variant,
  ],
}

export const hoursLocation: Block = {
  slug: 'hoursLocation',
  labels: { singular: 'Hours + location', plural: 'Hours + location' },
  fields: [
    { name: 'eyebrow', type: 'text' }, { name: 'headline', type: 'text' },
    { name: 'hours', type: 'array', fields: [
      { name: 'day', type: 'text', required: true }, { name: 'time', type: 'text' },
      { name: 'closed', type: 'checkbox' },
    ] },
    { name: 'address', type: 'textarea' }, { name: 'phone', type: 'text' }, { name: 'email', type: 'text' },
    { name: 'mapEmbedUrl', type: 'text' },
    variant,
  ],
}

export const ctaBanner: Block = {
  slug: 'ctaBanner',
  labels: { singular: 'CTA banner', plural: 'CTA banners' },
  fields: [
    { name: 'eyebrow', type: 'text' }, { name: 'headline', type: 'text', required: true },
    { name: 'subtext', type: 'textarea' }, cta(), variant,
  ],
}

export const contactSection: Block = {
  slug: 'contactSection',
  labels: { singular: 'Contact', plural: 'Contact' },
  fields: [
    { name: 'eyebrow', type: 'text' }, { name: 'headline', type: 'text' }, { name: 'subtext', type: 'textarea' },
    { name: 'email', type: 'text' }, { name: 'phone', type: 'text' },
    { name: 'showForm', type: 'checkbox', defaultValue: true },
    variant,
  ],
}

// The full curated set a client can add to a page.
export const SECTION_BLOCKS: Block[] = [
  hero, featureGrid, steps, imageText, testimonials, gallery, faq,
  pricingPlans, serviceList, hoursLocation, ctaBanner, contactSection,
]
