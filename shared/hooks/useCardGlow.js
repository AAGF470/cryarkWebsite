import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// useCardGlow
// Cursor-reactive outline glow + 3D tilt on the card wrapper.
//
// Canvas positioning: top:-4px; left:-4px; width:calc(100%+8px); height:calc(100%+8px)
// Using only top/left (not inset shorthand) avoids the over-constrained
// situation where explicit width conflicts with right:-4px. Resolution is
// derived from wrapper.offsetWidth/Height + CANVAS_PADDING*2 so it always
// matches the CSS layout size exactly.
// ---------------------------------------------------------------------------

const FADE_IN_LERP_SPEED   = 0.24;
const FADE_OUT_LERP_SPEED  = 0.096;
const ALPHA_SNAP_THRESHOLD = 0.004;

const STROKE_MASK_WIDTHS = [24, 15, 8, 4, 1.6];

const BORDER_RADIUS    = 15;
const CANVAS_PADDING   = 4;
const TILT_MAX_DEGREES = 2.8;
const TILT_PERSPECTIVE = 900;

// ---------------------------------------------------------------------------
// Canvas helpers
// ---------------------------------------------------------------------------

function draw_rounded_rect_path(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function build_glow_offscreen(canvas_width, canvas_height, glow_x, glow_y, color_primary, color_secondary) {
  const offscreen        = document.createElement("canvas");
  offscreen.width        = canvas_width;
  offscreen.height       = canvas_height;
  const ctx              = offscreen.getContext("2d");
  const max_dim          = Math.max(canvas_width, canvas_height);
  const [r1, g1, b1]    = color_primary;
  const [r2, g2, b2]    = color_secondary;

  const g_outer = ctx.createRadialGradient(glow_x, glow_y, 0, glow_x, glow_y, max_dim * 0.95);
  g_outer.addColorStop(0.00, `rgba(${r1},${g1},${b1},0.90)`);
  g_outer.addColorStop(0.30, `rgba(${r1},${g1},${b1},0.55)`);
  g_outer.addColorStop(0.65, `rgba(${r2},${g2},${b2},0.20)`);
  g_outer.addColorStop(1.00, `rgba(0,0,0,0)`);
  ctx.fillStyle = g_outer; ctx.fillRect(0, 0, canvas_width, canvas_height);

  const g_mid = ctx.createRadialGradient(glow_x, glow_y, 0, glow_x, glow_y, max_dim * 0.45);
  g_mid.addColorStop(0.00, `rgba(${r1},${g1},${b1},0.95)`);
  g_mid.addColorStop(0.50, `rgba(${r1},${g1},${b1},0.35)`);
  g_mid.addColorStop(1.00, `rgba(0,0,0,0)`);
  ctx.fillStyle = g_mid; ctx.fillRect(0, 0, canvas_width, canvas_height);

  const g_bloom = ctx.createRadialGradient(glow_x, glow_y, 0, glow_x, glow_y, max_dim * 0.50);
  g_bloom.addColorStop(0.00, `rgba(255,255,255,1.0)`);
  g_bloom.addColorStop(0.06, `rgba(255,255,255,0.85)`);
  g_bloom.addColorStop(0.20, `rgba(255,245,215,0.55)`);
  g_bloom.addColorStop(0.42, `rgba(${r1},${g1},${b1},0.30)`);
  g_bloom.addColorStop(0.70, `rgba(${r1},${g1},${b1},0.08)`);
  g_bloom.addColorStop(1.00, `rgba(0,0,0,0)`);
  ctx.fillStyle = g_bloom; ctx.fillRect(0, 0, canvas_width, canvas_height);

  const g_white2 = ctx.createRadialGradient(glow_x, glow_y, 0, glow_x, glow_y, max_dim * 0.28);
  g_white2.addColorStop(0.00, `rgba(255,255,255,0.80)`);
  g_white2.addColorStop(0.15, `rgba(255,252,240,0.40)`);
  g_white2.addColorStop(0.45, `rgba(255,230,180,0.12)`);
  g_white2.addColorStop(1.00, `rgba(0,0,0,0)`);
  ctx.fillStyle = g_white2; ctx.fillRect(0, 0, canvas_width, canvas_height);

  // Clip to stroke band only
  ctx.globalCompositeOperation = "destination-in";
  STROKE_MASK_WIDTHS.forEach((stroke_width) => {
    draw_rounded_rect_path(ctx, CANVAS_PADDING, CANVAS_PADDING,
      canvas_width - CANVAS_PADDING * 2, canvas_height - CANVAS_PADDING * 2, BORDER_RADIUS);
    ctx.strokeStyle = "rgba(255,255,255,1)";
    ctx.lineWidth   = stroke_width;
    ctx.stroke();
  });
  ctx.globalCompositeOperation = "source-over";

  return offscreen;
}

// Resolution must match the CSS layout size: wrapper + CANVAS_PADDING*2 on each axis.
// We read from wrapper.offsetWidth/Height (the containing block for the canvas)
// so JS and CSS are always in sync.
function sync_outline_resolution(outline_canvas, wrapper_element) {
  const w = wrapper_element.offsetWidth  + CANVAS_PADDING * 2;
  const h = wrapper_element.offsetHeight + CANVAS_PADDING * 2;
  if (!w || !h) return false;
  if (outline_canvas.width  !== w) outline_canvas.width  = w;
  if (outline_canvas.height !== h) outline_canvas.height = h;
  return true;
}

function draw_outline_frame(outline_canvas, wrapper_element, cursor_x, cursor_y, alpha, color_primary, color_secondary) {
  if (!sync_outline_resolution(outline_canvas, wrapper_element)) return;

  const cw = outline_canvas.width;
  const ch = outline_canvas.height;
  const card_w = cw - CANVAS_PADDING * 2;
  const card_h = ch - CANVAS_PADDING * 2;

  const ctx = outline_canvas.getContext("2d");
  ctx.clearRect(0, 0, cw, ch);

  // Always-visible dim base stroke
  draw_rounded_rect_path(ctx, CANVAS_PADDING, CANVAS_PADDING, card_w, card_h, BORDER_RADIUS);
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth   = 0.8;
  ctx.stroke();

  if (alpha <= 0.01) return;

  const glow_x = cursor_x !== null ? cursor_x + CANVAS_PADDING : cw / 2;
  const glow_y = cursor_y !== null ? cursor_y + CANVAS_PADDING : ch / 2;

  const offscreen = build_glow_offscreen(cw, ch, glow_x, glow_y, color_primary, color_secondary);
  ctx.globalAlpha = alpha;
  ctx.drawImage(offscreen, 0, 0);
  ctx.globalAlpha = 1.0;
}

function draw_ambient_frame(ambient_canvas, card_element, alpha, color_primary) {
  const w = card_element.offsetWidth;
  const h = card_element.offsetHeight;
  if (!w || !h) return;
  if (ambient_canvas.width  !== w) ambient_canvas.width  = w;
  if (ambient_canvas.height !== h) ambient_canvas.height = h;

  const ctx = ambient_canvas.getContext("2d");
  ctx.clearRect(0, 0, w, h);
  if (alpha <= 0.01) return;

  const [r, g, b] = color_primary;
  ctx.globalAlpha = alpha * 0.5;
  const gr = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.65);
  gr.addColorStop(0, `rgba(${r},${g},${b},0.05)`);
  gr.addColorStop(1, `rgba(0,0,0,0)`);
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 1.0;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useCardGlow({ color_primary = [200, 169, 126], color_secondary = [140, 110, 65] } = {}) {
  const wrapper_ref        = useRef(null);
  const card_ref           = useRef(null);
  const outline_canvas_ref = useRef(null);
  const ambient_canvas_ref = useRef(null);

  const state_ref = useRef({
    current_alpha: 0,
    target_alpha:  0,
    cursor_x:      null,
    cursor_y:      null,
    fade_frame:    null,
    draw_frame:    null,
  });

  useEffect(() => {
    const wrapper  = wrapper_ref.current;
    const card     = card_ref.current;
    const outline  = outline_canvas_ref.current;
    const ambient  = ambient_canvas_ref.current;
    if (!wrapper || !card || !outline || !ambient) return;

    const state = state_ref.current;

    function redraw_outline() {
      draw_outline_frame(outline, wrapper, state.cursor_x, state.cursor_y, state.current_alpha, color_primary, color_secondary);
    }

    // ResizeObserver keeps canvas resolution in sync when card height changes
    const ro = new ResizeObserver(redraw_outline);
    ro.observe(wrapper);
    redraw_outline(); // initial draw

    function run_fade_tick() {
      const delta      = state.target_alpha - state.current_alpha;
      const lerp_speed = delta > 0 ? FADE_IN_LERP_SPEED : FADE_OUT_LERP_SPEED;
      state.current_alpha += delta * lerp_speed * 3;

      if (Math.abs(state.current_alpha - state.target_alpha) < ALPHA_SNAP_THRESHOLD) {
        state.current_alpha = state.target_alpha;
      }

      redraw_outline();
      draw_ambient_frame(ambient, card, state.current_alpha, color_primary);

      const still_running = Math.abs(state.current_alpha - state.target_alpha) > ALPHA_SNAP_THRESHOLD;
      state.fade_frame = still_running ? requestAnimationFrame(run_fade_tick) : null;
    }

    function start_fade() {
      if (state.fade_frame) cancelAnimationFrame(state.fade_frame);
      state.fade_frame = requestAnimationFrame(run_fade_tick);
    }

    function on_enter() {
      state.target_alpha = 1;
      start_fade();
    }

    function on_move(e) {
      const rect = card.getBoundingClientRect();
      state.cursor_x = e.clientX - rect.left;
      state.cursor_y = e.clientY - rect.top;

      // Tilt the wrapper so outline canvas and surface move as one unit
      const nx = (state.cursor_x - rect.width  / 2) / (rect.width  / 2);
      const ny = (state.cursor_y - rect.height / 2) / (rect.height / 2);
      wrapper.style.transform = `perspective(${TILT_PERSPECTIVE}px) rotateX(${-ny * TILT_MAX_DEGREES}deg) rotateY(${nx * TILT_MAX_DEGREES}deg) translateZ(4px)`;

      if (state.draw_frame) cancelAnimationFrame(state.draw_frame);
      state.draw_frame = requestAnimationFrame(redraw_outline);
    }

    function on_leave() {
      wrapper.style.transform = `perspective(${TILT_PERSPECTIVE}px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
      state.target_alpha = 0;
      start_fade();
    }

    wrapper.addEventListener("mouseenter",  on_enter);
    wrapper.addEventListener("mousemove",   on_move);
    wrapper.addEventListener("mouseleave",  on_leave);

    return () => {
      wrapper.removeEventListener("mouseenter",  on_enter);
      wrapper.removeEventListener("mousemove",   on_move);
      wrapper.removeEventListener("mouseleave",  on_leave);
      ro.disconnect();
      if (state.fade_frame) cancelAnimationFrame(state.fade_frame);
      if (state.draw_frame) cancelAnimationFrame(state.draw_frame);
    };
  }, [color_primary, color_secondary]);

  return { wrapper_ref, card_ref, outline_canvas_ref, ambient_canvas_ref };
}
