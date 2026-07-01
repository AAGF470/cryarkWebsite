import { useEffect } from 'react'
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import './App.css'
import { CONTACT_EMAIL } from './data'
import Home from './pages/Home.jsx'
import Programs from './pages/Programs.jsx'
import Projects from './pages/Projects.jsx'
import ThisSemester from './pages/ThisSemester.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

const TABS = [
  { to: '/programs',      label: 'Programs' },
  { to: '/this-semester', label: 'This Semester' },
  { to: '/projects',      label: 'Projects' },
  { to: '/about',         label: 'About Us' },
  { to: '/contact',       label: 'Contact' },
]

function Nav() {
  return (
    <nav className="nsl-nav" aria-label="Main">
      <Link to="/" className="nsl-nav__logo">
        <span className="nsl-nav__mark" aria-hidden="true" />
        Northeastern <span className="nsl-nav__accent">Satellite Lab</span>
      </Link>
      <div className="nsl-nav__links">
        {TABS.map(t => (
          <NavLink key={t.to} to={t.to}
            className={({ isActive }) => `nsl-nav__link${isActive ? ' is-active' : ''}`}>
            {t.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="nsl-footer">
      <div className="nsl-footer__inner">
        <div className="nsl-footer__brand-col">
          <div className="nsl-footer__brand">
            <span className="nsl-nav__mark" aria-hidden="true" />
            Northeastern <span className="nsl-nav__accent">Satellite Lab</span>
          </div>
          <p className="nsl-footer__tagline">
            A student-run club at Northeastern University designing, building, and launching
            CubeSats — hardware, software, and simulations.
          </p>
        </div>
        <div className="nsl-footer__col">
          <span className="nsl-footer__col-title">Explore</span>
          <Link to="/programs">Programs</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/this-semester">This Semester</Link>
          <Link to="/about">About Us</Link>
        </div>
        <div className="nsl-footer__col">
          <span className="nsl-footer__col-title">Get in touch</span>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <Link to="/contact">Contact &amp; mailing list</Link>
        </div>
      </div>
      <div className="nsl-footer__bottom">
        <span>© {new Date().getFullYear()} Northeastern Satellite Lab</span>
        <span>Founded 2022 · Boston, MA</span>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="nsl-app">
      <div className="nsl-backdrop" aria-hidden="true" />
      <ScrollManager />
      <Nav />
      <main className="nsl-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/this-semester" element={<ThisSemester />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
