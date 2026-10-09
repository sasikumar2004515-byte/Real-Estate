import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'

const FRAMES = 271
const FRAME_W = 1280
const FRAME_H = 720
const frameSrc = (n) => `/hero/f${String(n + 1).padStart(3, '0')}.webp`

const FILM_END = 0.89 // last frame is reached here
const END_AT = 0.9 // buttons come in right after the last frame
const BEHIND = 10
const AHEAD = 40

// which part of the film each text card belongs to (0 to 1 of the film)
const panels = [
  { id: 'intro', a: 0, b: 0.115, side: 'left' },
  { id: 'plot', a: 0.115, b: 0.225, side: 'right', no: '01', name: 'The plot', title: 'Every home begins with the land.', text: 'We measure, map and understand a site before a single line is drawn.' },
  { id: 'arrival', a: 0.225, b: 0.34, side: 'left', no: '02', name: 'The arrival', title: 'A first impression that lasts.', text: 'Approach, entrance and facade composed together as one gesture.' },
  { id: 'plan', a: 0.34, b: 0.455, side: 'right', no: '03', name: 'The plan', title: 'Planned around light.', text: 'Rooms are placed for daylight, cross ventilation and quiet.' },
  { id: 'layers', a: 0.455, b: 0.575, side: 'left', no: '04', name: 'The layers', title: 'Drawn layer by layer.', text: 'Structure, services and finishes resolved before construction begins.' },
  { id: 'door', a: 0.575, b: 0.7, side: 'right', no: '05', name: 'The threshold', title: 'Detail you can feel.', text: 'Materials chosen to be touched every day, and to age well.' },
  { id: 'build', a: 0.7, b: 0.9, side: 'left', no: '06', name: 'The structure', title: 'Space, before the finishes.', text: 'Volume, height and light, built with care at every stage.' },
  { id: 'end', a: END_AT, b: 2, side: 'center', last: true },
]

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const ease = (t) => t * t * (3 - 2 * t)

function ScrollHero() {
  const track = useRef(null)
  const pin = useRef(null)
  const film = useRef(null)
  const veil = useRef(null)
  const fill = useRef(null)
  const count = useRef(null)
  const slots = useRef([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const cv = film.current
    const ctx = cv.getContext('2d', { alpha: false })

    const blobs = new Array(FRAMES)
    const bitmaps = new Array(FRAMES)
    let target = 0, drawn = -1, drawnExact = false, shown = -1, raf = 0, alive = true
    let current = 0, bitmapH = FRAME_H

    const header = document.querySelector('.nx-header')
    const setHeader = () => track.current && track.current.style.setProperty('--hh', (header ? header.offsetHeight : 84) + 'px')

    const close = (i) => {
      if (bitmaps[i]) { bitmaps[i].close && bitmaps[i].close(); bitmaps[i] = null }
    }

    let queue = []
    let busy = 0

    const decodeOne = async (n) => {
      if (!alive || bitmaps[n] || !blobs[n]) return
      try {
        let bmp
        if (bitmapH < FRAME_H) {
          bmp = await createImageBitmap(blobs[n], { resizeHeight: bitmapH, resizeQuality: 'high' })
        } else {
          bmp = await createImageBitmap(blobs[n])
        }
        if (!alive || n < current - BEHIND - 4 || n > current + AHEAD + 4) { bmp.close && bmp.close(); return }
        bitmaps[n] = bmp
      } catch {
        // skip a frame that won't decode
      }
    }

    // a few decodes at a time, nearest frame first, so a jump in the scroll shows the right frame quickly
    const pump = () => {
      while (alive && busy < 3 && queue.length) {
        const n = queue.shift()
        if (bitmaps[n] || !blobs[n]) continue
        busy++
        decodeOne(n).finally(() => { busy--; pump() })
      }
    }
    const decode = (n) => { if (!queue.includes(n)) queue.push(n); pump() }

    // only a window of frames around the current one stays decoded, so memory stays small
    const keepWindow = (n) => {
      const lo = Math.max(0, n - BEHIND)
      const hi = Math.min(FRAMES - 1, n + AHEAD)
      for (let i = 0; i < FRAMES; i++) if (i < lo || i > hi) close(i)
      queue = []
      for (let d = 0; d <= AHEAD; d++) {
        if (n + d <= hi) queue.push(n + d)
        if (d > 0 && d <= BEHIND && n - d >= lo) queue.push(n - d)
      }
      pump()
    }

    const fetchFrame = async (n) => {
      try {
        const res = await fetch(frameSrc(n))
        blobs[n] = await res.blob()
        if (n >= current - BEHIND && n <= current + AHEAD && !bitmaps[n]) decode(n)
      } catch {
        // missing frame, the nearest one is shown instead
      }
    }

    ;(async () => {
      await fetchFrame(0)
      if (!alive) return
      await decodeOne(0)
      if (!alive) return
      setReady(true)
      drawn = -1
      let next = 1
      const worker = async () => {
        while (alive && next < FRAMES) await fetchFrame(next++)
      }
      await Promise.all(Array.from({ length: 8 }, worker))
    })()

    const resize = () => {
      setHeader()
      const W = pin.current.clientWidth
      const H = pin.current.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.style.width = W + 'px'
      cv.style.height = H + 'px'
      cv.width = Math.round(W * dpr)
      cv.height = Math.round(H * dpr)
      const shownH = Math.max(cv.height, cv.width * FRAME_H / FRAME_W)
      const need = Math.min(FRAME_H, Math.round(shownH))
      if (Math.abs(need - bitmapH) > 24) {
        bitmapH = need
        for (let i = 0; i < FRAMES; i++) close(i)
        keepWindow(current)
      }
      drawn = -1
    }

    const nearest = (n) => {
      for (let d = 0; d < FRAMES; d++) {
        if (bitmaps[n - d]) return [bitmaps[n - d], d === 0]
        if (bitmaps[n + d]) return [bitmaps[n + d], d === 0]
      }
      return [null, false]
    }

    const paint = (img) => {
      const W = cv.width, H = cv.height
      const s = Math.max(W / img.width, H / img.height)
      const w = img.width * s, h = img.height * s
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h)
    }

    const readScroll = () => {
      const box = track.current.getBoundingClientRect()
      target = clamp01(-box.top / (box.height - pin.current.clientHeight))
    }

    const place = (p) => {
      const f = clamp01(p / FILM_END)
      panels.forEach((pn, i) => {
        const el = slots.current[i]
        if (!el) return
        const t = pn.last ? p : f
        const fadeIn = i === 0 ? 1 : ease(clamp01((t - pn.a) / (pn.last ? 0.025 : 0.035)))
        const fadeOut = pn.last ? 1 : ease(clamp01((pn.b - t) / 0.035))
        const o = fadeIn * fadeOut
        const y = (1 - fadeIn) * 46 - (1 - fadeOut) * 46
        el.style.opacity = o.toFixed(3)
        el.firstChild.style.transform = `translate3d(0,${y.toFixed(1)}px,0)`
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible'
        el.style.pointerEvents = o > 0.6 ? 'auto' : 'none'
      })
      if (veil.current) veil.current.style.opacity = clamp01((p - END_AT + 0.01) / 0.03).toFixed(3)
    }

    // the page scroll is already smoothed in smooth.js, so the film just follows it
    const tick = () => {
      const f = clamp01(target / FILM_END)
      const index = Math.round(f * (FRAMES - 1))
      if (index !== current) { current = index; keepWindow(index) }
      if (index !== drawn || !drawnExact) {
        const [img, exact] = nearest(index)
        if (img) { paint(img); drawn = index; drawnExact = exact }
      }
      if (Math.abs(target - shown) > 0.0003) {
        shown = target
        place(target)
        fill.current.style.transform = `scaleX(${target.toFixed(4)})`
        let k = 0
        panels.forEach((pn, i) => { if ((pn.last ? target : f) >= pn.a) k = i })
        count.current.textContent = `${String(Math.min(k, 7) + 1).padStart(2, '0')} / 08`
      }
      raf = requestAnimationFrame(tick)
    }

    const onResize = () => { resize(); readScroll() }
    resize()
    readScroll()
    place(0)
    window.addEventListener('scroll', readScroll, { passive: true })
    window.addEventListener('resize', onResize)
    raf = requestAnimationFrame(tick)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', readScroll)
      window.removeEventListener('resize', onResize)
      for (let i = 0; i < FRAMES; i++) close(i)
    }
  }, [])

  return (
    <section className="lxh" data-own ref={track} aria-label="Film of a Nivora home, from the plot to the finished interior">
      <div className="lxh-pin" ref={pin}>
        <canvas className={ready ? 'lxh-film is-on' : 'lxh-film'} ref={film} />
        <div className="lxh-edge" />
        <div className="lxh-endveil" ref={veil} />

        {panels.map((pn, i) => (
          <div key={pn.id} className={`lxh-slot lxh-slot--${pn.side}${pn.id === 'intro' ? ' lxh-slot--intro' : ''}`} ref={(el) => (slots.current[i] = el)}>
            <div className={pn.last ? 'lxh-panel lxh-panel--end' : 'lxh-panel'}>
              {pn.id === 'intro' && (
                <>
                  <p className="lxh-eyebrow">Residences in Chennai</p>
                  <h1>Spaces designed for <em>the life ahead.</em></h1>
                  <p className="lxh-text">{site.tagline}</p>
                  <span className="lxh-hint"><i />Scroll to begin the film</span>
                </>
              )}
              {pn.no && (
                <>
                  <p className="lxh-eyebrow"><b>{pn.no}</b>{pn.name}</p>
                  <h2>{pn.title}</h2>
                  <p className="lxh-text">{pn.text}</p>
                </>
              )}
              {pn.last && (
                <>
                  <h2>Come and live in it.</h2>
                  <p className="lxh-text">See the homes in person, with no obligation.</p>
                  <div className="lxh-cta">
                    <Link to="/projects" className="lx-btn">Explore projects <i>→</i></Link>
                    <Link to="/contact" className="lx-btn lx-btn--ghost">Book a site visit</Link>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        <div className="lxh-foot" aria-hidden="true">
          <span ref={count}>01 / 08</span>
          <div className="lxh-bar"><i ref={fill} /></div>
        </div>
      </div>
    </section>
  )
}

export default ScrollHero