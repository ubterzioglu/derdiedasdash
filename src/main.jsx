import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DerDiedasDash from './app.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DerDiedasDash />
  </StrictMode>,
)
