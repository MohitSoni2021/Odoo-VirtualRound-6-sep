import React from 'react';
import ProductCard from './ProductCard';

// variant: 'comfortable' | 'compact'
const ProductGrid = ({ products, loading, variant = 'comfortable' }) => {
  const gridClasses =
    variant === 'compact'
      ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';

  if (loading) {
    return (
      <div className={gridClasses}>
        {[...Array(8)].map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm animate-pulse">
            <div className="w-full h-44 bg-slate-100" />
            <div className="p-4">
              <div className="h-4 bg-slate-100 rounded mb-2" />
              <div className="h-3 bg-slate-100 rounded mb-3" />
              <div className="flex justify-between items-center">
                <div className="h-6 bg-slate-100 rounded w-16" />
                <div className="h-8 bg-slate-100 rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No products found</div>
        <p className="text-gray-400">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className={gridClasses}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
