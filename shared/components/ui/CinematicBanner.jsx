import Button from "./Button";
import "./CinematicBanner.css";

// ---------------------------------------------------------------------------
// CinematicBanner
//
// Full-width atmospheric section. A background image is revealed through
// gradients that fade to the page background colour at top and bottom,
// making the block bleed organically into surrounding content.
//
// Props:
//   image_src    string    — background image URL
//   eyebrow      string?   — small uppercase label
//   heading      string    — main callout text
//   body         string?   — supporting line
//   align        "left" | "center"  (default: "left")
//   min_height   string?   — CSS min-height (default: "520px")
//   cta_label    string?   — optional CTA button label
//   cta_href     string?   — optional CTA button URL
// ---------------------------------------------------------------------------

export default function CinematicBanner({
  image_src  = null,
  eyebrow    = null,
  heading    = "",
  body       = null,
  align      = "left",
  min_height = "clamp(360px, 55vh, 520px)",
  cta_label  = null,
  cta_href   = null,
}) {
  return (
    <div
      className={`cinematic-banner cinematic-banner--${align}`}
      style={{ minHeight: min_height }}
    >
      {/* Background image */}
      {image_src && (
        <div className="cinematic-banner__bg" aria-hidden="true">
          <img src={image_src} alt="" loading="lazy" />
        </div>
      )}

      {/* Gradient veil — fades page colour in at top + bottom */}
      <div className="cinematic-banner__veil" aria-hidden="true" />

      {/* Content */}
      <div className="cinematic-banner__content">
        {eyebrow && (
          <p className="cinematic-banner__eyebrow">{eyebrow}</p>
        )}
        <h2 className="cinematic-banner__heading">{heading}</h2>
        {body && (
          <p className="cinematic-banner__body">{body}</p>
        )}
        {cta_label && cta_href && (
          <div className="cinematic-banner__actions">
            <Button label={cta_label} href={cta_href} variant="ghost" />
          </div>
        )}
      </div>
    </div>
  );
}
