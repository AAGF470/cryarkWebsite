# Cryark / Guillen.Studio — Maintenance & Developer Reference

> Written after the initial build. Use this when you return to the project and
> need to remember how things work, where things live, or how to extend the site.

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Monorepo Structure](#2-monorepo-structure)
3. [Running the Project](#3-running-the-project)
4. [Environment Variables](#4-environment-variables)
5. [CMS — Sanity Studio](#5-cms--sanity-studio)
6. [Common Content Tasks](#6-common-content-tasks)
7. [GROQ Query Reference](#7-groq-query-reference)
8. [Component Library](#8-component-library)
9. [Design Tokens & Theming](#9-design-tokens--theming)
10. [Icon System](#10-icon-system)
11. [Routing](#11-routing)
12. [Adding a New Shared Component](#12-adding-a-new-shared-component)
13. [Adding a New CMS Block Type](#13-adding-a-new-cms-block-type)
14. [Deployment (VPS)](#14-deployment-vps)
15. [Naming Conventions](#15-naming-conventions)

---

## 1. Tech Stack

| Layer | Library | Version |
|---|---|---|
| UI framework | React | 19 |
| Build tool | Vite | 8 |
| Routing | React Router | v7 (`createBrowserRouter`) |
| CMS | Sanity | v3 |
| Sanity client | `@sanity/client` | 7 |
| Sanity image URLs | `@sanity/image-url` | 2 |
| Portable Text renderer | `@portabletext/react` | 6 |
| 3D viewer | `@google/model-viewer` | 4 (lazy-loaded) |
| Styling | Plain CSS, BEM-style class names | — |
| No Tailwind, no CSS-in-JS | | |

---

## 2. Monorepo Structure

```
cryarkwebsite/              ← monorepo root
│
├── shared/                 ← shared library (used by BOTH sites)
│   ├── components/
│   │   ├── ui/             ← all reusable UI components (28 components)
│   │   └── cms/            ← PortableTextRenderer (maps Sanity blocks → JSX)
│   ├── hooks/
│   │   ├── useCardGlow.js
│   │   ├── usePillGlow.js
│   │   └── useSanityQuery.js   ← the CMS data-fetching hook
│   ├── lib/
│   │   ├── cms.js          ← single import point for all CMS utilities
│   │   ├── queries.js      ← all GROQ query strings
│   │   ├── sanity.js       ← Sanity client init
│   │   └── imageUrl.js     ← urlFor() image builder
│   └── styles/
│       ├── tokens.css      ← ALL CSS custom properties (colors, spacing, etc.)
│       └── base.css        ← CSS reset + body defaults (imports tokens.css)
│
├── apps/
│   ├── cryark/             ← cryark.net app
│   │   ├── src/
│   │   │   ├── pages/      ← page components (route-level files)
│   │   │   ├── theme/
│   │   │   │   └── theme.css   ← cryark token overrides (empty = uses defaults)
│   │   │   ├── App.jsx     ← router definition
│   │   │   └── main.jsx    ← entry point, imports base.css + theme.css
│   │   ├── public/         ← static assets served at root
│   │   │   ├── icons/      ← platform icons (blender, godot, itch, steam…)
│   │   │   ├── logos/      ← "built with" full wordmarks
│   │   │   └── products/   ← per-product static images
│   │   └── index.html
│   │
│   └── guillen/            ← guillen.studio app (scaffold)
│       ├── src/
│       │   ├── pages/
│       │   ├── theme/
│       │   │   └── theme.css   ← guillen token overrides (gold palette = same as cryark for now)
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── vite.config.js  ← guillen-specific config with @shared alias
│       └── index.html
│
├── studio/                 ← Sanity Studio (CMS editor, deployed separately)
│   ├── schemas/
│   │   ├── product.js      ← Product document schema
│   │   ├── labEntry.js     ← Lab Entry document schema
│   │   ├── blockTypes.js   ← all reusable block/object schemas
│   │   └── index.js        ← registers all schemas
│   └── package.json
│
├── vite.config.js          ← root Vite config (serves cryark by default)
├── package.json            ← monorepo root dependencies + scripts
├── .env                    ← secrets (NEVER commit)
├── .env.example            ← template showing required vars
└── MAINTENANCE.md          ← this file
```

### The `@shared` alias

Both Vite configs map `@shared` → the `shared/` directory at monorepo root.

```js
// Any file in apps/cryark/src/ or apps/guillen/src/ can write:
import Button from "@shared/components/ui/Button";
import { useCmsQuery } from "@shared/lib/cms";
import "@shared/styles/base.css";
```

Files *inside* `shared/` use normal relative imports (`../../hooks/`, `../ui/`, etc.) — these still work because the directory structure is mirrored.

---

## 3. Running the Project

```bash
# Install dependencies (run once, or after any package.json change)
npm install

# ── Dev servers ────────────────────────────────────────────────
npm run dev              # cryark.net   → http://localhost:5173
npm run dev:guillen      # guillen.studio → http://localhost:5174 (may vary)
npm run studio:dev       # Sanity Studio  → http://localhost:3333

# ── Production builds ──────────────────────────────────────────
npm run build            # builds cryark  → apps/cryark/dist/
npm run build:guillen    # builds guillen → apps/guillen/dist/
npm run studio:build     # builds studio  → studio/dist/

# ── Sanity ─────────────────────────────────────────────────────
npm run studio:deploy    # deploys Studio to sanity.io (hosted)
```

---

## 4. Environment Variables

Create `.env` at the **monorepo root** (next to `vite.config.js`). Copy from `.env.example`.

```env
VITE_SANITY_PROJECT_ID=your_project_id_here
VITE_SANITY_DATASET=production
```

- **Project ID**: find it at https://sanity.io/manage → your project → Settings → API
- **Dataset**: almost always `production` unless you created a staging dataset
- Variables are picked up by `shared/lib/sanity.js` at build time via `import.meta.env.*`
- The root `vite.config.js` has `envDir: __dirname` so Vite finds `.env` at the monorepo root (not inside `apps/cryark/`)
- On the VPS, set these as system environment variables or a `.env` file before running `npm run build`

---

## 5. CMS — Sanity Studio

### Accessing the Studio

- **Local (dev)**: `npm run studio:dev` → http://localhost:3333
- **Hosted (prod)**: deploy once with `npm run studio:deploy`, then access at `your-project.sanity.studio`

### Document Types

| Type | Description | Frontend route |
|---|---|---|
| **Product** | Games, tools, asset packs | `/products/:slug` |
| **Lab Entry** | Research projects, engineering work | `/lab/:slug` |

### Publishing Content

1. Open the Studio
2. Create or edit a document
3. Fill in fields
4. Click **Publish** (top right)
5. **Important**: the `Hide from site` toggle must be **OFF** for the page to appear. It defaults to ON (draft mode).

### Product Fields Reference

| Field | Type | Notes |
|---|---|---|
| Title | string | Display name, also source for slug |
| URL slug | slug | Auto-generated from title. Change before first publish |
| Eyebrow label | string | Small text above hero title, e.g. "Cryark · Games" |
| Subtitle | string | Tagline in the hero |
| Short description | text | Used on cards and meta tags |
| Status | select | `released` / `in_dev` / `research` / `live` / `collab` |
| **Product type** | select | `game` / `dev_tool` / `asset_pack` / `dev_download` |
| Tags | string[] | e.g. "Godot 4", "Blender" — shown as pills |
| Platform badges | object[] | slug + optional custom icon |
| Hero image | image | Full-screen background for the cinematic hero |
| Key art | image | Portrait poster |
| Card thumbnail | image | Shown on listing cards |
| **Page sections** | block[] | The main content — see block types below |
| Built with | object[] | Tool logos shown at bottom of product page |
| CTA buttons | object[] | Hero call-to-action buttons |
| Hide from site | boolean | OFF = visible. Defaults to ON (draft) |

### Lab Entry Fields Reference

| Field | Type | Notes |
|---|---|---|
| Title | string | Bold display title |
| URL slug | slug | Auto-generated |
| Eyebrow | string | e.g. "NU AERO × Cryark" |
| Subtitle | string | Full name below the title |
| Abstract | text | 2–3 sentence description for the hero |
| Collaboration credit | string | e.g. "Collaboration with NU AERO" |
| Status | select | Same options as Product |
| Tags | string[] | Pill labels |
| Stats row | object[] | `{ value, label }` pairs shown in hero |
| **Sidebar navigation** | object[] | Groups + nav items for the DocLayout sidebar |
| **Content sections** | object[] | Body content with sidebar anchors |
| **Page sections** | block[] | Full-width blocks above the doc layout |
| Hide from site | boolean | OFF = visible. Defaults to ON |

### Product Type Values

| Value | Meaning | Sites |
|---|---|---|
| `game` | Playable game | cryark.net, guillen.studio |
| `dev_tool` | Blender plugin, Godot plugin, CLI tool, etc. | cryark.net, guillen.studio |
| `asset_pack` | 3D models, textures, HDRIs for distribution | guillen.studio primary |
| `dev_download` | Pre-built scripts, components, sounds, art that aren't full programs | guillen.studio primary |

---

## 6. Common Content Tasks

### Publish a new product page

1. Studio → Products → New
2. Fill **Title**, click **Generate** on slug
3. Set **Product type** (game / dev_tool / etc.)
4. Set **Status**
5. Upload **Hero image** and **Card thumbnail**
6. Add **Page sections** in order (Feature Spotlights, Video, Pricing, etc.)
7. Turn OFF **Hide from site**
8. Click **Publish**
9. Visit `/products/your-slug` on the live site

### Publish a new lab entry

1. Studio → Lab Entries → New
2. Fill **Title**, **Eyebrow**, **Abstract**
3. Build **Sidebar navigation** (groups with anchor-linked items)
4. Build **Content sections** (section_id must match sidebar anchors)
5. Add **Page sections** if needed (trailers, galleries, etc.)
6. Turn OFF **Hide from site** → **Publish**
7. Visit `/lab/your-slug`

### Add a platform badge icon

Option A — Use a slug Vite already knows:
  - Set Platform slug to `godot`, `blender`, `itch`, or `steam`
  - The icon is auto-loaded from `/icons/{slug}.png`

Option B — Upload a custom icon:
  - Upload an image in the "Custom icon" field on the platform badge
  - This takes priority over the slug lookup

### Update a product's CTA button URLs

Product → CTA buttons → edit label, URL, variant (`solid` / `ghost` / `ghost-bordered`) and whether to show the lava fill animation.

---

## 7. GROQ Query Reference

All queries live in `shared/lib/queries.js`. Import via `shared/lib/cms.js`.

```js
import {
  PRODUCT_BY_SLUG,       // fetch one product (used by DynamicProductPage)
  LAB_ENTRY_BY_SLUG,     // fetch one lab entry (used by DynamicLabPage)
  ALL_PRODUCTS,          // all published products (for listing pages)
  ALL_LAB_ENTRIES,       // all published lab entries
  PRODUCTS_BY_TYPE,      // products filtered by type (pass $product_type)
  RELATED_PRODUCTS,      // 3 products excluding current (pass $slug)
} from "@shared/lib/cms";
```

### Using queries in a component

```jsx
import { useCmsQuery, ALL_PRODUCTS } from "@shared/lib/cms";

function MyComponent() {
  const { data, loading, error } = useCmsQuery(ALL_PRODUCTS);
  if (loading) return <p>Loading…</p>;
  if (error || !data) return <p>Error</p>;
  return data.map(p => <div key={p._id}>{p.title}</div>);
}
```

### Query with parameters

```jsx
// PRODUCTS_BY_TYPE requires a $product_type param
const { data } = useCmsQuery(PRODUCTS_BY_TYPE, { product_type: "game" });

// PRODUCT_BY_SLUG requires a $slug param
const { data } = useCmsQuery(PRODUCT_BY_SLUG, { slug: "the-architect" });
```

### Adding a new query

1. Write the GROQ string in `shared/lib/queries.js`
2. Export it
3. Re-export it from `shared/lib/cms.js`
4. Use it via `useCmsQuery` in any component

### Image URLs from Sanity assets

```js
import { cmsImageUrl } from "@shared/lib/cms";

// In a component:
const url = cmsImageUrl(sanity_image_asset)
  .width(1200)
  .auto("format")   // serves WebP/AVIF to browsers that support it
  .url();

// or use the helper already in DynamicProductPage:
function san_img(asset, width = 1600) {
  if (!asset) return null;
  return cmsImageUrl(asset).width(width).auto("format").url();
}
```

---

## 8. Component Library

All components live in `shared/components/ui/`. Every component has a matching `.css` file.

Import pattern:
```js
import ComponentName from "@shared/components/ui/ComponentName";
```

### Full component list

| Component | Purpose | Key props |
|---|---|---|
| **Button** | CTA button | `label`, `href`, `variant` (solid/ghost/ghost-bordered), `lava` |
| **Card** | Product/lab listing card | `title`, `description`, `tags`, `status`, `thumbnail_url`, `href` |
| **Pill** | Tag chip | `label` |
| **SiteNav** | Top navigation bar | (no props — uses router links) |
| **SiteFooter** | Page footer | `variant` ("cryark" \| "guillen") |
| **SocialIcon** | Brand icon registry | See §10 |
| **CinematicHero** | Full-screen hero with image + CTAs | `image_src`, `title`, `subtitle`, `actions[]` |
| **CinematicBanner** | Wide banner section | `image_src`, `heading`, `body`, `align`, `cta_label`, `cta_href` |
| **FeatureSpotlight** | Two-column feature row | `title`, `description`, `image_src`, `video_src`, `flip`, `actions[]` |
| **LabHero** | Hero for lab pages | `title`, `subtitle`, `abstract`, `status`, `tags`, `stats[]` |
| **ProductInfoBar** | Metadata band below product hero | `status`, `tags`, `platforms[]` |
| **DocLayout** | Sidebar + content grid for lab pages | `sections[]` (sidebar groups) |
| **PortableTextRenderer** | Renders Sanity Portable Text | `content` (raw array from Sanity) |
| **TitleBlock** | Large section heading | `eyebrow`, `heading`, `description`, `align` |
| **FactGrid** | Grid of stat/fact cards | `heading`, `facts[]` ({label, value}) |
| **ContentCards** | Card grid (non-product) | `heading`, `cards[]`, `columns`, `card_height` |
| **ScreenshotGallery** | Horizontally scrollable image strip | `images[]` ({src, alt, caption}), `label` |
| **VideoPlayer** | Click-to-play video section | `video_mp4`, `video_webm`, `poster_src`, `aspect_ratio` |
| **EmbeddedApp** | Click-to-launch iframe | `embed_url`, `poster_src`, `launch_label`, `height` |
| **AssetGrid** | Download card grid | `heading`, `assets[]` (name/file_url/license/etc.) |
| **RoadmapBlock** | Milestone timeline | `eyebrow`, `heading`, `milestones[]` (label/status) |
| **ChangelogBlock** | Version history card grid | `heading`, `entries[]` (version/date/changes[]) |
| **SystemRequirements** | Min/recommended specs table | `minimum{}`, `recommended{}`, `tested_on` |
| **PricingCTA** | Price + purchase links section | `heading`, `price`, `links[]`, `patreon_href` |
| **RelatedProducts** | Auto-fetched "More from Cryark" strip | `current_slug` |
| **ModelViewer** | Interactive 3D model (lazy-loaded) | `src` (GLB/GLTF URL), `poster_src`, `auto_rotate` |
| **PlatformBadge** | Small platform icon + label | `platform` (slug), `src` (override URL) |
| **CodeBlock** | Syntax-highlighted code snippet | `language`, `title`, `code` |
| **BackgroundCanvas** | Animated canvas effect (homepage) | (no props) |
| **Spacer** | Vertical whitespace | `size` (xs/sm/md/lg/xl) |

### Changelog entry format

```js
{
  version: "1.2.0",
  date: "2025-03-15",          // ISO date string
  title: "Optional subtitle",
  changes: [
    { type: "added",    text: "New procedural terrain system" },
    { type: "fixed",    text: "Crash on empty scene load" },
    { type: "changed",  text: "Render pipeline refactored" },
    { type: "breaking", text: "Config file format changed" },
    { type: "removed",  text: "Legacy Python 2 support" },
  ]
}
```

### Roadmap milestone statuses

| Status | Display | Meaning |
|---|---|---|
| `done` | ✓ | Completed |
| `in_progress` | ◎ | Currently being worked on |
| `planned` | ○ | Scheduled, not started |
| `cut` | ✕ | Removed from scope (excluded from progress %) |

---

## 9. Design Tokens & Theming

All CSS custom properties are in `shared/styles/tokens.css`. Every component uses these variables — never hardcoded colours.

```css
:root {
  /* Typography */
  --font-sans:         'Inter', system-ui, sans-serif;
  --font-mono:         'JetBrains Mono', monospace;

  /* Colors */
  --color-bg:          #050508;        /* page background */
  --color-surface:     #0a090e;        /* card/panel backgrounds */
  --color-text:        #e8e6e1;        /* primary text */
  --color-text-dim:    rgba(232,230,225,0.42);   /* secondary text */
  --color-text-faint:  rgba(232,230,225,0.22);   /* metadata / copyright */
  --color-accent:      #c8a97e;        /* dawn gold — the brand colour */
  --color-accent-dim:  rgba(200,169,126,0.18);   /* tinted backgrounds */

  /* Borders */
  --color-border-sub:  rgba(255,255,255,0.06);   /* very subtle */
  --color-border-low:  rgba(255,255,255,0.10);
  --color-border-mid:  rgba(255,255,255,0.18);   /* visible borders */

  /* Spacing */
  --space-xs: 4px;  --space-sm: 8px;  --space-md: 16px;
  --space-lg: 32px; --space-xl: 64px; --space-2xl: 96px;

  /* Radius */
  --radius-sm: 4px;  --radius-md: 8px;  --radius-lg: 12px;
}
```

### Change the accent colour globally

Edit one line in `shared/styles/tokens.css`:
```css
--color-accent: #your-new-colour;
```
Every component that uses `var(--color-accent)` updates instantly.

### Override tokens for guillen.studio

`apps/guillen/src/theme/theme.css` — add overrides there:
```css
:root {
  --color-accent: #8baac8;   /* cool blue instead of gold */
  --color-bg: #03030d;
}
```
No component code changes needed.

---

## 10. Icon System

**File**: `shared/components/ui/SocialIcon.jsx`

This is the single source of truth for all social/platform icons. To change any icon globally, edit that one file.

### Change an existing icon

```js
// In SocialIcon.jsx — swap steam from PNG to SVG:
export function SteamIcon({ size = 20 }) {
  return <SvgIcon size={size} label="Steam"
    path="...svg path from simpleicons.org..."
  />;
}
```

### Add a new platform

1. Add a function in `SocialIcon.jsx`:
```js
export function BlueSkyIcon({ size = 20 }) {
  return <SvgIcon size={size} label="Bluesky"
    path="...path from simpleicons.org..."
  />;
}
```

2. Register it:
```js
export const SOCIAL_ICONS = {
  ...existing entries...
  bluesky: BlueSkyIcon,
};
```

3. Add it to the footer in `SiteFooter.jsx`:
```js
// in the cryark or guillen links array:
{ key: "bluesky", label: "Bluesky", href: "https://bsky.app/...", external: true }
```

### SVG path source

Get brand-accurate, CC0 paths from: **https://simpleicons.org**  
Search for the platform → click the icon → copy the SVG path.

---

## 11. Routing

Routes are defined in `apps/cryark/src/App.jsx`.

```js
const router = createBrowserRouter([
  { path: "/",                     element: <HomePage /> },
  { path: "/showcase",             element: <ShowcasePage /> },
  { path: "/products/the-architect", element: <TheArchitectPage /> },  // static
  { path: "/lab/derg",             element: <DergPage /> },             // static
  { path: "/products/:slug",       element: <DynamicProductPage /> },   // CMS catch-all
  { path: "/lab/:slug",            element: <DynamicLabPage /> },       // CMS catch-all
  { path: "*",                     element: <NotFoundPage /> },         // 404
]);
```

**Static vs. dynamic routes**: declare static routes (hardcoded pages) BEFORE the `:slug` catch-alls. React Router matches in order — the specific path wins.

### Add a new static page

1. Create `apps/cryark/src/pages/MyPage.jsx` and `MyPage.css`
2. Import and add a route in `App.jsx`
3. Add a nav link in `shared/components/ui/SiteNav.jsx` if needed

### Add a new dynamic route pattern

Add a new catch-all in App.jsx before `"*"`:
```js
{ path: "/games/:slug", element: <DynamicGamePage /> },
```
Then create the page that calls `useCmsQuery` with a filtered query.

---

## 12. Adding a New Shared Component

1. **Create the files** in `shared/components/ui/`:
   ```
   MyComponent.jsx
   MyComponent.css
   ```

2. **Structure the JSX** — use `var(--color-*)` tokens, never hardcode colors:
   ```jsx
   import "./MyComponent.css";
   export default function MyComponent({ prop_a, prop_b }) {
     return <div className="my-comp">...</div>;
   }
   ```

3. **Import in your page**:
   ```js
   import MyComponent from "@shared/components/ui/MyComponent";
   ```

4. **If it's a CMS-driven block**, also:
   - Add a schema type in `studio/schemas/blockTypes.js`
   - Register it in `studio/schemas/index.js`
   - Add a render case in `apps/cryark/src/pages/DynamicProductPage.jsx` and/or `DynamicLabPage.jsx`

---

## 13. Adding a New CMS Block Type

Full example — adding a `quoteBlock`:

### Step 1 — Schema (`studio/schemas/blockTypes.js`)

```js
export const quoteBlockType = defineType({
  name:  'quoteBlock',
  title: 'Pull Quote',
  type:  'object',
  fields: [
    defineField({ name: 'quote',      title: 'Quote text',   type: 'text' }),
    defineField({ name: 'attribution', title: 'Attribution', type: 'string' }),
  ],
  preview: { select: { title: 'quote' } },
});
```

### Step 2 — Register (`studio/schemas/index.js`)

```js
import { quoteBlockType } from './blockTypes';

export const schemaTypes = [
  ...existing types...
  quoteBlockType,
];
```

### Step 3 — Add to document schema

In `product.js` or `labEntry.js`, add to the `sections` array:
```js
defineArrayMember({ type: 'quoteBlock' }),
```

### Step 4 — Create the React component

`shared/components/ui/QuoteBlock.jsx` + `QuoteBlock.css`

### Step 5 — Add render case

In `DynamicProductPage.jsx` (and `DynamicLabPage.jsx` if needed), inside `render_section()`:
```js
if (_type === "quoteBlock") {
  return (
    <QuoteBlock
      key={section._key ?? idx}
      quote={section.quote ?? ""}
      attribution={section.attribution ?? null}
    />
  );
}
```

---

## 14. Deployment (VPS)

**Server**: Hostinger KVM4 (4 vCPU, 16 GB RAM, 200 GB NVMe, 16 TB bandwidth/month, 1 Gbps)

### Build output locations

| App | Build command | Output |
|---|---|---|
| cryark.net | `npm run build` | `apps/cryark/dist/` |
| guillen.studio | `npm run build:guillen` | `apps/guillen/dist/` |
| Sanity Studio | `npm run studio:build` | `studio/dist/` |

### Deployment checklist

- [ ] Set `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` on the server before building
- [ ] Run `npm run build` (or build:guillen) on the server or in CI
- [ ] Point Nginx at the `dist/` folder for each domain
- [ ] Enable gzip/brotli compression in Nginx — the JS bundles benefit significantly
- [ ] Add Nginx `try_files $uri /index.html` for React Router to work (SPA routing)
- [ ] Set up SSL (Let's Encrypt via certbot)

### Nginx config skeleton

```nginx
server {
    listen 443 ssl;
    server_name cryark.net www.cryark.net;

    root /var/www/cryark/dist;
    index index.html;

    # SPA fallback — required for React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache built assets (they have hashed filenames)
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Videos — range requests for seek support
    location ~* \.(mp4|webm)$ {
        add_header Accept-Ranges bytes;
        expires 30d;
    }
}
```

### Video hosting

Videos are self-hosted on the VPS. Upload to a `/video/` directory served by Nginx.
Reference in Sanity as a direct URL (e.g. `https://cryark.net/video/the-architect-trailer.mp4`).
The VideoPlayer component accepts `video_mp4` and `video_webm` URL props.

### Sanity Studio deployment

The Studio can be hosted on Sanity's servers (free):
```bash
npm run studio:deploy
# Accessible at: https://your-project-name.sanity.studio
```
Or self-host the `studio/dist/` folder on any static host / your VPS.

---

## 15. Naming Conventions

### Files

- Components: `PascalCase.jsx` + matching `PascalCase.css`
- Hooks: `useCamelCase.js`
- Utilities / lib: `camelCase.js`
- Page components: `PascalCasePage.jsx`

### CSS class names (BEM-ish)

```
block__element
block__element--modifier
```

Examples:
- `.site-footer__motto`
- `.changelog__card`
- `.changelog__card--active`
- `.btn--ghost`

CSS custom properties always start with `--` and are in `tokens.css`:
- `--color-accent`, `--space-lg`, `--radius-md`

### JavaScript

- Variables and function names: `snake_case` (project convention — intentional, different from typical React camelCase)
- React component names: `PascalCase`
- CSS class name strings: `kebab-case`
- Sanity field names: `snake_case`
- GROQ query constants: `SCREAMING_SNAKE_CASE`

### Component props

Props use `snake_case` to match the `snake_case` variable convention:
```jsx
<VideoPlayer video_mp4="/..." poster_src="/..." aspect_ratio="16/9" />
```

---

*Last updated during initial build session — May 2026.*
*Update this file as the site evolves.*
