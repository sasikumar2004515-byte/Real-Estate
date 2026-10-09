import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Wave from '../components/Wave'
import { faqs } from '../data/site'

const categories = ['All', 'Projects', 'Booking', 'Site Visit', 'Support']
const catMeta = {
  All: ['✦', 'Everything in one place'],
  Projects: ['⌂', 'Homes, plans and amenities'],
  Booking: ['✎', 'Pricing, brochures and booking'],
  'Site Visit': ['⌖', 'Seeing a home in person'],
  Support: ['☏', 'Help, before and after'],
}
const help = [
  ['01', 'Project information'],
  ['02', 'Site visit'],
  ['03', 'Brochure request'],
  ['04', 'Property guidance'],
]

function FAQ() {
  const [active, setActive] = useState('All')
  const [openIndex, setOpenIndex] = useState(0)

  const list = active === 'All' ? faqs : faqs.filter((f) => f.category === active)
  const count = (c) => (c === 'All' ? faqs.length : faqs.filter((f) => f.category === c).length)

  return (
    <>
      <Header />
      <main className="fq" data-own>
        {/* hero */}
        <section className="lx-hero">
          <img src="/images/projects/greenfield-apartments.webp" alt="Nivora apartments at dusk" />
          <div className="lx-wrap">
            <Wave className="lx-crumbs"><Link to="/">Home</Link><span>/</span><span>FAQ</span></Wave>
            <Wave d={1}><p className="lx-kicker">Frequently asked</p></Wave>
            <Wave d={2} as="h1">Questions, <em>answered clearly.</em></Wave>
            <Wave d={3} as="p" className="lx-sub">Quick answers about our projects, locations, site visits, brochures and the property journey.</Wave>
            <Wave d={4} className="lx-row">
              <a href="#questions" className="lx-btn">Browse answers <i>↓</i></a>
              <span className="fq-hero-count"><b>{String(faqs.length).padStart(2, '0')}</b> answers</span>
            </Wave>
          </div>
          <div className="lx-scrollcue" aria-hidden="true"><i />Scroll</div>
        </section>

        {/* categories */}
        <section className="lx-section lx-section--ivory fq-cats" id="questions">
          <div className="lx-wrap">
            <Wave className="lx-center">
              <p className="lx-kicker lx-kicker--dark">Categories</p>
              <h2 className="lx-title">Find what <em>you need.</em></h2>
              <p className="lx-lead">Choose a topic and the answers below update instantly.</p>
            </Wave>

            <div className="fq-tiles">
              {categories.map((c, i) => (
                <Wave d={i} key={c} className="fq-tile-wrap">
                  <button type="button" className={`fq-tile${c === active ? ' on' : ''}`} aria-pressed={c === active} onClick={() => { setActive(c); setOpenIndex(0) }}>
                    <span className="fq-tile-ico">{catMeta[c][0]}</span>
                    <b>{c}</b>
                    <small>{catMeta[c][1]}</small>
                    <em>{String(count(c)).padStart(2, '0')}</em>
                  </button>
                </Wave>
              ))}
            </div>

            <div className="fq-list" key={active}>
              {list.map((f, i) => {
                const open = i === openIndex
                return (
                  <div key={f.question} className={`fq-item${open ? ' open' : ''}`} style={{ '--i': i }}>
                    <button type="button" aria-expanded={open} onClick={() => setOpenIndex(open ? -1 : i)}>
                      <span className="fq-no">{String(i + 1).padStart(2, '0')}</span>
                      <span className="fq-q">{f.question}</span>
                      <span className="fq-tag">{f.category}</span>
                      <span className="fq-plus" aria-hidden="true" />
                    </button>
                    <div className="fq-a"><div><p>{f.answer}</p></div></div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* personal assistance */}
        <section className="lx-section lx-section--navy fq-assist">
          <div className="lx-wrap fq-assist-grid">
            <Wave kind="left" className="fq-assist-img">
              <img src="/images/projects/lakeside-residences.webp" alt="Lakeside residence" loading="lazy" />
              <div className="fq-assist-chip"><span>●</span> Our team replies within one working day</div>
            </Wave>
            <div>
              <Wave><p className="lx-kicker">Personal assistance</p></Wave>
              <Wave d={1} as="h2" className="lx-title lx-title--light">Some questions <em>need a conversation.</em></Wave>
              <Wave d={2} as="p" className="lx-lead lx-lead--light">If you cannot find what you are looking for, contact our team for project-specific details, availability, site visits or brochure requests.</Wave>
              <div className="fq-help">
                {help.map(([n, t], i) => (
                  <Wave d={i} key={n} className="fq-help-item"><span>{n}</span><b>{t}</b></Wave>
                ))}
              </div>
              <Wave d={4} className="lx-row">
                <Link to="/contact" className="lx-btn">Contact our team <i>→</i></Link>
                <Link to="/projects" className="lx-btn lx-btn--ghost">Browse projects</Link>
              </Wave>
            </div>
          </div>
        </section>

        {/* ready to explore */}
        <section className="lx-cta" style={{ backgroundImage: 'url(/images/projects/serenity-villas.webp)' }}>
          <div className="lx-wrap lx-center">
            <Wave><p className="lx-kicker">Ready to explore?</p></Wave>
            <Wave d={1} as="h2" className="lx-title lx-title--light">Your questions are answered. <em>Now discover your next home.</em></Wave>
            <Wave d={2} as="p" className="lx-lead lx-lead--light">Explore our projects or speak with our team about finding the right property for you.</Wave>
            <Wave d={3} className="lx-row" style={{ justifyContent: 'center', marginTop: 34 }}>
              <Link to="/projects" className="lx-btn">Explore projects <i>→</i></Link>
              <Link to="/contact" className="lx-btn lx-btn--ghost">Enquire now</Link>
            </Wave>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default FAQ
