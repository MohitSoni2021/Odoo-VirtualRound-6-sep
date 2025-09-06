import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, setSearchQuery, setSelectedCategory, setPriceRange } from '../../store/slices/productSlice';
import { fetchCategories as fetchCategoriesAction } from '../../store/slices/categorySlice';
import ProductGrid from '../../components/products/ProductGrid';
import SearchBar from '../../components/common/SearchBar';
import CategoryFilter from '../../components/common/CategoryFilter';
import Navigation from '../../components/common/Navigation';

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, loading, searchQuery, selectedCategory, priceRange } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { token } = useSelector((state) => state.auth);
  
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 10000 });

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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Search Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="space-y-6">
              <CategoryFilter />
              
              {/* Price Range Filter */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceFilter.min}
                      onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceFilter.max}
                      onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handlePriceFilterApply}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Total Products:</span>
                    <span className="font-medium">{products.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <span className="font-medium">{categories.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
              </h2>
              <p className="text-gray-600">
                {loading ? 'Loading...' : `Found ${products.length} products`}
              </p>
            </div>

            <ProductGrid products={products} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
