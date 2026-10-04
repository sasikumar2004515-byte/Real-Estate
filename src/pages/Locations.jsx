import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import Seo from '../components/Seo'
import MapEmbed from '../components/MapEmbed'
import { locationPoints, locations, projects, site } from '../data/site'

const locationImages = [
  '/images/locations/ecr-location.webp',
  '/images/locations/omr-location.webp',
  '/images/locations/anna-nagar-location.webp',
  '/images/projects/urban-heights.webp',
  '/images/projects/palm-grove.webp'
]

const fallbackHighlights = [
  'Prime Connectivity',
  'Lifestyle',
  'Key Amenities'
]

function Locations() {
  const [mapLocation, setMapLocation] = useState('All')
  const mapPoint =
    mapLocation === 'All' ? site.map : locationPoints[mapLocation] || site.map

  return (
    <>
      <Seo
        title="Locations"
        description="Explore our locations across Chennai with nearby schools, hospitals, transport and lifestyle highlights."
        image="/images/locations/ecr-location.webp"
        path="/locations"
      />

      <Header />

      <main className="locations-page">
        <section className="locations-hero">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Locations' }]} />
          {/* Hero */}
          <img
            src={locationImages[0]}
            alt="Premium residential location"
          />

          <div className="locations-hero-overlay" />

          <div className="page-container locations-hero-content reveal">
            <p className="section-eyebrow">OUR LOCATIONS</p>

            <h1>
              Well connected.{' '}
              <span>Carefully chosen.</span>
            </h1>

            <p>
              Discover residential destinations selected around
              connectivity, lifestyle and long-term potential.
            </p>
          </div>

          <div className="locations-hero-bottom">
            <span>EXPLORE OUR DESTINATIONS</span>
            <span>
              {locations.length.toString().padStart(2, '0')} LOCATIONS
            </span>
          </div>
        </section>

        <section className="locations-intro section-padding">
          <div className="page-container">
            <div className="locations-intro-grid">
              <div className="reveal">
                <p className="section-eyebrow">LOCATION MATTERS</p>

                <h2>
                  The right home{' '}
                  <span>starts with the right place.</span>
                </h2>
              </div>

              <p className="locations-intro-text reveal">
                We look beyond an address. Each location is considered
                for its connectivity, everyday convenience,
                neighbourhood character and access to the places
                that matter.
              </p>
            </div>
          </div>
        </section>

        <section className="locations-list section-padding">
          <div className="page-container">
            <div className="section-heading reveal">
              <div>
                <p className="section-eyebrow">DESTINATIONS</p>

                <h2>
                  Explore our{' '}
                  <span>locations.</span>
                </h2>
              </div>

              <span className="locations-count">
                {locations.length.toString().padStart(2, '0')} LOCATIONS
              </span>
            </div>

            <div className="locations-list-grid">
              {locations.map((location, index) => {
                const locationName = location.name || 'Chennai'

                const highlights =
                  Array.isArray(location.highlights) &&
                  location.highlights.length
                    ? location.highlights
                    : fallbackHighlights

                const locationProjects = projects.filter(
                  (project) =>
                    project.location?.toLowerCase() ===
                    locationName.toLowerCase()
                )

                return (
                  <article
                    className={`location-detail-card reveal reveal-delay-${
                      (index % 4) + 1
                    }`}
                    key={locationName}
                  >
                    <div className="location-detail-image">
                      {/* Location */}
                      <img
                        src={
                          locationImages[index] ||
                          locationImages[0]
                        }
                        alt={`${locationName} residential location`}
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />

                      <div className="location-detail-overlay" />

                      <span className="location-detail-number">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>

                      <span className="location-detail-arrow">
                        ↗
                      </span>

                      <div className="location-detail-title">
                        <span>CHENNAI</span>
                        <h3>{locationName}</h3>
                      </div>
                    </div>

                    <div className="location-detail-content">
                      <p>
                        {location.description ||
                          `Explore thoughtfully selected residential opportunities in ${locationName}, designed around connectivity, convenience and modern living.`}
                      </p>

                      <div className="nearby-highlights">
                        <span>NEARBY HIGHLIGHTS</span>

                        <div>
                          {highlights.map((highlight) => (
                            <strong key={highlight}>
                              {highlight}
                            </strong>
                          ))}
                        </div>
                      </div>

                      <div className="location-projects">
                        <span>PROJECTS IN THIS AREA</span>

                        {locationProjects.length > 0 ? (
                          locationProjects.map((project) => (
                            <Link
                              to={`/projects/${project.id}`}
                              key={project.id}
                            >
                              {project.name}
                              <span>↗</span>
                            </Link>
                          ))
                        ) : (
                          <p>New projects coming soon.</p>
                        )}
                      </div>

                      <Link
                        to="/contact"
                        className="location-enquire-link"
                      >
                        Enquire About This Location
                        <span>→</span>
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="locations-map-section section-padding">
          <div className="page-container">
            <div className="section-heading centered reveal">
              <p className="section-eyebrow">FIND US</p>

              <h2>
                Connected to{' '}
                <span>the city.</span>
              </h2>

              <p className="section-description">
                Explore our growing presence across key residential
                destinations.
              </p>
            </div>

            <div className="locations-map-card reveal">
              <div className="locations-map-visual has-embed">
                <MapEmbed
                  lat={mapPoint.lat}
                  lng={mapPoint.lng}
                  zoom={mapPoint.zoom}
                  title={`Map of ${mapLocation === 'All' ? 'Chennai' : mapLocation}`}
                />
              </div>

              <div className="locations-map-info">
                <p className="section-eyebrow">OUR PRESENCE</p>

                <h3>
                  Prime addresses across
                  <span>Chennai.</span>
                </h3>

                <p>
                  From established neighbourhoods to emerging growth
                  corridors, our locations are selected with everyday
                  connectivity and future potential in mind.
                </p>

                <div className="map-switcher" role="group" aria-label="Choose a location on the map">
                  {['All', ...locations.map((item) => item.name)].map((name) => (
                    <button
                      key={name}
                      type="button"
                      className={mapLocation === name ? 'is-active' : ''}
                      aria-pressed={mapLocation === name}
                      onClick={() => setMapLocation(name)}
                    >
                      {name === 'All' ? 'Chennai' : name}
                    </button>
                  ))}
                </div>

                <Link to="/projects" className="button button-dark">
                  Find a Property
                  <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="locations-lifestyle">
          <div className="page-container">
            <div className="locations-lifestyle-grid">
              <div className="locations-lifestyle-content reveal">
                <p className="section-eyebrow">
                  MORE THAN AN ADDRESS
                </p>

                <h2>
                  Live close to{' '}
                  <span>what matters.</span>
                </h2>

                <p>
                  A thoughtfully selected location can make everyday
                  life simpler — shorter commutes, better access to
                  essentials, connected neighbourhoods and spaces
                  to enjoy.
                </p>

                <div className="lifestyle-points">
                  <div>
                    <span>01</span>
                    <strong>Connectivity</strong>
                  </div>

                  <div>
                    <span>02</span>
                    <strong>Everyday Convenience</strong>
                  </div>

                  <div>
                    <span>03</span>
                    <strong>Lifestyle & Leisure</strong>
                  </div>

                  <div>
                    <span>04</span>
                    <strong>Growth Potential</strong>
                  </div>
                </div>
              </div>

              <div className="locations-lifestyle-image reveal">
                {/* Lifestyle */}
                <img
                  src={locationImages[1]}
                  alt="Connected residential neighbourhood"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="locations-cta">
          {/* CTA */}
          <img
            src={locationImages[3]}
            alt="Premium residential location"
            loading="lazy"
          />

          <div className="locations-cta-overlay" />

          <div className="page-container locations-cta-content reveal">
            <p className="section-eyebrow">FIND YOUR ADDRESS</p>

            <h2>
              Know the location.{' '}
              <span>Discover the lifestyle.</span>
            </h2>

            <p>
              Tell us what kind of location you are looking for and
              explore the projects that match.
            </p>

            <div className="hero-actions">
              <Link to="/projects" className="button button-gold">
                Explore Projects
                <span>↗</span>
              </Link>

              <Link
                to="/contact"
                className="button button-light-outline"
              >
                Talk to Our Team
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

export default Locations