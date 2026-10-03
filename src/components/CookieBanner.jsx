import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'

const KEY = 'nivora-cookie-consent'

function loadAnalytics(id) {
  if (!id || document.getElementById('ga-script')) return

  const script = document.createElement('script')
  script.id = 'ga-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', id, { anonymize_ip: true })
}

/**
 * CookieBanner - asks consent; analytics only loads after "Accept".
 */
function CookieBanner() {
  const [choice, setChoice] = useState(() => {
    try {
      return localStorage.getItem(KEY)
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (choice === 'accepted') loadAnalytics(site.analyticsId)
  }, [choice])

  const decide = (value) => {
    try {
      localStorage.setItem(KEY, value)
    } catch {
      /* storage blocked - still hide banner */
    }
    setChoice(value)
  }

  if (choice) return null

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie notice">
      <p>
        We use essential cookies to run this site and, with your consent, basic analytics to
        improve it. Read our <Link to="/privacy">Privacy Policy</Link>.
      </p>

      <div className="cookie-banner-actions">
        <button type="button" className="cookie-btn cookie-btn--ghost" onClick={() => decide('declined')}>
          Decline
        </button>
        <button type="button" className="cookie-btn" onClick={() => decide('accepted')}>
          Accept
        </button>
      </div>
    </div>
  )
}

export default CookieBanner
