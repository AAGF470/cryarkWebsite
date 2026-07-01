import './HoursLocation.css'
import { SectionIcon } from './SectionIcons'

// ---------------------------------------------------------------------------
// HoursLocation
// Business hours table + address / contact details + optional map embed.
// Core "info site" content for a local business.
//
// Props:
//   eyebrow   string
//   headline  string
//   hours     Array<{ day, time, closed?:boolean }>
//   todayIndex number?  — index of the row to highlight as "today"
//   address   string
//   phone     string
//   email     string
//   mapEmbedUrl string?  — Google Maps embed src; placeholder shown if omitted
//   variant   "default"|"alt"
// ---------------------------------------------------------------------------

export default function HoursLocation({
  eyebrow,
  headline,
  hours = [],
  todayIndex,
  address,
  phone,
  email,
  mapEmbedUrl,
  variant = 'default',
}) {
  // Default "today" to the actual weekday if the rows look like Mon–Sun
  const resolvedToday = todayIndex ?? (hours.length === 7 ? (new Date().getDay() + 6) % 7 : -1)

  return (
    <section className={`section section--${variant}`}>
      <div className="section-container">
        <div className="hours-loc__inner">

          {/* ── Hours ──────────────────────────────────────────────────── */}
          <div className="hours-loc__hours-wrap">
            <div className="hours-loc__header">
              {eyebrow  && <p className="section-eyebrow">{eyebrow}</p>}
              {headline && <h2 className="section-title">{headline}</h2>}
            </div>
            <ul className="hours-loc__hours">
              {hours.map((row, i) => (
                <li
                  key={i}
                  className={`hours-row${i === resolvedToday ? ' hours-row--today' : ''}`}
                >
                  <span className="hours-row__day">{row.day}</span>
                  <span className={`hours-row__time${row.closed ? ' hours-row__time--closed' : ''}`}>
                    {row.closed ? 'Closed' : row.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Location + contact ─────────────────────────────────────── */}
          <div className="hours-loc__location">
            <div className="hours-loc__details">
              {address && (
                <div className="hours-loc__detail">
                  <span className="hours-loc__detail-icon"><SectionIcon name="map" /></span>
                  <div>
                    <p className="hours-loc__detail-label">Visit</p>
                    <span className="hours-loc__detail-value">{address}</span>
                  </div>
                </div>
              )}
              {phone && (
                <div className="hours-loc__detail">
                  <span className="hours-loc__detail-icon"><SectionIcon name="phone" /></span>
                  <div>
                    <p className="hours-loc__detail-label">Call</p>
                    <a href={`tel:${phone}`} className="hours-loc__detail-value">{phone}</a>
                  </div>
                </div>
              )}
              {email && (
                <div className="hours-loc__detail">
                  <span className="hours-loc__detail-icon"><SectionIcon name="mail" /></span>
                  <div>
                    <p className="hours-loc__detail-label">Email</p>
                    <a href={`mailto:${email}`} className="hours-loc__detail-value">{email}</a>
                  </div>
                </div>
              )}
            </div>

            <div className="hours-loc__map">
              {mapEmbedUrl
                ? <iframe src={mapEmbedUrl} title="Location map" loading="lazy" allowFullScreen />
                : <div className="hours-loc__map-placeholder">Map</div>
              }
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
