import "./SideBySide.css";

// ---------------------------------------------------------------------------
// SideBySide
//
// Two-column layout wrapper. Each column renders any single block passed as
// a JSX element via the `left` / `right` props. The BlockRenderer on each
// page is responsible for resolving those elements — this component only
// handles the grid geometry.
//
// Props:
//   left    ReactNode  — rendered left-column block
//   right   ReactNode  — rendered right-column block
//   split   string     — column ratio (default: "50/50")
//                        "50/50" | "60/40" | "40/60" | "67/33" | "33/67"
//   align   string     — vertical align of columns (default: "start")
//                        "start" | "center" | "stretch"
// ---------------------------------------------------------------------------

export default function SideBySide({
  left  = null,
  right = null,
  split = "50/50",
  align = "start",
}) {
  return (
    <div
      className="sbs"
      data-split={split}
      data-align={align}
    >
      <div className="sbs__col">{left}</div>
      <div className="sbs__col">{right}</div>
    </div>
  );
}
