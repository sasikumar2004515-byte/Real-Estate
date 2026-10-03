import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import ProjectShowcase from './pages/ProjectShowcase'
import Gallery from './pages/Gallery'
import Locations from './pages/Locations'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

import AnimationManager from './components/AnimationManager'
import FloatingActions from './components/FloatingActions'
import CookieBanner from './components/CookieBanner'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <AnimationManager />

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
          path="/privacy"
          element={<Privacy />}
        />

        <Route
          path="/terms"
          element={<Terms />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <AppRoutes />
        <FloatingActions />
        <CookieBanner />
      </div>
    </BrowserRouter>
  )
}

export default App