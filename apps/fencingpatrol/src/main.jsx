import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@shared/styles/base.css'
import './theme/theme.css'
import FencingPatrol from './FencingPatrol.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FencingPatrol />
  </StrictMode>,
)
