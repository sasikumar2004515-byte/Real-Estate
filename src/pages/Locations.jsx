import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Wave from '../components/Wave'
import { locations, projects } from '../data/site'

const matters = [
  ['01', 'Connectivity', 'Metro, rail and arterial roads within easy reach, so the city stays close.'],
  ['02', 'Daily convenience', 'Schools, hospitals and shopping inside a short drive of every address.'],
  ['03', 'Lifestyle', 'Beaches, parks and dining that turn weekends into something to look forward to.'],
  ['04', 'Growth', 'Corridors chosen for the long term, where value is built over years.'],
]

const pillars = [
  ['Connectivity', 'Shorter commutes and well-linked neighbourhoods.', '⇄'],
  ['Everyday convenience', 'Essentials, healthcare and education close by.', '◉'],
  ['Lifestyle & leisure', 'Places to unwind, within a few minutes of home.', '✦'],
  ['Growth potential', 'Locations that gain value as the city grows.', '↗'],
]

const mapQuery = (name) => `https://www.google.com/maps?q=${encodeURIComponent(`${name}, Chennai, Tamil Nadu, India`)}&z=13&output=embed`

function Locations() {
  const [dest, setDest] = useState(0)
  const [pin, setPin] = useState(0)
  const d = locations[dest]
  const here = projects.filter((p) => p.location === d.name)

  return (
    <>
      <Header />
      <main className="lc" data-own>
        {/* hero */}
        <section className="lx-hero">
          <img src="/images/locations/ecr-location.webp" alt="Chennai coastline at sunset" />
          <div className="lx-wrap">
            <Wave className="lx-crumbs"><Link to="/">Home</Link><span>/</span><span>Locations</span></Wave>
            <Wave d={1}><p className="lx-kicker">Our locations</p></Wave>
            <Wave d={2} as="h1">Well connected. <em>Carefully chosen.</em></Wave>
            <Wave d={3} as="p" className="lx-sub">Residential destinations selected around connectivity, lifestyle and long-term potential.</Wave>
            <Wave d={4} className="lc-hero-meta">
              <span><b>{String(locations.length).padStart(2, '0')}</b> destinations</span>
              <span><b>{String(projects.length).padStart(2, '0')}</b> projects</span>
              <a href="#destinations" className="lx-btn lx-btn--ghost lx-btn--sm">Explore <i>↓</i></a>
            </Wave>
          </div>
          <div className="lx-scrollcue" aria-hidden="true"><i />Scroll</div>
        </section>

        {/* location matters */}
        <section className="lx-section lx-section--navy lc-matters">
          <div className="lc-ticker" aria-hidden="true">
            <div>{[...locations, ...locations, ...locations].map((l, i) => <span key={i}>{l.name}<i>✦</i></span>)}</div>
          </div>
          <div className="lx-wrap lc-matters-grid">
            <Wave kind="left">
              <p className="lx-kicker">Location matters</p>
              <h2 className="lx-title lx-title--light">Where you live shapes <em>how you live.</em></h2>
              <p className="lx-lead lx-lead--light">Every Nivora address is chosen first, long before a design is drawn. The right location saves time every day and holds its value for years.</p>
              <Link to="/projects" className="lx-btn" style={{ marginTop: 34 }}>See the projects <i>→</i></Link>
            </Wave>
            <div className="lc-matters-cards">
              {matters.map(([n, t, text], i) => (
                <Wave d={i} key={n} className="lc-matter">
                  <span>{n}</span>
                  <h3>{t}</h3>
                  <p>{text}</p>
                </Wave>
              ))}
            </div>
          </div>
        </section>

        {/* destinations */}
        <section className="lx-section lx-section--ivory lc-dest" id="destinations">
          <div className="lx-wrap">
            <Wave className="lc-dest-head">
              <div>
                <p className="lx-kicker lx-kicker--dark">Destinations</p>
                <h2 className="lx-title">Five corridors, <em>one standard.</em></h2>
              </div>
              <span className="lc-dest-count">{String(dest + 1).padStart(2, '0')} / {String(locations.length).padStart(2, '0')}</span>
            </Wave>

            <div className="lc-dest-grid">
              <Wave kind="left" as="ul" className="lc-dest-tabs">
                {locations.map((l, i) => (
                  <li key={l.name}>
                    <button className={i === dest ? 'on' : ''} onClick={() => setDest(i)}>
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      <b>{l.name}</b>
                      <i>→</i>
                    </button>
                  </li>
                ))}
              </Wave>

              <div className="lc-dest-panel" key={d.name}>
                <div className="lc-dest-img">
                  <img src={d.image} alt={`${d.name}, Chennai`} />
                  <span>{d.name}</span>
                </div>
                <div className="lc-dest-body">
                  <p>{d.description}</p>
                  <ul>{d.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
                  {here.length > 0 && (
                    <div className="lc-dest-projects">
                      <small>Projects here</small>
                      {here.map((p) => <Link key={p.id} to={`/projects/${p.id}`}>{p.name}<i>→</i></Link>)}
                    </div>
                  )}
                  <Link to="/contact" className="lx-btn lx-btn--dark lx-btn--sm">Enquire about {d.name} <i>→</i></Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* find us */}
        <section className="lx-section lx-section--stone lc-find">
          <div className="lx-wrap">
            <Wave className="lx-center">
              <p className="lx-kicker lx-kicker--dark">Find us</p>
              <h2 className="lx-title">Connected to <em>the city.</em></h2>
              <p className="lx-lead">Pick a destination to see exactly where it sits on the map.</p>
            </Wave>
            <Wave d={1} className="lc-map-card">
              <div className="lc-map-tabs">
                {locations.map((l, i) => <button key={l.name} className={i === pin ? 'on' : ''} onClick={() => setPin(i)}>{l.name}</button>)}
              </div>
              <div className="lc-map-frame">
                <iframe key={locations[pin].name} title={`Map of ${locations[pin].name}, Chennai`} src={mapQuery(locations[pin].name)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </div>
              <div className="lc-map-foot">
                <div>
                  <small>Now showing</small>
                  <b>{locations[pin].name}, Chennai</b>
                </div>
                <a className="lx-btn lx-btn--sm" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locations[pin].name + ', Chennai')}`}>Open in Maps <i>↗</i></a>
              </div>
            </Wave>
          </div>
        </section>

        {/* more than an address */}
        <section className="lx-section lc-more">
          <div className="lx-wrap lc-more-grid">
            <Wave kind="left" className="lc-more-copy">
              <p className="lx-kicker">More than an address</p>
              <h2 className="lx-title lx-title--light">Live close to <em>what matters.</em></h2>
              <p className="lx-lead lx-lead--light">A well-chosen location makes everyday life simpler: shorter commutes, easy access to essentials, connected neighbourhoods and spaces to enjoy.</p>
              <div className="lc-pillars">
                {pillars.map(([t, text, icon], i) => (
                  <Wave d={i} key={t} className="lc-pillar">
                    <span>{icon}</span>
                    <div><b>{t}</b><small>{text}</small></div>
                  </Wave>
                ))}
              </div>
            </Wave>
            <Wave kind="right" className="lc-more-img">
              <img src="/images/locations/omr-location.webp" alt="Connected residential neighbourhood" loading="lazy" />
              <div className="lc-float lc-float--a"><b>15 min</b><small>to the IT corridor</small></div>
              <div className="lc-float lc-float--b"><b>5 min</b><small>to schools</small></div>
            </Wave>
          </div>
        </section>

        <section className="lx-cta" style={{ backgroundImage: 'url(/images/projects/urban-heights.webp)' }}>
          <div className="lx-wrap lx-center">
            <Wave><p className="lx-kicker">Find your address</p></Wave>
            <Wave d={1} as="h2" className="lx-title lx-title--light">Know the location. <em>Discover the lifestyle.</em></Wave>
            <Wave d={2} as="p" className="lx-lead lx-lead--light">Tell us what you are looking for and we will show you the projects that match.</Wave>
            <Wave d={3} className="lx-row" style={{ justifyContent: 'center', marginTop: 34 }}>
              <Link to="/projects" className="lx-btn">Explore projects <i>→</i></Link>
              <Link to="/contact" className="lx-btn lx-btn--ghost">Talk to our team</Link>
            </Wave>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Locations
