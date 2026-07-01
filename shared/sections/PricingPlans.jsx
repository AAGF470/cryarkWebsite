import './PricingPlans.css'
import Button from '../components/ui/Button'

// ---------------------------------------------------------------------------
// PricingPlans
// Reusable pricing/package cards — generalized from the Guillen Solutions
// "Plans" block. Works for flat-rate packages, service tiers, or add-ons.
//
// Props:
//   eyebrow  string
//   headline string
//   subtext  string
//   plans    Array<{
//     tag?         string   — small uppercase label (e.g. "ALL-INCLUSIVE")
//     name?        string   — prominent plan title (e.g. "Local Business Standard")
//     badge?       string   — floating ribbon (e.g. "MOST POPULAR")
//     price        string   — e.g. "$800" or "+$400"
//     period?      string   — e.g. "one-time", "/mo"
//     description? string
//     note?        string   — separator line (e.g. "Includes everything above, plus:")
//     features     string[] — checklist
//     total?       { label, amount }  — optional total row
//     cta          { label, href, variant? }
//     featured?    boolean  — accent border + shadow
//   }>
//   variant  "default"|"alt"
// ---------------------------------------------------------------------------

const CheckIcon = () => (
  <svg viewBox="0 0 13 13" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1.5 6.5 5 10 11.5 2.5" />
  </svg>
)

export default function PricingPlans({
  eyebrow,
  headline,
  subtext,
  plans = [],
  variant = 'default',
}) {
  return (
    <section className={`section section--${variant}`}>
      <div className="section-container">
        {(eyebrow || headline || subtext) && (
          <div className="pricing__header">
            {eyebrow  && <p className="section-eyebrow">{eyebrow}</p>}
            {headline && <h2 className="section-title">{headline}</h2>}
            {subtext  && <p className="section-sub">{subtext}</p>}
          </div>
        )}

        <div className="pricing__grid" style={{ '--pricing-cols': plans.length || 1 }}>
          {plans.map((plan, i) => (
            <div key={i} className={`plan${plan.featured ? ' plan--featured' : ''}`}>
              {plan.badge && <span className="plan__badge">{plan.badge}</span>}
              {plan.tag && <p className="plan__tag">{plan.tag}</p>}
              {plan.name && <h3 className="plan__name">{plan.name}</h3>}

              <div className="plan__price-row">
                <span className="plan__amount">{plan.price}</span>
                {plan.period && <span className="plan__period">{plan.period}</span>}
              </div>

              {plan.description && <p className="plan__desc">{plan.description}</p>}
              {plan.note && <p className="plan__note">{plan.note}</p>}

              {plan.features?.length > 0 && (
                <ul className="plan__list">
                  {plan.features.map(f => (
                    <li key={f} className="plan__item">
                      <span className="plan__check"><CheckIcon /></span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              {plan.total && (
                <div className="plan__total-row">
                  <span className="plan__total-label">{plan.total.label}</span>
                  <span className="plan__total-amount">{plan.total.amount}</span>
                </div>
              )}

              {plan.cta && (
                <Button
                  className="plan__btn"
                  label={plan.cta.label}
                  href={plan.cta.href}
                  variant={plan.cta.variant ?? (plan.featured ? 'solid' : 'ghost-bordered')}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
