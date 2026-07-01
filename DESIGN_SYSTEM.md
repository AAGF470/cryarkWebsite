# Cryark / Guillen Studio — Design System

Reference document for AI coding sessions and contributors. Every convention here is live in production — check this file before writing new UI.

---

## 1. Site Identity

Two distinct but visually unified brands share the same design language.

| | **cryark.net** | **guillen.studio** |
|---|---|---|
| Purpose | Game/product studio brand | Personal portfolio & devlog |
| Tone | Bold, cinematic | Refined, editorial |
| Accent | Dawn gold (same hue) | Dawn gold (same hue, but used more sparingly) |
| Gold rule | Can use gold as lava/fill on CTAs | Gold is **accent-only**: borders, text, lines. Never block fills |
| Logo | `CRYARK` wordmark or SVG | `AG` monogram or `cry`**ark** |

---

## 2. Design Tokens (`shared/styles/tokens.css`)

All values come from CSS custom properties. Never hardcode a value that has a token.

```css
/* Typography */
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;

/* Palette */
--color-bg:          #050508;          /* slightly blue-black — not pure black, not gray */
--color-surface:     #0a090e;          /* elevated surfaces */
--color-text:        #e8e6e1;          /* warm near-white */
--color-text-dim:    rgba(232, 230, 225, 0.42);
--color-text-faint:  rgba(232, 230, 225, 0.22);
--color-accent:      #c8a97e;          /* dawn gold */
--color-accent-dim:  rgba(200, 169, 126, 0.18);

/* Borders */
--color-border-sub:  rgba(255, 255, 255, 0.06);
--color-border-low:  rgba(255, 255, 255, 0.10);
--color-border-mid:  rgba(255, 255, 255, 0.18);

/* Spacing */
--space-xs:   4px;   --space-sm:   8px;
--space-md:  16px;   --space-lg:  32px;
--space-xl:  64px;   --space-2xl: 96px;

/* Radius */
--radius-sm: 4px;   --radius-md: 8px;   --radius-lg: 12px;

/* Z-index */
--z-nav:   100;   --z-modal: 200;   --z-toast: 300;
```

### Color tint rule
`--color-bg` is a **very slight blue-black** (`#050508`). Do **not** drift toward:
- Gray (`#111111` is too gray)
- Purple (`rgba(14,13,18,...)` is too purple)
- Pure black (`#000000` feels flat)

If you touch background colors, keep them within the `#050508 → #0a090e` range.

---

## 3. The Gold Accent

`rgba(200, 169, 126, ...)` is the only accent color. Apply it at the right opacity for the right job.

| Use | Opacity / value |
|---|---|
| Text (eyebrows, labels, captions) | `0.55–0.80` |
| Active borders, glider outline | `0.22–0.35` |
| Glow shadows | `0.08–0.15` |
| Cryark CTA fill (lava variant) | `rgb(195, 160, 95)` solid |
| **Guillen block fills** | **Never. Gold is too muted on guillen for block backgrounds.** |
| **Text on a gold background** | **Never.** |

Gold text-shadow (for motto/hero text on guillen):
```css
text-shadow:
  0 0 6px  rgba(200, 169, 126, 0.70),
  0 0 14px rgba(200, 169, 126, 0.40),
  0 0 30px rgba(200, 169, 126, 0.18);
```

---

## 4. Typography Scale

Font: **Inter**, loaded via Google Fonts. Weights used: 400, 500, 600, 700.

| Element | Size | Weight | Letter-spacing |
|---|---|---|---|
| Eyebrows / labels | 11px | 700 | 0.14–0.18em |
| Captions / small meta | 10–12px | 500 | 0.04–0.06em |
| Body copy | 14–15px | 400–500 | normal |
| Card titles | 14–18px | 500–600 | −0.01–−0.02em |
| Section headings | 18–20px | 600 | −0.01em |
| Page titles | `clamp(24px, 3.5vw, 36px)` – `clamp(36px, 5vw, 52px)` | 500–600 | −0.02em |
| Hero titles (cinematic) | `clamp(42px, 7vw, 88px)` | 500 | −0.03em |
| Monospace code | 11–13px | 400 | normal |
| Nav labels | 12px | 500 | 0.01em |
| CTA buttons | 12px | 600 | 0.08em |

Eyebrows always `text-transform: uppercase`. Headings never uppercase.

---

## 5. Spacing & Layout

### Page shell
```css
.page {
  background: var(--color-bg);
  min-height: 100vh;
  padding-top: 62px;   /* fixed nav height — always reserve this */
  overflow-x: hidden;
}
@media (max-width: 680px) { .page { padding-top: 54px; } }
```

### Content container (the max-width column)
```css
max-width: min(1920px, 94vw);
margin: 0 auto;
padding: 0 48px;           /* desktop */
/* mobile: */ padding: 0 24px; /* or 16px for tighter layouts */
```

This formula is the single source of truth for horizontal alignment. The navigation bar uses it too — do not invent a different max-width on new pages.

### Hero sections that start behind the nav
```css
.page-header {
  margin-top: -62px;    /* pull section up to y=0 */
}
.page-header__content {
  padding-top: 126px;   /* 62px nav + 64px breathing room */
}
```

### Grid patterns
```css
/* Product card grid */
grid-template-columns: repeat(auto-fill, minmax(min(620px, 100%), 1fr));
gap: 12px;

/* Smaller card grid (cryark listings) */
grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
gap: 16px;
```

---

## 6. Glassmorphism Language

The sites use a consistent "dark frosted glass" treatment across all floating elements. Use these exact values — don't invent new blur levels.

| Component | Background | Backdrop filter | Border |
|---|---|---|---|
| Nav dock | `rgba(10,10,10,0.86)` | `blur(28px) saturate(180%)` | `0.5px solid rgba(255,255,255,0.10)` |
| Nav mobile menu | `rgba(10,10,10,0.97)` | `blur(28px) saturate(160%)` | `0.5px solid rgba(255,255,255,0.08)` |
| WorkCard | `rgba(5,5,10,0.72)` | `blur(20px) saturate(160%)` | `0.5px solid rgba(255,255,255,0.07)` |
| Cards (generic) | `rgba(255,255,255,0.032)` | — | `0.5px solid rgba(255,255,255,0.07)` |
| Product info bars | — | `blur(16px)` | — |
| Sidebar (docs) | `rgba(255,255,255,0.012)` | — | `0.5px solid rgba(255,255,255,0.055)` |
| Modals / overlays | `rgba(10,10,10,0.97)` | `blur(28px)` | `0.5px solid rgba(255,255,255,0.08)` |
| Screen backdrop | `rgba(0,0,0,0.45)` | `blur(4px)` | — |

**Key rule:** borders are always `0.5px` (hairline), never `1px solid` on glass panels.

---

## 7. Shadow System

```css
/* Floating panel (nav, modals) */
box-shadow:
  0 8px 40px rgba(0, 0, 0, 0.55),
  0 1px 0 rgba(255, 255, 255, 0.06) inset;

/* Card lift on hover */
box-shadow: 0 8px 40px rgba(0, 0, 0, 0.45);

/* Mobile menu */
box-shadow: 0 16px 48px rgba(0, 0, 0, 0.60);

/* Gold active element glow */
box-shadow:
  0 1px 0 rgba(255, 255, 255, 0.07) inset,
  0 2px 12px rgba(200, 169, 126, 0.08);

/* Button solid hover (warm glow) */
box-shadow:
  0 0 12px 2px var(--btn-glow-tight),   /* rgba(235,210,160,0.90) default */
  0 0 36px 8px  var(--btn-glow-wide);   /* rgba(200,165,100,0.28) default */

/* Code / dark panels */
box-shadow: 0 4px 28px rgba(0, 0, 0, 0.35);
```

---

## 8. Border Radius Conventions

| Component | Radius |
|---|---|
| Buttons | `8px` |
| Nav items, glider | `8px` |
| Nav dock container | `14px` |
| Nav mobile menu | `16px` |
| Cards (surface) | `14px` |
| WorkCard (outer frame) | `20px` |
| WorkCard (inner cells) | `10px` (= outer − padding) |
| Thumbnails / images | `8px` |
| Code snippets | `10px` |
| Status badges (square) | `4px` |
| Status badges (pill) | `999px` |
| Language chips | `3px` |
| Modals | `16px` |
| Scrollbar thumbs | `99px` |
| Spinners | `50%` |

---

## 9. Button Component (`shared/components/ui/Button`)

Three variants, one shared component. Always use `<Button>` — never write a new bespoke button element.

### Variants

**`solid`** (default) — dark resting fill, sweeps to white on hover with a warm glow.
```
Padding: 10px 26px
Border-radius: 8px
Resting: #0e0f12 bg, rgba(255,255,255,0.14) border
Hover: white fill, dark text, warm glow
```

**`solid` + `lava`** — same as solid but fills with accent orange (`rgb(195,160,95)` on guillen).
Use for primary CTAs on cryark. Avoid on guillen (gold too muted for block fill).

**`ghost`** — text + `→` arrow only. Arrow slides right on hover.
```
Padding: 11px 6px
Resting text: rgba(232,230,225,0.50)
Hover text: var(--btn-ghost-color) [warm gold tone]
```

**`ghost-bordered`** — outlined glass pill. Tints gold on hover.
```
Padding: 10px 20px
Resting border: rgba(255,255,255,0.10)
Hover border: gold tone, subtle outer glow
```

### Theme props
All Button color values are CSS custom properties with defaults. Pass custom theme props when a page section has a different color context. Defaults are the dawn-gold palette and work for both sites.

---

## 10. Navigation (`shared/components/ui/SiteNav`)

The nav is a **floating dock** rendered via `createPortal` into `document.body` (required to escape `overflow:hidden` ancestors that would break `backdrop-filter` on `position:fixed` elements — a known Chromium bug).

### Key rules
- **Fixed dimensions** on nav items (`gap: 7px`, `padding: 7px 11px`) — never animate width. The liquid-glass glider is absolutely positioned; if flex items shift width, the glider position goes stale.
- **Glider uses `useLayoutEffect`** to measure the active item after every route change. Fires after DOM update, before paint — no flash.
- **Gold is outline-only** on the glider (`border: 0.5px solid rgba(200,169,126,0.30)`), not the fill. Fill is neutral glass.
- Active state = **white text**, transparent background (glider provides highlight).

### Positioning formula
```css
/* Desktop: aligns with content left edge (container outer + 48px content padding) */
left: max(20px, calc((100vw - min(1920px, 94vw)) / 2 + 48px));

/* Tablet (641–768px): content padding drops to 24px */
@media (max-width: 768px) {
  left: max(20px, calc((100vw - min(1920px, 94vw)) / 2 + 24px));
}

/* Mobile: full-width dock */
@media (max-width: 640px) {
  left: 14px;
  right: 14px;
}
```

### Auto-hide
Nav hides (`translateY(-80px)`) when scrolling down >4px past 80px, re-appears on scroll up or mouse within 80px of top. Mobile menu open prevents hiding.

---

## 11. Animation & Transitions

### Easing functions
```css
/* Standard ease-in-out — most UI transitions */
cubic-bezier(0.4, 0, 0.2, 1)

/* Sharp acceleration — image scale on hover */
cubic-bezier(0.25, 0, 0.1, 1)

/* Spring / bounce — nav glider "water-drop" slide */
cubic-bezier(0.34, 1.28, 0.64, 1)
```

### Duration conventions
| Speed | Duration | Use |
|---|---|---|
| Instant | 0.14–0.16s | Color/opacity on hover |
| Fast | 0.18–0.22s | Small positional changes |
| Normal | 0.25–0.30s | Nav transitions, ghost hover |
| Deliberate | 0.38–0.40s | Glider slide, button sweep |
| Slow | 0.50–0.55s | Box-shadow glow, image zoom |
| Keyframe loops | 1.4–2.4s | Pulse, grain, breathe |

### Key animations
```css
/* Button sweep (light streak across solid button on hover) */
@keyframes btn_sweep {
  0%   { opacity: 0; left: -15%; }
  10%  { opacity: 1; }
  80%  { opacity: 0.9; }
  100% { opacity: 0; left: 112%; }
}

/* Film grain (page background noise) */
@keyframes gh-grain-shift {
  /* shifts background-position randomly across 10 steps */
  /* duration: 0.18s steps(1) infinite */
}

/* Live dot pulse */
@keyframes card_live_dot_pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
  /* duration: 2s ease-in-out infinite */
}
```

---

## 12. Status Badge Colors

Used on cards, work pages, and devlogs. Always these exact values.

| Status | Text | Background |
|---|---|---|
| `released` | `rgba(160,220,160,0.90)` | `rgba(80,190,80,0.10)` |
| `in_dev` | `rgba(160,195,245,0.90)` | `rgba(80,140,225,0.10)` |
| `research` | `rgba(190,165,245,0.90)` | `rgba(140,90,225,0.10)` |
| `live` | `rgba(100,220,150,0.90)` | `rgba(50,175,90,0.10)` |
| `collab` | `rgba(200,169,126,0.90)` | `rgba(200,169,126,0.10)` |

Badge styling: `font-size: 9px`, `font-weight: 700`, `letter-spacing: 0.12em`, `text-transform: uppercase`, `border-radius: 4px`, `padding: 3px 8px`.

---

## 13. Film Grain Overlay

Every page has an animated SVG fractal noise overlay that gives the "analog" texture.

```css
.gh-grain {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.048;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 160px 160px;
  animation: gh-grain-shift 0.18s steps(1) infinite;
}
```

Always add `<div className="gh-grain" aria-hidden="true" />` as the first child of every page shell. Always `z-index: 0`.

---

## 14. Z-Index Stack

```
Film grain overlay:      0   (always behind everything)
Outline/glow canvas:     0–1 (under card surface)
Card surfaces:           2–4
Page header/hero:        2
Docs layout:             2
Sidebar / rail nav:      10
Screen backdrop:         198
Mobile nav menu:         199
Site nav dock:           200
Modals:                  200
Toast notifications:     300
```

---

## 15. Page Background Image Pattern

For pages that support a hero background image:

```js
// 1. Add bg_image field to Sanity schema (pageConfig document, keyed by page_id string)
// 2. Query returns bg_image_url (pre-processed CDN URL)
// 3. In JSX:
const has_bg = !!(config?.bg_image_url);

// In markup:
<div className={`page-header${has_bg ? " page-header--has-bg" : ""}`}>
  {has_bg && (
    <div
      className="page-header__bg"
      style={{ backgroundImage: `url(${config.bg_image_url})` }}
    />
  )}
  ...
</div>
```

```css
.page-header__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center top;
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0,0,0,0.80) 0%,
    rgba(0,0,0,0.50) 45%,
    rgba(0,0,0,0) 100%
  );
  mask-image: linear-gradient(
    to bottom,
    rgba(0,0,0,0.80) 0%,
    rgba(0,0,0,0.50) 45%,
    rgba(0,0,0,0) 100%
  );
}

/* Colour overlay on top of the image */
.page-header__bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(5,5,8,0.42) 0%,
    rgba(5,5,8,0.72) 60%,
    rgba(5,5,8,1.00) 100%
  );
}
```

Pages that have pageConfig bg_image: `guillen_work`, `guillen_devlog`.
Pages still missing it: Home, Devlog detail, About, Docs.

---

## 16. Eyebrow Pattern

All page headers use a small uppercase label above the main title. Always this structure:

```css
.eyebrow {
  font-size: 11px;
  letter-spacing: 0.18em;
  color: rgba(200, 169, 126, 0.70);
  text-transform: uppercase;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.eyebrow::before {
  content: '';
  display: inline-block;
  width: 22px;
  height: 0.5px;
  background: rgba(200, 169, 126, 0.70);
  flex-shrink: 0;
}
```

---

## 17. Shared Components Reference

| Component | Location | Notes |
|---|---|---|
| `SiteNav` | `shared/components/ui/SiteNav` | Always use. Do not write a new nav. |
| `SiteFooter` | `shared/components/ui/SiteFooter` | `variant="guillen"` or `variant="cryark"` |
| `Button` | `shared/components/ui/Button` | 3 variants + lava modifier |
| `WorkCard` | `shared/components/ui/WorkCard` | Bento-style, 3 inner cells |
| `CinematicHero` | `shared/components/ui/CinematicHero` | Full-screen hero for cryark product pages |
| `DocSidebar` | `shared/components/ui/DocSidebar` | Left rail for docs, accepts `product_slug` for back link |
| `CodeBlock` | `shared/components/ui/CodeBlock` | Syntax-highlighted code |
| `CalloutBlock` | `shared/components/ui/CalloutBlock` | Note/warning/tip callouts |
| `FeatureSpotlight` | `shared/components/ui/FeatureSpotlight` | Left/right image+text split |
| `ScreenshotGallery` | `shared/components/ui/ScreenshotGallery` | Lightboxed image grid |
| `FactGrid` | `shared/components/ui/FactGrid` | Stats/numbers grid |
| `RoadmapBlock` | `shared/components/ui/RoadmapBlock` | Timeline with active item pulse |

---

## 18. Things to Never Do

1. **Don't introduce new tints to backgrounds.** No purple (`rgba(14,13,18,...)`), no blue-gray, no warm gray. Background stays in the `#050508 → #0a090e` range.
2. **Don't use gold as a fill background** on guillen. It reads as "bland yellow." Gold = borders, text, thin lines, outlines only.
3. **Don't animate nav item width.** Any `max-width`, `padding`, or `gap` animation on nav links will misalign the glider.
4. **Don't render SiteNav inside the page tree** if the page has `overflow:hidden` ancestors — the `backdrop-filter` on `position:fixed` elements breaks. Use `createPortal(…, document.body)`.
5. **Don't hardcode content max-widths** other than `min(1920px, 94vw)`. Other values break alignment with the nav.
6. **Don't use `border: 1px solid`** on glass panels. All glass borders are `0.5px solid` (hairline).
7. **Don't add new cubic-bezier values.** Use one of the three established easings.
8. **Don't skip the film grain overlay.** It ties the aesthetic together. Every page gets it.
