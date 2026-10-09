// Scroll effects used on every page: fade-up, image wipe, number count-up,
// section tones and the progress bar.

let bar = null
let imageCheck = null

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const NUMBER = /^(₹?)(\d[\d,.]*)(\s?(?:\+|%|k|K|M|Cr|L))?$/

function blocksOf(section) {
  const found = []
  Array.from(section.children).forEach((child) => {
    const style = getComputedStyle(child)
    if (style.position === 'absolute' || style.position === 'fixed') return
    const spread = style.display === 'grid' || style.display === 'flex'
    if (spread && child.children.length > 1) found.push(...child.children)
    else found.push(child)
  })
  return found
}

function tintSections() {
  let n = 0
  document.querySelectorAll('main section').forEach((section) => {
    if (section.closest('.nx') || section.parentElement.closest('section')) return
    const style = getComputedStyle(section)
    if (style.backgroundImage !== 'none') return
    const [r, g, b, a = 1] = (style.backgroundColor.match(/[\d.]+/g) || []).map(Number)
    const light = a === 0 || (r > 225 && g > 220 && b > 200)
    if (!light) return
    section.classList.add(n % 2 ? 'tone-b' : 'tone-a')
    n += 1
  })
}

function countUp(el, to, prefix, suffix) {
  const decimals = (to.split('.')[1] || '').length
  const end = parseFloat(to.replace(/,/g, ''))
  const started = performance.now()
  const step = (now) => {
    const t = Math.min(1, (now - started) / 1400)
    const value = end * (1 - Math.pow(1 - t, 3))
    el.textContent = prefix + value.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export function setupMotion() {
  if (imageCheck) window.removeEventListener('scroll', imageCheck)
  tintSections()

  const items = []
  const pendingImages = []
  const skip = (el) => el.hasAttribute('data-animate') || el.closest('[data-animate], [data-own]') || el.classList.contains('mv')

  document.querySelectorAll('main:not([data-own]) section:not(.hero):not(.focus), .nx-footer').forEach((section) => {
    blocksOf(section).forEach((el, i) => {
      if (skip(el)) return
      el.classList.add('mv')
      el.style.setProperty('--d', Math.min(i, 6) * 90 + 'ms')
      items.push(el)
    })
  })

  document.querySelectorAll('main img').forEach((img) => {
    if (img.closest('.hero, .focus, [data-animate], [data-own]') || img.classList.contains('mv-img')) return
    img.classList.add('mv-img')
    pendingImages.push(img)
  })

  const counters = []
  document.querySelectorAll('main strong, main b').forEach((el) => {
    const m = el.children.length === 0 && el.textContent.trim().match(NUMBER)
    if (m) counters.push([el, m[2], m[1] || '', m[3] || ''])
  })

  if (reduced()) {
    items.concat(pendingImages).forEach((el) => el.classList.add('mv-in'))
    return
  }

  // Reveal by scroll position so nothing stays hidden after a fast scroll or jump.
  const pendingBlocks = items.slice()
  const pendingCounters = counters.slice()
  const line = () => window.innerHeight * 0.93
  let queued = false
  const sweep = () => {
    queued = false
    const limit = line()
    for (let i = pendingImages.length - 1; i >= 0; i--) {
      if (pendingImages[i].getBoundingClientRect().top < limit) {
        pendingImages[i].classList.add('mv-in')
        pendingImages.splice(i, 1)
      }
    }
    for (let i = pendingBlocks.length - 1; i >= 0; i--) {
      if (pendingBlocks[i].getBoundingClientRect().top < limit) {
        pendingBlocks[i].classList.add('mv-in')
        pendingBlocks.splice(i, 1)
      }
    }
    for (let i = pendingCounters.length - 1; i >= 0; i--) {
      if (pendingCounters[i][0].getBoundingClientRect().top < limit) {
        countUp(...pendingCounters[i])
        pendingCounters.splice(i, 1)
      }
    }
  }
  imageCheck = () => {
    if (!queued) {
      queued = true
      requestAnimationFrame(sweep)
    }
  }
  window.addEventListener('scroll', imageCheck, { passive: true })
  window.addEventListener('resize', imageCheck)
  sweep()
  setTimeout(sweep, 400)
  setTimeout(sweep, 1200)
}

export function setupProgress() {
  if (bar) return
  bar = document.createElement('div')
  bar.className = 'scroll-bar'
  document.body.appendChild(bar)
  const update = () => {
    const room = document.documentElement.scrollHeight - window.innerHeight
    bar.style.transform = `scaleX(${room > 0 ? window.scrollY / room : 0})`
  }
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
  update()
}
