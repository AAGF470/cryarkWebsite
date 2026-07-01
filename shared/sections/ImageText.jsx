import './ImageText.css'
import Button from '../components/ui/Button'

// ---------------------------------------------------------------------------
// ImageText
// Two-column split: image on one side, text + optional CTA on the other.
//
// Props:
//   eyebrow  string
//   headline string
//   body     string
//   image    string     — image URL
//   imageAlt string
//   layout   "image-right"|"image-left"  (default: "image-right")
//   cta      {label, href, variant?}
//   variant  "default"|"alt"
// ---------------------------------------------------------------------------

export default function ImageText({
  eyebrow,
  headline,
  body,
  image,
  imageAlt = '',
  layout = 'image-right',
  cta,
  variant = 'default',
}) {
  return (
    <section className={`section section--${variant}`}>
      <div className="section-container">
        <div className={`image-text__inner image-text__inner--${layout}`}>
          <div className="image-text__copy">
            {eyebrow  && <p className="section-eyebrow">{eyebrow}</p>}
            {headline && <h2 className="section-title">{headline}</h2>}
            {body     && <p className="image-text__body">{body}</p>}
            {cta && (
              <Button
                label={cta.label}
                href={cta.href}
                variant={cta.variant ?? 'ghost-bordered'}
              />
            )}
          </div>
          <div className="image-text__img-wrap">
            {image
              ? <img src={image} alt={imageAlt} className="image-text__img" />
              : <div className="image-text__img-placeholder">No image</div>
            }
          </div>
        </div>
      </div>
    </section>
  )
}
