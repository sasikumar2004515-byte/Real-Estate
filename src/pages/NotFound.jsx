import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function NotFound() {
  return (
    <>
      <Header />
      <main className="ps ps-missing" data-own>
        <div className="lx-wrap lx-center">
          <p className="lx-kicker">Error 404</p>
          <h1 className="lx-title lx-title--light">
            This page <em>does not exist.</em>
          </h1>
          <p className="lx-lead lx-lead--light">The address may be wrong, or the page may have moved.</p>
          <div className="lx-row" style={{ justifyContent: 'center', marginTop: 32 }}>
            <Link to="/" className="lx-btn">
              Back to home <i>→</i>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default NotFound
