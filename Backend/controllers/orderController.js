import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { successResponse, sendError } from '../utils/response.js';

const isOwnerOrAdmin = (req, order) => {
  const userId = String(req.userId || '');
  const role = req.body?.role;
  return role === 'admin' || (order?.user && String(order.user) === userId);
};

// POST /orders
const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const { items, addresses } = req.body;
    if (!Array.isArray(items) || items.length === 0) return sendError(res, 'items are required', 400);

    // Validate products and compute total
    let total = 0;
    for (const it of items) {
      if (!it.product || !it.quantity || it.price === undefined) {
        return sendError(res, 'Each item requires product, quantity, price', 400);
      }
      const prod = await Product.findById(it.product);
      if (!prod || prod.is_deleted) return sendError(res, 'One or more products not found', 404);
      if (it.quantity < 1) return sendError(res, 'Invalid quantity', 400);
      if (it.price < 0) return sendError(res, 'Invalid price', 400);
      total += Number(it.price) * Number(it.quantity);
    }

    const order = await Order.create({
      user: userId,
      items: items.map((i) => ({ product: i.product, quantity: i.quantity, price: i.price })),
      total_amount: total,
      addresses: Array.isArray(addresses) ? addresses : [],
    });

    return res.status(201).json(successResponse('Order created', { order }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// GET /orders/me
const listMyOrders = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const orders = await Order.find({ user: userId, is_deleted: false })
      .populate('items.product', 'title price images')
      .sort({ createdAt: -1 });
    return res.status(200).json(successResponse('My orders', { orders }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// GET /orders/:id
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('items.product', 'title price images');
    if (!order) return sendError(res, 'Order not found', 404);

    if (!isOwnerOrAdmin(req, order)) return sendError(res, 'Forbidden', 403);

    return res.status(200).json(successResponse('Order fetched', { order }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// Admin: GET /orders
const adminListOrders = async (req, res) => {
  try {
    const role = req.body?.role;
    if (role !== 'admin') return sendError(res, 'Forbidden', 403);

    const { user, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (user) filter.user = user;
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Order.find(filter)
        .populate('items.product', 'title price images')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    return res.status(200).json(successResponse('Orders fetched', { items, page: Number(page), limit: Number(limit), total }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PATCH /orders/:id/status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const role = req.body?.role;
    if (role !== 'admin') return sendError(res, 'Forbidden', 403);

    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['pending', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) return sendError(res, 'Invalid status', 400);

    const order = await Order.findByIdAndUpdate(id, { $set: { status } }, { new: true });
    if (!order) return sendError(res, 'Order not found', 404);
    return res.status(200).json(successResponse('Order status updated', { order }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// POST /orders/:id/cancel (owner)
const cancelMyOrder = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return sendError(res, 'Order not found', 404);
    if (String(order.user) !== String(userId)) return sendError(res, 'Forbidden', 403);

    if (order.status === 'delivered') return sendError(res, 'Delivered orders cannot be cancelled', 400);
    order.status = 'cancelled';
    await order.save();
    return res.status(200).json(successResponse('Order cancelled', { order }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export { createOrder, listMyOrders, getOrderById, adminListOrders, updateOrderStatus, cancelMyOrder };
