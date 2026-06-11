import "./HierarchyBlock.css";

// ---------------------------------------------------------------------------
// HierarchyBlock — Unity / Unreal Engine-style scene hierarchy tree
//
// Props:
//   heading   string?   — gold eyebrow label
//   caption   string?   — note below
//   nodes[]   { id, parent_id, label, type, note, order }
//
// parent_id: leave blank for root nodes. Set to another node's id to nest.
// order:     lower numbers appear first within the same parent.
//
// type → optional badge (e.g. "GameObject", "Camera", "Light", "Script")
// note → small annotation appended inline (e.g. "(disabled)", "← entry")
// ---------------------------------------------------------------------------

function build_tree(nodes) {
  const map = {};
  nodes.forEach(n => { map[n.id] = { ...n, children: [] }; });

  const roots = [];
  nodes.forEach(n => {
    if (n.parent_id && map[n.parent_id]) {
      map[n.parent_id].children.push(map[n.id]);
    } else {
      roots.push(map[n.id]);
    }
  });

  function sort(arr) {
    arr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    arr.forEach(n => sort(n.children));
  }
  sort(roots);
  return roots;
}

// Slugify type for CSS class (e.g. "Game Object" → "game-object")
function type_slug(t) {
  return t?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") ?? "default";
}

// ── Single node row ───────────────────────────────────────────────────────────

function HierNode({ node, is_last, depth }) {
  const has_children = node.children?.length > 0;
  const slug = type_slug(node.type);

  return (
    <li className={`hb-item${is_last ? " hb-item--last" : ""}`}>

      <div className="hb-row">
        {/* Expand/collapse icon — purely decorative indicator */}
        <span className="hb-chevron" aria-hidden="true">
          {has_children ? "▾" : "·"}
        </span>

        <span className="hb-label">{node.label}</span>

        {node.type && (
          <span className={`hb-badge hb-badge--${slug}`}>{node.type}</span>
        )}

        {node.note && (
          <span className="hb-note">{node.note}</span>
        )}
      </div>

      {has_children && (
        <ul className="hb-subtree">
          {node.children.map((child, i) => (
            <HierNode
              key={child.id ?? i}
              node={child}
              is_last={i === node.children.length - 1}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}

    </li>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function HierarchyBlock({ heading, caption, nodes = [] }) {
  if (!nodes.length) return null;

  const roots = build_tree(nodes);

  return (
    <div className="hb-block">

      {heading && (
        <div className="hb-block__heading">
          <span className="hb-block__heading-text">{heading}</span>
        </div>
      )}

      <div className="hb-canvas">
        <ul className="hb-tree">
          {roots.map((root, i) => (
            <HierNode
              key={root.id ?? i}
              node={root}
              is_last={i === roots.length - 1}
              depth={0}
            />
          ))}
        </ul>
      </div>

      {caption && <p className="hb-caption">{caption}</p>}

    </div>
  );
}
