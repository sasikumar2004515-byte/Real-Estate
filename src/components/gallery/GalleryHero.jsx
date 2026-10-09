import { Link } from 'react-router-dom'
import Wave from '../Wave'

function GalleryHero({ onScroll }) {
  return (
    <section className="lx-hero gl-hero">
      <img src="/images/gallery/gallery-pool.webp" alt="Nivora residence with pool at sunset" fetchPriority="high" />
      <div className="lx-wrap">
        <Wave className="lx-crumbs"><Link to="/">Home</Link><span>/</span><span>Gallery</span></Wave>
        <Wave d={1}><p className="lx-kicker">The collection</p></Wave>
        <Wave d={2} as="h1">The gallery. <em>A slower look.</em></Wave>
        <Wave d={3} as="p" className="lx-sub">A visual study of architecture, interiors, residences and the places around them.</Wave>
        <Wave d={4} className="lx-row">
          <button type="button" className="lx-btn" onClick={onScroll}>Begin the tour <i>↓</i></button>
          <Link to="/contact" className="lx-btn lx-btn--ghost">Book a site visit</Link>
        </Wave>
      </div>
      <div className="lx-scrollcue" aria-hidden="true"><i />Scroll</div>
    </section>
  )
}

export default GalleryHero
