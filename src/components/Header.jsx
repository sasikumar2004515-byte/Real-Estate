import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Search } from 'lucide-react'
import { navigation, site } from '../data/site'
import SearchOverlay from './SearchOverlay'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

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

  useEffect(() => {
    const handleShortcut = (event) => {
      const tag = (event.target.tagName || '').toLowerCase()
      const typing =
        tag === 'input' || tag === 'textarea' || tag === 'select' || event.target.isContentEditable

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      } else if (event.key === '/' && !typing) {
        event.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

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

            <button
              type="button"
              className="header-phone header-search"
              onClick={() => setSearchOpen(true)}
              aria-label="Search the website"
              aria-haspopup="dialog"
              title="Search ( / )"
            >
              <Search size={17} strokeWidth={1.8} aria-hidden="true" />
            </button>

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


        <button
          type="button"
          className="mobile-search-trigger"
          onClick={() => {
            closeMenu()
            setSearchOpen(true)
          }}
        >
          <Search size={18} strokeWidth={1.8} aria-hidden="true" />
          <span>Search the website</span>
        </button>

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

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  )
}

export default Header