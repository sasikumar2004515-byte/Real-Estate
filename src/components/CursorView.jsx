import { useEffect, useRef, useState } from 'react'

function CursorView() {
  const cursorRef = useRef(null)

  const positionRef = useRef({
    x: 0,
    y: 0
  })

  const targetRef = useRef({
    x: 0,
    y: 0
  })

  const frameRef = useRef(null)
  const activeRef = useRef(false)
  const movedRef = useRef(false)

  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const hoverQuery = window.matchMedia(
      '(hover: hover)'
    )

    const pointerQuery = window.matchMedia(
      '(pointer: fine)'
    )

    const updateEnabled = () => {
      setEnabled(
        hoverQuery.matches &&
          pointerQuery.matches
      )
    }

    updateEnabled()

    hoverQuery.addEventListener(
      'change',
      updateEnabled
    )

    pointerQuery.addEventListener(
      'change',
      updateEnabled
    )

    return () => {
      hoverQuery.removeEventListener(
        'change',
        updateEnabled
      )

      pointerQuery.removeEventListener(
        'change',
        updateEnabled
      )
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    const element = cursorRef.current

    if (!element) {
      return undefined
    }

    const animate = () => {
      const current =
        positionRef.current

      const target =
        targetRef.current

      current.x +=
        (target.x - current.x) * 0.16

      current.y +=
        (target.y - current.y) * 0.16

      const scale = activeRef.current
        ? 1
        : 0.6

      element.style.transform = `
        translate3d(
          ${current.x}px,
          ${current.y}px,
          0
        )
        translate(-50%, -50%)
        scale(${scale})
      `

      // Show only while hovering [data-cursor="view"] items
      element.style.opacity =
        movedRef.current && activeRef.current
          ? '1'
          : '0'

      frameRef.current =
        window.requestAnimationFrame(
          animate
        )
    }

    const handlePointerMove = (event) => {
      if (!movedRef.current) {
        movedRef.current = true
        positionRef.current = { x: event.clientX, y: event.clientY }
      }

      targetRef.current = {
        x: event.clientX,
        y: event.clientY
      }

      const target = event.target

      const cursorTarget =
        target instanceof Element
          ? target.closest(
              '[data-cursor="view"]'
            )
          : null

      activeRef.current =
        Boolean(cursorTarget)
    }

    const handlePointerLeave = () => {
      activeRef.current = false
    }

    window.addEventListener(
      'pointermove',
      handlePointerMove,
      { passive: true }
    )

    window.addEventListener(
      'blur',
      handlePointerLeave
    )

    frameRef.current =
      window.requestAnimationFrame(
        animate
      )

    return () => {
      window.removeEventListener(
        'pointermove',
        handlePointerMove
      )

      window.removeEventListener(
        'blur',
        handlePointerLeave
      )

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(
          frameRef.current
        )
      }
    }
  }, [enabled])

  if (!enabled) {
    return null
  }

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#C9A96E] bg-[#0B1A2E]/10 font-['Inter'] text-[12px] font-medium text-[#0B1A2E] opacity-0 mix-blend-normal transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        opacity: 0,
        willChange: 'transform'
      }}
    >
      View
    </div>
  )
}

export default CursorView