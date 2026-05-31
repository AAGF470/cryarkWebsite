import Button from "./Button";
import "./CinematicHero.css";

// ---------------------------------------------------------------------------
// CinematicHero
//
// Full-viewport (100svh) hero with video or image background, multi-stop
// gradient overlay, and text anchored to the lower-left. Inspired by
// Annapurna Interactive product page heroes.
//
// Props:
//   video_src    string?   — mp4 URL. If provided, plays autoplay/muted/loop.
//   image_src    string?   — image URL. Used as video poster or standalone bg.
//   eyebrow      string?   — small uppercase label above title
//   title        string    — main heading (supports JSX for em/br)
//   subtitle     string?   — supporting paragraph
//   actions      array?    — [{ label, href, variant?, lava? }]
//   align        "left" | "center"  (default: "left")
//   show_scroll  boolean?  — animated scroll hint at bottom (default: true)
// ---------------------------------------------------------------------------

export default function CinematicHero({
  video_src   = null,
  image_src   = null,
  eyebrow     = null,
  title       = "",
  subtitle    = null,
  actions     = [],
  align       = "left",
  show_scroll = true,
}) {
  const has_media = video_src || image_src;

  return (
    <div className={`cinematic-hero${align === "center" ? " cinematic-hero--center" : ""}`}>

      {/* Background */}
      <div className="cinematic-hero__bg">
        {video_src ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={image_src ?? undefined}
          >
            <source src={video_src} type="video/mp4" />
            {image_src && <img src={image_src} alt="" />}
          </video>
        ) : image_src ? (
          <img src={image_src} alt="" />
        ) : (
          <div className="cinematic-hero__placeholder" />
        )}
      </div>

      {/* Gradient overlay — only over real media */}
      {has_media && <div className="cinematic-hero__overlay" />}

      {/* Text content */}
      <div className="cinematic-hero__content">
        {eyebrow && (
          <div className="cinematic-hero__eyebrow">{eyebrow}</div>
        )}

        <h2 className="cinematic-hero__title">{title}</h2>

        {subtitle && (
          <p className="cinematic-hero__subtitle">{subtitle}</p>
        )}

        {actions.length > 0 && (
          <div className="cinematic-hero__actions">
            {actions.map((a, i) => (
              <Button
                key={i}
                label={a.label}
                href={a.href}
                variant={a.variant ?? "solid"}
                lava={a.lava ?? false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scroll hint */}
      {show_scroll && (
        <div className="cinematic-hero__scroll_hint" aria-hidden="true">
          <span className="cinematic-hero__scroll_label">scroll</span>
          <span className="cinematic-hero__scroll_line" />
        </div>
      )}
    </div>
  );
}
