import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Wave from '../components/Wave'
import { site, faqs } from '../data/site'

const interests = ['Apartment', 'Villa', 'Luxury Home', 'Investment', 'Site Visit']
const empty = { name: '', phone: '', email: '', interest: '', message: '' }
const digits = site.phone.replace(/[^\d+]/g, '')

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState(empty)
  const [touched, setTouched] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setTouched(true)
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) return
    setSubmitted(true)
  }

  const bad = (key) => touched && !form[key].trim()
  const quick = faqs.slice(0, 3)

  return (
    <>
      <Header />
      <main className="ct" data-own>
        {/* hero */}
        <section className="lx-hero">
          <img src="/images/contact/contact-office.webp" alt="Nivora reception" />
          <div className="lx-wrap">
            <Wave className="lx-crumbs"><Link to="/">Home</Link><span>/</span><span>Contact</span></Wave>
            <Wave d={1}><p className="lx-kicker">Get in touch</p></Wave>
            <Wave d={2} as="h1">Let us start <em>a conversation.</em></Wave>
            <Wave d={3} as="p" className="lx-sub">Tell us what you are looking for and our team will help you find the right property, location and next step.</Wave>
            <Wave d={4} className="lx-row">
              <a href="#enquiry" className="lx-btn">Send an enquiry <i>↓</i></a>
              <a href={`tel:${digits}`} className="lx-btn lx-btn--ghost">{site.phone}</a>
            </Wave>
          </div>
          <div className="lx-scrollcue" aria-hidden="true"><i />Scroll</div>
        </section>

        {/* details + enquiry */}
        <section className="lx-section lx-section--ivory ct-main" id="enquiry">
          <div className="lx-wrap ct-grid">
            <div className="ct-info">
              <Wave kind="left">
                <p className="lx-kicker lx-kicker--dark">Contact details</p>
                <h2 className="lx-title">We would love to <em>hear from you.</em></h2>
                <p className="lx-lead">Whether you are exploring a new home, planning a site visit or simply want more information, our team is here to help.</p>
              </Wave>
              <div className="ct-list">
                {[
                  ['Phone', site.phone, `tel:${digits}`, '☏'],
                  ['Email', site.email, `mailto:${site.email}`, '✉'],
                  ['Office', site.address, `https://maps.google.com/?q=${encodeURIComponent(site.address)}`, '⌖'],
                ].map(([label, value, href, icon], i) => (
                  <Wave d={i + 1} key={label}>
                    <a className="ct-row" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                      <span className="ct-ico">{icon}</span>
                      <span><small>{label}</small><b>{value}</b></span>
                      <i>↗</i>
                    </a>
                  </Wave>
                ))}
                <Wave d={4}>
                  <div className="ct-row ct-row--static">
                    <span className="ct-ico">◷</span>
                    <span><small>Working hours</small><b>Monday to Saturday<br />09:00 AM to 06:00 PM</b></span>
                  </div>
                </Wave>
              </div>
              <Wave d={5} className="lx-row">
                <a href={`tel:${digits}`} className="lx-btn lx-btn--dark lx-btn--sm">Call us <i>↗</i></a>
                <a href={`https://wa.me/${site.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="lx-btn lx-btn--line lx-btn--sm">WhatsApp <i>↗</i></a>
              </Wave>
            </div>

            <Wave kind="right" className="ct-card">
              {!submitted ? (
                <form onSubmit={handleSubmit} noValidate>
                  <p className="lx-kicker">Send an enquiry</p>
                  <h3>Tell us what <em>you need.</em></h3>
                  <p className="ct-card-sub">Share a few details and we will get back to you within one working day.</p>

                  <div className="ct-two">
                    <label className={bad('name') ? 'is-bad' : ''}>
                      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder=" " autoComplete="name" required />
                      <span>Full name *</span>
                      {bad('name') && <em>Please enter your name</em>}
                    </label>
                    <label className={bad('phone') ? 'is-bad' : ''}>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder=" " autoComplete="tel" required />
                      <span>Phone *</span>
                      {bad('phone') && <em>Please enter your phone</em>}
                    </label>
                  </div>
                  <label className={bad('email') ? 'is-bad' : ''}>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder=" " autoComplete="email" required />
                    <span>Email *</span>
                    {bad('email') && <em>Please enter your email</em>}
                  </label>

                  <fieldset className="ct-chips">
                    <legend>What are you looking for?</legend>
                    {interests.map((o) => (
                      <button type="button" key={o} className={form.interest === o ? 'on' : ''} aria-pressed={form.interest === o} onClick={() => setForm((c) => ({ ...c, interest: c.interest === o ? '' : o }))}>{o}</button>
                    ))}
                  </fieldset>

                  <label>
                    <textarea name="message" value={form.message} onChange={handleChange} placeholder=" " rows="4" />
                    <span>Message</span>
                  </label>

                  <button type="submit" className="lx-btn ct-send">Send enquiry <i>→</i></button>
                  <small className="ct-note">Your details are used only to respond to your enquiry.</small>
                </form>
              ) : (
                <div className="ct-done">
                  <span className="ct-tick">✓</span>
                  <p className="lx-kicker">Enquiry received</p>
                  <h3>Thank you. <em>We will be in touch.</em></h3>
                  <p>Your enquiry has been received. Our team will contact you using the details provided.</p>
                  <button type="button" className="lx-btn lx-btn--dark" onClick={() => { setSubmitted(false); setTouched(false); setForm(empty) }}>Send another enquiry <i>→</i></button>
                </div>
              )}
            </Wave>
          </div>
        </section>

        {/* map */}
        <section className="lx-section lx-section--navy ct-map">
          <div className="lx-wrap">
            <Wave className="ct-map-head">
              <div>
                <p className="lx-kicker">Visit our office</p>
                <h2 className="lx-title lx-title--light">Come in and <em>meet us.</em></h2>
              </div>
              <a className="lx-btn" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`}>Get directions <i>↗</i></a>
            </Wave>
            <Wave d={1} className="ct-map-card">
              <iframe title="Nivora office on Google Maps" src={`https://www.google.com/maps?q=${encodeURIComponent(site.address)}&z=12&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              <div className="ct-map-pop">
                <small>Our office</small>
                <b>{site.brand}</b>
                <p>{site.address}</p>
                <span>Mon to Sat · 9 AM to 6 PM</span>
              </div>
            </Wave>
          </div>
        </section>

        {/* quick answers */}
        <section className="lx-section lx-section--stone ct-quick">
          <div className="lx-wrap">
            <Wave className="lx-center">
              <p className="lx-kicker lx-kicker--dark">Need a quick answer?</p>
              <h2 className="lx-title">Faster ways <em>to get one.</em></h2>
              <p className="lx-lead">Pick whichever suits you. Most questions are answered the same day.</p>
            </Wave>
            <div className="ct-ways">
              {[
                ['☏', 'Call us', 'Speak to the team directly.', site.phone, `tel:${digits}`, 'Call now', ''],
                ['✆', 'WhatsApp', 'Message us and share your requirements.', 'Chat with us', `https://wa.me/${site.phone.replace(/\D/g, '')}`, 'Open chat', '_blank'],
                ['?', 'Browse the FAQ', 'Answers on projects, booking and visits.', `${faqs.length} questions answered`, '/faq', 'Read FAQs', ''],
              ].map(([icon, title, text, meta, href, cta, target], i) => (
                <Wave d={i} key={title} className="ct-way">
                  <span className="ct-way-ico">{icon}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <b>{meta}</b>
                  {href.startsWith('/') ? (
                    <Link to={href} className="lx-btn lx-btn--dark lx-btn--sm">{cta} <i>→</i></Link>
                  ) : (
                    <a href={href} target={target || undefined} rel="noreferrer" className="lx-btn lx-btn--dark lx-btn--sm">{cta} <i>→</i></a>
                  )}
                </Wave>
              ))}
            </div>
            <Wave d={3} className="ct-mini">
              {quick.map((f) => (
                <Link to="/faq" key={f.question}><span>Q</span>{f.question}<i>→</i></Link>
              ))}
            </Wave>
          </div>
        </section>

        <section className="lx-cta" style={{ backgroundImage: 'url(/images/projects/serenity-villas.webp)' }}>
          <div className="lx-wrap lx-center">
            <Wave><p className="lx-kicker">Your next address</p></Wave>
            <Wave d={1} as="h2" className="lx-title lx-title--light">Find a home <em>that feels right.</em></Wave>
            <Wave d={2} className="lx-row" style={{ justifyContent: 'center', marginTop: 34 }}>
              <Link to="/projects" className="lx-btn">Explore projects <i>→</i></Link>
              <Link to="/locations" className="lx-btn lx-btn--ghost">View locations</Link>
            </Wave>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Contact
