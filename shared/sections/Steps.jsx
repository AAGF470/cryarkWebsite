import './Steps.css'

// ---------------------------------------------------------------------------
// Steps
// Numbered vertical list — how it works, process, or onboarding flow.
//
// Props:
//   eyebrow  string
//   headline string
//   subtext  string
//   items    Array<{title, body}>
//   columns  1|2|3       — equal-column grid at desktop (default: 1, vertical flow)
//   variant  "default"|"alt"
// ---------------------------------------------------------------------------

export default function Steps({
  eyebrow,
  headline,
  subtext,
  items = [],
  columns = 1,
  variant = 'default',
}) {
  return (
    <section className={`section section--${variant}`}>
      <div className="section-container">
        {(eyebrow || headline || subtext) && (
          <div className="steps__header">
            {eyebrow  && <p className="section-eyebrow">{eyebrow}</p>}
            {headline && <h2 className="section-title">{headline}</h2>}
            {subtext  && <p className="section-sub">{subtext}</p>}
          </div>
        )}
        <div
          className={`steps__list${columns > 1 ? ' steps__list--cols' : ''}`}
          style={columns > 1 ? { '--steps-cols': columns } : undefined}
        >
          {items.length > 1 && columns === 1 && (
            <div className="steps__connector" aria-hidden="true" />
          )}
          {items.map((item, i) => (
            <div key={i} className="steps__item">
              <div className="steps__number" aria-hidden="true">{i + 1}</div>
              <div>
                <h3 className="steps__item-title">{item.title}</h3>
                {item.body && <p className="steps__item-body">{item.body}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
