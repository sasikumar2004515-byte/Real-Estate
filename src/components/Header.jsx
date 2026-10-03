import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { navigation, site } from '../data/site'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const desktopNavigation = navigation.filter(
    (item) => item.label !== 'FAQ'
  )

  return (
    <>
      <header
        className={`site-header ${scrolled ? 'is-scrolled' : ''} ${
          menuOpen ? 'is-menu-open' : ''
        }`}
      >
        <div className="header-inner">

          <Link
            to="/"
            className="site-brand"
            onClick={closeMenu}
            aria-label={`${site.brand} home`}
          >
            <span className="site-brand-mark">N</span>

            <span className="site-brand-text">
              <strong>{site.brand}</strong>
              <small>REAL ESTATE</small>
            </span>
          </Link>


          <nav
            className="desktop-navigation"
            aria-label="Primary navigation"
          >
            {desktopNavigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `desktop-nav-link ${isActive ? 'active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>


          <div className="header-right">

            <a
              href={`tel:${site.phone.replace(/\s/g, '')}`}
              className="header-phone"
              aria-label={`Call ${site.phone}`}
            >
              <span aria-hidden="true">⌕</span>
            </a>

            <Link
              to="/contact"
              className="header-enquire"
            >
              <span>Enquire Now</span>
              <strong>↗</strong>
            </Link>

            <button
              type="button"
              className="header-menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              <span />
              <span />
              <span />
            </button>

          </div>

        </div>
      </header>


      <div
        className={`mobile-navigation-overlay ${
          menuOpen ? 'active' : ''
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />


      <aside
        id="mobile-navigation"
        className={`mobile-navigation-drawer ${
          menuOpen ? 'active' : ''
        }`}
        aria-hidden={!menuOpen}
      >

        <div className="mobile-drawer-header">

          <Link
            to="/"
            className="site-brand"
            onClick={closeMenu}
          >
            <span className="site-brand-mark">N</span>

            <span className="site-brand-text">
              <strong>{site.brand}</strong>
              <small>REAL ESTATE</small>
            </span>
          </Link>

          <button
            type="button"
            className="mobile-drawer-close"
            onClick={closeMenu}
            aria-label="Close navigation menu"
          >
            ×
          </button>

        </div>


        <div className="mobile-navigation-label">
          NAVIGATION
        </div>


        <nav className="mobile-navigation-links">

          {navigation.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `mobile-navigation-link ${
                  isActive ? 'active' : ''
                }`
              }
            >
              <span>{item.label}</span>

              <small>
                {String(index + 1).padStart(2, '0')}
              </small>
            </NavLink>
          ))}

        </nav>


        <div className="mobile-drawer-bottom">

          <Link
            to="/contact"
            className="mobile-drawer-cta"
            onClick={closeMenu}
          >
            <span>Start a Conversation</span>
            <strong>↗</strong>
          </Link>

          <div className="mobile-drawer-contact">

            <a
              href={`tel:${site.phone.replace(/\s/g, '')}`}
            >
              {site.phone}
            </a>

            <a href={`mailto:${site.email}`}>
              {site.email}
            </a>

          </div>

        </div>

      </aside>
    </>
  )
}

export default Header