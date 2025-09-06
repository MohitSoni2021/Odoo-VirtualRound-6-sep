import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { successResponse, sendError } from '../utils/response.js';

// Ensure cart exists for a user
const ensureCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// GET /carts/me
const getMyCart = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const cart = await ensureCart(userId);
    await cart.populate({ path: 'items.product', select: 'title price images status is_deleted' });
    return res.status(200).json(successResponse('Cart fetched', { cart }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// POST /carts/me/items
const addItemToMyCart = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);
    const { product, quantity } = req.body;
    if (!product || !quantity) return sendError(res, 'product and quantity are required', 400);

    const productDoc = await Product.findById(product);
    if (!productDoc || productDoc.is_deleted) return sendError(res, 'Product not found', 404);
    if (quantity < 1) return sendError(res, 'Quantity must be at least 1', 400);

    const cart = await ensureCart(userId);
    const idx = cart.items.findIndex((i) => String(i.product) === String(product));
    if (idx >= 0) {
      cart.items[idx].quantity += Number(quantity);
    } else {
      cart.items.push({ product, quantity: Number(quantity) });
    }
    await cart.save();
    await cart.populate({ path: 'items.product', select: 'title price images status is_deleted' });
    return res.status(200).json(successResponse('Item added to cart', { cart }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PATCH /carts/me/items/:productId
const updateMyCartItemQty = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);
    const { productId } = req.params;
    const { quantity } = req.body;
    if (quantity === undefined) return sendError(res, 'quantity is required', 400);
    if (quantity < 1) return sendError(res, 'Quantity must be at least 1', 400);

    const cart = await ensureCart(userId);
    const idx = cart.items.findIndex((i) => String(i.product) === String(productId));
    if (idx === -1) return sendError(res, 'Item not found in cart', 404);

    cart.items[idx].quantity = Number(quantity);
    await cart.save();
    await cart.populate({ path: 'items.product', select: 'title price images status is_deleted' });
    return res.status(200).json(successResponse('Cart item updated', { cart }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// DELETE /carts/me/items/:productId
const removeMyCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);
    const { productId } = req.params;

    const cart = await ensureCart(userId);
    const before = cart.items.length;
    cart.items = cart.items.filter((i) => String(i.product) !== String(productId));
    if (cart.items.length === before) return sendError(res, 'Item not found in cart', 404);

    await cart.save();
    await cart.populate({ path: 'items.product', select: 'title price images status is_deleted' });
    return res.status(200).json(successResponse('Item removed from cart', { cart }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// DELETE /carts/me
const clearMyCart = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const cart = await ensureCart(userId);
    cart.items = [];
    await cart.save();
    return res.status(200).json(successResponse('Cart cleared', { cart }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// Admin: GET /carts/user/:userId
const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await ensureCart(userId);
    await cart.populate({ path: 'items.product', select: 'title price images status is_deleted' });
    return res.status(200).json(successResponse('Cart fetched', { cart }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export { getMyCart, addItemToMyCart, updateMyCartItemQty, removeMyCartItem, clearMyCart, getCartByUserId };
