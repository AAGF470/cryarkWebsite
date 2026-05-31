import { useEffect, useRef, useState } from "react";
import "./ModelViewer.css";

// Registers the <model-viewer> custom element globally (side-effect import).
import "@google/model-viewer";

// ---------------------------------------------------------------------------
// ModelViewer
//
// Wraps Google's <model-viewer> web component in a styled shell that matches
// the site's dark cinematic aesthetic.
//
// Props:
//   src          string   — URL to .glb file (required)
//   poster_src   string?  — preview image shown while model loads
//   alt          string?  — accessibility description
//   caption      string?  — optional label below the viewer
//   auto_rotate  bool     — spin when idle (default: true)
//   height       number   — canvas height in px (default: 520)
//   bg_style     string   — "dark" | "neutral" | "transparent" (default: "dark")
//   enable_ar    bool     — AR mode on mobile (default: false)
// ---------------------------------------------------------------------------

export default function ModelViewer({
  src,
  poster_src   = null,
  alt          = "3D model",
  caption      = null,
  auto_rotate  = true,
  height       = 520,
  bg_style     = "dark",
  enable_ar    = false,
}) {
  const [status, set_status] = useState("loading"); // loading | ready | error
  const viewer_ref = useRef(null);

  // Reset on src change
  useEffect(() => { set_status("loading"); }, [src]);

  // Attach load / error listeners to the custom element
  useEffect(() => {
    const el = viewer_ref.current;
    if (!el) return;

    const on_load  = () => set_status("ready");
    const on_error = () => set_status("error");

    el.addEventListener("load",  on_load);
    el.addEventListener("error", on_error);
    return () => {
      el.removeEventListener("load",  on_load);
      el.removeEventListener("error", on_error);
    };
  }, [src]);

  // Only show our skeleton when there's no poster image
  // (model-viewer shows the poster itself while loading)
  const show_skeleton = status === "loading" && !poster_src;

  const cls = [
    "model-viewer",
    `model-viewer--${bg_style}`,
    status === "ready" ? "model-viewer--ready" : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={cls}
      style={{ "--mv-h": `${height}px` }}
    >
      {/* ── 3D canvas ───────────────────────────────────────────────────── */}
      <model-viewer
        ref={viewer_ref}
        src={src}
        alt={alt}
        {...(poster_src  ? { poster: poster_src }                              : {})}
        {...(auto_rotate ? { "auto-rotate": "" }                               : {})}
        {...(enable_ar   ? { ar: "", "ar-modes": "webxr scene-viewer quick-look" } : {})}
        camera-controls
        shadow-intensity="1"
        environment-image="neutral"
        loading="lazy"
        reveal="auto"
        style={{ width: "100%", height: "var(--mv-h, 520px)", display: "block" }}
      />

      {/* ── Loading skeleton (no poster) ─────────────────────────────────── */}
      {show_skeleton && (
        <div className="model-viewer__skeleton" aria-hidden="true">
          <span className="model-viewer__spinner" />
          <span className="model-viewer__loading_label">Loading model…</span>
        </div>
      )}

      {/* ── Error state ──────────────────────────────────────────────────── */}
      {status === "error" && (
        <div className="model-viewer__error" role="alert">
          <span className="model-viewer__error_icon">⚠</span>
          <span>Model unavailable</span>
        </div>
      )}

      {/* ── Caption ──────────────────────────────────────────────────────── */}
      {caption && (
        <p className="model-viewer__caption">{caption}</p>
      )}
    </div>
  );
}
