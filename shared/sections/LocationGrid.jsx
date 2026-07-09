import './LocationGrid.css'
import { SectionIcon } from './SectionIcons'

// ---------------------------------------------------------------------------
// LocationGrid
// A grid of markets / service areas — each a photo block with the local
// sub-areas listed beneath. Photos come from the CMS (upload → src); a tidy
// map-pin placeholder shows until one is set.
//
// Props:
//   eyebrow    string
//   headline   string
//   subtext    string
//   columns    2|3|4                       — desktop column count (default: 4)
//   serveLabel string                      — small label above the areas ("Areas we serve")
//   variant    "default"|"alt"|"accent"
//   locations  Array<{
//     name:  string,
//     image?: string,                      — src (CMS upload url); optional
//     label?: string,                      — overrides serveLabel per-card
//     areas?: Array<string | { text }>,    — sub-areas (strings, or CMS {text} rows)
//   }>
// ---------------------------------------------------------------------------

const areaText = a => (typeof a === 'string' ? a : a?.text ?? '')

export default function LocationGrid({
  eyebrow,
  headline,
  subtext,
  locations = [],
  columns = 4,
  serveLabel = 'Areas we serve',
  variant = 'default',
}) {
  return (
    <section className={`section section--${variant}`}>
      <div className="section-container">
        {(eyebrow || headline || subtext) && (
          <div className="location-grid__header">
            {eyebrow  && <p className="section-eyebrow">{eyebrow}</p>}
            {headline && <h2 className="section-title">{headline}</h2>}
            {subtext  && <p className="section-sub">{subtext}</p>}
          </div>
        )}

        <div className="location-grid__grid" style={{ '--location-cols': columns }}>
          {locations.map((loc, i) => {
            const areas = (loc.areas ?? []).map(areaText).filter(Boolean)
            return (
              <article key={i} className="location-card">
                <div
                  className="location-card__photo"
                  style={loc.image ? { backgroundImage: `url(${loc.image})` } : undefined}
                  role="img"
                  aria-label={loc.name}
                >
                  {!loc.image && (
                    <span className="location-card__pin" aria-hidden="true">
                      <SectionIcon name="map" />
                    </span>
                  )}
                </div>
                <h3 className="location-card__name">{loc.name}</h3>
                {(loc.label || serveLabel) && (
                  <p className="location-card__label">{loc.label || serveLabel}</p>
                )}
                {areas.length > 0 && (
                  <ul className="location-card__areas">
                    {areas.map((a, j) => <li key={j}>{a}</li>)}
                  </ul>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
