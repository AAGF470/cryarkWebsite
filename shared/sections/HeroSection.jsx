import './HeroSection.css'
import Button from '../components/ui/Button'

// ---------------------------------------------------------------------------
// HeroSection
// Full-height page opener with headline, subtext, and CTA buttons.
//
// Props:
//   eyebrow  string           — small uppercase label above the headline
//   headline string           — main display text (required)
//   subtext  string           — supporting paragraph
//   ctas     Array<{label, href, variant?}>  — action buttons
//   layout   "left"|"centered"  — text alignment (default: "left")
//   size     "full"|"compact"   — full-viewport opener vs. compact page intro (default: "full")
//   variant  "default"|"alt"|"accent"  — section background
//   expression "classic"|"editorial"|"statement" — structural layout (default: "classic").
//     classic:   left/centered column (the original)
//     editorial: masthead rule, headline left, supporting copy in a right column
//     statement: poster-scale headline, actions under a hairline
// ---------------------------------------------------------------------------

export default function HeroSection({
  eyebrow,
  headline,
  subtext,
  ctas = [],
  layout = 'left',
  size = 'full',
  variant = 'default',
  expression = 'classic',
}) {
  return (
    <section className={`section hero-section section--${variant} hero-section--${layout} hero-section--${size} hero-section--x-${expression}`}>
      <div className="hero-section__glow" aria-hidden="true" />
      <div className="section-container">
        <div className="hero-section__content">
          {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
          <h1 className="hero-section__headline">{headline}</h1>
          {subtext && <p className="hero-section__sub">{subtext}</p>}
          {ctas.length > 0 && (
            <div className="hero-section__actions">
              {ctas.map((cta, i) => (
                <Button
                  key={i}
                  label={cta.label}
                  href={cta.href}
                  variant={cta.variant ?? 'solid'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
