import { useEffect, useRef, useState } from 'react'

function Reveal({
  children,
  className = '',
  delay = 0,
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setVisible(true)
          }, delay)

          observer.disconnect()
        }
      },
      {
        threshold: 0.15,
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`
        transition-all
        duration-1000
        ${visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-8 opacity-0'}
        ${className}
      `}
      style={{
        transitionTimingFunction:
          'cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {children}
    </div>
  )
}

export default Reveal