import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectCard from './ProjectCard'

const pad = (n) => String(n).padStart(2, '0')
const GAP = 21

const filters = [
  { label: 'All', test: () => true },
  { label: 'Villas', test: (p) => p.type === 'Villas' },
  { label: 'Apartments', test: (p) => p.type === 'Apartments' },
  { label: 'Ready to Move', test: (p) => p.status === 'Ready to Move' },
  { label: 'Ongoing', test: (p) => p.status === 'Ongoing' },
]

function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  )
}

function FeaturedProjects({
  items,
  title,
  kicker = 'Architectural portfolio · Chennai',
  intro = 'Distinguished residential developments designed with structural integrity, bespoke architecture, and enduring materials.',
  showAll = true,
}) {
  const [filter, setFilter] = useState('All')
  const [position, setPosition] = useState({ index: 0, progress: 0 })
  const track = useRef(null)
  const drag = useRef({ down: false, moved: false, startX: 0, startLeft: 0 })

  const available = useMemo(() => filters.filter((f) => items.some(f.test)), [items])
  const list = useMemo(() => {
    const active = filters.find((f) => f.label === filter) || filters[0]
    return items.filter(active.test)
  }, [items, filter])

  useEffect(() => {
    const el = track.current
    let frame = 0
    const read = () => {
      frame = 0
      const card = el.firstElementChild
      const step = card ? card.offsetWidth + GAP : 1
      const max = el.scrollWidth - el.clientWidth
      setPosition({
        index: Math.round(el.scrollLeft / step),
        progress: max > 0 ? el.scrollLeft / max : 1,
      })
    }
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    read()
    el.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
    }
  }, [list])

  const choose = (label) => {
    setFilter(label)
    track.current.scrollTo({ left: 0 })
  }

  const move = (dir) => {
    const el = track.current
    el.scrollBy({ left: dir * (el.firstElementChild.offsetWidth + GAP), behavior: 'smooth' })
  }

  const onPointerDown = (event) => {
    if (event.pointerType !== 'mouse') return
    drag.current = {
      down: true,
      moved: false,
      startX: event.clientX,
      startLeft: track.current.scrollLeft,
    }
  }
  const onPointerMove = (event) => {
    const d = drag.current
    if (!d.down) return
    const dx = event.clientX - d.startX
    if (Math.abs(dx) > 6) {
      d.moved = true
      track.current.classList.add('is-drag')
    }
    if (d.moved) track.current.scrollLeft = d.startLeft - dx
  }
  const onPointerUp = () => {
    drag.current.down = false
    track.current.classList.remove('is-drag')
  }
  const onClickCapture = (event) => {
    if (drag.current.moved) {
      event.preventDefault()
      event.stopPropagation()
      drag.current.moved = false
    }
  }

  const atStart = position.index <= 0
  const atEnd = position.progress >= 0.99
  const current = Math.min(position.index + 1, list.length)

  return (
    <section className="fp" data-own aria-label={title}>
      <div className="fp-wrap">
        <header className="fp-head">
          <p className="fp-kicker">{kicker}</p>
          <h2>{title}</h2>
          <p className="fp-intro">{intro}</p>
        </header>

        <div className="fp-bar">
          <div className="fp-chips" role="tablist" aria-label="Filter projects">
            {available.map((f) => (
              <button
                key={f.label}
                role="tab"
                aria-selected={f.label === filter}
                className={f.label === filter ? 'on' : ''}
                onClick={() => choose(f.label)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="fp-ctrl">
            <span className="fp-count">
              <b>{current}</b> / {pad(list.length)}
            </span>
            <button aria-label="Previous projects" disabled={atStart} onClick={() => move(-1)}>
              <Icon>
                <path d="m15 5-7 7 7 7" />
              </Icon>
            </button>
            <button aria-label="Next projects" disabled={atEnd} onClick={() => move(1)}>
              <Icon>
                <path d="m9 5 7 7-7 7" />
              </Icon>
            </button>
          </div>
        </div>

        <div
          className="fp-track"
          ref={track}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onClickCapture={onClickCapture}
        >
          {list.map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
        </div>

        <div className="fp-foot">
          <span className="fp-line" aria-hidden="true">
            <i style={{ width: `${Math.max(position.progress, 0.1) * 100}%` }} />
          </span>
          <div className="fp-foot-row">
            <p>
              Displaying {list.length} of {items.length} curated developments
            </p>
            {showAll && (
              <Link to="/projects" className="fp-all">
                Explore all projects
                <Icon>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </Icon>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProjects
