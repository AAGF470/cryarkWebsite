// ---------------------------------------------------------------------------
// AuroraBackground — a fixed, slow-drifting aurora gradient backdrop.
//
// Pairs with the "frosted" recipe + the .frosted glass layer (base.css): it
// gives the frosted-glass panels something colourful to blur. Render it ONCE,
// high in the tree, on a page whose #root is transparent (the .frosted layer
// handles that). Purely decorative — aria-hidden, pointer-events: none.
//
//   <AuroraBackground />                       // default teal / blue / violet
//   <AuroraBackground colors={[a, b, c]} />    // three rgba() strings
//
// Keyframes (aurora-drift) live in shared/styles/frosted.css.
// ---------------------------------------------------------------------------
export default function AuroraBackground({
  colors = ['rgba(0,255,163,0.16)', 'rgba(10,132,255,0.18)', 'rgba(139,123,255,0.14)'],
  className = '',
}) {
  const [a, b, c] = colors
  return (
    <div
      aria-hidden="true"
      className={`aurora-bg${className ? ` ${className}` : ''}`}
      style={{
        position: 'fixed',
        inset: '-20vmax',
        zIndex: 0,
        pointerEvents: 'none',
        background: `radial-gradient(38vmax 38vmax at 18% 12%, ${a}, transparent 60%),
                     radial-gradient(42vmax 42vmax at 85% 20%, ${b}, transparent 62%),
                     radial-gradient(46vmax 46vmax at 60% 95%, ${c}, transparent 60%)`,
        filter: 'saturate(1.15)',
        animation: 'aurora-drift 26s ease-in-out infinite alternate',
      }}
    />
  )
}
