import { useState } from "react";
import "./DocSidebar.css";

// ---------------------------------------------------------------------------
// DocSidebar
//
// Left-rail navigation for the docs layout.
// Receives a flat `pages` array and builds a nested tree by parent_id.
//
// Props:
//   space_title   string   — displayed at the top as the space heading
//   space_slug    string   — used to construct href="/docs/:space_slug/:page_slug"
//   pages         array    — flat list: { _id, title, slug, parent_id, order }
//   current_slug  string   — the active page slug (highlighted in the sidebar)
// ---------------------------------------------------------------------------

// ── Tree builder ─────────────────────────────────────────────────────────────

function build_tree(pages) {
  const map = {};
  const roots = [];

  // Index all pages
  pages.forEach(p => { map[p._id] = { ...p, children: [] }; });

  // Nest children under parents
  pages.forEach(p => {
    if (p.parent_id && map[p.parent_id]) {
      map[p.parent_id].children.push(map[p._id]);
    } else {
      roots.push(map[p._id]);
    }
  });

  // Sort each level by `order`
  function sort_level(nodes) {
    nodes.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    nodes.forEach(n => sort_level(n.children));
    return nodes;
  }

  return sort_level(roots);
}

// ── Recursive nav node ────────────────────────────────────────────────────────

function NavNode({ node, space_slug, current_slug, depth }) {
  const is_active = node.slug === current_slug;
  // Auto-expand if this node or any descendant is active
  const has_active_descendant = check_descendant(node, current_slug);
  const [open, set_open] = useState(is_active || has_active_descendant);
  const has_children = node.children.length > 0;

  return (
    <li className="doc-sidebar__item">
      <div className={`doc-sidebar__row${is_active ? " doc-sidebar__row--active" : ""}`}
           style={{ paddingLeft: `${14 + depth * 14}px` }}>
        {has_children && (
          <button
            className={`doc-sidebar__chevron${open ? " doc-sidebar__chevron--open" : ""}`}
            onClick={() => set_open(o => !o)}
            aria-label={open ? "Collapse" : "Expand"}
          >
            ›
          </button>
        )}
        <a
          href={`/docs/${space_slug}/${node.slug}`}
          className="doc-sidebar__link"
        >
          {node.title}
        </a>
      </div>

      {has_children && open && (
        <ul className="doc-sidebar__children">
          {node.children.map(child => (
            <NavNode
              key={child._id}
              node={child}
              space_slug={space_slug}
              current_slug={current_slug}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function check_descendant(node, slug) {
  if (node.slug === slug) return true;
  return node.children?.some(c => check_descendant(c, slug)) ?? false;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DocSidebar({ space_title, space_slug, pages = [], current_slug, product_slug }) {
  const [mobile_open, set_mobile_open] = useState(false);
  const tree = build_tree(pages);

  return (
    <aside className={`doc-sidebar${mobile_open ? " doc-sidebar--open" : ""}`}>

      {/* Space title */}
      <div className="doc-sidebar__header">

        {/* Back to project — only when space belongs to a product */}
        {product_slug && (
          <a href={`/work/${product_slug}`} className="doc-sidebar__back">
            ← Project page
          </a>
        )}

        <div className="doc-sidebar__header-row">
          <a href={`/docs/${space_slug}`} className="doc-sidebar__space-name">
            {space_title}
          </a>
          <button
            className="doc-sidebar__toggle"
            onClick={() => set_mobile_open(o => !o)}
            aria-label={mobile_open ? "Close navigation" : "Open navigation"}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Page tree */}
      <nav className="doc-sidebar__nav" aria-label="Documentation navigation">
        <ul className="doc-sidebar__tree">
          {tree.map(node => (
            <NavNode
              key={node._id}
              node={node}
              space_slug={space_slug}
              current_slug={current_slug}
              depth={0}
            />
          ))}
        </ul>
      </nav>

    </aside>
  );
}
