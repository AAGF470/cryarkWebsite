import { useParams } from "react-router-dom";
import { useCmsQuery, LAB_ENTRY_BY_SLUG } from "@shared/lib/cms";
import { PortableText }   from "@portabletext/react";
import SiteNav            from "@shared/components/ui/SiteNav";
import SiteFooter         from "@shared/components/ui/SiteFooter";
import CodeBlock          from "@shared/components/ui/CodeBlock";
import CalloutBlock       from "@shared/components/ui/CalloutBlock";
import ImageBlock         from "@shared/components/ui/ImageBlock";
import ScreenshotGallery  from "@shared/components/ui/ScreenshotGallery";
import VideoPlayer        from "@shared/components/ui/VideoPlayer";
import FactGrid           from "@shared/components/ui/FactGrid";
import RoadmapBlock       from "@shared/components/ui/RoadmapBlock";
import ChangelogBlock     from "@shared/components/ui/ChangelogBlock";
import CinematicBanner    from "@shared/components/ui/CinematicBanner";
import ContentCards       from "@shared/components/ui/ContentCards";
import TitleBlock         from "@shared/components/ui/TitleBlock";
import SideBySide         from "@shared/components/ui/SideBySide";
import Spacer             from "@shared/components/ui/Spacer";
import DiagramBlock       from "@shared/components/ui/DiagramBlock";
import RawDiagramBlock    from "@shared/components/ui/RawDiagramBlock";
import ArchitectureBlock  from "@shared/components/ui/ArchitectureBlock";
import HierarchyBlock     from "@shared/components/ui/HierarchyBlock";
import "./DevlogDetailPage.css";
import { GUILLEN_NAV } from "../nav.jsx";

// ---------------------------------------------------------------------------
// DevlogDetailPage — guillen.studio/devlog/:slug
//
// Two-layer rendering:
//   sections[]         — full-width visual blocks rendered before the body
//                        (video, gallery, roadmap, etc.)
//   content_sections[] — structured article body with heading + inline blocks
//                        (rich text, code, callout, image, etc.)
// ---------------------------------------------------------------------------



function format_date(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// ── Full-width block renderer (for sections[]) ────────────────────────────

function FullBlockRenderer({ block }) {
  switch (block._type) {
    case "titleBlock":
      return <TitleBlock {...block} />;

    case "screenshotGalleryBlock":
      return <ScreenshotGallery images={block.images ?? []} label={block.label} />;

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

    case "changelogBlock":
      return <ChangelogBlock heading={block.heading} entries={block.entries ?? []} />;

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

    case "sideBySideBlock": {
      const left_block  = block.left?.[0]  ?? null;
      const right_block = block.right?.[0] ?? null;
      return (
        <SideBySide
          split={block.split ?? "50/50"}
          align={block.align ?? "start"}
          left={left_block  ? <FullBlockRenderer block={left_block}  /> : null}
          right={right_block ? <FullBlockRenderer block={right_block} /> : null}
        />
      );
    }

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

    case "codeBlock":
      return (
        <CodeBlock
          language={block.language ?? "text"}
          title={block.title}
          code={block.code ?? ""}
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

    case "spacerBlock":
      return <Spacer {...block} />;

    default:
      return null;
  }
}

// ── Inline block renderer (for content_sections[].content[]) ─────────────

function render_block(block) {
  switch (block._type) {
    case "block":
      return <PortableText key={block._key ?? block._id} value={[block]} />;

    case "codeBlock":
      return (
        <CodeBlock
          key={block._key ?? block._id}
          language={block.language ?? "text"}
          title={block.title}
          code={block.code ?? ""}
        />
      );

    case "calloutBlock":
      return (
        <CalloutBlock
          key={block._key ?? block._id}
          variant={block.variant ?? "note"}
          label={block.label}
          body={block.body ?? ""}
        />
      );

    case "imageBlock":
      return (
        <ImageBlock
          key={block._key ?? block._id}
          image_src={block.image_src ?? null}
          alt={block.alt}
          caption={block.caption}
          size={block.size ?? "normal"}
        />
      );

    case "diagramBlock":
      return (
        <DiagramBlock
          key={block._key ?? block._id}
          heading={block.heading}
          code={block.code ?? ""}
          caption={block.caption}
        />
      );

    case "rawDiagramBlock":
      return (
        <RawDiagramBlock
          key={block._key ?? block._id}
          heading={block.heading}
          html_code={block.html_code ?? ""}
          height={block.height ?? 560}
          caption={block.caption}
        />
      );

    case "architectureBlock":
      return (
        <ArchitectureBlock
          key={block._key ?? block._id}
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
          key={block._key ?? block._id}
          heading={block.heading}
          caption={block.caption}
          nodes={block.nodes ?? []}
        />
      );

    case "designDecision":
      return (
        <div key={block._key ?? block._id} className="dd-decision">
          {block.key && <span className="dd-decision__key">{block.key}</span>}
          {block.description && <p className="dd-decision__desc">{block.description}</p>}
        </div>
      );

    case "spacerBlock":
      return <Spacer key={block._key ?? block._id} {...block} />;

    default:
      return null;
  }
}

// ── Content sections (article body) ──────────────────────────────────────

function ContentSections({ sections }) {
  if (!sections?.length) return null;
  return sections.map((section, i) => (
    <div key={section.section_id ?? i} className="dd-section">
      {section.section_label && (
        <h2 className="dd-section-heading">{section.section_label}</h2>
      )}
      {section.content?.map(block => render_block(block))}
    </div>
  ));
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function DevlogDetailPage() {
  const { slug } = useParams();
  const { data, loading } = useCmsQuery(LAB_ENTRY_BY_SLUG, { slug });

  if (loading) {
    return (
      <div className="page">
        <div className="gh-grain" aria-hidden="true" />
        <SiteNav links={GUILLEN_NAV} logo_text="AG" preset="minimal" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page">
        <div className="gh-grain" aria-hidden="true" />
        <SiteNav links={GUILLEN_NAV} logo_text="AG" preset="minimal" />
        <main className="dd-page">
          <div className="dd-not-found">
            <p>Entry not found.</p>
            <a href="/devlog" className="dd-back">← Devlog</a>
          </div>
        </main>
        <SiteFooter variant="guillen" />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="gh-grain" aria-hidden="true" />

      <SiteNav links={GUILLEN_NAV} logo_text="AG" preset="minimal" />

      <article className="dd-page">

        {/* ── Header ── */}
        <header className="dd-header">
          <a href="/devlog" className="dd-back">← Devlog</a>

          {data.eyebrow && (
            <p className="dd-eyebrow">{data.eyebrow}</p>
          )}

          <h1 className="dd-title">{data.title}</h1>

          {data.subtitle && (
            <p className="dd-subtitle">{data.subtitle}</p>
          )}

          <div className="dd-meta">
            {data.published_at && (
              <span className="dd-date">{format_date(data.published_at)}</span>
            )}
            {data.tags?.length > 0 && (
              <div className="dd-tags">
                {data.tags.map(t => (
                  <span key={t} className="dd-tag">{t}</span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* ── Full-width sections (video, gallery, roadmap, etc.) ── */}
        {data.sections?.length > 0 && (
          <div className="dd-full-sections">
            {data.sections.map((block, i) => (
              <FullBlockRenderer key={block._key ?? i} block={block} />
            ))}
          </div>
        )}

        {/* ── Article body ── */}
        <div className="dd-body">
          {data.abstract && (
            <p className="dd-abstract">{data.abstract}</p>
          )}

          <ContentSections sections={data.content_sections} />

          {data.tags?.length > 0 && (
            <div className="dd-tags dd-tags--footer">
              {data.tags.map(t => (
                <span key={t} className="dd-tag">{t}</span>
              ))}
            </div>
          )}
        </div>

      </article>

      <SiteFooter variant="guillen" />
    </div>
  );
}
