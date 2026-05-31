import "./PlatformBadge.css";

// ---------------------------------------------------------------------------
// PlatformBadge
//
// Square container for non-text, square-format platform logos (Godot, Blender,
// Steam, etc.). Image fills the container with 4px internal padding.
// If the icon fails to load the badge renders as an empty container.
//
// Icons should live at /public/icons/{platform}.svg
//
// Props:
//   platform   string  — one of the PLATFORMS keys (e.g. "godot", "blender")
//   size       number  — container size in px (default: 32)
//
// Usage:
//   <PlatformBadge platform="godot" />
//   <PlatformBadge platform="blender" size={40} />
// ---------------------------------------------------------------------------

const PLATFORM_LABELS = {
  godot:   "Godot",
  blender: "Blender",
  windows: "Windows",
  macos:   "macOS",
  linux:   "Linux",
  itch:    "itch.io",
  steam:   "Steam",
  gumroad: "Gumroad",
  unreal:  "Unreal Engine",
  unity:   "Unity",
};

export default function PlatformBadge({ platform, size = 32, src = null }) {
  const label    = PLATFORM_LABELS[platform] ?? platform;
  const icon_src = src ?? `/icons/${platform}.svg`;

  return (
    <div
      className="platform-badge"
      style={{ width: size, height: size }}
      title={label}
      aria-label={label}
    >
      <img
        src={icon_src}
        alt={label}
        className="platform-badge__icon"
        onError={e => { e.currentTarget.style.display = "none"; }}
      />
    </div>
  );
}
