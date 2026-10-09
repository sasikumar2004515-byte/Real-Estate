import Wave from '../Wave'

const words = 'Every frame is an invitation to pause. To notice the materials, the light, the proportions and the small details that make a place feel like home.'.split(' ')

function GalleryIntro({ photos, chapters, films }) {
  return (
    <section className="gl-intro">
      <div className="lx-wrap gl-intro-grid">
        <div>
          <Wave><p className="lx-kicker lx-kicker--dark">A slower look</p></Wave>
          <p className="gl-words" aria-label={words.join(' ')}>
            {words.map((w, i) => (
              <Wave as="span" key={i} d={Math.min(i, 24) * 0.25} className="gl-word" aria-hidden="true">{w}&nbsp;</Wave>
            ))}
          </p>
        </div>
        <Wave d={2} className="gl-stats">
          <div><b>{photos}</b><span>Photographs</span></div>
          <div><b>{String(chapters).padStart(2, '0')}</b><span>Chapters</span></div>
          <div><b>{String(films).padStart(2, '0')}</b><span>Short films</span></div>
        </Wave>
      </div>
    </section>
  )
}

export default GalleryIntro
