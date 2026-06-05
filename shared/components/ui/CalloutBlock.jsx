import "./CalloutBlock.css";

// ---------------------------------------------------------------------------
// CalloutBlock
//
// Highlighted aside for devlog / article content. Four variants with
// colour-coded left borders and labels. Used inline inside content sections.
//
// Props:
//   variant  "note" | "tip" | "warning" | "info"  (default: "note")
//   label    string?  — overrides the default variant label
//   body     string   — the callout text
// ---------------------------------------------------------------------------

const DEFAULT_LABELS = {
  note:    "Note",
  tip:     "Tip",
  warning: "Warning",
  info:    "Info",
};

export default function CalloutBlock({ variant = "note", label = null, body = "" }) {
  const display_label = label ?? DEFAULT_LABELS[variant] ?? variant;

  return (
    <div className={`callout callout--${variant}`} role="note">
      <span className="callout__label">{display_label}</span>
      <p className="callout__body">{body}</p>
    </div>
  );
}
