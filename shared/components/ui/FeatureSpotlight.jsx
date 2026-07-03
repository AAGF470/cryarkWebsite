import Button from "./Button";
import PlatformBadge from "./PlatformBadge";
import "./FeatureSpotlight.css";

// ---------------------------------------------------------------------------
// FeatureSpotlight
//
// Large editorial product section: full-bleed media on one side, rich content
// on the other. Used on product and landing pages for hero-level feature calls.
//
// Props:
//   image_src    string?   — image URL for the media panel
//   video_src    string?   — mp4 URL (plays autoplay/muted/loop)
//   eyebrow      string?   — small uppercase label
//   title        string    — product / feature name
//   description  string    — 2–4 sentence summary
//   platforms    array?    — string slugs OR { platform, src? } objects for PlatformBadge
//   actions      array?    — [{ label, href, variant?, lava? }]
//   flip         boolean?  — swap media/content sides (default: false = media left)
//   media_fit    "cover"|"contain"  — object-fit for the media (default: "cover")
//   media_bg     string?   — CSS background for the media panel (e.g. for contain fit)
// ---------------------------------------------------------------------------

export default function FeatureSpotlight({
  image_src   = null,
  video_src   = null,
  eyebrow     = null,
  title       = "",
  description = "",
  platforms   = [],
  actions     = [],
  flip        = false,
  media_fit   = "cover",
  media_bg    = null,
}) {
  return (
    <div className={`feature-spotlight${flip ? " feature-spotlight--flip" : ""}`}>

      {/* Media panel */}
      <div
        className="feature-spotlight__media"
        style={media_bg ? { background: media_bg } : undefined}
      >
        {video_src ? (
          <video autoPlay muted loop playsInline poster={image_src ?? undefined}
            style={{ objectFit: media_fit }}>
            <source src={video_src} type="video/mp4" />
          </video>
        ) : image_src ? (
          <img src={image_src} alt={title} style={{ objectFit: media_fit }} />
        ) : (
          <div className="feature-spotlight__placeholder">
            <span className="feature-spotlight__placeholder_label">media</span>
          </div>
        )}
      </div>

      {/* Content panel */}
      <div className="feature-spotlight__content">
        {eyebrow && (
          <div className="feature-spotlight__eyebrow">{eyebrow}</div>
        )}

        <h2 className="feature-spotlight__title">{title}</h2>

        <p className="feature-spotlight__desc">{description}</p>

        {platforms.length > 0 && (
          <div className="feature-spotlight__platforms">
            {platforms.map((p) => {
              const slug = typeof p === "string" ? p : p.platform;
              const src  = typeof p === "string" ? null : (p.src ?? null);
              return <PlatformBadge key={slug} platform={slug} src={src} />;
            })}
          </div>
        )}

        {actions.length > 0 && (
          <div className="feature-spotlight__actions">
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
    </div>
  );
}
