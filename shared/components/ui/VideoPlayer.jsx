import { useState, useRef } from "react";
import "./VideoPlayer.css";

// ---------------------------------------------------------------------------
// VideoPlayer
//
// Full-width cinematic video section. Shows a poster + play button until the
// user clicks — then swaps in the <video> element and auto-plays. Supports
// both MP4 (H.264) and WebM (VP9) sources for optimal browser compatibility.
//
// Props:
//   eyebrow       string?  — small uppercase label above the video
//   title         string?  — heading above the video
//   video_mp4     string   — URL to .mp4 file (required)
//   video_webm    string?  — URL to .webm file (preferred by Chrome/Firefox)
//   poster_src    string?  — preview image URL (shown before play)
//   caption       string?  — label below the video
//   aspect_ratio  string   — "16/9" | "21/9" | "4/3" (default: "16/9")
// ---------------------------------------------------------------------------

const RATIOS = {
  "16/9": "56.25%",
  "21/9":  "42.86%",
  "4/3":  "75%",
};

export default function VideoPlayer({
  eyebrow      = null,
  title        = null,
  video_mp4    = "",
  video_webm   = null,
  poster_src   = null,
  caption      = null,
  aspect_ratio = "16/9",
}) {
  const [playing, set_playing] = useState(false);
  const video_ref = useRef(null);

  function handle_play() {
    set_playing(true);
    // autoPlay fires, but ensure it via ref after render
    requestAnimationFrame(() => video_ref.current?.play());
  }

  const padding_top = RATIOS[aspect_ratio] ?? RATIOS["16/9"];

  return (
    <div className="video-player">
      {/* ── Optional header ──────────────────────────────────────────────── */}
      {(eyebrow || title) && (
        <div className="video-player__header">
          {eyebrow && <p className="video-player__eyebrow">{eyebrow}</p>}
          {title   && <h2 className="video-player__title">{title}</h2>}
        </div>
      )}

      {/* ── Video container ───────────────────────────────────────────────── */}
      <div className="video-player__frame" style={{ paddingTop: padding_top }}>

        {/* Loaded video — only rendered after click */}
        {playing && (
          <video
            ref={video_ref}
            className="video-player__video"
            controls
            autoPlay
            playsInline
          >
            {video_webm && <source src={video_webm} type="video/webm" />}
            {video_mp4  && <source src={video_mp4}  type="video/mp4"  />}
          </video>
        )}

        {/* Poster overlay — shown until play */}
        {!playing && (
          <div className="video-player__poster" onClick={handle_play}>
            {poster_src && (
              <img
                src={poster_src}
                alt=""
                className="video-player__poster_img"
                draggable="false"
              />
            )}

            {/* Gradient veil over poster */}
            <div className="video-player__poster_veil" />

            {/* Play button */}
            <button
              className="video-player__play_btn"
              aria-label="Play video"
              onClick={handle_play}
            >
              {/* Triangle */}
              <svg
                className="video-player__play_icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* ── Caption ──────────────────────────────────────────────────────── */}
      {caption && <p className="video-player__caption">{caption}</p>}
    </div>
  );
}
