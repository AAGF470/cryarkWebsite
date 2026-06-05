import "./PageLoader.css";

// ---------------------------------------------------------------------------
// PageLoader
//
// Full-screen loading overlay shown on first mount.
// Fades out after `delay_ms` (default 420ms).
//
// Props:
//   delay_ms   number   — how long the overlay is fully visible before fading
// ---------------------------------------------------------------------------

export default function PageLoader({ visible = true }) {
  return (
    <div className={`page-loader${visible ? "" : " page-loader--hidden"}`} aria-hidden="true">
      <span className="page-loader__text">Loading</span>
    </div>
  );
}
