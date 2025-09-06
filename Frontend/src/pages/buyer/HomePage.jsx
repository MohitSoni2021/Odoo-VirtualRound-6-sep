import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, setSearchQuery, setSelectedCategory, setPriceRange } from '../../store/slices/productSlice';
import { fetchCategories as fetchCategoriesAction } from '../../store/slices/categorySlice';
import ProductGrid from '../../components/products/ProductGrid';
import ProductCard from '../../components/products/ProductCard';
import SearchBar from '../../components/common/SearchBar';
import CategoryFilter from '../../components/common/CategoryFilter';
import Navigation from '../../components/common/Navigation';
import { Link } from 'react-router-dom';
import { dummyProducts, featuredDummyProducts } from '../../../secreted/dummyData';

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, loading, searchQuery, selectedCategory, priceRange } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { token } = useSelector((state) => state.auth);
  
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 10000 });

  // Derived collections with fallback to dummy data
  const sourceProducts = products && products.length ? products : dummyProducts;
  const featuredProducts = (products && products.length ? products : featuredDummyProducts).slice(0, 4);
  const newArrivals = sourceProducts.slice(0, 8);
  // Exclusive: showcase top-priced items as exclusive picks
  const exclusiveProducts = [...sourceProducts]
    .sort((a, b) => (b.price || 0) - (a.price || 0))
    .slice(0, 8);
  const popularCategories = categories.slice(0, 8);

  useEffect(() => {
    // Fetch categories on component mount
    dispatch(fetchCategoriesAction());
  }, [dispatch]);

  useEffect(() => {
    // Fetch products when filters change
    const queryParams = {
      q: searchQuery,
      category: selectedCategory,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      page: 1,
      limit: 20
    };
    
    dispatch(fetchProducts(queryParams));
  }, [dispatch, searchQuery, selectedCategory, priceRange]);

  const handleSearch = (query) => {
    dispatch(setSearchQuery(query));
  };

  const handlePriceRangeChange = (field, value) => {
    const newRange = { ...priceFilter, [field]: parseInt(value) || 0 };
    setPriceFilter(newRange);
    dispatch(setPriceRange(newRange));
  };

  const handlePriceFilterApply = () => {
    dispatch(setPriceRange(priceFilter));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Find your next favorite product</h1>
              <p className="text-blue-100 mb-6">Smart filters, curated picks, and fresh arrivals—tailored for you.</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/" className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-3 rounded-lg font-medium transition-colors shadow-md">Browse All</Link>
                <Link to="/wishlist" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 px-5 py-3 rounded-lg font-medium transition-colors">Wishlist</Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-yellow-400 rounded-full opacity-70"></div>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-pink-400 rounded-full opacity-70"></div>
                <div className="bg-white/10 backdrop-blur p-6 rounded-xl shadow-lg border border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    {featuredProducts.map(p => (
                      <div key={p._id} className="bg-white/90 rounded-lg p-3 shadow-sm">
                        <ProductCard product={p} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inline Search */}
          <div className="mt-10">
            <div className="max-w-3xl">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-10 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <span className="text-sm text-gray-500">{categories.length} categories</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {popularCategories.map((category) => (
              <Link key={category._id} to={`/?category=${category._id}`} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-full h-20 bg-blue-50 flex items-center justify-center">
                  <span className="text-2xl">{category.icon || '🛍️'}</span>
                </div>
                <div className="p-2 text-center">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Category */}
      <section className="py-10 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Exclusive</h2>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {exclusiveProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Filter + All Products */}
      <section className="py-10 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1 space-y-6">
              <CategoryFilter />
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input type="number" placeholder="Min" value={priceFilter.min} onChange={(e) => handlePriceRangeChange('min', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="number" placeholder="Max" value={priceFilter.max} onChange={(e) => handlePriceRangeChange('max', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <button onClick={handlePriceFilterApply} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">Apply Filter</button>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between"><span>Total Products:</span><span className="font-medium">{products.length}</span></div>
                  <div className="flex justify-between"><span>Categories:</span><span className="font-medium">{categories.length}</span></div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}</h2>
                <p className="text-gray-600">{loading ? 'Loading...' : `Found ${sourceProducts.length} products`}</p>
              </div>
              <ProductGrid products={sourceProducts} loading={loading} />
            </main>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-10 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="p-8 md:p-12 md:w-1/2">
                <h2 className="text-3xl font-bold text-white mb-4">Special Offers</h2>
                <p className="text-purple-100 mb-6">Get up to 50% off on selected items. Limited time offer!</p>
                <Link to="/" className="inline-block bg-white text-purple-700 hover:bg-purple-50 px-6 py-3 rounded-lg font-medium transition-colors shadow-md">Shop Now</Link>
              </div>
              <div className="md:w-1/2 relative">
                <img src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=2215&q=80" alt="Special Offers" className="w-full h-full object-cover" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent to-purple-600/30"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
