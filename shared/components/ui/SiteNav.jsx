import { NavLink, useLocation } from "react-router-dom";
import { createPortal }         from "react-dom";
import { useEffect, useRef, useState } from "react";
import "./SiteNav.css";

// ---------------------------------------------------------------------------
// SiteNav — floating pill dock
//
// Props:
//   links      array   — nav link items [{ to, label, icon? }]
//   cta_label  string  — CTA text (e.g. "Resume"). Pass null to hide.
//   cta_href   string  — CTA href
//   logo_text  string? — text monogram (e.g. "AG"). Falls back to image logo.
// ---------------------------------------------------------------------------

const DEFAULT_NAV_LINKS = [
  { to: "/games",  label: "Games"  },
  { to: "/tools",  label: "Tools"  },
  { to: "/lab",    label: "Lab"    },
  { to: "/about",  label: "About"  },
];

export default function SiteNav({
  links     = DEFAULT_NAV_LINKS,
  cta_label = "itch.io",
  cta_href  = "https://itch.io",
  logo_text = null,
}) {
  const [hidden,    set_hidden]    = useState(false);
  const [logo_err,  set_logo_err]  = useState(false);
  const [menu_open, set_menu_open] = useState(false);
  const last_y  = useRef(0);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    set_menu_open(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (menu_open) {
      set_hidden(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menu_open]);

  // Auto-hide on scroll down, restore on scroll up / mouse near top
  useEffect(() => {
    function on_scroll() {
      const y     = window.scrollY;
      const delta = y - last_y.current;
      last_y.current = y;
      if (menu_open) return;
      if (y < 80)          set_hidden(false);
      else if (delta > 4)  set_hidden(true);
      else if (delta < -4) set_hidden(false);
    }
    function on_mouse(e) {
      if (e.clientY < 80) set_hidden(false);
    }
    window.addEventListener("scroll",    on_scroll, { passive: true });
    window.addEventListener("mousemove", on_mouse,  { passive: true });
    on_scroll();
    return () => {
      window.removeEventListener("scroll",    on_scroll);
      window.removeEventListener("mousemove", on_mouse);
    };
  }, [menu_open]);

  const cls = [
    "sitenav",
    hidden    ? "sitenav--hidden"    : "",
    menu_open ? "sitenav--menu-open" : "",
  ].filter(Boolean).join(" ");

  // Render via portal so backdrop-filter never hits an overflow:hidden ancestor.
  return createPortal(
    <>
      {/* ── Floating pill ────────────────────────────────────────────────── */}
      <nav className={cls} role="navigation" aria-label="Main navigation">

        {/* Logo / monogram */}
        <NavLink to="/" className="sitenav__logo" end aria-label="Home">
          {logo_text ? (
            <span className="sitenav__logo_text">{logo_text}</span>
          ) : logo_err ? (
            <>cry<span className="sitenav__logo_accent">ark</span></>
          ) : (
            <img
              src="/cryark-logo.svg"
              alt="cryark"
              className="sitenav__logo_img"
              onError={() => set_logo_err(true)}
            />
          )}
        </NavLink>

        {/* Hairline separator */}
        <span className="sitenav__sep" aria-hidden="true" />

        {/* Nav links — icon + sliding label */}
        <div className="sitenav__links">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sitenav__link${isActive ? " sitenav__link--active" : ""}`
              }
            >
              {icon && (
                <span className="sitenav__icon" aria-hidden="true">{icon}</span>
              )}
              <span className="sitenav__label">{label}</span>
            </NavLink>
          ))}
        </div>

        {/* CTA — desktop only */}
        {cta_label && (
          <>
            <span className="sitenav__sep sitenav__sep--cta" aria-hidden="true" />
            <a
              href={cta_href}
              className="sitenav__cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              {cta_label}
            </a>
          </>
        )}

        {/* Hamburger — mobile only */}
        <button
          className={`sitenav__hamburger${menu_open ? " sitenav__hamburger--open" : ""}`}
          onClick={() => set_menu_open(o => !o)}
          aria-label={menu_open ? "Close menu" : "Open menu"}
          aria-expanded={menu_open}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </nav>

      {/* ── Mobile menu card ─────────────────────────────────────────────── */}
      <div
        className={`sitenav__mobile${menu_open ? " sitenav__mobile--open" : ""}`}
        aria-hidden={!menu_open}
      >
        <nav className="sitenav__mobile_links">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sitenav__mobile_link${isActive ? " sitenav__mobile_link--active" : ""}`
              }
              onClick={() => set_menu_open(false)}
            >
              {icon && (
                <span className="sitenav__mobile_icon" aria-hidden="true">{icon}</span>
              )}
              {label}
            </NavLink>
          ))}
        </nav>
        {cta_label && (
          <div className="sitenav__mobile_cta">
            <a
              href={cta_href}
              className="sitenav__mobile_cta_link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {cta_label} ↗
            </a>
          </div>
        )}
      </div>

      {/* Backdrop — tap outside to close */}
      {menu_open && (
        <div
          className="sitenav__backdrop"
          onClick={() => set_menu_open(false)}
          aria-hidden="true"
        />
      )}
    </>,
    document.body,
  );
}
