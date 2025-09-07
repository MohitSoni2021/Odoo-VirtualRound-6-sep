import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearCurrentProduct } from '../../store/slices/productSlice';
import { fetchProductReviews, createReview } from '../../store/slices/reviewSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import Navigation from '../../components/common/Navigation';
import { dummyProducts } from '../../../secreted/dummyData';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct, products: listProducts, loading } = useSelector((state) => state.products);
  const { productReviews, myReviews } = useSelector((state) => state.reviews);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { token } = useSelector((state) => state.auth);

  // Local UI state
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Prefer API product, then Redux list (if user navigated from listing), then dummy data
  const product = useMemo(() => {
    return (
      currentProduct ||
      listProducts?.find((p) => String(p._id) === String(id)) ||
      dummyProducts.find((p) => String(p._id) === String(id)) ||
      null
    );
  }, [currentProduct, listProducts, id]);

  const productImages = product?.images?.length ? product.images : [{ url: '/placeholder-product.jpg' }];

  const isInWishlist = wishlistItems.some((item) => item.product._id === id);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchProductReviews(id));
    }

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(addToCart({ productId: id, quantity, token }));
  };

  const handleWishlistToggle = () => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist({ productId: id, token }));
    } else {
      dispatch(addToWishlist({ productId: id, token }));
    }
  };

  const handleSubmitReview = () => {
    if (!token) {
      navigate('/login');
      return;
    }

    const reviewData = {
      product: id,
      rating,
      comment: reviewText,
    };

    dispatch(createReview({ reviewData, token }));
    setReviewText('');
    setShowReviewForm(false);
  };

  // FIX: avoid undefined access
  const existingReview = (myReviews || []).find((r) => r && r.product && String(r.product._id) === String(id));

  // Derived UI data
  const averageRating = useMemo(() => {
    if (!productReviews || productReviews.length === 0) return 0;
    const sum = productReviews.reduce((s, r) => s + (r.rating || 0), 0);
    return Math.round((sum / productReviews.length) * 10) / 10; // 1 decimal
  }, [productReviews]);

  const ratingStars = (value) => {
    const full = Math.round(value);
    return (
      <div className="flex items-center text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < full ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  // Loading state — modern skeleton
  if (loading && !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="w-full h-[460px] rounded-2xl bg-gray-200 animate-pulse" />
              <div className="grid grid-cols-5 gap-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 rounded-xl bg-gray-200 animate-pulse" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-10 w-2/3 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-8 w-40 bg-gray-200 rounded-md animate-pulse" />
              <div className="h-24 w-full bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Product not found</h2>
          <p className="text-slate-600 mb-6">It may have been moved or is temporarily unavailable.</p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const inStock = (product?.stock_quantity ?? 0) > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      {/* Top container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="text-sm text-slate-500 mb-6 flex items-center gap-2">
          <button onClick={() => navigate('/')} className="hover:text-slate-800">Home</button>
          <span>/</span>
          <span className="text-slate-800 line-clamp-1">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image gallery */}
          <div className="lg:sticky lg:top-20 self-start">
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200">
              <img
                src={productImages[activeImageIndex]?.url}
                alt={product.title}
                className="w-full h-[480px] object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
              {/* subtle gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
            </div>

            {productImages.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {productImages.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`rounded-xl overflow-hidden border transition-all ${
                      activeImageIndex === idx ? 'border-slate-900' : 'border-slate-200 hover:border-slate-400'
                    }`}
                    aria-label={`Select image ${idx + 1}`}
                  >
                    <img src={image.url} alt={`${product.title} ${idx + 1}`} className="h-20 w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title, rating, meta */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">{product.title}</h1>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  {ratingStars(averageRating)}
                  <span className="text-sm text-slate-600">{averageRating} • {productReviews.length} reviews</span>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                    inStock
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Price card */}
            <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
              <div className="flex items-end gap-3">
                <p className="text-3xl font-extrabold text-slate-900">${product.price}</p>
                {product.status && (
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-900 text-white">{product.status}</span>
                )}
              </div>
              {product.description && (
                <p className="text-slate-600 mt-3 leading-relaxed">{product.description}</p>
              )}

              {/* Actions */}
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden w-full sm:w-auto">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-700 hover:bg-slate-50"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-5 py-2 border-x border-slate-300 text-slate-900 min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity || 1, quantity + 1))}
                    className="px-3 py-2 text-slate-700 hover:bg-slate-50"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`flex-1 inline-flex justify-center items-center gap-2 px-6 py-3 rounded-lg font-medium shadow-sm transition ${
                    inStock
                      ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M2.25 3a.75.75 0 000 1.5h1.386a.75.75 0 01.728.546l2.496 8.737a2.25 2.25 0 002.159 1.667h7.598a2.25 2.25 0 002.16-1.667l1.41-5.06a.75.75 0 00-.728-.933H7.162" />
                    <path d="M9 20.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.25 20.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className={`inline-flex justify-center items-center gap-2 px-5 py-3 rounded-lg font-medium border transition ${
                    isInWishlist
                      ? 'bg-rose-600 border-rose-600 text-white hover:bg-rose-700'
                      : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 3 13.12 3 10.5 3 8.015 5.015 6 7.5 6c1.364 0 2.682.56 3.645 1.545A5.144 5.144 0 0114.79 6C17.275 6 19.29 8.015 19.29 10.5c0 2.62-1.688 4.86-3.989 7.007a25.18 25.18 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.003-.003.001-.002.001a.75.75 0 01-.67 0l-.002-.001-.003-.001z" />
                  </svg>
                  {isInWishlist ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
              </div>

              {/* Quick assurances */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-700">Buyer protection</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-slate-700">Fast shipping</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-slate-700">Easy returns</span>
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Product Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between rounded-lg border border-slate-200 p-3">
                  <span className="text-slate-600">Status</span>
                  <span className="font-medium capitalize text-slate-900">{product.status || '—'}</span>
                </div>
                <div className="flex justify-between rounded-lg border border-slate-200 p-3">
                  <span className="text-slate-600">Stock</span>
                  <span className="font-medium text-slate-900">{product.stock_quantity}</span>
                </div>
                <div className="flex justify-between rounded-lg border border-slate-200 p-3">
                  <span className="text-slate-600">Condition</span>
                  <span className="font-medium capitalize text-slate-900">{product.details?.condition || '—'}</span>
                </div>
                <div className="flex justify-between rounded-lg border border-slate-200 p-3">
                  <span className="text-slate-600">Brand</span>
                  <span className="font-medium text-slate-900">{product.details?.brand || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">Reviews</h2>
              <div className="flex items-center gap-2 text-sm">
                {ratingStars(averageRating)}
                <span className="text-slate-600">{averageRating} average • {productReviews.length} total</span>
              </div>
            </div>

            {token && !existingReview && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                {showReviewForm ? 'Cancel' : 'Write a review'}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Share your thoughts</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        aria-label={`Rate ${star} star`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Comment</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/30"
                    placeholder="What did you like or dislike?"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmitReview}
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
                  >
                    Submit Review
                  </button>
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {productReviews.length === 0 ? (
              <p className="text-slate-500 text-center py-10">No reviews yet. Be the first to review!</p>
            ) : (
              productReviews.map((review) => (
                <div key={review._id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-medium">
                        {review.user?.name?.[0] || 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 leading-none">{review.user?.name || 'Anonymous'}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{new Date(review.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                      ))}
                    </div>
                  </div>
                  {review.comment && <p className="text-slate-700 mt-2 leading-relaxed">{review.comment}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;