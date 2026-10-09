import { Link } from 'react-router-dom'
import Wave from '../Wave'

function QuietCTA() {
  return (
    <section className="gl-next">
      <div className="gl-next-glow" aria-hidden="true" />
      <div className="lx-wrap">
        <div className="gl-next-card">
          <img src="/images/projects/serenity-villas-card.webp" alt="" loading="lazy" />
          <div className="gl-next-body">
            <Wave><p className="lx-kicker">Your next chapter</p></Wave>
            <Wave d={1} as="h2">Come and see it <em>in person.</em></Wave>
            <Wave d={2} as="p">Some spaces are better experienced than explained. Walk through the homes with our team, at a time that suits you.</Wave>
            <Wave d={3} className="lx-row">
              <Link to="/contact" className="lx-btn">Schedule a visit <i>→</i></Link>
              <Link to="/projects" className="lx-btn lx-btn--ghost">Explore projects</Link>
            </Wave>
            <Wave d={4} as="ul" className="gl-next-points">
              <li>Private walkthrough</li><li>No obligation</li><li>Flexible timings</li>
            </Wave>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuietCTA
