import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { navigation, projects, locations, site } from '../data/site'
import { getProjectCategory } from '../utils/category'

const social = [
  {
    name: 'Instagram',
    url: 'https://instagram.com',
    paths: [
      'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z',
      'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
      'M17.5 6.5h.01',
    ],
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    paths: [
      'M4 9h4v11H4V9Z',
      'M6 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z',
      'M10 9h4v2c.6-1.2 2-2.2 3.8-2.2 3 0 3.2 2.4 3.2 4.6V20h-4v-5.6c0-1.2-.4-2-1.6-2-1.3 0-1.4 1.2-1.4 2V20h-4V9Z',
    ],
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com',
    paths: ['M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z'],
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    paths: [
      'M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8Z',
      'm10 9 5 3-5 3V9Z',
    ],
  },
]

const icons = {
  top: ['M12 19V5M6 11l6-6 6 6'],
  send: ['M5 12h14M13 6l6 6-6 6'],
}

function Icon({ paths }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

const countBy = (getKey) => {
  const map = new Map()
  projects.forEach((p) => map.set(getKey(p), (map.get(getKey(p)) || 0) + 1))
  return [...map.entries()]
}

const byStatus = countBy((p) => p.status)
const byType = countBy(getProjectCategory)
const interests = [...new Set(projects.map(getProjectCategory))]

function Footer() {
  const [form, setForm] = useState({ name: '', phone: '', interest: interests[0] })
  const [error, setError] = useState('')
  const rootRef = useRef(null)
  const parRef = useRef(null)

  const digits = site.phone.replace(/[^\d+]/g, '')
  const whatsapp = site.phone.replace(/\D/g, '')
  const mapLink = `https://maps.google.com/?q=${encodeURIComponent(site.address)}`

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value })

  const submit = (event) => {
    event.preventDefault()
    const phoneDigits = form.phone.replace(/\D/g, '')
    if (!form.name.trim()) return setError('Please enter your name.')
    if (phoneDigits.length < 10) return setError('Please enter a valid phone number.')
    setError('')
    const text = `Hi ${site.brand}, I am ${form.name.trim()}. I am interested in ${form.interest}. Please call me on ${form.phone.trim()}.`
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    root.classList.add('rf-js')
    if (reduced) {
      root.classList.add('rf-in')
      return () => root.classList.remove('rf-js')
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          root.classList.add('rf-in')
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(root)

    let frame = 0
    const move = () => {
      frame = 0
      const band = parRef.current
      if (!band) return
      const top = band.getBoundingClientRect().top
      band.style.setProperty('--rf-py', `${Math.max(-60, Math.min(60, top * -0.1)).toFixed(1)}px`)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(move)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    move()

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
      root.classList.remove('rf-js')
    }
  }, [])

  return (
    <footer className="rf" ref={rootRef} data-own>
      <div className="rf-band" ref={parRef} aria-hidden="true">
        <div className="rf-band-img">
          <img src="/images/projects/lakeside-residences.webp" alt="" loading="lazy" />
        </div>
        <div className="rf-band-shade" />
      </div>

      <div className="rf-wrap">
        <div className="rf-main">
          <div className="rf-brand rf-r" style={{ '--i': 0 }}>
            <Link to="/" className="rf-logo">
              {site.brand}
            </Link>
            <p className="rf-tag">{site.tagline}</p>

            <address className="rf-address">
              <a href={mapLink} target="_blank" rel="noreferrer">
                {site.address}
              </a>
              <span>
                <a href={`mailto:${site.email}`}>{site.email}</a>
                <i> | </i>
                <a href={`tel:${digits}`}>{site.phone}</a>
              </span>
              <span className="rf-hours">Mon to Sat, 09:00 AM to 06:00 PM</span>
            </address>

            <div className="rf-social">
              {social.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={s.name}>
                  <Icon paths={s.paths} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Projects by status" className="rf-r" style={{ '--i': 1 }}>
            <h4>Projects</h4>
            <ul>
              {byStatus.map(([status, count]) => (
                <li key={status}>
                  <Link to={`/projects?status=${encodeURIComponent(status)}`}>
                    <span>{status}</span>
                    <em>{String(count).padStart(2, '0')}</em>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Property types" className="rf-r" style={{ '--i': 2 }}>
            <h4>Residences</h4>
            <ul>
              {byType.map(([type, count]) => (
                <li key={type}>
                  <Link to={`/projects?type=${encodeURIComponent(type)}`}>
                    <span>{type}</span>
                    <em>{String(count).padStart(2, '0')}</em>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company" className="rf-r" style={{ '--i': 3 }}>
            <h4>Company</h4>
            <ul>
              {navigation
                .filter((n) => !['/projects', '/locations'].includes(n.path))
                .map((item) => (
                  <li key={item.path}>
                    <Link to={item.path}>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <form className="rf-form rf-r" style={{ '--i': 4 }} onSubmit={submit} noValidate>
            <h4>Join the Exclusive</h4>
            <p>Share your details and our team will call you back to plan a private site visit.</p>
            <input
              value={form.name}
              onChange={update('name')}
              placeholder="Your name"
              aria-label="Full name"
            />
            <input
              type="tel"
              value={form.phone}
              onChange={update('phone')}
              placeholder="+91 00000 00000"
              aria-label="Phone number"
            />
            <select value={form.interest} onChange={update('interest')} aria-label="I am looking for">
              {interests.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
            {error && <p className="rf-error">{error}</p>}
            <button type="submit">
              <span>Send on WhatsApp</span>
              <Icon paths={icons.send} />
            </button>
            <small>Opens WhatsApp with your message ready to send.</small>
          </form>
        </div>

        <div className="rf-places rf-r" style={{ '--i': 5 }}>
          <span>Our locations</span>
          {locations.map((l) => (
            <Link key={l.name} to="/locations">
              {l.name}
            </Link>
          ))}
        </div>

        <p className="rf-note rf-r" style={{ '--i': 6 }}>
          Images and renderings are indicative and for representation only. Prices, specifications
          and availability are subject to change without notice. Please confirm all project details
          with our sales team before booking.
        </p>

        <div className="rf-base rf-r" style={{ '--i': 7 }}>
          <span>
            © {new Date().getFullYear()} {site.brand} Real Estate. All rights reserved.
          </span>
          <span className="rf-legal">Privacy Policy &nbsp;•&nbsp; Terms of Service</span>
          <button onClick={() => window.scrollTo({ top: 0 })} aria-label="Back to top">
            <Icon paths={icons.top} />
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
