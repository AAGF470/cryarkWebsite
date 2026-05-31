import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import "./SiteNav.css";

const DEFAULT_NAV_LINKS = [
  { to: "/games",  label: "Games"  },
  { to: "/tools",  label: "Tools"  },
  { to: "/lab",    label: "Lab"    },
  { to: "/about",  label: "About"  },
];

// Props:
//   links      array   — nav link items [{ to, label }]. Defaults to cryark links.
//   cta_label  string  — CTA button label
//   cta_href   string  — CTA button href
//   logo_text  string? — if set, renders a text logo instead of the image (e.g. "AG")
export default function SiteNav({
  links     = DEFAULT_NAV_LINKS,
  cta_label = "itch.io",
  cta_href  = "https://itch.io",
  logo_text = null,
}) {
  const [scrolled,    set_scrolled]    = useState(false);
  const [hidden,      set_hidden]      = useState(false);
  const [logo_err,    set_logo_err]    = useState(false);
  const [menu_open,   set_menu_open]   = useState(false);
  const last_y  = useRef(0);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    set_menu_open(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menu_open) {
      set_hidden(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menu_open]);

  useEffect(() => {
    function on_scroll() {
      const y     = window.scrollY;
      const delta = y - last_y.current;
      last_y.current = y;

      set_scrolled(y > 32);

      // Never hide while mobile menu is open
      if (menu_open) return;

      if (y < 80) {
        set_hidden(false);
      } else if (delta > 4) {
        set_hidden(true);
      } else if (delta < -4) {
        set_hidden(false);
      }
    }

    function on_mouse(e) {
      if (e.clientY < 72) set_hidden(false);
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
    scrolled    ? "sitenav--scrolled" : "",
    hidden      ? "sitenav--hidden"   : "",
    menu_open   ? "sitenav--menu-open": "",
  ].filter(Boolean).join(" ");

  return (
    <>
      <nav className={cls}>

        {/* Left — logo */}
        <NavLink to="/" className="sitenav__logo" end>
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

        {/* Center — primary links (desktop) */}
        <div className="sitenav__center">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sitenav__link${isActive ? " sitenav__link--active" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right — CTA (desktop) + hamburger (mobile) */}
        <div className="sitenav__right">
          {cta_label && (
            <span className="sitenav__cta_desktop">
              <Button
                variant="ghost-bordered"
                label={cta_label}
                href={cta_href}
                show_arrow={false}
              />
            </span>
          )}

          {/* Hamburger button — mobile only */}
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
        </div>
      </nav>

      {/* Mobile menu — slides down from nav */}
      <div
        className={`sitenav__mobile${menu_open ? " sitenav__mobile--open" : ""}`}
        aria-hidden={!menu_open}
      >
        <nav className="sitenav__mobile_links">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sitenav__mobile_link${isActive ? " sitenav__mobile_link--active" : ""}`
              }
              onClick={() => set_menu_open(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        {cta_label && (
          <div className="sitenav__mobile_cta">
            <Button
              variant="ghost-bordered"
              label={cta_label}
              href={cta_href}
              show_arrow={false}
            />
          </div>
        )}
      </div>

      {/* Backdrop — tap to close */}
      {menu_open && (
        <div
          className="sitenav__backdrop"
          onClick={() => set_menu_open(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
