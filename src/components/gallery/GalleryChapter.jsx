import { useRef, useState } from 'react'
import Wave from '../Wave'

const fallbacks = [
  '/images/gallery/gallery-pool.webp',
  '/images/gallery/gallery-interior.webp',
  '/images/projects/serenity-villas.webp',
  '/images/about/about-hero.webp',
  '/images/projects/showcase-hero.webp',
]

function Tile({ image, index, onOpen, d = 0, className = '', kind = 'zoom' }) {
  const [src, setSrc] = useState(image.src)
  return (
    <Wave kind={kind} d={d} className={`gl-tile ${className}`}>
      <button type="button" onClick={() => onOpen(index)} aria-label={`View ${image.caption} larger`}>
        <img src={src} alt={image.alt} loading="lazy" draggable="false" onError={() => setSrc(fallbacks[index % fallbacks.length])} />
        <span className="gl-tile-cap">
          <i>{String(index + 1).padStart(2, '0')}</i>
          <b>{image.caption}</b>
          <em>View ↗</em>
        </span>
      </button>
    </Wave>
  )
}

// Six chapters, each with its own layout.
const layouts = ['mosaic', 'strip', 'grid', 'cinema', 'sticky', 'trio']

function GalleryChapter({ chapter, index, chapterRef, onOpen }) {
  const layout = layouts[index % layouts.length]
  const rail = useRef(null)
  const imgs = chapter.images
  const slide = (dir) => rail.current && rail.current.scrollBy({ left: dir * Math.min(520, rail.current.clientWidth * 0.8), behavior: 'smooth' })

  const head = (
    <header className="gl-head">
      <Wave kind="left" as="span" className="gl-no">{chapter.number}</Wave>
      <div>
        <Wave d={1} as="h2">{chapter.title}</Wave>
        <Wave d={2} as="p">{chapter.description}</Wave>
      </div>
      <Wave d={3} as="span" className="gl-count">{imgs.length} photographs</Wave>
    </header>
  )

  let body
  if (layout === 'mosaic') {
    body = (
      <div className="gl-mosaic">
        {imgs.slice(0, 5).map((im, i) => <Tile key={im.id} image={im} index={i} onOpen={onOpen} d={i} className={`m${i + 1}`} />)}
      </div>
    )
  } else if (layout === 'strip') {
    body = (
      <>
        <div className="gl-strip" ref={rail} data-native-scroll>
          {imgs.map((im, i) => <Tile key={im.id} image={im} index={i} onOpen={onOpen} d={i} kind="right" />)}
        </div>
        <div className="gl-strip-ui">
          <button type="button" aria-label="Scroll left" onClick={() => slide(-1)}>←</button>
          <button type="button" aria-label="Scroll right" onClick={() => slide(1)}>→</button>
          <span>Scroll sideways</span>
        </div>
      </>
    )
  } else if (layout === 'grid') {
    body = <div className="gl-grid">{imgs.map((im, i) => <Tile key={im.id} image={im} index={i} onOpen={onOpen} d={i % 3} className={`g${i + 1}`} />)}</div>
  } else if (layout === 'cinema') {
    body = (
      <>
        <Tile image={imgs[0]} index={0} onOpen={onOpen} className="gl-wide" kind="rise" />
        <div className="gl-four">{imgs.slice(1, 5).map((im, i) => <Tile key={im.id} image={im} index={i + 1} onOpen={onOpen} d={i} />)}</div>
      </>
    )
  } else if (layout === 'sticky') {
    body = (
      <div className="gl-sticky">
        <div className="gl-sticky-note">
          <Wave kind="left"><p>Light changes everything. Surfaces, shadows and colour shift through the day, so every material is chosen to look good at every hour.</p></Wave>
        </div>
        <div className="gl-sticky-col">{imgs.slice(0, 5).map((im, i) => <Tile key={im.id} image={im} index={i} onOpen={onOpen} className={i % 2 ? 'right' : ''} />)}</div>
      </div>
    )
  } else {
    body = (
      <div className="gl-trio">
        {imgs.slice(0, 5).map((im, i) => <Tile key={im.id} image={im} index={i} onOpen={onOpen} d={i} className={`t${i + 1}`} />)}
      </div>
    )
  }

  return (
    <section ref={chapterRef} id={chapter.id} className={`gl-chapter gl-chapter--${layout}`}>
      <div className="lx-wrap">
        {head}
        {body}
      </div>
    </section>
  )
}

export default GalleryChapter
