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
      // Redirect to login
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.images?.[0]?.url || '/placeholder-product.jpg'}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isInWishlist 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-600 hover:bg-red-50'
          } transition-colors duration-200`}
        >
          <svg className="w-5 h-5" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        <Link to={`/products/${product._id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-green-600">
            ${product.price}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {product.stock_quantity}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 capitalize">
            {product.status}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              product.stock_quantity === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
