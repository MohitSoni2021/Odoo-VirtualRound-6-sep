import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist as addToWishlistAction, removeFromWishlist as removeFromWishlistAction } from '../../store/slices/wishlistSlice';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isInWishlist = wishlistItems.some(item => item.product._id === product._id);

  const handleAddToCart = () => {
    if (token) {
      dispatch(addToCart({ productId: product._id, quantity: 1, token }));
    } else {
      window.location.href = '/login';
    }
  };

  const handleWishlistToggle = () => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    if (isInWishlist) {
      dispatch(removeFromWishlistAction({ productId: product._id, token }));
    } else {
      dispatch(addToWishlistAction({ productId: product._id, token }));
    }
  };

  const price = product.price ?? 0;
  const condition = product.condition || product.status || 'used';

  return (
    <div className="group bg-white rounded-2xl shadow-sm ring-1 ring-gray-200/70 overflow-hidden hover:shadow-xl hover:ring-gray-300 transition-all duration-200">
      <div className="relative">
        <div className="aspect-[4/3] w-full bg-gray-100">
          <img
            src={product.images?.[0]?.url || '/placeholder-product.jpg'}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-sm ${
            isInWishlist
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-700 hover:bg-red-50'
          } transition-colors`}
          aria-label="Toggle wishlist"
        >
          <svg className="w-5 h-5" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Condition badge */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur border border-gray-200 text-gray-700">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {String(condition).toUpperCase()}
        </span>
      </div>

      <div className="p-4">
        <Link to={`/products/${product._id}`} className="block">
          <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold text-emerald-600">${price}</div>
            {product.originalPrice && (
              <div className="text-xs text-gray-400 line-through">${product.originalPrice}</div>
            )}
          </div>
          <span className="text-xs text-gray-500">Stock: {product.stock_quantity}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Category: {product.category?.name || '—'}</span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              product.stock_quantity === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
