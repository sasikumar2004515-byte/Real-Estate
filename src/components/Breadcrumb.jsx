import { Link } from 'react-router-dom'

/**
 * Breadcrumb - items: [{ label, to? }]. Last item = current page.
 * Positioned over the hero image (see .site-breadcrumb in animation.css).
 */
function Breadcrumb({ items = [] }) {
  return (
    <nav className="site-breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const last = index === items.length - 1

          return (
            <li key={item.label}>
              {last || !item.to ? (
                <span aria-current={last ? 'page' : undefined}>{item.label}</span>
              ) : (
                <Link to={item.to}>{item.label}</Link>
              )}
              {!last && <span aria-hidden="true" className="site-breadcrumb-sep">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
