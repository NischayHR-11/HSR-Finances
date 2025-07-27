import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Suppress WebSocket errors in production
import './utils/suppressWebSocketErrors.js'
// Suppress chart SVG transform errors in production
import './utils/chartErrorHandler.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
