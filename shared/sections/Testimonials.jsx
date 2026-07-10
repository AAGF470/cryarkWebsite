import './Testimonials.css'

// ---------------------------------------------------------------------------
// Testimonials
// Grid of client quotes with author attribution.
//
// Props:
//   eyebrow  string
//   headline string
//   items    Array<{quote, author, role?, company?}>
//   columns  1|2|3|4     — fixed desktop column count (default: auto-fit, min 280px)
//   variant  "default"|"alt"
// ---------------------------------------------------------------------------

export default function Testimonials({
  eyebrow,
  headline,
  items = [],
  columns,
  variant = 'default',
}) {
  return (
    <section className={`section section--${variant}`}>
      <div className="section-container">
        {(eyebrow || headline) && (
          <div className="testimonials__header">
            {eyebrow  && <p className="section-eyebrow">{eyebrow}</p>}
            {headline && <h2 className="section-title">{headline}</h2>}
          </div>
        )}
        <div
          className={`testimonials__grid${columns ? ' testimonials__grid--fixed' : ''}`}
          style={columns ? { '--testimonials-cols': columns } : undefined}
        >
          {items.map((item, i) => {
            const initials = item.author
              ? item.author.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
              : '?'
            return (
              <div key={i} className="testimonial-card">
                <p className="testimonial-card__quote">{item.quote}</p>
                <div className="testimonial-card__author-row">
                  <div className="testimonial-card__avatar" aria-hidden="true">{initials}</div>
                  <div>
                    <p className="testimonial-card__author">{item.author}</p>
                    {(item.role || item.company) && (
                      <p className="testimonial-card__role">
                        {[item.role, item.company].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
