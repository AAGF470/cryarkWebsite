// ═══════════════════════════════════════════════════════════════════════════
//  Payload config — pilot CMS for guillen.studio.
//
//  This is the *curated editing surface*: clients edit structured BLOCKS whose
//  fields we define here — never raw HTML, layout, or code. Blocks map 1:1 to
//  @aagf470/ui section components (see adapters/PayloadPage.jsx), so the CMS and
//  the rendered site share one vocabulary.
//
//  ⚠️ INITIALIZATION SCAFFOLD — not yet installed/run. Generate the project with
//  `npx create-payload-app@latest` (Postgres, blank), then drop this config in
//  and confirm imports against the Payload 3.x version you install. Blocks below
//  are the durable part; only the buildConfig plumbing is version-sensitive.
// ═══════════════════════════════════════════════════════════════════════════
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

// ── Curated section blocks (mirror @aagf470/ui) ─────────────────────────────
const ICONS = ['check', 'star', 'shield', 'zap', 'clock', 'users', 'wrench', 'mail', 'globe', 'layers', 'home', 'fence', 'map']
  .map(v => ({ label: v, value: v }))

const hero = {
  slug: 'hero',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'headline', type: 'text', required: true },
    { name: 'subtext', type: 'textarea' },
    { name: 'ctas', type: 'array', maxRows: 2, fields: [
      { name: 'label', type: 'text' }, { name: 'href', type: 'text' },
    ] },
  ],
}
const featureGrid = {
  slug: 'featureGrid',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'headline', type: 'text' },
    { name: 'subtext', type: 'textarea' },
    { name: 'items', type: 'array', fields: [
      { name: 'icon', type: 'select', options: ICONS },
      { name: 'title', type: 'text', required: true },
      { name: 'body', type: 'textarea' },
    ] },
  ],
}
const gallery = {
  slug: 'gallery',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'headline', type: 'text' },
    { name: 'images', type: 'array', fields: [
      { name: 'image', type: 'upload', relationTo: 'media' },
      { name: 'caption', type: 'text' },
    ] },
  ],
}
const faq = {
  slug: 'faq',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'headline', type: 'text' },
    { name: 'items', type: 'array', fields: [
      { name: 'q', type: 'text', required: true },
      { name: 'a', type: 'textarea', required: true },
    ] },
  ],
}
const ctaBanner = {
  slug: 'ctaBanner',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'headline', type: 'text', required: true },
    { name: 'subtext', type: 'textarea' },
    { name: 'cta', type: 'group', fields: [
      { name: 'label', type: 'text' }, { name: 'href', type: 'text' },
    ] },
  ],
}
// Extend with: steps, imageText, pricingPlans, serviceList, hoursLocation,
// testimonials, contactSection — same pattern, matching @aagf470/ui props.
const SECTION_BLOCKS = [hero, featureGrid, gallery, faq, ctaBanner]

// ── Access: curated + safe ──────────────────────────────────────────────────
// Editors (clients) get content collections only; Users/config stay admin-only.
const adminOnly = ({ req }: any) => req.user?.role === 'admin'

const Users = {
  slug: 'users',
  auth: true,
  access: { create: adminOnly, delete: adminOnly },
  fields: [
    { name: 'role', type: 'select', defaultValue: 'editor',
      options: [{ label: 'Admin', value: 'admin' }, { label: 'Editor', value: 'editor' }] },
  ],
}
const Media = {
  slug: 'media',
  upload: true,
  fields: [{ name: 'alt', type: 'text' }],
}
const Pages = {
  slug: 'pages',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'layout', type: 'blocks', blocks: SECTION_BLOCKS },
  ],
}
const Posts = {
  slug: 'posts',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText' },
    { name: 'publishedAt', type: 'date' },
  ],
}

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  secret: process.env.PAYLOAD_SECRET!,
  editor: lexicalEditor({}),
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } }),
  collections: [Users, Media, Pages, Posts],
})
