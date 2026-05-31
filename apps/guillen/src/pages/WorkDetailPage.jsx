import { useParams, Link } from "react-router-dom";
import { useCmsQuery, PRODUCT_BY_SLUG, cmsImageUrl } from "@shared/lib/cms";
import { PortableText } from "@portabletext/react";
import SiteNav          from "@shared/components/ui/SiteNav";
import SiteFooter       from "@shared/components/ui/SiteFooter";
import CodeBlock        from "@shared/components/ui/CodeBlock";
import TitleBlock       from "@shared/components/ui/TitleBlock";
import FeatureSpotlight from "@shared/components/ui/FeatureSpotlight";
import ScreenshotGallery from "@shared/components/ui/ScreenshotGallery";
import VideoPlayer      from "@shared/components/ui/VideoPlayer";
import FactGrid         from "@shared/components/ui/FactGrid";
import RoadmapBlock     from "@shared/components/ui/RoadmapBlock";
import Spacer           from "@shared/components/ui/Spacer";
import "./WorkDetailPage.css";

// ---------------------------------------------------------------------------
// WorkDetailPage — guillen.studio/work/:slug
//
// Fetches a single product by slug and renders a full detail page.
// Sections are driven by the `sections[]` array from Sanity via a
// BlockRenderer switch, so each section type maps to its own component.
// ---------------------------------------------------------------------------

const GUILLEN_NAV = [
  { to: "/work",   label: "Work"   },
  { to: "/devlog", label: "Devlog" },
  { to: "/about",  label: "About"  },
];

const STATUS_LABEL = {
  released: "Released",
  in_dev:   "In dev",
  research: "Research",
  live:     "Live",
  collab:   "Collab",
};

// ── Image helper ──────────────────────────────────────────────────────────

function product_img(asset, w = 1400) {
  if (!asset) return null;
  try { return cmsImageUrl(asset).width(w).auto("format").url(); }
  catch { return null; }
}

// ── Section block renderer ────────────────────────────────────────────────

function BlockRenderer({ block }) {
  switch (block._type) {
    case "titleBlock":
      return <TitleBlock {...block} />;

    case "textSection":
      return (
        <div className="wd-text-section">
          {block.heading && <h2 className="wd-section-heading">{block.heading}</h2>}
          {block.body && <PortableText value={block.body} />}
        </div>
      );

    case "codeBlock":
      return (
        <CodeBlock
          language={block.language}
          title={block.title}
          code={block.code}
        />
      );

    case "featureSpotlightBlock":
      return <FeatureSpotlight {...block} />;

    case "screenshotGalleryBlock":
      return <ScreenshotGallery images={block.images} label={block.label} />;

    case "videoBlock":
      return <VideoPlayer {...block} />;

    case "factGridBlock":
      return (
        <FactGrid
          heading={block.heading}
          facts={block.facts}
          columns={block.columns}
        />
      );

    case "roadmapBlock":
      return <RoadmapBlock {...block} />;

    case "spacerBlock":
      return <Spacer {...block} />;

    default:
      return null;
  }
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function WorkDetailPage() {
  const { slug } = useParams();
  const { data: product, loading } = useCmsQuery(PRODUCT_BY_SLUG, { slug });

  const hero_src = product_img(product?.key_art ?? product?.hero_image, 1400);

  // ── 404 state ─────────────────────────────────────────────────────────
  if (!loading && !product) {
    return (
      <div className="page">
        <div className="gh-grain" aria-hidden="true" />
        <SiteNav links={GUILLEN_NAV} logo_text="AG" />
        <div className="wd-not-found">
          <p>Project not found.</p>
          <Link to="/work" className="wd-back">← Work</Link>
        </div>
        <SiteFooter variant="guillen" />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="gh-grain" aria-hidden="true" />

      <SiteNav links={GUILLEN_NAV} logo_text="AG" />

      <article className="wd-page">

        {/* ── Loading placeholder ────────────────────────────────────── */}
        {loading ? null : (
          <>
            {/* ── Hero ───────────────────────────────────────────────── */}
            <section className="wd-hero">
              <Link to="/work" className="wd-back">← Work</Link>

              {product.eyebrow && (
                <p className="wd-eyebrow">{product.eyebrow}</p>
              )}

              <h1 className="wd-title">{product.title}</h1>

              {(product.status || product.tags?.length > 0) && (
                <div className="wd-meta">
                  {product.status && (
                    <span className={`wd-status wd-status--${product.status}`}>
                      {STATUS_LABEL[product.status] ?? product.status}
                    </span>
                  )}
                  {product.tags?.map(tag => (
                    <span key={tag} className="wd-tag">{tag}</span>
                  ))}
                </div>
              )}

              {(product.description || product.subtitle) && (
                <p className="wd-desc">
                  {product.description ?? product.subtitle}
                </p>
              )}

              {hero_src && (
                <img
                  className="wd-hero-img"
                  src={hero_src}
                  alt={`${product.title} key art`}
                  loading="eager"
                />
              )}

              {product.cta_links?.length > 0 && (
                <div className="wd-cta-row">
                  {product.cta_links.map((cta, i) => (
                    <a
                      key={i}
                      href={cta.url}
                      className="wd-cta-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {cta.label}
                    </a>
                  ))}
                </div>
              )}
            </section>

            {/* ── Body ───────────────────────────────────────────────── */}
            <div className="wd-body">

              {/* Sections */}
              {product.sections?.map((block, i) => (
                <BlockRenderer key={block._key ?? i} block={block} />
              ))}

              {/* Built With */}
              {product.built_with?.length > 0 && (
                <div className="wd-built-with-wrapper">
                  <p className="wd-section-label">Built with</p>
                  <div className="wd-built-with">
                    {product.built_with.map(tech => (
                      <span key={tech.name} className="wd-built-chip">
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Platforms */}
              {product.platforms?.length > 0 && (
                <div className="wd-platforms-wrapper">
                  <p className="wd-section-label">Platforms</p>
                  <div className="wd-platforms">
                    {product.platforms.map(platform => (
                      <a
                        key={platform.slug}
                        href={platform.src ?? "#"}
                        className="wd-platform-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {platform.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </article>

      <SiteFooter variant="guillen" />
    </div>
  );
}
