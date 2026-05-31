import { useCmsQuery, ALL_PRODUCTS_WORK } from "@shared/lib/cms";
import WorkCard  from "@shared/components/ui/WorkCard";
import SiteNav   from "@shared/components/ui/SiteNav";
import SiteFooter from "@shared/components/ui/SiteFooter";
import "./WorkPage.css";

// ---------------------------------------------------------------------------
// WorkPage — guillen.studio/work
//
// Lists all published products as horizontal WorkCards.
// Each card is a composable mini-dashboard:
//   Meta | Primary image | Code snippet | Latest devlog
// Slots collapse gracefully when content isn't set in Sanity.
// ---------------------------------------------------------------------------

const GUILLEN_NAV = [
  { to: "/work",   label: "Work"   },
  { to: "/devlog", label: "Devlog" },
  { to: "/about",  label: "About"  },
];

function EmptyState() {
  return (
    <div className="work__empty">
      <div className="work__empty_icon" aria-hidden="true">◈</div>
      <p className="work__empty_msg">No projects published yet.</p>
      <p className="work__empty_sub">Check back soon.</p>
    </div>
  );
}

export default function WorkPage() {
  const { data, loading } = useCmsQuery(ALL_PRODUCTS_WORK);

  return (
    <div className="page">
      <div className="gh-grain" aria-hidden="true" />

      <SiteNav links={GUILLEN_NAV} logo_text="AG" />

      <header className="work__header">
        <div className="work__header_inner">
          <div className="work__eyebrow">Angel A. Guillen · guillen.studio</div>
          <h1 className="work__title">Work</h1>
        </div>
      </header>

      <main className="work__main">
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
