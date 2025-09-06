import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navigation = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <HomeIcon /> },
    { path: '/cart', label: 'Cart', icon: <CartIcon />, badge: totalItems },
    { path: '/orders', label: 'Orders', icon: <OrdersIcon /> },
    { path: '/wishlist', label: 'Wishlist', icon: <WishlistIcon /> },
    { path: '/reviews/me', label: 'Reviews', icon: <ReviewsIcon /> },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' 
          : 'bg-gradient-to-r from-blue-600 to-indigo-700 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">E</span>
              </div>
              <span className={`text-xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                EcoShop
              </span>
            </Link>
            
            <div className="hidden lg:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? scrolled 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-white/20 text-white'
                      : scrolled 
                        ? 'text-gray-700 hover:bg-gray-100' 
                        : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <span className="w-5 h-5">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className={`relative ${scrolled ? 'opacity-100' : 'opacity-90'}`}>
              <input
                type="text"
                placeholder="Search products..."
                className={`w-full py-2 pl-10 pr-4 rounded-full border ${
                  scrolled 
                    ? 'border-gray-300 focus:border-blue-500' 
                    : 'border-white/30 bg-white/10 text-white placeholder-white/70 focus:bg-white/20'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
              />
              <div className="absolute left-3 top-2.5">
                <SearchIcon className={scrolled ? 'text-gray-400' : 'text-white/70'} />
              </div>
            </div>
          </div>

          {/* User Menu and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon with Badge - Mobile */}
            <Link 
              to="/cart" 
              className="relative md:hidden"
            >
              <span className={`w-6 h-6 ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                <CartIcon />
              </span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className={`hidden md:block text-sm font-medium ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                  {user?.name || 'User'}
                </div>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  scrolled ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-white/20'
                }`}>
                  <span className="text-white text-sm font-medium">{user?.name?.[0] || 'U'}</span>
                </div>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                  </div>
                  <Link 
                    to="/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/orders" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link 
                    to="/wishlist" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden focus:outline-none"
            >
              {mobileMenuOpen ? (
                <XIcon className={scrolled ? 'text-gray-900' : 'text-white'} />
              ) : (
                <MenuIcon className={scrolled ? 'text-gray-900' : 'text-white'} />
              )}
            </button>
          </div>
        </div>
        
        {/* Search Bar - Mobile */}
        <div className="mt-4 md:hidden">
          <div className={`relative ${mobileMenuOpen ? 'block' : 'hidden'}`}>
            <input
              type="text"
              placeholder="Search products..."
              className={`w-full py-2 pl-10 pr-4 rounded-full border ${
                scrolled 
                  ? 'border-gray-300 focus:border-blue-500' 
                  : 'border-white/30 bg-white/10 text-white placeholder-white/70 focus:bg-white/20'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
            />
            <div className="absolute left-3 top-2.5">
              <SearchIcon className={scrolled ? 'text-gray-400' : 'text-white/70'} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className={`px-4 pt-2 pb-4 space-y-1 ${scrolled ? 'bg-white' : 'bg-gradient-to-r from-blue-600 to-indigo-700'}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? scrolled 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-white/20 text-white'
                  : scrolled 
                    ? 'text-gray-700 hover:bg-gray-100' 
                    : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

// SVG Icons
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const OrdersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const WishlistIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ReviewsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const SearchIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MenuIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default Navigation;
