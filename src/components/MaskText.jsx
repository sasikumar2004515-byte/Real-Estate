import { useEffect, useState } from 'react'

function MaskText({
  children,
  className = '',
  delay = 0,
  immediate = false,
}) {
  const [visible, setVisible] = useState(immediate)

  useEffect(() => {
    if (immediate) return

    const timer = setTimeout(() => {
      setVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, immediate])

  return (
    <span
      className={`block overflow-hidden ${className}`}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      <span
        className="block transition-transform duration-1000"
        style={{
          transform: visible
            ? 'translateY(0)'
            : 'translateY(110%)',
          transitionTimingFunction:
            'cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {children}
      </span>
    </span>
  )
}

export default MaskText