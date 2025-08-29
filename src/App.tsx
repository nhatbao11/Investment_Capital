import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import About from "./pages/About";
import StockFilter from "./pages/StockFilter";
import Analysis from "./pages/Analysis";
import Investment from "./pages/Investment";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Sector from "./pages/Sector";
import "./index.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <Header className="mb-0" />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Investment_Capital" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/stock" element={<StockFilter />} />
            <Route path="/analysis" element={<Analysis />} />
            {/* <Route path="/analysis/:ticker" element={<Analysis />} /> */}
            <Route path="/sector" element={<Sector />} />
            <Route path="/investment" element={<Investment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;