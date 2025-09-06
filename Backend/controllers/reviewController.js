import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { successResponse, sendError } from '../utils/response.js';

// POST /reviews  (create or update own review for a product)
const upsertMyReview = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);
    const { product, rating, comment } = req.body;

    if (!product || rating === undefined) return sendError(res, 'product and rating are required', 400);
    if (rating < 1 || rating > 5) return sendError(res, 'rating must be between 1 and 5', 400);

    const productDoc = await Product.findById(product);
    if (!productDoc || productDoc.is_deleted) return sendError(res, 'Product not found', 404);

    const review = await Review.findOneAndUpdate(
      { user: userId, product },
      { $set: { rating, comment, is_deleted: false } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json(successResponse('Review saved', { review }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// GET /reviews/product/:productId
const listReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId, is_deleted: false })
      .populate('user', 'name profilePicture')
      .sort({ createdAt: -1 });
    return res.status(200).json(successResponse('Reviews', { reviews }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// GET /reviews/me
const listMyReviews = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);
    const reviews = await Review.find({ user: userId, is_deleted: false })
      .populate('product', 'title images price')
      .sort({ createdAt: -1 });
    return res.status(200).json(successResponse('My reviews', { reviews }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// DELETE /reviews/:productId (delete own review on that product)
const deleteMyReview = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);
    const { productId } = req.params;

    const review = await Review.findOneAndUpdate(
      { user: userId, product: productId },
      { $set: { is_deleted: true } },
      { new: true }
    );
    if (!review) return sendError(res, 'Review not found', 404);

    return res.status(200).json(successResponse('Review deleted', { review }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// Admin: DELETE /reviews/:id
const adminDeleteReview = async (req, res) => {
  try {
    const role = req.body?.role;
    if (role !== 'admin') return sendError(res, 'Forbidden', 403);
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(id, { $set: { is_deleted: true } }, { new: true });
    if (!review) return sendError(res, 'Review not found', 404);
    return res.status(200).json(successResponse('Review deleted', { review }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export { upsertMyReview, listReviewsForProduct, listMyReviews, deleteMyReview, adminDeleteReview };
