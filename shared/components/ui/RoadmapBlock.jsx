import "./RoadmapBlock.css";

// ---------------------------------------------------------------------------
// RoadmapBlock
//
// Horizontal milestone track (desktop) / vertical list (mobile).
// Shows project progress with status-coded nodes.
//
// Props:
//   eyebrow     string?  — small label above heading
//   heading     string?  — section title
//   milestones  array    — [{ label, description?, status }]
//
// Milestone status values:
//   "done"        — completed (gold)
//   "in_progress" — active (cyan)
//   "planned"     — upcoming (gray)
//   "cut"         — cancelled (dim red)
// ---------------------------------------------------------------------------

const STATUS_META = {
  done:        { symbol: "✓", label: "Done"        },
  in_progress: { symbol: "◎", label: "In Progress" },
  planned:     { symbol: "○", label: "Planned"     },
  cut:         { symbol: "✕", label: "Cut"         },
};

export default function RoadmapBlock({ eyebrow = null, heading = null, milestones = [] }) {
  if (!milestones.length) return null;

  const done_count  = milestones.filter(m => m.status === "done").length;
  const valid_count = milestones.filter(m => m.status !== "cut").length;
  const progress    = valid_count > 0 ? Math.round((done_count / valid_count) * 100) : 0;

  return (
    <section className="roadmap">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      {(eyebrow || heading) && (
        <div className="roadmap__header">
          {eyebrow && <p className="roadmap__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="roadmap__heading">{heading}</h2>}
        </div>
      )}

      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      <div className="roadmap__progress_wrap" aria-label={`${progress}% complete`}>
        <div
          className="roadmap__progress_bar"
          style={{ width: `${progress}%` }}
        />
        <span className="roadmap__progress_label">{progress}%</span>
      </div>

      {/* ── Track ─────────────────────────────────────────────────────────── */}
      <div className="roadmap__track">
        {/* Connecting line behind nodes */}
        <div className="roadmap__line" aria-hidden="true" />

        <ol className="roadmap__list">
          {milestones.map((m, i) => {
            const meta = STATUS_META[m.status] ?? STATUS_META.planned;
            return (
              <li
                key={i}
                className={`roadmap__item roadmap__item--${m.status ?? "planned"}`}
              >
                <div className="roadmap__node" aria-label={`${m.label}: ${meta.label}`}>
                  <span className="roadmap__symbol" aria-hidden="true">
                    {meta.symbol}
                  </span>
                </div>
                <div className="roadmap__item_body">
                  <span className="roadmap__item_label">{m.label}</span>
                  {m.description && (
                    <span className="roadmap__item_desc">{m.description}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
