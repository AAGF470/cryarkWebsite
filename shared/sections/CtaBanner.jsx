import './CtaBanner.css'
import Button from '../components/ui/Button'

// ---------------------------------------------------------------------------
// CtaBanner
// Full-width centered call-to-action block.
// Default variant is "accent" (colored bg) — great as a section closer.
//
// Props:
//   eyebrow  string
//   headline string  (required)
//   subtext  string
//   cta      {label, href, variant?}
//   variant  "accent"|"default"|"alt"
// ---------------------------------------------------------------------------

export default function CtaBanner({
  eyebrow,
  headline,
  subtext,
  cta,
  variant = 'accent',
}) {
  return (
    <section className={`section cta-banner section--${variant}`}>
      <div className="section-container">
        <div className="cta-banner__inner">
          {eyebrow  && <p className="section-eyebrow">{eyebrow}</p>}
          {headline && <h2 className="section-title">{headline}</h2>}
          {subtext  && <p className="section-sub">{subtext}</p>}
          {cta && (
            <div className="cta-banner__actions">
              <Button
                label={cta.label}
                href={cta.href}
                variant={cta.variant ?? 'solid'}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
