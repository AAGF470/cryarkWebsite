import "./SystemRequirements.css";

// ---------------------------------------------------------------------------
// SystemRequirements
//
// Two-column minimum / recommended specs table for game product pages.
// Only renders rows that have content.
//
// Props:
//   heading       string?  — default "System Requirements"
//   minimum       object?  — { os, cpu, gpu, ram, storage, notes }
//   recommended   object?  — { os, cpu, gpu, ram, storage, notes }
//   tested_on     string?  — "Tested on Windows 11, RTX 3080"
//   platform_note string?  — "PC only · Mac support planned 2025"
// ---------------------------------------------------------------------------

const ROWS = [
  { key: "os",      label: "OS"      },
  { key: "cpu",     label: "CPU"     },
  { key: "gpu",     label: "GPU"     },
  { key: "ram",     label: "RAM"     },
  { key: "storage", label: "Storage" },
  { key: "notes",   label: "Notes"   },
];

function col_has_any(col) {
  if (!col) return false;
  return ROWS.some(r => col[r.key]);
}

export default function SystemRequirements({
  heading       = "System Requirements",
  minimum       = null,
  recommended   = null,
  tested_on     = null,
  platform_note = null,
}) {
  if (!col_has_any(minimum) && !col_has_any(recommended)) return null;

  const has_recommended = col_has_any(recommended);

  return (
    <section className="sysreq">
      <div className="sysreq__inner">
        <h2 className="sysreq__heading">{heading}</h2>

        {platform_note && (
          <p className="sysreq__platform_note">{platform_note}</p>
        )}

        {/* ── Table ─────────────────────────────────────────────────────── */}
        <div className="sysreq__table_wrap">
          <table className="sysreq__table">
            <thead>
              <tr>
                <th className="sysreq__th sysreq__th--label" />
                <th className="sysreq__th sysreq__th--min">Minimum</th>
                {has_recommended && (
                  <th className="sysreq__th sysreq__th--rec">Recommended</th>
                )}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(({ key, label }) => {
                const min_val = minimum?.[key];
                const rec_val = recommended?.[key];
                if (!min_val && !rec_val) return null;
                return (
                  <tr key={key} className="sysreq__row">
                    <td className="sysreq__cell sysreq__cell--label">{label}</td>
                    <td className="sysreq__cell sysreq__cell--min">
                      {min_val ?? <span className="sysreq__empty">—</span>}
                    </td>
                    {has_recommended && (
                      <td className="sysreq__cell sysreq__cell--rec">
                        {rec_val ?? <span className="sysreq__empty">—</span>}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Footer notes ──────────────────────────────────────────────── */}
        {tested_on && (
          <p className="sysreq__tested">{tested_on}</p>
        )}
      </div>
    </section>
  );
}
