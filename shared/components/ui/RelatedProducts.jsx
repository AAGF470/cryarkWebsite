import { Link } from "react-router-dom";
import { useCmsQuery } from "../../lib/cms";
import { RELATED_PRODUCTS } from "../../lib/queries";
import "./RelatedProducts.css";

// ---------------------------------------------------------------------------
// RelatedProducts
//
// Auto-fetches up to 3 other products from Sanity (excluding the current one)
// and renders a "More from Cryark" card strip at the bottom of product pages.
//
// Props:
//   current_slug  string  — slug of the current product (excluded from results)
// ---------------------------------------------------------------------------

const STATUS_LABELS = {
  released: "Released",
  in_dev:   "In Dev",
  research: "Research",
  live:     "Live",
  collab:   "Collab",
};

export default function RelatedProducts({ current_slug }) {
  const { data: products, loading } = useCmsQuery(RELATED_PRODUCTS, { slug: current_slug });

  // Don't render anything while loading or if no related products exist
  if (loading || !products?.length) return null;

  return (
    <section className="related-products">
      <div className="related-products__header">
        <p className="related-products__eyebrow">More from Cryark</p>
      </div>

      <div className="related-products__grid">
        {products.map(product => (
          <RelatedCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}

function RelatedCard({ product }) {
  const { title, slug, subtitle, status, tags = [], thumbnail } = product;
  const status_label = STATUS_LABELS[status] ?? status;

  return (
    <Link
      to={`/products/${slug}`}
      className="related-products__card"
    >
      {/* Thumbnail */}
      <div className="related-products__thumb">
        {thumbnail?.asset
          ? <img src={`${thumbnail.asset._ref}`} alt={title} />
          : <div className="related-products__thumb_placeholder" />
        }
        <div className="related-products__thumb_veil" />
      </div>

      {/* Info */}
      <div className="related-products__info">
        {status && (
          <span className={`related-products__status related-products__status--${status}`}>
            {status_label}
          </span>
        )}
        <h3 className="related-products__title">{title}</h3>
        {subtitle && (
          <p className="related-products__subtitle">{subtitle}</p>
        )}
        {tags.length > 0 && (
          <div className="related-products__tags">
            {tags.slice(0, 2).map(tag => (
              <span key={tag} className="related-products__tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <span className="related-products__arrow" aria-hidden="true">→</span>
    </Link>
  );
}
