import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// usePillGlow
//
// Time-based heat-up effect for pill elements.
// Models metal heating under a torch — warms from a dim cold glow
// through the theme color to near-white overexposure, then cools on leave.
//
// No cursor tracking — heat radiates from the pill center uniformly.
// White overexposure uses an annular gradient (non-zero inner radius)
// so there is no visible center dot at any heat level.
//
// Heat stages (eased):
//   0.00 – 0.38 : cold glow  — dim secondary/cold color, barely visible
//   0.22 – 0.70 : warming    — primary color floods in
//   0.58 – 1.00 : hot        — primary + white overexposure wash
//
// Text color is set directly on the pill element at each heat level
// so the label stays readable against bright fills.
// ---------------------------------------------------------------------------

const HEAT_UP_MS     = 420;   // ms cold → fully hot
const COOL_DOWN_MS   = 900;   // ms hot → cold
const SNAP_THRESHOLD = 0.005;
const DELTA_CAP_MS   = 64;    // prevents jump after tab switch

function ease_out(t) { return 1 - Math.pow(1 - t, 2.2); }

// ---------------------------------------------------------------------------
// Canvas drawing
// ---------------------------------------------------------------------------

function draw_heat_frame(canvas_element, pill_element, heat_value, color_primary, color_secondary, color_cold) {
  const pill_width  = pill_element.offsetWidth;
  const pill_height = pill_element.offsetHeight;
  if (!pill_width || !pill_height) return;

  if (canvas_element.width  !== pill_width)  canvas_element.width  = pill_width;
  if (canvas_element.height !== pill_height) canvas_element.height = pill_height;

  const ctx = canvas_element.getContext("2d");
  ctx.clearRect(0, 0, pill_width, pill_height);

  if (heat_value <= 0.005) {
    canvas_element.style.opacity = 0;
    return;
  }

  const eased_heat  = ease_out(heat_value);
  const center_x    = pill_width  / 2;
  const center_y    = pill_height / 2;
  const base_radius = Math.max(pill_width, pill_height);

  const [r1, g1, b1] = color_primary;
  const [r2, g2, b2] = color_secondary;
  const [r3, g3, b3] = color_cold;

  const cold_stage_alpha = Math.max(0, Math.min(1,  eased_heat / 0.38));
  const warm_stage_alpha = Math.max(0, Math.min(1, (eased_heat - 0.22) / 0.48));
  const hot_stage_alpha  = Math.max(0, Math.min(1, (eased_heat - 0.58) / 0.42));

  // Cold base glow — large flat wash
  if (cold_stage_alpha > 0) {
    const g = ctx.createRadialGradient(center_x, center_y, 0, center_x, center_y, base_radius * 2.0);
    g.addColorStop(0.00, `rgba(${r3},${g3},${b3},${0.60 * cold_stage_alpha})`);
    g.addColorStop(0.45, `rgba(${r3},${g3},${b3},${0.22 * cold_stage_alpha})`);
    g.addColorStop(1.00, `rgba(0,0,0,0)`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, pill_width, pill_height);
  }

  // Warming flood — secondary color bleeds in
  if (warm_stage_alpha > 0) {
    const g = ctx.createRadialGradient(center_x, center_y, 0, center_x, center_y, base_radius * 1.6);
    g.addColorStop(0.00, `rgba(${r2},${g2},${b2},${0.72 * warm_stage_alpha})`);
    g.addColorStop(0.40, `rgba(${r2},${g2},${b2},${0.38 * warm_stage_alpha})`);
    g.addColorStop(0.80, `rgba(${r3},${g3},${b3},${0.10 * warm_stage_alpha})`);
    g.addColorStop(1.00, `rgba(0,0,0,0)`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, pill_width, pill_height);
  }

  // Hot — primary flood + white overexposure
  if (hot_stage_alpha > 0) {
    const g_hot = ctx.createRadialGradient(center_x, center_y, 0, center_x, center_y, base_radius * 1.4);
    g_hot.addColorStop(0.00, `rgba(${r1},${g1},${b1},${0.88 * hot_stage_alpha})`);
    g_hot.addColorStop(0.50, `rgba(${r1},${g1},${b1},${0.48 * hot_stage_alpha})`);
    g_hot.addColorStop(1.00, `rgba(0,0,0,0)`);
    ctx.fillStyle = g_hot; ctx.fillRect(0, 0, pill_width, pill_height);

    // Annular white wash — inner_radius > 0 eliminates the center dot
    const g_white = ctx.createRadialGradient(
      center_x, center_y, base_radius * 0.30,
      center_x, center_y, base_radius * 1.30
    );
    g_white.addColorStop(0.00, `rgba(255,255,255,${0.80 * hot_stage_alpha})`);
    g_white.addColorStop(0.28, `rgba(255,248,225,${0.50 * hot_stage_alpha})`);
    g_white.addColorStop(0.60, `rgba(${r1},${g1},${b1},${0.22 * hot_stage_alpha})`);
    g_white.addColorStop(1.00, `rgba(0,0,0,0)`);
    ctx.fillStyle = g_white; ctx.fillRect(0, 0, pill_width, pill_height);
  }

  canvas_element.style.opacity = 1;
}

// ---------------------------------------------------------------------------
// Text + border color per heat stage
// Flips text dark when fill is bright enough to ensure readability
// ---------------------------------------------------------------------------

function apply_text_color_for_heat(pill_element, eased_heat, color_primary, text_hot, text_warm, border_hot) {
  const [r1, g1, b1] = color_primary;

  if (eased_heat > 0.60) {
    // Bright fill — dark text for contrast
    pill_element.style.color       = text_hot;
    pill_element.style.borderColor = border_hot;
  } else if (eased_heat > 0.25) {
    // Warming — saturated light text
    pill_element.style.color       = text_warm;
    pill_element.style.borderColor = `rgba(${r1},${g1},${b1},0.55)`;
  } else {
    // Cold — restore CSS defaults
    pill_element.style.color       = "";
    pill_element.style.borderColor = "";
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function usePillGlow({
  color_primary   = [255, 160, 60],
  color_secondary = [210, 90,  10],
  color_cold      = [160, 35,   0],
  text_hot        = "rgba(30, 12, 0, 0.88)",
  text_warm       = "rgba(255, 210, 150, 0.95)",
  border_hot      = "rgba(255, 160, 60, 0.8)",
} = {}) {
  const pill_ref   = useRef(null);
  const canvas_ref = useRef(null);

  const animation_state = useRef({
    heat_value: 0,
    is_hovered: false,
    last_time:  null,
    raf:        null,
  });

  useEffect(() => {
    const pill_element   = pill_ref.current;
    const canvas_element = canvas_ref.current;
    if (!pill_element || !canvas_element) return;

    const state = animation_state.current;

    function run_heat_tick(timestamp) {
      if (state.last_time === null) state.last_time = timestamp;

      const frame_delta_ms = Math.min(timestamp - state.last_time, DELTA_CAP_MS);
      state.last_time      = timestamp;

      const heat_delta   = state.is_hovered
        ?  frame_delta_ms / HEAT_UP_MS
        : -(frame_delta_ms / COOL_DOWN_MS);

      state.heat_value = Math.max(0, Math.min(1, state.heat_value + heat_delta));

      draw_heat_frame(canvas_element, pill_element, state.heat_value, color_primary, color_secondary, color_cold);
      apply_text_color_for_heat(pill_element, ease_out(state.heat_value), color_primary, text_hot, text_warm, border_hot);

      const animation_still_running = state.is_hovered
        ? state.heat_value < 1 - SNAP_THRESHOLD
        : state.heat_value > SNAP_THRESHOLD;

      if (animation_still_running) {
        state.raf = requestAnimationFrame(run_heat_tick);
      } else {
        state.raf       = null;
        state.last_time = null;
        if (!state.is_hovered) {
          pill_element.style.color       = "";
          pill_element.style.borderColor = "";
        }
      }
    }

    function start_heat_tick() {
      if (state.raf) cancelAnimationFrame(state.raf);
      state.last_time = null;
      state.raf       = requestAnimationFrame(run_heat_tick);
    }

    function handle_mouse_enter() { state.is_hovered = true;  start_heat_tick(); }
    function handle_mouse_leave() { state.is_hovered = false; start_heat_tick(); }

    pill_element.addEventListener("mouseenter", handle_mouse_enter);
    pill_element.addEventListener("mouseleave", handle_mouse_leave);

    return () => {
      pill_element.removeEventListener("mouseenter", handle_mouse_enter);
      pill_element.removeEventListener("mouseleave", handle_mouse_leave);
      if (state.raf) cancelAnimationFrame(state.raf);
    };
  }, [color_primary, color_secondary, color_cold, text_hot, text_warm, border_hot]);

  return { pill_ref, canvas_ref };
}
