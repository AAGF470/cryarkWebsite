import Button from "./Button";
import "./PricingCTA.css";

// ---------------------------------------------------------------------------
// PricingCTA
//
// Dedicated purchase / download section. Shows price, platform store links,
// and an optional Patreon support strip. Sits near the bottom of product pages.
//
// Props:
//   heading       string?  — e.g. "Get the Game" (default: "Available Now")
//   price         string?  — "$9.99" | "Free" | "Pay What You Want"
//   price_note    string?  — "One-time purchase · DRM-free"
//   links         array    — [{ label, href, variant?, icon_slug? }]
//   patreon_href  string?  — Patreon page URL
//   patreon_label string?  — default "Support on Patreon"
//   note          string?  — fine print below everything
// ---------------------------------------------------------------------------

export default function PricingCTA({
  heading       = "Available Now",
  price         = null,
  price_note    = null,
  links         = [],
  patreon_href  = null,
  patreon_label = "Support on Patreon",
  note          = null,
}) {
  return (
    <section className="pricing-cta">
      <div className="pricing-cta__inner">

        {/* ── Heading ───────────────────────────────────────────────────── */}
        <p className="pricing-cta__eyebrow">Download</p>
        <h2 className="pricing-cta__heading">{heading}</h2>

        {/* ── Price ─────────────────────────────────────────────────────── */}
        {price && (
          <div className="pricing-cta__price_wrap">
            <span className="pricing-cta__price">{price}</span>
            {price_note && (
              <span className="pricing-cta__price_note">{price_note}</span>
            )}
          </div>
        )}

        {/* ── Store links ───────────────────────────────────────────────── */}
        {links.length > 0 && (
          <div className="pricing-cta__links">
            {links.map((link, i) => (
              <Button
                key={i}
                label={link.label}
                href={link.href}
                variant={link.variant ?? (i === 0 ? "solid" : "ghost-bordered")}
                show_arrow={false}
              />
            ))}
          </div>
        )}

        {/* ── Patreon strip ─────────────────────────────────────────────── */}
        {patreon_href && (
          <a
            href={patreon_href}
            className="pricing-cta__patreon"
            target="_blank"
            rel="noreferrer"
          >
            <span className="pricing-cta__patreon_icon" aria-hidden="true">
              {/* Patreon "P" wordmark as SVG */}
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <path d="M14.82 2.41C11.57 2.41 8.93 5.05 8.93 8.3c0 3.24 2.64 5.87 5.89 5.87 3.24 0 5.88-2.63 5.88-5.87 0-3.25-2.64-5.89-5.88-5.89zM2 21.6h3.5V2.41H2V21.6z"/>
              </svg>
            </span>
            {patreon_label}
            <span className="pricing-cta__patreon_arrow" aria-hidden="true">→</span>
          </a>
        )}

        {/* ── Fine print ────────────────────────────────────────────────── */}
        {note && <p className="pricing-cta__note">{note}</p>}
      </div>
    </section>
  );
}
