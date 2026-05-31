import "./TitleBlock.css";

// ---------------------------------------------------------------------------
// TitleBlock
//
// A prominent section title — use before ContentCards, FeatureSpotlights,
// or any group of blocks that needs a clear, large heading to explain what
// the viewer is looking at. Much bigger than the small eyebrow labels that
// live inside individual blocks.
//
// Props:
//   eyebrow      string?  — small uppercase label above the heading
//   heading      string   — the main large title (required)
//   description  string?  — supporting paragraph below the heading
//   align        string   — "left" | "center" (default: "left")
// ---------------------------------------------------------------------------

export default function TitleBlock({
  eyebrow     = null,
  heading     = "",
  description = null,
  align       = "left",
}) {
  if (!heading) return null;

  return (
    <div className={`title-block title-block--${align}`}>
      {eyebrow && (
        <p className="title-block__eyebrow">{eyebrow}</p>
      )}
      <h2 className="title-block__heading">{heading}</h2>
      {description && (
        <p className="title-block__desc">{description}</p>
      )}
    </div>
  );
}
