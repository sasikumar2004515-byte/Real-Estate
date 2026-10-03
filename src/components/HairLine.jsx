import { useEffect, useRef, useState } from 'react'

/**
 * HairLine - thin stone line with a gold line that draws from left.
 * Styles live in gallery.css (.gallery-hairline).
 */
function HairLine({ className = '', immediate = false }) {
  const ref = useRef(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    if (immediate) {
      const frame = requestAnimationFrame(() => setDrawn(true))
      return () => cancelAnimationFrame(frame)
    }

    const element = ref.current
    if (!element) return undefined

    if (!('IntersectionObserver' in window)) {
      setDrawn(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [immediate])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`gallery-hairline h-px w-full overflow-hidden bg-[#E7E2D8] ${drawn ? 'is-drawn' : ''} ${className}`}
    >
      <span className="block h-full w-full bg-[#C9A96E]" />
    </div>
  )
}

export default HairLine
