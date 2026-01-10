import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DerDiedasDash from './app.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <DerDiedasDash />
    </ErrorBoundary>
  </StrictMode>,
)
