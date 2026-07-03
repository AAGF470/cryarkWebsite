// ═══════════════════════════════════════════════════════════════════════════
//  FREELANCE SITE CONFIG  —  this is the ONLY file you edit per client.
//  Fill it in, `npm run dev:freelance` to preview, `build:freelance` to ship.
//  Everything below drives the page; delete optional sections to hide them.
// ═══════════════════════════════════════════════════════════════════════════
export default {
  // Brand — pick a style recipe + ONE accent color; the recipe derives the
  // rest (typography, neutrals, rhythm, corners, shadows, expressions).
  // Recipes: editorial-paper · bold-trade · dark-cinematic · coastal-light · workshop
  brand:  { name: 'Maria Delgado', accent: '#2f6f5e', recipe: 'coastal-light' },
  title:  'Maria Delgado — Bookkeeping for Small Businesses',
  phone:  '(555) 555-0100',            // shown as tap-to-call; '' to hide
  email:  '',                          // '' = phone-only business
  area:   'Greater Boston',

  hero: {
    eyebrow:  'Independent bookkeeper · Greater Boston',
    headline: 'Clean books, zero stress.',
    subtext:  'Friendly, reliable bookkeeping for small businesses and sole proprietors — so you can get back to running your business.',
    primaryCta:   { label: 'Get in touch', href: '#contact' },
    secondaryCta: { label: 'What I do',    href: '#services' },
  },

  // 3–6 services (icons: check, star, shield, zap, clock, users, wrench, mail, globe, layers)
  services: {
    eyebrow:  'What I do',
    headline: 'Services',
    items: [
      { icon: 'check',  title: 'Monthly bookkeeping', body: 'Categorized transactions, reconciliations, and clean monthly statements you can actually read.' },
      { icon: 'clock',  title: 'Catch-up & cleanup',  body: 'Behind on the books? I\'ll get months (or years) of backlog sorted and current.' },
      { icon: 'shield', title: 'Tax-ready reports',   body: 'Year-end packages your accountant will thank you for — no scramble in April.' },
    ],
  },

  // Optional — delete to hide
  about: {
    eyebrow:  'About',
    headline: 'A real person who picks up the phone',
    body:     'I\'ve kept the books for local shops, contractors, and freelancers for over a decade. No call centers, no jargon — just clear numbers and honest advice, from someone who works with you directly.',
  },

  faq: {
    eyebrow:  'Questions',
    headline: 'Good to know',
    items: [
      { q: 'What software do you use?', a: 'QuickBooks and Xero, mostly — or whatever you already have. I meet you where you are.' },
      { q: 'How do we get started?',    a: 'Give me a call. We\'ll talk through your situation and I\'ll send a simple, fixed quote.' },
    ],
  },

  contact: {
    eyebrow:  'Get in touch',
    headline: 'Let\'s talk about your books.',
    subtext:  'A quick call is the easiest way to start — no obligation.',
  },
}
