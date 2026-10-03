import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Seo from '../components/Seo'

function NotFound() {
  return (
    <>
      <Seo
        title="Page not found"
        description="The page you are looking for could not be found."
      />
      <Header />

      <main className="notfound-page">
        <div className="page-container notfound-inner">
          <p className="section-eyebrow">ERROR 404</p>
          <h1 className="notfound-code">404</h1>
          <h2>This page has moved or does not exist.</h2>
          <p>Let us take you somewhere useful.</p>

          <div className="hero-actions">
            <Link to="/" className="button button-gold">Back to Home <span>↗</span></Link>
            <Link to="/projects" className="button button-outline">Explore Projects <span>↗</span></Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default NotFound
