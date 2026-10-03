import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import { locations, projects } from '../data/site'

const heroSlides = [
  {
    image: '/images/projects/serenity-villas.webp',
    eyebrow: 'PREMIUM REAL ESTATE',
    title: 'A better place',
    accent: 'to call home.',
    description: 'Thoughtfully designed homes in prime locations.',
  },
  {
    image: '/images/projects/lakeside-residences.webp',
    eyebrow: 'DESIGNED FOR BETTER LIVING',
    title: 'Spaces made',
    accent: 'for living beautifully.',
    description: 'Modern residences created around comfort and connectivity.',
  },
  {
    image: '/images/projects/palm-grove.webp',
    eyebrow: 'PRIVATE RESIDENCES',
    title: 'Live closer',
    accent: 'to what matters.',
    description: 'Homes designed for comfort, privacy and everyday living.',
  },
]

const whyChooseUs = [
  {
    number: '01',
    icon: '◆',
    title: 'Quality Construction',
    text: 'Thoughtful materials, careful execution and attention to lasting detail.',
  },
  {
    number: '02',
    icon: '◇',
    title: 'Transparency',
    text: 'Clear property information and straightforward communication at every step.',
  },
  {
    number: '03',
    icon: '◎',
    title: 'Customer Support',
    text: 'A responsive team that stays connected throughout your property journey.',
  },
  {
    number: '04',
    icon: '✦',
    title: 'Trusted Experience',
    text: 'Experience shaped by quality-focused development and lasting relationships.',
  },
]

const testimonials = [
  {
    initial: 'A',
    text: 'Replace with approved customer feedback before launch.',
    name: 'Customer Name',
    location: 'Homeowner · Chennai',
  },
  {
    initial: 'R',
    text: 'Replace with approved customer feedback before launch.',
    name: 'Customer Name',
    location: 'Homeowner · Chennai',
  },
  {
    initial: 'S',
    text: 'Replace with approved customer feedback before launch.',
    name: 'Customer Name',
    location: 'Homeowner · Chennai',
  },
]

const locationImages = [
  '/images/locations/ecr-location.webp',
  '/images/locations/omr-location.webp',
  '/images/locations/anna-nagar-location.webp',
  '/images/projects/urban-heights.webp',
]

const locationHighlights = [
  'Coastal living with premium connectivity.',
  'Work, life and convenience within reach.',
  'Established neighbourhood living.',
  'Urban convenience with strong connectivity.',
]

function Home() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll('.home-reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
      }
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  const slide = heroSlides[activeSlide]

  return (
    <>
      <Seo
        title="Premium Homes in Chennai"
        description="Explore premium villas and apartments across ECR, OMR and Anna Nagar. Thoughtfully designed homes with transparent processes and dedicated support."
        image="/images/projects/serenity-villas.webp"
        path="/"
      />

      <Header />

      <main className="home-page">

        {/* Hero */}
        <section className="home-hero">

          {heroSlides.map((item, index) => (
            <div
              key={item.image}
              className={`home-hero-slide ${
                index === activeSlide ? 'active' : ''
              }`}
              aria-hidden={index !== activeSlide}
            >
              {/* Hero */}
              <img
                src={item.image}
                alt={item.title}
                width="2200"
                height="1400"
              />

              <div className="home-hero-overlay" />
            </div>
          ))}

          <div className="home-hero-content">
            <div className="home-container">

              <div className="home-hero-copy">

                <span className="home-eyebrow">
                  {slide.eyebrow}
                </span>

                <h1>
                  {slide.title}
                  <br />
                  <em>{slide.accent}</em>
                </h1>

                <p>{slide.description}</p>

                <div className="home-hero-actions">

                  <Link
                    to="/projects"
                    className="home-button home-button-gold"
                  >
                    Explore Projects
                    <span>→</span>
                  </Link>

                  <Link
                    to="/contact"
                    className="home-button home-button-outline"
                  >
                    Enquire Now
                  </Link>

                </div>

              </div>

            </div>
          </div>

          <div className="home-hero-bottom">
            <div className="home-container home-hero-bottom-inner">

              <div className="home-hero-counter">
                <strong>
                  {String(activeSlide + 1).padStart(2, '0')}
                </strong>

                <span>/</span>

                <span>
                  {String(heroSlides.length).padStart(2, '0')}
                </span>
              </div>

              <div className="home-hero-progress">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={index === activeSlide ? 'active' : ''}
                    aria-label={`Show hero slide ${index + 1}`}
                    onClick={() => setActiveSlide(index)}
                  />
                ))}
              </div>

              <div className="home-hero-scroll">
                <span>SCROLL</span>
                <strong>↓</strong>
              </div>

            </div>
          </div>

        </section>


        {/* Featured Properties */}
        <section className="home-section home-featured">

          <div className="home-container">

            <div className="home-section-heading home-reveal">

              <div>
                <span className="home-eyebrow-dark">
                  FEATURED PROPERTIES
                </span>

                <h2>
                  Spaces designed
                  <br />
                  for better living.
                </h2>
              </div>

              <p>
                Explore thoughtfully planned residences created around
                comfort, quality and connectivity.
              </p>

            </div>


            <div className="home-property-grid">

              {projects.slice(0, 3).map((project) => (

                <article
                  className="home-property-card home-reveal"
                  key={project.id}
                >

                  <Link
                    to={`/projects/${project.id}`}
                    className="home-property-image"
                  >
                    {/* Property */}
                    <img
                      src={project.image}
                      alt={project.name}
                      width="1200"
                      height="900"
                      loading="lazy"
                    />

                    <span className="home-property-tag">
                      {project.type || 'Residence'}
                    </span>
                  </Link>


                  <div className="home-property-content">

                    <span className="home-property-location">
                      {project.location}
                    </span>

                    <h3>{project.name}</h3>

                    <div className="home-property-details">

                      <div>
                        <span>AREA</span>
                        <strong>
                          {project.area || '1,500+ sq.ft'}
                        </strong>
                      </div>

                      <div>
                        <span>CONFIGURATION</span>
                        <strong>
                          {project.configuration || '3 BHK'}
                        </strong>
                      </div>

                      <div>
                        <span>STATUS</span>
                        <strong>
                          {project.status || 'Available'}
                        </strong>
                      </div>

                    </div>

                    <Link
                      to={`/projects/${project.id}`}
                      className="home-card-link"
                    >
                      View Details
                      <span>↗</span>
                    </Link>

                  </div>

                </article>

              ))}

            </div>

          </div>

        </section>


        {/* Why Choose Us */}
        <section className="home-section home-why">

          <div className="home-container">

            <div className="home-centered-heading home-reveal">

              <span className="home-eyebrow-dark">
                WHY CHOOSE US
              </span>

              <h2>
                Built on principles
                <br />
                that matter.
              </h2>

              <p>
                From the first conversation to the day you move in,
                we focus on creating a dependable property experience.
              </p>

            </div>


            <div className="home-why-grid">

              {whyChooseUs.map((item) => (

                <article
                  className="home-why-card home-reveal"
                  key={item.number}
                >

                  <div className="home-why-top">

                    <div className="home-why-icon">
                      {item.icon}
                    </div>

                    <span>{item.number}</span>

                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.text}</p>

                </article>

              ))}

            </div>

          </div>

        </section>


        {/* Popular Locations */}
        <section className="home-section home-locations">

          <div className="home-container">

            <div className="home-section-heading home-location-heading home-reveal">

              <div>

                <span className="home-eyebrow-dark">
                  POPULAR LOCATIONS
                </span>

                <h2>
                  Connected to
                  <br />
                  what matters.
                </h2>

              </div>

              <Link
                to="/locations"
                className="home-text-link"
              >
                Explore Locations
                <span>→</span>
              </Link>

            </div>


            <div className="home-location-grid">

              {locations.slice(0, 4).map((location, index) => (

                <Link
                  to="/locations"
                  className={`home-location-card home-location-${index + 1} home-reveal`}
                  key={location.name}
                >

                  {/* Location */}
                  <img
                    src={locationImages[index]}
                    alt={location.name}
                    width="1400"
                    height="1000"
                    loading="lazy"
                  />

                  <div className="home-location-overlay" />

                  <div className="home-location-content">

                    <span>
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <h3>{location.name}</h3>

                    <p>
                      {locationHighlights[index]}
                    </p>

                  </div>

                  <span className="home-location-arrow">
                    ↗
                  </span>

                </Link>

              ))}

            </div>

          </div>

        </section>


        {/* Testimonials */}
        <section className="home-section home-testimonials">

          <div className="home-container">

            <div className="home-centered-heading home-reveal">

              <span className="home-eyebrow-dark">
                CUSTOMER STORIES
              </span>

              <h2>
                What homeowners
                <br />
                have to say.
              </h2>

            </div>


            <div className="home-testimonial-grid">

              {testimonials.map((testimonial) => (

                <article
                  className="home-testimonial-card home-reveal"
                  key={testimonial.initial}
                >

                  <span className="home-testimonial-mark">
                    “
                  </span>

                  <p>
                    {testimonial.text}
                  </p>

                  <div className="home-testimonial-author">

                    <div className="home-author-avatar">
                      {testimonial.initial}
                    </div>

                    <div>
                      <strong>{testimonial.name}</strong>
                      <span>{testimonial.location}</span>
                    </div>

                  </div>

                </article>

              ))}

            </div>

          </div>

        </section>


        {/* Final CTA */}
        <section className="home-final-cta">

          <div className="home-container home-final-cta-inner">

            <div className="home-reveal">

              <span className="home-eyebrow">
                FIND YOUR NEXT HOME
              </span>

              <h2>
                Your next chapter
                <br />
                starts here.
              </h2>

              <p>
                Explore our properties or speak with our team
                to find a place that fits your lifestyle.
              </p>

            </div>


            <div className="home-final-actions home-reveal">

              <Link
                to="/contact"
                className="home-button home-button-gold"
              >
                Contact Us
                <span>→</span>
              </Link>

              <Link
                to="/projects"
                className="home-button home-button-outline"
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

export default Home