// ---------------------------------------------------------------------------
// LogoMarquee — an auto-scrolling row of logo chips (placeholder for real
// partner/company logos). Duplicates the list once for a seamless loop.
// ---------------------------------------------------------------------------

export default function LogoMarquee({ items = [], reverse = false, duration = 42 }) {
  const loop = [...items, ...items]
  return (
    <div className={`nsl-marquee${reverse ? ' nsl-marquee--rev' : ''}`}>
      <div className="nsl-marquee__track" style={{ '--marquee-dur': `${duration}s` }}>
        {loop.map((name, i) => (
          <span className="nsl-chip" key={`${name}-${i}`}>{name}</span>
        ))}
      </div>
    </div>
  )
}
