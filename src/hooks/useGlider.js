import { useCallback, useEffect, useRef } from 'react'

// Side-scrolling carousel. layout(pos, width, count) gives each item's {x, w, scale, opacity, z}.
// Drag, swipe, trackpad, arrows and keys all move the same position.
function useGlider({ count, layout, unit, onFrame }) {
  const stage = useRef(null)
  const items = useRef([])
  const line = useRef(null)
  const state = useRef({ pos: 0, target: 0, raf: 0 })
  const live = useRef({ layout, unit, onFrame, count })
  live.current = { layout, unit, onFrame, count }

  const kick = useCallback(() => {
    const s = state.current
    if (s.raf) return
    const step = () => {
      const { layout: lay, count: n, onFrame: cb } = live.current
      const el = stage.current
      if (!el) { s.raf = 0; return }
      s.pos += (s.target - s.pos) * 0.1
      const settled = Math.abs(s.target - s.pos) < 0.0007
      if (settled) s.pos = s.target
      const out = lay(s.pos, el.clientWidth, n)
      for (let i = 0; i < n; i++) {
        const node = items.current[i]
        const o = out[i]
        if (!node || !o) continue
        node.style.transform = `translate3d(${o.x.toFixed(1)}px,0,0) scale(${(o.scale ?? 1).toFixed(4)})`
        if (o.w != null) node.style.width = o.w.toFixed(1) + 'px'
        node.style.opacity = String(o.opacity ?? 1)
        node.style.zIndex = String(o.z ?? 1)
        node.style.visibility = (o.opacity ?? 1) < 0.02 ? 'hidden' : 'visible'
      }
      if (line.current) line.current.style.transform = `scaleX(${n > 1 ? Math.max(0.06, s.pos / (n - 1)).toFixed(4) : 1})`
      if (cb) cb(s.pos)
      s.raf = settled ? 0 : requestAnimationFrame(step)
    }
    s.raf = requestAnimationFrame(step)
  }, [])

  const goTo = useCallback((i) => {
    const n = live.current.count
    state.current.target = Math.min(n - 1, Math.max(0, Math.round(i)))
    kick()
  }, [kick])

  const move = useCallback((by) => goTo(Math.round(state.current.target) + by), [goTo])

  useEffect(() => {
    const el = stage.current
    if (!el) return undefined
    const s = state.current
    const clampT = (v) => Math.min(live.current.count - 1, Math.max(0, v))
    let down = false, x0 = 0, p0 = 0, moved = 0, lastX = 0, vel = 0, snap = 0

    const onDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      down = true; moved = 0; x0 = lastX = e.clientX; p0 = s.target; vel = 0
      el.classList.add('is-drag')
    }
    const onMove = (e) => {
      if (!down) return
      const dx = e.clientX - x0
      moved = Math.max(moved, Math.abs(dx))
      vel = e.clientX - lastX
      lastX = e.clientX
      s.target = clampT(p0 - dx / live.current.unit(el.clientWidth))
      kick()
    }
    const onUp = () => {
      if (!down) return
      down = false
      el.classList.remove('is-drag')
      const u = live.current.unit(el.clientWidth)
      s.target = clampT(Math.round(s.target - (vel * 6) / u))
      kick()
    }
    const onClickCapture = (e) => {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0 }
    }
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      s.target = clampT(s.target + e.deltaX / (live.current.unit(el.clientWidth) * 1.4))
      kick()
      clearTimeout(snap)
      snap = setTimeout(() => { s.target = clampT(Math.round(s.target)); kick() }, 130)
    }
    const onKey = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(Math.round(s.target) + 1) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(Math.round(s.target) - 1) }
    }
    const onResize = () => kick()

    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    el.addEventListener('click', onClickCapture, true)
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('keydown', onKey)
    el.addEventListener('dragstart', (e) => e.preventDefault())
    window.addEventListener('resize', onResize)
    kick()
    return () => {
      cancelAnimationFrame(s.raf)
      s.raf = 0
      clearTimeout(snap)
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      el.removeEventListener('click', onClickCapture, true)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [goTo, kick])

  // a new set of items (filter change) starts again from the first one
  useEffect(() => {
    state.current.target = 0
    state.current.pos = 0
    kick()
  }, [count, kick])

  return { stage, items, line, goTo, move, state }
}

export default useGlider
