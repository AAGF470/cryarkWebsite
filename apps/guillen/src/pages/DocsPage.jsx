import { useParams, useNavigate } from "react-router-dom";
import { useEffect }              from "react";
import { useCmsQuery, DOC_SPACE_NAV, DOC_PAGE_BY_SLUG } from "@shared/lib/cms";
import { PortableText }           from "@portabletext/react";
import SiteNav                    from "@shared/components/ui/SiteNav";
import SiteFooter                 from "@shared/components/ui/SiteFooter";
import DocSidebar                 from "@shared/components/ui/DocSidebar";
import CodeBlock                  from "@shared/components/ui/CodeBlock";
import CalloutBlock               from "@shared/components/ui/CalloutBlock";
import ImageBlock                 from "@shared/components/ui/ImageBlock";
import Spacer                     from "@shared/components/ui/Spacer";
import DiagramBlock               from "@shared/components/ui/DiagramBlock";
import ArchitectureBlock          from "@shared/components/ui/ArchitectureBlock";
import "./DocsPage.css";

// ---------------------------------------------------------------------------
// DocsPage — guillen.studio/docs/:space_slug/:page_slug
//
// Three-column layout:
//   Left  (260px) — DocSidebar: nested page tree, sticky
//   Center (flex) — Page content: title, content_sections[], prev/next
//   Right (200px) — In-page TOC: auto-generated from content_sections
//
// /docs/:space_slug with no page_slug redirects to the first page in the space.
// ---------------------------------------------------------------------------

const GUILLEN_NAV = [
  { to: "/work",   label: "Work"   },
  { to: "/devlog", label: "Devlog" },
  { to: "/about",  label: "About"  },
];

// ── Inline block renderer ────────────────────────────────────────────────────

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

    case "architectureBlock":
      return (
        <ArchitectureBlock
          key={block._key ?? block._id}
          heading={block.heading}
          caption={block.caption}
          layout={block.layout ?? "hub"}
          center_id={block.center_id}
          nodes={block.nodes ?? []}
          edges={block.edges ?? []}
        />
      );

    case "spacerBlock":
      return <Spacer key={block._key ?? block._id} {...block} />;

    default:
      return null;
  }
}

// ── Content sections ─────────────────────────────────────────────────────────

function DocContent({ sections }) {
  if (!sections?.length) return null;
  return sections.map((section, i) => (
    <section
      key={section.section_id ?? i}
      id={section.section_id}
      className="docs-section"
    >
      {section.section_label && (
        <h2 className="docs-section__heading">{section.section_label}</h2>
      )}
      <div className="docs-section__body">
        {section.content?.map(block => render_block(block))}
      </div>
    </section>
  ));
}

// ── In-page TOC (right column) ────────────────────────────────────────────────

function DocTOC({ sections }) {
  const items = sections?.filter(s => s.section_label && s.section_id) ?? [];
  if (items.length < 2) return null;

  return (
    <aside className="docs-toc">
      <p className="docs-toc__heading">On this page</p>
      <ul className="docs-toc__list">
        {items.map(s => (
          <li key={s.section_id} className="docs-toc__item">
            <a href={`#${s.section_id}`} className="docs-toc__link">
              {s.section_label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// ── Prev / Next pager ────────────────────────────────────────────────────────
// Uses the flat ordered pages array from space nav for sequential navigation.

function DocPager({ pages, current_slug, space_slug }) {
  if (!pages?.length) return null;
  const idx  = pages.findIndex(p => p.slug === current_slug);
  const prev = idx > 0             ? pages[idx - 1] : null;
  const next = idx < pages.length - 1 ? pages[idx + 1] : null;
  if (!prev && !next) return null;

  return (
    <nav className="docs-pager" aria-label="Page navigation">
      {prev ? (
        <a href={`/docs/${space_slug}/${prev.slug}`} className="docs-pager__btn docs-pager__btn--prev">
          <span className="docs-pager__dir">← Previous</span>
          <span className="docs-pager__title">{prev.title}</span>
        </a>
      ) : <span />}
      {next && (
        <a href={`/docs/${space_slug}/${next.slug}`} className="docs-pager__btn docs-pager__btn--next">
          <span className="docs-pager__dir">Next →</span>
          <span className="docs-pager__title">{next.title}</span>
        </a>
      )}
    </nav>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const { space_slug, page_slug } = useParams();
  const navigate = useNavigate();

  const { data: space, loading: space_loading } =
    useCmsQuery(DOC_SPACE_NAV, { space_slug });

  const { data: page, loading: page_loading } =
    useCmsQuery(
      DOC_PAGE_BY_SLUG,
      { space_slug, page_slug: page_slug ?? "" },
    );

  // ── Redirect /docs/:space to first page ──────────────────────────────────
  useEffect(() => {
    if (!page_slug && !space_loading && space?.pages?.length > 0) {
      // Prefer a root-level page (no parent) at order 0, fall back to first
      const first = space.pages.find(p => !p.parent_id) ?? space.pages[0];
      navigate(`/docs/${space_slug}/${first.slug}`, { replace: true });
    }
  }, [page_slug, space_loading, space, space_slug, navigate]);

  const loading = space_loading || page_loading;

  // ── 404 — space not found ─────────────────────────────────────────────────
  if (!space_loading && !space) {
    return (
      <div className="page">
        <div className="gh-grain" aria-hidden="true" />
        <SiteNav links={GUILLEN_NAV} logo_text="AG" />
        <div className="docs-not-found">
          <p>Documentation not found.</p>
          <a href="/work">← Back to Work</a>
        </div>
        <SiteFooter variant="guillen" />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="gh-grain" aria-hidden="true" />
      <SiteNav links={GUILLEN_NAV} logo_text="AG" />

      <div className="docs-layout">

        {/* ── Left sidebar ──────────────────────────────────────────────── */}
        <DocSidebar
          space_title={space?.title ?? ""}
          space_slug={space_slug}
          pages={space?.pages ?? []}
          current_slug={page_slug ?? ""}
        />

        {/* ── Main content ──────────────────────────────────────────────── */}
        <main className="docs-main">

          {!loading && page && (
            <>
              <header className="docs-header">
                <h1 className="docs-title">{page.title}</h1>
              </header>

              <div className="docs-body">
                <DocContent sections={page.content_sections} />
              </div>

              <DocPager
                pages={space?.pages ?? []}
                current_slug={page_slug}
                space_slug={space_slug}
              />
            </>
          )}

          {!loading && !page && page_slug && (
            <div className="docs-not-found">
              <p>Page not found.</p>
              <a href={`/docs/${space_slug}`}>← Back to docs</a>
            </div>
          )}

        </main>

        {/* ── Right TOC ─────────────────────────────────────────────────── */}
        {!loading && page && (
          <DocTOC sections={page.content_sections} />
        )}

      </div>

      <SiteFooter variant="guillen" />
    </div>
  );
}
