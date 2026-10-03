function ChapterBar({
  chapters,
  activeChapter,
  onSelect
}) {
  const onChapterSelect = (id) => onSelect(id)
  const onFilmSelect = () => onSelect('film')

  return (
    <nav
      aria-label="Gallery chapters"
      className="sticky top-[70px] z-40 h-11 border-y border-[#E7E2D8] bg-[#FAF6EE]/95 backdrop-blur-xl sm:h-12"
    >
      <div className="mx-auto h-full max-w-[1200px] overflow-x-auto px-4 sm:px-6 lg:px-8">

        <div className="flex h-full min-w-max items-center gap-1">

          {chapters.map((chapter) => {
            const active =
              activeChapter === chapter.id

            return (
              <button
                key={chapter.id}
                type="button"
                aria-current={
                  active
                    ? 'true'
                    : undefined
                }
                onClick={() =>
                  onChapterSelect(
                    chapter.id
                  )
                }
                className="group flex h-full items-center gap-2 px-2.5 font-['Inter'] text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B6F76] transition-[opacity,transform] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] sm:px-3 sm:text-[12px]"
              >
                <span
                  className={[
                    'h-1.5 w-1.5 rounded-full bg-[#C9A96E] transition-transform duration-300',
                    active
                      ? 'scale-100'
                      : 'scale-0'
                  ].join(' ')}
                  aria-hidden="true"
                />

                <span
                  className={
                    active
                      ? 'text-[#1C1F26]'
                      : 'opacity-70 group-hover:opacity-100'
                  }
                >
                  {chapter.number}{' '}
                  {chapter.title}
                </span>
              </button>
            )
          })}

          <span
            aria-hidden="true"
            className="mx-1 h-4 w-px bg-[#E7E2D8]"
          />

          <button
            type="button"
            onClick={onFilmSelect}
            aria-current={activeChapter === 'film' ? 'true' : undefined}
            className={`px-3 font-['Inter'] text-[11px] font-medium uppercase tracking-[0.08em] transition-opacity duration-300 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] sm:text-[12px] ${activeChapter === 'film' ? 'text-[#1C1F26]' : 'text-[#6B6F76]'}`}
          >
            The Film
          </button>

        </div>

      </div>
    </nav>
  )
}

export default ChapterBar