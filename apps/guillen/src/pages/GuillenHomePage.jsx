import SiteFooter  from "@shared/components/ui/SiteFooter";
import SiteNav     from "@shared/components/ui/SiteNav";
import HeroSection from "@shared/sections/HeroSection";
import FeatureGrid from "@shared/sections/FeatureGrid";
import { useCmsQuery, ALL_SITE_LINKS } from "@shared/lib/cms";
import "./GuillenHomePage.css";
import { GUILLEN_NAV, GUILLEN_NAV_CTA, GUILLEN_CONTACT_MAILTO } from "../nav.jsx";

// ---------------------------------------------------------------------------
// GuillenHomePage — guillen.studio
//
// The studio's living front door: statement hero, then a compact
// "Work with me" section (guillen.studio is devlogs + in-development
// products + portfolio + a light work-with-me surface — cryark.net is the
// cinematic showcase). Add Sanity-fed devlog/product feeds from
// @shared/sections as content goes live.
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

// ── Work with me ──────────────────────────────────────────────────────────
// Honest, light-touch services section — no invented pricing, one mailto CTA.

const WORK_WITH_ME_ITEMS = [
  {
    title: "Product & web design",
    body:  "Sites and interfaces designed and built end to end — from first sketch to a fast, shipped thing you own outright.",
  },
  {
    title: "Web systems & component libraries",
    body:  "Shared UI systems, CMS-driven page builders, and the plumbing that keeps a family of sites consistent without repeating work.",
  },
  {
    title: "Automation consulting for small businesses",
    body:  "Scripts, pipelines, and small tools that take the repetitive stuff off your plate. Practical scope, no enterprise theater.",
  },
];

function WorkWithMe() {
  return (
    <section aria-label="Work with me">
      <FeatureGrid
        eyebrow="Work with me"
        headline="Available for select projects."
        subtext="Alongside studio work I take on a small amount of outside work — design, web systems, and automation."
        expression="list"
        items={WORK_WITH_ME_ITEMS}
      />
      <div className="gh-wwm__cta">
        <a href={GUILLEN_CONTACT_MAILTO} className="gh-wwm__link">
          Have something in mind? Get in touch →
        </a>
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

      <SiteNav links={GUILLEN_NAV} logo_text="AG" preset="bar" {...GUILLEN_NAV_CTA} />

      <Hero hero_links={hero_links} />

      <WorkWithMe />

      <SiteFooter variant="guillen" />
    </div>
  );
}
