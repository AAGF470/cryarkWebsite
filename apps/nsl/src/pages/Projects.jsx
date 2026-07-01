import { FeatureGrid } from '@shared/sections'
import { COMPETITIONS, RND } from '../data'

export default function Projects() {
  const dewsat = COMPETITIONS.find(c => c.id === 'dewsat')
  const gtoc   = COMPETITIONS.find(c => c.id === 'gtoc-14')

  return (
    <>
      <header className="nsl-intro">
        <div className="nsl-intro__inner">
          <p className="nsl-eyebrow">Projects</p>
          <h1 className="nsl-intro__title">Competitions &amp; research</h1>
          <p className="nsl-intro__lead">Where we push ideas — from national competitions to open-source tools the whole CubeSat community can use.</p>
        </div>
      </header>

      {/* Competitions */}
      <section className="nsl-block">
        <div className="nsl-block__inner">
          <p className="nsl-eyebrow">Competitions</p>
          <h2 className="nsl-h2">Taking on the hard problems</h2>

          <article className="nsl-detail" style={{ marginTop: '32px' }}>
            <div className="nsl-detail__media">
              <img src={dewsat.image} alt="DEWSat — placeholder" loading="lazy" />
            </div>
            <div className="nsl-detail__info">
              <span className="nsl-detail__tag">{dewsat.tag}</span>
              <h3 className="nsl-detail__name">{dewsat.name}</h3>
              <p className="nsl-detail__body">{dewsat.body}</p>
            </div>
          </article>

          <div className="nsl-callout">
            <div className="nsl-callout__row">
              <span className="nsl-callout__name">{gtoc.name}</span>
              <span className="nsl-callout__tag">{gtoc.tag}</span>
            </div>
            <p className="nsl-callout__body">{gtoc.body}</p>
          </div>
        </div>
      </section>

      {/* R&D */}
      <FeatureGrid
        eyebrow="R&D projects"
        headline="Open-source by default"
        subtext="Tools and hardware we build in the open — usable by any student or researcher."
        items={RND}
        columns={2}
        variant="alt"
      />
    </>
  )
}
