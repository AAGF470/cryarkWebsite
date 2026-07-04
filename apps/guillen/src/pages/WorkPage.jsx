import { useCmsQuery, ALL_PRODUCTS_WORK, PAGE_CONFIG, cmsImageUrl } from "@shared/lib/cms";
import WorkCard   from "@shared/components/ui/WorkCard";
import SiteNav    from "@shared/components/ui/SiteNav";
import SiteFooter from "@shared/components/ui/SiteFooter";
import "./WorkPage.css";
import { GUILLEN_NAV } from "../nav.jsx";

// ---------------------------------------------------------------------------
// WorkPage — guillen.studio/work
//
// Lists all published products as horizontal WorkCards.
// Optionally shows a hero background image + featured project card driven
// by a "pageConfig" document in Sanity (page_id = "guillen_work").
// ---------------------------------------------------------------------------



const STATUS_LABEL = {
  released: "Released",
  in_dev:   "In dev",
  research: "Research",
  live:     "Live",
  collab:   "Collab",
};

function feat_thumb(asset) {
  if (!asset) return null;
  try { return cmsImageUrl(asset).width(1400).auto("format").url(); }
  catch { return null; }
}

function EmptyState() {
  return (
    <div className="work__empty">
      <div className="work__empty_icon" aria-hidden="true">◈</div>
      <p className="work__empty_msg">No projects published yet.</p>
      <p className="work__empty_sub">Check back soon.</p>
    </div>
  );
}

// ── Featured project card (shown above the grid when set in Sanity) ─────────

function FeaturedProject({ product }) {
  if (!product) return null;
  const img = feat_thumb(product.thumbnail);

  return (
    <a href={`/work/${product.slug}`} className="work__featured">
      <span className="work__featured__label">Featured</span>

      {img && (
        <div className="work__featured__img-wrap">
          <img
            className="work__featured__img"
            src={img}
            alt={`${product.title} preview`}
            loading="eager"
          />
        </div>
      )}

      <div className="work__featured__body">
        <div className="work__featured__meta">
          {product.status && (
            <span className={`work__featured__status work__featured__status--${product.status}`}>
              {STATUS_LABEL[product.status] ?? product.status}
            </span>
          )}
          {product.tags?.map(t => (
            <span key={t} className="work__featured__tag">{t}</span>
          ))}
        </div>

        <h2 className="work__featured__title">{product.title}</h2>

        {(product.description ?? product.subtitle) && (
          <p className="work__featured__desc">
            {product.description ?? product.subtitle}
          </p>
        )}

        <span className="work__featured__cta">View project →</span>
      </div>
    </a>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function WorkPage() {
  const { data, loading }         = useCmsQuery(ALL_PRODUCTS_WORK);
  const { data: config }          = useCmsQuery(PAGE_CONFIG, { page_id: "guillen_work" });

  const has_bg = !!(config?.bg_image_url);

  return (
    <div className="page">
      <div className="gh-grain" aria-hidden="true" />

      <SiteNav links={GUILLEN_NAV} logo_text="AG" preset="minimal" />

      {/* ── Page header (with optional hero bg image) ────────────────── */}
      <header className={`work__header${has_bg ? " work__header--has-bg" : ""}`}>
        {has_bg && (
          <div
            className="work__hero-bg"
            style={{ backgroundImage: `url(${config.bg_image_url})` }}
            aria-hidden="true"
          />
        )}
        <div className="work__header_content">
          <div className="work__header_inner">
            <div className="work__eyebrow">Angel A. Guillen · guillen.studio</div>
            <h1 className="work__title">{config?.title ?? "Work"}</h1>
            {config?.description && (
              <p className="work__desc">{config.description}</p>
            )}
          </div>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="work__main">

        {/* Featured project — shown when set in Sanity */}
        {!loading && config?.featured_product && (
          <FeaturedProject product={config.featured_product} />
        )}

        {!loading && (!data?.length ? (
          <EmptyState />
        ) : (
          <div className="work__list">
            {data.map(product => (
              <WorkCard
                key={product._id}
                id={product._id}
                title={product.title}
                slug={product.slug}
                description={product.description ?? product.subtitle ?? ""}
                tags={product.tags ?? []}
                status={product.status}
                thumbnail={product.thumbnail}
                preview_code={product.preview_code}
              />
            ))}
          </div>
        ))}
      </main>

      <SiteFooter variant="guillen" />
    </div>
  );
}
