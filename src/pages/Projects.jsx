import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import { projects } from '../data/site'

const projectFilters = {
  status: [
    'All',
    'Upcoming',
    'Ongoing',
    'Completed',
    'Ready to Move',
    'New Launch'
  ],
  type: [
    'All',
    'Villas',
    'Apartments',
    'Plots',
    'Residences'
  ]
}

const categoryStrips = [
  {
    title: 'Villas',
    text: 'Private residences designed around space, comfort and refined living.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85'
  },
  {
    title: 'Apartments',
    text: 'Contemporary homes with practical layouts and connected city living.',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=85'
  },
  {
    title: 'Plots',
    text: 'Well-positioned land opportunities for building your future.',
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=85'
  }
]

const statusClass = {
  Upcoming: 'projects-status--upcoming',
  Ongoing: 'projects-status--ongoing',
  Completed: 'projects-status--completed',
  'Ready to Move': 'projects-status--completed',
  'New Launch': 'projects-status--upcoming'
}

function getProjectCategory(project) {
  const type = project.type?.toLowerCase() || ''
  const name = project.name?.toLowerCase() || ''
  const configuration =
    project.configuration?.toLowerCase() || ''

  const combined =
    `${type} ${name} ${configuration}`.trim()

  if (
    combined.includes('villa') ||
    combined.includes('bungalow')
  ) {
    return 'Villas'
  }

  if (
    combined.includes('apartment') ||
    combined.includes('flat')
  ) {
    return 'Apartments'
  }

  if (
    combined.includes('plot') ||
    combined.includes('land')
  ) {
    return 'Plots'
  }

  return 'Residences'
}

function matchesProjectFilters(
  project,
  statusFilter,
  typeFilter
) {
  const statusMatch =
    statusFilter === 'All' ||
    project.status === statusFilter

  const category = getProjectCategory(project)

  const typeMatch =
    typeFilter === 'All' ||
    category === typeFilter

  return statusMatch && typeMatch
}

function Projects() {
  const [statusFilter, setStatusFilter] =
    useState('All')

  const [typeFilter, setTypeFilter] =
    useState('All')

  const projectsGridRef = useRef(null)

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      matchesProjectFilters(
        project,
        statusFilter,
        typeFilter
      )
    )
  }, [statusFilter, typeFilter])

  const featuredProject = projects[0]

  const handleCategoryFilter = (category) => {
    setTypeFilter(category)

    requestAnimationFrame(() => {
      projectsGridRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    })
  }

  return (
    <>
      <Seo
        title="Projects"
        description="Browse upcoming, ongoing and completed villa, apartment and plot projects with configurations, highlights and locations."
        image="/images/projects/greenfield-apartments.webp"
        path="/projects"
      />

      <Header />

      <main className="projects-page">

        <section className="projects-banner">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=85"
            srcSet="
              https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85 1200w,
              https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85 1800w,
              https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=85 2200w
            "
            sizes="100vw"
            alt="Modern luxury residential project"
            width="2200"
            height="1200"
          />

          <div className="projects-banner__overlay" />

          <div className="projects-container projects-banner__content">
            <span className="projects-eyebrow">
              OUR DEVELOPMENTS
            </span>

            <h1>
              Projects
            </h1>

            <p>
              Explore thoughtfully designed homes and property
              opportunities across prime locations.
            </p>

            <nav
              className="projects-breadcrumb"
              aria-label="Breadcrumb"
            >
              <Link to="/">
                Home
              </Link>

              <span aria-hidden="true">
                /
              </span>

              <span>
                Projects
              </span>
            </nav>
          </div>
        </section>

        <section className="projects-filter-section" data-animate="fade-up">
          <div className="projects-container">

            <div className="projects-filter-group">
              <span className="projects-filter-label">
                PROJECT STATUS
              </span>

              <div
                className="projects-filter-tabs"
                role="group"
                aria-label="Filter projects by status"
              >
                {projectFilters.status.map(
                  (filter) => (
                    <button
                      key={filter}
                      type="button"
                      className={
                        statusFilter === filter
                          ? 'projects-filter-tab active'
                          : 'projects-filter-tab'
                      }
                      aria-pressed={
                        statusFilter === filter
                      }
                      onClick={() =>
                        setStatusFilter(filter)
                      }
                    >
                      {filter}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="projects-filter-group">
              <span className="projects-filter-label">
                PROPERTY TYPE
              </span>

              <div
                className="projects-filter-tabs"
                role="group"
                aria-label="Filter projects by property type"
              >
                {projectFilters.type.map(
                  (filter) => (
                    <button
                      key={filter}
                      type="button"
                      className={
                        typeFilter === filter
                          ? 'projects-filter-tab active'
                          : 'projects-filter-tab'
                      }
                      aria-pressed={
                        typeFilter === filter
                      }
                      onClick={() =>
                        setTypeFilter(filter)
                      }
                    >
                      {filter}
                    </button>
                  )
                )}
              </div>
            </div>

          </div>
        </section>

        <section className="projects-featured" data-animate="fade-up">
          <div className="projects-container">

            <div className="projects-section-intro">
              <span className="projects-section-label">
                FEATURED PROJECT
              </span>

              <h2>
                A closer look at
                <br />
                <em>something special.</em>
              </h2>
            </div>

            {featuredProject && (
              <article className="projects-featured-card">

                <div className="projects-featured-image">
                  <img
                    src={featuredProject.image}
                    srcSet={`${featuredProject.image} 1200w`}
                    sizes="(max-width: 900px) 100vw, 55vw"
                    alt={`${featuredProject.name} luxury residential project in ${featuredProject.location}`}
                    width="1600"
                    height="900"
                  />

                  <span
                    className={`projects-status ${
                      statusClass[
                        featuredProject.status
                      ] ||
                      'projects-status--ongoing'
                    }`}
                  >
                    {featuredProject.status}
                  </span>
                </div>

                <div className="projects-featured-content">

                  <span className="projects-location">
                    {featuredProject.location}
                  </span>

                  <h2>
                    {featuredProject.name}
                  </h2>

                  <p className="projects-featured-description">
                    {featuredProject.description}
                  </p>

                  <div className="projects-featured-meta">
                    <div>
                      <span>
                        CONFIGURATION
                      </span>

                      <strong>
                        {featuredProject.configuration}
                      </strong>
                    </div>

                    <div>
                      <span>
                        AREA
                      </span>

                      <strong>
                        {featuredProject.area}
                      </strong>
                    </div>
                  </div>

                  <ul className="projects-highlights">
                    {featuredProject.highlights
                      ?.slice(0, 3)
                      .map((highlight) => (
                        <li key={highlight}>
                          <span aria-hidden="true">
                            ✓
                          </span>

                          {highlight}
                        </li>
                      ))}
                  </ul>

                  <Link
                    to={`/projects/${featuredProject.id}`}
                    className="projects-button projects-button--gold"
                    aria-label={`View ${featuredProject.name} project`}
                  >
                    View Project

                    <span aria-hidden="true">
                      →
                    </span>
                  </Link>

                </div>

              </article>
            )}

          </div>
        </section>

        <section
          className="projects-grid-section"
          ref={projectsGridRef}
        >
          <div className="projects-container">

            <div className="projects-section-heading">

              <div>
                <span className="projects-section-label">
                  ALL PROJECTS
                </span>

                <h2>
                  Find a place
                  <br />
                  <em>that feels right.</em>
                </h2>
              </div>

              <span className="projects-result-count">
                {filteredProjects.length}{' '}
                {filteredProjects.length === 1
                  ? 'Project'
                  : 'Projects'}
              </span>

            </div>

            <div className="projects-grid">

              {filteredProjects.map(
                (project) => (
                  <article
                    className="projects-card"
                    data-animate="fade-up"
                    key={project.id}
                  >

                    <Link
                      to={`/projects/${project.id}`}
                      className="projects-card__image"
                      aria-label={`View ${project.name}`}
                    >
                      <img
                        src={project.image}
                        srcSet={`${project.image} 1200w`}
                        sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"
                        alt={`${project.name} in ${project.location}`}
                        width="1200"
                        height="750"
                        loading="lazy"
                      />

                      <div className="projects-card__gradient" />

                      <div className="projects-card__image-info">

                        <span
                          className={`projects-status ${
                            statusClass[
                              project.status
                            ] ||
                            'projects-status--ongoing'
                          }`}
                        >
                          {project.status}
                        </span>

                        <h3>
                          {project.name}
                        </h3>

                      </div>
                    </Link>

                    <div className="projects-card__content">

                      <span className="projects-location">
                        {project.location}
                      </span>

                      <div className="projects-card__title-row">

                        <h3>
                          {project.name}
                        </h3>

                        <span className="projects-card__type">
                          {getProjectCategory(
                            project
                          )}
                        </span>

                      </div>

                      <strong className="projects-card__configuration">
                        {project.configuration}
                      </strong>

                      <ul className="projects-card__highlights">
                        {project.highlights
                          ?.slice(0, 3)
                          .map(
                            (highlight) => (
                              <li key={highlight}>
                                {highlight}
                              </li>
                            )
                          )}
                      </ul>

                      <Link
                        to={`/projects/${project.id}`}
                        className="projects-card__link"
                        aria-label={`View details of ${project.name}`}
                      >
                        View Project

                        <span aria-hidden="true">
                          ↗
                        </span>
                      </Link>

                    </div>

                  </article>
                )
              )}

            </div>

            {filteredProjects.length === 0 && (
              <div className="projects-empty">
                <h3>
                  No projects found
                </h3>

                <p>
                  Try changing the status or property
                  type filter.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('All')
                    setTypeFilter('All')
                  }}
                  className="projects-button projects-button--gold"
                >
                  Reset Filters
                </button>
              </div>
            )}

          </div>
        </section>

        <section className="projects-categories" data-animate="fade-up">
          <div className="projects-container">

            <div className="projects-section-heading projects-section-heading--center">
              <span className="projects-section-label">
                EXPLORE BY TYPE
              </span>

              <h2>
                Choose your
                <br />
                <em>kind of space.</em>
              </h2>
            </div>

            <div className="projects-category-grid">

              {categoryStrips.map(
                (category) => (
                  <article
                    className="projects-category-strip"
                    key={category.title}
                  >

                    <img
                      src={category.image}
                      alt={`${category.title} real estate properties`}
                      width="1800"
                      height="600"
                      loading="lazy"
                    />

                    <div className="projects-category-overlay" />

                    <div className="projects-category-content">

                      <span>
                        PROPERTY TYPE
                      </span>

                      <h3>
                        {category.title}
                      </h3>

                      <p>
                        {category.text}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleCategoryFilter(
                            category.title
                          )
                        }
                        aria-label={`View ${category.title} projects`}
                      >
                        View {category.title}

                        <span aria-hidden="true">
                          →
                        </span>
                      </button>

                    </div>

                  </article>
                )
              )}

            </div>

          </div>
        </section>

        <section className="projects-cta" data-animate="zoom-in">
          <div className="projects-container projects-cta__inner">

            <div>
              <span className="projects-eyebrow">
                NEED SOME GUIDANCE?
              </span>

              <h2>
                Not sure which
                <br />
                project suits you?
              </h2>

              <p>
                Tell us what you are looking for and our team
                can help you explore the right options.
              </p>
            </div>

            <div className="projects-cta__actions">

              <Link
                to="/contact"
                className="projects-button projects-button--gold"
              >
                Enquire Now

                <span aria-hidden="true">
                  →
                </span>
              </Link>

              <Link
                to="/contact"
                className="projects-button projects-button--outline"
              >
                Contact Us
              </Link>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}

export default Projects