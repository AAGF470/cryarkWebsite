import "./ContentCards.css";

// ---------------------------------------------------------------------------
// ContentCards
//
// Fixed-height grid cards. Title + category sit at the bottom by default.
// On hover the description smoothly slides up from below the title — the
// whole content block grows upward since it's pinned to bottom: 0, and the
// card's overflow:hidden keeps page layout completely stable.
//
// Description expansion uses CSS grid-template-rows (0fr → 1fr) — no snap,
// handles variable text lengths, pure CSS.
//
// Props:
//   heading      string?   — optional section label
//   cards        array     — [{ title, category?, description, image_src? }]
//   columns      2|3|4     — grid columns (default: auto)
//   card_height  number    — card height in px (default: 280)
// ---------------------------------------------------------------------------

export default function ContentCards({
  heading     = null,
  cards       = [],
  columns     = null,
  card_height = 280,
}) {
  const col_count = columns ?? (cards.length <= 2 ? 2 : cards.length <= 6 ? 3 : 4);

  return (
    <section className="content-cards" data-cols={col_count}>
      {heading && (
        <div className="content-cards__heading">{heading}</div>
      )}
      <ul className="content-cards__grid">
        {cards.map((card, i) => (
          <li
            key={i}
            className="content-cards__card"
            style={{ "--card-h": `${card_height}px` }}
          >
            {/* Background image + subtle zoom on hover */}
            {card.image_src && (
              <div className="content-cards__bg">
                <img src={card.image_src} alt="" />
              </div>
            )}

            {/* Dark gradient overlay — deeper at bottom for legibility */}
            <div className="content-cards__veil" />

            {/* Content block — pinned to bottom, grows upward as desc expands */}
            <div className="content-cards__inner">
              {card.category && (
                <span className="content-cards__category">{card.category}</span>
              )}
              <h3 className="content-cards__title">{card.title}</h3>

              {/* Grid trick: 0fr → 1fr is smooth with no snap at end */}
              {card.description && (
                <div className="content-cards__desc_reveal">
                  <div className="content-cards__desc_clip">
                    <p className="content-cards__desc">{card.description}</p>
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
