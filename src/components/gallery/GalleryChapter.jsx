import { useRef } from 'react'

import MaskText from '../MaskText'
import ImageReveal from '../ImageReveal'
import HairLine from '../HairLine'
import useParallax from '../../hooks/useParallax'

// Local images used only if a remote photo fails to load (no blank boxes)
const FALLBACKS = [
  '/images/gallery/gallery-interior.webp',
  '/images/gallery/gallery-pool.webp',
  '/images/projects/serenity-villas.webp',
  '/images/projects/showcase-hero.webp',
  '/images/projects/lakeside-residences.webp',
  '/images/about/about-mission.webp'
]

function ChapterImage({
  image,
  onOpen,
  index,
  parallax = false,
  priority = false
}) {
  const parallaxRef = useRef(null)

  // Hook always called; distance 0 disables it
  useParallax(parallaxRef, parallax ? 24 : 0)

  const imageContent = (
    <button
      type="button"
      data-cursor="view"
      onClick={() => onOpen(index)}
      aria-label={`View ${image.title} larger`}
      className="group block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] focus-visible:ring-offset-4"
    >
      <ImageReveal
        src={image.src}
        alt={image.alt}
        ratio={image.slot === 'large' ? '780 / 480' : image.slot === 'tall' ? '400 / 480' : '4 / 3'}
        width={
          image.slot === 'large'
            ? 1560
            : image.slot === 'tall'
              ? 800
              : 800
        }
        height={
          image.slot === 'large'
            ? 960
            : image.slot === 'tall'
              ? 960
              : 600
        }
        priority={priority}
        fallbackSrc={FALLBACKS[(image.id.length + image.id.charCodeAt(image.id.length - 1)) % FALLBACKS.length]}
        imageClassName="transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />

      <p className="mt-3 font-['Inter'] text-[13px] font-normal leading-5 text-[#6B6F76]">
        {image.title}
      </p>
    </button>
  )

  if (!parallax) {
    return imageContent
  }

  return (
    <div
      ref={parallaxRef}
      className="will-change-transform"
    >
      {imageContent}
    </div>
  )
}

function GalleryChapter({
  chapter,
  chapterIndex = 0,
  sectionRef,
  onOpenLightbox
}) {
  const onOpen = onOpenLightbox
  const mirrored = chapterIndex % 2 === 1

  const large =
    chapter.images.find(
      (image) =>
        image.slot === 'large'
    )

  const tall =
    chapter.images.find(
      (image) =>
        image.slot === 'tall'
    )

  const equalImages =
    chapter.images.filter(
      (image) =>
        image.slot === 'equal'
    )

  const largeIndex =
    chapter.images.findIndex(
      (image) =>
        image.id === large?.id
    )

  const tallIndex =
    chapter.images.findIndex(
      (image) =>
        image.id === tall?.id
    )

  return (
    <section
      ref={sectionRef}
      id={chapter.id}
      className="scroll-mt-[130px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14"
    >
      <div className="mx-auto max-w-[1200px]">

        <header className="mb-5 flex flex-col gap-3 sm:mb-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">

          <div>

            <p className="mb-2 font-['Inter'] text-[12px] font-medium uppercase tracking-[0.2em] text-[#6B6F76]">
              {chapter.number}
            </p>

            <MaskText
              as="h2"
              lines={[chapter.title]}
              className="font-['Manrope'] text-[28px] font-medium leading-[40px] tracking-[-0.025em] text-[#1C1F26] lg:text-[34px]"
            />

          </div>

          <p className="max-w-[420px] font-['Inter'] text-[14px] font-normal leading-[1.7] text-[#6B6F76] lg:text-right">
            {chapter.description}
          </p>

        </header>

        <div className="mb-6 lg:mb-8">
          <HairLine />
        </div>

        <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4 ${mirrored ? 'lg:grid-cols-[400px_780px]' : 'lg:grid-cols-[780px_400px]'} lg:gap-5`}>

          {mirrored && tall && (
            <ChapterImage
              image={tall}
              index={tallIndex}
              onOpen={onOpen}
            />
          )}

          {large && (
            <ChapterImage
              image={large}
              index={largeIndex}
              onOpen={onOpen}
              parallax
              priority={false}
            />
          )}

          {!mirrored && tall && (
            <ChapterImage
              image={tall}
              index={tallIndex}
              onOpen={onOpen}
            />
          )}

        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4 lg:mt-5 lg:grid-cols-3 lg:gap-5">

          {equalImages.map(
            (image) => {
              const index =
                chapter.images.findIndex(
                  (item) =>
                    item.id ===
                    image.id
                )

              return (
                <ChapterImage
                  key={image.id}
                  image={image}
                  index={index}
                  onOpen={onOpen}
                />
              )
            }
          )}

        </div>

      </div>
    </section>
  )
}

export default GalleryChapter