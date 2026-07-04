import { useState } from "react";
import { useCmsQuery, ALL_DEVLOGS, PAGE_CONFIG } from "@shared/lib/cms";
import SiteNav    from "@shared/components/ui/SiteNav";
import SiteFooter from "@shared/components/ui/SiteFooter";
import "./DevlogPage.css";
import { GUILLEN_NAV, GUILLEN_NAV_CTA } from "../nav.jsx";

// ---------------------------------------------------------------------------
// DevlogPage — guillen.studio/devlog
//
// Featured latest entry rendered as a hero card.
// Remaining entries as a chronological list with year-group dividers.
// Year filter buttons show per-year counts.
//
// Optional hero background image + title/desc + pinned featured entry
// are driven by a "pageConfig" document in Sanity (page_id = "guillen_devlog").
// ---------------------------------------------------------------------------



function format_date(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function relative_date(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  const days = Math.floor((Date.now() - date) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days <   7) return `${days} days ago`;
  if (days <  30) return `${Math.floor(days / 7)}w ago`;
  return format_date(iso);
}

function format_year(iso) {
  if (!iso) return null;
  return new Date(iso).getFullYear();
}

// ── Featured (hero) entry card ────────────────────────────────────────────

function FeaturedEntry({ entry, pinned }) {
  if (!entry) return null;
  return (
    <a href={`/devlog/${entry.slug}`} className="dl-featured">
      <p className="dl-featured__badge">
        {pinned ? "Featured entry" : "Latest entry"}
      </p>

      <div className="dl-featured__meta">
        <span className="dl-featured__date">{relative_date(entry.published_at)}</span>
        {entry.project_title && (
          <a
            href={`/work/${entry.project_slug}`}
            className="dl-row__project"
            onClick={e => e.stopPropagation()}
          >
            {entry.project_title}
          </a>
        )}
      </div>

      <h2 className="dl-featured__title">{entry.title}</h2>

      {(entry.abstract || entry.subtitle) && (
        <p className="dl-featured__abstract">{entry.abstract ?? entry.subtitle}</p>
      )}

      {entry.tags?.length > 0 && (
        <div className="dl-row__tags">
          {entry.tags.map(t => (
            <span key={t} className="dl-row__tag">{t}</span>
          ))}
        </div>
      )}

      <span className="dl-featured__cta">Read entry →</span>
    </a>
  );
}

// ── Individual devlog row ─────────────────────────────────────────────────

function DevlogRow({ entry }) {
  return (
    <a href={`/devlog/${entry.slug}`} className="dl-row">
      <div className="dl-row__date">{format_date(entry.published_at)}</div>

      <div className="dl-row__body">
        <div className="dl-row__top">
          <h3 className="dl-row__title">{entry.title}</h3>
          {entry.project_title && (
            <a
              href={`/work/${entry.project_slug}`}
              className="dl-row__project"
              onClick={e => e.stopPropagation()}
            >
              {entry.project_title}
            </a>
          )}
        </div>

        {(entry.abstract || entry.subtitle) && (
          <p className="dl-row__abstract">{entry.abstract ?? entry.subtitle}</p>
        )}

        {entry.tags?.length > 0 && (
          <div className="dl-row__tags">
            {entry.tags.map(t => (
              <span key={t} className="dl-row__tag">{t}</span>
            ))}
          </div>
        )}
      </div>

      <span className="dl-row__arrow" aria-hidden="true">→</span>
    </a>
  );
}

// ── Year filter bar ───────────────────────────────────────────────────────

function YearFilter({ years, counts, total, active, onChange }) {
  return (
    <div className="dl-filter">
      <button
        className={`dl-filter__btn${active === "all" ? " dl-filter__btn--active" : ""}`}
        onClick={() => onChange("all")}
      >
        All <span className="dl-filter__count">{total}</span>
      </button>
      {years.map(y => (
        <button
          key={y}
          className={`dl-filter__btn${active === y ? " dl-filter__btn--active" : ""}`}
          onClick={() => onChange(y)}
        >
          {y} <span className="dl-filter__count">{counts[y]}</span>
        </button>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function DevlogPage() {
  const { data, loading }     = useCmsQuery(ALL_DEVLOGS);
  const { data: config }      = useCmsQuery(PAGE_CONFIG, { page_id: "guillen_devlog" });
  const [year_filter, set_year_filter] = useState("all");

  const years = data
    ? [...new Set(data.map(e => format_year(e.published_at)).filter(Boolean))].sort((a, b) => b - a)
    : [];

  const year_counts = data
    ? data.reduce((acc, e) => {
        const y = format_year(e.published_at);
        if (y) acc[y] = (acc[y] || 0) + 1;
        return acc;
      }, {})
    : {};

  const entries = data
    ? (year_filter === "all"
        ? data
        : data.filter(e => format_year(e.published_at) === year_filter))
    : [];

  // Use Sanity-pinned featured entry if set; otherwise auto-pick entries[0]
  const config_featured = config?.featured_entry ?? null;
  const is_pinned       = !!config_featured;
  const featured        = config_featured ?? (entries[0] ?? null);

  // List excludes whichever entry is featured to avoid duplication
  const rest = entries.filter(e => e._id !== featured?._id);

  // Render rest of list — with year dividers when viewing all years
  function render_list() {
    if (!rest.length) return null;
    if (year_filter !== "all") {
      return rest.map(e => <DevlogRow key={e._id} entry={e} />);
    }
    const items = [];
    let cur_year = null;
    for (const entry of rest) {
      const y = format_year(entry.published_at);
      if (y !== cur_year) {
        cur_year = y;
        items.push(
          <div key={`divider-${y}`} className="dl-year-divider">{y}</div>
        );
      }
      items.push(<DevlogRow key={entry._id} entry={entry} />);
    }
    return items;
  }

  const has_bg = !!(config?.bg_image_url);

  return (
    <div className="page">
      <div className="gh-grain" aria-hidden="true" />

      <SiteNav links={GUILLEN_NAV} logo_text="AG" preset="bar" {...GUILLEN_NAV_CTA} />

      {/* ── Page header (with optional hero bg image) ───────────────── */}
      <header className={`dl-header${has_bg ? " dl-header--has-bg" : ""}`}>
        {has_bg && (
          <div
            className="dl-hero-bg"
            style={{ backgroundImage: `url(${config.bg_image_url})` }}
            aria-hidden="true"
          />
        )}
        <div className="dl-header__content">
          <div className="dl-header__inner">
            <div className="dl-eyebrow">Angel A. Guillen · guillen.studio</div>
            <h1 className="dl-title">{config?.title ?? "Devlog"}</h1>
            {config?.description && (
              <p className="dl-desc">{config.description}</p>
            )}
          </div>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="dl-main">
        {!loading && years.length > 1 && (
          <YearFilter
            years={years}
            counts={year_counts}
            total={data.length}
            active={year_filter}
            onChange={set_year_filter}
          />
        )}

        {loading ? null : entries.length === 0 ? (
          <div className="dl-empty">
            <p className="dl-empty__icon">◈</p>
            <p className="dl-empty__msg">No devlogs published yet.</p>
            <p className="dl-empty__sub">Check back soon.</p>
          </div>
        ) : (
          <>
            <FeaturedEntry entry={featured} pinned={is_pinned} />

            {rest.length > 0 && (
              <div className="dl-list">
                {render_list()}
              </div>
            )}
          </>
        )}
      </main>

      <SiteFooter variant="guillen" />
    </div>
  );
}
