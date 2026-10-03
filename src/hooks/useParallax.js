import { useEffect } from 'react'

function useParallax(ref, distance = 24) {
  useEffect(() => {
    const element = ref?.current

    if (!element || distance === 0) return

    let frameId = null

    const update = () => {
      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      const progress =
        (rect.top + rect.height / 2 - viewportHeight / 2) /
        viewportHeight

      const offset = progress * distance

      element.style.transform = `translate3d(0, ${offset}px, 0)`

      frameId = null
    }

    const handleScroll = () => {
      if (frameId !== null) return

      frameId = window.requestAnimationFrame(update)
    }

    update()

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true }
    )

    window.addEventListener(
      'resize',
      handleScroll
    )

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      )

      window.removeEventListener(
        'resize',
        handleScroll
      )

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }

      element.style.transform = ''
    }
  }, [ref, distance])
}

export default useParallax