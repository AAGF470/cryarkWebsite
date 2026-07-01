import {
  ImageText,
  FeatureGrid,
  CtaBanner,
} from '@shared/sections'
import { OWNERSHIP } from '../data'

// ---------------------------------------------------------------------------
// About — why Guillen Solutions exists. The origin story and the mission.
// ---------------------------------------------------------------------------

const VALUES = [
  { icon: 'check',  title: 'Honest & upfront',   body: 'Fixed-scope deliverables and transparent pricing — including any third-party costs, billed to you directly.' },
  { icon: 'shield', title: 'You own everything',  body: 'Domain, website, content, email, phone, and logins are all in your name. Take them and leave anytime.' },
  { icon: 'star',   title: 'Design & hosting',    body: 'We design the site, manage hosting and security, and keep it fast — so you can focus on your business.' },
  { icon: 'users',  title: 'Guidance, not gatekeeping', body: 'We explain how everything works and advise on your digital presence — in English or Spanish.' },
]

const CheckMark = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="2 7.5 5.5 11 12 3" />
  </svg>
)

export default function About() {
  return (
    <>
      <header className="gs-intro">
        <div className="gs-intro__inner">
          <p className="gs-intro__eyebrow">About us</p>
          <h1 className="gs-intro__title">Why we do what we do</h1>
          <p className="gs-intro__lead">
            Guillen Solutions exists because we watched a small business get taken advantage of —
            and decided to build the honest alternative.
          </p>
        </div>
      </header>

      <ImageText
        eyebrow="The story"
        headline="The $2,800 lesson"
        body="A business we know was charged $2,800 for web development — and never actually owned any of it. Their leads were taken and handed to other clients who paid more. They didn't own their business profiles, their website design, their code, or their content. And they were being billed $2,800 in continuing service for something that was never theirs. Hearing that story, we set out to do the opposite."
        image="/img/sample-2.svg"
        imageAlt="Guillen Solutions"
        layout="image-left"
        variant="default"
      />

      <FeatureGrid
        eyebrow="What we set out to build"
        headline="Honest, upfront services for small businesses"
        subtext="You own your designs. We provide hosting, design services, security, and guidance on your digital presence. Any content you create is yours — and so are your business profiles."
        items={VALUES}
        columns={4}
        variant="alt"
      />

      <section className="section section--default">
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

      <CtaBanner
        eyebrow="Let's talk"
        headline="Own your online presence."
        subtext="Choose a package, add what you need, and keep every piece of it. English or Español."
        cta={{ label: 'Build your quote', href: '/#configure' }}
        variant="accent"
      />
    </>
  )
}
