import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Header from "./components/Layout/Header"
import Footer from "./components/Layout/Footer"
import About from "./pages/About"
import StockFilter from "./pages/StockFilter"
import Analysis from "./pages/Analysis"
import Investment from "./pages/Investment"
import Contact from "./pages/Contact"
import Home from "./pages/Home"
import Sector from "./pages/Sector"
import "./index.css"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import useScrollToTop from "./components/hooks/useScrollToTop"
import ScrollToTop from "./components/ui/ScrollToTop"
import { LanguageProvider } from "./contexts/LanguageContext"

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  )
}

function AppContent() {
  useScrollToTop() // This will handle scroll to top on route changes

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Routes>
        {/* Pages with header and footer */}
        <Route
          path="/"
          element={
            <>
              <Header className="mb-0" />
              <main className="flex-1">
                <Home />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/Investment_Capital"
          element={
            <>
              <Header className="mb-0" />
              <main className="flex-1">
                <Home />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Header className="mb-0" />
              <main className="flex-1">
                <About />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/stock"
          element={
            <>
              <Header className="mb-0" />
              <main className="flex-1">
                <StockFilter />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/analysis"
          element={
            <>
              <Header className="mb-0" />
              <main className="flex-1">
                <Analysis />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/sector"
          element={
            <>
              <Header className="mb-0" />
              <main className="flex-1">
                <Sector />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/investment"
          element={
            <>
              <Header className="mb-0" />
              <main className="flex-1">
                <Investment />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Header className="mb-0" />
              <main className="flex-1">
                <Contact />
              </main>
              <Footer />
            </>
          }
        />

        {/* Pages without header and footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <ScrollToTop />
    </div>
  )
}

export default App
