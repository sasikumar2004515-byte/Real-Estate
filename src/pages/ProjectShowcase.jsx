import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import { projects } from '../data/site'
import {
  secondsUntilNextEnquiry,
  submitEnquiry,
  validateEnquiry,
} from '../utils/enquiry'

const galleryFallbacks = [
  '/images/projects/palm-grove.webp',
  '/images/projects/lakeside-residences.webp',
  '/images/projects/urban-heights.webp',
]

const defaultAmenities = [
  '24/7 Security',
  'Landscaped Open Spaces',
  'Visitor Parking',
  'Community Spaces',
]

const locationGroups = [
  {
    title: 'Schools',
    items: ['Nearby schools and educational institutions'],
  },
  {
    title: 'Hospitals',
    items: ['Nearby hospitals and healthcare facilities'],
  },
  {
    title: 'Transport',
    items: ['Major roads, public transport and connectivity'],
  },
  {
    title: 'Business',
    items: ['Commercial areas, offices and everyday conveniences'],
  },
]

function ProjectShowcase() {
  const { id } = useParams()
  const project = projects.find((item) => item.id === id)

  const [activeImage, setActiveImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [planZoom, setPlanZoom] = useState(null)
  const [planType, setPlanType] = useState('floor')
  const [floorPlan, setFloorPlan] = useState(0)
  const [formStatus, setFormStatus] = useState('idle')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    visitDate: '',
    message: '',
  })

  const today = new Date().toISOString().split('T')[0]

  const galleryImages = useMemo(() => {
    if (!project) return []

    return [
      project.image,
      ...galleryFallbacks.filter((image) => image !== project.image),
    ]
  }, [project])

  const amenities = useMemo(() => {
    if (!project) return []

    return [
      ...(project.highlights || []),
      ...defaultAmenities,
    ]
      .filter(
        (item, index, array) =>
          item && array.indexOf(item) === index
      )
      .slice(0, 8)
  }, [project])

  const similarProjects = useMemo(() => {
    if (!project) return []

    return projects
      .filter(
        (item) =>
          item.id !== project.id &&
          item.type === project.type
      )
      .slice(0, 3)
  }, [project])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    })
  }, [id])

  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLightboxOpen(false)
      }

      if (event.key === 'ArrowRight') {
        setActiveImage(
          (current) => (current + 1) % galleryImages.length
        )
      }

      if (event.key === 'ArrowLeft') {
        setActiveImage(
          (current) =>
            (current - 1 + galleryImages.length) %
            galleryImages.length
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () =>
      window.removeEventListener(
        'keydown',
        handleKeyDown
      )
  }, [lightboxOpen, galleryImages.length])

  const handleFormChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const [formMessage, setFormMessage] = useState('')

  useEffect(() => {
    if (!planZoom) return undefined

    const onKey = (event) => {
      if (event.key === 'Escape') setPlanZoom(null)
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [planZoom])

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Honeypot filled = bot. Pretend success, send nothing.
    if (event.currentTarget.elements.website?.value) {
      setFormStatus('success')
      return
    }

    const errors = validateEnquiry({
      ...form,
      consent: true, // consent notice is shown under the form
    })
    const firstError = Object.values(errors)[0]

    if (firstError) {
      setFormMessage(firstError)
      setFormStatus('error')
      return
    }

    const wait = secondsUntilNextEnquiry()
    if (wait > 0) {
      setFormMessage(`Please wait ${wait} seconds before sending another enquiry.`)
      setFormStatus('error')
      return
    }

    setFormStatus('sending')

    try {
      await submitEnquiry({
        project: project?.name,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        visitDate: form.visitDate,
        message: form.message.trim(),
        source: 'project-showcase',
      })
      setFormStatus('success')
    } catch {
      setFormMessage('Something went wrong. Please try again or call us directly.')
      setFormStatus('error')
    }
  }

  if (!project) {
    return (
      <>
        <Header />

        <main className="showcase-not-found">
          <div>
            <p className="section-eyebrow">
              PROJECT NOT FOUND
            </p>

            <h1>Project unavailable</h1>

            <p>
              The project you are looking for could not
              be found.
            </p>

            <Link
              to="/projects"
              className="button button-gold"
            >
              Back to Projects
              <span>↗</span>
            </Link>
          </div>
        </main>

        <Footer />
      </>
    )
  }

  const currentImage =
    galleryImages[activeImage] || project.image

  return (
    <>
      <Seo
        title={`${project.name} in ${project.location}`}
        description={project.description}
        image={project.image}
        path={`/projects/${project.id}`}
      />

      <Header />

      <main className="showcase-page">

        {/* Hero */}

        <section className="showcase-hero">
          <img
            src={project.image}
            alt={`${project.name} exterior`}
            width="2200"
            height="1200"
            fetchPriority="high"
          />

          <div className="showcase-hero-overlay" />

          <div className="page-container showcase-hero-content">

            <nav
              className="showcase-breadcrumb reveal"
              aria-label="Breadcrumb"
            >
              <Link to="/">Home</Link>

              <span aria-hidden="true">/</span>

              <Link to="/projects">
                Projects
              </Link>

              <span aria-hidden="true">/</span>

              <span>{project.name}</span>
            </nav>

            <div className="showcase-hero-copy reveal">

              <span className="showcase-status">
                {project.status}
              </span>

              <p className="section-eyebrow">
                {project.location} · {project.type}
              </p>

              <h1>{project.name}</h1>

              <p className="showcase-hero-description">
                {project.description}
              </p>

              <div className="showcase-hero-actions">

                <a
                  href="#enquire"
                  className="button button-gold"
                >
                  Enquire Now
                  <span>↗</span>
                </a>

                <a
                  href="#overview"
                  className="button button-light-outline"
                >
                  Explore Project
                  <span>↓</span>
                </a>

              </div>
            </div>
          </div>

          <div className="showcase-hero-meta">

            <div className="showcase-meta-item">
              <span>CONFIGURATION</span>
              <strong>
                {project.configuration}
              </strong>
            </div>

            <div className="showcase-meta-item">
              <span>AREA</span>
              <strong>{project.area}</strong>
            </div>

            <div className="showcase-meta-item">
              <span>STARTING FROM</span>
              <strong>{project.price}</strong>
            </div>

            <div className="showcase-meta-item">
              <span>STATUS</span>
              <strong>{project.status}</strong>
            </div>

          </div>
        </section>


        {/* Overview */}

        <section
          id="overview"
          className="showcase-overview section-padding"
        >
          <div className="page-container">

            <div className="showcase-overview-grid">

              <div className="reveal">

                <p className="section-eyebrow">
                  PROJECT OVERVIEW
                </p>

                <h2>
                  A residence{' '}
                  <span>
                    designed around you.
                  </span>
                </h2>

              </div>

              <div className="showcase-overview-copy reveal">

                <p className="showcase-lead">
                  {project.description}
                </p>

                <p>
                  {project.name} brings together
                  considered spaces, contemporary
                  architecture and practical amenities
                  within a well-connected neighbourhood.
                </p>

                <p>
                  Every detail is planned to create a
                  comfortable residential experience
                  for modern families.
                </p>

              </div>

            </div>

            <div className="showcase-overview-facts reveal">

              <div className="showcase-fact">
                <span>LOCATION</span>
                <strong>{project.location}</strong>
              </div>

              <div className="showcase-fact">
                <span>PROPERTY TYPE</span>
                <strong>{project.type}</strong>
              </div>

              <div className="showcase-fact">
                <span>CONFIGURATION</span>
                <strong>{project.configuration}</strong>
              </div>

              <div className="showcase-fact">
                <span>STATUS</span>
                <strong>{project.status}</strong>
              </div>

            </div>

          </div>
        </section>


        {/* Gallery */}

        <section
          id="gallery"
          className="showcase-gallery section-padding"
        >
          <div className="page-container">

            <div className="showcase-gallery-heading reveal">

              <div>
                <p className="section-eyebrow">
                  VISUAL STORY
                </p>

                <h2>
                  See the{' '}
                  <span>possibility.</span>
                </h2>
              </div>

              <span className="showcase-gallery-count">
                {String(galleryImages.length).padStart(2, '0')}
                {' '}
                IMAGES
              </span>

            </div>

            <div className="showcase-gallery-grid">

              <button
                type="button"
                className="showcase-gallery-main reveal"
                onClick={() => {
                  setActiveImage(0)
                  setLightboxOpen(true)
                }}
                aria-label={`View ${project.name} gallery image`}
              >
                <img
                  src={galleryImages[0]}
                  alt={`${project.name} exterior`}
                  width="1400"
                  height="900"
                />

                <span>01</span>
              </button>

              <div className="showcase-gallery-side">

                {galleryImages
                  .slice(1, 3)
                  .map((image, index) => (
                    <button
                      type="button"
                      className="showcase-gallery-small reveal"
                      key={image}
                      onClick={() => {
                        setActiveImage(index + 1)
                        setLightboxOpen(true)
                      }}
                      aria-label={`View gallery image ${
                        index + 2
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${project.name} ${
                          index === 0
                            ? 'residence'
                            : 'lifestyle'
                        }`}
                        width="900"
                        height="600"
                        loading="lazy"
                      />

                      <span>
                        {String(index + 2).padStart(
                          2,
                          '0'
                        )}
                      </span>
                    </button>
                  ))}

              </div>

            </div>

          </div>
        </section>


        {/* Highlights */}

        <section className="showcase-highlights section-padding">
          <div className="page-container">

            <div className="showcase-highlights-grid">

              <div className="showcase-highlights-content reveal">

                <p className="section-eyebrow">
                  PROJECT HIGHLIGHTS
                </p>

                <h2>
                  Details that{' '}
                  <span>make a difference.</span>
                </h2>

                <p>
                  Carefully planned features that make
                  everyday living more comfortable and
                  convenient.
                </p>

              </div>

              <div className="showcase-highlight-list">

                {(project.highlights || [])
                  .slice(0, 8)
                  .map((highlight, index) => (
                    <div
                      className="showcase-highlight-item reveal"
                      key={highlight}
                    >
                      <span className="showcase-highlight-number">
                        {String(index + 1).padStart(
                          2,
                          '0'
                        )}
                      </span>

                      <strong>{highlight}</strong>
                    </div>
                  ))}

              </div>

            </div>

          </div>
        </section>


        {/* Amenities */}

        <section
          id="amenities"
          className="showcase-amenities section-padding"
        >
          <div className="page-container">

            <div className="showcase-amenities-grid">

              <div className="showcase-amenity-list">

                {amenities.map((amenity, index) => (
                  <article
                    className="showcase-amenity reveal"
                    key={amenity}
                  >
                    <span className="showcase-amenity-number">
                      {String(index + 1).padStart(
                        2,
                        '0'
                      )}
                    </span>

                    <strong>{amenity}</strong>
                  </article>
                ))}

              </div>

              <div className="showcase-amenities-content reveal">

                <p className="section-eyebrow">
                  AMENITIES
                </p>

                <h2>
                  Designed for{' '}
                  <span>everyday life.</span>
                </h2>

                <p>
                  Spaces and facilities created around
                  comfort, convenience and community.
                </p>

              </div>

            </div>

          </div>
        </section>


        {/* Plans */}

        <section
          id="plans"
          className="showcase-plans section-padding"
        >
          <div className="page-container">

            <div className="showcase-plans-heading reveal">

              <p className="section-eyebrow">
                PLANS
              </p>

              <h2>
                Understand the{' '}
                <span>space.</span>
              </h2>

            </div>

            <div className="showcase-plan-switcher">

              <button
                type="button"
                className={
                  planType === 'floor'
                    ? 'is-active'
                    : ''
                }
                onClick={() => setPlanType('floor')}
              >
                Floor Plans
              </button>

              <button
                type="button"
                className={
                  planType === 'master'
                    ? 'is-active'
                    : ''
                }
                onClick={() => setPlanType('master')}
              >
                Master Plan
              </button>

            </div>

            <div className="showcase-plans-grid">

              {planType === 'floor' ? (
                <>
                  <article className="showcase-plan-card reveal">

                    <div className="showcase-plan-heading">

                      <div>
                        <p className="section-eyebrow">
                          FLOOR PLAN
                        </p>

                        <h3>
                          Thoughtfully planned
                          spaces.
                        </h3>
                      </div>

                      <span>01</span>

                    </div>

                    <button
                      type="button"
                      className="plan-image-button"
                      onClick={() =>
                        setPlanZoom({
                          src: '/images/projects/floor-plan.webp',
                          alt: 'Illustrative 3 BHK floor plan',
                        })
                      }
                      aria-label="Enlarge floor plan"
                    >
                      <img
                        src="/images/projects/floor-plan.webp"
                        alt="Illustrative 3 BHK floor plan with room dimensions"
                        loading="lazy"
                        width="1920"
                        height="1072"
                      />
                      <span className="plan-image-hint">Click to enlarge</span>
                    </button>

                    <p className="plan-image-note">
                      Illustrative layout. Final approved plans are shared during enquiry.
                    </p>

                  </article>

                  <article className="showcase-plan-card reveal">

                    <div className="showcase-plan-heading">

                      <div>
                        <p className="section-eyebrow">
                          PLAN TYPE
                        </p>

                        <h3>
                          Explore layouts.
                        </h3>
                      </div>

                      <span>02</span>

                    </div>

                    <div className="plan-selector">

                      {[
                        '2 BHK',
                        '3 BHK',
                        '4 BHK',
                      ].map((item, index) => (
                        <button
                          type="button"
                          key={item}
                          className={
                            floorPlan === index
                              ? 'is-active'
                              : ''
                          }
                          onClick={() =>
                            setFloorPlan(index)
                          }
                        >
                          {item}
                        </button>
                      ))}

                    </div>

                    <div className="plan-detail">

                      <span>SELECTED CONFIGURATION</span>

                      <strong>
                        {[
                          '2 BHK',
                          '3 BHK',
                          '4 BHK',
                        ][floorPlan]}
                      </strong>

                      <p>
                        Detailed dimensions and
                        approved floor plan can be
                        provided during enquiry.
                      </p>

                    </div>

                  </article>
                </>
              ) : (
                <article className="showcase-plan-card reveal">

                  <div className="showcase-plan-heading">

                    <div>
                      <p className="section-eyebrow">
                        MASTER PLAN
                      </p>

                      <h3>
                        A community planned
                        with purpose.
                      </h3>
                    </div>

                    <span>01</span>

                  </div>

                  <button
                    type="button"
                    className="plan-image-button"
                    onClick={() =>
                      setPlanZoom({
                        src: '/images/projects/master-plan.webp',
                        alt: 'Illustrative community master plan',
                      })
                    }
                    aria-label="Enlarge master plan"
                  >
                    <img
                      src="/images/projects/master-plan.webp"
                      alt="Illustrative community master plan with amenities and key"
                      loading="lazy"
                      width="1920"
                      height="1072"
                    />
                    <span className="plan-image-hint">Click to enlarge</span>
                  </button>

                  <p className="plan-image-note">
                    Illustrative master plan. Layout and amenities are subject to final approvals.
                  </p>

                </article>
              )}

            </div>

          </div>
        </section>


        {/* Location */}

        <section
          id="location"
          className="showcase-location section-padding"
        >
          <div className="page-container">

            <div className="section-heading reveal">

              <p className="section-eyebrow">
                LOCATION
              </p>

              <h2>
                Connected to{' '}
                <span>what matters.</span>
              </h2>

            </div>

            <div className="showcase-location-grid">

              <div className="showcase-location-map reveal">
                <iframe
                  title={`${project.name} location map`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    project.location
                  )}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="showcase-location-info reveal">

                <h3>
                  Nearby conveniences
                </h3>

                {locationGroups.map((group) => (
                  <div
                    className="showcase-location-group"
                    key={group.title}
                  >
                    <span>{group.title}</span>

                    {group.items.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                ))}

              </div>

            </div>

          </div>
        </section>


        {/* Brochure */}

        <section className="showcase-download section-padding">
          <div className="page-container">

            <div className="showcase-download-card reveal">

              <div>

                <p className="section-eyebrow">
                  PROJECT BROCHURE
                </p>

                <h2>
                  Take the project
                  <br />
                  <span>with you.</span>
                </h2>

                <p>
                  Download the detailed project
                  brochure for specifications,
                  configurations and project information.
                </p>

              </div>

              <a
                href={`/brochures/${project.id}.pdf`}
                download={`${project.name.replace(/\s+/g, '-')}-Brochure.pdf`}
                className="button button-gold"
              >
                Download Brochure
                <span>↓</span>
              </a>

            </div>

          </div>
        </section>


        {/* Similar Projects */}

        {similarProjects.length > 0 && (
          <section className="showcase-similar section-padding">

            <div className="page-container">

              <div className="showcase-similar-heading reveal">

                <div>
                  <p className="section-eyebrow">
                    YOU MAY ALSO LIKE
                  </p>

                  <h2>
                    Explore similar{' '}
                    <span>projects.</span>
                  </h2>
                </div>

                <Link
                  to="/projects"
                  className="text-link"
                >
                  View All
                  <span>↗</span>
                </Link>

              </div>

              <div className="showcase-similar-grid">

                {similarProjects.map((item) => (
                  <Link
                    to={`/projects/${item.id}`}
                    className="showcase-similar-card reveal"
                    key={item.id}
                  >
                    <div className="showcase-similar-image">

                      <img
                        src={item.image}
                        alt={item.name}
                        width="900"
                        height="650"
                        loading="lazy"
                      />

                    </div>

                    <div className="showcase-similar-content">

                      <span>
                        {item.location}
                      </span>

                      <h3>{item.name}</h3>

                      <p>
                        {item.configuration}
                      </p>

                    </div>
                  </Link>
                ))}

              </div>

            </div>

          </section>
        )}


        {/* Enquiry */}

        <section
          id="enquire"
          className="showcase-enquiry section-padding"
        >
          <div className="page-container">

            <div className="showcase-enquiry-content">

              <p className="section-eyebrow">
                ENQUIRE ABOUT THIS PROJECT
              </p>

              <h2>
                Let's find your{' '}
                <span>next address.</span>
              </h2>

              <p>
                Share your details and our team can
                help you with project information,
                availability and a site visit.
              </p>

              <form
                className="showcase-enquiry-form"
                onSubmit={handleSubmit}
                noValidate
              >

                <input
                  type="text"
                  name="website"
                  tabIndex="-1"
                  autoComplete="off"
                  aria-hidden="true"
                  className="showcase-honeypot"
                />

                <div className="showcase-form-grid">

                  <div className="form-group">
                    <label htmlFor="project-name">
                      Name
                    </label>

                    <input
                      id="project-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="project-phone">
                      Phone
                    </label>

                    <input
                      id="project-phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleFormChange}
                      placeholder="Your phone number"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="project-email">
                      Email
                    </label>

                    <input
                      id="project-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      placeholder="Your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="project-interest">
                      Interested Project
                    </label>

                    <input
                      id="project-interest"
                      type="text"
                      value={project.name}
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="project-date">
                      Preferred Visit Date
                    </label>

                    <input
                      id="project-date"
                      type="date"
                      name="visitDate"
                      min={today}
                      value={form.visitDate}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="project-message">
                      Message
                    </label>

                    <textarea
                      id="project-message"
                      name="message"
                      value={form.message}
                      onChange={handleFormChange}
                      placeholder="Tell us how we can help"
                      rows="5"
                    />
                  </div>

                </div>

                {formStatus === 'error' && (
                  <p
                    className="showcase-form-message showcase-form-message--error"
                    role="alert"
                  >
                    {formMessage}
                  </p>
                )}

                {formStatus === 'success' && (
                  <p
                    className="showcase-form-message showcase-form-message--success"
                    role="status"
                  >
                    Thank you. Your enquiry has been
                    received.
                  </p>
                )}

                <button
                  type="submit"
                  className="button button-gold"
                  disabled={
                    formStatus === 'success' ||
                    formStatus === 'sending'
                  }
                >
                  {formStatus === 'success'
                    ? 'Enquiry Submitted'
                    : formStatus === 'sending'
                      ? 'Sending...'
                      : 'Submit Enquiry'}
                  <span>↗</span>
                </button>

                <small className="form-note">
                  By submitting you agree to be contacted. See our{' '}
                  <Link to="/privacy">Privacy Policy</Link>.
                </small>

              </form>

            </div>

          </div>
        </section>

      </main>

      <Footer />

      {planZoom && (
        <div
          className="plan-zoom"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged plan"
          onClick={() => setPlanZoom(null)}
        >
          <button
            type="button"
            className="plan-zoom-close"
            aria-label="Close enlarged plan"
            onClick={() => setPlanZoom(null)}
          >
            ×
          </button>
          <img src={planZoom.src} alt={planZoom.alt} onClick={(event) => event.stopPropagation()} />
        </div>
      )}

      {/* Lightbox */}

      {lightboxOpen && (
        <div
          className="lightbox is-open"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} gallery`}
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="lightbox-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="lightbox-close"
              onClick={() =>
                setLightboxOpen(false)
              }
              aria-label="Close gallery"
            >
              ×
            </button>

            <button
              type="button"
              className="lightbox-prev"
              onClick={() =>
                setActiveImage(
                  (current) =>
                    (current - 1 + galleryImages.length) %
                    galleryImages.length
                )
              }
              aria-label="Previous image"
            >
              ←
            </button>

            <img
              src={currentImage}
              alt={`${project.name} gallery`}
            />

            <button
              type="button"
              className="lightbox-next"
              onClick={() =>
                setActiveImage(
                  (current) =>
                    (current + 1) %
                    galleryImages.length
                )
              }
              aria-label="Next image"
            >
              →
            </button>

          </div>
        </div>
      )}

    </>
  )
}

export default ProjectShowcase