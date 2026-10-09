function ChapterBar({ chapters, activeChapter, onSelect }) {
  return (
    <nav className="gl-bar" aria-label="Gallery chapters">
      <div className="gl-bar-in" data-native-scroll>
        {chapters.map((c) => (
          <button key={c.id} type="button" className={activeChapter === c.id ? 'on' : ''} aria-current={activeChapter === c.id ? 'true' : undefined} onClick={() => onSelect(c.id)}>
            <i>{c.number}</i>{c.title}
          </button>
        ))}
        <span aria-hidden="true" />
        <button type="button" className={activeChapter === 'film' ? 'on' : ''} onClick={() => onSelect('film')}><i>▶</i>The Film</button>
      </div>
    </nav>
  )
}

export default ChapterBar
