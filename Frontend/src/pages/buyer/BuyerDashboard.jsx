import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import Navigation from '../../components/common/Navigation';
import ProductCard from '../../components/products/ProductCard';

const BuyerDashboard = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);
  
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);

  useEffect(() => {
    // Fetch all products
    dispatch(fetchProducts({ limit: 20 }));
    
    // Fetch categories
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      // Set featured products (first 4 products)
      setFeaturedProducts(products.slice(0, 4));
      
      // Set new arrivals (next 8 products)
      setNewArrivals(products.slice(4, 12));
    }
  }, [products]);

  useEffect(() => {
    if (categories.length > 0) {
      // Set popular categories (first 6 categories)
      setPopularCategories(categories.slice(0, 6));
    }
  }, [categories]);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome back, {user?.name || 'Shopper'}!
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Discover amazing products at unbeatable prices. Your one-stop shop for all your needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/" 
                  className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
                >
                  Browse Products
                </Link>
                <Link 
                  to="/wishlist" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  View Wishlist
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-yellow-400 rounded-full opacity-70"></div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-pink-400 rounded-full opacity-70"></div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                      alt="Shopping" 
                      className="rounded-lg object-cover h-64 w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              View All →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-3"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                      <div className="h-8 bg-gray-300 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop by Category</h2>
            <p className="text-gray-600">Browse our wide selection of products by category</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {loading ? (
              [...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-24 bg-gray-300"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              popularCategories.map((category) => (
                <Link 
                  key={category._id} 
                  to={`/?category=${category._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="w-full h-24 bg-blue-100 flex items-center justify-center">
                    <span className="text-3xl">{category.icon || '🛍️'}</span>
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* New Arrivals Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              View All →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-3"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                      <div className="h-8 bg-gray-300 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Special Offers Banner */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="p-8 md:p-12 md:w-1/2">
                <h2 className="text-3xl font-bold text-white mb-4">Special Offers</h2>
                <p className="text-purple-100 mb-6">
                  Get up to 50% off on selected items. Limited time offer, don't miss out!
                </p>
                <Link 
                  to="/" 
                  className="inline-block bg-white text-purple-700 hover:bg-purple-50 px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
                >
                  Shop Now
                </Link>
              </div>
              <div className="md:w-1/2 relative">
                <img 
                  src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2215&q=80" 
                  alt="Special Offers" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent to-purple-600/30"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Quick Access Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Access</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              to="/cart" 
              className="bg-blue-50 hover:bg-blue-100 p-6 rounded-lg flex flex-col items-center text-center transition-colors"
            >
              <span className="text-3xl mb-3">🛒</span>
              <h3 className="font-medium text-gray-900">Your Cart</h3>
              <p className="text-sm text-gray-600 mt-1">View and checkout</p>
            </Link>
            
            <Link 
              to="/orders" 
              className="bg-green-50 hover:bg-green-100 p-6 rounded-lg flex flex-col items-center text-center transition-colors"
            >
              <span className="text-3xl mb-3">📦</span>
              <h3 className="font-medium text-gray-900">Orders</h3>
              <p className="text-sm text-gray-600 mt-1">Track your orders</p>
            </Link>
            
            <Link 
              to="/wishlist" 
              className="bg-red-50 hover:bg-red-100 p-6 rounded-lg flex flex-col items-center text-center transition-colors"
            >
              <span className="text-3xl mb-3">❤️</span>
              <h3 className="font-medium text-gray-900">Wishlist</h3>
              <p className="text-sm text-gray-600 mt-1">Your saved items</p>
            </Link>
            
            <Link 
              to="/reviews/me" 
              className="bg-yellow-50 hover:bg-yellow-100 p-6 rounded-lg flex flex-col items-center text-center transition-colors"
            >
              <span className="text-3xl mb-3">⭐</span>
              <h3 className="font-medium text-gray-900">Reviews</h3>
              <p className="text-sm text-gray-600 mt-1">Your product reviews</p>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Shop</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">All Products</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">New Arrivals</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Featured</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Categories</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/orders" className="text-gray-300 hover:text-white transition-colors">Orders</Link></li>
                <li><Link to="/wishlist" className="text-gray-300 hover:text-white transition-colors">Wishlist</Link></li>
                <li><Link to="/reviews/me" className="text-gray-300 hover:text-white transition-colors">Reviews</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Returns & Refunds</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-300 mb-4">
                We provide high-quality products at affordable prices. Our mission is to make shopping easy and enjoyable.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} E-Commerce Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BuyerDashboard;