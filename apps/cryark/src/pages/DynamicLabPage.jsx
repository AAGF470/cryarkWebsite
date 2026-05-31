import { lazy, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import SiteNav from "@shared/components/ui/SiteNav";
import LabHero from "@shared/components/ui/LabHero";
import DocLayout from "@shared/components/ui/DocLayout";
import Button from "@shared/components/ui/Button";
import PortableTextRenderer from "@shared/components/cms/PortableTextRenderer";
import VideoPlayer from "@shared/components/ui/VideoPlayer";
import EmbeddedApp from "@shared/components/ui/EmbeddedApp";
import AssetGrid from "@shared/components/ui/AssetGrid";
import RoadmapBlock from "@shared/components/ui/RoadmapBlock";
import ChangelogBlock from "@shared/components/ui/ChangelogBlock";
import ScreenshotGallery from "@shared/components/ui/ScreenshotGallery";
import ContentCards from "@shared/components/ui/ContentCards";
import FactGrid from "@shared/components/ui/FactGrid";
import CinematicBanner from "@shared/components/ui/CinematicBanner";
import Spacer from "@shared/components/ui/Spacer";
import TitleBlock from "@shared/components/ui/TitleBlock";
import SiteFooter from "@shared/components/ui/SiteFooter";
import { useCmsQuery, LAB_ENTRY_BY_SLUG, cmsImageUrl } from "@shared/lib/cms";
import "./DynamicLabPage.css";

const ModelViewer = lazy(() => import("@shared/components/ui/ModelViewer"));

// ── Image URL helper ─────────────────────────────────────────────────────────

function san_img(asset, width = 1600) {
  if (!asset) return null;
  try {
    return cmsImageUrl(asset).width(width).auto("format").url();
  } catch { return null; }
}

// ── Lab section renderer (shared block types) ─────────────────────────────────

function render_lab_section(section, idx) {
  const { _type } = section;

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

  if (_type === "roadmapBlock") {
    return (
      <RoadmapBlock
        key        ={section._key       ?? idx}
        eyebrow    ={section.eyebrow    ?? null}
        heading    ={section.heading    ?? null}
        milestones ={section.milestones ?? []}
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

  if (_type === "factGridBlock") {
    return (
      <FactGrid
        key     ={section._key ?? idx}
        heading ={section.heading ?? null}
        facts   ={section.facts  ?? []}
        columns ={section.columns ?? null}
      />
    );
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
        min_height={section.min_height ?? "clamp(360px,55vh,520px)"}
        cta_label ={section.cta_label  ?? null}
        cta_href  ={section.cta_href   ?? null}
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

  if (_type === "spacerBlock") {
    return <Spacer key={section._key ?? idx} size={section.size ?? "md"} />;
  }

  return null;
}

// ---------------------------------------------------------------------------
// DynamicLabPage
// Catch-all route: /lab/:slug
//
// Fetches a labEntry document from Sanity and renders it with the same
// DocLayout + section structure as the static DergPage, but fully data-driven.
//
// Sidebar navigation and section content come entirely from the CMS.
// The DergPage.css class names are reused directly — no extra layer.
// ---------------------------------------------------------------------------

export default function DynamicLabPage() {
  const { slug } = useParams();
  const { data: entry, loading, error } = useCmsQuery(LAB_ENTRY_BY_SLUG, { slug });

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="dynlab__shell">
        <SiteNav />
        <div className="dynlab__state">
          <div className="dynlab__spinner" />
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  // ── Error / not found ─────────────────────────────────────────────────────
  if (error || !entry) {
    return (
      <div className="dynlab__shell">
        <SiteNav />
        <div className="dynlab__state dynlab__state--error">
          <p className="dynlab__state_title">Entry not found</p>
          <p className="dynlab__state_sub">
            This lab entry doesn't exist or hasn't been published yet.
          </p>
          <Link to="/" className="dynlab__state_back">← Back to lab</Link>
        </div>
      </div>
    );
  }

  const page_sections    = entry.sections          ?? [];
  const sections         = entry.content_sections  ?? [];
  const sidebar_nav      = entry.sidebar_sections  ?? [];

  // ── Page ──────────────────────────────────────────────────────────────────
  return (
    <div className="derg__page">
      <SiteNav />

      {/* Full-width hero — outside the doc grid */}
      <LabHero
        back_href  ="/lab"
        back_label="Lab"
        eyebrow  ={entry.eyebrow  ?? null}
        title    ={entry.title}
        subtitle ={entry.subtitle ?? null}
        abstract ={entry.abstract ?? null}
        status   ={entry.status   ?? null}
        tags     ={entry.tags     ?? []}
        collab   ={entry.collab   ?? null}
        stats    ={entry.stats    ?? []}
      />

      {/* Full-width page sections (trailers, demos, assets, roadmaps…) */}
      {page_sections.map((section, idx) => render_lab_section(section, idx))}

      {/* Sidebar + content grid */}
      <DocLayout sections={sidebar_nav}>

        {sections.map((section, idx) => {
          const is_last = idx === sections.length - 1;
          return (
            <section
              key={section.section_id ?? idx}
              id={section.section_id}
              className={`derg__section${is_last ? " derg__section--last" : ""}`}
              data-doc-section
            >
              <div className="derg__container derg__container--wide">
                {section.section_label && (
                  <div className="derg__section_label">{section.section_label}</div>
                )}
                <PortableTextRenderer content={section.content} />
              </div>
            </section>
          );
        })}

      </DocLayout>

      <SiteFooter />
    </div>
  );
}
