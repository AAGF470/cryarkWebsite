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

Node card backgrounds (state-dependent, NO purple — r ≈ g ≈ b):
  normal:  #0f0e11
  hovered: #141316
  active:  #1c1b1e

Gold (primary accent):   rgba(200, 169, 126, 1.0)     /* #c8a97e */
Gold dim:                rgba(200, 169, 126, 0.55)
Gold faint:              rgba(200, 169, 126, 0.22)

Edge line:               rgba(228, 226, 222, 0.38)    /* white ghost */
Edge back-arc:           rgba(228, 226, 222, 0.22)    /* white ghost dim dashed */
Arrowhead fill:          rgba(228, 226, 222, 0.70)    /* white ghost */
Edge label text:         rgba(200, 169, 126, 0.58)    /* gold dim italic — labels stay gold */
Edge label background:   #07060c

Node depth shadow:       rgba(0,0,0,0.82) blur 24px offset-y 6  /* always-on, normal state */
Hover glow:              rgba(200,169,126,0.45) blur 30px        /* gold glow, offset-y 0 */
Click glow:              rgba(200,169,126,0.68) blur 42px        /* gold glow bright, offset-y 0 */

Text primary:            rgba(228, 226, 222, 0.90)
Text muted:              rgba(228, 226, 222, 0.45)
Text dimmed:             rgba(228, 226, 222, 0.28)

Panel background:        rgba(10, 10, 12, 0.97)
Panel border:            rgba(200, 169, 126, 0.30)
Panel inset shine:       rgba(200, 169, 126, 0.12)
Scrollbar thumb:         rgba(200, 169, 126, 0.18)
```

**Critical color rule:** Node backgrounds must be neutral near-black where r ≈ g ≈ b. Any value where the blue channel significantly exceeds the red or green channel (e.g., `rgba(16,14,28,...)`) creates a purple tint — this is forbidden. Use `#0f0e11`, `#141316`, `#1c1b1e` exactly.

---

## Node roles and badge colors

Every node has a `role` field. The role controls the badge pill, the border color, and the top-shine accent bar inside the SVG card.

| Role | Badge text color | Badge background | Border / shine |
|---|---|---|---|
| `orchestrator` | `rgba(200, 169, 126, 0.95)` | `rgba(200, 169, 126, 0.14)` | `rgba(200, 169, 126, 0.45)` |
| `reader` | `rgba(185, 178, 165, 0.82)` | `rgba(185, 178, 165, 0.10)` | `rgba(185, 178, 165, 0.40)` |
| `processor` | `rgba(165, 162, 155, 0.78)` | `rgba(165, 162, 155, 0.09)` | `rgba(165, 162, 155, 0.38)` |
| `renderer` | `rgba(210, 190, 155, 0.82)` | `rgba(210, 190, 155, 0.11)` | `rgba(210, 190, 155, 0.40)` |
| `writer` | `rgba(148, 168, 150, 0.78)` | `rgba(148, 168, 150, 0.09)` | `rgba(148, 168, 150, 0.38)` |
| `utility` | `rgba(130, 128, 124, 0.70)` | `rgba(130, 128, 124, 0.08)` | `rgba(130, 128, 124, 0.35)` |

---

## Node rendering — SVG card system

**Do not use Cytoscape canvas labels.** Every node is rendered as a rich SVG data URI passed to Cytoscape's `background-image` property. This produces proper card visuals (badge pill, monospace label, role border, top shine) that canvas text cannot achieve.

### Card anatomy

```
┌──────────────────────────────────┐  ← top accent shine bar (role color, thin rect)
│ ╭ BADGE ╮                        │  ← badge pill (role bg + role text)
│                                  │
│         filename.py              │  ← label (monospace, centered)
└──────────────────────────────────┘  ← role-colored border (1.5px, role opacity)
```

### Node data structure

```js
{
  data: {
    id:          'unique_id',       // snake_case, no spaces
    label:       'filename.py',     // displayed in monospace inside the card
    role:        'orchestrator',    // one of the roles above
    badge:       'Orchestrator',    // optional — overrides role label in badge pill
    description: 'What this file does. Can be multiple sentences.',
  }
}
```

### SVG card dimensions

- Node height: **74px** (constant `NODE_H = 74`)
- Node width: **dynamic** — `Math.max(154, label.length * 8.0 + 52)`
- Min width: 154px

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
    is_back:       false,            // if true, use unbundled-bezier arc below
  }
}
```

**Edge visual spec — blueprint cable style:**
- All cables are **white-ghost** (`rgba(228,226,222,...)`) — not gold; edge labels stay gold
- Curve style: `unbundled-bezier` for all edges — `control-point-distances: [-42]` gives a gentle downward droop like a physical cable
- **No endpoint arrowheads** — `target-arrow-shape: none`, `source-arrow-shape: none`
- **Mid-cable direction indicator** — `mid-target-arrow-shape: vee` at `arrow-scale: 0.85`; subtle and reads as directional without dominating the line
- **Connection ports** on each card SVG (left + right center circles) are where cables visually attach
- Line width: `4px` forward, `2.5px` back-edge; `line-cap: round` on all
- Back-edge: `control-point-distances: [110]` (arcs well below the nodes), dashed `[6, 5]`
- **Cable hover**: `mouseover` on edge brightens to `rgba(228,226,222,0.88)` width `5.5px`; `mouseout` restores original values
- Edge label font: `10px`, italic, gold-dim color

---

## Glow effects

Nodes glow on hover and on tap/click via direct `.style()` calls — **not** via CSS class selectors — because the SVG background-image must be regenerated on every state change.

- **Normal**: deep black shadow, `blur 24px`, `offset-y 6` — always on
- **Hovered**: gold shadow, `blur 30px`, `offset-y 0`
- **Active** (tapped): bright gold glow, `blur 42px`, `offset-y 0`

Hover must not override active state. Active state persists until a tap elsewhere or panel close.

---

## Cytoscape config template

**Copy this template exactly.** Only fill in `elements` and `layout`.

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
    background-color: #07060c;
    background-image: radial-gradient(circle, rgba(200,169,126,0.13) 1px, transparent 1px);
    background-size: 28px 28px;
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
    background: rgba(10, 10, 12, 0.97);
    backdrop-filter: blur(24px) saturate(160%);
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    border-top: 1px solid rgba(200, 169, 126, 0.30);
    box-shadow: 0 -2px 60px rgba(0, 0, 0, 0.60),
                inset 0 1px 0 rgba(200, 169, 126, 0.12);
    padding: 20px 24px 26px;
    transform: translateY(100%);
    transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 100;
    max-height: 48vh;
    overflow-y: auto;
  }

  #panel.open { transform: translateY(0); }

  #panel-close {
    position: absolute;
    top: 14px; right: 16px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(228, 226, 222, 0.40);
    font-size: 11px;
    cursor: pointer;
    padding: 5px 9px;
    border-radius: 6px;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
    line-height: 1;
  }
  #panel-close:hover {
    background: rgba(200, 169, 126, 0.10);
    border-color: rgba(200, 169, 126, 0.28);
    color: rgba(228, 226, 222, 0.82);
  }

  .panel-role {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 0.60rem;
    font-weight: 700;
    letter-spacing: 0.11em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .panel-label {
    font-size: 1.05rem;
    font-weight: 600;
    color: rgba(228, 226, 222, 0.95);
    margin-bottom: 10px;
    font-family: ui-monospace, 'JetBrains Mono', Menlo, monospace;
    letter-spacing: 0.01em;
  }

  .panel-desc {
    font-size: 0.83rem;
    color: rgba(228, 226, 222, 0.52);
    line-height: 1.70;
  }

  /* ── Hint pill ── */
  #hint {
    position: fixed;
    bottom: 18px; left: 50%;
    transform: translateX(-50%);
    background: rgba(10, 10, 12, 0.88);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(200, 169, 126, 0.22);
    border-radius: 20px;
    padding: 7px 16px;
    font-size: 0.68rem;
    color: rgba(200, 169, 126, 0.60);
    letter-spacing: 0.08em;
    pointer-events: none;
    transition: opacity 0.5s;
    white-space: nowrap;
  }
  #hint.hidden { opacity: 0; }

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

// ─── ROLE COLORS ──────────────────────────────────────────────────────────────
const ROLES = {
  orchestrator: { text: 'rgba(200,169,126,0.95)', bg: 'rgba(200,169,126,0.14)', border: 'rgba(200,169,126,0.45)' },
  reader:       { text: 'rgba(185,178,165,0.82)', bg: 'rgba(185,178,165,0.10)', border: 'rgba(185,178,165,0.40)' },
  processor:    { text: 'rgba(165,162,155,0.78)', bg: 'rgba(165,162,155,0.09)', border: 'rgba(165,162,155,0.38)' },
  renderer:     { text: 'rgba(210,190,155,0.82)', bg: 'rgba(210,190,155,0.11)', border: 'rgba(210,190,155,0.40)' },
  writer:       { text: 'rgba(148,168,150,0.78)', bg: 'rgba(148,168,150,0.09)', border: 'rgba(148,168,150,0.38)' },
  utility:      { text: 'rgba(130,128,124,0.70)', bg: 'rgba(130,128,124,0.08)', border: 'rgba(130,128,124,0.35)' },
};
function rc(role, key) { return (ROLES[role] || ROLES.utility)[key]; }

// ─── SVG CARD RENDERER ────────────────────────────────────────────────────────
// Nodes are rendered as SVG data URIs passed to Cytoscape's background-image.
// This produces card-style visuals (badge pill, monospace label, role border,
// top accent shine) that canvas text rendering cannot achieve.
const NODE_H = 74;
function node_w(label) { return Math.max(154, label.length * 8.0 + 52); }

function svg_card(label, role, badge, W, H, state) {
  const c     = ROLES[role] || ROLES.utility;
  const bw    = Math.max(badge.length * 5.8 + 20, 40);
  const bx    = 14, by = 12;

  // State-dependent visual values — pure near-black, no purple (r ≈ g ≈ b)
  const bg     = state === 'active'  ? '#1c1b1e'
               : state === 'hovered' ? '#141316'
               : '#0f0e11';
  const b_op   = state === 'active'  ? 0.85
               : state === 'hovered' ? 0.58
               : 0.30;
  const top_op = state === 'active'  ? 1.00
               : state === 'hovered' ? 0.78
               : 0.50;
  const lbl_op  = state === 'active'  ? '0.96' : '0.88';
  const port_op = state === 'active'  ? 0.90
                : state === 'hovered' ? 0.65
                : 0.42;

  const stroke = c.border.replace(/[\d.]+\)$/, `${b_op})`);
  const top    = c.border.replace(/[\d.]+\)$/, `${top_op})`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" rx="10" ry="10" fill="${bg}"/>
    <rect width="${W}" height="${H}" rx="10" ry="10" fill="none"
          stroke="${stroke}" stroke-width="2.5"/>
    <rect x="16" y="0" width="${W - 32}" height="1.5" rx="0.75" fill="${top}"/>
    <rect x="${bx}" y="${by}" width="${bw}" height="17" rx="8.5" fill="${c.bg}"/>
    <text x="${bx + bw / 2}" y="${by + 12}" text-anchor="middle"
          fill="${c.text}" font-size="8.5" font-weight="700"
          letter-spacing="0.10em"
          font-family="system-ui,-apple-system,sans-serif">${badge.toUpperCase()}</text>
    <text x="${W / 2}" y="${H / 2 + 15}" text-anchor="middle"
          fill="rgba(228,226,222,${lbl_op})" font-size="12.5" font-weight="700"
          font-family="'Menlo','Consolas','JetBrains Mono',monospace">${label}</text>
    <!-- Connection ports — N / S / E / W (cable attaches to whichever side faces the target) -->
    <circle cx="${W / 2}" cy="0"        r="4.5" fill="${bg}" stroke="rgba(228,226,222,${port_op})" stroke-width="1.5"/>
    <circle cx="${W / 2}" cy="${H}"     r="4.5" fill="${bg}" stroke="rgba(228,226,222,${port_op})" stroke-width="1.5"/>
    <circle cx="0"        cy="${H / 2}" r="4.5" fill="${bg}" stroke="rgba(228,226,222,${port_op})" stroke-width="1.5"/>
    <circle cx="${W}"     cy="${H / 2}" r="4.5" fill="${bg}" stroke="rgba(228,226,222,${port_op})" stroke-width="1.5"/>
  </svg>`;
}

function to_uri(svg) {
  try {
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  } catch(e) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
}

// ─── GRAPH DATA — fill this section ───────────────────────────────────────────
const elements = [
  // Nodes
  // { data: { id: 'main', label: 'main.py', role: 'orchestrator', badge: 'Core', description: '...' } },

  // Forward edges
  // { data: { id: 'e_main_pull', source: 'main', target: 'pull', label: 'spawn' } },
  // Bidirectional edge
  // { data: { id: 'e_a_b', source: 'a', target: 'b', label: 'rpc', bidirectional: true } },
  // Back-edge (arc below, dashed):
  // { data: { id: 'e_render_main', source: 'render', target: 'main', label: 'frames', is_back: true } },
];

// ─── LAYOUT ────────────────────────────────────────────────────────────────────
// Option A — preset: you control exact x/y for every node id.
//   Space nodes ~270px apart horizontally, ~220px vertically.
//   Nodes are ~154–200px wide and 74px tall; 270px gives ~70px breathing room.
// const positions = {
//   main: { x: 100, y: 260 },
//   pull: { x: 370, y: 260 },
// };
// const layout = { name: 'preset', positions: node => positions[node.id()], animate: false, padding: 90 };

// Option B — auto layout (cose force-directed, good for complex graphs):
const layout = {
  name: 'cose',
  animate: false,
  padding: 80,
  nodeRepulsion: () => 12000,
  edgeElasticity: () => 100,
  idealEdgeLength: () => 200,
  gravity: 0.6,
  numIter: 1000,
};

// ─── CYTOSCAPE INIT ────────────────────────────────────────────────────────────
const cy = cytoscape({
  container: document.getElementById('cy'),
  elements,
  layout,

  style: [
    // ── Nodes — SVG background replaces canvas label entirely ──
    {
      selector: 'node',
      style: {
        'shape':              'round-rectangle',
        'background-color':   '#0f0e11',
        'background-opacity': 1,
        'border-width':       0,
        'label':              '',   // SVG handles all text rendering
        // Always-on depth shadow — lifts nodes off the canvas
        'shadow-blur':        24,
        'shadow-color':       'rgba(0,0,0,0.82)',
        'shadow-opacity':     0.72,
        'shadow-offset-x':    0,
        'shadow-offset-y':    6,
        'transition-property': 'shadow-blur, shadow-color, shadow-opacity, shadow-offset-y',
        'transition-duration': '0.20s',
      },
    },

    // ── Base edge — cable: thick, rounded ──
    // curve-style / control-points / endpoints are set per-edge in INIT EDGE CABLES below
    {
      selector: 'edge',
      style: {
        'curve-style':             'unbundled-bezier',
        'line-color':              'rgba(228,226,222,0.52)',
        'line-cap':                'round',
        'target-arrow-shape':      'none',
        'source-arrow-shape':      'none',
        'mid-target-arrow-shape':  'vee',   // subtle direction indicator mid-cable
        'mid-target-arrow-color':  'rgba(228,226,222,0.72)',
        'mid-target-arrow-fill':   'filled',
        'arrow-scale':             0.85,
        'width':                   4,
        'label':                   'data(label)',
        'font-size':               10,
        'font-style':              'italic',
        'color':                   'rgba(200,169,126,0.65)',
        'text-background-opacity': 1,
        'text-background-color':   '#07060c',
        'text-background-padding': '4px',
        'text-border-opacity':     0,
        'transition-property':     'line-color, width',
        'transition-duration':     '0.15s',
      },
    },

    // ── Bidirectional edge ──
    {
      selector: 'edge[?bidirectional]',
      style: {
        'mid-source-arrow-shape': 'vee',
        'mid-source-arrow-color': 'rgba(228,226,222,0.60)',
        'mid-source-arrow-fill':  'filled',
      },
    },

    // ── Back-edge — dashed cable (control-points set per-edge in init loop) ──
    {
      selector: 'edge[?is_back]',
      style: {
        'line-color':              'rgba(228,226,222,0.28)',
        'mid-target-arrow-color':  'rgba(228,226,222,0.50)',
        'line-style':              'dashed',
        'line-dash-pattern':       [6, 5],
        'width':                   2.5,
      },
    },
  ],

  minZoom: 0.22,
  maxZoom: 4,
  wheelSensitivity: 0.25,
  userZoomingEnabled: true,
  userPanningEnabled: true,
  boxSelectionEnabled: false,
  selectionType: 'single',
  touchTapThreshold: 8,
  desktopTapThreshold: 4,
});

// ─── INIT NODE CARDS ──────────────────────────────────────────────────────────
cy.nodes().forEach(n => {
  const label = n.data('label');
  const role  = n.data('role') || 'utility';
  const badge = n.data('badge') || role.charAt(0).toUpperCase() + role.slice(1);
  const W     = node_w(label);

  // Cache computed values for reuse in state transitions
  n.data('_badge', badge);
  n.data('_w', W);

  n.style({
    'background-image':   to_uri(svg_card(label, role, badge, W, NODE_H, 'normal')),
    'background-fit':     'cover',
    'background-clip':    'node',
    'background-opacity': 1,
    'width':              W,
    'height':             NODE_H,
  });
});

// ─── INIT EDGE CABLES ────────────────────────────────────────────────────────
// Per-edge routing: plugs each cable into the correct port circle.
//   Vertical-dominant forward edges  → exits bottom port, enters top port
//   Everything else (horiz/diag/back) → exits RIGHT port, enters LEFT port
//   Back-edges use E→W with a large downward arc (-170px CP)
cy.edges().forEach(e => {
  const src     = cy.getElementById(e.data('source'));
  const tgt     = cy.getElementById(e.data('target'));
  const sp      = src.position();
  const tp      = tgt.position();
  const sw      = src.data('_w');
  const tw      = tgt.data('_w');
  const dx      = tp.x - sp.x;
  const dy      = tp.y - sp.y;
  const is_back = !!e.data('is_back');

  if (!is_back && Math.abs(dy) > Math.abs(dx) * 1.2) {
    const dir = dy > 0 ? 1 : -1;
    e.style({
      'source-endpoint':         `0px ${dir  * (NODE_H / 2)}px`,
      'target-endpoint':         `0px ${-dir * (NODE_H / 2)}px`,
      'control-point-distances': [38],
      'control-point-weights':   [0.5],
    });
  } else {
    e.style({
      'source-endpoint':         `${sw / 2}px 0px`,
      'target-endpoint':         `${-tw / 2}px 0px`,
      'control-point-distances': [is_back ? -170 : -42],
      'control-point-weights':   [0.5],
    });
  }
});

// ─── NODE STATE HELPERS ───────────────────────────────────────────────────────
function set_card(node, state) {
  node.style('background-image', to_uri(
    svg_card(node.data('label'), node.data('role') || 'utility',
             node.data('_badge'), node.data('_w'), NODE_H, state)
  ));
}

const SHADOW = {
  normal:  { 'shadow-blur': 24, 'shadow-color': 'rgba(0,0,0,0.82)',       'shadow-opacity': 0.72, 'shadow-offset-y': 6 },
  hovered: { 'shadow-blur': 30, 'shadow-color': 'rgba(200,169,126,0.45)', 'shadow-opacity': 1,    'shadow-offset-y': 0 },
  active:  { 'shadow-blur': 42, 'shadow-color': 'rgba(200,169,126,0.68)', 'shadow-opacity': 1,    'shadow-offset-y': 0 },
};

// ─── HOVER ────────────────────────────────────────────────────────────────────
cy.on('mouseover', 'node', evt => {
  const n = evt.target;
  if (!n.hasClass('active')) { set_card(n, 'hovered'); n.style(SHADOW.hovered); }
  document.getElementById('cy').style.cursor = 'pointer';
});
cy.on('mouseout', 'node', evt => {
  const n = evt.target;
  if (!n.hasClass('active')) { set_card(n, 'normal'); n.style(SHADOW.normal); }
  document.getElementById('cy').style.cursor = 'default';
});

// ─── EDGE (CABLE) HOVER + CLICK GLOW ─────────────────────────────────────────
function edge_rest(e) {
  const is_back = !!e.data('is_back');
  e.style({
    'line-color':      is_back ? 'rgba(228,226,222,0.28)' : 'rgba(228,226,222,0.52)',
    'width':           is_back ? 2.5 : 4,
    'overlay-opacity': 0,
    'overlay-padding': 0,
  });
}
function edge_hover(e) {
  e.style({
    'line-color':      'rgba(228,226,222,0.82)',
    'width':           5.5,
    'overlay-color':   'rgba(228,226,222,1)',
    'overlay-opacity': 0.10,
    'overlay-padding': 9,
  });
}
function edge_active(e) {
  e.style({
    'line-color':      'rgba(228,226,222,0.96)',
    'width':           6,
    'overlay-color':   'rgba(228,226,222,1)',
    'overlay-opacity': 0.20,
    'overlay-padding': 14,
  });
}

cy.on('mouseover', 'edge', evt => {
  const e = evt.target;
  if (!e.hasClass('cable-active')) edge_hover(e);
  document.getElementById('cy').style.cursor = 'pointer';
});
cy.on('mouseout', 'edge', evt => {
  const e = evt.target;
  if (!e.hasClass('cable-active')) edge_rest(e);
  document.getElementById('cy').style.cursor = 'default';
});
cy.on('tap', 'edge', evt => {
  const e = evt.target;
  if (e.hasClass('cable-active')) {
    e.removeClass('cable-active');
    edge_rest(e);
  } else {
    cy.edges('.cable-active').forEach(other => { other.removeClass('cable-active'); edge_rest(other); });
    e.addClass('cable-active');
    edge_active(e);
  }
});

// ─── DETAIL PANEL ─────────────────────────────────────────────────────────────
const panel  = document.getElementById('panel');
const hint   = document.getElementById('hint');
let hint_dismissed = false;

function dismiss_hint() {
  if (!hint_dismissed) { hint.classList.add('hidden'); hint_dismissed = true; }
}

function open_panel(node) {
  const role  = node.data('role') || 'utility';
  const badge = node.data('_badge');
  const c     = ROLES[role] || ROLES.utility;

  document.getElementById('panel-badge').textContent      = badge;
  document.getElementById('panel-badge').style.color      = c.text;
  document.getElementById('panel-badge').style.background = c.bg;
  document.getElementById('panel-badge').style.border     = `1px solid ${c.text.replace(/[\d.]+\)$/, '0.22)')}`;
  document.getElementById('panel-label').textContent      = node.data('label');
  document.getElementById('panel-desc').textContent       = node.data('description') || '';
  panel.classList.add('open');
  dismiss_hint();
}

function close_panel() {
  panel.classList.remove('open');
  cy.nodes().filter('.active').forEach(n => {
    n.removeClass('active');
    set_card(n, 'normal');
    n.style(SHADOW.normal);
  });
  cy.edges().filter('.cable-active').forEach(e => {
    e.removeClass('cable-active');
    edge_rest(e);
  });
}

cy.on('tap', 'node', evt => {
  const node = evt.target;
  cy.nodes().filter('.active').forEach(n => {
    if (n.id() !== node.id()) {
      n.removeClass('active');
      set_card(n, 'normal');
      n.style(SHADOW.normal);
    }
  });
  node.addClass('active');
  set_card(node, 'active');
  node.style(SHADOW.active);
  if (node.data('description')) open_panel(node);
  dismiss_hint();
});

cy.on('tap', evt => {
  if (evt.target === cy) close_panel();
});

document.getElementById('panel-close').addEventListener('click', close_panel);
cy.one('pan zoom drag', dismiss_hint);

</script>
</body>
</html>
```

---

## Instructions for the AI

When generating a diagram, follow these steps:

1. **Copy the template above exactly.** Do not change any CSS, color values, Cytoscape config, or JavaScript functions — only fill in the `elements` array and `layout`.

2. **Fill in `elements`:**
   - One `{ data: { id, label, role, badge?, description } }` object per node
   - One `{ data: { source, target, label?, bidirectional?, is_back? } }` per edge
   - Mark back-edges (where the target comes earlier in the pipeline) with `is_back: true`
   - `badge` is optional — if omitted, the role name is used (e.g. `role: 'reader'` → badge: `"Reader"`)

3. **Choose a layout:**
   - `preset` — you control exact `x/y` positions. Use `270px` horizontal spacing and `220px` vertical spacing. Nodes are `~154–200px` wide × `74px` tall. This is preferred for diagrams with 6–12 nodes arranged in rows/columns.
   - `cose` — force-directed auto layout, good for organic graphs where exact positioning doesn't matter

4. **Do not:**
   - Use Cytoscape canvas labels (`label: 'data(label)'` on nodes) — all text is in the SVG
   - Change `NODE_H`, `node_w()`, `svg_card()`, `to_uri()`, `set_card()`, or `SHADOW` constants
   - Change node backgrounds to anything with a significant blue bias — `#0f0e11`, `#141316`, `#1c1b1e` are the only three permitted card backgrounds
   - Use any purple, blue-tinted, or near-identical-to-canvas (`#07060c`) background colors
   - Change edge colors — all connections and arrowheads must be white (`rgba(228,226,222,...)`); only edge labels use gold
   - Add `border-width` to the Cytoscape node selector — the SVG handles the border visually
   - Add external fonts or libraries beyond Cytoscape.js
   - Add CSS animations other than the panel slide already defined
   - Add scrollbars to `#cy` (the graph handles pan/zoom internally)
   - Remove `svg_card()`, `to_uri()`, `set_card()`, `SHADOW`, the init loop, or any event handler

5. **Height guidance:**
   - For 3–5 node diagrams: suggest `height: 420` in the Sanity block
   - For 6–10 node diagrams: `height: 560`
   - For 10+ nodes: `height: 700`

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
> - pull → main (label: "library.json", is_back: true)
> - main → design (label: "optional")
> - design → main (label: "manifest.json", is_back: true)
> - main → collect (label: "collect_render()")
> - collect → render (label: "blender spawn")
> - render → collect (label: "PNG frames", is_back: true)
> - collect → ffmpeg (label: "PNG sequence")
> - ffmpeg → collect (label: "mp4", is_back: true)
>
> Use `preset` layout. Suggest height: 560.

---

## Where to paste the output

In Sanity Studio → the relevant product/devlog/doc page → **Page sections** → **Add block** → **Raw Diagram**. Paste the entire HTML into the **Diagram HTML** field.
