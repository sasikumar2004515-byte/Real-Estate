import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SELECTOR = '.reveal, [data-animate], [data-stagger]'

function animateCounter(element) {
  const end = parseFloat(String(element.dataset.count).replace(/[^0-9.]/g, '')) || 0
  const suffix = element.dataset.suffix || ''
  const duration = 1500
  const start = performance.now()

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    element.textContent = `${Math.round(end * eased).toLocaleString('en-IN')}${suffix}`
    if (progress < 1) requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}

/**
 * AnimationManager - one place that powers scroll-reveal, stagger and counters
 * on EVERY page (re-scans on route change and when new elements mount).
 * Content stays visible if JS fails (hidden state only exists under html.js).
 */
function AnimationManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('js')

    // animation.css keeps body at opacity 0 until .page-ready - reveal it
    const readyFrame = requestAnimationFrame(() => {
      document.body.classList.add('page-ready')
      document
        .querySelectorAll('.home-hero, .page-banner')
        .forEach((element) => element.classList.add('is-loaded'))
    })

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const seen = new WeakSet()

    const show = (element) => {
      element.classList.add('is-visible')
      element.querySelectorAll?.('[data-count]').forEach(animateCounter)
      if (element.hasAttribute('data-count')) animateCounter(element)
    }

    const observer =
      'IntersectionObserver' in window && !reduce
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return
                show(entry.target)
                observer.unobserve(entry.target)
              })
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
          )
        : null

    const register = (scope) => {
      scope.querySelectorAll(SELECTOR).forEach((element) => {
        if (seen.has(element)) return
        seen.add(element)

        // stagger children inside [data-stagger]
        if (element.hasAttribute('data-stagger')) {
          Array.from(element.children).forEach((child, index) => {
            child.style.transitionDelay = `${Math.min(index * 0.1, 0.7)}s`
          })
        }

        if (observer) observer.observe(element)
        else show(element)
      })

      // counters outside any reveal wrapper
      scope.querySelectorAll('[data-count]').forEach((element) => {
        if (seen.has(element)) return
        seen.add(element)
        if (observer) {
          const counterObserver = new IntersectionObserver(([entry], obs) => {
            if (entry.isIntersecting) {
              animateCounter(element)
              obs.disconnect()
            }
          }, { threshold: 0.4 })
          counterObserver.observe(element)
        } else {
          animateCounter(element)
        }
      })
    }

    register(document)

    // pages render async (lazy images, state) - catch late elements
    const mutation = new MutationObserver(() => register(document))
    mutation.observe(document.getElementById('root') || document.body, {
      childList: true,
      subtree: true
    })

    // safety net: never leave content hidden
    const safety = window.setTimeout(() => {
      document.querySelectorAll(SELECTOR).forEach((element) => {
        const rect = element.getBoundingClientRect()
        if (rect.top < window.innerHeight) element.classList.add('is-visible')
      })
    }, 1800)

    return () => {
      cancelAnimationFrame(readyFrame)
      observer?.disconnect()
      mutation.disconnect()
      window.clearTimeout(safety)
    }
  }, [pathname])

  return null
}

export default AnimationManager
