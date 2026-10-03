import { useEffect, useRef, useState } from 'react'

/**
 * MaskText - each line slides up inside an overflow-hidden mask.
 * Falls back to visible if IntersectionObserver is unavailable.
 */
function MaskText({
  as = 'div',
  lines = [],
  immediate = false,
  className = ''
}) {
  const rootRef = useRef(null)
  const [visible, setVisible] = useState(immediate)

  useEffect(() => {
    if (immediate) {
      const frame = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(frame)
    }

    const element = rootRef.current
    if (!element) return undefined

    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [immediate])

  const Component = as

  return (
    <Component ref={rootRef} className={className}>
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className="block overflow-hidden pb-[0.12em]"
        >
          <span
            className={[
              'block transform-gpu transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]',
              visible ? 'translate-y-0' : 'translate-y-[110%]'
            ].join(' ')}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            {line}
          </span>
        </span>
      ))}
    </Component>
  )
}

export default MaskText
