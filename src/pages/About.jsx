import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { projects, locations } from '../data/site'
import Process from '../components/home/Process'
import CtaBand from '../components/CtaBand'
import Wave from '../components/Wave'

const readyHomes = projects.filter((item) => item.status === 'Ready to Move').length
const homeTypes = new Set(projects.map((item) => item.type)).size

const stats = [
  { value: projects.length, suffix: '', label: 'Projects' },
  { value: readyHomes, suffix: '', label: 'Ready to Move' },
  { value: homeTypes, suffix: '', label: 'Home Types' },
  { value: locations.length, suffix: '', label: 'Locations' },
]

const values = [
  {
    icon: '◇',
    title: 'Quality',
    text: 'We focus on thoughtful design, dependable materials and lasting quality.',
  },
  {
    icon: '◈',
    title: 'Transparency',
    text: 'Clear information and straightforward communication guide every interaction.',
  },
  {
    icon: '◎',
    title: 'Customer First',
    text: 'Every property journey is shaped around the needs and expectations of our customers.',
  },
  {
    icon: '✦',
    title: 'Sustainability',
    text: 'We encourage responsible design and better long-term living environments.',
  },
]

const workSteps = [
  {
    number: '01',
    title: 'Consultation',
    text: 'We understand your requirements, lifestyle preferences and property goals.',
  },
  {
    number: '02',
    title: 'Site Visit',
    text: 'Explore the property, surroundings and available amenities with our team.',
  },
  {
    number: '03',
    title: 'Documentation',
    text: 'We guide you through the relevant property information and documentation.',
  },
  {
    number: '04',
    title: 'Handover',
    text: 'We stay connected through the final stages and help make the transition smooth.',
  },
]

function About() {
  return (
    <>
      <Header />

      <main className="about-page">
        <section className="lx-hero">
          <img src="/images/about/about-hero.webp" alt="Modern Nivora residence" />
          <div className="lx-wrap">
            <Wave className="lx-crumbs">
              <Link to="/">Home</Link>
              <span>/</span>
              <span>About Us</span>
            </Wave>
            <Wave d={1}>
              <p className="lx-kicker">Our story</p>
            </Wave>
            <Wave d={2} as="h1" className="lx-h1">
              About <em>Us.</em>
            </Wave>
            <Wave d={3} as="p" className="lx-sub">
              A customer-focused real estate company committed to creating meaningful property
              experiences through quality, transparency and professional service.
            </Wave>
            <Wave d={4} className="lx-row">
              <Link to="/projects" className="lx-btn">
                Our projects <i>→</i>
              </Link>
              <Link to="/contact" className="lx-btn lx-btn--ghost">
                Book a site visit
              </Link>
            </Wave>
          </div>
        </section>

        <section className="about-section about-intro">
          <div className="about-container about-intro__grid">
            <div className="about-intro__content" data-animate="fade-right">
              <span className="about-section-label">WHO WE ARE</span>

              <h2>
                Building More Than
                <br />
                <em>Properties.</em>
              </h2>

              <p>
                We are a customer-focused real estate company committed to creating meaningful
                property experiences through quality, transparency and professional service.
              </p>

              <p>
                From helping families find the right home to supporting property decisions with
                clarity, we believe every real estate journey deserves trust and attention to
                detail.
              </p>

              <div className="about-intro__highlights">
                <div>
                  <span aria-hidden="true">✓</span>
                  <strong>Quality-focused properties</strong>
                </div>

                <div>
                  <span aria-hidden="true">✓</span>
                  <strong>Transparent communication</strong>
                </div>

                <div>
                  <span aria-hidden="true">✓</span>
                  <strong>Customer-focused service</strong>
                </div>
              </div>
            </div>

            <div className="about-intro__visual" data-animate="fade-left">
              <div className="about-intro__gold-frame" aria-hidden="true" />

              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
                alt="Luxury modern living room"
                width="1200"
                height="1400"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="about-section about-mission">
          <div className="about-container">
            <div className="about-section-heading">
              <span className="about-section-label">OUR DIRECTION</span>

              <h2>
                Purpose behind
                <br />
                <em>every property.</em>
              </h2>
            </div>

            <div className="about-mission__grid">
              <article className="about-purpose-card" data-animate="fade-up" data-delay="1">
                <div className="about-purpose-card__icon" aria-hidden="true">
                  ◎
                </div>

                <span>01</span>

                <h3>Our Mission</h3>

                <p>
                  To create quality property experiences through thoughtful development, transparent
                  communication and dependable customer support.
                </p>
              </article>

              <article className="about-purpose-card" data-animate="fade-up" data-delay="2">
                <div className="about-purpose-card__icon" aria-hidden="true">
                  ✦
                </div>

                <span>02</span>

                <h3>Our Vision</h3>

                <p>
                  To build a trusted real estate brand known for better spaces, responsible
                  development and long-term relationships.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="about-section about-values">
          <div className="about-container">
            <div className="about-section-heading about-section-heading--center">
              <span className="about-section-label">WHAT GUIDES US</span>

              <h2>
                Our Core
                <br />
                <em>Values.</em>
              </h2>
            </div>

            <div className="about-values__grid" data-stagger>
              {values.map((value) => (
                <article
                  className="about-value-card why-card"
                  data-animate="fade-up"
                  key={value.title}
                >
                  <div className="about-value-card__icon" aria-hidden="true">
                    {value.icon}
                  </div>

                  <h3>{value.title}</h3>

                  <p>{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-stats">
          <div className="about-container about-stats__grid">
            {stats.map((stat) => (
              <div className="about-stat" key={stat.label}>
                <strong>
                  <span data-count={stat.value}>0</span>
                  {stat.suffix}
                </strong>

                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <Process
          kicker="Our process"
          title="How we work."
          intro="A clear and considered process helps make your property journey simpler from the first conversation to the final handover."
          steps={workSteps.map(({ title, text }) => ({ name: title, text }))}
        />

        <section className="about-section about-work">
          <div className="about-container">
            <div className="about-standards">
              <div>
                <span className="about-section-label">QUALITY STANDARDS</span>

                <h3>
                  Details that make
                  <br />a difference.
                </h3>
              </div>

              <ul>
                <li>Carefully selected materials and finishes</li>
                <li>Quality-focused project execution</li>
                <li>Clear property information</li>
                <li>Responsive customer support</li>
              </ul>
            </div>
          </div>
        </section>

        <CtaBand
          image="/images/about/about-mission.webp"
          title="Ready to find your next place?"
          text="Tell us about the home you have in mind and we will help you find it."
          primary={{ label: 'Talk to us', to: '/contact' }}
          secondary={{ label: 'Explore projects', to: '/projects' }}
          items={['Personal site visit', 'Project walkthrough', 'Talk to the team']}
        />
      </main>

      <Footer />
    </>
  )
}

export default About
