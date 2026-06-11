# Diagram Rules — guillen.studio Architecture Diagrams

Use this file as context when asking an AI to generate an interactive architecture diagram for guillen.studio. Hand it this file and describe your nodes, edges, and layout, and the AI will produce a complete self-contained HTML file ready to paste into the **Raw Diagram** block in Sanity.

---

## What the output must be

A **single self-contained HTML file** with no external file references except the Cytoscape.js CDN script. The file renders inside a sandboxed `<iframe>` on the site. It must work entirely offline after the initial CDN load.

---

## Tech stack

| Item | Spec |
|---|---|
| Graph renderer | Cytoscape.js `3.29.2` via CDN: `https://unpkg.com/cytoscape@3.29.2/dist/cytoscape.min.js` |
| Language | Vanilla HTML + CSS + JavaScript. No frameworks, no build step. |
| Fonts | `system-ui, -apple-system, 'Segoe UI', sans-serif` — no Google Fonts |
| Icons | Unicode characters only (no icon libraries) |

---

## Color palette

These values must be used exactly. Do not substitute.

```
Page/canvas background:  #07060c
Node background:         rgba(8, 7, 13, 0.94)
Node border default:     rgba(255, 255, 255, 0.08)
Node border highlight:   rgba(200, 169, 126, 0.50)

Gold (primary accent):   rgba(200, 169, 126, 1.0)     /* #c8a97e */
Gold dim:                rgba(200, 169, 126, 0.55)
Gold faint:              rgba(200, 169, 126, 0.22)

Edge line:               rgba(200, 169, 126, 0.45)
Edge back-arc:           rgba(200, 169, 126, 0.25)
Arrowhead fill:          rgba(200, 169, 126, 0.65)
Edge label text:         rgba(200, 169, 126, 0.52)
Edge label background:   #07060c

Text primary:            rgba(228, 226, 222, 0.90)
Text muted:              rgba(228, 226, 222, 0.45)
Text dimmed:             rgba(228, 226, 222, 0.28)

Panel background:        rgba(6, 5, 11, 0.96)
Panel border:            rgba(200, 169, 126, 0.18)
Scrollbar thumb:         rgba(200, 169, 126, 0.18)
```

---

## Node roles and badge colors

Every node has a `role` field. Render a small uppercase badge inside the node using these colors:

| Role | Badge text color | Badge background |
|---|---|---|
| `orchestrator` | `rgba(200, 169, 126, 0.95)` | `rgba(200, 169, 126, 0.14)` |
| `reader` | `rgba(185, 178, 165, 0.82)` | `rgba(185, 178, 165, 0.10)` |
| `processor` | `rgba(165, 162, 155, 0.78)` | `rgba(165, 162, 155, 0.09)` |
| `renderer` | `rgba(210, 190, 155, 0.82)` | `rgba(210, 190, 155, 0.11)` |
| `writer` | `rgba(148, 168, 150, 0.78)` | `rgba(148, 168, 150, 0.09)` |
| `utility` | `rgba(130, 128, 124, 0.70)` | `rgba(130, 128, 124, 0.08)` |

The role border on hover/selected matches the badge text color at `0.45` opacity.

---

## Node structure

Each Cytoscape node must carry this data:

```js
{
  data: {
    id:          'unique_id',       // snake_case, no spaces
    label:       'filename.py',     // displayed inside the node
    role:        'orchestrator',    // one of the roles above
    badge:       'Orchestrator',    // optional — overrides role label in badge
    description: 'What this file does. Can be multiple sentences.',
  }
}
```

**Node visual spec:**
- Shape: `round-rectangle`
- Width: `auto` (fits label) with `min(150, max-content)` feel — use `width: 150, height: 56` as base, let Cytoscape auto-size with `text-wrap: wrap`
- Font size: `13px`
- Label position: centered vertically, with the badge rendered above using an HTML label (see HTML label section below)

---

## Edge structure

```js
{
  data: {
    id:            'from_to',        // unique
    source:        'node_id',
    target:        'node_id',
    label:         'signal name',    // optional — shown on the edge midpoint
    bidirectional: false,            // if true, add source-arrow-shape: 'triangle'
    is_back:       false,            // if true, use unbundled-bezier curve going below
  }
}
```

**Edge visual spec:**
- Curve style: `bezier` for forward edges, `unbundled-bezier` for back-edges
- Back-edge control points: route the arc below the node row (`control-point-distances: [60]`, `control-point-weights: [0.5]`)
- Arrow: `target-arrow-shape: triangle`, `arrow-scale: 0.75`
- Bidirectional: also add `source-arrow-shape: triangle`
- Line width: `1.5px`
- Back-edge line: dashed via `line-style: dashed`, `line-dash-pattern: [5, 4]`
- Edge label font: `10px`, italic

---

## Cytoscape config template

Use this as the base. Fill in `elements` and `layout.positions`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Architecture Diagram</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #07060c;
    font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
    overflow: hidden;
    color: rgba(228, 226, 222, 0.90);
  }

  #cy {
    width: 100vw;
    height: 100vh;
  }

  /* ── Detail panel — slides up from bottom on node tap ── */
  #panel {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: rgba(6, 5, 11, 0.96);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-top: 1px solid rgba(200, 169, 126, 0.18);
    padding: 18px 20px 20px;
    transform: translateY(100%);
    transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 100;
    max-height: 48vh;
    overflow-y: auto;
  }

  #panel.open { transform: translateY(0); }

  #panel-close {
    position: absolute;
    top: 12px; right: 14px;
    background: none;
    border: none;
    color: rgba(228, 226, 222, 0.35);
    font-size: 14px;
    cursor: pointer;
    padding: 4px 6px;
    border-radius: 4px;
    transition: color 0.15s;
  }
  #panel-close:hover { color: rgba(228, 226, 222, 0.70); }

  .panel-role {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 100px;
    font-size: 0.60rem;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    margin-bottom: 9px;
  }

  .panel-label {
    font-size: 1rem;
    font-weight: 600;
    color: rgba(228, 226, 222, 0.92);
    margin-bottom: 10px;
    font-family: ui-monospace, 'JetBrains Mono', Menlo, monospace;
  }

  .panel-desc {
    font-size: 0.82rem;
    color: rgba(228, 226, 222, 0.55);
    line-height: 1.65;
  }

  /* ── Hint shown before first tap ── */
  #hint {
    position: fixed;
    bottom: 16px; left: 50%;
    transform: translateX(-50%);
    background: rgba(6, 5, 11, 0.82);
    border: 1px solid rgba(200, 169, 126, 0.15);
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 0.70rem;
    color: rgba(200, 169, 126, 0.50);
    letter-spacing: 0.06em;
    pointer-events: none;
    transition: opacity 0.4s;
  }
  #hint.hidden { opacity: 0; }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(200, 169, 126, 0.18); border-radius: 4px; }
</style>
</head>
<body>

<div id="cy"></div>

<div id="hint">Tap a node for details · Drag to pan · Scroll to zoom</div>

<div id="panel">
  <button id="panel-close">✕</button>
  <div id="panel-badge" class="panel-role"></div>
  <div id="panel-label" class="panel-label"></div>
  <div id="panel-desc"  class="panel-desc"></div>
</div>

<script src="https://unpkg.com/cytoscape@3.29.2/dist/cytoscape.min.js"></script>
<script>

// ─── ROLE COLORS ───────────────────────────────────────────────────────────────
const ROLES = {
  orchestrator: { text: 'rgba(200,169,126,0.95)', bg: 'rgba(200,169,126,0.14)', border: 'rgba(200,169,126,0.45)' },
  reader:       { text: 'rgba(185,178,165,0.82)', bg: 'rgba(185,178,165,0.10)', border: 'rgba(185,178,165,0.40)' },
  processor:    { text: 'rgba(165,162,155,0.78)', bg: 'rgba(165,162,155,0.09)', border: 'rgba(165,162,155,0.38)' },
  renderer:     { text: 'rgba(210,190,155,0.82)', bg: 'rgba(210,190,155,0.11)', border: 'rgba(210,190,155,0.40)' },
  writer:       { text: 'rgba(148,168,150,0.78)', bg: 'rgba(148,168,150,0.09)', border: 'rgba(148,168,150,0.38)' },
  utility:      { text: 'rgba(130,128,124,0.70)', bg: 'rgba(130,128,124,0.08)', border: 'rgba(130,128,124,0.35)' },
};
function rc(role, key) { return (ROLES[role] || ROLES.utility)[key]; }

// ─── GRAPH DATA — fill this section ───────────────────────────────────────────
const elements = [
  // Nodes
  // { data: { id: 'main', label: 'main.py', role: 'orchestrator', description: '...' } },

  // Edges
  // { data: { source: 'main', target: 'pull', label: 'signal' } },
  // Back-edge example (arc below):
  // { data: { source: 'render', target: 'main', label: 'frames', is_back: true } },
];

// ─── LAYOUT ────────────────────────────────────────────────────────────────────
// For preset layout, provide x/y for every node id:
// const positions = { main: { x: 400, y: 250 }, pull: { x: 200, y: 150 } };
// For auto layout, use name: 'cose' or name: 'breadthfirst' and remove positions.
const layout = {
  name: 'cose',
  animate: false,
  padding: 60,
  nodeRepulsion: () => 8000,
  edgeElasticity: () => 100,
  idealEdgeLength: () => 160,
  gravity: 0.6,
  numIter: 1000,
};

// ─── CYTOSCAPE INIT ────────────────────────────────────────────────────────────
const cy = cytoscape({
  container: document.getElementById('cy'),
  elements,
  layout,

  style: [
    // ── Base node ──
    {
      selector: 'node',
      style: {
        'shape':             'round-rectangle',
        'width':             'label',
        'height':            'label',
        'padding':           '14px 18px',
        'background-color':  'rgba(8,7,13,0.94)',
        'background-opacity': 1,
        'border-width':      1,
        'border-color':      'rgba(255,255,255,0.08)',
        'label':             'data(label)',
        'color':             'rgba(228,226,222,0.88)',
        'font-size':         13,
        'font-family':       "ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace",
        'text-valign':       'center',
        'text-halign':       'center',
        'text-wrap':         'wrap',
        'text-max-width':    160,
        'min-width':         120,
        'min-height':        48,
        'transition-property': 'border-color, background-color',
        'transition-duration': '0.18s',
      },
    },

    // ── Role-specific borders ──
    ...Object.entries(ROLES).map(([role, c]) => ({
      selector: `node[role = "${role}"]`,
      style: { 'border-color': c.bg.replace(/[\d.]+\)$/, '0.25)') },
    })),

    // ── Selected / hovered node ──
    {
      selector: 'node:selected, node.highlighted',
      style: {
        'border-width': 1.5,
        'border-color': 'data(roleBorder)',
        'background-color': 'rgba(14,12,22,0.96)',
        'box-shadow': '0 0 20px rgba(200,169,126,0.10)',
      },
    },

    // ── Base edge ──
    {
      selector: 'edge',
      style: {
        'curve-style':          'bezier',
        'line-color':           'rgba(200,169,126,0.40)',
        'target-arrow-shape':   'triangle',
        'target-arrow-color':   'rgba(200,169,126,0.65)',
        'arrow-scale':          0.75,
        'width':                1.5,
        'label':                'data(label)',
        'font-size':            10,
        'font-style':           'italic',
        'color':                'rgba(200,169,126,0.52)',
        'text-background-opacity': 1,
        'text-background-color':   '#07060c',
        'text-background-padding': '3px',
        'text-border-opacity':  0,
      },
    },

    // ── Bidirectional edge ──
    {
      selector: 'edge[?bidirectional]',
      style: {
        'source-arrow-shape': 'triangle',
        'source-arrow-color': 'rgba(200,169,126,0.55)',
      },
    },

    // ── Back-edge (dashed arc below) ──
    {
      selector: 'edge[?is_back]',
      style: {
        'curve-style':             'unbundled-bezier',
        'control-point-distances': [80],
        'control-point-weights':   [0.5],
        'line-color':              'rgba(200,169,126,0.25)',
        'target-arrow-color':      'rgba(200,169,126,0.38)',
        'line-style':              'dashed',
        'line-dash-pattern':       [5, 4],
      },
    },
  ],

  // Interaction
  minZoom: 0.25,
  maxZoom: 4,
  wheelSensitivity: 0.25,
  userZoomingEnabled: true,
  userPanningEnabled: true,
  boxSelectionEnabled: false,
  selectionType: 'single',
  touchTapThreshold: 8,
  desktopTapThreshold: 4,
});

// Post-process: set role border color as data attribute for :selected style
cy.nodes().forEach(n => {
  const role = n.data('role') || 'utility';
  n.data('roleBorder', rc(role, 'border'));
});

// ─── DETAIL PANEL ──────────────────────────────────────────────────────────────
const panel  = document.getElementById('panel');
const hint   = document.getElementById('hint');
let hint_dismissed = false;

function open_panel(node) {
  const role  = node.data('role') || 'utility';
  const badge = node.data('badge') || role.charAt(0).toUpperCase() + role.slice(1);
  const c     = ROLES[role] || ROLES.utility;

  document.getElementById('panel-badge').textContent    = badge;
  document.getElementById('panel-badge').style.color    = c.text;
  document.getElementById('panel-badge').style.background = c.bg;
  document.getElementById('panel-badge').style.border   = `1px solid ${c.text.replace(/[\d.]+\)$/, '0.22)')}`;
  document.getElementById('panel-label').textContent    = node.data('label');
  document.getElementById('panel-desc').textContent     = node.data('description') || '';
  panel.classList.add('open');

  if (!hint_dismissed) {
    hint.classList.add('hidden');
    hint_dismissed = true;
  }
}

function close_panel() {
  panel.classList.remove('open');
  cy.nodes().removeClass('highlighted');
}

cy.on('tap', 'node', evt => {
  const node = evt.target;
  cy.nodes().removeClass('highlighted');
  node.addClass('highlighted');
  if (node.data('description')) open_panel(node);
});

cy.on('tap', evt => {
  if (evt.target === cy) close_panel();
});

document.getElementById('panel-close').addEventListener('click', close_panel);

// Dismiss hint on first interaction
cy.one('pan zoom drag', () => {
  if (!hint_dismissed) {
    hint.classList.add('hidden');
    hint_dismissed = true;
  }
});

</script>
</body>
</html>
```

---

## Instructions for the AI

When generating a diagram, follow these steps:

1. **Copy the template above exactly.** Do not change any CSS, color values, or Cytoscape config — only fill in the `elements` array and `layout`.

2. **Fill in `elements`:**
   - One `{ data: { id, label, role, description } }` object per node
   - One `{ data: { source, target, label?, bidirectional?, is_back? } }` per edge
   - Mark back-edges (where the target comes before the source in the pipeline) with `is_back: true`

3. **Choose a layout:**
   - `cose` — force-directed, good for complex graphs (default)
   - `breadthfirst` — tree-like, good for hierarchies
   - `preset` — you control exact `x/y` positions; add a `positions` object and `positions: (node) => positions[node.id()]` to the layout config

4. **Do not:**
   - Change any color values
   - Add external fonts or libraries beyond Cytoscape.js
   - Add CSS animations other than the panel slide and node transition already defined
   - Add scrollbars to `#cy` (the graph pans internally)
   - Remove the hint element or the panel structure

5. **Height guidance:**
   - For 3–5 node diagrams: suggest `height: 420` in the Sanity block
   - For 6–10 node diagrams: `height: 560`
   - For 10+ nodes: `height: 680`

---

## Example prompt to generate a diagram

> Using DIAGRAM_RULES.md, generate a diagram for the following architecture:
>
> **Nodes:**
> - `main` / main.py / orchestrator / "Entry point. Validates session JSON, loops over batches, calls sub-processes in order."
> - `pull` / pull.py / reader / "Spawns Blender headlessly to scan the scene. Writes library.json."
> - `design` / level_designer.py / processor / "Optional user script. Receives library.json, returns manifest.json."
> - `collect` / render_collector.py / processor / "Polls for rendered frames. Calls ffmpeg when all frames arrive."
> - `render` / internal_blender.py / renderer / "Runs inside Blender. Reads manifest, places assets, fires renders."
> - `ffmpeg` / ffmpeg / writer / "Combines PNG frame sequences into mp4."
>
> **Edges:**
> - main → pull (label: "blender --bg")
> - pull → main (label: "library.json")
> - main → design (label: "optional", bidirectional: false)
> - design → main (label: "manifest.json")
> - main → collect (label: "collect_render()")
> - collect → render (label: "blender --bg --python")
> - render → collect (label: "PNG frames")
> - collect → ffmpeg (label: "PNG sequence")
> - ffmpeg → collect (label: "mp4")
>
> Use `cose` layout. Suggest height: 560.

---

## Where to paste the output

In Sanity Studio → the relevant product/devlog/doc page → **Page sections** → **Add block** → **Raw Diagram**. Paste the entire HTML into the **Diagram HTML** field.
