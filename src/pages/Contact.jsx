import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import Breadcrumb from '../components/Breadcrumb'
import MapEmbed from '../components/MapEmbed'
import { projects, site } from '../data/site'
import {
  secondsUntilNextEnquiry,
  submitEnquiry,
  validateEnquiry
} from '../utils/enquiry'

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  project: '',
  interest: '',
  visitDate: '',
  message: '',
  consent: false,
  website: '' // honeypot - real users never see or fill this
}

function Contact() {
  const [searchParams] = useSearchParams()
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({
    ...emptyForm,
    project: searchParams.get('project') || ''
  })

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      document.querySelector('form [aria-invalid="true"]')?.focus()
    }
  }, [errors])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }))

    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current }
        delete next[name]
        return next
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    // Spam bot filled the hidden field - pretend success, send nothing
    if (form.website) {
      setSubmitted(true)
      return
    }

    const found = validateEnquiry(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const wait = secondsUntilNextEnquiry()
    if (wait > 0) {
      setFormError(`Please wait ${wait} seconds before sending another enquiry.`)
      return
    }

    setSending(true)

    try {
      await submitEnquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        project: form.project,
        interest: form.interest,
        visitDate: form.visitDate,
        message: form.message.trim(),
        source: 'contact-page'
      })
      setSubmitted(true)
    } catch {
      setFormError('Something went wrong. Please try again or call us directly.')
    } finally {
      setSending(false)
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setErrors({})
    setForm({ ...emptyForm })
  }

  const fieldProps = (name) => ({
    name,
    value: form[name],
    onChange: handleChange,
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined
  })

  const errorText = (name) =>
    errors[name] ? (
      <small className="field-error" id={`${name}-error`} role="alert">
        {errors[name]}
      </small>
    ) : null

  return (
    <>
      <Seo
        title="Contact Us"
        description="Call, WhatsApp or send an enquiry. Visit our Chennai office or schedule a site visit with our team."
        image="/images/contact/contact-office.webp"
        path="/contact"
      />

      <Header />

      <main className="contact-page">
        <section className="contact-hero">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Contact Us' }]} />
          {/* Hero */}
          <img
            src="/images/projects/palm-grove.webp"
            alt="Premium residential property"
          />

          <div className="contact-hero-overlay" />

          <div className="page-container contact-hero-content reveal">
            <p className="section-eyebrow">GET IN TOUCH</p>

            <h1>
              Let's start
              <span>a conversation.</span>
            </h1>

            <p>
              Tell us what you are looking for and our team will help
              you explore the right property, location and next step.
            </p>
          </div>

          <div className="contact-hero-bottom">
            <span>CONTACT {site.brand}</span>
            <span>CHENNAI · TAMIL NADU</span>
          </div>
        </section>

        <section className="contact-main section-padding">
          <div className="page-container">
            <div className="contact-grid">
              <div className="contact-info reveal">
                <p className="section-eyebrow">CONTACT DETAILS</p>

                <h2>
                  We would love to
                  <span>hear from you.</span>
                </h2>

                <p className="contact-intro">
                  Whether you are exploring a new home, planning a
                  site visit or simply want more information, our team
                  is here to help.
                </p>

                <div className="contact-detail-list">
                  <a
                    href={`tel:${site.phone.replace(/\s/g, '')}`}
                    className="contact-detail"
                  >
                    <span>PHONE</span>
                    <strong>{site.phone}</strong>
                    <i>↗</i>
                  </a>

                  <a
                    href={`mailto:${site.email}`}
                    className="contact-detail"
                  >
                    <span>EMAIL</span>
                    <strong>{site.email}</strong>
                    <i>↗</i>
                  </a>

                  <div className="contact-detail">
                    <span>OFFICE</span>
                    <strong>{site.address}</strong>
                    <i>⌖</i>
                  </div>

                  <div className="contact-detail">
                    <span>WORKING HOURS</span>
                    <strong>
                      Monday — Saturday
                      <br />
                      09:00 AM — 06:00 PM
                    </strong>
                    <i>◷</i>
                  </div>
                </div>

                <div className="contact-quick-actions">
                  <a
                    href={`tel:${site.phone.replace(/\s/g, '')}`}
                    className="button button-dark"
                  >
                    Call Us
                    <span>↗</span>
                  </a>

                  <a
                    href={`https://wa.me/${site.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="button button-outline"
                  >
                    WhatsApp
                    <span>↗</span>
                  </a>
                </div>
              </div>

              <div className="contact-form-card reveal reveal-delay-1">
                {!submitted ? (
                  <>
                    <div className="contact-form-heading">
                      <p className="section-eyebrow">
                        SEND AN ENQUIRY
                      </p>

                      <h3>
                        Tell us what
                        <span>you need.</span>
                      </h3>

                      <p>
                        Fill in your details and our team will get
                        back to you.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                      {/* Honeypot (spam trap) */}
                      <div className="form-honeypot" aria-hidden="true">
                        <label>
                          Website
                          <input
                            type="text"
                            name="website"
                            value={form.website}
                            onChange={handleChange}
                            tabIndex={-1}
                            autoComplete="off"
                          />
                        </label>
                      </div>

                      <div className="form-row">
                        <label>
                          <span>FULL NAME *</span>
                          <input
                            type="text"
                            placeholder="Your name"
                            autoComplete="name"
                            required
                            {...fieldProps('name')}
                          />
                          {errorText('name')}
                        </label>

                        <label>
                          <span>PHONE *</span>
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            autoComplete="tel"
                            inputMode="tel"
                            required
                            {...fieldProps('phone')}
                          />
                          {errorText('phone')}
                        </label>
                      </div>

                      <label>
                        <span>EMAIL *</span>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          required
                          {...fieldProps('email')}
                        />
                        {errorText('email')}
                      </label>

                      <div className="form-row">
                        <label>
                          <span>INTERESTED PROJECT</span>
                          <select {...fieldProps('project')}>
                            <option value="">Select a project</option>
                            {projects.map((item) => (
                              <option key={item.id} value={item.name}>
                                {item.name} - {item.location}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label>
                          <span>LOOKING FOR</span>
                          <select {...fieldProps('interest')}>
                            <option value="">Select an option</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="Plot">Plot</option>
                            <option value="Investment">Investment</option>
                            <option value="Site Visit">Site Visit</option>
                          </select>
                        </label>
                      </div>

                      <label>
                        <span>PREFERRED VISIT DATE (OPTIONAL)</span>
                        <input type="date" min={today} {...fieldProps('visitDate')} />
                      </label>

                      <label>
                        <span>MESSAGE</span>
                        <textarea
                          placeholder="Tell us a little about what you are looking for..."
                          rows="5"
                          maxLength={1000}
                          {...fieldProps('message')}
                        />
                        {errorText('message')}
                      </label>

                      <div className="form-consent">
                        <input
                          id="consent"
                          type="checkbox"
                          name="consent"
                          checked={form.consent}
                          onChange={handleChange}
                          aria-invalid={errors.consent ? 'true' : undefined}
                          aria-describedby={errors.consent ? 'consent-error' : undefined}
                        />
                        <label htmlFor="consent">
                          I agree to be contacted about my enquiry and accept the{' '}
                          <Link to="/privacy">Privacy Policy</Link>.
                          {errorText('consent')}
                        </label>
                      </div>

                      {formError && (
                        <p className="form-status form-status--error" role="alert">
                          {formError}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="button button-gold contact-submit"
                        disabled={sending}
                      >
                        {sending ? 'Sending...' : 'Send Enquiry'}
                        <span>↗</span>
                      </button>

                      <small className="form-note">
                        Your details are used only to respond to your enquiry.
                      </small>
                    </form>
                  </>
                ) : (
                  <div className="contact-success">
                    <span className="contact-success-icon">✓</span>

                    <p className="section-eyebrow">
                      ENQUIRY RECEIVED
                    </p>

                    <h3>
                      Thank you.
                      <span>We will be in touch.</span>
                    </h3>

                    <p>
                      Your enquiry has been received successfully.
                      Our team will contact you using the details
                      provided.
                    </p>

                    <button
                      type="button"
                      className="button button-dark"
                      onClick={resetForm}
                    >
                      Send Another Enquiry
                      <span>↗</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="contact-map-section section-padding">
          <div className="page-container">
            <div className="section-heading centered reveal">
              <p className="section-eyebrow">VISIT OUR OFFICE</p>

              <h2>
                Come and
                <span>meet us.</span>
              </h2>

              <p className="section-description">
                Visit our office to discuss projects, locations,
                availability and your property requirements.
              </p>
            </div>

            <div className="contact-map-card reveal">
              <div className="contact-map-visual has-embed">
                <MapEmbed
                  lat={site.map.lat}
                  lng={site.map.lng}
                  zoom={site.map.zoom}
                  title={`${site.brand} office location map`}
                />
              </div>

              <div className="contact-map-info">
                <p className="section-eyebrow">OUR OFFICE</p>

                <h3>
                  {site.address}
                </h3>

                <p>
                  Our team is available Monday to Saturday for
                  project discussions, enquiries and site visit
                  coordination.
                </p>

                <div className="contact-office-hours">
                  <span>OPENING HOURS</span>

                  <strong>
                    Monday — Saturday
                    <br />
                    09:00 AM — 06:00 PM
                  </strong>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    site.address
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-dark"
                >
                  Get Directions
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-faq-strip section-padding">
          <div className="page-container">
            <div className="contact-faq-grid reveal">
              <div>
                <p className="section-eyebrow">
                  NEED QUICK ANSWERS?
                </p>

                <h2>
                  We may already have
                  <span>the answer.</span>
                </h2>
              </div>

              <div>
                <p>
                  Find answers about projects, configurations,
                  amenities, brochures, site visits and the booking
                  process.
                </p>

                <Link to="/faq" className="button button-outline">
                  Visit FAQ
                  <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-cta">
          {/* CTA */}
          <img
            src="/images/projects/serenity-villas.webp"
            alt="Premium Nivora residence"
            loading="lazy"
          />

          <div className="contact-cta-overlay" />

          <div className="page-container contact-cta-content reveal">
            <p className="section-eyebrow">YOUR NEXT ADDRESS</p>

            <h2>
              Let's find a place
              <span>that feels right.</span>
            </h2>

            <p>
              Explore our projects or speak directly with our team
              about your requirements.
            </p>

            <div className="hero-actions">
              <Link to="/projects" className="button button-gold">
                Explore Projects
                <span>↗</span>
              </Link>

              <Link
                to="/locations"
                className="button button-light-outline"
              >
                Explore Locations
                <span>↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Contact