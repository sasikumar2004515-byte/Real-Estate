import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Wave from '../components/Wave'
import { projects } from '../data/site'

const galleryFallbacks = [
  '/images/projects/palm-grove.webp',
  '/images/projects/lakeside-residences.webp',
  '/images/projects/urban-heights.webp',
  '/images/gallery/gallery-pool.webp',
]

const defaultAmenities = ['24/7 Security', 'Landscaped Open Spaces', 'Visitor Parking', 'Community Spaces']

const nearby = [
  ['Schools', '⌂', 'Nearby schools and educational institutions'],
  ['Hospitals', '✚', 'Nearby hospitals and healthcare facilities'],
  ['Transport', '⇄', 'Major roads, public transport and connectivity'],
  ['Business', '◈', 'Commercial areas, offices and everyday conveniences'],
]

const plans = [
  ['2 BHK', 'Compact, efficient and well lit.'],
  ['3 BHK', 'Balanced space for a growing family.'],
  ['4 BHK', 'Generous rooms with room to entertain.'],
]

const sections = [
  ['overview', 'Overview'],
  ['gallery', 'Gallery'],
  ['amenities', 'Amenities'],
  ['plans', 'Plans'],
  ['location', 'Location'],
  ['enquire', 'Enquire'],
]

function ProjectShowcase() {
  const { id } = useParams()
  const project = projects.find((item) => item.id === id)

  const [activeImage, setActiveImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [planType, setPlanType] = useState('floor')
  const [floorPlan, setFloorPlan] = useState(0)
  const [formStatus, setFormStatus] = useState('idle')
  const [form, setForm] = useState({ name: '', phone: '', email: '', visitDate: '', message: '' })
  const [here, setHere] = useState('overview')
  const today = new Date().toISOString().split('T')[0]

  const galleryImages = useMemo(() => {
    if (!project) return []
    return [project.image, ...galleryFallbacks.filter((image) => image !== project.image)]
  }, [project])

  const amenities = useMemo(() => {
    if (!project) return []
    return [...(project.highlights || []), ...defaultAmenities]
      .filter((item, index, array) => item && array.indexOf(item) === index)
      .slice(0, 8)
  }, [project])

  const similar = useMemo(() => {
    if (!project) return []
    const same = projects.filter((p) => p.id !== project.id && p.type === project.type)
    const rest = projects.filter((p) => p.id !== project.id && p.type !== project.type)
    return [...same, ...rest].slice(0, 3)
  }, [project])

  useEffect(() => {
    window.scrollTo(0, 0)
    window.dispatchEvent(new CustomEvent('nx:scrollto', { detail: 0 }))
    setActiveImage(0)
    setFormStatus('idle')
    setPlanType('floor')
    setFloorPlan(0)
  }, [id])

  useEffect(() => {
    if (!lightboxOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event) => {
      if (event.key === 'Escape') setLightboxOpen(false)
      if (event.key === 'ArrowRight') setActiveImage((c) => (c + 1) % galleryImages.length)
      if (event.key === 'ArrowLeft') setActiveImage((c) => (c - 1 + galleryImages.length) % galleryImages.length)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [lightboxOpen, galleryImages.length])

  // which section is under the sticky bar
  useEffect(() => {
    if (!project) return undefined
    let ticking = false
    const update = () => {
      ticking = false
      const line = window.innerHeight * 0.35
      let cur = sections[0][0]
      sections.forEach(([key]) => {
        const el = document.getElementById(key)
        if (el && el.getBoundingClientRect().top <= line) cur = key
      })
      setHere(cur)
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [project])

  const go = (key) => {
    const el = document.getElementById(key)
    if (!el) return
    const offset = (document.querySelector('.nx-header')?.offsetHeight || 84) + 54
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset + 2, behavior: 'smooth' })
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setFormStatus('error')
      return
    }
    setFormStatus('success')
  }

  const askBrochure = () => {
    setForm((c) => ({ ...c, message: `Please send me the brochure for ${project.name}.` }))
    go('enquire')
  }

  if (!project) {
    return (
      <>
        <Header />
        <main className="ps ps-missing" data-own>
          <div className="lx-wrap lx-center">
            <p className="lx-kicker">Project not found</p>
            <h1 className="lx-title lx-title--light">That project is <em>unavailable.</em></h1>
            <p className="lx-lead lx-lead--light">The project you are looking for could not be found.</p>
            <div className="lx-row" style={{ justifyContent: 'center', marginTop: 32 }}>
              <Link to="/projects" className="lx-btn">Back to projects <i>→</i></Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const facts = [
    ['Configuration', project.configuration],
    ['Area', project.area],
    ['Location', `${project.location}, Chennai`],
    ['Starting price', project.price],
  ]
  const current = galleryImages[activeImage] || project.image

  return (
    <>
      <Header />
      <main className="ps" data-own>
        {/* hero */}
        <section className="lx-hero ps-hero">
          <img src={project.image} alt={project.name} fetchPriority="high" />
          <div className="lx-wrap">
            <Wave className="lx-crumbs"><Link to="/">Home</Link><span>/</span><Link to="/projects">Projects</Link><span>/</span><span>{project.name}</span></Wave>
            <Wave d={1} className="ps-badges"><span className="ps-badge">{project.status}</span><span>{project.location} · {project.type}</span></Wave>
            <Wave d={2} as="h1">{project.name}</Wave>
            <Wave d={3} as="p" className="lx-sub">{project.description}</Wave>
            <Wave d={4} className="lx-row">
              <button type="button" className="lx-btn" onClick={() => go('enquire')}>Book a site visit <i>→</i></button>
              <button type="button" className="lx-btn lx-btn--ghost" onClick={() => go('overview')}>View overview</button>
            </Wave>
            <Wave d={5} as="dl" className="ps-facts">
              {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </Wave>
          </div>
        </section>

        {/* sticky nav */}
        <nav className="gl-bar ps-bar" aria-label="Project sections">
          <div className="gl-bar-in" data-native-scroll>
            {sections.map(([key, label], i) => (
              <button key={key} type="button" className={here === key ? 'on' : ''} onClick={() => go(key)}><i>{String(i + 1).padStart(2, '0')}</i>{label}</button>
            ))}
            <span aria-hidden="true" />
            <button type="button" onClick={() => go('enquire')}><i>→</i>Enquire now</button>
          </div>
        </nav>

        {/* overview */}
        <section className="lx-section lx-section--ivory" id="overview">
          <div className="lx-wrap ps-over">
            <Wave kind="left">
              <p className="lx-kicker lx-kicker--dark">Overview</p>
              <h2 className="lx-title">A home designed <em>around you.</em></h2>
              <p className="lx-lead">{project.description} Every detail, from the approach to the finishes, is planned for comfort, light and long-term value.</p>
              <div className="lx-row" style={{ marginTop: 30 }}>
                <button type="button" className="lx-btn lx-btn--dark" onClick={askBrochure}>Request brochure <i>↓</i></button>
                <Link to="/locations" className="lx-btn lx-btn--line">View locations</Link>
              </div>
            </Wave>
            <div className="ps-over-cards">
              {facts.map(([k, v], i) => (
                <Wave d={i} key={k} className="ps-fact"><small>{k}</small><b>{v}</b></Wave>
              ))}
              <Wave d={4} className="ps-fact ps-fact--wide"><small>Status</small><b>{project.status}</b><span>Talk to the team for current availability.</span></Wave>
            </div>
          </div>
        </section>

        {/* gallery */}
        <section className="lx-section lx-section--navy" id="gallery">
          <div className="lx-wrap">
            <Wave className="ps-head">
              <div>
                <p className="lx-kicker">Gallery</p>
                <h2 className="lx-title lx-title--light">See the <em>space.</em></h2>
              </div>
              <span className="pj-counter">{String(activeImage + 1).padStart(2, '0')} <i /> {String(galleryImages.length).padStart(2, '0')}</span>
            </Wave>
            <Wave d={1} className="ps-gal">
              <button type="button" className="ps-gal-main" onClick={() => setLightboxOpen(true)} aria-label="Open image full screen">
                <img key={current} src={current} alt={`${project.name} view ${activeImage + 1}`} />
                <span>View full screen ↗</span>
              </button>
              <div className="ps-gal-thumbs">
                {galleryImages.map((image, index) => (
                  <button key={image} type="button" className={index === activeImage ? 'on' : ''} onClick={() => setActiveImage(index)} aria-label={`Show image ${index + 1}`}>
                    <img src={image} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            </Wave>
          </div>
        </section>

        {/* amenities */}
        <section className="lx-section lx-section--stone" id="amenities">
          <div className="lx-wrap">
            <Wave className="lx-center">
              <p className="lx-kicker lx-kicker--dark">Amenities</p>
              <h2 className="lx-title">Everything <em>within reach.</em></h2>
            </Wave>
            <div className="ps-amen">
              {amenities.map((item, i) => (
                <Wave d={i % 4} key={item} className="ps-amen-item">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <b>{item}</b>
                  <i aria-hidden="true">✦</i>
                </Wave>
              ))}
            </div>
          </div>
        </section>

        {/* plans */}
        <section className="lx-section lx-section--ivory" id="plans">
          <div className="lx-wrap">
            <Wave className="ps-head ps-head--dark">
              <div>
                <p className="lx-kicker lx-kicker--dark">Plans</p>
                <h2 className="lx-title">Understand <em>the space.</em></h2>
              </div>
              <div className="ps-switch" role="tablist">
                <button type="button" className={planType === 'floor' ? 'on' : ''} onClick={() => setPlanType('floor')}>Floor plans</button>
                <button type="button" className={planType === 'master' ? 'on' : ''} onClick={() => setPlanType('master')}>Master plan</button>
              </div>
            </Wave>

            {planType === 'floor' ? (
              <div className="ps-plan" key="floor">
                <div className="ps-plan-img"><img src="/images/projects/floor-plan.webp" alt="Sample floor plan" loading="lazy" /></div>
                <div className="ps-plan-side">
                  <p className="lx-kicker lx-kicker--dark">Plan type</p>
                  <div className="ps-plan-tabs">
                    {plans.map(([name], i) => <button key={name} type="button" className={i === floorPlan ? 'on' : ''} onClick={() => setFloorPlan(i)}>{name}</button>)}
                  </div>
                  <h3>{plans[floorPlan][0]}</h3>
                  <p>{plans[floorPlan][1]}</p>
                  <p className="ps-plan-note">Detailed dimensions and the approved floor plan can be provided during enquiry.</p>
                  <button type="button" className="lx-btn lx-btn--dark lx-btn--sm" onClick={() => go('enquire')}>Ask for the plan <i>→</i></button>
                </div>
              </div>
            ) : (
              <div className="ps-plan" key="master">
                <div className="ps-plan-img"><img src="/images/projects/master-plan.webp" alt="Master plan of the community" loading="lazy" /></div>
                <div className="ps-plan-side">
                  <p className="lx-kicker lx-kicker--dark">Master plan</p>
                  <h3>A community planned with purpose.</h3>
                  <p>Roads, green spaces and shared amenities are laid out together, so the whole neighbourhood works as well as each home.</p>
                  <button type="button" className="lx-btn lx-btn--dark lx-btn--sm" onClick={() => go('enquire')}>Request details <i>→</i></button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* location */}
        <section className="lx-section lx-section--navy" id="location">
          <div className="lx-wrap">
            <Wave className="ps-head">
              <div>
                <p className="lx-kicker">Location</p>
                <h2 className="lx-title lx-title--light">{project.location}, <em>Chennai.</em></h2>
              </div>
              <a className="lx-btn lx-btn--sm" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.name + ' ' + project.location + ' Chennai')}`}>Open in Maps <i>↗</i></a>
            </Wave>
            <div className="ps-loc">
              <Wave kind="left" className="ps-map">
                <iframe title={`Map of ${project.name}`} src={`https://www.google.com/maps?q=${encodeURIComponent(project.location + ', Chennai, Tamil Nadu')}&z=13&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </Wave>
              <div className="ps-near">
                {nearby.map(([t, icon, text], i) => (
                  <Wave d={i} key={t} className="ps-near-item"><span>{icon}</span><div><b>{t}</b><small>{text}</small></div></Wave>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* enquire */}
        <section className="lx-section lx-section--ivory" id="enquire">
          <div className="lx-wrap ps-enq">
            <Wave kind="left" className="ps-enq-copy">
              <p className="lx-kicker lx-kicker--dark">Enquire</p>
              <h2 className="lx-title">Book a visit to <em>{project.name}.</em></h2>
              <p className="lx-lead">Choose a date and our team will walk you through the home, the plans and the neighbourhood.</p>
              <ul>
                <li>Private walkthrough with the team</li>
                <li>Plans, pricing and availability</li>
                <li>No obligation</li>
              </ul>
            </Wave>
            <Wave kind="right" className="ct-card ps-form">
              {formStatus === 'success' ? (
                <div className="ct-done">
                  <span className="ct-tick">✓</span>
                  <p className="lx-kicker">Request received</p>
                  <h3>Thank you. <em>We will be in touch.</em></h3>
                  <p>Our team will contact you about {project.name} shortly.</p>
                  <button type="button" className="lx-btn lx-btn--dark" onClick={() => { setFormStatus('idle'); setForm({ name: '', phone: '', email: '', visitDate: '', message: '' }) }}>Send another request <i>→</i></button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <p className="lx-kicker">Site visit request</p>
                  <h3>Tell us <em>when.</em></h3>
                  <div className="ct-two" style={{ marginTop: 22 }}>
                    <label><input name="name" value={form.name} onChange={handleFormChange} placeholder=" " autoComplete="name" /><span>Full name *</span></label>
                    <label><input name="phone" type="tel" value={form.phone} onChange={handleFormChange} placeholder=" " autoComplete="tel" /><span>Phone *</span></label>
                  </div>
                  <div className="ct-two">
                    <label><input name="email" type="email" value={form.email} onChange={handleFormChange} placeholder=" " autoComplete="email" /><span>Email *</span></label>
                    <label><input name="visitDate" type="date" min={today} value={form.visitDate} onChange={handleFormChange} placeholder=" " /><span>Preferred date</span></label>
                  </div>
                  <label><textarea name="message" rows="4" value={form.message} onChange={handleFormChange} placeholder=" " /><span>Message</span></label>
                  {formStatus === 'error' && <p className="ps-err" role="alert">Please fill in your name, phone and email.</p>}
                  <button type="submit" className="lx-btn ct-send">Request a visit <i>→</i></button>
                  <small className="ct-note">Your details are used only to respond to your enquiry.</small>
                </form>
              )}
            </Wave>
          </div>
        </section>

        {/* similar */}
        {similar.length > 0 && (
          <section className="lx-section pj-all ps-similar">
            <div className="lx-wrap">
              <Wave className="pj-head pj-head--dark">
                <div>
                  <p className="lx-kicker">You may also like</p>
                  <h2 className="lx-title lx-title--light">Similar <em>residences.</em></h2>
                </div>
                <Link to="/projects" className="lx-btn lx-btn--ghost lx-btn--sm">All projects <i>→</i></Link>
              </Wave>
              <div className="pj-grid">
                {similar.map((p, i) => (
                  <Wave d={i} key={p.id} className="pj-card-wrap">
                    <Link to={`/projects/${p.id}`} className="pj-card">
                      <img src={p.image} alt={p.name} loading="lazy" />
                      <span className="pj-card-badge">{p.status}</span>
                      <span className="pj-card-price">{p.price}</span>
                      <div className="pj-card-body">
                        <p>{p.location} · {p.type}</p>
                        <h3>{p.name}</h3>
                        <div className="pj-card-more">
                          <div><span>{p.configuration}</span><span>{p.area}</span></div>
                          <span className="lx-btn lx-btn--sm">View <i>→</i></span>
                        </div>
                      </div>
                    </Link>
                  </Wave>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />

      {lightboxOpen && (
        <div className="ps-lb" role="dialog" aria-modal="true" aria-label="Project gallery" onClick={() => setLightboxOpen(false)}>
          <button type="button" className="ps-lb-x" aria-label="Close" onClick={() => setLightboxOpen(false)}>×</button>
          <button type="button" className="ps-lb-n ps-lb-prev" aria-label="Previous image" onClick={(e) => { e.stopPropagation(); setActiveImage((c) => (c - 1 + galleryImages.length) % galleryImages.length) }}>←</button>
          <img src={current} alt={`${project.name} view ${activeImage + 1}`} onClick={(e) => e.stopPropagation()} />
          <button type="button" className="ps-lb-n ps-lb-next" aria-label="Next image" onClick={(e) => { e.stopPropagation(); setActiveImage((c) => (c + 1) % galleryImages.length) }}>→</button>
          <span className="ps-lb-count">{activeImage + 1} / {galleryImages.length}</span>
        </div>
      )}
    </>
  )
}

export default ProjectShowcase
