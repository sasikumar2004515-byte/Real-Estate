import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'

import App from './App'

import './styles/global.css'
import './styles/home.css'
import './styles/animation.css'
import './styles/gallery.css'
import './scripts/animation.js'

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
)

// Failsafe: never leave the page hidden if something delays the animation manager
window.setTimeout(() => document.body.classList.add('page-ready'), 1500)
