import { useState, useEffect, useRef, useMemo } from "react";
import "./ArchitectureBlock.css";

// ---------------------------------------------------------------------------
// ArchitectureBlock — custom CSS architecture diagram component
//
// Props:
//   heading    string          — optional gold eyebrow label
//   caption    string          — optional note below the diagram
//   layout     "hub"|"linear"|"tree"
//   center_id  string          — node id of the hub orchestrator (hub mode only)
//   nodes[]    { id, label, description, role, badge }
//   edges[]    { from, to, label, bidirectional }
//
// Roles → badge color:
//   orchestrator  gold    (the central coordinator)
//   reader        blue    (reads input / files)
//   processor     teal    (transforms / computes)
//   renderer      purple  (generates output)
//   writer        green   (writes results to disk / stream)
//   utility       grey    (helper / misc)
// ---------------------------------------------------------------------------

const ROLE_LABELS = {
  orchestrator: "Orchestrator",
  reader:       "Reader",
  processor:    "Processor",
  renderer:     "Renderer",
  writer:       "Writer",
  utility:      "Utility",
};

// ── Node card ────────────────────────────────────────────────────────────────

function NodeCard({ node, active, onClick }) {
  const role = node.role ?? "utility";
  return (
    <button
      className={`ab-node ab-node--${role}${active ? " ab-node--active" : ""}`}
      onClick={() => onClick(node.id)}
      aria-expanded={active}
    >
      <div className="ab-node__inner">
        <span className={`ab-node__badge ab-node__badge--${role}`}>
          {node.badge ?? ROLE_LABELS[role] ?? role}
        </span>
        <span className="ab-node__label">{node.label}</span>
      </div>
    </button>
  );
}

// ── Detail panel ─────────────────────────────────────────────────────────────

function NodeDetail({ node, edges, node_map, onClose }) {
  if (!node) return null;

  const outgoing = edges.filter(e => e.from === node.id);
  const incoming = edges.filter(e => e.to === node.id && !e.bidirectional);
  const bidirect  = edges.filter(e => e.bidirectional && (e.from === node.id || e.to === node.id));

  return (
    <div className="ab-detail" role="dialog" aria-label={`${node.label} details`}>
      <button className="ab-detail__close" onClick={onClose} aria-label="Close">✕</button>

      <div className="ab-detail__head">
        <span className={`ab-node__badge ab-node__badge--${node.role ?? "utility"} ab-detail__badge`}>
          {node.badge ?? ROLE_LABELS[node.role ?? "utility"] ?? node.role}
        </span>
        <h3 className="ab-detail__label">{node.label}</h3>
      </div>

      {node.description && (
        <p className="ab-detail__desc">{node.description}</p>
      )}

      {(outgoing.length > 0 || incoming.length > 0 || bidirect.length > 0) && (
        <div className="ab-detail__edges">
          {outgoing.map((e, i) => (
            <div key={i} className="ab-detail__edge ab-detail__edge--out">
              <span className="ab-detail__edge-dir">→</span>
              <span className="ab-detail__edge-peer">
                {node_map[e.to]?.label ?? e.to}
              </span>
              {e.label && <span className="ab-detail__edge-label">{e.label}</span>}
            </div>
          ))}
          {incoming.map((e, i) => (
            <div key={i} className="ab-detail__edge ab-detail__edge--in">
              <span className="ab-detail__edge-dir">←</span>
              <span className="ab-detail__edge-peer">
                {node_map[e.from]?.label ?? e.from}
              </span>
              {e.label && <span className="ab-detail__edge-label">{e.label}</span>}
            </div>
          ))}
          {bidirect.map((e, i) => {
            const peer_id = e.from === node.id ? e.to : e.from;
            return (
              <div key={i} className="ab-detail__edge ab-detail__edge--bi">
                <span className="ab-detail__edge-dir">⇄</span>
                <span className="ab-detail__edge-peer">
                  {node_map[peer_id]?.label ?? peer_id}
                </span>
                {e.label && <span className="ab-detail__edge-label">{e.label}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Hub layout ───────────────────────────────────────────────────────────────
// Center node + surrounding spoke nodes arranged in a circle.

function HubLayout({ nodes, edges, center_id, active_id, onNodeClick }) {
  const center = nodes.find(n => n.id === center_id) ?? nodes[0];
  const spokes = nodes.filter(n => n.id !== center?.id);
  const count  = spokes.length;

  return (
    <div
      className="ab-hub"
      style={{ "--spoke-count": count }}
    >
      {/* Connector lines rendered as SVG overlay */}
      <svg className="ab-hub__svg" aria-hidden="true">
        {spokes.map((spoke, i) => {
          const angle_deg = (360 / count) * i - 90;
          const angle_rad = (angle_deg * Math.PI) / 180;
          // Percentages used as viewBox coordinates (0–100)
          const cx = 50;
          const cy = 50;
          const r  = 34; // spoke radius as % of container
          const sx = cx + r * Math.cos(angle_rad);
          const sy = cy + r * Math.sin(angle_rad);

          const edge = edges.find(
            e => (e.from === center?.id && e.to === spoke.id) ||
                 (e.bidirectional && (e.from === spoke.id || e.to === spoke.id))
          );
          const is_active = active_id === spoke.id || active_id === center?.id;

          return (
            <line
              key={spoke.id}
              x1={`${cx}%`} y1={`${cy}%`}
              x2={`${sx}%`} y2={`${sy}%`}
              className={`ab-hub__line${is_active ? " ab-hub__line--active" : ""}`}
              strokeDasharray="4 4"
            />
          );
        })}
      </svg>

      {/* Center node */}
      {center && (
        <div className="ab-hub__center">
          <NodeCard
            node={center}
            active={active_id === center.id}
            onClick={onNodeClick}
          />
        </div>
      )}

      {/* Spoke nodes */}
      {spokes.map((node, i) => {
        const angle_deg = (360 / count) * i - 90;
        const angle_rad = (angle_deg * Math.PI) / 180;
        const r = 34;
        const left = 50 + r * Math.cos(angle_rad);
        const top  = 50 + r * Math.sin(angle_rad);

        // Find an edge label to display on the connector
        const edge = edges.find(
          e => (e.from === center?.id && e.to === node.id) ||
               (e.from === node.id && e.to === center?.id) ||
               (e.bidirectional && (e.from === node.id || e.to === node.id))
        );
        const mid_left = 50 + (r / 2) * Math.cos(angle_rad);
        const mid_top  = 50 + (r / 2) * Math.sin(angle_rad);

        return (
          <div
            key={node.id}
            className="ab-hub__spoke"
            style={{
              left: `${left}%`,
              top:  `${top}%`,
            }}
          >
            <NodeCard
              node={node}
              active={active_id === node.id}
              onClick={onNodeClick}
            />
          </div>
        );
      })}

      {/* Edge labels */}
      {spokes.map((node, i) => {
        const edge = edges.find(
          e => (e.from === center?.id && e.to === node.id) ||
               (e.from === node.id && e.to === center?.id) ||
               (e.bidirectional && (e.from === node.id || e.to === node.id))
        );
        if (!edge?.label) return null;

        const angle_deg = (360 / count) * i - 90;
        const angle_rad = (angle_deg * Math.PI) / 180;
        const r = 34;
        const mid_left = 50 + (r / 2) * Math.cos(angle_rad);
        const mid_top  = 50 + (r / 2) * Math.sin(angle_rad);

        return (
          <div
            key={`label-${node.id}`}
            className="ab-hub__edge-label"
            style={{ left: `${mid_left}%`, top: `${mid_top}%` }}
            aria-hidden="true"
          >
            {edge.label}
          </div>
        );
      })}
    </div>
  );
}

// ── Linear layout ─────────────────────────────────────────────────────────────
// Left-to-right chain with SVG connections.
// Back-edges (e.g. node 3 → node 1) are drawn as arcs below the row.
// All edges use SVG paths + arrowhead markers — no text arrows.

function LinearLayout({ nodes, edges, active_id, onNodeClick }) {
  const wrap_ref   = useRef(null);
  const node_refs  = useRef({});
  const [svg_paths, set_svg_paths] = useState([]);
  const [extra_h,   set_extra_h]   = useState(0);

  const node_order = useMemo(
    () => Object.fromEntries(nodes.map((n, i) => [n.id, i])),
    [nodes]
  );

  function measure() {
    if (!wrap_ref.current) return;
    const wrap = wrap_ref.current.getBoundingClientRect();
    if (wrap.width === 0) return;

    const paths = [];
    let max_extra = 0;

    edges.forEach(edge => {
      const f_el = node_refs.current[edge.from];
      const t_el = node_refs.current[edge.to];
      if (!f_el || !t_el) return;

      const f  = f_el.getBoundingClientRect();
      const t  = t_el.getBoundingClientRect();
      const fi = node_order[edge.from] ?? 0;
      const ti = node_order[edge.to]   ?? 0;
      const is_back = ti < fi;

      // Forward: exit right side, enter left side. Back: exit left, enter right.
      const fx = (is_back ? f.left : f.right) - wrap.left;
      const fy = f.top - wrap.top + f.height / 2;
      const tx = (is_back ? t.right : t.left) - wrap.left;
      const ty = t.top - wrap.top + t.height / 2;

      if (is_back) {
        // Cubic bezier arc below the chain. Depth scales with distance.
        const gap   = Math.abs(fi - ti);
        const arc_y = Math.max(f.bottom, t.bottom) - wrap.top + 36 + gap * 10;
        max_extra   = Math.max(max_extra, arc_y + 28);
        paths.push({
          id: `${edge.from}-${edge.to}`,
          d:  `M ${fx} ${fy} C ${fx} ${arc_y}, ${tx} ${arc_y}, ${tx} ${ty}`,
          lx: (fx + tx) / 2,
          ly: arc_y + 14,
          label: edge.label,
          is_back: true,
          bidirectional: edge.bidirectional,
        });
      } else {
        paths.push({
          id: `${edge.from}-${edge.to}`,
          d:  `M ${fx} ${fy} L ${tx} ${ty}`,
          lx: (fx + tx) / 2,
          ly: fy - 9,
          label: edge.label,
          is_back: false,
          bidirectional: edge.bidirectional,
        });
      }
    });

    set_svg_paths(paths);
    set_extra_h(max_extra);
  }

  useEffect(() => {
    const t = setTimeout(measure, 60);
    return () => clearTimeout(t);
  }, [nodes, edges, node_order]);

  return (
    <div
      ref={wrap_ref}
      className="ab-linear"
      style={{ paddingBottom: extra_h > 0 ? `${extra_h}px` : undefined }}
    >
      {/* Node row — no inline connector divs */}
      <div className="ab-linear__row">
        {nodes.map(node => (
          <div
            key={node.id}
            ref={el => { node_refs.current[node.id] = el; }}
            className="ab-linear__node-wrap"
          >
            <NodeCard node={node} active={active_id === node.id} onClick={onNodeClick} />
          </div>
        ))}
      </div>

      {/* SVG overlay — covers row + arc space below */}
      <svg
        className="ab-linear__svg"
        aria-hidden="true"
        style={{ height: `calc(100% + ${extra_h}px)` }}
      >
        <defs>
          <marker id="ab-arr"      markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
            <path d="M0,1 L0,6 L6,3.5 Z" fill="rgba(200,169,126,0.70)" />
          </marker>
          <marker id="ab-arr-back" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
            <path d="M0,1 L0,6 L6,3.5 Z" fill="rgba(200,169,126,0.42)" />
          </marker>
          <marker id="ab-arr-start" markerWidth="7" markerHeight="7" refX="0.5" refY="3.5" orient="auto-start-reverse">
            <path d="M0,1 L0,6 L6,3.5 Z" fill="rgba(200,169,126,0.55)" />
          </marker>
        </defs>

        {svg_paths.map(p => (
          <g key={p.id}>
            <path
              d={p.d}
              className={`ab-linear__path${p.is_back ? " ab-linear__path--back" : ""}`}
              markerEnd={`url(#${p.is_back ? "ab-arr-back" : "ab-arr"})`}
              markerStart={p.bidirectional ? "url(#ab-arr-start)" : undefined}
            />
            {p.label && (
              <text x={p.lx} y={p.ly} className="ab-linear__path-label" textAnchor="middle">
                {p.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── Tree layout ───────────────────────────────────────────────────────────────
// Vertical parent-child tree using edges to define the structure.

function build_tree(nodes, edges) {
  const node_map = Object.fromEntries(nodes.map(n => [n.id, { ...n, children: [] }]));
  const child_ids = new Set();

  edges.forEach(e => {
    if (node_map[e.from] && node_map[e.to]) {
      node_map[e.from].children.push(node_map[e.to]);
      child_ids.add(e.to);
    }
  });

  // Roots are nodes that are never a child
  const roots = nodes.filter(n => !child_ids.has(n.id)).map(n => node_map[n.id]);
  return roots;
}

function TreeNode({ node, edges, active_id, onNodeClick, depth = 0 }) {
  const has_children = node.children?.length > 0;
  return (
    <div className="ab-tree__node-wrap" style={{ "--depth": depth }}>
      <NodeCard
        node={node}
        active={active_id === node.id}
        onClick={onNodeClick}
      />
      {has_children && (
        <div className="ab-tree__children">
          {node.children.map(child => {
            const edge = edges.find(
              e => e.from === node.id && e.to === child.id
            );
            return (
              <div key={child.id} className="ab-tree__child-wrap">
                {edge?.label && (
                  <span className="ab-tree__edge-label">{edge.label}</span>
                )}
                <TreeNode
                  node={child}
                  edges={edges}
                  active_id={active_id}
                  onNodeClick={onNodeClick}
                  depth={depth + 1}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TreeLayout({ nodes, edges, active_id, onNodeClick }) {
  const roots = build_tree(nodes, edges);
  return (
    <div className="ab-tree">
      {roots.map(root => (
        <TreeNode
          key={root.id}
          node={root}
          edges={edges}
          active_id={active_id}
          onNodeClick={onNodeClick}
        />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ArchitectureBlock({
  heading,
  caption,
  layout    = "hub",
  center_id,
  nodes     = [],
  edges     = [],
}) {
  const [active_id, set_active_id] = useState(null);

  if (!nodes.length) return null;

  const node_map  = Object.fromEntries(nodes.map(n => [n.id, n]));
  const active_node = active_id ? node_map[active_id] : null;

  function handle_click(id) {
    set_active_id(prev => (prev === id ? null : id));
  }

  return (
    <div className="ab-block">

      {heading && (
        <div className="ab-block__heading">
          <span className="ab-block__heading-text">{heading}</span>
        </div>
      )}

      <div className="ab-block__canvas">
        {layout === "hub" && (
          <HubLayout
            nodes={nodes}
            edges={edges}
            center_id={center_id ?? nodes[0]?.id}
            active_id={active_id}
            onNodeClick={handle_click}
          />
        )}

        {layout === "linear" && (
          <LinearLayout
            nodes={nodes}
            edges={edges}
            active_id={active_id}
            onNodeClick={handle_click}
          />
        )}

        {layout === "tree" && (
          <TreeLayout
            nodes={nodes}
            edges={edges}
            active_id={active_id}
            onNodeClick={handle_click}
          />
        )}
      </div>

      {/* Detail panel lives OUTSIDE the canvas so it can never clip */}
      {active_node && (
        <NodeDetail
          node={active_node}
          edges={edges}
          node_map={node_map}
          onClose={() => set_active_id(null)}
        />
      )}

      {caption && <p className="ab-block__caption">{caption}</p>}

    </div>
  );
}
