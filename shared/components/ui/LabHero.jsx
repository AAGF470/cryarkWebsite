import { Link } from "react-router-dom";
import Pill from "./Pill";
import "./LabHero.css";

// ---------------------------------------------------------------------------
// LabHero
//
// Editorial page header for Lab / research entries. Not cinematic — no media
// background. Designed for readability and metadata density. Contains its own
// back-nav, metadata row, and stats so no separate ProductInfoBar is needed.
//
// Props:
//   back_href  string?   — back link target (default "/lab")
//   back_label string?   — back link label  (default "Lab")
//   eyebrow    string?   — small line above the title (e.g. "NU AERO × Cryark")
//   title      string    — main project codename / title (large display)
//   subtitle   string?   — expanded full name below the title
//   abstract   string?   — 2–3 sentence description paragraph
//   status     string?   — card status key for badge (e.g. "research")
//   tags       string[]  — short text tag chips
//   stats      array?    — [{ value, label }] for a stat row at the bottom
//   collab     string?   — optional collaborator line (e.g. "with NU AERO")
// ---------------------------------------------------------------------------

const STATUS_LABEL = {
  released: "Released",
  in_dev:   "In dev",
  research: "Research",
  live:     "Live",
  collab:   "Collab",
};

export default function LabHero({
  back_href  = "/lab",
  back_label = "Lab",
  eyebrow    = null,
  title      = "",
  subtitle   = null,
  abstract   = null,
  status     = null,
  tags       = [],
  stats      = [],
  collab     = null,
}) {
  return (
    <header className="lab-hero">

      {/* Back nav */}
      <Link to={back_href} className="lab-hero__back">
        <span className="lab-hero__back_arrow">←</span>
        {back_label}
      </Link>

      {/* Eyebrow + status badge row */}
      <div className="lab-hero__meta_row">
        {eyebrow && <span className="lab-hero__eyebrow">{eyebrow}</span>}
        {status && (
          <span className={`card__status_badge card__status_badge--${status}`}>
            {status === "live" && <span className="card__live_dot" />}
            {STATUS_LABEL[status] ?? status}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="lab-hero__title">{title}</h1>

      {/* Subtitle */}
      {subtitle && <p className="lab-hero__subtitle">{subtitle}</p>}

      {/* Abstract */}
      {abstract && <p className="lab-hero__abstract">{abstract}</p>}

      {/* Collaborator */}
      {collab && <p className="lab-hero__collab">{collab}</p>}

      {/* Bottom divider row: stats + tags */}
      {(stats.length > 0 || tags.length > 0) && (
        <div className="lab-hero__bottom">
          {stats.length > 0 && (
            <div className="lab-hero__stats">
              {stats.map(s => (
                <div key={s.label} className="lab-hero__stat">
                  <span className="lab-hero__stat_num">{s.value}</span>
                  <span className="lab-hero__stat_label">{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {tags.length > 0 && (
            <div className="lab-hero__tags">
              {tags.map(tag => (
                <Pill key={tag} label={tag} />
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
