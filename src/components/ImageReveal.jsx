import { useEffect, useRef, useState } from 'react'

function ImageReveal({
  src,
  alt = '',
  ratio = '4 / 3',
  width,
  height,
  priority = false,
  className = '',
  imageClassName = '',
  fallbackSrc = ''
}) {
  const rootRef = useRef(null)

  const [visible, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setCurrentSrc(src)
    setLoaded(false)
    setFailed(false)
  }, [src])

  useEffect(() => {
    const element = rootRef.current

    if (!element) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.12
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      className={[
        'relative overflow-hidden bg-[#FAF6EE]',
        className
      ].join(' ')}
      style={{
        aspectRatio: ratio
      }}
    >
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden bg-[#E7E2D8]/45"
        >
          <div className="absolute inset-0 animate-[imageShimmer_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/45 to-transparent" />
        </div>
      )}

      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (fallbackSrc && currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc)
          } else {
            setFailed(true)
            setLoaded(true)
          }
        }}
        className={[
          'absolute inset-0 h-full w-full object-cover',
          'transition-[opacity,transform] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          loaded && !failed ? 'opacity-100' : 'opacity-0',
          visible ? 'scale-100' : 'scale-[1.12]',
          imageClassName
        ].join(' ')}
      />

      <div
        aria-hidden="true"
        className={[
          'absolute inset-0 z-10 origin-right bg-[#FAF6EE]',
          'transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]',
          visible ? 'scale-x-0' : 'scale-x-100'
        ].join(' ')}
      />

      <style>
        {`
          @keyframes imageShimmer {
            from {
              transform: translateX(-100%);
            }

            to {
              transform: translateX(100%);
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
    </div>
  )
}

export default ImageReveal