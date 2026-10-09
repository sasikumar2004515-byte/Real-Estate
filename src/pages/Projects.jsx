import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Wave from '../components/Wave'
import { projects } from '../data/site'

const categoryStrips = [
  { title: 'Villas', text: 'Private residences designed around space, comfort and refined living.', image: '/images/projects/palm-grove.webp' },
  { title: 'Apartments', text: 'Contemporary homes with practical layouts and connected city living.', image: '/images/projects/greenfield-apartments.webp' },
  { title: 'Plots', text: 'Well-positioned land opportunities for building your future.', image: '/images/projects/lakeside-residences.webp' },
]

function getProjectCategory(project) {
  const combined = `${project.type || ''} ${project.name || ''} ${project.configuration || ''}`.toLowerCase()
  if (combined.includes('villa') || combined.includes('bungalow')) return 'Villas'
  if (combined.includes('apartment') || combined.includes('flat')) return 'Apartments'
  if (combined.includes('plot') || combined.includes('land')) return 'Plots'
  return 'Residences'
}

const statusFilters = ['All', ...new Set(projects.map((p) => p.status))]
const typeFilters = ['All', ...new Set(projects.map(getProjectCategory))]
const featured = projects.slice(0, 4)

function Projects() {
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [spot, setSpot] = useState(0)
  const [paused, setPaused] = useState(false)
  const gridRef = useRef(null)

  const filtered = useMemo(
    () => projects.filter((p) => (statusFilter === 'All' || p.status === statusFilter) && (typeFilter === 'All' || getProjectCategory(p) === typeFilter)),
    [statusFilter, typeFilter]
  )

  useEffect(() => {
    if (paused) return undefined
    const t = setInterval(() => setSpot((s) => (s + 1) % featured.length), 7000)
    return () => clearInterval(t)
  }, [paused])

  const pickCategory = (title) => {
    setTypeFilter(title)
    setStatusFilter('All')
    requestAnimationFrame(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const sp = featured[spot]

  return (
    <>
      <Header />
      <main className="pj" data-own>
        {/* hero */}
        <section className="lx-hero">
          <img src="/images/projects/showcase-hero.webp" alt="Nivora residence at dusk" />
          <div className="lx-wrap">
            <Wave className="lx-crumbs"><Link to="/">Home</Link><span>/</span><span>Projects</span></Wave>
            <Wave d={1}><p className="lx-kicker">The collection</p></Wave>
            <Wave d={2} as="h1" className="lx-h1">Homes made <em>to be lived in.</em></Wave>
            <Wave d={3} as="p" className="lx-sub">Villas, apartments and luxury residences across Chennai, each placed for light, access and long-term value.</Wave>
            <Wave d={4} className="lx-row">
              <a href="#all-projects" className="lx-btn">View all projects <i>↓</i></a>
              <Link to="/contact" className="lx-btn lx-btn--ghost">Book a site visit</Link>
            </Wave>
          </div>
          <div className="lx-scrollcue" aria-hidden="true"><i />Scroll</div>
        </section>

        {/* featured */}
        <section className="lx-section lx-section--navy pj-feat" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="lx-wrap">
            <Wave className="pj-head">
              <div>
                <p className="lx-kicker">Featured projects</p>
                <h2 className="lx-title lx-title--light">Signature <em>addresses.</em></h2>
              </div>
              <span className="pj-counter">{String(spot + 1).padStart(2, '0')} <i /> {String(featured.length).padStart(2, '0')}</span>
            </Wave>

            <div className="pj-stage" key={sp.id}>
              <div className="pj-stage-img">
                <img src={sp.image} alt={sp.name} />
                <span className="pj-stage-badge">{sp.status}</span>
                <span className="pj-stage-glow" />
              </div>
              <div className="pj-stage-info">
                <p className="pj-stage-loc">{sp.location} · {getProjectCategory(sp)}</p>
                <h3>{sp.name}</h3>
                <p className="pj-stage-desc">{sp.description}</p>
                <dl className="pj-stage-facts">
                  <div><dt>Configuration</dt><dd>{sp.configuration}</dd></div>
                  <div><dt>Area</dt><dd>{sp.area}</dd></div>
                  <div><dt>Starting price</dt><dd className="gold">{sp.price}</dd></div>
                </dl>
                <ul className="pj-stage-tags">{sp.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
                <div className="lx-row">
                  <Link to={`/projects/${sp.id}`} className="lx-btn">Explore project <i>→</i></Link>
                  <Link to="/contact" className="lx-btn lx-btn--ghost">Enquire now</Link>
                </div>
              </div>
            </div>

            <div className="pj-thumbs" role="tablist">
              {featured.map((p, i) => (
                <button key={p.id} role="tab" aria-selected={i === spot} className={i === spot ? 'on' : ''} onClick={() => setSpot(i)}>
                  <img src={p.image} alt="" loading="lazy" />
                  <span><b>{p.name}</b><small>{p.location}</small></span>
                  <i className="pj-thumb-bar" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* all projects */}
        <section className="lx-section pj-all" id="all-projects" ref={gridRef}>
          <div className="lx-wrap">
            <Wave className="pj-head pj-head--dark">
              <div>
                <p className="lx-kicker">All projects</p>
                <h2 className="lx-title lx-title--light">Find your <em>residence.</em></h2>
              </div>
              <p className="pj-found"><b>{String(filtered.length).padStart(2, '0')}</b> of {projects.length} homes</p>
            </Wave>

            <Wave d={1} className="pj-filters">
              <div>
                <span>Status</span>
                {statusFilters.map((f) => <button key={f} className={f === statusFilter ? 'on' : ''} onClick={() => setStatusFilter(f)}>{f}</button>)}
              </div>
              <div>
                <span>Type</span>
                {typeFilters.map((f) => <button key={f} className={f === typeFilter ? 'on' : ''} onClick={() => setTypeFilter(f)}>{f}</button>)}
              </div>
            </Wave>

            {filtered.length === 0 ? (
              <div className="pj-empty">
                <h3>Nothing matches just yet.</h3>
                <p>New launches are added regularly. Tell us what you are looking for and we will let you know first.</p>
                <div className="lx-row" style={{ justifyContent: 'center' }}>
                  <button className="lx-btn lx-btn--ghost" onClick={() => { setStatusFilter('All'); setTypeFilter('All') }}>Clear filters</button>
                  <Link to="/contact" className="lx-btn">Talk to our team <i>→</i></Link>
                </div>
              </div>
            ) : (
              <div className="pj-grid">
                {filtered.map((p, i) => (
                  <Wave d={i % 3} key={p.id} className="pj-card-wrap">
                    <Link to={`/projects/${p.id}`} className="pj-card">
                      <img src={p.image} alt={p.name} loading="lazy" />
                      <span className="pj-card-badge">{p.status}</span>
                      <span className="pj-card-price">{p.price}</span>
                      <div className="pj-card-body">
                        <p>{p.location} · {getProjectCategory(p)}</p>
                        <h3>{p.name}</h3>
                        <div className="pj-card-more">
                          <div>
                            <span>{p.configuration}</span>
                            <span>{p.area}</span>
                            <ul>{p.highlights.slice(0, 3).map((h) => <li key={h}>{h}</li>)}</ul>
                          </div>
                          <span className="lx-btn lx-btn--sm">View <i>→</i></span>
                        </div>
                      </div>
                    </Link>
                  </Wave>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* categories */}
        <section className="lx-section lx-section--ivory pj-cats">
          <div className="lx-wrap">
            <Wave className="lx-center">
              <p className="lx-kicker lx-kicker--dark">Browse by type</p>
              <h2 className="lx-title">Choose how you <em>want to live.</em></h2>
            </Wave>
            <div className="pj-cat-row">
              {categoryStrips.map((c, i) => (
                <Wave d={i} key={c.title} className="pj-cat-wrap">
                  <button className="pj-cat" onClick={() => pickCategory(c.title)}>
                    <img src={c.image} alt="" loading="lazy" />
                    <span className="pj-cat-no">0{i + 1}</span>
                    <span className="pj-cat-text"><b>{c.title}</b><small>{c.text}</small><em>View {c.title.toLowerCase()} →</em></span>
                  </button>
                </Wave>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="lx-cta" style={{ backgroundImage: 'url(/images/about/about-hero.webp)' }}>
          <div className="lx-wrap lx-center">
            <Wave><p className="lx-kicker">Your next address</p></Wave>
            <Wave d={1} as="h2" className="lx-title lx-title--light">Not sure where to start? <em>Let us guide you.</em></Wave>
            <Wave d={2} as="p" className="lx-lead lx-lead--light">Tell us your budget, location and the kind of home you imagine. We will shortlist the right projects.</Wave>
            <Wave d={3} className="lx-row" style={{ justifyContent: 'center', marginTop: 34 }}>
              <Link to="/contact" className="lx-btn">Speak to our team <i>→</i></Link>
              <Link to="/locations" className="lx-btn lx-btn--ghost">Explore locations</Link>
            </Wave>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Projects
