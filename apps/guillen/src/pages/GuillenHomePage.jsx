import Button     from "@shared/components/ui/Button";
import SiteFooter from "@shared/components/ui/SiteFooter";
import SiteNav    from "@shared/components/ui/SiteNav";
import { useCmsQuery, ALL_SITE_LINKS } from "@shared/lib/cms";
import "./GuillenHomePage.css";

// ---------------------------------------------------------------------------
// GuillenHomePage — guillen.studio
//
// Pre-launch: hero only until work + devlogs are published in Sanity.
// All other sections (Featured Work, Active Dev, Tech Profile, Devlogs, About)
// are commented out below — re-enable as content goes live.
// ---------------------------------------------------------------------------

const GUILLEN_NAV = [
  { to: "/work",   label: "Work"   },
  { to: "/devlog", label: "Devlog" },
  { to: "/about",  label: "About"  },
];

// ── Hero ──────────────────────────────────────────────────────────────────

function Hero({ hero_links = [] }) {
  // Look for a GitHub link tagged for the hero slot
  const github_link = hero_links.find(l => l.icon === "github" || l.label?.toLowerCase() === "github");

  return (
    <section className="gh-hero">
      <div className="gh-hero__content">
        <div className="gh-hero__eyebrow">Angel A. Guillen · guillen.studio</div>

        <h1 className="gh-hero__title">
          I build tools.<br />
          <em className="gh-hero__accent">I ship games.</em>
        </h1>

        <p className="gh-hero__motto">vivere est creare</p>

        <p className="gh-hero__subtitle">
          Engineer and solo game developer. C#, C++, Python — Godot, Unity, Blender.
          Building toward games industry through systems depth and shipped work.
        </p>

        <div className="gh-hero__actions">
          <Button label="View work"   href="/work"    lava />
          <Button variant="ghost"     label="Devlogs" href="/devlog" />
        </div>

        {github_link && (
          <a href={github_link.url} className="gh-hero__github" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        )}
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function GuillenHomePage() {
  const { data: site_links } = useCmsQuery(ALL_SITE_LINKS, { site: "guillen" });
  const hero_links = site_links?.filter(l => l.show_in?.includes("hero")) ?? [];

  return (
    <div className="page">
      <div className="gh-grain" aria-hidden="true" />

      {/* cta_label intentionally omitted — hides the nav CTA button */}
      <SiteNav links={GUILLEN_NAV} logo_text="AG" />

      <Hero hero_links={hero_links} />

      <SiteFooter variant="guillen" />
    </div>
  );
}
