import { defineType, defineField } from 'sanity'

// ---------------------------------------------------------------------------
// pageConfig schema
//
// One document per page that needs editable hero content.
// Identified by page_id (e.g. "guillen_work", "guillen_devlog").
//
// Supported fields:
//   bg_image       — hero background image, fades into dark site bg at bottom
//   title          — optional title override (default: "Work" / "Devlog")
//   description    — optional short description below the title
//   featured_product — pin a specific project to the top of the Work page
//   featured_entry   — pin a specific devlog entry as the hero (Devlog page)
// ---------------------------------------------------------------------------

export const pageConfigType = defineType({
  name:  'pageConfig',
  title: 'Page Config',
  type:  'document',

  fields: [
    defineField({
      name:  'page_id',
      title: 'Page ID',
      type:  'string',
      description: 'Unique key for this page. e.g. guillen_work · guillen_devlog · cryark_lab',
      validation: R => R.required(),
    }),

    defineField({
      name:    'bg_image',
      title:   'Hero Background Image',
      type:    'image',
      description: 'Wide image shown behind the page header. Fades into the site background at the bottom.',
      options: { hotspot: true },
    }),

    defineField({
      name:  'title',
      title: 'Page Title Override',
      type:  'string',
      description: 'Replaces the default page title. Leave blank to keep the default.',
    }),

    defineField({
      name:  'description',
      title: 'Page Description',
      type:  'text',
      rows:  2,
      description: 'Short text displayed below the title in the header.',
    }),

    defineField({
      name:  'featured_product',
      title: 'Featured Project',
      type:  'reference',
      to:    [{ type: 'product' }],
      description: 'Pin one project as a featured hero card at the top of the Work page.',
    }),

    defineField({
      name:  'featured_entry',
      title: 'Featured Devlog Entry',
      type:  'reference',
      to:    [{ type: 'labEntry' }],
      description: 'Pin a specific devlog entry as the featured hero on the Devlog page. Leave blank to auto-use the most recent.',
    }),
  ],

  preview: {
    select: { title: 'page_id', subtitle: 'title' },
    prepare({ title, subtitle }) {
      return {
        title:    title    ?? 'Untitled page config',
        subtitle: subtitle ?? '',
      }
    },
  },
})
