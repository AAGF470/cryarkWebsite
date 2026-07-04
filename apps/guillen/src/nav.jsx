// ---------------------------------------------------------------------------
// nav.jsx — Guillen.studio nav links + icons
// Import GUILLEN_NAV into each page instead of redefining it.
// ---------------------------------------------------------------------------

// ── Inline SVG icons (zero deps) ──────────────────────────────────────────

const WorkIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
    stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1.25" y="1.25" width="5.25" height="5.25" rx="1.2"/>
    <rect x="8.5"  y="1.25" width="5.25" height="5.25" rx="1.2"/>
    <rect x="1.25" y="8.5"  width="5.25" height="5.25" rx="1.2"/>
    <rect x="8.5"  y="8.5"  width="5.25" height="5.25" rx="1.2"/>
  </svg>
);

const DevlogIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
    stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
    <rect x="2.5" y="1.5" width="10" height="12" rx="1.5"/>
    <line x1="5" y1="5"   x2="10" y2="5"/>
    <line x1="5" y1="7.5" x2="10" y2="7.5"/>
    <line x1="5" y1="10"  x2="8"  y2="10"/>
  </svg>
);

const AboutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
    stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
    <circle cx="7.5" cy="4.5" r="2.5"/>
    <path d="M2 14c0-3.038 2.462-5.5 5.5-5.5S13 10.962 13 14"/>
  </svg>
);

// Exported for the future Derg docs page
export const DocsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
    stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
    <path d="M3 1.5h7A1.5 1.5 0 0 1 11.5 3v9A1.5 1.5 0 0 1 10 13.5H3V1.5z"/>
    <path d="M11.5 11.5A1.5 1.5 0 0 1 13 13H3"/>
    <line x1="5.5" y1="5"   x2="9.5" y2="5"/>
    <line x1="5.5" y1="7.5" x2="9.5" y2="7.5"/>
  </svg>
);

// ── Nav link definitions ───────────────────────────────────────────────────

export const GUILLEN_NAV = [
  { to: "/work",   label: "Work",   icon: <WorkIcon /> },
  { to: "/devlog", label: "Devlog", icon: <DevlogIcon /> },
  { to: "/about",  label: "About",  icon: <AboutIcon /> },
];

// ── Contact CTA ────────────────────────────────────────────────────────────
// TODO: no contact email exists in the app yet — hello@guillen.studio is a
// placeholder; swap for the real inbox once it's set up.
export const GUILLEN_CONTACT_EMAIL = "hello@guillen.studio";
export const GUILLEN_CONTACT_MAILTO = `mailto:${GUILLEN_CONTACT_EMAIL}`;

// Spread into every SiteNav so the "Get in touch" CTA is consistent site-wide.
export const GUILLEN_NAV_CTA = {
  cta_label: "Get in touch",
  cta_href:  GUILLEN_CONTACT_MAILTO,
};
