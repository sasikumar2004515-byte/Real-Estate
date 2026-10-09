import { useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import Header from '../components/Header'
import Footer from '../components/Footer'
import GalleryHero from '../components/gallery/GalleryHero'
import GalleryIntro from '../components/gallery/GalleryIntro'
import ChapterBar from '../components/gallery/ChapterBar'
import GalleryChapter from '../components/gallery/GalleryChapter'
import FilmSection from '../components/gallery/FilmSection'
import QuietCTA from '../components/gallery/QuietCTA'
import Lightbox from '../components/ui/Lightbox'

import galleryChapters from '../data/galleryChapters'
import films from '../data/films'

function Gallery() {
  const [activeChapter, setActiveChapter] = useState('chapter-01')
  const [lightbox, setLightbox] = useState(null)
  const refs = useRef({})
  const filmRef = useRef(null)

  // the lightbox reads full / title / category, so map them once from the chapter data
  const chapters = useMemo(
    () => galleryChapters.map((c) => ({
      ...c,
      images: c.images.map((im) => ({ ...im, full: im.src, title: im.caption, category: c.title })),
    })),
    []
  )
  const photoCount = chapters.reduce((n, c) => n + c.images.length, 0)

  // which chapter is under the sticky bar
  useEffect(() => {
    const ids = [...chapters.map((c) => c.id), 'film']
    let ticking = false
    const update = () => {
      ticking = false
      const line = window.innerHeight * 0.35
      let current = ids[0]
      ids.forEach((id) => {
        const el = id === 'film' ? filmRef.current : refs.current[id]
        if (el && el.getBoundingClientRect().top <= line) current = id
      })
      setActiveChapter(current)
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [chapters])

  const scrollTo = (id) => {
    const el = id === 'film' ? filmRef.current : refs.current[id]
    if (!el) return
    const offset = (document.querySelector('.nx-header')?.offsetHeight || 84) + 56
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset + 2, behavior: 'smooth' })
  }

  const open = (chapterId, index) => {
    setLightbox({ chapterId, index })
    const url = new URL(window.location.href)
    url.searchParams.set('photo', String(chapters.find((c) => c.id === chapterId).images[index].id))
    window.history.replaceState({}, '', url)
  }
  const close = () => {
    setLightbox(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('photo')
    window.history.replaceState({}, '', url)
  }
  const step = (by) => {
    if (!lightbox) return
    const list = chapters.find((c) => c.id === lightbox.chapterId).images
    const next = (lightbox.index + by + list.length) % list.length
    setLightbox({ ...lightbox, index: next })
    const url = new URL(window.location.href)
    url.searchParams.set('photo', String(list[next].id))
    window.history.replaceState({}, '', url)
  }

  // a shared link with ?photo=... opens straight to that picture
  useEffect(() => {
    const photo = new URLSearchParams(window.location.search).get('photo')
    if (!photo) return
    for (const c of chapters) {
      const i = c.images.findIndex((im) => String(im.id) === photo)
      if (i !== -1) { setLightbox({ chapterId: c.id, index: i }); break }
    }
  }, [chapters])

  const current = lightbox ? chapters.find((c) => c.id === lightbox.chapterId) : null

  return (
    <>
      <Helmet>
        <title>Gallery | Nivora</title>
        <meta name="description" content="Explore the architecture, interiors, details, landscapes and locations behind the Nivora collection." />
      </Helmet>

      <Header />
      <main className="gl" data-own>
        <GalleryHero onScroll={() => scrollTo('chapter-01')} />
        <GalleryIntro photos={photoCount} chapters={chapters.length} films={films.length} />
        <ChapterBar chapters={chapters} activeChapter={activeChapter} onSelect={scrollTo} />

        {chapters.map((c, i) => (
          <GalleryChapter
            key={c.id}
            chapter={c}
            index={i}
            chapterRef={(node) => { refs.current[c.id] = node }}
            onOpen={(imageIndex) => open(c.id, imageIndex)}
          />
        ))}

        <FilmSection films={films} sectionRef={filmRef} />
        <QuietCTA />
      </main>
      <Footer />

      {current && lightbox && (
        <Lightbox
          images={current.images}
          currentIndex={lightbox.index}
          startIndex={lightbox.index}
          onClose={close}
          onNext={() => step(1)}
          onPrev={() => step(-1)}
        />
      )}
    </>
  )
}

export default Gallery
