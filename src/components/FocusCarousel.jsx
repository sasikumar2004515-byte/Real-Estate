import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useGlider from '../hooks/useGlider'

const cardWidth = (W) => Math.min(460, W * 0.8)

// Featured projects carousel. Middle card is full size, the others shrink and dim.
function FocusCarousel({ items: all, title }) {
  const [filter, setFilter] = useState('All')
  const statuses = useMemo(() => ['All', ...new Set(all.map((p) => p.status))], [all])
  const items = useMemo(() => (filter === 'All' ? all : all.filter((p) => p.status === filter)), [all, filter])
  const n = items.length
  const label = useRef(null)

  const layout = (pos, W, count) => {
    const w = cardWidth(W)
    const gap = w * 0.9
    return Array.from({ length: count }, (_, i) => {
      const d = i - pos
      const a = Math.min(Math.abs(d), 1)
      return {
        x: W / 2 - w / 2 + d * gap,
        w,
        scale: 1 - a * 0.16,
        opacity: Math.abs(d) > 2.4 ? 0 : 1 - a * 0.5,
        z: 100 - Math.round(Math.abs(d) * 10),
      }
    })
  }

  const { stage, items: nodes, line, goTo, move } = useGlider({
    count: n,
    layout,
    unit: (W) => cardWidth(W) * 0.9,
    onFrame: (pos) => {
      if (label.current) label.current.textContent = `${String(Math.round(pos) + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`
    },
  })

  return (
    <section className="lxf" data-own aria-label={title}>
      <div className="lx-wrap">
        <div className="lxf-top">
          <div>
            <p className="lx-kicker">The collection</p>
            <h2>{title}</h2>
          </div>
          <div className="lxf-chips" role="tablist">
            {statuses.map((s) => (
              <button key={s} className={s === filter ? 'on' : ''} onClick={() => setFilter(s)}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="lxg" ref={stage} tabIndex={0} aria-roledescription="carousel">
        {items.map((p, i) => (
          <div className="lxg-item" key={p.id} ref={(el) => (nodes.current[i] = el)} onClick={() => goTo(i)}>
            <article className="lxf-card">
              <div className="lxf-img">
                <img src={p.image} alt={p.name} loading="lazy" draggable="false" />
                <span className="lxf-badge">{p.status}</span>
              </div>
              <div className="lxf-body">
                <p className="lxf-loc">{p.location} · {p.type}</p>
                <h3>{p.name}</h3>
                <dl className="lxf-facts">
                  <div><dt>Home type</dt><dd>{p.configuration}</dd></div>
                  <div><dt>Starting price</dt><dd className="price">{p.price}</dd></div>
                  <div><dt>Area</dt><dd>{p.area}</dd></div>
                  <div><dt>Location</dt><dd>{p.location}, Chennai</dd></div>
                </dl>
                <div className="lxf-tags">
                  {p.highlights.slice(0, 3).map((h) => <span key={h}>{h}</span>)}
                </div>
                <Link to={`/projects/${p.id}`} className="lx-btn lx-btn--sm">View project <i>→</i></Link>
              </div>
            </article>
          </div>
        ))}
      </div>

      <div className="lx-wrap">
        <div className="lxg-ui">
          <div className="lxg-arrows">
            <button aria-label="Previous project" onClick={() => move(-1)}>←</button>
            <button aria-label="Next project" onClick={() => move(1)}>→</button>
          </div>
          <div className="lxg-line"><i ref={line} /></div>
          <span className="lxg-count" ref={label}>01 / {String(n).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  )
}

export default FocusCarousel
