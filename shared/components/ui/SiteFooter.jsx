import { useCmsQuery, ALL_SITE_LINKS } from "@shared/lib/cms";
import { SOCIAL_ICONS }               from "./SocialIcon";
import "./SiteFooter.css";

// ---------------------------------------------------------------------------
// SiteFooter
//
// Shared footer for cryark.net and guillen.studio.
// Social links come from the CMS `siteLink` document type (show_in: "footer").
// If no CMS links are configured yet, falls back to the FALLBACK_LINKS below.
//
// Props:
//   variant  "cryark" | "guillen"  — controls wordmark and fallback links
// ---------------------------------------------------------------------------

const YEAR = new Date().getFullYear();

// ── Static config per site ─────────────────────────────────────────────────
const VARIANTS = {
  cryark: {
    wordmark: "cryark.net",
    dev_href: "/showcase",
  },
  guillen: {
    wordmark: "guillen.studio",
    dev_href: null,
  },
};

// ── Fallback links (shown until CMS links are added) ──────────────────────
// Once you add siteLink documents in Sanity these are never shown.
const FALLBACK_LINKS = {
  cryark: [
    { key: "itch",    label: "itch.io",  href: "https://itch.io",               external: true },
    { key: "steam",   label: "Steam",    href: "https://store.steampowered.com", external: true },
    { key: "patreon", label: "Patreon",  href: "https://patreon.com",            external: true },
  ],
  guillen: [
    { key: "github",   label: "GitHub",   href: "https://github.com",   external: true },
    { key: "linkedin", label: "LinkedIn", href: "https://linkedin.com", external: true },
  ],
};

export default function SiteFooter({ variant = "cryark" }) {
  const cfg = VARIANTS[variant] ?? VARIANTS.cryark;

  // Fetch all site links from CMS; filter to footer slot
  const { data: cms_links } = useCmsQuery(ALL_SITE_LINKS, { site: variant });

  // Use CMS links if any are tagged for footer; otherwise use fallback
  const footer_links =
    cms_links?.filter(l => l.show_in?.includes("footer")).length > 0
      ? cms_links.filter(l => l.show_in?.includes("footer"))
      : FALLBACK_LINKS[variant] ?? [];

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">

        <div className="site-footer__top">
          {/* ── Brand identity ── */}
          <div className="site-footer__brand">
            <span className="site-footer__wordmark">{cfg.wordmark}</span>
            <p className="site-footer__motto">vivere est creare</p>
            <p className="site-footer__credit">
              Angel A. Guillen Flores
              {" · "}
              <a
                className="site-footer__credit_link"
                href="https://guillen.studio"
                target="_blank"
                rel="noreferrer"
              >
                guillen.studio
              </a>
            </p>
          </div>

          {/* ── Social / platform icon links ── */}
          {footer_links.length > 0 && (
            <nav className="site-footer__social" aria-label="External links">
              {footer_links.map(link => {
                // CMS link shape: { _id, label, url, icon, logo_url }
                // Fallback link shape: { key, label, href, external }
                const key      = link.icon ?? link.key;
                const href     = link.url  ?? link.href;
                const external = link.external ?? true;
                const Icon     = SOCIAL_ICONS[key];

                return (
                  <a
                    key={link._id ?? link.key ?? link.label}
                    className="site-footer__social_link"
                    href={href}
                    title={link.label}
                    aria-label={link.label}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                  >
                    {link.logo_url ? (
                      <img
                        src={link.logo_url}
                        alt={link.label}
                        width={20}
                        height={20}
                        style={{ display: "block", objectFit: "contain" }}
                      />
                    ) : Icon ? (
                      <Icon size={20} />
                    ) : (
                      <span>{link.label}</span>
                    )}
                  </a>
                );
              })}
            </nav>
          )}
        </div>

        {/* ── Art slot — empty container, add illustration / texture later ── */}
        <div className="site-footer__art" aria-hidden="true" />

        {/* ── Bottom bar ── */}
        <div className="site-footer__bottom">
          <span className="site-footer__copy">
            © {YEAR} Angel A. Guillen Flores
          </span>

          {/* Dev shortcut — only visible in development builds */}
          {import.meta.env.DEV && cfg.dev_href && (
            <a href={cfg.dev_href} className="site-footer__dev_link">
              components ↗
            </a>
          )}
        </div>

      </div>
    </footer>
  );
}
