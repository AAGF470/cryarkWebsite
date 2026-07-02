import './Checklist.css'

// ---------------------------------------------------------------------------
// Checklist
// A vertical list of checkmarked statements — promises, guarantees,
// what's-included lists. Promoted from the Guillen Solutions "ownership"
// section so CMS pages render it identically to hand-built ones.
//
// Props:
//   eyebrow  string
//   headline string
//   subtext  string
//   items    Array<string>  — one line per checkmark
//   note     string         — optional muted footnote card under the list
//   variant  "default"|"alt"|"accent"  — section background
// ---------------------------------------------------------------------------

const CheckMark = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="2 7.5 5.5 11 12 3" />
  </svg>
)

export default function Checklist({
  eyebrow,
  headline,
  subtext,
  items = [],
  note,
  variant = 'default',
}) {
  return (
    <section className={`section section--${variant}`}>
      <div className="section-container">
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        {headline && <h2 className="section-title">{headline}</h2>}
        {subtext && <p className="section-sub">{subtext}</p>}
        <ul className="checklist">
          {items.map((line, i) => (
            <li key={i} className="checklist__item">
              <span className="checklist__mark"><CheckMark /></span>
              {line}
            </li>
          ))}
        </ul>
        {note && <p className="checklist__note">{note}</p>}
      </div>
    </section>
  )
}
