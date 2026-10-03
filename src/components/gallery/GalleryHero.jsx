import { useRef } from 'react'
import { Link } from 'react-router-dom'

import MaskText from '../MaskText'
import HairLine from '../HairLine'
import useParallax from '../../hooks/useParallax'

function GalleryHero({
  poster = '/images/gallery/gallery-pool.webp',
  videoSrc = ''
}) {
  const imageRef = useRef(null)

  useParallax(imageRef, 12)

  return (
    <section className="relative h-[400px] overflow-hidden bg-[#0B1A2E] sm:h-[480px] lg:h-[560px]">

      <div
        ref={imageRef}
        className="absolute inset-[-20px] will-change-transform"
      >
        {videoSrc ? (
          <video
            src={videoSrc}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover animate-[galleryHeroZoom_20s_ease-in-out_infinite_alternate]"
          />
        ) : (
          <img
            src={poster}
            alt="Luxury residential architecture"
            width="1920"
            height="1080"
            fetchPriority="high"
            className="h-full w-full object-cover animate-[galleryHeroZoom_20s_ease-in-out_infinite_alternate]"
          />
        )}
      </div>

      <div className="absolute inset-0 bg-[#0B1A2E]/45" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2E]/85 via-transparent to-[#0B1A2E]/10" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1200px] flex-col justify-end px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">

        <div className="mb-auto pt-[104px]">

          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 font-['Inter'] text-[12px] font-medium text-white/70"
          >
            <Link
              to="/"
              className="transition-opacity duration-300 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
            >
              Home
            </Link>

            <span aria-hidden="true">
              /
            </span>

            <span className="text-white">
              Gallery
            </span>
          </nav>

        </div>

        <div className="max-w-[720px]">

          <p className="mb-4 font-['Inter'] text-[12px] font-medium uppercase tracking-[0.2em] text-white/75">
            The Collection
          </p>

          <MaskText
            as="h1"
            lines={['Gallery']}
            immediate
            className="font-['Manrope'] text-[40px] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[52px] lg:text-[64px]"
          />

          <p className="mt-5 max-w-[570px] font-['Inter'] text-[15px] font-normal leading-[1.7] text-white/75 sm:text-base">
            A visual study of architecture, interiors, residences and the places around them.
          </p>

          <div className="mt-7 w-16">
            <HairLine immediate />
          </div>

        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-7 right-5 flex flex-col items-center gap-3 sm:right-8 lg:right-10"
        >
          <span className="h-8 w-px bg-white/45" />

          <span className="h-1.5 w-1.5 rounded-full bg-[#C9A96E] animate-[galleryScrollDot_2.4s_ease-in-out_infinite]" />

        </div>

      </div>

      <style>
        {`
          @keyframes galleryHeroZoom {
            from {
              transform: scale(1);
            }

            to {
              transform: scale(1.05);
            }
          }

          @keyframes galleryScrollDot {
            0%,
            100% {
              opacity: 0.45;
              transform: translateY(0);
            }

            50% {
              opacity: 1;
              transform: translateY(2px);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>

    </section>
  )
}

export default GalleryHero