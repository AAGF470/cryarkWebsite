import './FencingPatrol.css'
import {
  HeroSection,
  FeatureGrid,
  ImageText,
  Steps,
  Gallery,
  Testimonials,
  Faq,
  ContactSection,
  CtaBanner,
} from '@shared/sections'

// ---------------------------------------------------------------------------
// FencingPatrol — single-page general contractor site.
// Body is composed entirely from the shared section library; only the nav and
// footer chrome are local. Themed via src/theme/theme.css (orange/white/black).
// ---------------------------------------------------------------------------

const PHONE_DISPLAY = '(346) 332-6885'
const PHONE_TEL     = '+13463326885'
const EMAIL         = 'quotes@fencingpatrol.com'

// ── Phone icon for the nav CTA ───────────────────────────────────────────────
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.16 6.16l1.06-1.06a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

// ── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="fp-nav" aria-label="Main">
      <a href="#top" className="fp-nav__logo">Fencing<span>Patrol</span></a>
      <div className="fp-nav__links">
        <a href="#services">Services</a>
        <a href="#process">How it works</a>
        <a href="#work">Our work</a>
        <a href="#faq">FAQ</a>
      </div>
      <span className="fp-nav__lang">Hablamos Español</span>
      <a href={`tel:${PHONE_TEL}`} className="fp-nav__cta">
        <PhoneIcon /> {PHONE_DISPLAY}
      </a>
    </nav>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="fp-footer">
      <div className="fp-footer__inner">
        <div className="fp-footer__top">
          <div>
            <div className="fp-footer__brand">Fencing<span>Patrol</span></div>
            <p className="fp-footer__tagline">
              Local, family-owned general contractor serving Long Island, New York City,
              and nearby areas. Roofing, fencing, paving &amp; blacktop — plus plumbing
              and HVAC. Hablamos español.
            </p>
            <p className="fp-footer__insured" style={{ marginTop: '14px' }}>
              ● Family-owned · Fully insured · Hablamos español
            </p>
          </div>
          <div className="fp-footer__contact">
            <span style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
              Call for a free quote · Llámenos
            </span>
            <a href={`tel:${PHONE_TEL}`} className="fp-footer__phone">{PHONE_DISPLAY}</a>
            <a href={`mailto:${EMAIL}`} style={{ color: 'rgba(255,255,255,0.62)', textDecoration: 'none' }}>{EMAIL}</a>
          </div>
        </div>
        <div className="fp-footer__bottom">
          <span>© {new Date().getFullYear()} FencingPatrol. All rights reserved.</span>
          <span>Site by <a href="https://guillen.studio" target="_blank" rel="noopener noreferrer">Guillen Solutions</a></span>
        </div>
      </div>
    </footer>
  )
}

// ── Content data ──────────────────────────────────────────────────────────────

const TRUST = [
  { icon: 'users',  title: 'Family-owned & local',  body: 'A small local family business — not a franchise and not a call center. When you hire us, you\'re hiring your neighbors.' },
  { icon: 'shield', title: 'Fully insured',          body: 'Licensed and fully insured. Every job is covered, from the first nail to the final cleanup.' },
  { icon: 'wrench', title: 'Owner-operated',         body: 'You work directly with the owner. For bigger jobs we bring on a trusted crew of up to five — sized to your project, never more than you need.' },
  { icon: 'globe',  title: 'Hablamos español',       body: 'Bilingual from the first call to the final walkthrough — we work in Spanish and English so nothing gets lost.' },
]

const SERVICES = [
  { icon: 'home',    title: 'Roofing',            body: 'Repairs, re-roofs, and full replacements — shingle and flat roofs built to handle New York weather.' },
  { icon: 'fence',   title: 'Fencing',            body: 'Vinyl, wood, chain-link, and aluminum. Property lines, pool codes, privacy — installed clean and straight.' },
  { icon: 'layers',  title: 'Paving & Blacktop',  body: 'Driveways, lots, and walkways. New asphalt, resurfacing, sealcoating, and repairs that last.' },
  { icon: 'droplet', title: 'Plumbing',           body: 'Secondary service — repairs, fixtures, and rough-ins handled as part of your larger project.' },
  { icon: 'wind',    title: 'HVAC',               body: 'Secondary service — heating and cooling installs and fixes to round out the job, no extra contractor needed.' },
]

const STEPS = [
  { title: 'Call us',       body: 'Pick up the phone and tell us about the project. We\'ll ask a few questions and set a time to come out.' },
  { title: 'Get a quote',   body: 'We look at the work in person and give you a clear, written quote — no guesswork, no surprises.' },
  { title: 'Draw the contract', body: 'Once you\'re happy with the price, we put everything in writing: scope, timeline, and cost.' },
  { title: 'We get to work',body: 'Crew scheduled, materials ordered, job done. You get updates the whole way through to the final walkthrough.' },
]

const PROJECTS = [
  { src: '/img/roofing.svg',   alt: 'Roofing project',          caption: 'Shingle re-roof' },
  { src: '/img/fencing.svg',   alt: 'Fencing project',          caption: 'Privacy fence install' },
  { src: '/img/paving.svg',    alt: 'Paving and blacktop',      caption: 'Driveway resurfacing' },
  { src: '/img/project-4.svg', alt: 'Vinyl fence in Nassau',    caption: 'Vinyl fence — Nassau' },
  { src: '/img/project-5.svg', alt: 'Flat roof in Queens',      caption: 'Flat roof — Queens' },
  { src: '/img/project-6.svg', alt: 'Driveway in Suffolk',      caption: 'Driveway — Suffolk' },
]

const TESTIMONIALS = [
  { quote: 'They re-did our roof in two days and cleaned up like they were never there. Fair price, and we dealt with the owner the whole time — no runaround.', author: 'Mike D.', role: 'Homeowner', company: 'Massapequa, LI' },
  { quote: 'Trabajo limpio y honesto. Nos atendieron en español de principio a fin y el precio fue justo. Los recomiendo a toda mi familia.', author: 'Lucía M.', role: 'Propietaria', company: 'Brentwood, LI' },
  { quote: 'Needed a new fence and a driveway done. One call, a small crew, both finished in a week. Felt like hiring a neighbor, not a company.', author: 'Carla R.', role: 'Homeowner', company: 'Queens, NYC' },
]

const FAQ = [
  { q: 'Are you licensed and insured?',        a: 'Yes. FencingPatrol is a fully insured general contractor. We\'re happy to provide proof of insurance before any work begins.' },
  { q: '¿Hablan español? (Do you speak Spanish?)', a: 'Sí — hablamos español e inglés. Yes, we work in both Spanish and English, so you can call and talk through your project in whichever language is most comfortable for you.' },
  { q: 'Who actually does the work?',          a: 'You work directly with the owner. For larger or more complex jobs we bring on a trusted crew of up to five — the team is sized to your project, so you\'re never paying for more than the job needs.' },
  { q: 'What areas do you serve?',             a: 'We cover all of Long Island, New York City, and nearby areas. If you\'re close by, give us a call and we\'ll let you know.' },
  { q: 'What kind of work do you do?',         a: 'Our core trades are roofing, fencing, and paving & blacktop. We also handle plumbing and HVAC as part of larger projects, so you don\'t need to juggle multiple contractors.' },
  { q: 'Do you give free quotes?',             a: 'Yes — we come out, look at the job in person, and give you a clear written quote at no cost and no obligation.' },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FencingPatrol() {
  return (
    <div id="top">
      <Nav />

      <HeroSection
        eyebrow="Local family contractor · Hablamos español"
        headline="Roofing, fencing & paving — done right."
        subtext="FencingPatrol is a local, family-owned general contractor serving Long Island, NYC, and nearby areas. Fully insured, owner-operated, and bilingual — with over 35 projects completed."
        ctas={[
          { label: `Call ${PHONE_DISPLAY}`, href: `tel:${PHONE_TEL}`, variant: 'solid' },
          { label: 'Get a free quote',      href: '#contact',          variant: 'ghost' },
        ]}
        layout="left"
      />

      <FeatureGrid
        eyebrow="Why FencingPatrol"
        headline="Built on trust, finished on time"
        items={TRUST}
        columns={4}
        variant="alt"
      />

      <div id="services">
        <FeatureGrid
          eyebrow="What we do"
          headline="Our services"
          subtext="Our core work is roofing, fencing, and paving & blacktop. We also handle plumbing and HVAC so you can keep the whole project under one roof."
          items={SERVICES}
          columns={3}
          variant="default"
        />
      </div>

      <ImageText
        eyebrow="About us"
        headline="A local family contractor you can actually reach"
        body="FencingPatrol is owner-operated and family-run. You deal directly with the person doing the work — and for bigger jobs we bring on a small, trusted crew of up to five, sized to what your project actually needs. We speak Spanish and English, we're fully insured, and we've completed over 35 projects across Long Island and New York City."
        image="/img/about.svg"
        imageAlt="FencingPatrol crew on the job"
        layout="image-left"
        cta={{ label: 'See our work', href: '#work', variant: 'ghost-bordered' }}
        variant="alt"
      />

      <div id="process">
        <Steps
          eyebrow="How it works"
          headline="From phone call to finished job"
          subtext="Four simple steps. No pressure, no surprises."
          items={STEPS}
          variant="default"
        />
      </div>

      <div id="work">
        <Gallery
          eyebrow="Recent projects"
          headline="Over 35 projects completed"
          subtext="A look at recent roofing, fencing, and paving jobs across Long Island and NYC."
          images={PROJECTS}
          columns={3}
          aspect="4 / 3"
          variant="alt"
        />
      </div>

      <Testimonials
        eyebrow="What clients say"
        headline="Trusted across Long Island & NYC"
        items={TESTIMONIALS}
        variant="default"
      />

      <div id="faq">
        <Faq
          eyebrow="Common questions"
          headline="Good to know"
          items={FAQ}
          variant="alt"
        />
      </div>

      <div id="contact">
        <ContactSection
          eyebrow="Get in touch"
          headline="Call for a free quote"
          subtext="Tell us about your project and we'll get back to you fast — en español o in English. Serving Long Island, NYC, and nearby areas."
          email={EMAIL}
          phone={PHONE_DISPLAY}
          variant="default"
        />
      </div>

      <CtaBanner
        eyebrow="Ready to start?"
        headline="Let's get your project moving."
        subtext="Call now for a free, no-obligation quote — en español o in English. Family-owned, fully insured, over 35 projects completed."
        cta={{ label: `Call ${PHONE_DISPLAY}`, href: `tel:${PHONE_TEL}`, variant: 'solid' }}
        variant="accent"
      />

      <Footer />
    </div>
  )
}
