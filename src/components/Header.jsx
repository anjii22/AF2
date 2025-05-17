import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        {/* Left - Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-primary-600 text-2xl font-display font-bold">
            🌎 WorldMap
          </div>
          <span className="hidden sm:inline-block text-sm bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
            Explorer
          </span>
        </Link>

        {/* Center - Navigation */}
        <nav className="hidden md:flex space-x-6 flex-1 justify-center">
          <NavLink to="/" label="Home" currentPath={location.pathname} />
          <NavLink to="/explore" label="Explore" currentPath={location.pathname} />
          <NavLink to="/about" label="About" currentPath={location.pathname} />
        </nav>

        {/* Right - Auth buttons and user menu */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="text-sm font-medium">{user?.email}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/register"
              className="bg-primary-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-600"
            >
              Sign Up
            </Link>
          )}

          {/* Hamburger Menu for mobile */}
          <button
            className="md:hidden text-gray-700 hover:text-primary-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
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
