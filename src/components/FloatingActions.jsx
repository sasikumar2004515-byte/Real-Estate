import { useEffect, useState } from 'react'
import { ArrowUp, MessageCircle, Phone } from 'lucide-react'
import { site } from '../data/site'

/**
 * FloatingActions - WhatsApp + Call (always visible) and scroll-to-top (after 400px).
 */
function FloatingActions() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="floating-actions">
      <a
        className="floating-btn floating-btn--whatsapp"
        href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi ${site.brand}, I would like to know more about your projects.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={20} strokeWidth={1.8} aria-hidden="true" />
        <span>WhatsApp</span>
      </a>

      <a
        className="floating-btn floating-btn--call"
        href={`tel:${site.phone.replace(/\s/g, '')}`}
        aria-label={`Call ${site.brand}`}
      >
        <Phone size={20} strokeWidth={1.8} aria-hidden="true" />
        <span>Call</span>
      </a>

      <button
        type="button"
        className={`floating-btn floating-btn--top ${showTop ? 'is-visible' : ''}`}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUp size={20} strokeWidth={1.8} aria-hidden="true" />
      </button>
    </div>
  )
}

export default FloatingActions
