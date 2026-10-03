import { useCallback, useEffect, useRef, useState } from 'react'
import Seo from '../components/Seo'

import Header from '../components/Header'
import Footer from '../components/Footer'
import CursorView from '../components/CursorView'

import GalleryHero from '../components/gallery/GalleryHero'
import GalleryIntro from '../components/gallery/GalleryIntro'
import ChapterBar from '../components/gallery/ChapterBar'
import GalleryChapter from '../components/gallery/GalleryChapter'
import FilmSection from '../components/gallery/FilmSection'
import QuietCTA from '../components/gallery/QuietCTA'
import Lightbox from '../components/ui/Lightbox'

import galleryChapters from '../data/galleryChapters'
import films from '../data/films'

function updatePhotoParam(photoId) {
  const url = new URL(window.location.href)

  if (photoId) {
    url.searchParams.set('photo', String(photoId))
  } else {
    url.searchParams.delete('photo')
  }

  window.history.replaceState({}, '', url)
}

function Gallery() {
  const [activeChapter, setActiveChapter] = useState('chapter-01')
  const [lightboxState, setLightboxState] = useState(() => {
    // Deep link: /gallery?photo=interior-02 opens that photo directly
    if (typeof window === 'undefined') return null

    const photoId = new URLSearchParams(window.location.search).get('photo')
    if (!photoId) return null

    for (const chapter of galleryChapters) {
      const index = chapter.images.findIndex(
        (image) => String(image.id) === String(photoId)
      )

      if (index !== -1) return { chapterId: chapter.id, index }
    }

    return null
  })

  const chapterRefs = useRef({})
  const filmRef = useRef(null)

  /* Highlight the chapter currently in view */
  useEffect(() => {
    const sections = galleryChapters
      .map((chapter) => chapterRefs.current[chapter.id])
      .filter(Boolean)

    if (filmRef.current) sections.push(filmRef.current)
    if (!sections.length || !('IntersectionObserver' in window)) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top)
          )

        if (visible.length > 0) {
          setActiveChapter(visible[0].target.id === 'film' ? 'film' : visible[0].target.id)
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.15, 0.3, 0.5] }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const scrollToChapter = useCallback((id) => {
    const target = id === 'film' ? filmRef.current : chapterRefs.current[id]
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const currentChapter = lightboxState
    ? galleryChapters.find((chapter) => chapter.id === lightboxState.chapterId)
    : null

  const openLightbox = (chapterId, index) => {
    const chapter = galleryChapters.find((item) => item.id === chapterId)
    const image = chapter?.images[index]
    if (!image) return

    setLightboxState({ chapterId, index })
    updatePhotoParam(image.id)
  }

  const closeLightbox = () => {
    setLightboxState(null)
    updatePhotoParam(null)
  }

  const stepLightbox = (direction) => {
    if (!lightboxState || !currentChapter) return

    const total = currentChapter.images.length
    const index = (lightboxState.index + direction + total) % total

    setLightboxState({ ...lightboxState, index })
    updatePhotoParam(currentChapter.images[index].id)
  }

  return (
    <>
      <Seo
        title="Gallery"
        description="Explore the architecture, interiors, details, landscapes and locations behind the collection."
        image="/images/gallery/gallery-pool.webp"
        path="/gallery"
      />

      <Header />
      <CursorView />

      <main className="gallery-page">
        <GalleryHero />

        <GalleryIntro />

        <ChapterBar
          chapters={galleryChapters}
          activeChapter={activeChapter}
          onSelect={scrollToChapter}
        />

        {galleryChapters.map((chapter, index) => (
          <GalleryChapter
            key={chapter.id}
            chapter={chapter}
            chapterIndex={index}
            sectionRef={(node) => {
              chapterRefs.current[chapter.id] = node
            }}
            onOpenLightbox={(imageIndex) => openLightbox(chapter.id, imageIndex)}
          />
        ))}

        <FilmSection films={films} sectionRef={filmRef} />

        <QuietCTA />
      </main>

      <Footer />

      {currentChapter && lightboxState && (
        <Lightbox
          images={currentChapter.images}
          currentIndex={lightboxState.index}
          startIndex={lightboxState.index}
          onClose={closeLightbox}
          onNext={() => stepLightbox(1)}
          onPrev={() => stepLightbox(-1)}
        />
      )}
    </>
  )
}

export default Gallery
