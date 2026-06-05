import { useNavigate } from "react-router-dom";
import { useCmsQuery, cmsImageUrl, LATEST_DEVLOG_BY_PROJECT } from "@shared/lib/cms";
import Pill from "./Pill";
import "./WorkCard.css";

// ---------------------------------------------------------------------------
// WorkCard — Bento/cube grid layout
//
// Each card is a 2-column grid ("large cube") of smaller cells:
//
//   ┌──────────────┬──────────────┐
//   │  Image cell  │  Meta cell   │  ← always shown
//   ├──────────────┼──────────────┤
//   │  Code cell   │  Devlog cell │  ← bottom row: only when content exists
//   └──────────────┴──────────────┘
//
// If only one bottom-row cell has content it spans both columns.
// If neither has content the card is just the two-cell top row.
//
// The whole card is clickable via article.onClick → navigate(/work/:slug).
// The devlog cell is its own <a> that stopPropagation()s the article click.
// A "View project →" anchor inside the meta cell gives keyboard navigation.
//
// Props:
//   id            string   — product._id, used to query latest devlog
//   title         string
//   slug          string   — URL slug for /work/:slug
//   description   string?
//   tags          string[]
//   status        string
//   thumbnail     object?  — Sanity image asset
//   preview_code  object?  — { language, label, code } from Sanity
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

  const has_code   = !!(preview_code?.code);
  const has_devlog = !!devlog;

  const img_src = thumb_url(thumbnail);

  return (
    <article
      className="wc"
      onClick={() => navigate(`/work/${slug}`)}
    >
      <div className="wc__grid">

        {/* ── Image cell (top-left) ──────────────────────────────────── */}
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

        {/* ── Meta cell (top-right) ─────────────────────────────────── */}
        <div className="wc__meta-cell">
          {status && (
            <span className={`wc__status wc__status--${status}`}>
              {STATUS_LABEL[status] ?? status}
            </span>
          )}
          <h3 className="wc__title">{title}</h3>
          {description && <p className="wc__desc">{description}</p>}
          {tags.length > 0 && (
            <div className="wc__tags">
              {tags.slice(0, 5).map(t => <Pill key={t} label={t} />)}
            </div>
          )}
          {/* Real anchor for keyboard nav — stopPropagation prevents double-navigate */}
          <a
            href={`/work/${slug}`}
            className="wc__cta"
            onClick={e => e.stopPropagation()}
            aria-label={`View ${title}`}
          >
            View project →
          </a>
        </div>

        {/* ── Code cell (bottom-left, optional) ────────────────────── */}
        {has_code && (
          <div className={`wc__code-cell${!has_devlog ? " wc__code-cell--full" : ""}`}>
            {preview_code.label && (
              <p className="wc__code_label">{preview_code.label}</p>
            )}
            <pre className="wc__pre">
              <code>{preview_code.code}</code>
            </pre>
          </div>
        )}

        {/* ── Devlog cell (bottom-right, optional) — its own link ───── */}
        {has_devlog && (
          <a
            href={`/devlog/${devlog.slug}`}
            className={`wc__log-cell${!has_code ? " wc__log-cell--full" : ""}`}
            onClick={e => e.stopPropagation()}
            aria-label={`Read devlog: ${devlog.title}`}
          >
            <p className="wc__log_eyebrow">Latest devlog</p>
            <p className="wc__log_title">{devlog.title}</p>
            {devlog.published_at && (
              <p className="wc__log_date">{format_date(devlog.published_at)}</p>
            )}
            {devlog.abstract && (
              <p className="wc__log_abstract">{devlog.abstract}</p>
            )}
            <span className="wc__log_cta">Read →</span>
          </a>
        )}

      </div>
    </article>
  );
}
