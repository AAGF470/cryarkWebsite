import { useParams, Link } from "react-router-dom";
import SiteNav from "@shared/components/ui/SiteNav";
import CinematicHero from "@shared/components/ui/CinematicHero";
import ProductInfoBar from "@shared/components/ui/ProductInfoBar";
import FeatureSpotlight from "@shared/components/ui/FeatureSpotlight";
import ScreenshotGallery from "@shared/components/ui/ScreenshotGallery";
import FactGrid from "@shared/components/ui/FactGrid";
import CinematicBanner from "@shared/components/ui/CinematicBanner";
import ContentCards from "@shared/components/ui/ContentCards";
import VideoPlayer from "@shared/components/ui/VideoPlayer";
import EmbeddedApp from "@shared/components/ui/EmbeddedApp";
import AssetGrid from "@shared/components/ui/AssetGrid";
import PricingCTA from "@shared/components/ui/PricingCTA";
import RoadmapBlock from "@shared/components/ui/RoadmapBlock";
import SystemRequirements from "@shared/components/ui/SystemRequirements";
import ChangelogBlock from "@shared/components/ui/ChangelogBlock";
import RelatedProducts from "@shared/components/ui/RelatedProducts";
import TitleBlock from "@shared/components/ui/TitleBlock";
import SiteFooter from "@shared/components/ui/SiteFooter";
import { lazy, Suspense } from "react";
const ModelViewer = lazy(() => import("@shared/components/ui/ModelViewer"));
import Spacer from "@shared/components/ui/Spacer";
import { useCmsQuery, PRODUCT_BY_SLUG, cmsImageUrl } from "@shared/lib/cms";
import "./DynamicProductPage.css";

// ---------------------------------------------------------------------------
// DynamicProductPage
// Catch-all route: /products/:slug
//
// Fetches a product document from Sanity and renders it using the same
// components as TheArchitectPage, but driven entirely by CMS data.
//
// Section types supported:
//   featureSpotlightBlock  → <FeatureSpotlight>
//   textSection            → simple heading + rich-text body
// ---------------------------------------------------------------------------

// ── Sanity image → URL helper ─────────────────────────────────────────────

function san_img(asset, width = 1600) {
  if (!asset) return null;
  try {
    return cmsImageUrl(asset).width(width).auto("format").url();
  } catch {
    return null;
  }
}

// ── Section renderers ─────────────────────────────────────────────────────

function render_section(section, idx) {
  const { _type } = section;

  if (_type === "featureSpotlightBlock") {
    const img_url = san_img(section.image, 1400);
    const actions = [];
    if (section.cta_label && section.cta_href) {
      actions.push({ label: section.cta_label, href: section.cta_href });
    }
    return (
      <FeatureSpotlight
        key={section._key ?? idx}
        eyebrow    ={section.eyebrow    ?? null}
        title      ={section.heading    ?? ""}
        description={section.body       ?? ""}
        image_src  ={section.video_src ? null : img_url}
        video_src  ={section.video_src  ?? null}
        flip       ={section.flip       ?? false}
        media_fit  ={section.media_fit  ?? "cover"}
        media_bg   ={section.media_bg   ?? null}
        platforms  ={[]}
        actions    ={actions}
      />
    );
  }

  if (_type === "factGridBlock") {
    return (
      <FactGrid
        key={section._key ?? idx}
        heading ={section.heading ?? null}
        facts   ={section.facts   ?? []}
        columns ={section.columns ?? null}
      />
    );
  }

  if (_type === "spacerBlock") {
    return <Spacer key={section._key ?? idx} size={section.size ?? "md"} />;
  }

  if (_type === "cinematicBannerBlock") {
    const img_url = san_img(section.image, 1920);
    return (
      <CinematicBanner
        key       ={section._key ?? idx}
        image_src ={img_url}
        eyebrow   ={section.eyebrow    ?? null}
        heading   ={section.heading    ?? ""}
        body      ={section.body       ?? null}
        align     ={section.align      ?? "left"}
        min_height={section.min_height ?? "520px"}
        cta_label ={section.cta_label  ?? null}
        cta_href  ={section.cta_href   ?? null}
      />
    );
  }

  if (_type === "contentCardsBlock") {
    const cards = (section.cards ?? []).map(c => ({
      title:       c.title       ?? "",
      category:    c.category    ?? null,
      description: c.description ?? null,
      image_src:   c.image ? san_img(c.image, 800) : null,
    }));
    return (
      <ContentCards
        key        ={section._key ?? idx}
        heading    ={section.heading     ?? null}
        cards      ={cards}
        columns    ={section.columns     ?? null}
        card_height={section.card_height ?? 280}
      />
    );
  }

  if (_type === "screenshotGalleryBlock") {
    const images = (section.images ?? []).map(s => ({
      src:     san_img(s.image, 1400) ?? "",
      alt:     s.alt     ?? "",
      caption: s.caption ?? "",
    }));
    return (
      <ScreenshotGallery
        key={section._key ?? idx}
        images={images}
        label={section.label ?? null}
      />
    );
  }

  if (_type === "modelViewerBlock") {
    const poster_url = section.poster ? san_img(section.poster, 1200) : null;
    return (
      <Suspense key={section._key ?? idx} fallback={<div style={{ height: section.height ?? 520, background: "#07060a" }} />}>
        <ModelViewer
          src        ={section.model_url  ?? ""}
          poster_src ={poster_url}
          alt        ={section.alt        ?? "3D model"}
          caption    ={section.caption    ?? null}
          auto_rotate={section.auto_rotate ?? true}
          height     ={section.height     ?? 520}
          bg_style   ={section.bg_style   ?? "dark"}
          enable_ar  ={section.enable_ar  ?? false}
        />
      </Suspense>
    );
  }

  if (_type === "videoBlock") {
    const poster_url = section.poster ? san_img(section.poster, 1920) : null;
    return (
      <VideoPlayer
        key          ={section._key      ?? idx}
        eyebrow      ={section.eyebrow   ?? null}
        title        ={section.title     ?? null}
        video_mp4    ={section.video_mp4 ?? ""}
        video_webm   ={section.video_webm ?? null}
        poster_src   ={poster_url}
        caption      ={section.caption   ?? null}
        aspect_ratio ={section.aspect_ratio ?? "16/9"}
      />
    );
  }

  if (_type === "embeddedAppBlock") {
    const poster_url = section.poster ? san_img(section.poster, 1200) : null;
    return (
      <EmbeddedApp
        key          ={section._key           ?? idx}
        title        ={section.title          ?? "Interactive Demo"}
        description  ={section.description    ?? null}
        embed_url    ={section.embed_url      ?? ""}
        poster_src   ={poster_url}
        launch_label ={section.launch_label   ?? "Launch"}
        warning      ={section.warning        ?? null}
        height       ={section.height         ?? 620}
      />
    );
  }

  if (_type === "assetDownloadBlock") {
    const assets = (section.assets ?? []).map(a => ({
      name:        a.name        ?? "",
      category:    a.category    ?? null,
      preview_src: a.preview ? san_img(a.preview, 600) : null,
      file_url:    a.file_url    ?? "#",
      file_type:   a.file_type   ?? "zip",
      file_size:   a.file_size   ?? null,
      license:     a.license     ?? "free",
      description: a.description ?? null,
    }));
    return (
      <AssetGrid
        key     ={section._key ?? idx}
        heading ={section.heading ?? null}
        assets  ={assets}
      />
    );
  }

  if (_type === "pricingCtaBlock") {
    return (
      <PricingCTA
        key          ={section._key          ?? idx}
        heading      ={section.heading       ?? "Available Now"}
        price        ={section.price         ?? null}
        price_note   ={section.price_note    ?? null}
        links        ={section.links         ?? []}
        patreon_href ={section.patreon_href  ?? null}
        patreon_label={section.patreon_label ?? "Support on Patreon"}
        note         ={section.note          ?? null}
      />
    );
  }

  if (_type === "roadmapBlock") {
    return (
      <RoadmapBlock
        key        ={section._key        ?? idx}
        eyebrow    ={section.eyebrow     ?? null}
        heading    ={section.heading     ?? null}
        milestones ={section.milestones  ?? []}
      />
    );
  }

  if (_type === "systemRequirementsBlock") {
    return (
      <SystemRequirements
        key          ={section._key          ?? idx}
        heading      ={section.heading       ?? "System Requirements"}
        minimum      ={section.minimum       ?? null}
        recommended  ={section.recommended   ?? null}
        tested_on    ={section.tested_on     ?? null}
        platform_note={section.platform_note ?? null}
      />
    );
  }

  if (_type === "changelogBlock") {
    return (
      <ChangelogBlock
        key     ={section._key    ?? idx}
        heading ={section.heading ?? "Changelog"}
        entries ={section.entries ?? []}
      />
    );
  }

  if (_type === "titleBlock") {
    return (
      <TitleBlock
        key        ={section._key        ?? idx}
        eyebrow    ={section.eyebrow     ?? null}
        heading    ={section.heading     ?? ""}
        description={section.description ?? null}
        align      ={section.align       ?? "left"}
      />
    );
  }

  if (_type === "textSection") {
    return (
      <section key={section._key ?? idx} className="dynprod__text_section">
        <div className="dynprod__text_inner">
          {section.heading && (
            <h2 className="dynprod__text_heading">{section.heading}</h2>
          )}
          {/* body is portable text — basic inline rendering for now */}
          {Array.isArray(section.body) && section.body.map((block, bi) => (
            <p key={block._key ?? bi} className="dynprod__text_prose">
              {block.children?.map(c => c.text).join("")}
            </p>
          ))}
        </div>
      </section>
    );
  }

  return null;
}

// ── Built-with section ────────────────────────────────────────────────────

function BuiltWithSection({ tools }) {
  if (!tools || tools.length === 0) return null;
  return (
    <section className="dynprod__built">
      <div className="dynprod__built_inner">
        <p className="dynprod__built_label">Built with</p>
        <div className="dynprod__built_logos">
          {tools.map((tool, i) => {
            const logo_url = tool.src ?? san_img(tool.logo, 200) ?? null;
            return (
              <div key={tool.name ?? i} className="dynprod__built_logo">
                {logo_url
                  ? <img src={logo_url} alt={tool.name ?? ""} />
                  : <span>{tool.name}</span>
                }
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function DynamicProductPage() {
  const { slug } = useParams();
  const { data: product, loading, error } = useCmsQuery(PRODUCT_BY_SLUG, { slug });

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="dynprod__shell">
        <SiteNav />
        <div className="dynprod__state">
          <div className="dynprod__spinner" />
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  // ── Error / not found ────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="dynprod__shell">
        <SiteNav />
        <div className="dynprod__state dynprod__state--error">
          <p className="dynprod__state_title">Product not found</p>
          <p className="dynprod__state_sub">
            This product doesn't exist or hasn't been published yet.
          </p>
          <Link to="/" className="dynprod__state_back">← Back home</Link>
        </div>
      </div>
    );
  }

  const hero_url       = san_img(product.hero_image, 1920);
  const cta_actions    = (product.cta_links ?? []).map(c => ({
    label:   c.label,
    href:    c.href,
    variant: c.variant ?? "solid",
    lava:    c.lava    ?? false,
  }));

  // Platform icon priority: uploaded Sanity image → URL string → /icons/{slug}.png
  const platforms = (product.platforms ?? []).map(p => ({
    platform: p.slug ?? "custom",
    src: p.icon
      ? cmsImageUrl(p.icon).width(128).auto("format").url()
      : (p.src ?? null),
  }));

  return (
    <div className="dynprod__page">
      <SiteNav />

      {/* Full-screen cinematic hero */}
      <CinematicHero
        image_src ={hero_url}
        eyebrow   ={product.eyebrow  ?? null}
        title     ={product.title}
        subtitle  ={product.subtitle ?? null}
        actions   ={cta_actions}
        show_scroll={false}
      />

      {/* Metadata band */}
      <ProductInfoBar
        back_href ="/"
        back_label="Products"
        status    ={product.status   ?? "released"}
        tags      ={product.tags     ?? []}
        platforms ={platforms}
      />

      {/* All page sections — order controlled entirely from the CMS */}
      {(product.sections ?? []).map((section, idx) => render_section(section, idx))}

      {/* Built-with logos */}
      <BuiltWithSection tools={product.built_with} />

      {/* Related products */}
      <RelatedProducts current_slug={product.slug?.current ?? slug} />

      <SiteFooter />
    </div>
  );
}
