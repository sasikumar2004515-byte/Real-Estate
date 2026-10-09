import { useEffect, useRef, useState } from 'react'

// true once the element is in view or already scrolled past.
// Uses a scroll check instead of IntersectionObserver so fast scrolling can't leave it hidden.
const waiting = new Set()
let bound = false
let queued = false

function sweep() {
  queued = false
  const limit = window.innerHeight * 0.92
  waiting.forEach((item) => {
    if (item.el.getBoundingClientRect().top < limit) {
      waiting.delete(item)
      item.show()
    }
  })
}

function schedule() {
  if (!queued) {
    queued = true
    requestAnimationFrame(sweep)
  }
}

function bind() {
  if (bound) return
  bound = true
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
}

function useInView() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const item = { el, show: () => setSeen(true) }
    waiting.add(item)
    bind()
    schedule()
    const t1 = setTimeout(schedule, 350)
    const t2 = setTimeout(schedule, 1200)
    return () => {
      waiting.delete(item)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return [ref, seen]
}

export default useInView
