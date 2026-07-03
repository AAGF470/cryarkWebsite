import './FeatureGrid.css'
import { SectionIcon } from './SectionIcons'

// ---------------------------------------------------------------------------
// FeatureGrid
// Responsive card grid — services, benefits, or features.
//
// Props:
//   eyebrow  string
//   headline string
//   subtext  string
//   columns  2|3          — number of columns at desktop (default: 3)
//   items    Array<{icon?, title, body}>
//   variant  "default"|"alt"
//   expression "cards"|"list"|"columns" — structural layout (default: "cards").
//     cards:   icon cards in a grid (the classic)
//     list:    numbered editorial rows, no icons — reads like a manifesto
//     columns: plain ruled columns, quiet chrome — reads like a broadsheet
// ---------------------------------------------------------------------------

export default function FeatureGrid({
  eyebrow,
  headline,
  subtext,
  items = [],
  columns = 3,
  variant = 'default',
  expression = 'cards',
}) {
  return (
    <section className={`section section--${variant}`}>
      <div className="section-container">
        {(eyebrow || headline || subtext) && (
          <div className="feature-grid__header">
            {eyebrow  && <p className="section-eyebrow">{eyebrow}</p>}
            {headline && <h2 className="section-title">{headline}</h2>}
            {subtext  && <p className="section-sub">{subtext}</p>}
          </div>
        )}
        <div
          className={`feature-grid__grid feature-grid__grid--x-${expression}`}
          style={{ '--feature-cols': columns }}
        >
          {items.map((item, i) => (
            <div key={i} className="feature-card">
              {item.icon && (
                <div className="feature-card__icon">
                  <SectionIcon name={item.icon} />
                </div>
              )}
              <h3 className="feature-card__title">{item.title}</h3>
              {item.body && <p className="feature-card__body">{item.body}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
