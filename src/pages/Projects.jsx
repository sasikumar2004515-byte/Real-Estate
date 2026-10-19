import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Wave from '../components/Wave'
import FeaturedProjects from '../components/home/FeaturedProjects'
import ProjectCard from '../components/home/ProjectCard'
import CtaBand from '../components/CtaBand'
import { projects } from '../data/site'
import { getProjectCategory } from '../utils/category'

const categoryStrips = [
  {
    title: 'Villas',
    text: 'Private residences designed around space, comfort and refined living.',
    image: '/images/projects/palm-grove.webp',
  },
  {
    title: 'Apartments',
    text: 'Contemporary homes with practical layouts and connected city living.',
    image: '/images/projects/greenfield-apartments.webp',
  },
  {
    title: 'Plots',
    text: 'Well-positioned land opportunities for building your future.',
    image: '/images/projects/lakeside-residences.webp',
  },
]

const statusFilters = ['All', ...new Set(projects.map((p) => p.status))]
const typeFilters = ['All', ...new Set(projects.map(getProjectCategory))]
const featured = projects.slice(0, 4)

function Projects({ initialStatus, initialType }) {
  const [statusFilter, setStatusFilter] = useState(initialStatus)
  const [typeFilter, setTypeFilter] = useState(initialType)
  const gridRef = useRef(null)

  useEffect(() => {
    if (initialStatus === 'All' && initialType === 'All') return
    gridRef.current?.scrollIntoView({ block: 'start' })
  }, [initialStatus, initialType])

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (statusFilter === 'All' || p.status === statusFilter) &&
          (typeFilter === 'All' || getProjectCategory(p) === typeFilter)
      ),
    [statusFilter, typeFilter]
  )

  const pickCategory = (title) => {
    setTypeFilter(title)
    setStatusFilter('All')
    requestAnimationFrame(() =>
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    )
  }

  return (
    <>
      <Header />
      <main className="pj" data-own>
        <section className="lx-hero">
          <img src="/images/projects/showcase-hero.webp" alt="Nivora residence at dusk" />
          <div className="lx-wrap">
            <Wave className="lx-crumbs">
              <Link to="/">Home</Link>
              <span>/</span>
              <span>Projects</span>
            </Wave>
            <Wave d={1}>
              <p className="lx-kicker">The collection</p>
            </Wave>
            <Wave d={2} as="h1" className="lx-h1">
              Homes made <em>to be lived in.</em>
            </Wave>
            <Wave d={3} as="p" className="lx-sub">
              Villas, apartments and luxury residences across Chennai, each placed for light, access
              and long-term value.
            </Wave>
            <Wave d={4} className="lx-row">
              <a href="#all-projects" className="lx-btn">
                View all projects <i>↓</i>
              </a>
              <Link to="/contact" className="lx-btn lx-btn--ghost">
                Book a site visit
              </Link>
            </Wave>
          </div>
          <div className="lx-scrollcue" aria-hidden="true">
            <i />
            Scroll
          </div>
        </section>

        <FeaturedProjects
          items={featured}
          kicker="Featured projects"
          title="Signature addresses."
          showAll={false}
        />

        <section className="lx-section pj-all" id="all-projects" ref={gridRef}>
          <div className="lx-wrap">
            <Wave className="pj-head pj-head--dark">
              <div>
                <p className="lx-kicker">All projects</p>
                <h2 className="lx-title lx-title--light">
                  Find your <em>residence.</em>
                </h2>
              </div>
              <p className="pj-found">
                <b>{String(filtered.length).padStart(2, '0')}</b> of {projects.length} homes
              </p>
            </Wave>

            <Wave d={1} className="pj-filters">
              <div>
                <span>Status</span>
                {statusFilters.map((f) => (
                  <button
                    key={f}
                    className={f === statusFilter ? 'on' : ''}
                    onClick={() => setStatusFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div>
                <span>Type</span>
                {typeFilters.map((f) => (
                  <button
                    key={f}
                    className={f === typeFilter ? 'on' : ''}
                    onClick={() => setTypeFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </Wave>

            {filtered.length === 0 ? (
              <div className="pj-empty">
                <h3>Nothing matches just yet.</h3>
                <p>
                  New launches are added regularly. Tell us what you are looking for and we will let
                  you know first.
                </p>
                <div className="lx-row" style={{ justifyContent: 'center' }}>
                  <button
                    className="lx-btn lx-btn--ghost"
                    onClick={() => {
                      setStatusFilter('All')
                      setTypeFilter('All')
                    }}
                  >
                    Clear filters
                  </button>
                  <Link to="/contact" className="lx-btn">
                    Talk to our team <i>→</i>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="fp-grid">
                {filtered.map((p, i) => (
                  <Wave d={i % 3} key={p.id}>
                    <ProjectCard p={p} />
                  </Wave>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="lx-section lx-section--ivory pj-cats">
          <div className="lx-wrap">
            <Wave className="lx-center">
              <p className="lx-kicker lx-kicker--dark">Browse by type</p>
              <h2 className="lx-title">
                Choose how you <em>want to live.</em>
              </h2>
            </Wave>
            <div className="pj-cat-row">
              {categoryStrips.map((c, i) => (
                <Wave d={i} key={c.title} className="pj-cat-wrap">
                  <button className="pj-cat" onClick={() => pickCategory(c.title)}>
                    <img src={c.image} alt="" loading="lazy" />
                    <span className="pj-cat-no">0{i + 1}</span>
                    <span className="pj-cat-text">
                      <b>{c.title}</b>
                      <small>{c.text}</small>
                      <em>View {c.title.toLowerCase()} →</em>
                    </span>
                  </button>
                </Wave>
              ))}
            </div>
          </div>
        </section>

        <CtaBand
          image="/images/about/about-hero.webp"
          title="Not sure where to start?"
          text="Tell us your budget, location and the kind of home you imagine. We will shortlist the right projects."
          primary={{ label: 'Speak to our team', to: '/contact' }}
          secondary={{ label: 'Explore locations', to: '/locations' }}
          items={['Tell us your budget', 'Choose a location', 'We shortlist for you']}
        />
      </main>
      <Footer />
    </>
  )
}

function ProjectsPage() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const status = params.get('status')
  const type = params.get('type')

  return (
    <Projects
      key={search}
      initialStatus={statusFilters.includes(status) ? status : 'All'}
      initialType={typeFilters.includes(type) ? type : 'All'}
    />
  )
}

export default ProjectsPage
