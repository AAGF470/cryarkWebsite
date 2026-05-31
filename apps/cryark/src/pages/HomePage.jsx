import { useCmsQuery, PRODUCTS_BY_TYPE, ALL_LAB_ENTRIES, cmsImageUrl } from "@shared/lib/cms";
import Card from "@shared/components/ui/Card";
import Button from "@shared/components/ui/Button";
import SiteNav from "@shared/components/ui/SiteNav";
import SiteFooter from "@shared/components/ui/SiteFooter";
import "./HomePage.css";

// ---------------------------------------------------------------------------
// HomePage — cryark.net
//
// Fully CMS-driven. Every section fetches its own data and returns null when
// Sanity has nothing published yet — the page works cleanly at any stage of
// content population, from zero products to a full catalogue.
// ---------------------------------------------------------------------------

// ── Sanity image → URL ─────────────────────────────────────────────────────

function thumb_url(asset) {
  if (!asset) return null;
  try { return cmsImageUrl(asset).width(600).auto("format").url(); }
  catch { return null; }
}

// ── Section label with optional "View all" link ────────────────────────────

function SectionLabel({ label, href }) {
  return (
    <div className="section__label">
      {label}
      <span className="section__label_line" aria-hidden="true" />
      {href && (
        <a href={href} className="section__label_more">
          View all →
        </a>
      )}
    </div>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────
// Always renders — studio identity anchor for the page.

function Hero() {
  return (
    <section className="hero">
      <div className="hero__text">
        <div className="hero__eyebrow">Cryark · Independent Studio</div>

        <h1 className="hero__title">
          Games and tools,<br />
          <em className="hero__title_accent">built to last.</em>
        </h1>

        <p className="hero__subtitle">
          Solo-developed atmospheric games and sharp developer tooling.
          Each project ships when it's ready — crafted with care,
          no compromises.
        </p>

        <div className="hero__actions">
          <Button label="Browse games" href="/games" lava />
          <Button variant="ghost" label="Developer tools →" href="/tools" />
        </div>
      </div>

      {/* Right side — swap in a game poster or trailer thumbnail when ready */}
      <div className="hero__visual" aria-hidden="true">
        <div className="hero__visual_placeholder">
        </div>
      </div>
    </section>
  );
}

// ── CMS product section ────────────────────────────────────────────────────
// Returns null when nothing is published — safe pre-launch.

function ProductSection({ type_label, product_type, view_all_href }) {
  const { data, loading } = useCmsQuery(PRODUCTS_BY_TYPE, { product_type });

  // Don't flash an empty section while loading or before content exists
  if (loading || !data?.length) return null;

  return (
    <section className="section">
      <SectionLabel label={type_label} href={view_all_href} />
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
    </section>
  );
}

// ── Lab section ────────────────────────────────────────────────────────────

function LabSection() {
  const { data, loading } = useCmsQuery(ALL_LAB_ENTRIES);

  if (loading || !data?.length) return null;

  return (
    <section className="section">
      <SectionLabel label="Lab" href="/lab" />
      <div className="card__grid">
        {data.map(entry => (
          <Card
            key={entry._id}
            title={entry.title}
            description={entry.abstract ?? entry.subtitle ?? ""}
            tags={entry.tags ?? []}
            status={entry.status}
            href={`/lab/${entry.slug}`}
          />
        ))}
      </div>
    </section>
  );
}

// ── Studio strip ───────────────────────────────────────────────────────────
// Minimal brand anchor at the bottom. Expands into a fuller about section later.

function StudioStrip() {
  return (
    <section className="studio__strip">
      <div className="studio__strip_text">
        <p className="studio__strip_name">Cryark</p>
        <p className="studio__strip_desc">
          An independent solo studio building atmospheric games and developer tooling.
          Everything ships when it's ready.
        </p>
      </div>
      <Button variant="ghost" label="About Cryark" href="/about" />
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="page">
      <SiteNav />

      <Hero />

      {/* CMS sections — each returns null until content is published */}
      <ProductSection
        type_label="Games"
        product_type="game"
        view_all_href="/games"
      />
      <ProductSection
        type_label="Developer Tools"
        product_type="dev_tool"
        view_all_href="/tools"
      />
      <LabSection />

      <StudioStrip />
      <SiteFooter />
    </div>
  );
}
