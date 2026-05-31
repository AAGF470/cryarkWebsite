import { useState } from "react";
import "./ChangelogBlock.css";

// ---------------------------------------------------------------------------
// ChangelogBlock
//
// Version history timeline. Shows the 3 most recent entries by default with
// a "Show all" toggle for older ones. Entries have tagged change items:
// added / fixed / changed / breaking / removed.
//
// Props:
//   heading  string?  — default "Changelog"
//   entries  array    — [{ version, date, title?, changes: [{ type, text }] }]
//
// Change types: "added" | "fixed" | "changed" | "breaking" | "removed"
// ---------------------------------------------------------------------------

const TYPE_META = {
  added:    { label: "Added",    color: "green"  },
  fixed:    { label: "Fixed",    color: "blue"   },
  changed:  { label: "Changed",  color: "yellow" },
  breaking: { label: "Breaking", color: "red"    },
  removed:  { label: "Removed",  color: "dim"    },
};

function format_date(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch { return iso; }
}

// How many cards to show before "show more"
const PREVIEW_COUNT = 6;

export default function ChangelogBlock({ heading = "Changelog", entries = [] }) {
  const [expanded, set_expanded] = useState(false);
  if (!entries.length) return null;

  const visible  = expanded ? entries : entries.slice(0, PREVIEW_COUNT);
  const has_more = entries.length > PREVIEW_COUNT;
  const hidden   = entries.length - PREVIEW_COUNT;

  return (
    <section className="changelog">
      <div className="changelog__header">
        <h2 className="changelog__heading">{heading}</h2>
      </div>

      <div className="changelog__grid">
        {visible.map((entry, i) => (
          <ChangelogCard key={entry.version ?? i} entry={entry} />
        ))}
      </div>

      {has_more && (
        <div className="changelog__toggle_wrap">
          <button
            className="changelog__toggle"
            onClick={() => set_expanded(e => !e)}
          >
            {expanded ? "Show less ↑" : `Show ${hidden} more ${hidden === 1 ? "version" : "versions"} ↓`}
          </button>
        </div>
      )}
    </section>
  );
}

function ChangelogCard({ entry }) {
  const { version, date, title, changes = [] } = entry;

  return (
    <div className="changelog__card">
      {/* Version badge + date */}
      <div className="changelog__card_meta">
        {version && <span className="changelog__version">{version}</span>}
        {date    && <span className="changelog__date">{format_date(date)}</span>}
      </div>

      {title && <p className="changelog__card_title">{title}</p>}

      {changes.length > 0 && (
        <ul className="changelog__changes">
          {changes.map((change, i) => {
            const meta = TYPE_META[change.type] ?? TYPE_META.changed;
            return (
              <li key={i} className="changelog__change">
                <span className={`changelog__change_tag changelog__change_tag--${meta.color}`}>
                  {meta.label}
                </span>
                <span className="changelog__change_text">{change.text}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
