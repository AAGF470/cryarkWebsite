import SiteFooter  from "@shared/components/ui/SiteFooter";
import SiteNav     from "@shared/components/ui/SiteNav";
import HeroSection from "@shared/sections/HeroSection";
import { useCmsQuery, ALL_SITE_LINKS } from "@shared/lib/cms";
import "./GuillenHomePage.css";
import { GUILLEN_NAV } from "../nav.jsx";

// ---------------------------------------------------------------------------
// GuillenHomePage — guillen.studio
//
// Pre-launch: hero only until work + devlogs are published in Sanity.
// The hero is the shared HeroSection in its "statement" expression — the
// dark-cinematic recipe's default opener (poster type, actions under a
// hairline). Add sections from @shared/sections as content goes live.
// ---------------------------------------------------------------------------



// ── Hero ──────────────────────────────────────────────────────────────────

function Hero({ hero_links = [] }) {
  // Look for a GitHub link tagged for the hero slot
  const github_link = hero_links.find(l => l.icon === "github" || l.label?.toLowerCase() === "github");

  const ctas = [
    { label: "View work", href: "/work",   variant: "solid" },
    { label: "Devlogs",   href: "/devlog", variant: "ghost" },
  ];
  if (github_link) {
    ctas.push({ label: "GitHub ↗", href: github_link.url, variant: "ghost" });
  }

  return (
    <HeroSection
      expression="statement"
      eyebrow="Angel A. Guillen · guillen.studio"
      headline={
        <>
          I build tools.<br />
          <em className="gh-hero__accent">I ship games.</em>
        </>
      }
      subtext={
        <>
          <span className="gh-hero__motto">vivere est creare</span>
          Engineer and solo game developer. C#, C++, Python — Godot, Unity,
          Blender. Building toward games industry through systems depth and
          shipped work.
        </>
      }
      ctas={ctas}
    />
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
      <SiteNav links={GUILLEN_NAV} logo_text="AG" preset="minimal" />

      <Hero hero_links={hero_links} />

      <SiteFooter variant="guillen" />
    </div>
  );
}
