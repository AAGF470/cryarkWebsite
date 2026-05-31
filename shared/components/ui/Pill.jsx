import { usePillGlow } from "../../hooks/usePillGlow";
import "./Pill.css";

// ---------------------------------------------------------------------------
// Pill
//
// Tag pill with time-based heat-up effect on hover.
// Warms from dim cold glow → theme color → near-white overexposure,
// like metal under a torch. Text flips dark when fill is bright enough
// to maintain readability at every heat stage.
//
// Props:
//   label                  string     — pill text e.g. "Blender"
//   theme_color_primary    [r,g,b]?   — hot fill color    (default: dawn orange)
//   theme_color_secondary  [r,g,b]?   — warming fill color
//   theme_color_cold       [r,g,b]?   — cold glow color
//   text_hot               string?    — text color when fully hot (dark for contrast)
//   text_warm              string?    — text color during warm stage
//   border_hot             string?    — border color when fully hot
//
// Usage — default dawn theme:
//   <Pill label="Blender" />
//
// Usage — cosmic theme:
//   <Pill
//     label="Python"
//     theme_color_primary={[150, 90, 255]}
//     theme_color_secondary={[90, 40, 200]}
//     theme_color_cold={[55, 15, 155]}
//     text_hot="rgba(15, 5, 35, 0.88)"
//     text_warm="rgba(215, 190, 255, 0.95)"
//     border_hot="rgba(170, 110, 255, 0.8)"
//   />
// ---------------------------------------------------------------------------

export default function Pill({
  label,
  theme_color_primary   = [210, 178, 125],
  theme_color_secondary = [165, 133,  80],
  theme_color_cold      = [ 75,  58,  30],
  text_hot              = "rgba(20, 15, 5, 0.90)",
  text_warm             = "rgba(250, 238, 205, 0.95)",
  border_hot            = "rgba(215, 182, 120, 0.88)",
}) {
  const { pill_ref, canvas_ref } = usePillGlow({
    color_primary:   theme_color_primary,
    color_secondary: theme_color_secondary,
    color_cold:      theme_color_cold,
    text_hot,
    text_warm,
    border_hot,
  });

  return (
    <span ref={pill_ref} className="pill__wrapper">
      <canvas ref={canvas_ref} className="pill__glow_canvas" aria-hidden="true" />
      <span className="pill__label">{label}</span>
    </span>
  );
}
