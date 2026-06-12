import { useParams, Link } from "react-router-dom";
import { useCmsQuery, PRODUCT_BY_SLUG, DEVLOGS_BY_PROJECT, cmsImageUrl } from "@shared/lib/cms";
import { PortableText } from "@portabletext/react";
import SiteNav            from "@shared/components/ui/SiteNav";
import SiteFooter         from "@shared/components/ui/SiteFooter";
import CodeBlock          from "@shared/components/ui/CodeBlock";
import TitleBlock         from "@shared/components/ui/TitleBlock";
import FeatureSpotlight   from "@shared/components/ui/FeatureSpotlight";
import ScreenshotGallery  from "@shared/components/ui/ScreenshotGallery";
import VideoPlayer        from "@shared/components/ui/VideoPlayer";
import FactGrid           from "@shared/components/ui/FactGrid";
import RoadmapBlock       from "@shared/components/ui/RoadmapBlock";
import CinematicBanner    from "@shared/components/ui/CinematicBanner";
import ContentCards       from "@shared/components/ui/ContentCards";
import EmbeddedApp        from "@shared/components/ui/EmbeddedApp";
import PricingCTA         from "@shared/components/ui/PricingCTA";
import SystemRequirements from "@shared/components/ui/SystemRequirements";
import ChangelogBlock     from "@shared/components/ui/ChangelogBlock";
import CalloutBlock       from "@shared/components/ui/CalloutBlock";
import ImageBlock         from "@shared/components/ui/ImageBlock";
import DiagramBlock       from "@shared/components/ui/DiagramBlock";
import RawDiagramBlock    from "@shared/components/ui/RawDiagramBlock";
import ArchitectureBlock  from "@shared/components/ui/ArchitectureBlock";
import HierarchyBlock     from "@shared/components/ui/HierarchyBlock";
import AssetGrid          from "@shared/components/ui/AssetGrid";
import SideBySide         from "@shared/components/ui/SideBySide";
import Spacer             from "@shared/components/ui/Spacer";
import "./WorkDetailPage.css";
import { GUILLEN_NAV } from "../nav.jsx";

// ---------------------------------------------------------------------------
// WorkDetailPage — guillen.studio/work/:slug
//
// Fetches a single product by slug and renders a full detail page.
// Sections are driven by the `sections[]` array from Sanity via a
// BlockRenderer switch, so each section type maps to its own component.
// ---------------------------------------------------------------------------



const STATUS_LABEL = {
  released: "Released",
  in_dev:   "In dev",
  research: "Research",
  live:     "Live",
  collab:   "Collab",
};

function format_date(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

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
      return (
        <FeatureSpotlight
          title={block.heading}
          description={block.body}
          eyebrow={block.eyebrow}
          image_src={block.image_src ?? null}
          video_src={block.video_src ?? null}
          flip={block.flip ?? false}
          media_fit={block.media_fit ?? "cover"}
          media_bg={block.media_bg ?? null}
          actions={
            block.cta_label
              ? [{ label: block.cta_label, href: block.cta_href, variant: "solid" }]
              : []
          }
        />
      );

    case "screenshotGalleryBlock":
      return <ScreenshotGallery images={block.images ?? []} label={block.label} />;

    case "cinematicBannerBlock":
      return (
        <CinematicBanner
          image_src={block.image_src ?? null}
          eyebrow={block.eyebrow}
          heading={block.heading ?? ""}
          body={block.body}
          align={block.align ?? "left"}
          min_height={block.min_height ?? "520px"}
          cta_label={block.cta_label}
          cta_href={block.cta_href}
        />
      );

    case "contentCardsBlock":
      return (
        <ContentCards
          heading={block.heading}
          cards={block.cards ?? []}
          columns={block.columns}
          card_height={block.card_height ?? 280}
        />
      );

    case "videoBlock":
      return (
        <VideoPlayer
          eyebrow={block.eyebrow}
          title={block.title}
          video_mp4={block.video_mp4}
          video_webm={block.video_webm}
          poster_src={block.poster_src ?? null}
          caption={block.caption}
          aspect_ratio={block.aspect_ratio ?? "16/9"}
        />
      );

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

    case "embeddedAppBlock":
      return (
        <EmbeddedApp
          title={block.title}
          description={block.description}
          embed_url={block.embed_url ?? ""}
          poster_src={block.poster_src ?? null}
          launch_label={block.launch_label ?? "Launch"}
          warning={block.warning}
          height={block.height ?? 620}
        />
      );

    case "assetDownloadBlock":
      return (
        <AssetGrid
          heading={block.heading}
          assets={block.assets ?? []}
        />
      );

    case "pricingCtaBlock":
      return (
        <PricingCTA
          heading={block.heading}
          price={block.price}
          price_note={block.price_note}
          links={block.links ?? []}
          patreon_href={block.patreon_href}
          patreon_label={block.patreon_label}
          note={block.note}
        />
      );

    case "systemRequirementsBlock":
      return (
        <SystemRequirements
          heading={block.heading}
          platform_note={block.platform_note}
          minimum={block.minimum}
          recommended={block.recommended}
          tested_on={block.tested_on}
        />
      );

    case "changelogBlock":
      return (
        <ChangelogBlock
          heading={block.heading}
          entries={block.entries ?? []}
        />
      );

    case "imageBlock":
      return (
        <ImageBlock
          image_src={block.image_src ?? null}
          alt={block.alt}
          caption={block.caption}
          size={block.size ?? "normal"}
        />
      );

    case "calloutBlock":
      return (
        <CalloutBlock
          variant={block.variant ?? "note"}
          label={block.label}
          body={block.body ?? ""}
        />
      );

    case "diagramBlock":
      return (
        <DiagramBlock
          heading={block.heading}
          code={block.code ?? ""}
          caption={block.caption}
        />
      );

    case "rawDiagramBlock":
      return (
        <RawDiagramBlock
          heading={block.heading}
          html_code={block.html_code ?? ""}
          height={block.height ?? 560}
          caption={block.caption}
        />
      );

    case "architectureBlock":
      return (
        <ArchitectureBlock
          heading={block.heading}
          caption={block.caption}
          layout={block.layout ?? "hub"}
          center_id={block.center_id}
          node_size={block.node_size ?? "default"}
          nodes={block.nodes ?? []}
          edges={block.edges ?? []}
        />
      );

    case "hierarchyBlock":
      return (
        <HierarchyBlock
          heading={block.heading}
          caption={block.caption}
          nodes={block.nodes ?? []}
        />
      );

    case "sideBySideBlock": {
      const left_block  = block.left?.[0]  ?? null;
      const right_block = block.right?.[0] ?? null;
      return (
        <SideBySide
          split={block.split ?? "50/50"}
          align={block.align ?? "start"}
          left={left_block  ? <BlockRenderer block={left_block}  /> : null}
          right={right_block ? <BlockRenderer block={right_block} /> : null}
        />
      );
    }

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

  // Fetch devlog entries linked to this product (runs once product._id is known)
  const { data: devlogs } = useCmsQuery(
    DEVLOGS_BY_PROJECT,
    { project_id: product?._id ?? "" },
  );

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
                      href={cta.href}
                      className={`wd-cta-btn wd-cta-btn--${cta.variant ?? "solid"}`}
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
                    {product.built_with.map(tech => {
                      const logo = tech.logo_url ?? tech.src ?? null;
                      return (
                        <span key={tech.name} className="wd-built-chip">
                          {logo && (
                            <img
                              src={logo}
                              alt={tech.name}
                              className="wd-built-chip__logo"
                            />
                          )}
                          {tech.name}
                        </span>
                      );
                    })}
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

            {/* ── Devlog feed ─────────────────────────────────────────── */}
            {devlogs?.length > 0 && (
              <section className="wd-devlog-feed">
                <div className="wd-devlog-feed__header">
                  <p className="wd-section-label">Devlog</p>
                  <a href="/devlog" className="wd-devlog-feed__all">View all →</a>
                </div>
                <div className="wd-devlog-list">
                  {devlogs.map(entry => (
                    <a
                      key={entry._id}
                      href={`/devlog/${entry.slug}`}
                      className="wd-devlog-row"
                    >
                      <span className="wd-devlog-row__date">
                        {format_date(entry.published_at)}
                      </span>
                      <div className="wd-devlog-row__body">
                        <span className="wd-devlog-row__title">{entry.title}</span>
                        {(entry.abstract || entry.subtitle) && (
                          <p className="wd-devlog-row__abstract">
                            {entry.abstract ?? entry.subtitle}
                          </p>
                        )}
                        {entry.tags?.length > 0 && (
                          <div className="wd-devlog-row__tags">
                            {entry.tags.map(t => (
                              <span key={t} className="wd-tag">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="wd-devlog-row__arrow" aria-hidden="true">→</span>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

      </article>

      <SiteFooter variant="guillen" />
    </div>
  );
}
