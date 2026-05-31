import "./Button.css";

// ---------------------------------------------------------------------------
// Button
//
// Three variants controlled by the variant prop:
//   "solid"          — opaque dark resting fill → white on hover, sweep animation,
//                      outer glow. Add lava=true for saturated color fill instead.
//   "ghost"          — text + arrow only, no border. Arrow slides right on hover.
//   "ghost-bordered" — glass border at rest, tints to theme color on hover.
//
// Theme colors are injected as CSS custom properties so each page section
// can pass its own color context. All defaults are dawn (warm orange).
//
// Props:
//   variant          "solid" | "ghost" | "ghost-bordered"  (default: "solid")
//   label            string    — button text
//   href             string?   — renders as <a> if provided, else <button>
//   onClick          function? — click handler
//   lava             boolean?  — solid only: fills with theme color instead of white
//   show_arrow       boolean?  — ghost variants: show → arrow (default: true)
//   theme_glow_tight string?   — CSS color for tight outer glow  (solid + ghost-bordered)
//   theme_glow_wide  string?   — CSS color for wide outer haze   (solid)
//   theme_fill_lava  string?   — CSS color for lava fill         (solid + lava)
//   theme_ghost_color       string? — hover text color           (ghost variants)
//   theme_ghost_border_hover string? — hover border color        (ghost-bordered)
//   theme_ghost_glow        string? — hover outer glow           (ghost-bordered)
//
// Usage — solid primary CTA:
//   <Button label="Get on Gumroad" href="https://gumroad.com/..." />
//
// Usage — solid lava variant:
//   <Button label="Buy Now" lava />
//
// Usage — ghost with arrow:
//   <Button variant="ghost" label="Read the lab" href="/lab" />
//
// Usage — ghost bordered:
//   <Button variant="ghost-bordered" label="View source" href="https://github.com/..." />
//
// Usage — custom cosmic theme:
//   <Button
//     label="See Products"
//     theme_glow_tight="rgba(195,160,255,0.90)"
//     theme_glow_wide="rgba(130,60,255,0.28)"
//   />
// ---------------------------------------------------------------------------

const DEFAULT_THEME = {
  glow_tight:         "rgba(235, 210, 160, 0.90)",
  glow_wide:          "rgba(200, 165, 100, 0.28)",
  fill_lava:          "rgb(195, 160, 95)",
  glow_tight_lava:    "rgba(225, 195, 135, 0.90)",
  glow_wide_lava:     "rgba(195, 160,  95, 0.32)",
  ghost_color:        "rgba(225, 198, 148, 0.95)",
  ghost_border_hover: "rgba(200, 169, 126, 0.55)",
  ghost_glow:         "rgba(200, 165, 110, 0.22)",
};

export default function Button({
  variant                  = "solid",
  label,
  href                     = null,
  onClick                  = null,
  lava                     = false,
  show_arrow               = true,
  theme_glow_tight         = DEFAULT_THEME.glow_tight,
  theme_glow_wide          = DEFAULT_THEME.glow_wide,
  theme_fill_lava          = DEFAULT_THEME.fill_lava,
  theme_glow_tight_lava    = DEFAULT_THEME.glow_tight_lava,
  theme_glow_wide_lava     = DEFAULT_THEME.glow_wide_lava,
  theme_ghost_color        = DEFAULT_THEME.ghost_color,
  theme_ghost_border_hover = DEFAULT_THEME.ghost_border_hover,
  theme_ghost_glow         = DEFAULT_THEME.ghost_glow,
}) {
  // CSS custom properties injected inline so theme is scoped to this element
  const theme_css_vars = {
    "--btn-glow-tight":         theme_glow_tight,
    "--btn-glow-wide":          theme_glow_wide,
    "--btn-fill-lava":          theme_fill_lava,
    "--btn-glow-tight-lava":    theme_glow_tight_lava,
    "--btn-glow-wide-lava":     theme_glow_wide_lava,
    "--btn-ghost-color":        theme_ghost_color,
    "--btn-ghost-border-hover": theme_ghost_border_hover,
    "--btn-ghost-glow":         theme_ghost_glow,
  };

  // Build class string
  const class_names = [
    "btn",
    variant === "solid"          ? "btn--solid"          : null,
    variant === "ghost"          ? "btn--ghost"           : null,
    variant === "ghost-bordered" ? "btn--ghost-bordered"  : null,
    lava && variant === "solid"  ? "btn--lava"            : null,
  ].filter(Boolean).join(" ");

  // Arrow element — used by both ghost variants
  const arrow_element = show_arrow && (variant === "ghost" || variant === "ghost-bordered") ? (
    <span className="btn__arrow" aria-hidden="true">
      <span className="btn__arrow_inner">→</span>
    </span>
  ) : null;

  const button_content = (
    <>
      <span className="btn__label">{label}</span>
      {arrow_element}
    </>
  );

  // Render as <a> if href provided, else <button>
  if (href) {
    return (
      <a
        href={href}
        className={class_names}
        style={theme_css_vars}
        onClick={onClick}
      >
        {button_content}
      </a>
    );
  }

  return (
    <button
      className={class_names}
      style={theme_css_vars}
      onClick={onClick}
      type="button"
    >
      {button_content}
    </button>
  );
}
