import './Faq.css'

// ---------------------------------------------------------------------------
// Faq
// Accessible accordion built on native <details>/<summary> — works with no
// JavaScript and is keyboard-friendly out of the box.
//
// Props:
//   eyebrow  string
//   headline string
//   subtext  string
//   items    Array<{ q, a }>
//   single   boolean        — if true, only one item open at a time
//   variant  "default"|"alt"
// ---------------------------------------------------------------------------

export default function Faq({
  eyebrow,
  headline,
  subtext,
  items = [],
  single = false,
  variant = 'default',
}) {
  // Shared name makes the <details> behave like a radio group (one open).
  const groupName = single ? 'faq-group' : undefined

  return (
    <section className={`section section--${variant}`}>
      <div className="section-container">
        {(eyebrow || headline || subtext) && (
          <div className="faq__header">
            {eyebrow  && <p className="section-eyebrow">{eyebrow}</p>}
            {headline && <h2 className="section-title">{headline}</h2>}
            {subtext  && <p className="section-sub">{subtext}</p>}
          </div>
        )}

        <div className="faq__list">
          {items.map((item, i) => (
            <details key={i} className="faq__item" name={groupName}>
              <summary className="faq__q">
                {item.q}
                <span className="faq__icon" aria-hidden="true" />
              </summary>
              <p className="faq__a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
