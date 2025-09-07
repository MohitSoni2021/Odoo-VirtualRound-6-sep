import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist as addToWishlistAction, removeFromWishlist as removeFromWishlistAction } from '../../store/slices/wishlistSlice';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isInWishlist = wishlistItems.some((item) => item.product._id === product._id);

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
  const condition = product.details?.condition || product.status || 'used';
  const inStock = (product?.stock_quantity ?? 0) > 0;

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      <div className="relative">
        <Link to={`/products/${product._id}`} className="block">
          <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden">
            <img
              src={product.images?.[0]?.url || '/placeholder-product.jpg'}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
          </div>
        </Link>

        {/* Wishlist */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 px-2.5 py-2 rounded-full border text-sm font-medium shadow-sm transition ${
            isInWishlist
              ? 'bg-rose-600 border-rose-600 text-white hover:bg-rose-700'
              : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
          }`}
          aria-label="Toggle wishlist"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Status/Condition badge */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur border border-slate-200 text-slate-700">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {String(condition).toUpperCase()}
        </span>
      </div>

      <div className="p-4">
        <Link to={`/products/${product._id}`} className="block">
          <h3 className="text-base font-semibold text-slate-900 mb-1.5 line-clamp-2 group-hover:text-slate-700 transition-colors">
            {product.title}
          </h3>
        </Link>
        {product.description && (
          <p className="text-slate-500 text-sm mb-3 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-extrabold text-slate-900">${price}</div>
            {product.originalPrice && (
              <div className="text-xs text-slate-400 line-through">${product.originalPrice}</div>
            )}
          </div>
          <span className={`text-xs px-2 py-1 rounded-full border ${
            inStock ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {inStock ? 'In stock' : 'Out of stock'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Category: {product.category?.name || '—'}</span>
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              inStock
                ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 shadow-sm'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;