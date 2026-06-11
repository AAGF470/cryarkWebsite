import { useEffect, useRef, useState } from "react";
import "./DiagramBlock.css";

// ---------------------------------------------------------------------------
// DiagramBlock
//
// Renders a Mermaid diagram from a text string.
// Mermaid is lazy-loaded on first use so pages that don't include a diagram
// pay zero JS cost.
//
// Supported diagram types (pass in `code`):
//   flowchart / graph   — node + arrow flow diagrams
//   sequenceDiagram     — message sequence between actors
//   classDiagram        — class/interface relationships
//   stateDiagram-v2     — state machines
//   erDiagram           — entity-relationship
//   gantt               — project timeline
//
// Props:
//   heading   string?  — label shown above the diagram (gold eyebrow style)
//   code      string   — raw Mermaid syntax
//   caption   string?  — small caption below the diagram
// ---------------------------------------------------------------------------

// ── Module-level init guard — Mermaid is initialized once per page load ────

let _mermaid_ready = false;

async function get_mermaid() {
  const m = (await import("mermaid")).default;

  if (!_mermaid_ready) {
    m.initialize({
      startOnLoad: false,
      // "base" theme + full themeVariables gives complete control
      theme: "base",
      themeVariables: {
        darkMode:            true,
        background:          "#07060c",

        // Nodes
        primaryColor:        "#1c1726",
        primaryTextColor:    "#e4e2de",
        primaryBorderColor:  "rgba(200, 169, 126, 0.38)",

        // Secondary / tertiary node fills (for multi-node colour variation)
        secondaryColor:      "#150e22",
        tertiaryColor:       "#0e0b16",

        // Edges + labels
        lineColor:           "rgba(200, 169, 126, 0.58)",
        edgeLabelBackground: "#0d0b14",
        labelBackground:     "#0d0b14",

        // Cluster boxes
        clusterBkg:    "#110e1a",
        clusterBorder: "rgba(255, 255, 255, 0.07)",

        // Title
        titleColor: "#f5f3ef",

        // Typography
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        fontSize:   "14px",

        // ── Sequence diagram ────────────────────────────
        actorBkg:      "#1c1726",
        actorBorder:   "rgba(200, 169, 126, 0.38)",
        actorTextColor:"#e4e2de",
        actorLineColor:"rgba(200, 169, 126, 0.30)",
        signalColor:   "rgba(232, 230, 225, 0.65)",
        signalTextColor:"rgba(232, 230, 225, 0.65)",
        loopTextColor: "#e4e2de",
        noteBkgColor:  "#1c1726",
        noteTextColor: "#e4e2de",
        noteBorderColor:"rgba(200, 169, 126, 0.28)",

        // ── Class diagram ───────────────────────────────
        classText: "#e4e2de",
      },
    });
    _mermaid_ready = true;
  }

  return m;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function DiagramBlock({ heading = null, code = "", caption = null }) {
  const container_ref = useRef(null);
  const render_id     = useRef(0);        // increments each render to guarantee unique IDs

  const [rendered, set_rendered] = useState(false);
  const [error,    set_error]    = useState(null);

  useEffect(() => {
    const trimmed = code?.trim();
    if (!trimmed) return;

    let cancelled = false;

    async function run() {
      set_rendered(false);
      set_error(null);

      try {
        const mermaid = await get_mermaid();

        // Each render call must use a unique element ID or Mermaid throws
        const id = `mermaid-${Date.now()}-${render_id.current++}`;

        const { svg } = await mermaid.render(id, trimmed);

        if (!cancelled && container_ref.current) {
          container_ref.current.innerHTML = svg;
          set_rendered(true);
        }
      } catch (err) {
        if (!cancelled) {
          set_error(String(err?.message ?? err));
        }
      }
    }

    run();
    return () => { cancelled = true; };
  }, [code]);

  return (
    <div className="diagram-block">

      {heading && (
        <p className="diagram-block__heading">{heading}</p>
      )}

      <div className={`diagram-block__canvas${rendered ? " diagram-block__canvas--ready" : ""}`}>

        {/* Mermaid injects SVG directly into this div */}
        <div ref={container_ref} className="diagram-block__svg" />

        {/* Loading skeleton — visible until SVG arrives */}
        {!rendered && !error && (
          <div className="diagram-block__loading" aria-hidden="true">
            <span className="diagram-block__loading-dot" />
            <span className="diagram-block__loading-dot" />
            <span className="diagram-block__loading-dot" />
          </div>
        )}

        {/* Syntax / render error */}
        {error && (
          <div className="diagram-block__error" role="alert">
            <span className="diagram-block__error-label">Diagram error</span>
            <code className="diagram-block__error-msg">{error}</code>
          </div>
        )}

      </div>

      {caption && (
        <p className="diagram-block__caption">{caption}</p>
      )}

    </div>
  );
}
