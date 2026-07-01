import './FreelanceSite.css'
import { HeroSection, FeatureGrid, ImageText, Faq, CtaBanner } from '@shared/sections'
import cfg from './site.config'

// A complete single-page freelance site, composed entirely from site.config.js.
// Optional sections (about, faq) render only if present in the config.
export default function FreelanceSite() {
  const telHref = cfg.phone ? `tel:${cfg.phone.replace(/[^0-9+]/g, '')}` : null

  return (
    <div id="top">
      {/* Nav */}
      <nav className="ft-nav" aria-label="Main">
        <a href="#top" className="ft-nav__logo">{cfg.brand.name}</a>
        <div className="ft-nav__right">
          {cfg.services && <a href="#services" className="ft-nav__link">Services</a>}
          {telHref
            ? <a href={telHref} className="ft-nav__cta">Call {cfg.phone}</a>
            : <a href="#contact" className="ft-nav__cta">Get in touch</a>}
        </div>
      </nav>

      <HeroSection
        eyebrow={cfg.hero.eyebrow}
        headline={cfg.hero.headline}
        subtext={cfg.hero.subtext}
        ctas={[cfg.hero.primaryCta, cfg.hero.secondaryCta].filter(Boolean).map((c, i) => ({
          ...c, variant: i === 0 ? 'solid' : 'ghost',
        }))}
        layout="left"
      />

      {cfg.services && (
        <div id="services">
          <FeatureGrid
            eyebrow={cfg.services.eyebrow}
            headline={cfg.services.headline}
            items={cfg.services.items}
            columns={cfg.services.items.length >= 4 ? 4 : 3}
            variant="alt"
          />
        </div>
      )}

      {cfg.about && (
        <ImageText
          eyebrow={cfg.about.eyebrow}
          headline={cfg.about.headline}
          body={cfg.about.body}
          image={cfg.about.image}
          layout="image-right"
          variant="default"
        />
      )}

      {cfg.faq && (
        <div id="faq">
          <Faq eyebrow={cfg.faq.eyebrow} headline={cfg.faq.headline} items={cfg.faq.items} variant="alt" />
        </div>
      )}

      <div id="contact">
        <CtaBanner
          eyebrow={cfg.contact.eyebrow}
          headline={cfg.contact.headline}
          subtext={cfg.contact.subtext}
          cta={telHref
            ? { label: `Call ${cfg.phone}`, href: telHref }
            : { label: 'Email us', href: `mailto:${cfg.email}` }}
          variant="accent"
        />
      </div>

      {/* Footer */}
      <footer className="ft-footer">
        <span className="ft-footer__brand">{cfg.brand.name}</span>
        <span className="ft-footer__meta">
          {cfg.area}{cfg.phone ? ` · ${cfg.phone}` : ''}{cfg.email ? ` · ${cfg.email}` : ''}
        </span>
        <span className="ft-footer__by">Site by Guillen Solutions</span>
      </footer>
    </div>
  )
}
