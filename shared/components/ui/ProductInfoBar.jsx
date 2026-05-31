import { Link } from "react-router-dom";
import PlatformBadge from "./PlatformBadge";
import "./ProductInfoBar.css";

// ---------------------------------------------------------------------------
// ProductInfoBar
//
// Compact metadata band placed directly below a CinematicHero. Shows the
// back-nav breadcrumb, status badge, tag pills, and platform icons.
//
// Props:
//   back_href   string?   — link target for back chevron (default: "/products")
//   back_label  string?   — back link label (default: "Products")
//   status      string    — one of the card status keys
//   tags        string[]  — short text tags (e.g. ["Narrative", "Godot 4"])
//   platforms   array?    — [{ platform, src? }] for PlatformBadge
// ---------------------------------------------------------------------------

const STATUS_LABEL = {
  released: "Released",
  in_dev:   "In dev",
  research: "Research",
  live:     "Live",
  collab:   "Collab",
};

export default function ProductInfoBar({
  back_href  = "/products",
  back_label = "Products",
  status,
  tags       = [],
  platforms  = [],
}) {
  return (
    <div className="product-info-bar">

      {/* Left — back navigation */}
      <Link to={back_href} className="product-info-bar__back">
        <span className="product-info-bar__back_arrow">←</span>
        {back_label}
      </Link>

      {/* Center — status + tags */}
      <div className="product-info-bar__meta">
        {status && (
          <span className={`card__status_badge card__status_badge--${status} product-info-bar__status`}>
            {status === "live" && <span className="card__live_dot" />}
            {STATUS_LABEL[status] ?? status}
          </span>
        )}
        {tags.map(tag => (
          <span key={tag} className="product-info-bar__tag">{tag}</span>
        ))}
      </div>

      {/* Right — platform badges */}
      {platforms.length > 0 && (
        <div className="product-info-bar__platforms">
          {platforms.map(({ platform, src }) => (
            <PlatformBadge key={platform} platform={platform} src={src} size={28} />
          ))}
        </div>
      )}
    </div>
  );
}
