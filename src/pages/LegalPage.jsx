import Header from '../components/Header'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import Breadcrumb from '../components/Breadcrumb'

/**
 * LegalPage - shared layout for Privacy Policy and Terms.
 * sections: [{ heading, body: [paragraphs] }]
 */
function LegalPage({ title, updated, intro, sections, path }) {
  return (
    <>
      <Seo title={title} description={intro} path={path} />
      <Header />

      <main className="legal-page">
        <section className="legal-hero">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: title }]} />
          <div className="page-container">
            <p className="section-eyebrow">LEGAL</p>
            <h1>{title}</h1>
            <p className="legal-updated">Last updated: {updated}</p>
          </div>
        </section>

        <section className="legal-body">
          <div className="page-container legal-container">
            <p className="legal-intro reveal">{intro}</p>

            {sections.map((section) => (
              <article key={section.heading} className="legal-section reveal">
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default LegalPage
