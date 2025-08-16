import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import About from './pages/About';
import StockFilter from './pages/StockFilter';
import Analysis from './pages/Analysis';
import Investment from './pages/Investment';
import Contact from './pages/Contact';
import Home from './pages/Home';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <Header className="mb-0" />
        <main className="flex-1">
          <Routes>
            <Route path="/Investment_Capital" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/stock" element={<StockFilter />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/investment" element={<Investment />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/" element={<StockFilter />} />
        <Route path="/analysis/:ticker" element={<Analysis />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;