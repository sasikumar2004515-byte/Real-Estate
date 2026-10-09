import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { projects, locations } from '../data/site'


const readyHomes = projects.filter((item) => item.status === 'Ready to Move').length
const homeTypes = new Set(projects.map((item) => item.type)).size

const stats = [
  { value: projects.length, suffix: '', label: 'Projects' },
  { value: readyHomes, suffix: '', label: 'Ready to Move' },
  { value: homeTypes, suffix: '', label: 'Home Types' },
  { value: locations.length, suffix: '', label: 'Locations' }
]

const values = [
  {
    icon: '◇',
    title: 'Quality',
    text: 'We focus on thoughtful design, dependable materials and lasting quality.'
  },
  {
    icon: '◈',
    title: 'Transparency',
    text: 'Clear information and straightforward communication guide every interaction.'
  },
  {
    icon: '◎',
    title: 'Customer First',
    text: 'Every property journey is shaped around the needs and expectations of our customers.'
  },
  {
    icon: '✦',
    title: 'Sustainability',
    text: 'We encourage responsible design and better long-term living environments.'
  }
]

const workSteps = [
  {
    number: '01',
    title: 'Consultation',
    text: 'We understand your requirements, lifestyle preferences and property goals.'
  },
  {
    number: '02',
    title: 'Site Visit',
    text: 'Explore the property, surroundings and available amenities with our team.'
  },
  {
    number: '03',
    title: 'Documentation',
    text: 'We guide you through the relevant property information and documentation.'
  },
  {
    number: '04',
    title: 'Handover',
    text: 'We stay connected through the final stages and help make the transition smooth.'
  }
]

function About() {
  return (
    <>
      <Header />

      <main className="about-page">

        {/* Page Banner */}
        <section className="about-banner">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=85"
            alt="Modern luxury residential property"
            width="2200"
            height="1200"
          />

          <div className="about-banner__overlay" />

          <div className="about-container about-banner__content">
            <span className="about-eyebrow">
              OUR STORY
            </span>

            <h1 data-animate="fade-up">
              About Us
            </h1>

            <nav
              className="about-breadcrumb"
              aria-label="Breadcrumb"
            >
              <Link to="/">
                Home
              </Link>

              <span aria-hidden="true">/</span>

              <span>
                About Us
              </span>
            </nav>
          </div>
        </section>


        {/* Company Introduction */}
        <section className="about-section about-intro">
          <div className="about-container about-intro__grid">

            <div
              className="about-intro__content"
              data-animate="fade-right"
            >
              <span className="about-section-label">
                WHO WE ARE
              </span>

              <h2>
                Building More Than
                <br />
                <em>Properties.</em>
              </h2>

              <p>
                We are a customer-focused real estate company committed
                to creating meaningful property experiences through
                quality, transparency and professional service.
              </p>

              <p>
                From helping families find the right home to supporting
                property decisions with clarity, we believe every
                real estate journey deserves trust and attention to detail.
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


            <div
              className="about-intro__visual"
              data-animate="fade-left"
            >
              <div
                className="about-intro__gold-frame"
                aria-hidden="true"
              />

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


        {/* Mission and Vision */}
        <section className="about-section about-mission">
          <div className="about-container">

            <div className="about-section-heading">
              <span className="about-section-label">
                OUR DIRECTION
              </span>

              <h2>
                Purpose behind
                <br />
                <em>every property.</em>
              </h2>
            </div>

            <div className="about-mission__grid">

              <article
                className="about-purpose-card"
                data-animate="fade-up"
                data-delay="1"
              >
                <div
                  className="about-purpose-card__icon"
                  aria-hidden="true"
                >
                  ◎
                </div>

                <span>01</span>

                <h3>Our Mission</h3>

                <p>
                  To create quality property experiences through
                  thoughtful development, transparent communication
                  and dependable customer support.
                </p>
              </article>


              <article
                className="about-purpose-card"
                data-animate="fade-up"
                data-delay="2"
              >
                <div
                  className="about-purpose-card__icon"
                  aria-hidden="true"
                >
                  ✦
                </div>

                <span>02</span>

                <h3>Our Vision</h3>

                <p>
                  To build a trusted real estate brand known for
                  better spaces, responsible development and
                  long-term relationships.
                </p>
              </article>

            </div>
          </div>
        </section>


        {/* Core Values */}
        <section className="about-section about-values">
          <div className="about-container">

            <div className="about-section-heading about-section-heading--center">
              <span className="about-section-label">
                WHAT GUIDES US
              </span>

              <h2>
                Our Core
                <br />
                <em>Values.</em>
              </h2>
            </div>


            <div
              className="about-values__grid"
              data-stagger
            >
              {values.map((value) => (
                <article
                  className="about-value-card why-card"
                  data-animate="fade-up"
                  key={value.title}
                >
                  <div
                    className="about-value-card__icon"
                    aria-hidden="true"
                  >
                    {value.icon}
                  </div>

                  <h3>{value.title}</h3>

                  <p>{value.text}</p>
                </article>
              ))}
            </div>

          </div>
        </section>


        {/* Stats */}
        <section className="about-stats">
          <div className="about-container about-stats__grid">

            {stats.map((stat) => (
              <div
                className="about-stat"
                key={stat.label}
              >
                <strong>
                  <span data-count={stat.value}>0</span>
                  {stat.suffix}
                </strong>

                <span>
                  {stat.label}
                </span>
              </div>
            ))}

          </div>
        </section>


        {/* How We Work */}
        <section className="about-section about-work">
          <div className="about-container">

            <div className="about-work__heading">
              <span className="about-section-label">
                OUR PROCESS
              </span>

              <h2>
                How We
                <br />
                <em>Work.</em>
              </h2>

              <p>
                A clear and considered process helps make your
                property journey simpler from the first conversation
                to the final handover.
              </p>
            </div>


            <div
              className="about-work__steps"
              data-stagger
            >
              {workSteps.map((step) => (
                <article
                  className="about-step-card"
                  data-animate="fade-up"
                  key={step.number}
                >
                  <span className="about-step-card__number">
                    {step.number}
                  </span>

                  <h3>{step.title}</h3>

                  <p>{step.text}</p>
                </article>
              ))}
            </div>


            <div className="about-standards">

              <div>
                <span className="about-section-label">
                  QUALITY STANDARDS
                </span>

                <h3>
                  Details that make
                  <br />
                  a difference.
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




        {/* CTA */}
        <section className="about-cta">
          <div
            className="about-container about-cta__inner"
            data-animate="zoom-in"
          >
            <div>
              <span className="about-section-label">
                LET'S TALK
              </span>

              <h2>
                Ready to find
                <br />
                your <em>next place?</em>
              </h2>
            </div>

            <div className="about-cta__actions">
              <Link
                to="/contact"
                className="about-button about-button--gold"
                aria-label="Talk to us about your property requirements"
              >
                Talk to Us
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                to="/projects"
                className="about-button about-button--outline"
                aria-label="Explore our real estate projects"
              >
                Explore Projects
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}

export default About