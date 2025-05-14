import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Explore from './pages/Explore';
import About from './pages/About';
import CountryDetail from './components/CountryDetail';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/about" element={<About />} />
            <Route path="/country/:code" element={<CountryDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <footer className="bg-gray-800 text-white py-8 px-4">
            <div className="container-custom text-center">
              <div className="flex flex-col md:flex-row justify-between items-center text-center">
                <div className="mb-4 md:mb-0 text-center">
                  <div className="text-xl font-bold mb-2 text-center">🌎 WorldMap Explorer</div>
                  <p className="text-gray-400 text-sm text-center">
                    Discover the world one country at a time
                  </p>
                </div>
                
                {/* <div className="flex space-x-6">
                  <FooterLink to="/">Home</FooterLink>
                  <FooterLink to="/explore">Explore</FooterLink>
                  <FooterLink to="/about">About</FooterLink>
                </div> */}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
                <p>
                  © {new Date().getFullYear()} WorldMap Explorer. Powered by{' '}
                  <a 
                    href="https://restcountries.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-300 hover:text-primary-200"
                  >
                    REST Countries API
                  </a>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

const FooterLink = ({ to, children }) => (
  <a href={to} className="text-gray-300 hover:text-white transition-colors">
    {children}
  </a>
);

export default App;