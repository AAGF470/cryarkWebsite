import { useParams } from "react-router-dom";
import { useCmsQuery, LAB_ENTRY_BY_SLUG } from "@shared/lib/cms";
import SiteNav    from "@shared/components/ui/SiteNav";
import SiteFooter from "@shared/components/ui/SiteFooter";
import { PortableText } from "@portabletext/react";
import "./DevlogDetailPage.css";

// ---------------------------------------------------------------------------
// DevlogDetailPage — guillen.studio/devlog/:slug
//
// Fetches a single lab/devlog entry by slug and renders it as a long-form
// article with header metadata, abstract, and structured content sections.
// ---------------------------------------------------------------------------

const GUILLEN_NAV = [
  { to: "/work",   label: "Work"   },
  { to: "/devlog", label: "Devlog" },
  { to: "/about",  label: "About"  },
];

function format_date(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// ── Block renderer ────────────────────────────────────────────────────────

function render_block(block) {
  switch (block._type) {
    case "block":
      return <PortableText key={block._key ?? block._id} value={[block]} />;

    case "codeBlock":
      return (
        <div key={block._key ?? block._id} className="dd-code">
          <div className="dd-code-hdr">
            {block.language && (
              <span className="dd-code-hdr__lang">{block.language}</span>
            )}
            {block.title && (
              <span className="dd-code-hdr__title">{block.title}</span>
            )}
          </div>
          <pre><code>{block.code}</code></pre>
        </div>
      );

    default:
      return null;
  }
}

// ── Content sections ──────────────────────────────────────────────────────

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

// ── Fallback sections (sections[] instead of content_sections[]) ──────────

function FallbackSections({ sections }) {
  if (!sections?.length) return null;
  return sections.map((section, i) => (
    <div key={section._key ?? i} className="dd-section">
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
        <SiteNav links={GUILLEN_NAV} logo_text="AG" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page">
        <div className="gh-grain" aria-hidden="true" />
        <SiteNav links={GUILLEN_NAV} logo_text="AG" />
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

  const use_content_sections =
    data.content_sections && data.content_sections.length > 0;

  return (
    <div className="page">
      <div className="gh-grain" aria-hidden="true" />

      <SiteNav links={GUILLEN_NAV} logo_text="AG" />

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

        {/* ── Body ── */}
        <div className="dd-body">
          {data.abstract && (
            <p className="dd-abstract">{data.abstract}</p>
          )}

          {use_content_sections
            ? <ContentSections sections={data.content_sections} />
            : <FallbackSections sections={data.sections} />
          }

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
