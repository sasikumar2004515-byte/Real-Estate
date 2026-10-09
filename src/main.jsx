import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'

import App from './App'

import './styles/global.css'
import './styles/home.css'
import './styles/animation.css'
import './styles/nx.css'
import './styles/home-sections.css'
import './styles/tailwind.css'
import './styles/lux.css'
import './styles/lux-home.css'
import './styles/lux-pages.css'
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