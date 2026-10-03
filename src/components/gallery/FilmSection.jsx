import { useEffect, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'

import MaskText from '../MaskText'
import HairLine from '../HairLine'
import FilmPlayer from '../ui/FilmPlayer'


function FilmSection({
  films,
  sectionRef
}) {
  const [selectedFilm, setSelectedFilm] =
    useState(films[0] || null)

  const playerRef = useRef(null)
  const [userSelected, setUserSelected] = useState(false)

  useEffect(() => {
    if (!films.length) {
      return
    }

    if (
      !films.some(
        (film) =>
          film.id ===
          selectedFilm?.id
      )
    ) {
      setSelectedFilm(films[0])
    }
  }, [films, selectedFilm])

  const handleFilmSelect = (film) => {
    setSelectedFilm(film)
    setUserSelected(true)

    if (
      typeof window !==
      'undefined' &&
      window.innerWidth < 768
    ) {
      window.setTimeout(() => {
        playerRef.current?.scrollIntoView(
          {
            behavior: 'smooth',
            block: 'center'
          }
        )
      }, 60)
    }
  }

  if (!films.length) {
    return null
  }

  const featured =
    selectedFilm || films[0]

  return (
    <section
      ref={sectionRef}
      id="film"
      className="scroll-mt-[130px] bg-[#0B1A2E] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-[1200px]">

        <div className="max-w-[680px]">

          <p className="font-['Inter'] text-[12px] font-medium uppercase tracking-[0.2em] text-white/55">
            The Film
          </p>

          <div className="mt-4">

            <MaskText
              as="h2"
              lines={[
                'A closer look',
                'at the collection'
              ]}
              className="font-['Manrope'] text-[28px] font-medium leading-[40px] tracking-[-0.025em] text-white sm:text-[36px]"
            />

          </div>

          <div className="mt-7 w-16">
            <HairLine />
          </div>

        </div>

        <div
          ref={playerRef}
          className="mx-auto mt-8 max-w-[1000px] scroll-mt-[150px]"
        >
          <div
            key={featured.id}
            className="animate-[filmSwapIn_500ms_cubic-bezier(0.22,1,0.36,1)_both]"
          >
            <FilmPlayer
              item={featured}
              autoPlayOnMount={userSelected}
            />
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-[1000px]">

          <div className="flex snap-x gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-3 md:overflow-visible">

            {films
              .filter(
                (film) =>
                  film.id !==
                  featured.id
              )
              .map((film) => {
                const active =
                  film.id ===
                  featured.id

                const typeLabel =
                  film.type === 'tour'
                    ? '360° Tour'
                    : 'Film'

                return (
                  <button
                    key={film.id}
                    type="button"
                    onClick={() =>
                      handleFilmSelect(
                        film
                      )
                    }
                    className={[
                      'group relative min-w-[260px] snap-start overflow-hidden rounded-2xl border text-left transition-[transform,opacity,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] md:min-w-0',
                      active
                        ? 'border-[#C9A96E]'
                        : 'border-white/15 hover:-translate-y-1 hover:border-white/35'
                    ].join(' ')}
                  >

                    <div className="relative aspect-video overflow-hidden">

                      <img
                        src={film.poster}
                        alt=""
                        width="800"
                        height="450"
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2E]/90 via-transparent to-transparent" />

                      <span className="absolute bottom-3 left-3 font-['Inter'] text-[10px] font-medium uppercase tracking-[0.14em] text-white/75">
                        {typeLabel}
                      </span>

                      <span className="absolute bottom-3 right-3 font-['Inter'] text-[10px] font-medium text-white/70">
                        {film.duration}
                      </span>

                      {active && (
                        <span className="absolute left-3 top-3 rounded-full border border-[#C9A96E] bg-[#0B1A2E]/70 px-3 py-1 font-['Inter'] text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                          Now Playing
                        </span>
                      )}

                    </div>

                    <div className="flex items-center justify-between gap-3 bg-[#0B1A2E] p-4">

                      <span className="font-['Manrope'] text-[15px] font-medium text-white">
                        {film.title}
                      </span>

                      <ChevronRight
                        size={16}
                        strokeWidth={1.4}
                        className="shrink-0 text-white/45 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />

                    </div>

                  </button>
                )
              })}

          </div>

        </div>

      </div>

      <style>
        {`
          @keyframes filmSwapIn {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
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

export default FilmSection