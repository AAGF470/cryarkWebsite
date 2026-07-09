import './ContactMethods.css'
import { SectionIcon } from './SectionIcons'

// ---------------------------------------------------------------------------
// ContactMethods
// A grid of tappable contact cards (text line, WhatsApp, email, …) plus an
// optional callout beneath. Each method links out via its own href; design
// and behavior live here, content is passed in (or authored in the CMS).
//
// Props:
//   eyebrow  string
//   headline string
//   subtext  string
//   columns  2|3|4                    — desktop column count (default: 3)
//   callout  string                   — note shown below the grid (optional)
//   variant  "default"|"alt"|"accent"
//   methods  Array<{
//     icon?:    string,               — SectionIcon name (mail, message, whatsapp, phone…)
//     name:     string,               — label ("Text line")
//     value:    string,               — the number / address shown big
//     href:     string,               — sms: / https://wa.me/… / mailto:
//     note?:    string,               — small line ("Text only — no calls")
//     cta?:     string,               — link text ("Send a text")
//     external?: boolean,             — open in a new tab
//   }>
// ---------------------------------------------------------------------------

export default function ContactMethods({
  eyebrow,
  headline,
  subtext,
  methods = [],
  callout,
  columns = 3,
  variant = 'default',
}) {
  return (
    <section className={`section section--${variant}`}>
      <div className="section-container">
        {(eyebrow || headline || subtext) && (
          <div className="contact-methods__header">
            {eyebrow  && <p className="section-eyebrow">{eyebrow}</p>}
            {headline && <h2 className="section-title">{headline}</h2>}
            {subtext  && <p className="section-sub">{subtext}</p>}
          </div>
        )}

        <div className="contact-methods__grid" style={{ '--contact-cols': columns }}>
          {methods.map((m, i) => (
            <a
              key={i}
              className="contact-method"
              href={m.href}
              {...(m.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {m.icon && (
                <span className="contact-method__icon" aria-hidden="true">
                  <SectionIcon name={m.icon} />
                </span>
              )}
              {m.name  && <span className="contact-method__name">{m.name}</span>}
              {m.value && <span className="contact-method__value">{m.value}</span>}
              {m.note  && <span className="contact-method__note">{m.note}</span>}
              {m.cta   && <span className="contact-method__cta">{m.cta} →</span>}
            </a>
          ))}
        </div>

        {callout && <p className="contact-methods__callout">{callout}</p>}
      </div>
    </section>
  )
}
