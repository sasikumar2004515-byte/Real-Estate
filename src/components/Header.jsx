import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { navigation, site } from '../data/site'

function Header() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header className="nx-header">
      <div className="nx-topbar">
        <a href={`https://maps.google.com/?q=${encodeURIComponent(site.address)}`} target="_blank" rel="noreferrer">{site.address}</a>
        <a href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}>{site.phone}</a>
        <a href={`mailto:${site.email}`} className="nx-hide-sm">{site.email}</a>
      </div>
      <div className="nx-nav">
        <Link to="/" className="nx-brand" onClick={() => setOpen(false)}>
          <b>N</b>{site.brand}
        </Link>
        <nav className={open ? 'nx-links is-open' : 'nx-links'}>
          {navigation.map((i) => (
            <NavLink key={i.path} to={i.path} end={i.path === '/'} onClick={() => setOpen(false)}>
              {i.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/contact" className="nx-btn">Book a site visit</Link>
        <button className="nx-burger" aria-label="Menu" onClick={() => setOpen(!open)}>
          <i /><i /><i />
        </button>
      </div>
    </header>
  )
}

export default Header
