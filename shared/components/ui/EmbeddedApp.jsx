import { useState } from "react";
import "./EmbeddedApp.css";

// ---------------------------------------------------------------------------
// EmbeddedApp
//
// Click-to-activate iframe container for interactive demos: Godot HTML5 exports,
// Unity WebGL builds, Three.js simulations, custom web tools.
//
// The iframe is NOT loaded until the user clicks Launch — preventing large
// WebGL payloads from auto-downloading on page load.
//
// Props:
//   title         string   — name of the application
//   description   string?  — short description shown in the overlay
//   embed_url     string   — URL to load in the iframe
//   poster_src    string?  — preview image shown before launch
//   launch_label  string   — button label (default: "Launch")
//   warning       string?  — small disclaimer, e.g. "Requires WebGL · ~45 MB"
//   height        number   — iframe height in px (default: 620)
// ---------------------------------------------------------------------------

export default function EmbeddedApp({
  title        = "Interactive Demo",
  description  = null,
  embed_url    = "",
  poster_src   = null,
  launch_label = "Launch",
  warning      = null,
  height       = 620,
}) {
  const [launched, set_launched]   = useState(false);
  const [loaded,   set_loaded]     = useState(false);

  function handle_launch() {
    set_launched(true);
  }

  return (
    <div className="embedded-app">
      {/* ── Section label ────────────────────────────────────────────────── */}
      <div className="embedded-app__header">
        <p className="embedded-app__eyebrow">Interactive</p>
        <h2 className="embedded-app__title">{title}</h2>
        {description && (
          <p className="embedded-app__desc">{description}</p>
        )}
      </div>

      {/* ── Frame ────────────────────────────────────────────────────────── */}
      <div
        className={[
          "embedded-app__frame",
          loaded   ? "embedded-app__frame--loaded"   : "",
          launched ? "embedded-app__frame--launched" : "",
        ].filter(Boolean).join(" ")}
        style={{ height }}
      >
        {/* Iframe — src only set after launch */}
        {launched && (
          <iframe
            className="embedded-app__iframe"
            src={embed_url}
            title={title}
            allow="fullscreen; autoplay; xr-spatial-tracking"
            onLoad={() => set_loaded(true)}
          />
        )}

        {/* Loading overlay shown between launch click and iframe onLoad */}
        {launched && !loaded && (
          <div className="embedded-app__loading" aria-hidden="true">
            <span className="embedded-app__spinner" />
            <span className="embedded-app__loading_label">Loading…</span>
          </div>
        )}

        {/* Pre-launch overlay */}
        {!launched && (
          <div className="embedded-app__overlay">
            {/* Poster */}
            {poster_src && (
              <img
                src={poster_src}
                alt=""
                className="embedded-app__poster"
                draggable="false"
              />
            )}
            <div className="embedded-app__overlay_veil" />

            {/* Launch panel */}
            <div className="embedded-app__launch_panel">
              <button
                className="embedded-app__launch_btn"
                onClick={handle_launch}
                aria-label={`Launch ${title}`}
              >
                <span className="embedded-app__launch_icon" aria-hidden="true">▶</span>
                {launch_label}
              </button>
              {warning && (
                <p className="embedded-app__warning">{warning}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
