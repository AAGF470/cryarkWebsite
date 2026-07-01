import { SCHEDULE, ROSTER, CONTACT_EMAIL } from '../data'

const initials = name => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

export default function ThisSemester() {
  return (
    <>
      <header className="nsl-intro">
        <div className="nsl-intro__inner">
          <p className="nsl-eyebrow">This Semester</p>
          <h1 className="nsl-intro__title">Meetings, schedule &amp; who to talk to</h1>
          <p className="nsl-intro__lead">Everything you need to show up and get involved this semester. [Placeholder schedule — update each term.]</p>
        </div>
      </header>

      {/* Quick facts */}
      <section className="nsl-block">
        <div className="nsl-block__inner">
          <div className="nsl-cards" style={{ marginBottom: '40px' }}>
            <div className="nsl-info-card">
              <h3>General meeting</h3>
              <p className="nsl-info-card__big">Wed · 7:30 PM</p>
              <p>Forsyth 129 — all members welcome.</p>
            </div>
            <div className="nsl-info-card">
              <h3>Open lab</h3>
              <p className="nsl-info-card__big">Fri · 3–6 PM</p>
              <p>Drop in at the ISEC lab, no experience needed.</p>
            </div>
            <div className="nsl-info-card">
              <h3>Questions?</h3>
              <p><a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--color-accent)' }}>{CONTACT_EMAIL}</a></p>
              <p>Reach out anytime — we're happy to help you find a team.</p>
            </div>
          </div>

          <h2 className="nsl-h2">Weekly schedule</h2>
          <div className="nsl-table-wrap" style={{ marginTop: '20px' }}>
            <table className="nsl-table">
              <thead>
                <tr><th>Day</th><th>Session</th><th>Time</th><th>Where</th></tr>
              </thead>
              <tbody>
                {SCHEDULE.map(row => (
                  <tr key={row.day}>
                    <td>{row.day}</td>
                    <td>{row.what}</td>
                    <td className="nsl-table__time">{row.time}</td>
                    <td>{row.where}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Persons of contact */}
      <section className="nsl-block nsl-block--alt">
        <div className="nsl-block__inner">
          <p className="nsl-eyebrow">Persons of contact</p>
          <h2 className="nsl-h2">Who to talk to</h2>
          <div className="nsl-roster" style={{ marginTop: '28px' }}>
            {ROSTER.map(g => (
              <div key={g.group} className="nsl-roster__group">
                <p className="nsl-roster__title">{g.group}</p>
                <ul className="nsl-roster__list">
                  {g.members.map(m => (
                    <li key={m} className="nsl-person">
                      <span className="nsl-person__avatar" aria-hidden="true">{initials(m)}</span>
                      <span className="nsl-person__name">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
