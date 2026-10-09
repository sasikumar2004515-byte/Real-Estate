import { useRef } from 'react'
import { Link } from 'react-router-dom'
import useGlider from '../../hooks/useGlider'

const ease = (t) => t * t * (3 - 2 * t)
const GAP = 22
const sizes = (W) => (W < 700 ? { L: W * 0.86, P: W * 0.5 } : { L: Math.min(W * 0.58, 780), P: Math.min(W * 0.26, 330) })

// Home gallery: middle picture goes landscape, the rest stay portrait.
function GallerySlider({ items }) {
  const label = useRef(null)
  const n = items.length

  const layout = (pos, W, count) => {
    const { L, P } = sizes(W)
    const widths = Array.from({ length: count }, (_, i) => P + (L - P) * ease(1 - Math.min(Math.abs(i - pos), 1)))
    const left = []
    let run = 0
    widths.forEach((w, i) => { left[i] = run; run += w + GAP })
    const a = Math.min(count - 1, Math.max(0, Math.floor(pos)))
    const b = Math.min(count - 1, a + 1)
    const frac = pos - a
    const centre = (k) => left[k] + widths[k] / 2
    const here = centre(a) + (centre(b) - centre(a)) * frac
    return widths.map((w, i) => ({ x: W / 2 - here + left[i], w, opacity: 1, z: 10 - Math.round(Math.abs(i - pos)) }))
  }

  const { stage, items: nodes, line, goTo, move } = useGlider({
    count: n,
    layout,
    unit: (W) => (sizes(W).L + sizes(W).P) / 2,
    onFrame: (pos) => {
      if (label.current) label.current.textContent = `${String(Math.round(pos) + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`
    },
  })

  return (
    <section className="lxs" data-own>
      <div className="lx-wrap">
        <div className="lxs-head">
          <div>
            <p className="lx-kicker lx-kicker--dark">The gallery</p>
            <h2>The spaces, in detail.</h2>
          </div>
          <Link to="/gallery" className="lx-btn lx-btn--dark">Explore the gallery <i>→</i></Link>
        </div>
      </div>

      <div className="lxg" ref={stage} tabIndex={0} aria-roledescription="carousel">
        {items.map((g, i) => (
          <div className="lxg-item" key={g.id} ref={(el) => (nodes.current[i] = el)} onClick={() => goTo(i)}>
            <Link to="/gallery" className="lxs-card" draggable="false">
              <img src={g.image} alt={g.title} loading="lazy" draggable="false" />
              <div className="lxs-cap">
                <small>{g.category}</small>
                <b>{g.title}</b>
                <span>{g.location}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="lx-wrap">
        <div className="lxg-ui">
          <div className="lxg-arrows">
            <button aria-label="Previous image" onClick={() => move(-1)}>←</button>
            <button aria-label="Next image" onClick={() => move(1)}>→</button>
          </div>
          <div className="lxg-line"><i ref={line} /></div>
          <span className="lxg-count" ref={label}>01 / {String(n).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  )
}

export default GallerySlider
