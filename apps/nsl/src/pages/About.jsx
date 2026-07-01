import { FeatureGrid } from '@shared/sections'
import { NSL_TEXT, CUBESAT_TEXT, TEAMS } from '../data'

const FACTS = [
  { big: '2022',  h: 'Founded', p: 'Spun out of the Northeastern Aerospace Club by undergraduate students.' },
  { big: '8',     h: 'Management team', p: 'Undergrads running the club day-to-day.' },
  { big: 'Dr. Jornet', h: 'Faculty advisor', p: 'Associate Dean of Research, Northeastern College of Engineering.' },
  { big: 'Alumni', h: 'Support network', p: 'A small but dedicated group of satellite-club alumni backing the team.' },
]

export default function About() {
  return (
    <>
      <header className="nsl-intro">
        <div className="nsl-intro__inner">
          <p className="nsl-eyebrow">About Us</p>
          <h1 className="nsl-intro__title">Students building real spacecraft.</h1>
          <p className="nsl-intro__lead">A brand-new, student-run satellite lab at Northeastern — undergrads designing, building, and flying CubeSats.</p>
        </div>
      </header>

      <section className="nsl-block">
        <div className="nsl-block__inner">
          <p className="nsl-eyebrow">Who we are</p>
          <h2 className="nsl-h2">Northeastern Satellite Lab</h2>
          <div className="nsl-prose">
            <p>{NSL_TEXT}</p>
          </div>
          <div className="nsl-cards" style={{ marginTop: '36px' }}>
            {FACTS.map(f => (
              <div key={f.h} className="nsl-info-card">
                <p className="nsl-info-card__big">{f.big}</p>
                <h3 style={{ marginTop: '6px' }}>{f.h}</h3>
                <p>{f.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="nsl-block nsl-block--alt">
        <div className="nsl-block__inner">
          <article className="nsl-detail">
            <div className="nsl-detail__media">
              <img src="/img/satellite.svg" alt="CubeSat — placeholder" loading="lazy" />
            </div>
            <div className="nsl-detail__info">
              <span className="nsl-detail__tag">The platform</span>
              <h2 className="nsl-detail__name">What is a CubeSat?</h2>
              <p className="nsl-detail__body">{CUBESAT_TEXT}</p>
            </div>
          </article>
        </div>
      </section>

      <FeatureGrid
        eyebrow="Our teams"
        headline="How the work splits up"
        items={TEAMS}
        columns={3}
        variant="default"
      />
    </>
  )
}
