import "./FactGrid.css";

// ---------------------------------------------------------------------------
// FactGrid
//
// A full-width section showing a grid of stat/fact cards.
// Great for game specs, feature counts, system requirements, etc.
//
// Props:
//   heading  string?   — optional section label above the grid
//   facts    array     — [{ value, label, description? }]
//                        value:       "4", "200+", "45", "8GB"
//                        label:       "Maps", "Gun Customizations", "RAM"
//                        description: optional small sub-line
//   columns  2|3|4     — grid column count (default: auto based on count)
// ---------------------------------------------------------------------------

export default function FactGrid({ heading = null, facts = [], columns = null }) {
  const col_count = columns ?? (facts.length <= 2 ? 2 : facts.length <= 4 ? 4 : 3);

  return (
    <section className="fact-grid" data-cols={col_count}>
      {heading && (
        <div className="fact-grid__heading">{heading}</div>
      )}
      <ul className="fact-grid__list">
        {facts.map((fact, i) => (
          <li key={i} className="fact-grid__card">
            <span className="fact-grid__value">{fact.value}</span>
            <span className="fact-grid__label">{fact.label}</span>
            {fact.description && (
              <span className="fact-grid__desc">{fact.description}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
