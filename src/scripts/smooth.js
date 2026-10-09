// Smooth wheel scrolling. The wheel moves a target and the page eases towards it.
// Touch screens keep their normal scrolling.

let started = false

export function startSmoothScroll() {
  if (started) return
  started = true

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const touch = window.matchMedia('(pointer: coarse)').matches
  if (reduced || touch) return

  let current = window.scrollY
  let target = current
  let running = false
  let raf = 0

  const limit = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const clamp = (v) => Math.min(limit(), Math.max(0, v))

  const loop = () => {
    const gap = target - current
    if (Math.abs(gap) < 0.35) {
      current = target
      window.scrollTo(0, current)
      running = false
      return
    }
    current += gap * 0.16
    window.scrollTo(0, current)
    raf = requestAnimationFrame(loop)
  }

  const canScrollInside = (node, dy) => {
    for (let el = node; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
      if (el.hasAttribute && el.hasAttribute('data-native-scroll')) return true
      const style = getComputedStyle(el)
      if (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 1) {
        const atTop = el.scrollTop <= 0 && dy < 0
        const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && dy > 0
        if (!atTop && !atEnd) return true
      }
    }
    return false
  }

  const onWheel = (event) => {
    if (event.defaultPrevented || event.ctrlKey) return
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
    if (document.body.style.overflow === 'hidden') return
    if (canScrollInside(event.target, event.deltaY)) return
    event.preventDefault()
    if (!running) {
      current = window.scrollY
      target = current
    }
    const unit = event.deltaMode === 1 ? 34 : event.deltaMode === 2 ? window.innerHeight : 1
    target = clamp(target + event.deltaY * unit * 1.0)
    if (!running) {
      running = true
      raf = requestAnimationFrame(loop)
    }
  }

  // keys, links and scrollIntoView move the page too, so just follow them
  const onScroll = () => {
    if (Math.abs(window.scrollY - current) > 3) {
      cancelAnimationFrame(raf)
      running = false
      current = target = window.scrollY
    }
  }

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', () => { target = clamp(target) })
  window.addEventListener('nx:scrollto', (e) => {
    cancelAnimationFrame(raf)
    running = false
    current = target = e.detail ?? window.scrollY
  })
}
