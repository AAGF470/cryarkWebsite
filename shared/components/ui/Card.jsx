import { useRef } from "react";
import { useCardGlow } from "../../hooks/useCardGlow";
import Pill from "./Pill";
import "./Card.css";

// ---------------------------------------------------------------------------
// Card
//
// A self-contained project card with outline glow effect, 3D tilt on hover,
// and a cursor-reactive light source visible only through the border stroke.
//
// Props:
//   title          string    — project name
//   description    string    — one or two sentence summary
//   tags           string[]  — tech/category pills e.g. ["Blender", "Python"]
//   status         string    — "released" | "in_dev" | "research" | "live" | "collab"
//   thumbnail_url  string?   — path to thumbnail image (omit for text-only variant)
//   stats          object?   — { label: string, value: string }[] for lab cards
//                              e.g. [{ value: "NU", label: "AERO" }, ...]
//   href           string?   — link destination when card is clicked
//   theme_color_primary    [r,g,b]?  — override glow color (defaults to dawn orange)
//   theme_color_secondary  [r,g,b]?  — override glow fade color
//
// Usage — Card A (with thumbnail):
//   <Card
//     title="Simply Simple Foliage"
//     description="Procedural tree generator for Blender."
//     tags={["Blender", "Python", "Procedural"]}
//     status="released"
//     thumbnail_url="/assets/ssf-thumb.jpg"
//     href="/products/simply-simple-foliage"
//   />
//
// Usage — Card B (no thumbnail, with stats):
//   <Card
//     title="DERG"
//     description="Synthetic training data pipeline for NU AERO."
//     tags={["Blender", "Python", "CV / ML"]}
//     status="research"
//     stats={[
//       { value: "NU", label: "AERO" },
//       { value: "CV", label: "ML target" },
//       { value: "3D", label: "pipeline" },
//     ]}
//     href="/lab/derg"
//   />
// ---------------------------------------------------------------------------

const STATUS_LABEL_MAP = {
  released: "Released",
  in_dev:   "In dev",
  research: "Research",
  live:     "Live",
  collab:   "Collab",
};

function StatusBadge({ status }) {
  const badge_label = STATUS_LABEL_MAP[status] ?? status;
  const badge_class = `card__status_badge card__status_badge--${status}`;

  return (
    <span className={badge_class}>
      {status === "live" && <span className="card__live_dot" aria-hidden="true" />}
      {badge_label}
    </span>
  );
}

function CardThumbnail({ thumbnail_url, title }) {
  if (!thumbnail_url) {
    return <div className="card__thumbnail_placeholder" aria-hidden="true" />;
  }
  return (
    <img
      className="card__thumbnail"
      src={thumbnail_url}
      alt={`${title} preview`}
      loading="lazy"
    />
  );
}

function CardStats({ stats }) {
  return (
    <div className="card__stats">
      {stats.map((stat_item) => (
        <div key={stat_item.label} className="card__stat">
          <span className="card__stat_number">{stat_item.value}</span>
          <span className="card__stat_label">{stat_item.label}</span>
        </div>
      ))}
    </div>
  );
}

function CardMeta({ tags, status, show_status_badge = false, theme_color_primary, theme_color_secondary }) {
  return (
    <div className="card__meta">
      <div className="card__pills">
        {tags.map((tag_text) => (
          <Pill
            key={tag_text}
            label={tag_text}
            theme_color_primary={theme_color_primary}
            theme_color_secondary={theme_color_secondary}
          />
        ))}
      </div>
      {show_status_badge && <StatusBadge status={status} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Card({
  title,
  description,
  tags = [],
  status = "in_dev",
  thumbnail_url = null,
  stats = null,
  href = "#",
  theme_color_primary   = [200, 169, 126],
  theme_color_secondary = [140, 110, 65],
}) {
  const { wrapper_ref, card_ref, outline_canvas_ref, ambient_canvas_ref } = useCardGlow({
    color_primary:   theme_color_primary,
    color_secondary: theme_color_secondary,
  });

  function handle_card_click() {
    if (href && href !== "#") {
      window.location.href = href;
    }
  }

  // Show thumbnail if provided, regardless of whether stats are present
  const should_show_thumbnail = thumbnail_url !== null;

  // Show stats row if stats array is provided and non-empty
  const should_show_stats = Array.isArray(stats) && stats.length > 0;

  return (
    <div
      ref={wrapper_ref}
      className="card__wrapper"
      onClick={handle_card_click}
      role="button"
      tabIndex={0}
      aria-label={`View ${title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handle_card_click();
        }
      }}
    >
      {/* Outline glow canvas — sits outside the card edge, z-index above everything */}
      <canvas ref={outline_canvas_ref} className="card__outline_canvas" aria-hidden="true" />

      {/* Glass card surface */}
      <div ref={card_ref} className="card__surface">

        {/* Ambient interior canvas — faint background tint */}
        <canvas ref={ambient_canvas_ref} className="card__ambient_canvas" aria-hidden="true" />

        <div className="card__content">

          {/* Header: status badge + arrow (shown when no thumbnail) */}
          {!should_show_thumbnail && (
            <div className="card__header" style={{ marginBottom: "12px" }}>
              <StatusBadge status={status} />
              <span className="card__arrow" aria-hidden="true">↗</span>
            </div>
          )}

          {/* Thumbnail (Card A variant) */}
          {should_show_thumbnail && (
            <CardThumbnail thumbnail_url={thumbnail_url} title={title} />
          )}

          {/* Title + arrow */}
          <div className="card__header">
            <h3 className="card__title">{title}</h3>
            {should_show_thumbnail && (
              <span className="card__arrow" aria-hidden="true">↗</span>
            )}
          </div>

          {/* Description */}
          <p className="card__description">{description}</p>

          {/* Divider before stats or meta row */}
          <hr className="card__divider" />

          {/* Stats row (Card B lab variant) OR Meta row (pills + badge) */}
          {should_show_stats ? (
            <CardStats stats={stats} />
          ) : (
            <CardMeta
              tags={tags}
              status={status}
              show_status_badge={should_show_thumbnail}
              theme_color_primary={theme_color_primary}
              theme_color_secondary={theme_color_secondary}
            />
          )}

        </div>
      </div>
    </div>
  );
}
