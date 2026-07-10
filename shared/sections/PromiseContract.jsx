import './PromiseContract.css'
import Reveal from '../components/ui/Reveal'

// ---------------------------------------------------------------------------
// PromiseContract
// The written-promise section: a deep accent-toned band with a framed clause
// list styled like a signed agreement — checks, signature line, round stamp.
//
// Deliberately a living website element, not a poster: clauses are hoverable
// (and clickable when given an href), they stagger in on scroll via the
// library's motion system, the stamp reacts on hover, and the CTA is a real
// button. Colors derive from the active theme (accent darkened for the band,
// --pc-gold overridable), so it restyles per recipe like everything else.
//
// Props:
//   eyebrow     string
//   headline    string|node  (use <em> for the italic serif moment)
//   frameLabel  string       — small label breaking the frame ("IN WRITING…")
//   clauses     Array<string | { text, href? }>
//   signature   { name, sub }         (optional)
//   stamp       string                (optional, e.g. "NO LOCK-IN")
//   cta         { label, href }       (optional)
// ---------------------------------------------------------------------------

export default function PromiseContract({
  eyebrow,
  headline,
  frameLabel,
  clauses = [],
  signature,
  stamp,
  cta,
}) {
  const items = clauses.map(c => (typeof c === 'string' ? { text: c } : c))

  return (
    <section className="section promise-contract">
      <div className="section-container">
        {eyebrow && <p className="section-eyebrow pc-eyebrow">{eyebrow}</p>}
        {headline && <h2 className="section-title pc-title">{headline}</h2>}

        <div className="pc-frame">
          {frameLabel && <span className="pc-frame__label">{frameLabel}</span>}

          <Reveal stagger as="ul" className="pc-clauses">
            {items.map((c, i) => {
              const Tag = c.href ? 'a' : 'li'
              const inner = (
                <>
                  <span className="pc-check" aria-hidden="true">✓</span>
                  <span className="pc-clause__text">{c.text}</span>
                  {c.href && <span className="pc-clause__go" aria-hidden="true">→</span>}
                </>
              )
              return c.href
                ? <li key={i}><a className="pc-clause pc-clause--link" href={c.href}>{inner}</a></li>
                : <li key={i} className="pc-clause">{inner}</li>
            })}
          </Reveal>

          {(signature || stamp || cta) && (
            <div className="pc-foot">
              {signature && (
                <div className="pc-sig">
                  <div className="pc-sig__name">{signature.name}</div>
                  {signature.sub && <div className="pc-sig__sub">{signature.sub}</div>}
                </div>
              )}
              <div className="pc-foot__right">
                {cta && <a className="pc-cta" href={cta.href}>{cta.label}</a>}
                {stamp && <span className="pc-stamp">{stamp}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
