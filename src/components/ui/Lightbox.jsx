import { useEffect, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  X
} from 'lucide-react'

function Lightbox({
  images = [],
  startIndex = 0,
  currentIndex,
  onClose,
  onNext,
  onPrev
}) {
  const closeRef = useRef(null)
  const previousRef = useRef(null)
  const nextRef = useRef(null)
  const zoomRef = useRef(null)
  const previousFocusRef = useRef(null)

  const touchStartRef = useRef({
    x: 0,
    y: 0
  })

  const dragStartRef = useRef({
    x: 0,
    y: 0
  })

  const [internalIndex, setInternalIndex] =
    useState(
      Number.isInteger(startIndex)
        ? startIndex
        : 0
    )

  const [zoomed, setZoomed] =
    useState(false)

  const [pan, setPan] = useState({
    x: 0,
    y: 0
  })

  const [loaded, setLoaded] =
    useState(false)

  const [dragging, setDragging] =
    useState(false)

  const [reduceMotion, setReduceMotion] =
    useState(false)

  const isControlled =
    Number.isInteger(currentIndex)

  const activeIndex = isControlled
    ? currentIndex
    : internalIndex

  const activeImage =
    images[activeIndex] || null

  useEffect(() => {
    const motionQuery =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      )

    const handleMotionChange = () => {
      setReduceMotion(
        motionQuery.matches
      )
    }

    handleMotionChange()

    motionQuery.addEventListener(
      'change',
      handleMotionChange
    )

    return () => {
      motionQuery.removeEventListener(
        'change',
        handleMotionChange
      )
    }
  }, [])

  useEffect(() => {
    previousFocusRef.current =
      document.activeElement

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    window.setTimeout(() => {
      closeRef.current?.focus()
    }, 0)

    return () => {
      document.body.style.overflow =
        previousOverflow

      if (
        previousFocusRef.current &&
        typeof previousFocusRef.current
          .focus === 'function'
      ) {
        previousFocusRef.current.focus()
      }
    }
  }, [])

  useEffect(() => {
    setLoaded(false)

    setZoomed(false)

    setPan({
      x: 0,
      y: 0
    })
  }, [
    activeIndex,
    activeImage?.full
  ])

  useEffect(() => {
    if (
      !activeImage ||
      images.length <= 1
    ) {
      return undefined
    }

    const nextIndex =
      (activeIndex + 1) %
      images.length

    const previousIndex =
      (activeIndex -
        1 +
        images.length) %
      images.length

    const preload = (image) => {
      if (!image?.full) {
        return
      }

      const preloadImage =
        new Image()

      preloadImage.src =
        image.full
    }

    preload(images[nextIndex])
    preload(images[previousIndex])

    return undefined
  }, [
    activeIndex,
    activeImage,
    images
  ])

  const moveToIndex = (index) => {
    if (!images.length) {
      return
    }

    const normalized =
      (index + images.length) %
      images.length

    if (isControlled) {
      if (
        normalized ===
        activeIndex
      ) {
        return
      }

      if (
        normalized ===
        (activeIndex + 1) %
          images.length
      ) {
        onNext?.()
        return
      }

      if (
        normalized ===
        (activeIndex -
          1 +
          images.length) %
          images.length
      ) {
        onPrev?.()
        return
      }

      if (normalized > activeIndex) {
        onNext?.()
      } else {
        onPrev?.()
      }

      return
    }

    setInternalIndex(normalized)
  }

  const showNext = () => {
    if (images.length <= 1) {
      return
    }

    if (onNext) {
      onNext()
      return
    }

    moveToIndex(
      activeIndex + 1
    )
  }

  const showPrevious = () => {
    if (images.length <= 1) {
      return
    }

    if (onPrev) {
      onPrev()
      return
    }

    moveToIndex(
      activeIndex - 1
    )
  }

  const resetZoom = () => {
    setZoomed(false)

    setPan({
      x: 0,
      y: 0
    })
  }

  const toggleZoom = () => {
    if (zoomed) {
      resetZoom()
      return
    }

    setZoomed(true)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose?.()
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      showNext()
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      showPrevious()
      return
    }

    if (event.key !== 'Tab') {
      return
    }

    const focusable = [
      closeRef.current,
      previousRef.current,
      nextRef.current,
      zoomRef.current
    ].filter(Boolean)

    if (!focusable.length) {
      return
    }

    const current =
      document.activeElement

    const currentIndex =
      focusable.indexOf(current)

    let targetIndex

    if (event.shiftKey) {
      targetIndex =
        currentIndex <= 0
          ? focusable.length - 1
          : currentIndex - 1
    } else {
      targetIndex =
        currentIndex >=
          focusable.length - 1
          ? 0
          : currentIndex + 1
    }

    event.preventDefault()

    focusable[targetIndex]?.focus()
  }

  useEffect(() => {
    window.addEventListener(
      'keydown',
      handleKeyDown
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  })

  const handlePointerDown = (
    event
  ) => {
    if (!zoomed) {
      return
    }

    setDragging(true)

    dragStartRef.current = {
      x:
        event.clientX -
        pan.x,
      y:
        event.clientY -
        pan.y
    }

    event.currentTarget.setPointerCapture?.(
      event.pointerId
    )
  }

  const handlePointerMove = (
    event
  ) => {
    if (!dragging || !zoomed) {
      return
    }

    setPan({
      x:
        event.clientX -
        dragStartRef.current.x,
      y:
        event.clientY -
        dragStartRef.current.y
    })
  }

  const handlePointerUp = () => {
    setDragging(false)
  }

  const handleTouchStart = (
    event
  ) => {
    if (
      event.touches.length !== 1
    ) {
      return
    }

    touchStartRef.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    }
  }

  const handleTouchEnd = (
    event
  ) => {
    if (
      zoomed ||
      !event.changedTouches.length
    ) {
      return
    }

    const touch =
      event.changedTouches[0]

    const deltaX =
      touch.clientX -
      touchStartRef.current.x

    const deltaY =
      touch.clientY -
      touchStartRef.current.y

    if (
      Math.abs(deltaX) < 50 ||
      Math.abs(deltaX) <
        Math.abs(deltaY)
    ) {
      return
    }

    if (deltaX < 0) {
      showNext()
    } else {
      showPrevious()
    }
  }

  if (!activeImage) {
    return null
  }

  const duration =
    reduceMotion
      ? '0ms'
      : '600ms'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery viewer"
      className="fixed inset-0 z-[2000] flex flex-col bg-[#0B1A2E]/[0.96] text-white"
      style={{
        animation: `lightboxBackdrop 500ms cubic-bezier(0.22,1,0.36,1) both`
      }}
      onTouchStart={
        handleTouchStart
      }
      onTouchEnd={handleTouchEnd}
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose?.()
        }
      }}
    >
      <div className="flex shrink-0 items-center justify-between px-4 py-4 sm:px-6 sm:py-5">

        <div
          aria-live="polite"
          className="font-['Inter'] text-[13px] font-medium tracking-[0.08em] text-white/65"
        >
          {String(
            activeIndex + 1
          ).padStart(2, '0')}{' '}
          /{' '}
          {String(
            images.length
          ).padStart(2, '0')}
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 hover:border-white/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
        >
          <X
            size={20}
            strokeWidth={1.4}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 pb-5 sm:px-20">

        <button
          ref={previousRef}
          type="button"
          onClick={showPrevious}
          aria-label="Previous image"
          disabled={images.length <= 1}
          className="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/15 text-white/80 transition-[transform,opacity] duration-300 hover:scale-105 hover:border-white/40 hover:text-white disabled:pointer-events-none disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] sm:left-6"
        >
          <ChevronLeft
            size={22}
            strokeWidth={1.2}
            aria-hidden="true"
          />
        </button>

        <div
          className={[
            'relative flex max-h-[calc(100vh-180px)] max-w-[92vw] items-center justify-center',
            zoomed
              ? dragging
                ? 'cursor-grabbing'
                : 'cursor-grab'
              : 'cursor-zoom-in'
          ].join(' ')}
          onDoubleClick={
            toggleZoom
          }
          onPointerDown={
            handlePointerDown
          }
          onPointerMove={
            handlePointerMove
          }
          onPointerUp={
            handlePointerUp
          }
          onPointerCancel={
            handlePointerUp
          }
        >
          {!loaded && (
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 border-t-[#C9A96E] animate-spin"
            />
          )}

          <img
            key={activeImage.full}
            src={activeImage.full}
            alt={activeImage.alt || ''}
            draggable={false}
            onLoad={() =>
              setLoaded(true)
            }
            className={[
              'block max-h-[calc(100vh-180px)] max-w-[92vw] select-none object-contain',
              'ease-[cubic-bezier(0.22,1,0.36,1)]',
              loaded
                ? 'opacity-100'
                : 'opacity-0'
            ].join(' ')}
            style={{
              transitionProperty:
                'opacity, transform',
              transitionDuration:
                duration,
              transform: `
                translate3d(${pan.x}px, ${pan.y}px, 0)
                scale(${zoomed ? 2 : 1})
              `,
              willChange:
                zoomed
                  ? 'transform'
                  : 'auto'
            }}
          />
        </div>

        <button
          ref={nextRef}
          type="button"
          onClick={showNext}
          aria-label="Next image"
          disabled={images.length <= 1}
          className="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/15 text-white/80 transition-[transform,opacity] duration-300 hover:scale-105 hover:border-white/40 hover:text-white disabled:pointer-events-none disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] sm:right-6"
        >
          <ChevronRight
            size={22}
            strokeWidth={1.2}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex shrink-0 flex-col items-center gap-3 px-5 pb-6 text-center sm:pb-7">

        <div
          key={activeImage.full}
          className="max-w-xl animate-[lightboxCaption_600ms_cubic-bezier(0.22,1,0.36,1)_both]"
        >
          {activeImage.title && (
            <h2 className="font-['Manrope'] text-base font-semibold text-white sm:text-lg">
              {activeImage.title}
            </h2>
          )}

          {activeImage.category && (
            <p className="mt-1 font-['Inter'] text-[11px] font-medium uppercase tracking-[0.08em] text-white/50">
              {activeImage.category}
            </p>
          )}
        </div>

        <button
          ref={zoomRef}
          type="button"
          onClick={toggleZoom}
          aria-label={
            zoomed
              ? 'Reset image zoom'
              : 'Zoom image'
          }
          className="flex h-9 items-center gap-2 rounded-full border border-white/15 px-4 font-['Inter'] text-[11px] font-medium text-white/70 transition-[transform,opacity] duration-300 hover:scale-105 hover:border-white/40 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
        >
          {zoomed ? (
            <Minus
              size={14}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          ) : (
            <Plus
              size={14}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          )}

          {zoomed
            ? 'Reset'
            : 'Zoom'}
        </button>
      </div>

      <style>
        {`
          @keyframes lightboxBackdrop {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          @keyframes lightboxCaption {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
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

export default Lightbox