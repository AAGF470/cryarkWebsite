import { useNavigate } from "react-router-dom";
import { useCmsQuery, cmsImageUrl, LATEST_DEVLOG_BY_PROJECT } from "@shared/lib/cms";
import Pill from "./Pill";
import "./WorkCard.css";

// ---------------------------------------------------------------------------
// WorkCard — Apple-style bento layout
//
// One large outer card (the "frame") whose background shows through as the
// visible gap between three fixed-height inner cards:
//
//   ┌────────────────────────────────────────┐
//   │  ┌──────────────┐  ┌───────────────┐  │
//   │  │   Image      │  │   Meta        │  │  ← same height
//   │  └──────────────┘  └───────────────┘  │
//   │  ┌──────────────────────────────────┐  │
//   │  │   Code                           │  │  ← same height, full width
//   │  └──────────────────────────────────┘  │
//   └────────────────────────────────────────┘
//
// The outer card's 10px padding + 10px grid gap creates a uniform gold-tinted
// gutter that visually separates every inner card from each other and the edge.
//
// Code overflow is hard-capped by the fixed height + overflow:hidden — it
// cannot expand the card regardless of snippet length.
//
// Devlog link is folded into the meta cell footer rather than a 4th cell.
// ---------------------------------------------------------------------------

const STATUS_LABEL = {
  released: "Released",
  in_dev:   "In dev",
  research: "Research",
  live:     "Live",
  collab:   "Collab",
};

function thumb_url(asset) {
  if (!asset) return null;
  try { return cmsImageUrl(asset).width(1400).auto("format").url(); }
  catch { return null; }
}

function format_date(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// ── Main export ────────────────────────────────────────────────────────────

export default function WorkCard({
  id,
  title,
  slug,
  description,
  tags = [],
  status,
  thumbnail,
  preview_code,
}) {
  const navigate = useNavigate();
  const { data: devlog } = useCmsQuery(LATEST_DEVLOG_BY_PROJECT, { project_id: id });

  const has_code = !!(preview_code?.code);
  const img_src  = thumb_url(thumbnail);

  return (
    <article
      className="wc"
      onClick={() => navigate(`/work/${slug}`)}
    >
      <div className="wc__grid">

        {/* ── Image card ─────────────────────────────────────────────── */}
        <div className="wc__img-cell">
          {img_src ? (
            <img
              className="wc__img"
              src={img_src}
              alt={`${title} preview`}
              loading="lazy"
            />
          ) : (
            <div className="wc__placeholder" aria-hidden="true">
              <span className="wc__placeholder_label">in development</span>
            </div>
          )}
        </div>

        {/* ── Meta card ──────────────────────────────────────────────── */}
        <div className="wc__meta-cell">

          {/* Top content */}
          <div className="wc__meta-top">
            {status && (
              <span className={`wc__status wc__status--${status}`}>
                {STATUS_LABEL[status] ?? status}
              </span>
            )}
            <h3 className="wc__title">{title}</h3>
            {description && <p className="wc__desc">{description}</p>}
            {tags.length > 0 && (
              <div className="wc__tags">
                {tags.slice(0, 4).map(t => <Pill key={t} label={t} />)}
              </div>
            )}
          </div>

          {/* Footer — devlog + CTA */}
          <div className="wc__meta-footer">
            {devlog && (
              <a
                href={`/devlog/${devlog.slug}`}
                className="wc__devlog-link"
                onClick={e => e.stopPropagation()}
                aria-label={`Read devlog: ${devlog.title}`}
              >
                <span className="wc__devlog-link__eyebrow">Latest devlog</span>
                <span className="wc__devlog-link__title">{devlog.title}</span>
                {devlog.published_at && (
                  <span className="wc__devlog-link__date">{format_date(devlog.published_at)}</span>
                )}
              </a>
            )}
            <a
              href={`/work/${slug}`}
              className="wc__cta"
              onClick={e => e.stopPropagation()}
              aria-label={`View ${title}`}
            >
              View project →
            </a>
          </div>

        </div>

        {/* ── Code card (full width, hard-capped height) ─────────────── */}
        {has_code && (
          <div className="wc__code-cell">
            {preview_code.label && (
              <div className="wc__code-header">
                <span className="wc__code-lang">
                  {preview_code.language?.toUpperCase() ?? "CODE"}
                </span>
                <span className="wc__code-label">{preview_code.label}</span>
              </div>
            )}
            <pre className="wc__pre">
              <code>{preview_code.code}</code>
            </pre>
          </div>
        )}

      </div>
    </article>
  );
}
