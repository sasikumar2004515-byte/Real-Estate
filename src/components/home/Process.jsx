import { useEffect, useRef } from 'react'

const icons = {
  discover: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  ),
  design: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20V4l16 16H4Z" />
      <path d="M4 14h6M4 9h3M14 20v-3" />
    </svg>
  ),
  build: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="5" />
      <rect x="3" y="9" width="18" height="5" />
      <rect x="3" y="14" width="18" height="5" />
      <path d="M9 4v5M15 9v5M9 14v5" />
    </svg>
  ),
  consult: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h16v11H9l-5 4V5Z" />
      <path d="M8 9h8M8 12h5" />
    </svg>
  ),
  visit: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  ),
  docs: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3h8l4 4v14H6V3Z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  ),
  handover: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8" cy="12" r="4" />
      <path d="M12 12h9M18 12v4M21 12v3" />
    </svg>
  ),
}

const homeSteps = [
  {
    icon: 'discover',
    name: 'Discover',
    text: 'We read the site first: surroundings, access and orientation.',
    tags: ['Surroundings', 'Access', 'Orientation'],
    image: '/images/projects/project-location.webp',
  },
  {
    icon: 'design',
    name: 'Design',
    text: 'Layouts are planned around daylight, ventilation and daily use.',
    tags: ['Daylight', 'Ventilation', 'Daily use'],
    image: '/images/projects/floor-plan.webp',
  },
  {
    icon: 'build',
    name: 'Build',
    text: 'Construction is tracked stage by stage until completion.',
    tags: ['Stage by stage', 'Tracked to completion'],
    image: '/images/projects/master-plan.webp',
  },
  {
    icon: 'handover',
    name: 'Handover',
    text: 'Homes are handed over with a walkthrough and the documents in place.',
    tags: ['Walkthrough', 'Documents in place'],
    image: '/images/gallery/gallery-interior.webp',
  },
]

const order = ['consult', 'visit', 'docs', 'handover', 'discover', 'design', 'build']

function Process({
  steps = homeSteps,
  kicker = 'Our process',
  title = 'From vision to a home.',
  intro = 'Four stages, one team, and a clear record of where your home stands.',
}) {
  const list = useRef(null)

  useEffect(() => {
    const el = list.current
    const items = Array.from(el.querySelectorAll('.cx-tl-item'))
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0

    const update = () => {
      frame = 0
      const box = el.getBoundingClientRect()
      const line = window.innerHeight * 0.62
      const progress = Math.min(1, Math.max(0, (line - box.top) / box.height))
      el.style.setProperty('--p', progress.toFixed(4))
      items.forEach((item) => {
        if (still || item.getBoundingClientRect().top < window.innerHeight * 0.82) {
          item.classList.add('is-on')
        }
        const dot = item.querySelector('.cx-tl-dot').getBoundingClientRect()
        item.classList.toggle('is-reached', dot.top + dot.height / 2 < line)
      })
    }
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
    }
  }, [])

  return (
    <section className="cx-tl" data-own>
      <div className="cx-wrap">
        <header className="cx-tl-head">
          <p className="cx-kicker cx-kicker--dark">{kicker}</p>
          <h2>{title}</h2>
          <p>{intro}</p>
        </header>

        <ol className="cx-tl-list" ref={list}>
          <span className="cx-tl-spine" aria-hidden="true">
            <i />
          </span>
          {steps.map((s, i) => (
            <li className={i % 2 ? 'cx-tl-item cx-tl-item--r' : 'cx-tl-item'} key={s.name}>
              <span className="cx-tl-dot" aria-hidden="true">
                {icons[s.icon || order[i % order.length]]}
              </span>
              <div className="cx-tl-card">
                {s.image && (
                  <div className="cx-tl-photo">
                    <img src={s.image} alt="" loading="lazy" draggable="false" />
                  </div>
                )}
                <span className="cx-tl-stage">
                  Stage {String(i + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
                </span>
                <span className="cx-tl-ghost" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{s.name}</h3>
                <p>{s.text}</p>
                {s.tags && (
                  <div className="cx-tags cx-tags--light">
                    {s.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Process
