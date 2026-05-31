import { useEffect, useRef } from "react";
import "./BackgroundCanvas.css";

// ---------------------------------------------------------------------------
// BackgroundCanvas
//
// Animated orb layer that sits behind all page content.
// Required for glassmorphism — the frosted glass effect needs something
// behind it to actually diffuse. Without this the glass panels are just
// semi-transparent boxes.
//
// Five orbs drift slowly across a near-black background, bouncing off
// edges with a sine-wave wobble so motion never feels mechanical.
// Colors: deep purple, dark blue, amber — matching the Cryark palette.
//
// Usage — place once inside the page root, before all other content:
//   <BackgroundCanvas />
//   <NavBar />
//   <Hero />
//   ...
// ---------------------------------------------------------------------------

// Orb definitions — position/velocity in normalized 0-1 space
const ORB_DEFINITIONS = [
  { x: 0.15, y: 0.15, vx:  0.00018, vy:  0.00012, radius_factor: 0.38, color: [55,  30, 160], alpha: 0.32 },
  { x: 0.80, y: 0.20, vx: -0.00014, vy:  0.00016, radius_factor: 0.32, color: [15,  55, 160], alpha: 0.24 },
  { x: 0.50, y: 0.70, vx:  0.00010, vy: -0.00018, radius_factor: 0.28, color: [160, 55,  15], alpha: 0.18 },
  { x: 0.25, y: 0.80, vx:  0.00016, vy: -0.00010, radius_factor: 0.22, color: [80,  20, 140], alpha: 0.20 },
  { x: 0.75, y: 0.65, vx: -0.00012, vy: -0.00014, radius_factor: 0.26, color: [10,  80, 180], alpha: 0.16 },
];

export default function BackgroundCanvas() {
  const canvas_ref = useRef(null);

  useEffect(() => {
    const canvas_element = canvas_ref.current;
    if (!canvas_element) return;

    const ctx = canvas_element.getContext("2d");

    // Deep copy orb state so each mount starts fresh
    const orbs = ORB_DEFINITIONS.map(orb => ({ ...orb }));

    // Per-orb wobble parameters — sine wave offset on top of linear motion
    const orb_wobble_params = orbs.map(() => ({
      phase_x:   Math.random() * Math.PI * 2,
      phase_y:   Math.random() * Math.PI * 2,
      speed_x:   0.0004 + Math.random() * 0.0003,
      speed_y:   0.0004 + Math.random() * 0.0003,
      amplitude: 0.04   + Math.random() * 0.04,
    }));

    let tick_count  = 0;
    let raf_id      = null;

    function resize_canvas_to_window() {
      canvas_element.width  = window.innerWidth;
      canvas_element.height = window.innerHeight;
    }
    resize_canvas_to_window();
    window.addEventListener("resize", resize_canvas_to_window);

    function draw_frame() {
      const W = canvas_element.width;
      const H = canvas_element.height;

      // Near-black base — #04050a is almost pure black with faint blue tint
      ctx.fillStyle = "#04050a";
      ctx.fillRect(0, 0, W, H);

      // Draw each orb as a soft radial gradient
      orbs.forEach((orb, index) => {
        const wobble = orb_wobble_params[index];

        // Add sine-wave wobble to linear position
        const wobble_x  = Math.sin(tick_count * wobble.speed_x + wobble.phase_x) * wobble.amplitude;
        const wobble_y  = Math.sin(tick_count * wobble.speed_y + wobble.phase_y) * wobble.amplitude;
        const center_x  = (orb.x + wobble_x) * W;
        const center_y  = (orb.y + wobble_y) * H;
        const radius    = orb.radius_factor * Math.max(W, H);

        const [r, g, b] = orb.color;
        const gradient  = ctx.createRadialGradient(center_x, center_y, 0, center_x, center_y, radius);
        gradient.addColorStop(0,    `rgba(${r},${g},${b},${orb.alpha})`);
        gradient.addColorStop(0.40, `rgba(${r},${g},${b},${orb.alpha * 0.45})`);
        gradient.addColorStop(1,    `rgba(0,0,0,0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);
      });

      // Advance orb positions and bounce off edges
      orbs.forEach(orb => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < 0.05 || orb.x > 0.95) orb.vx *= -1;
        if (orb.y < 0.05 || orb.y > 0.95) orb.vy *= -1;
      });

      tick_count++;
      raf_id = requestAnimationFrame(draw_frame);
    }

    raf_id = requestAnimationFrame(draw_frame);

    return () => {
      cancelAnimationFrame(raf_id);
      window.removeEventListener("resize", resize_canvas_to_window);
    };
  }, []);

  return (
    <canvas
      ref={canvas_ref}
      className="background_canvas"
      aria-hidden="true"
    />
  );
}
