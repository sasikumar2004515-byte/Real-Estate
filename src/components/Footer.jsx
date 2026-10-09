import { Link } from 'react-router-dom'
import { navigation, projects, site } from '../data/site'

const social = [
  ['Instagram', 'https://instagram.com'],
  ['Facebook', 'https://facebook.com'],
  ['YouTube', 'https://youtube.com'],
  ['LinkedIn', 'https://linkedin.com'],
]

function Footer() {
  const digits = site.phone.replace(/[^\d+]/g, '')

  return (
    <footer className="nx-footer">
      <div className="nx-footer-grid">
        <div>
          <Link to="/" className="nx-brand"><b>N</b>{site.brand}</Link>
          <p>{site.tagline}</p>
        </div>
        <nav aria-label="Explore">
          <h3>Explore</h3>
          {navigation.map((item) => <Link key={item.path} to={item.path}>{item.label}</Link>)}
        </nav>
        <nav aria-label="Projects">
          <h3>Projects</h3>
          {projects.slice(0, 5).map((p) => <Link key={p.id} to={`/projects/${p.id}`}>{p.name}</Link>)}
        </nav>
        <div>
          <h3>Contact</h3>
          <a href={`tel:${digits}`}>{site.phone}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(site.address)}`} target="_blank" rel="noreferrer">{site.address}</a>
        </div>
      </div>
      <div className="nx-footer-base">
        <span>© {new Date().getFullYear()} {site.brand}. All rights reserved.</span>
        <div className="nx-social">
          {social.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer">{name}</a>)}
        </div>
        <span>Privacy Policy · Terms</span>
      </div>
    </footer>
  )
}

export default Footer
