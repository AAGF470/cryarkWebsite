import { useState, useEffect, useCallback } from "react";
import "./ScreenshotGallery.css";

// ---------------------------------------------------------------------------
// ScreenshotGallery
//
// Horizontally scrollable thumbnail strip with a click-to-open lightbox.
// Keyboard: Escape closes, ← / → navigates.
//
// Props:
//   images   array?  — [{ src, alt?, caption? }]. Renders placeholders if empty.
//   label    string? — optional heading above the strip
// ---------------------------------------------------------------------------

export default function ScreenshotGallery({ images = [], label = null }) {
  const [active, set_active] = useState(null);
  const is_open = active !== null;
  const count   = images.length;

  const close = useCallback(() => set_active(null), []);
  const prev  = useCallback(() => set_active(i => (i - 1 + count) % count), [count]);
  const next  = useCallback(() => set_active(i => (i + 1) % count), [count]);

  useEffect(() => {
    if (!is_open) return;
    function on_key(e) {
      if (e.key === "Escape")     close();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", on_key);
    return () => window.removeEventListener("keydown", on_key);
  }, [is_open, close, prev, next]);

  useEffect(() => {
    document.body.style.overflow = is_open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [is_open]);

  const placeholders = Array.from({ length: 4 });

  return (
    <div className="screenshot-gallery">
      {label && <div className="screenshot-gallery__label">{label}</div>}

      {/* Scroll strip */}
      <div className="screenshot-gallery__strip">
        {count > 0 ? (
          images.map((img, i) => (
            <button
              key={i}
              className="screenshot-gallery__thumb"
              onClick={() => set_active(i)}
              aria-label={`Open screenshot ${i + 1}`}
            >
              <img src={img.src} alt={img.alt ?? `Screenshot ${i + 1}`} />
            </button>
          ))
        ) : (
          placeholders.map((_, i) => (
            <div key={i} className="screenshot-gallery__thumb screenshot-gallery__thumb--placeholder">
              <span className="screenshot-gallery__placeholder_label">screenshot {i + 1}</span>
            </div>
          ))
        )}
      </div>

      {/* Lightbox */}
      {is_open && (
        <div
          className="screenshot-gallery__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Screenshot viewer"
          onClick={close}
        >
          {/* Close */}
          <button
            className="screenshot-gallery__lb_close"
            onClick={close}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Prev */}
          {count > 1 && (
            <button
              className="screenshot-gallery__lb_arrow screenshot-gallery__lb_arrow--prev"
              onClick={e => { e.stopPropagation(); prev(); }}
              aria-label="Previous screenshot"
            >
              ←
            </button>
          )}

          {/* Image */}
          <div
            className="screenshot-gallery__lb_img_wrap"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={images[active].src}
              alt={images[active].alt ?? `Screenshot ${active + 1}`}
              className="screenshot-gallery__lb_img"
            />
            {images[active].caption && (
              <p className="screenshot-gallery__lb_caption">
                {images[active].caption}
              </p>
            )}
          </div>

          {/* Next */}
          {count > 1 && (
            <button
              className="screenshot-gallery__lb_arrow screenshot-gallery__lb_arrow--next"
              onClick={e => { e.stopPropagation(); next(); }}
              aria-label="Next screenshot"
            >
              →
            </button>
          )}

          {/* Counter */}
          {count > 1 && (
            <div className="screenshot-gallery__lb_counter" aria-live="polite">
              {active + 1} / {count}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
