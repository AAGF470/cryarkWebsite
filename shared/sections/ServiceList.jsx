import './ServiceList.css'

// ---------------------------------------------------------------------------
// ServiceList
// A clean "menu" of services with optional prices and a dotted leader —
// perfect for salons, barbers, contractors, detailers, etc.
//
// Props:
//   eyebrow  string
//   headline string
//   subtext  string
//   services Array<{ name, description?, price?, from?:boolean }>
//   columns  1|2|3        — number of columns at desktop (default: 2)
//   variant  "default"|"alt"
// ---------------------------------------------------------------------------

export default function ServiceList({
  eyebrow,
  headline,
  subtext,
  services = [],
  columns = 2,
  variant = 'default',
}) {
  // Split into N balanced columns
  const cols = Array.from({ length: columns }, () => [])
  services.forEach((svc, i) => cols[i % columns].push({ ...svc, _i: i }))

  return (
    <section className={`section section--${variant}`}>
      <div className="section-container">
        {(eyebrow || headline || subtext) && (
          <div className="service-list__header">
            {eyebrow  && <p className="section-eyebrow">{eyebrow}</p>}
            {headline && <h2 className="section-title">{headline}</h2>}
            {subtext  && <p className="section-sub">{subtext}</p>}
          </div>
        )}

        <div className="service-list__grid" style={{ '--service-cols': columns }}>
          {cols.map((colItems, ci) => (
            <div key={ci} className="service-list__col">
              {colItems.map(svc => (
                <div key={svc._i} className="service-item">
                  <div className="service-item__body">
                    <h3 className="service-item__name">{svc.name}</h3>
                    {svc.description && (
                      <p className="service-item__desc">{svc.description}</p>
                    )}
                  </div>
                  {svc.price != null && svc.price !== '' && (
                    <>
                      <span className="service-item__leader" aria-hidden="true" />
                      <span className={`service-item__price${svc.from ? ' service-item__price--from' : ''}`}>
                        {svc.price}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
