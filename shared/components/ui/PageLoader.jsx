import "./PageLoader.css";

// ---------------------------------------------------------------------------
// PageLoader
//
// Full-screen loading overlay shown on first mount.
// The parent toggles `visible` off when ready; the overlay fades out via CSS.
//
// Props:
//   visible   boolean   — true keeps the overlay shown; false fades it out (default: true)
// ---------------------------------------------------------------------------

export default function PageLoader({ visible = true }) {
  return (
    <div
      className={`page-loader${visible ? "" : " page-loader--hidden"}`}
      role="status"
      aria-live="polite"
      aria-hidden={visible ? undefined : "true"}
    >
      <span className="page-loader__text">Loading</span>
    </div>
  );
}
