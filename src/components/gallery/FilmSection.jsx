import { useState } from 'react'
import Wave from '../Wave'
import VideoPlayer from '../ui/VideoPlayer'

function FilmSection({ films, sectionRef }) {
  const [active, setActive] = useState(0)
  if (!films.length) return null
  const film = films[active] || films[0]

  return (
    <section ref={sectionRef} id="film" className="gl-film">
      <div className="lx-wrap">
        <Wave>
          <p className="lx-kicker">The film</p>
          <h2 className="lx-title lx-title--light">A closer look <em>at the collection.</em></h2>
        </Wave>
        <div className="gl-film-grid">
          <Wave d={1} className="gl-film-player">
            <VideoPlayer key={film.id} item={film} />
            <div className="gl-film-meta">
              <small>{film.label}</small>
              <b>{film.title}</b>
              <p>{film.note}</p>
            </div>
          </Wave>
          <Wave d={2} as="ul" className="gl-film-list">
            {films.map((f, i) => (
              <li key={f.id}>
                <button type="button" className={i === active ? 'on' : ''} onClick={() => setActive(i)}>
                  <img src={f.poster} alt="" loading="lazy" />
                  <span><small>{String(i + 1).padStart(2, '0')} · {f.label}</small><b>{f.title}</b><em>{i === active ? 'Now showing' : f.duration}</em></span>
                </button>
              </li>
            ))}
          </Wave>
        </div>
      </div>
    </section>
  )
}

export default FilmSection
