import './Gallery.css'

// ---------------------------------------------------------------------------
// Gallery
// Responsive image grid with a caption that slides up on hover.
// Use for completed projects (contractors), looks/styles (salons), etc.
//
// Props:
//   eyebrow  string
//   headline string
//   subtext  string
//   images   Array<{ src, alt?, caption? }>
//   columns  2|3|4         — desktop column count (default: 3)
//   aspect   string        — CSS aspect-ratio, e.g. "1 / 1", "4 / 3" (default: "1 / 1")
//   variant  "default"|"alt"
// ---------------------------------------------------------------------------

export default function Gallery({
  eyebrow,
  headline,
  subtext,
  images = [],
  columns = 3,
  aspect = '1 / 1',
  variant = 'default',
}) {
  return (
    <section className={`section section--${variant}`}>
      <div className="section-container">
        {(eyebrow || headline || subtext) && (
          <div className="gallery__header">
            {eyebrow  && <p className="section-eyebrow">{eyebrow}</p>}
            {headline && <h2 className="section-title">{headline}</h2>}
            {subtext  && <p className="section-sub">{subtext}</p>}
          </div>
        )}

        <div
          className="gallery__grid"
          style={{ '--gallery-cols': columns, '--gallery-aspect': aspect }}
        >
          {images.map((img, i) => (
            <figure key={i} className="gallery__item">
              {img.src
                ? <img className="gallery__img" src={img.src} alt={img.alt ?? ''} loading="lazy" />
                : <div className="gallery__placeholder">Photo</div>
              }
              {img.caption && (
                <figcaption className="gallery__caption">{img.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
