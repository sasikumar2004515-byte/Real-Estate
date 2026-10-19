import { Link } from 'react-router-dom'

const statusClass = (status) => status.toLowerCase().replace(/\s+/g, '-')

function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  )
}

function ProjectCard({ p }) {
  return (
    <article className="fp-card">
      <div className="fp-img">
        <img src={p.image} alt={p.name} loading="lazy" draggable="false" />
        <span className={`fp-status fp-status--${statusClass(p.status)}`}>{p.status}</span>
        <span className="fp-type">
          <Icon>
            <path d="m12 3 9 5-9 5-9-5 9-5Z" />
            <path d="m3 13 9 5 9-5" />
            <path d="m3 17.5 9 5 9-5" />
          </Icon>
          {p.type}
        </span>
        <div className="fp-facts">
          <span>{p.configuration}</span>
          <span>{p.area}</span>
        </div>
      </div>

      <div className="fp-body">
        <div className="fp-top">
          <span className="fp-loc">
            <Icon>
              <path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11Z" />
              <circle cx="12" cy="10" r="2.2" />
            </Icon>
            <span>{p.location}, Chennai</span>
          </span>
          <span className="fp-price">{p.price}</span>
        </div>
        <h3>{p.name}</h3>
        <p className="fp-desc">{p.description}</p>
        <div className="fp-tags">
          {p.highlights.slice(0, 3).map((h) => (
            <span key={h}>
              <Icon>
                <path d="M3 12V4h8l10 10-8 8L3 12Z" />
                <circle cx="7.5" cy="8.5" r="1.2" />
              </Icon>
              {h}
            </span>
          ))}
        </div>
        <Link to={`/projects/${p.id}`} className="fp-link">
          View project details
          <Icon>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </Icon>
        </Link>
      </div>
    </article>
  )
}

export default ProjectCard
