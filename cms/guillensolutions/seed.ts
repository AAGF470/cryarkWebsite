// Seed a starter Home page so the CMS has editable content on first boot.
// Run once after the DB is up:  npx tsx seed.ts   (or wire as an npm script)
// Idempotent-ish: skips if a "home" page already exists.
import { getPayload } from 'payload'
import config from './payload.config'

async function run() {
  const payload = await getPayload({ config })

  const existing = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 })
  if (existing.docs.length) { console.log('home page already exists — skipping'); process.exit(0) }

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      slug: 'home',
      layout: [
        { blockType: 'hero',
          eyebrow: 'Guillen Solutions · Sites you can update yourself',
          headline: 'Get your business online — and own every piece of it.',
          subtext: 'We build you a custom website you can actually run yourself, then hand you the keys. No lock-in.',
          layout: 'left',
          ctas: [{ label: 'See packages', href: '#packages', variant: 'solid' }] },
        { blockType: 'featureGrid',
          eyebrow: 'What we do', headline: 'Honest web services, start to finish', columns: '4',
          items: [
            { icon: 'star', title: 'A custom-designed site', body: 'Designed around your business — custom-tier looks, not a template.' },
            { icon: 'layers', title: 'Update it yourself', body: 'A simple control panel that shows only what you actually change.' },
            { icon: 'shield', title: 'Managed hosting & security', body: 'SSL, backups, and uptime handled for you.' },
            { icon: 'check', title: 'You own everything', body: 'Domain, content, and logins in your name from day one.' },
          ],
          variant: 'alt' },
        { blockType: 'faq',
          eyebrow: 'Questions', headline: 'Good to know',
          items: [{ q: 'Can I edit it myself?', a: 'Yes — this page is edited in exactly the CMS your site will use.' }],
          variant: 'default' },
        { blockType: 'ctaBanner',
          eyebrow: 'Ready?', headline: "Let's get your business online.",
          subtext: 'Reach out and we\'ll talk it through.',
          cta: { label: 'Get in touch', href: '/#contact', variant: 'solid' },
          variant: 'accent' },
      ],
    },
  })
  console.log('seeded home page ✓')
  process.exit(0)
}
run().catch(e => { console.error(e); process.exit(1) })
