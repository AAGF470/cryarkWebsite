import { Link } from 'react-router-dom'
import './Home.css'
import {
  HeroSection,
  FeatureGrid,
  ImageText,
  Steps,
  PricingPlans,
  ServiceList,
} from '@shared/sections'
import PackageConfigurator from '../components/PackageConfigurator.jsx'
import { PACKAGES, ADDONS, OWNERSHIP, GROWTH_NOTE, CONTACT_EMAIL, PAGES_ITEMS, CMS_NOTE, CMS_LEAD, CMS_POINTS, SECURITY_LEAD, SECURITY_POINTS } from '../data'

// Map shared pricing data → PricingPlans plan shape
const PLANS = PACKAGES.map(p => ({
  badge:       p.badge,
  tag:         p.tag,
  name:        p.name,
  price:       p.price,
  period:      p.period,
  description: p.description,
  note:        p.note,
  features:    p.features,
  featured:    p.featured,
  cta:         { label: 'Build your quote', href: '#configure', variant: p.featured ? 'solid' : 'ghost-bordered' },
}))

const ADDON_SERVICES = ADDONS.map(a => ({
  name:        a.name,
  description: a.body,
  price:       a.price,
}))

const WHAT_WE_DO = [
  { icon: 'star',   title: 'Custom design',            body: 'A website designed around your business — built on our in-house component system, fast and easy to update.' },
  { icon: 'shield', title: 'Managed hosting & security', body: 'SSL, backups, and uptime handled for you. You never have to think about servers or certificates.' },
  { icon: 'check',  title: 'You own everything',        body: 'Domain, content, accounts, and logins are all in your name from day one. Leave anytime with everything.' },
  { icon: 'users',  title: 'Guidance, in plain English', body: 'We set it up, explain it, and hand you the keys — plus honest advice on your digital presence.' },
]

const STEPS = [
  { title: 'Choose a package', body: 'Pick a base package and add only the pieces you need. The configurator gives you a transparent, all-in number.' },
  { title: 'We design & build', body: 'We build your site on our component system (or WordPress), sized to your business and ready for your content.' },
  { title: 'We set it up & explain it', body: 'Hosting, domain, SSL, and accounts — all configured in your name. Then we walk you through how everything works.' },
  { title: 'We hand you the keys', body: 'You own the domain, content, logins, and every asset. No lock-in, and we never touch your ad spend or your money.' },
]

const LOCATIONS = [
  { icon: 'globe', title: 'Remote-first',      body: 'We work with small businesses anywhere in the US — most of the process happens over a call and email.' },
  { icon: 'map',   title: 'On-site in Boston', body: 'In-person consultations and setup are available across the Greater Boston area.' },
  { icon: 'zap',   title: 'Everywhere else, remote', body: 'Long Island, NYC, and beyond — same full service, handled remotely over calls and screen-share.' },
  { icon: 'users', title: 'English & Español', body: 'We work in both English and Spanish, so nothing gets lost in translation.' },
]

const LIBRARY_PEEK = [
  { icon: 'star',   title: 'Heroes & banners',   body: 'Bold openers and call-to-action banners that set the tone.' },
  { icon: 'layers', title: 'Pricing & packages', body: 'Clear pricing tables and service menus — like the ones on this page.' },
  { icon: 'map',    title: 'Galleries & FAQs',   body: 'Project galleries, testimonials, and accessible FAQ accordions.' },
  { icon: 'mail',   title: 'Contact & forms',    body: 'Inquiry forms and hours/location blocks that route straight to you.' },
]

const CheckMark = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="2 7.5 5.5 11 12 3" />
  </svg>
)

const KeyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="8" cy="9" r="5" />
    <line x1="11.5" y1="12.5" x2="20" y2="21" />
    <line x1="17" y1="18" x2="19" y2="16" />
  </svg>
)

export default function Home() {
  return (
    <>
      <HeroSection
        eyebrow="Guillen Solutions · You own everything"
        headline="Get your business online — and own every piece of it."
        subtext="Choose a package, add only what you need. We set everything up, explain it, and hand you the keys — you own your domain, accounts, content, and logins. No lock-in, and we never touch your ad spend or your money."
        ctas={[
          { label: 'See packages',     href: '#packages',  variant: 'solid' },
          { label: 'Build your quote', href: '#configure', variant: 'ghost' },
        ]}
        layout="left"
      />

      <FeatureGrid
        eyebrow="What we do"
        headline="Honest web services, start to finish"
        subtext="Design, hosting, security, and guidance — with one promise underneath all of it: everything we build is yours."
        items={WHAT_WE_DO}
        columns={4}
        variant="alt"
      />

      <ImageText
        eyebrow="Why we do it"
        headline="We built the opposite of a bad deal"
        body="A business we know was charged $2,800 for a website they never actually owned — their leads were siphoned to competitors who paid more, and their domain, content, and profiles were held hostage. We started Guillen Solutions to do the exact opposite: honest, upfront, and yours to keep."
        image="/img/sample-1.svg"
        imageAlt="Guillen Solutions"
        layout="image-right"
        cta={{ label: 'Read our story', href: '/about', variant: 'ghost-bordered' }}
        variant="default"
      />

      <Steps
        eyebrow="How it works"
        headline="From package to keys in four steps"
        items={STEPS}
        variant="alt"
      />

      <div id="packages">
        <PricingPlans
          eyebrow="Packages"
          headline="Flat, all-in pricing"
          subtext="Three tiers, one flat first-year price covering design, hosting, and your domain — then a low yearly rate for hosting + domain renewal, billed transparently. Current pricing is an intentional market-entry rate; existing clients stay grandfathered."
          plans={PLANS}
          variant="default"
        />
      </div>

      <ServiceList
        eyebrow="Add-ons"
        headline="Pick only what fits"
        subtext="Optional extras — add any to a package, or none. Most of this you can do yourself in the CMS for free; these are for when you'd rather we handle it. Tailored combinations are quoted per business."
        services={ADDON_SERVICES}
        columns={2}
        variant="alt"
      />
      <div className="gs-inline-note-wrap">
        <p className="gs-note">{GROWTH_NOTE}</p>
      </div>

      {/* Pages vs. Items — plain-English explainer */}
      <section className="section section--default gs-explain">
        <div className="section-container">
          <p className="section-eyebrow">Plain English</p>
          <h2 className="section-title">Pages vs. Items</h2>
          <p className="section-sub">{PAGES_ITEMS.intro}</p>
          <div className="gs-explain__grid">
            <div className="gs-explain__card">
              <span className="gs-explain__badge">Pages · 6 included</span>
              <h3 className="gs-explain__card-title">The rooms</h3>
              <p>{PAGES_ITEMS.pages}</p>
            </div>
            <div className="gs-explain__card">
              <span className="gs-explain__badge">Items · 25 included</span>
              <h3 className="gs-explain__card-title">The dishes</h3>
              <p>{PAGES_ITEMS.items}</p>
            </div>
          </div>
          <p className="gs-note">{PAGES_ITEMS.savings}</p>
          <div className="gs-cms-callout">
            <span className="gs-cms-callout__mark"><KeyIcon /></span>
            <p><strong>You can do it yourself — free.</strong> {CMS_NOTE}</p>
          </div>
        </div>
      </section>

      {/* Your CMS — curated, no-coding, no-hostage */}
      <FeatureGrid
        eyebrow="Your CMS"
        headline="A content system made for you — and owned by you"
        subtext={CMS_LEAD}
        items={CMS_POINTS}
        columns={4}
        variant="alt"
      />

      {/* Security & backups — headless, separated storage, fast recovery */}
      <FeatureGrid
        eyebrow="Security & backups"
        headline="Built so your data can't be lost"
        subtext={SECURITY_LEAD}
        items={SECURITY_POINTS}
        columns={4}
        variant="default"
      />

      {/* Component library snippet */}
      <section className="section section--default gs-libpeek">
        <div className="section-container">
          <p className="section-eyebrow">Built-in toolkit</p>
          <h2 className="section-title">Your site is built from a real component library</h2>
          <p className="section-sub">
            Every Guillen Solutions site is assembled from the same tested, mobile-ready,
            light-and-dark component set — the one this very page uses. One theme file morphs
            it into completely different looks: the same system powers three sites that look
            nothing alike — Cryark (cinematic), a university CubeSat team, and guillen.studio.
            That's how you get custom-tier design at near-template cost.
          </p>
          <div className="gs-libpeek__grid">
            {LIBRARY_PEEK.map(item => (
              <div key={item.title} className="gs-libpeek__card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
          <Link to="/components" className="gs-libpeek__cta">Explore the full component library →</Link>
        </div>
      </section>

      <FeatureGrid
        eyebrow="Where we work"
        headline="Local when you want us, remote when you don't"
        items={LOCATIONS}
        columns={4}
        variant="alt"
      />

      {/* Configuration form */}
      <section id="configure" className="section section--default gs-configure">
        <div className="section-container">
          <p className="section-eyebrow">Build your quote</p>
          <h2 className="section-title">Configure your setup</h2>
          <p className="section-sub">
            Choose a package and add-ons to see a transparent, all-in estimate. Nothing is charged —
            it's just a starting point we'll confirm in writing.
          </p>
          <PackageConfigurator />
        </div>
      </section>

      {/* What you own / what we don't do */}
      <section className="section section--alt">
        <div className="section-container">
          <p className="section-eyebrow">The promise</p>
          <h2 className="section-title">What you own — and what we don't do</h2>
          <ul className="gs-own-list">
            {OWNERSHIP.map(line => (
              <li key={line} className="gs-own-item">
                <span className="gs-own-item__mark"><CheckMark /></span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--accent gs-home-cta">
        <div className="section-container">
          <p className="section-eyebrow">Ready?</p>
          <h2 className="section-title">Let's get your business online — the honest way.</h2>
          <p className="section-sub">
            Build a quote in a minute, or reach out and we'll talk it through. English or Español.
          </p>
          <div className="gs-home-cta__actions">
            <a className="gs-btn-solid" href="#configure">Build your quote</a>
            <a className="gs-btn-ghost" href={`mailto:${CONTACT_EMAIL}`}>Get in touch</a>
          </div>
        </div>
      </section>
    </>
  )
}
