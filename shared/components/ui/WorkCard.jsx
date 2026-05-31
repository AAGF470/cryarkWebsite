import { useCmsQuery, cmsImageUrl, LATEST_DEVLOG_BY_PROJECT } from "@shared/lib/cms";
import Pill from "./Pill";
import "./WorkCard.css";

// ---------------------------------------------------------------------------
// WorkCard
//
// Horizontal project card for the /work listing page.
// Four composable slots — each optional, collapses gracefully when absent:
//
//   Meta      — always shown: status, title, description, tags
//   Primary   — thumbnail image (or subtle placeholder when not set)
//   Code      — preview_code snippet from Sanity (hidden when null)
//   Devlog    — latest devlog for this project (hidden when none published)
//
// Desktop layout (flex row):
//   [Meta 240px fixed] [Primary flex-grow] [Code 210px] [Devlog 210px]
//
// Mobile: stacks vertically; code slot hidden to keep it scannable.
//
// Props:
//   id            string   — product._id, used to query the latest devlog
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
  try { return cmsImageUrl(asset).width(640).auto("format").url(); }
  catch { return null; }
}

function format_date(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// ── Slot components ────────────────────────────────────────────────────────

function MetaSlot({ title, slug, description, tags, status }) {
  return (
    <div className="wc__meta">
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
      <span className="wc__cta">View project →</span>
    </div>
  );
}

function PrimarySlot({ thumbnail, title }) {
  const img = thumb_url(thumbnail);
  return (
    <div className="wc__primary">
      {img ? (
        <img className="wc__img" src={img} alt={`${title} preview`} loading="lazy" />
      ) : (
        <div className="wc__placeholder" aria-hidden="true">
          <span className="wc__placeholder_label">in development</span>
        </div>
      )}
    </div>
  );
}

function CodeSlot({ preview_code }) {
  return (
    <div className="wc__code">
      {preview_code.label && (
        <p className="wc__code_label">{preview_code.label}</p>
      )}
      <pre className="wc__pre">
        <code>{preview_code.code}</code>
      </pre>
    </div>
  );
}

function DevlogSlot({ devlog, project_slug }) {
  return (
    <a
      href={`/devlog/${devlog.slug}`}
      className="wc__log"
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
  );
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
  // Fetch latest devlog for this project — returns null while loading or if none exist
  const { data: devlog } = useCmsQuery(
    LATEST_DEVLOG_BY_PROJECT,
    { project_id: id },
  );

  const has_code   = !!(preview_code?.code);
  const has_devlog = !!devlog;

  return (
    <article className="wc">
      <a href={`/work/${slug}`} className="wc__inner" aria-label={`View ${title}`}>
        <MetaSlot
          title={title}
          slug={slug}
          description={description}
          tags={tags}
          status={status}
        />
        <PrimarySlot thumbnail={thumbnail} title={title} />
        {has_code   && <CodeSlot   preview_code={preview_code} />}
        {has_devlog && <DevlogSlot devlog={devlog} project_slug={slug} />}
      </a>
    </article>
  );
}
