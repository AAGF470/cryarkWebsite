import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DocLayout.css";

// ---------------------------------------------------------------------------
// DocLayout
//
// Sidebar + content layout for Lab / docs pages.
// Sidebar tracks the active section via IntersectionObserver and highlights
// the matching nav item with a gold left indicator.
//
// Sections in the content area must have:
//   id="<anchor>"  data-doc-section
// for the observer to pick them up.
//
// Props:
//   sections  array  — [{ label, items: [{ label, anchor?, href? }] }]
//                       anchor = intra-page id  |  href = full path link
//   children  node   — page content
// ---------------------------------------------------------------------------

export default function DocLayout({ sections = [], children }) {
  const [active_id,    set_active_id]    = useState(null);
  const [mobile_open,  set_mobile_open]  = useState(false);

  // Track which section is in the top ~40% of the viewport
  useEffect(() => {
    const targets = document.querySelectorAll("[data-doc-section]");
    if (!targets.length) return;

    // Seed with the first section
    if (targets[0]) set_active_id(targets[0].id);

    const io = new IntersectionObserver(
      entries => {
        // Among intersecting entries, pick the one nearest the top
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          set_active_id(visible[0].target.id);
        }
      },
      { rootMargin: "-68px 0px -52% 0px", threshold: 0 },
    );

    targets.forEach(t => io.observe(t));
    return () => io.disconnect();
  }, []);

  function scroll_to(e, anchor) {
    e.preventDefault();
    const el = document.getElementById(anchor);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 82;
    window.scrollTo({ top, behavior: "smooth" });
    set_active_id(anchor);
    set_mobile_open(false);
  }

  return (
    <div className="doc-layout">

      {/* ── SIDEBAR ── */}
      <aside className={`doc-layout__sidebar${mobile_open ? " doc-layout__sidebar--open" : ""}`}>
        <nav className="doc-layout__nav">
          {sections.map(group => (
            <div key={group.label} className="doc-layout__group">
              <div className="doc-layout__group_label">{group.label}</div>
              {group.items.map(item => {
                const is_active = item.anchor && active_id === item.anchor;
                const cls = `doc-layout__nav_item${is_active ? " doc-layout__nav_item--active" : ""}`;

                return item.anchor ? (
                  <a
                    key={item.label}
                    href={`#${item.anchor}`}
                    className={cls}
                    onClick={e => scroll_to(e, item.anchor)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.href ?? "#"}
                    className={cls}
                    onClick={() => set_mobile_open(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile backdrop */}
      {mobile_open && (
        <div
          className="doc-layout__backdrop"
          onClick={() => set_mobile_open(false)}
          aria-hidden="true"
        />
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="doc-layout__main">
        {children}
      </main>

      {/* Mobile toggle — fixed bottom-left */}
      <button
        className={`doc-layout__toggle${mobile_open ? " doc-layout__toggle--open" : ""}`}
        onClick={() => set_mobile_open(o => !o)}
        aria-label="Toggle navigation"
      >
        {mobile_open ? "✕" : "≡"}
      </button>
    </div>
  );
}
