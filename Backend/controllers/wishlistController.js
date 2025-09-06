import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { successResponse, sendError } from '../utils/response.js';

// POST /wishlists
const addToWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const { product } = req.body;
    if (!product) return sendError(res, 'product is required', 400);

    const productDoc = await Product.findById(product);
    if (!productDoc || productDoc.is_deleted) return sendError(res, 'Product not found', 404);

    // Try find existing (including soft-deleted)
    let wl = await Wishlist.findOne({ user: userId, product });
    if (wl) {
      if (wl.is_deleted) {
        wl.is_deleted = false;
        await wl.save();
      }
    } else {
      wl = await Wishlist.create({ user: userId, product });
    }

    return res.status(201).json(successResponse('Added to wishlist', { wishlist: wl }));
  } catch (err) {
    // handle duplicate key race
    if (err.code === 11000) {
      return sendError(res, 'Already in wishlist', 400);
    }
    return sendError(res, err.message, 500);
  }
};

// GET /wishlists/me
const listMyWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const items = await Wishlist.find({ user: userId, is_deleted: false })
      .populate('product', 'title price images status')
      .sort({ createdAt: -1 });
    return res.status(200).json(successResponse('My wishlist', { items }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// DELETE /wishlists/:productId
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);
    const { productId } = req.params;

    const wl = await Wishlist.findOneAndUpdate(
      { user: userId, product: productId },
      { $set: { is_deleted: true } },
      { new: true }
    );
    if (!wl) return sendError(res, 'Item not found in wishlist', 404);

    return res.status(200).json(successResponse('Removed from wishlist', { wishlist: wl }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export { addToWishlist, listMyWishlist, removeFromWishlist };
