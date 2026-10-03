import { Link } from 'react-router-dom'
import { navigation, projects, site } from '../data/site'

function Footer() {
  const quickLinks = navigation.filter((item) =>
    ['Home', 'About', 'Projects', 'Locations', 'Gallery', 'Contact'].includes(
      item.label
    )
  )

  return (
    <footer className="site-footer">

      <div className="footer-main">

        <div className="footer-container footer-grid">

          {/* About */}
          <div className="footer-about">

            <Link to="/" className="footer-brand">
              <span className="footer-brand-mark">N</span>

              <span className="footer-brand-text">
                <strong>{site.brand}</strong>
                <small>REAL ESTATE</small>
              </span>
            </Link>

            <p>
              Thoughtfully designed homes in carefully selected locations,
              created around quality, comfort and better living.
            </p>

            <div className="footer-socials">

              <a
                href={site.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                IG
              </a>

              <a
                href={site.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                FB
              </a>

              <a
                href={site.social.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                YT
              </a>

              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                IN
              </a>

            </div>

          </div>


          {/* Quick Links */}
          <div className="footer-column">

            <span className="footer-column-title">
              QUICK LINKS
            </span>

            <nav className="footer-links">

              {quickLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                >
                  {item.label}
                </Link>
              ))}

            </nav>

          </div>


          {/* Projects */}
          <div className="footer-column">

            <span className="footer-column-title">
              PROJECTS
            </span>

            <nav className="footer-links">

              {projects.slice(0, 4).map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                >
                  {project.name}
                </Link>
              ))}

            </nav>

          </div>


          {/* Contact */}
          <div className="footer-column footer-contact">

            <span className="footer-column-title">
              CONTACT
            </span>

            <div className="footer-contact-block">

              <span className="footer-contact-label">
                OFFICE
              </span>

              <p>{site.address}</p>

            </div>


            <div className="footer-contact-block">

              <span className="footer-contact-label">
                PHONE
              </span>

              <a
                href={`tel:${site.phone.replace(/\s/g, '')}`}
              >
                {site.phone}
              </a>

            </div>


            <div className="footer-contact-block">

              <span className="footer-contact-label">
                EMAIL
              </span>

              <a href={`mailto:${site.email}`}>
                {site.email}
              </a>

            </div>


            <div className="footer-contact-block">

              <span className="footer-contact-label">
                WORKING HOURS
              </span>

              <p>
                Monday — Saturday
                <br />
                09:00 AM — 06:00 PM
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* Footer Bottom */}
      <div className="footer-bottom">

        <div className="footer-container footer-bottom-inner">

          <p>
            © {new Date().getFullYear()} {site.brand}.
            All rights reserved.
          </p>

          <div className="footer-legal">

            <Link to="/privacy">
              Privacy Policy
            </Link>

            <span>•</span>

            <Link to="/terms">
              Terms
            </Link>

          </div>

        </div>

      </div>

    </footer>
  )
}

export default Footer