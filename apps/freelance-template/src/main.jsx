import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@shared/styles/base.css'
import './theme.css'
import { applyTheme } from './applyTheme'
import cfg from './site.config'
import FreelanceSite from './FreelanceSite.jsx'

// One config → brand color palette + document title, then render.
applyTheme(cfg.brand.accent, cfg.brand.recipe)
if (cfg.title) document.title = cfg.title

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FreelanceSite />
  </StrictMode>,
)
