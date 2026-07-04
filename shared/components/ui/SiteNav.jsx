import { NavLink, useLocation } from "react-router-dom";
import { createPortal }         from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./SiteNav.css";

// ---------------------------------------------------------------------------
// SiteNav — floating dock, top-left
//
// Props:
//   links      array   — nav link items [{ to, label, icon?, group? }]
//                        `group` (optional) clusters drawer links under a
//                        small uppercase label (consecutive same-group items).
//   cta_label  string  — CTA text. Pass null to hide.
//   cta_href   string  — CTA href
//   logo_text  string? — text monogram (e.g. "AG"). Falls back to image logo.
//   preset     string  — header layout (default "bar"):
//     "bar"     logo left, links right, CTA — the original dock. Default.
//     "center"  logo centered, links split left/right of it (odd counts put
//               the extra link on the right); CTA joins the right group.
//     "minimal" logo + CTA + hamburger only, at every width; all links live
//               in the drawer. For portfolio/cinematic sites.
//     "split"   links left, logo center, CTA right (three-zone grid).
//
// All presets collapse into the hamburger drawer below 900px ("minimal"
// uses the drawer at every width). The drawer closes on navigation,
// backdrop click, and Escape.
// ---------------------------------------------------------------------------

const DEFAULT_NAV_LINKS = [
  { to: "/games",  label: "Games"  },
  { to: "/tools",  label: "Tools"  },
  { to: "/lab",    label: "Lab"    },
  { to: "/about",  label: "About"  },
];

const PRESETS = ["bar", "center", "minimal", "split"];

// ── LinkGroup — a run of nav links with the liquid-glass glider ────────────
// Owns its own glider measurement so presets can render several groups
// (e.g. "center" splits the links around the logo).
function LinkGroup({ links }) {
  const [glider, set_glider] = useState({ left: 0, width: 0, visible: false });
  const links_ref = useRef(null);
  const location  = useLocation();

  // useLayoutEffect fires after DOM update but before paint → glider is
  // always in the right place with no visible flash.
  useLayoutEffect(() => {
    if (!links_ref.current) return;
    const active = links_ref.current.querySelector(".sitenav__link--active");
    if (active) {
      const container = links_ref.current.getBoundingClientRect();
      const item      = active.getBoundingClientRect();
      set_glider({
        left:    item.left - container.left,
        width:   item.width,
        visible: true,
      });
    } else {
      set_glider(g => ({ ...g, visible: false }));
    }
  }, [location.pathname]);

  return (
    <div className="sitenav__links" ref={links_ref}>

      {/* Glider — slides under the active item like a water drop */}
      <div
        className="sitenav__glider"
        aria-hidden="true"
        style={{
          left:    glider.left,
          width:   glider.width,
          opacity: glider.visible ? 1 : 0,
        }}
      />

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
  );
}

export default function SiteNav({
  links     = DEFAULT_NAV_LINKS,
  cta_label = "itch.io",
  cta_href  = "https://itch.io",
  logo_text = null,
  preset    = "bar",
}) {
  const [hidden,    set_hidden]    = useState(false);
  const [logo_err,  set_logo_err]  = useState(false);
  const [menu_open, set_menu_open] = useState(false);

  const location = useLocation();
  const last_y   = useRef(0);

  const p = PRESETS.includes(preset) ? preset : "bar";

  // Close menu on route change
  useEffect(() => {
    set_menu_open(false);
  }, [location.pathname]);

  // Close drawer on Escape
  useEffect(() => {
    if (!menu_open) return;
    const on_key = e => {
      if (e.key === "Escape") set_menu_open(false);
    };
    window.addEventListener("keydown", on_key);
    return () => window.removeEventListener("keydown", on_key);
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
    `sitenav--p-${p}`,
    hidden    ? "sitenav--hidden"    : "",
    menu_open ? "sitenav--menu-open" : "",
  ].filter(Boolean).join(" ");

  // ── Shared pieces (identical markup across presets) ──────────────────────

  const logo_node = (
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
  );

  const cta_node = cta_label ? (
    <a
      href={cta_href}
      className="sitenav__cta"
      target="_blank"
      rel="noopener noreferrer"
    >
      {cta_label}
    </a>
  ) : null;

  const hamburger_node = (
    <button
      type="button"
      className={`sitenav__hamburger${menu_open ? " sitenav__hamburger--open" : ""}`}
      onClick={() => {
        set_hidden(false); // keep the bar visible while the drawer is open
        set_menu_open(o => !o);
      }}
      aria-label={menu_open ? "Close menu" : "Open menu"}
      aria-expanded={menu_open}
      aria-controls="sitenav-drawer"
    >
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </button>
  );

  // ── Per-preset bar contents ───────────────────────────────────────────────

  let bar_body;
  if (p === "center") {
    // Logo in the middle; odd counts put the extra link on the right.
    const half        = Math.floor(links.length / 2);
    const left_links  = links.slice(0, half);
    const right_links = links.slice(half);
    bar_body = (
      <>
        <LinkGroup links={left_links} />
        <span className="sitenav__sep" aria-hidden="true" />
        {logo_node}
        <span className="sitenav__sep" aria-hidden="true" />
        <LinkGroup links={right_links} />
        {cta_node && (
          <>
            <span className="sitenav__sep sitenav__sep--cta" aria-hidden="true" />
            {cta_node}
          </>
        )}
        {hamburger_node}
      </>
    );
  } else if (p === "split") {
    bar_body = (
      <>
        <div className="sitenav__zone sitenav__zone--start">
          <LinkGroup links={links} />
        </div>
        <div className="sitenav__zone sitenav__zone--mid">
          {logo_node}
        </div>
        <div className="sitenav__zone sitenav__zone--end">
          {cta_node}
          {hamburger_node}
        </div>
      </>
    );
  } else if (p === "minimal") {
    bar_body = (
      <>
        {logo_node}
        {cta_node && (
          <>
            <span className="sitenav__sep sitenav__sep--cta" aria-hidden="true" />
            {cta_node}
          </>
        )}
        {hamburger_node}
      </>
    );
  } else {
    // "bar" — the original layout, byte-for-byte
    bar_body = (
      <>
        {logo_node}
        <span className="sitenav__sep" aria-hidden="true" />
        <LinkGroup links={links} />
        {cta_node && (
          <>
            <span className="sitenav__sep sitenav__sep--cta" aria-hidden="true" />
            {cta_node}
          </>
        )}
        {hamburger_node}
      </>
    );
  }

  // ── Drawer link grouping (only if any link declares a `group`) ───────────

  const has_groups = links.some(l => l.group);
  let drawer_groups = null;
  if (has_groups) {
    drawer_groups = [];
    for (const link of links) {
      const g    = link.group ?? null;
      const last = drawer_groups[drawer_groups.length - 1];
      if (last && last.label === g) last.items.push(link);
      else drawer_groups.push({ label: g, items: [link] });
    }
  }

  const drawer_link = ({ to, label, icon }) => (
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
  );

  return createPortal(
    <>
      {/* ── Floating dock ────────────────────────────────────────────────── */}
      <nav className={cls} role="navigation" aria-label="Main navigation">
        {bar_body}
      </nav>

      {/* ── Drawer — hamburger-opened panel under the bar ────────────────── */}
      <div
        id="sitenav-drawer"
        className={`sitenav__mobile sitenav__mobile--p-${p}${menu_open ? " sitenav__mobile--open" : ""}`}
        aria-hidden={!menu_open}
        inert={!menu_open}
      >
        <nav className="sitenav__mobile_links">
          {has_groups
            ? drawer_groups.map((group, gi) => (
                <div className="sitenav__mobile_group" key={group.label ?? `group-${gi}`}>
                  {group.label && (
                    <span className="sitenav__mobile_group_label">{group.label}</span>
                  )}
                  {group.items.map(drawer_link)}
                </div>
              ))
            : links.map(drawer_link)}
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
