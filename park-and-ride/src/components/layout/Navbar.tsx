import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FiMenu, FiX, FiUser, FiMapPin } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    try {
      const user = localStorage.getItem('parkAndRideUser');
      setIsLoggedIn(!!user);
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    // Close menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    
    // Don't redirect to dashboard if clicking Home while already on home page
    if (path === '/' && router.pathname === '/') {
      return; // Already on home page, do nothing
    }
    
    // Use direct navigation for consistent behavior
    window.location.href = path;
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Book Parking', path: '/book-parking' },
    { name: 'Book Ride', path: '/book-ride' },
    { name: 'Live Tracking', path: '/tracking' },
    { name: 'Pricing', path: '/pricing' },
  ];

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={() => handleNavigation('/')}
              className="flex-shrink-0 flex items-center"
            >
              <div className="relative h-8 w-8 mr-2">
                <div className="absolute inset-0 bg-primary-600 rounded-full flex items-center justify-center">
                  <FiMapPin className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">Park&Ride</span>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => handleNavigation(isLoggedIn ? '/dashboard' : '/simple-login')}
              className="ml-2 btn-primary flex items-center"
            >
              <FiUser className="mr-1" />
              <span>{isLoggedIn ? 'My Account' : 'Sign In'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => handleNavigation(isLoggedIn ? '/dashboard' : '/simple-login')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              {isLoggedIn ? 'My Account' : 'Sign In'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 