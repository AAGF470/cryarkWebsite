import { PROGRAMS } from '../data'

export default function Programs() {
  return (
    <>
      <header className="nsl-intro">
        <div className="nsl-intro__inner">
          <p className="nsl-eyebrow">Programs</p>
          <h1 className="nsl-intro__title">Active satellite &amp; ground-station programs</h1>
          <p className="nsl-intro__lead">The missions we're building, flying, and operating right now — from a launched CubeSat to a student-built ground station.</p>
        </div>
      </header>

      <section className="nsl-block">
        <div className="nsl-block__inner">
          {PROGRAMS.map((p, i) => (
            <article key={p.id} className={`nsl-detail${i % 2 ? ' nsl-detail--reverse' : ''}`}>
              <div className="nsl-detail__media">
                <img src={p.image} alt={`${p.name} — placeholder`} loading="lazy" />
              </div>
              <div className="nsl-detail__info">
                <span className="nsl-detail__tag">{p.tag}</span>
                <h2 className="nsl-detail__name">{p.name}</h2>
                <p className="nsl-detail__body">{p.body}</p>
                {p.placeholder && <p className="nsl-detail__ph">Placeholder copy — full details coming from the team</p>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
