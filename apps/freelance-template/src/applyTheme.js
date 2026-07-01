// Derive a full accent palette + button tokens from ONE brand color, then set
// them as CSS variables on :root. This is what lets a freelance client pick a
// single color and get a coherent, on-brand site — no CSS editing.
export function applyTheme(accentColor) {
  const mix = pct => `color-mix(in srgb, ${accentColor} ${pct}%, transparent)`
  const darker = `color-mix(in srgb, ${accentColor} 84%, black)`
  const vars = {
    '--color-accent':        accentColor,
    '--color-accent-sub':    mix(9),
    '--color-accent-dim':    mix(20),
    '--color-on-accent':     '#ffffff',
    '--color-on-accent-sub': 'rgba(255,255,255,0.78)',

    '--btn-solid-bg':           accentColor,
    '--btn-solid-text':         '#ffffff',
    '--btn-solid-border':       accentColor,
    '--btn-solid-hover-bg':     darker,
    '--btn-solid-hover-text':   '#ffffff',
    '--btn-solid-hover-border': darker,
    '--btn-glow-tight':         mix(35),
    '--btn-glow-wide':          mix(14),
    '--btn-ghost-text':         'var(--color-text)',
    '--btn-ghost-color':        accentColor,
    '--btn-ghost-border':       'var(--color-border-mid)',
    '--btn-ghost-border-hover': accentColor,
    '--btn-ghost-hover-bg':     mix(6),
    '--btn-ghost-glow':         mix(14),
  }
  const root = document.documentElement
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v)
}
