import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setSearchQuery, setSelectedCategory, setPriceRange } from '../../store/slices/productSlice';
import { fetchCategories as fetchCategoriesAction } from '../../store/slices/categorySlice';
import ProductGrid from '../../components/products/ProductGrid';
import SearchBar from '../../components/common/SearchBar';
import Navigation from '../../components/common/Navigation';
import FilterModal from '../../components/common/FilterModal';
import { dummyProducts } from '../../../secreted/dummyData';

const DEFAULT_PRICE = { min: 0, max: 10000 };

const sortingOptions = [
  { value: 'relevance', label: 'Sort by: Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Arrivals' },
];

const viewOptions = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, loading, searchQuery, selectedCategory, priceRange } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('relevance');
  const [view, setView] = useState('comfortable');

  // Temp filter state for modal
  const [tempPriceRange, setTempPriceRange] = useState(DEFAULT_PRICE);
  const [tempSelectedCategory, setTempSelectedCategory] = useState('');

  // Derived data and fallbacks
  const sourceProducts = useMemo(() => (products && products.length ? products : dummyProducts), [products]);
  const categoryMap = useMemo(() => Object.fromEntries(categories.map(c => [c._id, c.name])), [categories]);

  // Locally sorted products (backend may ignore sort param)
  const displayedProducts = useMemo(() => {
    const arr = [...sourceProducts];
    if (sortOption === 'price_asc') return arr.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortOption === 'price_desc') return arr.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortOption === 'newest') return arr.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return arr;
  }, [sourceProducts, sortOption]);

  // Init categories on mount
  useEffect(() => { dispatch(fetchCategoriesAction()); }, [dispatch]);

  // Sync temp filters when opening modal
  useEffect(() => {
    if (showFilters) {
      setTempPriceRange(priceRange || DEFAULT_PRICE);
      setTempSelectedCategory(selectedCategory || '');
    }
  }, [showFilters, priceRange, selectedCategory]);

  // Fetch products whenever query or filters/sort change
  useEffect(() => {
    const queryParams = {
      q: searchQuery,
      category: selectedCategory,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      sort: sortOption,
      page: 1,
      limit: 20,
    };
    dispatch(fetchProducts(queryParams));
  }, [dispatch, searchQuery, selectedCategory, priceRange, sortOption]);

  // Handlers
  const handleSearch = (query) => dispatch(setSearchQuery(query));
  const handleOpenFilters = () => setShowFilters(true);
  const handleCloseFilters = () => setShowFilters(false);
  const handleApplyFilters = () => {
    dispatch(setSelectedCategory(tempSelectedCategory));
    dispatch(setPriceRange({
      min: Number.isFinite(+tempPriceRange.min) ? +tempPriceRange.min : DEFAULT_PRICE.min,
      max: Number.isFinite(+tempPriceRange.max) ? +tempPriceRange.max : DEFAULT_PRICE.max,
    }));
    setShowFilters(false);
  };
  const handleResetFilters = () => {
    setTempSelectedCategory('');
    setTempPriceRange(DEFAULT_PRICE);
    dispatch(setSelectedCategory(''));
    dispatch(setPriceRange(DEFAULT_PRICE));
  };

  const activeFilters = [
    selectedCategory ? { type: 'category', label: categoryMap[selectedCategory] || 'Category' } : null,
    (priceRange.min !== DEFAULT_PRICE.min || priceRange.max !== DEFAULT_PRICE.max)
      ? { type: 'price', label: `$${priceRange.min} - $${priceRange.max}` }
      : null,
  ].filter(Boolean);
  const clearSingleFilter = (type) => {
    if (type === 'category') dispatch(setSelectedCategory(''));
    if (type === 'price') dispatch(setPriceRange(DEFAULT_PRICE));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-16">
      <Navigation />

      {/* Hero - macOS glassmorphism style */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-100/40 via-transparent to-transparent">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-sky-300/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-28 -right-28 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-10 w-60 h-60 bg-fuchsia-300/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Glass panel */}
          <div className="relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_10px_40px_rgba(31,38,135,0.2)] overflow-hidden">
            {/* subtle top highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            {/* gradient edge glow */}
            <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-white/10 via-white/0 to-white/10 pointer-events-none" />

            <div className="relative grid md:grid-cols-2 gap-8 p-6 md:p-10">
              {/* Left: text + search + quick actions */}
              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-xs text-gray-800 w-max mb-4 backdrop-blur">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  Curated second-hand marketplace
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
                  Discover pre-loved products in style
                </h1>
                <p className="text-slate-700/90 mt-3 md:mt-4 max-w-xl">
                  A refined buying experience with glassy UI, smart filters, and great deals.
                </p>

                {/* Search in-glass */}
                <div className="mt-6 md:mt-8 md:max-w-lg">
                  <div className="rounded-xl bg-white/60 backdrop-blur border border-white/70 p-1.5 shadow-inner">
                    <SearchBar onSearch={handleSearch} />
                  </div>
                </div>

                {/* Quick actions */}
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={handleOpenFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/40 hover:bg-white/60 text-slate-800 border border-white/60 backdrop-blur transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3 5.25A.75.75 0 013.75 4.5h16.5a.75.75 0 01.53 1.28l-6.19 6.188a1.5 1.5 0 00-.44 1.061v4.733a.75.75 0 01-1.072.67l-3-1.5a.75.75 0 01-.428-.67v-3.233a1.5 1.5 0 00-.439-1.061L3.22 5.78A.75.75 0 013 5.25z" clipRule="evenodd"/></svg>
                    Filters
                  </button>
                  <button
                    onClick={() => setSortOption('newest')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/40 hover:bg-white/60 text-slate-800 border border-white/60 backdrop-blur transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h13.5M3 9h9.75M3 13.5h6M3 18h2.25M16.5 16.5l3 3m0 0l3-3m-3 3v-12" /></svg>
                    Newest
                  </button>
                </div>

                {/* Category chips preview */}
                {categories.length > 0 && (
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {categories.slice(0, 10).map((c) => (
                      <button
                        key={c._id}
                        onClick={() => dispatch(setSelectedCategory(c._id))}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors backdrop-blur ${
                          selectedCategory === c._id
                            ? 'bg-sky-600/90 text-white border-sky-600'
                            : 'bg-white/50 text-slate-800 border-white/70 hover:bg-white/70'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: decorative preview grid */}
              <div className="relative hidden md:block">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/30 rounded-full blur-xl" />
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-2xl border border-white/30 bg-white/40 backdrop-blur p-3 shadow-sm">
                      <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-slate-200/70 to-white/60" />
                      <div className="mt-3 h-2.5 w-3/4 rounded-full bg-white/70" />
                      <div className="mt-2 h-2 w-1/2 rounded-full bg-white/60" />
                      <div className="mt-3 h-6 w-16 rounded-md bg-white/80" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controls Bar */}
      <section className="bg-white/70 backdrop-blur sticky top-16 z-30 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-600">
              {loading ? 'Loading products…' : `Found ${displayedProducts.length} products`}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenFilters}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18M5.25 9h13.5M8.25 13.5h7.5M10.5 18h3" />
                </svg>
                Filters
              </button>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              >
                {sortingOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                value={view}
                onChange={(e) => setView(e.target.value)}
                className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              >
                {viewOptions.map(v => (
                  <option key={v.value} value={v.value}>{`View: ${v.label}`}</option>
                ))}
              </select>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {activeFilters.map((f, idx) => (
                <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 text-blue-700 border border-white/80 backdrop-blur text-sm shadow-sm">
                  {f.label}
                  <button onClick={() => clearSingleFilter(f.type)} className="rounded-full hover:bg-white/80 p-1" aria-label={`Clear ${f.type} filter`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1.707-10.293a1 1 0 10-1.414-1.414L10 8.586 8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
              <button onClick={handleResetFilters} className="ml-1 text-sm text-gray-700 hover:text-gray-900 underline">Clear all</button>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductGrid products={displayedProducts} loading={loading} variant={view} />
        </div>
      </section>

      {/* Filters Modal */}
      <FilterModal
        isOpen={showFilters}
        onClose={handleCloseFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        title="Filter products"
      >
        {/* Category */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Category</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className={`flex items-center gap-2 p-2 rounded-md border ${tempSelectedCategory === '' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input type="radio" name="category" value="" checked={tempSelectedCategory === ''} onChange={() => setTempSelectedCategory('')} />
              <span>All Categories</span>
            </label>
            {categories.map(cat => (
              <label key={cat._id} className={`flex items-center gap-2 p-2 rounded-md border ${tempSelectedCategory === cat._id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="category" value={cat._id} checked={tempSelectedCategory === cat._id} onChange={() => setTempSelectedCategory(cat._id)} />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Price range</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min</label>
              <input type="number" value={tempPriceRange.min} min={0} onChange={(e) => setTempPriceRange(pr => ({ ...pr, min: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max</label>
              <input type="number" value={tempPriceRange.max} min={0} onChange={(e) => setTempPriceRange(pr => ({ ...pr, max: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="10000" />
            </div>
          </div>
        </div>
      </FilterModal>
    </div>
  );
};

export default HomePage;