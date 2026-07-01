import './Work.css'
import { CtaBanner } from '@shared/sections'

// ---------------------------------------------------------------------------
// Work — client showcase. Emphasizes breadth of reach (3 states) and
// versatility (3 very different industries + visual styles), all built from
// the same component system. Site views are branded placeholders.
// ---------------------------------------------------------------------------

const CLIENTS = [
  {
    name: 'Angel Electrical Services',
    location: 'Dallas, Texas',
    industry: 'Licensed Electrician',
    url: 'angelelectrical.com',
    image: '/img/work/angel-electrical.svg',
    blurb: 'A trust-first site for a residential & commercial electrician — clear service list, service-area coverage, and a quote form that routes straight to the owner.',
    quote: 'Booked three new commercial jobs the first month. The site finally looks as professional as the work we do.',
    author: 'Angel R.',
    role: 'Owner',
  },
  {
    name: 'FencingPatrol',
    location: 'Long Island, New York',
    industry: 'General Contractor',
    url: 'fencingpatrol.com',
    image: '/img/work/fencingpatrol.svg',
    blurb: 'A bold, bilingual site for a family contractor — roofing, fencing, and paving, with a project gallery and a call-first layout in English and Español.',
    quote: 'Sending people one link that shows everything we do — in both languages — changed how we win jobs.',
    author: 'FencingPatrol',
    role: 'Family crew',
  },
  {
    name: 'Cryark Inc',
    location: 'Boston, Massachusetts',
    industry: 'Game Development Studio',
    url: 'cryark.net',
    image: '/img/work/cryark.svg',
    blurb: 'A cinematic, dark-mode studio site for a game & tools developer — product showcases, a devlog, and a component-driven docs system.',
    quote: 'It carries the mood of what we make. The same system that built a contractor site scaled to a full studio presence.',
    author: 'Cryark',
    role: 'Studio team',
  },
]

const REACH = [
  { stat: '3', label: 'states', sub: 'Texas · New York · Massachusetts' },
  { stat: '3', label: 'industries', sub: 'Electrical · Construction · Games' },
  { stat: '1', label: 'component system', sub: 'behind every one of them' },
]

function BrowserFrame({ url, image, alt }) {
  return (
    <div className="work-frame">
      <div className="work-frame__bar">
        <span className="work-frame__dots"><i /><i /><i /></span>
        <span className="work-frame__url">{url}</span>
      </div>
      <img className="work-frame__screen" src={image} alt={alt} loading="lazy" />
    </div>
  )
}

export default function Work() {
  return (
    <>
      <header className="gs-intro">
        <div className="gs-intro__inner">
          <p className="gs-intro__eyebrow">Our work</p>
          <h1 className="gs-intro__title">One toolkit. Every kind of business.</h1>
          <p className="gs-intro__lead">
            From a Dallas electrician to a Long Island contractor to a Boston game studio —
            wildly different industries, three different states, three completely different looks.
            All built from the same component system, and all owned by the client.
          </p>
        </div>
      </header>

      {/* Reach / versatility stats */}
      <section className="section section--default work-reach-sec">
        <div className="section-container">
          <div className="work-reach">
            {REACH.map(r => (
              <div key={r.label} className="work-reach__item">
                <span className="work-reach__stat">{r.stat}</span>
                <span className="work-reach__label">{r.label}</span>
                <span className="work-reach__sub">{r.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client showcases */}
      <section className="section section--alt work-list-sec">
        <div className="section-container">
          {CLIENTS.map((c, i) => (
            <article key={c.name} className={`work-item${i % 2 ? ' work-item--reverse' : ''}`}>
              <div className="work-item__media">
                <BrowserFrame url={c.url} image={c.image} alt={`${c.name} website`} />
              </div>
              <div className="work-item__info">
                <span className="work-item__badge">{c.location}</span>
                <h2 className="work-item__name">{c.name}</h2>
                <p className="work-item__industry">{c.industry}</p>
                <p className="work-item__blurb">{c.blurb}</p>
                <blockquote className="work-quote">
                  <p>“{c.quote}”</p>
                  <footer><strong>{c.author}</strong> · {c.role}</footer>
                </blockquote>
                <span className="work-item__note">Site view is a design placeholder</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBanner
        eyebrow="Your industry's next"
        headline="Whatever you do, we can build it — and hand it to you."
        subtext="Different trade, different state, different style. Same honest, you-own-everything setup."
        cta={{ label: 'Build your quote', href: '/#configure' }}
        variant="accent"
      />
    </>
  )
}
