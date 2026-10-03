/* =========================================
   SHARED ANIMATION SYSTEM
   ========================================= */

let revealObserver = null
let counterObserver = null
let scrollHandler = null

export function initAnimations(root = document) {
  document.documentElement.classList.add('js')

  initPageLoad()
  initScrollReveal(root)
  initStagger(root)
  initHero(root)
  initPageBanner(root)
  initHeader()
  initCounters(root)
  initMobileMenu(root)
  initFaq(root)
  initLightbox(root)
  initScrollToTop(root)
  initFormSuccess(root)
}

function initPageLoad() {
  requestAnimationFrame(() => {
    document.body.classList.add('page-ready')
  })
}

function initScrollReveal(root) {
  if (revealObserver) {
    revealObserver.disconnect()
  }

  const elements = root.querySelectorAll('[data-animate]')

  if (!elements.length) {
    return
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((element) => {
      element.classList.add('is-visible')
    })

    return
  }

  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => {
      element.classList.add('is-visible')
    })

    return
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        entry.target.classList.add('is-visible')
        revealObserver.unobserve(entry.target)
      })
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    },
  )

  elements.forEach((element) => {
    revealObserver.observe(element)
  })
}

function initStagger(root) {
  const containers = root.querySelectorAll('[data-stagger]')

  containers.forEach((container) => {
    const children = container.querySelectorAll(':scope > [data-animate]')

    children.forEach((child, index) => {
      const delay = Math.min((index + 1) * 0.1, 0.7)

      child.style.transitionDelay = `${delay}s`
    })

    if (!container.hasAttribute('data-animate')) {
      observeStaggerContainer(container)
    }
  })
}

function observeStaggerContainer(container) {
  if (container.classList.contains('is-visible')) {
    return
  }

  if (!('IntersectionObserver' in window)) {
    container.classList.add('is-visible')
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        container.classList.add('is-visible')
        observer.unobserve(container)
      })
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    },
  )

  observer.observe(container)
}

function initHero(root) {
  const heroes = root.querySelectorAll('.home-hero, .hero')

  heroes.forEach((hero) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        hero.classList.add('is-loaded')
      })
    })
  })
}

function initPageBanner(root) {
  const banners = root.querySelectorAll('.page-banner')

  banners.forEach((banner) => {
    requestAnimationFrame(() => {
      banner.classList.add('is-loaded')
    })
  })
}

function initHeader() {
  const header = document.querySelector('.site-header')

  if (!header) {
    return
  }

  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }

  scrollHandler = () => {
    if (window.scrollY > 60) {
      header.classList.add('is-scrolled')
    } else {
      header.classList.remove('is-scrolled')
    }
  }

  window.addEventListener('scroll', scrollHandler, {
    passive: true,
  })

  scrollHandler()
}

function initCounters(root) {
  if (counterObserver) {
    counterObserver.disconnect()
  }

  const counters = root.querySelectorAll('[data-count]')

  if (!counters.length) {
    return
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    counters.forEach((counter) => {
      counter.textContent =
        `${counter.dataset.count}${counter.dataset.suffix || ''}`
    })

    return
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach((counter) => {
      counter.textContent =
        `${counter.dataset.count}${counter.dataset.suffix || ''}`
    })

    return
  }

  counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        animateCounter(entry.target)
        counterObserver.unobserve(entry.target)
      })
    },
    {
      threshold: 0.5,
    },
  )

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })
}

function animateCounter(element) {
  const target = Number(element.dataset.count)
  const suffix = element.dataset.suffix || ''
  const duration = 1500
  const startTime = performance.now()

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    const easedProgress = 1 - Math.pow(1 - progress, 3)
    const value = Math.floor(target * easedProgress)

    element.textContent = `${value}${suffix}`

    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      element.textContent = `${target}${suffix}`
    }
  }

  requestAnimationFrame(update)
}

function initMobileMenu(root) {
  const menuButton = root.querySelector('[data-menu-toggle]')
  const closeButton = root.querySelector('[data-menu-close]')
  const overlay = root.querySelector('.mobile-menu-overlay')
  const drawer = root.querySelector('.mobile-menu-drawer')

  if (!menuButton || !drawer) {
    return
  }

  const openMenu = () => {
    document.body.classList.add('mobile-menu-open')
    menuButton.setAttribute('aria-expanded', 'true')
    drawer.setAttribute('aria-hidden', 'false')
  }

  const closeMenu = () => {
    document.body.classList.remove('mobile-menu-open')
    menuButton.setAttribute('aria-expanded', 'false')
    drawer.setAttribute('aria-hidden', 'true')
  }

  menuButton.addEventListener('click', openMenu)

  closeButton?.addEventListener('click', closeMenu)
  overlay?.addEventListener('click', closeMenu)

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu()
    }
  })
}

function initFaq(root) {
  const items = root.querySelectorAll('.faq-item')

  items.forEach((item) => {
    const trigger = item.querySelector('[data-faq-trigger]')
    const answer = item.querySelector('.faq-answer')

    if (!trigger || !answer) {
      return
    }

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open')

      items.forEach((otherItem) => {
        if (otherItem === item) {
          return
        }

        const otherAnswer = otherItem.querySelector('.faq-answer')

        otherItem.classList.remove('is-open')

        if (otherAnswer) {
          otherAnswer.style.height = '0px'
        }
      })

      if (isOpen) {
        item.classList.remove('is-open')
        answer.style.height = '0px'
      } else {
        item.classList.add('is-open')
        answer.style.height = `${answer.scrollHeight}px`
      }
    })
  })
}

function initLightbox(root) {
  const triggers = root.querySelectorAll('[data-lightbox]')
  const lightbox = root.querySelector('.lightbox')

  if (!triggers.length || !lightbox) {
    return
  }

  const image = lightbox.querySelector('[data-lightbox-image]')
  const closeButton = lightbox.querySelector('[data-lightbox-close]')

  const close = () => {
    lightbox.classList.remove('is-open')
    document.body.style.overflow = ''
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (image) {
        image.src = trigger.dataset.lightbox
        image.alt = trigger.dataset.alt || ''
      }

      lightbox.classList.add('is-open')
      document.body.style.overflow = 'hidden'
    })
  })

  closeButton?.addEventListener('click', close)

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      close()
    }
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      close()
    }
  })
}

function initScrollToTop(root) {
  const button = root.querySelector('[data-scroll-top]')

  if (!button) {
    return
  }

  const update = () => {
    if (window.scrollY > 400) {
      button.classList.add('is-visible')
    } else {
      button.classList.remove('is-visible')
    }
  }

  window.addEventListener('scroll', update, {
    passive: true,
  })

  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  })

  update()
}

function initFormSuccess(root) {
  const forms = root.querySelectorAll('[data-contact-form]')

  forms.forEach((form) => {
    const successMessage = form.querySelector('[data-form-success]')

    if (!successMessage) {
      return
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault()
      successMessage.classList.add('is-visible')
    })
  })
}

export function destroyAnimations() {
  revealObserver?.disconnect()
  counterObserver?.disconnect()

  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
    scrollHandler = null
  }
}