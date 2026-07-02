// ---------------------------------------------------------------------------
// Guillen Solutions — shared content data.
// Pricing, add-ons, and ownership promises used across Home + Configurator.
// Keeping it here means the numbers live in exactly one place.
// ---------------------------------------------------------------------------

export const CONTACT_EMAIL = 'contact@guillensolutions.com'

export const PACKAGES = [
  {
    id: 'freelance',
    tag: 'Solo & freelancers',
    name: 'Freelance / Solo',
    price: '$600',
    period: 'first year, all-in',
    description: 'A polished professional template — a credible presence for independent professionals, without the custom-build cost.',
    note: 'After year one: $200/yr hosting + domain renewal.',
    features: [
      'Up to 5 pages — 3 designed for you + 2 self-serve',
      'Professional template design',
      'Self-serve content — edit it yourself',
      'Managed hosting — SSL, backups, uptime',
      'Domain registered in your name',
      'Everything is yours to keep',
    ],
    firstYear: 600,
    recurring: 200,
  },
  {
    id: 'standard',
    badge: 'Most popular',
    tag: 'Custom in-house design',
    name: 'Standard Business',
    price: '$800',
    period: 'first year, all-in',
    description: 'Our in-house design system — fast, modern, and easy to update.',
    note: 'After year one: $300/yr hosting + domain renewal.',
    features: [
      'Up to 6 designed pages — home, about, services…',
      'Up to 25 items — products, menu items, listings',
      'Unlimited item groups — organize however you like',
      'Managed hosting — SSL, backups, uptime',
      'Domain registered in your name',
      'Edit it yourself, anytime — everything is yours',
    ],
    featured: true,
    firstYear: 800,
    recurring: 300,
  },
  {
    id: 'wordpress',
    tag: 'Maximum portability',
    name: 'WordPress Business',
    price: '$1,150',
    period: 'first year, all-in',
    description: "Built on the world's most widely-supported platform — maintainable by any developer.",
    note: 'After year one: $300/yr hosting + domain renewal.',
    features: [
      'Up to 6 designed pages — home, about, services…',
      'Up to 25 items — products, menu items, listings',
      'Unlimited item groups — organize however you like',
      'Managed hosting — SSL, backups, uptime',
      'Domain registered in your name',
      'Maximum portability — not tied to us',
    ],
    firstYear: 1150,
    recurring: 300,
  },
]

// kind: 'onetime'  → one-time, adds to first-year all-in
//       'recurring' → adds to the recurring yearly total
//       'quoted'    → shown but not summed (needs a per-business quote)
//       'per-unit'  → priced per item/page; quantity chosen in the configurator
export const ADDONS = [
  {
    id: 'phone',
    name: 'Business Phone Line',
    price: 'from $180/yr',
    cadence: 'Recurring',
    body: 'A dedicated business number that forwards to your phone, with voicemail and call history. Yours and portable.',
    amount: 180, kind: 'recurring', approx: true,
  },
  {
    id: 'email',
    name: 'Business Email & Workspace',
    price: 'quoted',
    cadence: 'Recurring',
    body: 'Custom email at your domain via Google Workspace — inbox setup, or migration from an old Office/email account. Your account, quoted as a flat yearly number.',
    amount: null, kind: 'quoted',
  },
  {
    id: 'logo',
    name: 'Logo & Business Cards',
    price: '$225',
    cadence: 'One-time',
    body: 'A professional logo (two formats) plus a matching business-card design, with a pickup order set up at a local print shop in your name.',
    amount: 225, kind: 'onetime',
  },
  {
    id: 'form',
    name: 'Custom Inquiry Form',
    price: '$250',
    cadence: 'One-time',
    body: 'A contact/quote form that sends inquiries straight to your inbox. Submissions go to you — none of your customer data sits with us.',
    amount: 250, kind: 'onetime',
  },
  {
    id: 'gbp',
    name: 'Google Business Profile',
    price: '$300',
    cadence: 'One-time',
    body: 'We get your business on Google Maps — or clean up your existing presence. All-inclusive: a guided walkthrough of creating and verifying your Google Business Profile, set up in your name.',
    amount: 300, kind: 'onetime',
  },
  {
    id: 'items',
    name: 'Extra Items (beyond 25)',
    price: '$7/item',
    cadence: 'Per item',
    body: 'Need more than the 25 included? We add each product, menu item, or listing for you. Add a Spanish version of any item for $2 more (both languages in one entry).',
    amount: 7, kind: 'per-unit', unit: 'item', unitPlural: 'items',
  },
  {
    id: 'spanish',
    name: 'Spanish Pages',
    price: '$30/page',
    cadence: 'Post-launch',
    body: 'Full pages hand-translated by a native Spanish speaker (never machine-translated), with the layout adjusted to stay clean. Items are $2 each; pages are priced here.',
    amount: 30, kind: 'per-unit', unit: 'page', unitPlural: 'pages',
  },
]

export const GROWTH_NOTE =
  'As your site grows: additional pages or redesigns are $75–200 each, quoted by page depth — so you only pay when you actually expand.'

// "You can do it yourself, free" — the fees are only for hands-off clients.
export const CMS_NOTE =
  'Because you own it, you can add or remove products and adjust page layouts yourself, anytime — no coding required, and no charge. The add-on fees are only for when you\'d rather we handle it for you.'

export const CMS_LEAD =
  'A CMS is just the screen where you log in to update your own site — change your words, prices, and photos, no code involved. Most are bloated and confusing. Yours is custom-built: it shows only the handful of things you actually change (prices, photos, products, hours) and hides everything else. A simple, safe place to run your own site — impossible to break, and yours to keep.'

export const CMS_POINTS = [
  { icon: 'layers', title: 'Only what you need',        body: 'We expose the exact controls your business uses and hide the rest — no overwhelming admin, no fields you\'ll never open.' },
  { icon: 'wrench', title: 'Tailored to your business', body: 'Products, menu, listings, hours — the CMS is shaped around what you actually manage, like a custom template built just for you.' },
  { icon: 'shield', title: 'Impossible to break',       body: 'Design and layout are locked into the components, so editing content can never break how your site looks. Safe to hand to anyone on your team.' },
  { icon: 'check',  title: 'Edit it yourself — free',   body: 'Add, change, and remove content anytime at no charge. Our fees only apply when you\'d rather we make the change for you.' },
]

export const SECURITY_LEAD =
  'We build on a headless, dynamic-static architecture: the public website and your actual content live in separate places, and your data is backed up on storage kept apart from the live server. So the public server is disposable — if it ever fails or is attacked, your content is untouched. We could wipe it entirely and lose nothing but a little uptime, re-pulling your data and redeploying in a matter of hours.'

export const SECURITY_POINTS = [
  { icon: 'layers', title: 'Separated by design',   body: 'Your content and data live on their own backed-up storage — not on the public-facing server that visitors hit.' },
  { icon: 'shield', title: 'Backups kept apart',    body: 'Independent backups are stored separately from the live server, so a failure or attack on one never reaches the other.' },
  { icon: 'clock',  title: 'Back in hours',         body: 'If the public server is wiped, we re-pull your data and redeploy — your site returns in hours, with nothing lost but a little uptime.' },
  { icon: 'zap',    title: 'Nuke-proof by design',  body: 'Headless and statically served, the public site is disposable — we can rebuild the whole thing from your protected data anytime.' },
]

// Plain-English "Pages vs. Items" explainer.
export const PAGES_ITEMS = {
  intro:
    'Think of your website like a restaurant. The pages are the rooms — the entrance, the dining room, the “about us” wall. The items are the dishes on the menu: you can have a lot of them, and they all share one menu design.',
  pages:
    'Pages are the parts we design by hand — your home page, about page, services page, or a page showing all your products. Your package includes 6 pages, enough for most businesses.',
  items:
    'Items are the individual things those pages show — a single product, one menu item, one listing. We design the look once, and every item you add uses it automatically. Your package includes 25 items, and you can add more anytime.',
  savings:
    'Why this saves you money: a catalog of 40 products is 1 page plus 40 items — not 40 pages. You pay once for the layout, then a little to add each product. That’s how you get a full catalog affordably — and you can group items however you like, at no extra charge.',
}

export const OWNERSHIP = [
  'You own everything: your domain, website, content, email, phone number, and every login.',
  'We hand you the keys — take your assets and leave anytime. No lock-in, no ransom.',
  'We never manage or authorize your ad spend, or handle your money.',
  'Transparent pricing, including any third-party costs (Google, domain) billed to you directly.',
  'Every service is a defined, fixed-scope deliverable. Tailored combinations are quoted per business.',
]
