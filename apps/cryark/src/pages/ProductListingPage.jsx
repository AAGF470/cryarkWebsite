import { useCmsQuery, PRODUCTS_BY_TYPE, cmsImageUrl } from "@shared/lib/cms";
import Card from "@shared/components/ui/Card";
import SiteNav from "@shared/components/ui/SiteNav";
import SiteFooter from "@shared/components/ui/SiteFooter";
import "./ProductListingPage.css";

// ---------------------------------------------------------------------------
// ProductListingPage
//
// Generic CMS-driven listing page — shared by GamesPage and ToolsPage.
// Shows every published product of a given product_type in a card grid.
// Returns a graceful empty state when nothing is published yet.
//
// Props:
//   product_type  string  — Sanity product_type value ("game" | "dev_tool")
//   title         string  — Page heading, e.g. "Games"
//   eyebrow       string  — Small label above the heading
//   description   string  — One-sentence subtitle under the heading
// ---------------------------------------------------------------------------

function thumb_url(asset) {
  if (!asset) return null;
  try { return cmsImageUrl(asset).width(640).auto("format").url(); }
  catch { return null; }
}

// ── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ title }) {
  return (
    <div className="listing__empty">
      <div className="listing__empty_icon" aria-hidden="true">◈</div>
      <p className="listing__empty_msg">No {title.toLowerCase()} published yet.</p>
      <p className="listing__empty_sub">Check back soon.</p>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────

export default function ProductListingPage({ product_type, title, eyebrow, description }) {
  const { data, loading } = useCmsQuery(PRODUCTS_BY_TYPE, { product_type });

  return (
    <div className="page">
      <SiteNav />

      {/* ── Page header ── */}
      <header className="listing__header">
        <div className="listing__header_inner">
          <div className="listing__eyebrow">{eyebrow}</div>
          <h1 className="listing__title">{title}</h1>
          {description && <p className="listing__desc">{description}</p>}
        </div>
      </header>

      {/* ── Content ── */}
      <main className="listing__main">
        {!loading && (!data?.length ? (
          <EmptyState title={title} />
        ) : (
          <div className="card__grid">
            {data.map(product => (
              <Card
                key={product._id}
                title={product.title}
                description={product.description ?? product.subtitle ?? ""}
                tags={product.tags ?? []}
                status={product.status}
                thumbnail_url={thumb_url(product.thumbnail)}
                href={`/products/${product.slug}`}
              />
            ))}
          </div>
        ))}
      </main>

      <SiteFooter />
    </div>
  );
}
