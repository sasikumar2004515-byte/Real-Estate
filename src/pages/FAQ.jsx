import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import Seo from '../components/Seo'
import { faqs } from '../data/site'

const categories = [
  'All',
  'Projects',
  'Booking',
  'Site Visit',
  'Support'
]

function FAQ() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [openIndex, setOpenIndex] = useState(null)

  const filteredFaqs =
    activeCategory === 'All'
      ? faqs
      : faqs.filter((item) => item.category === activeCategory)

  const toggleFaq = (index) => {
    setOpenIndex((current) =>
      current === index ? null : index
    )
  }

  return (
    <>
      <Seo
        title="FAQ"
        description="Answers about projects, locations, booking process, site visits, brochures and amenities."
        image="/images/projects/greenfield-apartments.webp"
        path="/faq"
      />

      <Header />

      <main className="faq-page">
        <section className="faq-hero">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} />
          {/* Hero */}
          <img
            src="/images/projects/greenfield-apartments.webp"
            alt="Premium residential project"
          />

          <div className="faq-hero-overlay" />

          <div className="page-container faq-hero-content reveal">
            <p className="section-eyebrow">FREQUENTLY ASKED</p>

            <h1>
              Questions,{' '}
              <span>answered clearly.</span>
            </h1>

            <p>
              Find quick answers about our projects, locations,
              site visits, brochures and the property journey.
            </p>
          </div>

          <div className="faq-hero-bottom">
            <span>HELP CENTRE</span>
            <span>
              {faqs.length.toString().padStart(2, '0')} ANSWERS
            </span>
          </div>
        </section>

        <section className="faq-content section-padding">
          <div className="page-container">
            <div className="faq-layout">
              <aside className="faq-sidebar reveal">
                <p className="section-eyebrow">CATEGORIES</p>

                <h2>
                  Find what{' '}
                  <span>you need.</span>
                </h2>

                <p>
                  Browse questions by category or explore all
                  frequently asked questions.
                </p>

                <div className="faq-category-list">
                  {categories.map((category) => (
                    <button
                      type="button"
                      key={category}
                      className={
                        activeCategory === category
                          ? 'active'
                          : ''
                      }
                      onClick={() => {
                        setActiveCategory(category)
                        setOpenIndex(null)
                      }}
                    >
                      <span>{category}</span>

                      <strong>
                        {category === 'All'
                          ? faqs.length
                          : faqs.filter(
                              (item) =>
                                item.category === category
                            ).length}
                      </strong>
                    </button>
                  ))}
                </div>

                <div className="faq-sidebar-card">
                  <span>STILL HAVE QUESTIONS?</span>

                  <p>
                    Our team is happy to help with project-specific
                    information.
                  </p>

                  <Link to="/contact">
                    Talk to Our Team
                    <span>↗</span>
                  </Link>
                </div>
              </aside>

              <div className="faq-list-wrap reveal reveal-delay-1">
                <div className="faq-list-header">
                  <span>
                    {filteredFaqs.length
                      .toString()
                      .padStart(2, '0')}{' '}
                    QUESTIONS
                  </span>

                  <span>{activeCategory}</span>
                </div>

                <div className="faq-list">
                  {filteredFaqs.map((item, index) => {
                    const isOpen = openIndex === index

                    return (
                      <article
                        className={`faq-item ${
                          isOpen ? 'open' : ''
                        }`}
                        key={`${item.category}-${item.question}`}
                      >
                        <button
                          type="button"
                          className="faq-question"
                          onClick={() => toggleFaq(index)}
                          aria-expanded={isOpen}
                        >
                          <span className="faq-question-number">
                            {(index + 1)
                              .toString()
                              .padStart(2, '0')}
                          </span>

                          <span className="faq-question-text">
                            {item.question}
                          </span>

                          <span className="faq-toggle">
                            {isOpen ? '−' : '+'}
                          </span>
                        </button>

                        <div
                          className="faq-answer"
                          aria-hidden={!isOpen}
                        >
                          <p>{item.answer}</p>
                        </div>
                      </article>
                    )
                  })}
                </div>

                {filteredFaqs.length === 0 && (
                  <div className="faq-empty">
                    <span>NO QUESTIONS</span>

                    <h3>
                      No questions available in this category.
                    </h3>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory('All')
                        setOpenIndex(null)
                      }}
                    >
                      View All Questions
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="faq-feature section-padding">
          <div className="page-container">
            <div className="faq-feature-grid">
              <div className="faq-feature-image reveal">
                {/* Support */}
                <img
                  src="/images/projects/lakeside-residences.webp"
                  alt="Premium residential home"
                  loading="lazy"
                />
              </div>

              <div className="faq-feature-content reveal">
                <p className="section-eyebrow">
                  PERSONAL ASSISTANCE
                </p>

                <h2>
                  Some questions{' '}
                  <span>need a conversation.</span>
                </h2>

                <p>
                  If you cannot find what you are looking for,
                  contact our team for project-specific details,
                  availability, site visits or brochure requests.
                </p>

                <div className="faq-support-points">
                  <div>
                    <span>01</span>
                    <strong>Project Information</strong>
                  </div>

                  <div>
                    <span>02</span>
                    <strong>Site Visit</strong>
                  </div>

                  <div>
                    <span>03</span>
                    <strong>Brochure Request</strong>
                  </div>

                  <div>
                    <span>04</span>
                    <strong>Property Guidance</strong>
                  </div>
                </div>

                <Link to="/contact" className="button button-dark">
                  Contact Our Team
                  <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-cta">
          {/* CTA */}
          <img
            src="/images/projects/serenity-villas.webp"
            alt="Premium residential villa"
            loading="lazy"
          />

          <div className="faq-cta-overlay" />

          <div className="page-container faq-cta-content reveal">
            <p className="section-eyebrow">READY TO EXPLORE?</p>

            <h2>
              Your questions are answered.{' '}
              <span>Now discover your next home.</span>
            </h2>

            <p>
              Explore our projects or speak with our team about
              finding the right property for you.
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
                Enquire Now
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

export default FAQ