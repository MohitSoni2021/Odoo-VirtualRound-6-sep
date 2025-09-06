import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import { successResponse, sendError } from '../utils/response.js';

const isAdmin = (req) => req.body?.role === 'admin';

// POST /payments
const createPayment = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const { order: orderId, amount, method, transaction_id } = req.body;
    if (!orderId || amount === undefined || !method) {
      return sendError(res, 'order, amount, method are required', 400);
    }

    const order = await Order.findById(orderId);
    if (!order) return sendError(res, 'Order not found', 404);
    if (!isAdmin(req) && String(order.user) !== String(userId)) {
      return sendError(res, 'Forbidden', 403);
    }

    const payment = await Payment.create({
      order: orderId,
      user: order.user,
      amount,
      method,
      transaction_id,
    });

    return res.status(201).json(successResponse('Payment created', { payment }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// GET /payments/me
const listMyPayments = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const payments = await Payment.find({ user: userId, is_deleted: false })
      .populate('order', 'total_amount status createdAt')
      .sort({ createdAt: -1 });
    return res.status(200).json(successResponse('My payments', { payments }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// GET /payments/order/:orderId
const listPaymentsByOrder = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return sendError(res, 'Order not found', 404);
    if (!isAdmin(req) && String(order.user) !== String(userId)) {
      return sendError(res, 'Forbidden', 403);
    }

    const payments = await Payment.find({ order: orderId, is_deleted: false }).sort({ createdAt: -1 });
    return res.status(200).json(successResponse('Payments for order', { payments }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// Admin: GET /payments
const adminListPayments = async (req, res) => {
  try {
    if (!isAdmin(req)) return sendError(res, 'Forbidden', 403);

    const { user, order, status, method, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (user) filter.user = user;
    if (order) filter.order = order;
    if (status) filter.status = status;
    if (method) filter.method = method;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Payment.find(filter)
        .populate('order', 'total_amount status')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Payment.countDocuments(filter),
    ]);

    return res.status(200).json(successResponse('Payments fetched', { items, page: Number(page), limit: Number(limit), total }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PATCH /payments/:id (admin-only)
const adminUpdatePayment = async (req, res) => {
  try {
    if (!isAdmin(req)) return sendError(res, 'Forbidden', 403);

    const { id } = req.params;
    const allowed = ['status', 'transaction_id', 'amount', 'method', 'is_deleted'];
    const update = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];

    const payment = await Payment.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!payment) return sendError(res, 'Payment not found', 404);
    return res.status(200).json(successResponse('Payment updated', { payment }));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export { createPayment, listMyPayments, listPaymentsByOrder, adminListPayments, adminUpdatePayment };
