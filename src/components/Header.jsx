import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        <Link 
          className="flex items-center"
        >
          <div className="text-primary-600 text-2xl font-display font-bold mr-2">
            🌎 WorldMap
          </div>
          <span className="hidden sm:inline-block text-sm bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
            Explorer
          </span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-700 hover:text-primary-600 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-6 center">
          <NavLink to="/" label="Home" currentPath={location.pathname} />
          <NavLink to="/explore" label="Explore" currentPath={location.pathname} />
          <NavLink to="/about" label="About" currentPath={location.pathname} />
        </nav>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-lg animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <NavLink to="/" label="Home" currentPath={location.pathname} mobile />
            <NavLink to="/explore" label="Explore" currentPath={location.pathname} mobile />
            <NavLink to="/about" label="About" currentPath={location.pathname} mobile />
          </nav>
        </div>
      )}
    </header>
  );
};

const NavLink = ({ to, label, currentPath, mobile }) => {
  const isActive = to === '/' ? currentPath === to : currentPath.startsWith(to);
  
  return (
    <Link
      to={to}
      className={`
        ${mobile ? 'block w-full py-2 px-4' : 'inline-block'}
        font-medium transition-all duration-200
        ${isActive 
          ? 'text-primary-600 font-semibold' 
          : 'text-gray-600 hover:text-primary-500'
        }
        ${isActive && mobile ? 'bg-primary-50 rounded-md' : ''}
      `}
    >
      {label}
      {isActive && !mobile && (
        <span className="block h-0.5 bg-primary-500 mt-0.5 animate-fade-in"></span>
      )}
    </Link>
  );
};

export default Header;