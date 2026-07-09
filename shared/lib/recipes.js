// ---------------------------------------------------------------------------
// Style recipes — named art directions for the component system.
//
// A recipe fixes everything that makes a site read as designed-on-purpose:
// the display face, the neutral palette, rhythm (spacing/width), corner
// language, shadow personality, and which structural expressions the sections
// default to. The CLIENT supplies exactly one thing: an accent color.
//
//   recipe + accent  →  a coherent identity that isn't anyone's default.
//
// This is the guardrail for AI-assisted assembly: instead of choosing from
// every axis (and converging on generic defaults), the author picks a recipe.
// Taste is encoded once, here.
//
// API:
//   RECIPES                        — the catalog (id → definition)
//   recipeVars(id, accent)         — pure: { name, blurb, vars, fontUrl,
//                                    expressions, nav }
//   applyRecipe(id, accent, root?) — DOM: sets vars on :root (or a node),
//                                    injects the recipe's font stylesheet,
//                                    returns { expressions, nav }.
//                                    `nav` is the SiteNav preset the recipe
//                                    biases toward ('bar'|'center'|'minimal'|'split').
// ---------------------------------------------------------------------------

const luminance = hex => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex?.trim() ?? '')
  if (!m) return 0
  const n = parseInt(m[1], 16)
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255))
}

const SHADOWS = {
  flat: {
    '--shadow-sm': '0 1px 2px rgba(0,0,0,0.04)',
    '--shadow-md': '0 1px 3px rgba(0,0,0,0.05)',
    '--shadow-lg': '0 2px 10px rgba(0,0,0,0.06)',
    '--shadow-modal': '0 10px 32px rgba(0,0,0,0.14)',
  },
  soft: ink => ({
    '--shadow-sm': `0 1px 2px color-mix(in srgb, ${ink} 5%, transparent)`,
    '--shadow-md': `0 1px 4px color-mix(in srgb, ${ink} 5%, transparent), 0 10px 28px color-mix(in srgb, ${ink} 6%, transparent)`,
    '--shadow-lg': `0 4px 22px color-mix(in srgb, ${ink} 10%, transparent)`,
    '--shadow-modal': `0 8px 44px color-mix(in srgb, ${ink} 16%, transparent)`,
  }),
  dramatic: {
    '--shadow-sm': '0 2px 8px rgba(0,0,0,0.45)',
    '--shadow-md': '0 6px 24px rgba(0,0,0,0.5)',
    '--shadow-lg': '0 12px 48px rgba(0,0,0,0.55)',
    '--shadow-modal': '0 24px 80px rgba(0,0,0,0.7)',
  },
}

export const RECIPES = {
  'editorial-paper': {
    name: 'Editorial Paper',
    blurb: 'Warm paper, serif display, printed-contract calm. For businesses selling trust.',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap',
    display: { family: "'Fraunces', Georgia, serif", weight: 600, tracking: '-0.015em' },
    dark: false,
    palette: {
      bg: '#fbf8f2', surface: '#f3eee3', surfaceHigh: '#ffffff',
      text: '#29241c', textSub: '#6e675c', textDim: '#999181', textFaint: '#b5ad9e',
      borderSub: '#efe9dd', borderLow: '#e5ddce', borderMid: '#cfc5b2',
    },
    radius: { sm: '4px', md: '8px', lg: '12px', xl: '16px', xxl: '20px' },
    rhythm: { sectionSpace: '104px', containerMax: '1200px' },
    shadows: 'soft',
    expressions: { hero: 'editorial', featureGrid: 'list' },
    nav: 'bar',
  },

  'bold-trade': {
    name: 'Bold Trade',
    blurb: 'High contrast, poster type, sharp corners. For contractors and crews who want presence.',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap',
    display: { family: "'Archivo Black', Impact, sans-serif", weight: 400, tracking: '-0.01em' },
    dark: false,
    palette: {
      bg: '#ffffff', surface: '#f4f3f0', surfaceHigh: '#ffffff',
      text: '#141311', textSub: '#55534e', textDim: '#8b8880', textFaint: '#b5b2aa',
      borderSub: '#eae8e3', borderLow: '#d9d6cf', borderMid: '#b9b5ac',
    },
    radius: { sm: '2px', md: '4px', lg: '6px', xl: '8px', xxl: '10px' },
    rhythm: { sectionSpace: '88px', containerMax: '1160px' },
    shadows: 'flat',
    expressions: { hero: 'statement', featureGrid: 'columns' },
    nav: 'split',
  },

  'dark-cinematic': {
    name: 'Dark Cinematic',
    blurb: 'Near-black canvas, glass panels, dramatic depth. For studios and products with mood.',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap',
    display: { family: "'Space Grotesk', system-ui, sans-serif", weight: 600, tracking: '-0.02em' },
    dark: true,
    palette: {
      bg: '#0a0a10', surface: 'rgba(255,255,255,0.03)', surfaceHigh: 'rgba(255,255,255,0.055)',
      text: '#ecebe7', textSub: 'rgba(236,235,231,0.60)', textDim: 'rgba(236,235,231,0.42)', textFaint: 'rgba(236,235,231,0.24)',
      borderSub: 'rgba(255,255,255,0.07)', borderLow: 'rgba(255,255,255,0.11)', borderMid: 'rgba(255,255,255,0.20)',
    },
    radius: { sm: '6px', md: '10px', lg: '14px', xl: '18px', xxl: '22px' },
    rhythm: { sectionSpace: '112px', containerMax: '1240px' },
    shadows: 'dramatic',
    expressions: { hero: 'statement', featureGrid: 'cards' },
    nav: 'minimal',
  },

  'frosted': {
    name: 'Frosted Glass',
    blurb: 'Aurora-lit near-black with true frosted-glass panels. Depth + motion for products and studios. Pair with <AuroraBackground/> and add class="frosted" to <body>.',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap',
    display: { family: "'Space Grotesk', 'Inter', system-ui, sans-serif", weight: 700, tracking: '-0.02em' },
    dark: true,
    palette: {
      bg: '#06070d', surface: 'rgba(255,255,255,0.045)', surfaceHigh: 'rgba(255,255,255,0.07)',
      text: '#f4f6fb', textSub: 'rgba(244,246,251,0.62)', textDim: 'rgba(244,246,251,0.40)', textFaint: 'rgba(244,246,251,0.24)',
      borderSub: 'rgba(255,255,255,0.055)', borderLow: 'rgba(255,255,255,0.09)', borderMid: 'rgba(255,255,255,0.20)',
    },
    radius: { sm: '8px', md: '12px', lg: '16px', xl: '20px', xxl: '24px' },
    rhythm: { sectionSpace: '112px', containerMax: '1240px' },
    shadows: 'dramatic',
    expressions: { hero: 'statement', featureGrid: 'cards' },
    nav: 'minimal',
    // Consumed by the .frosted glass layer in base.css.
    extras: {
      '--glass-blur': '22px',
      '--font-body': "'Inter', system-ui, -apple-system, sans-serif",
      '--font-mono': "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
    },
  },

  'coastal-light': {
    name: 'Coastal Light',
    blurb: 'Airy, cool, elegant serif, rounded and soft. For salons, boutiques, and studios.',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap',
    display: { family: "'Cormorant Garamond', Georgia, serif", weight: 600, tracking: '0' },
    dark: false,
    palette: {
      bg: '#fafcfc', surface: '#eff4f4', surfaceHigh: '#ffffff',
      text: '#243038', textSub: '#5c6b74', textDim: '#90a0a8', textFaint: '#b9c5cb',
      borderSub: '#e3ebec', borderLow: '#d3dfe1', borderMid: '#b3c4c8',
    },
    radius: { sm: '8px', md: '14px', lg: '18px', xl: '24px', xxl: '28px' },
    rhythm: { sectionSpace: '116px', containerMax: '1180px' },
    shadows: 'soft',
    expressions: { hero: 'classic', featureGrid: 'columns' },
    nav: 'center',
  },

  'workshop': {
    name: 'Workshop',
    blurb: 'Mono display, ruled lines, flat and precise. For makers, engineers, and tinkerers.',
    fontUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&display=swap',
    display: { family: "'IBM Plex Mono', monospace", weight: 600, tracking: '-0.01em' },
    dark: false,
    palette: {
      bg: '#f7f6f3', surface: '#edece7', surfaceHigh: '#ffffff',
      text: '#21201d', textSub: '#605e58', textDim: '#97948c', textFaint: '#b9b6ae',
      borderSub: '#e6e4de', borderLow: '#d8d5cd', borderMid: '#b8b5ac',
    },
    radius: { sm: '2px', md: '3px', lg: '4px', xl: '6px', xxl: '8px' },
    rhythm: { sectionSpace: '92px', containerMax: '1140px' },
    shadows: 'flat',
    expressions: { hero: 'editorial', featureGrid: 'list' },
    nav: 'bar',
  },

  'dark-pastel': {
    name: 'Dark Pastel',
    blurb: 'Soft color on deep ink — a workshop after dark. For personal studios and dev journals.',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;600;700&display=swap',
    display: { family: "'Bricolage Grotesque', system-ui, sans-serif", weight: 600, tracking: '-0.01em' },
    dark: true,
    palette: {
      bg: '#101017', surface: 'rgba(185,174,227,0.05)', surfaceHigh: 'rgba(185,174,227,0.09)',
      text: '#f0eee9', textSub: 'rgba(240,238,233,0.72)', textDim: 'rgba(240,238,233,0.52)', textFaint: 'rgba(240,238,233,0.30)',
      borderSub: 'rgba(185,174,227,0.10)', borderLow: 'rgba(185,174,227,0.16)', borderMid: 'rgba(185,174,227,0.28)',
    },
    radius: { sm: '6px', md: '10px', lg: '14px', xl: '18px', xxl: '22px' },
    rhythm: { sectionSpace: '108px', containerMax: '1320px' },
    shadows: 'dramatic',
    expressions: { hero: 'statement', featureGrid: 'list' },
    nav: 'bar',
    // Extra CSS vars merged verbatim into the recipe output — the pastel set.
    extras: {
      '--pastel-mint':     '#a3d9c3',
      '--pastel-lavender': '#b9aee3',
      '--pastel-sky':      '#9cc3de',
      '--pastel-rose':     '#dba8b8',
      '--pastel-peach':    '#e6c39e',
    },
  },
}

export function recipeVars(id, accent = '#2c4a6e') {
  const r = RECIPES[id]
  if (!r) throw new Error(`Unknown recipe "${id}". Options: ${Object.keys(RECIPES).join(', ')}`)
  const p = r.palette
  const mix = (c, pct) => `color-mix(in srgb, ${c} ${pct}%, transparent)`
  // Text on the accent color: a dark ink if the accent is light, warm white if
  // dark. Light recipes can reuse their body ink; dark recipes need a dedicated
  // dark ink (their p.text is near-white and would fail contrast on the accent).
  const onAccent = luminance(accent) > 155 ? (r.dark ? '#17130d' : p.text) : '#fdfcf9'
  const darker = `color-mix(in srgb, ${accent} 84%, black)`
  const shadows = r.shadows === 'soft' ? SHADOWS.soft(p.text) : SHADOWS[r.shadows]

  const vars = {
    // type
    '--font-display': r.display.family,
    '--font-display-weight': String(r.display.weight),
    '--font-display-tracking': r.display.tracking,
    // neutrals
    '--color-bg': p.bg, '--color-surface': p.surface, '--color-surface-high': p.surfaceHigh,
    '--color-text': p.text, '--color-text-sub': p.textSub,
    '--color-text-dim': p.textDim, '--color-text-faint': p.textFaint,
    '--color-border-sub': p.borderSub, '--color-border-low': p.borderLow, '--color-border-mid': p.borderMid,
    // accent family
    '--color-accent': accent,
    '--color-accent-sub': mix(accent, 9),
    '--color-accent-dim': mix(accent, 18),
    '--color-on-accent': onAccent,
    '--color-on-accent-sub': mix(onAccent, 75),
    // rhythm + corners + depth
    '--section-space': r.rhythm.sectionSpace,
    '--container-max': r.rhythm.containerMax,
    '--radius-sm': r.radius.sm, '--radius-md': r.radius.md, '--radius-lg': r.radius.lg,
    '--radius-xl': r.radius.xl, '--radius-2xl': r.radius.xxl,
    ...shadows,
    // buttons
    '--btn-solid-bg': accent, '--btn-solid-text': onAccent, '--btn-solid-border': accent,
    '--btn-solid-hover-bg': darker, '--btn-solid-hover-text': onAccent, '--btn-solid-hover-border': darker,
    '--btn-fill': darker,
    '--btn-glow-tight': mix(accent, 35), '--btn-glow-wide': mix(accent, 14),
    '--btn-ghost-text': accent, '--btn-ghost-color': darker,
    '--btn-ghost-border': p.borderMid, '--btn-ghost-border-hover': accent,
    '--btn-ghost-hover-bg': mix(accent, 6), '--btn-ghost-glow': mix(accent, 14),
    // nav (derived from the same primitives)
    '--nav-bg': mix(p.bg, 97), '--nav-bg-open': mix(p.bg, 99), '--nav-mobile-bg': mix(p.bg, 99),
    '--nav-border': p.borderSub, '--nav-backdrop': mix(p.text, 20),
    '--nav-glider-border': mix(accent, 25), '--nav-glider-shadow': `0 2px 12px ${mix(accent, 6)}`,
    '--nav-logo-color': mix(p.text, 70), '--nav-logo-hover': p.text, '--nav-logo-accent': accent,
    '--nav-link-rest': mix(p.text, 52), '--nav-link-hover': p.text, '--nav-link-active': p.text,
    '--nav-link-hover-bg': mix(p.text, 4),
    '--nav-cta-color': accent, '--nav-cta-hover-color': onAccent,
    '--nav-cta-border': accent, '--nav-cta-hover-border': accent, '--nav-cta-hover-bg': accent,
    '--nav-hamburger-bar': mix(p.text, 60), '--nav-hamburger-hover-bg': mix(p.text, 4),
    '--nav-mobile-link': mix(p.text, 55), '--nav-mobile-link-hover': p.text, '--nav-mobile-link-active': p.text,
    '--nav-mobile-link-hover-bg': mix(p.text, 3), '--nav-mobile-link-active-bg': mix(accent, 7),
    '--nav-mobile-top-border': p.borderSub,
    '--nav-mobile-cta-color': accent, '--nav-mobile-cta-hover': onAccent,
    '--nav-mobile-cta-border': mix(accent, 30), '--nav-mobile-cta-hover-border': accent, '--nav-mobile-cta-hover-bg': accent,
    '--nav-mobile-strip-bg': mix(p.bg, 92), '--nav-mobile-strip-border': p.borderSub,
    // recipe-specific extra vars (e.g. dark-pastel's pastel set)
    ...(r.extras || {}),
  }

  return { id, name: r.name, blurb: r.blurb, dark: r.dark, vars, fontUrl: r.fontUrl, expressions: r.expressions, nav: r.nav }
}

export function applyRecipe(id, accent, root = document.documentElement) {
  const { vars, fontUrl, expressions, nav } = recipeVars(id, accent)
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v)
  loadRecipeFont(fontUrl)
  return { expressions, nav }
}

// Inject (or swap) the recipe's font stylesheet. Deduped by id.
export function loadRecipeFont(fontUrl, docId = 'ui-recipe-font') {
  if (typeof document === 'undefined' || !fontUrl) return
  let link = document.getElementById(docId)
  if (link?.href === fontUrl) return
  if (!link) {
    link = document.createElement('link')
    link.id = docId
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
  link.href = fontUrl
}
