import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { popularSearches, searchSite } from '../utils/search'

/**
 * SearchOverlay - full-site search (projects, locations, pages, FAQs).
 * Keyboard: type to search, Up/Down to move, Enter to open, Esc to close.
 */
function SearchOverlay({ open, onClose }) {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const panelRef = useRef(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const groups = useMemo(() => searchSite(query), [query])
  const flat = useMemo(() => groups.flatMap((group) => group.items), [groups])

  const close = useCallback(() => {
    setQuery('')
    setActive(0)
    onClose()
  }, [onClose])

  const openResult = useCallback(
    (item) => {
      close()
      navigate(item.path)
    },
    [close, navigate]
  )

  // Focus input + lock page scroll while open
  useEffect(() => {
    if (!open) return undefined

    const previous = document.activeElement
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = originalOverflow
      if (previous && previous.focus) previous.focus()
    }
  }, [open])

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }

    if (event.key === 'ArrowDown' && flat.length) {
      event.preventDefault()
      setActive((current) => (current + 1) % flat.length)
      return
    }

    if (event.key === 'ArrowUp' && flat.length) {
      event.preventDefault()
      setActive((current) => (current - 1 + flat.length) % flat.length)
      return
    }

    if (event.key === 'Enter' && flat[active]) {
      event.preventDefault()
      openResult(flat[active])
      return
    }

    // keep Tab inside the dialog
    if (event.key === 'Tab' && panelRef.current) {
      const focusable = panelRef.current.querySelectorAll(
        'button, [href], input, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  // keep highlighted result visible
  useEffect(() => {
    if (!open) return
    document
      .querySelector('.search-result.is-active')
      ?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  if (!open) return null

  let runningIndex = -1

  return (
    <div
      className="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Search the website"
      onKeyDown={handleKeyDown}
    >
      <div className="search-backdrop" onClick={close} aria-hidden="true" />

      <div className="search-panel" ref={panelRef}>
        <div className="search-input-row">
          <Search size={20} strokeWidth={1.8} aria-hidden="true" />

          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            placeholder="Search projects, locations, FAQs..."
            aria-label="Search the website"
            autoComplete="off"
            spellCheck="false"
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls="search-results"
          />

          <button
            type="button"
            className="search-close"
            onClick={close}
            aria-label="Close search"
          >
            <X size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        <div className="search-body" id="search-results" role="listbox">
          {query.trim() === '' && (
            <div className="search-empty">
              <p className="search-hint">Popular searches</p>

              <div className="search-chips">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term)
                      setActive(0)
                      inputRef.current?.focus()
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() !== '' && flat.length === 0 && (
            <div className="search-empty">
              <p className="search-none">
                No results for <strong>“{query.trim()}”</strong>
              </p>
              <p className="search-hint">
                Try a project name, a location like ECR, or “villa”.
              </p>
            </div>
          )}

          {groups.map((group) => (
            <div className="search-group" key={group.type}>
              <p className="search-group-title">{group.type}s</p>

              {group.items.map((item) => {
                runningIndex += 1
                const index = runningIndex

                return (
                  <button
                    key={`${item.type}-${item.title}-${item.path}`}
                    type="button"
                    role="option"
                    aria-selected={index === active}
                    className={`search-result ${index === active ? 'is-active' : ''}`}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => openResult(item)}
                  >
                    {item.image ? (
                      <img src={item.image} alt="" loading="lazy" width="56" height="56" />
                    ) : (
                      <span className="search-result-icon" aria-hidden="true">
                        <Search size={16} strokeWidth={1.8} />
                      </span>
                    )}

                    <span className="search-result-text">
                      <strong>{item.title}</strong>
                      <small>{item.subtitle}</small>
                    </span>

                    <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="search-footer" aria-hidden="true">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>Enter</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}

export default SearchOverlay
