import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import { setupMotion, setupProgress } from './scripts/motion'
import { startSmoothScroll } from './scripts/smooth'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import ProjectShowcase from './pages/ProjectShowcase'
import Gallery from './pages/Gallery'
import Locations from './pages/Locations'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import FloatingActions from './components/FloatingActions'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    window.dispatchEvent(new CustomEvent('nx:scrollto', { detail: 0 }))
  }, [pathname])

  useEffect(() => {
    startSmoothScroll()
  }, [])

  return null
}

function Motion() {
  const { pathname } = useLocation()

  useEffect(() => {
    setupProgress()
    const t = setTimeout(setupMotion, 60)
    return () => clearTimeout(t)
  }, [pathname])

  return null
}

function AppRoutes() {
  const { pathname } = useLocation()

  return (
    <>
      <ScrollToTop />
      <Motion />
      <FloatingActions />

      <div key={pathname} className="page-fade">
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/projects"
          element={<Projects />}
        />

        <Route
          path="/projects/:id"
          element={<ProjectShowcase />}
        />

        <Route
          path="/gallery"
          element={<Gallery />}
        />

        <Route
          path="/locations"
          element={<Locations />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/faq"
          element={<FAQ />}
        />

        <Route
          path="*"
          element={<Home />}
        />
      </Routes>
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App