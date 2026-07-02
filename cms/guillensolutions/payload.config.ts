// ═══════════════════════════════════════════════════════════════════════════
//  Payload CMS — guillensolutions.com
//
//  The curated editing surface for the (live, in-progress) Guillen Solutions
//  site. Pages are built from the shared section blocks: editors change CONTENT
//  (text, images, prices…) and can add / remove / reorder blocks — but never the
//  structure, styling, or code. Users collection is admin-only, so a client
//  editor sees only Pages / Posts / Media.
//
//  Drop this into a `create-payload-app` project (see README). `../blocks` is the
//  shared block set — copy it in beside this file when building the image.
// ═══════════════════════════════════════════════════════════════════════════
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { SECTION_BLOCKS } from './blocks'

const isAdmin = ({ req }: any) => req.user?.role === 'admin'
// Editors can read/write content; only admins manage users + delete.
const editorCanWrite = ({ req }: any) => Boolean(req.user)

const Users = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  access: { create: isAdmin, delete: isAdmin, update: isAdmin, read: () => true },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'role', type: 'select', defaultValue: 'editor', access: { update: isAdmin },
      options: [{ label: 'Admin', value: 'admin' }, { label: 'Editor', value: 'editor' }] },
  ],
}

const Media = {
  slug: 'media',
  upload: { staticDir: 'media', imageSizes: [{ name: 'card', width: 768 }, { name: 'hero', width: 1600 }] },
  access: { read: () => true },
  fields: [{ name: 'alt', type: 'text' }],
}

const Pages = {
  slug: 'pages',
  admin: { useAsTitle: 'title' },
  access: { read: () => true, create: editorCanWrite, update: editorCanWrite, delete: isAdmin },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true,
      admin: { description: 'URL path, e.g. "home", "about". The site fetches pages by this.' } },
    { name: 'layout', type: 'blocks', blocks: SECTION_BLOCKS,
      admin: { description: 'Add, reorder, or remove sections. Editing here changes content only — never the design.' } },
  ],
}

const Posts = {
  slug: 'posts',
  admin: { useAsTitle: 'title' },
  access: { read: () => true, create: editorCanWrite, update: editorCanWrite, delete: isAdmin },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
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
  collections: [Pages, Posts, Media, Users],
  cors: [process.env.SITE_URL || ''].filter(Boolean),      // allow the site to fetch the API
  csrf: [process.env.SITE_URL || ''].filter(Boolean),
})
