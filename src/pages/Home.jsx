import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollHero from '../components/ScrollHero'
import FocusCarousel from '../components/FocusCarousel'
import Process from '../components/home/Process'
import GallerySlider from '../components/home/GallerySlider'
import MiniFaq from '../components/home/MiniFaq'
import { projects, locations, galleryImages } from '../data/site'

const principles = [
  ['Context', 'Every site is read first: its surroundings, access and orientation.'],
  ['Light', 'Rooms are planned for daylight and cross ventilation.'],
  ['Longevity', 'Detailing and materials are chosen to age well.'],
]

function Home() {
  const lifestyle = galleryImages[3] || galleryImages[1]
  const backdrop = galleryImages[1] || galleryImages[0]

  return (
    <>
      <Header />
      <main className="nx">
        <ScrollHero />

        <section className="panel panel-ivory approach">
          <div className="approach-text">
            <p className="nx-kicker">Our approach</p>
            <h2>We build homes in Chennai for people who plan to stay.</h2>
            <p>
              Every project starts with the site, the light and the neighbourhood, and only
              then with the drawings. The aim is homes that work on an ordinary Tuesday as
              well as they photograph.
            </p>
            <Link to="/about" className="nx-btn nx-btn-dark">Read our story <i>→</i></Link>
          </div>
          <figure className="approach-image">
            <img src="/images/about/about-mission.webp" alt="Nivora team reviewing plans on site" loading="lazy" />
          </figure>
          <ul className="approach-points">
            {['Thoughtful design', 'Better locations', 'Long-term value'].map((t) => <li key={t}>{t}</li>)}
          </ul>
        </section>

        <FocusCarousel items={projects} title="Featured projects" />

        <section className="panel panel-navy philosophy">
          <h2>Designed around how people actually live.</h2>
          <ol>
            {principles.map(([name, text], i) => (
              <li key={name}>
                <b>{String(i + 1).padStart(2, '0')}</b>
                <h3>{name}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <Link to="/about" className="nx-btn nx-btn-ghost">Our philosophy <i>→</i></Link>
        </section>

        <section className="panel panel-ivory places">
          <div className="places-text">
            <p className="nx-kicker">The locations</p>
            <h2>Close to the city. Closer to what matters.</h2>
            <p>Our projects sit in established Chennai neighbourhoods with schools, work and everyday needs close by.</p>
            <Link to="/locations" className="nx-btn nx-btn-dark">Explore locations <i>→</i></Link>
          </div>
          <div className="places-cards">
            {locations.slice(0, 3).map((l) => (
              <Link to="/locations" className="place" key={l.name}>
                <img src={l.image} alt={`${l.name}, Chennai`} loading="lazy" />
                <div><h3>{l.name}</h3><p>{l.highlights?.slice(0, 2).join(' · ')}</p></div>
              </Link>
            ))}
          </div>
        </section>

        <GallerySlider items={galleryImages} />

        <Process />

        <section className="panel panel-ivory life">
          <figure><img src={lifestyle.image} alt={lifestyle.title} loading="lazy" /></figure>
          <div>
            <p className="nx-kicker">Everyday life</p>
            <h2>Rooms made for ordinary days.</h2>
            <p>Generous light, easy circulation and views that change through the day. The details are chosen for living in, not for the brochure.</p>
            <Link to="/gallery" className="nx-btn nx-btn-dark">See the interiors <i>→</i></Link>
          </div>
        </section>

        <MiniFaq />

        <section className="panel cta" style={{ backgroundImage: `linear-gradient(90deg,rgba(11,26,46,.92),rgba(11,26,46,.55)),url(${backdrop.image})` }}>
          <div>
            <h2>See it for yourself.</h2>
            <p>Walk through the spaces, understand the location and talk to the team.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="nx-btn">Book a site visit <i>→</i></Link>
              <Link to="/contact" className="nx-btn nx-btn-ghost">Get in touch</Link>
            </div>
          </div>
          <ul>
            <li>Personal site visit</li>
            <li>Project walkthrough</li>
            <li>Talk to the team</li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Home
