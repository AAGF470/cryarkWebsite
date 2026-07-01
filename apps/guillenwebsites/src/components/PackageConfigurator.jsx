import { useMemo, useState } from 'react'
import './PackageConfigurator.css'
import { PACKAGES, ADDONS, CONTACT_EMAIL } from '../data'

// ---------------------------------------------------------------------------
// PackageConfigurator — the "configuration form".
// Pick a base package + add-ons (some priced per item/page), see a live
// first-year + recurring total, and send the exact selection as a pre-filled
// inquiry. Nothing is charged — it's a transparent estimate.
// ---------------------------------------------------------------------------

const money = n => `$${n.toLocaleString('en-US')}`

const Check = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="2 7.5 5.5 11 12 3" />
  </svg>
)

export default function PackageConfigurator() {
  const [pkgId, setPkgId]   = useState('standard')
  const [addons, setAddons] = useState(() => new Set())
  const [qty, setQty]       = useState({})   // per-unit add-on quantities
  const [name, setName]     = useState('')

  const pkg = PACKAGES.find(p => p.id === pkgId) ?? null

  function toggleAddon(id) {
    const addon = ADDONS.find(a => a.id === id)
    setAddons(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else {
        next.add(id)
        if (addon?.kind === 'per-unit') setQty(q => ({ ...q, [id]: q[id] || 1 }))
      }
      return next
    })
  }

  function bumpQty(id, delta) {
    setQty(q => ({ ...q, [id]: Math.max(1, (q[id] || 1) + delta) }))
  }

  const summary = useMemo(() => {
    const chosen = ADDONS.filter(a => addons.has(a.id))
    let firstYear = pkg ? pkg.firstYear : 0
    let recurring = pkg ? pkg.recurring : 0
    let approx = false
    const quoted = []

    for (const a of chosen) {
      if (a.kind === 'quoted')    { quoted.push(a); continue }
      if (a.kind === 'onetime')   firstYear += a.amount
      // Recurring items (e.g. the phone line) are billed yearly — including
      // year one — so they count toward BOTH the first-year and recurring totals.
      if (a.kind === 'recurring') { firstYear += a.amount; recurring += a.amount; if (a.approx) approx = true }
      if (a.kind === 'per-unit')  firstYear += a.amount * (qty[a.id] || 1)
    }
    return { chosen, firstYear, recurring, approx, quoted }
  }, [pkg, addons, qty])

  function lineAmount(a) {
    if (a.kind === 'quoted')   return 'quoted'
    if (a.kind === 'per-unit') return money(a.amount * (qty[a.id] || 1))
    if (a.kind === 'recurring') return `${a.approx ? 'from ' : ''}${money(a.amount)}/yr`
    return money(a.amount)
  }

  function buildInquiry() {
    const lines = []
    lines.push(pkg ? `Package: ${pkg.name} (${pkg.price} first year)` : 'Package: (none selected yet)')
    if (summary.chosen.length) {
      lines.push('', 'Add-ons:')
      summary.chosen.forEach(a => {
        const q = a.kind === 'per-unit' ? ` ×${qty[a.id] || 1}` : ''
        lines.push(`  • ${a.name}${q} — ${lineAmount(a)}`)
      })
    }
    lines.push('',
      `Estimated first year, all-in: ${money(summary.firstYear)}${summary.quoted.length ? ' + quoted items' : ''}`,
      `Estimated recurring: ${summary.approx ? 'from ' : ''}${money(summary.recurring)}/yr`)
    if (summary.quoted.length) lines.push('', 'Needs a quote: ' + summary.quoted.map(a => a.name).join(', '))
    if (name.trim()) lines.push('', `From: ${name.trim()}`)
    return lines.join('\n')
  }

  const mailto = `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent('Website setup request')}` +
    `&body=${encodeURIComponent(buildInquiry())}`

  return (
    <div className="cfg">
      {/* ── Choices ─────────────────────────────────────────────────────── */}
      <div className="cfg__choices">
        <fieldset className="cfg__group">
          <legend className="cfg__legend">1 · Choose a base package</legend>
          <div className="cfg__pkgs">
            {PACKAGES.map(p => {
              const active = p.id === pkgId
              return (
                <label key={p.id} className={`cfg-pkg${active ? ' is-active' : ''}`}>
                  <input
                    type="radio" name="cfg-pkg" value={p.id}
                    checked={active} onChange={() => setPkgId(p.id)}
                    className="cfg-pkg__radio"
                  />
                  <span className="cfg-pkg__head">
                    <span className="cfg-pkg__name">{p.name}</span>
                    {p.badge && <span className="cfg-pkg__badge">{p.badge}</span>}
                  </span>
                  <span className="cfg-pkg__price">{p.price}<em> {p.period}</em></span>
                  <span className="cfg-pkg__desc">{p.description}</span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="cfg__group">
          <legend className="cfg__legend">2 · Add only what you need</legend>
          <div className="cfg__addons">
            {ADDONS.map(a => {
              const active = addons.has(a.id)
              const perUnit = a.kind === 'per-unit'
              return (
                <div key={a.id} className={`cfg-addon${active ? ' is-active' : ''}`}>
                  <label className="cfg-addon__toggle">
                    <input
                      type="checkbox" checked={active}
                      onChange={() => toggleAddon(a.id)} className="cfg-addon__box"
                    />
                    <span className="cfg-addon__check" aria-hidden="true"><Check /></span>
                    <span className="cfg-addon__main">
                      <span className="cfg-addon__row">
                        <span className="cfg-addon__name">{a.name}</span>
                        <span className="cfg-addon__price">{a.price}</span>
                      </span>
                      <span className="cfg-addon__meta">{a.cadence}</span>
                      <span className="cfg-addon__body">{a.body}</span>
                    </span>
                  </label>

                  {active && perUnit && (
                    <div className="cfg-addon__stepper">
                      <span className="cfg-addon__stepper-label">How many extra {a.unitPlural}?</span>
                      <div className="cfg-stepper">
                        <button type="button" onClick={() => bumpQty(a.id, -1)} aria-label={`Fewer ${a.unitPlural}`}>−</button>
                        <span className="cfg-stepper__val">{qty[a.id] || 1}</span>
                        <button type="button" onClick={() => bumpQty(a.id, 1)} aria-label={`More ${a.unitPlural}`}>+</button>
                      </div>
                      <span className="cfg-addon__linetotal">{money(a.amount * (qty[a.id] || 1))}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </fieldset>
      </div>

      {/* ── Live summary ────────────────────────────────────────────────── */}
      <aside className="cfg__summary">
        <div className="cfg-sum">
          <p className="cfg-sum__title">Your setup</p>

          <ul className="cfg-sum__lines">
            <li className="cfg-sum__line">
              <span>{pkg ? pkg.name : 'No package selected'}</span>
              <span>{pkg ? money(pkg.firstYear) : '—'}</span>
            </li>
            {summary.chosen.map(a => (
              <li key={a.id} className="cfg-sum__line cfg-sum__line--sub">
                <span>{a.name}{a.kind === 'per-unit' ? ` ×${qty[a.id] || 1}` : ''}</span>
                <span>{lineAmount(a)}</span>
              </li>
            ))}
          </ul>

          <div className="cfg-sum__totals">
            <div className="cfg-sum__total">
              <span>First year, all-in</span>
              <strong>{summary.approx ? 'from ' : ''}{money(summary.firstYear)}{summary.quoted.length ? '+' : ''}</strong>
            </div>
            <div className="cfg-sum__total cfg-sum__total--sub">
              <span>Then, recurring</span>
              <strong>{summary.approx ? 'from ' : ''}{money(summary.recurring)}/yr</strong>
            </div>
          </div>

          {summary.quoted.length > 0 && (
            <p className="cfg-sum__quoted">
              Quoted per business: {summary.quoted.map(a => a.name).join(', ')}.
            </p>
          )}

          <input
            className="cfg-sum__name"
            type="text" placeholder="Your name (optional)"
            value={name} onChange={e => setName(e.target.value)}
          />
          <a className="cfg-sum__cta" href={mailto}>Request this setup</a>
          <p className="cfg-sum__fine">
            Just an estimate — nothing is charged. Recurring items are billed yearly,
            starting in year one. We confirm every number in writing before any work begins.
          </p>
        </div>
      </aside>
    </div>
  )
}
